import type { Metadata } from 'next';
import Link from 'next/link';

import BuyerFinancingReadinessGuide from '@/components/BuyerFinancingReadinessGuide';
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

const primaryButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-100 px-6 py-3 text-sm font-black text-[#101820] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]';
const secondaryButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-white/38 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]';

const preparationThemes = [
  {
    label: 'Readiness',
    title: 'Know what is still assumed.',
    body: 'Separate budget range, timing, daily-life needs, decision partners, and financing assumptions before the search starts to narrow.',
  },
  {
    label: 'Comparison',
    title: 'Compare the home, not only the list price.',
    body: 'Use Search, property facts, market context, condition signals, HOA questions, insurance exposure, and neighborhood fit together.',
  },
  {
    label: 'Verification',
    title: 'Name what a professional must confirm.',
    body: 'Carry forward questions for lending, taxes, insurance, inspection, records, title, HOA, condition, offer timing, and advisor review.',
  },
];

const verificationQuestions = [
  'Which financing assumptions need lender review before they shape a search range?',
  'Which property facts are missing from the listing and need inspection, records, HOA, title, insurance, or specialist review?',
  'Which market signals create urgency, and which should be treated as context rather than a conclusion?',
  'Which tradeoffs would make a home worth an advisor conversation before a tour or offer decision?',
];

export default function BuyPage() {
  const buyerDecisionWorkspace = buildBuyerDecisionWorkspace({
    searchHref: '/search',
    marketHref: '/market',
    propertyHref: '/search',
    financingHref: '#buyer-financing-confidence',
    advisorHref: '/contact',
  });

  return (
    <main
      className="min-h-screen bg-[#0b1117] text-white"
      data-testid="buyer-page"
      data-dxt-wave-1c-buyer-journey="true"
      data-dxt-wave-1c-buyer-hierarchy="page-orientation-governing-question-opening-promise-preparation-tools-verify-boundaries-advisory-continuations"
      data-dxt-wave-1c-shared-contract="BUYER_SELLER_SHARED_HIERARCHY_FOUNDATION_IMPLEMENTED"
      data-dxt-wave-1c-buyer-runtime-only="true"
      data-dxt-wave-1c-seller-runtime-change="false"
    >
      <section
        className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
        data-testid="reie-buyer-confidence-orientation"
        data-dxt-buyer-hierarchy-role="page-orientation-governing-decision-question-concise-opening-promise"
        data-reie-sprint-3-buyer-confidence="true"
        data-buyer-confidence-ai="false"
        data-buyer-confidence-gis="false"
        data-buyer-confidence-provider-activation="false"
        data-buyer-confidence-financing-workflow="false"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-10 lg:grid-cols-[0.78fr_0.52fr] lg:items-end">
          <div>
            <p className="text-[11px] font-black uppercase text-cyan-100">Buyer Journey</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Am I prepared to buy?
            </h1>
            <p className="mt-7 max-w-2xl text-xl font-semibold leading-9 text-white/76">
              Prepare the search, financing assumptions, property questions, and advisor conversation before the market asks you to move.
            </p>
            <div className="mt-9 flex flex-wrap gap-3" data-testid="buyer-page-primary-actions">
              <Link href="/search" className={primaryButtonClass} data-dxt-buyer-primary-action="/search">
                Start With Search
              </Link>
              <Link href="#financing-readiness" className={secondaryButtonClass}>
                Review Financing Assumptions
              </Link>
            </div>
          </div>
          <aside className="border border-cyan-100/16 bg-cyan-100/[0.055] p-5" data-testid="dxt-buyer-opening-boundary">
            <p className="text-[10px] font-black uppercase text-cyan-100/76">Preparation, not qualification</p>
            <p className="mt-3 text-sm font-bold leading-7 text-white/62">
              This page helps organize buyer readiness. It does not approve, qualify, rank lenders, calculate affordability,
              determine buying power, or recommend a loan.
            </p>
          </aside>
        </div>
      </section>

      <section
        className="px-5 pb-12 sm:px-8 lg:px-12"
        data-testid="reie-buyer-confidence-path"
        data-dxt-buyer-hierarchy-role="preparation-themes"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-6">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase text-cyan-100/72">Prepare First</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl">
              Three things need to be clear before a home becomes serious.
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {preparationThemes.map((theme, index) => (
              <article
                key={theme.label}
                className="border border-white/10 bg-white/[0.04] p-5"
                data-testid="reie-buyer-confidence-path-step"
                data-buyer-confidence-step={theme.label.toLowerCase()}
                data-dxt-buyer-preparation-theme={theme.label.toLowerCase()}
              >
                <p className="text-[10px] font-black uppercase text-cyan-100/72">
                  {String(index + 1).padStart(2, '0')} / {theme.label}
                </p>
                <h3 className="mt-4 text-xl font-black leading-tight text-white">{theme.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{theme.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="buyer-financing-confidence"
        className="px-5 pb-12 sm:px-8 lg:px-12"
        data-testid="reie-buyer-v8-decision-workspace"
        data-dxt-buyer-hierarchy-role="tool-or-evidence-continuation"
        data-buyer-v8-item-count={buyerDecisionWorkspace.items.length}
        data-buyer-v8-ai="false"
        data-buyer-v8-accounts="false"
        data-buyer-v8-gis="false"
        data-buyer-v8-telemetry="false"
        data-buyer-v8-mortgage-calculator="false"
        data-buyer-v8-lender-workflow="false"
        data-buyer-v8-recommendation-engine="false"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 border border-cyan-100/14 bg-cyan-100/[0.045] p-6 sm:p-8 lg:grid-cols-[0.62fr_1fr] lg:items-start">
          <div>
            <p className="text-[10px] font-black uppercase text-cyan-100/72">Buyer Decision Workspace</p>
            <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-normal text-white">
              {buyerDecisionWorkspace.headline}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/62">{buyerDecisionWorkspace.orientation}</p>
            <p className="mt-5 max-w-xl border border-white/10 bg-black/16 p-4 text-xs font-bold leading-6 text-white/50">
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
                <p className="text-[9px] font-black uppercase text-cyan-100/66">{item.label}</p>
                <p className="mt-2 text-xs leading-6 text-white/58">{item.guidance}</p>
                <span className="mt-3 block text-[10px] font-black uppercase text-cyan-100/76 group-hover:text-white">
                  {item.action}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-12 sm:px-8 lg:px-12" data-dxt-buyer-hierarchy-role="questions-to-verify">
        <div className="mx-auto grid w-full max-w-[1180px] gap-6 lg:grid-cols-[0.62fr_1fr] lg:items-start">
          <div>
            <p className="text-[10px] font-black uppercase text-cyan-100/72">Questions To Verify</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-white">
              A prepared buyer knows what is still unresolved.
            </h2>
          </div>
          <div className="grid gap-3">
            {verificationQuestions.map((question) => (
              <article key={question} className="border border-white/10 bg-white/[0.035] p-4" data-testid="dxt-buyer-verification-question">
                <p className="text-sm font-bold leading-7 text-white/64">{question}</p>
              </article>
            ))}
            <Link href="/market" className={secondaryButtonClass}>
              Understand Market Context
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-[1180px] gap-6">
          <div data-dxt-buyer-hierarchy-role="professional-and-trust-boundaries">
            <BuyerFinancingReadinessGuide />
          </div>
          <div id="financing-confidence" className="scroll-mt-24">
            <FinancingConfidenceEducation surface="buy" />
          </div>
          <div data-dxt-buyer-hierarchy-role="advisory-transition-compact-continuations">
            <JourneyCohesionPanel
              surface="buyer"
              title="Move from buyer preparation into the right next decision."
              body="When your assumptions are organized, continue to Search, review financing education, or bring focused questions into an advisory conversation."
              links={[
                { label: 'Search Homes', href: '/search', note: 'Apply buyer criteria', destination: 'search' },
                { label: 'Financing Guidance', href: '/buy#buyer-financing-confidence', note: 'Review assumptions', destination: 'financing' },
                { label: 'Market Context', href: '/market', note: 'Compare local conditions', destination: 'market' },
                { label: 'Advisory Guidance', href: '/contact', note: 'Ask focused questions', destination: 'advisory' },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/buy/page.tsx
