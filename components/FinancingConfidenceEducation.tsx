'use client';

import { BadgeDollarSign, Landmark, ListChecks, ShieldCheck, WalletCards } from 'lucide-react';

import { buildFinancingDecisionWorkspace } from '@/lib/financingDecisionWorkspace';

type FinancingConfidenceEducationProps = {
  surface: 'buy' | 'home' | 'search' | 'property' | 'market' | 'city-market' | 'neighborhood-market';
  compact?: boolean;
};

const educationItems = [
  {
    label: 'Affordability factors',
    body: 'Price range, down payment, taxes, insurance, HOA dues, reserves, maintenance, and timing can all affect comfort.',
  },
  {
    label: 'Monthly cost components',
    body: 'Principal, interest, taxes, insurance, escrow, PMI, HOA dues, utilities, and maintenance should be reviewed separately.',
  },
  {
    label: 'Cash to close',
    body: 'Down payment, closing costs, escrow setup, prepaid expenses, inspections, moving costs, and reserves may all matter before an offer.',
  },
  {
    label: 'Rate sensitivity',
    body: 'Interest-rate changes can shift buying power, so compare assumptions before relying on a price range.',
  },
];

const lenderQuestions = [
  'Which loan types, down-payment ranges, PMI rules, and reserve expectations should I understand?',
  'Which taxes, insurance, HOA dues, prepaid expenses, and closing costs are included or excluded?',
  'How would a rate change affect the range I should search?',
];

const advisorQuestions = [
  'Which property facts could affect ownership costs or negotiation strategy?',
  'Which market, timing, condition, or records questions should I verify before touring or writing?',
  'Which financing assumptions should stay with a licensed lending professional?',
];

export default function FinancingConfidenceEducation({ surface, compact = false }: FinancingConfidenceEducationProps) {
  const financingDecisionWorkspace = buildFinancingDecisionWorkspace({
    buyerHref: '#buyer-financing-confidence',
    searchHref: '/search',
    marketHref: '/market',
    advisorHref: '/contact',
  });

  return (
    <section
      className={`overflow-hidden rounded-[10px] border border-cyan-100/16 bg-[#0b131b] text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] ${
        compact ? 'p-4' : 'p-5 md:p-7'
      }`}
      data-testid="reie-financing-confidence-education"
      data-financing-confidence-surface={surface}
      data-financing-confidence-education="true"
      data-financing-confidence-advice="false"
      data-financing-confidence-workflow="false"
      data-financing-confidence-calculator="false"
      data-financing-confidence-lender-workflow="false"
      data-financing-confidence-ai="false"
      data-financing-confidence-gis="false"
      data-financing-confidence-provider-activation="false"
      data-financing-v8-ai="false"
      data-financing-v8-customer-accounts="false"
      data-financing-v8-gis="false"
      data-financing-v8-telemetry="false"
      data-financing-v8-mortgage-calculator="false"
      data-financing-v8-loan-calculator="false"
      data-financing-v8-loan-application="false"
      data-financing-v8-lender-workflow="false"
      data-financing-v8-rate-shopping="false"
      data-financing-v8-recommendation-engine="false"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/74">
            <WalletCards size={14} aria-hidden="true" />
            Financing Confidence
          </p>
          <h2 className={`${compact ? 'mt-2 text-xl' : 'mt-3 text-2xl md:text-3xl'} font-black uppercase leading-tight tracking-normal text-white`}>
            Understand the assumptions before the next step.
          </h2>
          <p className={`${compact ? 'mt-2 text-xs leading-5' : 'mt-4 text-sm leading-7'} max-w-3xl text-white/60`}>
            This is educational guidance only. It does not provide loan qualification, personalized financial advice, rate predictions,
            payment quotes, lender recommendations, or affordability conclusions.
          </p>
        </div>
        <span className="inline-flex min-h-8 shrink-0 items-center rounded-[6px] border border-emerald-100/22 bg-emerald-100/[0.08] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100">
          Education Only
        </span>
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? 'sm:grid-cols-2' : 'md:grid-cols-4'}`}>
        {educationItems.map((item) => (
          <article key={item.label} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/70">
              <BadgeDollarSign size={13} aria-hidden="true" />
              {item.label}
            </p>
            <p className="mt-3 text-xs font-bold leading-6 text-white/56">{item.body}</p>
          </article>
        ))}
      </div>

      <section
        className={`mt-5 rounded-[8px] border border-cyan-100/14 bg-cyan-100/[0.045] ${
          compact ? 'p-4' : 'p-5'
        }`}
        data-testid="reie-financing-v8-decision-workspace"
        data-financing-v8-item-count={financingDecisionWorkspace.items.length}
      >
        <div className="grid gap-4 lg:grid-cols-[0.7fr_1fr] lg:items-start">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              Financing Decision Workspace
            </p>
            <h3 className={`${compact ? 'mt-2 text-lg' : 'mt-3 text-2xl'} font-black leading-tight tracking-normal text-white`}>
              {financingDecisionWorkspace.headline}
            </h3>
            <p className={`${compact ? 'mt-2 text-xs leading-5' : 'mt-3 text-sm leading-6'} text-white/58`}>
              {financingDecisionWorkspace.orientation}
            </p>
            <p className="mt-4 rounded-[8px] border border-white/10 bg-black/16 p-3 text-xs font-bold leading-5 text-white/48">
              {financingDecisionWorkspace.trustBoundary}
            </p>
          </div>
          <div className={`grid gap-2 ${compact ? '' : 'sm:grid-cols-2'}`}>
            {financingDecisionWorkspace.items.map((item) => (
              <a
                key={item.lens}
                href={item.href}
                className="reie-decision-link reie-decision-link--card group rounded-[8px] bg-white/[0.045] p-3 ring-1 ring-white/[0.08] transition hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                data-testid="reie-financing-v8-decision-item"
                data-financing-v8-lens={item.lens}
                data-financing-v8-action={item.action}
              >
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-cyan-100/68">{item.label}</p>
                <p className="mt-2 text-[11px] font-bold leading-5 text-white/54">{item.guidance}</p>
                <span className="mt-3 block text-[9px] font-black uppercase tracking-[0.14em] text-cyan-100/76 group-hover:text-white">
                  {item.action}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className={`mt-4 grid gap-3 ${compact ? '' : 'lg:grid-cols-2'}`}>
        <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/66">
            <Landmark size={13} aria-hidden="true" />
            Questions for a lender
          </p>
          <ul className="mt-3 grid gap-2 text-xs font-bold leading-5 text-white/56">
            {lenderQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/66">
            <ListChecks size={13} aria-hidden="true" />
            Questions for your real estate advisor
          </p>
          <ul className="mt-3 grid gap-2 text-xs font-bold leading-5 text-white/56">
            {advisorQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-[8px] border border-amber-100/16 bg-amber-100/[0.06] p-3 text-xs font-bold leading-5 text-white/58">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-100/78" aria-hidden="true" />
        Keep confidential financial limits, negotiating positions, and personal financing details out of public forms until the appropriate
        professional relationship and secure intake path are confirmed.
      </p>
    </section>
  );
}
