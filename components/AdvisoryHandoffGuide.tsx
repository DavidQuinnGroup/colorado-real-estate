import Link from 'next/link';

import ProfessionalHandoffCohesionPanel from '@/components/ProfessionalHandoffCohesionPanel';
import { buildAdvisoryPreparationIntelligenceModel } from '@/lib/homeWorthAdvisoryIntelligence';

const preparationThemes = [
  {
    label: 'Decision to discuss',
    body: 'Name the choice in front of you: buy, sell, evaluate a property, interpret a market, or compare places.',
  },
  {
    label: 'Timing and pressure',
    body: 'Separate practical timing from items that should wait for qualified review before action.',
  },
  {
    label: 'Evidence already reviewed',
    body: 'Bring the property, search, market, city, or neighborhood context that shaped your question.',
  },
  {
    label: 'Assumptions to verify',
    body: 'List financing, pricing, condition, timing, or readiness assumptions without treating them as conclusions.',
  },
  {
    label: 'Open evidence gaps',
    body: 'Identify incomplete, stale, conflicting, or unsupported facts that should be clarified before reliance.',
  },
  {
    label: 'Professional questions',
    body: 'Flag legal, tax, lending, title, insurance, HOA, permit, condition, environmental, or valuation questions early.',
  },
];

const journeyTopics = [
  {
    label: 'Buyer preparation',
    body: 'Search, offer, financing, insurance, and cash-planning assumptions can be discussed without implying approval or qualification.',
  },
  {
    label: 'Seller preparation',
    body: 'Property records, preparation, buyer objections, pricing context, and timing should be organized before market exposure.',
  },
  {
    label: 'Market interpretation',
    body: 'Use Market and City Market evidence as briefing context, not timing certainty, investment advice, or a buy/sell conclusion.',
  },
  {
    label: 'Neighborhood investigation',
    body: 'Use place orientation and housing context to form neutral verification questions, not fit, safety, school, or ranking claims.',
  },
  {
    label: 'Property evaluation',
    body: 'Property-specific facts, records, condition signals, and source limits should be verified before they guide action.',
  },
  {
    label: 'General decision review',
    body: 'Bring tradeoffs from REIE planning surfaces so the conversation can clarify what still matters without forcing a decision.',
  },
];

const reviewedEvidence = [
  'Search criteria, public views, or listings that raised a specific question.',
  'Property facts, photos, records, condition signals, and source limitations.',
  'Buyer or seller preparation assumptions that need qualified interpretation.',
  'Market, City Market, or Neighborhood context that should be verified before reliance.',
];

const preparationFrame = [
  {
    label: 'Decision being prepared',
    body: 'Name whether the conversation is about a property, search comparison, buyer readiness, seller preparation, market context, or general next steps.',
  },
  {
    label: 'Evidence reviewed or available',
    body: 'Use only visible public context from REIE surfaces, such as property facts, readiness prompts, search context, market evidence, or route-specific questions.',
  },
  {
    label: 'Evidence still needed',
    body: 'Separate what is not confirmed here from what may require source review, updated records, specialist review, or direct professional discussion.',
  },
  {
    label: 'Assumptions',
    body: 'Keep financing, pricing, timing, condition, market, or transaction assumptions visible without treating them as advice or conclusions.',
  },
  {
    label: 'Unknowns',
    body: 'Call out unresolved facts, stale context, missing documents, source limits, and items that depend on the specific property, market, financing, or transaction.',
  },
  {
    label: 'Questions to verify',
    body: 'Organize questions for source, property, lender, inspection, title, HOA, insurance, legal, tax, appraisal, contract, or other professional review.',
  },
];

const conversationPriorities = [
  'Property facts and condition',
  'Search and comparison questions',
  'Financing assumptions',
  'Market evidence',
  'Seller preparation',
  'Title, HOA, insurance, inspection, or contract questions',
  'General professional preparation',
];

const pathwayChoices = [
  {
    label: 'Advisory prepares',
    body: 'Use Advisory to organize evidence, assumptions, unknowns, questions, and conversation priorities before reaching out.',
  },
  {
    label: 'Contact begins',
    body: 'Use Contact when the question is ready for a general conversation and no hidden route context needs to transfer.',
  },
  {
    label: 'Property Inquiry stays specialized',
    body: 'Use the existing property-page inquiry path for address-specific questions, fields, consent, and submission behavior.',
  },
];

const verificationQuestions = [
  'Which property-specific facts should be verified before relying on this context?',
  'Which financing assumptions belong with a qualified lender or other professional?',
  'Which title, ownership, HOA, insurance, permit, zoning, condition, or environmental questions remain open?',
  'Which market or pricing context needs professional interpretation rather than a certainty claim?',
  'Which timing, contingency, or transaction-strategy questions should be discussed before action?',
];

const researchLinks = [
  { label: 'Buyer Guidance', href: '/buy', destination: 'buyer' },
  { label: 'Seller Guidance', href: '/sell', destination: 'seller' },
  { label: 'Search Homes', href: '/search', destination: 'search' },
  { label: 'Market Context', href: '/market', destination: 'market' },
  { label: 'Grand Plan', href: '/grand-plan', destination: 'grand-plan' },
];

export default function AdvisoryHandoffGuide() {
  const advisoryPreparation = buildAdvisoryPreparationIntelligenceModel();

  return (
    <section
      id="advisory-readiness"
      className="scroll-mt-24 min-w-0 break-words rounded-[8px] bg-white/[0.03] px-5 py-8 ring-1 ring-white/[0.06] sm:px-7 sm:py-10 lg:px-10"
      data-testid="advisory-handoff-readiness-guide"
      data-advisory-experience-phase="phase-1-structural-productization"
      data-advisory-experience-model="single-advisory-experience"
      data-advisory-journey-context-model="generic-single-experience-with-static-topics"
      data-advisory-contact-strategy="preparation-then-contact"
      data-advisory-handoff-surface="contact"
      data-advisory-handoff-route="/contact#advisory-readiness"
      data-advisory-handoff-presentational="true"
      data-advisory-handoff-persistence="false"
      data-advisory-handoff-automation="false"
      data-advisory-handoff-personalization="false"
      data-advisory-handoff-hidden-context-transfer="false"
      data-advisory-handoff-new-contact-fields="false"
      data-advisory-handoff-crm="false"
      data-advisory-handoff-lead-routing="false"
      data-advisory-handoff-lead-scoring="false"
      data-advisory-handoff-email="false"
      data-advisory-handoff-alerts="false"
      data-advisory-handoff-telemetry="false"
      data-advisory-handoff-provider-activation="false"
      data-advisory-handoff-evidence-metadata-exposure="false"
      data-dxt-3-advisory-conversation-preparation="implemented-local"
      data-dxt-3-advisory-runtime-scope="components/AdvisoryHandoffGuide.tsx"
      data-dxt-3-advisory-contact-host-change="false"
      data-dxt-3-advisory-property-inquiry-change="false"
      data-dxt-3-advisory-form-change="false"
      data-dxt-3-advisory-api-change="false"
      data-dxt-3-advisory-url-context="false"
      data-dxt-3-advisory-form-prefill="false"
      data-dxt-3-advisory-customer-profile="false"
      data-advisory-preparation-intelligence-status={advisoryPreparation.status}
      data-advisory-preparation-context-count={advisoryPreparation.contexts.length}
      data-advisory-preparation-domain-count={advisoryPreparation.professionalDomains.length}
      data-advisory-hidden-search-transfer={String(advisoryPreparation.protectedBoundaries.hiddenSearchTransfer)}
      data-advisory-hidden-comparison-transfer={String(advisoryPreparation.protectedBoundaries.hiddenComparisonTransfer)}
      data-advisory-hidden-financing-transfer={String(advisoryPreparation.protectedBoundaries.hiddenFinancingTransfer)}
      data-advisory-hidden-grand-plan-transfer={String(advisoryPreparation.protectedBoundaries.hiddenGrandPlanTransfer)}
      data-advisory-hidden-seller-transfer={String(advisoryPreparation.protectedBoundaries.hiddenSellerTransfer)}
      data-advisory-inferred-intent-transfer={String(advisoryPreparation.protectedBoundaries.inferredIntentTransfer)}
      data-advisory-browsing-behavior-transfer={String(advisoryPreparation.protectedBoundaries.browsingBehaviorTransfer)}
      data-advisory-protected-class-data-transfer={String(advisoryPreparation.protectedBoundaries.protectedClassDataTransfer)}
      data-advisory-new-required-fields={String(advisoryPreparation.protectedBoundaries.newRequiredFields)}
      data-advisory-contact-mutation={String(advisoryPreparation.protectedBoundaries.contactMutation)}
      data-advisory-property-inquiry-mutation={String(advisoryPreparation.protectedBoundaries.propertyInquiryMutation)}
      data-advisory-crm-email={String(advisoryPreparation.protectedBoundaries.crmEmail)}
      data-advisory-scheduling={String(advisoryPreparation.protectedBoundaries.scheduling)}
      data-advisory-lead-scoring={String(advisoryPreparation.protectedBoundaries.leadScoring)}
      data-advisory-telemetry={String(advisoryPreparation.protectedBoundaries.telemetry)}
      data-advisory-brokerage-relationship={String(advisoryPreparation.protectedBoundaries.brokerageRelationship)}
      data-advisory-agency-relationship={String(advisoryPreparation.protectedBoundaries.agencyRelationship)}
      data-advisory-representation={String(advisoryPreparation.protectedBoundaries.representation)}
      data-advisory-fiduciary-relationship={String(advisoryPreparation.protectedBoundaries.fiduciaryRelationship)}
      data-advisory-lender-relationship={String(advisoryPreparation.protectedBoundaries.lenderRelationship)}
      data-advisory-legal-relationship={String(advisoryPreparation.protectedBoundaries.legalRelationship)}
      data-advisory-tax-advisory-relationship={String(advisoryPreparation.protectedBoundaries.taxAdvisoryRelationship)}
      data-advisory-appraisal-relationship={String(advisoryPreparation.protectedBoundaries.appraisalRelationship)}
      data-advisory-provider-activation={String(advisoryPreparation.protectedBoundaries.providerActivation)}
    >
      <div className="mx-auto grid max-w-5xl gap-10 text-sm leading-7 text-white/66">
        <div className="grid gap-7 lg:grid-cols-[1.04fr_0.96fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-100/78">Advisory Readiness</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl">
              What should I understand and prepare before beginning a focused professional conversation?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
              Advisory prepares the conversation before Contact begins it. Use this handoff to organize what you know,
              identify what remains unresolved, and decide which questions need a qualified professional before you
              share sensitive details or ask for next-step guidance.
            </p>
            <div className="mt-7 flex">
              <Link
                href="#advisory-contact-transition"
                className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-cyan-100 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#041018] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                data-advisory-handoff-destination="contact"
                data-advisory-handoff-primary-action="begin-focused-conversation"
              >
                Begin A Focused Conversation
              </Link>
            </div>
          </div>

          <div
            className="rounded-[8px] bg-amber-100/[0.055] p-5 text-xs font-bold leading-6 text-white/62 ring-1 ring-amber-100/14"
            data-testid="advisory-handoff-boundary"
          >
            You do not need every answer before reaching out. REIE helps organize questions; it does not determine legal,
            tax, lending, appraisal, inspection, engineering, insurance, title, valuation, suitability, or investment
            outcomes.
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr]" data-testid="advisory-handoff-advisor-role">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Advisor Role</p>
            <h3 className="mt-3 text-xl font-black leading-tight text-white">
              Turn REIE research into the first useful discussion.
            </h3>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/62">
            A real-estate advisor can help interpret choices, organize open questions, identify where specialists may
            be needed, and clarify next steps. Advisory does not create representation by itself, create outcome
            certainty, or replace qualified professional review.
          </p>
        </div>

        <div
          className="grid gap-5 rounded-[8px] bg-white/[0.035] p-5"
          data-testid="dxt-3-advisory-conversation-preparation"
        >
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              Advisory Conversation Preparation
            </p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white">
              Organize the conversation before the conversation begins.
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/62">
              Use this public preparation frame to distinguish visible evidence from assumptions, unknowns, and
              questions. It is static, does not save choices, does not prefill forms, and does not transfer hidden
              route context into Contact or Property Inquiry.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {preparationFrame.map((item) => (
              <article key={item.label} className="rounded-[8px] bg-[#071017]/72 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100/72">{item.label}</p>
                <p className="mt-2 text-sm leading-7 text-white/58">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]" data-testid="dxt-3-advisory-conversation-priorities">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
                Conversation Priorities
              </p>
              <p className="mt-3 text-sm leading-7 text-white/62">
                Pick a static topic to focus the discussion. Advisory does not create selection state, scoring, lead
                classification, customer profiling, or telemetry.
              </p>
            </div>
            <ul className="grid gap-2 text-sm leading-7 text-white/62 sm:grid-cols-2">
              {conversationPriorities.map((priority) => (
                <li key={priority} className="rounded-[8px] bg-white/[0.035] px-4 py-3">
                  {priority}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3 lg:grid-cols-3" data-testid="dxt-3-advisory-pathway-choice">
            {pathwayChoices.map((pathway) => (
              <article key={pathway.label} className="rounded-[8px] bg-cyan-100/[0.045] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100/72">{pathway.label}</p>
                <p className="mt-2 text-sm leading-7 text-white/58">{pathway.body}</p>
              </article>
            ))}
          </div>
          <div
            className="rounded-[8px] bg-amber-100/[0.055] p-4 text-sm leading-7 text-white/62 ring-1 ring-amber-100/14"
            data-testid="dxt-3-advisory-reie-limits"
          >
            REIE cannot determine legal, tax, lending, affordability, qualification, appraisal, valuation, pricing,
            investment, suitability, fair-housing, representation, fiduciary, or professional outcomes. It can organize
            the questions that should be reviewed through the appropriate professional pathway.
          </div>
        </div>

        <ProfessionalHandoffCohesionPanel surface="advisory" density="compact" />

        <div className="grid gap-5 rounded-[8px] bg-white/[0.035] p-5" data-testid="advisory-preparation-intelligence">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              Advisory Preparation Intelligence
            </p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white">
              Route each open question to the right professional discussion.
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/62">{advisoryPreparation.governingQuestion}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {advisoryPreparation.contexts.map((context) => (
              <article key={context.key} className="rounded-[8px] bg-[#071017]/72 p-4" data-testid="advisory-decision-context">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100/72">{context.label}</p>
                <p className="mt-2 text-sm leading-7 text-white/58">{context.knownEvidence}</p>
                <p className="mt-3 text-xs font-bold leading-6 text-white/48">{context.unresolved}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-white/66">{context.nextQuestion}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {advisoryPreparation.professionalDomains.map((domain) => (
              <article
                key={domain.key}
                className="rounded-[8px] bg-cyan-100/[0.045] p-4"
                data-testid="advisory-professional-domain-route"
                data-advisory-professional-domain={domain.key}
              >
                <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100/72">{domain.label}</p>
                <p className="mt-2 text-sm leading-7 text-white/58">
                  <span className="font-black text-white/76">Route by: </span>
                  {domain.routeBy}
                </p>
                <p className="mt-2 text-sm leading-7 text-white/58">
                  <span className="font-black text-white/76">Bring: </span>
                  {domain.bring}
                </p>
                <p className="mt-3 rounded-[6px] bg-[#071017]/72 p-3 text-xs font-bold leading-6 text-white/48">
                  {domain.boundary}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div id="advisory-preparation-themes" className="grid gap-4" data-testid="advisory-handoff-preparation-themes">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              Conversation Preparation
            </p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white">Bring a clear decision, not a perfect answer.</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {preparationThemes.map((theme) => (
              <article key={theme.label} className="rounded-[8px] bg-white/[0.035] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100/72">{theme.label}</p>
                <p className="mt-2 text-sm leading-7 text-white/58">{theme.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4" data-testid="advisory-handoff-journey-context-groups">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Decision Context</p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white">Static contexts only, chosen by the customer.</h3>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {journeyTopics.map((topic) => (
              <article key={topic.label} className="rounded-[8px] bg-white/[0.035] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100/72">{topic.label}</p>
                <p className="mt-2 text-sm leading-7 text-white/58">{topic.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div
          className="grid gap-5 rounded-[8px] bg-white/[0.035] p-5 lg:grid-cols-[0.78fr_1.22fr]"
          data-testid="advisory-handoff-reviewed-evidence"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Evidence Already Reviewed</p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white">Bring the evidence that shaped the question.</h3>
          </div>
          <ul className="grid gap-3 text-sm leading-7 text-white/62">
            {reviewedEvidence.map((item) => (
              <li key={item} className="rounded-[8px] bg-[#071017]/72 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]" data-testid="advisory-handoff-questions-to-bring">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Professional Discussion</p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white">Separate prompts from conclusions.</h3>
          </div>
          <ul className="grid gap-3 text-sm leading-7 text-white/62">
            {verificationQuestions.map((question) => (
              <li key={question} className="rounded-[8px] bg-white/[0.035] px-4 py-3">
                {question}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="grid gap-5 rounded-[8px] bg-cyan-100/[0.045] p-5 lg:grid-cols-2"
          data-testid="advisory-handoff-evidence-aware-framing"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              Evidence And Professional Boundaries
            </p>
            <p className="mt-3 text-sm leading-7 text-white/62">
              Evidence may differ in freshness, available support, permitted use, and completeness. Citywide context may
              not apply to a specific property, and incomplete or conflicting information may require title, municipal,
              insurance, lending, inspection, legal, tax, environmental, or other qualified professional review.
            </p>
          </div>
          <div data-testid="advisory-handoff-privacy-expectations">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              What Advisory Does Not Establish
            </p>
            <p className="mt-3 text-sm leading-7 text-white/62">
              This public preparation experience does not create a saved workspace, automatically transfer planner inputs,
              require uploads, present a hidden lead score, create an inferred financial profile, establish a brokerage relationship, create representation, approve financing, determine affordability, publish an appraisal,
              certify valuation, guarantee pricing, guarantee outcomes, rank providers, or make suitability conclusions.
            </p>
          </div>
        </div>

        <div
          id="advisory-contact-transition"
          className="grid gap-5 rounded-[8px] bg-white/[0.04] p-5 lg:grid-cols-[1fr_0.82fr] lg:items-center"
          data-testid="advisory-handoff-contact-transition"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Contact Transition</p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white">Use Contact when the questions are organized.</h3>
            <p className="mt-3 text-sm leading-7 text-white/62">
              This handoff uses the existing Contact behavior. It does not create a generic form, change fields, submit customer information, create CRM work, send email, schedule a meeting, or pass hidden context. Submitting
              any existing inquiry is for follow-up routing only and does not automatically create a brokerage relationship.
              You choose what to share in Contact; REIE does not silently carry search, comparison, Grand Plan, financing,
              seller, property, browsing, or route history into the conversation.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-white/[0.06] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-white/[0.11] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            data-advisory-handoff-destination="contact"
          >
            Contact David Quinn Group
          </Link>
        </div>

        <nav
          className="flex flex-wrap gap-2"
          aria-label="Advisory handoff research continuations"
          data-testid="advisory-handoff-continuity"
        >
          {researchLinks.map((link) => (
            <Link
              key={link.destination}
              href={link.href}
              className="rounded-[6px] bg-[#071017]/72 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-100/[0.11] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              data-advisory-handoff-destination={link.destination}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
