import type { Metadata } from 'next';

import type { SearchMapMeta } from '@/components/maps/SearchMap';
import SearchInterface, { type SearchAuthorityLink } from '@/components/search/SearchInterface';
import FAQSchema from '@/components/schema/FAQSchema';
import { cities } from '@/lib/cities';
import { getBlogLinks } from '@/lib/linking/getBlogLinks';
import { searchPropertiesWithMeta } from '@/lib/search/searchProperties';
import type { FAQItem } from '@/lib/schema/faqSchema';
import { buildToolSchema } from '@/lib/schema/toolSchema';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://davidquinngroup.com';
const SEARCH_URL = `${SITE_URL}/search`;
const searchToolSchemaKeywords = [
  'Colorado real estate search',
  'Boulder homes for sale',
  'Denver homes for sale',
  'Front Range property search',
  'MLS search Colorado',
  'David Quinn Group',
  'real estate intelligence search',
];

export const metadata: Metadata = {
  title: 'Guided Colorado Property Search | David Quinn Group',
  description:
    'Explore Colorado homes with David Quinn Group guidance for Boulder, Denver, and the greater Front Range, using listing discovery, property context, and market perspective.',
  alternates: {
    canonical: SEARCH_URL,
  },
  openGraph: {
    title: 'Guided Colorado Property Search | David Quinn Group',
    description:
      'A guided Colorado property search experience built around fit, context, and confident next steps.',
    url: SEARCH_URL,
    siteName: 'David Quinn Group',
    locale: 'en_US',
    type: 'website',
  },
};

const searchToolSchema = buildToolSchema({
  name: 'Guided Colorado Property Search',
  description:
    'David Quinn Group guided property search for Colorado homes, combining listing discovery, map-based context, and market perspective for Boulder, Denver, and the Front Range.',
  url: SEARCH_URL,
  keywords: searchToolSchemaKeywords,
  audience: 'Colorado home buyers, sellers, relocation clients, and homeowners evaluating market options',
});

function buildInitialSearchMeta(meta: Awaited<ReturnType<typeof searchPropertiesWithMeta>>['meta']): SearchMapMeta {
  return {
    ...meta,
    durationMs: 0,
  };
}

function buildSearchAuthorityLinks(): SearchAuthorityLink[] {
  const primaryMarkets = cities.slice(0, 2).map((city) => ({
    label: `${city.name} Market Report`,
    href: `/market/${city.marketSlug}`,
    eyebrow: 'Market',
  }));

  const brief = getBlogLinks({ city: 'Boulder', limit: 1 })[0];
  const boulder = cities.find((city) => city.name === 'Boulder');

  return [
    ...primaryMarkets,
    ...(brief
      ? [
          {
            label: 'Boulder REIE Brief',
            href: brief.href,
            eyebrow: 'Brief',
          },
        ]
      : []),
    {
      label: 'Boulder Neighborhood Intelligence',
      href: boulder ? `/market/${boulder.marketSlug}` : '/search?city=Boulder',
      eyebrow: 'Authority',
    },
  ];
}

function buildSearchFaqs(): FAQItem[] {
  return [
    {
      question: 'What does the David Quinn Group Colorado real estate search evaluate?',
      answer:
        'The search evaluates Colorado inventory through real estate intelligence, combining map-based MLS discovery, pricing context, property signals, neighborhood paths, and buyer or seller strategy.',
    },
    {
      question: 'How is REIE search different from a standard home search?',
      answer:
        'A standard search usually stops at price, beds, baths, and location. REIE search adds market context, construction awareness, resilience signals, neighborhood intelligence, and strategy prompts for Boulder, Denver, and the Colorado Front Range.',
    },
    {
      question: 'How should buyers use this Colorado property search?',
      answer:
        'Buyers should use the search to compare live inventory, identify stronger neighborhood fits, inspect property-level signals, and decide where speed, caution, or deeper construction diligence is appropriate.',
    },
    {
      question: 'How should sellers use REIE search intelligence?',
      answer:
        'Sellers can use REIE search intelligence to understand competing inventory, likely buyer objections, positioning opportunities, and where preparation may improve perceived value before launch.',
    },
  ];
}

/**
 * SearchPage loads the first public listing set server-side, then hands
 * interaction state to the client map and discovery shell.
 */
export default async function SearchPage() {
  const { results: listings, meta } = await searchPropertiesWithMeta({ limit: 250 });
  const initialSearchMeta = buildInitialSearchMeta(meta);
  const authorityLinks = buildSearchAuthorityLinks();
  const searchFaqs = buildSearchFaqs();

  return (
    <main className="h-[calc(100vh-64px)] w-full overflow-hidden bg-black text-white">
      <h1 className="sr-only">Guided Colorado Property Search</h1>
      <script
        type="application/ld+json"
        data-testid="reie-search-tool-schema"
        data-tool-schema-type="WebApplication"
        data-tool-schema-name="Guided Colorado Property Search"
        data-tool-schema-url={SEARCH_URL}
        data-tool-schema-keyword-count={searchToolSchemaKeywords.length}
        data-tool-schema-entrypoint="search"
        data-tool-schema-has-graph="true"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchToolSchema) }}
      />
      <FAQSchema faqs={searchFaqs} pageUrl={SEARCH_URL} />
      <SearchInterface
        initialListings={listings}
        initialSearchMeta={initialSearchMeta}
        authorityLinks={authorityLinks}
        faqItems={searchFaqs}
      />
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/search/page.tsx
