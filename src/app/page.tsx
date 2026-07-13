import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import CategoryGrid from '@/components/CategoryGrid';
import TrendingProducts from '@/components/TrendingProducts';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import InstagramFeed from '@/components/InstagramFeed';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import BackToTop from '@/components/BackToTop';
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
      <main id="main-content">
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
