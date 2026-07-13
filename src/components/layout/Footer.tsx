'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Truck, CreditCard, RefreshCw, Mail, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, type NewsletterFormValues } from '@/lib/schemas';
import { toast } from 'sonner';

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const footerLinks = {
  shop: [
    { label: 'Pharmacy', href: '/pharmacy' },
    { label: 'Beauty', href: '/beauty' },
    { label: 'Wellness', href: '/wellness' },
    { label: 'Personal Care', href: '/personal-care' },
    { label: 'Offers & Deals', href: '/pharmacy' },
    { label: 'All Brands', href: '/brands' },
  ],
  service: [
    { label: 'Delivery Information', href: '/faqs' },
    { label: 'Returns & Exchanges', href: '/faqs' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Track Your Order', href: '/account' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Wellness Blog', href: '/about' },
    { label: 'Authenticity Policy', href: '/about' },
    { label: 'Privacy Policy', href: '/about' },
    { label: 'Terms & Conditions', href: '/about' },
  ],
};

const TRUST_FOOTER = [
  { icon: Shield,     label: '100% Authentic',  color: 'var(--color-brand-primary)' },
  { icon: Truck,      label: 'Egypt-Wide',       color: 'var(--color-brand-accent)' },
  { icon: CreditCard, label: 'Secure Payment',   color: '#667EC9' },
  { icon: RefreshCw,  label: 'Easy Returns',     color: '#2FA9A0' },
];

function NewsletterForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    try {
      await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
      toast.success('You\'re subscribed! 🎉', { description: 'Wellness tips & exclusive offers are on their way.' });
      reset();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 w-full lg:w-auto max-w-md" noValidate>
      <div className="flex-1 min-w-0">
        <input
          id="newsletter-email"
          type="email"
          placeholder="Your email address"
          {...register('email')}
          className="w-full rounded-lg px-4 py-3 text-sm text-[#1A2332] placeholder-[#8B95A5] focus:outline-none focus:border-[var(--color-brand-primary)]/60 border"
          style={{ background: 'rgba(255,255,255,0.95)', borderColor: errors.email ? 'var(--color-brand-primary)' : 'rgba(13,115,119,0.15)' }}
        />
        {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
      </div>
      <button
        id="newsletter-submit"
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary px-5 flex-shrink-0 text-sm"
      >
        {isSubmitting ? '...' : <>Subscribe <ArrowRight size={14} /></>}
      </button>
    </form>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: '#0D5962', color: '#E8F0F2' }}>

      {/* Newsletter Strip */}
      <div style={{ borderBottom: '1px solid rgba(232,240,242,0.1)' }}>
        <div className="container-2m py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Get Wellness Tips & Exclusive Offers</h3>
              <p className="text-[0.875rem] text-[#A8D4D8]">Join 10,000+ health-conscious Egyptians. No spam, ever.</p>
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
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                style={{ background: 'var(--color-brand-primary)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                <span className="text-white font-black text-2xl tracking-tight leading-none relative z-10">2M</span>
              </div>
              <div>
                <div className="font-black text-white text-[1.4rem] leading-none tracking-tight">2M Pharmacy</div>
                <div className="text-[11px] text-[#A8D4D8] font-semibold tracking-[0.1em] uppercase mt-1.5">Premium Health</div>
              </div>
            </div>

            <p className="text-[0.875rem] text-[#A8D4D8] leading-relaxed mb-6 max-w-xs">
              Egypt&apos;s trusted destination for authentic health, wellness, and beauty products. Curated by pharmacists, delivered to your door.
            </p>

            {/* Trust grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {TRUST_FOOTER.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2 text-[0.8rem] text-[#A8D4D8]">
                  <Icon size={13} style={{ color }} />
                  {label}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2.5">
              {[
                { href: 'https://www.instagram.com/2m_pharmcy', Icon: InstagramIcon, id: 'footer-instagram', label: 'Instagram', hover: 'hover:bg-pink-500/10 hover:border-pink-400/30' },
                { href: 'https://www.facebook.com/people/2M-Pharmacy/100068944428141/', Icon: FacebookIcon, id: 'footer-facebook', label: 'Facebook', hover: 'hover:bg-blue-500/10 hover:border-blue-400/30' },
                { href: 'https://wa.me/201115160947', Icon: WhatsAppIcon, id: 'footer-whatsapp', label: 'WhatsApp', hover: 'hover:bg-green-500/10 hover:border-green-400/30' },
              ].map(({ href, Icon, id, label, hover }) => (
                <a
                  key={id} href={href} target="_blank" rel="noopener noreferrer" id={id}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 text-[#A8D4D8] hover:text-white transition-all duration-200 ${hover}`}
                  aria-label={label}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: 'Shop', links: footerLinks.shop },
            { title: 'Customer Service', links: footerLinks.service },
            { title: 'Company', links: footerLinks.company },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-[0.8rem] uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[0.875rem] text-[#A8D4D8] hover:text-white transition-colors duration-150 hover:pl-1 block">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {col.title === 'Company' && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-[0.8rem] text-[#A8D4D8]">
                    <MapPin size={11} /> Egypt — Nationwide Delivery
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(232,240,242,0.1)' }}>
        <div className="container-2m py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.78rem] text-[#A8D4D8]">
            © {new Date().getFullYear()} 2M Premium Pharmacy. All rights reserved.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'COD', color: '#4A7C59', bg: 'rgba(74,124,89,0.15)' },
              { label: 'InstaPay', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
              { label: 'Vodafone', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
              { label: 'e& Cash', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
            ].map(p => (
              <span key={p.label} className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ color: p.color, background: p.bg }}>{p.label}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
