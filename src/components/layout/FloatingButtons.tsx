'use client';

import { Sparkles, Home, Search, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { useTranslations } from 'next-intl';

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations('Layout');

  useEffect(() => {
    const tTimer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(tTimer);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-5 z-30 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <Link
        href="/pharmacy"
        className="glass-panel flex items-center gap-2 rounded-full px-4 py-3 text-[11px] font-semibold text-white/90 hover:text-white transition-all duration-200"
        aria-label={t('shop')}
      >
        <Sparkles size={14} className="text-brand-accent" />
        <span>{t('shop')}</span>
      </Link>
    </div>
  );
}

// Mobile Bottom Navigation Bar — enhanced with real cart count
export function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.totalItems());
  const t = useTranslations('Layout');

  const navItems = [
    { id: 'home',    labelKey: 'home' as const,    icon: Home,        href: '/' },
    { id: 'search',  labelKey: 'search' as const,  icon: Search,      href: '/pharmacy' },
    { id: 'shop',    labelKey: 'shop' as const,    icon: ShoppingBag, href: '/pharmacy' },
    { id: 'cart',    labelKey: 'cart' as const,    icon: ShoppingCart, href: '/cart', badge: cartCount },
    { id: 'account', labelKey: 'account' as const, icon: User,        href: '/account' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-white/10 bg-[#060700]/90 backdrop-blur-xl shadow-[0_-12px_40px_rgba(0,0,0,0.35)]"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              id={`mobile-nav-${item.id}`}
              className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 relative"
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  className={`transition-transform duration-200 ${isActive ? 'scale-110 text-primary' : 'scale-100 text-muted'}`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 text-white text-[9px] font-black rounded-full flex items-center justify-center bg-primary"
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-primary' : 'text-muted'}`}
              >
                {t(item.labelKey)}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <div
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
