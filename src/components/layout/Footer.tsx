'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Truck, CreditCard, RefreshCw, Mail, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, type NewsletterFormValues } from '@/lib/schemas';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '@/components/ui/icons';

const footerLinks = {
  shop: [
    { labelKey: 'linkPharmacy' as const, href: '/pharmacy' },
    { labelKey: 'linkBeauty' as const, href: '/beauty' },
    { labelKey: 'linkWellness' as const, href: '/wellness' },
    { labelKey: 'linkPersonalCare' as const, href: '/personal-care' },
    { labelKey: 'linkOffersDeals' as const, href: '/pharmacy' },
    { labelKey: 'linkAllBrands' as const, href: '/brands' },
  ],
  service: [
    { labelKey: 'linkDeliveryInfo' as const, href: '/faqs' },
    { labelKey: 'linkReturnsExchanges' as const, href: '/faqs' },
    { labelKey: 'linkFaqs' as const, href: '/faqs' },
    { labelKey: 'linkTrackOrder' as const, href: '/account' },
  ],
  company: [
    { labelKey: 'linkAboutUs' as const, href: '/about' },
    { labelKey: 'linkWellnessBlog' as const, href: '/about' },
    { labelKey: 'linkAuthenticityPolicy' as const, href: '/about' },
    { labelKey: 'linkPrivacyPolicy' as const, href: '/about' },
    { labelKey: 'linkTermsConditions' as const, href: '/about' },
  ],
};

const TRUST_FOOTER = [
  { icon: Shield,     labelKey: 'trustAuthentic' as const,  colorClass: 'text-primary' },
  { icon: Truck,      labelKey: 'trustEgyptWide' as const,   colorClass: 'text-brand-accent' },
  { icon: CreditCard, labelKey: 'trustSecurePayment' as const,   colorClass: 'text-secure-payment' },
  { icon: RefreshCw,  labelKey: 'trustEasyReturns' as const,     colorClass: 'text-easy-returns' },
];

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 w-full lg:w-auto max-w-md" noValidate>
      <div className="flex-1 min-w-0">
        <input
          id="newsletter-email"
          type="email"
          placeholder={t('newsletterPlaceholder')}
          {...register('email')}
          className={`w-full rounded-lg px-4 py-3 text-sm text-foreground bg-white/95 placeholder-muted focus:outline-none focus:border-primary/60 border ${
            errors.email ? 'border-primary' : 'border-primary/15'
          }`}
        />
        {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
      </div>
      <button
        id="newsletter-submit"
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary px-5 flex-shrink-0 text-sm"
      >
        {isSubmitting ? t('newsletterSubmitting') : <>{t('newsletterSubscribe')} <ArrowRight size={14} /></>}
      </button>
    </form>
  );
}

export default function Footer() {
  const t = useTranslations('Layout');

  return (
    <footer className="bg-footer-bg text-footer-text">

      {/* Newsletter Strip */}
      <div className="border-b border-footer-text/10">
        <div className="container-2m py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{t('newsletterTitle')}</h3>
              <p className="text-[0.875rem] text-footer-muted">{t('newsletterSubtitle')}</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-2m py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Updated logo */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden bg-primary"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                <span className="text-white font-black text-2xl tracking-tight leading-none relative z-10">2M</span>
              </div>
              <div>
                <div className="font-black text-white text-[1.4rem] leading-none tracking-tight">{t('storeName')}</div>
                <div className="text-[11px] text-footer-muted font-semibold tracking-[0.1em] uppercase mt-1.5">{t('brandSubTitle')}</div>
              </div>
            </div>

            <p className="text-[0.875rem] text-footer-muted leading-relaxed mb-6 max-w-xs">
              {t('brandDescription')}
            </p>

            {/* Trust grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {TRUST_FOOTER.map(({ icon: Icon, labelKey, colorClass }) => (
                <div key={labelKey} className="flex items-center gap-2 text-[0.8rem] text-footer-muted">
                  <Icon size={13} className={colorClass} />
                  {t(labelKey)}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2.5">
              {[
                { href: 'https://www.instagram.com/2m_pharmcy', Icon: InstagramIcon, id: 'footer-instagram', labelKey: 'linkInstagram' as const, hover: 'hover:bg-pink-500/10 hover:border-pink-400/30' },
                { href: 'https://www.facebook.com/people/2M-Pharmacy/100068944428141/', Icon: FacebookIcon, id: 'footer-facebook', labelKey: 'linkFacebook' as const, hover: 'hover:bg-blue-500/10 hover:border-blue-400/30' },
                { href: 'https://wa.me/201115160947', Icon: WhatsAppIcon, id: 'footer-whatsapp', labelKey: 'linkWhatsApp' as const, hover: 'hover:bg-green-500/10 hover:border-green-400/30' },
              ].map(({ href, Icon, id, labelKey, hover }) => (
                <a
                  key={id} href={href} target="_blank" rel="noopener noreferrer" id={id}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 text-footer-muted hover:text-white transition-all duration-200 ${hover}`}
                  aria-label={t(labelKey)}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { titleKey: 'colShop' as const, links: footerLinks.shop },
            { titleKey: 'colService' as const, links: footerLinks.service },
            { titleKey: 'colCompany' as const, links: footerLinks.company },
          ].map((col) => (
            <div key={col.titleKey}>
              <h4 className="text-white font-bold text-[0.8rem] uppercase tracking-wider mb-4">{t(col.titleKey)}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.labelKey}>
                    <Link href={l.href} className="text-[0.875rem] text-footer-muted hover:text-white transition-colors duration-150 hover:pl-1 block">
                      {t(l.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
              {col.titleKey === 'colCompany' && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-[0.8rem] text-footer-muted">
                    <MapPin size={11} /> {t('egyptNationwide')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-footer-text/10">
        <div className="container-2m py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.78rem] text-footer-muted">
            {t('copyright', { year: new Date().getFullYear().toString() })}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'COD', textClass: 'text-pay-cod', bgClass: 'bg-pay-cod/15' },
              { label: 'InstaPay', textClass: 'text-pay-instapay', bgClass: 'bg-pay-instapay/15' },
              { label: 'Vodafone', textClass: 'text-pay-vodafone', bgClass: 'bg-pay-vodafone/15' },
              { label: 'e& Cash', textClass: 'text-pay-ecash', bgClass: 'bg-pay-ecash/15' },
            ].map(p => (
              <span key={p.label} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${p.textClass} ${p.bgClass}`}>{p.label}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
