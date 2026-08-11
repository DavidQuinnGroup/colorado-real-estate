import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Compass, FileSearch, Home, MapPinned } from 'lucide-react';

import GrandPlanIntake from '@/components/GrandPlanIntake';
import JourneyCohesionPanel from '@/components/JourneyCohesionPanel';
import { SITE_NAME, SITE_URL } from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Grand Plan | ${SITE_NAME}`,
  description:
    'Start a David Quinn Group Grand Plan for buying, selling, relocation, or long-term Colorado real estate planning.',
  alternates: { canonical: `${SITE_URL}/grand-plan` },
  robots: { index: true, follow: true },
};

const planningSteps = [
  {
    title: 'Start with priorities',
    body: 'Select the lifestyle priorities and ownership goal that should guide the conversation.',
  },
  {
    title: 'Name the places',
    body: 'Share the places and routines that matter, along with how often they shape daily life.',
  },
  {
    title: 'Prepare the conversation',
    body: 'Connect priorities, places, timing, and context before advisor follow-up.',
  },
];

const grandPlanJourneySignals = [
  { icon: Home, title: 'Property context', body: 'What you own, want, or are considering.' },
  { icon: MapPinned, title: 'Life logistics', body: 'The places and constraints that shape the decision.' },
  { icon: Compass, title: 'Next move', body: 'A guided advisory conversation instead of a generic search.' },
];

const grandPlanDecisionAreas = [
  {
    area: 'Property',
    question: 'What property facts are known, and which details still need verification?',
    continuation: 'Use Property Product 3.1 and source-readiness prompts when a specific property matters.',
  },
  {
    area: 'Place',
    question: 'Which market, neighborhood, or daily-life context should frame the decision?',
    continuation: 'Use market and neighborhood context as orientation, not as suitability or steering.',
  },
  {
    area: 'Financing',
    question: 'Which assumptions materially change the monthly scenario or cash planning conversation?',
    continuation: 'Use financing tools as user-assumption planning, not lender quotes, approval, or advice.',
  },
  {
    area: 'Comparison',
    question: 'Which alternatives are meaningfully different, similar, unsupported, or verification-bound?',
    continuation: 'Use comparison to organize differences and questions without ranking properties.',
  },
  {
    area: 'Due diligence',
    question: 'Which facts require source review, professional review, or a current document before reliance?',
    continuation: 'Use evidence readiness and Sources & Methodology to understand what REIE can and cannot claim.',
  },
  {
    area: 'Timing',
    question: 'What must happen before the next step is practical?',
    continuation: 'Use timing as preparation context, not pressure, urgency, or prediction.',
  },
];

const certifiedContinuityLinks = [
  { label: 'Search', href: '/search', note: 'Explore inventory with context', destination: 'search' },
  { label: 'Property', href: '/search', note: 'Open a listing for Property Product 3.1', destination: 'property' },
  { label: 'Compare', href: '/compare', note: 'Review differences without ranking', destination: 'compare' },
  { label: 'Financing', href: '/buy#financing-readiness', note: 'Test user-entered assumptions', destination: 'financing' },
  { label: 'Sources', href: '/sources', note: 'Understand evidence and methodology', destination: 'sources' },
  { label: 'Advisor', href: '/contact#advisory-readiness', note: 'Prepare the next conversation', destination: 'advisory' },
];

export default function GrandPlanPage() {
  return (
    <main
      data-testid="grand-plan-page"
      data-grand-plan-advancement="SOURCE_REGISTRY_GRAND_PLAN_ADVANCEMENT"
      data-grand-plan-hidden-state-transfer="false"
      data-grand-plan-scoring="false"
      data-grand-plan-protected-class-inference="false"
      data-grand-plan-telemetry="false"
    >
      <section data-testid="grand-plan-landing">
        <div>
          <div>
            <p className="gp-eyebrow gp-hero-eyebrow">Grand Plan</p>
            <h1>
              Build Your Grand Plan.
            </h1>
            <p className="gp-copy">
              A clearer real estate decision begins with your priorities, important places, timing, and daily life. Start with what matters
              most before the property search takes over.
            </p>
            <div className="mt-10 flex flex-wrap gap-3" data-testid="grand-plan-primary-actions">
              <a
                href="#grand-plan-intake"
                className="gp-button gp-button-primary"
              >
                Start With What Matters Most
              </a>
              <Link
                href="/search"
                className="gp-button gp-button-secondary"
              >
                Explore Inventory
              </Link>
            </div>
          </div>

          <div data-testid="grand-plan-value-proposition">
            {planningSteps.map((step, index) => (
              <article key={step.title}>
                <p>Step {index + 1}</p>
                <h2>{step.title}</h2>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-testid="grand-plan-explanation">
        <div>
          <div>
            <p className="gp-eyebrow">Why It Exists</p>
            <h2 className="gp-section-title">
              A good real estate decision has to survive real life.
            </h2>
            <p className="gp-section-copy">
              A search can show inventory. The Grand Plan helps connect the decision to timing, important places, preparation, lifestyle
              priorities, and the conversation that should happen before the next move.
            </p>
          </div>
          <div className="gp-card-grid">
            {grandPlanJourneySignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <article key={signal.title}>
                  <Icon aria-hidden="true" />
                  <h3>{signal.title}</h3>
                  <p>{signal.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12" data-testid="grand-plan-decision-orchestration">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-3xl">
            <p className="gp-eyebrow">Decision Orchestration</p>
            <h2 className="gp-section-title">Use the Grand Plan to decide what deserves attention next.</h2>
            <p className="gp-section-copy">
              The Grand Plan organizes the decision into manageable areas. It does not score your choices, personalize search in the
              background, or decide which property or place is right for you.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {grandPlanDecisionAreas.map((item) => (
              <article
                key={item.area}
                className="min-w-0 bg-white/[0.035] p-5 ring-1 ring-white/10"
                data-testid="grand-plan-decision-area"
                data-grand-plan-decision-area={item.area.toLowerCase().replace(/\s+/g, '-')}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/66">{item.area}</p>
                <h3 className="mt-3 text-lg font-black leading-tight text-white">{item.question}</h3>
                <p className="mt-3 text-sm leading-6 text-white/56">{item.continuation}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12" data-testid="grand-plan-certified-continuity">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="gp-eyebrow">Certified REIE Tools</p>
              <h2 className="gp-section-title">Continue without copying data between tools.</h2>
              <p className="gp-section-copy">
                These links move you to the right public surface. They do not pass hidden planner inputs, financing assumptions, saved
                searches, property choices, or personal context across routes.
              </p>
            </div>
            <FileSearch className="text-cyan-100/50" size={38} aria-hidden="true" />
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="grand-plan-certified-tool-links">
            {certifiedContinuityLinks.map((link) => (
              <Link
                key={`${link.destination}-${link.href}`}
                href={link.href}
                className="min-h-24 bg-black/18 p-4 text-sm font-bold leading-6 text-white/62 ring-1 ring-white/10 transition hover:bg-white/[0.055] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                data-testid="grand-plan-certified-tool-link"
                data-grand-plan-certified-destination={link.destination}
                data-grand-plan-hidden-state-transfer="false"
                {...(link.href === '/contact#advisory-readiness'
                  ? {
                      'data-advisory-handoff-value-activation': 'true',
                      'data-advisory-handoff-authoritative-destination': '/contact#advisory-readiness',
                      'data-advisory-handoff-hidden-context': 'false',
                      'data-advisory-handoff-query-propagation': 'false',
                      'data-advisory-handoff-prefill': 'false',
                      'data-advisory-handoff-customer-control': 'true',
                    }
                  : {})}
              >
                <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/70">{link.label}</span>
                <span className="mt-2 block">{link.note}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="grand-plan-intake" data-testid="grand-plan-intake-section">
        <div>
          <aside>
            <p className="gp-eyebrow">What You Provide</p>
            <h2>Enough context for the first useful conversation.</h2>
            <ul>
              {[
                'How to reach you.',
                'The market or community you are focused on.',
                'The lifestyle priorities and ownership goal behind the decision.',
                'Up to three places or routines that matter in real life.',
                'The decision you need help making.',
              ].map((item) => (
                <li key={item}>
                  <CheckCircle2 aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              The intake creates a starting point for advisor follow-up. It does not produce automated advice or a brokerage relationship by
              itself.
            </p>
          </aside>
          <GrandPlanIntake />
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 lg:px-12" data-testid="grand-plan-cohesion-continuity">
        <div className="mx-auto w-full max-w-[1180px]">
          <JourneyCohesionPanel
            surface="grand-plan"
            title="Use the Grand Plan as orientation, then continue into action."
            body="The Grand Plan organizes priorities and context. It does not automatically personalize search, predict outcomes, or replace advisor review."
            links={[
              { label: 'Search Homes', href: '/search', note: 'Explore inventory', destination: 'search' },
              { label: 'Buyer Guidance', href: '/buy', note: 'Prepare purchase questions', destination: 'buyer' },
              { label: 'Prepare Next Conversation', href: '/contact#advisory-readiness', note: 'Review knowns, unresolved items, and verification questions', destination: 'advisory' },
            ]}
          />
        </div>
      </section>
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/grand-plan/page.tsx
