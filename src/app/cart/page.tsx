'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import { getProducts } from '@/lib/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Shield, Truck, Check, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { formatEGP } from '@/lib/utils';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CartPage() {
  const t = useTranslations('Cart');
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
      setPromoError(t('invalidPromo'));
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center py-20 bg-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="luxury-empty-state shadow-2xl"
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-white/5 border border-white/10 text-brand-gold">
              <Package size={36} />
            </div>
            <h1 className="text-2xl font-black mb-3 text-white font-display uppercase tracking-wide">{t('cartEmpty')}</h1>
            <p className="mb-8 max-w-xs text-center text-text-muted text-xs leading-relaxed font-semibold">
              {t('cartEmptyDesc')}
            </p>
            <Link href="/pharmacy" className="btn btn-primary btn-shimmer btn-elevated px-8 text-xs font-black uppercase tracking-wider">
              {t('startShopping')} <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Suggested picks */}
          <div className="mt-16 container-2m w-full">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-center text-text-muted">{t('popularRightNow')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {upsellProducts.map(p => (
                <Link key={p.id} href={`/product/${p.slug}`}
                  className="rounded-2xl border overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-lg glass-panel border-white/10">
                  <div className="aspect-square relative bg-white/5">
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 200px" className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-1 text-text-muted">{p.brand}</p>
                    <p className="text-xs font-semibold line-clamp-2 mb-1 text-white">{p.name}</p>
                    <p className="text-sm font-black text-brand-primary">{formatEGP(p.price)}</p>
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
      <main className="min-h-screen py-10 bg-background">
        <div className="container-2m">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black mb-8 flex items-center gap-3 text-foreground"
          >
            {t('yourCart')}
            <span className="text-xl font-semibold text-muted">{t('itemCount', { count })}</span>
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
                    className="flex gap-4 p-4 rounded-2xl border group hover:shadow-md transition-all duration-200 glass-panel border-white/10"
                  >
                    {/* Image */}
                    <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-2">
                        <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-contain p-1.5" />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5 text-muted">{item.brand}</p>
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="text-sm font-semibold line-clamp-2 hover:text-primary transition-colors text-foreground">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        {/* Qty stepper */}
                        <div className="flex items-center rounded-xl overflow-hidden border bg-white/5 border-white/10">
                          <button
                            onClick={() => item.qty <= 1 ? handleRemove(item.id) : updateQty(item.id, item.qty - 1)}
                            className="w-9 h-9 flex items-center justify-center transition-all text-muted hover:bg-surface-3"
                            aria-label={t('decreaseQty')}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-black text-foreground">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-9 h-9 flex items-center justify-center transition-all text-muted hover:bg-surface-3"
                            aria-label={t('increaseQty')}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-base font-black text-foreground">{formatEGP(item.price * item.qty)}</div>
                          {item.qty > 1 && <div className="text-[11px] text-muted">{t('each', { price: formatEGP(item.price) })}</div>}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1.5 rounded-lg transition-all text-muted hover:text-red-600 hover:bg-red-50"
                          aria-label={t('removeItem')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link href="/pharmacy"
                className="flex items-center gap-2 text-sm font-medium transition-colors mt-2 text-muted hover:text-primary"
              >
                <ShoppingBag size={14} /> {t('continueShopping')}
              </Link>

              {/* Upsell section */}
              <div className="pt-6">
                <p className="text-xs font-bold uppercase tracking-wider mb-4 text-muted">
                  {t('youMightAlsoLike')}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {upsellProducts.map(p => (
                    <Link key={p.id} href={`/product/${p.slug}`}
                      className="rounded-xl border overflow-hidden group transition-all hover:-translate-y-0.5 hover:shadow-md glass-panel border-white/10">
                      <div className="aspect-square relative bg-white/5">
                        <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 150px" className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-text-muted">{p.brand}</p>
                        <p className="text-[11px] font-semibold line-clamp-2 mb-1 text-white">{p.name}</p>
                        <p className="text-xs font-black text-brand-primary">{formatEGP(p.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border overflow-hidden glass-panel border-white/10 neon-edge">
                <div className="p-5 border-b border-white/10">
                  <h2 className="font-black text-lg text-foreground">{t('orderSummary')}</h2>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">{t('subtotal', { count })}</span>
                    <span className="font-semibold text-foreground">{formatEGP(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">{t('delivery')}</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-600 font-semibold' : 'font-semibold text-foreground'}>
                      {deliveryFee === 0 ? t('free') : formatEGP(deliveryFee)}
                    </span>
                  </div>
                  {subtotal < 500 && (
                    <div className="text-[11px] rounded-xl px-3 py-2.5 leading-relaxed bg-brand-primary-soft text-primary">
                      {t.rich('freeDeliveryPrompt', {
                        amount: formatEGP(500 - subtotal),
                        strong: (chunk) => <strong>{chunk}</strong>
                      })}
                    </div>
                  )}
                  {promoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600">{t('promo')}</span>
                      <span className="font-semibold text-emerald-600">-{formatEGP(discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between border-border">
                    <span className="font-bold text-foreground">{t('total')}</span>
                    <span className="font-black text-xl text-foreground">{formatEGP(total)}</span>
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
                          placeholder={t('promoCode')}
                          className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors bg-surface-2 border-border text-foreground placeholder-muted"
                        />
                        <button onClick={handlePromo} className="btn btn-ghost px-4 py-2 text-xs">
                          <Tag size={12} /> {t('apply')}
                        </button>
                      </div>
                      {promoError && <p className="text-red-500 text-[11px] mt-1">{promoError}</p>}
                      <p className="text-[10px] mt-1.5 text-muted">{t('tryCode', { code: '2MWELCOME' })}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                      <Check size={13} className="text-emerald-600" />
                      {t('promoApplied')}
                    </div>
                  )}
                </div>

                {/* Checkout CTA */}
                <div className="px-5 pb-5 space-y-3">
                  <Link href="/checkout" id="cart-checkout-btn" className="btn btn-primary btn-shimmer w-full py-4 text-base">
                    {t('proceedToCheckout')} <ArrowRight size={16} />
                  </Link>

                  {/* Trust row */}
                  <div className="flex items-center justify-center gap-5 text-[11px] text-muted">
                    <span className="flex items-center gap-1"><Shield size={11} className="text-primary" /> {t('secure')}</span>
                    <span className="flex items-center gap-1"><Truck size={11} className="text-[#4A7C59]" /> {t('fastDelivery')}</span>
                  </div>

                  {/* Payment badges */}
                  <div className="flex items-center justify-center gap-2 pt-2 border-t flex-wrap border-border">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-border bg-surface-2 text-text-primary">⚡ InstaPay</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-border bg-surface-2 text-text-primary">📱 Vodafone</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-border bg-surface-2 text-text-primary">🟠 e& Cash</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-border bg-surface-2 text-text-primary">💵 COD</span>
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
