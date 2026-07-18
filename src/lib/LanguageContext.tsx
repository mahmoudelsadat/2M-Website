/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { supabase } from './supabase';
import enMessages from '../../messages/en.json';
import arMessages from '../../messages/ar.json';

type Locale = 'en' | 'ar';

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations = {
  en: enMessages,
  ar: arMessages,
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('2m-locale') as Locale;
    if (saved === 'ar' || saved === 'en') {
      setLocaleState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }

    // Supabase auth subscription to sync Google OAuth sessions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        const role = user.user_metadata?.role || 'customer';
        const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

        localStorage.setItem('2m-user-logged-in', 'true');
        localStorage.setItem('2m-user-name', name);
        localStorage.setItem('2m-user-email', user.email || '');
        localStorage.setItem('2m-user-role', role);

        window.dispatchEvent(new Event('storage'));
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('2m-user-logged-in');
        localStorage.removeItem('2m-user-name');
        localStorage.removeItem('2m-user-email');
        localStorage.removeItem('2m-user-role');
        window.dispatchEvent(new Event('storage'));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('2m-locale', newLocale);
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };

  const isRtl = locale === 'ar';
  const messages = translations[locale];

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Cairo">
      <LanguageContextInnerProvider locale={locale} setLocale={setLocale} isRtl={isRtl}>
        <div style={mounted ? undefined : { visibility: 'hidden' }}>
          {children}
        </div>
      </LanguageContextInnerProvider>
    </NextIntlClientProvider>
  );
}

function LanguageContextInnerProvider({
  children,
  locale,
  setLocale,
  isRtl,
}: {
  children: React.ReactNode;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRtl: boolean;
}) {
  const t_intl = useTranslations();

  const t = (key: string): string => {
    try {
      return t_intl(key) || key;
    } catch {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
