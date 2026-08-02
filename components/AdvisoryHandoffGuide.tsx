import Link from 'next/link';

const preparationThemes = [
  {
    label: 'Goals and next decision',
    body: 'Name the decision you are trying to make before asking anyone to solve it for you.',
  },
  {
    label: 'Timeline',
    body: 'Separate time-sensitive questions from items that can wait for professional review.',
  },
  {
    label: 'Property, market, or neighborhood context',
    body: 'Bring the REIE context that still needs property-specific or qualified-source verification.',
  },
  {
    label: 'Financing or seller readiness',
    body: 'List assumptions to verify without turning them into approval, pricing, or readiness conclusions.',
  },
  {
    label: 'Evidence gaps',
    body: 'Identify incomplete, conflicting, or unsupported facts that should be clarified before relying on them.',
  },
  {
    label: 'Unresolved professional questions',
    body: 'Flag legal, tax, lending, title, insurance, HOA, permit, condition, or environmental questions early.',
  },
];

const journeyTopics = [
  {
    label: 'Buy and finance',
    body: 'Search, offer, timing, lender, insurance, and cash-planning questions belong in the conversation without implying qualification.',
  },
  {
    label: 'Sell and prepare',
    body: 'Seller readiness, property records, repairs, and pricing discussions should be organized before a listing plan is shaped.',
  },
  {
    label: 'Search, market, and place',
    body: 'Use search, city, market, and neighborhood context as starting points for review, not as suitability conclusions.',
  },
  {
    label: 'Property and evidence',
    body: 'Property-specific facts, source limitations, and evidence gaps should be verified before they guide action.',
  },
  {
    label: 'Grand Plan and timing',
    body: 'Sequencing, buy-sell coordination, and next-step timing can be discussed without forcing a decision.',
  },
  {
    label: 'Compare and decide',
    body: 'Bring tradeoffs from Compare or other REIE surfaces so the conversation can clarify what still matters.',
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
              Prepare the conversation before you contact an advisor.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
              Advisory is the next step after REIE research: organize what you know, identify what remains unresolved,
              and decide which questions need a qualified professional before you move from research into conversation.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-cyan-100 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#041018] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                data-advisory-handoff-destination="contact"
              >
                Talk Through The Decision
              </Link>
              <Link
                href="#advisory-preparation-themes"
                className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-white/[0.06] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-white/[0.11] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                data-advisory-handoff-destination="preparation"
              >
                Review Preparation
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
              Turn research into a prepared conversation.
            </h3>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/62">
            A real-estate advisor can help interpret choices, organize questions, connect your REIE research to the
            conversation, identify where specialists may be needed, and clarify next steps without guaranteeing an
            outcome or replacing qualified professional review.
          </p>
        </div>

        <div id="advisory-preparation-themes" className="grid gap-4" data-testid="advisory-handoff-preparation-themes">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              Conversation Preparation
            </p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white">Bring the right questions, not a perfect answer.</h3>
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
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Journey Topics</p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white">A single advisory path for the decisions REIE supports.</h3>
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

        <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]" data-testid="advisory-handoff-questions-to-bring">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Items To Verify</p>
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
              Privacy Expectations
            </p>
            <p className="mt-3 text-sm leading-7 text-white/62">
              This public preparation experience does not create a saved workspace, automatically transfer planner inputs,
              require uploads, present a hidden lead score, or create an inferred financial profile. Preparation can happen
              before sharing sensitive details.
            </p>
          </div>
        </div>

        <div
          className="grid gap-5 rounded-[8px] bg-white/[0.04] p-5 lg:grid-cols-[1fr_0.82fr] lg:items-center"
          data-testid="advisory-handoff-contact-transition"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Contact Transition</p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white">Contact when the questions are organized.</h3>
            <p className="mt-3 text-sm leading-7 text-white/62">
              Use the existing contact path when you are ready to discuss the research, unresolved items, and professional
              verification needs. Submitting an inquiry is for follow-up routing only and does not automatically create a
              brokerage relationship.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-cyan-100 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#041018] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
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
