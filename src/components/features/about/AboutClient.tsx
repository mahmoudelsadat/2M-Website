'use client';

import { Shield, Truck, Star, Users, Award, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

const values = [
  { icon: Shield, titleKey: 'val1Title' as const, descriptionKey: 'val1Desc' as const, colorClass: 'text-brand-accent', bgClass: 'bg-brand-accent-soft', borderClass: 'border-brand-accent/20' },
  { icon: Star, titleKey: 'val2Title' as const, descriptionKey: 'val2Desc' as const, colorClass: 'text-brand-gold-dark', bgClass: 'bg-brand-gold-soft', borderClass: 'border-brand-gold/20' },
  { icon: Truck, titleKey: 'val3Title' as const, descriptionKey: 'val3Desc' as const, colorClass: 'text-brand-accent', bgClass: 'bg-brand-accent-soft', borderClass: 'border-brand-accent/20' },
  { icon: Heart, titleKey: 'val4Title' as const, descriptionKey: 'val4Desc' as const, colorClass: 'text-brand-primary', bgClass: 'bg-brand-primary-soft', borderClass: 'border-brand-primary/20' },
  { icon: Users, titleKey: 'val5Title' as const, descriptionKey: 'val5Desc' as const, colorClass: 'text-brand-accent', bgClass: 'bg-brand-accent-soft', borderClass: 'border-brand-accent/20' },
  { icon: Award, titleKey: 'val6Title' as const, descriptionKey: 'val6Desc' as const, colorClass: 'text-brand-primary', bgClass: 'bg-brand-primary-soft', borderClass: 'border-brand-primary/20' },
];

export default function AboutClient() {
  const t = useTranslations('About');

  return (
    <main>
      {/* Hero */}
      <section
        className="relative py-24 overflow-hidden bg-surface-2 border-b border-border"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,0,0,0.06) 0%, transparent 70%)' }}
      >
        <div className="container-2m text-center relative z-10">
          <div className="section-label mx-auto w-fit mb-4">{t('ourStory')}</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {t('builtForEgypt')}<br />
            <span className="text-gradient-primary">{t('healthSeekers')}</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            {t('aboutDescription')}
          </p>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20 bg-surface">
        <div className="container-2m">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">{t('whyChoose')}</div>
            <h2 className="section-title mt-2">
              {t('ourPromiseToYou').split(t('promise'))[0]}
              <span className="text-gradient-primary">{t('promise')}</span>
              {t('ourPromiseToYou').split(t('promise'))[1]}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                   key={v.titleKey}
                   className="p-6 rounded-2xl border border-border group hover:border-brand-primary/20 hover:shadow-md transition-all duration-300 bg-surface-2 shadow-xs"
                   style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 border ${v.bgClass} ${v.borderClass}`}
                  >
                    <Icon size={22} className={v.colorClass} />
                  </div>
                  <h3 className="text-text-primary font-bold text-lg mb-2">{t(v.titleKey)}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{t(v.descriptionKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-14 bg-surface-2 border-y border-border">
        <div className="container-2m">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { valueKey: 'brandsVal' as const, labelKey: 'brandsLabel' as const },
              { valueKey: 'customersVal' as const, labelKey: 'customersLabel' as const },
              { valueKey: 'govsVal' as const, labelKey: 'govsLabel' as const },
              { valueKey: 'authVal' as const, labelKey: 'authLabel' as const },
            ].map((s) => (
              <div key={s.labelKey}>
                <div className="text-3xl sm:text-4xl font-black text-gradient-primary mb-1">{t(s.valueKey)}</div>
                <div className="text-sm text-text-secondary">{t(s.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authenticity Section */}
      <section className="py-20 bg-surface">
        <div className="container-2m">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label">{t('ourGuarantee')}</div>
              <h2 className="section-title mt-2 mb-6">
                {t('guaranteeTitleLine1')}<br />
                <span className="text-gradient-accent">{t('guaranteeTitleLine2')}</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                {t('guaranteeDesc')}
              </p>
              <ul className="space-y-3">
                {[
                  'guaranteeItem1',
                  'guaranteeItem2',
                  'guaranteeItem3',
                  'guaranteeItem4',
                  'guaranteeItem5',
                ].map((itemKey) => (
                  <li key={itemKey} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="text-brand-accent mt-0.5 flex-shrink-0">✓</span>
                    {t(itemKey as any)}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="p-8 rounded-3xl border border-brand-primary/10 text-center bg-brand-primary-soft/20 dark:bg-brand-primary-soft/10 shadow-sm"
            >
              <div className="text-7xl mb-4">🛡️</div>
              <h3 className="text-text-primary text-2xl font-black mb-3">{t('guaranteeCardTitle')}</h3>
              <p className="text-text-secondary text-sm mb-6">
                {t('guaranteeCardDesc')}
              </p>
              <a
                href="mailto:concierge@2mpharmacy.com?subject=Guarantee%20Inquiry"
                className="btn btn-primary btn-shimmer btn-elevated px-8 py-3 text-xs font-black uppercase tracking-wider"
              >
                {t('chatWithUs')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
