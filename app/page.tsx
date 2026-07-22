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
  { label: 'Sell', href: '/sell' },
  { label: 'Grand Plan™', href: '#buy-sell-grand-plan' },
  { label: 'About', href: '#why-david-quinn' },
  { label: 'Contact', href: '/contact' },
];

const sectionShell = 'px-7 py-28 sm:px-10 sm:py-36 lg:px-12';
const containerShell = 'mx-auto w-full max-w-[1180px]';
const eyebrowClass = 'text-[11px] font-black uppercase tracking-[0.28em] text-[#b7dbe2]';
const headingClass = 'mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-normal text-white sm:text-5xl lg:text-6xl';
const bodyClass = 'mt-6 max-w-2xl text-base leading-8 text-white/66 sm:text-lg';
const primaryButtonClass =
  'home-btn home-btn-primary';
const secondaryButtonClass =
  'home-btn home-btn-secondary';
const darkButtonClass =
  'home-btn home-btn-dark';
const lightSecondaryButtonClass =
  'home-btn home-btn-light';

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
    imagePosition: 'object-left',
  },
  {
    title: 'Sell with strategy',
    body: 'Position condition, timing, preparation, and market narrative around the objections serious buyers will notice.',
    href: '/sell',
    cta: 'Request Seller Review',
    imagePosition: 'object-center',
  },
  {
    title: 'Build Your Grand Plan™',
    body: 'Connect the property decision to renovation scope, lifestyle goals, timing, capital planning, and risk tolerance.',
    href: '/contact',
    cta: 'Build Your Grand Plan™',
    imagePosition: 'object-right',
  },
];

const featuredCommunities = [
  { name: 'Boulder', href: '/market/boulder-co-housing-market', note: 'Foothills, university, tech, trails, and established neighborhoods.', imagePosition: 'object-left' },
  { name: 'Louisville', href: '/market/louisville-co-housing-market', note: 'Small-town core, commuter access, parks, and west-metro resilience.', imagePosition: 'object-center' },
  { name: 'Lafayette', href: '/market/lafayette-co-housing-market', note: 'Creative downtown energy, family neighborhoods, and open-space access.', imagePosition: 'object-right' },
  { name: 'Superior', href: '/search?city=Superior', note: 'Modern inventory, Boulder-Denver access, and rebuilding-era context.', imagePosition: 'object-center' },
  { name: 'Erie', href: '/market/erie-co-housing-market', note: 'Newer communities, larger lots, and north-metro growth patterns.', imagePosition: 'object-left' },
  { name: 'Longmont', href: '/market/longmont-co-housing-market', note: 'Historic housing, maker economy, and access to Boulder County value.', imagePosition: 'object-right' },
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
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071017]/74 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl" data-testid="home-portal-premium-header">
          <nav className={`${containerShell} flex items-center justify-between gap-8 px-7 py-5 sm:px-10 lg:px-12`} aria-label="Home portal navigation">
            <Link href="/" className="home-brand group flex min-w-0 items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-white/16 bg-white/[0.08] text-sm font-black tracking-normal transition group-hover:border-cyan-100/40 group-hover:bg-white/[0.12]">
                DQ
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black uppercase tracking-[0.16em]">David Quinn Group</span>
                <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.22em] text-white/44 sm:block">
                  Colorado Advisory
                </span>
              </span>
            </Link>
            <div className="home-nav-items">
              {navigationLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="home-nav-link text-[11px] font-black uppercase tracking-[0.15em]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link href="/contact" className={secondaryButtonClass}>
              Contact
            </Link>
          </nav>
        </header>

        <section className="relative min-h-[calc(100vh-74px)] overflow-hidden" data-testid="home-portal-hero">
          <Image
            src={HERO_IMAGE}
            alt="Colorado Front Range residential landscape at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,10,0.9)_0%,rgba(5,7,10,0.66)_42%,rgba(5,7,10,0.22)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(183,219,226,0.16),transparent_32%)]" />

          <div className={`${containerShell} relative z-10 flex min-h-[calc(100vh-74px)] items-center px-7 pb-28 pt-24 sm:px-10 lg:px-12`}>
            <div className="max-w-3xl">
              <p className={eyebrowClass}>
                Colorado Front Range Advisory
              </p>
              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.96] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Real Estate Intelligence for the Colorado Front Range
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-9 text-white/78 sm:text-xl">
                Helping buyers and sellers make smarter real estate decisions through construction expertise,
                strategic planning, and local market intelligence.
              </p>
              <div className="home-hero-actions mt-12">
                <Link href="#search" className={primaryButtonClass}>
                  Start Your Search
                </Link>
                <Link href="/contact" className={secondaryButtonClass}>
                  Build Your Grand Plan™
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={`${sectionShell} border-y border-white/10 bg-[#0b1117]`} data-testid="home-portal-why-reie">
          <div className={containerShell}>
            <div className="max-w-3xl">
              <p className={eyebrowClass}>Why REIE</p>
              <h2 className={headingClass}>
                A clearer way to evaluate Colorado real estate.
              </h2>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {reiePillars.map((pillar) => (
                <article key={pillar.title} className="rounded-[14px] bg-white/[0.055] p-9 shadow-[0_22px_70px_rgba(0,0,0,0.16)] ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.075]">
                  <h3 className="text-2xl font-black leading-tight text-white">{pillar.title}</h3>
                  <p className="mt-6 text-sm leading-7 text-white/64">{pillar.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="buy-sell-grand-plan" className={sectionShell} data-testid="home-portal-advisory-paths">
          <div className={containerShell}>
            <div className="grid gap-8 lg:grid-cols-3">
              {advisoryPaths.map((path) => (
                <article key={path.title} className="group overflow-hidden rounded-[16px] bg-[#101820] shadow-[0_28px_80px_rgba(0,0,0,0.24)] ring-1 ring-white/10">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={HERO_IMAGE}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className={`object-cover transition duration-700 group-hover:scale-105 ${path.imagePosition}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-black/10 to-transparent" />
                  </div>
                  <div className="p-9">
                    <h3 className="text-3xl font-black leading-tight text-white">{path.title}</h3>
                    <p className="mt-5 min-h-28 text-sm leading-7 text-white/64">{path.body}</p>
                    <Link href={path.href} className={`${secondaryButtonClass} mt-9`}>
                      {path.cta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="communities" className={`${sectionShell} bg-[#e8e2d8] text-[#111820]`} data-testid="home-portal-communities">
          <div className={containerShell}>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#6f5b43]">Featured Colorado Communities</p>
                <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-normal sm:text-5xl lg:text-6xl">Start with the places that shape the decision.</h2>
              </div>
              <Link href="/search" className={lightSecondaryButtonClass}>
                View Colorado Inventory
              </Link>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCommunities.map((community) => (
                <Link
                  key={community.name}
                  href={community.href}
                  className="home-card-link group overflow-hidden rounded-[16px] bg-white shadow-[0_24px_70px_rgba(40,35,28,0.12)] transition duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={HERO_IMAGE}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className={`object-cover transition duration-700 group-hover:scale-105 ${community.imagePosition}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  </div>
                  <div className="p-7">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#7b674d]">Community</p>
                    <h3 className="mt-4 text-3xl font-black">{community.name}</h3>
                    <p className="mt-4 min-h-20 text-sm leading-7 text-[#293542]/76">{community.note}</p>
                    <p className="mt-8 text-[11px] font-black uppercase tracking-[0.14em] text-[#111820]">Explore</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="search" className="px-4 py-28 sm:px-8 sm:py-36 lg:px-12" data-testid="home-portal-search-section">
          <div className={containerShell}>
            <div className="mb-12 max-w-3xl">
              <p className={eyebrowClass}>Search</p>
              <h2 className={headingClass}>Search when the strategy is clear.</h2>
              <p className={bodyClass}>
                Explore Colorado inventory with the existing REIE map, filters, listing cards, saved-search path, and property routes preserved.
              </p>
            </div>
            <HomeSearchExperience authorityLinks={authorityLinks} faqItems={homeFaqs} variant="embedded" />
          </div>
        </section>

        <section id="why-david-quinn" className={`${sectionShell} border-y border-white/10 bg-[#101820]`} data-testid="home-portal-why-david-quinn">
          <div className={`${containerShell} grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center`}>
            <div>
              <p className={eyebrowClass}>Why David Quinn</p>
              <h2 className={headingClass}>
                Advisory work grounded in homes, markets, and real-world tradeoffs.
              </h2>
            </div>
            <div className="rounded-[16px] bg-white/[0.055] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.18)] ring-1 ring-white/10 sm:p-10">
              <p className="text-base leading-8 text-white/70">
                David Quinn Group helps Colorado buyers, sellers, and owners evaluate real estate with market context,
                construction awareness, and practical planning discipline. The work is advisory first: understand the
                property, understand the risk, then decide what to do next.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {davidQuinnSignals.map((signal) => (
                  <div key={signal} className="rounded-[12px] bg-[#071017]/72 p-5 text-sm font-bold leading-6 text-white/76 ring-1 ring-white/10">
                    {signal}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={sectionShell} data-testid="home-portal-testimonials">
          <div className={containerShell}>
            <div className="max-w-3xl">
              <p className={eyebrowClass}>Client Perspective</p>
              <h2 className={headingClass}>Testimonials pending approved source.</h2>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {testimonialSignals.map((signal) => (
                <article
                  key={signal}
                  className="rounded-[14px] bg-white/[0.045] p-8 shadow-[0_22px_70px_rgba(0,0,0,0.14)] ring-1 ring-white/10"
                  data-testimonial-source="OWNER_APPROVED_REVIEW_SOURCE_REQUIRED"
                >
                  <p className="text-sm leading-7 text-white/64">{signal}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-7 pb-32 pt-4 sm:px-10 sm:pb-40 lg:px-12" data-testid="home-portal-final-cta">
          <div className={`${containerShell} rounded-[18px] bg-white px-8 py-16 text-[#071017] shadow-[0_30px_90px_rgba(0,0,0,0.22)] sm:px-12 lg:px-16`}>
            <h2 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-normal sm:text-5xl">Begin with the decision you need to make.</h2>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link href="#search" className={darkButtonClass}>
                Start Your Search
              </Link>
              <Link href="/contact" className={lightSecondaryButtonClass}>
                Build Your Grand Plan™
              </Link>
              <Link href="/contact" className={lightSecondaryButtonClass}>
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
