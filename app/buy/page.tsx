import type { Metadata } from 'next';
import Link from 'next/link';

import FinancingConfidenceEducation from '@/components/FinancingConfidenceEducation';
import JourneyCohesionPanel from '@/components/JourneyCohesionPanel';
import { buildBuyerDecisionWorkspace } from '@/lib/buyerDecisionWorkspace';
import { SITE_NAME, SITE_URL } from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Buy With Confidence | ${SITE_NAME}`,
  description:
    'Use David Quinn Group buyer guidance to prepare for Colorado home search, comparison, due diligence, financing education, and advisor conversations.',
  alternates: { canonical: `${SITE_URL}/buy` },
  robots: { index: true, follow: true },
};

const buyerConfidencePath = [
  {
    step: 'Orient',
    title: 'Know where to begin',
    body: 'Start with place, budget range, daily-life fit, and the type of home you are trying to evaluate before the search becomes too narrow.',
  },
  {
    step: 'Compare',
    title: 'Understand the tradeoffs',
    body: 'Use search, property briefs, market context, and neighborhood signals together so price, condition, timing, and fit are not evaluated in isolation.',
  },
  {
    step: 'Verify',
    title: 'Know what to ask',
    body: 'Carry forward the assumptions that need professional review, including financing terms, taxes, insurance, HOA, condition, systems, and records.',
  },
  {
    step: 'Decide',
    title: 'Choose the next step',
    body: 'Continue searching, open market context, ask a focused question, or schedule a tour when the property deserves closer review.',
  },
];

const primaryButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-100 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#101820] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]';
const secondaryButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:border-white/38 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]';

export default function BuyPage() {
  const buyerDecisionWorkspace = buildBuyerDecisionWorkspace({
    searchHref: '/search',
    marketHref: '/market',
    propertyHref: '/search',
    financingHref: '#buyer-financing-confidence',
    advisorHref: '/contact',
  });

  return (
    <main className="min-h-screen bg-[#0b1117] text-white" data-testid="buyer-page">
      <section
        className="px-5 py-24 sm:px-8 sm:py-28 lg:px-12"
        data-testid="reie-buyer-confidence-orientation"
        data-reie-sprint-3-buyer-confidence="true"
        data-buyer-confidence-ai="false"
        data-buyer-confidence-gis="false"
        data-buyer-confidence-provider-activation="false"
        data-buyer-confidence-financing-workflow="false"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-12 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100">Buyer Confidence</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl">
              Know what matters before the market asks you to move.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-white/70">
              REIE helps buyers reduce uncertainty by organizing search, property facts, neighborhood context,
              market timing, financing assumptions, and questions to verify into one guided decision path.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/search" className={primaryButtonClass}>
                Start Buyer Search
              </Link>
              <Link href="/market" className={secondaryButtonClass}>
                Understand the Market
              </Link>
            </div>
          </div>
          <div className="grid gap-3" data-testid="reie-buyer-confidence-path">
            {buyerConfidencePath.map((item) => (
              <article
                key={item.step}
                className="grid gap-4 bg-white/[0.045] p-5 sm:grid-cols-[7rem_1fr]"
                data-testid="reie-buyer-confidence-path-step"
                data-buyer-confidence-step={item.step.toLowerCase()}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/72">{item.step}</p>
                <div>
                  <h2 className="text-lg font-black leading-tight text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/60">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="buyer-financing-confidence"
        className="px-5 pb-12 sm:px-8 lg:px-12"
        data-testid="reie-buyer-v8-decision-workspace"
        data-buyer-v8-item-count={buyerDecisionWorkspace.items.length}
        data-buyer-v8-ai="false"
        data-buyer-v8-accounts="false"
        data-buyer-v8-gis="false"
        data-buyer-v8-telemetry="false"
        data-buyer-v8-mortgage-calculator="false"
        data-buyer-v8-lender-workflow="false"
        data-buyer-v8-recommendation-engine="false"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 bg-cyan-100/[0.045] p-6 sm:p-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">Buyer Decision Workspace</p>
            <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-normal text-white">
              {buyerDecisionWorkspace.headline}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/62">{buyerDecisionWorkspace.orientation}</p>
            <p className="mt-5 max-w-xl bg-black/16 p-4 text-xs font-bold leading-6 text-white/48">
              {buyerDecisionWorkspace.trustBoundary}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {buyerDecisionWorkspace.items.map((item) => (
              <Link
                key={item.lens}
                href={item.href}
                className="group bg-white/[0.045] p-4 transition hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                data-testid="reie-buyer-v8-decision-item"
                data-buyer-v8-lens={item.lens}
                data-buyer-v8-action={item.action}
              >
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/66">{item.label}</p>
                <p className="mt-2 text-xs leading-6 text-white/58">{item.guidance}</p>
                <span className="mt-3 block text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/76 group-hover:text-white">
                  {item.action}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-[1180px] gap-6">
          <FinancingConfidenceEducation surface="buy" />
          <JourneyCohesionPanel
            surface="buyer"
            title="Move from buyer guidance into the right workspace."
            body="Buyer confidence improves when search, market context, financing assumptions, and advisor questions stay connected instead of becoming separate tasks."
            links={[
              { label: 'Search Homes', href: '/search', note: 'Apply buyer criteria', destination: 'search' },
              { label: 'Financing Guidance', href: '/buy#buyer-financing-confidence', note: 'Review assumptions', destination: 'financing' },
              { label: 'Advisory Guidance', href: '/contact', note: 'Ask focused questions', destination: 'advisory' },
            ]}
          />
        </div>
      </section>
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/buy/page.tsx
