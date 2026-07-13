import { MetadataRoute } from 'next';
import { products, categories } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://2mpharmacy.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,             lastModified: now, changeFrequency: 'daily',   priority: 1 },
    { url: `${base}/about`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faqs`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.5 },
    { url: `${base}/offers`, lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/brands`, lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
