'use client';

import { useState, useEffect, useRef } from 'react';
import { type Testimonial } from '@/lib/data';
import { getTestimonials } from '@/lib/api';
import { Star, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="p-6 rounded-2xl border flex flex-col gap-4 h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Stars */}
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((s) => (
          <Star key={s} size={14} className={s <= t.rating ? 'fill-[#B8922A] text-[#B8922A]' : ''} style={{ color: s <= t.rating ? '#B8922A' : 'var(--color-border)' }} />
        ))}
      </div>

      {/* Quote */}
      <p className="text-[0.9rem] leading-relaxed flex-1" style={{ color: 'var(--color-text-primary)' }}>&ldquo;{t.text}&rdquo;</p>

      {/* Product label */}
      <div className="text-[11px] font-semibold rounded-full px-3 py-1 w-fit"
        style={{ color: 'var(--color-brand-primary)', background: 'var(--color-brand-primary-soft)' }}>
        {t.product}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'var(--color-border-soft)' }}>
        <Image src={t.avatar} alt={t.name} width={36} height={36} className="rounded-full object-cover border" style={{ borderColor: 'var(--color-border)' }} />
        <div>
          <div className="flex items-center gap-1.5 text-[0.875rem] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {t.name}
            {t.verified && <CheckCircle size={12} style={{ color: '#2B7CC1' }} />}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{t.date}</div>
        </div>
        {t.verified && (
          <span className="ml-auto badge badge-sky text-[10px]">✓ Verified</span>
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
    <section className="py-16 border-t" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="container-2m">
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-label">Social Proof</div>
            <h2 className="section-title">What Customers Say</h2>
          </div>
          <div className="flex items-center gap-2">
            <button id="testimonials-prev" onClick={prev}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button id="testimonials-next" onClick={next}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Overall rating strip */}
        <div className="flex items-center gap-4 p-4 rounded-2xl mb-8 border" style={{ background: 'var(--color-brand-gold-soft)', borderColor: 'rgba(201,168,76,0.25)' }}>
          <div className="text-3xl font-black" style={{ color: 'var(--color-brand-gold-dark)' }}>4.9</div>
          <div>
            <div className="flex gap-0.5 mb-0.5">
              {[1,2,3,4,5].map((s) => <Star key={s} size={14} className="fill-[#B8922A] text-[#B8922A]" />)}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Based on <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>10,000+</span> verified reviews
            </div>
          </div>
          <div className="ml-auto hidden sm:block text-xs italic" style={{ color: 'var(--color-text-muted)' }}>
            &ldquo;Egypt&apos;s most trusted pharmacy brand&rdquo;
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
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                background: i === current ? 'var(--color-brand-primary)' : 'var(--color-border)',
              }}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
