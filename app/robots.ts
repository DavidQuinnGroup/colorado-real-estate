import type { MetadataRoute } from 'next';

const SITE_URL = 'https://davidquinngroup.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/robots.ts
