'use client';

import { ArrowRight, Heart } from 'lucide-react';
import Image from 'next/image';

function InstagramIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const INSTAGRAM_POSTS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80', likes: 312, caption: 'Vitamin D3 for immunity 💊' },
  { id: '2', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80', likes: 487, caption: 'Skincare routine essentials ✨' },
  { id: '3', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80', likes: 231, caption: 'Daily wellness tips 🌿' },
  { id: '4', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&q=80', likes: 654, caption: 'Protein for your goals 💪' },
  { id: '5', image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=300&q=80', likes: 189, caption: 'Omega-3 benefits explained 🐟' },
  { id: '6', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80', likes: 403, caption: 'Best SPF picks for Egypt ☀️' },
];

export default function InstagramFeed() {
  return (
    <section className="py-16 bg-[#F8F7F4]">
      <div className="container-2m">
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-label">Social</div>
            <h2 className="section-title">
              Follow Us on{' '}
              <span className="text-gradient-primary">Instagram</span>
            </h2>
            <a
              href="https://www.instagram.com/2m_pharmcy"
              target="_blank"
              rel="noopener noreferrer"
              id="instagram-handle"
              className="inline-flex items-center gap-2 mt-2 text-sm text-[#6B6560] hover:text-[var(--color-brand-primary)] transition-colors"
            >
              <InstagramIcon size={14} />
              <span className="font-semibold">@2m_pharmcy</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/2m_pharmcy"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group aspect-square rounded-2xl overflow-hidden border border-[#E4E0D8] bg-[#F3F0EB]"
              style={{ boxShadow: '0 1px 4px rgba(28,25,23,0.05)' }}
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 33vw, 150px"
                className="object-cover transition-transform duration-400 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center rounded-2xl">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-1 text-white text-center px-2">
                  <div className="flex items-center gap-1 text-xs font-semibold">
                    <Heart size={12} className="fill-white" />
                    {post.likes}
                  </div>
                  <p className="text-[10px] leading-tight">{post.caption}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="https://www.instagram.com/2m_pharmcy"
            target="_blank"
            rel="noopener noreferrer"
            id="instagram-follow-cta"
            className="btn btn-ghost gap-2 px-7"
          >
            <InstagramIcon size={15} />
            Follow @2m_pharmcy for Daily Wellness Tips
          </a>
        </div>
      </div>
    </section>
  );
}
