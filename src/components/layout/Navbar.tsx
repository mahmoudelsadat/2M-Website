/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart, User, Menu, X, ChevronDown, Sun, Moon,
  ShieldCheck, Globe, Search, Pill, Sparkles, Leaf, Droplets,
  Tag, Package, ArrowRight, Zap, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '@/lib/data';
import { useCartStore, useWishlistStore } from '@/lib/store';
import SearchAutocomplete from '@/components/features/search/SearchAutocomplete';
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
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('2m-theme');
    const nextDark = saved === 'light' ? false : true;
    setDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    document.documentElement.classList.toggle('light', !nextDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('2m-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light', !next);
  };

  if (!mounted) return <div className={compact ? 'w-8 h-8' : 'w-9 h-9'} />;

  return (
    <motion.button
      id="dark-mode-toggle"
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      className={`${compact ? 'w-8 h-8' : 'w-9 h-9'} rounded-xl flex items-center justify-center border border-border bg-surface hover:bg-surface-2 text-text-secondary hover:text-brand-primary transition-all duration-300`}
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

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  const openMenu  = (label: string) => { if (menuRef.current) clearTimeout(menuRef.current); setActiveMenu(label); };
  const closeMenu = () => { menuRef.current = setTimeout(() => setActiveMenu(null), 120); };

  // Megamenu featured deal
  const getMegaDeal = (label: string) => {
    const deals: Record<string, { emoji: string; titleKey: string; descKey: string; badgeKey: string; link: string }> = {
      PHARMACY:  { emoji: '💊', titleKey: 'dealPharmacyTitle', descKey: 'dealPharmacyDesc', badgeKey: 'dealPharmacyBadge', link: '/product/vitamin-d3-5000iu' },
      BEAUTY:    { emoji: '✨', titleKey: 'dealBeautyTitle', descKey: 'dealBeautyDesc', badgeKey: 'dealBeautyBadge', link: '/product/spf-50-sunscreen' },
      WELLNESS:  { emoji: '🌿', titleKey: 'dealWellnessTitle', descKey: 'dealWellnessDesc', badgeKey: 'dealWellnessBadge', link: '/product/omega-3-fish-oil' },
      'PERSONAL CARE': { emoji: '🧴', titleKey: 'dealPersonalTitle', descKey: 'dealPersonalDesc', badgeKey: 'dealPersonalBadge', link: '/product/whey-protein-chocolate' },
    };
    return deals[label] ?? deals['PHARMACY'];
  };

  const announcements = [
    t('announcement1'),
    t('announcement2'),
    t('announcement3'),
    t('announcement4'),
    t('announcement5'),
  ];

  return (
    <>
      {/* ── Announcement Bar ─────────────────────────────────── */}
      <div className="relative z-50 select-none overflow-hidden bg-[#060700]/95 border-b border-white/10 min-h-[36px]">
        <div className="container-2m flex items-center justify-between h-9 gap-4">
          {/* Left: scrolling announcement marquee */}
          <div className="flex-1 overflow-hidden relative h-full flex items-center whitespace-nowrap mask-edges">
            <div className="flex w-max" style={{ animation: 'marquee 40s linear infinite' }}>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-8 px-4 items-center">
                  {announcements.map((anno, idx) => (
                    <span key={idx} className="text-[11px] font-semibold text-white/70">
                      {anno}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right: trust badges + admin pill */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-white/70 font-medium">
              <ShieldCheck size={11} className="text-teal-400" />
              {t('authenticShort')}
            </span>
            {adminLoggedIn && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1 bg-white/10 text-white px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider hover:bg-white/20 transition-colors"
              >
                <ShieldCheck size={10} />
                {t('admin')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Navbar ──────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-40 transition-all duration-300 py-0 glass-nav"
      >
        <div className="container-2m">
          <div className="flex items-center justify-between h-[72px] gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 select-none justify-center group" aria-label="2M Pharmacy">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black text-xl tracking-tighter shadow-md border border-white/20 transition-all duration-300 group-hover:scale-105">
                2M
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-black tracking-wider text-text-primary uppercase">Pharmacy</span>
                <span className="text-[7.5px] font-bold tracking-[0.18em] text-text-muted uppercase mt-0.5">
                  {t('premiumHealth')}
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden lg:flex items-center flex-1 justify-center">
              <div className="flex items-center gap-1.5">
                {navLinks.map((link) => {
                  const active  = isActive(link.href);
                  const hasSub  = link.submenu && link.submenu.length > 0;
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
                        className={`relative flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-medium tracking-wide transition-all duration-200 rounded-xl group ${
                          isOffer
                            ? 'text-brand-primary bg-brand-primary-soft border border-brand-primary-soft/30 hover:bg-brand-primary-soft/80'
                            : active
                            ? 'text-brand-primary font-bold'
                            : 'text-text-secondary hover:text-brand-primary'
                        }`}
                      >
                        <span>{isRtl ? link.labelAr : link.label}</span>

                        {isOffer && (
                          <span className="flex items-center gap-0.5 text-[9px] font-black uppercase bg-brand-primary text-white px-1.5 py-0.5 rounded-md leading-none">
                            <Zap size={8} /> {t('hot')}
                          </span>
                        )}

                        {hasSub && (
                          <ChevronDown
                            size={11}
                            className={`flex-shrink-0 transition-transform duration-200 text-text-muted group-hover:text-brand-primary ${activeMenu === link.label ? 'rotate-180' : ''}`}
                          />
                        )}

                        {/* Active underdot or line */}
                        {active && !isOffer && (
                          <motion.span
                            layoutId="nav-active-bar"
                            className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-brand-primary"
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
                            className={`absolute top-full ${isRtl ? 'right-0 origin-top-right' : 'left-0 origin-top-left'} mt-1 w-[520px] min-w-[520px] max-w-[95vw] glass-panel border border-white/10 rounded-2xl z-50 overflow-hidden`}
                          >
                            <div className="h-1 w-full bg-gradient-to-r from-brand-primary to-brand-accent" />

                            <div className="p-5 grid grid-cols-5 gap-5">
                              {/* Left: subcategory links */}
                              <div className="col-span-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-text-muted mb-3">
                                  {t('browseCategories')}
                                </p>
                                <div className="space-y-1">
                                  {link.submenu.map((sub) => (
                                    <Link
                                      key={sub.label}
                                      href={sub.href}
                                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-2 group/sub transition-all duration-150 border border-transparent hover:border-border"
                                    >
                                      <span className="text-xs font-semibold text-text-secondary group-hover/sub:text-brand-primary transition-colors">
                                        {isRtl && (sub as any).labelAr ? (sub as any).labelAr : sub.label}
                                      </span>
                                      <ArrowRight
                                        size={11}
                                        className={`text-text-muted group-hover/sub:text-brand-primary transition-colors flex-shrink-0 ${isRtl ? 'rotate-180' : ''}`}
                                      />
                                    </Link>
                                  ))}
                                </div>
                                <Link
                                  href={link.href}
                                  className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-brand-accent hover:underline uppercase tracking-wider"
                                >
                                  {t('viewAll')} <ArrowRight size={10} className={isRtl ? 'rotate-180' : ''} />
                                </Link>
                              </div>

                              {/* Right: featured deal card */}
                              <div className="col-span-2 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden border border-white/10 bg-white/5">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-brand-accent/20 bg-brand-accent-soft text-brand-accent">
                                      {t(getMegaDeal(link.label).badgeKey)}
                                    </span>
                                    <span className="text-lg">{getMegaDeal(link.label).emoji}</span>
                                  </div>
                                  <h4 className="text-xs font-black text-text-primary mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>
                                    {t(getMegaDeal(link.label).titleKey)}
                                  </h4>
                                  <p className="text-[10px] text-text-secondary font-medium leading-relaxed">
                                    {t(getMegaDeal(link.label).descKey)}
                                  </p>
                                </div>
                                <Link
                                  href={getMegaDeal(link.label).link}
                                  className="mt-3 w-full py-2 text-[10px] font-black uppercase tracking-wider rounded-lg text-center transition-all duration-200 bg-brand-primary text-white hover:bg-brand-primary-dark hover:scale-[1.02] flex items-center justify-center gap-1.5"
                                >
                                  {t('shopDeal')} ⚡
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
            <div className="flex items-center gap-2.5 flex-shrink-0">

              {/* Search */}
              <motion.button
                id="nav-search-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                whileTap={{ scale: 0.88 }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${
                  searchOpen
                    ? 'bg-surface-2 border-border text-brand-primary'
                    : 'bg-transparent border-transparent text-text-secondary hover:text-brand-primary hover:bg-surface-2'
                }`}
                aria-label="Search"
              >
                {searchOpen ? <X size={16} /> : <Search size={16} />}
              </motion.button>

              {/* Account */}
              <Link
                href="/account"
                id="nav-account-btn"
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-transparent bg-transparent text-text-secondary hover:text-brand-primary hover:bg-surface-2 transition-all duration-200 relative"
                aria-label="Account"
              >
                <User size={16} />
                {userLoggedIn && (
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                )}
              </Link>
              
              {/* Wishlist */}
              <Link
                href="/account?tab=wishlist"
                id="nav-wishlist-btn"
                className="w-9 h-9 rounded-lg hidden sm:flex items-center justify-center border border-transparent bg-transparent text-text-secondary hover:text-brand-primary hover:bg-surface-2 transition-all duration-200 relative"
                aria-label="Wishlist"
              >
                <Heart size={16} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-primary"
                    >
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Cart Group */}
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full border border-brand-accent/20 bg-brand-accent-soft text-brand-accent flex items-center justify-center text-[10px] font-bold">
                  {displayCount}
                </span>
                <Link
                  href="/cart"
                  id="nav-cart-btn"
                  className="flex items-center gap-1.5 border border-border bg-surface hover:bg-surface-2 text-text-primary rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm"
                  aria-label={`Cart — ${displayCount} items`}
                >
                  <ShoppingCart size={12} className="text-text-secondary" />
                  <span>{t('cartUppercase')}</span>
                </Link>
              </div>

              {/* Accessibility toggles inside submenus/clean buttons */}

              <motion.button
                id="nav-lang-btn"
                whileTap={{ scale: 0.9 }}
                onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg border border-border text-[10px] font-semibold uppercase tracking-wider text-text-secondary hover:text-brand-primary hover:bg-surface-2 transition-all duration-200"
              >
                {locale === 'en' ? 'ع' : 'EN'}
              </motion.button>

              {/* Hamburger */}
              <button
                id="nav-mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center border border-border bg-surface text-text-secondary hover:text-brand-primary transition-all duration-200"
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
                className="overflow-visible"
              >
                <div className="pb-4 pt-1">
                  <SearchAutocomplete onClose={() => setSearchOpen(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{   opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              className={`fixed top-0 bottom-0 z-50 lg:hidden w-[300px] flex flex-col overflow-hidden bg-surface border-l border-border shadow-2xl ${isRtl ? 'left-0' : 'right-0'}`}
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{   x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            >
              {/* Drawer header */}
              <div className="relative flex items-center justify-between px-5 py-4 flex-shrink-0 bg-surface-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black text-base tracking-tighter shadow-sm border border-white/10">
                    2M
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-xs font-black text-text-primary uppercase">Pharmacy</span>
                    <span className="text-[7.5px] font-bold tracking-[0.12em] text-text-muted uppercase mt-0.5">{t('premium')}</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-primary hover:bg-surface-2 transition-colors border border-border"
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
                            ? 'text-brand-primary bg-brand-primary-soft border border-brand-primary-soft/30'
                            : active
                            ? 'text-brand-primary bg-surface-2 border border-border'
                            : 'text-text-secondary hover:bg-surface-2 border border-transparent cursor-pointer'
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
                              style={{ background: 'var(--color-surface-3)', color: 'var(--color-brand-primary)' }}
                            >
                              {meta.icon}
                            </span>
                          )}
                          <span>{isRtl ? link.labelAr : link.label}</span>
                        </div>
                        {isOffer
                          ? <span className="text-[9px] font-black bg-brand-primary text-white px-1.5 py-0.5 rounded">{t('hot')}</span>
                          : hasSub
                          ? <ChevronDown size={14} className="text-text-muted transition-transform duration-200 rotate-0" />
                          : <ArrowRight size={12} className={`text-text-muted ${isRtl ? 'rotate-180' : ''}`} />
                        }
                      </div>

                      {/* Accordion content */}
                      <AnimatePresence>
                        {hasSub && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-4 mr-4 border-l border-border mt-1"
                          >
                            <div className="flex flex-col gap-1 py-2 pl-3">
                              {link.submenu!.map((sub) => (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="text-xs font-semibold text-text-secondary hover:text-brand-primary py-2"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                              <Link
                                  href={link.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="text-[10px] font-black text-brand-accent uppercase py-2 flex items-center gap-1 mt-1"
                              >
                                {t('viewAll')} <ArrowRight size={10} className={isRtl ? 'rotate-180' : ''} />
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
              <div className="p-4 border-t border-border space-y-3 flex-shrink-0 bg-surface-2">
                {/* Lang row */}
                <div className="flex items-center">
                  <button
                    onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-border text-[11px] font-semibold uppercase tracking-wider text-text-secondary hover:bg-surface-3 transition-colors"
                  >
                    <Globe size={13} className="text-brand-primary" />
                    {t('languageName')}
                  </button>
                </div>

                {/* Cart CTA */}
                <Link
                  href="/cart"
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-lg text-white bg-brand-primary hover:bg-brand-primary-dark font-semibold text-[11px] uppercase tracking-wider transition-all"
                >
                  <ShoppingCart size={14} />
                  {t('shoppingCart')}
                  {displayCount > 0 && (
                    <span className="w-5 h-5 text-[9px] font-semibold rounded-full bg-white/20 text-white flex items-center justify-center">
                      {displayCount}
                    </span>
                  )}
                </Link>

                <div className="w-full h-10 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-[11px] font-semibold text-text-secondary">
                  <ShieldCheck size={13} className="text-brand-accent" />
                  Curated access only
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
