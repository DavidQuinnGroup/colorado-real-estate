import type { MetadataRoute } from 'next';

import { cities } from '@/lib/cities';

const SITE_URL = 'https://davidquinngroup.com';
const now = new Date();

function url(path = '') {
  return `${SITE_URL}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: url(),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: url('/search'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const marketRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: url(`/market/${city.marketSlug}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...marketRoutes];
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/sitemap.ts
