'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, AlertTriangle, Mail } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/layout/FloatingButtons';
import { useTranslation } from '@/lib/LanguageContext';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function AdminPage() {
  const router = useRouter();
  const { isRtl } = useTranslation();
  const t = useTranslations('Admin');
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
      setError(t('invalidCredentials'));
      toast.error(t('accessDenied'), {
        description: t('credentialsIncorrect'),
        duration: 3000
      });
      return;
    }

    setLoading(true);
    // Simulate short loader
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    localStorage.setItem('2m-admin-logged-in', 'true');
    toast.success(t('accessGranted'), {
      description: t('identityVerified'),
      duration: 3000
    });

    // Redirect to dashboard
    router.push('/admin/dashboard');
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center min-h-[80vh] py-16 px-4 bg-background">
        <div className="w-full max-w-[440px] relative">
          
          {/* Decorative ambient background glows */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Secure Portal Card */}
          <div className="card shadow-2xl rounded-2xl border border-border bg-card/90 backdrop-blur-xl relative z-10 overflow-hidden">
            
            {/* Top decorative stripe (Gold for Admins) */}
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-gold to-primary animate-pulse" />
            
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 mb-4 shadow-inner">
                  <ShieldCheck size={28} className="animate-bounce" />
                </div>
                <h1 className="text-2xl font-black text-foreground font-display">
                  {t('adminGateway')}
                </h1>
                <p className="text-xs text-muted-foreground mt-2 font-semibold leading-relaxed">
                  {t('restrictedZone')}
                </p>
              </div>

              {/* Password Form */}
              <form onSubmit={(e) => handleLogin(e, false)} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                    {t('emailLabel')}
                  </label>
                  <div className="relative mb-4">
                    <Mail size={16} className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-muted`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className={`w-full bg-surface-2 border ${
                        error ? 'border-destructive focus:ring-destructive/10' : 'border-border focus:border-brand-gold focus:ring-brand-gold/5'
                      } rounded-xl ${isRtl ? 'pl-4 pr-10' : 'pl-10 pr-4'} py-3.5 text-sm text-foreground placeholder-muted focus:outline-none focus:ring-4 transition-all`}
                    />
                  </div>
                  
                  <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                    {t('passkeyLabel')}
                  </label>
                  <div className="relative">
                    <Lock size={16} className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-muted`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('passwordPlaceholder')}
                      className={`w-full bg-surface-2 border ${
                        error ? 'border-destructive focus:ring-destructive/10' : 'border-border focus:border-brand-gold focus:ring-brand-gold/5'
                      } rounded-xl ${isRtl ? 'pl-10 pr-10' : 'pl-10 pr-10'} py-3.5 text-sm text-foreground placeholder-muted focus:outline-none focus:ring-4 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors`}
                      aria-label="Toggle password view"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-destructive font-bold mt-2 flex items-center gap-1.5"
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
                      {t('authenticateBtn')}
                      <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-border-soft text-center">
                <Link
                  href="/login"
                  className="text-xs text-muted-foreground font-bold hover:text-foreground hover:underline"
                >
                  {t('backToPatientSign')}
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
