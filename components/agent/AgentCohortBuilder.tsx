'use client';

import { useEffect, useMemo, useState } from 'react';
import { ListFilter, RefreshCw, RotateCcw, ShieldCheck } from 'lucide-react';

import { projectAtlasTitleHierarchy } from '@/components/ProjectAtlasTitleHierarchy';
import {
  AGENT_COHORT_COUNT_LABEL,
  AGENT_COHORT_EMPTY_FILTERS,
  AGENT_COHORT_SUPPORTED_CITIES,
  AGENT_COHORT_SUPPORTED_PROPERTY_TYPES,
  AGENT_COHORT_SUPPORTED_STATUS_SCOPES,
  AGENT_COHORT_SUPPORTED_FILTER_KEYS,
  type AgentCohortQuickFilters,
} from '@/lib/agentCohortBuilder';

type CountState = Readonly<{
  loading: boolean;
  available: boolean;
  value: number | null;
  cohortId: string | null;
  reasons: readonly string[];
  asOf: string | null;
  artifacts: readonly MetricArtifact[];
}>;

type NumberFilterKey = 'priceMin' | 'priceMax' | 'bedsMin' | 'bathsMin' | 'sqftMin' | 'sqftMax' | 'yearBuiltMin' | 'yearBuiltMax';
type MetricArtifact = Readonly<{
  metricId: string;
  label: string;
  state: 'READY' | 'NO_DATA' | 'REJECTED';
  value: number | null;
  unit: string;
  aggregation: string;
  fieldBasis: string;
  eligibleCohortCount: number;
  includedPopulationCount: number;
  nullMissingCount: number;
  calculationVersion: string;
  limitations: readonly string[];
}>;

function formatNumber(value: number | null) {
  return value === null ? 'Unavailable' : new Intl.NumberFormat('en-US').format(value);
}

function formatMetricValue(metric: MetricArtifact) {
  if (metric.value === null) return 'No data';
  if (metric.unit === 'USD') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(metric.value);
  return `${formatNumber(metric.value)} ${metric.unit}`;
}

function toQuery(filters: AgentCohortQuickFilters) {
  const params = new URLSearchParams();
  params.set('purpose', 'Agent recurring analytical/reporting preparation cohort.');
  for (const key of AGENT_COHORT_SUPPORTED_FILTER_KEYS) {
    const value = filters[key];
    if (value !== null) params.set(key, String(value));
  }
  return params.toString();
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-200"><span>{label}</span>{children}</label>;
}

function inputClass() {
  return 'mt-2 block min-h-11 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100';
}

export default function AgentCohortBuilder({ surface }: { surface: 'MARKET_UPDATE_PREPARATION' | 'AGENT_WORKSPACE' }) {
  const [filters, setFilters] = useState<AgentCohortQuickFilters>(AGENT_COHORT_EMPTY_FILTERS);
  const [count, setCount] = useState<CountState>({ loading: false, available: false, value: null, cohortId: null, reasons: [], asOf: null, artifacts: [] });
  const [refreshToken, setRefreshToken] = useState(0);
  const query = useMemo(() => toQuery(filters), [filters]);
  const selectedFilterCount = useMemo(() => Object.entries(filters).filter(([key, value]) => key !== 'statusScope' && value !== null).length, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/agent/cohort-count?${query}`, { method: 'GET', signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        setCount({
          loading: false,
          available: Boolean(payload.count?.available),
          value: typeof payload.count?.value === 'number' ? payload.count.value : null,
          cohortId: typeof payload.cohort?.id === 'string' ? payload.cohort.id : null,
          reasons: Array.isArray(payload.cohort?.validation?.reasons) ? payload.cohort.validation.reasons : [],
          asOf: typeof payload.count?.asOf === 'string' ? payload.count.asOf : null,
          artifacts: Array.isArray(payload.metrics?.artifacts) ? payload.metrics.artifacts : [],
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setCount({ loading: false, available: false, value: null, cohortId: null, reasons: ['COUNT_READ_UNAVAILABLE'], asOf: null, artifacts: [] });
      });
    return () => controller.abort();
  }, [query, refreshToken]);

  const update = <TKey extends keyof AgentCohortQuickFilters>(key: TKey, value: AgentCohortQuickFilters[TKey]) => setFilters((current) => ({ ...current, [key]: value }));
  const updateNumber = (key: NumberFilterKey, value: string) => update(key, value === '' ? null : Number(value));
  const reset = () => setFilters(AGENT_COHORT_EMPTY_FILTERS);

  return <section
    className="mt-8 border border-cyan-200/20 bg-cyan-100/[0.045] p-5 sm:p-6"
    aria-labelledby="agent-cohort-builder-heading"
    data-testid="agent-cohort-builder"
    data-agent-cohort-surface={surface}
    data-agent-cohort-grain="MLS_LISTING"
    data-agent-cohort-temporal-basis="OBSERVATION_AS_OF_TIMESTAMP"
    data-agent-cohort-period-form="AS_OF_INSTANT_SNAPSHOT"
    data-agent-cohort-source-scope="CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION"
    data-agent-cohort-public-output="false"
    data-agent-cohort-provider-activity="false"
    data-agent-cohort-persistence="false"
    data-agent-cohort-scenario="false"
  >
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3"><ListFilter className="h-5 w-5 text-cyan-100" aria-hidden="true" /><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">Reusable Agent cohort</p></div>
        <h2 id="agent-cohort-builder-heading" className={`mt-2 ${projectAtlasTitleHierarchy.selectionSection}`}>Define a current listing cohort</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">Quick Filters create one reusable, session-only cohort definition for Agent preparation surfaces. The admitted count is current listing-record stock only.</p>
      </div>
      <div className="border border-white/10 bg-black/15 p-4 text-sm" data-testid="agent-cohort-count-card" data-agent-cohort-count-label={AGENT_COHORT_COUNT_LABEL}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{AGENT_COHORT_COUNT_LABEL}</p>
        <p className="mt-2 text-3xl font-semibold text-white" aria-live="polite">{count.loading ? 'Reading' : formatNumber(count.value)}</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">{count.available ? 'Current repository observation.' : 'Count unavailable until validation and local read succeed.'}</p>
      </div>
    </div>

    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      <Field label="City">
        <select value={filters.city ?? ''} onChange={(event) => update('city', (event.target.value || null) as AgentCohortQuickFilters['city'])} className={inputClass()} data-testid="agent-cohort-city">
          <option value="">Choose city</option>
          {AGENT_COHORT_SUPPORTED_CITIES.map((city) => <option key={city.id} value={city.id}>{city.label}</option>)}
        </select>
      </Field>
      <Field label="Property type">
        <select value={filters.propertyType ?? ''} onChange={(event) => update('propertyType', (event.target.value || null) as AgentCohortQuickFilters['propertyType'])} className={inputClass()} data-testid="agent-cohort-property-type">
          <option value="">Any supported type</option>
          {AGENT_COHORT_SUPPORTED_PROPERTY_TYPES.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
        </select>
      </Field>
      <Field label="Status scope">
        <select value={filters.statusScope} onChange={(event) => update('statusScope', event.target.value as AgentCohortQuickFilters['statusScope'])} className={inputClass()} data-testid="agent-cohort-status">
          {AGENT_COHORT_SUPPORTED_STATUS_SCOPES.map((status) => <option key={status.id} value={status.id}>{status.label}</option>)}
        </select>
      </Field>
      <Field label="Minimum price"><input type="number" min="0" inputMode="numeric" value={filters.priceMin ?? ''} onChange={(event) => updateNumber('priceMin', event.target.value)} className={inputClass()} data-testid="agent-cohort-price-min" /></Field>
      <Field label="Maximum price"><input type="number" min="0" inputMode="numeric" value={filters.priceMax ?? ''} onChange={(event) => updateNumber('priceMax', event.target.value)} className={inputClass()} data-testid="agent-cohort-price-max" /></Field>
      <Field label="Minimum beds"><input type="number" min="0" inputMode="numeric" value={filters.bedsMin ?? ''} onChange={(event) => updateNumber('bedsMin', event.target.value)} className={inputClass()} data-testid="agent-cohort-beds-min" /></Field>
      <Field label="Minimum baths"><input type="number" min="0" inputMode="numeric" value={filters.bathsMin ?? ''} onChange={(event) => updateNumber('bathsMin', event.target.value)} className={inputClass()} data-testid="agent-cohort-baths-min" /></Field>
      <Field label="Minimum square feet"><input type="number" min="0" inputMode="numeric" value={filters.sqftMin ?? ''} onChange={(event) => updateNumber('sqftMin', event.target.value)} className={inputClass()} data-testid="agent-cohort-sqft-min" /></Field>
      <Field label="Maximum square feet"><input type="number" min="0" inputMode="numeric" value={filters.sqftMax ?? ''} onChange={(event) => updateNumber('sqftMax', event.target.value)} className={inputClass()} data-testid="agent-cohort-sqft-max" /></Field>
      <Field label="Minimum year built"><input type="number" min="1800" inputMode="numeric" value={filters.yearBuiltMin ?? ''} onChange={(event) => updateNumber('yearBuiltMin', event.target.value)} className={inputClass()} data-testid="agent-cohort-year-built-min" /></Field>
      <Field label="Maximum year built"><input type="number" min="1800" inputMode="numeric" value={filters.yearBuiltMax ?? ''} onChange={(event) => updateNumber('yearBuiltMax', event.target.value)} className={inputClass()} data-testid="agent-cohort-year-built-max" /></Field>
    </div>

    <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm leading-6 text-slate-400">
        <p>{selectedFilterCount} explicit quick filters applied. Grain: MLS listing. Basis: current as-of observation.</p>
        {count.reasons.length ? <p className="mt-1 text-amber-100" data-testid="agent-cohort-validation-reasons">{count.reasons.join(', ')}</p> : null}
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-100/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid="agent-cohort-reset"><RotateCcw size={16} aria-hidden="true" /> Clear</button>
        <button type="button" onClick={() => setRefreshToken((current) => current + 1)} className="inline-flex min-h-11 items-center gap-2 bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid="agent-cohort-refresh"><RefreshCw size={16} aria-hidden="true" /> Refresh count</button>
      </div>
    </div>

    <details className="mt-5 border border-white/10 bg-black/10" data-testid="agent-cohort-source-boundary">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 text-sm font-semibold text-cyan-100"><ShieldCheck size={16} aria-hidden="true" /> Source, grain, and limits</summary>
      <div className="grid gap-4 border-t border-white/10 p-4 text-sm leading-6 text-slate-300 lg:grid-cols-2">
        <div><p className="font-medium text-white">Source scope</p><p className="mt-1">Current repository property search projection. No provider, MLS, IRES, CRM, email, saved-search, or public reporting action is performed.</p></div>
        <div><p className="font-medium text-white">Not admitted here</p><p className="mt-1">Sales, DOM/CDOM, DTO/DTS, absorption, SP/LP, relist episodes, client reports, PDF/export, scenarios, recommendations, and historical comparisons.</p></div>
      </div>
    </details>

    <section className="mt-5 border border-white/10 bg-white/[0.025] p-4" aria-labelledby="agent-cohort-aggregations-heading" data-testid="agent-cohort-aggregations" data-agent-cohort-aggregation-version={count.artifacts[0]?.calculationVersion ?? 'AGENT_COHORT_BASIC_AGGREGATION_V1'}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Admitted aggregations</p>
          <h3 id="agent-cohort-aggregations-heading" className={projectAtlasTitleHierarchy.briefingSection}>Current listing summaries</h3>
        </div>
        <p className="text-xs text-slate-400">Agent-only, current as-of snapshot</p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {count.artifacts.map((metric) => <article key={metric.metricId} className="border border-white/10 bg-black/15 p-4" data-testid="agent-cohort-metric-artifact" data-agent-cohort-metric-id={metric.metricId} data-agent-cohort-metric-state={metric.state} data-agent-cohort-field-basis={metric.fieldBasis} data-agent-cohort-aggregation={metric.aggregation}>
          <p className="text-xs leading-5 text-slate-400">{metric.label}</p>
          <p className="mt-2 text-xl font-semibold text-white">{formatMetricValue(metric)}</p>
          <p className="mt-3 text-xs leading-5 text-slate-400">Included {formatNumber(metric.includedPopulationCount)} of {formatNumber(metric.eligibleCohortCount)} listing records. Null/missing {formatNumber(metric.nullMissingCount)}.</p>
        </article>)}
        {!count.artifacts.length ? <p className="border border-dashed border-white/15 p-4 text-sm text-slate-400" data-testid="agent-cohort-no-aggregations">No admitted aggregate artifacts are available for this cohort.</p> : null}
      </div>
    </section>
  </section>;
}
