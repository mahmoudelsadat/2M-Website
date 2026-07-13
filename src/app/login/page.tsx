'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { useTranslation } from '@/lib/LanguageContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { t, isRtl } = useTranslation();
  
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
      newErrors.name = isRtl ? 'الاسم بالكامل مطلوب' : 'Full name is required';
    }
    if (!email.trim()) {
      newErrors.email = isRtl ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = isRtl ? 'صيغة البريد الإلكتروني غير صالحة' : 'Invalid email format';
    }
    if (!password.trim()) {
      newErrors.password = isRtl ? 'كلمة المرور مطلوبة' : 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = isRtl ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters';
    }
    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = isRtl ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match';
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
      isLogin 
        ? (isRtl ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!') 
        : (isRtl ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!'),
      {
        description: isLogin
          ? (isRtl ? `مرحباً بك مجدداً، ${localStorage.getItem('2m-user-name')}` : `Welcome back, ${localStorage.getItem('2m-user-name')}`)
          : (isRtl ? 'دعنا نبدأ رحلتك الصحية معنا' : 'Let\'s start your health journey with us'),
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
      <main className="flex-grow flex items-center justify-center min-h-[85vh] py-16 px-4 bg-gray-50 dark:bg-[#060700]">
        <div className="w-full max-w-[460px] relative">
          
          {/* Decorative ambient blobs */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-slate-200 rounded-full blur-3xl pointer-events-none opacity-50" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-gray-200 rounded-full blur-3xl pointer-events-none opacity-50" />

          {/* Portal Card */}
          <div className="shadow-xl rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] relative z-10 overflow-hidden">
            
            {/* Top decorative branding tag */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-gold)]" />
            
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black text-white font-black text-xl mb-4 shadow-lg hover:scale-105 transition-transform">
                  2M
                </Link>
                <h1 className="text-2xl font-black text-[var(--color-text-primary)] font-display">
                  {isLogin 
                    ? (isRtl ? 'تسجيل الدخول' : 'Welcome Back') 
                    : (isRtl ? 'إنشاء حساب جديد' : 'Join 2M Pharmacy')
                  }
                </h1>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 font-semibold">
                  {isLogin 
                    ? (isRtl ? 'ادخل إلى بوابتك الصحية الآمنة' : 'Access your secure premium health panel') 
                    : (isRtl ? 'ابدأ بالحصول على الرعاية والمزايا الحصرية' : 'Get exclusive loyalty points & express tracking')
                  }
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex bg-[var(--color-surface-2)] p-1 rounded-xl mb-8 border border-[var(--color-border-soft)] relative">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setErrors({}); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 relative z-10 ${
                    isLogin ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  {isRtl ? 'تسجيل الدخول' : 'Login'}
                  {isLogin && (
                    <motion.div
                      layoutId="active-auth-tab"
                      className="absolute inset-0 bg-[var(--color-surface)] shadow-md rounded-lg -z-10 border border-[var(--color-border-soft)]"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setErrors({}); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 relative z-10 ${
                    !isLogin ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  {isRtl ? 'إنشاء حساب' : 'Register'}
                  {!isLogin && (
                    <motion.div
                      layoutId="active-auth-tab"
                      className="absolute inset-0 bg-[var(--color-surface)] shadow-md rounded-lg -z-10 border border-[var(--color-border-soft)]"
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
                        <label className="text-xs font-bold text-gray-700 dark:text-slate-300">{isRtl ? 'الاسم بالكامل' : 'Full Name'}</label>
                        <div className="relative">
                          <User size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('fullName')}
                            className={`w-full p-3 bg-gray-50 dark:bg-slate-800 border ${
                              errors.name ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-gray-400 dark:focus:border-slate-600 focus:ring-black dark:focus:ring-white'
                            } rounded-lg ps-11 pe-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                          />
                        </div>
                        {errors.name && (
                          <div className="bg-red-50 text-red-800 p-2.5 rounded-lg text-xs font-bold mt-1 flex items-center gap-2">
                            <span>⚠️</span> {errors.name}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300">{t('email')}</label>
                  <div className="relative">
                    <Mail size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('email')}
                      className={`w-full p-3 bg-gray-50 dark:bg-slate-800 border ${
                        errors.email ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-gray-400 dark:focus:border-slate-600 focus:ring-black dark:focus:ring-white'
                      } rounded-lg ps-11 pe-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                    />
                  </div>
                  {errors.email && (
                    <div className="bg-red-50 text-red-800 p-2.5 rounded-lg text-xs font-bold mt-1 flex items-center gap-2">
                      <span>⚠️</span> {errors.email}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300">{isRtl ? 'كلمة المرور' : 'Password'}</label>
                  <div className="relative">
                    <Lock size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full p-3 bg-gray-50 dark:bg-slate-800 border ${
                        errors.password ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-gray-400 dark:focus:border-slate-600 focus:ring-black dark:focus:ring-white'
                      } rounded-lg ps-11 pe-11 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
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
                    <div className="bg-red-50 text-red-800 p-2.5 rounded-lg text-xs font-bold mt-1 flex items-center gap-2">
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
                        <label className="text-xs font-bold text-gray-700 dark:text-slate-300">{isRtl ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                        <div className="relative">
                          <Lock size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full p-3 bg-gray-50 dark:bg-slate-800 border ${
                              errors.confirmPassword ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-gray-400 dark:focus:border-slate-600 focus:ring-black dark:focus:ring-white'
                            } rounded-lg ps-11 pe-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <div className="bg-red-50 text-red-800 p-2.5 rounded-lg text-xs font-bold mt-1 flex items-center gap-2">
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
                      {isLogin ? t('login') : t('signup')}
                      <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                    </>
                  )}
                </button>
              </form>

              {/* Portal Switcher Footer info */}
              <div className="mt-8 pt-6 border-t border-[var(--color-border-soft)] text-center">
                <p className="text-xs text-[var(--color-text-secondary)] font-semibold">
                  {isLogin 
                    ? (isRtl ? 'ليس لديك حساب؟ ' : 'New to 2M Pharmacy? ')
                    : (isRtl ? 'لديك حساب بالفعل؟ ' : 'Already have an account? ')
                  }
                  <button
                    onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
                    className="text-[var(--color-brand-primary)] font-bold hover:underline"
                  >
                    {isLogin 
                      ? (isRtl ? 'أنشئ حساباً الآن' : 'Create an account')
                      : (isRtl ? 'سجل دخولك' : 'Sign in here')
                    }
                  </button>
                </p>
                
                {/* Admin Access Redirect */}
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-brand-gold)] uppercase tracking-wider mt-4 hover:text-[var(--color-brand-primary)] transition-colors"
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
