import Link from 'next/link';
import { ClipboardList, FileText, Home, MapPinned, MessageSquareText, ShieldCheck } from 'lucide-react';

type ReadinessGroup = {
  title: string;
  description: string;
  items: string[];
};

const preparationChecklist: ReadinessGroup[] = [
  {
    title: 'Review',
    description: 'Start with the visible and practical details that may shape a seller conversation.',
    items: [
      'property condition documentation',
      'known repairs and improvements',
      'maintenance history',
      'presentation and showing preparation',
    ],
  },
  {
    title: 'Gather',
    description: 'Organize records that may help an advisor understand the property more quickly.',
    items: [
      'permits and project records',
      'warranties and specialist reports',
      'HOA or association materials where applicable',
      'ownership, title, survey, or plan documents for qualified review',
    ],
  },
  {
    title: 'Verify',
    description: 'Separate general preparation from matters that require qualified sources.',
    items: [
      'insurance questions',
      'municipal or HOA requirements',
      'inspection, structural, environmental, or other specialist questions',
      'occupancy, access, lease, or timing considerations where applicable',
    ],
  },
];

const documentationInventory: ReadinessGroup[] = [
  {
    title: 'Property history',
    description: 'Useful context may include work completed, maintenance patterns, and known-condition documentation.',
    items: ['improvement records', 'repair records', 'maintenance logs', 'prior inspection or specialist reports'],
  },
  {
    title: 'Ownership and rules',
    description: 'Some properties benefit from early review of ownership, association, or occupancy records.',
    items: ['title or ownership records', 'surveys or plans', 'HOA documents', 'leases or occupancy documents where applicable'],
  },
  {
    title: 'Professional discussion',
    description: 'Some records are better discussed with the right professional before they shape a listing plan.',
    items: ['insurance records', 'permits and approvals', 'property-specific disclosures', 'specialist or contractor documentation'],
  },
];

const propertyContextPrompts = [
  'Which systems, components, additions, conversions, or updates deserve review before a pricing conversation?',
  'Which known maintenance items should be documented, repaired, monitored, or discussed with a qualified professional?',
  'Which municipal, HOA, title, survey, insurance, environmental, structural, or inspection questions should be verified before launch?',
];

const marketContextPrompts = [
  'Which local alternatives might a buyer compare against this property?',
  'Which city or market context should be reviewed before deciding how to present the property?',
  'Which property-specific strengths, constraints, or preparation questions should be discussed with an advisor rather than assumed?',
];

const advisoryQuestions = [
  'Which preparation steps matter most for this property?',
  'Which records would make the pricing conversation more useful?',
  'Which improvements should be evaluated before assuming they affect value?',
  'Which specialists or qualified sources may be appropriate before listing?',
];

export default function SellerReadinessGuide() {
  return (
    <section
      id="seller-readiness"
      className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
      data-testid="seller-readiness-guide"
      data-seller-readiness-surface="home-worth"
      data-seller-readiness-route="/home-worth#seller-readiness"
      data-seller-readiness-valuation="false"
      data-seller-readiness-pricing-output="false"
      data-seller-readiness-score="false"
      data-seller-readiness-persistence="false"
      data-seller-readiness-upload="false"
      data-seller-readiness-crm-automation="false"
      data-seller-readiness-email="false"
      data-seller-readiness-alerts="false"
      data-seller-readiness-telemetry="false"
      data-seller-readiness-ai="false"
      data-seller-readiness-provider-activation="false"
    >
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100">Seller Readiness</p>
            <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-normal text-white sm:text-5xl">
              Prepare the review before asking for a pricing conversation.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/66 sm:text-lg">
              Readiness means organizing facts, documentation, property context, market questions, and professional-review topics before
              making pricing or timing decisions.
            </p>
            <div
              className="mt-7 rounded-[8px] border border-cyan-100/16 bg-cyan-100/[0.055] p-4 text-sm font-bold leading-7 text-white/58"
              data-testid="seller-readiness-boundary"
            >
              Seller Readiness is not a valuation, appraisal, pricing recommendation, sale-timing prediction, or recommendation to sell.
              Every property is different, and general preparation guidance cannot replace property-specific advisor or qualified-source review.
            </div>
          </div>

          <div className="grid gap-4" data-testid="seller-readiness-preparation-checklist">
            {preparationChecklist.map((group) => (
              <article key={group.title} className="rounded-[8px] bg-white/[0.055] p-6 ring-1 ring-white/10">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-cyan-100/12 text-cyan-100">
                    <ClipboardList size={19} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{group.title}</p>
                    <h3 className="mt-2 text-xl font-black leading-tight text-white">{group.description}</h3>
                    <ul className="mt-4 grid gap-2 text-sm leading-7 text-white/64">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-100/54" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3" data-testid="seller-readiness-documentation-inventory">
          {documentationInventory.map((group) => (
            <article key={group.title} className="rounded-[8px] bg-[#0b1117] p-6 ring-1 ring-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-white/[0.06] text-cyan-100">
                <FileText size={18} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-black leading-tight text-white">{group.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/58">{group.description}</p>
              <ul className="mt-5 grid gap-2 text-sm leading-7 text-white/64">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <article className="rounded-[8px] bg-white/[0.045] p-6 ring-1 ring-white/10" data-testid="seller-readiness-property-context">
            <Home size={22} className="text-cyan-100" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-black leading-tight text-white">Property-context prompts</h3>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-white/62">
              {propertyContextPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-[8px] bg-white/[0.045] p-6 ring-1 ring-white/10" data-testid="seller-readiness-market-context">
            <MapPinned size={22} className="text-cyan-100" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-black leading-tight text-white">Market-context review</h3>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Market context can help frame preparation questions and buyer alternatives. It should not be treated as a pricing instruction,
              appreciation estimate, demand forecast, or timing directive.
            </p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-white/62">
              {marketContextPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-[8px] bg-white/[0.045] p-6 ring-1 ring-white/10" data-testid="seller-readiness-advisory-preparation">
            <MessageSquareText size={22} className="text-cyan-100" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-black leading-tight text-white">Advisory preparation</h3>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-white/62">
              {advisoryQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </article>
        </div>

        <div
          className="mt-14 grid gap-5 rounded-[8px] border border-white/10 bg-[#101820] p-6 sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
          data-testid="seller-readiness-next-step-continuity"
        >
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-cyan-100/12 text-cyan-100">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-2xl font-black leading-tight text-white">Use readiness to prepare a better conversation.</h3>
            <p className="mt-4 text-sm leading-7 text-white/60">
              REIE does not evaluate the owner, certify condition, or determine marketability. Use these prompts to decide what to gather,
              verify, and discuss with qualified professionals.
            </p>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2" aria-label="Seller readiness next steps">
            <Link className="home-btn home-btn-primary" href="/sell" data-testid="seller-readiness-cta" data-seller-readiness-destination="seller-guidance">
              Seller Guidance
            </Link>
            <Link className="home-btn home-btn-secondary" href="/market" data-testid="seller-readiness-cta" data-seller-readiness-destination="market-context">
              Market Context
            </Link>
            <Link className="home-btn home-btn-secondary" href="/grand-plan" data-testid="seller-readiness-cta" data-seller-readiness-destination="grand-plan">
              Grand Plan
            </Link>
            <Link className="home-btn home-btn-secondary" href="/contact" data-testid="seller-readiness-cta" data-seller-readiness-destination="advisory">
              Advisory Guidance
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
