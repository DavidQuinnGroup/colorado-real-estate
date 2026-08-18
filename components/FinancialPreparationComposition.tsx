import Link from 'next/link';
import { ArrowUpRight, CircleHelp, ClipboardList, Coins, House, ShieldCheck, Truck } from 'lucide-react';

import {
  buildFinancialPreparationCompositionModel,
  type ReieFinancialPreparationCompositionSurface,
} from '@/lib/financialPreparationComposition';

type FinancialPreparationCompositionProps = {
  surface: ReieFinancialPreparationCompositionSurface;
};

const surfaceCopy: Record<ReieFinancialPreparationCompositionSurface, { eyebrow: string; title: string; body: string }> = {
  buy: {
    eyebrow: 'Module 6 Financial Preparation',
    title: 'Make the questions visible before the numbers shape the decision.',
    body: 'Use the existing planner for user-entered arithmetic, then keep assumptions, missing inputs, ownership costs, and professional questions separate.',
  },
  'grand-plan': {
    eyebrow: 'Financial Preparation Lens',
    title: 'Carry financial questions into the Grand Plan without carrying hidden financial state.',
    body: 'The Grand Plan can organize unresolved assumptions, timing dependencies, transition costs, and professional questions without ranking or recommending.',
  },
  advisory: {
    eyebrow: 'Financial Questions For Professional Review',
    title: 'Bring focused financial questions to the right professional.',
    body: 'This public preparation layer helps organize questions for lender, tax, title, insurance, inspection, contractor, and real-estate review.',
  },
};

export default function FinancialPreparationComposition({ surface }: FinancialPreparationCompositionProps) {
  const model = buildFinancialPreparationCompositionModel();
  const copy = surfaceCopy[surface];

  return (
    <section
      className="rounded-[8px] border border-cyan-100/14 bg-cyan-100/[0.035] p-5 text-white md:p-6"
      data-testid="reie-financial-preparation-composition"
      data-financial-preparation-surface={surface}
      data-financial-preparation-version={model.version}
      data-financial-preparation-presentation={model.presentationClassification}
      data-financial-preparation-orchestration={model.orchestrationClassification}
      data-financial-preparation-persistence={String(model.protectedBoundaries.persistence)}
      data-financial-preparation-hidden-transfer={String(model.protectedBoundaries.hiddenTransfer)}
      data-financial-preparation-provider-data={String(model.protectedBoundaries.providerData)}
      data-financial-preparation-lender-data={String(model.protectedBoundaries.lenderData)}
      data-financial-preparation-recommendation={String(model.protectedBoundaries.recommendation)}
      data-financial-preparation-affordability={String(model.protectedBoundaries.affordability)}
      data-financial-preparation-qualification={String(model.protectedBoundaries.qualification)}
      data-financial-preparation-investment-output={String(model.protectedBoundaries.investmentOutput)}
      data-financial-preparation-net-proceeds-conclusion={String(model.protectedBoundaries.netProceedsConclusion)}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">
            <ClipboardList size={14} aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-black leading-tight tracking-normal text-white">{copy.title}</h2>
          <p className="mt-3 text-sm leading-6 text-white/58">{copy.body}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-[6px] border border-emerald-100/18 bg-emerald-100/[0.06] px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-100">
          <ShieldCheck size={13} aria-hidden="true" />
          Preparation Only
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <article className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4" data-testid="financial-assumption-inventory">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/70"><ClipboardList size={13} aria-hidden="true" />Assumption Inventory</p>
          <ul className="mt-3 grid gap-2 text-xs font-bold leading-5 text-white/58">{model.assumptionInventory.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4" data-testid="financial-missing-inputs">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/70"><CircleHelp size={13} aria-hidden="true" />Missing Inputs To Verify</p>
          <ul className="mt-3 grid gap-2 text-xs font-bold leading-5 text-white/58">{model.missingInputs.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4" data-testid="financial-ownership-cost-categories">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/66"><Coins size={13} aria-hidden="true" />Ownership Cost Categories</p>
          <ul className="mt-3 grid gap-2 text-xs font-bold leading-5 text-white/58">{model.ownershipCostCategories.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <article className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4" data-testid="financial-capex-preparation">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/66"><House size={13} aria-hidden="true" />CAPEX And Maintenance</p>
          <ul className="mt-3 grid gap-2 text-xs font-bold leading-5 text-white/58">{model.capexPreparationQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4" data-testid="financial-moving-cost-preparation">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/66"><Truck size={13} aria-hidden="true" />Moving Cost Preparation</p>
          <ul className="mt-3 grid gap-2 text-xs font-bold leading-5 text-white/58">{model.movingCostCategories.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4" data-testid="financial-net-proceeds-input-checklist">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/66"><Coins size={13} aria-hidden="true" />Net Proceeds Inputs</p>
          <ul className="mt-3 grid gap-2 text-xs font-bold leading-5 text-white/58">{model.netProceedsRequiredInputs.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </div>

      <div className="mt-4 rounded-[8px] border border-cyan-100/12 bg-cyan-100/[0.035] p-4" data-testid="financial-professional-question-groups">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/72">Questions For The Right Professional</p>
            <p className="mt-2 text-xs font-bold leading-5 text-white/56">Select what applies, then bring the question to the appropriate professional. No provider or referral is selected here.</p>
          </div>
          <Link href="/contact#advisory-readiness" className="inline-flex shrink-0 items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100 transition hover:text-white" data-financial-preparation-destination="advisory">
            Prepare Advisory Questions <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {model.professionalQuestionGroups.map((group) => <div key={group.role} className="rounded-[6px] bg-black/16 p-3"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/68">{group.label}</p><p className="mt-2 text-xs leading-5 text-white/54">{group.questions[0]}</p></div>)}
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs font-bold leading-5 text-white/48"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-100/70" aria-hidden="true" />This preparation layer does not calculate a net-proceeds result, determine affordability, recommend a lender or investment, or transfer hidden context between routes.</p>
    </section>
  );
}
