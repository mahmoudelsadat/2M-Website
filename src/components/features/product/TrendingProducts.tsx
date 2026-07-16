'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Star, ArrowRight, Zap, Check, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Product } from '@/lib/data';
import { getProducts } from '@/lib/api';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { formatEGP, calcDiscount } from '@/lib/utils';
import { toast } from 'sonner';
import QuickViewModal from '@/components/features/product/QuickViewModal';
import { useTranslations } from 'next-intl';

const TABS = [
  { labelKey: 'tabAll' as const,   value: 'all' },
  { labelKey: 'tabPharmacy' as const,   value: 'pharmacy' },
  { labelKey: 'tabBeauty' as const,     value: 'beauty' },
  { labelKey: 'tabWellness' as const,   value: 'wellness' },
  { labelKey: 'tabPersonal' as const,   value: 'personal-care' },
  { labelKey: 'tabSale' as const,    value: 'sale' },
];

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((s) => (
          <Star key={s} size={11} className={s <= Math.round(rating) ? 'fill-brand-gold text-brand-gold' : 'text-star-empty'} />
        ))}
      </div>
      <span className="text-[11px] text-muted">({reviewCount.toLocaleString()})</span>
    </div>
  );
}

const BADGE_MAP: Record<string, { labelKey: 'badgeSale' | 'badgeNew' | 'badgeHot' | 'badgeRxPick'; className: string }> = {
  sale:              { labelKey: 'badgeSale',      className: 'badge badge-primary' },
  new:               { labelKey: 'badgeNew',       className: 'badge badge-sage' },
  hot:               { labelKey: 'badgeHot',    className: 'badge badge-gold-soft' },
  'pharmacist-pick': { labelKey: 'badgeRxPick', className: 'badge badge-sky' },
};

function ProductCard({ product, onQuickView }: { product: Product; onQuickView: (p: Product) => void }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.has(product.id));
  const [added, setAdded] = useState(false);
  const discount = product.originalPrice ? calcDiscount(product.price, product.originalPrice) : 0;
  const badge = product.badge ? BADGE_MAP[product.badge] : null;
  const t = useTranslations('Product');

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    toast.success(t('addedToCart'), { description: product.name, duration: 2000 });
    setTimeout(() => setAdded(false), 2000);
  }, [addItem, product, t]);

  return (
    <motion.div
      className="product-card group"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="product-card-image">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {badge && <span className={badge.className}>{t(badge.labelKey)}</span>}
          {discount > 0 && <span className="badge badge-primary">-{discount}%</span>}
        </div>

        {/* Wishlist */}
        <motion.button
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center"
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          aria-label={wishlisted ? t('removeFromWishlist') : t('addToWishlist')}
        >
          <Heart size={13} className={wishlisted ? 'fill-primary text-primary' : 'text-muted'} />
        </motion.button>

        {/* Low stock */}
        {product.stockCount && product.stockCount < 15 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-bold text-step-2-text bg-surface/90 rounded-full px-2.5 py-1 shadow-sm">
            <Zap size={9} className="fill-current" /> {t('onlyLeft', { count: product.stockCount })}
          </div>
        )}

        {/* Hover actions */}
        <div className="product-card-actions flex gap-2">
          <motion.button
            onClick={handleAddToCart}
            className={`btn flex-1 text-xs py-2.5 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 ${added ? 'bg-emerald-500 border-emerald-500 text-white' : 'btn-primary'}`}
            whileTap={{ scale: 0.96 }}
          >
            {added ? <><Check size={12} /> {t('added')}</> : <><ShoppingCart size={12} /> {t('addToCart')}</>}
          </motion.button>
          <motion.button
            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
            className="w-10 rounded-lg border border-border bg-surface/80 text-muted-foreground flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            aria-label={t('quickView')}
          >
            <Eye size={14} />
          </motion.button>
        </div>
      </div>

      {/* Body */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="product-card-body">
          <p className="text-[11px] text-muted dark:text-slate-300 font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
          <h3 className="text-[0.875rem] font-semibold text-foreground dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[1.05rem] font-black text-foreground dark:text-white">{formatEGP(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted dark:text-slate-400 line-through">{formatEGP(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const PAGE_SIZE = 8;

export default function TrendingProducts() {
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Product');

  useEffect(() => {
    getProducts({ pageSize: 100 }).then(res => setProductsList(res.items)).catch(err => console.error(err));
  }, []);

  const allFiltered = productsList.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'sale') return !!(p.badge === 'sale' || p.originalPrice);
    return p.category === activeTab;
  });

  const displayed = allFiltered.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < allFiltered.length;

  // Infinite scroll observer
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPage((p) => p + 1);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, displayed.length]);

  return (
    <section className="py-16 bg-background transition-colors">
      <div className="container-2m">
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-label">{t('bestSellers')}</div>
            <h2 className="section-title">{t('trendingProducts')}</h2>
          </div>
          <Link href="/pharmacy" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            {t('viewAll')} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-7 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <motion.button
              key={tab.value}
              id={`filter-${tab.value}`}
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[0.8rem] font-semibold transition-colors duration-200 ${
                activeTab === tab.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-2 text-muted-foreground hover:bg-surface-3 hover:text-foreground'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {t(tab.labelKey)}
            </motion.button>
          ))}
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {displayed.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center pt-10">
            <div className="flex gap-2">
              {[0,1,2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}

        {!hasMore && displayed.length > PAGE_SIZE && (
          <p className="text-center text-sm text-muted pt-8">
            {t('allProductsShown', { count: allFiltered.length })}
          </p>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
