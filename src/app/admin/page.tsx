'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, AlertTriangle, Mail } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/common/FloatingButtons';
import { useTranslation } from '@/lib/LanguageContext';
import { toast } from 'sonner';

export default function AdminPage() {
  const router = useRouter();
  const { t, isRtl } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in as admin
    const adminLoggedIn = localStorage.getItem('2m-admin-logged-in');
    if (adminLoggedIn === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent, bypass = false) => {
    if (e) e.preventDefault();
    setError('');

    if (!bypass && (email !== 'mahmoudelsadatofficial@gmail.com' || password !== 'M123456')) {
      setError(isRtl ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password.');
      toast.error(isRtl ? 'فشل تسجيل الدخول' : 'Access Denied', {
        description: isRtl ? 'البيانات التي أدخلتها غير صحيحة.' : 'The credentials entered are incorrect.',
        duration: 3000
      });
      return;
    }

    setLoading(true);
    // Simulate short loader
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    localStorage.setItem('2m-admin-logged-in', 'true');
    toast.success(isRtl ? 'مرحباً بالمسؤول!' : 'Access Granted!', {
      description: isRtl ? 'تم التحقق من هويتك بنجاح.' : 'Admin identity verified successfully.',
      duration: 3000
    });

    // Redirect to dashboard
    router.push('/admin/dashboard');
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center min-h-[80vh] py-16 px-4" style={{ background: 'var(--color-page-bg)' }}>
        <div className="w-full max-w-[440px] relative">
          
          {/* Decorative ambient background glows */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-[var(--color-brand-gold)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[var(--color-brand-primary)]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Secure Portal Card */}
          <div className="card shadow-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-xl relative z-10 overflow-hidden">
            
            {/* Top decorative stripe (Gold for Admins) */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-brand-primary)] animate-pulse" />
            
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 mb-4 shadow-inner">
                  <ShieldCheck size={28} className="animate-bounce" />
                </div>
                <h1 className="text-2xl font-black text-[var(--color-text-primary)] font-display">
                  {isRtl ? 'بوابة المسؤول الأمنية' : 'Admin Security Gateway'}
                </h1>
                <p className="text-xs text-[var(--color-text-secondary)] mt-2 font-semibold leading-relaxed">
                  {isRtl 
                    ? 'هذه المنطقة مخصصة لإدارة الصيدلية فقط. يرجى إدخال مفتاح التحقق.' 
                    : 'This zone is restricted for pharmacy management. Please enter authorization key.'
                  }
                </p>
              </div>

              {/* Password Form */}
              <form onSubmit={(e) => handleLogin(e, false)} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">
                    {isRtl ? 'البريد الإلكتروني للمسؤول' : 'Admin Email'}
                  </label>
                  <div className="relative mb-4">
                    <Mail size={16} className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className={`w-full bg-[var(--color-surface-2)] border ${
                        error ? 'border-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]/10' : 'border-[var(--color-border)] focus:border-[var(--color-brand-gold)] focus:ring-[var(--color-brand-gold)]/5'
                      } rounded-xl ${isRtl ? 'pl-4 pr-10' : 'pl-10 pr-4'} py-3.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-4 transition-all`}
                    />
                  </div>
                  
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">
                    {isRtl ? 'مفتاح المسؤول / كلمة المرور' : 'Security Passkey'}
                  </label>
                  <div className="relative">
                    <Lock size={16} className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isRtl ? 'أدخل كلمة المرور' : 'Enter password'}
                      className={`w-full bg-[var(--color-surface-2)] border ${
                        error ? 'border-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]/10' : 'border-[var(--color-border)] focus:border-[var(--color-brand-gold)] focus:ring-[var(--color-brand-gold)]/5'
                      } rounded-xl ${isRtl ? 'pl-10 pr-10' : 'pl-10 pr-10'} py-3.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-4 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors`}
                      aria-label="Toggle password view"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-[var(--color-brand-primary)] font-bold mt-2 flex items-center gap-1.5"
                    >
                      <AlertTriangle size={12} />
                      {error}
                    </motion.p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition-all duration-200 btn-elevated btn-shimmer bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isRtl ? 'تسجيل دخول كمسؤول' : 'Authenticate Admin'}
                      <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-[var(--color-border-soft)] text-center">
                <Link
                  href="/login"
                  className="text-xs text-[var(--color-text-secondary)] font-bold hover:text-[var(--color-text-primary)] hover:underline"
                >
                  {isRtl ? 'الرجوع إلى صفحة تسجيل دخول المرضى' : 'Back to Patient Portal Sign-in'}
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
