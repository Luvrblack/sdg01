import React from 'react';
import { useData } from '../context/DataContext';
import { Layers, Shirt, Tag, Layout, ArrowRight, Check } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services, siteConfig } = useData();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="w-6 h-6 text-emerald-400" />;
      case 'Shirt':
        return <Shirt className="w-6 h-6 text-emerald-400" />;
      case 'Tag':
        return <Tag className="w-6 h-6 text-emerald-400" />;
      case 'Layout':
        return <Layout className="w-6 h-6 text-emerald-400" />;
      default:
        // Safely render emoji/short text directly
        if (iconName && iconName.trim().length <= 4) {
          return <span className="text-xl leading-none block font-sans">{iconName}</span>;
        }
        return <Layout className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section id="layanan" className="py-24 relative bg-[#080d0b]">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
              <span className="w-4 h-0.5 bg-emerald-400"></span>
              Layanan Spesialis
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Our <span className="text-emerald-400">Apparel Production</span>
            </h2>
          </div>
          
          <p className="text-slate-400 text-sm sm:text-base max-w-md">
            Membantu distro, brand owner, dan kreator mewujudkan produk apparel berkualitas tinggi dari tahap konsep grafis hingga produksi jadi.
          </p>
        </div>

        {/* Services Grid (Clean 3-col apparel services grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-2xl bg-[#0f1714]/80 border border-emerald-900/30 p-7 hover:border-emerald-500/50 hover:bg-[#131f1a]/90 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-lg shadow-black/30"
            >
              <div>
                {/* Header with Icon and Editorial Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 rounded-xl bg-emerald-950/80 border border-emerald-700/40 flex items-center justify-center p-3 group-hover:scale-110 group-hover:border-emerald-400 transition-all">
                    {getServiceIcon(service.icon)}
                  </div>
                  <span className="font-mono text-sm font-semibold text-emerald-500/70">
                    {service.number}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs font-medium text-emerald-400/90 mb-4">
                  {service.subtitle}
                </p>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-6 border-t border-slate-800/60 pt-4">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Tag & Action */}
              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">Estimasi</div>
                  <div className="text-xs font-bold text-white font-mono">{service.startingPrice}</div>
                </div>

                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=Halo%20SDG%20Industries,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#0b1c15] border border-emerald-500/20 text-emerald-300 hover:bg-emerald-400 hover:text-black hover:border-emerald-400 transition-all flex flex-col items-center justify-center gap-1 group/wa"
                  title="Konsultasi & Order via WhatsApp"
                >
                  <svg className="w-5 h-5 text-[#25D366] fill-current group-hover/wa:text-black transition-colors" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.752.002-2.607-1.013-5.059-2.859-6.908C16.632 2.1 14.212.921 11.602.921 6.162.921 1.737 5.293 1.734 10.676c-.001 1.636.43 3.224 1.251 4.634l-.982 3.585 3.673-.951zm12.38-5.31c-.344-.171-2.034-1.002-2.348-1.116-.314-.115-.544-.172-.773.172-.229.343-.887 1.116-1.087 1.344-.2.228-.4.257-.744.086-1.367-.681-2.278-1.096-3.197-2.684-.242-.416-.242-.718-.071-.889.154-.154.344-.4.516-.6.172-.2.229-.343.344-.571.115-.229.057-.429-.028-.6-.086-.171-.773-1.857-1.059-2.543-.278-.669-.562-.578-.773-.589-.2-.01-.429-.011-.658-.011s-.6.086-.915.429c-.315.343-1.202 1.171-1.202 2.857 0 1.686 1.229 3.314 1.4 3.543.172.229 2.417 3.671 5.857 5.143.818.35 1.457.56 1.957.718.822.26 1.57.223 2.161.135.659-.098 2.034-.828 2.32-1.628.285-.8.285-1.486.2-1.628-.085-.14-.314-.228-.658-.4z"/>
                  </svg>
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 group-hover/wa:text-slate-900 mt-0.5">Chat Admin</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
