import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/features/home/Hero';
import TrustBar from '@/components/features/home/TrustBar';
import CategoryGrid from '@/components/features/product/CategoryGrid';
import TrendingProducts from '@/components/features/product/TrendingProducts';
import HowItWorks from '@/components/features/home/HowItWorks';
import Testimonials from '@/components/features/home/Testimonials';
import InstagramFeed from '@/components/features/home/InstagramFeed';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import BackToTop from '@/components/layout/BackToTop';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "2M Premium Pharmacy — Egypt's Trusted Health & Wellness Store",
  description:
    'Shop authentic vitamins, supplements, pharmacy products, and premium beauty brands with Egypt-wide delivery and cash on delivery.',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex flex-col min-h-screen bg-background">
        <Hero />
        <TrustBar />
        <CategoryGrid />
        <TrendingProducts />
        <HowItWorks />
        <Testimonials />
        <InstagramFeed />
      </main>
      <Footer />
      <BackToTop />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
