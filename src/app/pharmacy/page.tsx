import Navbar from '@/components/layout/Navbar';
import CategoryPage from '@/components/product/CategoryPage';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/common/FloatingButtons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pharmacy — Vitamins, Supplements & More',
  description: 'Shop authentic vitamins, minerals, supplements, and OTC medicines. Pharmacist-curated, Egypt-wide delivery.',
};

export default function PharmacyPage() {
  return (
    <>
      <Navbar />
      <main><CategoryPage categoryId="pharmacy" /></main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
