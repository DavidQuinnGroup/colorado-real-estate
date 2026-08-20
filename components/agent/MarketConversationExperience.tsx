'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, CircleAlert, ClipboardList, Clock3, FileSearch, ShieldCheck } from 'lucide-react';

import { prepareMarketConversation } from '@/lib/agent-advisory-workbench/marketConversationExperience';

const MARKETS = [
  { id: 'boulder-co-housing-market', label: 'Boulder' },
  { id: 'louisville-co-housing-market', label: 'Louisville' },
  { id: 'lafayette-co-housing-market', label: 'Lafayette' },
  { id: 'superior-co-housing-market', label: 'Superior' },
  { id: 'erie-co-housing-market', label: 'Erie' },
  { id: 'longmont-co-housing-market', label: 'Longmont' },
] as const;

const SURFACE_LABELS: Record<string, string> = {
  MARKET: 'Market context',
  DECISION_GUIDES: 'Decision guides',
  SOURCES: 'Sources',
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Not available';
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
}

function Status({ children, caution = false }: { children: string; caution?: boolean }) {
  return <p className={`inline-flex items-center gap-2 text-sm font-semibold ${caution ? 'text-amber-100' : 'text-emerald-100'}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full ${caution ? 'bg-amber-200/15' : 'bg-emerald-200/15'}`}>{caution ? <CircleAlert size={13} aria-hidden="true" /> : <CheckCircle2 size={13} aria-hidden="true" />}</span>{children}</p>;
}

export default function MarketConversationExperience() {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [preparedMarket, setPreparedMarket] = useState<string | null>(null);
  const asOf = useMemo(() => today(), []);
  const experience = useMemo(() => preparedMarket ? prepareMarketConversation(preparedMarket, asOf) : null, [asOf, preparedMarket]);
  const briefing = experience?.briefing;
  const evidenceDate = briefing?.evidencePosture[0]?.observationDate;
  const requiresReview = Boolean(briefing && briefing.state !== 'READY');

  return (
    <main className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12" data-testid="agent-market-conversation-experience" data-agent-only="true" data-persistence="false" data-customer-data="false" data-provider-activity="false">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-100/70">Project Atlas / Agent</p><h1 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">Prepare for a market conversation</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Choose a market to organize the supported context, the facts to remember, and the questions to verify before the conversation.</p></div>
          <p className="max-w-xs text-sm leading-6 text-slate-400">Market context is point-in-time and preparation-focused. It does not replace professional judgment.</p>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]" aria-labelledby="market-selection-heading">
          <div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Step 1</p><h2 id="market-selection-heading" className="mt-2 text-lg font-semibold text-white">Choose a market</h2></div><span className="text-xs text-slate-400">Six supported markets</span></div>
            <fieldset className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"><legend className="sr-only">Certified market selection</legend>{MARKETS.map((market) => {
              const checked = selectedMarket === market.id;
              return <label key={market.id} className={`flex min-h-14 cursor-pointer items-center justify-between border px-4 py-3 transition ${checked ? 'border-cyan-200/70 bg-cyan-200/10 text-white' : 'border-white/10 bg-black/10 text-slate-300 hover:border-white/30'}`}><span className="font-medium">{market.label}</span><input type="radio" name="market" value={market.id} checked={checked} onChange={() => setSelectedMarket(market.id)} className="h-4 w-4 accent-cyan-200" /></label>;
            })}</fieldset>
            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-slate-400">Your selection is available only in this page session.</p><button type="button" onClick={() => setPreparedMarket(selectedMarket)} disabled={!selectedMarket} className="inline-flex min-h-11 items-center justify-center gap-2 bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#071014]" data-testid="agent-market-prepare-briefing">Prepare my briefing <ArrowRight size={16} aria-hidden="true" /></button></div>
          </div>
          <aside className="border border-white/10 bg-[#0b171c] p-5" aria-label="Briefing scope"><Clock3 className="h-5 w-5 text-cyan-100" aria-hidden="true" /><h2 className="mt-4 text-base font-semibold text-white">A focused briefing</h2><p className="mt-2 text-sm leading-6 text-slate-400">Review the supported picture in about a minute, then open the evidence details only when you need them.</p></aside>
        </section>

        {!experience ? <section className="mt-8 border border-dashed border-white/15 px-5 py-7 text-sm text-slate-400" data-testid="agent-market-empty-state">Choose a supported market, then prepare your briefing.</section> : null}
        {experience && !briefing ? <section className="mt-8 border border-amber-200/20 bg-amber-100/[0.06] p-5" role="status" data-testid="agent-market-failure-state"><Status caution>{experience.humanState}</Status><p className="mt-3 max-w-3xl text-sm leading-6 text-amber-50/80">{experience.message}</p></section> : null}

        {briefing ? <div className="mt-8 space-y-5" data-testid="agent-market-briefing" data-human-state={briefing.humanState}>
          <section className="border border-cyan-200/20 bg-cyan-100/[0.06] p-5 sm:p-6" aria-labelledby="briefing-heading"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="max-w-3xl"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">30-second briefing</p><h2 id="briefing-heading" className="mt-2 text-2xl font-semibold text-white">{briefing.briefingSummary?.marketLabel}</h2><p className="mt-3 text-base leading-7 text-slate-200">{experience.message}</p></div><Status caution={requiresReview}>{briefing.humanState}</Status></div><p className="mt-5 border-t border-white/10 pt-4 text-sm leading-6 text-slate-300">The supported picture includes {briefing.briefingSummary?.supportedObservationCount ?? 0} point-in-time market observations. Use them to orient the conversation, not to make a prediction or strategy conclusion.</p></section>

          <section className="grid gap-5 lg:grid-cols-[1.45fr_1fr]"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="what-matters-heading"><div className="flex items-center gap-3"><ClipboardList className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Briefing notes</p><h2 id="what-matters-heading" className="mt-1 text-lg font-semibold">What matters</h2></div></div><dl className="mt-5 grid gap-3 sm:grid-cols-3">{briefing.whatMatters.map((item) => <div key={item.id} className="border border-white/10 bg-black/15 p-4"><dt className="text-xs font-medium leading-5 text-slate-400">{item.label}</dt><dd className="mt-3 text-base font-semibold leading-6 text-white">{String(item.value)}</dd></div>)}</dl></div><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="verification-heading"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-amber-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-100/70">Review before reliance</p><h2 id="verification-heading" className="mt-1 text-lg font-semibold">What needs verification</h2></div></div><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.whatNeedsVerification.length ? briefing.whatNeedsVerification.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-100" aria-hidden="true" />{item}</li>) : <li>No additional verification items are supplied.</li>}</ul></div></section>

          <section className="grid gap-5 lg:grid-cols-2"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="questions-heading"><div className="flex items-center gap-3"><FileSearch className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Conversation prep</p><h2 id="questions-heading" className="mt-1 text-lg font-semibold">Questions to prepare</h2></div></div><ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.questionsToPrepare.map((item, index) => <li key={item} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3"><span className="text-cyan-100">{index + 1}.</span>{item}</li>)}</ol></div>{briefing.professionalHandoffs.length ? <div className="border border-amber-200/20 bg-amber-100/[0.05] p-5 sm:p-6" aria-labelledby="handoff-heading"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-100/70">When review is required</p><h2 id="handoff-heading" className="mt-1 text-lg font-semibold">Professional handoff</h2>{briefing.professionalHandoffs.map((handoff) => <div key={handoff.id} className="mt-5 border-t border-amber-100/15 pt-4 text-sm leading-6 text-slate-300"><p className="font-medium text-white">{handoff.role.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())}</p><p className="mt-2">{handoff.whyVerificationIsNeeded}</p><p className="mt-3 text-slate-400">Prepare: {handoff.questionCategory}</p><p className="mt-2 text-slate-400">REIE cannot determine: {handoff.whatReieCannotDetermine.join(' ')}</p></div>)}</div> : null}</section>

          <section className="border border-white/10 bg-white/[0.025]" aria-labelledby="sources-heading"><details className="group" data-testid="agent-market-sources-limitations"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Evidence detail</p><h2 id="sources-heading" className="mt-1 text-lg font-semibold">Sources &amp; limitations</h2></div><ChevronDown className="h-5 w-5 text-slate-400 transition group-open:rotate-180" aria-hidden="true" /></summary><div className="grid gap-5 border-t border-white/10 px-5 pb-6 pt-5 text-sm leading-6 text-slate-300 sm:px-6 lg:grid-cols-2"><div><p className="font-medium text-white">Evidence reviewed through</p><p className="mt-1">{formatDate(evidenceDate)}</p><p className="mt-4 font-medium text-white">Source</p><p className="mt-1">Repository-local REIE city market context.</p><p className="mt-4 font-medium text-white">Review surfaces</p><p className="mt-1">{briefing.reviewSurfaces.map((surface) => SURFACE_LABELS[surface] ?? surface).join(' · ')}</p></div><div><p className="font-medium text-white">Limitations</p><ul className="mt-1 space-y-2">{briefing.limitations.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-4 font-medium text-white">Evidence posture</p><ul className="mt-1 space-y-2">{briefing.evidencePosture.map((item) => <li key={item.observationId}>Reviewed market evidence, {item.freshness.toLowerCase()}, {item.completeness.toLowerCase()}, {item.conflict === 'NO_CONFLICT' ? 'no conflict recorded' : 'conflict needs review'}.</li>)}</ul></div></div></details></section>
        </div> : null}
      </div>
    </main>
  );
}
