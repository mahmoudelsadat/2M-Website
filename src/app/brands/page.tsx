'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import BackToTop from '@/components/layout/BackToTop';
import { getBrands, getProducts } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { slugify } from '@/lib/utils';
import { useTranslation } from '@/lib/LanguageContext';
import { useTranslations } from 'next-intl';

export default function BrandsPage() {
  const { isRtl } = useTranslation();
  const t = useTranslations('Brands');
  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);

  useEffect(() => {
    getBrands().then(setBrandsList).catch(err => console.error(err));
    getProducts({ pageSize: 1000 }).then(res => setProductsList(res.items)).catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-background">
        <section className="py-16 bg-gradient-to-b from-white to-surface-2 dark:from-stone-900 dark:to-stone-900/40">
          <div className="container-2m">
            <div className="section-label mb-1">{t('ourPartners')}</div>
            <h1 className="section-title mb-2">{t('allBrands')}</h1>
            <p className="section-subtitle mb-10">{t('subtitle')}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {brandsList.map((brand) => {
                const count = productsList.filter((p) => p.brand === brand.name).length;
                return (
                  <Link
                    key={brand.name}
                    href={`/brands/${slugify(brand.name)}`}
                    className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all duration-200 group shadow-sm"
                  >
                    <div className="text-2xl w-10 h-10 flex items-center justify-center bg-surface-2 rounded-xl flex-shrink-0 border border-border-soft">
                      {brand.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-foreground text-sm truncate">{brand.name}</div>
                      <div className="text-[11px] text-muted">
                        {count > 0 ? t('productsCount', { count }) : t('explore')}
                      </div>
                    </div>
                    <ArrowRight size={13} className={`flex-shrink-0 text-muted group-hover:text-primary transition-colors ${isRtl ? 'rotate-180' : ''}`} />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
