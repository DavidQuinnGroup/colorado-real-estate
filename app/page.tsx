import type { Metadata } from 'next';

import HomeSearchExperience, { type HomeAuthorityLink } from '@/components/home/HomeSearchExperience';
import FAQSchema from '@/components/schema/FAQSchema';
import { cities } from '@/lib/cities';
import { getBlogLinks } from '@/lib/linking/getBlogLinks';
import type { FAQItem } from '@/lib/schema/faqSchema';
import { buildToolSchema } from '@/lib/schema/toolSchema';

const SITE_URL = 'https://davidquinngroup.com';
const homeToolSchemaKeywords = [
  'Colorado real estate intelligence',
  'Boulder homes for sale',
  'Denver homes for sale',
  'Front Range real estate',
  'David Quinn Group',
  'Colorado property search',
  'real estate market intelligence',
];

export const metadata: Metadata = {
  title: 'Colorado Real Estate Intelligence Engine | David Quinn Group',
  description:
    'Search Colorado homes with David Quinn Group real estate intelligence for Boulder, Denver, and the Front Range, including market context, structural signals, and buyer strategy.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Colorado Real Estate Intelligence Engine | David Quinn Group',
    description:
      'Interactive Colorado property search and market intelligence for Boulder, Denver, and the Front Range.',
    url: SITE_URL,
    siteName: 'David Quinn Group',
    locale: 'en_US',
    type: 'website',
  },
};

const homeToolSchema = buildToolSchema({
  name: 'Colorado Real Estate Intelligence Engine',
  description:
    'David Quinn Group interactive property search and real estate intelligence platform for Boulder, Denver, and the Colorado Front Range.',
  url: SITE_URL,
  keywords: homeToolSchemaKeywords,
  audience: 'Colorado home buyers, sellers, homeowners, and relocation clients',
});

function buildHomeAuthorityLinks(): HomeAuthorityLink[] {
  const primaryMarkets = cities.slice(0, 2).map((city) => ({
    label: `${city.name} Market Report`,
    href: `/market/${city.marketSlug}`,
    eyebrow: 'Market',
  }));

  const brief = getBlogLinks({ city: 'Boulder', limit: 1 })[0];

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
      label: 'Colorado Inventory Search',
      href: '/search',
      eyebrow: 'Search',
    },
  ];
}

function buildHomeFaqs(): FAQItem[] {
  return [
    {
      question: 'What is the David Quinn Group Real Estate Intelligence Engine?',
      answer:
        'The Real Estate Intelligence Engine is David Quinn Group’s Colorado property search and market intelligence platform for Boulder, Denver, and the Front Range. It combines inventory discovery, market context, neighborhood authority paths, construction awareness, and buyer or seller strategy.',
    },
    {
      question: 'How does REIE help Colorado home buyers?',
      answer:
        'REIE helps buyers compare inventory, understand neighborhood context, identify property-level signals, and decide where to move quickly, negotiate, or investigate construction and resilience risk more deeply.',
    },
    {
      question: 'How does REIE help Colorado home sellers?',
      answer:
        'REIE helps sellers understand competing inventory, likely buyer objections, preparation priorities, and how to position a home around condition, location, resilience, lifestyle efficiency, and market alternatives.',
    },
    {
      question: 'Why does David Quinn Group include construction forensics in real estate search?',
      answer:
        'Construction forensics helps separate visible finish quality from durable value. David Quinn Group uses that lens to evaluate building envelope exposure, drainage, systems, maintenance risk, and negotiation leverage before relying only on comparable sales.',
    },
  ];
}

export default function HomePage() {
  const authorityLinks = buildHomeAuthorityLinks();
  const homeFaqs = buildHomeFaqs();

  return (
    <>
      <script
        type="application/ld+json"
        data-testid="reie-home-tool-schema"
        data-tool-schema-type="WebApplication"
        data-tool-schema-name="Colorado Real Estate Intelligence Engine"
        data-tool-schema-url={SITE_URL}
        data-tool-schema-keyword-count={homeToolSchemaKeywords.length}
        data-tool-schema-entrypoint="home"
        data-tool-schema-has-graph="true"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeToolSchema) }}
      />
      <FAQSchema faqs={homeFaqs} pageUrl={SITE_URL} />
      <HomeSearchExperience authorityLinks={authorityLinks} faqItems={homeFaqs} />
    </>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/page.tsx
