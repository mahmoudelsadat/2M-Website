'use client';

import { MessageCircle, Home, Search, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store';

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t  = setTimeout(() => setShowTooltip(true), 1200);
    const t2 = setTimeout(() => setShowTooltip(false), 5000);
    const iv = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3500);
    }, 10000);
    return () => { clearTimeout(t); clearTimeout(t2); clearInterval(iv); };
  }, [visible]);

  return (
    <div
      className={`fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
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
          className="text-xs font-bold text-white px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5"
          style={{ background: '#25D366', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}
        >
          <MessageCircle size={11} className="fill-white" />
          Chat with us on WhatsApp!
        </div>
        {/* Arrow */}
        <div className="w-0 h-0 ml-auto mr-5 mt-0.5 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]" style={{ borderTopColor: '#25D366' }} />
      </div>

      {/* WhatsApp Button with wa-pulse animation */}
      <a
        href="https://wa.me/201115160947?text=Hi%2C%20I%20have%20a%20question%20about%20a%20product%20at%202M%20Premium%20Pharmacy"
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-float-btn"
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 wa-pulse"
        style={{
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          boxShadow: '0 8px 32px rgba(37,211,102,0.4)',
        }}
        aria-label="Chat on WhatsApp"
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

  const navItems = [
    { id: 'home',    label: 'Home',    icon: Home,        href: '/' },
    { id: 'search',  label: 'Search',  icon: Search,      href: '/pharmacy' },
    { id: 'shop',    label: 'Shop',    icon: ShoppingBag, href: '/pharmacy' },
    { id: 'cart',    label: 'Cart',    icon: ShoppingCart, href: '/cart', badge: cartCount },
    { id: 'account', label: 'Account', icon: User,        href: '/account' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 24px rgba(26,35,50,0.08)',
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
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
                  style={{ color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-muted)' }}
                  className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 text-white text-[9px] font-black rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-brand-primary)' }}
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-semibold transition-colors"
                style={{ color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-muted)' }}
              >
                {item.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <div
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: 'var(--color-brand-primary)' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
