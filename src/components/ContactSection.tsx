import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MessageCircle, Mail, MapPin, Send, CheckCircle2, ArrowRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { siteConfig } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Desain Grafis Kaos',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    // Trigger WhatsApp formatted link
    const text = `Halo Admin SDG Industries,\n\nNama: ${formData.name}\nEmail: ${formData.email || '-'}\nNo HP: ${formData.phone || '-'}\nKebutuhan: ${formData.serviceType}\nPesan: ${formData.message}\n\nSaya ingin konsultasi proyek / pemesanan.`;
    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section id="kontak" className="py-24 bg-[#080d0b] relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Inspired by Mockup 1: "Let's talk") */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Contact <span className="text-emerald-400">SDG Industries</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Tertarik untuk berkolaborasi merancang produk clothing atau memesan kaos premium SDG Industries?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info & Quick Direct Access */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#0e1613]/90 border border-emerald-950/80 space-y-6">
              <h3 className="font-display text-xl font-bold text-white">
                Kontak & Studio Kreatif
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Kami siap membantu Anda dari tahap konsultasi bahan katun, pemilihan teknik sablon, hingga visual branding distro.
              </p>

              <div className="space-y-4 pt-2">
                
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 hover:border-emerald-500/60 transition-all text-slate-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">WhatsApp Resmi</div>
                    <div className="text-xs font-bold text-white font-mono">+{siteConfig.whatsappNumber}</div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#090f0c] border border-slate-800/80 hover:border-emerald-700/50 transition-all text-slate-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 group-hover:text-emerald-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Email Inquiry</div>
                    <div className="text-xs font-bold text-white font-mono">{siteConfig.email}</div>
                  </div>
                </a>

                {/* Studio Location */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#090f0c] border border-slate-800/80 text-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Pusat Produksi & Workshop</div>
                    <div className="text-xs font-semibold text-white">{siteConfig.address}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0e1613]/90 border border-emerald-950/80 shadow-2xl">
              
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">Pesan Berhasil Terkirim!</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    WhatsApp Anda telah diarahkan ke tim admin SDG Industries. Kami akan segera merespons dalam hitungan menit.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-400 text-black text-xs font-bold"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Adrian Wijaya"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-950/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-950/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Nomor WhatsApp / HP
                      </label>
                      <input
                        type="tel"
                        placeholder="0812xxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-950/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Kebutuhan / Layanan
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-950/80 text-white text-xs focus:outline-none focus:border-emerald-400 transition-colors"
                      >
                        <option value="Desain Grafis Kaos">Desain Grafis Kaos & Apparel</option>
                        <option value="Produksi Kaos Heavyweight">Produksi Kaos Maklon Heavyweight</option>
                        <option value="Brand Identity & Packaging">Brand Identity & Label Distro</option>
                        <option value="Pembelian Grosir / Reseller">Pembelian Grosir / Reseller</option>
                        <option value="Website Portofolio / Toko">Pembuatan Website Toko Online</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Pesan atau Keterangan Proyek *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Jelaskan kebutuhan kaos Anda, jumlah quantity, konsep desain, atau pertanyaan lainnya..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-950/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-[0.99]"
                  >
                    <span>Kirim Pesan ke WhatsApp Admin SDG</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
