'use client';

import { useEffect, useMemo, useState } from 'react';
import { GitCompareArrows, RefreshCw, ShieldCheck } from 'lucide-react';

import { projectAtlasTitleHierarchy } from '@/components/ProjectAtlasTitleHierarchy';
import {
  AGENT_COHORT_SUPPORTED_CITIES,
  AGENT_COHORT_SUPPORTED_FILTER_KEYS,
  AGENT_COHORT_SUPPORTED_PROPERTY_TYPES,
  AGENT_COHORT_SUPPORTED_STATUS_SCOPES,
  type AgentCohortQuickFilters,
} from '@/lib/agentCohortBuilder';
import { mapBuyerCriteriaToAgentCohort, type AgentBuyerCriteriaComparisonMapping } from '@/lib/agentBuyerCriteriaComparisonAdapter';
import { getAgentComparisonSurfaceConfig, type AgentComparisonSurfaceId } from '@/lib/agentCurrentSnapshotComparisonSurfaceConfig';
import type { PropertyCriteriaProfile } from '@/lib/agent-advisory-workbench/propertyCriteriaProfile';

type MetricComparison = Readonly<{
  metricId: string;
  label: string;
  cohortLabels: readonly string[];
  values: readonly (number | null)[];
  unit: string;
  absoluteDelta: number | null;
  percentageDelta: number | null;
  direction: 'HIGHER' | 'LOWER' | 'SAME' | 'UNDEFINED';
  ranks: readonly (number | null)[];
  comparabilityStatus: string;
  comparabilityReasons: readonly string[];
  cohortRelationship: string;
  coverage: readonly Readonly<{ eligibleCohortCount: number; includedPopulationCount: number; nullMissingCount: number }>[];
  asOfAlignment: Readonly<{ maxSkewMs: number | null; toleranceMs: number; status: string }>;
  limitations: readonly string[];
}>;

type ComparisonState = Readonly<{
  loading: boolean;
  status: 'READY' | 'NOT_AVAILABLE';
  overallComparabilityStatus: string;
  cohorts: readonly Readonly<{ label: string; status: string; rejectionReasons: readonly string[] }>[];
  results: readonly MetricComparison[];
  rejectionReasons: readonly string[];
  requestAsOf: string | null;
}>;

const primaryMetricIds = [
  'agent.cohort.current-mls-listing-record-count.v1',
  'agent.cohort.current-asking-list-price-median.v1',
  'agent.cohort.current-asking-list-price-mean.v1',
  'agent.cohort.listed-square-feet-median.v1',
] as const;

const primaryMetricLabels = [
  'Matching current MLS listing records',
  'Current asking/list price median',
  'Current asking/list price mean',
  'Listed square feet median',
] as const;

type NumberFilterKey = 'priceMin' | 'priceMax' | 'bedsMin' | 'bathsMin' | 'sqftMin' | 'sqftMax' | 'yearBuiltMin' | 'yearBuiltMax';
type IntervalMode = 'CLOSED' | 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE';

const locationAdmittedCityIds = new Set(['boulder', 'louisville', 'lafayette']);

function formatNumber(value: number | null) {
  return value === null ? 'Unavailable' : new Intl.NumberFormat('en-US').format(value);
}

function formatMetricValue(value: number | null, unit: string) {
  if (value === null) return 'No data';
  if (unit === 'USD') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  return `${formatNumber(value)} ${unit}`;
}

function formatDelta(metric: MetricComparison) {
  if (metric.absoluteDelta === null) return 'No admitted delta';
  const formatted = formatMetricValue(Math.abs(metric.absoluteDelta), metric.unit);
  if (metric.direction === 'SAME') return 'Same';
  const suffix = metric.percentageDelta !== null ? ` (${Math.abs(metric.percentageDelta * 100).toFixed(1)}% count/listing-metric difference)` : '';
  return `${formatted} ${metric.direction === 'HIGHER' ? 'higher' : 'lower'}${suffix}`;
}

function toComparisonQuery(cohorts: readonly AgentCohortQuickFilters[], labels: readonly string[], priceInterval: IntervalMode) {
  const params = new URLSearchParams();
  params.set('purpose', 'Agent current-snapshot comparative preparation cohort.');
  params.set('audience', 'AGENT_ONLY');
  for (const metricId of primaryMetricIds) params.append('metricId', metricId);
  for (const operation of ['SIDE_BY_SIDE', 'ABSOLUTE_DELTA', 'PERCENTAGE_DELTA', 'DIRECTION', 'RANK']) params.append('operation', operation);
  if (cohorts.length === 2) {
    for (const key of AGENT_COHORT_SUPPORTED_FILTER_KEYS) {
      const leftValue = cohorts[0][key];
      const rightValue = cohorts[1][key];
      if (leftValue !== null) params.set(`a.${key}`, String(leftValue));
      if (rightValue !== null) params.set(`b.${key}`, String(rightValue));
    }
    params.set('a.priceInterval', priceInterval);
    params.set('b.priceInterval', priceInterval);
    params.set('a.label', labels[0] ?? 'Cohort A');
    params.set('b.label', labels[1] ?? 'Cohort B');
    return params.toString();
  }
  params.set('cohortCount', String(cohorts.length));
  cohorts.forEach((cohort, index) => {
    for (const key of AGENT_COHORT_SUPPORTED_FILTER_KEYS) {
      const value = cohort[key];
      if (value !== null) params.set(`cohort.${index}.${key}`, String(value));
    }
    params.set(`cohort.${index}.priceInterval`, priceInterval);
    params.set(`cohort.${index}.label`, labels[index] ?? `Cohort ${index + 1}`);
    params.set(`cohort.${index}.surface`, 'AGENT_COMPARISON');
  });
  return params.toString();
}

function inputClass() {
  return 'mt-2 block min-h-11 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100';
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-200"><span>{label}</span>{children}</label>;
}

function CohortControls({ title, filters, surface, update }: { title: string; filters: AgentCohortQuickFilters; surface: AgentComparisonSurfaceId; update: <TKey extends keyof AgentCohortQuickFilters>(key: TKey, value: AgentCohortQuickFilters[TKey]) => void }) {
  const updateNumber = (key: NumberFilterKey, value: string) => update(key, value === '' ? null : Number(value));
  const cityOptions = surface === 'LOCATION_PREPARATION' ? AGENT_COHORT_SUPPORTED_CITIES.filter((city) => locationAdmittedCityIds.has(city.id)) : AGENT_COHORT_SUPPORTED_CITIES;
  return <section className="border border-white/10 bg-black/10 p-4" aria-label={title}>
    <h3 className={projectAtlasTitleHierarchy.briefingSection}>{title}</h3>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <Field label="City">
        <select value={filters.city ?? ''} onChange={(event) => update('city', (event.target.value || null) as AgentCohortQuickFilters['city'])} className={inputClass()}>
          <option value="">Choose city</option>
          {cityOptions.map((city) => <option key={city.id} value={city.id}>{city.label}</option>)}
        </select>
      </Field>
      <Field label="Property type">
        <select value={filters.propertyType ?? ''} onChange={(event) => update('propertyType', (event.target.value || null) as AgentCohortQuickFilters['propertyType'])} className={inputClass()}>
          <option value="">Any supported type</option>
          {AGENT_COHORT_SUPPORTED_PROPERTY_TYPES.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
        </select>
      </Field>
      <Field label="Status scope">
        <select value={filters.statusScope} onChange={(event) => update('statusScope', event.target.value as AgentCohortQuickFilters['statusScope'])} className={inputClass()}>
          {AGENT_COHORT_SUPPORTED_STATUS_SCOPES.map((status) => <option key={status.id} value={status.id}>{status.label}</option>)}
        </select>
      </Field>
      <Field label="Minimum price"><input type="number" min="0" inputMode="numeric" value={filters.priceMin ?? ''} onChange={(event) => updateNumber('priceMin', event.target.value)} className={inputClass()} /></Field>
      <Field label="Maximum price"><input type="number" min="0" inputMode="numeric" value={filters.priceMax ?? ''} onChange={(event) => updateNumber('priceMax', event.target.value)} className={inputClass()} /></Field>
      <Field label="Minimum beds"><input type="number" min="0" inputMode="numeric" value={filters.bedsMin ?? ''} onChange={(event) => updateNumber('bedsMin', event.target.value)} className={inputClass()} /></Field>
      <Field label="Minimum baths"><input type="number" min="0" inputMode="numeric" value={filters.bathsMin ?? ''} onChange={(event) => updateNumber('bathsMin', event.target.value)} className={inputClass()} /></Field>
      <Field label="Minimum square feet"><input type="number" min="0" inputMode="numeric" value={filters.sqftMin ?? ''} onChange={(event) => updateNumber('sqftMin', event.target.value)} className={inputClass()} /></Field>
      <Field label="Maximum square feet"><input type="number" min="0" inputMode="numeric" value={filters.sqftMax ?? ''} onChange={(event) => updateNumber('sqftMax', event.target.value)} className={inputClass()} /></Field>
    </div>
  </section>;
}

export default function AgentCurrentSnapshotComparison({ surface, buyerCriteriaProfile }: { surface: AgentComparisonSurfaceId; buyerCriteriaProfile?: PropertyCriteriaProfile | null }) {
  const config = getAgentComparisonSurfaceConfig(surface);
  const buyerMapping: AgentBuyerCriteriaComparisonMapping | null = useMemo(
    () => surface === 'BUYER_PREPARATION' && buyerCriteriaProfile ? mapBuyerCriteriaToAgentCohort(buyerCriteriaProfile, config.defaultLeft) : null,
    [buyerCriteriaProfile, config.defaultLeft, surface],
  );
  const initialCohorts = buyerMapping ? config.defaultCohorts.map((cohort) => ({ ...buyerMapping.filters, city: cohort.city })) : config.defaultCohorts;
  const [cohorts, setCohorts] = useState<readonly AgentCohortQuickFilters[]>(() => initialCohorts);
  const [priceInterval, setPriceInterval] = useState<IntervalMode>('CLOSED');
  const [refreshToken, setRefreshToken] = useState(0);
  const [comparison, setComparison] = useState<ComparisonState>({ loading: true, status: 'NOT_AVAILABLE', overallComparabilityStatus: 'NOT_COMPARABLE', cohorts: [], results: [], rejectionReasons: [], requestAsOf: null });
  const labels = useMemo(() => cohorts.map((cohort, index) => cohort.city ? AGENT_COHORT_SUPPORTED_CITIES.find((city) => city.id === cohort.city)?.label ?? `Cohort ${index + 1}` : `Cohort ${index + 1}`), [cohorts]);
  const query = useMemo(() => toComparisonQuery(cohorts, labels, priceInterval), [cohorts, labels, priceInterval]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/agent/current-snapshot-comparison?${query}`, { method: 'GET', signal: controller.signal, cache: 'no-store', credentials: 'same-origin' })
      .then(async (response) => {
        const payload = await response.json();
        setComparison({
          loading: false,
          status: payload.status === 'READY' ? 'READY' : 'NOT_AVAILABLE',
          overallComparabilityStatus: typeof payload.overallComparabilityStatus === 'string' ? payload.overallComparabilityStatus : 'NOT_COMPARABLE',
          cohorts: Array.isArray(payload.cohorts) ? payload.cohorts : [],
          results: Array.isArray(payload.results) ? payload.results : [],
          rejectionReasons: Array.isArray(payload.rejectionReasons) ? payload.rejectionReasons : [],
          requestAsOf: typeof payload.requestAsOf === 'string' ? payload.requestAsOf : null,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setComparison({ loading: false, status: 'NOT_AVAILABLE', overallComparabilityStatus: 'NOT_COMPARABLE', cohorts: [], results: [], rejectionReasons: ['COMPARISON_READ_UNAVAILABLE'], requestAsOf: null });
      });
    return () => controller.abort();
  }, [query, refreshToken]);

  const updateCohort = (index: number) => <TKey extends keyof AgentCohortQuickFilters>(key: TKey, value: AgentCohortQuickFilters[TKey]) => setCohorts((current) => current.map((cohort, cohortIndex) => cohortIndex === index ? { ...cohort, [key]: value } : cohort));
  const addCohort = () => setCohorts((current) => {
    if (current.length >= 6) return current;
    const nextCity = AGENT_COHORT_SUPPORTED_CITIES[current.length % AGENT_COHORT_SUPPORTED_CITIES.length]?.id ?? 'boulder';
    return [...current, { ...current[current.length - 1], city: nextCity }];
  });
  const removeCohort = (index: number) => setCohorts((current) => current.length <= 2 ? current : current.filter((_, cohortIndex) => cohortIndex !== index));

  return <section
    className="mt-8 border border-emerald-200/20 bg-emerald-100/[0.045] p-5 sm:p-6"
    aria-labelledby="agent-current-snapshot-comparison-heading"
    data-testid="agent-current-snapshot-comparison"
    data-agent-comparison-surface={surface}
    data-agent-comparison-grain="MLS_LISTING"
    data-agent-comparison-temporal-basis="OBSERVATION_AS_OF_TIMESTAMP"
    data-agent-comparison-period-form="AS_OF_INSTANT_SNAPSHOT"
    data-agent-comparison-source-scope="CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION"
    data-agent-comparison-audience="AGENT_ONLY"
    data-agent-comparison-public-output="false"
    data-agent-comparison-provider-activity="false"
    data-agent-comparison-persistence="false"
    data-agent-comparison-historical="false"
    data-agent-comparison-scenario="false"
  >
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3"><GitCompareArrows className="h-5 w-5 text-emerald-100" aria-hidden="true" /><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-100/80">{config.eyebrow}</p></div>
        <h2 id="agent-current-snapshot-comparison-heading" className={`mt-2 ${projectAtlasTitleHierarchy.selectionSection}`}>{config.heading}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{config.supportingCopy}</p>
        <p className="sr-only">{primaryMetricLabels.join('; ')}</p>
      </div>
      <button type="button" onClick={() => { setComparison((current) => ({ ...current, loading: true })); setRefreshToken((current) => current + 1); }} className="inline-flex min-h-11 items-center justify-center gap-2 bg-emerald-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-100" data-testid="agent-current-snapshot-comparison-refresh"><RefreshCw size={16} aria-hidden="true" /> Refresh comparison</button>
    </div>

    <div className="mt-6 grid gap-4 xl:grid-cols-3 xl:items-start">
      {cohorts.map((cohort, index) => <div key={index} className="relative">
        <CohortControls title={labels[index] ?? `Cohort ${index + 1}`} filters={cohort} surface={surface} update={updateCohort(index)} />
        {cohorts.length > 2 ? <button type="button" onClick={() => removeCohort(index)} className="mt-2 min-h-9 border border-white/15 px-3 text-xs font-semibold text-slate-200">Remove cohort</button> : null}
      </div>)}
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button type="button" onClick={addCohort} disabled={cohorts.length >= 6} className="min-h-10 border border-emerald-200/30 px-3 text-xs font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-50">Add cohort</button>
      <p className="text-xs text-slate-400">{cohorts.length} selected; minimum 2, maximum 6. Request order is preserved separately from rank.</p>
    </div>

    {config.generatedBandControl ? <section className="mt-4 border border-white/10 bg-black/10 p-4" data-testid="agent-current-snapshot-interval-controls">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Price band boundary</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Inclusive preserves current Quick Filter behavior. Non-overlapping generated bands make shared-endpoint price segments disjoint.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setPriceInterval('CLOSED')} className={`min-h-10 px-3 text-xs font-semibold ${priceInterval === 'CLOSED' ? 'bg-emerald-200 text-slate-950' : 'border border-white/15 text-slate-200'}`}>Inclusive bands</button>
          <button type="button" onClick={() => setPriceInterval('LOWER_INCLUSIVE_UPPER_EXCLUSIVE')} className={`min-h-10 px-3 text-xs font-semibold ${priceInterval === 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE' ? 'bg-emerald-200 text-slate-950' : 'border border-white/15 text-slate-200'}`}>Non-overlapping generated bands</button>
        </div>
      </div>
    </section> : null}

    <section className="mt-5 border border-white/10 bg-white/[0.025] p-4" aria-labelledby="agent-current-snapshot-results-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-100/70">Primary comparative metrics</p>
          <h3 id="agent-current-snapshot-results-heading" className={projectAtlasTitleHierarchy.briefingSection}>{config.resultHeading}</h3>
        </div>
        <p className="text-xs text-slate-400">{comparison.loading ? 'Reading current cohorts' : comparison.status === 'READY' ? `Current snapshot: ${comparison.overallComparabilityStatus}` : 'Comparison unavailable'}</p>
      </div>
      {comparison.rejectionReasons.length ? <p className="mt-4 border border-amber-200/20 bg-amber-100/[0.05] p-3 text-sm leading-6 text-amber-50" data-testid="agent-current-snapshot-comparison-rejections">{comparison.rejectionReasons.join(', ')}</p> : null}
      {comparison.cohorts.length ? <div className="mt-4 grid gap-2 md:grid-cols-3" data-testid="agent-current-snapshot-cohort-statuses">
        {comparison.cohorts.map((cohort, index) => <div key={`${cohort.label}-${index}`} className="border border-white/10 bg-black/15 p-3"><p className="text-xs font-semibold text-white">{cohort.label}</p><p className="mt-1 text-xs text-slate-400">{cohort.status}</p>{cohort.rejectionReasons.length ? <p className="mt-1 text-xs text-amber-100">{cohort.rejectionReasons.join(', ')}</p> : null}</div>)}
      </div> : null}
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {comparison.results.map((metric) => <article key={metric.metricId} className="border border-white/10 bg-black/15 p-4" data-testid="agent-current-snapshot-comparison-metric" data-agent-comparison-metric-id={metric.metricId} data-agent-comparison-status={metric.comparabilityStatus} data-agent-comparison-relationship={metric.cohortRelationship}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs leading-5 text-slate-400">{metric.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{formatDelta(metric)}</p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-100/80">{metric.comparabilityStatus}</p>
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {metric.values.map((value, index) => <div key={`${metric.metricId}-${index}`}><dt className="text-xs text-slate-500">{metric.cohortLabels[index] ?? `Cohort ${index + 1}`}</dt><dd className="mt-1 text-sm font-semibold text-slate-100">{formatMetricValue(value ?? null, metric.unit)}{metric.ranks[index] ? <span className="ml-2 text-xs font-normal text-emerald-100">Rank {metric.ranks[index]}</span> : null}</dd></div>)}
          </dl>
          <p className="mt-3 text-xs leading-5 text-slate-400">Coverage is shown per cohort in request order. Relationship: {metric.cohortRelationship}. As-of skew: {metric.asOfAlignment.maxSkewMs ?? 'unknown'} ms.</p>
        </article>)}
        {!comparison.results.length ? <p className="border border-dashed border-white/15 p-4 text-sm text-slate-400" data-testid="agent-current-snapshot-comparison-empty">No current-snapshot comparative artifacts are available for these cohorts.</p> : null}
      </div>
    </section>

    <details className="mt-5 border border-white/10 bg-black/10" data-testid="agent-current-snapshot-comparison-boundary">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 text-sm font-semibold text-emerald-100"><ShieldCheck size={16} aria-hidden="true" /> Source, grain, and limits</summary>
      <div className="grid gap-4 border-t border-white/10 p-4 text-sm leading-6 text-slate-300 lg:grid-cols-2">
        <div><p className="font-medium text-white">Source scope</p><p className="mt-1">Current repository property search projection. Results are current MLS listing-record observations only.</p></div>
        <div><p className="font-medium text-white">Not admitted here</p><p className="mt-1">Historical comparisons, closed-sale pricing, valuation, DOM/CDOM, supply, absorption, negotiation posture, recommendations, public reports, and export.</p><p className="mt-3">{config.boundaryCopy}</p></div>
      </div>
    </details>
    {buyerMapping ? <section className="mt-5 border border-white/10 bg-black/10 p-4" data-testid="agent-buyer-criteria-comparison-mapping" data-buyer-criteria-mapping-status={buyerMapping.status}>
      <p className="text-sm font-semibold text-white">Buyer criteria mapping</p>
      <p className="mt-2 text-xs leading-5 text-slate-400">Mapped: {buyerMapping.mappedCriteria.length ? buyerMapping.mappedCriteria.join(', ') : 'No supported criteria selected yet'}.</p>
      <p className="mt-2 text-xs leading-5 text-amber-100">Not mapped: {buyerMapping.unmappedCriteria.length ? buyerMapping.unmappedCriteria.join(', ') : 'None'}.</p>
    </section> : null}
  </section>;
}
