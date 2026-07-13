import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons, { MobileBottomNav } from '@/components/FloatingButtons';
import { Shield, Truck, Star, Users, Award, Heart } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Our Story & Mission',
  description: "Learn about 2M Premium Pharmacy — Egypt's trusted destination for authentic health, wellness, and beauty products.",
};

const values = [
  { icon: Shield, title: 'Authentic Products', description: 'Every product sourced from authorized distributors. Zero compromises on quality.', color: '#4facfe' },
  { icon: Star, title: 'Expert Curation', description: 'Our pharmacists hand-pick every product category for efficacy and safety.', color: '#C9A84C' },
  { icon: Truck, title: 'Fast Delivery', description: 'Egypt-wide delivery to all 27 governorates. 2–5 business days to your door.', color: '#43e97b' },
  { icon: Heart, title: 'Customer First', description: 'Your health and satisfaction drive every decision we make.', color: '#f093fb' },
  { icon: Users, title: 'Community', description: '10,000+ satisfied customers who trust us for their wellness journey.', color: '#f5a623' },
  { icon: Award, title: 'Premium Standard', description: 'International brands, globally certified, at competitive Egyptian prices.', color: 'var(--color-brand-primary)' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative py-24 overflow-hidden"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,16,46,0.12) 0%, transparent 70%), #060700' }}
        >
          <div className="container-2m text-center">
            <div className="section-label mx-auto w-fit mb-4">Our Story</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Built for Egypt&apos;s<br />
              <span className="text-gradient-primary">Health Seekers</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              2M Premium Pharmacy was founded with a single mission: give every Egyptian access to authentic, premium health and wellness products — with the trust and expertise of a real pharmacy, delivered to your door.
            </p>
          </div>
        </section>

        {/* Our Promise */}
        <section className="py-20" style={{ background: '#0D0D0D' }}>
          <div className="container-2m">
            <div className="text-center mb-14">
              <div className="section-label mx-auto w-fit">Why Choose 2M</div>
              <h2 className="section-title mt-2">Our <span className="text-gradient-gold">Promise</span> to You</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                     key={v.title}
                     className="p-6 rounded-2xl border border-white/6 group hover:border-white/15 transition-all duration-300"
                     style={{ background: '#111', transitionDelay: `${i * 60}ms` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${v.color}15`, border: `1px solid ${v.color}30` }}
                    >
                      <Icon size={22} style={{ color: v.color }} />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{v.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-14" style={{ background: '#060700', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container-2m">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: '500+', label: 'Premium Brands' },
                { value: '10,000+', label: 'Happy Customers' },
                { value: '27', label: 'Governorates Served' },
                { value: '100%', label: 'Authentic Products' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl sm:text-4xl font-black text-gradient-primary mb-1">{s.value}</div>
                  <div className="text-sm text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Authenticity Section */}
        <section className="py-20" style={{ background: '#0A0A0A' }}>
          <div className="container-2m">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="section-label">Our Guarantee</div>
                <h2 className="section-title mt-2 mb-6">
                  100% Authentic,<br />
                  <span className="text-gradient-gold">Every Time</span>
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Every product on 2M Premium Pharmacy is sourced directly from official, authorized distributors. We don&apos;t cut corners — ever.
                </p>
                <ul className="space-y-3">
                  {[
                    'All brands are internationally certified',
                    'Direct authorized distributor partnerships',
                    'Batch-traceable pharmaceutical products',
                    'Pharmacist-verified product selection',
                    'No grey market or unauthorized imports',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="text-[#C9A84C] mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="p-8 rounded-3xl border border-[var(--color-brand-primary)]/20 text-center"
                style={{ background: 'rgba(200,16,46,0.05)' }}
              >
                <div className="text-7xl mb-4">🛡️</div>
                <h3 className="text-white text-2xl font-black mb-3">Authenticity Guarantee</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Not satisfied with the authenticity of a product? Contact us and we&apos;ll make it right — full refund, no questions asked.
                </p>
                <a
                  href="https://wa.me/201115160947"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Chat With Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}
