'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations('Layout');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      id="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('backToTop')}
      className={`fixed bottom-24 right-5 z-30 w-10 h-10 rounded-full flex items-center justify-center border border-border bg-[#1b1c1c] text-white shadow-md hover:bg-[#2d2d2d] transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-2 scale-[0.85] pointer-events-none'
      }`}
    >
      <ArrowUp size={16} />
    </button>
  );
}
