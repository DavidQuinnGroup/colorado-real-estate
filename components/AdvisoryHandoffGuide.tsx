import Link from 'next/link';

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
  'Search criteria, saved views, or listings that raised a specific question.',
  'Property facts, photos, records, condition signals, and source limitations.',
  'Buyer or seller preparation assumptions that need qualified interpretation.',
  'Market, City Market, or Neighborhood context that should be verified before reliance.',
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
            be needed, and clarify next steps. Advisory does not create representation by itself, guarantee a result,
            or replace qualified professional review.
          </p>
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
