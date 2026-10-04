import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, MessageCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateCartQty, removeFromCart, clearCart, siteConfig } = useData();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isCartOpen) return null;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SDGPRIME10' || code === 'SDG10') {
      setDiscountPercent(10);
      setCouponMsg({ text: 'Kupon 10% Diskon berhasil digunakan!', success: true });
    } else if (code === 'BORNSTREET' || code === 'DISTRO20') {
      setDiscountPercent(20);
      setCouponMsg({ text: 'Kupon 20% Diskon Streetwear Spesial aktif!', success: true });
    } else {
      setCouponMsg({ text: 'Kode kupon tidak valid. Gunakan: SDG10 atau BORNSTREET', success: false });
    }
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    let itemsList = '';
    cart.forEach((item, index) => {
      itemsList += `${index + 1}. ${item.product.name} (Size: ${item.selectedSize}, Warna: ${item.selectedColor}) x ${item.quantity} = ${formatIDR(item.product.price * item.quantity)}\n`;
    });

    const text = `Halo Admin SDG Industries, saya ingin checkout pesanan kaos berikut:\n\n${itemsList}\nSubtotal: ${formatIDR(rawSubtotal)}${discountPercent > 0 ? `\nDiskon (${discountPercent}%): -${formatIDR(discountAmount)}` : ''}\n*Total Pembayaran:* ${formatIDR(finalTotal)}\n\nMohon info nomor rekening / QRIS dan format data pengiriman (Nama, Alamat Lengkap, No HP). Terima kasih!`;
    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div 
        className="w-full max-w-md bg-[#0c120f] border-l border-emerald-900/50 h-full flex flex-col justify-between shadow-2xl animate-slideLeft text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-emerald-950 flex items-center justify-between bg-[#080d0b]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display text-lg font-bold text-white">
              Keranjang Belanja ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">Keranjang belanja Anda masih kosong</p>
              <p className="text-xs text-slate-400">Silakan pilih kaos favorit Anda dari showroom kami.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2 rounded-xl bg-emerald-400 text-black text-xs font-bold"
              >
                Jelajahi Koleksi Kaos
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="p-3.5 rounded-2xl bg-[#111a16] border border-emerald-950/80 flex gap-3.5 items-center justify-between"
              >
                {/* Thumb */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0"
                  referrerPolicy="no-referrer"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate mb-1">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-emerald-300 font-mono">
                      Size: {item.selectedSize}
                    </span>
                    <span>{item.selectedColor}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {formatIDR(item.product.price)}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Hapus item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800">
                    <button
                      onClick={() => updateCartQty(item.product.id, item.selectedSize, item.selectedColor, -1)}
                      className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-mono font-semibold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.product.id, item.selectedSize, item.selectedColor, 1)}
                      className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-emerald-950 bg-[#080d0b] space-y-4">
            
            {/* Coupon input */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kode Kupon (Coba: SDG10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs uppercase font-mono rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-800 text-xs font-semibold"
                >
                  Pakai
                </button>
              </div>
              {couponMsg && (
                <p className={`text-[10px] ${couponMsg.success ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} item):</span>
                <span className="font-mono text-slate-200">{formatIDR(rawSubtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Diskon Promo ({discountPercent}%):</span>
                  <span className="font-mono">-{formatIDR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-800">
                <span>Total Pembayaran:</span>
                <span className="font-mono text-emerald-400 text-base">{formatIDR(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout via WhatsApp Button */}
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Checkout Langsung via WhatsApp</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={clearCart}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline"
              >
                Kosongkan Keranjang
              </button>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all"
              >
                Tutup
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
