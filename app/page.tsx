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

const navigationLinks = [
  { label: 'Search', href: '#search' },
  { label: 'Communities', href: '#communities' },
  { label: 'Sell', href: '#buy-sell-grand-plan' },
  { label: 'Grand Plan™', href: '#buy-sell-grand-plan' },
  { label: 'About', href: '#why-david-quinn' },
  { label: 'Contact', href: '/contact' },
];

const reiePillars = [
  {
    title: 'Better decisions',
    body: 'Compare homes through condition, timing, location, and negotiating leverage before narrowing the field.',
  },
  {
    title: 'Local expertise',
    body: 'Read the Front Range through neighborhood patterns, lifestyle constraints, inventory pressure, and route-to-market context.',
  },
  {
    title: 'Construction knowledge',
    body: 'Look beyond finishes with attention to drainage, envelope exposure, systems, maintenance, and long-term ownership risk.',
  },
];

const advisoryPaths = [
  {
    title: 'Buy with intelligence',
    body: 'Search the market with a clearer view of fit, tradeoffs, due diligence priorities, and offer strategy.',
    href: '#search',
    cta: 'Start Your Search',
  },
  {
    title: 'Sell with strategy',
    body: 'Position condition, timing, preparation, and market narrative around the objections serious buyers will notice.',
    href: '/contact',
    cta: 'Plan a Sale',
  },
  {
    title: 'Build Your Grand Plan™',
    body: 'Connect the property decision to renovation scope, lifestyle goals, timing, capital planning, and risk tolerance.',
    href: '/contact',
    cta: 'Build Your Grand Plan™',
  },
];

const featuredCommunities = [
  { name: 'Boulder', href: '/market/boulder-co-housing-market', note: 'Foothills, university, tech, trails, and established neighborhoods.' },
  { name: 'Louisville', href: '/market/louisville-co-housing-market', note: 'Small-town core, commuter access, parks, and west-metro resilience.' },
  { name: 'Lafayette', href: '/market/lafayette-co-housing-market', note: 'Creative downtown energy, family neighborhoods, and open-space access.' },
  { name: 'Superior', href: '/search?city=Superior', note: 'Modern inventory, Boulder-Denver access, and rebuilding-era context.' },
  { name: 'Erie', href: '/market/erie-co-housing-market', note: 'Newer communities, larger lots, and north-metro growth patterns.' },
  { name: 'Longmont', href: '/market/longmont-co-housing-market', note: 'Historic housing, maker economy, and access to Boulder County value.' },
];

const davidQuinnSignals = [
  'Construction-informed property review',
  'Colorado Front Range market orientation',
  'Advisory planning for buyers, sellers, and owners',
];

const testimonialSignals = [
  'Review integration remains pending owner-approved source selection.',
  'Public testimonials will only publish after approval, attribution, and replacement of this draft fixture.',
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
      <div className="bg-[#070b10] text-white">
        <section className="relative min-h-[calc(100vh-44px)] overflow-hidden" data-testid="home-portal-hero">
          <Image
            src={HERO_IMAGE}
            alt="Colorado Front Range residential landscape at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,10,0.88)_0%,rgba(5,7,10,0.62)_42%,rgba(5,7,10,0.24)_100%)]" />
          <div className="absolute inset-x-0 top-0 z-10 border-b border-white/10 bg-[#05070a]/46 backdrop-blur-md">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 sm:px-8" aria-label="Home portal navigation">
              <Link href="/" className="text-sm font-black uppercase tracking-[0.22em] text-white">
                David Quinn Group
              </Link>
              <div className="hidden items-center gap-5 md:flex">
                {navigationLinks.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    className="text-[11px] font-black uppercase tracking-[0.16em] text-white/68 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/contact"
                className="rounded-[6px] border border-white/16 px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-44px)] max-w-7xl items-center px-6 pb-24 pt-32 sm:px-8">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100/82">
                Colorado Front Range Advisory
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Real Estate Intelligence for the Colorado Front Range
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
                Helping buyers and sellers make smarter real estate decisions through construction expertise,
                strategic planning, and local market intelligence.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#search"
                  className="rounded-[6px] bg-white px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-[#071017] transition hover:bg-cyan-100"
                >
                  Start Your Search
                </Link>
                <Link
                  href="/contact"
                  className="rounded-[6px] border border-white/24 px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-white transition hover:border-white/50 hover:bg-white/10"
                >
                  Build Your Grand Plan™
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0b1117] px-6 py-24 sm:px-8" data-testid="home-portal-why-reie">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Why REIE</p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
                A clearer way to evaluate Colorado real estate.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {reiePillars.map((pillar) => (
                <article key={pillar.title} className="rounded-[8px] border border-white/10 bg-white/[0.045] p-8">
                  <h3 className="text-xl font-black text-white">{pillar.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-white/64">{pillar.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="buy-sell-grand-plan" className="px-6 py-24 sm:px-8" data-testid="home-portal-advisory-paths">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-3">
              {advisoryPaths.map((path, index) => (
                <article key={path.title} className="overflow-hidden rounded-[8px] border border-white/10 bg-[#101820]">
                  <div className="relative h-56">
                    <Image
                      src={HERO_IMAGE}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className={`object-cover ${index === 0 ? 'object-left' : index === 1 ? 'object-center' : 'object-right'}`}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-white">{path.title}</h3>
                    <p className="mt-4 min-h-24 text-sm leading-7 text-white/64">{path.body}</p>
                    <Link
                      href={path.href}
                      className="mt-8 inline-flex rounded-[6px] border border-cyan-100/24 px-4 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-100/60 hover:bg-cyan-100/10"
                    >
                      {path.cta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="communities" className="bg-[#e8e2d8] px-6 py-24 text-[#111820] sm:px-8" data-testid="home-portal-communities">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5c4a35]">Featured Colorado Communities</p>
                <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Start with the places that shape the decision.</h2>
              </div>
              <Link href="/search" className="text-xs font-black uppercase tracking-[0.16em] text-[#5c4a35]">
                View Colorado Inventory
              </Link>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCommunities.map((community) => (
                <Link
                  key={community.name}
                  href={community.href}
                  className="group rounded-[8px] border border-[#111820]/12 bg-white/62 p-7 transition hover:-translate-y-1 hover:bg-white"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7b674d]">Community</p>
                  <h3 className="mt-4 text-3xl font-black">{community.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#293542]/76">{community.note}</p>
                  <p className="mt-8 text-[11px] font-black uppercase tracking-[0.14em] text-[#111820]">Explore Market</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="search" className="px-4 py-24 sm:px-8" data-testid="home-portal-search-section">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Search</p>
              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Search when the strategy is clear.</h2>
              <p className="mt-5 text-base leading-8 text-white/64">
                Explore Colorado inventory with the existing REIE map, filters, listing cards, saved-search path, and property routes preserved.
              </p>
            </div>
            <HomeSearchExperience authorityLinks={authorityLinks} faqItems={homeFaqs} variant="embedded" />
          </div>
        </section>

        <section id="why-david-quinn" className="border-y border-white/10 bg-[#101820] px-6 py-24 sm:px-8" data-testid="home-portal-why-david-quinn">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Why David Quinn</p>
              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                Advisory work grounded in homes, markets, and real-world tradeoffs.
              </h2>
            </div>
            <div className="space-y-5">
              <p className="text-base leading-8 text-white/68">
                David Quinn Group helps Colorado buyers, sellers, and owners evaluate real estate with market context,
                construction awareness, and practical planning discipline. The work is advisory first: understand the
                property, understand the risk, then decide what to do next.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {davidQuinnSignals.map((signal) => (
                  <div key={signal} className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5 text-sm font-bold leading-6 text-white/76">
                    {signal}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8" data-testid="home-portal-testimonials">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Client Perspective</p>
              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Testimonials pending approved source.</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {testimonialSignals.map((signal) => (
                <article
                  key={signal}
                  className="rounded-[8px] border border-dashed border-white/18 bg-white/[0.035] p-7"
                  data-testimonial-source="OWNER_APPROVED_REVIEW_SOURCE_REQUIRED"
                >
                  <p className="text-sm leading-7 text-white/64">{signal}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-28 sm:px-8" data-testid="home-portal-final-cta">
          <div className="mx-auto max-w-7xl rounded-[8px] border border-white/10 bg-white px-8 py-14 text-[#071017] sm:px-12">
            <h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">Begin with the decision you need to make.</h2>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="#search" className="rounded-[6px] bg-[#071017] px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-white">
                Start Your Search
              </Link>
              <Link href="/contact" className="rounded-[6px] border border-[#071017]/16 px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-[#071017]">
                Build Your Grand Plan™
              </Link>
              <Link href="/contact" className="rounded-[6px] border border-[#071017]/16 px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-[#071017]">
                Contact David Quinn
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/page.tsx
