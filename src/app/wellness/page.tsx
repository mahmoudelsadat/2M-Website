import Navbar from '@/components/layout/Navbar';
import CategoryPage from '@/components/product/CategoryPage';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/common/FloatingButtons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wellness — Sports Nutrition, Sleep & More',
  description: 'Sports nutrition, weight management, sleep, and stress support products.',
};

export default function WellnessPage() {
  return (
    <>
      <Navbar />
      <main><CategoryPage categoryId="wellness" /></main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
