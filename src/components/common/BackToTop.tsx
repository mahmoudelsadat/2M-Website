'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      id="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-24 right-5 z-40 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 lg:bottom-8"
      style={{
        background: '#060700',
        color: '#fff',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.85)',
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: '0 4px 20px rgba(6,7,0,0.25)',
      }}
    >
      <ArrowUp size={16} />
    </button>
  );
}
