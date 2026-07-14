'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import { Check, ChevronRight, MapPin, CreditCard, Truck, Shield, Phone, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/LanguageContext';
import { useCartStore } from '@/lib/store';
import { formatEGP } from '@/lib/utils';
import { useTranslations } from 'next-intl';

function StepIndicator({ current, step, label }: { current: number; step: number; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className={`flex items-center gap-2 ${active ? 'text-foreground font-black' : done ? 'text-brand-gold' : 'text-muted'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300 ${
        done ? 'bg-brand-gold border-brand-gold text-black shadow-sm' :
        active ? 'bg-primary border-primary text-white shadow-md' :
        'border-border text-muted'
      }`}>
        {done ? <Check size={13} /> : step}
      </div>
      <span className="text-xs font-bold hidden sm:inline uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function CheckoutPage() {
  const { isRtl } = useTranslation();
  const t = useTranslations('Checkout');
  const tContact = useTranslations('Contact');
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
    if (!form.name.trim())       errs.name       = t('fullNameRequired');
    if (!form.phone.trim())      errs.phone      = t('phoneRequired');
    if (!form.governorate)       errs.governorate = t('governorateRequired');
    if (!form.address.trim())    errs.address    = t('addressRequired');
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const steps = [
    t('cartReview'),
    t('deliveryDetails'),
    t('payment')
  ];

  const maxNotesLength = 300;
  const govs = t('govsList').split(',');

  // Clear cart upon reaching the confirmation step
  useEffect(() => {
    if (step === 4) {
      clearCart();
    }
  }, [step, clearCart]);

  if (step === 4) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center py-20 bg-background">
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
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative bg-gradient-to-br from-emerald-500 to-[#0D7377] shadow-xl shadow-emerald-500/25"
            >
              <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
              <Check size={40} className="text-white relative z-10" strokeWidth={3} />
            </motion.div>

            <h1 className="text-3xl font-black text-foreground mb-3 font-display">
              {t('orderConfirmed')}
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mb-6">
              {t.rich('orderConfirmedDesc', {
                orderNumber: (chunk) => <span className="text-primary font-black">{chunk}</span>
              })}
            </p>

            <div
              className="p-5 rounded-2xl mb-6 bg-card border border-border shadow-md space-y-3.5"
            >
              <div className="flex justify-between text-xs font-bold border-b border-border-soft pb-2">
                <span className="text-muted-foreground">{t('orderNumber')}</span>
                <span className="text-foreground">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-xs font-bold border-b border-border-soft pb-2">
                <span className="text-muted-foreground">{t('paymentMethod')}</span>
                <span className="text-foreground">
                  {paymentMethod === 'instapay' && 'InstaPay'}
                  {paymentMethod === 'vodafone' && 'Vodafone Cash'}
                  {paymentMethod === 'ecash' && 'e& Cash'}
                </span>
              </div>

              <div className="p-3 rounded-xl text-[10px] font-bold bg-emerald-500/5 border border-emerald-500/15 text-center">
                <p className="text-emerald-600 mb-1 font-black">✅ {t('transferReceived')}</p>
                <p className="text-muted-foreground font-semibold leading-relaxed">
                  {t.rich('transferReceivedDesc', {
                    orderNumber: (chunk) => <strong className="text-primary font-black">{chunk}</strong>
                  })}
                </p>
              </div>
              
              <div className="flex justify-between text-xs font-bold border-b border-border-soft pb-2">
                <span className="text-muted-foreground">{t('estimatedDelivery')}</span>
                <span className="text-emerald-600 font-black">{t('estimatedDeliveryDesc')}</span>
              </div>
              
              <div className="flex justify-between text-xs font-black pt-2">
                <span className="text-foreground uppercase">{t('finalTotal')}</span>
                <span className="text-primary text-base">EGP {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn w-full sm:flex-1 py-3 text-xs font-black uppercase tracking-wider border border-border bg-card hover:bg-surface-2 text-foreground rounded-xl transition-colors">
                {t('backToHome')}
              </Link>
              <a
                href={`https://wa.me/201115160947?text=Hi!%20My%20order%20is%20${orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full sm:flex-1 py-3 text-xs font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Phone size={13} /> 
                {t('trackOnWhatsApp')}
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
      <main className="min-h-screen py-12 bg-background">
        <div className="container-2m max-w-5xl px-4">
          
          {/* Progress Steps Indicators */}
          <div className="flex items-center gap-3 sm:gap-6 mb-10 justify-center flex-wrap">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <StepIndicator current={step} step={i + 1} label={label} />
                {i < steps.length - 1 && (
                  <ChevronRight size={14} className={`${step > i + 1 ? 'text-brand-gold' : 'text-border'} ${isRtl ? 'rotate-180' : ''} flex-shrink-0`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Form Steps Side (2/3 width) */}
            <div className="lg:col-span-2">
              
              {/* Step 1 — Cart Review */}
              {step === 1 && (
                <div className="card border border-border bg-card p-6 rounded-2xl shadow-lg">
                  <h2 className="text-lg font-black text-foreground font-display mb-5 uppercase tracking-wider flex items-center gap-2">
                    <span>🛒</span>
                    {t('reviewSelectedItems')}
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    {cartItems.length === 0 ? (
                      <p className="text-sm text-center py-4 text-muted">
                        {t('noItemsInCart')} <Link href="/pharmacy" className="text-primary">{t('shopNow')}</Link>
                      </p>
                    ) : cartItems.map((p) => (
                      <div key={p.id} className="flex gap-4 p-4 rounded-xl border border-border-soft bg-surface-2/30 hover:bg-surface-2/50 transition-colors">
                        <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-white border border-border-soft p-0.5 shadow-sm">
                          <Image src={p.image} alt={p.name} width={64} height={64} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                          <p className="text-[10px] text-brand-gold uppercase font-black tracking-wider">{p.brand}</p>
                          <p className="text-xs font-bold text-foreground line-clamp-2 mt-0.5">{p.name}</p>
                          <p className="text-xs font-black text-primary mt-1.5">EGP {p.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4 p-3 rounded-xl flex justify-between text-sm font-semibold bg-surface-2 border border-border">
                    <span className="text-muted-foreground">{t('totalItems', { count: cartItems.reduce((s, i) => s + (i.qty || 1), 0) })}</span>
                    <span className="text-foreground font-black">{formatEGP(total)}</span>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    disabled={cartItems.length === 0}
                    className="btn btn-primary w-full py-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-xl btn-shimmer btn-elevated disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{t('continueToDelivery')}</span>
                    <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
                  </button>
                </div>
              )}

              {/* Step 2 — Delivery details */}
              {step === 2 && (
                <div className="card border border-border bg-card p-6 rounded-2xl shadow-lg">
                  <h2 className="text-lg font-black text-foreground font-display mb-6 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={18} className="text-primary" /> 
                    {t('deliveryDetails')}
                  </h2>
                  
                  <div className="space-y-5">
                    
                    {/* Basic info Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{tContact('fullName')} *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-surface-2 border border-border rounded-xl px-3 py-3 text-xs text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                        />
                        {formErrors.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{formErrors.name}</p>}
                      </div>
                      {/* Phone */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{tContact('phone')} *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 01115160947"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-surface-2 border border-border rounded-xl px-3 py-3 text-xs text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                        />
                        {formErrors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold">{formErrors.phone}</p>}
                      </div>
                      {/* Alt Phone */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{t('alternativePhone')}</label>
                        <input
                          type="tel"
                          value={form.altPhone}
                          onChange={(e) => setForm({ ...form, altPhone: e.target.value })}
                          className="w-full bg-surface-2 border border-border rounded-xl px-3 py-3 text-xs text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                        />
                      </div>
                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{tContact('email')}</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-surface-2 border border-border rounded-xl px-3 py-3 text-xs text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Regional details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Governorate select */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{t('governorate')}</label>
                        <select
                          required
                          value={form.governorate}
                          onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                          className="w-full bg-surface-2 border border-border rounded-xl px-3 py-3 text-xs text-foreground focus:outline-none focus:border-primary transition-all cursor-pointer"
                        >
                          <option value="">{t('selectGovernorate')}</option>
                          {govs.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                        {formErrors.governorate && <p className="text-red-500 text-[10px] mt-1 font-bold">{formErrors.governorate}</p>}
                      </div>
                      {/* City */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{t('cityDistrict')}</label>
                        <input
                          type="text"
                          required
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full bg-surface-2 border border-border rounded-xl px-3 py-3 text-xs text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Address Detail */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{t('streetAddress')}</label>
                      <input
                        type="text"
                        placeholder={t('streetAddressPlaceholder')}
                        required
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full bg-surface-2 border border-border rounded-xl px-3 py-3 text-xs text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                      {formErrors.address && <p className="text-red-500 text-[10px] mt-1 font-bold">{formErrors.address}</p>}
                    </div>

                    {/* NOTES TEXTAREA */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{tContact('message')}</label>
                        <span className={`text-[9px] font-black ${
                          form.notes.length >= maxNotesLength ? 'text-primary' : 'text-muted'
                        }`}>
                          {form.notes.length} / {maxNotesLength} {tContact('charactersLeft')}
                        </span>
                      </div>
                      <textarea
                        maxLength={maxNotesLength}
                        rows={3}
                        placeholder={tContact('messagePlaceholder')}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full bg-surface-2 border border-border rounded-xl px-3 py-3 text-xs text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none leading-relaxed"
                      />
                    </div>

                    {/* Step Actions */}
                    <div className="flex gap-3 pt-3">
                      <button 
                        type="button"
                        onClick={() => setStep(1)} 
                        className="btn border border-border bg-card hover:bg-surface-2 text-foreground text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl flex-1 transition-all"
                      >
                        {t('back')}
                      </button>
                      <button 
                        type="button"
                        onClick={() => { if (validateDelivery()) setStep(3); }} 
                        className="btn btn-primary text-xs font-black uppercase tracking-wider py-3.5 rounded-xl flex-1 flex items-center justify-center gap-1.5 btn-shimmer btn-elevated"
                      >
                        <span>{t('continueToPayment')}</span>
                        <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Payment via Egyptian Mobile Transfers */}
              {step === 3 && (
                <div className="card border border-border bg-card p-6 rounded-2xl shadow-lg">
                  <h2 className="text-lg font-black text-foreground font-display mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={18} className="text-brand-gold" />
                    {t('payment')}
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-semibold mb-6">
                    {t('paymentSubtitle')}
                  </p>

                  {/* Payment method selector cards */}
                  <div className="space-y-3 mb-6">

                    {/* InstaPay */}
                    <button
                      onClick={() => setPaymentMethod('instapay')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === 'instapay'
                          ? 'border-instapay-brand bg-purple-500/5 shadow-inner'
                          : 'border-border bg-surface-2/30 hover:border-purple-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'instapay' ? 'border-instapay-brand' : 'border-muted'
                      }`}>
                        {paymentMethod === 'instapay' && <div className="w-2.5 h-2.5 rounded-full bg-instapay-brand" />}
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-instapay-brand to-[#8B5CF6] flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-black text-[10px] leading-none text-center">insta<br/>pay</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-xs text-foreground">InstaPay</div>
                        <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                          {t('instaPayDesc')}
                        </div>
                        <div className="text-[10px] text-instapay-brand font-black mt-1">@2mpharmacy</div>
                      </div>
                      {paymentMethod === 'instapay' && (
                        <span className="text-[9px] font-black uppercase bg-purple-500/10 text-instapay-brand border border-purple-500/20 px-2 py-0.5 rounded ml-auto flex-shrink-0">
                          {t('selected')}
                        </span>
                      )}
                    </button>

                    {/* Vodafone Cash */}
                    <button
                      onClick={() => setPaymentMethod('vodafone')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === 'vodafone'
                          ? 'border-vodafone-brand bg-red-500/5 shadow-inner'
                          : 'border-border bg-surface-2/30 hover:border-red-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'vodafone' ? 'border-vodafone-brand' : 'border-muted'
                      }`}>
                        {paymentMethod === 'vodafone' && <div className="w-2.5 h-2.5 rounded-full bg-vodafone-brand" />}
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-vodafone-brand to-red-500 flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-black text-[9px] leading-none text-center">Voda<br/>fone<br/>Cash</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-xs text-foreground">Vodafone Cash</div>
                        <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                          {t('vodafoneDesc')}
                        </div>
                        <div className="text-[10px] text-vodafone-brand font-black mt-1">01115160947</div>
                      </div>
                      {paymentMethod === 'vodafone' && (
                        <span className="text-[9px] font-black uppercase bg-red-500/10 text-vodafone-brand border border-red-500/20 px-2 py-0.5 rounded ml-auto flex-shrink-0">
                          {t('selected')}
                        </span>
                      )}
                    </button>

                    {/* e& Cash */}
                    <button
                      onClick={() => setPaymentMethod('ecash')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === 'ecash'
                          ? 'border-ecash-brand bg-orange-500/5 shadow-inner'
                          : 'border-border bg-surface-2/30 hover:border-orange-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'ecash' ? 'border-ecash-brand' : 'border-muted'
                      }`}>
                        {paymentMethod === 'ecash' && <div className="w-2.5 h-2.5 rounded-full bg-ecash-brand" />}
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF6600] to-ecash-brand flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-black text-[11px] leading-none">e&</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-xs text-foreground">e& Cash</div>
                        <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                          {t('ecashDesc')}
                        </div>
                        <div className="text-[10px] text-ecash-brand font-black mt-1">01115160947</div>
                      </div>
                      {paymentMethod === 'ecash' && (
                        <span className="text-[9px] font-black uppercase bg-orange-500/10 text-[#FF6600] border border-orange-500/20 px-2 py-0.5 rounded ml-auto flex-shrink-0">
                          {t('selected')}
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
                      {paymentMethod === 'instapay' && t('instaPayInstructions')}
                      {paymentMethod === 'vodafone' && t('vodafoneInstructions')}
                      {paymentMethod === 'ecash' && t('ecashInstructions')}
                    </p>
                    <ol className="text-muted-foreground font-semibold space-y-1.5 list-decimal list-inside">
                      {paymentMethod === 'instapay' && (<>
                        <li>{t('instaPayStep1')}</li>
                        <li>{t('instaPayStep2')}</li>
                        <li>
                          {t.rich('instaPayStep3', {
                            amount: () => <strong className="text-foreground">EGP {total.toLocaleString()}</strong>
                          })}
                        </li>
                        <li>
                          {t.rich('instaPayStep4', {
                            orderNumber: () => <strong>{orderNumber}</strong>
                          })}
                        </li>
                        <li>{t('instaPayStep5')}</li>
                      </>)}
                      {paymentMethod === 'vodafone' && (<>
                        <li>{t('vodafoneStep1')}</li>
                        <li>{t('vodafoneStep2')}</li>
                        <li>
                          {t.rich('vodafoneStep3', {
                            amount: () => <strong className="text-foreground">EGP {total.toLocaleString()}</strong>
                          })}
                        </li>
                        <li>
                          {t.rich('vodafoneStep4', {
                            orderNumber: () => <strong>{orderNumber}</strong>
                          })}
                        </li>
                        <li>{t('vodafoneStep5')}</li>
                      </>)}
                      {paymentMethod === 'ecash' && (<>
                        <li>{t('ecashStep1')}</li>
                        <li>{t('ecashStep2')}</li>
                        <li>
                          {t.rich('ecashStep3', {
                            amount: () => <strong className="text-foreground">EGP {total.toLocaleString()}</strong>
                          })}
                        </li>
                        <li>
                          {t.rich('ecashStep4', {
                            orderNumber: () => <strong>{orderNumber}</strong>
                          })}
                        </li>
                        <li>{t('ecashStep5')}</li>
                      </>)}
                    </ol>
                  </div>

                  {/* WhatsApp confirmation CTA */}
                  <div className="p-4 rounded-xl mb-5 bg-emerald-500/5 border border-emerald-500/15 flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">📲</span>
                    <div>
                      <p className="text-xs font-black text-emerald-700 mb-1">
                        {t('afterTransferTitle')}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
                        {t('afterTransferDesc')}
                      </p>
                    </div>
                  </div>

                  {/* Action step buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn border border-border bg-card hover:bg-surface-2 text-foreground text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl flex-1 transition-all"
                    >
                      {t('back')}
                    </button>
                    <a
                      href={`https://wa.me/201115160947?text=${encodeURIComponent(`Hi! I placed order ${orderNumber} for EGP ${total.toLocaleString()} via ${paymentMethod === 'instapay' ? 'InstaPay (@2mpharmacy)' : paymentMethod === 'vodafone' ? 'Vodafone Cash (01115160947)' : 'e& Cash (01115160947)'}. Attaching transfer receipt now.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setTimeout(() => setStep(4), 300)}
                      className="btn text-xs font-black uppercase tracking-wider py-4 rounded-xl flex-1 flex items-center justify-center gap-1.5 btn-shimmer btn-elevated text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
                    >
                      <Phone size={13} />
                      <span>{t('confirmSendReceipt')} — EGP {total.toLocaleString()}</span>
                    </a>
                  </div>

                  <p className="text-center text-[10px] text-muted mt-4 flex items-center justify-center gap-2 font-semibold">
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
              <div className="sticky top-24 rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
                <div className="p-4 border-b border-border-soft bg-surface-2/50">
                  <h3 className="text-xs font-black text-foreground uppercase tracking-wider font-display">
                    {t('orderSummary')}
                  </h3>
                </div>
                
                <div className="p-4 space-y-4">
                  {cartItems.map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-white border border-border-soft p-0.5 shadow-sm">
                        <Image src={p.image} alt={p.name} width={40} height={40} className="w-full h-full object-contain" />
                      </div>
                      <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <p className="text-[11px] font-bold text-foreground truncate">{p.name}</p>
                        <p className="text-[9px] text-muted font-semibold">{p.brand}</p>
                      </div>
                      <span className="text-[11px] font-black text-foreground flex-shrink-0">EGP {p.price.toLocaleString()}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-border-soft pt-3.5 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground">{t('subtotal')}</span>
                      <span className="text-foreground">EGP {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground">{t('deliveryFee')}</span>
                      <span className={deliveryFee === 0 ? 'text-emerald-600 font-black' : 'text-foreground'}>
                        {deliveryFee === 0 ? t('free') : `EGP ${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-black pt-2 border-t border-border-soft/60">
                      <span className="text-foreground uppercase">{t('payment')}</span>
                      <span className="text-primary text-sm">EGP {total.toLocaleString()}</span>
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
