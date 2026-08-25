'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BarChart3, CheckCircle2, CircleAlert, ClipboardList, Clock3, FileSearch, Landmark, RefreshCw, ShieldCheck, SlidersHorizontal } from 'lucide-react';

import DisclosureStateIndicator from '@/components/DisclosureStateIndicator';
import { projectAtlasTitleHierarchy } from '@/components/ProjectAtlasTitleHierarchy';
import AgentBriefingComposition from '@/components/agent/AgentBriefingComposition';
import PropertyCriteriaProfileEditor from '@/components/agent/PropertyCriteriaProfileEditor';
import AgentPreparationPageHeader from '@/components/agent/AgentPreparationPageHeader';
import {
  prepareAgentPropertyConversation,
  type AgentPropertyConversationCandidate,
  type AgentPropertyConversationCandidateSummary,
} from '@/lib/agent-advisory-workbench/agentPropertyConversationPreparation';
import {
  AGENT_COHORT_SUPPORTED_CITIES,
  AGENT_COHORT_SUPPORTED_PROPERTY_TYPES,
  AGENT_COHORT_SUPPORTED_STATUS_SCOPES,
} from '@/lib/agentCohortBuilder';

type CompetingContextFilterKey = 'city' | 'zip' | 'propertyType' | 'statusScope' | 'priceMin' | 'priceMax' | 'bedsMin' | 'bedsMax' | 'bedsExact' | 'bathsMin' | 'bathsMax' | 'bathsExact' | 'sqftMin' | 'sqftMax' | 'yearBuiltMin' | 'yearBuiltMax' | 'lotSizeMin' | 'lotSizeMax';
type CompetingContextFilters = Partial<Record<CompetingContextFilterKey, string | number | readonly string[] | null>>;
type CompetingContextPayload = Readonly<{
  status: 'READY' | 'NOT_AVAILABLE';
  rejectionReasons: readonly string[];
  subject: {
    analyticalGrain: 'MLS_LISTING';
    observationAsOf: string;
    currentStatus: string;
    fields: { city: string; zip: string | null; propertyType: string; price: number | null; beds: number | null; baths: number | null; sqft: number | null; yearBuilt: number | null; lotSize: number | null };
    missingFields: readonly string[];
  } | null;
  cohort: {
    derivation: 'SYSTEM_DERIVED_DEFAULT_COMPETING_COHORT' | 'AGENT_ADJUSTED_COMPETING_COHORT';
    visibleCriteria: readonly string[];
    preExclusionCount: number | null;
    postExclusionCount: number | null;
    subjectExclusion: { state: string; identityBasis: string; preMinusPost: number | null; limitation: string | null };
    smallCohortLimitation: string | null;
    asOf: string | null;
    metrics: readonly { metricId: string; label: string; state: string; value: number | null; unit: string; includedPopulationCount: number; eligibleCohortCount: number; nullMissingCount: number }[];
  } | null;
  positioning: readonly {
    field: string;
    label: string;
    subjectValue: number | null;
    cohortMetricValue: number | null;
    cohortMeanMetricValue: number | null;
    unit: string;
    absoluteDeltaFromMedian: number | null;
    percentageDeltaFromMedian: number | null;
    status: string;
    coverage: { eligibleCohortCount: number; includedPopulationCount: number; nullMissingCount: number };
    limitations: readonly string[];
  }[];
}>;

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

function formatInteger(value: number | null) {
  return value === null ? 'Unavailable' : new Intl.NumberFormat('en-US').format(value);
}

function formatContextValue(value: number | null, unit: string) {
  if (value === null) return 'No data';
  if (unit === 'USD') return formatCurrency(value);
  if (unit === 'listed square feet') return `${formatInteger(value)} sq ft`;
  if (unit === 'year') return String(Math.round(value));
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)} ${unit}`;
}

function formatDelta(value: number | null, unit: string) {
  if (value === null) return 'No delta';
  const abs = Math.abs(value);
  const formatted = unit === 'USD' ? formatCurrency(abs) : unit === 'listed square feet' ? `${formatInteger(abs)} sq ft` : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(abs)} ${unit}`;
  if (value > 0) return `${formatted} above`;
  if (value < 0) return `${formatted} below`;
  return 'Same as';
}

function filterQuery(filters: CompetingContextFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      for (const entry of value) params.append(key, entry);
    } else if (value !== null && value !== undefined && value !== '') params.set(key, String(value));
  }
  return params;
}

function formatRole(value: string) {
  return value.toLowerCase().split('_').map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`).join(' ');
}

function candidateLabel(candidate: AgentPropertyConversationCandidateSummary) {
  const property = candidate.property;
  return `${property.address || 'Property'} · ${property.city || 'Colorado'}, ${property.state || 'CO'} ${property.zip || ''}`.trim();
}

function Status({ children, caution = false }: { children: string; caution?: boolean }) {
  return <p className={`inline-flex items-center gap-2 text-sm font-semibold ${caution ? 'text-amber-100' : 'text-emerald-100'}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full ${caution ? 'bg-amber-200/15' : 'bg-emerald-200/15'}`}>{caution ? <CircleAlert size={13} aria-hidden="true" /> : <CheckCircle2 size={13} aria-hidden="true" />}</span>{children}</p>;
}

type CandidateSearchState = 'NO_SEARCH_YET' | 'QUERY_TOO_SHORT' | 'SEARCHING' | 'MATCHES_FOUND' | 'NO_MATCHES' | 'FAILED';
const AUTOCOMPLETE_DEBOUNCE_MS = 250;
const PROPERTY_AUTOCOMPLETE_LISTBOX_ID = 'agent-property-autocomplete-results';

export default function PropertyConversationExperience() {
  const [candidates, setCandidates] = useState<readonly AgentPropertyConversationCandidateSummary[]>([]);
  const [candidateSearchState, setCandidateSearchState] = useState<CandidateSearchState>('NO_SEARCH_YET');
  const [activeCandidateIndex, setActiveCandidateIndex] = useState(-1);
  const [isSuggestionListOpen, setIsSuggestionListOpen] = useState(false);
  const [preparationError, setPreparationError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [preparedCandidate, setPreparedCandidate] = useState<AgentPropertyConversationCandidate | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [competingFilters, setCompetingFilters] = useState<CompetingContextFilters>({});
  const [competingContext, setCompetingContext] = useState<CompetingContextPayload | null>(null);
  const [competingContextState, setCompetingContextState] = useState<'IDLE' | 'READING' | 'READY' | 'FAILED'>('IDLE');
  const searchRequestId = useRef(0);
  const explicitSearchQuery = useRef<string | null>(null);

  const selectedCandidate = useMemo(() => candidates.find((candidate) => candidate.property.slug === selectedSlug) || null, [candidates, selectedSlug]);
  const selectedQuery = selectedCandidate ? selectedCandidate.property.address ?? candidateLabel(selectedCandidate) : null;
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
  const selectedCompetingFilterCount = Object.values(competingFilters).filter((value) => Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined).length;

  const readCompetingContext = useCallback(async (slug: string, filters: CompetingContextFilters) => {
    setCompetingContextState('READING');
    const params = filterQuery(filters);
    params.set('property', slug);
    try {
      const response = await fetch(`/api/agent/current-competing-listing-context?${params.toString()}`, { cache: 'no-store', credentials: 'same-origin' });
      const payload = await response.json() as CompetingContextPayload;
      if (!response.ok || payload.status !== 'READY') throw new Error(payload.rejectionReasons?.join(', ') || 'Current competing listing context unavailable.');
      setCompetingContext(payload);
      setCompetingContextState('READY');
    } catch {
      setCompetingContext(null);
      setCompetingContextState('FAILED');
    }
  }, []);

  useEffect(() => {
    if (!preparedCandidate) return;
    const timeout = window.setTimeout(() => {
      void readCompetingContext(preparedCandidate.property.slug, competingFilters);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [competingFilters, preparedCandidate, readCompetingContext]);

  const searchCandidates = useCallback(async (rawQuery: string) => {
    const searchQuery = rawQuery.trim();
    if (searchQuery.length < 2) {
      setCandidates([]);
      setCandidateSearchState(searchQuery ? 'QUERY_TOO_SHORT' : 'NO_SEARCH_YET');
      setActiveCandidateIndex(-1);
      setIsSuggestionListOpen(false);
      return;
    }

    const requestId = ++searchRequestId.current;
    setCandidateSearchState('SEARCHING');
    setActiveCandidateIndex(-1);
    setIsSuggestionListOpen(true);
    try {
      const response = await fetch(`/api/agent/prepare/property?q=${encodeURIComponent(searchQuery)}`, { cache: 'no-store', credentials: 'same-origin' });
      const payload = await response.json() as { candidates?: AgentPropertyConversationCandidateSummary[]; state?: CandidateSearchState };
      if (!response.ok || !payload.candidates || (payload.state !== 'MATCHES_FOUND' && payload.state !== 'NO_MATCHES')) throw new Error('Property selector unavailable.');
      if (searchRequestId.current !== requestId) return;
      setCandidates(payload.candidates);
      setCandidateSearchState(payload.state);
    } catch {
      if (searchRequestId.current !== requestId) return;
      setCandidates([]);
      setCandidateSearchState('FAILED');
    }
  }, []);

  useEffect(() => {
    const searchQuery = query.trim();
    if (selectedQuery && searchQuery === selectedQuery) return;
    if (searchQuery.length < 2) return;
    const timeout = window.setTimeout(() => {
      if (explicitSearchQuery.current === searchQuery) {
        explicitSearchQuery.current = null;
        return;
      }
      void searchCandidates(searchQuery);
    }, AUTOCOMPLETE_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [query, searchCandidates, selectedQuery]);

  function beginNewSearch(value: string) {
    searchRequestId.current += 1;
    explicitSearchQuery.current = null;
    setQuery(value);
    setSelectedSlug(null);
    setPreparedCandidate(null);
    setCompetingFilters({});
    setCompetingContext(null);
    setCompetingContextState('IDLE');
    setPreparationError(null);
    const searchQuery = value.trim();
    setCandidates([]);
    setActiveCandidateIndex(-1);
    setCandidateSearchState(searchQuery.length >= 2 ? 'SEARCHING' : searchQuery ? 'QUERY_TOO_SHORT' : 'NO_SEARCH_YET');
    setIsSuggestionListOpen(searchQuery.length >= 2);
  }

  function selectCandidate(candidate: AgentPropertyConversationCandidateSummary) {
    searchRequestId.current += 1;
    setSelectedSlug(candidate.property.slug);
    setPreparedCandidate(null);
    setCompetingFilters({});
    setCompetingContext(null);
    setCompetingContextState('IDLE');
    setPreparationError(null);
    setQuery(candidate.property.address ?? candidateLabel(candidate));
    setActiveCandidateIndex(-1);
    setIsSuggestionListOpen(false);
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && candidates.length) {
      event.preventDefault();
      setIsSuggestionListOpen(true);
      setActiveCandidateIndex((current) => current < candidates.length - 1 ? current + 1 : 0);
    } else if (event.key === 'ArrowUp' && candidates.length) {
      event.preventDefault();
      setIsSuggestionListOpen(true);
      setActiveCandidateIndex((current) => current > 0 ? current - 1 : candidates.length - 1);
    } else if (event.key === 'Enter' && isSuggestionListOpen && activeCandidateIndex >= 0) {
      event.preventDefault();
      selectCandidate(candidates[activeCandidateIndex]);
    } else if (event.key === 'Escape' && isSuggestionListOpen) {
      event.preventDefault();
      setActiveCandidateIndex(-1);
      setIsSuggestionListOpen(false);
    }
  }

  async function prepareSelectedProperty() {
    if (!selectedCandidate) return;
    setIsPreparing(true);
    setPreparationError(null);
    try {
      const response = await fetch(`/api/agent/prepare/property?property=${encodeURIComponent(selectedCandidate.property.slug)}`, { cache: 'no-store', credentials: 'same-origin' });
      const payload = await response.json() as { candidate?: AgentPropertyConversationCandidate; error?: string };
      if (!response.ok || !payload.candidate) throw new Error(payload.error || 'Property briefing unavailable.');
      setPreparedCandidate(payload.candidate);
      setCompetingFilters({});
    } catch {
      setPreparationError('The selected property briefing is unavailable. Confirm the Agent session and try again.');
    } finally {
      setIsPreparing(false);
    }
  }

  function updateCompetingFilter(key: CompetingContextFilterKey, value: string) {
    setCompetingFilters((current) => ({ ...current, [key]: value === '' ? null : Number(value) }));
  }

  function updateCompetingTextFilter(key: CompetingContextFilterKey, value: string) {
    setCompetingFilters((current) => ({ ...current, [key]: value || null }));
  }

  function updateCompetingZipFilter(value: string) {
    setCompetingFilters((current) => ({ ...current, zip: value.split(',').map((entry) => entry.trim()).filter(Boolean) }));
  }

  return (
    <main className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12" data-testid="agent-property-conversation-experience" data-agent-only="true" data-persistence="false" data-customer-data="false" data-provider-activity="false" data-public-record-retrieval="false" data-recommendation="false" data-fair-housing-inference="false">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <AgentPreparationPageHeader pageTitle="PROPERTY PREPARATION" taskHeading="Prepare for a property conversation" description="Choose one supported property to receive a concise listing and verification briefing before opening supporting detail." scopeNote="The briefing uses stored listing facts for orientation. Material details still require direct verification." />
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]" aria-labelledby="property-selection-heading">
          <div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 id="property-selection-heading" className={projectAtlasTitleHierarchy.selectionGroup}>Choose one real property</h2></div><span className="text-xs text-slate-400">Active public Colorado listings</span></div>
            <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); beginNewSearch(query); explicitSearchQuery.current = query.trim(); void searchCandidates(query); }}><label className="min-w-0 flex-1"><span className="sr-only">Search supported repository properties</span><input value={query} onChange={(event) => beginNewSearch(event.target.value)} onKeyDown={handleSearchKeyDown} role="combobox" aria-autocomplete="list" aria-controls={PROPERTY_AUTOCOMPLETE_LISTBOX_ID} aria-expanded={isSuggestionListOpen && candidateSearchState === 'MATCHES_FOUND'} aria-activedescendant={activeCandidateIndex >= 0 ? `${PROPERTY_AUTOCOMPLETE_LISTBOX_ID}-${activeCandidateIndex}` : undefined} placeholder="Search address, city, ZIP, MLS ID, or property type" className="min-h-11 w-full border border-white/15 bg-black/15 px-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100/40" data-testid="agent-property-search-input" /></label><button type="submit" className="min-h-11 border border-cyan-100/40 px-4 text-sm font-semibold text-cyan-100 transition hover:border-cyan-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid="agent-property-search-submit">Search properties</button></form>
            <div className="mt-4 grid gap-3" data-testid="agent-property-candidate-results" data-search-state={candidateSearchState} aria-live="polite">{candidateSearchState === 'NO_SEARCH_YET' ? <p className="border border-dashed border-white/15 px-4 py-5 text-sm leading-6 text-slate-400" data-testid="agent-property-search-empty">Search by an address or another supported identifier to choose one repository property.</p> : null}{candidateSearchState === 'QUERY_TOO_SHORT' ? <p className="border border-dashed border-white/15 px-4 py-5 text-sm leading-6 text-slate-400" data-testid="agent-property-search-too-short">Enter at least two characters to search supported repository properties.</p> : null}{candidateSearchState === 'SEARCHING' ? <p className="border border-dashed border-white/15 px-4 py-5 text-sm leading-6 text-slate-400" data-testid="agent-property-candidates-loading" role="status">Searching supported repository properties.</p> : null}{candidateSearchState === 'FAILED' ? <p className="border border-dashed border-amber-200/30 px-4 py-5 text-sm leading-6 text-amber-100" data-testid="agent-property-candidates-unavailable">Property search is unavailable. Refine the query or try again.</p> : null}{candidateSearchState === 'MATCHES_FOUND' && isSuggestionListOpen ? <ul id={PROPERTY_AUTOCOMPLETE_LISTBOX_ID} role="listbox" aria-label="Matching supported repository properties" className="grid gap-2" data-testid="agent-property-autocomplete-list">{candidates.map((candidate, index) => {
              const selected = candidate.property.slug === selectedSlug;
              const active = index === activeCandidateIndex;
              return <li key={candidate.property.slug} id={`${PROPERTY_AUTOCOMPLETE_LISTBOX_ID}-${index}`} role="option" aria-selected={active || selected} data-canonical-property-slug={candidate.property.slug}><button type="button" onClick={() => selectCandidate(candidate)} className={`flex min-h-11 w-full items-center justify-between gap-4 border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-100 ${active || selected ? 'border-cyan-200/70 bg-cyan-200/10 text-white' : 'border-white/10 bg-black/10 text-slate-300 hover:border-white/30'}`}><span className="min-w-0"><span className="block truncate text-sm font-medium">{candidateLabel(candidate)}</span><span className="mt-1 block text-xs text-slate-400">{candidate.property.propertyType || 'Property type to verify'} · {candidate.property.price === null ? 'Price to verify' : formatCurrency(candidate.property.price)} · {candidate.property.status}</span></span></button></li>;
            })}</ul> : null}{candidateSearchState === 'NO_MATCHES' ? <p className="border border-dashed border-white/15 px-4 py-5 text-sm leading-6 text-slate-400" data-testid="agent-property-unavailable">No supported repository properties match this search. Refine the query and try again.</p> : null}{selectedCandidate ? <p className="text-sm font-semibold text-emerald-100" data-testid="agent-property-selected">Property selected. Prepare the briefing when ready.</p> : null}</div>
            <PropertyCriteriaProfileEditor context="PROPERTY_REVIEW" />
            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-slate-400">Your choice and briefing remain only in this open page session.</p><button type="button" onClick={() => void prepareSelectedProperty()} disabled={!selectedCandidate || isPreparing} className="inline-flex min-h-11 items-center justify-center gap-2 bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#071014]" data-testid="agent-property-prepare-briefing">{isPreparing ? 'Preparing briefing' : 'Prepare my briefing'} <ArrowRight size={16} aria-hidden="true" /></button></div>
          </div>
          <aside className="border border-white/10 bg-[#0b171c] p-5" aria-label="Briefing scope"><Clock3 className="h-5 w-5 text-cyan-100" aria-hidden="true" /><h2 className="mt-4 text-base font-semibold text-white">A focused property briefing</h2><p className="mt-2 text-sm leading-6 text-slate-400">Understand the supported facts in about a minute, then review detailed evidence limitations only when useful.</p></aside>
        </section>

        {preparationError ? <section className="mt-8 border border-amber-200/20 bg-amber-100/[0.06] p-5 text-sm leading-6 text-amber-50/80" role="status" data-testid="agent-property-preparation-error">{preparationError}</section> : null}
        {!experience && !preparationError ? <section className="mt-8 border border-dashed border-white/15 px-5 py-7 text-sm text-slate-400" data-testid="agent-property-empty-state">Choose one supported property, then prepare your briefing.</section> : null}
        {experience && !briefing ? <section className="mt-8 border border-amber-200/20 bg-amber-100/[0.06] p-5" role="status" data-testid="agent-property-failure-state"><Status caution>{experience.humanState.label}</Status><p className="mt-3 max-w-3xl text-sm leading-6 text-amber-50/80">{experience.humanState.message}</p></section> : null}

        {composition ? <AgentBriefingComposition briefing={composition} /> : null}
        {briefing && property && source && !composition ? <div className="mt-8 space-y-5" data-testid="agent-property-briefing" data-human-state={experience?.humanState.label} data-canonical-property-slug={property.slug}>
          <section className="border border-cyan-200/20 bg-cyan-100/[0.06] p-5 sm:p-6" aria-labelledby="property-briefing-heading"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="max-w-3xl"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">60-second property briefing</p><h2 id="property-briefing-heading" className="mt-2 text-2xl font-semibold text-white">{property.address}, {property.city}</h2><p className="mt-3 text-base leading-7 text-slate-200">This {property.propertyType.toLowerCase()} property is currently listed at {formatCurrency(property.price)}{configuration.length ? ` with ${configuration.join(', ')}` : ''}. The admitted listing facts were observed on {formatDate(source.observedAt)}. Condition, public-record, title, HOA, insurance, tax, and financing questions remain outside confirmed REIE evidence and should be verified separately.</p></div><Status>{experience?.humanState.label || 'Ready for your review'}</Status></div></section>

          <section className="grid gap-5 lg:grid-cols-[1.45fr_1fr]"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="what-matters-heading"><div className="flex items-center gap-3"><ClipboardList className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Briefing notes</p><h2 id="what-matters-heading" className="mt-1 text-lg font-semibold">What matters</h2></div></div><dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><div className="border border-white/10 bg-black/15 p-4"><dt className="text-xs text-slate-400">Current listing position</dt><dd className="mt-3 text-base font-semibold text-white">{property.status}</dd></div><div className="border border-white/10 bg-black/15 p-4"><dt className="text-xs text-slate-400">List price</dt><dd className="mt-3 text-base font-semibold text-white">{formatCurrency(property.price)}</dd></div><div className="border border-white/10 bg-black/15 p-4"><dt className="text-xs text-slate-400">Property type</dt><dd className="mt-3 text-base font-semibold text-white">{property.propertyType}</dd></div>{configuration.length ? <div className="border border-white/10 bg-black/15 p-4"><dt className="text-xs text-slate-400">Size and configuration</dt><dd className="mt-3 text-base font-semibold text-white">{configuration.join(' · ')}</dd></div> : null}</dl></div><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="known-now-heading"><div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-100/70">Supported now</p><h2 id="known-now-heading" className="mt-1 text-lg font-semibold">Known now</h2></div></div><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.knownNow.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-100" aria-hidden="true" />{item}</li>)}</ul></div></section>

          <section className="grid gap-5 lg:grid-cols-2"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="verification-heading"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-amber-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-100/70">Review before reliance</p><h2 id="verification-heading" className="mt-1 text-lg font-semibold">What needs verification</h2></div></div><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{briefing.needsVerification.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-100" aria-hidden="true" />{item}</li>)}</ul></div><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="questions-heading"><div className="flex items-center gap-3"><FileSearch className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Conversation prep</p><h2 id="questions-heading" className="mt-1 text-lg font-semibold">Questions to prepare</h2></div></div><ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{preparationQuestions.map((item, index) => <li key={item} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3"><span className="text-cyan-100">{index + 1}.</span>{item}</li>)}</ol></div></section>

          <section className="border border-cyan-200/20 bg-cyan-100/[0.045] p-5 sm:p-6" aria-labelledby="current-competing-listing-context-heading" data-testid="agent-current-competing-listing-context" data-agent-current-competing-listing-context-status={competingContext?.status ?? competingContextState} data-agent-current-competing-listing-context-grain="MLS_LISTING" data-agent-current-competing-listing-context-current-snapshot="true" data-agent-current-competing-listing-context-cma="false" data-agent-current-competing-listing-context-valuation="false" data-agent-current-competing-listing-context-recommendation="false" data-agent-current-competing-listing-context-sold-comparable="false" data-agent-current-competing-listing-context-public-output="false">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl"><div className="flex items-center gap-3"><BarChart3 className="h-5 w-5 text-cyan-100" aria-hidden="true" /><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">Current competing listing context</p></div><h2 id="current-competing-listing-context-heading" className="mt-2 text-xl font-semibold text-white">Subject listing against current active competition</h2><p className="mt-3 text-sm leading-6 text-slate-300">This compares the selected MLS listing to a current active listing cohort using admitted current-snapshot metrics. It is not a CMA, valuation, sold-comparable analysis, or pricing recommendation.</p></div>
              <div className="border border-white/10 bg-black/15 p-4 text-sm" data-testid="agent-current-competing-listing-count"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Competing current listings</p><p className="mt-2 text-3xl font-semibold text-white">{competingContextState === 'READING' ? 'Reading' : formatInteger(competingContext?.cohort?.postExclusionCount ?? null)}</p><p className="mt-2 text-xs leading-5 text-slate-400">{competingContext?.cohort?.smallCohortLimitation ?? 'Subject excluded where listing identity is deterministic.'}</p></div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
              <div className="border border-white/10 bg-black/10 p-4" data-testid="agent-current-competing-listing-subject"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">Subject listing</p><dl className="mt-4 grid gap-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-400">Grain</dt><dd className="font-semibold text-white">MLS listing</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-400">Status</dt><dd className="font-semibold text-white">{property.status}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-400">Listing ZIP</dt><dd className="font-semibold text-white">{property.zip}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-400">Current asking/list price</dt><dd className="font-semibold text-white">{formatCurrency(property.price)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-400">Observed</dt><dd className="font-semibold text-white">{formatDate(source.observedAt)}</dd></div></dl></div>
              <div className="border border-white/10 bg-black/10 p-4" data-testid="agent-current-competing-listing-criteria"><div className="flex items-center gap-3"><SlidersHorizontal className="h-4 w-4 text-cyan-100" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">{competingContext?.cohort?.derivation === 'AGENT_ADJUSTED_COMPETING_COHORT' ? 'Agent-adjusted cohort' : 'System-derived starting cohort'}</p></div><div className="mt-4 flex flex-wrap gap-2">{(competingContext?.cohort?.visibleCriteria ?? ['City, residential property type, and active status']).map((item) => <span key={item} className="border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">{item}</span>)}</div><p className="mt-4 text-xs leading-5 text-slate-400">The starting cohort is transparent context. Narrowing remains Agent-controlled and uses only already admitted filters.</p></div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" data-testid="agent-current-competing-listing-refinement">
              <label className="block text-xs font-medium text-slate-300"><span>City</span><select value={competingFilters.city ?? ''} onChange={(event) => updateCompetingTextFilter('city', event.target.value)} className="mt-2 block min-h-10 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid="agent-current-competing-listing-city"><option value="">Subject city</option>{AGENT_COHORT_SUPPORTED_CITIES.map((city) => <option key={city.id} value={city.id}>{city.label}</option>)}</select></label>
              <label className="block text-xs font-medium text-slate-300"><span>Listing ZIPs</span><input value={Array.isArray(competingFilters.zip) ? competingFilters.zip.join(', ') : competingFilters.zip ?? ''} onChange={(event) => updateCompetingZipFilter(event.target.value)} placeholder={property.zip || '80301, 80302'} className="mt-2 block min-h-10 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid="agent-current-competing-listing-zip" data-agent-current-competing-listing-zip-postal-attribute="true" data-agent-current-competing-listing-zip-geography="false" /></label>
              {property.zip ? <button type="button" onClick={() => setCompetingFilters((current) => ({ ...current, zip: [property.zip] }))} className="min-h-10 border border-white/15 px-3 text-xs font-semibold text-cyan-100 transition hover:border-cyan-100/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid="agent-current-competing-listing-use-subject-zip">Use subject ZIP</button> : null}
              <label className="block text-xs font-medium text-slate-300"><span>Property type</span><select value={competingFilters.propertyType ?? ''} onChange={(event) => updateCompetingTextFilter('propertyType', event.target.value)} className="mt-2 block min-h-10 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid="agent-current-competing-listing-property-type"><option value="">Subject type</option>{AGENT_COHORT_SUPPORTED_PROPERTY_TYPES.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}</select></label>
              <label className="block text-xs font-medium text-slate-300"><span>Status scope</span><select value={competingFilters.statusScope ?? ''} onChange={(event) => updateCompetingTextFilter('statusScope', event.target.value)} className="mt-2 block min-h-10 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid="agent-current-competing-listing-status"><option value="">Active</option>{AGENT_COHORT_SUPPORTED_STATUS_SCOPES.map((status) => <option key={status.id} value={status.id}>{status.label}</option>)}</select></label>
              {([
                ['priceMin', 'Minimum price', '1'],
                ['priceMax', 'Maximum price', '1'],
                ['sqftMin', 'Minimum square feet', '1'],
                ['sqftMax', 'Maximum square feet', '1'],
                ['bedsMin', 'Minimum beds', '1'],
                ['bedsMax', 'Maximum beds', '1'],
                ['bedsExact', 'Exact beds', '1'],
                ['bathsMin', 'Minimum baths', '0.25'],
                ['bathsMax', 'Maximum baths', '0.25'],
                ['bathsExact', 'Exact baths', '0.25'],
                ['yearBuiltMin', 'Minimum year built', '1'],
                ['yearBuiltMax', 'Maximum year built', '1'],
                ['lotSizeMin', 'Minimum lot acres', '0.01'],
                ['lotSizeMax', 'Maximum lot acres', '0.01'],
              ] as const).map(([key, label, step]) => <label key={key} className="block text-xs font-medium text-slate-300"><span>{label}</span><input type="number" min="0" step={step} value={competingFilters[key] ?? ''} onChange={(event) => updateCompetingFilter(key, event.target.value)} className="mt-2 block min-h-10 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid={`agent-current-competing-listing-${key}`} /></label>)}
            </div>
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-slate-400">{selectedCompetingFilterCount} Agent-adjusted filters applied. Empty fields preserve the system-derived starting cohort.</p><button type="button" onClick={() => setCompetingFilters({})} className="inline-flex min-h-10 items-center justify-center gap-2 border border-white/15 px-4 text-sm font-semibold text-slate-200 transition hover:border-cyan-100/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid="agent-current-competing-listing-reset"><RefreshCw size={15} aria-hidden="true" /> Reset cohort</button></div>

            {competingContextState === 'FAILED' ? <p className="mt-5 border border-amber-200/25 bg-amber-100/[0.06] p-4 text-sm leading-6 text-amber-50" role="status" data-testid="agent-current-competing-listing-failed">Current competing listing context is unavailable for this subject or criteria. No fallback context was generated.</p> : null}
            {competingContext?.cohort ? <div className="mt-5 grid gap-4 lg:grid-cols-2"><section className="border border-white/10 bg-white/[0.025] p-4" aria-labelledby="current-competing-listing-metrics-heading"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Admitted cohort metrics</p><h3 id="current-competing-listing-metrics-heading" className="mt-1 text-base font-semibold text-white">Current listing summaries</h3><div className="mt-4 grid gap-3">{competingContext.cohort.metrics.filter((metric) => metric.metricId.includes('median') || metric.metricId.includes('mean') || metric.metricId.includes('record-count')).slice(0, 6).map((metric) => <article key={metric.metricId} className="border border-white/10 bg-black/15 p-3" data-testid="agent-current-competing-listing-metric" data-agent-current-competing-listing-metric-id={metric.metricId} data-agent-current-competing-listing-metric-state={metric.state}><p className="text-xs text-slate-400">{metric.label}</p><p className="mt-1 text-lg font-semibold text-white">{formatContextValue(metric.value, metric.unit)}</p><p className="mt-2 text-xs text-slate-500">Included {formatInteger(metric.includedPopulationCount)} of {formatInteger(metric.eligibleCohortCount)}; missing {formatInteger(metric.nullMissingCount)}.</p></article>)}</div></section><section className="border border-white/10 bg-white/[0.025] p-4" aria-labelledby="current-competing-listing-positioning-heading"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Factual positioning</p><h3 id="current-competing-listing-positioning-heading" className="mt-1 text-base font-semibold text-white">Subject vs cohort median</h3><div className="mt-4 grid gap-3">{competingContext.positioning.map((item) => <article key={item.field} className="border border-white/10 bg-black/15 p-3" data-testid="agent-current-competing-listing-positioning" data-agent-current-competing-listing-positioning-field={item.field} data-agent-current-competing-listing-positioning-status={item.status}><p className="text-xs text-slate-400">{item.label}</p><p className="mt-1 text-sm font-semibold text-white">{formatContextValue(item.subjectValue, item.unit)} subject / {formatContextValue(item.cohortMetricValue, item.unit)} cohort median</p><p className="mt-2 text-xs leading-5 text-slate-400">{item.absoluteDeltaFromMedian === null ? item.status.replaceAll('_', ' ') : `${formatDelta(item.absoluteDeltaFromMedian, item.unit)} the current competing cohort median.`}</p></article>)}</div></section></div> : null}
            {competingContext?.cohort ? <p className="mt-5 text-xs leading-5 text-slate-400" data-testid="agent-current-competing-listing-exclusion">Subject exclusion: {competingContext.cohort.subjectExclusion.state.replaceAll('_', ' ')} using {competingContext.cohort.subjectExclusion.identityBasis}. Pre-exclusion {formatInteger(competingContext.cohort.preExclusionCount)}, post-exclusion {formatInteger(competingContext.cohort.postExclusionCount)}.</p> : null}
          </section>

          <section className="border border-amber-200/20 bg-amber-100/[0.05] p-5 sm:p-6" aria-labelledby="checkpoints-heading"><div className="flex items-center gap-3"><Landmark className="h-5 w-5 text-amber-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-100/70">When direct review is needed</p><h2 id="checkpoints-heading" className="mt-1 text-lg font-semibold">Agent verification checkpoints</h2></div></div><div className="mt-5 grid gap-4 md:grid-cols-2">{briefing.professionalCheckpoints.map((checkpoint) => <article key={checkpoint.role} className="border border-amber-100/15 bg-black/10 p-4"><p className="text-xs font-semibold text-amber-100">{checkpoint.label}</p><h3 className="mt-2 text-sm font-semibold text-white">{formatRole(checkpoint.role)}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{checkpoint.question}</p></article>)}</div></section>

          <section className="border border-white/10 bg-white/[0.025]" aria-labelledby="sources-heading"><details className="group" data-testid="agent-property-sources-limitations"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Evidence detail</p><h2 id="sources-heading" className="mt-1 text-lg font-semibold">Sources &amp; limitations</h2></div><DisclosureStateIndicator className="h-5 w-5 text-slate-400" /></summary><div className="grid gap-5 border-t border-white/10 px-5 pb-6 pt-5 text-sm leading-6 text-slate-300 sm:px-6 lg:grid-cols-2"><div><p className="font-medium text-white">Source</p><p className="mt-1">Stored repository listing facts with the visible listing reference.</p><p className="mt-4 font-medium text-white">Observed date</p><p className="mt-1">{formatDate(source.observedAt)}</p><p className="mt-4 font-medium text-white">Currentness</p><p className="mt-1">Current repository observation.</p></div><div><p className="font-medium text-white">Not available in this briefing</p><ul className="mt-1 space-y-2">{briefing.missingEvidence.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-4 font-medium text-white">Authorized references</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">{briefing.safeReieSurfaces.map((surface) => <Link key={surface.href} href={surface.href} className="font-medium text-cyan-100 underline decoration-cyan-100/40 underline-offset-4 hover:text-white">{surface.label}</Link>)}<Link href="/search" className="font-medium text-cyan-100 underline decoration-cyan-100/40 underline-offset-4 hover:text-white">Property search</Link></div></div></div></details></section>
        </div> : null}
      </div>
    </main>
  );
}
