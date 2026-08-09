import type { Metadata } from 'next';
import Link from 'next/link';

import BuyerFinancingReadinessGuide from '@/components/BuyerFinancingReadinessGuide';
import FinancingConfidenceEducation from '@/components/FinancingConfidenceEducation';
import JourneyCohesionPanel from '@/components/JourneyCohesionPanel';
import { buildBuyerDecisionIntelligenceModel } from '@/lib/buyerPlaceIntelligenceAdvancement';
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

const BUYER_READINESS_EVIDENCE = [
  {
    label: 'Available now',
    body: 'Buyer preparation themes, the Buyer Decision Workspace, financing-readiness education, Search paths, Market context, Property verification prompts, and professional handoff guidance are visible here.',
  },
  {
    label: 'Needs verification',
    body: 'Lender requirements, final rate and terms, taxes, insurance, HOA obligations, inspection findings, title matters, contract terms, closing costs, and final cash requirements need source or professional review.',
  },
  {
    label: 'Assumption',
    body: 'Budget range, timing, search criteria, decision partners, financing readiness, and property tradeoffs are preparation assumptions until verified against a lender, property, and transaction.',
  },
  {
    label: 'Unknown from current evidence',
    body: 'The Buyer route does not confirm approval, qualification, affordability, buying power, credit readiness, underwriting outcome, lender fit, or whether a specific property is the right next step.',
  },
];

const BUYER_READINESS_VERIFICATION = [
  {
    label: 'Financing-readiness verification',
    body: 'Use the financing education to name questions for a lender or financial professional; do not treat this route as approval, preapproval, affordability, buying power, underwriting, credit, rate, or closing-cost certainty.',
  },
  {
    label: 'Property and transaction verification',
    body: 'Open Property evidence when condition, taxes, insurance, HOA, title, inspection, records, disclosures, contract timing, or offer strategy becomes the decision point.',
  },
  {
    label: 'Questions to carry forward',
    body: 'Carry forward what is known, what is assumed, what remains unverified, which evidence is stale or incomplete, and which professional needs to review the next question.',
  },
];

const BUYER_READINESS_THRESHOLDS = [
  {
    label: 'Continue Search',
    href: '/search',
    note: 'Use when criteria, location, inventory, or comparison still needs visible alternatives.',
  },
  {
    label: 'Review financing assumptions',
    href: '#buyer-financing-confidence',
    note: 'Use when lender, cash, payment, timing, or closing-cost assumptions need clearer questions.',
  },
  {
    label: 'Open a Property',
    href: '/search',
    note: 'Use when the next decision depends on address-level condition, records, costs, or tradeoffs.',
  },
  {
    label: 'Understand Market context',
    href: '/market',
    note: 'Use when current inventory, timing, or local alternatives need broader context.',
  },
  {
    label: 'Prepare Advisory questions',
    href: '/contact#advisory-readiness',
    note: 'Use when the assumptions and unknowns are clear enough for a focused professional discussion.',
  },
  {
    label: 'Begin general Contact',
    href: '/contact#contact-route-choice',
    note: 'Use only when the customer is ready to begin a general conversation without hidden Buyer context.',
  },
];

const BUYER_PROFESSIONAL_HANDOFF_STEPS = [
  {
    label: 'Bring the decision context',
    body: 'Know which homes, financing assumptions, timing questions, and property tradeoffs still shape the buying decision.',
  },
  {
    label: 'Separate preparation from the conversation',
    body: 'Use Advisory to organize the questions a professional should discuss; use Contact only when the conversation is ready to begin.',
  },
  {
    label: 'Keep financial questions with the right professional',
    body: 'Carry lender, tax, insurance, title, inspection, and legal questions forward without treating this page as approval or advice.',
  },
];

const BUYER_HANDOFF_BOUNDARIES = [
  'Buyer preparation does not approve financing, determine affordability, calculate buying power, rank lenders, or provide underwriting guidance.',
  'Advisory prepares the conversation; it does not create representation, legal advice, tax advice, lending approval, investment advice, suitability conclusions, or assured outcomes.',
  'Contact begins a general conversation and does not receive hidden Buyer context, saved searches, planner inputs, financial assumptions, or customer information from this page.',
];

const BUYER_PROFESSIONAL_PREPARATION_EVIDENCE = [
  {
    label: 'Evidence available now',
    body: 'Buyer preparation themes, the Buyer Decision Workspace, financing-readiness education, Search paths, Market context, Property verification prompts, and Advisory and Contact continuations are available in this public Buyer experience.',
  },
  {
    label: 'Evidence still needing verification',
    body: 'Lender requirements, loan terms, taxes, insurance, HOA obligations, inspection findings, title matters, contract terms, closing costs, cash needed, and Property-specific facts require source or professional review.',
  },
  {
    label: 'Assumptions',
    body: 'Budget range, timing, criteria, decision partners, financing readiness, daily-life tradeoffs, and Property priorities remain preparation assumptions until reviewed with the appropriate professional or source.',
  },
  {
    label: 'Unknowns',
    body: 'This page does not confirm lender requirements, Property condition, insurability, title status, appraisal review, contract obligations, legal or tax issues, or whether a specific home is the right next step.',
  },
];

const BUYER_PROFESSIONAL_PREPARATION_QUESTIONS = [
  'Which financing assumptions should be reviewed by a lender or financial professional before they shape a search?',
  'Which Property facts, condition signals, HOA details, title matters, insurance questions, or inspection issues need source review?',
  'Which Search or Market signals are context only, and which raise questions for a focused conversation?',
  'Which contract, timing, legal, tax, appraisal, or closing questions should be carried to the appropriate professional?',
];

const BUYER_PROFESSIONAL_PREPARATION_PRIORITIES = [
  {
    label: 'Financing assumptions',
    body: 'Prepare questions about lender review, cash needed, payment assumptions, closing costs, and documentation without treating this page as a financing decision.',
  },
  {
    label: 'Property verification',
    body: 'Prepare questions about condition, records, inspection, title, HOA, insurance, and other address-level facts before relying on a specific home.',
  },
  {
    label: 'Transaction preparation',
    body: 'Prepare questions about timing, contract terms, contingencies, professional review, and what remains unresolved before the next step.',
  },
];

const BUYER_PROFESSIONAL_PREPARATION_PATHWAYS = [
  {
    label: 'Advisory',
    href: '/contact#advisory-readiness',
    body: 'Use when the Buyer evidence, assumptions, unknowns, and questions need focused organization before a professional conversation.',
  },
  {
    label: 'General Contact',
    href: '/contact#contact-route-choice',
    body: 'Use when the conversation is ready to begin and the need is not limited to one Property or a single verification topic.',
  },
  {
    label: 'Continue Search',
    href: '/search',
    body: 'Use when more inventory, comparison, or Property-level evidence should be reviewed before outreach.',
  },
];

export default function BuyPage() {
  const buyerDecisionIntelligence = buildBuyerDecisionIntelligenceModel();
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
      data-buyer-advisory-contact-continuity="implemented"
      data-buyer-advisory-contact-runtime-scope="app/buy/page.tsx"
      data-buyer-advisory-contact-hidden-context="false"
      data-buyer-advisory-contact-url-context="false"
      data-buyer-advisory-contact-form-change="false"
      data-buyer-advisory-contact-api-change="false"
      data-buyer-advisory-contact-crm="false"
      data-buyer-advisory-contact-email="false"
      data-buyer-advisory-contact-scheduling="false"
      data-dxt-2-buyer-readiness-depth="implemented"
      data-dxt-2-buyer-readiness-runtime-scope="app/buy/page.tsx"
      data-dxt-2-buyer-readiness-existing-evidence-only="true"
      data-dxt-2-buyer-readiness-financing-tool-change="false"
      data-dxt-2-buyer-readiness-search-change="false"
      data-dxt-2-buyer-readiness-property-change="false"
      data-dxt-2-buyer-readiness-seller-change="false"
      data-dxt-2-buyer-readiness-advisory-change="false"
      data-dxt-2-buyer-readiness-contact-change="false"
      data-dxt-2-buyer-readiness-provider-activation="false"
      data-dxt-2-buyer-readiness-api-change="false"
      data-dxt-2-buyer-readiness-hidden-context="false"
      data-dxt-2-buyer-readiness-persistence="false"
      data-dxt-2-buyer-readiness-telemetry="false"
      data-dxt-2-buyer-readiness-ai="false"
      data-dxt-2-buyer-readiness-scoring="false"
      data-dxt-2-buyer-readiness-ranking="false"
      data-dxt-2-buyer-readiness-recommendation="false"
      data-dxt-2-buyer-readiness-qualification="false"
      data-dxt-2-buyer-readiness-affordability="false"
      data-dxt-2-buyer-readiness-buying-power="false"
      data-buyer-place-intelligence-advancement="implemented"
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

      <section
        className="px-5 pb-12 sm:px-8 lg:px-12"
        data-testid="buyer-intelligence-advancement"
        data-buyer-intelligence-status={buyerDecisionIntelligence.status}
        data-buyer-intelligence-lane-count={buyerDecisionIntelligence.lanes.length}
        data-buyer-intelligence-source-count={buyerDecisionIntelligence.sourceRecords.length}
        data-buyer-intelligence-offer-price-certainty={String(buyerDecisionIntelligence.protectedBoundaries.offerPriceCertainty)}
        data-buyer-intelligence-guaranteed-acceptance={String(buyerDecisionIntelligence.protectedBoundaries.guaranteedAcceptanceStrategy)}
        data-buyer-intelligence-valuation-appraisal-certainty={String(
          buyerDecisionIntelligence.protectedBoundaries.valuationAppraisalCertainty,
        )}
        data-buyer-intelligence-affordability-judgment={String(buyerDecisionIntelligence.protectedBoundaries.affordabilityJudgment)}
        data-buyer-intelligence-investment-recommendation={String(
          buyerDecisionIntelligence.protectedBoundaries.investmentRecommendation,
        )}
        data-buyer-intelligence-legal-advice={String(buyerDecisionIntelligence.protectedBoundaries.legalAdvice)}
        data-buyer-intelligence-inspection-conclusion={String(buyerDecisionIntelligence.protectedBoundaries.inspectionConclusion)}
        data-buyer-intelligence-lending-qualification={String(buyerDecisionIntelligence.protectedBoundaries.lendingQualification)}
        data-buyer-intelligence-hidden-suitability-scoring={String(
          buyerDecisionIntelligence.protectedBoundaries.hiddenSuitabilityScoring,
        )}
        data-buyer-intelligence-hidden-state-transfer={String(buyerDecisionIntelligence.protectedBoundaries.hiddenStateTransfer)}
        data-buyer-intelligence-persistence={String(buyerDecisionIntelligence.protectedBoundaries.persistence)}
        data-buyer-intelligence-telemetry={String(buyerDecisionIntelligence.protectedBoundaries.telemetry)}
        data-buyer-intelligence-crm-email={String(buyerDecisionIntelligence.protectedBoundaries.crmEmail)}
        data-buyer-intelligence-provider-activation={String(buyerDecisionIntelligence.protectedBoundaries.providerActivation)}
        data-buyer-intelligence-api-change={String(buyerDecisionIntelligence.protectedBoundaries.apiChange)}
        data-dxt-buyer-hierarchy-role="buyer-property-comparison-financing-place-professional-intelligence"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 border border-cyan-100/14 bg-white/[0.035] p-5 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Buyer Intelligence</p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl">
                What should I understand, compare, verify, and prepare before deciding whether to pursue a property?
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/62">{buyerDecisionIntelligence.governingQuestion}</p>
              <p className="mt-5 border border-cyan-100/12 bg-cyan-100/[0.045] p-4 text-xs font-bold leading-6 text-cyan-100/70">
                This layer uses visible REIE route context only. It organizes facts, meaning, open questions, and verification actions; it does not
                carry private choices into Search, Compare, Grand Plan, Advisory, or Contact.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {buyerDecisionIntelligence.lanes.map((lane) => (
                <Link
                  key={lane.key}
                  href={lane.href}
                  className="border border-white/10 bg-[#071017]/74 p-4 text-white no-underline transition hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                  data-testid="buyer-intelligence-lane"
                  data-buyer-intelligence-lane={lane.key}
                  data-buyer-intelligence-source-ids={lane.sourceIds.join(',')}
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{lane.label}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-white/36">Fact</p>
                  <p className="mt-1 text-xs leading-6 text-white/58">{lane.fact}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-white/36">Meaning</p>
                  <p className="mt-1 text-xs leading-6 text-white/58">{lane.meaning}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-white/36">Open question</p>
                  <p className="mt-1 text-xs leading-6 text-white/58">{lane.openQuestion}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-cyan-100/72">Verification / next action</p>
                  <p className="mt-1 text-xs leading-6 text-white/58">{lane.verificationAction}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4 border border-white/10 bg-black/18 p-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Source posture</p>
              <p className="mt-3 text-xs leading-6 text-white/50">
                Source Registry records remain status-controlled. Boulder County Assessor stays awaiting provider confirmation and is used only as
                a verification prompt, not retrieved evidence.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {buyerDecisionIntelligence.sourceRecords.map((record) => (
                <div key={record.sourceId} className="border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/68">{record.sourceId}</p>
                  <p className="mt-2 text-xs font-bold leading-5 text-white/58">{record.customerStatus}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3" data-testid="buyer-intelligence-continuity">
            {buyerDecisionIntelligence.continuityLinks.map((link) => (
              <Link key={link.label} href={link.href} className={secondaryButtonClass} data-buyer-intelligence-destination={link.destination}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-5 pb-12 sm:px-8 lg:px-12"
        data-testid="dxt-2-buyer-decision-readiness-depth-expansion"
        data-dxt-buyer-hierarchy-role="decision-readiness-depth"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 border border-cyan-100/14 bg-[#071017]/86 p-5 sm:p-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Buyer Decision Readiness</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl">
              Decide what is prepared, what is assumed, and what must be verified before the next buying step.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/62">
              This readiness frame organizes existing Buyer preparation evidence only. It does not use customer-specific financial data,
              create a score, change financing tools, or determine whether a customer is qualified, approved, able to afford, or ready to buy.
            </p>
            <p className="mt-5 border border-cyan-100/12 bg-cyan-100/[0.045] p-4 text-xs font-bold leading-6 text-cyan-100/70">
              Confidence is qualitative and preparation-focused: evidence completeness, assumption visibility, verification status,
              freshness, and limitation severity. It is not an approval probability, affordability score, buying-power score, lender
              score, credit interpretation, or recommendation.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {BUYER_READINESS_EVIDENCE.map((item) => (
                <article key={item.label} className="border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{item.label}</p>
                  <p className="mt-3 text-xs leading-6 text-white/58">{item.body}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-3 border border-white/10 bg-black/18 p-4 md:grid-cols-3">
              {BUYER_READINESS_VERIFICATION.map((item) => (
                <article key={item.label}>
                  <h3 className="text-sm font-black leading-tight text-white">{item.label}</h3>
                  <p className="mt-3 text-xs leading-6 text-white/56">{item.body}</p>
                </article>
              ))}
            </div>

            <div className="border border-cyan-100/12 bg-cyan-100/[0.035] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Next-decision thresholds</p>
              <p className="mt-3 text-xs leading-6 text-white/50">
                Continue when the remaining assumptions and unknowns are clear enough to identify what requires deeper Search,
                Property, lender, Market, Advisory, or professional review. Do not treat this as a recommendation to buy or make an offer.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {BUYER_READINESS_THRESHOLDS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="border border-white/10 bg-[#071017]/78 p-4 text-white no-underline transition hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/72">{item.label}</span>
                    <span className="mt-2 block text-xs leading-5 text-white/50">{item.note}</span>
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-xs leading-6 text-white/42">
                No loan approval, lending eligibility decision, affordability result, buying-capacity conclusion, underwriting outcome,
                credit interpretation, lender ordering, loan-product recommendation, individual financial advice, investment advice, tax advice,
                legal advice, suitability conclusion, hidden context, persistence, telemetry, or AI advice is created here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="px-5 pb-12 sm:px-8 lg:px-12"
        data-testid="dxt-3-buyer-professional-preparation"
        data-dxt-3-buyer-professional-preparation="implemented-local"
        data-dxt-3-buyer-professional-runtime-scope="app/buy/page.tsx"
        data-dxt-3-buyer-professional-existing-evidence-only="true"
        data-dxt-3-buyer-professional-financing-planner-change="false"
        data-dxt-3-buyer-professional-search-change="false"
        data-dxt-3-buyer-professional-property-change="false"
        data-dxt-3-buyer-professional-seller-change="false"
        data-dxt-3-buyer-professional-advisory-change="false"
        data-dxt-3-buyer-professional-contact-change="false"
        data-dxt-3-buyer-professional-api-change="false"
        data-dxt-3-buyer-professional-form-change="false"
        data-dxt-3-buyer-professional-hidden-context="false"
        data-dxt-3-buyer-professional-url-context="false"
        data-dxt-3-buyer-professional-persistence="false"
        data-dxt-3-buyer-professional-telemetry="false"
        data-dxt-3-buyer-professional-customer-profile="false"
        data-dxt-3-buyer-professional-shared-runtime="false"
        data-dxt-buyer-hierarchy-role="professional-preparation"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 border border-cyan-100/14 bg-white/[0.035] p-5 sm:p-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Buyer Professional Preparation</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl">
              What should I organize before beginning a professional conversation about buying?
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/62">
              Use this preparation frame to organize public Buyer evidence, assumptions, unknowns, and questions before Advisory or
              Contact. It does not collect answers, save choices, transfer hidden context, prefill forms, or use Buyer Financing Planner inputs.
            </p>
            <p className="mt-5 border border-cyan-100/12 bg-cyan-100/[0.045] p-4 text-xs font-bold leading-6 text-cyan-100/70">
              What REIE cannot determine: lender decisions, loan terms, approval, qualification, affordability, buying power, underwriting,
              credit readiness, lender fit, legal or tax outcomes, valuation, investment merit, suitability, representation, or professional advice.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {BUYER_PROFESSIONAL_PREPARATION_EVIDENCE.map((item) => (
                <article key={item.label} className="border border-white/10 bg-[#071017]/72 p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{item.label}</p>
                  <p className="mt-3 text-xs leading-6 text-white/58">{item.body}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-3 border border-white/10 bg-black/18 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Questions to carry forward</p>
              <div className="grid gap-2">
                {BUYER_PROFESSIONAL_PREPARATION_QUESTIONS.map((question) => (
                  <p key={question} className="border border-white/10 bg-white/[0.035] p-3 text-xs font-bold leading-6 text-white/58">
                    {question}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {BUYER_PROFESSIONAL_PREPARATION_PRIORITIES.map((priority) => (
                <article key={priority.label} className="border border-cyan-100/12 bg-cyan-100/[0.04] p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/70">Conversation priority</p>
                  <h3 className="mt-2 text-sm font-black leading-tight text-white">{priority.label}</h3>
                  <p className="mt-3 text-xs leading-6 text-white/56">{priority.body}</p>
                </article>
              ))}
            </div>

            <div className="border border-cyan-100/12 bg-[#071017]/78 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Appropriate professional pathway</p>
              <p className="mt-3 text-xs leading-6 text-white/50">
                Next preparation steps depend on what remains unresolved. Advisory organizes the focused conversation, Contact begins a
                general conversation, and Search continues evidence gathering. Property-specific questions still belong with the Property route.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {BUYER_PROFESSIONAL_PREPARATION_PATHWAYS.map((pathway) => (
                  <Link
                    key={pathway.label}
                    href={pathway.href}
                    className="border border-white/10 bg-white/[0.035] p-4 text-white no-underline transition hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/72">{pathway.label}</span>
                    <span className="mt-2 block text-xs leading-5 text-white/50">{pathway.body}</span>
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-xs leading-6 text-white/42">
                Privacy, representation, and professional boundaries: this page uses visible public context only and does not create
                consent, representation, fiduciary duties, customer records, CRM classification, email, scheduling, persistence, telemetry,
                customer profiles, URL context, hidden transfer, recommendations, scores, or professional conclusions.
              </p>
            </div>
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

      <section
        className="px-5 pb-12 sm:px-8 lg:px-12"
        data-testid="reie-buyer-professional-handoff"
        data-buyer-handoff-question="After preparing to buy, what should I understand before beginning a focused professional conversation?"
        data-buyer-handoff-primary-action="search-preparation"
        data-buyer-handoff-advisory="/contact#advisory-readiness"
        data-buyer-handoff-contact="/contact#contact-route-choice"
        data-buyer-handoff-hidden-context="false"
        data-buyer-handoff-url-context="false"
        data-buyer-handoff-form-change="false"
        data-buyer-handoff-api-change="false"
        data-buyer-handoff-crm="false"
        data-buyer-handoff-email="false"
        data-buyer-handoff-scheduling="false"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 border border-white/10 bg-white/[0.035] p-6 sm:p-8 lg:grid-cols-[0.7fr_1fr] lg:items-start">
          <div>
            <p className="text-[10px] font-black uppercase text-cyan-100/72">Professional Handoff</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-white">
              After preparing to buy, what should I understand before beginning a focused professional conversation?
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/62">
              Keep Buyer preparation focused on the buying decision. Continue searching when criteria still need comparison, use Advisory
              when assumptions need organizing, and use Contact only when the general conversation is ready to begin.
            </p>
            <div className="mt-6 flex flex-wrap gap-3" data-testid="buyer-handoff-actions">
              <Link href="/search" className={primaryButtonClass} data-buyer-handoff-action="search-preparation">
                Continue Buyer Search
              </Link>
              <Link href="/contact#advisory-readiness" className={secondaryButtonClass} data-buyer-handoff-action="advisory-preparation">
                Prepare Advisory Questions
              </Link>
              <Link href="/contact#contact-route-choice" className={secondaryButtonClass} data-buyer-handoff-action="general-contact">
                Start General Contact
              </Link>
            </div>
            <p className="mt-4 text-xs leading-6 text-white/46">
              These links do not attach Buyer context to Advisory or Contact. Keep confidential financial limits, lender details, and private
              notes out of any public URL.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {BUYER_PROFESSIONAL_HANDOFF_STEPS.map((step) => (
                <article key={step.label} className="border border-cyan-100/12 bg-cyan-100/[0.045] p-4">
                  <h3 className="text-sm font-black leading-tight text-white">{step.label}</h3>
                  <p className="mt-3 text-xs leading-6 text-white/58">{step.body}</p>
                </article>
              ))}
            </div>
            <div className="grid gap-2">
              {BUYER_HANDOFF_BOUNDARIES.map((boundary) => (
                <p key={boundary} className="border border-white/10 bg-black/18 p-3 text-xs font-bold leading-6 text-white/52">
                  {boundary}
                </p>
              ))}
            </div>
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
                { label: 'Advisory Guidance', href: '/contact#advisory-readiness', note: 'Prepare questions', destination: 'advisory' },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/buy/page.tsx
