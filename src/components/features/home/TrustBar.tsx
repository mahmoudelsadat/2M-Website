'use client';

import { useEffect, useRef, useState } from 'react';
import { trustStats } from '@/lib/data';
import { ShieldCheck, Truck, CreditCard, RotateCcw, Stethoscope } from 'lucide-react';

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const STAT_COLORS = [
  { color: '#2B7CC1', bg: '#EBF4FB', glow: 'rgba(43,124,193,0.2)' },
  { color: 'var(--color-brand-primary)', bg: 'var(--color-brand-primary-soft)', glow: 'rgba(13,115,119,0.2)' },
  { color: '#4A7C59', bg: '#EDF3EE', glow: 'rgba(74,124,89,0.2)' },
  { color: '#B8922A', bg: '#FDF8EC', glow: 'rgba(184,146,42,0.2)' },
];

function Stat({
  value, suffix, label, labelAr, color, bg, glow, isRtl,
}: {
  value: number; suffix: string; label: string; labelAr: string;
  color: string; bg: string; glow: string; isRtl: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 1800, visible);
  const formatted = value >= 1000 ? `${(count / 1000).toFixed(count === value ? 0 : 1)}K` : count.toString();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-4 group">
      {/* Glow ring on scroll reveal */}
      <div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:-translate-y-1"
        style={{ background: bg, boxShadow: visible ? `0 8px 24px ${glow}` : 'none', transition: 'box-shadow 0.6s ease, transform 0.3s ease' }}
      >
        <div className="text-2xl font-black tabular-nums" style={{ color, fontVariantNumeric: 'tabular-nums', fontSize: '1.1rem' }}>
          {formatted}{suffix}
        </div>
      </div>
      <div className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
        {isRtl ? labelAr : label}
      </div>
    </div>
  );
}

const TRUST_ITEMS = [
  { icon: ShieldCheck, text: 'Authentic Products Guaranteed', textAr: 'منتجات أصلية مضمونة',   color: 'var(--color-brand-primary)' },
  { icon: CreditCard,  text: 'Cash on Delivery Available',   textAr: 'الدفع عند الاستلام',     color: '#2B7CC1' },
  { icon: Truck,       text: 'Egypt-Wide Delivery',          textAr: 'توصيل لكل مصر',          color: '#4A7C59' },
  { icon: RotateCcw,   text: '14-Day Easy Returns',          textAr: 'إرجاع مجاني ١٤ يوم',     color: '#B8922A' },
  { icon: Stethoscope, text: 'Pharmacist Curated',           textAr: 'اختيار صيادلة متخصصين', color: '#9B1239' },
];

export default function TrustBar() {
  const [isRtl, setIsRtl] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsRtl(document.documentElement.dir === 'rtl');
    const obs = new MutationObserver(() => setIsRtl(document.documentElement.dir === 'rtl'));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-14 border-y" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="container-2m">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {trustStats.map((s, i) => (
            <Stat
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              labelAr={s.labelAr}
              color={STAT_COLORS[i].color}
              bg={STAT_COLORS[i].bg}
              glow={STAT_COLORS[i].glow}
              isRtl={isRtl}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Trust signal pills */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-[0.8rem] font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <Icon size={13} style={{ color: item.color }} />
                <span>{isRtl ? item.textAr : item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
