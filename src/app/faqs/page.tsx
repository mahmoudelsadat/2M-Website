'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const FAQ_CATEGORIES = [
  { labelKey: 'catOrders' as const, icon: '📦', count: 4 },
  { labelKey: 'catDelivery' as const, icon: '🚚', count: 4 },
  { labelKey: 'catPayment' as const, icon: '💳', count: 4 },
  { labelKey: 'catReturns' as const, icon: '↩️', count: 4 },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${open ? 'border-brand-primary/20 bg-brand-primary-soft/20' : 'border-border hover:border-brand-primary/10 bg-surface-2'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={`font-semibold text-sm leading-snug ${open ? 'text-brand-primary' : 'text-text-primary'}`}>{faq.q}</span>
        {open
          ? <ChevronUp size={16} className="text-brand-primary flex-shrink-0" />
          : <ChevronDown size={16} className="text-text-muted flex-shrink-0" />
        }
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-48' : 'max-h-0'}`}>
        <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
      </div>
    </div>
  );
}

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const t = useTranslations('Faqs');

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section
          className="py-20 text-center bg-surface-2 border-b border-border"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(139,0,0,0.06) 0%, transparent 70%)' }}
        >
          <div className="container-2m">
            <div className="section-label mx-auto w-fit mb-4">{t('support')}</div>
            <h1 className="text-4xl sm:text-5xl font-black text-text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              {t('faqTitle').split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient-primary">{t('faqTitle').split(' ').slice(-1)[0]}</span>
            </h1>
            <p className="text-text-secondary max-w-xl mx-auto text-sm leading-relaxed">
              {t('faqSubtitle')}
            </p>
            <a
              href="https://wa.me/201115160947"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm text-emerald-600 hover:text-emerald-500 font-semibold transition-colors"
            >
              <MessageCircle size={16} /> {t('chatWhatsapp')}
            </a>
          </div>
        </section>

        {/* FAQ Body */}
        <section className="py-16 bg-surface">
          <div className="container-2m max-w-3xl">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {FAQ_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.labelKey}
                  onClick={() => setActiveCategory(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                    activeCategory === i
                      ? 'bg-brand-primary text-white border-transparent shadow-sm'
                      : 'bg-surface-2 text-text-secondary hover:bg-surface-3 hover:text-text-primary border-border'
                  }`}
                >
                  <span>{cat.icon}</span> {t(cat.labelKey)}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {Array.from({ length: FAQ_CATEGORIES[activeCategory].count }, (_, idx) => (
                <FAQItem
                  key={idx}
                  faq={{
                    q: t(`q_${activeCategory}_${idx}` as any),
                    a: t(`a_${activeCategory}_${idx}` as any),
                  }}
                />
              ))}
            </div>

            {/* Still need help */}
            <div
              className="mt-12 p-8 rounded-2xl text-center border border-brand-primary/10 bg-brand-primary-soft/20 dark:bg-brand-primary-soft/10 shadow-sm"
            >
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-text-primary font-black text-xl mb-2">{t('stillHaveQuestion')}</h3>
              <p className="text-text-secondary text-sm mb-5">{t('teamAvailable')}</p>
              <a
                href="https://wa.me/201115160947"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={16} /> {t('chatOnWhatsapp')}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
