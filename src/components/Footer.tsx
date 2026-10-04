import React from 'react';
import { useData } from '../context/DataContext';
import { SdgLogo } from './SdgLogo';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteConfig, setCurrentView } = useData();

  return (
    <footer className="bg-[#050807] border-t border-emerald-950/80 text-slate-400 text-xs relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-4">
            <a href="#beranda" className="inline-block">
              <SdgLogo size="md" />
            </a>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              SDG Industries adalah rumah kreatif spesialis desain grafis streetwear, konveksi kaos premium 100% cotton combed kualitas tinggi, dan packaging apparel eksklusif.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Cotton Combed • Heavyweight 240 GSM
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#beranda" className="hover:text-emerald-400 transition-colors">Beranda</a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-emerald-400 transition-colors">Layanan & Produksi</a>
              </li>
              <li>
                <a href="#koleksi-kaos" className="hover:text-emerald-400 transition-colors">Showroom Kaos Distro</a>
              </li>
              <li>
                <a href="#portofolio" className="hover:text-emerald-400 transition-colors">Portofolio Desain</a>
              </li>
              <li>
                <a href="#testimoni" className="hover:text-emerald-400 transition-colors">Testimoni Klien</a>
              </li>
              <li>
                <a
                  href={siteConfig.shopeeUrl || 'https://shopee.co.id/user/account/profile'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors font-bold flex items-center gap-1"
                >
                  <span>Online Shop (Shopee)</span>
                </a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-emerald-400 transition-colors">Hubungi Kami</a>
              </li>
            </ul>
          </div>

          {/* Studio Info */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Studio & Workshop
            </h4>
            
            <div className="text-slate-400 space-y-1.5 text-xs">
              <p><strong className="text-slate-200">Pusat Workshop:</strong> {siteConfig.address}</p>
              <p><strong className="text-slate-200">WhatsApp:</strong> +{siteConfig.whatsappNumber}</p>
              <p><strong className="text-slate-200">Email:</strong> {siteConfig.email}</p>
              <p><strong className="text-slate-200">Jam Operasional:</strong> Senin - Sabtu (09.00 - 21.00 WIB)</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar - Center Aligned & Compact Font */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col items-center justify-center text-center gap-2 text-[10px] text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-1.5 leading-relaxed">
            <span>© {new Date().getFullYear()} SDG INDUSTRIES. Hak Cipta Dilindungi Undang-Undang.</span>
            <span className="text-emerald-400 font-semibold">• Pengembang Stigma Network 2026</span>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap text-slate-500/80">
            <span>Redefine Boundaries, Embrace Your True Identity</span>
            <span aria-hidden="true">·</span>
            {/* Discreet discrete access dot for admin without public badge */}
            <button
              onClick={() => setCurrentView('admin')}
              className="text-slate-700 hover:text-emerald-500 transition-colors font-mono cursor-default hover:cursor-pointer"
              title="Akses Pengelola"
            >
              •
            </button>
          </div>
        </div>



      </div>
    </footer>
  );
};
