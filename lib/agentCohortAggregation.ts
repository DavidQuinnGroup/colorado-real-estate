import type { Prisma } from '@prisma/client';

import {
  AGENT_COHORT_COUNT_LABEL,
  buildAgentCohortCountContract,
  normalizeAgentCohortDefinition,
  type AgentCohortInput,
  type AgentCohortNormalizedDefinition,
} from './agentCohortBuilder';
import { buildAgentCohortPrismaWhere } from './agentCohortCount';
import { prisma } from './prisma';

export const ADMITTED_BASIC_AGGREGATION_WAVE_2_STATUS =
  'ADMITTED_BASIC_AGGREGATION_BOUNDED_IMPLEMENTATION_WAVE_2_CERTIFIED' as const;
export const ADMITTED_BASIC_AGGREGATION_NEXT_GATE = 'READY_FOR_COMPARATIVE_INTELLIGENCE_FOUNDATION_ADMISSION_REVIEW' as const;
export const AGENT_COHORT_AGGREGATION_VERSION = 'AGENT_COHORT_BASIC_AGGREGATION_V1' as const;

export const AGENT_COHORT_METRIC_IDS = [
  'agent.cohort.current-mls-listing-record-count.v1',
  'agent.cohort.current-asking-list-price-min.v1',
  'agent.cohort.current-asking-list-price-max.v1',
  'agent.cohort.current-asking-list-price-median.v1',
  'agent.cohort.current-asking-list-price-mean.v1',
  'agent.cohort.bedrooms-median.v1',
  'agent.cohort.bathrooms-median.v1',
  'agent.cohort.listed-square-feet-median.v1',
  'agent.cohort.year-built-median.v1',
] as const;

export type AgentCohortMetricId = (typeof AGENT_COHORT_METRIC_IDS)[number];
export type AgentCohortAggregation = 'COUNT' | 'MINIMUM' | 'MAXIMUM' | 'MEDIAN' | 'ARITHMETIC_MEAN';
export type AgentCohortMetricState = 'READY' | 'NO_DATA' | 'REJECTED';
type NumericField = 'price' | 'beds' | 'baths' | 'sqft' | 'yearBuilt';

export type AgentCohortMetricDefinition = Readonly<{
  metricId: AgentCohortMetricId;
  label: string;
  fieldBasis: NumericField | 'record';
  aggregation: AgentCohortAggregation;
  unit: 'listing records' | 'USD' | 'bedrooms' | 'bathrooms' | 'listed square feet' | 'year';
  calculationVersion: typeof AGENT_COHORT_AGGREGATION_VERSION;
  audience: 'AGENT_ONLY';
  nullPolicy: 'COUNT_ALL_VALIDATED_COHORT_MEMBERS' | 'EXCLUDE_NULL_AND_REPORT_COVERAGE';
  limitations: readonly string[];
}>;

export type AgentCohortMetricArtifact = Readonly<{
  metricId: AgentCohortMetricId;
  label: string;
  state: AgentCohortMetricState;
  value: number | null;
  unit: AgentCohortMetricDefinition['unit'];
  aggregation: AgentCohortAggregation;
  fieldBasis: AgentCohortMetricDefinition['fieldBasis'];
  calculationVersion: typeof AGENT_COHORT_AGGREGATION_VERSION;
  cohortDefinitionId: string;
  cohortDefinitionVersion: string;
  analyticalGrain: 'MLS_LISTING';
  sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION';
  temporalBasis: 'OBSERVATION_AS_OF_TIMESTAMP';
  periodForm: 'AS_OF_INSTANT_SNAPSHOT';
  asOf: string;
  eligibleCohortCount: number;
  includedPopulationCount: number;
  nullMissingCount: number;
  excludedPopulationCount: number;
  audience: 'AGENT_ONLY';
  rights: Readonly<{ agentOnly: 'PERMITTED'; publicDisplay: 'BLOCKED'; clientReport: 'BLOCKED'; export: 'BLOCKED' }>;
  limitations: readonly string[];
  provenance: readonly string[];
}>;

export type AgentCohortAggregationResult = Readonly<{
  status: 'READY' | 'NOT_AVAILABLE';
  normalized: AgentCohortNormalizedDefinition;
  count: ReturnType<typeof buildAgentCohortCountContract>;
  artifacts: readonly AgentCohortMetricArtifact[];
  rejectedMetricIds: readonly string[];
}>;

export type AgentCohortAggregationOptions = Readonly<{
  excludeMlsIds?: readonly string[];
}>;

const priceLimitations = Object.freeze([
  'Price field is treated only as current asking/list price in the repository listing projection.',
  'This is not sale price, closed price, property value, market value, pricing advice, or historical market methodology.',
] as const);

const characteristicLimitations = Object.freeze([
  'Characteristic summary is calculated only from populated current listing records in the admitted cohort.',
  'Null or missing source values are excluded from the calculation and reported in coverage.',
] as const);

export const AGENT_COHORT_ADMITTED_METRICS: Readonly<Record<AgentCohortMetricId, AgentCohortMetricDefinition>> = Object.freeze({
  'agent.cohort.current-mls-listing-record-count.v1': Object.freeze({
    metricId: 'agent.cohort.current-mls-listing-record-count.v1',
    label: AGENT_COHORT_COUNT_LABEL,
    fieldBasis: 'record',
    aggregation: 'COUNT',
    unit: 'listing records',
    calculationVersion: AGENT_COHORT_AGGREGATION_VERSION,
    audience: 'AGENT_ONLY',
    nullPolicy: 'COUNT_ALL_VALIDATED_COHORT_MEMBERS',
    limitations: Object.freeze(['Count is current listing-record stock, not physical properties, listing episodes, transactions, sales, or historical flow.']),
  }),
  'agent.cohort.current-asking-list-price-min.v1': metric('agent.cohort.current-asking-list-price-min.v1', 'Current asking/list price minimum', 'price', 'MINIMUM', 'USD', priceLimitations),
  'agent.cohort.current-asking-list-price-max.v1': metric('agent.cohort.current-asking-list-price-max.v1', 'Current asking/list price maximum', 'price', 'MAXIMUM', 'USD', priceLimitations),
  'agent.cohort.current-asking-list-price-median.v1': metric('agent.cohort.current-asking-list-price-median.v1', 'Current asking/list price median', 'price', 'MEDIAN', 'USD', priceLimitations),
  'agent.cohort.current-asking-list-price-mean.v1': metric('agent.cohort.current-asking-list-price-mean.v1', 'Current asking/list price mean', 'price', 'ARITHMETIC_MEAN', 'USD', priceLimitations),
  'agent.cohort.bedrooms-median.v1': metric('agent.cohort.bedrooms-median.v1', 'Bedrooms median', 'beds', 'MEDIAN', 'bedrooms', characteristicLimitations),
  'agent.cohort.bathrooms-median.v1': metric('agent.cohort.bathrooms-median.v1', 'Bathrooms median', 'baths', 'MEDIAN', 'bathrooms', characteristicLimitations),
  'agent.cohort.listed-square-feet-median.v1': metric('agent.cohort.listed-square-feet-median.v1', 'Listed square feet median', 'sqft', 'MEDIAN', 'listed square feet', characteristicLimitations),
  'agent.cohort.year-built-median.v1': metric('agent.cohort.year-built-median.v1', 'Year built median', 'yearBuilt', 'MEDIAN', 'year', characteristicLimitations),
});

function metric(
  metricId: AgentCohortMetricId,
  label: string,
  fieldBasis: NumericField,
  aggregation: AgentCohortAggregation,
  unit: AgentCohortMetricDefinition['unit'],
  limitations: readonly string[],
): AgentCohortMetricDefinition {
  return Object.freeze({
    metricId,
    label,
    fieldBasis,
    aggregation,
    unit,
    calculationVersion: AGENT_COHORT_AGGREGATION_VERSION,
    audience: 'AGENT_ONLY',
    nullPolicy: 'EXCLUDE_NULL_AND_REPORT_COVERAGE',
    limitations,
  });
}

function nowIso(value: string | null | undefined) {
  if (value && !Number.isNaN(Date.parse(value))) return new Date(value).toISOString();
  return new Date().toISOString();
}

export function normalizeAgentCohortMetricIds(metricIds: readonly string[] | null | undefined) {
  const requested = metricIds?.length ? metricIds : AGENT_COHORT_METRIC_IDS;
  const admitted = new Set<string>(AGENT_COHORT_METRIC_IDS);
  return Object.freeze({
    admittedMetricIds: Object.freeze(requested.filter((id): id is AgentCohortMetricId => admitted.has(id))),
    rejectedMetricIds: Object.freeze(requested.filter((id) => !admitted.has(id)).sort()),
  });
}

function median(values: readonly number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function calculate(values: readonly number[], aggregation: AgentCohortAggregation) {
  if (!values.length && aggregation !== 'COUNT') return null;
  if (aggregation === 'COUNT') return values.length;
  if (aggregation === 'MINIMUM') return Math.min(...values);
  if (aggregation === 'MAXIMUM') return Math.max(...values);
  if (aggregation === 'MEDIAN') return median(values);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number | null, unit: AgentCohortMetricDefinition['unit']) {
  if (value === null) return null;
  if (unit === 'USD' || unit === 'listed square feet' || unit === 'year' || unit === 'listing records') return Math.round(value);
  return Math.round(value * 10) / 10;
}

function artifact(input: Readonly<{
  definition: AgentCohortMetricDefinition;
  normalized: AgentCohortNormalizedDefinition;
  value: number | null;
  eligibleCount: number;
  includedCount: number;
  asOf: string;
}>): AgentCohortMetricArtifact {
  const nullMissingCount = Math.max(0, input.eligibleCount - input.includedCount);
  return Object.freeze({
    metricId: input.definition.metricId,
    label: input.definition.label,
    state: input.value === null && input.definition.aggregation !== 'COUNT' ? 'NO_DATA' : 'READY',
    value: input.value,
    unit: input.definition.unit,
    aggregation: input.definition.aggregation,
    fieldBasis: input.definition.fieldBasis,
    calculationVersion: input.definition.calculationVersion,
    cohortDefinitionId: input.normalized.cohort.cohortDefinitionId,
    cohortDefinitionVersion: input.normalized.cohort.cohortDefinitionVersion,
    analyticalGrain: 'MLS_LISTING',
    sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
    temporalBasis: 'OBSERVATION_AS_OF_TIMESTAMP',
    periodForm: 'AS_OF_INSTANT_SNAPSHOT',
    asOf: input.asOf,
    eligibleCohortCount: input.eligibleCount,
    includedPopulationCount: input.includedCount,
    nullMissingCount,
    excludedPopulationCount: nullMissingCount,
    audience: 'AGENT_ONLY',
    rights: Object.freeze({ agentOnly: 'PERMITTED', publicDisplay: 'BLOCKED', clientReport: 'BLOCKED', export: 'BLOCKED' }),
    limitations: input.definition.limitations,
    provenance: Object.freeze(['lib/agentCohortAggregation.ts', 'lib/agentCohortCount.ts', 'prisma/schema.prisma:Property']),
  });
}

function selectForMetrics(metricIds: readonly AgentCohortMetricId[]): Prisma.PropertySelect {
  const select: Prisma.PropertySelect = { id: true };
  for (const metricId of metricIds) {
    const field = AGENT_COHORT_ADMITTED_METRICS[metricId].fieldBasis;
    if (field !== 'record') select[field] = true;
  }
  return select;
}

function numericValue(row: Record<string, unknown>, field: NumericField) {
  const value = row[field];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export async function aggregateAgentCohort(input: AgentCohortInput, requestedMetricIds?: readonly string[], options: AgentCohortAggregationOptions = Object.freeze({})): Promise<AgentCohortAggregationResult> {
  const normalized = normalizeAgentCohortDefinition(input);
  const { admittedMetricIds, rejectedMetricIds } = normalizeAgentCohortMetricIds(requestedMetricIds);
  const asOf = nowIso(normalized.cohort.period.asOf);

  if (!normalized.validation.ready || rejectedMetricIds.length > 0) {
    return Object.freeze({
      status: 'NOT_AVAILABLE',
      normalized,
      rejectedMetricIds,
      count: buildAgentCohortCountContract({ normalized, count: null, available: false, asOf }),
      artifacts: Object.freeze([]),
    });
  }

  const baseWhere = buildAgentCohortPrismaWhere(normalized);
  const excludedMlsIds = [...(options.excludeMlsIds ?? [])].filter((value) => Boolean(value));
  const where = excludedMlsIds.length ? { AND: [baseWhere, { mlsId: { notIn: excludedMlsIds } }] } : baseWhere;
  try {
    const rows = await prisma.property.findMany({ where, select: selectForMetrics(admittedMetricIds) });
    const eligibleCount = rows.length;
    const count = buildAgentCohortCountContract({ normalized, count: eligibleCount, available: true, asOf });
    const artifacts = admittedMetricIds.map((metricId) => {
      const definition = AGENT_COHORT_ADMITTED_METRICS[metricId];
      if (definition.aggregation === 'COUNT') {
        return artifact({ definition, normalized, value: eligibleCount, eligibleCount, includedCount: eligibleCount, asOf });
      }
      const values = rows.map((row) => numericValue(row as Record<string, unknown>, definition.fieldBasis as NumericField)).filter((value): value is number => value !== null);
      return artifact({ definition, normalized, value: round(calculate(values, definition.aggregation), definition.unit), eligibleCount, includedCount: values.length, asOf });
    });
    return Object.freeze({ status: 'READY', normalized, rejectedMetricIds, count, artifacts: Object.freeze(artifacts) });
  } catch {
    return Object.freeze({
      status: 'NOT_AVAILABLE',
      normalized,
      rejectedMetricIds: Object.freeze([]),
      count: buildAgentCohortCountContract({ normalized, count: null, available: false, asOf }),
      artifacts: Object.freeze([]),
    });
  }
}
