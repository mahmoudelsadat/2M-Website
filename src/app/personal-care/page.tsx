import Navbar from '@/components/Navbar';
import CategoryPage from '@/components/CategoryPage';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Care — Hygiene & Grooming Essentials',
  description: 'Daily hygiene, grooming, and personal care products delivered to your door.',
};

export default function PersonalCarePage() {
  return (
    <>
      <Navbar />
      <main><CategoryPage categoryId="personal-care" /></main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
