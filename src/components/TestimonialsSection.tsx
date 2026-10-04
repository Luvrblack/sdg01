import React from 'react';
import { useData } from '../context/DataContext';
import { Star, CheckCircle, Quote, MessageSquare } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, siteConfig } = useData();

  return (
    <section id="testimoni" className="py-24 bg-[#090e0c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-semibold mb-3">
            <Quote className="w-3.5 h-3.5" />
            <span>Ulasan & Testimoni Nyata</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
            Apa Kata <span className="text-emerald-400">Klien & Pembeli</span>
          </h2>

          <p className="text-slate-400 text-sm">
            Pengalaman langsung dari para pemilik distro, brand manager, dan pelanggan setia SDG Industries.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-7 rounded-2xl bg-[#0e1613]/90 border border-emerald-950/80 hover:border-emerald-700/50 transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review content */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{t.content}"
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-emerald-500/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    {t.name}
                    {t.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-emerald-400/90 font-medium">
                    {t.role} · <span className="text-slate-400">{t.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
