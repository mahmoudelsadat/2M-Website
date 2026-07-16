'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const { isRtl } = useTranslation();
  const t = useTranslations('Contact');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const maxMessageLength = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: t('whatsappTitle'),
      subtitle: t('whatsappSubtitle'),
      value: 'concierge@2mpharmacy.com',
      href: 'mailto:concierge@2mpharmacy.com?subject=Concierge%20Desk%20Inquiry',
      colorClass: 'text-brand-gold',
      bgClass: 'bg-brand-gold/10',
      borderClass: 'border-brand-gold/25',
      accentBgClass: 'bg-brand-gold/15',
      accentBorderClass: 'border-brand-gold/20',
      cta: t('chatNow'),
    },
    {
      icon: Mail,
      title: t('emailTitle'),
      subtitle: t('emailSubtitle'),
      value: 'info@2mpharmacy.com',
      href: 'mailto:info@2mpharmacy.com',
      colorClass: 'text-sky-400',
      bgClass: 'bg-sky-400/10',
      borderClass: 'border-sky-400/25',
      accentBgClass: 'bg-sky-400/15',
      accentBorderClass: 'border-sky-400/20',
      cta: t('sendEmail'),
    },
    {
      icon: Phone,
      title: t('phoneTitle'),
      subtitle: t('phoneSubtitle'),
      value: 'Private Member Hotline',
      href: '#',
      colorClass: 'text-brand-primary',
      bgClass: 'bg-brand-primary/10',
      borderClass: 'border-brand-primary/25',
      accentBgClass: 'bg-brand-primary/15',
      accentBorderClass: 'border-brand-primary/20',
      cta: t('callNow'),
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        
        {/* Header Hero */}
        <section
          className="py-20 text-center relative overflow-hidden bg-dark-hero"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(200,16,46,0.06) 0%, transparent 70%), var(--color-dark-hero)' }}
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
          <div className="container-2m relative z-10">
            <div className="section-label mx-auto w-fit mb-4 border border-brand-gold/20 text-brand-gold bg-brand-gold/5">
              {t('getInTouch')}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 font-display tracking-tight">
              {t('weAreHereToHelp').split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient-primary">{t('weAreHereToHelp').split(' ').slice(-1)[0]}</span>
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto text-xs sm:text-sm font-semibold leading-relaxed">
              {t('counselDesc')}
            </p>
          </div>
        </section>

        {/* Contact Methods Cards */}
        <section className="py-16">
          <div className="container-2m">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {contactMethods.map((method, idx) => {
                const Icon = method.icon;
                return (
                  <a
                    key={idx}
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group p-6 rounded-2xl border border-white/10 glass-panel shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-inner border ${method.bgClass} ${method.borderClass}`}
                    >
                      <Icon size={20} className={method.colorClass} />
                    </div>
                    <h3 className="text-foreground font-black text-lg mb-1 font-display">{method.title}</h3>
                    <p className="text-muted-foreground text-[10px] font-bold mb-3">{method.subtitle}</p>
                    <p className="text-foreground text-xs font-black mb-4 select-all">{method.value}</p>
                    <span
                      className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all duration-200 inline-flex items-center gap-1 border ${method.accentBgClass} ${method.colorClass} ${method.accentBorderClass}`}
                    >
                      {method.cta} →
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Contact Form + Info Panel Grid */}
            <div className="grid lg:grid-cols-2 gap-10">
              
              {/* Message Composer Card */}
              <div className="glass-panel border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xs">
                <h2 className="text-xl font-black text-foreground font-display mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span>✉️</span>
                  {t('composeMessage')}
                </h2>
                
                {submitted ? (
                  <div
                    className="p-8 rounded-2xl text-center border border-emerald-500/20 bg-emerald-500/5"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-foreground font-black text-lg mb-2">
                      {t('messageDispatched')}
                    </h3>
                    <p className="text-muted-foreground text-xs font-semibold leading-relaxed">
                      {t('successMessage')}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                          {t('fullName')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder-white/35 focus:outline-none focus:border-brand-primary/45 focus:ring-4 focus:ring-brand-primary/20 transition-all"
                        />
                      </div>
                      
                      {/* Phone Number */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                          {t('phone')}
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 01115160947"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder-white/35 focus:outline-none focus:border-brand-primary/45 focus:ring-4 focus:ring-brand-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                        {t('email')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder-white/35 focus:outline-none focus:border-brand-primary/45 focus:ring-4 focus:ring-brand-primary/20 transition-all"
                      />
                    </div>

                    {/* Subject Category Select */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                        {t('inquirySubject')}
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-brand-primary/45 transition-all cursor-pointer"
                      >
                        <option value="">{t('selectTopic')}</option>
                        <option value={t('topicProduct')}>{t('topicProduct')}</option>
                        <option value={t('topicOrder')}>{t('topicOrder')}</option>
                        <option value={t('topicDelivery')}>{t('topicDelivery')}</option>
                        <option value={t('topicRefund')}>{t('topicRefund')}</option>
                        <option value={t('topicOther')}>{t('topicOther')}</option>
                      </select>
                    </div>

                    {/* Enhanced Textarea with reactive limit count */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          {t('message')} *
                        </label>
                        <span className={`text-[9px] font-black ${
                          form.message.length >= maxMessageLength ? 'text-primary' : 'text-muted'
                        }`}>
                          {form.message.length} / {maxMessageLength} {t('charactersLeft')}
                        </span>
                      </div>
                      <textarea
                        required
                        maxLength={maxMessageLength}
                        rows={4}
                        placeholder={t('messagePlaceholder')}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder-white/35 focus:outline-none focus:border-brand-primary/45 focus:ring-4 focus:ring-brand-primary/20 transition-all resize-none leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      id="contact-submit" 
                      className="btn btn-primary w-full py-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl btn-shimmer btn-elevated mt-2"
                    >
                      <Send size={13} className={isRtl ? 'rotate-180' : ''} />
                      {t('sendSecureMessage')}
                    </button>
                  </form>
                )}
              </div>

              {/* Info panel + Fast WhatsApp redirect */}
              <div className="space-y-8">
                {/* Details card */}
                <div className="glass-panel border border-white/10 p-6 rounded-2xl shadow-xs">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/10 pb-3 mb-4 font-display">
                    {t('contactInformation')}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-brand-gold mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-black text-foreground uppercase tracking-wide">
                          {t('businessHours')}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-semibold mt-1">
                          {t('businessHoursDesc')}
                        </div>
                        <div className="text-[10px] text-muted font-medium mt-0.5">
                          {t('fridayClosed')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-black text-foreground uppercase tracking-wide">
                          {t('deliveryCoverage')}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-semibold mt-1">
                          {t('deliveryCoverageDesc')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageCircle size={16} className="text-brand-gold mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-black text-foreground uppercase tracking-wide">
                          {t('whatsappSupport')}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-semibold mt-1">
                          {t('whatsappSupportDesc')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glassy Concierge advisory quick launcher */}
                <div
                  className="p-6 rounded-2xl border border-brand-gold/15 bg-brand-gold/5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-foreground font-black text-sm mb-2 flex items-center gap-2 font-display uppercase tracking-wider">
                      <MessageCircle size={18} className="text-brand-gold animate-pulse" />
                      {t('whatsappHotline')}
                    </h3>
                    <p className="text-muted-foreground text-xs font-semibold leading-relaxed mb-5">
                      {t('whatsappHotlineDesc')}
                    </p>
                  </div>
                  <a
                    href="mailto:concierge@2mpharmacy.com?subject=Concierge%20Advisory%20Hotline"
                    className="btn w-full py-3.5 text-xs font-black uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-gold/90 shadow-xs transition-all text-center rounded-xl hover:-translate-y-0.5 active:translate-y-0 block btn-shimmer border border-brand-gold/20"
                  >
                    {t('launchWhatsapp')}
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
