import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import AboutClient from '@/components/features/about/AboutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Our Story & Mission',
  description: "Learn about 2M Premium Pharmacy — Egypt's trusted destination for authentic health, wellness, and beauty products.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutClient />
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
