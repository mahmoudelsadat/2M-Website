'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star } from 'lucide-react';
import { formatEGP } from '@/lib/utils';
import { useTranslation } from '@/lib/LanguageContext';
import { useTranslations } from 'next-intl';

interface BrandPageClientProps {
  brand: {
    name: string;
    logo: string;
  };
  brandProducts: any[];
}

export default function BrandPageClient({ brand, brandProducts }: BrandPageClientProps) {
  const { isRtl } = useTranslation();
  const t = useTranslations('BrandDetails');

  return (
    <main className="bg-background">
      {/* Header */}
      <section className="py-14 bg-white/5 border-b border-white/10 backdrop-blur-xl">
        <div className="container-2m">
          <Link href="/brands" className={`inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-primary transition-colors mb-6`}>
            <ArrowLeft size={14} className={isRtl ? 'rotate-180' : ''} /> {t('allBrands')}
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl border border-white/10 flex-shrink-0 shadow-inner">
              {brand.logo}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white font-display uppercase tracking-wide">{brand.name}</h1>
              <p className="text-text-muted text-sm mt-1 font-semibold">
                {brandProducts.length > 0
                  ? t('productsAvailable', { count: brandProducts.length })
                  : t('comingSoon')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container-2m">
          {brandProducts.length === 0 ? (
            <div className="luxury-empty-state shadow-2xl">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-white/5 border border-white/10 text-brand-gold">
                <span className="text-3xl">📦</span>
              </div>
              <h2 className="text-xl font-black text-white font-display uppercase tracking-wider mb-3">{t('comingSoon')}</h2>
              <p className="text-xs mb-6 text-text-muted font-semibold max-w-xs">{t('exploreSoon', { brand: brand.name })}</p>
              <Link href="/pharmacy" className="btn btn-primary btn-shimmer btn-elevated px-8 text-xs font-black uppercase tracking-wider">{t('browseAll')}</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {brandProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="product-card group block">
                  <div className="product-card-image">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-contain p-4"
                      sizes="(max-width:640px) 50vw, 25vw"
                    />
                  </div>
                  <div className="product-card-body">
                    <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider mb-1">{p.brand}</p>
                    <h2 className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors">{p.name}</h2>
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={10} className={s <= Math.round(p.rating) ? 'fill-brand-gold text-brand-gold' : 'text-white/10'} />
                      ))}
                      <span className="text-[10px] text-text-muted ml-1">({p.reviewCount})</span>
                    </div>
                    <span className="text-base font-black text-white">{formatEGP(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
