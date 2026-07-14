import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import BackToTop from '@/components/layout/BackToTop';
import { getBrands, getProductsByBrand } from '@/lib/api';
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/utils';
import type { Metadata } from 'next';
import BrandPageClient from '@/components/features/brand/BrandPageClient';

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
      <BrandPageClient brand={brand} brandProducts={brandProducts} />
      <Footer />
      <BackToTop />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
