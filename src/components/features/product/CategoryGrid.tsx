'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Pill, Sparkles, Leaf, Droplets } from 'lucide-react';
import { getCategories } from '@/lib/api';
import { type Category } from '@/lib/data';
import { useTranslations } from 'next-intl';

const COLORS = {
  pharmacy: {
    bgClass: 'bg-brand-primary-soft',
    accentClass: 'text-primary',
    textClass: 'text-primary',
    borderClass: 'border-primary/20',
    accentBgClass: 'bg-primary',
    accentBorderClass: 'border-primary/20',
  },
  beauty: {
    bgClass: 'bg-brand-accent-soft',
    accentClass: 'text-brand-accent',
    textClass: 'text-brand-accent',
    borderClass: 'border-brand-accent/20',
    accentBgClass: 'bg-brand-accent',
    accentBorderClass: 'border-brand-accent/20',
  },
  wellness: {
    bgClass: 'bg-wellness-bg',
    accentClass: 'text-teal-light',
    textClass: 'text-wellness-text',
    borderClass: 'border-wellness-border',
    accentBgClass: 'bg-teal-light',
    accentBorderClass: 'border-wellness-border',
  },
  'personal-care': {
    bgClass: 'bg-personal-bg',
    accentClass: 'text-personal-accent',
    textClass: 'text-personal-text',
    borderClass: 'border-personal-border',
    accentBgClass: 'bg-personal-accent',
    accentBorderClass: 'border-personal-border',
  },
};

export default function CategoryGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const t = useTranslations('Product');

  useEffect(() => {
    getCategories().then(setCats).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (cats.length === 0) return;
    const cards = sectionRef.current?.querySelectorAll('.cat-card');
    if (!cards) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80); });
    }, { threshold: 0.1 });
    cards.forEach((c) => { c.classList.add('reveal'); obs.observe(c); });
    return () => obs.disconnect();
  }, [cats]);

  return (
    <section ref={sectionRef} className="py-16 bg-background">
      <div className="container-2m">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-label">{t('browse')}</div>
            <h2 className="section-title">{t('shopByCategory')}</h2>
            <p className="section-subtitle mt-1">{t('findExactlyWhatYouNeed')}</p>
          </div>
          <Link href="/pharmacy" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            {t('all')} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {cats.map((cat, i) => {
            const palette = COLORS[cat.id as keyof typeof COLORS] || COLORS['pharmacy'];
            return (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                id={`category-${cat.slug}`}
                className={`cat-card group block rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-sm relative overflow-hidden shadow-xs ${palette.bgClass} ${palette.borderClass}`}
                style={{
                  transitionDelay: `${i * 50}ms`,
                }}
                data-category={cat.id}
              >
                {/* Top: Icon + Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 relative z-10 bg-surface shadow-sm"
                  >
                    {cat.id === 'pharmacy' && <Pill className="text-brand-primary" />}
                    {cat.id === 'beauty' && <Sparkles className="text-brand-accent" />}
                    {cat.id === 'wellness' && <Leaf className="text-brand-accent" />}
                    {cat.id === 'personal-care' && <Droplets className="text-personal-accent" />}
                  </div>
                  
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border bg-surface shadow-sm transition-colors duration-300 relative z-10 ${palette.accentClass} ${palette.borderClass}`}>
                    {cat.productCount} {t('items')}
                  </span>
                </div>

                {/* Color Overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl pointer-events-none ${palette.accentBgClass}`}></div>

                {/* Text */}
                <h3 className={`text-[1rem] font-semibold mb-1 relative z-10 ${palette.textClass}`}>{cat.name}</h3>
                <p className="text-[0.8rem] text-muted-foreground leading-snug mb-4 line-clamp-2 relative z-10">{cat.description}</p>

                {/* Footer */}
                <div className="flex items-center justify-between relative z-10">
                  <span className={`text-[0.72rem] font-semibold uppercase tracking-wider ${palette.accentClass}`}>
                    {t('exploreCategory')}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 group-hover:shadow-sm ${palette.accentBgClass}`}
                  >
                    <ArrowRight size={12} className="text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
