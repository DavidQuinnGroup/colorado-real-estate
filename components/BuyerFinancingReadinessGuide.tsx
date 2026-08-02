import Link from 'next/link';

import BuyerFinancingDecisionPlanner from './BuyerFinancingDecisionPlanner';

const preparationGroups = [
  {
    label: 'Review',
    body: 'Clarify the assumptions that should be checked before you rely on a search range, offer timeline, or property-specific cost question.',
  },
  {
    label: 'Gather',
    body: 'Organize records that a qualified lender or advisor may ask to review, without entering or uploading financial details here.',
  },
  {
    label: 'Verify',
    body: 'Identify which financing, insurance, HOA, tax, and property-condition questions need current professional confirmation.',
  },
  {
    label: 'Discuss',
    body: 'Bring focused questions into lender and advisory conversations before treating any assumption as ready for a purchase decision.',
  },
];

const documentationItems = [
  'income documentation',
  'employment history',
  'asset records',
  'debt obligations',
  'identification',
  'tax records',
  'rental or housing history',
  'gift-fund documentation where applicable',
  'business or self-employment records where applicable',
  'property-related cost questions',
  'insurance and HOA questions',
];

const assumptionPrompts = [
  'Target purchase range as a personal planning assumption, not a REIE conclusion.',
  'Down-payment assumptions, closing-cost questions, reserves, and emergency-fund considerations.',
  'Recurring property costs such as taxes, insurance, HOA dues, maintenance, utilities, and other ownership expenses.',
  'Timing, documentation, rate-lock, and loan-term questions for qualified lender review.',
  'How property type, condition, HOA requirements, insurance, occupancy, or repairs may require additional lender review.',
];

const lenderQuestions = [
  'Which documents apply to my situation, property type, and financing program?',
  'Which assumptions could change payment requirements, cash needed, or underwriting review?',
  'Which costs should I ask about before making an offer?',
  'What should be verified before relying on an approval timeline or rate-lock term?',
  'Which property characteristics may require additional lender, insurance, HOA, or specialist review?',
];

const continuityLinks = [
  {
    label: 'Buyer Guidance',
    href: '/buy',
    destination: 'buyer-guidance',
    note: 'Return to the full buyer journey',
  },
  {
    label: 'Financing Confidence',
    href: '/buy#financing-confidence',
    destination: 'financing-confidence',
    note: 'Review the certified education boundary',
  },
  {
    label: 'Search Homes',
    href: '/search',
    destination: 'search',
    note: 'Explore inventory after assumptions are organized',
  },
  {
    label: 'Market Context',
    href: '/market',
    destination: 'market-context',
    note: 'Use market information as preparation, not a financial conclusion',
  },
  {
    label: 'Grand Plan',
    href: '/grand-plan',
    destination: 'grand-plan',
    note: 'Connect financing questions to timing and next steps',
  },
  {
    label: 'Advisory Guidance',
    href: '/contact#advisory-readiness',
    destination: 'advisory',
    note: 'Prepare focused questions for human review',
  },
];

export default function BuyerFinancingReadinessGuide() {
  return (
    <section
      id="financing-readiness"
      className="scroll-mt-24 rounded-[10px] border border-cyan-100/16 bg-[#0b131b] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-7"
      data-testid="buyer-financing-readiness-guide"
      data-buyer-financing-readiness-surface="buy"
      data-buyer-financing-readiness-route="/buy#financing-readiness"
      data-buyer-financing-readiness-calculator="false"
      data-buyer-financing-readiness-payment-estimate="false"
      data-buyer-financing-readiness-rate-output="false"
      data-buyer-financing-readiness-qualification="false"
      data-buyer-financing-readiness-affordability="false"
      data-buyer-financing-readiness-lender-matching="false"
      data-buyer-financing-readiness-financial-input="false"
      data-buyer-financing-readiness-upload="false"
      data-buyer-financing-readiness-persistence="false"
      data-buyer-financing-readiness-crm-automation="false"
      data-buyer-financing-readiness-email="false"
      data-buyer-financing-readiness-alerts="false"
      data-buyer-financing-readiness-telemetry="false"
      data-buyer-financing-readiness-ai="false"
      data-buyer-financing-readiness-provider-activation="false"
      data-buyer-financing-readiness-score="false"
    >
      <div className="grid gap-5 lg:grid-cols-[0.72fr_1fr] lg:items-start">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">
            Buyer Financing Readiness
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-normal text-white">
            Organize financing questions before they shape the search.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
            Financing readiness means organizing documents, assumptions, questions, and professional conversations before
            making financing or property decisions.
          </p>
          <p className="mt-4 max-w-2xl rounded-[8px] border border-amber-100/16 bg-amber-100/[0.06] p-4 text-xs font-bold leading-6 text-white/56">
            It is not preapproval, qualification, affordability determination, payment calculation, rate quote, loan recommendation,
            financial advice, or a guarantee of financing. Current details should be verified with
            qualified lending, tax, legal, insurance, and real-estate professionals where appropriate.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {preparationGroups.map((group) => (
            <article key={group.label} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{group.label}</p>
              <p className="mt-3 text-xs font-bold leading-6 text-white/56">{group.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section
          className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5"
          data-testid="buyer-financing-readiness-documentation-checklist"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/68">
            Documentation Checklist
          </p>
          <p className="mt-3 text-xs font-bold leading-6 text-white/56">
            These are common records to discuss with qualified professionals. They are not requested, uploaded, stored,
            or transmitted here, and not every item applies to every buyer or financing program.
          </p>
          <ul className="mt-4 grid gap-2 text-xs font-bold leading-5 text-white/58 sm:grid-cols-2">
            {documentationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5"
          data-testid="buyer-financing-readiness-assumption-prompts"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/68">
            Financing Assumption Prompts
          </p>
          <ul className="mt-4 grid gap-3 text-xs font-bold leading-6 text-white/58">
            {assumptionPrompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
        </section>
      </div>

      <BuyerFinancingDecisionPlanner />

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.82fr_1fr]">
        <section
          className="rounded-[8px] border border-cyan-100/14 bg-cyan-100/[0.045] p-5"
          data-testid="buyer-financing-readiness-lender-questions"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
            Questions For A Lender
          </p>
          <ul className="mt-4 grid gap-3 text-xs font-bold leading-6 text-white/58">
            {lenderQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5"
          data-testid="buyer-financing-readiness-context-boundary"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/68">
            Financing Confidence, Market Context, And Advisory
          </p>
          <p className="mt-3 text-xs font-bold leading-6 text-white/58">
            Financing Confidence is an educational preparation framework and a way to organize questions and next steps.
            It is not a credit decision, qualification result, or affordability conclusion.
          </p>
          <p className="mt-3 text-xs font-bold leading-6 text-white/58">
            Market and property context can help frame what to verify, but REIE does not conclude that a market is
            affordable, that a buyer can afford a property, that financing will be available, or that one city or
            property type is financially superior.
          </p>
          <p className="mt-3 text-xs font-bold leading-6 text-white/58">
            Use this preparation to ask better questions of qualified lenders, real-estate advisors, insurance
            professionals, and tax or legal professionals where appropriate.
          </p>
        </section>
      </div>

      <nav
        className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Buyer financing readiness next steps"
        data-testid="buyer-financing-readiness-continuity"
      >
        {continuityLinks.map((link) => (
          <Link
            key={link.destination}
            href={link.href}
            className="group rounded-[8px] border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
            data-buyer-financing-readiness-destination={link.destination}
          >
            <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              {link.label}
            </span>
            <span className="mt-2 block text-xs font-bold leading-5 text-white/54">{link.note}</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
