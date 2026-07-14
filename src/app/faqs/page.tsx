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
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${open ? 'border-primary/30 bg-primary/4' : 'border-white/6 hover:border-white/12 bg-dark-surface'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={`font-semibold text-sm leading-snug ${open ? 'text-white' : 'text-gray-200'}`}>{faq.q}</span>
        {open
          ? <ChevronUp size={16} className="text-primary flex-shrink-0" />
          : <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
        }
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-48' : 'max-h-0'}`}>
        <p className="px-5 pb-4 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
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
          className="py-20 text-center bg-dark-hero"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(200,16,46,0.1) 0%, transparent 70%), var(--color-dark-hero)' }}
        >
          <div className="container-2m">
            <div className="section-label mx-auto w-fit mb-4">{t('support')}</div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              {t('faqTitle').split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient-primary">{t('faqTitle').split(' ').slice(-1)[0]}</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
              {t('faqSubtitle')}
            </p>
            <a
              href="https://wa.me/201115160947"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              <MessageCircle size={16} /> {t('chatWhatsapp')}
            </a>
          </div>
        </section>

        {/* FAQ Body */}
        <section className="py-16 bg-dark-bg">
          <div className="container-2m max-w-3xl">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {FAQ_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.labelKey}
                  onClick={() => setActiveCategory(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCategory === i
                      ? 'bg-primary text-white border border-transparent'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
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
              className="mt-12 p-8 rounded-2xl text-center border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/3"
            >
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-white font-black text-xl mb-2">{t('stillHaveQuestion')}</h3>
              <p className="text-gray-400 text-sm mb-5">{t('teamAvailable')}</p>
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
