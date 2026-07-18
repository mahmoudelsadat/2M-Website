'use client';

import { ArrowRight, Heart } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { InstagramIcon } from '@/components/ui/icons';

const INSTAGRAM_POSTS = [
  {
    id: '1',
    url: 'https://www.instagram.com/2m_pharmcy/reel/Da1HkyPtgVA/',
    image: 'https://instagram.fcai30-1.fna.fbcdn.net/v/t51.71878-15/747762321_1324994939789971_136632037990107503_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5zZHIudmlkZW9fYWRkaXRpb25hbF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=QPEOJ03dEY4Q7kNvwEjKwq-&_nc_oc=AdooDFCDl-2bP-3CHtcC-bXpDKElypSEW_bS-ywG_IsBuO9Ubmkr1iD2bLSQZGUlahk&_nc_zt=23&_nc_ht=instagram.fcai30-1.fna&_nc_gid=m4xpxkEgWF1FJ2h4_50Ngw&_nc_ss=7b689&oh=00_AQD1HxMPDoLIDslvM9O6thPYegRtrhZzFMY8lk2Em8Cx6w&oe=6A5FE175',
    likes: 312,
    caption: 'روتين العناية بالبشرة مع Arencia'
  },
  {
    id: '2',
    url: 'https://www.instagram.com/p/DaiUFaCtoAT/',
    image: 'https://instagram.fcai30-1.fna.fbcdn.net/v/t51.71878-15/736448870_2496299660843536_5305703131521156028_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=105&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5zZHIudmlkZW9fYWRkaXRpb25hbF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=qWhRFhTTw2EQ7kNvwHgJOJ8&_nc_oc=AdqwUMb6TBmcYtIVNUi231w8QFQXQKla9ZumnW7CdTNpaUp9EK9m6Rcp7sAGYjQFRIw&_nc_zt=23&_nc_ht=instagram.fcai30-1.fna&_nc_gid=RFSItLVoXKxiqBluyrwLlQ&_nc_ss=7b689&oh=00_AQBHGdjJg62vcU9ghlBnpl66sQ4dEFVYMhHVUq2wBj9RRg&oe=6A5FE77E',
    likes: 487,
    caption: 'Anua Niacinamide 10 TXA 4 Serum'
  },
  {
    id: '3',
    url: 'https://www.instagram.com/p/DZVPOJgNdTf/',
    image: 'https://instagram.fcai30-1.fna.fbcdn.net/v/t51.71878-15/720168284_2388814798290687_3929913420662073570_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=103&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5zZHIudmlkZW9fYWRkaXRpb25hbF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=mgiwlDcY4NgQ7kNvwH4oRNr&_nc_oc=Adq-jmaRbaSsD8vv3tmObBqlbjpelf-YyAU2HO5IJrFQDBt0_3YzVMfMZ30otKdjdPI&_nc_zt=23&_nc_ht=instagram.fcai30-1.fna&_nc_gid=LE84L8313EFdtrultwTA4w&_nc_ss=7b689&oh=00_AQBzl5folq5mwF8J9B0halLh9Y6dFLLtrFUav_941WiJfA&oe=6A5FFBF7',
    likes: 231,
    caption: 'منتجات العناية بالبشرة الأكثر طلباً'
  },
  {
    id: '4',
    url: 'https://www.instagram.com/p/DZDUtXiAh1y/',
    image: 'https://instagram.fcai30-1.fna.fbcdn.net/v/t51.71878-15/711729548_2399079280503742_7355557513851077967_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=104&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5zZHIudmlkZW9fYWRkaXRpb25hbF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=eoc19nFj-74Q7kNvwEDM-4o&_nc_oc=AdrZ0rn0FcQ2OkBsmL0qiIcV3yfiMeBOQ09bFIDLqpsvLWujBbgn9mlCDX8-_x7z0rI&_nc_zt=23&_nc_ht=instagram.fcai30-1.fna&_nc_gid=BRK6RzHAgmw3p5kJrGSFMA&_nc_ss=7b689&oh=00_AQDmvF8VcIdFJf6uFML4MqIhvNnAiI_Zx0KLxzPtChb-sQ&oe=6A60105A',
    likes: 654,
    caption: 'مستحضرات التجميل الكورية الفاخرة'
  },
  {
    id: '5',
    url: 'https://www.instagram.com/p/DZAJZKegmK1/',
    image: 'https://scontent.cdninstagram.com/v/t51.71878-15/711466558_981503204798711_643303989312369296_n.jpg?stp=cmp1_dst-jpg_e35_s640x640_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=vNrL3yTBNgkQ7kNvwFGRiXj&_nc_oc=Adqbq5foCrz1UerJDGuXov0M4KVCtwPhJ_0ozac_AA64cGUt_bazOcn9wvo6lzNSQeE&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=B4u50ttPY6axTb2zw2GDNw&_nc_ss=7b289&oh=00_AQBHQWks4ur9KxIvWrtAcl3H_bDYuTDyKKUzxzK27LOXEw&oe=6A600831',
    likes: 189,
    caption: 'تونر الرز الكوري من I’m From'
  },
  {
    id: '6',
    url: 'https://www.instagram.com/p/DZhUnY9giEM/',
    image: 'https://scontent.cdninstagram.com/v/t51.71878-15/722098069_1177293191208274_8739848607877164622_n.jpg?stp=cmp1_dst-jpg_e35_s640x640_tt6&_nc_cat=107&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=ds9VTJfZP6wQ7kNvwF3DkAO&_nc_oc=Adr_is_qQ-xCl0co5ZqWRVxgJIBjf_CLTC_r8_q5ylb-gM3jOs_7yd0wZGkDKeKcntU&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=JuQEOfALTeWjd9XnYpO2EA&_nc_ss=7b689&oh=00_AQCj2YLqlwAe0ne1X3hNFOJXMgZ8p5qNWYWzww6WfSITBw&oe=6A5FFC8F',
    likes: 403,
    caption: 'Arencia Vitamin C Booster Shot'
  }
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
              className="inline-flex items-center gap-2 mt-2 text-sm text-text-secondary hover:text-brand-primary transition-colors"
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
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group aspect-square rounded-2xl overflow-hidden border border-border bg-surface-3 shadow-xs"
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
                  <p className="text-[10px] leading-tight font-medium">{post.caption}</p>
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
