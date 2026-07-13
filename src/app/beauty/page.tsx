import Navbar from '@/components/Navbar';
import CategoryPage from '@/components/CategoryPage';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beauty — Skincare, Hair & Body Care',
  description: 'Premium skincare, haircare, and body care brands delivered across Egypt.',
};

export default function BeautyPage() {
  return (
    <>
      <Navbar />
      <main><CategoryPage categoryId="beauty" /></main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
