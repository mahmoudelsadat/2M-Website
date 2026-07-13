/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Star, Shield, Truck, RefreshCw, ChevronRight, Plus, Minus, Share2, Check, Zap, MessageCircle } from 'lucide-react';
import type { Product } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { formatEGP } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

function StarRating({ rating, reviewCount, large }: { rating: number; reviewCount: number; large?: boolean }) {
  const size = large ? 16 : 12;
  return (
    <div className="flex items-center gap-1.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 12 12" fill={s <= Math.round(rating) ? '#C9A84C' : 'var(--color-border)'}>
          <path d="M6 1l1.24 2.51L10 3.93l-2 1.95.47 2.75L6 7.25 3.53 8.63 4 5.88 2 3.93l2.76-.42L6 1z" />
        </svg>
      ))}
      <span className={`text-[var(--color-text-secondary)] ${large ? 'text-sm' : 'text-xs'}`}>({reviewCount.toLocaleString()} reviews)</span>
    </div>
  );
}

interface PDPClientProps {
  product: Product;
  related: Product[];
}

export default function PDPClient({ product, related }: PDPClientProps) {
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [viewersCount, setViewersCount] = useState(8);
  const [showSticky, setShowSticky] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    setViewersCount(Math.floor(Math.random() * 15) + 5);
    const onScroll = () => setShowSticky(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const TABS = [
    { id: 'description', label: 'Description' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'usage', label: 'How to Use' },
    { id: 'reviews', label: `Reviews (${product.reviewCount})` },
  ];

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Placeholder images (use same product image for demo)
  const images = [product.image, product.image, product.image];

  const MOCK_REVIEWS = [
    { name: 'Sara A.', rating: 5, text: 'Amazing product! Noticed results within 2 weeks. Will definitely reorder.', date: '3 days ago', verified: true },
    { name: 'Mohamed H.', rating: 5, text: 'Genuine product, arrived quickly. Great price compared to pharmacies.', date: '1 week ago', verified: true },
    { name: 'Nour K.', rating: 4, text: 'Good quality. Packaging was perfect. Delivery to Alexandria was fast!', date: '2 weeks ago', verified: true },
  ];

  return (
    <>
    <div className="min-h-screen" style={{ background: 'var(--color-page-bg)' }}>
      <div className="container-2m py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] mb-8 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-brand-primary)] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/${product.category}`} className="hover:text-[var(--color-brand-primary)] transition-colors capitalize">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-[var(--color-text-primary)] font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Grid */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 mb-16">

          {/* Left — Gallery */}
          <div>
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden mb-4 group cursor-zoom-in"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              onMouseMove={(e) => {
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                e.currentTarget.style.setProperty('--x', `${x}%`);
                e.currentTarget.style.setProperty('--y', `${y}%`);
              }}
            >
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                priority
                className="object-contain p-8 transition-transform duration-300 origin-[var(--x,50%)_var(--y,50%)] group-hover:scale-[2]"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="badge badge-primary text-sm px-3 py-1">-{discount}%</span>
                </div>
              )}
              {product.badge === 'pharmacist-pick' && (
                <div className="absolute top-4 right-4">
                  <span
                    className="badge text-xs"
                    style={{ background: 'var(--color-brand-primary-soft)', color: 'var(--color-brand-primary)', border: '1px solid rgba(13,115,119,0.3)' }}
                  >
                    ✅ Pharmacist Pick
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 border ${
                    activeImage === i ? 'border-[var(--color-brand-primary)] opacity-100 ring-1 ring-[var(--color-brand-primary)]' : 'border-[var(--color-border)] opacity-60 hover:opacity-100'
                  }`}
                  style={{ background: 'var(--color-surface)' }}
                >
                  <Image src={img} alt="" width={80} height={80} className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div>
            <div className="mb-2">
              <Link
                href={`/brands/${product.brand.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs font-bold text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-dark)] uppercase tracking-widest transition-colors"
              >
                {product.brand}
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] leading-tight mb-4">
              {product.name}
            </h1>

            <StarRating rating={product.rating} reviewCount={product.reviewCount} large />

            {/* Social signals */}
            <div className="flex items-center gap-3 mt-3 mb-5 text-xs text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                {viewersCount} people viewing now
              </span>
              {product.stockCount && product.stockCount < 20 && (
                <span className="flex items-center gap-1 text-orange-500 font-bold">
                  <Zap size={11} className="fill-current" />
                  Only {product.stockCount} left
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-[var(--color-border)]">
              <span className="text-4xl font-black text-[var(--color-text-primary)]">
                {formatEGP(product.price)}
              </span>
              {product.originalPrice && (
                <div className="flex flex-col items-start mb-1">
                  <span className="text-sm text-[var(--color-text-muted)] line-through">{formatEGP(product.originalPrice)}</span>
                  <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                    Save {formatEGP(product.originalPrice - product.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              {/* Qty Stepper */}
              <div
                className="flex items-center rounded-xl overflow-hidden border border-[var(--color-border)]"
                style={{ background: 'var(--color-surface)' }}
              >
                <button
                  id="pdp-qty-minus"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-12 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-surface-2)] transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-12 h-12 flex items-center justify-center text-[var(--color-text-primary)] font-bold text-sm bg-[var(--color-page-bg)]">
                  {qty}
                </span>
                <button
                  id="pdp-qty-plus"
                  onClick={() => setQty(qty + 1)}
                  className="w-11 h-12 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-surface-2)] transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                id="pdp-add-to-cart"
                onClick={handleAddToCart}
                className={`btn flex-1 text-sm py-3 transition-all duration-300 font-bold tracking-wide ${added ? 'bg-green-600 border-green-600 text-white' : 'btn-primary btn-shimmer'}`}
                style={{ minHeight: '48px' }}
              >
                {added ? (
                  <><Check size={16} /> Added to Cart!</>
                ) : (
                  <><ShoppingCart size={16} /> Add to Cart — {formatEGP(product.price * qty)}</>
                )}
              </button>
            </div>

            {/* Wishlist + Share */}
            <div className="flex gap-3 mb-7">
              <button
                id="pdp-wishlist"
                onClick={() => setWishlisted(!wishlisted)}
                className={`btn btn-ghost flex-1 text-xs py-2.5 ${wishlisted ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]' : ''}`}
              >
                <Heart size={14} className={wishlisted ? 'fill-[var(--color-brand-primary)]' : ''} />
                {wishlisted ? 'Saved' : 'Save to Wishlist'}
              </button>
              <button
                id="pdp-share"
                onClick={handleShare}
                className="btn btn-ghost text-xs py-2.5 px-4"
              >
                {copied ? <><Check size={14} /> Copied!</> : <><Share2 size={14} /> Share</>}
              </button>
            </div>

            {/* Trust micro-bar */}
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[
                { icon: Shield, label: '100% Authentic', color: '#2B7CC1' },
                { icon: Truck, label: '2–5 Day Delivery', color: '#10B981' },
                { icon: RefreshCw, label: 'Easy Returns', color: '#C9A84C' },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center shadow-sm"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                  <Icon size={16} style={{ color }} />
                  <span className="text-[10px] text-[var(--color-text-secondary)] font-semibold leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/201115160947?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(product.name)}%20at%202M%20Premium%20Pharmacy`}
              target="_blank"
              rel="noopener noreferrer"
              id="pdp-whatsapp-cta"
              className="flex items-center gap-3 p-4 rounded-xl border border-green-500/20 bg-green-50 hover:bg-green-100 transition-all duration-200 group"
            >
              <MessageCircle size={20} className="text-green-600 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-green-900">Have questions about this product?</div>
                <div className="text-xs text-green-700 group-hover:text-green-800 transition-colors font-medium">Chat with our pharmacist on WhatsApp →</div>
              </div>
            </a>
          </div>
        </div>

        {/* Product Detail Tabs */}
        <div className="mb-16">
          <div className="flex gap-0 border-b border-[var(--color-border)] mb-8 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`pdp-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-5 py-3 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
                    : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-2xl">
            {activeTab === 'description' && (
              <div className="space-y-4 text-[var(--color-text-secondary)] text-sm leading-relaxed">
                <p>{product.description}</p>
                <p>At 2M Premium Pharmacy, all products are sourced directly from authorized distributors and verified for authenticity. Every batch is traceable.</p>
                <ul className="space-y-2">
                  {product.tags.map((tag) => (
                    <li key={tag} className="flex items-center gap-2">
                      <Check size={14} className="text-[#C9A84C] flex-shrink-0" />
                      <span className="capitalize font-semibold text-[var(--color-text-primary)]">{tag.replace(/-/g, ' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                <p className="mb-4">Full ingredient list and supplement facts:</p>
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <p className="text-[var(--color-text-muted)] text-xs">Please refer to the product label or contact our pharmacist for the full ingredient list specific to this product batch.</p>
                </div>
              </div>
            )}
            {activeTab === 'usage' && (
              <div className="space-y-3 text-[var(--color-text-secondary)] text-sm">
                <p>Follow the recommended dosage on the product label or as directed by your healthcare provider.</p>
                <div className="p-4 rounded-xl border border-yellow-200 bg-yellow-50">
                  <p className="text-yellow-800 text-xs font-bold mb-1">⚠️ Important</p>
                  <p className="text-yellow-700 text-xs">Keep out of reach of children. Store in a cool, dry place away from direct sunlight. Consult a healthcare professional if pregnant or nursing.</p>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Rating Summary */}
                <div
                  className="flex items-center gap-6 p-5 rounded-2xl mb-6 shadow-sm"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                  <div className="text-center">
                    <div className="text-5xl font-black text-[var(--color-text-primary)]">{product.rating}</div>
                    <div className="flex gap-0.5 justify-center mt-1 mb-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={12} className={s <= Math.round(product.rating) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-300'} />
                      ))}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] font-medium">{product.reviewCount} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5,4,3,2,1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[var(--color-text-secondary)] w-4">{stars}</span>
                        <div className="flex-1 h-1.5 bg-[var(--color-page-bg)] rounded-full overflow-hidden border border-[var(--color-border)]">
                          <div
                            className="h-full bg-[#C9A84C] rounded-full"
                            style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : 2}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review List */}
                {MOCK_REVIEWS.map((review, i) => (
                  <div key={i} className="p-4 rounded-xl border border-[var(--color-border)] shadow-sm bg-[var(--color-surface)]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[#0A5A5C] flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        {review.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm font-black text-[var(--color-text-primary)]">
                          {review.name}
                          {review.verified && (
                            <span className="text-[10px] text-[#2B7CC1] bg-[#EBF4FB] border border-[#2B7CC1]/20 rounded-full px-1.5 py-0.5">Verified</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((s) => <Star key={s} size={9} className={s <= review.rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-300'} />)}
                          </div>
                          <span className="text-[10px] text-[var(--color-text-muted)] font-medium">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="section-header mb-8">
              <div>
                <div className="section-label">You May Also Like</div>
                <h2 className="text-2xl font-black text-[var(--color-text-primary)]">Related Products</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="product-card group block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="product-card-image bg-[var(--color-page-bg)] p-4 h-48 flex items-center justify-center">
                    <Image src={p.image} alt={p.name} width={192} height={192} className="group-hover:scale-105 transition-transform duration-300 object-contain w-full h-full" />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-[var(--color-brand-gold)] font-bold uppercase tracking-wider mb-1">{p.brand}</p>
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight mb-2 line-clamp-2">{p.name}</h3>
                    <span className="text-sm font-black text-[var(--color-brand-primary)]">{formatEGP(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Cart Footer */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4"
          >
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg border border-[var(--color-border)] bg-[var(--color-page-bg)] p-1 overflow-hidden">
                <Image src={images[0]} className="w-full h-full object-contain" alt={product.name} width={48} height={48} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--color-text-primary)] line-clamp-1 max-w-[250px]">{product.name}</h3>
                <div className="text-sm font-black text-[var(--color-brand-primary)]">{formatEGP(product.price)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
               <button onClick={handleAddToCart} className="btn btn-primary flex-1 sm:w-64 py-3 h-11 text-sm font-black tracking-wide shadow-md btn-shimmer">
                 {added ? <><Check size={16} /> Added to Cart</> : <><ShoppingCart size={16} /> Add to Cart — {formatEGP(product.price * qty)}</>}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
