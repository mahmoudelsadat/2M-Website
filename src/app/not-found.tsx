'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import { products } from '@/lib/data';
import { ArrowRight, Home } from 'lucide-react';
import { formatEGP } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useTranslation } from '@/lib/LanguageContext';

export default function NotFound() {
  const { isRtl } = useTranslation();
  const t = useTranslations('NotFound');
  const trending = products.slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="bg-background">
        {/* Hero */}
        <section className="py-24 text-center bg-gradient-to-b from-white to-surface-2 dark:from-stone-900 dark:to-stone-900/40">
          <div className="container-2m max-w-lg">
            <div className="text-8xl mb-6 select-none" aria-hidden="true">🔍</div>
            <h1 className="text-4xl font-black text-foreground mb-4">{t('title')}</h1>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
              {t('description')}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/" className="btn btn-primary px-7 py-3">
                <Home size={16} /> {t('backHome')}
              </Link>
              <Link href="/pharmacy" className="btn btn-ghost px-7 py-3">
                {t('browseProducts')} <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
              </Link>
            </div>
          </div>
        </section>

        {/* Trending */}
        <section className="py-16 bg-white dark:bg-dark-bg border-t border-border">
          <div className="container-2m">
            <div className="section-label mb-1">{t('whileHere')}</div>
            <h2 className="section-title mb-8">{t('trendingProducts')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {trending.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="product-card group block">
                  <div className="product-card-image">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <div className="product-card-body">
                    <p className="text-[11px] text-muted font-semibold uppercase tracking-wider mb-1">{p.brand}</p>
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">{p.name}</h3>
                    <span className="text-base font-black text-foreground">{formatEGP(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
