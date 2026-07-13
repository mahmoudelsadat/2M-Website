'use client';

import Link from 'next/link';
import { ArrowRight, Package, CreditCard, MapPin, Truck } from 'lucide-react';

const STEPS = [
  { n: '01', icon: Package,    title: 'Browse & Add',      desc: 'Explore 500+ authentic products across all categories.',          color: '#4A90C4', bg: '#EBF4FB', border: '#C6E0F5' },
  { n: '02', icon: MapPin,     title: 'Your Details',       desc: 'Enter your delivery address anywhere in Egypt — all 27 governorates.', color: '#D4856A', bg: '#FAEEE9', border: '#F4CCBA' },
  { n: '03', icon: CreditCard, title: 'Choose Payment',     desc: 'Pay on delivery in cash, or online with card or InstaPay.',     color: '#6B8F71', bg: '#EDF3EE', border: '#C0D9C2' },
  { n: '04', icon: Truck,      title: 'Sit Back & Receive', desc: 'Your order arrives in 2–5 business days, anywhere in Egypt.',   color: '#B8922A', bg: '#FDF6E8', border: '#EDD2A0' },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-[#F8F7F4]">
      <div className="container-2m">
        <div className="text-center mb-12">
          <div className="section-label justify-center">Simple Process</div>
          <h2 className="section-title mt-1">How It Works</h2>
          <p className="section-subtitle mx-auto mt-2 text-center">
            From browsing to doorstep in four easy steps — no account required for your first order.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.n}
                className="relative p-6 rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
                style={{ borderColor: step.border, boxShadow: '0 1px 4px rgba(28,25,23,0.05)' }}
              >
                {/* Step number */}
                <div className="absolute top-4 right-5 text-3xl font-black opacity-[0.06] group-hover:opacity-[0.1] transition-opacity" style={{ color: step.color }}>
                  {step.n}
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105"
                  style={{ background: step.bg, border: `1px solid ${step.border}` }}
                >
                  <Icon size={20} style={{ color: step.color }} />
                </div>

                <h3 className="text-[1rem] font-bold text-[#1C1917] mb-2">{step.title}</h3>
                <p className="text-[0.85rem] text-[#6B6560] leading-relaxed">{step.desc}</p>

                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-[#E4E0D8] rounded-full flex items-center justify-center shadow-sm">
                    <ArrowRight size={10} className="text-[#A8A39C]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/pharmacy" id="how-it-works-shop" className="btn btn-primary px-8 py-3.5">
            Start Shopping <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
