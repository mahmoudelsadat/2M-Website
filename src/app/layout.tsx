import type { Metadata } from 'next';
import { Manrope, Hanken_Grotesk, Cairo } from 'next/font/google';
import { Toaster } from 'sonner';
import { LanguageProvider } from '@/lib/LanguageContext';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '2M Premium Pharmacy — Authentic Health & Wellness | Egypt',
    template: '%s | 2M Premium Pharmacy',
  },
  description:
    'Egypt\'s trusted premium pharmacy — authentic vitamins, supplements, beauty, and wellness products. Pharmacist-curated, Egypt-wide delivery, cash on delivery available.',
  keywords: [
    'pharmacy egypt', 'vitamins egypt', 'supplements cairo',
    'online pharmacy egypt', 'health products egypt', 'wellness egypt',
    'beauty products egypt', 'authentic supplements', '2M pharmacy',
    'صيدلية مصر', 'فيتامينات', 'مكملات غذائية',
  ],
  authors: [{ name: '2M Premium Pharmacy' }],
  creator: '2M Premium Pharmacy',
  metadataBase: new URL('https://2mpharmacy.com'),
  openGraph: {
    type: 'website',
    locale: 'en_EG',
    alternateLocale: 'ar_EG',
    url: 'https://2mpharmacy.com',
    siteName: '2M Premium Pharmacy',
    title: '2M Premium Pharmacy — Authentic Health & Wellness | Egypt',
    description: "Egypt's trusted premium pharmacy for vitamins, supplements, beauty, and wellness.",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: '2M Premium Pharmacy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2M Premium Pharmacy',
    description: "Egypt's trusted premium health & wellness destination.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${hankenGrotesk.variable} ${cairo.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#060700" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="2M Pharmacy" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-dvh flex flex-col antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              fontFamily: 'var(--font-inter)',
              fontSize: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  );
}
