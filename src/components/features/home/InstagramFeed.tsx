'use client';

import { ArrowRight, Heart } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { InstagramIcon } from '@/components/ui/icons';

const INSTAGRAM_POSTS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80', likes: 312, captionKey: 'post1Caption' as const },
  { id: '2', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80', likes: 487, captionKey: 'post2Caption' as const },
  { id: '3', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80', likes: 231, captionKey: 'post3Caption' as const },
  { id: '4', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&q=80', likes: 654, captionKey: 'post4Caption' as const },
  { id: '5', image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=300&q=80', likes: 189, captionKey: 'post5Caption' as const },
  { id: '6', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80', likes: 403, captionKey: 'post6Caption' as const },
];

export default function InstagramFeed() {
  const t = useTranslations('Home');

  return (
    <section className="py-16 bg-surface-warm">
      <div className="container-2m">
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-label">{t('instagramSectionLabel')}</div>
            <h2 className="section-title">
              {t('instagramTitle')}{' '}
              <span className="text-gradient-primary">Instagram</span>
            </h2>
            <a
              href="https://www.instagram.com/2m_pharmcy"
              target="_blank"
              rel="noopener noreferrer"
              id="instagram-handle"
              className="inline-flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-primary transition-colors"
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
              className="relative group aspect-square rounded-2xl overflow-hidden border border-border-warm bg-surface-warm-dark shadow-sm"
            >
              <Image
                src={post.image}
                alt={t(post.captionKey)}
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
                  <p className="text-[10px] leading-tight">{t(post.captionKey)}</p>
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
            {t('instagramFollowCta')}
          </a>
        </div>
      </div>
    </section>
  );
}
