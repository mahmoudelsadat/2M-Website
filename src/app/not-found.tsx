import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { products } from '@/lib/data';
import { ArrowRight, Home } from 'lucide-react';
import { formatEGP } from '@/lib/utils';

export default function NotFound() {
  const trending = products.slice(0, 4);

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--color-page-bg)' }}>
        {/* Hero */}
        <section className="py-24 text-center" style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F8F7F4 100%)' }}>
          <div className="container-2m max-w-lg">
            <div className="text-8xl mb-6 select-none" aria-hidden="true">🔍</div>
            <h1 className="text-4xl font-black text-[var(--color-text-primary)] mb-4">Page Not Found</h1>
            <p className="text-[var(--color-text-secondary)] mb-8 text-base leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/" className="btn btn-primary px-7 py-3">
                <Home size={16} /> Back to Home
              </Link>
              <Link href="/pharmacy" className="btn btn-ghost px-7 py-3">
                Browse Products <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Trending */}
        <section className="py-16 bg-white border-t border-[var(--color-border)]">
          <div className="container-2m">
            <div className="section-label mb-1">While You&apos;re Here</div>
            <h2 className="section-title mb-8">Trending Products</h2>
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
                    <p className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider mb-1">{p.brand}</p>
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors">{p.name}</h3>
                    <span className="text-base font-black text-[var(--color-text-primary)]">{formatEGP(p.price)}</span>
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
