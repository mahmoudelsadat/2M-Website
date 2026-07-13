'use client';

import { brands } from '@/lib/data';

export default function BrandsCarousel() {
  const doubled = [...brands, ...brands];
  return (
    <section className="py-12 bg-[#F8F7F4] border-y border-[#E4E0D8]">
      <div className="container-2m mb-6 text-center">
        <p className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-[#A8A39C]">Trusted Brands We Carry</p>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #F8F7F4, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #F8F7F4, transparent)' }} />

        <div className="flex gap-4" style={{ width: 'max-content', animation: 'marquee 30s linear infinite' }}>
          {doubled.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex-shrink-0 h-12 px-6 rounded-xl border border-[#E4E0D8] bg-white flex items-center gap-2.5 text-[#6B6560] hover:text-[#1C1917] hover:border-[var(--color-brand-primary)]/20 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span className="text-lg">{brand.logo}</span>
              <span className="text-sm font-semibold whitespace-nowrap">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
