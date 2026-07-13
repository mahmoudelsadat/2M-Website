'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    label: 'Orders & Products',
    icon: '📦',
    faqs: [
      { q: 'Are all products on 2M Premium Pharmacy authentic?', a: 'Yes, 100%. Every product is sourced directly from authorized distributors. We have zero tolerance for counterfeit or grey market products.' },
      { q: 'How do I know which product is right for me?', a: 'You can use our search to find products by health goal or ingredient. For personalized advice, chat with our pharmacist on WhatsApp.' },
      { q: 'Can I find out-of-stock products?', a: "Yes! Click 'Notify Me' on any out-of-stock product and we'll alert you via email or WhatsApp as soon as it's back." },
      { q: 'Do you carry Egyptian and international brands?', a: 'Yes. We carry both local Egyptian brands and top international brands including Now Foods, Nordic Naturals, The Ordinary, Optimum Nutrition, and more.' },
    ],
  },
  {
    label: 'Delivery',
    icon: '🚚',
    faqs: [
      { q: 'Do you deliver across all of Egypt?', a: 'Yes! We deliver to all 27 Egyptian governorates. Delivery time is typically 2–5 business days. Cairo and Giza may be faster.' },
      { q: 'What is the delivery fee?', a: 'Orders above EGP 500 receive FREE delivery. A flat delivery fee applies to orders below this threshold.' },
      { q: 'How can I track my order?', a: 'Once your order is dispatched, you will receive a WhatsApp message with tracking details and an estimated delivery time.' },
      { q: 'Do you deliver on weekends?', a: 'Delivery operates Saturday through Thursday. Friday deliveries may be available in some areas — contact us to confirm.' },
    ],
  },
  {
    label: 'Payment',
    icon: '💳',
    faqs: [
      { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), Visa, Mastercard, and InstaPay. Select your preferred method at checkout.' },
      { q: 'Is Cash on Delivery available everywhere?', a: 'Yes! COD is available for all Egyptian governorates. You pay the exact amount shown at checkout when the order arrives.' },
      { q: 'Are online card payments secure?', a: 'Yes. All card payments are processed through an encrypted, PCI-DSS compliant payment gateway. We never store your card details.' },
      { q: 'Are there any hidden fees?', a: 'Never. The price you see at checkout (including any delivery fee) is the final amount you pay. No surprises.' },
    ],
  },
  {
    label: 'Returns & Refunds',
    icon: '↩️',
    faqs: [
      { q: 'What is your return policy?', a: 'We accept returns within 14 days of delivery for unopened products in original condition. Damaged or wrong items can be returned immediately.' },
      { q: 'How do I return a product?', a: 'Contact us on WhatsApp with your order number and reason for return. We will arrange a pickup and process your refund.' },
      { q: 'How long do refunds take?', a: 'Refunds are processed within 3–5 business days after we receive the returned product. COD refunds are issued via bank transfer or InstaPay.' },
      { q: 'Can I return opened products?', a: 'Opened products can only be returned if they are defective or damaged. For health and safety reasons, opened supplements and medicines cannot be returned if changed your mind.' },
    ],
  },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${open ? 'border-[var(--color-brand-primary)]/30' : 'border-white/6 hover:border-white/12'}`}
      style={{ background: open ? 'rgba(200,16,46,0.04)' : '#0E0E0E' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={`font-semibold text-sm leading-snug ${open ? 'text-white' : 'text-gray-200'}`}>{faq.q}</span>
        {open
          ? <ChevronUp size={16} className="text-[var(--color-brand-primary)] flex-shrink-0" />
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

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section
          className="py-20 text-center"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(200,16,46,0.1) 0%, transparent 70%), #060700' }}
        >
          <div className="container-2m">
            <div className="section-label mx-auto w-fit mb-4">Support</div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Frequently Asked <span className="text-gradient-primary">Questions</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
              Everything you need to know about ordering, delivery, payments, and returns. Can&apos;t find your answer?
            </p>
            <a
              href="https://wa.me/201115160947"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              <MessageCircle size={16} /> Chat with us on WhatsApp
            </a>
          </div>
        </section>

        {/* FAQ Body */}
        <section className="py-16" style={{ background: '#080808' }}>
          <div className="container-2m max-w-3xl">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {FAQ_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCategory === i
                      ? 'bg-[var(--color-brand-primary)] text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {FAQ_CATEGORIES[activeCategory].faqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} />
              ))}
            </div>

            {/* Still need help */}
            <div
              className="mt-12 p-8 rounded-2xl text-center"
              style={{ background: 'linear-gradient(135deg, rgba(200,16,46,0.1), rgba(200,16,46,0.03))', border: '1px solid rgba(200,16,46,0.2)' }}
            >
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-white font-black text-xl mb-2">Still have a question?</h3>
              <p className="text-gray-400 text-sm mb-5">Our team is available Sat–Thu, 9am–9pm Cairo time.</p>
              <a
                href="https://wa.me/201115160947"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
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
