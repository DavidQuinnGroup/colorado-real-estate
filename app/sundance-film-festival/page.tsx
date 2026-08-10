import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarClock, FileSearch, Home, MapPinned, ShieldCheck } from 'lucide-react';

import { SITE_NAME, SITE_URL } from '@/lib/publicTrust';

const PAGE_PATH = '/sundance-film-festival';
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export const metadata: Metadata = {
  title: `Sundance Film Festival Real Estate Orientation | ${SITE_NAME}`,
  description:
    'A durable real-estate and location-oriented Sundance Film Festival orientation for relocation, housing search, market context, and source verification.',
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: `Sundance Film Festival Real Estate Orientation | ${SITE_NAME}`,
    description:
      'Use Sundance as a place, timing, housing, and verification prompt without relying on unsupported live-event or market-impact claims.',
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'article',
  },
};

const orientationAreas = [
  {
    icon: MapPinned,
    title: 'Geographic Orientation',
    body:
      'Treat Sundance as a regional context question. Confirm the current official host locations, travel patterns, and local logistics from official sources before relying on them.',
  },
  {
    icon: Home,
    title: 'Housing Search Implications',
    body:
      'Separate temporary lodging questions from permanent housing decisions. Festival interest does not prove fit, availability, pricing, appreciation, or investment value.',
  },
  {
    icon: CalendarClock,
    title: 'Timing And Freshness',
    body:
      'Event timing, venues, transportation, ticketing, and lodging availability can change. This page is durable orientation, not a live event guide.',
  },
  {
    icon: ShieldCheck,
    title: 'Verification Before Reliance',
    body:
      'Use official festival, municipal, listing, lender, inspection, tax, HOA, title, and professional sources before making property or relocation decisions.',
  },
];

const decisionQuestions = [
  'Is this a temporary visit, a seasonal routine, a relocation question, or a permanent housing search?',
  'Which community, commute pattern, or daily-life anchor needs verified local context?',
  'Which assumptions depend on current event logistics rather than stable real-estate facts?',
  'Which property-specific evidence must be reviewed before comparing homes?',
  'Which professional question should be asked before treating festival proximity as decision evidence?',
];

const continuityLinks = [
  { href: '/search', label: 'Search', note: 'Explore inventory without event-impact assumptions' },
  { href: '/market', label: 'Market', note: 'Review market context before narrowing to a property' },
  { href: '/grand-plan', label: 'Grand Plan', note: 'Organize place, timing, and verification questions' },
  { href: '/sources', label: 'Sources', note: 'Review REIE source and methodology boundaries' },
  { href: '/contact', label: 'Advisor', note: 'Discuss assumptions with a professional' },
];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: 'Sundance Film Festival Real Estate Orientation',
  description:
    'A durable real-estate and location-oriented Sundance Film Festival orientation with source, freshness, and decision-boundary guidance.',
  isPartOf: {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
  },
  about: {
    '@type': 'Thing',
    name: 'Sundance Film Festival real estate orientation',
  },
  publisher: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
  },
};

export default function SundanceFilmFestivalPage() {
  return (
    <main
      className="min-h-screen bg-[#071017] text-white"
      data-testid="sundance-editorial-authority-page"
      data-editorial-authority-pilot="sundance-film-festival"
      data-editorial-authority-live-event-facts="false"
      data-editorial-authority-ticketing="false"
      data-editorial-authority-booking="false"
      data-editorial-authority-market-impact-claims="false"
      data-editorial-authority-property-ranking="false"
      data-editorial-authority-suitability-scoring="false"
      data-editorial-authority-provider-activation="false"
      data-editorial-authority-hidden-state-transfer="false"
    >
      <script
        type="application/ld+json"
        data-testid="sundance-editorial-authority-schema"
        data-sundance-schema-visible-alignment="true"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="border-b border-white/10 bg-[linear-gradient(135deg,#071017,#111820_58%,#20333a)] px-5 py-16 sm:px-8 lg:px-12" data-testid="sundance-hero">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end" data-testid="sundance-hero-grid">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">Editorial Authority Pilot</p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-tight tracking-normal md:text-6xl">
              Sundance Film Festival Real Estate Orientation
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/66" data-testid="sundance-hero-copy">
              Use Sundance as a real-estate planning lens for place, timing, housing search, source verification, and professional questions.
              This page is not a live festival schedule, tourism guide, ticketing page, lodging inventory, or market-impact forecast.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" data-testid="sundance-hero-actions">
              <Link
                href="/grand-plan"
                className="inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-cyan-100 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#071017] no-underline transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
              >
                Build A Decision Plan
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link
                href="/sources"
                className="inline-flex min-h-12 items-center gap-2 rounded-[8px] border border-white/14 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white/72 no-underline transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
              >
                Check Source Boundaries
                <FileSearch size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="rounded-[8px] bg-black/24 p-5 ring-1 ring-white/10" data-testid="sundance-visible-answer">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/68">Answer First</p>
            <p className="mt-3 text-lg font-black leading-7 text-white">
              Sundance can matter to a real-estate decision when it changes how someone thinks about place, seasonal use, commute patterns,
              temporary housing, permanent housing, or timing. Those questions still require current official sources and property-specific
              verification before reliance.
            </p>
          </aside>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12" data-testid="sundance-orientation-areas">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Orientation Areas</p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-normal text-white">What to separate before using festival context.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {orientationAreas.map((area) => {
              const Icon = area.icon;

              return (
                <article key={area.title} className="rounded-[8px] bg-white/[0.045] p-5 ring-1 ring-white/10" data-testid="sundance-orientation-card">
                  <Icon className="text-cyan-100/72" size={24} aria-hidden="true" />
                  <h3 className="mt-4 text-xl font-black uppercase leading-tight tracking-normal text-white">{area.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/58">{area.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/18 px-5 py-14 sm:px-8 lg:px-12" data-testid="sundance-decision-questions">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Decision Questions</p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-normal text-white">Use the topic to clarify the question, not to force a conclusion.</h2>
            <p className="mt-4 text-sm leading-7 text-white/58">
              The useful output is an advisor-ready question set. It is not a claim that proximity to a festival improves property quality,
              suitability, timing, pricing, appreciation, or investment outcome.
            </p>
          </div>
          <ol className="grid gap-3">
            {decisionQuestions.map((question, index) => (
              <li key={question} className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 rounded-[8px] bg-white/[0.04] p-4 ring-1 ring-white/10">
                <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-cyan-100 text-xs font-black text-[#071017]">{index + 1}</span>
                <span className="text-sm font-semibold leading-6 text-white/68">{question}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12" data-testid="sundance-source-boundaries">
        <div className="mx-auto max-w-6xl rounded-[8px] bg-white/[0.045] p-6 ring-1 ring-white/10">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Freshness And Source Boundaries</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <p className="text-sm leading-7 text-white/62">
              Current schedules, venues, transportation, ticketing, attendance, lodging availability, and official location details must be
              verified from official sources for the relevant year. This route intentionally avoids publishing unsupported live-event facts.
            </p>
            <p className="text-sm leading-7 text-white/62">
              Real-estate decisions also require property, market, financing, tax, HOA, title, inspection, insurance, and legal review where
              applicable. REIE orientation is not a substitute for those sources or professional judgment.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 lg:px-12" data-testid="sundance-reie-continuity">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Continue In REIE</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {continuityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[8px] bg-black/24 p-4 text-sm font-bold leading-6 text-white/64 ring-1 ring-white/10 no-underline transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
                data-testid="sundance-continuity-link"
              >
                <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/72">{link.label}</span>
                <span className="mt-2 block">{link.note}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
