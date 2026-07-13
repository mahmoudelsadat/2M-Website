'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { Check, ChevronRight, MapPin, CreditCard, Truck, Shield, Phone, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/LanguageContext';
import { useCartStore } from '@/lib/store';
import { formatEGP } from '@/lib/utils';

const GOVERNORATES_EN = [
  'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira', 'Fayoum',
  'Gharbia', 'Ismailia', 'Menofia', 'Minya', 'Qaliubiya', 'New Valley',
  'Suez', 'Aswan', 'Assiut', 'Beni Suef', 'Port Said', 'Damietta',
  'Sharkia', 'South Sinai', 'Kafr El Sheikh', 'Matruh', 'Luxor',
  'Qena', 'North Sinai', 'Sohag',
];

const GOVERNORATES_AR = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحر الأحمر', 'البحيرة', 'الفيوم',
  'الغربية', 'الإسماعيلية', 'المنوفية', 'المنيا', 'القليوبية', 'الوادي الجديد',
  'السويس', 'أسوان', 'أسيوط', 'بني سويف', 'بورسعيد', 'دمياط',
  'الشرقية', 'جنوب سيناء', 'كفر الشيخ', 'مطروح', 'الأقصر',
  'قنا', 'شمال سيناء', 'سوهاج',
];



function StepIndicator({ current, step, label }: { current: number; step: number; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className={`flex items-center gap-2 ${active ? 'text-[var(--color-text-primary)] font-black' : done ? 'text-[var(--color-brand-gold)]' : 'text-[var(--color-text-muted)]'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300 ${
        done ? 'bg-[var(--color-brand-gold)] border-[var(--color-brand-gold)] text-black shadow-sm' :
        active ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white shadow-md' :
        'border-[var(--color-border)] text-[var(--color-text-muted)]'
      }`}>
        {done ? <Check size={13} /> : step}
      </div>
      <span className="text-xs font-bold hidden sm:inline uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function CheckoutPage() {
  const { t, isRtl } = useTranslation();
  const { items, subtotal: getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', phone: '', altPhone: '', email: '',
    governorate: '', city: '', address: '', notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone' | 'ecash'>('instapay');
  const [orderNumber] = useState(() => `2M-${Date.now().toString().slice(-6)}`);

  const cartItems = items;
  const subtotal = getSubtotal();
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  // Validate step 2 form fields
  const validateDelivery = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())       errs.name       = isRtl ? 'الاسم مطلوب' : 'Full name is required';
    if (!form.phone.trim())      errs.phone      = isRtl ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    if (!form.governorate)       errs.governorate = isRtl ? 'المحافظة مطلوبة' : 'Governorate is required';
    if (!form.address.trim())    errs.address    = isRtl ? 'العنوان مطلوب' : 'Address is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const steps = [
    isRtl ? 'مراجعة السلة' : 'Cart Review',
    isRtl ? 'تفاصيل التوصيل' : 'Delivery Details',
    isRtl ? 'طريقة الدفع' : 'Payment'
  ];

  const maxNotesLength = 300;

  if (step === 4) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center py-20" style={{ background: 'var(--color-page-bg)' }}>
          {/* Confetti particles */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-20px',
                  background: ['#0D7377','#C9A84C','#4facfe','#43e97b','#f093fb','#ff6b6b'][i % 6],
                  animation: `confetti-fall ${2 + Math.random() * 3}s ease-in ${Math.random() * 2}s forwards`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>

          <div className="container-2m max-w-lg text-center px-4">
            {/* Animated success circle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative"
              style={{ background: 'linear-gradient(135deg, #10b981, #0D7377)', boxShadow: '0 16px 48px rgba(13,115,119,0.35)' }}
            >
              <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
              <Check size={40} className="text-white relative z-10" strokeWidth={3} />
            </motion.div>

            <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-3 font-display">
              {isRtl ? 'تم تأكيد طلبك بنجاح! 🎉' : 'Order Confirmed! 🎉'}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] font-semibold mb-6">
              {isRtl 
                ? <>طلبك ذو الرقم <span className="text-[var(--color-brand-primary)] font-black">{orderNumber}</span> قيد المراجعة والتحضير وسيتواصل معك الصيدلي فوراً.</>
                : <>Your order <span className="text-[var(--color-brand-primary)] font-bold">{orderNumber}</span> has been received and is being prepared by our pharmacists.</>
              }
            </p>

            <div
              className="p-5 rounded-2xl mb-6 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-3.5"
            >
              <div className="flex justify-between text-xs font-bold border-b border-[var(--color-border-soft)] pb-2">
                <span className="text-[var(--color-text-secondary)]">{isRtl ? 'رقم الطلب' : 'Order Number'}</span>
                <span className="text-[var(--color-text-primary)]">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-xs font-bold border-b border-[var(--color-border-soft)] pb-2">
                <span className="text-[var(--color-text-secondary)]">{isRtl ? 'طريقة الدفع' : 'Payment Method'}</span>
                <span className="text-[var(--color-text-primary)]">
                  {paymentMethod === 'instapay' && 'InstaPay'}
                  {paymentMethod === 'vodafone' && 'Vodafone Cash'}
                  {paymentMethod === 'ecash' && 'e& Cash'}
                </span>
              </div>

              <div className="p-3 rounded-xl text-[10px] font-bold bg-emerald-500/5 border border-emerald-500/15 text-center">
                <p className="text-emerald-600 mb-1 font-black">✅ {isRtl ? 'تم استلام إشعار التحويل' : 'Transfer Confirmation'}</p>
                <p className="text-[var(--color-text-secondary)] font-semibold leading-relaxed">
                  {isRtl
                    ? <>سيتم مراجعة تحويلك وتأكيد الطلب رقم <strong className="text-[var(--color-brand-primary)] font-black">{orderNumber}</strong> فور التحقق من المبلغ.</>  
                    : <>Your transfer will be reviewed and order <strong className="text-[var(--color-brand-primary)] font-black">{orderNumber}</strong> will be confirmed once payment is verified.</>
                  }
                </p>
              </div>
              
              <div className="flex justify-between text-xs font-bold border-b border-[var(--color-border-soft)] pb-2">
                <span className="text-[var(--color-text-secondary)]">{isRtl ? 'التوصيل المتوقع' : 'Estimated Delivery'}</span>
                <span className="text-emerald-600 font-black">{isRtl ? '2-5 أيام عمل' : '2–5 Business Days'}</span>
              </div>
              
              <div className="flex justify-between text-xs font-black pt-2">
                <span className="text-[var(--color-text-primary)] uppercase">{isRtl ? 'الإجمالي النهائي' : 'Final Total'}</span>
                <span className="text-[var(--color-brand-primary)] text-base">EGP {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn w-full sm:flex-1 py-3 text-xs font-black uppercase tracking-wider border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-xl transition-colors">
                {isRtl ? 'العودة للرئيسية' : 'Back to Home'}
              </Link>
              <a
                href={`https://wa.me/201115160947?text=Hi!%20My%20order%20is%20${orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full sm:flex-1 py-3 text-xs font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Phone size={13} /> 
                {isRtl ? 'تتبع عبر الواتساب' : 'Track on WhatsApp'}
              </a>
            </div>
          </div>
        </main>
        <Footer />
        <FloatingButtons />
        <MobileBottomNav />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12" style={{ background: 'var(--color-page-bg)' }}>
        <div className="container-2m max-w-5xl px-4">
          
          {/* Progress Steps Indicators */}
          <div className="flex items-center gap-3 sm:gap-6 mb-10 justify-center flex-wrap">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <StepIndicator current={step} step={i + 1} label={label} />
                {i < steps.length - 1 && (
                  <ChevronRight size={14} className={`${step > i + 1 ? 'text-[var(--color-brand-gold)]' : 'text-[var(--color-border)]'} ${isRtl ? 'rotate-180' : ''} flex-shrink-0`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Form Steps Side (2/3 width) */}
            <div className="lg:col-span-2">
              
              {/* Step 1 — Cart Review */}
              {step === 1 && (
                <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
                  <h2 className="text-lg font-black text-[var(--color-text-primary)] font-display mb-5 uppercase tracking-wider flex items-center gap-2">
                    <span>🛒</span>
                    {isRtl ? 'مراجعة منتجات السلة المميزة' : 'Review Selected Items'}
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    {cartItems.length === 0 ? (
                      <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
                        No items in cart. <Link href="/pharmacy" style={{ color: 'var(--color-brand-primary)' }}>Shop now →</Link>
                      </p>
                    ) : cartItems.map((p) => (
                      <div key={p.id} className="flex gap-4 p-4 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/30 hover:bg-[var(--color-surface-2)]/50 transition-colors">
                        <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-white border border-[var(--color-border-soft)] p-0.5 shadow-sm">
                          <Image src={p.image} alt={p.name} width={64} height={64} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                          <p className="text-[10px] text-[var(--color-brand-gold)] uppercase font-black tracking-wider">{p.brand}</p>
                          <p className="text-xs font-bold text-[var(--color-text-primary)] line-clamp-2 mt-0.5">{p.name}</p>
                          <p className="text-xs font-black text-[var(--color-brand-primary)] mt-1.5">EGP {p.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4 p-3 rounded-xl flex justify-between text-sm font-semibold" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Total ({cartItems.reduce((s, i) => s + (i.qty || 1), 0)} items)</span>
                    <span style={{ color: 'var(--color-text-primary)' }} className="font-black">{formatEGP(total)}</span>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    disabled={cartItems.length === 0}
                    className="btn btn-primary w-full py-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-xl btn-shimmer btn-elevated disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isRtl ? 'الاستمرار لتفاصيل الشحن' : 'Continue to Delivery'}</span>
                    <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
                  </button>
                </div>
              )}

              {/* Step 2 — Delivery details */}
              {step === 2 && (
                <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
                  <h2 className="text-lg font-black text-[var(--color-text-primary)] font-display mb-6 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={18} className="text-[var(--color-brand-primary)]" /> 
                    {isRtl ? 'بيانات الشحن والتوصيل' : 'Delivery Details'}
                  </h2>
                  
                  <div className="space-y-5">
                    
                    {/* Basic info Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{t('fullName')} *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                      {/* Phone */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{t('phone')} *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 01115160947"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                      {/* Alt Phone */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{isRtl ? 'رقم هاتف بديل' : 'Alternative Phone'}</label>
                        <input
                          type="tel"
                          value={form.altPhone}
                          onChange={(e) => setForm({ ...form, altPhone: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{t('email')}</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Regional details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Governorate select */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{isRtl ? 'المحافظة *' : 'Governorate *'}</label>
                        <select
                          required
                          value={form.governorate}
                          onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-primary)] transition-all cursor-pointer"
                        >
                          <option value="">{isRtl ? 'اختر محافظة...' : 'Select Governorate...'}</option>
                          {GOVERNORATES_EN.map((g, idx) => (
                            <option key={g} value={g}>
                              {isRtl ? GOVERNORATES_AR[idx] : g}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* City */}
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{isRtl ? 'المنطقة / الحي *' : 'City / District *'}</label>
                        <input
                          type="text"
                          required
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Address Detail */}
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">{isRtl ? 'العنوان التفصيلي بالكامل *' : 'Street Address *'}</label>
                      <input
                        type="text"
                        placeholder={isRtl ? 'رقم العقار، الشارع، الشقة، أو علامات مميزة للعنوان...' : 'Building number, Street, Apartment, Landmark details...'}
                        required
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
                      />
                    </div>

                    {/* ENHANCED TEXTAREA FOR DELIVERY NOTES WITH LIMITER */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{t('orderNotes')}</label>
                        <span className={`text-[9px] font-black ${
                          form.notes.length >= maxNotesLength ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-muted)]'
                        }`}>
                          {form.notes.length} / {maxNotesLength} {t('charactersLeft')}
                        </span>
                      </div>
                      <textarea
                        maxLength={maxNotesLength}
                        rows={3}
                        placeholder={t('notesPlaceholder')}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all resize-none leading-relaxed"
                      />
                    </div>

                    {/* Step Actions */}
                    <div className="flex gap-3 pt-3">
                      <button 
                        type="button"
                        onClick={() => setStep(1)} 
                        className="btn border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl flex-1 transition-all"
                      >
                        {isRtl ? 'السابق' : 'Back'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => { if (validateDelivery()) setStep(3); }} 
                        className="btn btn-primary text-xs font-black uppercase tracking-wider py-3.5 rounded-xl flex-1 flex items-center justify-center gap-1.5 btn-shimmer btn-elevated"
                      >
                        <span>{isRtl ? 'الاستمرار لطرق الدفع' : 'Continue to Payment'}</span>
                        <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Payment via Egyptian Mobile Transfers */}
              {step === 3 && (
                <div className="card border border-[var(--color-border)] bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
                  <h2 className="text-lg font-black text-[var(--color-text-primary)] font-display mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={18} className="text-[var(--color-brand-gold)]" />
                    {isRtl ? 'طريقة الدفع' : 'Payment Method'}
                  </h2>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-semibold mb-6">
                    {isRtl
                      ? 'نقبل فقط التحويل الإلكتروني عبر InstaPay أو Vodafone Cash أو e& Cash — لا نقبل كاش أو بطاقات بنكية.'
                      : 'We accept electronic transfers only via InstaPay, Vodafone Cash, or e& Cash — no cash or cards accepted.'}
                  </p>

                  {/* Payment method selector cards */}
                  <div className="space-y-3 mb-6">

                    {/* InstaPay */}
                    <button
                      onClick={() => setPaymentMethod('instapay')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === 'instapay'
                          ? 'border-[#5B2D8E] bg-purple-500/5 shadow-inner'
                          : 'border-[var(--color-border)] bg-[var(--color-surface-2)]/30 hover:border-purple-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'instapay' ? 'border-[#5B2D8E]' : 'border-[var(--color-text-muted)]'
                      }`}>
                        {paymentMethod === 'instapay' && <div className="w-2.5 h-2.5 rounded-full bg-[#5B2D8E]" />}
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#5B2D8E] to-[#8B5CF6] flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-black text-[10px] leading-none text-center">insta<br/>pay</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-xs text-[var(--color-text-primary)]">InstaPay</div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] font-semibold mt-0.5">
                          {isRtl ? 'تحويل فوري عبر تطبيق البنك الخاص بك' : 'Instant transfer via your bank app'}
                        </div>
                        <div className="text-[10px] text-purple-600 font-black mt-1">@2mpharmacy</div>
                      </div>
                      {paymentMethod === 'instapay' && (
                        <span className="text-[9px] font-black uppercase bg-purple-500/10 text-purple-600 border border-purple-500/20 px-2 py-0.5 rounded ml-auto flex-shrink-0">
                          {isRtl ? 'محدد' : 'Selected'}
                        </span>
                      )}
                    </button>

                    {/* Vodafone Cash */}
                    <button
                      onClick={() => setPaymentMethod('vodafone')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === 'vodafone'
                          ? 'border-red-600 bg-red-500/5 shadow-inner'
                          : 'border-[var(--color-border)] bg-[var(--color-surface-2)]/30 hover:border-red-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'vodafone' ? 'border-red-600' : 'border-[var(--color-text-muted)]'
                      }`}>
                        {paymentMethod === 'vodafone' && <div className="w-2.5 h-2.5 rounded-full bg-red-600" />}
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-black text-[9px] leading-none text-center">Voda<br/>fone<br/>Cash</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-xs text-[var(--color-text-primary)]">Vodafone Cash</div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] font-semibold mt-0.5">
                          {isRtl ? 'تحويل من محفظة Vodafone Cash' : 'Transfer from your Vodafone Cash wallet'}
                        </div>
                        <div className="text-[10px] text-red-600 font-black mt-1">01115160947</div>
                      </div>
                      {paymentMethod === 'vodafone' && (
                        <span className="text-[9px] font-black uppercase bg-red-500/10 text-red-600 border border-red-500/20 px-2 py-0.5 rounded ml-auto flex-shrink-0">
                          {isRtl ? 'محدد' : 'Selected'}
                        </span>
                      )}
                    </button>

                    {/* e& Cash */}
                    <button
                      onClick={() => setPaymentMethod('ecash')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === 'ecash'
                          ? 'border-[#FF6600] bg-orange-500/5 shadow-inner'
                          : 'border-[var(--color-border)] bg-[var(--color-surface-2)]/30 hover:border-orange-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'ecash' ? 'border-[#FF6600]' : 'border-[var(--color-text-muted)]'
                      }`}>
                        {paymentMethod === 'ecash' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6600]" />}
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF6600] to-[#FF8C00] flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-black text-[11px] leading-none">e&</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-xs text-[var(--color-text-primary)]">e& Cash</div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] font-semibold mt-0.5">
                          {isRtl ? 'تحويل من محفظة e& (اتصالات) Cash' : 'Transfer from your e& (Etisalat) Cash wallet'}
                        </div>
                        <div className="text-[10px] text-[#FF6600] font-black mt-1">01115160947</div>
                      </div>
                      {paymentMethod === 'ecash' && (
                        <span className="text-[9px] font-black uppercase bg-orange-500/10 text-[#FF6600] border border-orange-500/20 px-2 py-0.5 rounded ml-auto flex-shrink-0">
                          {isRtl ? 'محدد' : 'Selected'}
                        </span>
                      )}
                    </button>

                  </div>

                  {/* Dynamic transfer instructions per method */}
                  <div className={`p-4 rounded-xl mb-6 text-[11px] leading-relaxed border ${
                    paymentMethod === 'instapay' ? 'bg-purple-500/5 border-purple-500/15' :
                    paymentMethod === 'vodafone' ? 'bg-red-500/5 border-red-500/15' :
                    'bg-orange-500/5 border-orange-500/15'
                  }`}>
                    <p className={`font-black mb-2 flex items-center gap-1.5 ${
                      paymentMethod === 'instapay' ? 'text-purple-700' :
                      paymentMethod === 'vodafone' ? 'text-red-600' :
                      'text-[#FF6600]'
                    }`}>
                      {paymentMethod === 'instapay' && '⚡ InstaPay Transfer Instructions'}
                      {paymentMethod === 'vodafone' && '📱 Vodafone Cash Transfer Instructions'}
                      {paymentMethod === 'ecash' && '🟠 e& Cash Transfer Instructions'}
                    </p>
                    <ol className="text-[var(--color-text-secondary)] font-semibold space-y-1.5 list-decimal list-inside">
                      {paymentMethod === 'instapay' && (<>
                        <li>{isRtl ? 'افتح تطبيق البنك الخاص بك أو تطبيق InstaPay' : 'Open your bank app or InstaPay app'}</li>
                        <li>{isRtl ? 'اختر «تحويل» ثم «InstaPay»' : 'Select "Transfer" then "InstaPay"'}</li>
                        <li>{isRtl ? <>حول المبلغ <strong className="text-[var(--color-text-primary)]">EGP {total.toLocaleString()}</strong> إلى <strong className="text-purple-700">@2mpharmacy</strong></> : <>Transfer <strong className="text-[var(--color-text-primary)]">EGP {total.toLocaleString()}</strong> to <strong className="text-purple-700">@2mpharmacy</strong></>}</li>
                        <li>{isRtl ? <>اكتب رقم طلبك <strong>{orderNumber}</strong> في خانة الملاحظات</> : <>Write your order number <strong>{orderNumber}</strong> in the notes</>}</li>
                        <li>{isRtl ? 'احتفظ بلقطة شاشة الإيصال وأرسله عبر واتساب' : 'Screenshot the receipt and send via WhatsApp'}</li>
                      </>)}
                      {paymentMethod === 'vodafone' && (<>
                        <li>{isRtl ? 'افتح تطبيق Vodafone Cash أو اتصل بـ *9#' : 'Open Vodafone Cash app or dial *9#'}</li>
                        <li>{isRtl ? 'اختر «تحويل» ثم «إلى محفظة»' : 'Select "Transfer" then "To Wallet"'}</li>
                        <li>{isRtl ? <>حول <strong className="text-[var(--color-text-primary)]">EGP {total.toLocaleString()}</strong> إلى <strong className="text-red-600">01115160947</strong></> : <>Transfer <strong className="text-[var(--color-text-primary)]">EGP {total.toLocaleString()}</strong> to <strong className="text-red-600">01115160947</strong></>}</li>
                        <li>{isRtl ? <>اكتب رقم الطلب <strong>{orderNumber}</strong> في الوصف</> : <>Write order number <strong>{orderNumber}</strong> in the description</>}</li>
                        <li>{isRtl ? 'أرسل لقطة شاشة التأكيد عبر واتساب' : 'Send confirmation screenshot via WhatsApp'}</li>
                      </>)}
                      {paymentMethod === 'ecash' && (<>
                        <li>{isRtl ? 'افتح تطبيق e& Cash (اتصالات مصر)' : 'Open e& Cash app (Etisalat Egypt)'}</li>
                        <li>{isRtl ? 'اختر «تحويل إلى محفظة»' : 'Select "Transfer to Wallet"'}</li>
                        <li>{isRtl ? <>حول <strong className="text-[var(--color-text-primary)]">EGP {total.toLocaleString()}</strong> إلى <strong className="text-[#FF6600]">01115160947</strong></> : <>Transfer <strong className="text-[var(--color-text-primary)]">EGP {total.toLocaleString()}</strong> to <strong className="text-[#FF6600]">01115160947</strong></>}</li>
                        <li>{isRtl ? <>اكتب رقم الطلب <strong>{orderNumber}</strong> في خانة الرسالة</> : <>Write order number <strong>{orderNumber}</strong> in the message field</>}</li>
                        <li>{isRtl ? 'أرسل إيصال التحويل عبر واتساب لتأكيد الطلب' : 'Send transfer receipt via WhatsApp to confirm order'}</li>
                      </>)}
                    </ol>
                  </div>

                  {/* WhatsApp confirmation CTA */}
                  <div className="p-4 rounded-xl mb-5 bg-emerald-500/5 border border-emerald-500/15 flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">📲</span>
                    <div>
                      <p className="text-xs font-black text-emerald-700 mb-1">
                        {isRtl ? 'بعد إتمام التحويل — أرسل الإيصال عبر واتساب' : 'After transfer — send receipt on WhatsApp'}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] font-semibold leading-relaxed">
                        {isRtl
                          ? 'أرسل صورة إيصال التحويل ورقم طلبك للتأكيد الفوري. لن يُشحن الطلب إلا بعد التحقق من التحويل.'
                          : 'Send a screenshot of your transfer receipt and your order number for instant confirmation. Orders only ship after payment is verified.'}
                      </p>
                    </div>
                  </div>

                  {/* Action step buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl flex-1 transition-all"
                    >
                      {isRtl ? 'السابق' : 'Back'}
                    </button>
                    <a
                      href={`https://wa.me/201115160947?text=${encodeURIComponent(`Hi! I placed order ${orderNumber} for EGP ${total.toLocaleString()} via ${paymentMethod === 'instapay' ? 'InstaPay (@2mpharmacy)' : paymentMethod === 'vodafone' ? 'Vodafone Cash (01115160947)' : 'e& Cash (01115160947)'}. Attaching transfer receipt now.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setTimeout(() => setStep(4), 300)}
                      className="btn text-xs font-black uppercase tracking-wider py-4 rounded-xl flex-1 flex items-center justify-center gap-1.5 btn-shimmer btn-elevated text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
                    >
                      <Phone size={13} />
                      <span>{isRtl ? 'تأكيد وإرسال الإيصال' : 'Confirm & Send Receipt'} — EGP {total.toLocaleString()}</span>
                    </a>
                  </div>

                  <p className="text-center text-[10px] text-[var(--color-text-muted)] font-semibold mt-4 flex items-center justify-center gap-2">
                    <Shield size={11} />
                    <span>Secure Checkout</span>
                    <span>·</span>
                    <Truck size={11} />
                    <span>Genuine Products Guarantee</span>
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar Panel (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg overflow-hidden">
                <div className="p-4 border-b border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/50">
                  <h3 className="text-xs font-black text-[var(--color-text-primary)] uppercase tracking-wider font-display">
                    {isRtl ? 'ملخص الفاتورة والطلب' : 'Order Summary'}
                  </h3>
                </div>
                
                <div className="p-4 space-y-4">
                  {cartItems.map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-white border border-[var(--color-border-soft)] p-0.5 shadow-sm">
                        <Image src={p.image} alt={p.name} width={40} height={40} className="w-full h-full object-contain" />
                      </div>
                      <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <p className="text-[11px] font-bold text-[var(--color-text-primary)] truncate">{p.name}</p>
                        <p className="text-[9px] text-[var(--color-text-muted)] font-semibold">{p.brand}</p>
                      </div>
                      <span className="text-[11px] font-black text-[var(--color-text-primary)] flex-shrink-0">EGP {p.price.toLocaleString()}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-[var(--color-border-soft)] pt-3.5 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[var(--color-text-secondary)]">{isRtl ? 'المجموع الفرعي' : 'Subtotal'}</span>
                      <span className="text-[var(--color-text-primary)]">EGP {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[var(--color-text-secondary)]">{isRtl ? 'قيمة الشحن' : 'Delivery Fee'}</span>
                      <span className={deliveryFee === 0 ? 'text-emerald-600 font-black' : 'text-[var(--color-text-primary)]'}>
                        {deliveryFee === 0 ? (isRtl ? 'مجاني' : 'FREE') : `EGP ${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-black pt-2 border-t border-[var(--color-border-soft)]/60">
                      <span className="text-[var(--color-text-primary)] uppercase">{isRtl ? 'الإجمالي' : 'Total'}</span>
                      <span className="text-[var(--color-brand-primary)] text-sm">EGP {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
