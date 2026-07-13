import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import BackToTop from '@/components/BackToTop';
import { getBrands, getProducts } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { slugify } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'All Brands — Premium Health & Beauty Brands',
  description: 'Browse 500+ premium health, wellness, and beauty brands at 2M Premium Pharmacy.',
};

export default async function BrandsPage() {
  let brandsList: any[] = [];
  let productsList: any[] = [];

  try {
    brandsList = await getBrands();
    const res = await getProducts({ pageSize: 1000 });
    productsList = res.items;
  } catch (err) {
    console.error(err);
  }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--color-page-bg)' }}>
        <section className="py-16" style={{ background: 'linear-gradient(160deg,#fff 0%,#F8F7F4 100%)' }}>
          <div className="container-2m">
            <div className="section-label mb-1">Our Partners</div>
            <h1 className="section-title mb-2">All Brands</h1>
            <p className="section-subtitle mb-10">500+ internationally certified brands — authentic, pharmacist-verified.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {brandsList.map((brand) => {
                const count = productsList.filter((p) => p.brand === brand.name).length;
                return (
                  <Link
                    key={brand.name}
                    href={`/brands/${slugify(brand.name)}`}
                    className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-brand-primary)] hover:shadow-md transition-all duration-200 group"
                    style={{ boxShadow: '0 1px 4px rgba(28,25,23,0.05)' }}
                  >
                    <div className="text-2xl w-10 h-10 flex items-center justify-center bg-[var(--color-surface-2)] rounded-xl flex-shrink-0 border border-[var(--color-border-soft)]">
                      {brand.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[var(--color-text-primary)] text-sm truncate">{brand.name}</div>
                      <div className="text-[11px] text-[var(--color-text-muted)]">
                        {count > 0 ? `${count} products` : 'Explore'}
                      </div>
                    </div>
                    <ArrowRight size={13} className="flex-shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)] transition-colors" />
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
