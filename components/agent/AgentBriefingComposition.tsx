'use client';

import Link from 'next/link';
import { ClipboardList, FileSearch, Landmark, ShieldCheck } from 'lucide-react';

import DisclosureStateIndicator from '@/components/DisclosureStateIndicator';

import {
  hasMaterialBriefingSection,
  type AgentBriefingComposition as AgentBriefingCompositionModel,
} from '@/lib/agent-advisory-workbench/agentBriefingComposition';

export default function AgentBriefingComposition({ briefing, showNextActions = true }: { briefing: AgentBriefingCompositionModel; showNextActions?: boolean }) {
  const hasWhatMatters = hasMaterialBriefingSection(briefing.whatMatters);
  const hasWhyItMatters = hasMaterialBriefingSection(briefing.whyItMatters);
  const hasInterpretationChanges = hasMaterialBriefingSection(briefing.whatCouldChangeInterpretation);
  const hasQuestions = hasMaterialBriefingSection(briefing.questionsWorthAsking);
  const hasSources = hasMaterialBriefingSection(briefing.sourcesFreshnessLimitations);
  const hasReviewDetails = briefing.reviewSurfaces.length > 0 || briefing.professionalCheckpoints.length > 0;

  return <div className="mt-8 space-y-5" data-testid="agent-shared-briefing-composition" data-briefing-surface={briefing.surface} data-empty-section-discipline="true">
    <section className="border border-cyan-200/20 bg-cyan-100/[0.06] p-5 sm:p-6" aria-labelledby="executive-briefing-heading"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">Executive briefing</p><h2 id="executive-briefing-heading" className="mt-2 text-2xl font-semibold text-white">{briefing.subject}</h2><p className="mt-3 max-w-3xl text-base leading-7 text-slate-200">{briefing.executiveBriefing.text}</p></section>

    {hasWhatMatters || hasWhyItMatters ? <section className="grid gap-5 lg:grid-cols-2">
      {hasWhatMatters ? <div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6"><div className="flex items-center gap-3"><ClipboardList className="h-5 w-5 text-cyan-100" aria-hidden="true" /><h2 className="text-lg font-semibold">What matters</h2></div><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.whatMatters.map((item) => <li key={item.id}>{item.text}</li>)}</ul></div> : null}
      {hasWhyItMatters ? <div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6"><h2 className="text-lg font-semibold">Why it matters</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.whyItMatters.map((item) => <li key={item.id}>{item.text}</li>)}</ul></div> : null}
    </section> : null}

    {briefing.keyEvidence.length ? <section aria-labelledby="key-evidence-heading"><h2 id="key-evidence-heading" className="mb-3 text-lg font-semibold">Key evidence</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{briefing.keyEvidence.map((item) => <article key={item.id} className="border border-white/10 bg-black/15 p-4"><p className="text-xs text-slate-400">{item.label}</p><p className="mt-3 text-sm font-semibold leading-6 text-white">{item.value}</p></article>)}</div></section> : null}

    {hasInterpretationChanges || hasQuestions ? <section className="grid gap-5 lg:grid-cols-2">
      {hasInterpretationChanges ? <div className="border border-amber-200/20 bg-amber-100/[0.05] p-5 sm:p-6" data-testid="agent-briefing-interpretation-changes"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-amber-100" aria-hidden="true" /><h2 className="text-lg font-semibold">What could change the interpretation</h2></div><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.whatCouldChangeInterpretation.map((item) => <li key={item.id}>{item.text}</li>)}</ul></div> : null}
      {hasQuestions ? <div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6"><div className="flex items-center gap-3"><FileSearch className="h-5 w-5 text-cyan-100" aria-hidden="true" /><h2 className="text-lg font-semibold">Questions worth asking</h2></div><ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.questionsWorthAsking.map((item, index) => <li key={item.id} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3"><span className="text-cyan-100">{index + 1}.</span>{item.text}</li>)}</ol></div> : null}
    </section> : null}

    {showNextActions && hasMaterialBriefingSection(briefing.nextActions) ? <section className="border border-emerald-200/20 bg-emerald-100/[0.05] p-5 sm:p-6" aria-labelledby="next-actions-heading"><h2 id="next-actions-heading" className="text-lg font-semibold">Next actions</h2><ol className="mt-5 grid gap-3 text-sm leading-6 text-slate-300 sm:grid-cols-2">{briefing.nextActions?.map((action) => <li key={action.id} className="border border-emerald-100/10 bg-black/10 p-4"><p className="text-xs font-semibold text-emerald-100">{action.category}</p>{action.href ? <Link href={action.href} prefetch={false} className="mt-2 inline-flex font-semibold text-cyan-100 underline decoration-cyan-100/40 underline-offset-4 hover:text-white">{action.text}</Link> : <p className="mt-2">{action.text}</p>}</li>)}</ol></section> : null}

    {hasSources || hasReviewDetails ? <section className="border border-white/10 bg-white/[0.025]" aria-labelledby="briefing-details-heading"><details className="group" data-testid="agent-briefing-progressive-details"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Evidence detail</p><h2 id="briefing-details-heading" className="mt-1 text-lg font-semibold">Sources, freshness &amp; limitations</h2></div><DisclosureStateIndicator className="h-5 w-5 text-slate-400" /></summary><div className="grid gap-5 border-t border-white/10 px-5 pb-6 pt-5 text-sm leading-6 text-slate-300 lg:grid-cols-2">{hasSources ? <div><p className="font-medium text-white">Sources and freshness</p><ul className="mt-2 space-y-2">{briefing.sourcesFreshnessLimitations.map((item) => <li key={item.id}>{item.text}</li>)}</ul></div> : null}{hasReviewDetails ? <div>{briefing.reviewSurfaces.length ? <><p className="font-medium text-white">Next review surfaces</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">{briefing.reviewSurfaces.map((surface) => <Link key={surface.id} href={surface.href} prefetch={false} className="font-medium text-cyan-100 underline decoration-cyan-100/40 underline-offset-4 hover:text-white">{surface.label}</Link>)}</div></> : null}{briefing.professionalCheckpoints.length ? <><div className="mt-5 flex items-center gap-3"><Landmark className="h-5 w-5 text-amber-100" aria-hidden="true" /><p className="font-medium text-white">External verification checkpoints</p></div><ul className="mt-2 space-y-3">{briefing.professionalCheckpoints.map((item) => <li key={item.id}><span className="font-medium text-white">{item.role}:</span> {item.question}</li>)}</ul></> : null}</div> : null}</div></details></section> : null}
  </div>;
}
