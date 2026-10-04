import React, { useState, useEffect } from 'react';
import { SdgLogo } from './SdgLogo';
import { useData } from '../context/DataContext';
import { ShoppingBag, ArrowUpRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cart, setIsCartOpen, setCurrentView, siteConfig } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global secret admin keybind (Ctrl+Shift+A or Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setCurrentView('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentView]);

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Koleksi Kaos', href: '#koleksi-kaos' },
    { label: 'Portofolio', href: '#portofolio' },
    { label: 'Testimoni', href: '#testimoni' },
    { label: 'Kontak', href: '#kontak' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#080d0b]/90 backdrop-blur-md border-b border-emerald-950/40 py-3 shadow-lg shadow-black/40' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <a href="#beranda" className="flex items-center gap-2 group transition-transform active:scale-95">
          <SdgLogo size="md" />
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-emerald-400 transition-colors relative py-1 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Keranjang Belanja"
            className="relative p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-900/80 border border-emerald-900/40 text-slate-200 hover:text-emerald-400 hover:border-emerald-500/50 transition-all active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[9px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-[#080d0b]">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Shopee Online Shop CTA - Icon only on mobile */}
          <a
            href={siteConfig.shopeeUrl || 'https://shopee.co.id/user/account/profile'}
            target="_blank"
            rel="noopener noreferrer"
            title="Online Shop (Shopee)"
            className="p-1.5 sm:px-3.5 sm:py-2 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg sm:rounded-xl transition-all shadow-[0_0_12px_rgba(234,88,12,0.3)] active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="hidden sm:inline">Online Shop</span>
          </a>


          {/* Quick Contact WhatsApp CTA */}
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=Halo%20SDG%20Industries,%20saya%20tertarik%20dengan%20produk%20dan%20layanan%20apparel`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Hubungi Kami</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
            className="md:hidden p-1.5 rounded-lg sm:rounded-xl bg-slate-900/80 border border-emerald-900/40 text-slate-300 hover:text-emerald-400 active:scale-95 transition-all flex items-center justify-center"
            title={isMobileMenuOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
          >
            {isMobileMenuOpen ? (
              <X className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Menu className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Inline Navigation Menu Bar with Close Button */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-[#060b09]/95 backdrop-blur-md border-t border-emerald-950/60 mt-1.5 px-1.5 py-1 flex items-center gap-1 overflow-x-auto scrollbar-none transition-all">
          <nav className="flex-1 flex items-center justify-between gap-0.5 sm:gap-1 min-w-0">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex-1 min-w-0 px-1 py-1 rounded-md sm:rounded-lg bg-slate-900/80 hover:bg-emerald-950/80 border border-slate-800/80 hover:border-emerald-600/50 text-slate-300 hover:text-emerald-400 text-[8.5px] sm:text-[10px] font-bold transition-all whitespace-nowrap text-center active:scale-95 leading-none truncate"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Dedicated Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Tutup Menu Navigasi"
            className="px-1.5 py-1 rounded-md bg-rose-950/80 border border-rose-800/60 text-rose-300 hover:bg-rose-800 hover:text-white text-[8.5px] font-bold transition-all shrink-0 flex items-center gap-0.5 active:scale-95"
            title="Tutup Menu Navigasi"
          >
            <X className="w-3 h-3 text-rose-400" />
            <span>Tutup</span>
          </button>
        </div>
      )}


    </header>

  );
};
