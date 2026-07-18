'use client';

import { useState, useEffect, useRef } from 'react';
import { type Testimonial } from '@/lib/data';
import { getTestimonials } from '@/lib/api';
import { Star, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

function TestimonialCard({ t: item }: { t: Testimonial }) {
  const t = useTranslations('Home');

  return (
    <div
      className="p-6 rounded-2xl border flex flex-col gap-4 h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-sm bg-white border-border shadow-xs"
    >
      {/* Stars */}
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((s) => (
          <Star key={s} size={14} className={s <= item.rating ? 'fill-brand-gold text-brand-gold' : 'text-border'} />
        ))}
      </div>

      {/* Quote */}
      <p className="text-[0.9rem] leading-relaxed flex-1 text-text-primary">&ldquo;{item.text}&rdquo;</p>

      {/* Product label */}
      <div className="text-[11px] font-semibold rounded-full px-3 py-1 w-fit text-brand-primary bg-brand-primary-soft">
        {item.product}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <Image src={item.avatar} alt={item.name} width={36} height={36} className="rounded-full object-cover border border-border" />
        <div>
          <div className="flex items-center gap-1.5 text-[0.875rem] font-semibold text-text-primary">
            {item.name}
            {item.verified && <CheckCircle size={12} className="text-brand-primary" />}
          </div>
          <div className="text-[11px] text-text-muted">{item.date}</div>
        </div>
        {item.verified && (
          <span className="ml-auto badge badge-sky text-[10px]">{t('verified')}</span>
        )}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null!);
  const t = useTranslations('Home');

  useEffect(() => {
    getTestimonials().then(setTestimonials).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (paused || testimonials.length === 0) return;
    intervalRef.current = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(intervalRef.current);
  }, [paused, testimonials]);

  const prev = () => { if (testimonials.length === 0) return; setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length); };
  const next = () => { if (testimonials.length === 0) return; setCurrent((c) => (c + 1) % testimonials.length); };

  if (testimonials.length === 0) return null;

  const visible = testimonials.length >= 3 ? [
    testimonials[current % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ] : testimonials;

  return (
    <section className="py-16 border-t bg-surface-2 border-border">
      <div className="container-2m">
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-label">{t('socialProof')}</div>
            <h2 className="section-title">{t('whatCustomersSay')}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button id="testimonials-prev" onClick={prev}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 bg-white border-border text-text-secondary hover:bg-surface-2"
            >
              <ChevronLeft size={16} />
            </button>
            <button id="testimonials-next" onClick={next}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 bg-white border-border text-text-secondary hover:bg-surface-2"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Overall rating strip */}
        <div className="flex items-center gap-4 p-4 rounded-2xl mb-8 border bg-brand-gold-soft/50 border-brand-gold-soft">
          <div className="text-3xl font-black text-brand-gold-dark">4.9</div>
          <div>
            <div className="flex gap-0.5 mb-0.5">
              {[1,2,3,4,5].map((s) => <Star key={s} size={14} className="fill-brand-gold text-brand-gold" />)}
            </div>
            <div className="text-sm text-text-secondary">
              {t('basedOn')} <span className="font-bold text-text-primary">10,000+</span> {t('verifiedReviews')}
            </div>
          </div>
          <div className="ml-auto hidden sm:block text-xs italic text-text-secondary">
            &ldquo;{t('egyptMostTrustedBrand')}&rdquo;
          </div>
        </div>

        {/* Desktop: 3-col — pause autoplay on hover */}
        <div
          className="hidden md:grid grid-cols-3 gap-5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="popLayout">
            {visible.map((t, i) => (
              <motion.div
                key={`${t.id}-${current}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <TestimonialCard t={t} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mobile: single card */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <TestimonialCard t={testimonials[current]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-1.5 mt-7">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-brand-primary' : 'w-2 bg-border'}`}
              aria-label={t('goToReview', { index: i + 1 })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
