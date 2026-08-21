'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, CircleAlert, ClipboardList, Clock3, FileSearch, Landmark, ShieldCheck } from 'lucide-react';

import AgentBriefingComposition from '@/components/agent/AgentBriefingComposition';
import AgentPreparationPageHeader from '@/components/agent/AgentPreparationPageHeader';
import {
  prepareAgentPropertyConversation,
  type AgentPropertyConversationCandidate,
} from '@/lib/agent-advisory-workbench/agentPropertyConversationPreparation';

type PropertyConversationExperienceProps = {
  candidates: readonly AgentPropertyConversationCandidate[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not available' : new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

function formatNumber(value: number | null, suffix = '') {
  if (value === null) return null;
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)}${suffix}`;
}

function formatRole(value: string) {
  return value.toLowerCase().split('_').map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`).join(' ');
}

function candidateLabel(candidate: AgentPropertyConversationCandidate) {
  const property = candidate.property;
  return `${property.address || 'Property'} · ${property.city || 'Colorado'}, ${property.state || 'CO'} ${property.zip || ''}`.trim();
}

function Status({ children, caution = false }: { children: string; caution?: boolean }) {
  return <p className={`inline-flex items-center gap-2 text-sm font-semibold ${caution ? 'text-amber-100' : 'text-emerald-100'}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full ${caution ? 'bg-amber-200/15' : 'bg-emerald-200/15'}`}>{caution ? <CircleAlert size={13} aria-hidden="true" /> : <CheckCircle2 size={13} aria-hidden="true" />}</span>{children}</p>;
}

export default function PropertyConversationExperience({ candidates }: PropertyConversationExperienceProps) {
  const [query, setQuery] = useState('');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [preparedSlug, setPreparedSlug] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleCandidates = useMemo(() => candidates.filter((candidate) => {
    if (!normalizedQuery) return true;
    const property = candidate.property;
    return [property.address, property.city, property.zip, property.neighborhood, property.propertyType]
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
  }).slice(0, 12), [candidates, normalizedQuery]);
  const selectedCandidate = useMemo(() => candidates.find((candidate) => candidate.property.slug === selectedSlug) || null, [candidates, selectedSlug]);
  const preparedCandidate = useMemo(() => candidates.find((candidate) => candidate.property.slug === preparedSlug) || null, [candidates, preparedSlug]);
  const experience = useMemo(() => preparedCandidate ? prepareAgentPropertyConversation(preparedCandidate) : null, [preparedCandidate]);
  const packet = experience?.packet || null;
  const briefing = packet?.admission === 'ADMITTED' ? packet : null;
  const property = briefing?.snapshot || null;
  const source = briefing?.sourcePosture || null;
  const composition = experience?.composition || null;

  const configuration = property ? [
    property.beds === null ? null : `${formatNumber(property.beds)} beds`,
    property.baths === null ? null : `${formatNumber(property.baths)} baths`,
    property.sqft === null ? null : `${formatNumber(property.sqft, ' sq ft')}`,
  ].filter((item): item is string => Boolean(item)) : [];
  const preparationQuestions = property ? [
    `Has the ${property.status.toLowerCase()} listing status or ${formatCurrency(property.price)} list price changed since ${formatDate(source?.observedAt || null)}?`,
    `Which measurements, configuration details, inclusions, or exclusions for ${property.address} need direct confirmation?`,
    'Which physical-condition items should be addressed through inspection rather than listing interpretation?',
    'Are HOA, title, tax, insurance, financing, or municipal record questions relevant and still unconfirmed?',
  ] : [];

  return (
    <main className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12" data-testid="agent-property-conversation-experience" data-agent-only="true" data-persistence="false" data-customer-data="false" data-provider-activity="false" data-public-record-retrieval="false" data-recommendation="false" data-fair-housing-inference="false">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <AgentPreparationPageHeader pageTitle="PROPERTY PREPARATION" taskHeading="Prepare for a property conversation" description="Choose one supported property to receive a concise listing and verification briefing before opening supporting detail." scopeNote="The briefing uses stored listing facts for orientation. Material details still require direct verification." />
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]" aria-labelledby="property-selection-heading">
          <div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Step 1</p><h2 id="property-selection-heading" className="mt-2 text-lg font-semibold text-white">Choose one real property</h2></div><span className="text-xs text-slate-400">Active public Colorado listings</span></div>
            <label className="mt-5 block"><span className="sr-only">Filter supported repository properties</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search address, city, ZIP, or property type" className="min-h-11 w-full border border-white/15 bg-black/15 px-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100/40" data-testid="agent-property-search-input" /></label>
            <fieldset className="mt-4 grid gap-3" data-testid="agent-property-candidate-results"><legend className="sr-only">Supported repository property results</legend>{visibleCandidates.length ? visibleCandidates.map((candidate) => {
              const selected = candidate.property.slug === selectedSlug;
              return <label key={candidate.property.slug} className={`flex cursor-pointer items-center justify-between gap-4 border px-4 py-3 transition ${selected ? 'border-cyan-200/70 bg-cyan-200/10 text-white' : 'border-white/10 bg-black/10 text-slate-300 hover:border-white/30'}`} data-canonical-property-slug={candidate.property.slug}><span className="min-w-0"><span className="block truncate text-sm font-medium">{candidateLabel(candidate)}</span><span className="mt-1 block text-xs text-slate-400">{candidate.property.propertyType || 'Property type to verify'} · {candidate.property.price === null ? 'Price to verify' : formatCurrency(candidate.property.price)} · {candidate.property.status}</span></span><input type="radio" name="property" value={candidate.property.slug} checked={selected} onChange={() => { setSelectedSlug(candidate.property.slug); setPreparedSlug(null); }} className="h-4 w-4 shrink-0 accent-cyan-200" /></label>;
            }) : <p className="border border-dashed border-white/15 px-4 py-5 text-sm leading-6 text-slate-400" data-testid="agent-property-unavailable">No supported repository properties match this search. Refine the search or use the public Property Search surface.</p>}</fieldset>
            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-slate-400">Your choice and briefing remain only in this open page session.</p><button type="button" onClick={() => setPreparedSlug(selectedCandidate?.property.slug || null)} disabled={!selectedCandidate} className="inline-flex min-h-11 items-center justify-center gap-2 bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#071014]" data-testid="agent-property-prepare-briefing">Prepare my briefing <ArrowRight size={16} aria-hidden="true" /></button></div>
          </div>
          <aside className="border border-white/10 bg-[#0b171c] p-5" aria-label="Briefing scope"><Clock3 className="h-5 w-5 text-cyan-100" aria-hidden="true" /><h2 className="mt-4 text-base font-semibold text-white">A focused property briefing</h2><p className="mt-2 text-sm leading-6 text-slate-400">Understand the supported facts in about a minute, then review detailed evidence limitations only when useful.</p></aside>
        </section>

        {!experience ? <section className="mt-8 border border-dashed border-white/15 px-5 py-7 text-sm text-slate-400" data-testid="agent-property-empty-state">Choose one supported property, then prepare your briefing.</section> : null}
        {experience && !briefing ? <section className="mt-8 border border-amber-200/20 bg-amber-100/[0.06] p-5" role="status" data-testid="agent-property-failure-state"><Status caution>{experience.humanState.label}</Status><p className="mt-3 max-w-3xl text-sm leading-6 text-amber-50/80">{experience.humanState.message}</p></section> : null}

        {composition ? <AgentBriefingComposition briefing={composition} /> : null}
        {briefing && property && source && !composition ? <div className="mt-8 space-y-5" data-testid="agent-property-briefing" data-human-state={experience?.humanState.label} data-canonical-property-slug={property.slug}>
          <section className="border border-cyan-200/20 bg-cyan-100/[0.06] p-5 sm:p-6" aria-labelledby="property-briefing-heading"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="max-w-3xl"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">60-second property briefing</p><h2 id="property-briefing-heading" className="mt-2 text-2xl font-semibold text-white">{property.address}, {property.city}</h2><p className="mt-3 text-base leading-7 text-slate-200">This {property.propertyType.toLowerCase()} property is currently listed at {formatCurrency(property.price)}{configuration.length ? ` with ${configuration.join(', ')}` : ''}. The admitted listing facts were observed on {formatDate(source.observedAt)}. Condition, public-record, title, HOA, insurance, tax, and financing questions remain outside confirmed REIE evidence and should be verified separately.</p></div><Status>{experience?.humanState.label || 'Ready for your review'}</Status></div></section>

          <section className="grid gap-5 lg:grid-cols-[1.45fr_1fr]"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="what-matters-heading"><div className="flex items-center gap-3"><ClipboardList className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Briefing notes</p><h2 id="what-matters-heading" className="mt-1 text-lg font-semibold">What matters</h2></div></div><dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><div className="border border-white/10 bg-black/15 p-4"><dt className="text-xs text-slate-400">Current listing position</dt><dd className="mt-3 text-base font-semibold text-white">{property.status}</dd></div><div className="border border-white/10 bg-black/15 p-4"><dt className="text-xs text-slate-400">List price</dt><dd className="mt-3 text-base font-semibold text-white">{formatCurrency(property.price)}</dd></div><div className="border border-white/10 bg-black/15 p-4"><dt className="text-xs text-slate-400">Property type</dt><dd className="mt-3 text-base font-semibold text-white">{property.propertyType}</dd></div>{configuration.length ? <div className="border border-white/10 bg-black/15 p-4"><dt className="text-xs text-slate-400">Size and configuration</dt><dd className="mt-3 text-base font-semibold text-white">{configuration.join(' · ')}</dd></div> : null}</dl></div><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="known-now-heading"><div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-100/70">Supported now</p><h2 id="known-now-heading" className="mt-1 text-lg font-semibold">Known now</h2></div></div><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.knownNow.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-100" aria-hidden="true" />{item}</li>)}</ul></div></section>

          <section className="grid gap-5 lg:grid-cols-2"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="verification-heading"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-amber-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-100/70">Review before reliance</p><h2 id="verification-heading" className="mt-1 text-lg font-semibold">What needs verification</h2></div></div><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.needsVerification.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-100" aria-hidden="true" />{item}</li>)}</ul></div><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="questions-heading"><div className="flex items-center gap-3"><FileSearch className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Conversation prep</p><h2 id="questions-heading" className="mt-1 text-lg font-semibold">Questions to prepare</h2></div></div><ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{preparationQuestions.map((item, index) => <li key={item} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3"><span className="text-cyan-100">{index + 1}.</span>{item}</li>)}</ol></div></section>

          <section className="border border-amber-200/20 bg-amber-100/[0.05] p-5 sm:p-6" aria-labelledby="checkpoints-heading"><div className="flex items-center gap-3"><Landmark className="h-5 w-5 text-amber-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-100/70">When direct review is needed</p><h2 id="checkpoints-heading" className="mt-1 text-lg font-semibold">Agent verification checkpoints</h2></div></div><div className="mt-5 grid gap-4 md:grid-cols-2">{briefing.professionalCheckpoints.map((checkpoint) => <article key={checkpoint.role} className="border border-amber-100/15 bg-black/10 p-4"><p className="text-xs font-semibold text-amber-100">{checkpoint.label}</p><h3 className="mt-2 text-sm font-semibold text-white">{formatRole(checkpoint.role)}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{checkpoint.question}</p></article>)}</div></section>

          <section className="border border-white/10 bg-white/[0.025]" aria-labelledby="sources-heading"><details className="group" data-testid="agent-property-sources-limitations"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Evidence detail</p><h2 id="sources-heading" className="mt-1 text-lg font-semibold">Sources &amp; limitations</h2></div><ChevronDown className="h-5 w-5 text-slate-400 transition group-open:rotate-180" aria-hidden="true" /></summary><div className="grid gap-5 border-t border-white/10 px-5 pb-6 pt-5 text-sm leading-6 text-slate-300 sm:px-6 lg:grid-cols-2"><div><p className="font-medium text-white">Source</p><p className="mt-1">Stored repository listing facts with the visible listing reference.</p><p className="mt-4 font-medium text-white">Observed date</p><p className="mt-1">{formatDate(source.observedAt)}</p><p className="mt-4 font-medium text-white">Currentness</p><p className="mt-1">Current repository observation.</p></div><div><p className="font-medium text-white">Not available in this briefing</p><ul className="mt-1 space-y-2">{briefing.missingEvidence.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-4 font-medium text-white">Authorized references</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">{briefing.safeReieSurfaces.map((surface) => <Link key={surface.href} href={surface.href} className="font-medium text-cyan-100 underline decoration-cyan-100/40 underline-offset-4 hover:text-white">{surface.label}</Link>)}<Link href="/search" className="font-medium text-cyan-100 underline decoration-cyan-100/40 underline-offset-4 hover:text-white">Property search</Link></div></div></div></details></section>
        </div> : null}
      </div>
    </main>
  );
}
