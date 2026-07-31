import type { Metadata } from 'next';
import Link from 'next/link';

import HomeValueEstimator from '@/components/HomeValueEstimator';
import JourneyCohesionPanel from '@/components/JourneyCohesionPanel';
import { getJourneyMeasurementAttributes } from '@/lib/customerJourneyMeasurement';
import { SITE_NAME, SITE_URL } from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Sell With Strategy | ${SITE_NAME}`,
  description:
    'Request a seller strategy review from David Quinn Group for property preparation, pricing, positioning, and Colorado market context.',
  alternates: { canonical: `${SITE_URL}/sell` },
  robots: { index: true, follow: true },
};

const sellerServices = [
  {
    title: 'Preparation priorities',
    body: 'Identify the repairs, presentation issues, and property details that should be handled before launch.',
  },
  {
    title: 'Pricing and positioning',
    body: 'Frame the home against competing inventory, likely buyer objections, timing, and local demand.',
  },
  {
    title: 'Construction-informed review',
    body: 'Use David Quinn Group construction perspective to anticipate condition questions before they become negotiation friction.',
  },
  {
    title: 'Market strategy',
    body: 'Connect your timeline, equity goals, and next move to a practical listing plan.',
  },
];

export default function SellPage() {
  return (
    <main className="min-h-screen bg-[#0b1117] text-white" data-testid="seller-page">
      <section className="px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid w-full max-w-[1180px] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100">Colorado Seller Strategy</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl">
              Sell with preparation, pricing, and market context.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-white/70">
              David Quinn Group helps sellers understand what buyers will notice, what should be prepared before launch, how to position
              the property, and what the current local market is likely to reward.
            </p>
            <div
              data-testid="cep-navigation-seller-journey"
              data-cep-measurement-ready="true"
              data-cep-measurement-active="false"
            >
              <div className="mt-10 flex flex-wrap gap-3" data-testid="seller-page-primary-actions">
                <a
                  href="#seller-intake"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-100 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#101820] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]"
                  {...getJourneyMeasurementAttributes({
                    surface: 'seller-primary-actions',
                    stage: 'seller',
                    action: 'request-seller-review',
                    destination: 'seller',
                  })}
                >
                  Request Seller Review
                </a>
                <Link
                  href="/market"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:border-white/38 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]"
                  {...getJourneyMeasurementAttributes({
                    surface: 'seller-primary-actions',
                    stage: 'seller',
                    action: 'view-market',
                    destination: 'market',
                  })}
                >
                  Market Context
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:border-white/38 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]"
                  {...getJourneyMeasurementAttributes({
                    surface: 'seller-primary-actions',
                    stage: 'seller',
                    action: 'ask-property-question',
                    destination: 'inquiry',
                  })}
                >
                  Contact Routing
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2" data-testid="seller-value-proposition">
            {sellerServices.map((service) => (
              <article key={service.title} className="rounded-[10px] bg-white/[0.045] p-6 ring-1 ring-white/[0.06]">
                <h2 className="text-xl font-black leading-tight text-white">{service.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/62">{service.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="seller-intake" className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12" data-testid="seller-intake-section">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8">
          <JourneyCohesionPanel
            surface="seller"
            title="Connect seller strategy to market context and advisory review."
            body="A seller decision should move from preparation questions to market alternatives, home-worth context, and a direct advisor conversation without publishing a value claim."
            links={[
              { label: 'Home Worth', href: '/home-worth', note: 'Review value context', destination: 'home-worth' },
              { label: 'Market Context', href: '/market', note: 'See local competition', destination: 'market' },
              { label: 'Advisory Guidance', href: '/contact', note: 'Ask seller questions', destination: 'advisory' },
            ]}
          />
          <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5" data-testid="seller-readiness-entry">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100/72">Prepare Before Pricing</p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-7 text-white/60">
                Use Seller Readiness to organize property records, preparation questions, and qualified-review topics before requesting a
                pricing conversation.
              </p>
              <Link
                href="/home-worth#seller-readiness"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/18 px-4 py-2 text-[11px] font-black uppercase tracking-[0.13em] text-white transition hover:border-white/38 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]"
              >
                Seller Readiness
              </Link>
            </div>
          </div>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100">Next Step</p>
              <h2 className="mt-5 text-4xl font-black leading-tight text-white">Start with the property and the decision you are trying to make.</h2>
              <p className="mt-6 text-base leading-8 text-white/64">
                The request creates a seller follow-up record for advisor review. It does not publish a valuation, send an uncontrolled email,
                or replace a direct pricing conversation.
              </p>
            </div>
            <HomeValueEstimator />
          </div>
        </div>
      </section>
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/sell/page.tsx
