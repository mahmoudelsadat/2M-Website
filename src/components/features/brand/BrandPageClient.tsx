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
      <section className="py-14 bg-card border-b border-border">
        <div className="container-2m">
          <Link href="/brands" className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-primary transition-colors mb-6`}>
            <ArrowLeft size={14} className={isRtl ? 'rotate-180' : ''} /> {t('allBrands')}
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center text-3xl border border-border flex-shrink-0">
              {brand.logo}
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground">{brand.name}</h1>
              <p className="text-muted-foreground text-sm mt-1">
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
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-xl font-bold text-foreground mb-3">{t('comingSoon')}</h2>
              <p className="text-muted-foreground mb-6">{t('exploreSoon', { brand: brand.name })}</p>
              <Link href="/pharmacy" className="btn btn-primary">{t('browseAll')}</Link>
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
                    <p className="text-[11px] text-muted font-semibold uppercase tracking-wider mb-1">{p.brand}</p>
                    <h2 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors">{p.name}</h2>
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={10} className={s <= Math.round(p.rating) ? 'fill-brand-gold text-brand-gold' : 'text-gray-300'} />
                      ))}
                      <span className="text-[10px] text-muted ml-1">({p.reviewCount})</span>
                    </div>
                    <span className="text-base font-black text-foreground">{formatEGP(p.price)}</span>
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
