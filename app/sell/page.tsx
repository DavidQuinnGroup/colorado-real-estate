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
    title: 'Property condition and presentation',
    body: 'Identify repairs, showing friction, access details, and presentation choices that should be understood before launch.',
  },
  {
    title: 'Evidence and information gaps',
    body: 'Organize records, permits, HOA materials, maintenance history, insurance questions, and known gaps before buyers ask.',
  },
  {
    title: 'Pricing context and market exposure',
    body: 'Frame price conversation around competing inventory, timing, condition, preparation, and current local alternatives.',
  },
  {
    title: 'Buyer objections and transaction readiness',
    body: 'Prepare for inspection questions, disclosure review, negotiation friction, timeline pressure, and next-move logistics.',
  },
];

const sellerQuestions = [
  'What property condition, repair, maintenance, permit, HOA, insurance, or title questions should be organized before exposure?',
  'Which pricing assumptions depend on current competition, timing, showing readiness, or professional review?',
  'What buyer objections are likely enough to prepare for before they become negotiation pressure?',
  'What must be verified by an advisor, inspector, attorney, CPA, title professional, insurer, HOA, or municipality?',
];

const sellerBoundaries = [
  'Home-worth context is not an appraisal, automated valuation, listing-price recommendation, or guaranteed sale price.',
  'Pricing context stays directional until the property, evidence, market alternatives, and professional judgment are reviewed together.',
  'Preparation guidance does not create legal, tax, insurance, title, inspection, engineering, investment, or suitability conclusions.',
];

const nextDecisions = [
  {
    label: 'Home Worth',
    href: '/home-worth',
    body: 'Prepare value-context questions without asking the site for a definitive number.',
  },
  {
    label: 'Market Context',
    href: '/market',
    body: 'Review local competition and timing before deciding how exposure should be framed.',
  },
  {
    label: 'Search Inventory',
    href: '/search',
    body: 'See competing active homes from the buyer side before shaping positioning.',
  },
  {
    label: 'Advisory Guidance',
    href: '/contact',
    body: 'Bring the unresolved questions into a professional conversation.',
  },
];

const SELLER_PROFESSIONAL_HANDOFF_STEPS = [
  {
    label: 'Bring property evidence',
    body: 'Organize condition, records, preparation gaps, and buyer-objection questions before a pricing or exposure conversation.',
  },
  {
    label: 'Use Advisory for preparation',
    body: 'Advisory is the place to prepare what needs professional interpretation before a seller conversation begins.',
  },
  {
    label: 'Keep Contact general',
    body: 'Contact remains the simplest general starting point and does not replace seller review, Home Worth, or property-specific preparation.',
  },
];

const SELLER_HANDOFF_BOUNDARIES = [
  'Seller preparation does not create an appraisal, valuation certainty, listing-price recommendation, guaranteed pricing, or guaranteed sale outcome.',
  'Advisory prepares the conversation; it does not create representation, legal advice, tax advice, investment advice, suitability conclusions, or assured outcomes.',
  'Contact begins a general conversation and does not receive hidden Seller context, Home Worth inputs, property records, pricing assumptions, or customer information from this page.',
];

export default function SellPage() {
  return (
    <main
      className="min-h-screen bg-[#0b1117] text-white"
      data-testid="seller-page"
      data-dxt-wave-1c-seller-journey="true"
      data-dxt-wave-1c-shared-contract="BUYER_SELLER_SHARED_HIERARCHY_FOUNDATION_IMPLEMENTED"
      data-dxt-wave-1c-buyer-runtime-change="false"
      data-dxt-wave-1d-market-runtime-change="false"
      data-dxt-wave-1d-neighborhood-runtime-change="false"
      data-seller-advisory-contact-continuity="implemented"
      data-seller-advisory-contact-runtime-scope="app/sell/page.tsx"
      data-seller-advisory-contact-hidden-context="false"
      data-seller-advisory-contact-url-context="false"
      data-seller-advisory-contact-form-change="false"
      data-seller-advisory-contact-api-change="false"
      data-seller-advisory-contact-crm="false"
      data-seller-advisory-contact-email="false"
      data-seller-advisory-contact-scheduling="false"
    >
      <section
        className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
        data-dxt-seller-hierarchy-role="page-orientation-governing-decision-question-concise-opening-promise"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100">Seller Journey</p>
            <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-6xl">
              What must be understood before market exposure?
            </h1>
            <p className="mt-6 text-lg leading-9 text-white/70">
              Prepare the property, evidence, pricing context, buyer questions, and advisor conversation before the market sees the home.
            </p>
            <div
              data-testid="cep-navigation-seller-journey"
              data-cep-measurement-ready="true"
              data-cep-measurement-active="false"
            >
              <div className="mt-9 flex flex-wrap gap-3" data-testid="seller-page-primary-actions">
                <a
                  href="#seller-intake"
                  data-dxt-seller-primary-action="#seller-intake"
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
                  href="#seller-preparation"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:border-white/38 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]"
                >
                  Review Preparation Themes
                </Link>
              </div>
            </div>
            <div className="mt-8 rounded-[10px] border border-cyan-100/18 bg-cyan-100/[0.06] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100">Context, not a value claim</p>
              <p className="mt-3 text-sm leading-7 text-white/62">
                This page organizes seller preparation. It does not produce an appraisal, automated valuation, listing-price recommendation,
                guaranteed sale price, guaranteed timing, or guaranteed outcome.
              </p>
            </div>
          </div>

          <div
            id="seller-preparation"
            className="grid gap-4 sm:grid-cols-2"
            data-testid="seller-value-proposition"
            data-dxt-seller-hierarchy-role="preparation-themes"
          >
            {sellerServices.map((service) => (
              <article key={service.title} className="rounded-[10px] bg-white/[0.045] p-6 ring-1 ring-white/[0.06]">
                <h2 className="text-lg font-black leading-tight text-white">{service.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/62">{service.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-y border-white/8 bg-white/[0.025] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        data-dxt-seller-hierarchy-role="tool-or-evidence-continuation"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan-100">Evidence Before Exposure</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              The first tool is preparation, not publication.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/64">
              Seller readiness should move from records and condition questions into market context before an advisor shapes a listing plan.
            </p>
          </div>
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
        </div>
      </section>

      <section
        className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        data-dxt-seller-hierarchy-role="questions-to-verify"
      >
        <div className="mx-auto max-w-[1180px]">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan-100">Questions To Verify</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">
            A seller is better prepared when unresolved questions are named early.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {sellerQuestions.map((question) => (
              <article key={question} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5">
                <p className="text-sm font-bold leading-7 text-white/72">{question}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-y border-white/8 bg-[#101820] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        data-dxt-seller-hierarchy-role="professional-and-trust-boundaries"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan-100">Boundaries</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Pricing context needs professional judgment.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/62">
              The right listing conversation depends on evidence quality, property condition, local alternatives, timing, and qualified review.
            </p>
          </div>
          <div className="grid gap-4">
            {sellerBoundaries.map((boundary) => (
              <div key={boundary} className="rounded-[8px] border border-cyan-100/16 bg-cyan-100/[0.055] p-5">
                <p className="text-sm leading-7 text-white/70">{boundary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        data-testid="reie-seller-professional-handoff"
        data-seller-handoff-question="After preparing for market exposure, what should I understand before beginning a focused professional conversation?"
        data-seller-handoff-primary-action="#seller-intake"
        data-seller-handoff-advisory="/contact#advisory-readiness"
        data-seller-handoff-contact="/contact#contact-route-choice"
        data-seller-handoff-hidden-context="false"
        data-seller-handoff-url-context="false"
        data-seller-handoff-form-change="false"
        data-seller-handoff-api-change="false"
        data-seller-handoff-crm="false"
        data-seller-handoff-email="false"
        data-seller-handoff-scheduling="false"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 border border-white/10 bg-white/[0.035] p-6 sm:p-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan-100">Professional Handoff</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              After preparing for market exposure, what should I understand before beginning a focused professional conversation?
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/62">
              Keep Seller preparation focused on property evidence, market context, and unresolved exposure questions. Request Seller Review
              for seller-specific follow-up, use Advisory to prepare the conversation, and use Contact only as the general starting point.
            </p>
            <div className="mt-7 flex flex-wrap gap-3" data-testid="seller-handoff-actions">
              <a
                href="#seller-intake"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-100 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#101820] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]"
                data-seller-handoff-action="seller-review"
              >
                Request Seller Review
              </a>
              <Link
                href="/contact#advisory-readiness"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:border-white/38 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]"
                data-seller-handoff-action="advisory-preparation"
              >
                Prepare Advisory Questions
              </Link>
              <Link
                href="/contact#contact-route-choice"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:border-white/38 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]"
                data-seller-handoff-action="general-contact"
              >
                Start General Contact
              </Link>
            </div>
            <p className="mt-4 text-xs leading-6 text-white/46">
              These links do not attach Seller context to Advisory or Contact. Keep private records, pricing assumptions, and customer
              information out of any public URL.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {SELLER_PROFESSIONAL_HANDOFF_STEPS.map((step) => (
                <article key={step.label} className="rounded-[8px] border border-cyan-100/12 bg-cyan-100/[0.045] p-4">
                  <h3 className="text-sm font-black leading-tight text-white">{step.label}</h3>
                  <p className="mt-3 text-xs leading-6 text-white/58">{step.body}</p>
                </article>
              ))}
            </div>
            <div className="grid gap-2">
              {SELLER_HANDOFF_BOUNDARIES.map((boundary) => (
                <p key={boundary} className="rounded-[8px] border border-white/10 bg-black/18 p-3 text-xs font-bold leading-6 text-white/52">
                  {boundary}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="seller-intake" className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12" data-testid="seller-intake-section">
        <div
          className="mx-auto grid w-full max-w-[1180px] gap-10"
          data-dxt-seller-hierarchy-role="advisory-transition-compact-continuations"
        >
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100">Advisory Transition</p>
              <h2 className="mt-5 text-4xl font-black leading-tight text-white">
                Bring the property, evidence gaps, and timing into review.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/64">
                The request creates a seller follow-up record for advisor review. It does not publish a valuation, send an uncontrolled email,
                or replace a direct pricing conversation.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {nextDecisions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4 text-white transition hover:border-white/24 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]"
                  >
                    <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-cyan-100">{item.label}</span>
                    <span className="mt-2 block text-xs leading-6 text-white/58">{item.body}</span>
                  </Link>
                ))}
              </div>
            </div>
            <HomeValueEstimator />
          </div>
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
        </div>
      </section>
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/sell/page.tsx
