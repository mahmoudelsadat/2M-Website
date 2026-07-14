'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import { useTranslation } from '@/lib/LanguageContext';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { isRtl } = useTranslation();
  const t = useTranslations('Login');
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Redirect if already logged in
    const loggedIn = localStorage.getItem('2m-user-logged-in');
    if (loggedIn === 'true') {
      router.push('/account');
    }
  }, [router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isLogin && !name.trim()) {
      newErrors.name = t('fullNameRequired');
    }
    if (!email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('emailInvalid');
    }
    if (!password.trim()) {
      newErrors.password = t('passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('passwordMin');
    }
    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = t('passwordsMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate API Network call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    localStorage.setItem('2m-user-logged-in', 'true');
    localStorage.setItem('2m-user-name', name || email.split('@')[0]);
    localStorage.setItem('2m-user-email', email);
    
    toast.success(
      isLogin ? t('loginSuccess') : t('registerSuccess'),
      {
        description: isLogin
          ? t('welcomeUser', { name: localStorage.getItem('2m-user-name') || '' })
          : t('journeyStart'),
        duration: 3000
      }
    );

    // Refresh navbar and redirect
    window.dispatchEvent(new Event('storage'));
    router.push('/account');
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center min-h-[85vh] py-16 px-4 bg-gray-50 dark:bg-dark-hero">
        <div className="w-full max-w-[460px] relative">
          
          {/* Decorative ambient blobs */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-slate-200 rounded-full blur-3xl pointer-events-none opacity-50 dark:opacity-10" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-gray-200 rounded-full blur-3xl pointer-events-none opacity-50 dark:opacity-10" />

          {/* Portal Card */}
          <div className="shadow-xl rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-dark-card relative z-10 overflow-hidden">
            
            {/* Top decorative branding tag */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary to-brand-gold" />
            
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black text-white font-black text-xl mb-4 shadow-lg hover:scale-105 transition-transform">
                  2M
                </Link>
                <h1 className="text-2xl font-black text-foreground font-display">
                  {isLogin ? t('welcomeBack') : t('join2M')}
                </h1>
                <p className="text-xs text-muted-foreground mt-1.5 font-semibold">
                  {isLogin ? t('loginSubtitle') : t('registerSubtitle')}
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex bg-surface-2 p-1 rounded-xl mb-8 border border-border relative">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setErrors({}); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 relative z-10 ${
                    isLogin ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {t('login')}
                  {isLogin && (
                    <motion.div
                      layoutId="active-auth-tab"
                      className="absolute inset-0 bg-card shadow-xs rounded-lg -z-10 border border-border"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setErrors({}); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 relative z-10 ${
                    !isLogin ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {t('register')}
                  {!isLogin && (
                    <motion.div
                      layoutId="active-auth-tab"
                      className="absolute inset-0 bg-card shadow-xs rounded-lg -z-10 border border-border"
                    />
                  )}
                </button>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name (Signup Only) */}
                <AnimatePresence initial={false}>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-muted-foreground">{t('fullNameLabel')}</label>
                        <div className="relative">
                          <User size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('fullNameLabel')}
                            className={`w-full p-3 bg-gray-50 dark:bg-slate-800 border ${
                              errors.name ? 'border-red-400 focus:ring-red-500/10' : 'border-border focus:border-primary focus:ring-primary/5'
                            } rounded-lg ps-11 pe-4 text-sm text-foreground dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                          />
                        </div>
                        {errors.name && (
                          <div className="bg-destructive/10 text-destructive p-2.5 rounded-lg text-xs font-bold mt-1 flex items-center gap-2">
                            <span>⚠️</span> {errors.name}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">{t('emailLabel')}</label>
                  <div className="relative">
                    <Mail size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className={`w-full p-3 bg-gray-50 dark:bg-slate-800 border ${
                        errors.email ? 'border-red-400 focus:ring-red-500/10' : 'border-border focus:border-primary focus:ring-primary/5'
                      } rounded-lg ps-11 pe-4 text-sm text-foreground dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                    />
                  </div>
                  {errors.email && (
                    <div className="bg-destructive/10 text-destructive p-2.5 rounded-lg text-xs font-bold mt-1 flex items-center gap-2">
                      <span>⚠️</span> {errors.email}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">{t('passwordLabel')}</label>
                  <div className="relative">
                    <Lock size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full p-3 bg-gray-50 dark:bg-slate-800 border ${
                        errors.password ? 'border-red-400 focus:ring-red-500/10' : 'border-border focus:border-primary focus:ring-primary/5'
                      } rounded-lg ps-11 pe-11 text-sm text-foreground dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                      aria-label="Toggle password view"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="bg-destructive/10 text-destructive p-2.5 rounded-lg text-xs font-bold mt-1 flex items-center gap-2">
                      <span>⚠️</span> {errors.password}
                    </div>
                  )}
                </div>

                {/* Confirm Password (Signup Only) */}
                <AnimatePresence initial={false}>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-muted-foreground">{t('confirmPasswordLabel')}</label>
                        <div className="relative">
                          <Lock size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full p-3 bg-gray-50 dark:bg-slate-800 border ${
                              errors.confirmPassword ? 'border-red-400 focus:ring-red-500/10' : 'border-border focus:border-primary focus:ring-primary/5'
                            } rounded-lg ps-11 pe-4 text-sm text-foreground dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <div className="bg-destructive/10 text-destructive p-2.5 rounded-lg text-xs font-bold mt-1 flex items-center gap-2">
                            <span>⚠️</span> {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all duration-200 mt-6 btn-elevated btn-shimmer"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isLogin ? t('login') : t('register')}
                      <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                    </>
                  )}
                </button>
              </form>

              {/* Portal Switcher Footer info */}
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-xs text-muted-foreground font-semibold">
                  {isLogin ? t('newTo2M') : t('alreadyHaveAccount')}
                  <button
                    onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
                    className="text-primary font-bold hover:underline"
                  >
                    {isLogin ? t('createAccount') : t('signInHere')}
                  </button>
                </p>
                
                {/* Admin Access Redirect */}
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-gold uppercase tracking-wider mt-4 hover:text-primary transition-colors"
                >
                  <ShieldCheck size={12} />
                  {t('adminPortal')}
                </Link>
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
