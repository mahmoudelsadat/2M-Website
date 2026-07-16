'use client';

import { brands } from '@/lib/data';
import { useTranslations } from 'next-intl';

export default function BrandsCarousel() {
  const doubled = [...brands, ...brands];
  const t = useTranslations('Product');

  return (
    <section className="py-12 bg-surface-warm border-y border-border-warm">
      <div className="container-2m mb-6 text-center">
        <p className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-muted-foreground">{t('trustedBrands')}</p>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-surface-warm to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-surface-warm to-transparent" />

        <div className="flex gap-4" style={{ width: 'max-content', animation: 'marquee 30s linear infinite' }}>
          {doubled.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex-shrink-0 h-12 px-6 rounded-xl border border-border-warm bg-surface flex items-center gap-2.5 text-muted-foreground hover:text-foreground hover:border-primary/20 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span className="text-lg">{brand.logo}</span>
              <span className="text-sm font-semibold whitespace-nowrap">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
