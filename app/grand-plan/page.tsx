import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Compass, Home, MapPinned } from 'lucide-react';

import GrandPlanIntake from '@/components/GrandPlanIntake';
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
    body: 'Name the decision and the daily-life needs that should guide it.',
  },
  {
    title: 'Frame the timing',
    body: 'Connect market focus, timing, and the practical tradeoffs around the move.',
  },
  {
    title: 'Prepare the conversation',
    body: 'Create a clearer starting point for advisor follow-up.',
  },
];

const grandPlanJourneySignals = [
  { icon: Home, title: 'Property context', body: 'What you own, want, or are considering.' },
  { icon: MapPinned, title: 'Life logistics', body: 'The places and constraints that shape the decision.' },
  { icon: Compass, title: 'Next move', body: 'A guided advisory conversation instead of a generic search.' },
];

export default function GrandPlanPage() {
  return (
    <main data-testid="grand-plan-page">
      <section data-testid="grand-plan-landing">
        <div>
          <div>
            <Link
              href="/"
              className="gp-back-link"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              David Quinn Group
            </Link>
            <p className="gp-eyebrow gp-hero-eyebrow">Grand Plan</p>
            <h1>
              Build Your Grand Plan.
            </h1>
            <p className="gp-copy">
              A clearer real estate decision begins with your priorities, timing, and daily life. Start with what matters most before the
              property search takes over.
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
              A search can show inventory. The Grand Plan helps connect the decision to timing, location, preparation, lifestyle fit, and
              the conversation that should happen before the next move.
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

      <section id="grand-plan-intake" data-testid="grand-plan-intake-section">
        <div>
          <aside>
            <p className="gp-eyebrow">What You Provide</p>
            <h2>Enough context for the first useful conversation.</h2>
            <ul>
              {[
                'How to reach you.',
                'The market or community you are focused on.',
                'The place, routine, or timing anchor that matters most.',
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
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/grand-plan/page.tsx
