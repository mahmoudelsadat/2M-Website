/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart, User, Menu, X, ChevronDown, Sun, Moon,
  ShieldCheck, Globe, Search, Pill, Sparkles, Leaf, Droplets,
  Tag, Package, Phone, ArrowRight, Zap, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '@/lib/data';
import { useCartStore, useWishlistStore } from '@/lib/store';
import SearchAutocomplete from './SearchAutocomplete';
import { useTranslation } from '@/lib/LanguageContext';

// ─── Category Icon Map ─────────────────────────────────────────
const CAT_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  PHARMACY:      { icon: <Pill size={14} />,     color: '#2B7CC1', bg: '#EBF4FB' },
  BEAUTY:        { icon: <Sparkles size={14} />, color: '#C4665A', bg: '#FDEEEC' },
  WELLNESS:      { icon: <Leaf size={14} />,     color: '#4A7C59', bg: '#EDF3EE' },
  'PERSONAL CARE': { icon: <Droplets size={14} />, color: '#B5742A', bg: '#FDF3E5' },
  OFFERS:        { icon: <Tag size={14} />,      color: '#9B1239', bg: '#FEF2F2' },
  BRANDS:        { icon: <Package size={14} />,  color: '#1E3A8A', bg: '#EBF0FB' },
};

// ─── Dark Mode Toggle ──────────────────────────────────────────
function DarkModeToggle({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('2m-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('2m-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  if (!mounted) return <div className={compact ? 'w-8 h-8' : 'w-9 h-9'} />;

  return (
    <motion.button
      id="dark-mode-toggle"
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      className={`${compact ? 'w-8 h-8' : 'w-9 h-9'} rounded-xl flex items-center justify-center border transition-all duration-300`}
      style={{
        background: dark ? 'rgba(255,255,255,0.06)' : 'var(--color-surface)',
        borderColor: dark ? 'rgba(255,255,255,0.1)' : 'var(--color-border)',
        color: dark ? 'var(--color-brand-gold)' : 'var(--color-text-secondary)',
      }}
      aria-label={dark ? 'Light mode' : 'Dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'sun' : 'moon'}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0,   opacity: 1, scale: 1 }}
          exit={{ rotate:   90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Announcement marquee items ───────────────────────────────
const ANNOUNCEMENTS_EN = [
  '🚚 Free delivery on orders over EGP 500',
  '⚡ Pay via InstaPay · Vodafone Cash · e& Cash',
  '✅ 100% Authentic — Pharmacist Curated Products',
  '📦 Egypt-wide delivery in 2–5 business days',
  '💊 Prescription advice? Chat with us on WhatsApp',
];
const ANNOUNCEMENTS_AR = [
  '🚚 توصيل مجاني للطلبات أكثر من 500 جنيه',
  '⚡ الدفع عبر InstaPay · Vodafone Cash · e& Cash',
  '✅ منتجات أصلية 100% — اختيار صيادلة متخصصين',
  '📦 توصيل لكافة محافظات مصر خلال 2–5 أيام عمل',
  '💊 استشارة دوائية؟ تحدث معنا على واتساب',
];

// ─── Navbar ───────────────────────────────────────────────────
interface NavbarProps { cartCount?: number; }

export default function Navbar({ cartCount }: NavbarProps) {
  const { t, locale, setLocale, isRtl } = useTranslation();

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [activeMenu,   setActiveMenu]   = useState<string | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [adminLoggedIn,setAdminLoggedIn]= useState(false);
  const [annoIdx,      setAnnoIdx]      = useState(0);

  const pathname    = usePathname();
  const storeCount  = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishlistCount = useWishlistStore((s) => s.idsArr.length);
  const displayCount = cartCount ?? storeCount;
  const menuRef      = useRef<NodeJS.Timeout | null>(null);
  
  // Mobile accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Auth
  const syncAuth = () => {
    setUserLoggedIn(localStorage.getItem('2m-user-logged-in') === 'true');
    setAdminLoggedIn(localStorage.getItem('2m-admin-logged-in') === 'true');
  };
  useEffect(() => {
    syncAuth();
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Announcement rotator (No longer used as we switched to continuous marquee, keeping for backwards compat if needed, but not actively used in JSX now)
  // useEffect(() => {
  //   const id = setInterval(() => setAnnoIdx(i => (i + 1) % ANNOUNCEMENTS_EN.length), 3500);
  //   return () => clearInterval(id);
  // }, []);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  const openMenu  = (label: string) => { if (menuRef.current) clearTimeout(menuRef.current); setActiveMenu(label); };
  const closeMenu = () => { menuRef.current = setTimeout(() => setActiveMenu(null), 120); };

  // Megamenu featured deal
  const getMegaDeal = (label: string) => {
    const deals: Record<string, { emoji: string; title: string; titleAr: string; desc: string; descAr: string; badge: string; link: string }> = {
      PHARMACY:  { emoji: '💊', title: "Pharmacist's Pick",  titleAr: 'اختيار الصيدلاني',  desc: 'Solgar Vitamin D3 (10,000 IU) — premium high-absorption immunity boost.', descAr: 'سولغار فيتامين د3 ١٠٠٠٠ وحدة — تعزيز المناعة فائق الامتصاص.', badge: '20% OFF', link: '/product/vitamin-d3-5000iu' },
      BEAUTY:    { emoji: '✨', title: 'Derm Choice',        titleAr: 'اختيار الجلدية',    desc: 'Altruist SPF50 — ultra-hydrating broad-spectrum daily protection.', descAr: 'ألترويست SPF50 — واقي شمس مرطب طيف واسع.', badge: 'Best Seller', link: '/product/spf-50-sunscreen' },
      WELLNESS:  { emoji: '🌿', title: 'Pure Nutrition',     titleAr: 'تغذية نقية',        desc: 'Nordic Naturals Omega-3 — pure heart & brain essential fatty acids.', descAr: 'نورديك ناتشورالز أوميغا 3 — أحماض دهنية نقية للقلب والذاكرة.', badge: '100% Pure', link: '/product/omega-3-fish-oil' },
      'PERSONAL CARE': { emoji: '🧴', title: 'Daily Essentials', titleAr: 'أساسيات يومية', desc: 'CeraVe Hydrating Cleanser — fortify skin barrier with ceramides.', descAr: 'سيرافي غسول مرطب — حماية الحاجز الجلدي بالسيراميدات.', badge: 'NEW', link: '/product/whey-protein-chocolate' },
    };
    return deals[label] ?? deals['PHARMACY'];
  };

  return (
    <>
      {/* ── Announcement Bar ─────────────────────────────────── */}
      <div
        className="relative z-50 select-none overflow-hidden"
        style={{ background: 'var(--color-brand-primary)', minHeight: '36px' }}
      >
        <div className="container-2m flex items-center justify-between h-9 gap-4">
          {/* Left: scrolling announcement marquee */}
          <div className="flex-1 overflow-hidden relative h-full flex items-center whitespace-nowrap mask-edges">
            <div className="flex w-max" style={{ animation: 'marquee 40s linear infinite' }}>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-8 px-4 items-center">
                  {(isRtl ? ANNOUNCEMENTS_AR : ANNOUNCEMENTS_EN).map((anno, idx) => (
                    <span key={idx} className="text-[11px] font-semibold text-white/90">
                      {anno}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right: trust badges + admin pill */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="https://wa.me/201115160947"
              target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              <Phone size={11} />
              <span>01115160947</span>
            </a>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-white/70 font-medium">
              <ShieldCheck size={11} style={{ color: 'var(--color-brand-gold)' }} />
              {isRtl ? 'أصلي 100%' : '100% Authentic'}
            </span>
            {adminLoggedIn && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1 bg-[var(--color-brand-accent-soft)] text-[var(--color-brand-primary)] px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider hover:bg-[var(--color-brand-primary-soft)] transition-colors"
              >
                <ShieldCheck size={10} />
                {isRtl ? 'لوحة التحكم' : 'Admin'}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Navbar ──────────────────────────────────────── */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--color-surface)]/95 backdrop-blur-xl border-b border-[var(--color-border)] shadow-lg py-0'
            : 'bg-[var(--color-page-bg)] border-b border-[var(--color-border-subtle)] py-0'
        }`}
      >
        <div className="container-2m">
          <div className="flex items-center h-[68px] gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group" aria-label="2M Pharmacy">
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="w-[46px] h-[46px] rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-sm"
                style={{ background: 'var(--color-brand-primary)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                <span className="text-white font-black text-xl tracking-tight leading-none relative z-10">2M</span>
              </motion.div>
              <div className="hidden sm:flex flex-col">
                <span
                  className="font-black text-[1.25rem] leading-none tracking-tight"
                  style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
                >
                  {isRtl ? 'صيدلية 2M' : '2M Pharmacy'}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] mt-0.5" style={{ color: 'var(--color-brand-primary)' }}>
                  {isRtl ? 'صحة فائقة' : 'Premium'}
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden lg:flex items-center flex-1 justify-center">
              <div className="flex items-center gap-0.5">
                {navLinks.map((link) => {
                  const active  = isActive(link.href);
                  const hasSub  = link.submenu && link.submenu.length > 0;
                  const meta    = CAT_META[link.label];
                  const isOffer = link.label === 'OFFERS';

                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => hasSub && openMenu(link.label)}
                      onMouseLeave={closeMenu}
                    >
                      <Link
                        href={link.href}
                        className={`relative flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-bold tracking-wide transition-all duration-200 rounded-xl group ${
                          isOffer
                            ? 'text-[#9B1239] bg-red-50 border border-red-100 hover:bg-red-100'
                            : active
                            ? 'text-[var(--color-brand-primary)] bg-[var(--color-brand-primary-soft)]'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
                        }`}
                      >
                        {/* Category icon */}
                        {meta && (
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200`}
                            style={{ background: meta.bg, color: meta.color }}
                          >
                            {meta.icon}
                          </span>
                        )}

                        <span>{isRtl ? link.labelAr : link.label}</span>

                        {isOffer && (
                          <span className="flex items-center gap-0.5 text-[9px] font-black uppercase bg-[#9B1239] text-white px-1.5 py-0.5 rounded-md leading-none">
                            <Zap size={8} /> HOT
                          </span>
                        )}

                        {hasSub && (
                          <ChevronDown
                            size={11}
                            className={`flex-shrink-0 transition-transform duration-200 ${activeMenu === link.label ? 'rotate-180' : ''}`}
                          />
                        )}

                        {/* Active underline */}
                        {active && !isOffer && (
                          <motion.span
                            layoutId="nav-active-bar"
                            className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--color-brand-primary)]"
                          />
                        )}
                      </Link>

                      {/* ── Mega Menu ── */}
                      <AnimatePresence>
                        {hasSub && activeMenu === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 2,  scale: 1 }}
                            exit={{   opacity: 0, y: 10, scale: 0.97 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            onMouseEnter={() => openMenu(link.label)}
                            onMouseLeave={closeMenu}
                            className={`absolute top-full ${isRtl ? 'right-0' : 'left-0'} mt-1 w-[520px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl z-50 overflow-hidden`}
                            style={{ boxShadow: '0 24px 60px -12px rgba(10,22,40,0.18)' }}
                          >
                            {/* Top accent gradient */}
                            <div
                              className="h-1 w-full"
                              style={{ background: `linear-gradient(90deg, ${meta?.color ?? 'var(--color-brand-primary)'}, var(--color-brand-gold))` }}
                            />

                            <div className="p-5 grid grid-cols-5 gap-5">
                              {/* Left: subcategory links */}
                              <div className="col-span-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3">
                                  {isRtl ? 'التصنيفات الفرعية' : 'Browse Categories'}
                                </p>
                                <div className="space-y-1">
                                  {link.submenu.map((sub) => (
                                    <Link
                                      key={sub.label}
                                      href={sub.href}
                                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface-2)] group/sub transition-all duration-150 border border-transparent hover:border-[var(--color-border)]"
                                    >
                                      <span className="text-xs font-semibold text-[var(--color-text-secondary)] group-hover/sub:text-[var(--color-text-primary)] transition-colors">
                                        {sub.label}
                                      </span>
                                      <ArrowRight
                                        size={11}
                                        className={`text-[var(--color-text-muted)] group-hover/sub:text-[var(--color-brand-primary)] transition-colors flex-shrink-0 ${isRtl ? 'rotate-180' : ''}`}
                                      />
                                    </Link>
                                  ))}
                                </div>
                                <Link
                                  href={link.href}
                                  className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-[var(--color-brand-primary)] hover:underline uppercase tracking-wider"
                                >
                                  {isRtl ? 'عرض الكل' : 'View All'} <ArrowRight size={10} className={isRtl ? 'rotate-180' : ''} />
                                </Link>
                              </div>

                              {/* Right: featured deal card */}
                              <div
                                className="col-span-2 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden border border-[var(--color-border-soft)]"
                                style={{ background: `linear-gradient(135deg, ${meta?.bg ?? '#EBF0FB'}, white)` }}
                              >
                                <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full opacity-20 blur-2xl pointer-events-none" style={{ background: meta?.color }} />
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span
                                      className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border"
                                      style={{ background: meta?.bg, color: meta?.color, borderColor: meta?.color + '40' }}
                                    >
                                      {getMegaDeal(link.label).badge}
                                    </span>
                                    <span className="text-lg">{getMegaDeal(link.label).emoji}</span>
                                  </div>
                                  <h4 className="text-xs font-black text-[var(--color-text-primary)] mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>
                                    {isRtl ? getMegaDeal(link.label).titleAr : getMegaDeal(link.label).title}
                                  </h4>
                                  <p className="text-[10px] text-[var(--color-text-secondary)] font-medium leading-relaxed">
                                    {isRtl ? getMegaDeal(link.label).descAr : getMegaDeal(link.label).desc}
                                  </p>
                                </div>
                                <Link
                                  href={getMegaDeal(link.label).link}
                                  className="mt-3 w-full py-2 text-[10px] font-black uppercase tracking-wider rounded-lg text-center transition-all duration-200 border text-white hover:opacity-90 hover:scale-[1.02] flex items-center justify-center gap-1.5"
                                  style={{ background: meta?.color ?? 'var(--color-brand-primary)', borderColor: 'transparent' }}
                                >
                                  {isRtl ? 'اكتشف الآن' : 'Shop Deal'} ⚡
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right Action Cluster ── */}
            <div className="flex items-center gap-1 flex-shrink-0">

              {/* Search */}
              <motion.button
                id="nav-search-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                whileTap={{ scale: 0.88 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border"
                style={{
                  background: searchOpen ? 'var(--color-brand-primary)' : 'var(--color-surface)',
                  borderColor: searchOpen ? 'var(--color-brand-primary)' : 'var(--color-border)',
                  color: searchOpen ? '#fff' : 'var(--color-text-secondary)',
                }}
                aria-label="Search"
              >
                {searchOpen ? <X size={15} /> : <Search size={15} />}
              </motion.button>

              {/* Dark mode */}
              <div className="hidden sm:block">
                <DarkModeToggle />
              </div>

              {/* Language */}
              <motion.button
                id="nav-lang-btn"
                whileTap={{ scale: 0.9 }}
                onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg border text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 hover:bg-[var(--color-surface-2)]"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
              >
                <Globe size={12} style={{ color: 'var(--color-brand-primary)' }} />
                {locale === 'en' ? 'ع' : 'EN'}
              </motion.button>

              {/* Account */}
              <Link
                href="/account"
                id="nav-account-btn"
                className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 relative ${
                  userLoggedIn
                    ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary-soft)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]'
                }`}
                style={{ color: userLoggedIn ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)' }}
                aria-label="Account"
              >
                <User size={15} />
                {userLoggedIn && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                )}
              </Link>
              
              {/* Wishlist */}
              <Link
                href="/account?tab=wishlist"
                id="nav-wishlist-btn"
                className="w-9 h-9 rounded-lg hidden sm:flex items-center justify-center border transition-all duration-200 relative hover:bg-[var(--color-surface-2)]"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                aria-label="Wishlist"
              >
                <Heart size={15} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[8px] font-bold rounded-full bg-[var(--color-brand-primary)] text-white shadow-sm"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Cart */}
              <motion.div whileTap={{ scale: 0.93 }}>
                <Link
                  href="/cart"
                  id="nav-cart-btn"
                  className="relative flex items-center gap-2 pl-3 pr-3.5 h-9 rounded-lg text-white text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: 'var(--color-brand-primary)' }}
                  aria-label={`Cart — ${displayCount} items`}
                >
                  <ShoppingCart size={14} className="flex-shrink-0" />
                  <span className="hidden sm:inline">{isRtl ? 'سلة' : 'Cart'}</span>
                  <AnimatePresence>
                    {displayCount > 0 && (
                      <motion.span
                        key={displayCount}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{   scale: 0, opacity: 0 }}
                        className="w-5 h-5 flex items-center justify-center text-[9px] font-semibold rounded-full bg-[var(--color-brand-accent-soft)] text-[var(--color-brand-accent)] leading-none shadow-sm"
                      >
                        {displayCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>

              {/* Hamburger */}
              <button
                id="nav-mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 hover:bg-[var(--color-surface-2)]"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                aria-label="Menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileOpen ? 'x' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{   rotate:  90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X size={17} /> : <Menu size={17} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* ── Search Bar Expand ── */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{   opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pb-4 pt-1">
                  <SearchAutocomplete onClose={() => setSearchOpen(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scrolled gold accent line */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-px"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-brand-gold) 40%, var(--color-brand-gold) 60%, transparent)', opacity: 0.4 }}
            />
          )}
        </AnimatePresence>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{   opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              className={`fixed top-0 bottom-0 z-50 lg:hidden w-[300px] flex flex-col overflow-hidden ${isRtl ? 'left-0' : 'right-0'}`}
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{   x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              style={{ background: 'var(--color-surface)', boxShadow: isRtl ? '20px 0 64px rgba(0,0,0,0.2)' : '-20px 0 64px rgba(0,0,0,0.2)' }}
            >
              {/* Drawer header */}
              <div
                className="relative flex items-center justify-between px-5 py-4 flex-shrink-0"
                style={{ background: 'var(--color-brand-primary)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white font-black text-sm border border-white/20">
                    2M
                  </div>
                  <div>
                    <div className="text-white font-black text-sm leading-none">{isRtl ? 'صيدلية 2M' : '2M Pharmacy'}</div>
                    <div className="text-white/70 text-[9px] font-semibold uppercase tracking-wider mt-0.5">{isRtl ? 'صحة فائقة' : 'Premium'}</div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors border border-white/20"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navLinks.map((link) => {
                  const active  = isActive(link.href);
                  const meta    = CAT_META[link.label];
                  const isOffer = link.label === 'OFFERS';
                  const hasSub  = link.submenu && link.submenu.length > 0;
                  const isExpanded = openAccordion === link.label;

                  return (
                    <div key={link.label}>
                      <div
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all duration-150 ${
                          isOffer
                            ? 'text-[#9B1239] bg-red-50 border border-red-100'
                            : active
                            ? 'text-[var(--color-brand-primary)] bg-[var(--color-brand-primary-soft)] border border-[var(--color-brand-primary)]/15'
                            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] border border-transparent cursor-pointer'
                        }`}
                        onClick={() => {
                          if (hasSub) {
                            setOpenAccordion(isExpanded ? null : link.label);
                          } else {
                            window.location.href = link.href;
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {meta && (
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: meta.bg, color: meta.color }}
                            >
                              {meta.icon}
                            </span>
                          )}
                          <span>{isRtl ? link.labelAr : link.label}</span>
                        </div>
                        {isOffer
                          ? <span className="text-[9px] font-black bg-[#9B1239] text-white px-1.5 py-0.5 rounded">HOT</span>
                          : hasSub
                          ? <ChevronDown size={14} className={`text-[var(--color-text-muted)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          : <ArrowRight size={12} className={`text-[var(--color-text-muted)] ${isRtl ? 'rotate-180' : ''}`} />
                        }
                      </div>

                      {/* Accordion content */}
                      <AnimatePresence>
                        {hasSub && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-4 mr-4 border-l border-[var(--color-border)] mt-1"
                          >
                            <div className="flex flex-col gap-1 py-2 pl-3">
                              {link.submenu!.map((sub) => (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] py-2"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                              <Link
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="text-[10px] font-black text-[var(--color-brand-primary)] uppercase py-2 flex items-center gap-1 mt-1"
                              >
                                {isRtl ? 'عرض الكل' : 'View All'} <ArrowRight size={10} className={isRtl ? 'rotate-180' : ''} />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="p-4 border-t border-[var(--color-border)] space-y-3 flex-shrink-0 bg-[var(--color-surface-2)]">
                {/* Lang + dark mode row */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                    className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border text-[11px] font-semibold uppercase tracking-wider transition-colors hover:bg-[var(--color-surface)]"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  >
                    <Globe size={13} style={{ color: 'var(--color-brand-primary)' }} />
                    {locale === 'en' ? 'العربية' : 'English'}
                  </button>
                  <DarkModeToggle />
                </div>

                {/* Cart CTA */}
                <Link
                  href="/cart"
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-lg text-white font-semibold text-[11px] uppercase tracking-wider transition-all hover:opacity-90"
                  style={{ background: 'var(--color-brand-primary)' }}
                >
                  <ShoppingCart size={14} />
                  {isRtl ? 'سلة التسوق' : 'Shopping Cart'}
                  {displayCount > 0 && (
                    <span className="w-5 h-5 text-[9px] font-semibold rounded-full bg-[var(--color-brand-accent-soft)] text-[var(--color-brand-accent)] flex items-center justify-center">
                      {displayCount}
                    </span>
                  )}
                </Link>

                {/* WhatsApp quick link */}
                <a
                  href="https://wa.me/201115160947"
                  target="_blank" rel="noopener noreferrer"
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-lg border text-[11px] font-semibold text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <Phone size={13} /> 01115160947 (WhatsApp)
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
