/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, ShoppingCart, Sparkles, Tag } from 'lucide-react';
import Image from 'next/image';
import { useDebounce } from '@/lib/useDebounce';
import { useCartStore } from '@/lib/store';
import { formatEGP } from '@/lib/utils';
import { type Product } from '@/lib/data';
import { searchProducts } from '@/lib/api';
import { useTranslation } from '@/lib/LanguageContext';
import { toast } from 'sonner';



interface SearchAutocompleteProps {
  onClose?: () => void;
}

export default function SearchAutocomplete({ onClose }: SearchAutocompleteProps) {
  const { t, isRtl } = useTranslation();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounced = useDebounce(query, 250);
  const addItem = useCartStore((s) => s.addItem);

  // Trending Pill keywords (English / Arabic values mapped)
  const trendingKeywords = [
    { en: 'Vitamins', ar: 'فيتامين' },
    { en: 'Omega-3', ar: 'أوميغا' },
    { en: 'Serum', ar: 'سيروم' },
    { en: 'Altruist', ar: 'ألترويست' }
  ];

  // Re-run search whenever query or active category changes
  useEffect(() => {
    if (!debounced) { 
      setResults([]); 
      return; 
    }
    setLoading(true);
    searchProducts(debounced).then(r => {
      const filtered = activeCategory === 'all' ? r : r.filter(p => p.category === activeCategory);
      setResults(filtered);
      setLoading(false);
      setOpen(true);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [debounced, activeCategory]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setActiveCategory('all');
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }, []);

  const handlePillClick = (keyword: string) => {
    setQuery(keyword);
    setOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      
      {/* 1. Search input wrapper with proper RTL alignments */}
      <div className="relative">
        <Search 
          size={15} 
          className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none z-10`} 
        />
        
        <input
          ref={inputRef}
          id="nav-search-input"
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={t('searchPlaceholder')}
          autoComplete="off"
          dir={isRtl ? 'rtl' : 'ltr'}
          className={`w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl ${
            isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'
          } py-3 text-xs font-bold text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all duration-200 shadow-sm`}
        />
        
        {query && (
          <button 
            onClick={clear} 
            className={`absolute ${isRtl ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1`}
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* 2. Trending keywords Pills (Only visible when search bar is focused but query is empty/short) */}
      {open && !query && (
        <div className="mt-2.5 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-xl p-3.5 shadow-md flex flex-wrap items-center gap-2 relative z-50">
          <span className="text-[10px] font-black uppercase text-[var(--color-text-muted)] flex items-center gap-1.5 mr-2">
            <Sparkles size={11} className="text-[var(--color-brand-gold)]" />
            {t('trendingSearch')}:
          </span>
          {trendingKeywords.map((kw, idx) => {
            const word = isRtl ? kw.ar : kw.en;
            return (
              <button
                key={idx}
                onClick={() => handlePillClick(word)}
                className="bg-[var(--color-surface-2)] border border-[var(--color-border-soft)] hover:border-[var(--color-brand-primary)]/30 hover:bg-[var(--color-brand-primary)]/5 hover:text-[var(--color-brand-primary)] text-[10px] font-black px-3 py-1.5 rounded-lg transition-all"
              >
                {word}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Search Results and category filter Dropdown */}
      {open && query && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden z-50 shadow-2xl backdrop-blur-xl"
          style={{ 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
            borderColor: 'var(--color-border-soft)'
          }}
        >
          {/* Category Filter Pills block inside dropdown */}
          <div className="bg-[var(--color-surface-2)] px-4 py-3 border-b border-[var(--color-border-soft)] flex items-center justify-between flex-wrap gap-2">
            <span className="text-[9px] font-black uppercase text-[var(--color-text-muted)] tracking-wider">
              {t('searchCategories')}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border transition-all ${
                  activeCategory === 'all'
                    ? 'bg-[var(--color-surface)] border-[var(--color-border-soft)] text-[var(--color-brand-primary)] shadow-sm'
                    : 'bg-transparent border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {isRtl ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setActiveCategory('pharmacy')}
                className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border transition-all flex items-center gap-1 ${
                  activeCategory === 'pharmacy'
                    ? 'bg-[var(--color-surface)] border-[var(--color-border-soft)] text-[var(--color-brand-primary)] shadow-sm'
                    : 'bg-transparent border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {t('allPharmacy')}
              </button>
              <button
                onClick={() => setActiveCategory('beauty')}
                className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border transition-all flex items-center gap-1 ${
                  activeCategory === 'beauty'
                    ? 'bg-[var(--color-surface)] border-[var(--color-border-soft)] text-[var(--color-brand-primary)] shadow-sm'
                    : 'bg-transparent border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {t('allBeauty')}
              </button>
              <button
                onClick={() => setActiveCategory('wellness')}
                className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border transition-all flex items-center gap-1 ${
                  activeCategory === 'wellness'
                    ? 'bg-[var(--color-surface)] border-[var(--color-border-soft)] text-[var(--color-brand-primary)] shadow-sm'
                    : 'bg-transparent border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {t('allWellness')}
              </button>
            </div>
          </div>

          {loading && (
            <div className="p-6 text-xs text-[var(--color-text-muted)] font-black text-center animate-pulse">
              <span>💊</span> {t('searching')}
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="p-6 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-xs font-black text-[var(--color-text-primary)]">
                {t('noResults')} &ldquo;{query}&rdquo;
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-1 font-semibold">
                {t('tryDifferent')}
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="p-2 divide-y divide-[var(--color-border-soft)]/45">
                {results.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-[var(--color-surface-2)]/50 transition-colors group">
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={() => { setOpen(false); onClose?.(); }}
                      className={`flex items-center gap-3 flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex-shrink-0 overflow-hidden border border-[var(--color-border-soft)] p-0.5 shadow-sm">
                        <Image src={p.image} alt={p.name} width={40} height={40} className="w-full h-full object-contain" />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-brand-primary)] transition-colors">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)] font-bold mt-0.5">
                          {p.brand} · <span className="text-[var(--color-brand-primary)]">{formatEGP(p.price)}</span>
                        </p>
                      </div>
                    </Link>

                    {/* Quick add to cart button */}
                    <button
                      onClick={() => { 
                        addItem(p, 1); 
                        toast.success(isRtl ? 'تمت الإضافة للسلة!' : 'Added to cart!', { 
                          description: p.name, 
                          duration: 2000 
                        }); 
                      }}
                      className="w-8 h-8 flex-shrink-0 rounded-xl bg-[var(--color-brand-primary)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95 transition-all"
                      aria-label={`Add ${p.name} to cart`}
                    >
                      <ShoppingCart size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* View all results footer */}
              <div className="border-t border-[var(--color-border-soft)] p-2">
                <Link
                  href={`/pharmacy?search=${encodeURIComponent(query)}`}
                  onClick={() => { setOpen(false); onClose?.(); }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-black text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/5 rounded-xl transition-all"
                >
                  <span>{t('seeAllResults')} &ldquo;{query}&rdquo;</span>
                  <ArrowRight size={13} className={isRtl ? 'rotate-180' : ''} />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
