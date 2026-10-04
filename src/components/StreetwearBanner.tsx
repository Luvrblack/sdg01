import React from 'react';
import { useData } from '../context/DataContext';
import { ArrowRight, Leaf, Shield, CheckCircle } from 'lucide-react';
import { SdgLogo } from './SdgLogo';

export const StreetwearBanner: React.FC = () => {
  const { siteConfig } = useData();

  return (
    <section className="py-12 bg-[#060908] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Visual Banner Container with Hero Lookbook */}
        <div className="relative rounded-3xl overflow-hidden border border-emerald-900/40 bg-gradient-to-r from-[#0d1411] via-[#09100d] to-[#0d1411] shadow-2xl">
          
          {/* Background Streetwear Lookbook image with overlay */}
          <div className="relative min-h-[460px] md:min-h-[520px] flex items-center">
            
            <img
              src="/src/assets/images/sdg_hero_streetwear_1790683209963.jpg"
              alt="BORN FROM THE STREET - SDG Industries"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity filter contrast-125"
              referrerPolicy="no-referrer"
            />
            
            {/* Dark Aesthetic Scrim & Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#060908]/95 via-[#060908]/80 to-[#060908]/90" />
            <div className="absolute inset-0 bg-radial-emerald opacity-50" />

            <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Big Headline & Brand Vision */}
              <div className="lg:col-span-8 space-y-6">
                
                <div className="flex items-center gap-3">
                  <SdgLogo size="sm" showText={false} />
                  <h2 className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono font-bold">
                    Why Work With SDG Industries
                  </h2>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                    BORN <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">FROM THE</span>
                  </h3>
                  <h3 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-slate-300 uppercase tracking-tighter leading-none">
                    STREET
                  </h3>
                </div>

                <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                  Lahir dari denyut kultur jalanan dan dedikasi pada kualitas bahan terbaik. Setiap helai kaos SDG Industries diproduksi dengan presisi tinggi untuk kenyamanan harian dan karakter yang tak tertandingi.
                </p>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#koleksi-kaos"
                    className="inline-flex items-center gap-3 px-7 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95"
                  >
                    <span>SHOP NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber}?text=Halo%20SDG%20Industries,%20saya%20ingin%20membuat%20kaos%20custom%20dengan%20bahan%20heavyweight`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-emerald-700/50 text-emerald-300 hover:text-white font-semibold text-sm rounded-xl transition-all"
                  >
                    <span>Produksi Custom / Maklon</span>
                  </a>
                </div>

              </div>

              {/* Right Column: 3 Icon Specs Cards (Matching Image 3: 100% Cotton, Sustainable, Premium T-Shirt) */}
              <div className="lg:col-span-4 flex flex-col gap-3.5">
                
                {/* Spec 1 */}
                <div className="p-4 rounded-2xl bg-[#0f1814]/90 border border-emerald-800/40 backdrop-blur-md flex items-center gap-4 group hover:border-emerald-500/60 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/90 border border-emerald-700/50 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-white text-sm">100% COTTON COMBED</div>
                    <div className="text-[11px] text-slate-400">Serat katun murni tebal, sejuk, dan tidak berbulu.</div>
                  </div>
                </div>

                {/* Spec 2 */}
                <div className="p-4 rounded-2xl bg-[#0f1814]/90 border border-emerald-800/40 backdrop-blur-md flex items-center gap-4 group hover:border-emerald-500/60 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/90 border border-emerald-700/50 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-white text-sm">SUSTAINABLE MATERIAL</div>
                    <div className="text-[11px] text-slate-400">Pewarna bersertifikasi aman dan ramah lingkungan.</div>
                  </div>
                </div>

                {/* Spec 3 */}
                <div className="p-4 rounded-2xl bg-[#0f1814]/90 border border-emerald-800/40 backdrop-blur-md flex items-center gap-4 group hover:border-emerald-500/60 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/90 border border-emerald-700/50 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-white text-sm">PREMIUM T-SHIRT FIT</div>
                    <div className="text-[11px] text-slate-400">Pola boxy streetwear modern dengan rib leher kokoh.</div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
