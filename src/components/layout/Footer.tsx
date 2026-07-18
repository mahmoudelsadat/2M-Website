'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Truck, CreditCard, RefreshCw, Mail, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, type NewsletterFormValues } from '@/lib/schemas';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { InstagramIcon, FacebookIcon } from '@/components/ui/icons';

const footerLinks = {
  shop: [
    { labelKey: 'linkPharmacy' as const, href: '/pharmacy' },
    { labelKey: 'linkBeauty' as const, href: '/beauty' },
    { labelKey: 'linkWellness' as const, href: '/wellness' },
    { labelKey: 'linkPersonalCare' as const, href: '/personal-care' },
    { labelKey: 'linkOffersDeals' as const, href: '/pharmacy' },
  ],
  service: [
    { labelKey: 'linkTrackOrder' as const, href: '/account' },
    { labelKey: 'linkPrivacyPolicy' as const, href: '/about' },
    { labelKey: 'linkAllBrands' as const, href: '/brands' },
  ],
  company: [
    { labelKey: 'linkAboutUs' as const, href: '/about' },
    { labelKey: 'linkDeliveryInfo' as const, href: '/faqs' },
    { labelKey: 'linkReturnsExchanges' as const, href: '/faqs' },
    { labelKey: 'linkTermsConditions' as const, href: '/about' },
  ],
};

function NewsletterForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });
  const t = useTranslations('Layout');

  const onSubmit = async (data: NewsletterFormValues) => {
    try {
      await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
      toast.success(t('newsletterSuccessTitle'), { description: t('newsletterSuccessDesc') });
      reset();
    } catch {
      toast.error(t('newsletterError'));
    }
  };

  return (
    <div className="relative w-full max-w-sm mt-3">
      <form onSubmit={handleSubmit(onSubmit)} className="relative flex items-center gap-0 w-full" noValidate>
        <div className="flex-1 min-w-0">
          <input
            id="newsletter-email"
            type="email"
            placeholder={t('newsletterPlaceholder')}
            {...register('email')}
            className="w-full bg-white text-text-primary placeholder-text-muted rounded-l-xl px-4 py-2 text-xs focus:outline-none border border-border focus:border-brand-primary/30"
          />
        </div>
        <button
          id="newsletter-submit"
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-accent hover:bg-brand-accent/95 text-white border border-brand-accent/30 rounded-r-xl px-4 py-2 text-xs font-bold transition-colors flex-shrink-0"
        >
          {isSubmitting ? t('newsletterSubmitting') : t('subscribe')}
        </button>
      </form>
      {errors.email && <p className="text-[10px] text-red-500 mt-1.5">{errors.email.message}</p>}
    </div>
  );
}

export default function Footer() {
  const t = useTranslations('Layout');

  return (
    <footer className="bg-surface-2 text-text-secondary border-t border-border">
      {/* Main footer area */}
      <div className="container-2m py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Logo & Newsletter column */}
          <div className="md:col-span-2 flex flex-col justify-start">
            <Link href="/" className="flex items-center gap-2.5 select-none mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-black text-xl tracking-tighter shadow-sm border border-brand-primary/20 transition-all duration-300 group-hover:scale-105">
                2M
              </div>
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-sm font-black tracking-wider text-text-primary uppercase">Pharmacy</span>
                <span className="text-[7.5px] font-bold tracking-[0.18em] text-text-muted uppercase mt-0.5">
                  {t('brandSubTitle')}
                </span>
              </div>
            </Link>

            <div className="mb-6">
              <p className="text-xs font-bold text-text-primary">{t('newsletterFooterTitle')}</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="text-text-primary font-bold text-[11px] uppercase tracking-wider mb-4">{t('shop')}</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((l) => (
                <li key={l.labelKey}>
                  <Link href={l.href} className="text-xs text-text-secondary hover:text-brand-primary transition-colors duration-150">
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-bold text-[11px] uppercase tracking-wider mb-4">{t('customerService')}</h4>
            <ul className="space-y-2">
              {footerLinks.service.map((l) => (
                <li key={l.labelKey}>
                  <Link href={l.href} className="text-xs text-text-secondary hover:text-brand-primary transition-colors duration-150">
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-bold text-[11px] uppercase tracking-wider mb-4">{t('company')}</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((l) => (
                <li key={l.labelKey}>
                  <Link href={l.href} className="text-xs text-text-secondary hover:text-brand-primary transition-colors duration-150">
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Area: Socials and Payment Providers */}
        <div className="border-t border-border mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/2m_pharmcy" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-brand-primary transition-colors">
              <InstagramIcon size={14} />
            </a>
            <a href="https://www.facebook.com/people/2M-Pharmacy/100068944428141/" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-brand-primary transition-colors">
              <FacebookIcon size={14} />
            </a>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2">
            {['COD', 'InstaPay', 'Vodafone', 'e& Cash'].map((badge) => (
              <span key={badge} className="text-[9px] font-bold text-text-primary px-2 py-0.5 rounded border border-border bg-white uppercase tracking-wider">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
