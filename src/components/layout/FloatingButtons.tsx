'use client';

import { MessageCircle, Home, Search, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { useTranslations } from 'next-intl';

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const t = useTranslations('Layout');

  useEffect(() => {
    const tTimer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(tTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t1  = setTimeout(() => setShowTooltip(true), 1200);
    const t2 = setTimeout(() => setShowTooltip(false), 5000);
    const iv = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3500);
    }, 10000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(iv); };
  }, [visible]);

  return (
    <div
      className={`fixed bottom-[76px] lg:bottom-6 right-5 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      {/* Tooltip bubble */}
      <div
        className={`transition-all duration-300 ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <div
          className="text-xs font-bold text-white px-3.5 py-2 rounded-full shadow-whatsapp flex items-center gap-1.5 bg-whatsapp whitespace-nowrap"
        >
          <MessageCircle size={11} className="fill-white" />
          {t('whatsappChatPrompt')}
        </div>
        {/* Arrow */}
        <div className="w-0 h-0 ml-auto mr-5 mt-0.5 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-whatsapp" />
      </div>

      {/* WhatsApp Button with wa-pulse animation */}
      <a
        href={`https://wa.me/201115160947?text=${encodeURIComponent(t('whatsappMessage'))}`}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-float-btn"
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 wa-pulse bg-gradient-to-br from-whatsapp to-whatsapp-dark shadow-whatsapp-btn"
        aria-label={t('chatOnWhatsapp')}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <MessageCircle size={26} className="text-white fill-white" />
      </a>
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
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t bg-card border-border shadow-mobile-nav"
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
