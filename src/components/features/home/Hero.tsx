'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, Star, Timer, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/LanguageContext';

// ── Countdown Timer ────────────────────────────────────────────
function useCountdown(targetHours = 5, targetMins = 48, targetSecs = 33) {
  const [time, setTime] = useState({ h: targetHours, m: targetMins, s: targetSecs });
  useEffect(() => {
    const id = setInterval(() => {
      setTime(prev => {
        const { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 5, m: 48, s: 33 }; // reset
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(time.h)}:${pad(time.m)}:${pad(time.s)}`;
}

// ── Trust brand logos ──────────────────────────────────────────
const TRUST_BRANDS = [
  'Now Foods', 'NeoCell', 'Life Extension', 'Solgar', 'Arencia', 'COSRX',
  'Olaplex', 'Centrum', "Nature's Truth", 'NatureBell', 'CeraVe', 'La Roche-Posay'
];

function getLogoPath(brand: string): string {
  switch (brand.toLowerCase()) {
    case 'now foods':
      return '/brands/now-foods.svg';
    case 'neocell':
      return '/brands/neocell.svg';
    case 'life extension':
      return '/brands/life-extension.svg';
    case 'solgar':
      return '/brands/solgar.png';
    case 'arencia':
      return '/brands/arencia.png';
    case 'cosrx':
      return '/brands/cosrx.png';
    case 'olaplex':
      return '/brands/olaplex.svg';
    case 'centrum':
      return '/brands/centrum.webp';
    case "nature's truth":
      return '/brands/natures-truth.png';
    case 'naturebell':
      return '/brands/naturebell.png';
    case 'cerave':
      return '/brands/cerave.png';
    case 'la roche-posay':
      return '/brands/laroche-posay.jpg';
    default:
      return '';
  }
}

// ── Floating stat cards ────────────────────────────────────────
const STAT_CARDS = [
  { value: '10K+', labelKey: 'happyCustomers', colorClass: 'text-primary', bgClass: 'bg-primary/10', x: '-5rem', y: '25%', delay: 0 },
  { value: '4.9★', labelKey: 'rating',         colorClass: 'text-gold',    bgClass: 'bg-gold/10',    x: '2rem',   y: '80%', delay: 1.5 },
  { value: '500+', labelKey: 'brands',         colorClass: 'text-accent',  bgClass: 'bg-accent/10',  x: '3rem',   y: '10%', delay: 1.0 },
];

export default function Hero() {
  const { t, isRtl } = useTranslation();
  const countdown = useCountdown();
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const animRef    = useRef<number>(0);

  /* Soft floating blobs */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener('resize', resize);

    const blobs = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 100 + Math.random() * 160,
      dx: (Math.random() - 0.5) * 0.35, dy: (Math.random() - 0.5) * 0.35,
      hue: [181, 190, 195, 46, 160, 210, 170][i % 7],
      alpha: 0.055 + Math.random() * 0.045,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      blobs.forEach((b) => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `hsla(${b.hue},65%,72%,${b.alpha})`);
        g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        b.x += b.dx; b.y += b.dy;
        if (b.x < -b.r) b.x = W + b.r; if (b.x > W + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = H + b.r; if (b.y > H + b.r) b.y = -b.r;
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animRef.current); };
  }, []);

  return (
    <section className="relative overflow-hidden bg-background min-h-[95vh] flex flex-col justify-between">
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      {/* Decorative blobs */}
      <div aria-hidden="true" className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none bg-brand-primary/5 opacity-[0.04] translate-x-[35%] -translate-y-[35%]" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none bg-brand-accent/5 opacity-[0.04] -translate-x-[35%] translate-y-[35%]" />

      <div className="container-2m relative z-10 flex-grow flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full py-20 lg:py-28">

          {/* ─── LEFT COPY ─── */}
          <div className="max-w-xl lg:max-w-2xl">

            {/* Flash sale banner */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.0 }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-brand-primary-soft bg-brand-primary-soft text-brand-primary text-xs font-bold"
            >
              <Zap size={12} className="fill-current text-brand-primary" />
              <span>{t('flashSaleEnds')}</span>
              <span className="font-black tabular-nums text-brand-primary">{countdown}</span>
              <Timer size={12} className="text-brand-primary" />
            </motion.div>

            {/* Trust chips */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="flex items-center gap-2 mb-8"
            >
              <span className="badge badge-primary-soft text-[11px] px-3 py-1 flex items-center gap-1 border border-brand-primary-soft">
                <Star size={9} className="fill-brand-primary text-brand-primary" />
                {t('egyptMostTrusted')}
              </span>
              <span className="badge badge-light text-[11px] px-3 py-1 border border-border">
                {t('cairo')} 🇪🇬
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
              className={`text-[2.8rem] sm:text-[3.4rem] lg:text-[3.8rem] xl:text-[4.2rem] font-black leading-[1.05] mb-5 text-text-primary ${
                isRtl ? 'tracking-normal font-body' : 'tracking-wider font-display'
              }`}
            >
              {t('heroTitleLine1')}
              <br />
              <span className="text-gradient-primary">{t('heroTitleLine2')}</span>
              <br />
              <span className="text-brand-primary italic">{t('heroTitleLine3')}</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="text-[1.05rem] font-medium leading-relaxed mb-8 max-w-[42ch] text-text-secondary"
            >
              {t('heroSubtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.30 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <Link
                href="/pharmacy"
                id="hero-cta-shop"
                className="btn btn-primary btn-shimmer btn-elevated text-[0.95rem] px-8 py-4 flex items-center gap-2 text-white"
              >
                {t('shopNow')} <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
              </Link>
              <Link
                href="/about"
                id="hero-cta-about"
                className="btn btn-ghost text-[0.95rem] px-8 py-4 rounded-xl border border-border hover:bg-surface-2 text-text-secondary"
              >
                {t('ourStory')}
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="flex flex-wrap items-center gap-5 text-[0.82rem] text-text-secondary"
            >
              {[
                { icon: ShieldCheck, text: t('authenticShort'), colorClass: 'text-brand-primary' },
                { icon: Truck, text: t('egyptWideDelivery'), colorClass: 'text-brand-accent' },
                { icon: Star, text: t('pharmacistCurated'), colorClass: 'text-brand-gold', fill: true },
              ].map(({ icon: Icon, text, colorClass, fill }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon size={14} className={`${colorClass} ${fill ? 'fill-current' : ''}`} />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── RIGHT VISUAL ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Main product image */}
              <div className="w-[340px] h-[340px] xl:w-[400px] xl:h-[400px] rounded-[40px] flex items-center justify-center overflow-hidden relative bg-gradient-to-br from-white to-surface-2 border border-border shadow-sm">
                <Image
                  src="/hero-products.png"
                  alt={t('heroImageAlt')}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 340px, 400px"
                />
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white pointer-events-none" />
              </div>

              {/* Floating stat cards */}
              {STAT_CARDS.map((card) => (
                <motion.div
                  key={card.value}
                  className="absolute bg-white rounded-2xl px-4 py-3 border border-border shadow-sm"
                  style={{
                    [isRtl ? 'right' : 'left']: card.x.startsWith('-') ? 'auto' : undefined,
                    [isRtl ? 'left' : 'right']: card.x.startsWith('-') ? undefined : 'auto',
                    top: card.y,
                    left: isRtl ? undefined : card.x,
                    right: isRtl ? card.x : undefined,
                    animation: `float ${6 + card.delay * 1.5}s ease-in-out infinite ${card.delay}s`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + card.delay * 0.2, duration: 0.4, type: 'spring', stiffness: 200 }}
                >
                  <div className={`text-xl font-black leading-none ${card.colorClass === 'text-primary' ? 'text-brand-primary' : card.colorClass === 'text-accent' ? 'text-brand-accent' : 'text-brand-gold-dark'}`}>{card.value}</div>
                  <div className="text-[11px] font-semibold mt-0.5 text-text-secondary">
                    {t(card.labelKey)}
                  </div>
                </motion.div>
              ))}

              {/* Decorative ring */}
              <div
                className="absolute -inset-8 rounded-full border-2 border-dashed border-brand-primary/10 opacity-30 pointer-events-none"
                style={{ animation: 'spin-slow 30s linear infinite' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Brand trust logo strip ─── */}
      <div className="relative z-10 border-t border-border bg-white">
        <div className="container-2m py-8">
          <div className="flex items-center gap-8 overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] flex-shrink-0 text-text-secondary">
              {t('topBrands')}
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-8 items-center animate-marquee" style={{ animation: 'marquee 25s linear infinite' }}>
                {[...TRUST_BRANDS, ...TRUST_BRANDS].map((brand, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 h-20 w-[130px] bg-white border border-[#e5e5e5] rounded-[14px] flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.07)] hover:border-neutral-300 transition-all duration-300 cursor-pointer p-4"
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={getLogoPath(brand)}
                        alt={brand}
                        fill
                        sizes="110px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-t from-[#fcf9f8] to-transparent" aria-hidden="true" />
    </section>
  );
}
