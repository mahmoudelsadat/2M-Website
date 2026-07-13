import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import CategoryGrid from '@/components/sections/CategoryGrid';
import TrendingProducts from '@/components/sections/TrendingProducts';
import HowItWorks from '@/components/sections/HowItWorks';
import Testimonials from '@/components/sections/Testimonials';
import InstagramFeed from '@/components/sections/InstagramFeed';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/common/FloatingButtons';
import BackToTop from '@/components/common/BackToTop';
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
