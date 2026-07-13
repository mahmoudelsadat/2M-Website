'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { getProducts } from '@/lib/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Shield, Truck, Check, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { formatEGP } from '@/lib/utils';
import { useEffect } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQty, totalItems, subtotal: getSubtotal } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [upsellProducts, setUpsellProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts({ pageSize: 4 }).then(res => setUpsellProducts(res.items)).catch(err => console.error(err));
  }, []);

  const subtotal = getSubtotal();
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - discount;
  const count = totalItems();

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => { removeItem(id); setRemovingId(null); }, 320);
  };

  const handlePromo = () => {
    if (promoCode.toUpperCase() === '2MWELCOME') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try 2MWELCOME for 10% off!');
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center py-20" style={{ background: 'var(--color-page-bg)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="text-center"
          >
            <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'var(--color-brand-primary-soft)' }}>
              <Package size={44} style={{ color: 'var(--color-brand-primary)' }} />
            </div>
            <h1 className="text-3xl font-black mb-3" style={{ color: 'var(--color-text-primary)' }}>Your cart is empty</h1>
            <p className="mb-8 max-w-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
              Looks like you haven&apos;t added anything yet. Browse our premium health & wellness products!
            </p>
            <Link href="/pharmacy" className="btn btn-primary btn-shimmer btn-elevated px-10 text-base">
              Start Shopping <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Suggested picks */}
          <div className="mt-16 container-2m w-full">
            <h2 className="text-lg font-bold mb-5 text-center" style={{ color: 'var(--color-text-secondary)' }}>Popular right now</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {upsellProducts.map(p => (
                <Link key={p.id} href={`/product/${p.slug}`}
                  className="rounded-2xl border overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <div className="aspect-square relative" style={{ background: 'var(--color-surface-2)' }}>
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 200px" className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>{p.brand}</p>
                    <p className="text-xs font-semibold line-clamp-2 mb-1" style={{ color: 'var(--color-text-primary)' }}>{p.name}</p>
                    <p className="text-sm font-black" style={{ color: 'var(--color-brand-primary)' }}>{formatEGP(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
        <FloatingButtons />
        <MobileBottomNav />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-10" style={{ background: 'var(--color-page-bg)' }}>
        <div className="container-2m">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black mb-8 flex items-center gap-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Your Cart
            <span className="text-xl font-semibold" style={{ color: 'var(--color-text-muted)' }}>({count} items)</span>
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: removingId === item.id ? 0 : 1, x: removingId === item.id ? -40 : 0, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="flex gap-4 p-4 rounded-2xl border group hover:shadow-md transition-all duration-200"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                  >
                    {/* Image */}
                    <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                        <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-contain p-1.5" />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-muted)' }}>{item.brand}</p>
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="text-sm font-semibold line-clamp-2 hover:text-[var(--color-brand-primary)] transition-colors" style={{ color: 'var(--color-text-primary)' }}>
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        {/* Qty stepper */}
                        <div className="flex items-center rounded-xl overflow-hidden border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                          <button
                            onClick={() => item.qty <= 1 ? handleRemove(item.id) : updateQty(item.id, item.qty - 1)}
                            className="w-9 h-9 flex items-center justify-center transition-all"
                            style={{ color: 'var(--color-text-muted)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-3)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-9 h-9 flex items-center justify-center transition-all"
                            style={{ color: 'var(--color-text-muted)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-3)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-base font-black" style={{ color: 'var(--color-text-primary)' }}>{formatEGP(item.price * item.qty)}</div>
                          {item.qty > 1 && <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{formatEGP(item.price)} each</div>}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1.5 rounded-lg transition-all"
                          style={{ color: 'var(--color-text-muted)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.background = '#FEF2F2'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link href="/pharmacy"
                className="flex items-center gap-2 text-sm font-medium transition-colors mt-2"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-brand-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                <ShoppingBag size={14} /> Continue Shopping
              </Link>

              {/* Upsell section */}
              <div className="pt-6">
                <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  You might also like
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {upsellProducts.map(p => (
                    <Link key={p.id} href={`/product/${p.slug}`}
                      className="rounded-xl border overflow-hidden group transition-all hover:-translate-y-0.5 hover:shadow-md"
                      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                      <div className="aspect-square relative" style={{ background: 'var(--color-surface-2)' }}>
                        <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 150px" className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-muted)' }}>{p.brand}</p>
                        <p className="text-[11px] font-semibold line-clamp-2 mb-1" style={{ color: 'var(--color-text-primary)' }}>{p.name}</p>
                        <p className="text-xs font-black" style={{ color: 'var(--color-brand-primary)' }}>{formatEGP(p.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <h2 className="font-black text-lg" style={{ color: 'var(--color-text-primary)' }}>Order Summary</h2>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--color-text-muted)' }}>Subtotal ({count} items)</span>
                    <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{formatEGP(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--color-text-muted)' }}>Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-600 font-semibold' : 'font-semibold'}
                      style={deliveryFee > 0 ? { color: 'var(--color-text-primary)' } : undefined}>
                      {deliveryFee === 0 ? 'FREE 🎉' : formatEGP(deliveryFee)}
                    </span>
                  </div>
                  {subtotal < 500 && (
                    <div className="text-[11px] rounded-xl px-3 py-2.5 leading-relaxed" style={{ background: 'var(--color-brand-primary-soft)', color: 'var(--color-brand-primary)' }}>
                      Add <strong>{formatEGP(500 - subtotal)}</strong> more for free delivery
                    </div>
                  )}
                  {promoApplied && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#16a34a' }}>Promo (10% off)</span>
                      <span className="font-semibold" style={{ color: '#16a34a' }}>-{formatEGP(discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Total</span>
                    <span className="font-black text-xl" style={{ color: 'var(--color-text-primary)' }}>{formatEGP(total)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="px-5 pb-5">
                  {!promoApplied ? (
                    <div>
                      <div className="flex gap-2 mb-1">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                          onKeyDown={(e) => e.key === 'Enter' && handlePromo()}
                          placeholder="Promo code"
                          className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors"
                          style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                        />
                        <button onClick={handlePromo} className="btn btn-ghost px-4 py-2 text-xs">
                          <Tag size={12} /> Apply
                        </button>
                      </div>
                      {promoError && <p className="text-red-500 text-[11px] mt-1">{promoError}</p>}
                      <p className="text-[10px] mt-1.5" style={{ color: 'var(--color-text-muted)' }}>Try code: <strong>2MWELCOME</strong></p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                      <Check size={13} className="text-emerald-600" />
                      Promo applied — 10% off!
                    </div>
                  )}
                </div>

                {/* Checkout CTA */}
                <div className="px-5 pb-5 space-y-3">
                  <Link href="/checkout" id="cart-checkout-btn" className="btn btn-primary btn-shimmer w-full py-4 text-base">
                    Proceed to Checkout <ArrowRight size={16} />
                  </Link>

                  {/* Trust row */}
                  <div className="flex items-center justify-center gap-5 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="flex items-center gap-1"><Shield size={11} style={{ color: 'var(--color-brand-primary)' }} /> Secure</span>
                    <span className="flex items-center gap-1"><Truck size={11} style={{ color: '#4A7C59' }} /> Fast Delivery</span>
                  </div>

                  {/* Payment badges */}
                  <div className="flex items-center justify-center gap-2 pt-2 border-t flex-wrap" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border" style={{ borderColor: '#7C3AED', color: '#7C3AED', background: '#F5F3FF' }}>⚡ InstaPay</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border" style={{ borderColor: '#DC2626', color: '#DC2626', background: '#FEF2F2' }}>📱 Vodafone</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border" style={{ borderColor: '#D97706', color: '#D97706', background: '#FFFBEB' }}>🟠 e& Cash</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border" style={{ borderColor: '#16a34a', color: '#16a34a', background: '#F0FDF4' }}>💵 COD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
