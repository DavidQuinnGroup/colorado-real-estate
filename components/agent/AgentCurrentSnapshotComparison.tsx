'use client';

import { useEffect, useMemo, useState } from 'react';
import { GitCompareArrows, RefreshCw, ShieldCheck } from 'lucide-react';

import { projectAtlasTitleHierarchy } from '@/components/ProjectAtlasTitleHierarchy';
import {
  AGENT_COHORT_EMPTY_FILTERS,
  AGENT_COHORT_SUPPORTED_CITIES,
  AGENT_COHORT_SUPPORTED_FILTER_KEYS,
  AGENT_COHORT_SUPPORTED_PROPERTY_TYPES,
  AGENT_COHORT_SUPPORTED_STATUS_SCOPES,
  type AgentCohortQuickFilters,
} from '@/lib/agentCohortBuilder';

type MetricComparison = Readonly<{
  metricId: string;
  label: string;
  values: readonly (number | null)[];
  unit: string;
  absoluteDelta: number | null;
  percentageDelta: number | null;
  direction: 'HIGHER' | 'LOWER' | 'SAME' | 'UNDEFINED';
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

function toComparisonQuery(left: AgentCohortQuickFilters, right: AgentCohortQuickFilters) {
  const params = new URLSearchParams();
  params.set('purpose', 'Agent current-snapshot comparative preparation cohort.');
  params.set('audience', 'AGENT_ONLY');
  for (const metricId of primaryMetricIds) params.append('metricId', metricId);
  for (const operation of ['SIDE_BY_SIDE', 'ABSOLUTE_DELTA', 'PERCENTAGE_DELTA', 'DIRECTION', 'RANK']) params.append('operation', operation);
  for (const key of AGENT_COHORT_SUPPORTED_FILTER_KEYS) {
    const leftValue = left[key];
    const rightValue = right[key];
    if (leftValue !== null) params.set(`a.${key}`, String(leftValue));
    if (rightValue !== null) params.set(`b.${key}`, String(rightValue));
  }
  params.set('a.label', 'Cohort A');
  params.set('b.label', 'Cohort B');
  return params.toString();
}

function inputClass() {
  return 'mt-2 block min-h-11 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100';
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-200"><span>{label}</span>{children}</label>;
}

function CohortControls({ title, filters, update }: { title: string; filters: AgentCohortQuickFilters; update: <TKey extends keyof AgentCohortQuickFilters>(key: TKey, value: AgentCohortQuickFilters[TKey]) => void }) {
  const updateNumber = (key: NumberFilterKey, value: string) => update(key, value === '' ? null : Number(value));
  return <section className="border border-white/10 bg-black/10 p-4" aria-label={title}>
    <h3 className={projectAtlasTitleHierarchy.briefingSection}>{title}</h3>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <Field label="City">
        <select value={filters.city ?? ''} onChange={(event) => update('city', (event.target.value || null) as AgentCohortQuickFilters['city'])} className={inputClass()}>
          <option value="">Choose city</option>
          {AGENT_COHORT_SUPPORTED_CITIES.map((city) => <option key={city.id} value={city.id}>{city.label}</option>)}
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

export default function AgentCurrentSnapshotComparison({ surface }: { surface: 'MARKET_UPDATE_PREPARATION' | 'AGENT_WORKSPACE' }) {
  const [left, setLeft] = useState<AgentCohortQuickFilters>({ ...AGENT_COHORT_EMPTY_FILTERS, city: 'boulder', propertyType: 'residential' });
  const [right, setRight] = useState<AgentCohortQuickFilters>({ ...AGENT_COHORT_EMPTY_FILTERS, city: 'louisville', propertyType: 'residential' });
  const [refreshToken, setRefreshToken] = useState(0);
  const [comparison, setComparison] = useState<ComparisonState>({ loading: true, status: 'NOT_AVAILABLE', results: [], rejectionReasons: [], requestAsOf: null });
  const query = useMemo(() => toComparisonQuery(left, right), [left, right]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/agent/current-snapshot-comparison?${query}`, { method: 'GET', signal: controller.signal, cache: 'no-store', credentials: 'same-origin' })
      .then(async (response) => {
        const payload = await response.json();
        setComparison({
          loading: false,
          status: payload.status === 'READY' ? 'READY' : 'NOT_AVAILABLE',
          results: Array.isArray(payload.results) ? payload.results : [],
          rejectionReasons: Array.isArray(payload.rejectionReasons) ? payload.rejectionReasons : [],
          requestAsOf: typeof payload.requestAsOf === 'string' ? payload.requestAsOf : null,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setComparison({ loading: false, status: 'NOT_AVAILABLE', results: [], rejectionReasons: ['COMPARISON_READ_UNAVAILABLE'], requestAsOf: null });
      });
    return () => controller.abort();
  }, [query, refreshToken]);

  const updateLeft = <TKey extends keyof AgentCohortQuickFilters>(key: TKey, value: AgentCohortQuickFilters[TKey]) => setLeft((current) => ({ ...current, [key]: value }));
  const updateRight = <TKey extends keyof AgentCohortQuickFilters>(key: TKey, value: AgentCohortQuickFilters[TKey]) => setRight((current) => ({ ...current, [key]: value }));

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
        <div className="flex items-center gap-3"><GitCompareArrows className="h-5 w-5 text-emerald-100" aria-hidden="true" /><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-100/80">Current-snapshot comparison</p></div>
        <h2 id="agent-current-snapshot-comparison-heading" className={`mt-2 ${projectAtlasTitleHierarchy.selectionSection}`}>Compare two current listing cohorts</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">Agent-only side-by-side comparison using admitted current listing metrics, explicit cohort filters, coverage, and as-of metadata.</p>
        <p className="sr-only">{primaryMetricLabels.join('; ')}</p>
      </div>
      <button type="button" onClick={() => { setComparison((current) => ({ ...current, loading: true })); setRefreshToken((current) => current + 1); }} className="inline-flex min-h-11 items-center justify-center gap-2 bg-emerald-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-100" data-testid="agent-current-snapshot-comparison-refresh"><RefreshCw size={16} aria-hidden="true" /> Refresh comparison</button>
    </div>

    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:items-start">
      <CohortControls title="Cohort A" filters={left} update={updateLeft} />
      <div className="hidden h-full items-center justify-center px-1 text-sm font-bold uppercase tracking-[0.14em] text-emerald-100/70 xl:flex">vs</div>
      <CohortControls title="Cohort B" filters={right} update={updateRight} />
    </div>

    <section className="mt-5 border border-white/10 bg-white/[0.025] p-4" aria-labelledby="agent-current-snapshot-results-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-100/70">Primary comparative metrics</p>
          <h3 id="agent-current-snapshot-results-heading" className={projectAtlasTitleHierarchy.briefingSection}>Principal differences</h3>
        </div>
        <p className="text-xs text-slate-400">{comparison.loading ? 'Reading current cohorts' : comparison.status === 'READY' ? 'Comparable current snapshot' : 'Comparison unavailable'}</p>
      </div>
      {comparison.rejectionReasons.length ? <p className="mt-4 border border-amber-200/20 bg-amber-100/[0.05] p-3 text-sm leading-6 text-amber-50" data-testid="agent-current-snapshot-comparison-rejections">{comparison.rejectionReasons.join(', ')}</p> : null}
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
            <div><dt className="text-xs text-slate-500">Cohort A</dt><dd className="mt-1 text-sm font-semibold text-slate-100">{formatMetricValue(metric.values[0] ?? null, metric.unit)}</dd></div>
            <div><dt className="text-xs text-slate-500">Cohort B</dt><dd className="mt-1 text-sm font-semibold text-slate-100">{formatMetricValue(metric.values[1] ?? null, metric.unit)}</dd></div>
          </dl>
          <p className="mt-3 text-xs leading-5 text-slate-400">Coverage A {formatNumber(metric.coverage[0]?.includedPopulationCount ?? null)} of {formatNumber(metric.coverage[0]?.eligibleCohortCount ?? null)}; B {formatNumber(metric.coverage[1]?.includedPopulationCount ?? null)} of {formatNumber(metric.coverage[1]?.eligibleCohortCount ?? null)}. Relationship: {metric.cohortRelationship}. As-of skew: {metric.asOfAlignment.maxSkewMs ?? 'unknown'} ms.</p>
        </article>)}
        {!comparison.results.length ? <p className="border border-dashed border-white/15 p-4 text-sm text-slate-400" data-testid="agent-current-snapshot-comparison-empty">No current-snapshot comparative artifacts are available for these cohorts.</p> : null}
      </div>
    </section>

    <details className="mt-5 border border-white/10 bg-black/10" data-testid="agent-current-snapshot-comparison-boundary">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 text-sm font-semibold text-emerald-100"><ShieldCheck size={16} aria-hidden="true" /> Source, grain, and limits</summary>
      <div className="grid gap-4 border-t border-white/10 p-4 text-sm leading-6 text-slate-300 lg:grid-cols-2">
        <div><p className="font-medium text-white">Source scope</p><p className="mt-1">Current repository property search projection. Results are current MLS listing-record observations only.</p></div>
        <div><p className="font-medium text-white">Not admitted here</p><p className="mt-1">Historical comparisons, closed-sale pricing, valuation, DOM/CDOM, supply, absorption, negotiation posture, recommendations, public reports, and export.</p></div>
      </div>
    </details>
  </section>;
}
