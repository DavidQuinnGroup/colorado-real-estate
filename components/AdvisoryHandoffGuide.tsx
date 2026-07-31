import Link from 'next/link';

const journeyContextGroups = [
  {
    label: 'Compare',
    body: 'Bring the city or market tradeoffs that still need neighborhood, property, or qualified-source review.',
  },
  {
    label: 'Buy',
    body: 'Name the search, property, timing, inspection, and offer questions that should be clarified before acting.',
  },
  {
    label: 'Finance',
    body: 'Keep lender, insurance, tax, and cash-planning questions ready for the qualified professionals who handle them.',
  },
  {
    label: 'Sell',
    body: 'Separate preparation, records, property details, and pricing-conversation topics before requesting seller guidance.',
  },
  {
    label: 'Prepare',
    body: 'Organize facts, documents, and assumptions without uploading them or asking REIE to decide the outcome.',
  },
  {
    label: 'Verify',
    body: 'Identify which citywide, property-specific, legal, title, inspection, lending, or insurance questions need review.',
  },
  {
    label: 'Discuss',
    body: 'Use the conversation to sequence next steps, understand process, and decide what requires specialist input.',
  },
];

const conversationPrompts = [
  'What decision am I trying to make?',
  'Which markets, properties, or paths am I considering?',
  'What did I learn from REIE that still needs human context?',
  'Which assumptions remain uncertain?',
  'Which property-specific issues need verification?',
  'Which timing, financing, or seller-readiness topics need professional review?',
  'Which documents or facts may be useful to have available?',
  'What outcome am I trying to understand without presuming a decision for me?',
];

const questionsToBring = [
  {
    title: 'Buyer and financing',
    items: [
      'Which search or financing assumptions should be verified?',
      'Which questions belong with a lender or other qualified professional?',
      'Which market, property, condition, insurance, HOA, or offer questions need further review?',
    ],
  },
  {
    title: 'Seller preparation',
    items: [
      'Which preparation steps matter for this property?',
      'Which records or property details should be reviewed before pricing discussions?',
      'Which specialists may be appropriate before a listing plan is shaped?',
    ],
  },
  {
    title: 'Comparison and market',
    items: [
      'Which tradeoffs deserve deeper investigation?',
      'Which citywide context requires neighborhood or property-specific review?',
      'Which evidence limitations, incomplete facts, or conflicting details should be clarified?',
    ],
  },
  {
    title: 'Grand Plan',
    items: [
      'Which sequencing, timing, buy-sell coordination, or advisory questions remain?',
      'Which next step should be considered before moving from research into action?',
    ],
  },
];

const continuityLinks = [
  { label: 'Contact / Advisory', href: '/contact', destination: 'contact' },
  { label: 'Compare Cities', href: '/compare', destination: 'comparison' },
  { label: 'Buyer Guidance', href: '/buy', destination: 'buyer' },
  { label: 'Financing Readiness', href: '/buy#financing-readiness', destination: 'financing-readiness' },
  { label: 'Seller Guidance', href: '/sell', destination: 'seller' },
  { label: 'Seller Readiness', href: '/home-worth#seller-readiness', destination: 'seller-readiness' },
  { label: 'Market Context', href: '/market', destination: 'market' },
  { label: 'Grand Plan', href: '/grand-plan', destination: 'grand-plan' },
];

export default function AdvisoryHandoffGuide() {
  return (
    <section
      id="advisory-readiness"
      className="public-trust-card scroll-mt-24 min-w-0 break-words bg-white/[0.03] p-5 ring-1 ring-white/[0.06] sm:p-6"
      data-testid="advisory-handoff-readiness-guide"
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
      <p className="public-trust-card-title text-sm font-black uppercase tracking-[0.16em] text-cyan-100/78">
        Advisory Readiness
      </p>
      <div className="mt-4 grid gap-7 text-sm leading-7 text-white/62">
        <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-black leading-tight tracking-normal text-white">
              Prepare the conversation without turning preparation into a decision.
            </h2>
            <p className="mt-4">
              Advisory support can help connect market and city context, comparison tradeoffs, buyer readiness,
              financing-readiness questions, seller preparation, property-specific questions, due-diligence priorities,
              and next-step sequencing.
            </p>
          </div>
          <div
            className="rounded-[8px] border border-amber-100/16 bg-amber-100/[0.055] p-4 text-xs font-bold leading-6 text-white/58"
            data-testid="advisory-handoff-boundary"
          >
            REIE provides informational decision support. Customer priorities are not inferred, and an advisor
            conversation does not replace legal, tax, lending, appraisal, inspection, engineering, insurance, title,
            or other qualified professional review.
          </div>
        </div>

        <div data-testid="advisory-handoff-conversation-prompts">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
            Conversation Preparation
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {conversationPrompts.map((prompt) => (
              <li key={prompt} className="border-l border-cyan-100/24 pl-3">
                {prompt}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-2" data-testid="advisory-handoff-journey-context-groups">
          {journeyContextGroups.map((group) => (
            <article key={group.label} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{group.label}</p>
              <p className="mt-2 text-xs font-bold leading-6 text-white/56">{group.body}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2" data-testid="advisory-handoff-questions-to-bring">
          {questionsToBring.map((group) => (
            <section key={group.title} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/68">{group.title}</p>
              <ul className="mt-3 grid gap-2 text-xs font-bold leading-6 text-white/58">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div
          className="grid gap-4 rounded-[8px] border border-cyan-100/14 bg-cyan-100/[0.045] p-4 lg:grid-cols-[0.86fr_1.14fr]"
          data-testid="advisory-handoff-evidence-aware-framing"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              Evidence-Aware Framing
            </p>
            <p className="mt-3 text-xs font-bold leading-6 text-white/58">
              Evidence may differ in freshness, available support, permitted use, and completeness. Citywide context
              may not apply to a specific property, and incomplete or conflicting information may require further review.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              Advisor Role
            </p>
            <p className="mt-3 text-xs font-bold leading-6 text-white/58">
              A real-estate advisor can help organize the decision, explain process, connect certified REIE context to
              your questions, identify where specialists may be needed, and sequence next actions without guaranteeing
              an outcome.
            </p>
          </div>
        </div>

        <nav className="grid gap-2 sm:grid-cols-2" aria-label="Advisory handoff next steps" data-testid="advisory-handoff-continuity">
          {continuityLinks.map((link) => (
            <Link
              key={link.destination}
              href={link.href}
              className="rounded-[6px] border border-white/10 bg-[#071017]/72 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-100/[0.11] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
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
