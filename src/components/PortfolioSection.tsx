import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PortfolioItem } from '../types';
import { ArrowUpRight, FolderGit2, Sparkles, Plus } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const { portfolio, setSelectedPortfolioModal, setCurrentView } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Karya' },
    { id: 'apparel', label: 'Desain Kaos & Lookbook' },
    { id: 'branding', label: 'Identitas Merk & Logo' },
    { id: 'uiux', label: 'UI/UX & Web Distro' },
    { id: 'packaging', label: 'Kemasan & Label Distro' },
    { id: 'merchandise', label: 'Koleksi Kapsul & Event' },
  ];

  const filteredItems = portfolio.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="portofolio" className="py-24 relative bg-[#080d0b]">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-950/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Inspired by Mockup 1: "Let's have a look at my portfolio") */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Karya & Studi Kasus</span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Our <span className="text-emerald-400">Portfolio</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Kumpulan proyek terpilih mulai dari pengarahan visual streetwear, tipografi grafis kaos, identitas merek, hingga perancangan antarmuka toko digital.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPortfolioModal(item)}
              className="group cursor-pointer rounded-2xl bg-[#0e1613]/90 border border-emerald-950 hover:border-emerald-500/50 overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/40"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute('src', '/src/assets/images/sdg_hero_streetwear_1790683209963.jpg');
                  }}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1613] via-transparent to-black/20 opacity-80" />

                {/* Client / Year Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-slate-700/40 text-[10px] text-emerald-300 font-mono">
                  {item.client} · {item.year}
                </div>

                {/* Arrow Icon */}
                <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white group-hover:bg-emerald-400 group-hover:text-black transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-slate-400 bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {item.stats && (
                    <div className="text-[11px] font-mono text-emerald-400/90 border-t border-slate-800/80 pt-3">
                      ✓ {item.stats}
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
