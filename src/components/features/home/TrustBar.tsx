'use client';

import { useEffect, useRef, useState } from 'react';
import { trustStats } from '@/lib/data';
import { ShieldCheck, Truck, CreditCard, RotateCcw, Stethoscope } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';

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
  { colorClass: 'text-primary', bgClass: 'bg-primary/10 border-primary/20', glowClass: 'shadow-primary/10' },
  { colorClass: 'text-gold',    bgClass: 'bg-gold/10 border-gold/20',       glowClass: 'shadow-gold/10' },
  { colorClass: 'text-accent',  bgClass: 'bg-accent/10 border-accent/20',   glowClass: 'shadow-accent/10' },
  { colorClass: 'text-primary', bgClass: 'bg-primary/10 border-primary/20', glowClass: 'shadow-primary/10' },
];

const labelKeys = ['premiumBrands', 'happyCustomers', 'governoratesCovered', 'authenticProducts'];

function Stat({
  value, suffix, labelKey, colorClass, bgClass, glowClass,
}: {
  value: number; suffix: string; labelKey: string;
  colorClass: string; bgClass: string; glowClass: string;
}) {
  const { t } = useTranslation();
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
        className={`relative w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:-translate-y-1 border ${bgClass} ${
          visible ? `shadow-xl ${glowClass}` : 'shadow-none'
        }`}
      >
        <div className={`text-2xl font-black tabular-nums ${colorClass}`}>
          {formatted}{suffix}
        </div>
      </div>
      <div className="text-sm font-semibold text-muted-foreground">
        {t(labelKey)}
      </div>
    </div>
  );
}

const TRUST_ITEMS = [
  { icon: ShieldCheck, textKey: 'authenticGuarantee', colorClass: 'text-primary' },
  { icon: CreditCard,  textKey: 'codAvailable',        colorClass: 'text-accent' },
  { icon: Truck,       textKey: 'egyptWideDelivery',   colorClass: 'text-primary' },
  { icon: RotateCcw,   textKey: 'easyReturns',         colorClass: 'text-gold' },
  { icon: Stethoscope, textKey: 'pharmacistCurated',   colorClass: 'text-primary' },
];

export default function TrustBar() {
  const { t } = useTranslation();

  return (
    <section className="py-20 border-y bg-card border-border-theme">
      <div className="container-2m">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {trustStats.map((s, i) => (
            <Stat
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              labelKey={labelKeys[i]}
              colorClass={STAT_COLORS[i].colorClass}
              bgClass={STAT_COLORS[i].bgClass}
              glowClass={STAT_COLORS[i].glowClass}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="section-divider my-12" />

        {/* Trust signal pills */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.textKey}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-theme bg-surface-2 text-[0.8rem] font-semibold text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-card shadow-sm"
              >
                <Icon size={14} className={item.colorClass} />
                <span>{t(item.textKey)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
