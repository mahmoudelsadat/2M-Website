'use client';

import Link from 'next/link';
import { ArrowRight, Package, CreditCard, MapPin, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';

const STEPS = [
  { n: '01', icon: Package,    titleKey: 'step1Title' as const, descKey: 'step1Desc' as const, textClass: 'text-step-1-text', bgClass: 'bg-step-1-bg', borderClass: 'border-step-1-border' },
  { n: '02', icon: MapPin,     titleKey: 'step2Title' as const, descKey: 'step2Desc' as const, textClass: 'text-step-2-text', bgClass: 'bg-step-2-bg', borderClass: 'border-step-2-border' },
  { n: '03', icon: CreditCard, titleKey: 'step3Title' as const, descKey: 'step3Desc' as const, textClass: 'text-step-3-text', bgClass: 'bg-step-3-bg', borderClass: 'border-step-3-border' },
  { n: '04', icon: Truck,      titleKey: 'step4Title' as const, descKey: 'step4Desc' as const, textClass: 'text-step-4-text', bgClass: 'bg-step-4-bg', borderClass: 'border-step-4-border' },
];

export default function HowItWorks() {
  const t = useTranslations('Home');

  return (
    <section className="py-16 bg-surface-warm">
      <div className="container-2m">
        <div className="text-center mb-12">
          <div className="section-label justify-center">{t('howItWorksSectionLabel')}</div>
          <h2 className="section-title mt-1">{t('howItWorksTitle')}</h2>
          <p className="section-subtitle mx-auto mt-2 text-center">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.n}
                className={`relative p-6 rounded-2xl border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-md group shadow-sm ${step.borderClass}`}
              >
                {/* Step number */}
                <div className={`absolute top-4 right-5 text-3xl font-black opacity-[0.06] group-hover:opacity-[0.1] transition-opacity ${step.textClass}`}>
                  {step.n}
                </div>

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105 border ${step.bgClass} ${step.borderClass}`}
                >
                  <Icon size={20} className={step.textClass} />
                </div>

                <h3 className="text-[1rem] font-bold text-foreground mb-2">{t(step.titleKey)}</h3>
                <p className="text-[0.85rem] text-muted-foreground leading-relaxed">{t(step.descKey)}</p>

                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-surface border border-border-warm rounded-full flex items-center justify-center shadow-sm">
                    <ArrowRight size={10} className="text-muted" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/pharmacy" id="how-it-works-shop" className="btn btn-primary px-8 py-3.5">
            {t('startShopping')} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
