import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { StreetwearBanner } from './components/StreetwearBanner';
import { ProductsShowcase } from './components/ProductsShowcase';
import { PortfolioSection } from './components/PortfolioSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PortfolioModal } from './components/PortfolioModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminPortalPage } from './components/admin/AdminPortalPage';
import { Lock, MessageCircle, ArrowUp } from 'lucide-react';

const MainApp: React.FC = () => {
  const { currentView, setCurrentView, isAdminLoggedIn, siteConfig } = useData();

  React.useEffect(() => {
    // 1. Matikan Klik Kanan (Context Menu Blocker)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Matikan Shortcut Keyboard Inspeksi Elemen & View Source
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 key
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const metaOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      // Ctrl+Shift+I / Cmd+Option+I (Inspect)
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      // Ctrl+Shift+C / Cmd+Option+C (Inspect element selection tool)
      // Ctrl+U / Cmd+Option+U (View Source)
      // Ctrl+S / Cmd+S (Save Page)
      if (
        metaOrCtrl && 
        (e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c') ||
         e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ROUTE 1: Dedicated Admin Portal Area
  if (currentView === 'admin') {
    if (!isAdminLoggedIn) {
      return <AdminLoginPage />;
    }
    return <AdminPortalPage />;
  }

  // ROUTE 2: Public Store & Portfolio Website
  return (
    <div className="min-h-screen bg-[#080d0b] text-slate-100 selection:bg-emerald-500 selection:text-black relative">
      {/* Navigation Top Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <HeroSection />
        <ProductsShowcase />
        <ServicesSection />
        <StreetwearBanner />
        <PortfolioSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals & Drawers */}
      <ProductDetailModal />
      <PortfolioModal />
      <CartDrawer />

      {/* Floating Quick Action Widget (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 items-end">
        {/* Floating WhatsApp Quick Button */}
        <a
          href={`https://wa.me/${siteConfig.whatsappNumber}?text=Halo%20SDG%20Industries,%20saya%20tertarik%20dengan%20produk%20kaos%20dan%20layanan%20apparel`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black shadow-xl shadow-emerald-500/30 transition-all hover:scale-110 active:scale-95"
          title="Chat WhatsApp Admin SDG"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition-all"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}
