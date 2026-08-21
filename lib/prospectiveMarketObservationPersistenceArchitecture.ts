export const REIE_PROSPECTIVE_HISTORICAL_MARKET_OBSERVATION_PERSISTENCE_ARCHITECTURE_STATUS = 'REIE_PROSPECTIVE_HISTORICAL_MARKET_OBSERVATION_PERSISTENCE_ARCHITECTURE_CERTIFIED' as const;
export const REIE_PROSPECTIVE_HISTORICAL_MARKET_OBSERVATION_PERSISTENCE_NEXT_GATE = 'READY_FOR_BOUNDED_HISTORICAL_OBSERVATION_PERSISTENCE_IMPLEMENTATION_MVV' as const;
export const PROSPECTIVE_MARKET_OBSERVATION_WRITE_AUTHORITY = 'POST_SYNC_CERTIFIED_OBSERVATION_WRITER' as const;
export const PROSPECTIVE_MARKET_OBSERVATION_CADENCE = 'AT_MOST_ONE_CERTIFIED_POST_SYNC_OBSERVATION_PER_SOURCE_CUTOFF_PER_DAY' as const;

export type ProspectiveMarketObservationFailure =
  | 'NO_CURRENT_CERTIFIED_COMPUTATION'
  | 'SOURCE_CUTOFF_UNKNOWN'
  | 'NORMALIZATION_VERSION_UNKNOWN'
  | 'METRIC_VERSION_UNKNOWN'
  | 'INSUFFICIENT_SAMPLE'
  | 'STALE_SOURCE_SET'
  | 'CONFLICTING_SOURCE_SET'
  | 'DUPLICATE_OBSERVATION'
  | 'GOVERNANCE_RESTRICTION'
  | 'INVALIDATED_OBSERVATION';

export type ProspectiveMarketObservationWriteState = 'WRITE_ARCHITECTURE_READY' | ProspectiveMarketObservationFailure;
export type MarketComparisonState = 'COMPARISON_ELIGIBLE' | 'COMPARISON_NOT_ELIGIBLE' | 'TOLERANCE_POLICY_REQUIRED' | 'MISSING_PRIOR_PERIOD' | ProspectiveMarketObservationFailure;

export type MarketObservationVersionSet = Readonly<{
  metricDefinition: string | null;
  normalization: string | null;
  geography: string | null;
  statusTaxonomy: string | null;
  propertyTypeTaxonomy: string | null;
  sparseDataPolicy: string | null;
}>;

export type CertifiedMarketAggregateObservation = Readonly<{
  observationId: string;
  observationAt: string;
  sourceCutoff: string | null;
  sourceSetId: string;
  geography: Readonly<{ type: 'CITY' | 'ZIP'; id: string }>;
  metric: string;
  statusScope: string;
  propertyTypeScope: string | null;
  priceBandScope: string | null;
  value: number | null;
  sampleSize: number;
  excludedRecordCount: number;
  freshness: 'CURRENT_CERTIFIED' | 'STALE_SOURCE_SET' | 'CONFLICTING_SOURCE_SET';
  certificationState: 'CERTIFIED' | 'INSUFFICIENT_SAMPLE' | 'INVALIDATED';
  versions: MarketObservationVersionSet;
  governanceVersion: string | null;
  limitations: readonly string[];
  invalidatedAt: string | null;
  invalidationReason: string | null;
}>;

export type ProspectiveMarketObservationWriteInput = Readonly<{
  currentComputationCertified: boolean;
  sourceCutoffKnown: boolean;
  normalizationVersionKnown: boolean;
  metricVersionKnown: boolean;
  sampleSufficient: boolean;
  sourceFresh: boolean;
  sourceConflictFree: boolean;
  governancePermitsInternalAggregateRetention: boolean;
  duplicateObservationExists: boolean;
}>;

export type ProspectiveMarketObservationWriteResult = Readonly<{
  state: ProspectiveMarketObservationWriteState;
  reasons: readonly string[];
  writerAuthority: typeof PROSPECTIVE_MARKET_OBSERVATION_WRITE_AUTHORITY;
  cadence: typeof PROSPECTIVE_MARKET_OBSERVATION_CADENCE;
  providerRetrieval: false;
  persistenceExecuted: false;
}>;

export const MARKET_OBSERVATION_PERSISTENCE_ENTITIES = Object.freeze([
  Object.freeze({
    name: 'MarketObservationRun',
    purpose: 'Immutable lineage header for one certified current-computation cutoff.',
    requiredFields: Object.freeze(['id', 'sourceSetId', 'sourceCutoff', 'observationAt', 'freshness', 'certificationState', 'normalizationVersion', 'metricDefinitionVersion', 'geographyVersion', 'statusTaxonomyVersion', 'propertyTypeTaxonomyVersion', 'sparseDataPolicyVersion', 'governanceVersion', 'createdAt', 'invalidatedAt', 'invalidationReason']),
    uniqueKey: '(sourceSetId, sourceCutoff, observationDay)',
    indexes: Object.freeze(['(sourceSetId, sourceCutoff)', '(observationAt)', '(certificationState, invalidatedAt)']),
  }),
  Object.freeze({
    name: 'MarketAggregateObservation',
    purpose: 'Certified derived aggregate only; no raw MLS payload retention for Market history.',
    requiredFields: Object.freeze(['id', 'runId', 'geographyType', 'geographyId', 'metric', 'statusScope', 'propertyTypeScope', 'priceBandScope', 'value', 'sampleSize', 'excludedRecordCount', 'limitations', 'createdAt', 'invalidatedAt', 'invalidationReason']),
    uniqueKey: '(runId, geographyType, geographyId, metric, statusScope, propertyTypeScope, priceBandScope)',
    indexes: Object.freeze(['(geographyType, geographyId, metric, observationAt)', '(metric, certificationState, invalidatedAt)', '(runId)']),
  }),
]);

export const MARKET_OBSERVATION_READ_AUTHORITIES = Object.freeze([
  Object.freeze({ reader: 'INTERNAL_AGENT_ANALYSIS', state: 'SEPARATE_AGENT_VISIBILITY_GATE_REQUIRED', permittedNow: false }),
  Object.freeze({ reader: 'CLIENT_PROFESSIONAL_REPORT', state: 'SEPARATE_PRODUCT_COMPLIANCE_PUBLICATION_GATE_REQUIRED', permittedNow: false }),
  Object.freeze({ reader: 'PUBLIC_PRODUCT', state: 'SEPARATE_PUBLIC_PRODUCT_SOURCE_AND_DISPLAY_GATE_REQUIRED', permittedNow: false }),
]);

export function evaluateProspectiveMarketObservationWrite(input: ProspectiveMarketObservationWriteInput): ProspectiveMarketObservationWriteResult {
  const reasons = [
    !input.currentComputationCertified && 'NO_CURRENT_CERTIFIED_COMPUTATION',
    !input.sourceCutoffKnown && 'SOURCE_CUTOFF_UNKNOWN',
    !input.normalizationVersionKnown && 'NORMALIZATION_VERSION_UNKNOWN',
    !input.metricVersionKnown && 'METRIC_VERSION_UNKNOWN',
    !input.sampleSufficient && 'INSUFFICIENT_SAMPLE',
    !input.sourceFresh && 'STALE_SOURCE_SET',
    !input.sourceConflictFree && 'CONFLICTING_SOURCE_SET',
    !input.governancePermitsInternalAggregateRetention && 'GOVERNANCE_RESTRICTION',
    input.duplicateObservationExists && 'DUPLICATE_OBSERVATION',
  ].filter(Boolean) as ProspectiveMarketObservationFailure[];
  return Object.freeze({
    state: reasons[0] ?? 'WRITE_ARCHITECTURE_READY',
    reasons: Object.freeze([...reasons].sort()),
    writerAuthority: PROSPECTIVE_MARKET_OBSERVATION_WRITE_AUTHORITY,
    cadence: PROSPECTIVE_MARKET_OBSERVATION_CADENCE,
    providerRetrieval: false,
    persistenceExecuted: false,
  });
}

function missingVersion(versions: MarketObservationVersionSet) {
  return !versions.metricDefinition || !versions.normalization || !versions.geography || !versions.statusTaxonomy || !versions.propertyTypeTaxonomy || !versions.sparseDataPolicy;
}

function observationFailure(observation: CertifiedMarketAggregateObservation): ProspectiveMarketObservationFailure | null {
  if (observation.certificationState === 'INVALIDATED' || observation.invalidatedAt) return 'INVALIDATED_OBSERVATION';
  if (observation.certificationState !== 'CERTIFIED' || observation.sampleSize < 1) return 'INSUFFICIENT_SAMPLE';
  if (!observation.sourceCutoff) return 'SOURCE_CUTOFF_UNKNOWN';
  if (observation.freshness === 'STALE_SOURCE_SET') return 'STALE_SOURCE_SET';
  if (observation.freshness === 'CONFLICTING_SOURCE_SET') return 'CONFLICTING_SOURCE_SET';
  if (missingVersion(observation.versions)) return !observation.versions.normalization ? 'NORMALIZATION_VERSION_UNKNOWN' : 'METRIC_VERSION_UNKNOWN';
  if (!observation.governanceVersion) return 'GOVERNANCE_RESTRICTION';
  return null;
}

export function evaluateMarketComparison(
  current: CertifiedMarketAggregateObservation,
  prior: CertifiedMarketAggregateObservation,
  targetDays: number,
  maximumToleranceDays: number | null,
): Readonly<{ state: MarketComparisonState; reasons: readonly string[]; observedDayDistance: number | null }> {
  const currentFailure = observationFailure(current);
  const priorFailure = observationFailure(prior);
  if (currentFailure || priorFailure) return Object.freeze({ state: currentFailure ?? priorFailure!, reasons: Object.freeze([currentFailure, priorFailure].filter(Boolean).sort() as string[]), observedDayDistance: null });
  if (!Number.isInteger(targetDays) || targetDays <= 0 || maximumToleranceDays === null) return Object.freeze({ state: 'TOLERANCE_POLICY_REQUIRED', reasons: Object.freeze(['EXPLICIT_TARGET_AND_TOLERANCE_POLICY_REQUIRED']), observedDayDistance: null });
  const currentAt = new Date(current.observationAt);
  const priorAt = new Date(prior.observationAt);
  if (!Number.isFinite(currentAt.getTime()) || !Number.isFinite(priorAt.getTime()) || !Number.isInteger(maximumToleranceDays) || maximumToleranceDays < 0) return Object.freeze({ state: 'TOLERANCE_POLICY_REQUIRED', reasons: Object.freeze(['VALID_COMPARISON_DATE_AND_TOLERANCE_REQUIRED']), observedDayDistance: null });
  const incompatible = [
    current.geography.type !== prior.geography.type || current.geography.id !== prior.geography.id,
    current.metric !== prior.metric,
    current.sourceSetId !== prior.sourceSetId,
    current.statusScope !== prior.statusScope,
    current.propertyTypeScope !== prior.propertyTypeScope,
    current.priceBandScope !== prior.priceBandScope,
    JSON.stringify(current.versions) !== JSON.stringify(prior.versions),
  ].some(Boolean);
  if (incompatible) return Object.freeze({ state: 'COMPARISON_NOT_ELIGIBLE', reasons: Object.freeze(['OBSERVATION_CONTRACTS_INCOMPATIBLE']), observedDayDistance: null });
  const observedDayDistance = Math.round(Math.abs(currentAt.getTime() - priorAt.getTime()) / 86_400_000);
  if (Math.abs(observedDayDistance - targetDays) > maximumToleranceDays) return Object.freeze({ state: 'MISSING_PRIOR_PERIOD', reasons: Object.freeze(['NO_CERTIFIED_OBSERVATION_WITHIN_APPROVED_TOLERANCE']), observedDayDistance });
  return Object.freeze({ state: 'COMPARISON_ELIGIBLE', reasons: Object.freeze([]), observedDayDistance });
}

export const PROSPECTIVE_MARKET_OBSERVATION_PROTECTED_BOUNDARIES = Object.freeze({
  schemaMigration: false,
  databaseWrite: false,
  schedulerActivation: false,
  providerActivity: false,
  historicalBackfill: false,
  agentConsumption: false,
  publicConsumption: false,
  deployment: false,
});
