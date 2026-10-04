import React from 'react';
import { useData } from '../context/DataContext';
import { X, Calendar, User, Tag, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

export const PortfolioModal: React.FC = () => {
  const { selectedPortfolioModal, setSelectedPortfolioModal, siteConfig } = useData();

  if (!selectedPortfolioModal) return null;

  const item = selectedPortfolioModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#0d1411] border border-emerald-800/50 rounded-3xl overflow-hidden shadow-2xl my-8 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedPortfolioModal(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-slate-300 hover:text-white hover:bg-emerald-950 transition-all border border-slate-700/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image preview */}
        <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1411] via-transparent to-black/30" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-3 py-1 rounded-md bg-emerald-500 text-black text-xs font-bold uppercase tracking-wider">
              {item.category.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {item.title}
            </h2>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Klien: <strong className="text-white">{item.client}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Tahun: <strong className="text-white">{item.year}</strong></span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">
              Deskripsi & Konsep Desain
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Key Deliverables & Tags */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">
              Lingkup Pekerjaan / Tag
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-800/40 px-3 py-1 rounded-lg"
                >
                  <Tag className="w-3 h-3 text-emerald-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Key Outcome / Stat */}
          {item.stats && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/40 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs text-slate-200">
                <strong className="text-emerald-400 font-semibold block">Hasil / Dampak Proyek:</strong>
                {item.stats}
              </div>
            </div>
          )}

          {/* CTA Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Ingin membuat proyek serupa untuk brand clothing Anda?
            </span>

            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=Halo%20SDG%20Industries,%20saya%20tertarik%20dengan%20portofolio%20${encodeURIComponent(item.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 text-black text-xs font-bold hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasikan via WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
