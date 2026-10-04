import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PortfolioItem, ServiceItem, Testimonial, CartItem, SiteConfig } from '../types';
import { initialProducts, initialPortfolio, initialServices, initialTestimonials, initialSiteConfig } from '../data/initialData';
import { hashPasswordAsync, appendSecurityLog, validateAgainstSqlInjection, validateAdminUsername } from '../utils/security';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
  safeSessionStorageGet,
  safeSessionStorageSet,
  safeSessionStorageRemove
} from '../utils/storage';

interface AdminCredentials {
  username: string;
  passwordHash: string;
}

interface DataContextType {
  // Navigation View
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;

  // Admin Auth State
  isAdminLoggedIn: boolean;
  adminUsername: string;
  loginAdmin: (usernameInput: string, passwordInput: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  changeAdminCredentials: (newUsername: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  failedLoginAttempts: number;
  lockoutUntil: number | null;

  // Site Data & CRUD
  siteConfig: SiteConfig;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  portfolio: PortfolioItem[];
  addPortfolio: (item: Omit<PortfolioItem, 'id'>) => void;
  updatePortfolio: (id: string, item: Partial<PortfolioItem>) => void;
  deletePortfolio: (id: string) => void;
  services: ServiceItem[];
  addService: (item: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, item: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  testimonials: Testimonial[];
  addTestimonial: (item: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQty: (productId: string, size: string, color: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProductModal: Product | null;
  setSelectedProductModal: (prod: Product | null) => void;
  selectedPortfolioModal: PortfolioItem | null;
  setSelectedPortfolioModal: (item: PortfolioItem | null) => void;
  resetToDefaultData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Routing View: listen to URL hash #admin or state
  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.includes('admin') ? 'admin' : 'store';
    }
    return 'store';
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return safeSessionStorageGet('sdg_admin_session') === 'active';
  });

  const [adminUsername, setAdminUsername] = useState<string>(() => {
    return safeSessionStorageGet('sdg_admin_user') || 'admin';
  });

  const [failedLoginAttempts, setFailedLoginAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('admin')) {
        setCurrentView('admin');
      } else if (currentView === 'admin' && !window.location.hash.includes('admin')) {
        setCurrentView('store');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const handleSetCurrentView = (view: 'store' | 'admin') => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = '#/admin';
    } else {
      window.location.hash = '';
    }
  };

  // Initialize Default Admin Credentials in localStorage if not set
  useEffect(() => {
    const initCredentials = async () => {
      const newPassword = 'stigma089sdg';
      const defaultHash = await hashPasswordAsync(newPassword);
      const defaultCreds: AdminCredentials = {
        username: 'admin',
        passwordHash: defaultHash
      };
      safeLocalStorageSet('sdg_admin_auth', JSON.stringify(defaultCreds));
      // Also reset any lockout on page reload/init for user convenience
      safeLocalStorageRemove('sdg_admin_lockout');
    };
    initCredentials();
  }, []);

  // Admin Login with SQL Injection & Brute Force Defense
  const loginAdmin = async (usernameInput: string, passwordInput: string): Promise<{ success: boolean; message: string }> => {
    // 1. Check if locked out
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      return {
        success: false,
        message: `Terlalu banyak percobaan gagal. Akses dikunci sementara selama ${remainingSeconds} detik demi keamanan.`
      };
    }

    // 2. Anti-SQL Injection Defense Layer
    const userSqliCheck = validateAgainstSqlInjection(usernameInput);
    if (!userSqliCheck.isSafe) {
      appendSecurityLog('SQLI_BLOCKED', `Serangan SQL Injection diblokir pada field username: "${usernameInput.slice(0, 30)}..."`, 'DANGER');
      return {
        success: false,
        message: `Akses ditolak: ${userSqliCheck.reason}`
      };
    }

    const passSqliCheck = validateAgainstSqlInjection(passwordInput);
    if (!passSqliCheck.isSafe) {
      appendSecurityLog('SQLI_BLOCKED', `Serangan SQL Injection diblokir pada field password`, 'DANGER');
      return {
        success: false,
        message: `Akses ditolak: ${passSqliCheck.reason}`
      };
    }

    // 3. Verify Credentials against Stored Hash
    const storedAuth = safeLocalStorageGet('sdg_admin_auth');
    let validUsername = 'admin';
    let validPasswordHash = '';

    if (storedAuth) {
      const parsed = JSON.parse(storedAuth) as AdminCredentials;
      validUsername = parsed.username;
      validPasswordHash = parsed.passwordHash;
    } else {
      validPasswordHash = await hashPasswordAsync('stigma089sdg');
    }

    const inputHash = await hashPasswordAsync(passwordInput.trim());

    if (usernameInput.trim() === validUsername && inputHash === validPasswordHash) {
      setIsAdminLoggedIn(true);
      setAdminUsername(validUsername);
      setFailedLoginAttempts(0);
      setLockoutUntil(null);
      safeSessionStorageSet('sdg_admin_session', 'active');
      safeSessionStorageSet('sdg_admin_user', validUsername);
      appendSecurityLog('LOGIN_SUCCESS', `Admin "${validUsername}" berhasil login ke cPanel`, 'SUCCESS');
      return { success: true, message: 'Login berhasil! Membuka cPanel SDG Industries...' };
    } else {
      const attempts = failedLoginAttempts + 1;
      setFailedLoginAttempts(attempts);
      appendSecurityLog('LOGIN_FAILED', `Percobaan login gagal untuk username: "${usernameInput}" (Percobaan ke-${attempts})`, 'WARNING');

      if (attempts >= 5) {
        const lockoutTime = Date.now() + 5 * 60 * 1000; // 5 minutes lockout
        setLockoutUntil(lockoutTime);
        return {
          success: false,
          message: '5 kali gagal login! Akun dikunci selama 5 menit untuk mencegah Brute Force.'
        };
      }

      return {
        success: false,
        message: `Username atau Password salah! Sisa percobaan: ${5 - attempts} kali.`
      };
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    safeSessionStorageRemove('sdg_admin_session');
    safeSessionStorageRemove('sdg_admin_user');
    appendSecurityLog('LOGIN_SUCCESS', `Admin logout dari sesi cPanel`, 'SUCCESS');
    handleSetCurrentView('store');
  };

  const changeAdminCredentials = async (newUsername: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const userSqliCheck = validateAgainstSqlInjection(newUsername);
    if (!userSqliCheck.isSafe) {
      return { success: false, message: userSqliCheck.reason || 'Karakter tidak diizinkan' };
    }

    const usernameValidation = validateAdminUsername(newUsername);
    if (!usernameValidation.isValid) {
      return { success: false, message: usernameValidation.message || 'Username tidak valid' };
    }

    if (!newPassword || newPassword.length < 8) {
      return { success: false, message: 'Password minimal 8 karakter demi keamanan.' };
    }

    const newHash = await hashPasswordAsync(newPassword);
    const updatedCreds: AdminCredentials = {
      username: newUsername.trim(),
      passwordHash: newHash
    };
    safeLocalStorageSet('sdg_admin_auth', JSON.stringify(updatedCreds));
    setAdminUsername(newUsername.trim());
    safeSessionStorageSet('sdg_admin_user', newUsername.trim());
    appendSecurityLog('PASSWORD_CHANGED', `Kredensial login admin berhasil diubah menjadi "${newUsername}"`, 'SUCCESS');
    return { success: true, message: 'Username & Password admin berhasil diperbarui!' };
  };


  // Site Data State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = safeLocalStorageGet('sdg_site_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialSiteConfig, ...parsed, bio: initialSiteConfig.bio };
      } catch {
        // fallback
      }
    }
    return initialSiteConfig;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = safeLocalStorageGet('sdg_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = safeLocalStorageGet('sdg_portfolio');
    return saved ? JSON.parse(saved) : initialPortfolio;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = safeLocalStorageGet('sdg_services');
    if (saved) {
      try {
        const parsed: ServiceItem[] = JSON.parse(saved);
        const filtered = parsed
          .filter(s => s.id !== 'srv-04' && !s.title.toLowerCase().includes('website'))
          .map(s => ({
            ...s,
            subtitle: s.subtitle.replace(/Berstandar Ekspor|Standar Ekspor/gi, 'High Quality')
          }));
        if (filtered.length > 0) return filtered;
      } catch {
        // fallback
      }
    }
    return initialServices;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = safeLocalStorageGet('sdg_testimonials');
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = safeLocalStorageGet('sdg_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [selectedPortfolioModal, setSelectedPortfolioModal] = useState<PortfolioItem | null>(null);

  // Sync state to local storage
  useEffect(() => {
    safeLocalStorageSet('sdg_site_config', JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    safeLocalStorageSet('sdg_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    safeLocalStorageSet('sdg_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    safeLocalStorageSet('sdg_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    safeLocalStorageSet('sdg_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    safeLocalStorageSet('sdg_cart', JSON.stringify(cart));
  }, [cart]);

  const updateSiteConfig = (newConfig: Partial<SiteConfig>) => {
    setSiteConfig(prev => ({ ...prev, ...newConfig }));
  };

  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...prod,
      id: 'prod-' + Date.now()
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addPortfolio = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: 'port-' + Date.now()
    };
    setPortfolio(prev => [newItem, ...prev]);
  };

  const updatePortfolio = (id: string, updated: Partial<PortfolioItem>) => {
    setPortfolio(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deletePortfolio = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
  };

  const addService = (item: Omit<ServiceItem, 'id'>) => {
    const newItem: ServiceItem = {
      ...item,
      id: 'srv-' + Date.now()
    };
    setServices(prev => [...prev, newItem]);
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addTestimonial = (item: Omit<Testimonial, 'id'>) => {
    const newItem: Testimonial = {
      ...item,
      id: 'test-' + Date.now()
    };
    setTestimonials(prev => [newItem, ...prev]);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product, size: string, color: string, qty = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { product, quantity: qty, selectedSize: size, selectedColor: color }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const updateCartQty = (productId: string, size: string, color: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedSize === size && item.selectedColor === color) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const clearCart = () => {
    setCart([]);
  };

  const resetToDefaultData = () => {
    safeLocalStorageRemove('sdg_site_config');
    safeLocalStorageRemove('sdg_products');
    safeLocalStorageRemove('sdg_portfolio');
    safeLocalStorageRemove('sdg_services');
    safeLocalStorageRemove('sdg_testimonials');
    safeLocalStorageRemove('sdg_cart');
    safeLocalStorageRemove('sdg_security_logs');
    setSiteConfig(initialSiteConfig);
    setProducts(initialProducts);
    setPortfolio(initialPortfolio);
    setServices(initialServices);
    setTestimonials(initialTestimonials);
    setCart([]);
    appendSecurityLog('DATA_BACKUP', 'Data direset ke konfigurasi bawaan SDG Industries', 'WARNING');
  };

  return (
    <DataContext.Provider value={{
      currentView,
      setCurrentView: handleSetCurrentView,
      isAdminLoggedIn,
      adminUsername,
      loginAdmin,
      logoutAdmin,
      changeAdminCredentials,
      failedLoginAttempts,
      lockoutUntil,
      siteConfig,
      updateSiteConfig,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      portfolio,
      addPortfolio,
      updatePortfolio,
      deletePortfolio,
      services,
      addService,
      updateService,
      deleteService,
      testimonials,
      addTestimonial,
      deleteTestimonial,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      selectedProductModal,
      setSelectedProductModal,
      selectedPortfolioModal,
      setSelectedPortfolioModal,
      resetToDefaultData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
