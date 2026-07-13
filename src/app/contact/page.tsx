'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/common/FloatingButtons';
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';

export default function ContactPage() {
  const { t, isRtl } = useTranslation();
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
      title: 'WhatsApp',
      subtitle: isRtl ? 'أسرع استجابة — عادة في غضون 30 دقيقة' : 'Fastest response — usually within 30 minutes',
      value: '+20 111 516 0947',
      href: 'https://wa.me/201115160947',
      color: '#25D366',
      cta: isRtl ? 'دردش الآن' : 'Chat Now',
    },
    {
      icon: Mail,
      title: isRtl ? 'البريد الإلكتروني' : 'Email',
      subtitle: isRtl ? 'للاستفسارات التفصيلية — رد خلال 24 ساعة' : 'For detailed inquiries — 24h response',
      value: 'info@2mpharmacy.com',
      href: 'mailto:info@2mpharmacy.com',
      color: '#4facfe',
      cta: isRtl ? 'راسلنا الآن' : 'Send Email',
    },
    {
      icon: Phone,
      title: isRtl ? 'الهاتف المباشر' : 'Phone Line',
      subtitle: isRtl ? 'اتصل بنا خلال ساعات العمل الرسمية' : 'Call us during business hours',
      value: '+20 111 516 0947',
      href: 'tel:+201115160947',
      color: '#C9A84C',
      cta: isRtl ? 'اتصل الآن' : 'Call Now',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: 'var(--color-page-bg)' }}>
        
        {/* Header Hero */}
        <section
          className="py-20 text-center relative overflow-hidden"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(200,16,46,0.06) 0%, transparent 70%), #060700' }}
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
          <div className="container-2m relative z-10">
            <div className="section-label mx-auto w-fit mb-4 border border-[var(--color-brand-gold)]/20 text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/5">
              {isRtl ? 'تواصل معنا' : 'Get in Touch'}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 font-display tracking-tight">
              {isRtl ? <>نحن هنا <span className="text-gradient-primary">لمساعدتك</span></> : <>We&apos;re Here to <span className="text-gradient-primary">Help</span></>}
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto text-xs sm:text-sm font-semibold leading-relaxed">
              {isRtl 
                ? 'لديك أسئلة حول المنتجات المتاحة، الشحن، أو طلبك؟ فريق الدعم المخصص في خدمتك 6 أيام في الأسبوع.'
                : 'Questions about premium products, nationwide delivery, or your order status? Our dedicated team is available 6 days a week.'
              }
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
                    className="group p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-inner"
                      style={{ background: `${method.color}10`, border: `1px solid ${method.color}25` }}
                    >
                      <Icon size={20} style={{ color: method.color }} />
                    </div>
                    <h3 className="text-[var(--color-text-primary)] font-black text-lg mb-1 font-display">{method.title}</h3>
                    <p className="text-[var(--color-text-muted)] text-[10px] font-bold mb-3">{method.subtitle}</p>
                    <p className="text-[var(--color-text-primary)] text-xs font-black mb-4 select-all">{method.value}</p>
                    <span
                      className="text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all duration-200 inline-flex items-center gap-1"
                      style={{ background: `${method.color}15`, color: method.color, border: `1px solid ${method.color}20` }}
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
              <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 rounded-2xl shadow-lg">
                <h2 className="text-xl font-black text-[var(--color-text-primary)] font-display mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span>✉️</span>
                  {isRtl ? 'أرسل لنا رسالة مباشرة' : 'Compose Message'}
                </h2>
                
                {submitted ? (
                  <div
                    className="p-8 rounded-2xl text-center border border-emerald-500/20 bg-emerald-500/5"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-[var(--color-text-primary)] font-black text-lg mb-2">
                      {isRtl ? 'تم إرسال رسالتك!' : 'Message Dispatched!'}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] text-xs font-semibold leading-relaxed">
                      {isRtl
                        ? 'سنقوم بالرد عليك عبر البريد الإلكتروني في غضون 24 ساعة عمل. للحصول على مساعدة أسرع، تواصل معنا عبر واتساب.'
                        : 'We\'ll get back to you via email within 24 business hours. For instant support, we recommend our WhatsApp chat.'
                      }
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
                          {t('fullName')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                      
                      {/* Phone Number */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
                          {t('phone')}
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 01115160947"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
                        {t('email')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                      />
                    </div>

                    {/* Subject Category Select */}
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
                        {isRtl ? 'الموضوع / القسم المعني' : 'Inquiry Subject'}
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-primary)] transition-all cursor-pointer"
                      >
                        <option value="">{isRtl ? 'اختر موضوعاً...' : 'Select a topic...'}</option>
                        <option>{isRtl ? 'سؤال عن منتج أو مكمل' : 'Product Question'}</option>
                        <option>{isRtl ? 'حالة الطلب والشحن' : 'Order Status'}</option>
                        <option>{isRtl ? 'مشكلة في التوصيل' : 'Delivery Issue'}</option>
                        <option>{isRtl ? 'الاسترجاع والاسترداد' : 'Return / Refund'}</option>
                        <option>{isRtl ? 'آخر' : 'Other'}</option>
                      </select>
                    </div>

                    {/* Enhanced Textarea with reactive limit count */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                          {t('message')} *
                        </label>
                        <span className={`text-[9px] font-black ${
                          form.message.length >= maxMessageLength ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-muted)]'
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
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all resize-none leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      id="contact-submit" 
                      className="btn btn-primary w-full py-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl btn-shimmer btn-elevated mt-2"
                    >
                      <Send size={13} className={isRtl ? 'rotate-180' : ''} />
                      {isRtl ? 'إرسال الرسالة الإلكترونية' : 'Send Secure Message'}
                    </button>
                  </form>
                )}
              </div>

              {/* Info panel + Fast WhatsApp redirect */}
              <div className="space-y-8">
                {/* Details card */}
                <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
                  <h3 className="text-sm font-black text-[var(--color-text-primary)] uppercase tracking-wider border-b border-[var(--color-border-soft)] pb-3 mb-4 font-display">
                    {isRtl ? 'تفاصيل الاتصال الرسمية' : 'Contact Information'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-[var(--color-brand-gold)] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-black text-[var(--color-text-primary)] uppercase tracking-wide">
                          {isRtl ? 'ساعات العمل الرسمية' : 'Business Hours'}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-secondary)] font-semibold mt-1">
                          {isRtl ? 'من السبت إلى الخميس: 9 صباحاً – 9 مساءً (بتوقيت القاهرة)' : 'Saturday – Thursday: 9am – 9pm (Cairo)'}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-muted)] font-medium mt-0.5">
                          {isRtl ? 'الجمعة: عطلة أسبوعية' : 'Friday: Closed'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-[var(--color-brand-primary)] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-black text-[var(--color-text-primary)] uppercase tracking-wide">
                          {isRtl ? 'نطاق التغطية والفرع' : 'Delivery Coverage'}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-secondary)] font-semibold mt-1">
                          {isRtl ? 'القاهرة، مصر — شحن سريع وتوصيل آمن لكافة المحافظات' : 'Egypt — High-speed nationwide temperature-controlled dispatch'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-black text-[var(--color-text-primary)] uppercase tracking-wide">
                          {isRtl ? 'خدمة الاستشارات الطبية' : 'WhatsApp Support (Preferred)'}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-secondary)] font-semibold mt-1">
                          {isRtl ? 'استشارات مباشرة مع الصيادلة المؤهلين لتلبية احتياجاتك العلاجية' : 'Direct advisory with licensed pharmacists for all prescription support'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glassy WhatsApp quick launcher */}
                <div
                  className="p-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-[var(--color-text-primary)] font-black text-sm mb-2 flex items-center gap-2 font-display uppercase tracking-wider">
                      <MessageCircle size={18} className="text-emerald-500 animate-pulse" />
                      {isRtl ? 'واتساب هو الأسرع دائماً' : 'WhatsApp Hotline is Faster'}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] text-xs font-semibold leading-relaxed mb-5">
                      {isRtl 
                        ? 'للحصول على استجابة سريعة جداً حول تتبع الشحنات، توافر الأدوية والمكملات، أو الاستشارات العاجلة، انقر لبدء المحادثة الفورية مباشرة مع الصيدلي.'
                        : 'For instant support on shipping tracking, supplement checks, or immediate prescription queries, directly text our call center.'
                      }
                    </p>
                  </div>
                  <a
                    href="https://wa.me/201115160947"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn w-full py-3.5 text-xs font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all text-center rounded-xl hover:-translate-y-0.5 active:translate-y-0 block btn-shimmer"
                  >
                    {isRtl ? 'ابدأ الدردشة الطبية الفورية ←' : 'Launch WhatsApp Chat →'}
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
