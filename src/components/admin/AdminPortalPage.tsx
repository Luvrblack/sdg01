import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Product, PortfolioItem, Testimonial, ServiceItem, SizeChartRow } from '../../types';

import { SdgLogo } from '../SdgLogo';
import { getSecurityLogs, SecurityLog, validateAgainstSqlInjection, appendSecurityLog } from '../../utils/security';
import { compressImageFile } from '../../utils/storage';
import { 
  ShoppingBag, FolderGit2, Layers, MessageSquare, Smartphone, 
  ShieldCheck, KeyRound, Download, LogOut, ExternalLink, 
  Plus, Edit2, Trash2, Upload, Save, CheckCircle, RotateCcw,
  AlertTriangle, Shield, Search, Eye, Filter, RefreshCw,
  Sparkles, Flame, Tag, Move, ZoomIn, Ruler, X, Image

} from 'lucide-react';




export const AdminPortalPage: React.FC = () => {
  const { 
    adminUsername, 
    logoutAdmin, 
    setCurrentView,
    changeAdminCredentials,
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
    siteConfig,
    updateSiteConfig,
    resetToDefaultData
  } = useData();

  const [activeTab, setActiveTab] = useState<
    'products' | 'sizechart' | 'logo' | 'portfolio' | 'services' | 'testimonials' | 'promo' | 'config' | 'channels' | 'security' | 'password' | 'backup'
  >('products');

  const [logoInputUrl, setLogoInputUrl] = useState<string>(siteConfig.logoUrl || '');
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (siteConfig.logoUrl) {
      setLogoInputUrl(siteConfig.logoUrl);
    }
  }, [siteConfig.logoUrl]);


  const [sizeChartRows, setSizeChartRows] = useState<SizeChartRow[]>(
    siteConfig.sizeChart && siteConfig.sizeChart.length > 0
      ? siteConfig.sizeChart
      : [
          { size: 'S', width: '48 cm', length: '70 cm', sleeve: '22 cm' },
          { size: 'M', width: '52 cm', length: '72 cm', sleeve: '23 cm' },
          { size: 'L', width: '56 cm', length: '75 cm', sleeve: '24 cm' },
          { size: 'XL', width: '60 cm', length: '77 cm', sleeve: '25 cm' },
          { size: 'XXL', width: '64 cm', length: '79 cm', sleeve: '26 cm' },
          { size: 'XXXL', width: '68 cm', length: '81 cm', sleeve: '27 cm' },
          { size: 'XXXXL', width: '72 cm', length: '83 cm', sleeve: '28 cm' },
          { size: 'XXXXXL', width: '76 cm', length: '85 cm', sleeve: '29 cm' },
        ]
  );

  useEffect(() => {
    if (siteConfig.sizeChart && siteConfig.sizeChart.length > 0) {
      setSizeChartRows(siteConfig.sizeChart);
    }
  }, [siteConfig.sizeChart]);



  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioFileInputRef = useRef<HTMLInputElement>(null);

  // Form State for Products
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'heavyweight',
    price: 185000,
    originalPrice: 225000,
    description: '',
    material: '100% Cotton Combed 16s Heavyweight (240 GSM)',
    gsm: '240 GSM',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Onyx Black', 'Off-White'],
    imageUrl: '/src/assets/images/sdg_tshirt_black_heavyweight_1790683222338.jpg',
    stock: 50,
    featured: true,
    tag: 'Best Seller',
    rating: 5.0,
    soldCount: 100,
    marketplaceUrl: ''
  });
  // Form visibility
  const [showAddProductForm, setShowAddProductForm] = useState<boolean>(false);
  const [sizesInput, setSizesInput] = useState<string>('S, M, L, XL, XXL');


  // Sync sizesInput when editing product ID changes
  useEffect(() => {
    if (editingProductId) {
      const p = products.find(prod => prod.id === editingProductId);
      if (p) {
        setSizesInput((p.sizes || []).join(', '));
      }
    }
  }, [editingProductId, products]);


  // Auto-expand size chart rows for any new size names entered in the form
  const ensureSizesInChart = (newSizes: string[]) => {
    setSizeChartRows(prevRows => {
      const existingUpper = prevRows.map(r => r.size.toUpperCase().trim());
      let updatedRows = [...prevRows];
      let changed = false;

      newSizes.forEach(s => {
        const clean = s.toUpperCase().trim();
        if (clean && !existingUpper.includes(clean)) {
          changed = true;
          let estW = '64 cm';
          let estL = '79 cm';
          let estS = '26 cm';
          if (clean === 'S') { estW = '48 cm'; estL = '70 cm'; estS = '22 cm'; }
          else if (clean === 'M') { estW = '52 cm'; estL = '72 cm'; estS = '23 cm'; }
          else if (clean === 'L') { estW = '56 cm'; estL = '75 cm'; estS = '24 cm'; }
          else if (clean === 'XL') { estW = '60 cm'; estL = '77 cm'; estS = '25 cm'; }
          else if (clean === 'XXL') { estW = '64 cm'; estL = '79 cm'; estS = '26 cm'; }
          else if (clean === 'XXXL') { estW = '68 cm'; estL = '81 cm'; estS = '27 cm'; }
          else if (clean === 'XXXXL') { estW = '72 cm'; estL = '83 cm'; estS = '28 cm'; }
          else if (clean === 'XXXXXL') { estW = '76 cm'; estL = '85 cm'; estS = '29 cm'; }
          else {
            const lastRow = updatedRows[updatedRows.length - 1];
            const lastW = parseInt(lastRow?.width) || 64;
            const lastL = parseInt(lastRow?.length) || 79;
            const lastS = parseInt(lastRow?.sleeve) || 26;
            estW = `${lastW + 4} cm`;
            estL = `${lastL + 2} cm`;
            estS = `${lastS + 1} cm`;
          }

          updatedRows.push({
            size: clean,
            width: estW,
            length: estL,
            sleeve: estS
          });
        }
      });

      if (changed) {
        updateSiteConfig({ ...siteConfig, sizeChart: updatedRows });
        return updatedRows;
      }
      return prevRows;
    });
  };

  // Update sizes when sizesInput changes
  const handleSizesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSizesInput(val);
    const parsed = val.split(',').map(s => s.trim()).filter(s => s !== '') as any[];
    setProductForm(prev => ({
      ...prev,
      sizes: parsed
    }));
    ensureSizesInChart(parsed);
  };


  // Interactive Image Pan / Zoom / Drag State
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [rawUploadedImage, setRawUploadedImage] = useState<string>('');
  const [imgZoom, setImgZoom] = useState<number>(1.0);
  const [imgPan, setImgPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - imgPan.x, y: e.clientY - imgPan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setImgPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - imgPan.x, y: e.touches[0].clientY - imgPan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setImgPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const bakeImageAdjustment = (): Promise<string> => {
    return new Promise((resolve) => {
      const srcUrl = rawUploadedImage || productForm.imageUrl;
      if (!srcUrl) {
        resolve(productForm.imageUrl);
        return;
      }

      const img = new window.Image();

      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(productForm.imageUrl);
          return;
        }

        ctx.fillStyle = '#080d0b';
        ctx.fillRect(0, 0, 800, 800);

        const containerWidth = previewContainerRef.current?.offsetWidth || 300;
        const scaleFactor = 800 / containerWidth;

        ctx.save();
        ctx.translate(400 + imgPan.x * scaleFactor, 400 + imgPan.y * scaleFactor);
        ctx.scale(imgZoom, imgZoom);

        const imgAspect = img.width / img.height;
        let drawW = 800;
        let drawH = 800;
        if (imgAspect > 1) {
          // Landscape photo: fit width, scale height
          drawW = 800;
          drawH = 800 / imgAspect;
        } else {
          // Portrait photo: fit height, scale width
          drawH = 800;
          drawW = 800 * imgAspect;
        }


        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(croppedDataUrl);
      };
      img.onerror = () => {
        resolve(productForm.imageUrl);
      };
      img.src = srcUrl;
    });
  };


  // When editing, show form
  useEffect(() => {
    if (editingProductId) {
      setShowAddProductForm(true);
    }
  }, [editingProductId]);

  // Form State for Portfolio
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [portfolioForm, setPortfolioForm] = useState<Omit<PortfolioItem, 'id'>>({
    title: '',
    category: 'apparel',
    client: '',
    year: '2025',
    description: '',
    imageUrl: '/src/assets/images/sdg_hero_streetwear_1790683209963.jpg',
    tags: ['Streetwear', 'Apparel', 'Graphic Design'],
    stats: '100% Client Satisfaction'
  });

  // Form State for Site Config
  const [configForm, setConfigForm] = useState(siteConfig);

  // Form State for Password Change
  const [newUsernameInput, setNewUsernameInput] = useState(adminUsername);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeMsg, setPasswordChangeMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Form State for Services
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [featuresInput, setFeaturesInput] = useState<string>('');
  const [serviceForm, setServiceForm] = useState<Omit<ServiceItem, 'id'>>({
    number: '01',
    title: '',
    subtitle: 'Premium Service',
    description: '',
    features: ['High quality design', 'Professional assistance'],
    icon: '✨',
    startingPrice: 'Rp 150.000'
  });

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();

    const checkTitle = validateAgainstSqlInjection(serviceForm.title);
    const checkDesc = validateAgainstSqlInjection(serviceForm.description);
    if (!checkTitle.isSafe || !checkDesc.isSafe) {
      alert('Karakter tidak aman terdeteksi oleh sistem pertahanan!');
      return;
    }

    const parsedFeatures = featuresInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const updatedForm = {
      ...serviceForm,
      features: parsedFeatures
    };

    if (editingServiceId) {
      updateService(editingServiceId, updatedForm);
      showToast('Layanan berhasil diperbarui!');
    } else {
      addService(updatedForm);
      showToast('Layanan baru berhasil ditambahkan!');
    }

    // Reset Form
    setEditingServiceId(null);
    setFeaturesInput('');
    setServiceForm({
      number: '01',
      title: '',
      subtitle: 'Premium Service',
      description: '',
      features: ['High quality design', 'Professional assistance'],
      icon: '✨',
      startingPrice: 'Rp 150.000'
    });
  };

  const handleEditService = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setFeaturesInput(srv.features ? srv.features.join('\n') : '');
    setServiceForm({
      number: srv.number,
      title: srv.title,
      subtitle: srv.subtitle || 'Premium Service',
      description: srv.description,
      features: srv.features || [],
      icon: srv.icon || '✨',
      startingPrice: srv.startingPrice
    });
  };

  // Form State for Testimonials
  const [testimonialForm, setTestimonialForm] = useState<Omit<Testimonial, 'id'>>({
    name: '',
    role: 'Founder / Brand Owner',
    company: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    content: '',
    verified: true
  });
  const testimonialFileInputRef = useRef<HTMLInputElement>(null);

  const handleTestimonialImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageFile(file, 400, 0.75);
        setTestimonialForm(prev => ({ ...prev, avatar: compressedBase64 }));
        showToast('Foto profil ulasan terkompresi & berhasil diunggah!');
      } catch (err) {
        console.error('Error compressing testimonial avatar:', err);
        showToast('Gagal memproses file gambar');
      }
    }
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();

    const checkName = validateAgainstSqlInjection(testimonialForm.name);
    const checkContent = validateAgainstSqlInjection(testimonialForm.content);
    if (!checkName.isSafe || !checkContent.isSafe) {
      alert('Karakter tidak aman terdeteksi oleh sistem pertahanan!');
      return;
    }

    addTestimonial(testimonialForm);
    showToast('Ulasan / Testimoni baru berhasil ditambahkan!');

    // Reset Form
    setTestimonialForm({
      name: '',
      role: 'Founder / Brand Owner',
      company: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      content: '',
      verified: true
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshLogs = () => {
    setSecurityLogs(getSecurityLogs());
  };

  useEffect(() => {
    refreshLogs();
  }, [activeTab]);

  useEffect(() => {
    setConfigForm(siteConfig);
  }, [siteConfig]);

  // Product Image Handler (Load raw uncropped image for custom cropping)
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const rawDataUrl = evt.target?.result as string;
        setRawUploadedImage(rawDataUrl);
        setProductForm(prev => ({ ...prev, imageUrl: rawDataUrl }));
        setImgZoom(1.0);
        setImgPan({ x: 0, y: 0 });
        showToast('Foto utuh diunggah! Atur posisi & zoom untuk potong kustom.');
      };
      reader.onerror = (err) => {
        console.error('Error reading image file:', err);
        showToast('Gagal membaca berkas foto kaos');
      };
      reader.readAsDataURL(file);
    }
  };


  // Portfolio Image Handler
  const handlePortfolioImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageFile(file, 800, 0.75);
        setPortfolioForm(prev => ({ ...prev, imageUrl: compressedBase64 }));
        showToast('Foto portofolio terkompresi & berhasil diunggah!');
      } catch (err) {
        console.error('Error compressing portfolio image:', err);
        showToast('Gagal memproses foto portofolio');
      }
    }
  };

  // Save Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // SQL Injection check
    const checkName = validateAgainstSqlInjection(productForm.name);
    const checkDesc = validateAgainstSqlInjection(productForm.description);
    if (!checkName.isSafe || !checkDesc.isSafe) {
      appendSecurityLog('SQLI_BLOCKED', 'Pola SQL Injection terdeteksi saat upload produk', 'DANGER');
      alert('Karakter tidak aman terdeteksi oleh sistem pertahanan!');
      return;
    }

    let finalImageUrl = productForm.imageUrl;
    if (imgZoom !== 1 || imgPan.x !== 0 || imgPan.y !== 0) {
      finalImageUrl = await bakeImageAdjustment();
    }

    // Always re-parse sizesInput on save so typed sizes are never lost
    const parsedSizes = sizesInput
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(s => s !== '');

    const finalSizes = parsedSizes.length > 0 ? parsedSizes : (productForm.sizes || ['S', 'M', 'L', 'XL', 'XXL']);

    const payload = { 
      ...productForm, 
      sizes: finalSizes, 
      imageUrl: finalImageUrl 
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
      showToast(`Produk kaos berhasil diperbarui dengan ukuran: ${finalSizes.join(', ')}!`);
    } else {
      addProduct(payload);
      showToast(`Kaos baru berhasil ditambahkan ke katalog dengan ukuran: ${finalSizes.join(', ')}!`);
    }

    // Reset Form
    setEditingProductId(null);
    setRawUploadedImage('');
    setImgZoom(1.0);
    setImgPan({ x: 0, y: 0 });
    setSizesInput('S, M, L, XL, XXL');
    setProductForm({
      name: '',
      category: 'heavyweight',
      price: 185000,
      originalPrice: 225000,
      description: '',
      material: '100% Cotton Combed 16s Heavyweight (240 GSM)',
      gsm: '240 GSM',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Onyx Black', 'Off-White'],
      imageUrl: '/src/assets/images/sdg_tshirt_black_heavyweight_1790683222338.jpg',
      stock: 50,
      featured: true,
      tag: 'New Arrival',
      rating: 5.0,
      soldCount: 0,
      marketplaceUrl: ''
    });
  };

  const handleEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setRawUploadedImage(p.imageUrl);
    setImgZoom(1.0);
    setImgPan({ x: 0, y: 0 });
    const productSizes = p.sizes || ['S', 'M', 'L', 'XL', 'XXL'];
    setSizesInput(productSizes.join(', '));
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      description: p.description,
      material: p.material,
      gsm: p.gsm,
      sizes: productSizes,
      colors: p.colors,
      imageUrl: p.imageUrl,
      stock: p.stock,
      featured: p.featured,
      tag: p.tag || '',
      rating: p.rating,
      soldCount: p.soldCount,
      marketplaceUrl: p.marketplaceUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };




  // Save Portfolio
  const handleSavePortfolio = (e: React.FormEvent) => {
    e.preventDefault();

    const checkTitle = validateAgainstSqlInjection(portfolioForm.title);
    if (!checkTitle.isSafe) {
      alert('Karakter tidak aman terdeteksi pada judul!');
      return;
    }

    if (editingPortfolioId) {
      updatePortfolio(editingPortfolioId, portfolioForm);
      showToast('Karya portofolio diperbarui!');
    } else {
      addPortfolio(portfolioForm);
      showToast('Karya baru ditambahkan ke portofolio!');
    }

    setEditingPortfolioId(null);
    setPortfolioForm({
      title: '',
      category: 'apparel',
      client: '',
      year: '2025',
      description: '',
      imageUrl: '/src/assets/images/sdg_hero_streetwear_1790683209963.jpg',
      tags: ['Streetwear', 'Apparel'],
      stats: ''
    });
  };

  // Password Change Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMsg(null);

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeMsg({ text: 'Konfirmasi password tidak cocok!', success: false });
      return;
    }

    const res = await changeAdminCredentials(newUsernameInput, newPasswordInput);
    setPasswordChangeMsg({ text: res.message, success: res.success });
    if (res.success) {
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    }
  };

  const handleExportData = () => {
    const data = {
      siteConfig,
      products,
      portfolio,
      services,
      testimonials
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sdg_industries_backup_${Date.now()}.json`;
    a.click();
    showToast('File backup JSON berhasil diunduh!');
  };

  return (
    <div className="min-h-screen bg-[#060a08] text-slate-100 flex flex-col">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-black font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Dedicated Top Bar */}
      <header className="bg-[#090f0c] border-b border-emerald-950 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <SdgLogo size="sm" />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-[10px] font-mono font-bold">
            ADMIN PORTAL v2.5
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View Public Website */}
          <button
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
            title="Buka Website Utama"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Lihat Website</span>
          </button>

          {/* Admin User Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-800/40 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Admin: <strong className="text-white font-mono">{adminUsername}</strong></span>
          </div>

          {/* Logout */}
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-300 hover:bg-rose-800 hover:text-white text-xs font-bold transition-all"
            title="Logout dari cPanel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout (Sidebar + Body) */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 bg-[#080d0b] border-r border-emerald-950/80 p-4 sm:p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3 mb-2">
              Menu Pengelolaan
            </div>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Katalog Kaos ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('sizechart')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'sizechart'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-emerald-400 hover:bg-slate-900 hover:text-emerald-300'
              }`}
            >
              <Ruler className="w-4 h-4 text-emerald-400" />
              <span>Panduan Size Chart</span>
            </button>

            <button
              onClick={() => setActiveTab('logo')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'logo'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-amber-300 hover:bg-slate-900 hover:text-amber-200'
              }`}
            >
              <Image className="w-4 h-4 text-amber-400" />
              <span>Ganti Logo & Icon Gambar</span>
            </button>



            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Portofolio ({portfolio.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'services'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Layanan & Tarif</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'testimonials'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ulasan & Testimoni</span>
            </button>

            <button
              onClick={() => setActiveTab('promo')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'promo'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-amber-400 hover:bg-slate-900 hover:text-amber-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Promo & Teks Rilis</span>
            </button>


            <button
              onClick={() => setActiveTab('config')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'config'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Profil & WhatsApp</span>
            </button>

            <button
              onClick={() => setActiveTab('channels')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'channels'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Link Toko & Medsos</span>
            </button>

            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3 pt-4 mb-2">
              Keamanan & Sistem
            </div>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'security'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Log SQL Defense</span>
            </button>

            <button
              onClick={() => setActiveTab('password')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'password'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Ganti Password</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'backup'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Backup & Reset</span>
            </button>
          </div>

          {/* Security Status in Sidebar */}
          <div className="mt-8 p-3 rounded-2xl bg-[#0d1612] border border-emerald-900/50 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>Firewall Aktif</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Input sanitization, parameter validation & anti-injection ON.
            </p>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          
          {/* KPI Statistics Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-[#0a100d] border border-emerald-950">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Artikel Kaos</div>
              <div className="text-2xl font-black text-white font-mono">{products.length} Artikel</div>
              <div className="text-[10px] text-emerald-400 font-mono">Tersedia di Showroom</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a100d] border border-emerald-950">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Stok Siap Kirim</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {products.reduce((s, p) => s + p.stock, 0)} Pcs
              </div>
              <div className="text-[10px] text-slate-400">Katun Combed Asli</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a100d] border border-emerald-950">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Portofolio Desain</div>
              <div className="text-2xl font-black text-white font-mono">{portfolio.length} Karya</div>
              <div className="text-[10px] text-emerald-400 font-mono">Live Showcase</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a100d] border border-emerald-950">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Status Keamanan</div>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
                <span>Terlindungi</span>
              </div>
              <div className="text-[10px] text-slate-400">Anti-SQLi & XSS</div>
            </div>
          </div>

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              
              {/* Add Toggle Button */}
              <button
                onClick={() => setShowAddProductForm(!showAddProductForm)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-900 border border-emerald-700/50 rounded-xl text-emerald-300 font-bold text-xs hover:bg-emerald-800 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddProductForm ? 'Tutup Form Produk' : 'Tambah Produk Baru'}</span>
              </button>

              {/* Add / Edit Form */}
              {showAddProductForm && (
              <div className="p-6 rounded-3xl bg-[#0c1410] border border-emerald-800/40">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-400" />
                    <span>{editingProductId ? 'Edit Artikel Kaos' : 'Upload & Tambah Kaos Baru ke Showroom'}</span>
                  </h3>

                  {editingProductId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProductId(null);
                        setProductForm({
                          name: '',
                          category: 'heavyweight',
                          price: 185000,
                          originalPrice: 225000,
                          description: '',
                          material: '100% Cotton Combed 16s Heavyweight (240 GSM)',
                          gsm: '240 GSM',
                          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                          colors: ['Onyx Black', 'Off-White'],
                          imageUrl: '/src/assets/images/sdg_tshirt_black_heavyweight_1790683222338.jpg',
                          stock: 50,
                          featured: true,
                          tag: 'New Arrival',
                          rating: 5.0,
                          soldCount: 0,
                          marketplaceUrl: ''
                        });
                      }}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Batal Edit / Tambah Baru
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    <div className="md:col-span-8 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Nama Kaos / Artikel Apparel *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: SDG Born From The Street Heavyweight Tee"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400"
                          >
                            <option value="heavyweight">Heavyweight (240 GSM)</option>
                            <option value="oversize">Oversize Drop Shoulder</option>
                            <option value="vintage">Acid Wash / Vintage</option>
                            <option value="minimalist">Minimalist Emblem</option>
                            <option value="limited">Limited Edition</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Harga Jual (Rp) *</label>
                          <input
                            type="number"
                            required
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Harga Coret (Rp)</label>
                          <input
                            type="number"
                            value={productForm.originalPrice || ''}
                            onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Keterangan</label>
                          <input
                            type="text"
                            value={productForm.material}
                            onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Gramasi / GSM</label>
                          <input
                            type="text"
                            value={productForm.gsm}
                            onChange={(e) => setProductForm({ ...productForm, gsm: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Stok Tersedia (Pcs)</label>
                          <input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Ukuran Tersedia (Pisah dengan koma)</label>
                          <input
                            type="text"
                            placeholder="Contoh: S, M, L, XL, XXL atau M, L, XL"
                            value={sizesInput}
                            onChange={handleSizesInput}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-400"
                          />

                          {/* Live Interactive Size Chips (1-to-1 sync with Size Chart) */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[10px] text-slate-400 font-semibold mr-1">Tinjauan Ukuran & Panduan Size:</span>
                            {productForm.sizes.map((sz) => (
                              <span
                                key={sz}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono font-bold shadow-sm"
                              >
                                <span>{sz}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSizes = productForm.sizes.filter(s => s !== sz);
                                    setProductForm(prev => ({ ...prev, sizes: newSizes }));
                                    setSizesInput(newSizes.join(', '));
                                    showToast(`Ukuran ${sz} telah dihapus dari produk & Panduan Size!`);
                                  }}
                                  className="text-emerald-400 hover:text-rose-400 transition-colors p-0.5 rounded hover:bg-rose-950/50"
                                  title={`Hapus ukuran ${sz} dari produk ini`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                            {productForm.sizes.length === 0 && (
                              <span className="text-[10px] text-amber-400 font-mono italic">Belum ada ukuran. Ketik ukuran di atas (contoh: S, M, L).</span>
                            )}
                          </div>
                        </div>

                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Lengkap Kaos</label>
                        <textarea
                          rows={2}
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Link URL Marketplace (Shopee, Tokopedia, dll)</label>
                        <input
                          type="text"
                          placeholder="Contoh: https://shopee.co.id/sdg-apparel-heavy-tee"
                          value={productForm.marketplaceUrl || ''}
                          onChange={(e) => setProductForm({ ...productForm, marketplaceUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400 font-mono"
                        />
                      </div>
                    </div>

                    {/* Right: Interactive Image Uploader with Pan/Zoom Positioner */}
                    <div className="md:col-span-4 p-4 rounded-2xl bg-[#090f0c] border border-emerald-950 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-slate-200">Foto Kaos (Box 1:1):</label>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">🖐️ Geser & Zoom</span>
                        </div>
                        
                        {/* Interactive Drag & Pan Frame */}
                        <div
                          ref={previewContainerRef}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border-2 border-dashed border-emerald-900/80 mb-2.5 cursor-grab active:cursor-grabbing select-none group touch-none shadow-inner"
                        >
                          <div 
                            className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
                            style={{
                              transform: `translate(${imgPan.x}px, ${imgPan.y}px) scale(${imgZoom})`,
                              transformOrigin: 'center center'
                            }}
                          >
                            <img
                              src={rawUploadedImage || productForm.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
                              alt="Preview"
                              className="w-full h-full object-contain pointer-events-none"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const fallback = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';
                                if (target.src !== fallback) {
                                  target.src = fallback;
                                }
                              }}
                            />
                          </div>

                          {/* Helper Overlay Badge */}
                          <div className="absolute top-2 left-2 right-2 pointer-events-none flex justify-between items-center opacity-90 group-hover:opacity-100 transition-opacity">
                            <span className="text-[9px] bg-black/85 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-900/70 backdrop-blur-md font-semibold shadow">
                              📸 Foto Utuh • Geser & Zoom untuk Potong Kustom
                            </span>
                          </div>
                        </div>

                        {/* Interactive Zoom & Position Controls */}
                        <div className="space-y-2 mb-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                          <div className="flex items-center justify-between text-[10px] text-slate-300">
                            <span className="font-semibold flex items-center gap-1">
                              <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Skala / Potong Foto:</span>
                            </span>
                            <span className="font-mono text-emerald-400 font-bold">{Math.round(imgZoom * 100)}%</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0.8"
                              max="3.0"
                              step="0.05"
                              value={imgZoom}
                              onChange={(e) => setImgZoom(parseFloat(e.target.value))}
                              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                            />

                            <button
                              type="button"
                              onClick={() => { setImgZoom(1); setImgPan({ x: 0, y: 0 }); }}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded text-[9px] font-mono whitespace-nowrap border border-slate-700 active:scale-95 transition-all"
                              title="Reset Posisi & Zoom"
                            >
                              Reset
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={async () => {
                              const adjusted = await bakeImageAdjustment();
                              setProductForm(prev => ({ ...prev, imageUrl: adjusted }));
                              showToast('Posisi & zoom foto berhasil diterapkan!');
                            }}
                            className="w-full py-1.5 px-2 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 hover:text-white rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 mt-1 active:scale-98"
                          >
                            <Move className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Terapkan Posisi Foto</span>
                          </button>
                        </div>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleProductImageUpload}
                          accept="image/*"
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-800 hover:text-white text-xs font-semibold transition-all mb-2"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari HP / PC</span>
                        </button>

                        <input
                          type="text"
                          placeholder="Atau link URL foto..."
                          value={productForm.imageUrl}
                          onChange={(e) => {
                            setProductForm({ ...productForm, imageUrl: e.target.value });
                            setRawUploadedImage(e.target.value);
                            setImgZoom(1.0);
                            setImgPan({ x: 0, y: 0 });
                          }}
                          className="w-full px-2.5 py-1.5 text-[10px] rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                        />
                      </div>


                      <button
                        type="submit"
                        className="w-full mt-4 py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingProductId ? 'Simpan Perubahan Kaos' : 'Simpan & Tayangkan Kaos'}</span>
                      </button>
                    </div>

                  </div>
                </form>
              </div>
            )}

              {/* Table of Products */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-white text-base">
                  Daftar Kaos Aktif di Showroom ({products.length})
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a100d]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0f1714] text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Foto</th>
                        <th className="p-3.5">Nama Kaos</th>
                        <th className="p-3.5">Kategori</th>
                        <th className="p-3.5">Harga</th>
                        <th className="p-3.5">Stok</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/50">
                          <td className="p-3">
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 aspect-square object-cover rounded-lg bg-slate-950" />

                          </td>
                          <td className="p-3 font-semibold text-white">
                            <div>{p.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{p.gsm} · {p.material}</div>
                            <div className="text-[10px] text-emerald-400 font-mono font-bold mt-0.5">
                              Ukuran Aktif: {p.sizes && p.sizes.length > 0 ? p.sizes.join(', ') : 'S, M, L, XL, XXL'}
                            </div>
                          </td>

                          <td className="p-3 font-mono text-emerald-400">{p.category}</td>
                          <td className="p-3 font-mono font-bold text-white">Rp {p.price.toLocaleString('id-ID')}</td>
                          <td className="p-3 font-mono text-emerald-400">{p.stock} pcs</td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => handleEditProduct(p)}
                              className="p-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-400 hover:text-black"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {deleteConfirmId === p.id ? (
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    deleteProduct(p.id);
                                    showToast('Kaos berhasil dihapus!');
                                    setDeleteConfirmId(null);
                                  }}
                                  className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-500 transition-all"
                                >
                                  Ya, Hapus
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 rounded bg-slate-850 text-slate-300 text-[10px] font-semibold transition-all"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(p.id)}
                                className="p-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB: SIZE CHART / PANDUAN UKURAN */}
          {activeTab === 'sizechart' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#090f0c] border border-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="w-5 h-5 text-emerald-400" />
                    <h2 className="font-display text-lg font-bold text-white">
                      Pengelolaan Panduan Size Chart Kaos
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Kelola Ukuran Size (S, M, L, XL, XXL, XXXL, XXXXL, XXXXXL), Lebar Dada, Panjang Kaos, dan Panjang Lengan secara kustom.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const default8: SizeChartRow[] = [
                        { size: 'S', width: '48 cm', length: '70 cm', sleeve: '22 cm' },
                        { size: 'M', width: '52 cm', length: '72 cm', sleeve: '23 cm' },
                        { size: 'L', width: '56 cm', length: '75 cm', sleeve: '24 cm' },
                        { size: 'XL', width: '60 cm', length: '77 cm', sleeve: '25 cm' },
                        { size: 'XXL', width: '64 cm', length: '79 cm', sleeve: '26 cm' },
                        { size: 'XXXL', width: '68 cm', length: '81 cm', sleeve: '27 cm' },
                        { size: 'XXXXL', width: '72 cm', length: '83 cm', sleeve: '28 cm' },
                        { size: 'XXXXXL', width: '76 cm', length: '85 cm', sleeve: '29 cm' },
                      ];
                      setSizeChartRows(default8);
                      updateSiteConfig({ ...siteConfig, sizeChart: default8 });
                      showToast('Size Chart otomatis diisi S s/d XXXXXL!');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auto S - XXXXXL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const newRow: SizeChartRow = { size: 'BARU', width: '50 cm', length: '70 cm', sleeve: '23 cm' };
                      const updated = [...sizeChartRows, newRow];
                      setSizeChartRows(updated);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Tambah Ukuran</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateSiteConfig({ ...siteConfig, sizeChart: sizeChartRows });
                      showToast('Panduan Size Chart berhasil disimpan!');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Size Chart</span>
                  </button>
                </div>
              </div>

              {/* Size Chart Interactive Table */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#090f0c] border border-emerald-950 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-emerald-950 text-slate-400 font-mono text-[11px] uppercase bg-slate-950/80">
                        <th className="p-3 rounded-l-xl">No</th>
                        <th className="p-3">Ukuran Size</th>
                        <th className="p-3">Lebar Dada (cm)</th>
                        <th className="p-3">Panjang Kaos (cm)</th>
                        <th className="p-3">Panjang Lengan (cm)</th>
                        <th className="p-3 text-right rounded-r-xl">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {sizeChartRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-3 text-slate-500 font-mono font-bold">{idx + 1}</td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={row.size}
                              onChange={(e) => {
                                const updated = [...sizeChartRows];
                                updated[idx].size = e.target.value;
                                setSizeChartRows(updated);
                              }}
                              className="px-2.5 py-1.5 text-xs font-bold font-mono rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 focus:outline-none focus:border-emerald-400 w-28 uppercase"
                              placeholder="Ukuran"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={row.width}
                              onChange={(e) => {
                                const updated = [...sizeChartRows];
                                updated[idx].width = e.target.value;
                                setSizeChartRows(updated);
                              }}
                              className="px-2.5 py-1.5 text-xs font-mono rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400 w-32"
                              placeholder="Lebar (contoh: 52 cm)"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={row.length}
                              onChange={(e) => {
                                const updated = [...sizeChartRows];
                                updated[idx].length = e.target.value;
                                setSizeChartRows(updated);
                              }}
                              className="px-2.5 py-1.5 text-xs font-mono rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400 w-32"
                              placeholder="Panjang (contoh: 72 cm)"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={row.sleeve}
                              onChange={(e) => {
                                const updated = [...sizeChartRows];
                                updated[idx].sleeve = e.target.value;
                                setSizeChartRows(updated);
                              }}
                              className="px-2.5 py-1.5 text-xs font-mono rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400 w-32"
                              placeholder="Lengan (contoh: 23 cm)"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = sizeChartRows.filter((_, i) => i !== idx);
                                setSizeChartRows(updated);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition-all"
                              title="Hapus Baris Ukuran Ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span>💡 *Catatan*: Baris ukuran baru (S s/d XXXXXL) juga akan otomatis ditambahkan saat Anda mengetik ukuran baru di form input katalog kaos.</span>
                  <button
                    type="button"
                    onClick={() => {
                      updateSiteConfig({ ...siteConfig, sizeChart: sizeChartRows });
                      showToast('Panduan Size Chart berhasil disimpan!');
                    }}
                    className="px-4 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-lg text-xs font-bold shrink-0"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GANTI LOGO & ICON GAMBAR */}
          {activeTab === 'logo' && (
            <div className="space-y-6">
              {/* Header Title Banner */}
              <div className="p-6 rounded-2xl bg-[#090f0c] border border-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Image className="w-5 h-5 text-amber-400" />
                    <h2 className="font-display text-lg font-bold text-white">
                      Pengelolaan Logo Brand & Icon Gambar Website
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Ganti gambar logo / icon brand SDG Industries yang tampil pada Header, Sticky Navigation, dan Footer secara langsung.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const defaultSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 112'><path d='M 44.5 4.5 Q 50 1.3 55.5 4.5 L 91.5 25.3 Q 97 28.5 97 34.8 L 97 76.2 Q 97 82.5 91.5 85.7 L 55.5 106.5 Q 50 109.7 44.5 106.5 L 8.5 85.7 Q 3 82.5 3 76.2 L 3 34.8 Q 3 28.5 8.5 25.3 Z' fill='%2300D387'/><path d='M 3.2 45 C 6 25 25 15 50 15 C 66 15 80 20 92 28 C 78 38 62 40 42 41 C 24 42 11 44.5 3.2 45 Z' fill='white'/><path d='M 96.8 66 C 94 86 75 96 50 96 C 34 96 20 91 8 83 C 22 73 38 71 58 70 C 76 69 89 66.5 96.8 66 Z' fill='white'/><text x='52' y='85' fill='%2300D387' fill-opacity='0.15' font-size='12' font-weight='900' font-family='sans-serif' transform='rotate(-12, 52, 85)' letter-spacing='0.1em'%3ESDG%3C/text%3E<text x='68' y='38' fill='white' font-size='12' font-weight='900' font-family='sans-serif'%3ETM%3C/text%3E</svg>";
                      setLogoInputUrl(defaultSvg);
                      updateSiteConfig({ ...siteConfig, logoUrl: defaultSvg });
                      showToast('Logo berhasil direset ke SVG Hexagonal Default!');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reset Logo Default</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!logoInputUrl.trim()) {
                        showToast('Harap masukkan URL atau upload foto logo terlebih dahulu');
                        return;
                      }
                      updateSiteConfig({ ...siteConfig, logoUrl: logoInputUrl });
                      showToast('Logo Brand Baru Berhasil Disimpan & Ditayangkan!');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Logo Baru</span>
                  </button>
                </div>
              </div>

              {/* Main Upload & Live Preview Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Col: Upload & URL Controls */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-[#090f0c] border border-emerald-950 space-y-5 shadow-xl">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload Berkas Logo / Ubah URL Gambar</span>
                  </h3>

                  {/* Upload From Device */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Upload Foto Logo Baru dari Komputer / HP
                    </label>
                    <input
                      type="file"
                      ref={logoFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const result = evt.target?.result as string;
                            if (result) {
                              setLogoInputUrl(result);
                              showToast('Gambar logo berhasil diunggah! Klik Simpan untuk menerapkannya.');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md"
                    >
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Pilih Gambar Logo Baru (PNG / SVG / JPG / WEBP)</span>
                    </button>
                    <p className="text-[10px] text-slate-500 mt-1.5">
                      💡 Format yang disarankan: PNG transparan atau SVG persegi/vektor untuk hasil paling tajam.
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Atau Tempelkan Link URL Gambar Logo Direct
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: https://domain.com/assets/logo.png atau data:image/..."
                      value={logoInputUrl}
                      onChange={(e) => setLogoInputUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Preset Selector */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Pilihan Logo Preset Siap Pakai (1-Klik)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          const defaultSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 112'><path d='M 44.5 4.5 Q 50 1.3 55.5 4.5 L 91.5 25.3 Q 97 28.5 97 34.8 L 97 76.2 Q 97 82.5 91.5 85.7 L 55.5 106.5 Q 50 109.7 44.5 106.5 L 8.5 85.7 Q 3 82.5 3 76.2 L 3 34.8 Q 3 28.5 8.5 25.3 Z' fill='%2300D387'/><path d='M 3.2 45 C 6 25 25 15 50 15 C 66 15 80 20 92 28 C 78 38 62 40 42 41 C 24 42 11 44.5 3.2 45 Z' fill='white'/><path d='M 96.8 66 C 94 86 75 96 50 96 C 34 96 20 91 8 83 C 22 73 38 71 58 70 C 76 69 89 66.5 96.8 66 Z' fill='white'/><text x='52' y='85' fill='%2300D387' fill-opacity='0.15' font-size='12' font-weight='900' font-family='sans-serif' transform='rotate(-12, 52, 85)' letter-spacing='0.1em'%3ESDG%3C/text%3E<text x='68' y='38' fill='white' font-size='12' font-weight='900' font-family='sans-serif'%3ETM%3C/text%3E</svg>";
                          setLogoInputUrl(defaultSvg);
                        }}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 flex flex-col items-center gap-1.5 transition-all text-center group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 112'><path d='M 44.5 4.5 Q 50 1.3 55.5 4.5 L 91.5 25.3 Q 97 28.5 97 34.8 L 97 76.2 Q 97 82.5 91.5 85.7 L 55.5 106.5 Q 50 109.7 44.5 106.5 L 8.5 85.7 Q 3 82.5 3 76.2 L 3 34.8 Q 3 28.5 8.5 25.3 Z' fill='%2300D387'/><path d='M 3.2 45 C 6 25 25 15 50 15 C 66 15 80 20 92 28 C 78 38 62 40 42 41 C 24 42 11 44.5 3.2 45 Z' fill='white'/><path d='M 96.8 66 C 94 86 75 96 50 96 C 34 96 20 91 8 83 C 22 73 38 71 58 70 C 76 69 89 66.5 96.8 66 Z' fill='white'/></svg>" className="w-full h-full object-contain" alt="Hexagon" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 group-hover:text-emerald-400">Hexagon Default</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const cyberSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M 50 5 L 90 20 L 90 55 C 90 75 50 95 50 95 C 50 95 10 75 10 55 L 10 20 Z' fill='%23052e16' stroke='%2334d399' stroke-width='4'/><path d='M 30 40 L 50 25 L 70 40 L 70 65 L 50 80 L 30 65 Z' fill='%2310b981'/><text x='50' y='58' text-anchor='middle' fill='white' font-size='22' font-weight='900' font-family='sans-serif'>SDG</text></svg>";
                          setLogoInputUrl(cyberSvg);
                        }}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 flex flex-col items-center gap-1.5 transition-all text-center group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M 50 5 L 90 20 L 90 55 C 90 75 50 95 50 95 C 50 95 10 75 10 55 L 10 20 Z' fill='%23052e16' stroke='%2334d399' stroke-width='4'/><path d='M 30 40 L 50 25 L 70 40 L 70 65 L 50 80 L 30 65 Z' fill='%2310b981'/><text x='50' y='58' text-anchor='middle' fill='white' font-size='22' font-weight='900' font-family='sans-serif'>SDG</text></svg>" className="w-full h-full object-contain" alt="Cyber Shield" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 group-hover:text-emerald-400">Cyber Shield</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const crownSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M 15 70 L 25 30 L 40 50 L 50 20 L 60 50 L 75 30 L 85 70 Z' fill='%23f59e0b'/><circle cx='50' cy='15' r='5' fill='%23fbbf24'/><circle cx='25' cy='24' r='4' fill='%23fbbf24'/><circle cx='75' cy='24' r='4' fill='%23fbbf24'/><rect x='15' y='75' width='70' height='10' rx='3' fill='%23d97706'/></svg>";
                          setLogoInputUrl(crownSvg);
                        }}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 flex flex-col items-center gap-1.5 transition-all text-center group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M 15 70 L 25 30 L 40 50 L 50 20 L 60 50 L 75 30 L 85 70 Z' fill='%23f59e0b'/><circle cx='50' cy='15' r='5' fill='%23fbbf24'/><circle cx='25' cy='24' r='4' fill='%23fbbf24'/><circle cx='75' cy='24' r='4' fill='%23fbbf24'/><rect x='15' y='75' width='70' height='10' rx='3' fill='%23d97706'/></svg>" className="w-full h-full object-contain" alt="Gold Crown" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 group-hover:text-amber-400">Street Crown</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const diamondSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,10 90,50 50,90 10,50' fill='%2318181b' stroke='white' stroke-width='4'/><polygon points='50,25 75,50 50,75 25,50' fill='white'/><text x='50' y='56' text-anchor='middle' fill='%2318181b' font-size='16' font-weight='900' font-family='sans-serif'>SDG</text></svg>";
                          setLogoInputUrl(diamondSvg);
                        }}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-300 flex flex-col items-center gap-1.5 transition-all text-center group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,10 90,50 50,90 10,50' fill='%2318181b' stroke='white' stroke-width='4'/><polygon points='50,25 75,50 50,75 25,50' fill='white'/><text x='50' y='56' text-anchor='middle' fill='%2318181b' font-size='16' font-weight='900' font-family='sans-serif'>SDG</text></svg>" className="w-full h-full object-contain" alt="Diamond" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 group-hover:text-white">Minimal Diamond</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!logoInputUrl.trim()) {
                        showToast('Harap masukkan URL atau upload foto logo terlebih dahulu');
                        return;
                      }
                      updateSiteConfig({ ...siteConfig, logoUrl: logoInputUrl });
                      showToast('Logo Brand Baru Berhasil Disimpan & Ditayangkan!');
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan & Terapkan Logo Baru</span>
                  </button>
                </div>

                {/* Right Col: Interactive Live Preview Card */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-[#090f0c] border border-emerald-950 flex flex-col justify-between space-y-4 shadow-xl">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span>Simulasi Live Tampilan Logo Baru</span>
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Berikut preview langsung bagaimana logo baru Anda akan tampil pada Header Utama dan Navigation Bar website:
                    </p>

                    {/* Preview Container Header */}
                    <div className="p-4 rounded-xl bg-[#050b08] border border-emerald-900/60 space-y-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-2">1. Header Navigation Bar</span>
                        <div className="p-3 rounded-xl bg-[#080d0b] border border-slate-800 flex items-center justify-between">
                          <SdgLogo customLogoUrl={logoInputUrl} size="md" />
                          <div className="flex gap-2 text-[10px] text-slate-400">
                            <span>Katalog</span>
                            <span>Portofolio</span>
                            <span>Layanan</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-2">2. Footer Brand Crest</span>
                        <div className="p-3 rounded-xl bg-[#030605] border border-slate-900 flex items-center justify-center">
                          <SdgLogo customLogoUrl={logoInputUrl} size="lg" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300">
                    ✨ <strong>Tip</strong>: Setelah mengklik tombol <em>"Simpan & Terapkan Logo Baru"</em>, logo brand di bagian kiri atas website akan langsung berubah secara otomatis tanpa perlu merefresh halaman!
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: PORTFOLIO */}
          {activeTab === 'portfolio' && (


            <div className="space-y-8">
              <div className="p-6 rounded-3xl bg-[#0c1410] border border-emerald-800/40">
                <h3 className="font-display font-bold text-white text-lg mb-4">
                  {editingPortfolioId ? 'Edit Portofolio' : 'Tambah Karya Portofolio'}
                </h3>
                <form onSubmit={handleSavePortfolio} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Proyek *</label>
                      <input
                        type="text"
                        required
                        value={portfolioForm.title}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori (Isi Manual) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Desain Kaos & Lookbook"
                        value={portfolioForm.category}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Klien *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: SDG Official"
                        value={portfolioForm.client}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, client: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Kode Proyek *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: SS-2025 atau SDG-01"
                        value={portfolioForm.year}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, year: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Karya</label>
                    <textarea
                      rows={2}
                      value={portfolioForm.description}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input
                      type="file"
                      ref={portfolioFileInputRef}
                      onChange={handlePortfolioImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => portfolioFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-800 text-xs font-semibold flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Gambar</span>
                    </button>
                    <input
                      type="text"
                      placeholder="Atau link URL gambar..."
                      value={portfolioForm.imageUrl}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider"
                  >
                    Simpan Portofolio
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-[#0a100d] border border-slate-800 flex flex-col justify-between">
                    <div>
                      <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                      <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-800 mt-3 flex justify-between items-center">
                      <span className="text-[10px] text-emerald-400 font-mono">{item.client} ({item.year})</span>
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              deletePortfolio(item.id);
                              showToast('Karya portofolio berhasil dihapus!');
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-500 transition-all"
                          >
                            Ya
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold transition-all"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="text-rose-400 hover:text-rose-300"
                            title="Hapus Portofolio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingPortfolioId(item.id);
                              setPortfolioForm({
                                title: item.title,
                                category: item.category,
                                client: item.client,
                                year: item.year,
                                description: item.description,
                                imageUrl: item.imageUrl,
                                tags: item.tags,
                                stats: item.stats || ''
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-emerald-400 hover:text-emerald-300"
                            title="Edit Portofolio"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-8">
              
              {/* Form Input / Edit Layanan */}
              <div className="p-6 rounded-3xl bg-[#0c1410] border border-emerald-800/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-400" />
                    <span>{editingServiceId ? 'Edit Layanan & Tarif' : 'Tambah Layanan Baru'}</span>
                  </h3>
                  {editingServiceId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingServiceId(null);
                        setServiceForm({
                          number: '01',
                          title: '',
                          subtitle: 'Premium Service',
                          description: '',
                          features: ['High quality design', 'Professional assistance'],
                          icon: '✨',
                          startingPrice: 'Rp 150.000'
                        });
                      }}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Batal Edit / Tambah Baru
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveService} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 font-sans">No. Urut (cth: 01, 02) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 01"
                        value={serviceForm.number}
                        onChange={(e) => setServiceForm({ ...serviceForm, number: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 font-sans">Ikon Emoji (cth: 👕, ✨) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 👕"
                        value={serviceForm.icon}
                        onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 font-sans">Estimasi Tarif *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Mulai Rp 145.000 / Lusin"
                        value={serviceForm.startingPrice}
                        onChange={(e) => setServiceForm({ ...serviceForm, startingPrice: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 font-sans">Judul Layanan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Sablon Kaos Plastisol Premium"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 font-sans">Deskripsi Singkat Layanan *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Tulis deskripsi detail mengenai minimal order, jenis tinta sablon, ketebalan kain, jaminan ketepatan waktu, dll..."
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white resize-none focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 font-sans">
                      Daftar Keunggulan / Fitur Layanan (Satu Per Baris) *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Contoh:
File Master AI, PSD, CDR, & PDF
Separasi Warna Sablon Presisi
Mockup 3D Realistis untuk Promosi
Revisi hingga Sesuai Karakter Brand"
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono resize-none focus:outline-none focus:border-emerald-400"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Tuliskan keunggulan layanan, pisahkan setiap item dengan baris baru (tekan Enter).
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingServiceId ? 'Simpan Perubahan Layanan' : 'Tambah & Tayangkan Layanan'}</span>
                  </button>
                </form>
              </div>

              {/* Tabel/Grid Pengelolaan Layanan */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-white text-base">
                  Daftar Layanan & Tarif Aktif ({services.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((srv) => (
                    <div key={srv.id} className="p-5 rounded-2xl bg-[#0a100d] border border-slate-800 flex flex-col justify-between hover:border-emerald-900/50 transition-all">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-emerald-400 text-xs font-bold">No. {srv.number}</span>
                            <span className="text-sm">{srv.icon}</span>
                          </div>
                          <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">
                            {srv.startingPrice}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white font-sans">{srv.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{srv.description}</p>
                          {srv.features && srv.features.length > 0 && (
                            <div className="mt-2.5 space-y-1 pl-1.5 border-l border-emerald-500/40">
                              {srv.features.map((feat, idx) => (
                                <div key={idx} className="text-[10px] text-slate-300 flex items-center gap-1 font-mono">
                                  <span className="text-emerald-400 font-bold">•</span>
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800/60 mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => handleEditService(srv)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-400 hover:text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        {deleteConfirmId === srv.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                deleteService(srv.id);
                                showToast('Layanan berhasil dihapus!');
                                setDeleteConfirmId(null);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-[10px] font-black uppercase tracking-tight hover:bg-rose-500 transition-all"
                            >
                              Yakin?
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-semibold transition-all"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(srv.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900 hover:text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                            title="Hapus Layanan"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-8">
              
              {/* Form Input Testimoni Manual */}
              <div className="p-6 rounded-3xl bg-[#0c1410] border border-emerald-800/40">
                <h3 className="font-display font-bold text-white text-lg flex items-center gap-2 mb-4">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <span>Tambah Ulasan & Testimoni Baru</span>
                </h3>

                <form onSubmit={handleSaveTestimonial} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Dimas Satria"
                        value={testimonialForm.name}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Brand / Jabatan *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Owner Vanguard Streetwear"
                        value={testimonialForm.company}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value, role: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Penilaian Bintang (Rating) *</label>
                      <select
                        value={testimonialForm.rating}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono focus:outline-none focus:border-emerald-400"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
                        <option value="3">⭐⭐⭐ (3 Bintang)</option>
                        <option value="2">⭐⭐ (2 Bintang)</option>
                        <option value="1">⭐ (1 Bintang)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Foto Profil Ulasan *</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="file"
                          ref={testimonialFileInputRef}
                          onChange={handleTestimonialImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => testimonialFileInputRef.current?.click()}
                          className="px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-800 text-xs font-semibold flex items-center gap-1.5 shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Keterangan</span>
                        </button>
                        <input
                          type="text"
                          required
                          placeholder="Atau masukkan URL foto profil..."
                          value={testimonialForm.avatar}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, avatar: e.target.value })}
                          className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Isi Testimoni / Ulasan Klien *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tulis ulasan klien mengenai kualitas sablon, bahan kain, kaos premium, atau pelayanan desain grafis..."
                      value={testimonialForm.content}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan & Tayangkan Testimoni</span>
                  </button>
                </form>
              </div>

              {/* Daftar Ulasan Aktif */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-white text-base">
                  Daftar Ulasan & Testimoni Aktif ({testimonials.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="p-5 rounded-2xl bg-[#0a100d]/80 border border-slate-800 flex flex-col justify-between hover:border-emerald-900/50 transition-all">
                      <div>
                        {/* Rating stars display */}
                        <div className="flex items-center gap-1 mb-2 text-emerald-400 font-mono text-xs">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-300 italic mb-4 leading-relaxed">"{t.content}"</p>
                      </div>
                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={t.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                            alt={t.name}
                            className="w-9 h-9 object-cover rounded-full bg-slate-950 border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="text-xs font-bold text-white">{t.name}</div>
                            <div className="text-[10px] text-emerald-400">{t.company || t.role}</div>
                          </div>
                        </div>
                        {deleteConfirmId === t.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                deleteTestimonial(t.id);
                                showToast('Testimoni berhasil dihapus!');
                                setDeleteConfirmId(null);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-black uppercase tracking-tight hover:bg-rose-500 transition-all"
                            >
                              Hapus
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-semibold transition-all"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(t.id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900 hover:text-white transition-colors"
                            title="Hapus Testimoni"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: PROMO & TEKS RILIS (Ubah Teks Card & Badge Hero) */}
          {activeTab === 'promo' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Header Box */}
              <div className="p-6 rounded-3xl bg-[#0c1410] border border-emerald-800/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">
                      Kelola Teks Promo & Rilis Produk Baru (#admin CPanel)
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ubah tulisan pada kartu melayang & badge promo di beranda utama saat mengadakan promo khusus, diskon besar, rilis koleksi baru, atau campaign khusus.
                    </p>
                  </div>
                </div>

                {/* Preset Templates */}
                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-amber-400 block mb-2">
                    Template Cepat Promo / Rilis:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setConfigForm({
                          ...configForm,
                          promoTitle: 'SPECIAL PROMO LAUNCH',
                          promoSubtitle: 'Diskon 30% All Item / Limited Stock',
                          promoTag: 'NEW DROP',
                          promoBadgeTitle: 'RILIS PRODUK BARU',
                          promoBadgeSubtitle: 'Diskon Spesial Hari Ini & Free Gift',
                          promoStatCount: '5000+ PCS',
                          promoStatLabel: 'Kaos Laris Terjual'
                        });
                        showToast('Template "Rilis Baru & Promo Diskon" berhasil dimuat!');
                      }}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-semibold text-left transition-all flex items-center gap-1.5"
                    >
                      <span>🚀 Rilis Produk Baru</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setConfigForm({
                          ...configForm,
                          promoTitle: 'FLASH SALE 10.10 BIG DISCOUNTS',
                          promoSubtitle: 'Cashback S.D 50% & Gratis Ongkir',
                          promoTag: 'DISKON 50%',
                          promoBadgeTitle: 'FLASH SALE LAUNCH',
                          promoBadgeSubtitle: 'Stok Terbatas · Buruan Order!',
                          promoStatCount: '10.000+',
                          promoStatLabel: 'Orderan Terkirim'
                        });
                        showToast('Template "Flash Sale / Diskon" berhasil dimuat!');
                      }}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-orange-500/30 text-orange-300 text-xs font-semibold text-left transition-all flex items-center gap-1.5"
                    >
                      <span>🔥 Flash Sale & Diskon</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setConfigForm({
                          ...configForm,
                          promoTitle: 'SDG Streetwear Capsule',
                          promoSubtitle: '100% Heavyweight Cotton 240 GSM',
                          promoTag: 'SS-2025',
                          promoBadgeTitle: 'High Quality',
                          promoBadgeSubtitle: 'Katun Combed 100% Original',
                          promoStatCount: '750+',
                          promoStatLabel: 'Proyek & Kaos Terkirim'
                        });
                        showToast('Template Standar Brand berhasil dimuat!');
                      }}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-left transition-all flex items-center gap-1.5"
                    >
                      <span>✨ Standar Brand</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Input */}
              <div className="p-6 rounded-3xl bg-[#0c1410] border border-emerald-800/40 space-y-5">
                <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider text-emerald-400">
                  1. Papan Banner Promo Gambar Utama (Hero Floating Badge)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Judul Headline Promo / Rilis *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: SPECIAL PROMO 10.10 LAUNCHING"
                      value={configForm.promoTitle || ''}
                      onChange={(e) => setConfigForm({ ...configForm, promoTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tag / Badge Kanan *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: NEW DROP / DISKON 30%"
                      value={configForm.promoTag || ''}
                      onChange={(e) => setConfigForm({ ...configForm, promoTag: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Keterangan Detail / Subtitle Banner *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Diskon 30% All Item / Limited Stock Hanya Hari Ini"
                    value={configForm.promoSubtitle || ''}
                    onChange={(e) => setConfigForm({ ...configForm, promoSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-emerald-400"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider text-emerald-400 mb-4">
                    2. Kartu Pengumuman Kiri (Badge High Quality / Promo Rilis)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Judul Kartu Kiri *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: RILIS PRODUK BARU"
                        value={configForm.promoBadgeTitle || ''}
                        onChange={(e) => setConfigForm({ ...configForm, promoBadgeTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Subtitle / Keterangan Kartu Kiri *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Katun Combed 100% Original & Free Desain"
                        value={configForm.promoBadgeSubtitle || ''}
                        onChange={(e) => setConfigForm({ ...configForm, promoBadgeSubtitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider text-emerald-400 mb-4">
                    3. Kartu Angka Penjualan & Statistik Kanan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Angka / Teks Penjualan *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 5000+ PCS / 10.000+"
                        value={configForm.promoStatCount || ''}
                        onChange={(e) => setConfigForm({ ...configForm, promoStatCount: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Label Keterangan Stat *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Proyek & Kaos Terkirim"
                        value={configForm.promoStatLabel || ''}
                        onChange={(e) => setConfigForm({ ...configForm, promoStatLabel: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={() => {
                    updateSiteConfig(configForm);
                    showToast('Teks promo & rilis produk baru berhasil disimpan dan ditayangkan ke website!');
                  }}
                  className="w-full py-3.5 rounded-xl bg-emerald-400 text-black text-xs font-extrabold uppercase tracking-wider hover:bg-emerald-300 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 mt-6"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan & Tayangkan Teks Promo / Rilis</span>
                </button>
              </div>

              {/* Live Preview Card */}
              <div className="p-6 rounded-3xl bg-[#080d0b] border border-emerald-900/50 space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                  Simulasi Tampilan Live di Beranda:
                </span>

                <div className="p-4 rounded-2xl bg-[#090f0c] border border-slate-800 space-y-3">
                  {/* Floating Bottom Badge Preview */}
                  <div className="p-3.5 rounded-xl bg-[#080d0b] border border-emerald-800/40 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        {configForm.promoTitle || 'SDG Streetwear Capsule'}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono">
                        {configForm.promoSubtitle || '100% Heavyweight Cotton 240 GSM'}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-white bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                        {configForm.promoTag || 'SS-2025'}
                      </span>
                    </div>
                  </div>

                  {/* Two Cards Preview */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#0d1512] border border-emerald-700/50 flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {configForm.promoBadgeTitle || 'High Quality'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {configForm.promoBadgeSubtitle || 'Katun Combed 100% Original'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0d1512] border border-emerald-700/40">
                      <div className="text-lg font-extrabold text-emerald-400 font-mono leading-none">
                        {configForm.promoStatCount || '750+'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {configForm.promoStatLabel || 'Proyek & Kaos Terkirim'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: CONFIG */}
          {activeTab === 'config' && (

            <div className="max-w-2xl mx-auto space-y-5 p-6 rounded-3xl bg-[#0c1410] border border-emerald-800/40">
              <h3 className="font-display font-bold text-white text-base">
                Pengaturan WhatsApp & Kontak Studio
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor WhatsApp Utama (628xxxxxxxxxx) *
                </label>
                <input
                  type="text"
                  value={configForm.whatsappNumber}
                  onChange={(e) => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lead / Director</label>
                <input
                  type="text"
                  value={configForm.founderName}
                  onChange={(e) => setConfigForm({ ...configForm, founderName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bio Singkat</label>
                <textarea
                  rows={2}
                  value={configForm.bio}
                  onChange={(e) => setConfigForm({ ...configForm, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={configForm.email}
                    onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lokasi Studio</label>
                  <input
                    type="text"
                    value={configForm.address}
                    onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              {/* Manage Hero Slideshow */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
                  Slide Foto Beranda Otomatis (Slideshow Hero)
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Foto-foto di bawah ini akan ditampilkan secara bergantian otomatis di beranda utama setiap 4.5 detik. Anda dapat menambahkan foto baru (Base64 / URL) atau menghapus foto yang ada.
                </p>

                {/* List of Slide Images */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(configForm.heroImages || []).map((imgUrl, index) => (
                    <div key={index} className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-950 border border-slate-850 group">
                      <img src={imgUrl} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedSlides = (configForm.heroImages || []).filter((_, idx) => idx !== index);
                          setConfigForm({ ...configForm, heroImages: updatedSlides });
                        }}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/80 hover:bg-rose-600 text-slate-300 hover:text-white transition-all text-xs"
                        title="Hapus Foto ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/75 py-1 text-center text-[9px] font-mono text-emerald-400">
                        Slide {index + 1}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Slide Form */}
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-950/60 space-y-3">
                  <span className="text-xs font-semibold text-slate-300 block">Tambah Foto Slide Baru</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      id="newSlideUrl"
                      placeholder="Masukkan Link URL Foto..."
                      className="flex-1 px-3 py-2.5 text-xs rounded-xl bg-[#090f0c] border border-slate-850 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newSlideUrl') as HTMLInputElement;
                        const url = input?.value.trim();
                        if (!url) {
                          alert('Silakan masukkan link URL foto terlebih dahulu!');
                          return;
                        }
                        const currentSlides = configForm.heroImages || [];
                        setConfigForm({ ...configForm, heroImages: [...currentSlides, url] });
                        input.value = '';
                        showToast('Foto slide baru berhasil ditambahkan! Jangan lupa klik Simpan Perubahan di bawah.');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-400 hover:text-black text-xs font-bold transition-all shrink-0"
                    >
                      Tambah URL
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="file"
                      id="slideFileInput"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const base64 = await compressImageFile(file, 800, 0.75);
                            const currentSlides = configForm.heroImages || [];
                            setConfigForm({ ...configForm, heroImages: [...currentSlides, base64] });
                            showToast('File foto berhasil diunggah ke slide! Jangan lupa klik Simpan Perubahan di bawah.');
                          } catch (err) {
                            console.error('Error compressing slide photo:', err);
                            showToast('Gagal memproses foto slide');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('slideFileInput')?.click()}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload File Foto (Base64)</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  updateSiteConfig(configForm);
                  showToast('Profil & nomor WhatsApp diperbarui!');
                }}
                className="w-full py-3 rounded-xl bg-emerald-400 text-black text-xs font-extrabold uppercase tracking-wider hover:bg-emerald-300"
              >
                Simpan Perubahan
              </button>
            </div>
          )}

          {/* TAB: CHANNELS (Tautan Marketplace & Medsos) */}
          {activeTab === 'channels' && (
            <div className="max-w-2xl mx-auto space-y-5 p-6 rounded-3xl bg-[#0c1410] border border-emerald-800/40">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-emerald-400" />
                <span>Pengaturan Link Toko & Media Sosial</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sesuaikan nama label dan link URL tujuan untuk marketplace (Shopee, Tokopedia, TikTok, dll) atau media sosial yang tampil di bagian bawah teks sambutan beranda utama.
              </p>

              <div className="space-y-3">
                {[0, 1, 2, 3].map((index) => {
                  const currentChannels = configForm.channels || [
                    { label: 'Shopee', url: 'https://shopee.co.id' },
                    { label: 'Tokopedia', url: 'https://tokopedia.com' },
                    { label: 'Instagram', url: 'https://instagram.com' },
                    { label: 'TikTok Shop', url: 'https://tiktok.com' }
                  ];
                  // Ensure index exists
                  if (!currentChannels[index]) {
                    currentChannels[index] = { label: `Medsos ${index + 1}`, url: '#' };
                  }
                  const channel = currentChannels[index];

                  return (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-900">
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5 uppercase">Nama Label {index + 1}</label>
                        <input
                          type="text"
                          placeholder="Shopee / Tokopedia / Instagram"
                          value={channel.label}
                          onChange={(e) => {
                            const updated = [...currentChannels];
                            updated[index] = { ...channel, label: e.target.value };
                            setConfigForm({ ...configForm, channels: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#090f0c] border border-slate-850 text-white font-semibold focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div className="sm:col-span-8">
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5 uppercase">Link URL Tujuan {index + 1}</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={channel.url}
                          onChange={(e) => {
                            const updated = [...currentChannels];
                            updated[index] = { ...channel, url: e.target.value };
                            setConfigForm({ ...configForm, channels: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#090f0c] border border-slate-850 text-white font-mono focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  updateSiteConfig(configForm);
                  showToast('Tautan Marketplace & Media Sosial berhasil diperbarui!');
                }}
                className="w-full py-3 rounded-xl bg-emerald-400 text-black text-xs font-extrabold uppercase tracking-wider hover:bg-emerald-300 transition-colors"
              >
                Simpan Perubahan Tautan
              </button>
            </div>
          )}

          {/* TAB: SECURITY & SQL LOGS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Audit Trail Keamanan & Pertahanan SQL Injection</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Log aktivitas keamanan, otentikasi login, serta deteksi pencegahan payload injeksi berbahaya.
                  </p>
                </div>
                <button
                  onClick={refreshLogs}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                  title="Segarkan Log"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#0a100d] border border-emerald-900/50">
                  <div className="text-xs text-slate-400 font-semibold">Firewall Injeksi SQL</div>
                  <div className="text-emerald-400 font-bold font-mono text-base mt-1">AKTIF & TERLINDUNGI</div>
                  <div className="text-[10px] text-slate-500">Regex Filter 10 Pattern</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0a100d] border border-emerald-900/50">
                  <div className="text-xs text-slate-400 font-semibold">Enkripsi Password</div>
                  <div className="text-white font-bold font-mono text-base mt-1">SHA-256 + Salt</div>
                  <div className="text-[10px] text-slate-500">Web Crypto API Native</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0a100d] border border-emerald-900/50">
                  <div className="text-xs text-slate-400 font-semibold">Proteksi Brute Force</div>
                  <div className="text-white font-bold font-mono text-base mt-1">5 Attempts / Lockout</div>
                  <div className="text-[10px] text-slate-500">5 Menit Cooldown</div>
                </div>
              </div>

              {/* Log Table */}
              <div className="rounded-2xl border border-slate-800 bg-[#0a100d] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f1714] text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="p-3">Waktu (WIB)</th>
                      <th className="p-3">Tipe Event</th>
                      <th className="p-3">Deskripsi / Detail Audit</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px] text-slate-300">
                    {securityLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-500">
                          Belum ada catatan log keamanan tersimpan.
                        </td>
                      </tr>
                    ) : (
                      securityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/40">
                          <td className="p-3 text-slate-400">{log.timestamp}</td>
                          <td className="p-3 font-bold text-white">{log.eventType}</td>
                          <td className="p-3 text-slate-300">{log.details}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.status === 'SUCCESS'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                                : log.status === 'WARNING'
                                ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                                : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <div className="max-w-xl mx-auto space-y-5 p-6 rounded-3xl bg-[#0c1410] border border-emerald-800/40">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-white text-base">
                  Ganti Kredensial Login Admin
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Gunakan kombinasi password kuat (minimal 8 karakter dengan huruf, angka, dan simbol).
              </p>

              {passwordChangeMsg && (
                <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                  passwordChangeMsg.success 
                    ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-200' 
                    : 'bg-rose-950/80 border border-rose-600 text-rose-200'
                }`}>
                  {passwordChangeMsg.success ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  <span>{passwordChangeMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username Admin Baru *</label>
                  <input
                    type="text"
                    required
                    value={newUsernameInput}
                    onChange={(e) => setNewUsernameInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password Baru (Min. 8 Karakter) *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Konfirmasi Password Baru *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-400 text-black text-xs font-extrabold uppercase tracking-wider hover:bg-emerald-300"
                >
                  Perbarui Kredensial Login
                </button>
              </form>
            </div>
          )}

          {/* TAB: BACKUP */}
          {activeTab === 'backup' && (
            <div className="max-w-xl mx-auto space-y-6 p-6 rounded-3xl bg-[#0c1410] border border-slate-800">
              <h3 className="font-display font-bold text-white text-base">
                Cadangan Data & Pengaturan Pabrik
              </h3>

              <div className="p-4 rounded-xl bg-[#090f0c] border border-slate-800 space-y-2">
                <div className="font-semibold text-xs text-white">Ekspor Data (Backup JSON):</div>
                <p className="text-[11px] text-slate-400">
                  Unduh seluruh database produk, portofolio, dan ulasan ke file JSON untuk disimpan di komputer Anda.
                </p>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-emerald-700/50 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup JSON</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-2">
                <div className="font-semibold text-xs text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Reset ke Data Awal SDG Industries</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Kembalikan data produk dan portofolio ke konfigurasi default SDG Industries.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke pengaturan awal SDG Industries?')) {
                      resetToDefaultData();
                      showToast('Data berhasil direset!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-900/80 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Data Sekarang</span>
                </button>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};
