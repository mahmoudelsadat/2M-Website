'use client';

import { Shield, Truck, Star, Users, Award, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

const values = [
  { icon: Shield, titleKey: 'val1Title' as const, descriptionKey: 'val1Desc' as const, colorClass: 'text-sky-400', bgClass: 'bg-sky-400/15', borderClass: 'border-sky-400/30' },
  { icon: Star, titleKey: 'val2Title' as const, descriptionKey: 'val2Desc' as const, colorClass: 'text-brand-gold', bgClass: 'bg-brand-gold/15', borderClass: 'border-brand-gold/30' },
  { icon: Truck, titleKey: 'val3Title' as const, descriptionKey: 'val3Desc' as const, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-400/15', borderClass: 'border-emerald-400/30' },
  { icon: Heart, titleKey: 'val4Title' as const, descriptionKey: 'val4Desc' as const, colorClass: 'text-fuchsia-400', bgClass: 'bg-fuchsia-400/15', borderClass: 'border-fuchsia-400/30' },
  { icon: Users, titleKey: 'val5Title' as const, descriptionKey: 'val5Desc' as const, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/15', borderClass: 'border-amber-500/30' },
  { icon: Award, titleKey: 'val6Title' as const, descriptionKey: 'val6Desc' as const, colorClass: 'text-primary', bgClass: 'bg-primary/15', borderClass: 'border-primary/30' },
];

export default function AboutClient() {
  const t = useTranslations('About');

  return (
    <main>
      {/* Hero */}
      <section
        className="relative py-24 overflow-hidden bg-dark-hero"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,16,46,0.12) 0%, transparent 70%), var(--color-dark-hero)' }}
      >
        <div className="container-2m text-center">
          <div className="section-label mx-auto w-fit mb-4">{t('ourStory')}</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            {t('builtForEgypt')}<br />
            <span className="text-gradient-primary">{t('healthSeekers')}</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('aboutDescription')}
          </p>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20 bg-dark-bg">
        <div className="container-2m">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">{t('whyChoose')}</div>
            <h2 className="section-title mt-2">
              {t('ourPromiseToYou').split(t('promise'))[0]}
              <span className="text-gradient-gold">{t('promise')}</span>
              {t('ourPromiseToYou').split(t('promise'))[1]}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                   key={v.titleKey}
                   className="p-6 rounded-2xl border border-white/6 group hover:border-white/15 transition-all duration-300 bg-dark-surface"
                   style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 border ${v.bgClass} ${v.borderClass}`}
                  >
                    <Icon size={22} className={v.colorClass} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{t(v.titleKey)}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t(v.descriptionKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-14 bg-dark-hero border-t border-white/5">
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
                <div className="text-sm text-gray-400">{t(s.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authenticity Section */}
      <section className="py-20 bg-dark-surface">
        <div className="container-2m">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label">{t('ourGuarantee')}</div>
              <h2 className="section-title mt-2 mb-6">
                {t('guaranteeTitleLine1')}<br />
                <span className="text-gradient-gold">{t('guaranteeTitleLine2')}</span>
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
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
                  <li key={itemKey} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="text-brand-gold mt-0.5 flex-shrink-0">✓</span>
                    {t(itemKey as any)}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="p-8 rounded-3xl border border-primary/20 text-center bg-primary/5"
            >
              <div className="text-7xl mb-4">🛡️</div>
              <h3 className="text-white text-2xl font-black mb-3">{t('guaranteeCardTitle')}</h3>
              <p className="text-gray-400 text-sm mb-6">
                {t('guaranteeCardDesc')}
              </p>
              <a
                href="https://wa.me/201115160947"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
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
