import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What does SDG Industries produce?",
      answer: "We produce premium heavyweight t-shirts, oversize streetwear tees, custom graphic hoodies, crewnecks, lookbooks, and high-quality streetwear apparel accessories."
    },
    {
      question: "Does SDG Industries manufacture custom apparel?",
      answer: "Yes, we offer full-scale custom apparel manufacturing, maklon, and private label production services. We handle everything from pattern design, grading, cutting, screen printing, to final sewing and packaging."
    },
    {
      question: "Where is SDG Industries located?",
      answer: "Our creative showroom and main manufacturing facilities are located in Bandung & Jakarta, Indonesia, which are the main hubs of streetwear apparel production."
    },
    {
      question: "Does SDG Industries work with clothing brands?",
      answer: "Absolutely! We specialize in supporting independent streetwear labels, clothing brands, local distros, merchandise creators, and corporate clients looking for high-end fashion standards."
    },
    {
      question: "What types of apparel can be produced?",
      answer: "We specialize in heavy-knit streetwear garments including 16s and 24s Cotton Combed heavyweight tees, vintage acid wash garments, drop-shoulder designs, boxy fit hoodies, and custom streetwear catalog assets."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-[#060908] relative overflow-hidden border-t border-emerald-950/60">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pertanyaan Umum · FAQ</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-3">
            Dapatkan jawaban cepat seputar produksi apparel, bahan katun, minimal order, dan jaminan mutu dari SDG Industries.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="rounded-2xl border border-emerald-950/80 bg-[#0c1310]/50 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 text-white hover:text-emerald-400 transition-colors"
                >
                  <span className="font-display font-bold text-sm sm:text-base">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-emerald-950/40 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
