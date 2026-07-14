'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  SlidersHorizontal, X, ChevronDown, ChevronUp,
  Grid3X3, List, Star, Heart, ShoppingCart, Zap, Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Product, type Category } from '@/lib/data';
import { getProducts, getCategories } from '@/lib/api';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { formatEGP, calcDiscount } from '@/lib/utils';
import { useTranslation } from '@/lib/LanguageContext';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface FilterState {
  priceMin: number;
  priceMax: number;
  rating: number;
  brands: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  priceMin: 0, priceMax: 5000,
  rating: 0, brands: [],
  inStockOnly: false, onSaleOnly: false,
};

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b pb-4 mb-4 border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-bold mb-3 transition-colors text-foreground"
      >
        {title}
        {open
          ? <ChevronUp size={14} className="text-muted" />
          : <ChevronDown size={14} className="text-muted" />
        }
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      className={`w-9 h-5 rounded-full transition-all duration-200 relative flex-shrink-0 cursor-pointer ${checked ? 'bg-primary' : 'bg-surface-3'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${checked ? 'left-4' : 'left-0.5'}`} />
    </div>
  );
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11} className={s <= Math.round(rating) ? 'fill-brand-gold text-brand-gold' : 'text-border'} />
      ))}
      <span className="text-[11px] text-muted">({reviewCount.toLocaleString()})</span>
    </div>
  );
}

function ProductCard({ product, view }: { product: Product; view: 'grid' | 'list' }) {
  const t = useTranslations('CategoryPage');
  const addItem = useCartStore((s) => s.addItem);
  const toggle  = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.has(product.id));
  const [added, setAdded] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const discount = product.originalPrice ? calcDiscount(product.price, product.originalPrice) : 0;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    toast.success(t('added'), { description: product.name, duration: 2000 });
    setTimeout(() => setAdded(false), 2000);
  }, [addItem, product, t]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggle(product.id);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
  }, [toggle, product.id]);

  if (view === 'list') {
    return (
      <div className="product-card product-card--list group">
        <div className="product-card-image relative" style={{ width: '160px', flexShrink: 0 }}>
          <Image src={product.image} alt={product.name} fill
            sizes="160px"
            className="transition-transform duration-500 group-hover:scale-105 object-contain p-4" />
          {discount > 0 && <span className="badge badge-primary absolute top-2 left-2">-{discount}%</span>}
        </div>
        <div className="product-card-body" style={{ flex: 1, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1 text-muted">{product.brand}</p>
            <Link href={`/product/${product.slug}`}>
              <h3 className="text-sm font-semibold mb-2 hover:text-primary transition-colors text-foreground">
                {product.name}
              </h3>
            </Link>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-foreground">{formatEGP(product.price)}</span>
              {product.originalPrice && <span className="text-xs line-through text-muted">{formatEGP(product.originalPrice)}</span>}
            </div>
            <button
              onClick={handleAddToCart}
              className={`btn text-xs py-2 px-4 ${added ? 'bg-emerald-500 text-white border-emerald-500' : 'btn-primary'}`}
            >
              {added ? <><Check size={12} /> {t('added')}</> : <><ShoppingCart size={12} /> {t('addToCart')}</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="product-card group"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="product-card-image">
        <Image src={product.image} alt={product.name} fill
          sizes="(max-width: 768px) 50vw, 250px"
          className="transition-transform duration-500 group-hover:scale-105 object-contain p-4" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {discount > 0 && <span className="badge badge-primary">-{discount}%</span>}
          {product.badge === 'new' && <span className="badge badge-sage">NEW</span>}
          {product.badge === 'pharmacist-pick' && <span className="badge badge-sky">✅ Pick</span>}
          {product.badge === 'hot' && <span className="badge badge-gold-soft">🔥 HOT</span>}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border ${heartAnim ? 'heart-pop' : ''}`}
          style={{
            background: wishlisted ? 'var(--color-brand-primary-soft)' : 'var(--color-surface)',
            borderColor: wishlisted ? 'var(--color-brand-primary)' : 'var(--color-border)',
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={13} className={wishlisted ? 'fill-primary text-primary' : 'text-muted'} />
        </button>

        {/* Low stock indicator */}
        {product.stockCount && product.stockCount < 15 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-bold rounded-full px-2.5 py-1"
            style={{ background: 'var(--color-surface)', color: '#D4856A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Zap size={9} className="fill-current" /> {t('onlyLeft', { count: product.stockCount })}
          </div>
        )}

        {/* Hover add to cart */}
        <div className="product-card-actions flex gap-2">
          <button
            onClick={handleAddToCart}
            className={`btn flex-1 text-xs py-2.5 transition-all duration-200 ${added ? 'bg-emerald-500 border-emerald-500 text-white' : 'btn-primary'}`}
          >
            {added ? <><Check size={12} /> {t('added')}</> : <><ShoppingCart size={12} /> {t('addToCart')}</>}
          </button>
        </div>
      </div>

      <Link href={`/product/${product.slug}`} className="block">
        <div className="product-card-body">
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1 text-muted">{product.brand}</p>
          <h3 className="text-[0.875rem] font-semibold leading-snug mb-2 line-clamp-2 transition-colors group-hover:text-primary text-foreground">
            {product.name}
          </h3>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[1.05rem] font-black text-foreground">{formatEGP(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs line-through text-muted">{formatEGP(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

interface CategoryPageProps { categoryId: string; }

export default function CategoryPage({ categoryId }: CategoryPageProps) {
  const { isRtl } = useTranslation();
  const t = useTranslations('CategoryPage');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);

  useEffect(() => {
    getCategories().then(setCategoriesList).catch(err => console.error(err));
    getProducts({ pageSize: 100 }).then(res => setProductsList(res.items)).catch(err => console.error(err));
  }, []);

  const SORT_OPTIONS = useMemo(() => [
    { value: 'featured',   label: t('featured') },
    { value: 'price-asc',  label: t('priceLowHigh') },
    { value: 'price-desc', label: t('priceHighLow') },
    { value: 'rating',     label: t('topRated') },
    { value: 'newest',     label: t('newest') },
  ], [t]);

  const allBrands = useMemo(() => {
    return [...new Set(productsList.map((p) => p.brand))].sort();
  }, [productsList]);

  const category = categoriesList.find((c) => c.id === categoryId);
  const allCategoryProducts = categoryId === 'all' ? productsList : productsList.filter((p) => p.category === categoryId);

  const CHIPS: Record<string, string[]> = {
    pharmacy:      ['Vitamins', 'Supplements', 'OTC', 'Baby', 'Devices'],
    beauty:        ['Skincare', 'Hair Care', 'Body', 'Cosmetics', 'Oral Care'],
    wellness:      ['Sports', 'Weight', 'Sleep', 'Immunity', "Women's"],
    'personal-care': ['Hygiene', 'Grooming', 'Feminine', 'Eye & Ear'],
  };

  const filtered = useMemo(() => {
    let result = allCategoryProducts.filter((p) => {
      if (filters.inStockOnly && !p.inStock) return false;
      if (filters.onSaleOnly && !p.originalPrice) return false;
      if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
      if (filters.rating > 0 && p.rating < filters.rating) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      return true;
    });
    switch (sort) {
      case 'price-asc':  result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'rating':     result = [...result].sort((a, b) => b.rating - a.rating); break;
      case 'newest':     result = [...result].filter((p) => p.badge === 'new').concat(result.filter((p) => p.badge !== 'new')); break;
    }
    return result;
  }, [allCategoryProducts, filters, sort]);

  const toggleBrand = useCallback((brand: string) => {
    setFilters((f) => ({
      ...f,
      brands: f.brands.includes(brand) ? f.brands.filter((b) => b !== brand) : [...f.brands, brand],
    }));
  }, []);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);
  const activeFilterCount = [
    filters.inStockOnly, filters.onSaleOnly, filters.rating > 0,
    filters.brands.length > 0,
    filters.priceMin > 0 || filters.priceMax < 5000,
  ].filter(Boolean).length;

  const inputCls = 'w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary transition-colors';

  const categoryName = category ? (isRtl && category.nameAr ? category.nameAr : category.name) : '';
  const categoryDescription = category ? (t(`desc_${category.id}` as any) || category.description) : '';

  return (
    <div className="min-h-screen bg-background">

      {/* ── Category Hero Banner ── */}
      {category && (
        <div
          className="relative py-12 sm:py-16 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${category.color}12 0%, var(--color-card) 60%)` }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 70% 50%, ${category.color}10, transparent 60%)` }} />

          <div className="container-2m relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs mb-5 text-muted" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground transition-colors">{t('home')}</Link>
              <span>/</span>
              <span className="text-foreground font-semibold">{categoryName}</span>
            </nav>

            <div className="flex items-center gap-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm"
                style={{ background: `${category.color}18`, border: `1.5px solid ${category.color}30` }}
              >
                {category.icon}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-1 text-foreground">{categoryName}</h1>
                <p className="text-sm text-muted-foreground">
                  {categoryDescription} · <span className="text-foreground font-bold">{category.productCount}+ {t('products')}</span>
                </p>
              </div>
            </div>

            {/* Subcategory chips */}
            <div className="flex flex-wrap gap-2 mt-6">
              {['All', ...(CHIPS[category.id] ?? [])].map((chip) => {
                const active = chip === 'All' ? !activeChip : activeChip === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setActiveChip(chip === 'All' ? null : chip)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
                    style={
                      active
                        ? { background: category.color, color: '#fff', boxShadow: `0 4px 12px ${category.color}40` }
                        : { background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }
                    }
                  >
                    {t(`chip_${chip}` as any)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="container-2m py-8">
        <div className="flex gap-7">

          {/* ── Sidebar Filters — Desktop ── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-foreground">
                  <SlidersHorizontal size={14} className="text-primary" /> {t('filters')}
                </h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs flex items-center gap-1 transition-colors text-primary hover:text-red-600"
                  >
                    <X size={11} /> {t('clear')} ({activeFilterCount})
                  </button>
                )}
              </div>

              <FilterSection title={t('availability')}>
                <label className="flex items-center gap-2.5 cursor-pointer group mb-2">
                  <Toggle checked={filters.inStockOnly} onChange={() => setFilters((f) => ({ ...f, inStockOnly: !f.inStockOnly }))} />
                  <span className="text-xs transition-colors text-muted-foreground">{t('inStockOnly')}</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <Toggle checked={filters.onSaleOnly} onChange={() => setFilters((f) => ({ ...f, onSaleOnly: !f.onSaleOnly }))} />
                  <span className="text-xs transition-colors text-muted-foreground">{t('onSaleOnly')}</span>
                </label>
              </FilterSection>

              <FilterSection title={t('priceRange')}>
                <div className="flex items-center gap-2 mb-3">
                  <input type="number" value={filters.priceMin}
                    onChange={(e) => setFilters((f) => ({ ...f, priceMin: Number(e.target.value) }))}
                    className={`${inputCls} bg-surface-2 border-border text-foreground`} placeholder="Min" />
                  <span className="text-xs text-muted">–</span>
                  <input type="number" value={filters.priceMax}
                    onChange={(e) => setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))}
                    className={`${inputCls} bg-surface-2 border-border text-foreground`} placeholder="Max" />
                </div>
                <input type="range" min={0} max={5000} value={filters.priceMax}
                  onChange={(e) => setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-primary" />
                <div className="flex justify-between text-[10px] mt-1 text-muted">
                  <span>EGP 0</span><span>EGP 5,000</span>
                </div>
              </FilterSection>

              <FilterSection title={t('minRating')}>
                <div className="space-y-1.5">
                  {[4, 3, 0].map((r) => (
                    <button key={r} onClick={() => setFilters((f) => ({ ...f, rating: r }))}
                      className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs transition-all duration-150"
                      style={filters.rating === r
                        ? { background: 'var(--color-brand-primary-soft)', color: 'var(--color-brand-primary)', border: '1px solid var(--color-brand-primary-soft)' }
                        : { color: 'var(--color-text-secondary)', border: '1px solid transparent' }
                      }
                    >
                      {r === 0 ? <span>{t('allRatings')}</span> : (
                        <>
                          {[...Array(r)].map((_, i) => <Star key={i} size={10} className="fill-brand-gold text-brand-gold" />)}
                          <span>{t('andUp')}</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title={t('brand')} defaultOpen={false}>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {allBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        onClick={() => toggleBrand(brand)}
                        className="w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center flex-shrink-0"
                        style={filters.brands.includes(brand)
                          ? { background: 'var(--color-brand-primary)', borderColor: 'var(--color-brand-primary)' }
                          : { borderColor: 'var(--color-border)' }
                        }
                      >
                        {filters.brands.includes(brand) && <Check size={10} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-xs transition-colors text-muted-foreground">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border bg-card border-border text-muted-foreground"
                >
                  <SlidersHorizontal size={13} />
                  {t('filters')} {activeFilterCount > 0 && <span className="badge badge-primary text-[10px] px-1.5 py-0.5">{activeFilterCount}</span>}
                </button>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={filtered.length}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-muted"
                  >
                    <span className="font-bold text-foreground">{filtered.length}</span> {t('products')}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3">
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none cursor-pointer bg-card border-border text-foreground"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="hidden sm:flex items-center gap-1 rounded-lg p-1 border bg-surface-2 border-border">
                  <button onClick={() => setView('grid')}
                    className="p-1.5 rounded-md transition-all animate-none"
                    style={view === 'grid' ? { background: 'var(--color-brand-primary)', color: '#fff' } : { color: 'var(--color-text-muted)' }}
                  ><Grid3X3 size={13} /></button>
                  <button onClick={() => setView('list')}
                    className="p-1.5 rounded-md transition-all animate-none"
                    style={view === 'list' ? { background: 'var(--color-brand-primary)', color: '#fff' } : { color: 'var(--color-text-muted)' }}
                  ><List size={13} /></button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.inStockOnly && <span className="badge badge-dark gap-1">{t('inStock')} <X size={10} className="cursor-pointer" onClick={() => setFilters(f => ({ ...f, inStockOnly: false }))} /></span>}
                {filters.onSaleOnly && <span className="badge badge-dark gap-1">{t('onSale')} <X size={10} className="cursor-pointer" onClick={() => setFilters(f => ({ ...f, onSaleOnly: false }))} /></span>}
                {filters.rating > 0 && <span className="badge badge-dark gap-1">{filters.rating}★+ <X size={10} className="cursor-pointer" onClick={() => setFilters(f => ({ ...f, rating: 0 }))} /></span>}
                {filters.brands.map(b => <span key={b} className="badge badge-dark gap-1">{b} <X size={10} className="cursor-pointer" onClick={() => toggleBrand(b)} /></span>)}
              </div>
            )}

            {/* Product Grid / List */}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-bold text-xl mb-2 text-foreground">{t('noProductsFound')}</h3>
                <p className="text-sm mb-6 text-muted">{t('adjustFilters')}</p>
                <button onClick={clearFilters} className="btn btn-primary">{t('clearFilters')}</button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`${view}-${activeFilterCount}-${sort}`}
                  className={view === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'flex flex-col gap-4'
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} view={view} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)} />
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-lg text-foreground">{t('filters')}</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-muted"><X size={20} /></button>
              </div>
              <FilterSection title={t('availability')}>
                <label className="flex items-center gap-2.5 cursor-pointer mb-2">
                  <Toggle checked={filters.inStockOnly} onChange={() => setFilters((f) => ({ ...f, inStockOnly: !f.inStockOnly }))} />
                  <span className="text-sm text-muted-foreground">{t('inStockOnly')}</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Toggle checked={filters.onSaleOnly} onChange={() => setFilters((f) => ({ ...f, onSaleOnly: !f.onSaleOnly }))} />
                  <span className="text-sm text-muted-foreground">{t('onSaleOnly')}</span>
                </label>
              </FilterSection>
              <FilterSection title={t('priceRange')}>
                <div className="flex items-center gap-2 mb-3">
                  <input type="number" value={filters.priceMin}
                    onChange={(e) => setFilters((f) => ({ ...f, priceMin: Number(e.target.value) }))}
                    className={inputCls} placeholder="Min"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
                  <span className="text-muted">–</span>
                  <input type="number" value={filters.priceMax}
                    onChange={(e) => setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))}
                    className={inputCls} placeholder="Max"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
              </FilterSection>
              <div className="flex gap-3 mt-6">
                <button onClick={clearFilters} className="btn btn-ghost flex-1">{t('clearAll')}</button>
                <button onClick={() => setMobileFiltersOpen(false)} className="btn btn-primary flex-1">
                  {t('viewProducts', { count: filtered.length })}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
