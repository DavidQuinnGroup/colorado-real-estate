import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import HomeSearchExperience, { type HomeAuthorityLink } from '@/components/home/HomeSearchExperience';
import FAQSchema from '@/components/schema/FAQSchema';
import { cities } from '@/lib/cities';
import { getBlogLinks } from '@/lib/linking/getBlogLinks';
import type { FAQItem } from '@/lib/schema/faqSchema';
import { buildToolSchema } from '@/lib/schema/toolSchema';

const SITE_URL = 'https://davidquinngroup.com';
const HERO_IMAGE = '/colorado-front-range-hero.jpg';
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
  title: 'Colorado Real Estate Intelligence | David Quinn Group',
  description:
    'Search Colorado homes with David Quinn Group real estate intelligence for Boulder, Denver, and the Front Range, including market context, structural signals, and buyer strategy.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Colorado Real Estate Intelligence | David Quinn Group',
    description:
      'Interactive Colorado property search and market intelligence for Boulder, Denver, and the Front Range.',
    url: SITE_URL,
    siteName: 'David Quinn Group',
    locale: 'en_US',
    type: 'website',
  },
};

const sectionShell = 'px-5 py-20 sm:px-8 sm:py-24 lg:px-12';
const containerShell = 'mx-auto w-full max-w-[1180px]';
const eyebrowClass = 'text-[11px] font-black uppercase tracking-[0.28em] text-[#b7dbe2]';
const headingClass = 'mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-normal text-white sm:text-5xl lg:text-6xl';
const bodyClass = 'mt-6 max-w-2xl text-base leading-8 text-white/66 sm:text-lg';
const primaryButtonClass = 'home-btn home-btn-primary';
const secondaryButtonClass = 'home-btn home-btn-secondary';
const lightSecondaryButtonClass = 'home-btn home-btn-light';

const journeyCards = [
  {
    title: 'Buy',
    body: 'Search homes with clearer context for fit, tradeoffs, questions, and next steps.',
    href: '/buy',
    cta: 'Buyer Path',
  },
  {
    title: 'Sell',
    body: 'Prepare the property, pricing conversation, and market strategy before launch.',
    href: '/sell',
    cta: 'Seller Path',
  },
  {
    title: 'Explore Colorado',
    body: 'Compare communities, market context, and local patterns across the Front Range.',
    href: '#communities',
    cta: 'Explore Communities',
  },
];

const featuredCommunities = [
  { name: 'Boulder', href: '/market/boulder-co-housing-market', imagePosition: 'object-left', imageAlt: 'Boulder foothills and residential neighborhoods' },
  { name: 'Louisville', href: '/market/louisville-co-housing-market', imagePosition: 'object-center', imageAlt: 'Louisville Colorado neighborhood and open-space setting' },
  { name: 'Lafayette', href: '/market/lafayette-co-housing-market', imagePosition: 'object-right', imageAlt: 'Lafayette Colorado community streetscape and Front Range light' },
  { name: 'Superior', href: '/search?city=Superior', imagePosition: 'object-center', imageAlt: 'Superior Colorado residential community near the foothills' },
  { name: 'Erie', href: '/market/erie-co-housing-market', imagePosition: 'object-left', imageAlt: 'Erie Colorado homes and north Front Range landscape' },
  { name: 'Longmont', href: '/market/longmont-co-housing-market', imagePosition: 'object-right', imageAlt: 'Longmont Colorado neighborhood with mountain access' },
];

const reiePrinciples = [
  'Search should explain why a home deserves attention.',
  'Market context should reduce uncertainty, not create pressure.',
  'Advice should clarify the next question before asking for action.',
];

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
      question: 'What is David Quinn Group real estate intelligence?',
      answer:
        'David Quinn Group real estate intelligence is a Colorado property search and advisory experience for Boulder, Denver, and the Front Range. It combines inventory discovery, market context, neighborhood paths, construction awareness, and buyer or seller strategy.',
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
      question: 'Why does David Quinn Group include construction perspective in real estate search?',
      answer:
        'Construction perspective helps separate visible finish quality from durable value by adding questions about building envelope exposure, drainage, systems, maintenance risk, and negotiation leverage.',
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
      <div className="max-w-full overflow-x-hidden bg-[#070b10] text-white">
        <section className="relative min-h-[calc(100vh-112px)] overflow-hidden" data-testid="home-portal-hero">
          <Image
            src={HERO_IMAGE}
            alt="Colorado Front Range residential landscape at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,10,0.9)_0%,rgba(5,7,10,0.64)_46%,rgba(5,7,10,0.18)_100%)]" />

          <div className={`${containerShell} relative z-10 flex min-h-[calc(100vh-112px)] items-center px-5 pb-24 pt-20 sm:px-8 sm:pb-28 lg:px-12`}>
            <div className="max-w-3xl">
              <p className={eyebrowClass}>Colorado Real Estate Intelligence</p>
              <h1 className="mt-7 max-w-4xl text-3xl font-black leading-[1.08] tracking-normal text-white sm:text-6xl sm:leading-[0.96] lg:text-7xl">
                Find the right Colorado home with more context before you click.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-9 text-white/78 sm:text-xl">
                Search homes, compare communities, and understand the decision before the next step.
              </p>
              <div className="home-hero-actions mt-12">
                <Link href="#search" className={primaryButtonClass}>
                  Search Homes
                </Link>
                <Link href="#communities" className={secondaryButtonClass}>
                  Explore Communities
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={sectionShell} data-testid="home-portal-journey">
          <div className={containerShell}>
            <div className="max-w-3xl">
              <p className={eyebrowClass}>Choose Your Journey</p>
              <h2 className={headingClass}>Start with the decision in front of you.</h2>
            </div>
            <div className="mt-14 grid gap-7 md:grid-cols-3">
              {journeyCards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group bg-white/[0.055] p-8 shadow-[0_22px_70px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
                >
                  <h3 className="text-3xl font-black leading-tight text-white">{card.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-white/64">{card.body}</p>
                  <p className="mt-8 text-[11px] font-black uppercase tracking-[0.16em] text-cyan-100/80 group-hover:text-white">
                    {card.cta}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="search" className="px-4 py-20 sm:px-8 sm:py-24 lg:px-12" data-testid="home-portal-search-section">
          <div className={`${containerShell} home-discovery-container`}>
            <div className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl text-left">
                <p className={eyebrowClass}>Search Experience</p>
                <h2 className={headingClass}>Start with fit, context, and confidence.</h2>
                <p className={bodyClass}>
                  Explore Colorado homes through the map, listings, and decision context that shape a better shortlist.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link href="/search" className={primaryButtonClass}>
                  Continue to Guided Search
                </Link>
                <Link href="/grand-plan" className={secondaryButtonClass}>
                  Build Your Grand Plan™
                </Link>
              </div>
            </div>
            <div className="mb-6 grid gap-4 md:grid-cols-3" data-testid="home-discovery-principles">
              {[
                'Compare daily-life fit, not just price and photos.',
                'Add property and neighborhood context.',
                'Continue into guided search when you are ready to refine.',
              ].map((principle) => (
                <p key={principle} className="bg-white/[0.045] px-5 py-4 text-sm font-bold leading-6 text-white/66">
                  {principle}
                </p>
              ))}
            </div>
            <HomeSearchExperience authorityLinks={authorityLinks} faqItems={homeFaqs} variant="embedded" />
            <div className="mt-4 flex justify-end" data-testid="home-discovery-continuation">
              <Link href="/search" className={secondaryButtonClass}>
                Continue to Guided Search
              </Link>
            </div>
          </div>
        </section>

        <section id="communities" className={`${sectionShell} bg-[#e8e2d8] text-[#111820]`} data-testid="home-portal-communities">
          <div className={containerShell}>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#6f5b43]">Featured Colorado Communities</p>
                <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-normal sm:text-5xl lg:text-6xl">Start with place.</h2>
              </div>
              <Link href="/market" className={lightSecondaryButtonClass}>
                Explore Market Context
              </Link>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCommunities.map((community) => (
                <Link
                  key={community.name}
                  href={community.href}
                  className="home-card-link group overflow-hidden bg-white shadow-[0_24px_70px_rgba(40,35,28,0.12)] transition duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`relative h-64 overflow-hidden bg-cover bg-center transition duration-700 group-hover:scale-[1.02] ${community.imagePosition}`}
                    style={{ height: '16rem', backgroundImage: `url(${HERO_IMAGE})` }}
                    role="img"
                    aria-label={community.imageAlt}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <h3 className="absolute bottom-6 left-6 text-3xl font-black text-white">{community.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={sectionShell} data-testid="home-portal-why-reie">
          <div className={`${containerShell} grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start`}>
            <div>
              <p className={eyebrowClass}>Why REIE</p>
              <h2 className={headingClass}>More than listings.</h2>
              <Link href="/about" className={`${secondaryButtonClass} mt-9`}>
                Read the Full Approach
              </Link>
            </div>
            <div className="grid gap-5">
              {reiePrinciples.map((principle, index) => (
                <div key={principle} className="flex gap-5 bg-white/[0.045] p-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-cyan-100 text-xs font-black text-[#071017]">
                    {index + 1}
                  </span>
                  <p className="text-sm font-bold leading-7 text-white/70">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${sectionShell} bg-[#101820]`} data-testid="home-portal-grand-plan">
          <div className={`${containerShell} grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-center`}>
            <div>
              <p className={eyebrowClass}>Grand Plan</p>
              <h2 className={headingClass}>Connect the home search to the life around it.</h2>
              <p className={bodyClass}>
                A premium planning path for priorities, places, timing, and the conversation behind the move.
              </p>
            </div>
            <Link href="/grand-plan" className={primaryButtonClass}>
              Build Your Grand Plan™
            </Link>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12" data-testid="home-portal-david-quinn">
          <div className={`${containerShell} grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-center`}>
            <div
              className="relative min-h-[360px] overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${HERO_IMAGE})` }}
              role="img"
              aria-label="Colorado Front Range home and mountain setting"
            />
            <div>
              <p className={eyebrowClass}>David Quinn</p>
              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[1.04] tracking-normal text-white sm:text-5xl">
                Advisory work grounded in homes, markets, and real-world tradeoffs.
              </h2>
              <p className={bodyClass}>
                David Quinn Group helps Colorado buyers, sellers, and owners evaluate real estate with construction perspective,
                market context, and practical planning discipline.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/about" className={primaryButtonClass}>
                  About David Quinn
                </Link>
                <Link href="/contact" className={secondaryButtonClass}>
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/page.tsx
