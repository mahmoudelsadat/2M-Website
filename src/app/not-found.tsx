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
      <main className="bg-background min-h-[80vh] flex flex-col justify-center">
        {/* Hero */}
        <section className="py-16 text-center">
          <div className="container-2m flex justify-center">
            <div className="luxury-empty-state shadow-2xl">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-white/5 border border-white/10 text-brand-gold">
                <span className="text-3xl">🔍</span>
              </div>
              <h1 className="text-2xl font-black text-white font-display uppercase tracking-wide mb-3">{t('title')}</h1>
              <p className="text-xs mb-8 text-text-muted font-semibold max-w-xs leading-relaxed">
                {t('description')}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/" className="btn btn-primary btn-shimmer btn-elevated px-6 py-2.5 text-xs font-black uppercase tracking-wider">
                  <Home size={14} /> {t('backHome')}
                </Link>
                <Link href="/pharmacy" className="btn btn-ghost px-6 py-2.5 text-xs font-black uppercase tracking-wider border border-white/10 hover:bg-white/5 text-white">
                  {t('browseProducts')} <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trending */}
        <section className="py-16 bg-[#060700]/50 border-t border-white/10">
          <div className="container-2m">
            <div className="section-label mb-1 uppercase tracking-widest text-brand-gold">{t('whileHere')}</div>
            <h2 className="section-title mb-8 text-white font-display uppercase">{t('trendingProducts')}</h2>
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
                    <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider mb-1">{p.brand}</p>
                    <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors">{p.name}</h3>
                    <span className="text-base font-black text-white">{formatEGP(p.price)}</span>
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
