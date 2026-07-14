'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, ShoppingCart, Heart, Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { type Product } from '@/lib/data';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { formatEGP, calcDiscount } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewProps) {
  const t = useTranslations('QuickView');
  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => product ? s.has(product.id) : false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [product, onClose]);

  if (!product) return null;
  const discount = product.originalPrice ? calcDiscount(product.price, product.originalPrice) : 0;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          <motion.div
            className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm transition-all hover:scale-105"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="flex items-center justify-center p-8 bg-background">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={208}
                  height={208}
                  className="object-contain drop-shadow-md"
                />
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col gap-4">
                {/* Brand + badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-widest">{product.brand}</span>
                  {product.badge && (
                    <span className="badge badge-primary text-[10px]">{product.badge.toUpperCase()}</span>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-xl font-black text-foreground leading-snug">{product.name}</h2>

                {/* Stars */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={13} className={s <= Math.round(product.rating) ? 'fill-brand-gold text-brand-gold' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-sm text-muted">{product.rating} {t('reviews', { count: product.reviewCount })}</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-foreground">{formatEGP(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm text-muted line-through">{formatEGP(product.originalPrice)}</span>
                      <span className="badge badge-primary">-{discount}%</span>
                    </>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{product.description}</p>
                )}

                {/* Stock */}
                {product.inStock === false ? (
                  <div className="text-sm font-semibold text-red-500">{t('outOfStock')}</div>
                ) : (
                  <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    {t('inStock')} {product.stockCount ? `· ${t('onlyLeft', { count: product.stockCount })}` : ''}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-2">
                  <button
                    onClick={() => {
                      addItem(product, 1);
                      toast.success(t('addedToCart'), { description: product.name });
                      onClose();
                    }}
                    disabled={product.inStock === false}
                    className="btn btn-primary flex-1"
                  >
                    <ShoppingCart size={15} /> {t('addToCart')}
                  </button>
                  <button
                    onClick={() => toggle(product.id)}
                    className="w-11 h-11 rounded-xl border border-border flex items-center justify-center transition-all hover:border-primary"
                    aria-label="Toggle wishlist"
                  >
                    <Heart size={16} className={wishlisted ? 'fill-primary text-primary' : 'text-muted'} />
                  </button>
                </div>

                {/* View full page */}
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
                >
                  {t('viewFullDetails')} <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
