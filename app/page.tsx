import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import ContinueYourDecision from '@/components/ContinueYourDecision';
import FAQSchema from '@/components/schema/FAQSchema';
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

const decisionEntries = [
  {
    title: 'Search',
    body: 'Start with active listings and use the full search workspace when you are ready to compare homes.',
    href: '/search',
    cta: 'Primary Path',
  },
  {
    title: 'Buy',
    body: 'Prepare criteria, financing questions, and property review before a showing becomes urgent.',
    href: '/buy',
    cta: 'Buyer Guidance',
  },
  {
    title: 'Sell',
    body: 'Understand preparation, buyer questions, and market context before pricing takes over.',
    href: '/sell',
    cta: 'Seller Guidance',
  },
];

const reiePrinciples = [
  {
    title: 'Context before clicks',
    body: 'Search is useful when it connects place, market context, property facts, financing assumptions, and the next question to verify.',
  },
  {
    title: 'Evidence with limits',
    body: 'REIE separates useful guidance from unsupported certainty, rankings, forecasts, and automated conclusions.',
  },
  {
    title: 'Professional judgment',
    body: 'Construction perspective, local market awareness, and preparation discipline help shape a better conversation.',
  },
];

const searchPreviewSteps = [
  'Start broad with the place, property, or criteria already on your mind.',
  'Use the full search experience when you are ready for map, list, and deeper comparison.',
  'Treat results as a decision starting point, then verify property details before relying on them.',
];

const homeToolSchema = buildToolSchema({
  name: 'Colorado Real Estate Intelligence Engine',
  description:
    'David Quinn Group interactive property search and real estate intelligence platform for Boulder, Denver, and the Colorado Front Range.',
  url: SITE_URL,
  keywords: homeToolSchemaKeywords,
  audience: 'Colorado home buyers, sellers, homeowners, and relocation clients',
});

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
        'REIE helps buyers compare inventory, understand neighborhood context, identify property-level signals, and decide where to move quickly, negotiate, or investigate property questions more deeply.',
    },
    {
      question: 'How does REIE help Colorado home sellers?',
      answer:
        'REIE helps sellers understand competing inventory, likely buyer objections, preparation priorities, and how to position a home around condition, location, evidence, and market alternatives.',
    },
    {
      question: 'Why does David Quinn Group include construction perspective in real estate search?',
      answer:
        'Construction perspective helps separate visible finish quality from durable value by adding questions about building envelope exposure, drainage, systems, maintenance risk, and negotiation leverage.',
    },
  ];
}

export default function HomePage() {
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
      <div
        className="home-phase-one max-w-full overflow-x-hidden bg-[#070b10] text-white"
        data-homepage-phase-one="structural-simplification"
        data-homepage-primary-cta="/search"
        data-homepage-community-grid="removed"
        data-homepage-mortgage-calculator="false"
      >
        <section className="home-phase-c-hero relative min-h-[calc(100vh-112px)] overflow-hidden" data-testid="home-portal-hero">
          <Image
            src={HERO_IMAGE}
            alt="Colorado Front Range residential landscape at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,10,0.9)_0%,rgba(5,7,10,0.58)_44%,rgba(5,7,10,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_48%,rgba(255,255,255,0.14),transparent_24%),radial-gradient(circle_at_76%_24%,rgba(183,219,226,0.12),transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070b10] to-transparent" />

          <div className={`${containerShell} home-hero-frame relative z-10 flex min-h-[calc(100vh-112px)] items-center px-5 pb-24 pt-24 sm:px-8 sm:pb-32 lg:px-12`}>
            <div className="home-hero-copy max-w-5xl">
              <p className={eyebrowClass}>Colorado Real Estate Intelligence</p>
              <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[0.96] tracking-normal text-white sm:text-7xl lg:text-8xl">
                Find the right Colorado home with more context before you click.
              </h1>
              <p className="mt-9 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                Search homes, compare communities, and understand the decision before the next step.
              </p>
              <div className="home-hero-search-focus mt-12">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/48">Begin with search</p>
                <div className="home-hero-actions mt-5">
                  <Link href="/search" className={primaryButtonClass}>
                    Start Your Search
                  </Link>
                  <Link href="#why-reie" className={secondaryButtonClass}>
                    Why REIE
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={sectionShell} data-testid="home-portal-journey">
          <div className={containerShell}>
            <div className="max-w-4xl">
              <p className={eyebrowClass}>Choose Your Journey</p>
              <h2 className={headingClass}>Three paths. One clearer decision.</h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/58">
                Choose the path that matches the decision you are preparing for now. Each route keeps the focus on context, verification, and next-step clarity.
              </p>
            </div>
            <div className="home-decision-grid mt-14">
              {decisionEntries.map((entry) => (
                <Link
                  key={entry.title}
                  href={entry.href}
                  className="home-card-link home-decision-entry group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/64">{entry.cta}</span>
                  <h3 className="mt-7 text-3xl font-black leading-none text-white sm:text-4xl">{entry.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-white/58">{entry.body}</p>
                  <p className="mt-9 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/74 group-hover:text-white">
                    Continue
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="home-djx-strip px-5 pb-4 pt-0 sm:px-8 lg:px-12" data-testid="home-djx-continuity">
          <div className={containerShell}>
            <ContinueYourDecision
              stage="home"
              cameFrom="Broad orientation"
              currentDecision="Choose the right starting path."
              whyHere="The homepage connects search, market context, neighborhood orientation, and property review before you narrow the decision."
              nextStep="Open guided search or compare market context."
              density="compact"
              links={[
                { label: 'Search', href: '/search', note: 'Compare active homes' },
                { label: 'Market Context', href: '/market', note: 'Review city context' },
                { label: 'Grand Plan', href: '/grand-plan', note: 'Organize priorities' },
              ]}
            />
          </div>
        </section>

        <section id="why-reie" className={`${sectionShell} home-why-section`} data-testid="home-portal-why-reie">
          <div className={`${containerShell} grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start`}>
            <div>
              <p className={eyebrowClass}>Why REIE</p>
              <h2 className={headingClass}>A calmer way to prepare the decision.</h2>
              <p className="mt-7 max-w-xl text-base leading-8 text-white/58">
                REIE is organized around decision quality: what you are trying to understand, what evidence is useful, what remains uncertain, and where to go next.
              </p>
            </div>
            <div className="home-principle-list" data-testid="home-reie-differentiation">
              {reiePrinciples.map((principle) => (
                <article key={principle.title} className="home-principle-item">
                  <h3 className="text-xl font-black leading-tight text-white">{principle.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/56">{principle.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="search" className="home-search-section bg-[#f5f1e8] px-5 py-28 text-[#111820] sm:px-8 sm:py-36 lg:px-12 lg:py-44" data-testid="home-portal-search-section">
          <div className={`${containerShell} home-discovery-container`}>
            <div className="mb-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div className="max-w-3xl text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#7a694f]">This Is Where You Begin</p>
                <h2 className="mt-6 max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-[#111820] sm:text-6xl lg:text-7xl">
                  Start with criteria, context, and confidence.
                </h2>
                <p className="mt-7 max-w-xl text-base leading-8 text-[#41505a]">
                  The full search product is where map, list, and property comparison belong. Home gives you a calmer place to begin.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link href="/search" className={darkButtonClass} data-testid="home-discovery-continuation">
                  Continue to Guided Search
                </Link>
              </div>
            </div>
            <div className="home-search-preview home-search-preview-simplified" data-testid="reie-home-discovery-intro">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#7a694f]">Colorado Discovery Preview</p>
                <h3 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-normal text-[#111820] sm:text-4xl">
                  Begin with a place, property, or question. Continue when you need the full search workspace.
                </h3>
                <div className="home-search-principles mt-10" data-testid="home-discovery-principles">
                  {searchPreviewSteps.map((principle) => (
                    <p key={principle} className="text-sm font-black uppercase leading-6 tracking-[0.08em] text-[#26333b]/68">
                      {principle}
                    </p>
                  ))}
                </div>
              </div>
              <div className="home-search-note" data-testid="home-search-limitation-note">
                <p className="text-sm leading-7 text-[#41505a]">
                  Search results support orientation and comparison. Verify property details, disclosures, condition, and advisor context before relying on any result.
                </p>
              </div>
              <form action="/search" method="get" hidden aria-hidden="true" data-testid="home-search-handoff-contract">
                <input type="hidden" name="city" value="" />
                <input type="hidden" name="q" value="" />
              </form>
            </div>
          </div>
        </section>

        <section id="communities" className="home-market-teaser bg-[#070b10] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40" data-testid="home-portal-communities">
          <div className={containerShell}>
            <div className="home-community-heading home-community-heading-simplified">
              <div className="max-w-2xl">
                <p className={eyebrowClass}>Place and Market Context</p>
                <h2 className={headingClass}>Understand the place before the property.</h2>
                <p className="mt-7 max-w-xl text-base leading-8 text-white/58">
                  Explore Colorado market and community pages when place context matters, without turning the homepage into a directory.
                </p>
              </div>
              <Link href="/market" className={`${secondaryButtonClass} home-community-action`}>
                Explore Market Context
              </Link>
            </div>
          </div>
        </section>

        <section className="home-grand-plan-section bg-[#e8e2d8] px-5 py-28 text-[#111820] sm:px-8 sm:py-36 lg:px-12 lg:py-44" data-testid="home-portal-grand-plan">
          <div className={`${containerShell} grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center`}>
            <div
              className="home-grand-plan-image min-h-[320px] bg-cover bg-center shadow-[0_40px_100px_rgba(61,51,40,0.16)] lg:min-h-[460px]"
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
                When search and place context are not enough, Grand Plan helps organize priorities, timing, and the life you are building around the decision.
              </p>
              <Link href="/grand-plan" className={`${darkButtonClass} mt-10`}>
                Build Your Grand Plan™
              </Link>
            </div>
          </div>
        </section>

        <section className="home-david-section px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-40" data-testid="home-portal-david-quinn">
          <div className={`${containerShell} home-trust-close`}>
            <div>
              <p className={eyebrowClass}>David Quinn</p>
              <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-5xl lg:text-6xl">
                Practical Colorado advisory for serious decisions.
              </h2>
              <p className="mt-7 max-w-xl text-base leading-8 text-white/58">
                Construction perspective, market context, and planning discipline for Colorado buyers, sellers, and owners.
              </p>
            </div>
            <div className="home-trust-actions">
              <p className="text-sm leading-7 text-white/58">
                Continue when you want to understand the advisory approach or talk through a specific Colorado decision.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
