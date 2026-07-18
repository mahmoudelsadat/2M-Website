'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Star, Truck, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';
import { getBrands } from '@/lib/api';

// Custom inline SVG logos to match the screenshot perfectly
const BRAND_LOGOS: Record<string, React.ReactNode> = {
  'la roche-posay': (
    <div className="flex flex-col items-center justify-center font-sans tracking-widest text-[9px] text-[#0A2540] font-black">
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 bg-[#00A6FF]" />
        <span>LA ROCHE-POSAY</span>
      </div>
      <span className="text-[5px] tracking-[0.2em] font-normal text-neutral-400 mt-0.5">LABORATOIRE DERMATOLOGIQUE</span>
    </div>
  ),
  'cerave': (
    <div className="font-sans text-xl font-bold tracking-tight text-[#0F62AC] flex items-baseline">
      <span>Cera</span><span className="text-[#41B6E6]">Ve</span>
    </div>
  ),
  'vichy': (
    <div className="flex flex-col items-center justify-center font-serif text-lg font-extrabold tracking-[0.25em] text-neutral-900">
      <span>VICHY</span>
      <span className="text-[5px] font-sans tracking-[0.1em] font-bold text-neutral-400 -mt-1">LABORATOIRES</span>
    </div>
  ),
  'the ordinary': (
    <div className="flex flex-col items-center justify-center font-sans text-xs font-bold tracking-tight text-neutral-900">
      <span>The Ordinary.</span>
      <span className="text-[4px] tracking-widest text-neutral-400 font-normal uppercase mt-0.5">Clinical Formulations</span>
    </div>
  ),
  'now foods': (
    <div className="flex flex-col items-center justify-center font-sans text-sm font-extrabold text-[#E28716] italic">
      <span className="leading-none">now</span>
      <span className="text-[5px] not-italic tracking-[0.1em] font-bold text-[#2A7B4C] uppercase leading-none mt-0.5">Premium Health</span>
    </div>
  ),
};

export default function TrustBar() {
  const { t, isRtl } = useTranslation();
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    getBrands()
      .then((res) => {
        // Map to include our premium SVG logos if available, otherwise fallback
        const formatted = res.map((b) => ({
          ...b,
          renderLogo: BRAND_LOGOS[b.name.toLowerCase()] || (
            <span className="font-extrabold text-neutral-800 text-sm tracking-tight">{b.name}</span>
          ),
        }));
        setBrands(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-20 bg-surface-2 border-y border-border">
      <div className="container-2m">
        {/* Why Choose 2M Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            {t('whyChooseTitle')}
          </h2>
        </div>

        {/* 3 Glow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="relative p-8 rounded-2xl bg-surface border border-border shadow-xs flex flex-col items-center text-center group hover:scale-[1.02] transition-transform duration-300">
            <div className="w-14 h-14 rounded-full bg-brand-primary-soft border border-brand-primary-soft/30 flex items-center justify-center mb-6 text-brand-primary">
              <ShieldCheck size={26} />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2">{t('chooseAuthenticTitle')}</h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-[28ch]">{t('chooseAuthenticDesc')}</p>
          </div>

          {/* Card 2 */}
          <div className="relative p-8 rounded-2xl bg-surface border border-border shadow-xs flex flex-col items-center text-center group hover:scale-[1.02] transition-transform duration-300">
            <div className="w-14 h-14 rounded-full bg-brand-accent-soft border border-brand-accent-soft/30 flex items-center justify-center mb-6 text-brand-accent">
              <Star size={26} />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2">{t('chooseExpertTitle')}</h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-[28ch]">{t('chooseExpertDesc')}</p>
          </div>

          {/* Card 3 */}
          <div className="relative p-8 rounded-2xl bg-surface border border-border shadow-xs flex flex-col items-center text-center group hover:scale-[1.02] transition-transform duration-300">
            <div className="w-14 h-14 rounded-full bg-surface-3 flex items-center justify-center mb-6 text-text-primary">
              <Truck size={26} />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2">{t('chooseDeliveryTitle')}</h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-[28ch]">{t('chooseDeliveryDesc')}</p>
          </div>
        </div>

        {/* Explore All Brands Link (aligned right) */}
        <div className={`flex ${isRtl ? 'justify-start' : 'justify-end'} mb-14`}>
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-accent hover:text-brand-accent/80 transition-colors uppercase tracking-wider hover:underline"
          >
            {t('exploreAllBrands')} <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
          </Link>
        </div>

        {/* Brand slider / carousel */}
        {brands.length > 0 && (
          <div className="relative mt-8 group/slider">
            <div className="flex items-center justify-between gap-4">
              {/* Left arrow */}
              <button className="w-8 h-8 rounded-full border border-border bg-surface text-text-secondary hover:text-brand-primary flex items-center justify-center transition-colors shadow-xs">
                <ChevronLeft size={16} />
              </button>

              {/* Brands grid representing the carousel row in the screenshot */}
              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {brands.slice(0, 5).map((brand) => (
                    <Link
                      key={brand.name}
                      href={`/brands/${brand.slug || brand.name.toLowerCase()}`}
                      className="h-16 rounded-2xl bg-surface flex items-center justify-center px-4 border border-border hover:scale-[1.03] hover:shadow-md transition-all duration-300"
                    >
                      {brand.renderLogo}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right arrow */}
              <button className="w-8 h-8 rounded-full border border-border bg-surface text-text-secondary hover:text-brand-primary flex items-center justify-center transition-colors shadow-xs">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Slider dots indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              <span className="w-1.5 h-1.5 rounded-full bg-border-soft" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
