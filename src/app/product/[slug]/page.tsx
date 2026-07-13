import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import PDPClient from '@/components/features/product/PDPClient';
import { getProduct, getProducts } from '@/lib/api';
import { type Product } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const res = await getProducts({ pageSize: 1000 });
    return res.items.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    if (!product) return { title: 'Product Not Found' };
    return {
      title: product.name,
      description: `${product.description} Shop authentic ${product.brand} products with Egypt-wide delivery.`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      },
    };
  } catch {
    return { title: 'Product Not Found' };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product = null;
  try {
    product = await getProduct(slug);
  } catch (err) {
    console.error(err);
  }
  if (!product) notFound();

  let related: Product[] = [];
  try {
    const res = await getProducts({ category: product.category, pageSize: 100 });
    related = res.items.filter((p) => p.id !== product!.id).slice(0, 4);
  } catch (err) {
    console.error(err);
  }

  return (
    <>
      <Navbar />
      <main>
        <PDPClient product={product} related={related} />
      </main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
