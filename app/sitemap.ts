import type { MetadataRoute } from 'next';

import { getPublicDecisionGuideRegistryEntries } from '@/lib/coloradoDecisionGuideRegistry';
import { publicTrustRoutes } from '@/lib/publicTrust';

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
    {
      url: url('/buy'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: url('/sell'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: url('/grand-plan'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: url('/sundance-film-festival'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: url('/about'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...publicTrustRoutes.map((route) => ({
      url: url(route.href),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];

  const marketRoutes: MetadataRoute.Sitemap = getPublicDecisionGuideRegistryEntries().map((city) => ({
    url: url(city.marketRoute ?? ''),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...marketRoutes];
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/sitemap.ts
