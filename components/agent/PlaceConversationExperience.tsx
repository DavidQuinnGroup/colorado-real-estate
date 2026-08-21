'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, CircleAlert, ClipboardList, Clock3, FileSearch, Landmark, MapPinned, ShieldCheck } from 'lucide-react';

import AgentBriefingComposition from '@/components/agent/AgentBriefingComposition';
import AgentPreparationPageHeader from '@/components/agent/AgentPreparationPageHeader';
import { AGENT_PLACE_PREPARATION_P0_CITIES } from '@/lib/agent-advisory-workbench/agentPlacePreparationAdmission';
import { prepareAgentPlaceConversation } from '@/lib/agent-advisory-workbench/agentPlaceConversationPreparation';

const PRESENTATION_LABELS = {
  FACT: 'Confirmed fact',
  CONTEXT: 'Local context',
  LIMITATION: 'Limitation',
  VERIFICATION: 'Worth verifying',
} as const;

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
}

function formatRole(value: string) {
  return value.toLowerCase().split('_').map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`).join(' ');
}

function Status({ children, caution = false }: { children: string; caution?: boolean }) {
  return <p className={`inline-flex items-center gap-2 text-sm font-semibold ${caution ? 'text-amber-100' : 'text-emerald-100'}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full ${caution ? 'bg-amber-200/15' : 'bg-emerald-200/15'}`}>{caution ? <CircleAlert size={13} aria-hidden="true" /> : <CheckCircle2 size={13} aria-hidden="true" />}</span>{children}</p>;
}

export default function PlaceConversationExperience() {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [preparedPlaceId, setPreparedPlaceId] = useState<string | null>(null);
  const experience = useMemo(() => preparedPlaceId ? prepareAgentPlaceConversation(preparedPlaceId) : null, [preparedPlaceId]);
  const briefing = experience?.briefing ?? null;
  const packet = experience?.packet ?? null;
  const composition = briefing?.composition ?? null;

  return (
    <main className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12" data-testid="agent-place-conversation-experience" data-agent-only="true" data-persistence="false" data-customer-data="false" data-provider-activity="false" data-recommendation="false" data-suitability="false" data-fair-housing-inference="false">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <AgentPreparationPageHeader pageTitle="PLACE PREPARATION" taskHeading="Prepare for a place conversation" description="Choose a certified City to receive governed local orientation before opening supporting detail." scopeNote="City context is durable orientation, not a recommendation or a substitute for address-level verification." />
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]" aria-labelledby="place-selection-heading">
          <div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Step 1</p><h2 id="place-selection-heading" className="mt-2 text-lg font-semibold text-white">Choose one certified City</h2></div><span className="text-xs text-slate-400">Three available Cities</span></div>
            <fieldset className="mt-5 grid gap-3 sm:grid-cols-3"><legend className="sr-only">Certified City selection</legend>{AGENT_PLACE_PREPARATION_P0_CITIES.map((city) => {
              const checked = selectedPlaceId === city.canonicalPlaceId;
              return <label key={city.canonicalPlaceId} className={`flex min-h-14 cursor-pointer items-center justify-between border px-4 py-3 transition ${checked ? 'border-cyan-200/70 bg-cyan-200/10 text-white' : 'border-white/10 bg-black/10 text-slate-300 hover:border-white/30'}`} data-canonical-city-id={city.canonicalPlaceId}><span className="font-medium">{city.canonicalName}</span><input type="radio" name="place" value={city.canonicalPlaceId} checked={checked} onChange={() => { setSelectedPlaceId(city.canonicalPlaceId); setPreparedPlaceId(null); }} className="h-4 w-4 accent-cyan-200" /></label>;
            })}</fieldset>
            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-slate-400">Your selection and briefing remain only in this open page session.</p><button type="button" onClick={() => setPreparedPlaceId(selectedPlaceId)} disabled={!selectedPlaceId} className="inline-flex min-h-11 items-center justify-center gap-2 bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#071014]" data-testid="agent-place-prepare-briefing">Prepare my briefing <ArrowRight size={16} aria-hidden="true" /></button></div>
          </div>
          <aside className="border border-white/10 bg-[#0b171c] p-5" aria-label="Briefing scope"><Clock3 className="h-5 w-5 text-cyan-100" aria-hidden="true" /><h2 className="mt-4 text-base font-semibold text-white">A focused City briefing</h2><p className="mt-2 text-sm leading-6 text-slate-400">Understand the supported City context in about a minute, then inspect sources and limitations only when useful.</p></aside>
        </section>

        {!experience ? <section className="mt-8 border border-dashed border-white/15 px-5 py-7 text-sm text-slate-400" data-testid="agent-place-empty-state">Choose one certified City, then prepare your briefing.</section> : null}
        {experience && !briefing ? <section className="mt-8 border border-amber-200/20 bg-amber-100/[0.06] p-5" role="status" data-testid="agent-place-failure-state"><Status caution>{experience.humanState.label}</Status><p className="mt-3 max-w-3xl text-sm leading-6 text-amber-50/80">{experience.humanState.message}</p></section> : null}

        {composition ? <AgentBriefingComposition briefing={composition} /> : null}
        {briefing && packet && experience && !composition ? <div className="mt-8 space-y-5" data-testid="agent-place-briefing" data-human-state={experience.humanState.label} data-canonical-city-id={briefing.city.canonicalPlaceId}>
          <section className="border border-cyan-200/20 bg-cyan-100/[0.06] p-5 sm:p-6" aria-labelledby="place-briefing-heading"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="max-w-3xl"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">60-second place briefing</p><h2 id="place-briefing-heading" className="mt-2 text-2xl font-semibold text-white">{briefing.headline}</h2><p className="mt-3 text-base leading-7 text-slate-200">{briefing.summary}</p></div><Status>{experience.humanState.label}</Status></div></section>

          <section className="grid gap-5 lg:grid-cols-[1.45fr_1fr]"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="snapshot-heading"><div className="flex items-center gap-3"><MapPinned className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Place snapshot</p><h2 id="snapshot-heading" className="mt-1 text-lg font-semibold">City identity and orientation</h2></div></div><dl className="mt-5 grid gap-3 sm:grid-cols-3">{briefing.placeSnapshot.map((item) => <div key={item.label} className="border border-white/10 bg-black/15 p-4"><dt className="text-xs font-medium text-slate-400">{item.label}</dt><dd className="mt-3 text-sm font-semibold leading-6 text-white">{item.value}</dd></div>)}</dl></div><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="what-matters-heading"><div className="flex items-center gap-3"><ClipboardList className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Briefing notes</p><h2 id="what-matters-heading" className="mt-1 text-lg font-semibold">What matters</h2></div></div><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.whatMatters.map((item) => <li key={item.label}><span className="font-medium text-white">{item.label}: </span>{item.value}</li>)}</ul></div></section>

          <section className="grid gap-5 lg:grid-cols-2"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="context-heading"><div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-100/70">Use the right lens</p><h2 id="context-heading" className="mt-1 text-lg font-semibold">Facts and local context</h2></div></div><div className="mt-5 space-y-4">{packet.talkingPoints.map((point) => <article key={point.label} className="border-l-2 border-white/15 pl-4"><p className="text-xs font-semibold text-cyan-100">{PRESENTATION_LABELS[point.label]}</p><p className="mt-1 text-sm leading-6 text-slate-300">{point.statement}</p></article>)}</div></div><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="verification-heading"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-amber-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-100/70">Review before reliance</p><h2 id="verification-heading" className="mt-1 text-lg font-semibold">What needs verification</h2></div></div><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{packet.needsVerification.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-100" aria-hidden="true" />{item}</li>)}</ul></div></section>

          <section className="grid gap-5 lg:grid-cols-2"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="questions-heading"><div className="flex items-center gap-3"><FileSearch className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Conversation prep</p><h2 id="questions-heading" className="mt-1 text-lg font-semibold">Questions to prepare</h2></div></div><ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.verificationQuestions.concat(packet.clientQuestions.slice(-2)).map((item, index) => <li key={item} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3"><span className="text-cyan-100">{index + 1}.</span>{item}</li>)}</ol></div><div className="border border-amber-200/20 bg-amber-100/[0.05] p-5 sm:p-6" aria-labelledby="checkpoints-heading"><div className="flex items-center gap-3"><Landmark className="h-5 w-5 text-amber-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-100/70">When direct review is needed</p><h2 id="checkpoints-heading" className="mt-1 text-lg font-semibold">Municipal and professional checkpoints</h2></div></div><div className="mt-5 space-y-4">{packet.professionalCheckpoints.map((checkpoint) => <article key={checkpoint.role} className="border-t border-amber-100/15 pt-4"><h3 className="text-sm font-semibold text-white">{formatRole(checkpoint.role)}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{checkpoint.question}</p></article>)}</div></div></section>

          <section className="border border-white/10 bg-white/[0.025]" aria-labelledby="sources-heading"><details className="group" data-testid="agent-place-sources-limitations"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Evidence detail</p><h2 id="sources-heading" className="mt-1 text-lg font-semibold">Sources &amp; limitations</h2></div><ChevronDown className="h-5 w-5 text-slate-400 transition group-open:rotate-180" aria-hidden="true" /></summary><div className="grid gap-5 border-t border-white/10 px-5 pb-6 pt-5 text-sm leading-6 text-slate-300 sm:px-6 lg:grid-cols-2"><div><p className="font-medium text-white">Source and context date</p><p className="mt-1">Certified repository City Decision Guide context, dated {formatDate(briefing.city.registryFreshness)}.</p><p className="mt-4 font-medium text-white">Use with care</p><p className="mt-1">This is durable orientation. Verify current municipal, access, destination, boundary, and property-specific facts directly.</p></div><div><p className="font-medium text-white">Not available in this briefing</p><ul className="mt-1 space-y-2">{packet.missingEvidence.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-4 font-medium text-white">Authorized references</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2"><Link href={briefing.cityDecisionGuideHref} className="font-medium text-cyan-100 underline decoration-cyan-100/40 underline-offset-4 hover:text-white">City Decision Guide</Link>{packet.safeReieSurfaces.map((surface) => <Link key={surface.href} href={surface.href} prefetch={false} className="font-medium text-cyan-100 underline decoration-cyan-100/40 underline-offset-4 hover:text-white">{surface.label}</Link>)}</div></div></div></details></section>
        </div> : null}
      </div>
    </main>
  );
}
