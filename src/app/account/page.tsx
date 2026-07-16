/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Package, History, Award, CheckCircle2, 
  ChevronRight, LogOut, ShieldCheck, Heart, Sparkles, ShoppingBag, Truck
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import { useTranslation } from '@/lib/LanguageContext';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface MockOrder {
  id: string;
  date: string;
  items: string;
  total: string;
  status: 'pending' | 'shipped' | 'delivered';
}

export default function AccountPage() {
  const router = useRouter();
  const { isRtl } = useTranslation();
  const t = useTranslations('Account');
  
  const [userName, setUserName] = useState('Valued Member');
  const [userEmail, setUserEmail] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(450);
  const [activeStep, setActiveStep] = useState(2); // 1 = Placed, 2 = Shipped, 3 = Delivered
  const [giftUnlocked, setGiftUnlocked] = useState(false);
  const [orders, setOrders] = useState<MockOrder[]>([
    { id: '2M-90821', date: '2026-05-18', items: 'Altruist Sunscreen SPF50 + Solgar Zinc 50mg', total: 'EGP 720.00', status: 'delivered' },
    { id: '2M-90145', date: '2026-04-12', items: 'Nordic Naturals Omega-3 Lemon 120ct', total: 'EGP 1,250.00', status: 'delivered' }
  ]);

  useEffect(() => {
    // Check if user is logged in, redirect if not
    const loggedIn = localStorage.getItem('2m-user-logged-in');
    if (loggedIn !== 'true') {
      router.push('/login');
      return;
    }

    const savedName = localStorage.getItem('2m-user-name');
    const savedEmail = localStorage.getItem('2m-user-email');
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('2m-user-logged-in');
    localStorage.removeItem('2m-user-name');
    localStorage.removeItem('2m-user-email');
    
    toast.success(
      t('logoutSuccess'),
      { description: t('logoutSuccessDesc') }
    );
    
    // Dispatch storage event to update navbar dynamically
    window.dispatchEvent(new Event('storage'));
    router.push('/login');
  };

  const handleSimulateDelivery = () => {
    if (activeStep < 3) {
      setActiveStep(3);
      setLoyaltyPoints(500);
      setGiftUnlocked(true);
      toast.success(
        t('orderReceived'),
        { 
          description: t('orderReceivedDesc'),
          duration: 5000
        }
      );
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 pt-8 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Main User Dashboard Header */}
          <div className="mb-10 bg-gradient-to-r from-brand-primary/10 via-brand-gold/5 to-brand-primary/5 rounded-3xl p-6 md:p-8 border border-border-soft relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-surface border-2 border-brand-gold flex items-center justify-center text-brand-primary shadow-lg font-black text-2xl uppercase">
                {userName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase bg-brand-gold/10 text-brand-gold px-2.5 py-0.5 rounded-full border border-brand-gold/20 flex items-center gap-1">
                    <Award size={10} />
                    {t('loyaltyTier')}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-text-primary font-display tracking-tight leading-none">
                  {t('welcomeBack')}, {userName}!
                </h1>
                <p className="text-xs text-text-secondary mt-1.5 font-medium">
                  {userEmail || 'member@2mpharmacy.com'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-brand-primary/20 hover:bg-brand-primary-soft/30 text-brand-primary text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 relative z-10 shadow-sm"
            >
              <LogOut size={14} />
              {t('logout')}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: loyalty & Info cards */}
            <div className="space-y-8 lg:col-span-1">
              
              {/* Loyalty Score Card */}
              <div className="card border border-border p-6 rounded-2xl bg-card shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <Heart size={14} className="text-brand-primary" />
                    {t('healthPoints')}
                  </span>
                  <Sparkles size={16} className="text-brand-gold animate-pulse" />
                </div>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-black font-display tracking-tight text-text-primary">
                    {loyaltyPoints}
                  </span>
                  <span className="text-sm font-bold text-text-secondary">/ 500</span>
                </div>

                {/* Progress bar container */}
                <div className="w-full bg-surface-2 h-3 rounded-full overflow-hidden border border-border-soft mb-3 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(loyaltyPoints / 500) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-gold"
                  />
                </div>

                <p className="text-[11px] text-text-secondary font-semibold leading-relaxed mb-4">
                  {giftUnlocked 
                    ? t('vitCUnlocked')
                    : t('pointsDescription')
                  }
                </p>

                {/* Simulated reward notification */}
                <AnimatePresence>
                  {giftUnlocked && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl p-3.5 text-center text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>{t('vitCReady')}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Delivery Address Card */}
              <div className="card border border-border p-6 rounded-2xl bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-border-soft pb-3">
                  <MapPin size={16} className="text-brand-gold" />
                  <h3 className="text-sm font-black text-text-primary font-display uppercase tracking-wider">
                    {t('shippingAddress')}
                  </h3>
                </div>
                
                <p className="text-xs font-bold text-text-primary mb-1">
                  {t('addressTitle')}
                </p>
                <p className="text-xs text-text-secondary font-medium leading-relaxed mb-4">
                  {t('addressPlaceholder')}
                </p>
                
                <button className="text-[11px] font-black text-brand-primary hover:underline uppercase tracking-wider flex items-center gap-1">
                  {t('editDefaultAddress')}
                  <ChevronRight size={12} className={isRtl ? 'rotate-180' : ''} />
                </button>
              </div>

            </div>

            {/* Column 2 & 3: Active Orders timeline & history */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Active Order Tracker */}
              <div className="card border border-border p-6 rounded-2xl bg-card shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 border-b border-border-soft pb-3">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-brand-primary" />
                    <h3 className="text-sm font-black text-text-primary font-display uppercase tracking-wider">
                      {t('activeOrders')}
                    </h3>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-surface-2 border border-border-soft text-text-secondary">
                    #2M-91044
                  </span>
                </div>

                {/* Items & Shipping Address summary */}
                <div className="mb-6 bg-surface-2 p-4 rounded-xl border border-border-soft flex justify-between items-start flex-col sm:flex-row gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-text-secondary block mb-1">
                      {t('itemsInShipment')}
                    </span>
                    <p className="text-xs font-bold text-text-primary">
                      Solgar Vitamin D3 (10000 IU) 120sg + Altruist Dry Skin 10% Urea
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-text-secondary block mb-1">
                      {t('totalOrderValue')}
                    </span>
                    <p className="text-xs font-black text-brand-primary">
                      EGP 890.00
                    </p>
                  </div>
                </div>

                {/* Visual Tracker Timeline */}
                <div className="mb-8">
                  <h4 className="text-xs font-black uppercase text-muted-foreground tracking-wider mb-6">
                    {t('orderTimeline')}
                  </h4>
                  
                  <div className="relative flex justify-between items-center w-full px-2 sm:px-6">
                    
                    {/* Background connector line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-surface-2 -translate-y-1/2 z-0 border border-border-soft rounded-full" />
                    
                    {/* Active dynamic connector line */}
                    <motion.div 
                      className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-brand-primary to-brand-gold -translate-y-1/2 z-0 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: isRtl 
                          ? '100%' 
                          : activeStep === 1 ? '16%' : activeStep === 2 ? '50%' : '100%' 
                      }}
                      style={{ 
                        right: isRtl ? 0 : 'auto', 
                        left: isRtl ? 'auto' : 0,
                        width: activeStep === 1 ? '16%' : activeStep === 2 ? '50%' : '100%' 
                      }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />

                    {/* Step 1: Placed */}
                    <div className="flex flex-col items-center z-10 relative">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        activeStep >= 1 
                          ? 'bg-brand-primary border-brand-primary text-white shadow-md' 
                          : 'bg-card border-border text-text-muted'
                      }`}>
                        <ShoppingBag size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase text-text-primary mt-2">
                        {t('orderPlaced')}
                      </span>
                      <span className="text-[8px] text-text-secondary font-semibold mt-0.5">
                        May 20, 10:15 AM
                      </span>
                    </div>

                    {/* Step 2: Shipped */}
                    <div className="flex flex-col items-center z-10 relative">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        activeStep >= 2 
                          ? 'bg-brand-gold border-brand-gold text-white shadow-md' 
                          : 'bg-card border-border text-text-muted'
                      }`}>
                        <Truck size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase text-text-primary mt-2">
                        {t('orderShipped')}
                      </span>
                      <span className="text-[8px] text-text-secondary font-semibold mt-0.5">
                        May 21, 04:30 PM
                      </span>
                    </div>

                    {/* Step 3: Delivered */}
                    <div className="flex flex-col items-center z-10 relative">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        activeStep >= 3 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' 
                          : 'bg-card border-border text-text-muted'
                      }`}>
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase text-text-primary mt-2">
                        {t('orderDelivered')}
                      </span>
                      <span className="text-[8px] text-text-secondary font-semibold mt-0.5">
                        {activeStep === 3 ? 'May 22, 11:20 AM' : 'Estimated: Today'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Simulate Delivery Action Button for review ease */}
                {activeStep < 3 && (
                  <div className="bg-brand-gold-soft/20 rounded-xl p-4 border border-brand-gold/10 text-center flex flex-col items-center justify-center">
                    <p className="text-xs text-text-secondary font-bold mb-3">
                      {t('simulateDeliveryTitle')}
                    </p>
                    <button
                      onClick={handleSimulateDelivery}
                      className="btn-shimmer btn-elevated bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-black uppercase tracking-wider py-2.5 px-6 rounded-lg transition-transform active:scale-95 flex items-center gap-1.5"
                    >
                      <span>🤝</span>
                      {t('simulateDeliveryBtn')}
                    </button>
                  </div>
                )}
              </div>

              {/* Order History */}
              <div className="card border border-border p-6 rounded-2xl bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-border-soft pb-3">
                  <History size={16} className="text-brand-gold" />
                  <h3 className="text-sm font-black text-text-primary font-display uppercase tracking-wider">
                    {t('pastPurchases')}
                  </h3>
                </div>

                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border border-border-soft rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-surface-2/30 transition-colors">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="text-xs font-black text-text-primary">{ord.id}</span>
                          <span className="text-[9px] text-text-secondary font-semibold">{ord.date}</span>
                        </div>
                        <p className="text-xs text-text-secondary font-medium leading-relaxed">
                          {ord.items}
                        </p>
                      </div>
                      <div className="flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto shrink-0 gap-2">
                        <span className="text-xs font-black text-text-primary">{ord.total}</span>
                        <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15 flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          {t('delivered')}
                        </span>
                      </div>
                    </div>
                  ))}
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
