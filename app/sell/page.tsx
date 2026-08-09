import type { Metadata } from 'next';
import Link from 'next/link';

import HomeValueEstimator from '@/components/HomeValueEstimator';
import JourneyCohesionPanel from '@/components/JourneyCohesionPanel';
import { getJourneyMeasurementAttributes } from '@/lib/customerJourneyMeasurement';
import { SITE_NAME, SITE_URL } from '@/lib/publicTrust';
import { buildSellerIntelligenceAdvancement } from '@/lib/sellerPropertyIntelligenceAdvancement';

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

const SELLER_READINESS_EVIDENCE = [
  {
    label: 'Available now',
    body: 'Seller preparation themes, Seller Review, Home Worth context, Market context, Search inventory, Advisory preparation, and general Contact paths are visible here.',
  },
  {
    label: 'Needs verification',
    body: 'Property condition, repairs, permits, title matters, HOA obligations, disclosure completeness, insurance considerations, buyer objections, and final pricing strategy need source or professional review.',
  },
  {
    label: 'Condition assumption',
    body: 'Preparation depends on the actual property condition, access, records, repairs, presentation choices, and buyer-visible friction that are not confirmed by this page.',
  },
  {
    label: 'Pricing-context assumption',
    body: 'Home Worth and market context can frame questions, but they do not establish value, likely sale price, listing price, timing, or a pricing recommendation.',
  },
  {
    label: 'Unknown from current evidence',
    body: 'Current evidence does not confirm buyer response, competitive pressure, repair impact, disclosure sufficiency, final net proceeds, contract terms, or closing requirements.',
  },
];

const SELLER_READINESS_VERIFICATION = [
  {
    label: 'Buyer-objection readiness',
    body: 'Name condition, showing, documentation, inspection, HOA, insurance, disclosure, timing, and negotiation questions before buyers make them urgent.',
  },
  {
    label: 'Market-exposure readiness',
    body: 'Use Market context and competing inventory to understand exposure questions without turning directional context into a guaranteed pricing or timing conclusion.',
  },
  {
    label: 'Transaction readiness',
    body: 'Carry title, taxes, legal, contract, disclosure, inspection, repair, insurance, HOA, closing, and next-move questions to the right professional.',
  },
];

const SELLER_READINESS_THRESHOLDS = [
  {
    label: 'Request Seller Review',
    href: '#seller-intake',
    note: 'Use when seller-specific preparation, property evidence, or exposure questions are ready for advisor review.',
  },
  {
    label: 'Review Home Worth context',
    href: '/home-worth',
    note: 'Use when value context should frame questions without asking the site for a conclusion.',
  },
  {
    label: 'Inspect Market context',
    href: '/market',
    note: 'Use when timing, competing inventory, and local alternatives need broader evidence.',
  },
  {
    label: 'Review competing inventory',
    href: '/search',
    note: 'Use when buyer-side alternatives should inform positioning questions.',
  },
  {
    label: 'Prepare Advisory questions',
    href: '/contact#advisory-readiness',
    note: 'Use when evidence gaps and assumptions are clear enough for focused professional preparation.',
  },
  {
    label: 'Begin general Contact',
    href: '/contact#contact-route-choice',
    note: 'Use only when the customer is ready to begin a general conversation without hidden Seller context.',
  },
];

const SELLER_PROFESSIONAL_PREPARATION = [
  {
    label: 'Evidence currently available',
    body: 'Seller preparation themes, Seller Decision Readiness, Seller Review, Home Worth context, Market context, Search inventory, Advisory preparation, and Contact path selection are visible in this public experience.',
  },
  {
    label: 'Evidence requiring verification',
    body: 'Property condition, repairs, permits, maintenance records, disclosure materials, title, HOA, insurance, tax, inspection, appraisal, contract, pricing-context, and closing questions still require source or professional review.',
  },
  {
    label: 'Property-condition assumptions',
    body: 'Preparation assumes the property, records, access, showing readiness, repair status, documentation, and buyer-visible friction need confirmation before exposure.',
  },
  {
    label: 'Pricing-context assumptions',
    body: 'Home Worth, Market, and Search context can frame questions, but pricing context depends on property evidence, competition, timing, and professional review.',
  },
  {
    label: 'Material unknowns',
    body: 'This page does not confirm buyer response, final condition impact, repair scope, disclosure sufficiency, net proceeds, contract terms, legal or tax requirements, or closing obligations.',
  },
  {
    label: 'What REIE cannot determine',
    body: 'REIE cannot determine value, listing price, sale price, timing, negotiation strategy, tax position, legal position, investment merit, representation status, or professional conclusions from this page.',
  },
];

const SELLER_PROFESSIONAL_PRIORITIES = [
  'Property condition and evidence gaps',
  'Pricing-context assumptions',
  'Buyer-objection preparation',
  'Market-exposure preparation',
  'Transaction and closing preparation',
  'Legal, tax, title, insurance, HOA, inspection, appraisal, or professional review',
];

const SELLER_PROFESSIONAL_PATHWAYS = [
  {
    label: 'Seller Review',
    href: '#seller-intake',
    body: 'Use first when property evidence, preparation gaps, or market-exposure questions are ready for seller-specific review.',
  },
  {
    label: 'Advisory',
    href: '/contact#advisory-readiness',
    body: 'Use when the next step is organizing professional questions before a focused conversation.',
  },
  {
    label: 'General Contact',
    href: '/contact#contact-route-choice',
    body: 'Use only when the customer wants to begin a general conversation without transferring Seller context.',
  },
  {
    label: 'Continue Research',
    href: '/market',
    body: 'Use when Market, Search, or Home Worth context should be reviewed before beginning a conversation.',
  },
];

export default function SellPage() {
  const sellerIntelligence = buildSellerIntelligenceAdvancement();

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
      data-dxt-2-seller-readiness-depth="implemented"
      data-dxt-2-seller-readiness-runtime-scope="app/sell/page.tsx"
      data-dxt-2-seller-readiness-existing-evidence-only="true"
      data-dxt-2-seller-readiness-estimator-change="false"
      data-dxt-2-seller-readiness-buyer-change="false"
      data-dxt-2-seller-readiness-search-change="false"
      data-dxt-2-seller-readiness-property-change="false"
      data-dxt-2-seller-readiness-market-change="false"
      data-dxt-2-seller-readiness-neighborhood-change="false"
      data-dxt-2-seller-readiness-advisory-change="false"
      data-dxt-2-seller-readiness-contact-change="false"
      data-dxt-2-seller-readiness-provider-activation="false"
      data-dxt-2-seller-readiness-api-change="false"
      data-dxt-2-seller-readiness-hidden-context="false"
      data-dxt-2-seller-readiness-persistence="false"
      data-dxt-2-seller-readiness-telemetry="false"
      data-dxt-2-seller-readiness-ai="false"
      data-dxt-2-seller-readiness-scoring="false"
      data-dxt-2-seller-readiness-ranking="false"
      data-dxt-2-seller-readiness-recommendation="false"
      data-dxt-2-seller-readiness-valuation="false"
      data-dxt-2-seller-readiness-pricing-recommendation="false"
      data-dxt-2-seller-readiness-sale-prediction="false"
      data-dxt-3-seller-professional-preparation="implemented-local"
      data-dxt-3-seller-professional-runtime-scope="app/sell/page.tsx"
      data-dxt-3-seller-professional-existing-evidence-only="true"
      data-dxt-3-seller-professional-estimator-change="false"
      data-dxt-3-seller-professional-advisory-change="false"
      data-dxt-3-seller-professional-contact-change="false"
      data-dxt-3-seller-professional-api-change="false"
      data-dxt-3-seller-professional-form-change="false"
      data-dxt-3-seller-professional-hidden-context="false"
      data-dxt-3-seller-professional-url-context="false"
      data-dxt-3-seller-professional-persistence="false"
      data-dxt-3-seller-professional-telemetry="false"
      data-dxt-3-seller-professional-customer-profile="false"
      data-dxt-3-seller-professional-shared-runtime="false"
      data-seller-intelligence-advancement={sellerIntelligence.status}
      data-seller-intelligence-dimension-count={sellerIntelligence.dimensions.length}
      data-seller-intelligence-source-trace-count={sellerIntelligence.sourceStates.length}
      data-seller-intelligence-valuation-certainty={String(sellerIntelligence.protectedBoundaries.valuationCertainty)}
      data-seller-intelligence-listing-price-recommendation={String(sellerIntelligence.protectedBoundaries.listingPriceRecommendation)}
      data-seller-intelligence-sale-prediction={String(sellerIntelligence.protectedBoundaries.salePrediction)}
      data-seller-intelligence-hidden-state-transfer={String(sellerIntelligence.protectedBoundaries.hiddenStateTransfer)}
      data-seller-intelligence-protected-class-inference={String(sellerIntelligence.protectedBoundaries.protectedClassInference)}
      data-seller-intelligence-source-activation={String(sellerIntelligence.protectedBoundaries.sourceActivation)}
      data-seller-intelligence-persistence={String(sellerIntelligence.protectedBoundaries.persistence)}
      data-seller-intelligence-telemetry={String(sellerIntelligence.protectedBoundaries.telemetry)}
      data-seller-intelligence-customer-data-mutation={String(sellerIntelligence.protectedBoundaries.customerDataMutation)}
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
        id="seller-intelligence-advancement"
        className="border-y border-white/8 bg-[#0c141c] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        data-testid="seller-intelligence-advancement"
        data-seller-intelligence-status={sellerIntelligence.status}
        data-seller-intelligence-dimensions={sellerIntelligence.dimensions.length}
        data-seller-intelligence-source-registry="true"
        data-seller-intelligence-provider-activation={String(sellerIntelligence.protectedBoundaries.sourceActivation)}
        data-seller-intelligence-hidden-state-transfer={String(sellerIntelligence.protectedBoundaries.hiddenStateTransfer)}
        data-seller-intelligence-telemetry={String(sellerIntelligence.protectedBoundaries.telemetry)}
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan-100">Seller Intelligence Advancement</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Connect property evidence to the seller decision before exposure.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/64">{sellerIntelligence.summary}</p>
            <div className="mt-6 rounded-[8px] border border-cyan-100/16 bg-cyan-100/[0.055] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100">Source and privacy boundary</p>
              <p className="mt-3 text-sm leading-7 text-white/64">
                This section uses existing public site context and source status only. It does not collect seller answers, activate
                new records, transfer hidden context, or create a customer profile.
              </p>
            </div>
            <div className="mt-5 grid gap-3">
              {sellerIntelligence.sourceStates.map((source) => (
                <div
                  key={source.sourceId}
                  className="rounded-[8px] border border-white/10 bg-black/18 p-4"
                  data-testid="seller-intelligence-source-state"
                  data-seller-intelligence-source-id={source.sourceId}
                  data-seller-intelligence-source-state={source.state}
                  data-seller-intelligence-source-claim-eligible={String(source.claimEligible)}
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.13em] text-cyan-100/70">{source.customerStatus}</p>
                  <p className="mt-2 text-sm font-black leading-5 text-white">{source.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              {sellerIntelligence.dimensions.map((dimension) => (
                <Link
                  key={dimension.key}
                  href={dimension.href}
                  className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5 text-white transition hover:border-white/24 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0c141c]"
                  data-testid="seller-intelligence-dimension"
                  data-seller-intelligence-dimension={dimension.key}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/72">{dimension.label}</span>
                  <p className="mt-3 text-sm leading-7 text-white/62">{dimension.factFrame}</p>
                  <p className="mt-3 text-xs leading-6 text-white/48">{dimension.interpretationFrame}</p>
                  <p className="mt-4 border-t border-white/10 pt-3 text-xs font-bold leading-6 text-white/58">{dimension.reviewQuestion}</p>
                </Link>
              ))}
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100/72">Decision continuity</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {sellerIntelligence.continuityLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-[8px] border border-cyan-100/12 bg-cyan-100/[0.045] p-4 text-white transition hover:border-cyan-100/28 hover:bg-cyan-100/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0c141c]"
                    data-testid="seller-intelligence-continuity-link"
                  >
                    <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-cyan-100">{link.label}</span>
                    <span className="mt-2 block text-xs leading-6 text-white/58">{link.purpose}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[8px] border border-cyan-100/16 bg-cyan-100/[0.055] p-5">
              <p className="text-sm font-bold leading-7 text-white/66">
                Seller intelligence remains evidence organization only. It does not provide valuation certainty, listing-price
                recommendation, sale prediction, protected-class inference, hidden state transfer, telemetry, persistence, source
                activation, or customer-data mutation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-y border-white/8 bg-[#0f171f] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        data-testid="dxt-2-seller-decision-readiness-depth-expansion"
        data-dxt-2-seller-readiness-role="seller-evidence-verification-assumptions-unknowns-confidence-thresholds"
        data-dxt-2-seller-readiness-confidence="qualitative-preparation-focused"
        data-dxt-2-seller-readiness-conclusion="false"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan-100">Seller Decision Readiness</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Know what is ready, what is assumed, and what still needs review.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/64">
              Continue when the remaining evidence gaps and assumptions are clear enough to identify what requires deeper Property,
              Market, pricing, or professional review.
            </p>
            <div className="mt-6 rounded-[8px] border border-cyan-100/16 bg-cyan-100/[0.055] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100">Qualitative confidence</p>
              <p className="mt-3 text-sm leading-7 text-white/64">
                Confidence is qualitative and preparation-focused. It reflects evidence completeness, assumption visibility,
                verification status, freshness, and limitation severity. It is not a valuation score, pricing confidence score,
                sale probability, time-to-sale prediction, buyer-demand score, investment score, suitability label, recommendation
                score, or hidden composite indicator.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              {SELLER_READINESS_EVIDENCE.map((item) => (
                <article key={item.label} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-100">{item.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">{item.body}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {SELLER_READINESS_VERIFICATION.map((item) => (
                <article key={item.label} className="rounded-[8px] border border-cyan-100/12 bg-cyan-100/[0.045] p-5">
                  <h3 className="text-sm font-black leading-tight text-white">{item.label}</h3>
                  <p className="mt-3 text-xs leading-6 text-white/58">{item.body}</p>
                </article>
              ))}
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100/72">Next-decision thresholds</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {SELLER_READINESS_THRESHOLDS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-[8px] border border-white/10 bg-black/16 p-4 text-white transition hover:border-white/24 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]"
                  >
                    <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-cyan-100">{item.label}</span>
                    <span className="mt-2 block text-xs leading-6 text-white/58">{item.note}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100/72">Questions to carry forward</p>
              <p className="mt-3 text-sm leading-7 text-white/62">
                Carry forward what is known, what is assumed, what is not confirmed here, which evidence needs source review,
                and which professional should verify the next question before exposure, pricing, contract, legal, tax, or closing
                decisions are made.
              </p>
            </div>

            <div className="rounded-[8px] border border-cyan-100/16 bg-cyan-100/[0.055] p-5">
              <p className="text-sm font-bold leading-7 text-white/66">
                No appraisal equivalence, valuation certainty, listing-price recommendation, sale-price prediction, guaranteed
                pricing, guaranteed sale, guaranteed timing, market-timing recommendation, automated pricing strategy, investment
                advice, legal advice, tax advice, suitability conclusion, or AI valuation or professional advice is provided here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-b border-white/8 bg-[#0c141c] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        data-testid="dxt-3-seller-professional-preparation"
        data-dxt-3-seller-professional-role="evidence-questions-priorities-pathways-boundaries"
        data-dxt-3-seller-professional-conclusion="false"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan-100">Seller Professional Preparation</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              What should I organize before beginning a professional conversation about selling?
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/64">
              Use this frame to carry existing Seller evidence, assumptions, unknowns, and verification questions into the right next
              conversation without creating a valuation, pricing decision, representation, or hidden customer profile.
            </p>
            <div className="mt-6 rounded-[8px] border border-cyan-100/16 bg-cyan-100/[0.055] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100">Next preparation steps</p>
              <p className="mt-3 text-sm leading-7 text-white/64">
                Gather public evidence, separate assumptions from unknowns, choose the right pathway, and keep private records,
                estimator inputs, pricing assumptions, and customer information out of public URLs.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              {SELLER_PROFESSIONAL_PREPARATION.map((item) => (
                <article key={item.label} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-100">{item.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">{item.body}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[8px] border border-white/10 bg-black/18 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100/72">Questions to carry forward</p>
                <p className="mt-3 text-sm leading-7 text-white/62">
                  Which evidence is ready, which items need source review, which condition or pricing assumptions matter, and which
                  professional should review title, HOA, insurance, inspection, appraisal, contract, legal, tax, or closing questions?
                </p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-black/18 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100/72">Conversation priorities</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-white/62 sm:grid-cols-2">
                  {SELLER_PROFESSIONAL_PRIORITIES.map((priority) => (
                    <li key={priority}>{priority}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100/72">Appropriate professional pathway</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {SELLER_PROFESSIONAL_PATHWAYS.map((pathway) => (
                  <Link
                    key={pathway.label}
                    href={pathway.href}
                    className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4 text-white transition hover:border-white/24 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0b1117]"
                  >
                    <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-cyan-100">{pathway.label}</span>
                    <span className="mt-2 block text-xs leading-6 text-white/58">{pathway.body}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[8px] border border-cyan-100/16 bg-cyan-100/[0.055] p-5">
              <p className="text-sm font-bold leading-7 text-white/66">
                Privacy, consent, representation, valuation, legal, tax, and professional boundaries remain unchanged. This section does not
                collect answers, save choices, prefill forms, expand URLs, transfer hidden Seller context, change consent, create
                representation, or provide professional advice.
              </p>
            </div>
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
