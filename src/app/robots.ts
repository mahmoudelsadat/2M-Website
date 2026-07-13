import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout', '/cart', '/account'],
      },
    ],
    sitemap: 'https://2mpharmacy.com/sitemap.xml',
    host: 'https://2mpharmacy.com',
  };
}
