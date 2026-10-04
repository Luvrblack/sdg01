import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ArrowUpRight, Download, CheckCircle2, Sparkles, ShoppingBag, ShieldCheck, Flame } from 'lucide-react';
import { SdgLogo } from './SdgLogo';

export const HeroSection: React.FC = () => {
  const { siteConfig } = useData();
  const slides = siteConfig.heroImages || [
    '/src/assets/images/sdg_hero_streetwear_1790683209963.jpg'
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500); // Rotate every 4.5 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section id="beranda" className="relative min-h-[90vh] pt-32 pb-20 overflow-hidden flex items-center">
      {/* Emerald Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-radial-emerald pointer-events-none -z-10 blur-3xl opacity-70" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Typography & Intro (Inspire by Image 1 "Hi! Efat") */}
          <div className="lg:col-span-6 flex flex-col items-start order-2 lg:order-1">

            
            {/* Logo Brand Emblem - Hero Showcase */}
            <div className="mb-5 flex items-center gap-3">
              <SdgLogo size="lg" showText={false} className="animate-pulse" />
              <div className="h-8 w-[1px] bg-slate-800"></div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-mono">Official Brand Identity</span>
            </div>

            {/* Quiet Kick-off Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 text-[10px] sm:text-xs font-semibold mb-6 shadow-sm whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0 animate-pulse" />
              <span>Support Local Produk</span>
            </div>

            {/* Main Greeting / Headline */}
            <h1 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Apparel & Streetwear <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 text-lg sm:text-2xl lg:text-3xl tracking-wider uppercase whitespace-nowrap inline-block">MOVE DIFFERENT</span>
            </h1>


            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-6 sm:w-8 h-0.5 bg-emerald-400"></span>
              <h2 className="text-xs sm:text-lg font-semibold text-emerald-300 tracking-wide font-display">
                About SDG Industries
              </h2>
            </div>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl mb-6">
              {siteConfig.bio}
            </p>

            {/* Action CTA Buttons - Ultra Compact & Centered */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full max-w-xs sm:max-w-sm mb-6 mx-auto">
              <a
                href={siteConfig.shopeeUrl || 'https://shopee.co.id/user/account/profile'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 px-1.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-[9px] sm:text-[10px] transition-all shadow-sm active:scale-95 text-center truncate leading-none"
              >
                <ShoppingBag className="w-3 h-3 text-white shrink-0" />
                <span>Online Shop</span>
              </a>

              <a
                href="#kontak"
                className="flex items-center justify-center gap-1 px-1.5 py-1.5 rounded-xl bg-emerald-400 text-black font-bold text-[9px] sm:text-[10px] hover:bg-emerald-300 transition-all shadow-sm active:scale-95 text-center truncate leading-none"
              >
                <span>Diskusi</span>
              </a>

              <a
                href="#koleksi-kaos"
                className="flex items-center justify-center gap-1 px-1.5 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-800/50 text-emerald-300 hover:text-white hover:bg-emerald-950/40 hover:border-emerald-500/60 font-bold text-[9px] sm:text-[10px] transition-all active:scale-95 text-center truncate leading-none"
              >
                <span>Katalog</span>
              </a>
            </div>




            {/* Apparel Specs & Creative Tool Stack */}
            <div className="pt-6 border-t border-slate-800/70 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-300 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span>Support Local Produk · Premium 100% Cotton</span>
              </div>


              {/* Design Tool Stack Icons / Custom Marketplaces & Social Medias */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full max-w-md mx-auto sm:mx-0 items-center justify-center text-center">
                {(siteConfig.channels || [
                  { label: 'Shopee', url: 'https://shopee.co.id' },
                  { label: 'Tokopedia', url: 'https://tokopedia.com' },
                  { label: 'Instagram', url: 'https://instagram.com' },
                  { label: 'TikTok Shop', url: 'https://tiktok.com' }
                ]).map((chan, idx) => (
                  <a
                    key={chan.label + idx}
                    href={chan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-1.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl font-mono text-[9px] sm:text-[10px] text-emerald-400 font-bold transition-all hover:scale-105 text-center truncate"
                  >
                    {chan.label}
                  </a>
                ))}
              </div>
            </div>


          </div>

          {/* Right Column: Hero Visual & Quantitative Stat Cards (Inspired by Mockup Image 1) */}
          <div className="lg:col-span-6 relative flex justify-center items-center order-1 lg:order-2">

                        {/* Center Portrait / Apparel Showcase Container */}
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[28px] overflow-hidden bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 p-[2px] shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)] group transition-all duration-500 hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.75)]">
              <div className="relative w-full h-full rounded-[26px] overflow-hidden bg-[#070b09]">
                
                {/* Auto-rotating Images */}
                {slides.map((slideSrc, index) => (
                  <img
                    key={slideSrc + index}
                    src={slideSrc}
                    alt={`SDG Streetwear Models & Lead Showcase ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover filter brightness-95 contrast-105 transition-all duration-1000 ease-in-out ${
                      index === currentSlide 
                        ? 'opacity-100 scale-100 group-hover:scale-105' 
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                ))}

                {/* Pagination Indicators */}
                {slides.length > 1 && (
                  <div className="absolute top-4 right-4 z-20 flex gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-white/5">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === currentSlide ? 'bg-emerald-400 w-3.5' : 'bg-slate-500/50 hover:bg-slate-400'
                        }`}
                        title={`Slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Cyber Glow Overlays & Scanline */}
                <div className="absolute inset-0 bg-emerald-400/0 group-hover:bg-emerald-400/10 mix-blend-color-dodge transition-all duration-500 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080d0b] via-transparent to-transparent opacity-80" />

                {/* Floating Bottom Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#080d0b]/85 backdrop-blur-md border border-emerald-800/40 flex items-center justify-between z-10">
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      {siteConfig.promoTitle || 'SDG Streetwear Capsule'}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono">
                      {siteConfig.promoSubtitle || '100% Heavyweight Cotton 240 GSM'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      {siteConfig.promoTag || 'SS-2025'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Quantitative Stat Cards around the portrait */}
            
            {/* Stat 1: Brand Logo Emblem (Top Right) */}
            <div className="absolute -top-6 -right-2 sm:right-2 p-3.5 rounded-2xl bg-[#0d1512]/95 backdrop-blur-md border border-emerald-500/40 shadow-xl shadow-emerald-500/15 animate-bounce-slow flex items-center justify-center w-[64px] h-[72px]">
              <SdgLogo size="sm" showText={false} />
            </div>

            {/* Stat 2: Projects / Promo Sales Stat Card (Middle Right) */}
            <div className="absolute top-1/2 -right-4 sm:right-0 -translate-y-1/2 p-3.5 rounded-2xl bg-[#0d1512]/95 backdrop-blur-md border border-emerald-700/40 shadow-xl shadow-black/50">
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                {siteConfig.promoStatCount || siteConfig.projectsDelivered || '750+'}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {siteConfig.promoStatLabel || 'Proyek & Kaos Terkirim'}
              </div>
            </div>

            {/* Stat 3: Sustainable & Premium Cotton / Release Promo Badge */}
            <div className="absolute bottom-24 sm:bottom-28 -left-3 sm:-left-6 p-3 sm:p-3.5 rounded-2xl bg-[#0d1512]/95 backdrop-blur-md border border-emerald-700/50 shadow-2xl shadow-black/70 flex items-center gap-3 z-20 hover:scale-105 transition-transform">
              <div className="p-2 rounded-xl bg-emerald-950/90 border border-emerald-600/50 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display text-sm sm:text-base font-bold text-white">
                  {siteConfig.promoBadgeTitle || 'High Quality'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {siteConfig.promoBadgeSubtitle || 'Katun Combed 100% Original'}
                </div>
              </div>
            </div>


          </div>

        </div>
      </div>
    </section>
  );
};
