import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import BackToTop from '@/components/layout/BackToTop';
import { getBrands, getProductsByBrand } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { slugify, formatEGP } from '@/lib/utils';
import { ArrowLeft, Star } from 'lucide-react';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const brands = await getBrands();
    return brands.map((b) => ({ slug: slugify(b.name) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const brands = await getBrands();
    const brand = brands.find((b) => slugify(b.name) === slug);
    if (!brand) return {};
    return {
      title: `${brand.name} Products — 2M Premium Pharmacy`,
      description: `Shop authentic ${brand.name} products at 2M Premium Pharmacy. Delivered across Egypt.`,
    };
  } catch {
    return {};
  }
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  let brands: any[] = [];
  try {
    brands = await getBrands();
  } catch (err) {
    console.error(err);
  }
  const brand = brands.find((b) => slugify(b.name) === slug);
  if (!brand) notFound();

  let brandProducts: any[] = [];
  try {
    brandProducts = await getProductsByBrand(brand.name);
  } catch (err) {
    console.error(err);
  }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--color-page-bg)' }}>
        {/* Header */}
        <section className="py-14 bg-white border-b border-[var(--color-border)]">
          <div className="container-2m">
            <Link href="/brands" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors mb-6">
              <ArrowLeft size={14} /> All Brands
            </Link>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center text-3xl border border-[var(--color-border)] flex-shrink-0">
                {brand.logo}
              </div>
              <div>
                <h1 className="text-3xl font-black text-[var(--color-text-primary)]">{brand.name}</h1>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                  {brandProducts.length > 0
                    ? `${brandProducts.length} product${brandProducts.length !== 1 ? 's' : ''} available`
                    : 'Products coming soon'}
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
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Coming Soon</h2>
                <p className="text-[var(--color-text-secondary)] mb-6">We are adding {brand.name} products soon.</p>
                <Link href="/pharmacy" className="btn btn-primary">Browse All Products</Link>
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
                      <p className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider mb-1">{p.brand}</p>
                      <h2 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors">{p.name}</h2>
                      <div className="flex items-center gap-1 mb-2">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={10} className={s <= Math.round(p.rating) ? 'fill-[#B8922A] text-[#B8922A]' : 'text-[#D4CCC0]'} />
                        ))}
                        <span className="text-[10px] text-[var(--color-text-muted)] ml-1">({p.reviewCount})</span>
                      </div>
                      <span className="text-base font-black text-[var(--color-text-primary)]">{formatEGP(p.price)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
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
