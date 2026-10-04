import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { X, ShoppingBag, MessageCircle, Star, ShieldCheck, Truck, RotateCcw, Check, ZoomIn } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductModal, setSelectedProductModal, addToCart, siteConfig } = useData();

  // Initialize hooks before early return
  const [selectedSize, setSelectedSize] = useState<string>(selectedProductModal?.sizes[0] || 'L');
  const [selectedColor, setSelectedColor] = useState<string>('Black'); // Default to Black
  const [displayImage, setDisplayImage] = useState<string>(selectedProductModal?.imageUrl || '');
  const [qty, setQty] = useState<number>(1);
  const [showSizeChart, setShowSizeChart] = useState<boolean>(false);
  const [showDetails] = useState<boolean>(true);

  // Zoom & Lightbox State for PC & HP
  const [isHoverZoom, setIsHoverZoom] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxScale, setLightboxScale] = useState<number>(1.5);
  const [lightboxPan, setLightboxPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingLightbox, setIsDraggingLightbox] = useState<boolean>(false);
  const [lightboxDragStart, setLightboxDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const toggleLightbox = () => {
    setIsLightboxOpen(!isLightboxOpen);
    setLightboxScale(1.5);
    setLightboxPan({ x: 0, y: 0 });
  };

  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);


  const fallbackImg = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';

  useEffect(() => {
    if (selectedProductModal) {
      setDisplayImage(selectedProductModal.imageUrl || fallbackImg);
      if (selectedProductModal.sizes && selectedProductModal.sizes.length > 0) {
        setSelectedSize(selectedProductModal.sizes[0]);
      }
      setQty(1);
    }
  }, [selectedProductModal]);

  if (!selectedProductModal) return null;

  const product = selectedProductModal;


  // Helper to handle color selection and image switching
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (color === 'White') {
      setDisplayImage('/src/assets/images/sdg_tshirt_white_minimal_1790683235920.jpg');
    } else {
      setDisplayImage(product.imageUrl); // Default back to original
    }
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleWhatsAppOrder = () => {
    const text = `Halo Admin SDG Industries, saya ingin memesan:\n\n*Produk:* ${product.name}\n*Ukuran:* ${selectedSize}\n*Warna:* ${selectedColor}\n*Jumlah:* ${qty} pcs\n*Harga Satuan:* ${formatIDR(product.price)}\n*Total:* ${formatIDR(product.price * qty)}\n\nMohon informasi ketersediaan stok & ongkir. Terima kasih!`;
    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const fullChart = (siteConfig.sizeChart && siteConfig.sizeChart.length > 0)
    ? siteConfig.sizeChart
    : [
        { size: 'S', width: '48 cm', length: '70 cm', sleeve: '22 cm' },
        { size: 'M', width: '52 cm', length: '72 cm', sleeve: '23 cm' },
        { size: 'L', width: '56 cm', length: '75 cm', sleeve: '24 cm' },
        { size: 'XL', width: '60 cm', length: '77 cm', sleeve: '25 cm' },
        { size: 'XXL', width: '64 cm', length: '79 cm', sleeve: '26 cm' },
        { size: 'XXXL', width: '68 cm', length: '81 cm', sleeve: '27 cm' },
        { size: 'XXXXL', width: '72 cm', length: '83 cm', sleeve: '28 cm' },
        { size: 'XXXXXL', width: '76 cm', length: '85 cm', sleeve: '29 cm' },
      ];

  // Strictly filter & generate size chart rows matching ONLY this product's actual input sizes!
  const sizeChartData = product.sizes.map(s => {
    const cleanS = String(s).toUpperCase().trim();
    const globalFound = fullChart.find(r => r.size.toUpperCase().trim() === cleanS);
    if (globalFound) return globalFound;
    return { size: String(s).toUpperCase().trim(), width: '52 cm', length: '72 cm', sleeve: '23 cm' };
  });



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-6xl bg-[#0d1411] border border-emerald-800/40 rounded-3xl overflow-hidden shadow-2xl my-8 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductModal(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-emerald-950 transition-all border border-slate-700/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left: Product Image Column - Full & Unrestricted */}
          <div className="md:col-span-7 bg-slate-950 p-3 sm:p-5 flex items-center justify-center relative">
            <div 
              className="relative aspect-square w-full rounded-2xl overflow-hidden border border-emerald-950 shadow-2xl group cursor-zoom-in bg-slate-950"
              onMouseEnter={() => setIsHoverZoom(true)}
              onMouseLeave={() => setIsHoverZoom(false)}
              onMouseMove={handleMouseMove}
              onClick={toggleLightbox}
            >
              {displayImage ? (
                <img
                  src={displayImage || product.imageUrl || fallbackImg}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-100 ease-out"
                  style={
                    isHoverZoom ? {
                      transform: 'scale(2)',
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                    } : {
                      transform: 'scale(1)',
                      transformOrigin: 'center center'
                    }
                  }
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== fallbackImg) {
                      target.src = fallbackImg;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600 text-xs">No Image</div>
              )}

              {/* GSM Badge */}
              <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-emerald-400 text-[10px] font-mono px-2.5 py-0.5 rounded border border-emerald-900/50">
                {product.gsm}
              </div>

              {/* Interactive Zoom Badge Overlay */}
              <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md text-emerald-300 text-[10px] font-semibold px-2.5 py-1 rounded-xl border border-emerald-800/50 flex items-center gap-1.5 shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ketuk / Hover untuk Zoom</span>
              </div>
            </div>

          </div>

          {/* Right: Product Details & Purchase Configuration */}
          <div className="md:col-span-5 p-4 sm:p-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-emerald-950/40">
            <div className="flex-1">
              {showDetails && (
                <>

                  {/* Rating & Sold Info */}
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <div className="flex items-center gap-0.5 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-500 font-normal">({product.soldCount} Sold)</span>
                    </div>
                    <span className="text-emerald-400 font-mono text-[9px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      Stok: {product.stock}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-base sm:text-xl font-bold text-white mb-1.5">
                    {product.name}
                  </h2>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-mono text-lg sm:text-2xl font-black text-white">
                      {formatIDR(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-slate-500 line-through">
                        {formatIDR(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[10px] text-slate-300 leading-normal mb-3 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Material Spec */}
                  <div className="p-2 rounded-xl bg-[#080d0b] border border-emerald-950 mb-3 text-[10px] space-y-0.5">
                    <div className="text-slate-400 flex justify-between">
                      <span>Material:</span>
                      <strong className="text-slate-200">{product.material}</strong>
                    </div>
                    <div className="text-slate-400 flex justify-between">
                      <span>Fitting:</span>
                      <strong className="text-slate-200">Boxy Fit</strong>
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-300">Pilih Ukuran:</span>
                      <button
                        onClick={() => setShowSizeChart(!showSizeChart)}
                        className="text-[11px] text-emerald-400 hover:underline font-medium"
                      >
                        {showSizeChart ? 'Tutup Panduan Size' : '📏 Lihat Size Chart'}
                      </button>
                    </div>

                    {/* Size Chart Drawer */}
                    {showSizeChart && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-emerald-900/40 mb-3 text-[11px] animate-fadeIn">
                        <table className="w-full text-left font-mono">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-800">
                              <th className="pb-1">Size</th>
                              <th className="pb-1">Lebar</th>
                              <th className="pb-1">Panjang</th>
                              <th className="pb-1">Lengan</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-300 divide-y divide-slate-800/60">
                            {sizeChartData.map((row) => (
                              <tr key={row.size}>
                                <td className="py-1 font-bold text-emerald-400">{row.size}</td>
                                <td className="py-1">{row.width}</td>
                                <td className="py-1">{row.length}</td>
                                <td className="py-1">{row.sleeve}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="flex flex-row gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                      {['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'XXXXXL'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`flex-shrink-0 px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all border-none ${
                            selectedSize === s
                              ? 'bg-slate-950 text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                              : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Qty Counter */}
                  <div className="flex items-center gap-4 mb-6">

                    <span className="text-xs font-semibold text-slate-300">Jumlah:</span>
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="px-3 py-1 text-slate-300 hover:bg-slate-800 transition-colors font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-mono font-bold text-white min-w-[32px] text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(qty + 1)}
                        className="px-3 py-1 text-slate-300 hover:bg-slate-800 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons: Add to Cart, Instant WhatsApp Order, & Marketplace */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    addToCart(product, selectedSize, selectedColor, qty);
                    setSelectedProductModal(null);
                  }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1.5 sm:px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-700/50 text-[10px] sm:text-xs font-bold transition-all active:scale-95 text-center leading-tight"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Keranjang</span>
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1.5 sm:px-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-[10px] sm:text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 text-center leading-tight"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>WhatsApp</span>
                </button>

                <a
                  href={product.marketplaceUrl || siteConfig.shopeeUrl || 'https://shopee.co.id'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1.5 sm:px-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-[10px] sm:text-xs font-black transition-all shadow-[0_0_12px_rgba(234,88,12,0.3)] active:scale-95 text-center leading-tight"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-orange-200 shrink-0" />
                  <span>Marketplace</span>
                </a>
              </div>

              <div className="text-center pt-0.5">
                <span className="text-[10px] text-slate-500">
                  Transaksi aman via transfer Bank BCA / Mandiri / QRIS & WhatsApp Admin SDG
                </span>
              </div>

              <button
                onClick={() => setSelectedProductModal(null)}
                className="w-full py-2.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-98"
              >
                Tutup
              </button>
            </div>



          </div>

        </div>
      </div>

      {/* Fullscreen Zoom Lightbox Modal for PC & Mobile */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex flex-col justify-between p-3 sm:p-5 animate-fadeIn text-white"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header Bar */}
          <div className="flex items-center justify-between z-10 p-2 sm:p-4 border border-slate-800/80 bg-[#080d0b]/90 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
              <span className="font-display font-bold text-xs sm:text-base text-white truncate">{product.name}</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                {Math.round(lightboxScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setLightboxScale(prev => Math.min(3.5, prev + 0.5))}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-200 rounded-xl border border-slate-700 font-bold text-sm flex items-center justify-center transition-all"
                title="Perbesar Zoom"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setLightboxScale(prev => Math.max(1, prev - 0.5))}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-200 rounded-xl border border-slate-700 font-bold text-sm flex items-center justify-center transition-all"
                title="Perkecil Zoom"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => { setLightboxScale(1); setLightboxPan({ x: 0, y: 0 }); }}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-300 rounded-xl border border-slate-700 text-[10px] sm:text-xs font-mono transition-all"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 sm:p-2 bg-rose-950/90 hover:bg-rose-900 active:scale-95 text-rose-300 rounded-xl border border-rose-800/60 transition-all ml-1"
                title="Tutup Zoom"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Image Container (Pannable & Zoomable) */}
          <div 
            className="flex-1 flex items-center justify-center overflow-hidden relative my-3 sm:my-4 cursor-grab active:cursor-grabbing touch-none select-none"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => {
              setIsDraggingLightbox(true);
              setLightboxDragStart({ x: e.clientX - lightboxPan.x, y: e.clientY - lightboxPan.y });
            }}
            onMouseMove={(e) => {
              if (!isDraggingLightbox) return;
              setLightboxPan({ x: e.clientX - lightboxDragStart.x, y: e.clientY - lightboxDragStart.y });
            }}
            onMouseUp={() => setIsDraggingLightbox(false)}
            onMouseLeave={() => setIsDraggingLightbox(false)}
            onTouchStart={(e) => {
              if (e.touches.length === 1) {
                setIsDraggingLightbox(true);
                setLightboxDragStart({ x: e.touches[0].clientX - lightboxPan.x, y: e.touches[0].clientY - lightboxPan.y });
              }
            }}
            onTouchMove={(e) => {
              if (!isDraggingLightbox || e.touches.length !== 1) return;
              setLightboxPan({ x: e.touches[0].clientX - lightboxDragStart.x, y: e.touches[0].clientY - lightboxDragStart.y });
            }}
            onTouchEnd={() => setIsDraggingLightbox(false)}
          >
            <div 
              className="max-w-full max-h-full transition-transform duration-75 ease-out flex items-center justify-center"
              style={{
                transform: `translate(${lightboxPan.x}px, ${lightboxPan.y}px) scale(${lightboxScale})`,
                transformOrigin: 'center center'
              }}
            >
              <img
                src={displayImage || product.imageUrl || fallbackImg}
                alt={product.name}
                className="max-w-[90vw] max-h-[75vh] object-contain rounded-2xl shadow-2xl pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Lightbox Footer Instruction */}
          <div className="text-center text-[10px] sm:text-xs text-slate-400 py-2 border border-slate-800/80 bg-[#080d0b]/90 rounded-2xl shadow">
            <span>🖐️ Geser/Drag foto untuk melihat detail • Gunakan tombol + / - untuk mengatur tingkat zoom</span>
          </div>
        </div>
      )}
    </div>

  );
};
