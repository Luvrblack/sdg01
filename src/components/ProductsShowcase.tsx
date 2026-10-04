import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import { ShoppingBag, Eye, Star, Sparkles, Filter, Plus } from 'lucide-react';

export const ProductsShowcase: React.FC = () => {
  const { products, setSelectedProductModal, addToCart, setCurrentView } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'heavyweight', label: 'Heavyweight (240 GSM)' },
    { id: 'oversize', label: 'Oversize Streetwear' },
    { id: 'vintage', label: 'Acid Wash & Vintage' },
    { id: 'minimalist', label: 'Minimalist Emblem' },
    { id: 'limited', label: 'Limited Edition' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat = activeCategory === 'all' || prod.category === activeCategory;
      const matchSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.material.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section id="koleksi-kaos" className="py-24 relative bg-[#090e0c]">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Showroom Kaos Distro Premium</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Custom Clothing & <span className="text-emerald-400">Streetwear</span>
            </h2>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-emerald-950/60">
          
          {/* Interactive Category Segmented Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] sm:w-64">
            <input
              type="text"
              placeholder="Cari kaos, bahan, GSM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
            />
            <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

        </div>

        {/* Products Grid - 2 columns on mobile (HP) like modern e-commerce */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-950/40 rounded-3xl border border-slate-800">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Tidak ada produk yang cocok</h3>
            <p className="text-xs text-slate-400 mb-4">Coba ganti kata kunci pencarian atau kategori filter.</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative rounded-xl sm:rounded-2xl bg-[#0f1714]/90 border border-emerald-950/70 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-950/50 hover:-translate-y-1"
              >
                
                {/* Top Image Container - 1:1 Square on PC & Mobile */}
                <div className="relative aspect-square overflow-hidden bg-slate-950">

                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallback = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                  />

                  
                  {/* Subtle Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1714] via-transparent to-black/20 opacity-80" />

                  {/* Badges on Image */}
                  <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-wrap gap-1">
                    {product.tag && (
                      <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded bg-emerald-500 text-black text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider">
                        {product.tag}
                      </span>
                    )}
                    <span className="px-1 py-0.5 sm:px-2 sm:py-0.5 rounded bg-black/70 backdrop-blur-md text-slate-300 text-[8px] sm:text-[10px] font-mono border border-slate-700/50">
                      {product.gsm}
                    </span>
                  </div>

                  {/* Stock Status Badge */}
                  <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3">
                    <span className={`px-1 py-0.5 sm:px-2 sm:py-0.5 rounded text-[8px] sm:text-[10px] font-semibold backdrop-blur-md ${
                      product.stock > 10 
                        ? 'bg-slate-900/80 text-emerald-400 border border-emerald-800/40' 
                        : 'bg-amber-950/80 text-amber-300 border border-amber-700/40'
                    }`}>
                      Stok: {product.stock}
                    </span>
                  </div>

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <button
                      onClick={() => setSelectedProductModal(product)}
                      className="p-2 sm:p-3 rounded-xl bg-slate-900/90 text-white hover:bg-emerald-400 hover:text-black border border-emerald-600/40 transition-all"
                      title="Lihat Detail & Size Chart"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => addToCart(product, product.sizes[0] || 'L', product.colors[0] || 'Black')}
                      className="p-2 sm:p-3 rounded-xl bg-emerald-400 text-black hover:bg-emerald-300 font-bold transition-all shadow-lg shadow-emerald-500/30"
                      title="Beli Cepat (Tambah ke Keranjang)"
                    >
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* Product Content Details */}
                <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating & Sold Info */}
                    <div className="flex items-center justify-between text-[9px] sm:text-xs text-slate-400 mb-1 sm:mb-2">
                      <div className="flex items-center gap-0.5 sm:gap-1 text-amber-400 font-semibold">
                        <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                      <span className="text-[8px] sm:text-[11px] text-slate-500">
                        {product.soldCount}+ Sold
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => setSelectedProductModal(product)}
                      className="font-display text-[11px] sm:text-base font-bold text-white mb-1 sm:mb-2 line-clamp-2 hover:text-emerald-400 cursor-pointer transition-colors leading-tight sm:leading-snug"
                    >
                      {product.name}
                    </h3>

                    {/* Material & Fit */}
                    <p className="hidden sm:block text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {product.material}
                    </p>

                    {/* Available Sizes List */}
                    <div className="flex items-center gap-1 mb-2 sm:mb-5 flex-wrap">
                      <span className="text-[8px] sm:text-[10px] text-slate-500 uppercase">Size:</span>
                      {product.sizes.slice(0, 4).map((s) => (
                        <span key={s} className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-[8px] sm:text-[10px] font-mono text-slate-300">
                          {s}
                        </span>
                      ))}
                      {product.sizes.length > 4 && (
                        <span className="text-[8px] text-slate-500">+</span>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Button Footer */}
                  <div className="pt-2 sm:pt-4 border-t border-slate-800/80 flex items-center justify-between gap-1">
                    <div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-[8px] sm:text-[11px] text-slate-500 line-through leading-none">
                          {formatIDR(product.originalPrice)}
                        </div>
                      )}
                      <div className="text-[11px] sm:text-base font-extrabold text-emerald-400 font-mono leading-none mt-0.5 sm:mt-1">
                        {formatIDR(product.price)}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedProductModal(product)}
                      className="px-2 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-emerald-950/70 border border-emerald-700/40 text-emerald-300 hover:bg-emerald-400 hover:text-black hover:border-emerald-400 text-[9px] sm:text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                    >
                      <span>Beli</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}


      </div>
    </section>
  );
};
