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

const sectionShell = 'px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44';
const containerShell = 'mx-auto w-full max-w-[1220px]';
const eyebrowClass = 'text-[10px] font-black uppercase tracking-[0.34em] text-[#b7dbe2]/78';
const headingClass = 'mt-6 max-w-5xl text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl';
const primaryButtonClass = 'home-btn home-btn-primary';
const secondaryButtonClass = 'home-btn home-btn-secondary';
const darkButtonClass = 'home-btn home-btn-dark';
const lightButtonClass = 'home-btn home-btn-light';

const journeyCards = [
  {
    title: 'Buy',
    body: 'Begin with fit, context, and the homes worth a closer look.',
    href: '/buy',
    cta: 'Buyer Path',
    imagePosition: '40% center',
  },
  {
    title: 'Sell',
    body: 'Prepare the market story before the pricing conversation.',
    href: '/sell',
    cta: 'Seller Path',
    imagePosition: '58% center',
  },
  {
    title: 'Explore Colorado',
    body: 'See place, lifestyle, and local context with more intention.',
    href: '#communities',
    cta: 'Explore Communities',
    imagePosition: '72% center',
  },
];

const featuredCommunities = [
  { name: 'Boulder', href: '/market/boulder-co-housing-market', imagePosition: '30% center', imageAlt: 'Boulder foothills and residential neighborhoods' },
  { name: 'Louisville', href: '/market/louisville-co-housing-market', imagePosition: '52% center', imageAlt: 'Louisville Colorado neighborhood and open-space setting' },
  { name: 'Lafayette', href: '/market/lafayette-co-housing-market', imagePosition: '72% center', imageAlt: 'Lafayette Colorado community streetscape and Front Range light' },
  { name: 'Superior', href: '/search?city=Superior', imagePosition: '58% center', imageAlt: 'Superior Colorado residential community near the foothills' },
  { name: 'Erie', href: '/market/erie-co-housing-market', imagePosition: '36% center', imageAlt: 'Erie Colorado homes and north Front Range landscape' },
  { name: 'Longmont', href: '/market/longmont-co-housing-market', imagePosition: '68% center', imageAlt: 'Longmont Colorado neighborhood with mountain access' },
];

const reiePrinciples = [
  {
    title: 'Better Decisions',
    body: 'Search, compare, and evaluate with the next question in view.',
  },
  {
    title: 'Colorado Expertise',
    body: 'Local context shapes the way every property should be read.',
  },
  {
    title: 'Trusted Guidance',
    body: 'Education comes before pressure, urgency, or conversion.',
  },
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
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,10,0.9)_0%,rgba(5,7,10,0.58)_44%,rgba(5,7,10,0.12)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070b10] to-transparent" />

          <div className={`${containerShell} relative z-10 flex min-h-[calc(100vh-112px)] items-center px-5 pb-28 pt-24 sm:px-8 sm:pb-36 lg:px-12`}>
            <div className="max-w-5xl">
              <p className={eyebrowClass}>Colorado Real Estate Intelligence</p>
              <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[0.96] tracking-normal text-white sm:text-7xl lg:text-8xl">
                Find the right Colorado home with more context before you click.
              </h1>
              <p className="mt-9 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                Search homes, compare communities, and understand the decision before the next step.
              </p>
              <div className="home-hero-actions mt-14">
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
            <div className="max-w-4xl">
              <p className={eyebrowClass}>Choose Your Journey</p>
              <h2 className={headingClass}>Three paths. One clearer decision.</h2>
            </div>
            <div className="home-journey-grid mt-20">
              {journeyCards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="home-card-link home-journey-card group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
                >
                  <div
                    className="home-journey-card-image"
                    style={{ backgroundImage: `url(${HERO_IMAGE})`, backgroundPosition: card.imagePosition }}
                    role="img"
                    aria-label={`${card.title} journey in Colorado real estate`}
                  />
                  <div className="flex flex-1 flex-col px-8 pb-10 pt-8 sm:px-10">
                    <h3 className="text-4xl font-black leading-none text-white">{card.title}</h3>
                    <p className="mt-6 text-sm leading-7 text-white/58">{card.body}</p>
                    <p className="mt-10 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/78 group-hover:text-white">
                      {card.cta}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="search" className="bg-[#f5f1e8] px-4 py-28 text-[#111820] sm:px-8 sm:py-36 lg:px-12 lg:py-44" data-testid="home-portal-search-section">
          <div className={`${containerShell} home-discovery-container`}>
            <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#7a694f]">This Is Where You Begin</p>
                <h2 className="mt-6 max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-[#111820] sm:text-6xl lg:text-7xl">
                  Start with fit, context, and confidence.
                </h2>
                <p className="mt-7 max-w-xl text-base leading-8 text-[#41505a]">
                  Explore Colorado homes through the map, listings, and decision context that shape a better shortlist.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link href="/search" className={darkButtonClass}>
                  Continue to Guided Search
                </Link>
                <Link href="/grand-plan" className={lightButtonClass}>
                  Build Your Grand Plan™
                </Link>
              </div>
            </div>
            <div className="mb-10 grid gap-8 border-y border-[#111820]/10 py-8 md:grid-cols-3" data-testid="home-discovery-principles">
              {[
                'Daily-life fit before endless scrolling.',
                'Map, list, and context in one place.',
                'A clear path into deeper search.',
              ].map((principle) => (
                <p key={principle} className="text-sm font-black uppercase leading-6 tracking-[0.08em] text-[#26333b]/72">
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

        <section id="communities" className="bg-[#070b10] px-5 py-28 text-white sm:px-8 sm:py-36 lg:px-12 lg:py-44" data-testid="home-portal-communities">
          <div className={containerShell}>
            <div className="home-community-heading">
              <div className="max-w-2xl">
                <p className={eyebrowClass}>Featured Colorado Communities</p>
                <h2 className={headingClass}>Start with place.</h2>
              </div>
              <Link href="/market" className={`${secondaryButtonClass} home-community-action`}>
                Explore Market Context
              </Link>
            </div>
            <div className="home-community-grid mt-20">
              {featuredCommunities.map((community) => (
                <Link
                  key={community.name}
                  href={community.href}
                  className={`home-card-link home-community-card group ${community.name === 'Boulder' ? 'home-community-card-featured' : ''}`}
                >
                  <div
                    className="home-community-image"
                    style={{ backgroundImage: `url(${HERO_IMAGE})`, backgroundPosition: community.imagePosition }}
                    role="img"
                    aria-label={community.imageAlt}
                  />
                  <div className="home-community-overlay" />
                  <h3 className="home-community-title">{community.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={sectionShell} data-testid="home-portal-why-reie">
          <div className={`${containerShell} grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start`}>
            <div>
              <p className={eyebrowClass}>Why REIE</p>
              <h2 className={headingClass}>Knowledge before action.</h2>
              <Link href="/about" className={`${secondaryButtonClass} mt-9`}>
                Read the Full Approach
              </Link>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {reiePrinciples.map((principle) => (
                <article key={principle.title}>
                  <h3 className="text-xl font-black leading-tight text-white">{principle.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-white/54">{principle.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#e8e2d8] px-5 py-28 text-[#111820] sm:px-8 sm:py-36 lg:px-12 lg:py-44" data-testid="home-portal-grand-plan">
          <div className={`${containerShell} grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center`}>
            <div
              className="min-h-[360px] bg-cover bg-center shadow-[0_40px_100px_rgba(61,51,40,0.16)] lg:min-h-[560px]"
              style={{ backgroundImage: `url(${HERO_IMAGE})` }}
              role="img"
              aria-label="Colorado home and mountain setting for Grand Plan"
            />
            <div className="lg:pl-12">
              <p className={eyebrowClass}>Grand Plan</p>
              <h2 className="mt-6 max-w-4xl text-5xl font-black leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
                The move is bigger than the house.
              </h2>
              <p className="mt-7 max-w-xl text-base leading-8 text-[#41505a]">
                Align place, timing, priorities, and the life you are building around the decision.
              </p>
              <Link href="/grand-plan" className={`${darkButtonClass} mt-10`}>
                Build Your Grand Plan™
              </Link>
            </div>
          </div>
        </section>

        <section className="px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-40" data-testid="home-portal-david-quinn">
          <div className={`${containerShell} grid gap-12 lg:grid-cols-[0.72fr_1fr] lg:items-center`}>
            <div
              className="relative min-h-[420px] overflow-hidden bg-cover bg-center shadow-[0_34px_100px_rgba(0,0,0,0.24)]"
              style={{ backgroundImage: `url(${HERO_IMAGE})` }}
              role="img"
              aria-label="Colorado Front Range home and mountain setting"
            />
            <div>
              <p className={eyebrowClass}>David Quinn</p>
              <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-5xl lg:text-6xl">
                Practical Colorado advisory for serious decisions.
              </h2>
              <p className="mt-7 max-w-xl text-base leading-8 text-white/58">
                Construction perspective, market context, and planning discipline for Colorado buyers, sellers, and owners.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
