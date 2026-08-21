import {
  evaluateRestrictionTriggeredSourceGovernance,
  type RestrictionTriggeredSourceGovernanceResult,
  type SourceGovernanceUse,
} from './sourceGovernanceRestrictionTriggered';

export const REIE_INTERNAL_MARKET_COMPUTATION_ARCHITECTURE_STATUS = 'REIE_INTERNAL_MARKET_COMPUTATION_ARCHITECTURE_CERTIFIED' as const;
export const REIE_HISTORICAL_MARKET_OBSERVATION_ARCHITECTURE_STATUS = 'REIE_HISTORICAL_MARKET_OBSERVATION_ARCHITECTURE_CERTIFIED' as const;
export const REIE_INTERNAL_MARKET_COMPUTATION_NEXT_GATE = 'READY_FOR_BOUNDED_CURRENT_MARKET_COMPUTATION_IMPLEMENTATION_MVV' as const;
export const REIE_HISTORICAL_MARKET_OBSERVATION_NEXT_GATE = 'READY_FOR_BOUNDED_HISTORICAL_OBSERVATION_PERSISTENCE_GATE' as const;

export const MARKET_OBSERVATION_VERSIONING = Object.freeze({
  metricVersion: 'REQUIRED',
  normalizationVersion: 'REQUIRED',
  geographyVersion: 'REQUIRED_WHEN_GEOGRAPHY_USED',
  schemaVersion: 'REQUIRED',
  sourceDefinitionVersion: 'REQUIRED',
});

export type MarketMetricReadiness =
  | 'READY_FROM_CURRENT_FIELDS'
  | 'READY_AFTER_FIELD_NORMALIZATION'
  | 'READY_AFTER_STATUS_NORMALIZATION'
  | 'READY_AFTER_GEOGRAPHY_NORMALIZATION'
  | 'REQUIRES_HISTORICAL_OBSERVATIONS'
  | 'REQUIRES_MISSING_FIELD'
  | 'SOURCE_SEMANTICS_UNCLEAR'
  | 'NOT_RECOMMENDED';

export type MarketMetricCategory = 'INVENTORY' | 'PRICE' | 'PACE' | 'SUPPLY_COMPETITION' | 'SEGMENT' | 'GEOGRAPHY';

export type MarketMetricDefinition = Readonly<{
  id: string;
  category: MarketMetricCategory;
  readiness: MarketMetricReadiness;
  requiredSourceFields: readonly string[];
  numerator: string;
  denominator: string | null;
  population: string;
  timeWindow: string;
  inclusionCriteria: string;
  exclusionCriteria: string;
  nullHandling: string;
  duplicateHandling: string;
  statusHandling: string;
  geographicHandling: string;
  dateField: string | null;
  aggregation: string;
  roundingDisplayRule: string;
  minimumSampleConsideration: string;
  freshnessRequirement: string;
  limitation: string;
}>;

type MetricInput = Omit<MarketMetricDefinition, 'denominator' | 'timeWindow' | 'nullHandling' | 'duplicateHandling' | 'geographicHandling' | 'roundingDisplayRule' | 'minimumSampleConsideration' | 'freshnessRequirement'> & Partial<Pick<MarketMetricDefinition, 'denominator' | 'timeWindow' | 'nullHandling' | 'duplicateHandling' | 'geographicHandling' | 'roundingDisplayRule' | 'minimumSampleConsideration' | 'freshnessRequirement'>>;

function metric(input: MetricInput): MarketMetricDefinition {
  return Object.freeze({
    denominator: null,
    timeWindow: 'CURRENT_CERTIFIED_SOURCE_CUTOFF',
    nullHandling: 'Exclude records missing a metric-required field; report excluded count.',
    duplicateHandling: 'Deduplicate by stable MLS listing identity within the certified observation run.',
    geographicHandling: 'Use city and ZIP only as stored; use neighborhood/submarket only after canonical geographic resolution.',
    roundingDisplayRule: 'Keep unrounded calculation values; display currency whole dollars, ratios to one decimal percent, and durations to whole days.',
    minimumSampleConsideration: 'Return insufficient sample rather than a statistic when the configured minimum sample is not met.',
    freshnessRequirement: 'Source cutoff must be certified fresh for the proposed current observation.',
    ...input,
  });
}

export const CURRENT_MARKET_METRIC_INVENTORY: readonly MarketMetricDefinition[] = Object.freeze([
  metric({ id: 'ACTIVE_LISTING_COUNT', category: 'INVENTORY', readiness: 'READY_AFTER_STATUS_NORMALIZATION', requiredSourceFields: ['Property.mlsId', 'Property.status'], numerator: 'Count of current rows normalized to ACTIVE.', population: 'Current synchronized property rows within the selected scope.', inclusionCriteria: 'Stable MLS identity, normalized ACTIVE status, and resolved scope.', exclusionCriteria: 'Private/excluded rows, unresolved status, duplicate identity, or unresolved scope.', statusHandling: 'Map only certified source statuses to ACTIVE; unknown statuses are excluded and reported.', dateField: 'Property.sourceModifiedAt', aggregation: 'Count.', limitation: 'No computation is authorized by this contract.' }),
  metric({ id: 'COMING_SOON_COUNT', category: 'INVENTORY', readiness: 'READY_AFTER_STATUS_NORMALIZATION', requiredSourceFields: ['Property.mlsId', 'Property.status'], numerator: 'Count of current rows normalized to COMING_SOON.', population: 'Current synchronized property rows within the selected scope.', inclusionCriteria: 'Stable MLS identity, normalized COMING_SOON status, and resolved scope.', exclusionCriteria: 'Unknown status, duplicate identity, or unresolved scope.', statusHandling: 'Map only certified source statuses to COMING_SOON.', dateField: 'Property.sourceModifiedAt', aggregation: 'Count.', limitation: 'Requires a certified coming-soon status mapping.' }),
  metric({ id: 'PENDING_LISTING_COUNT', category: 'INVENTORY', readiness: 'READY_AFTER_STATUS_NORMALIZATION', requiredSourceFields: ['Property.mlsId', 'Property.status'], numerator: 'Count of current rows normalized to PENDING.', population: 'Current synchronized property rows within the selected scope.', inclusionCriteria: 'Stable MLS identity, normalized PENDING status, and resolved scope.', exclusionCriteria: 'Unknown status, duplicate identity, or unresolved scope.', statusHandling: 'Map only certified source statuses to PENDING.', dateField: 'Property.sourceModifiedAt', aggregation: 'Count.', limitation: 'A current count is not pending velocity.' }),
  metric({ id: 'CLOSED_OR_SOLD_COUNT', category: 'INVENTORY', readiness: 'READY_AFTER_STATUS_NORMALIZATION', requiredSourceFields: ['Property.mlsId', 'Property.status'], numerator: 'Count of current rows normalized to CLOSED.', population: 'Current synchronized property rows within the selected scope.', inclusionCriteria: 'Stable MLS identity, normalized CLOSED status, and certified population coverage.', exclusionCriteria: 'Unknown status, duplicate identity, or unresolved scope.', statusHandling: 'Map only certified source statuses to CLOSED.', dateField: 'Property.sourceModifiedAt', aggregation: 'Count.', limitation: 'Without a close date this is not a closed-sales period measure.' }),
  metric({ id: 'NEW_LISTING_COUNT', category: 'INVENTORY', readiness: 'REQUIRES_MISSING_FIELD', requiredSourceFields: ['ListingContractDate or OnMarketDate', 'Property.status'], numerator: 'Count of listings whose certified source listing date falls in the requested window.', population: 'Current and historical listing observations in the selected scope.', timeWindow: 'EXPLICIT_REQUESTED_PERIOD', inclusionCriteria: 'Stable listing identity, normalized eligible status, and source listing date in window.', exclusionCriteria: 'Missing or ambiguous listing date, duplicate identity, or unresolved scope.', statusHandling: 'Use certified status mapping appropriate to the requested definition.', dateField: 'ListingContractDate or OnMarketDate', aggregation: 'Count.', limitation: 'The current Property model does not persist a source listing-origin date.' }),
  metric({ id: 'WITHDRAWN_EXPIRED_CANCELLED_COUNT', category: 'INVENTORY', readiness: 'READY_AFTER_STATUS_NORMALIZATION', requiredSourceFields: ['Property.mlsId', 'Property.status'], numerator: 'Count of current rows normalized to a specified terminal status.', population: 'Current synchronized property rows within the selected scope.', inclusionCriteria: 'Stable MLS identity, one specified normalized terminal status, and resolved scope.', exclusionCriteria: 'Unknown status, duplicate identity, or unresolved scope.', statusHandling: 'Terminal statuses must be separately mapped; never collapse them without source semantics.', dateField: 'Property.sourceModifiedAt', aggregation: 'Count by terminal status.', limitation: 'A current count does not establish a withdrawal/expiration event period.' }),
]);

export const CURRENT_MARKET_METRIC_PRICE: readonly MarketMetricDefinition[] = Object.freeze([
  metric({ id: 'MEDIAN_LIST_PRICE', category: 'PRICE', readiness: 'READY_AFTER_STATUS_NORMALIZATION', requiredSourceFields: ['Property.mlsId', 'Property.price', 'Property.status'], numerator: 'Ordered valid current list prices at the 50th percentile.', population: 'Current normalized ACTIVE listing rows in the selected scope.', inclusionCriteria: 'Positive current list price, stable MLS identity, normalized ACTIVE status, and resolved scope.', exclusionCriteria: 'Zero/negative/missing price, duplicate identity, unknown status, or unresolved scope.', statusHandling: 'Include only normalized ACTIVE unless a different explicitly named status population is selected.', dateField: 'Property.sourceModifiedAt', aggregation: 'Median.', limitation: 'Property.price is mapped from current ListPrice/CurrentPrice, not sale price.' }),
  metric({ id: 'AVERAGE_LIST_PRICE', category: 'PRICE', readiness: 'READY_AFTER_STATUS_NORMALIZATION', requiredSourceFields: ['Property.mlsId', 'Property.price', 'Property.status'], numerator: 'Sum of valid current list prices.', denominator: 'Count of included current listing rows.', population: 'Current normalized ACTIVE listing rows in the selected scope.', inclusionCriteria: 'Positive current list price, stable MLS identity, normalized ACTIVE status, and resolved scope.', exclusionCriteria: 'Zero/negative/missing price, duplicate identity, unknown status, or unresolved scope.', statusHandling: 'Include only normalized ACTIVE unless a different explicitly named status population is selected.', dateField: 'Property.sourceModifiedAt', aggregation: 'Arithmetic mean.', limitation: 'Outlier treatment must be versioned; no silent trimming.' }),
  metric({ id: 'MEDIAN_AND_AVERAGE_LIST_PRICE_PER_SQFT', category: 'PRICE', readiness: 'READY_AFTER_STATUS_NORMALIZATION', requiredSourceFields: ['Property.mlsId', 'Property.price', 'Property.sqft', 'Property.status'], numerator: 'Per-listing current list price divided by positive square footage, then median or arithmetic mean.', population: 'Current normalized ACTIVE listing rows in the selected scope with usable square footage.', inclusionCriteria: 'Positive current list price and square footage, stable MLS identity, normalized ACTIVE status, and resolved scope.', exclusionCriteria: 'Zero/negative/missing price or square footage, duplicate identity, unknown status, or unresolved scope.', statusHandling: 'Include only normalized ACTIVE unless a different explicitly named status population is selected.', dateField: 'Property.sourceModifiedAt', aggregation: 'Median or arithmetic mean of per-listing ratios; never ratio of aggregate price to aggregate square footage unless separately named.', limitation: 'Living-area semantics remain the mapper-defined field and require verification.' }),
  metric({ id: 'PRICE_BAND_DISTRIBUTION', category: 'PRICE', readiness: 'READY_AFTER_STATUS_NORMALIZATION', requiredSourceFields: ['Property.mlsId', 'Property.price', 'Property.status'], numerator: 'Count of included listings in each versioned price band.', denominator: 'Count of all included listings.', population: 'Current normalized ACTIVE listing rows in the selected scope.', inclusionCriteria: 'Positive current list price, stable MLS identity, normalized ACTIVE status, and resolved scope.', exclusionCriteria: 'Zero/negative/missing price, duplicate identity, unknown status, or unresolved scope.', statusHandling: 'Include only normalized ACTIVE unless a different explicitly named status population is selected.', dateField: 'Property.sourceModifiedAt', aggregation: 'Count and percentage by versioned inclusive/exclusive band boundaries.', limitation: 'Band boundaries must be versioned.' }),
  metric({ id: 'MEDIAN_AND_AVERAGE_SOLD_PRICE', category: 'PRICE', readiness: 'REQUIRES_MISSING_FIELD', requiredSourceFields: ['ClosePrice', 'CloseDate', 'Property.status'], numerator: 'Ordered or summed valid close prices.', population: 'Closed listing observations in the requested period and scope.', timeWindow: 'EXPLICIT_CLOSE_DATE_PERIOD', inclusionCriteria: 'Positive close price, certified close date, normalized CLOSED status, stable MLS identity, and resolved scope.', exclusionCriteria: 'Missing close price/date, duplicate identity, unknown status, or unresolved scope.', statusHandling: 'Include only normalized CLOSED.', dateField: 'CloseDate', aggregation: 'Median or arithmetic mean.', limitation: 'Close price and close date are not persisted by the current Property model.' }),
  metric({ id: 'LIST_TO_SALE_RATIO', category: 'PRICE', readiness: 'REQUIRES_MISSING_FIELD', requiredSourceFields: ['OriginalListPrice or final ListPrice', 'ClosePrice', 'CloseDate'], numerator: 'Sum or median of per-listing close-price-to-named-list-price ratios.', denominator: 'Count of included closed listings when using average; none when using median.', population: 'Closed listing observations in the requested period and scope.', timeWindow: 'EXPLICIT_CLOSE_DATE_PERIOD', inclusionCriteria: 'Positive named list price and close price with certified close date and normalized CLOSED status.', exclusionCriteria: 'Missing/zero values, duplicate identity, unknown status, or unresolved scope.', statusHandling: 'Include only normalized CLOSED.', dateField: 'CloseDate', aggregation: 'Versioned median or arithmetic mean of per-listing ratios.', limitation: 'The current model lacks original/final-list and close-price fields.' }),
  metric({ id: 'PRICE_REDUCTIONS_INCREASES_AND_CURRENT_VS_ORIGINAL', category: 'PRICE', readiness: 'REQUIRES_MISSING_FIELD', requiredSourceFields: ['OriginalListPrice', 'PriceChangeTimestamp or PriceHistory'], numerator: 'Count or amount derived from ordered source price events.', population: 'Listing observations with certified price-event history in the selected scope.', timeWindow: 'EXPLICIT_REQUESTED_PERIOD', inclusionCriteria: 'Stable listing identity and complete ordered source price events.', exclusionCriteria: 'Missing/ambiguous event history, duplicate event, or unresolved scope.', statusHandling: 'Status population must be explicitly selected and versioned.', dateField: 'PriceChangeTimestamp', aggregation: 'Event count, amount, or current-to-original ratio as separately named metrics.', limitation: 'No repository price-event writer or admitted history read supports this today.' }),
]);

export const CURRENT_MARKET_METRIC_PACE: readonly MarketMetricDefinition[] = Object.freeze([
  metric({ id: 'MEDIAN_AND_AVERAGE_DOM', category: 'PACE', readiness: 'REQUIRES_MISSING_FIELD', requiredSourceFields: ['DaysOnMarket', 'Property.status'], numerator: 'Ordered or summed non-negative DOM values.', population: 'Current normalized ACTIVE or named status listing rows in the selected scope.', inclusionCriteria: 'Stable listing identity, non-negative source DOM, certified status, and resolved scope.', exclusionCriteria: 'Missing/negative DOM, duplicate identity, unknown status, or unresolved scope.', statusHandling: 'Population status must be explicitly named.', dateField: 'Property.sourceModifiedAt', aggregation: 'Median or arithmetic mean.', limitation: 'DaysOnMarket is not persisted by the current Property model.' }),
  metric({ id: 'CUMULATIVE_DOM', category: 'PACE', readiness: 'SOURCE_SEMANTICS_UNCLEAR', requiredSourceFields: ['CumulativeDaysOnMarket', 'Property.status'], numerator: 'Ordered or summed source CDOM values after source semantic certification.', population: 'Current normalized listing rows in the selected scope.', inclusionCriteria: 'Stable identity, non-negative certified CDOM, certified status, and resolved scope.', exclusionCriteria: 'Missing/negative/ambiguous CDOM, duplicate identity, unknown status, or unresolved scope.', statusHandling: 'Population status must be explicitly named.', dateField: 'Property.sourceModifiedAt', aggregation: 'Median or arithmetic mean.', limitation: 'CDOM is neither persisted nor semantically certified in the repository.' }),
  metric({ id: 'AGE_OF_ACTIVE_INVENTORY_DISTRIBUTION', category: 'PACE', readiness: 'REQUIRES_MISSING_FIELD', requiredSourceFields: ['ListingContractDate or OnMarketDate', 'Property.status'], numerator: 'Count of active listings within versioned age bands measured from a certified listing-origin date.', denominator: 'Count of included active listings.', population: 'Current normalized ACTIVE listing rows in the selected scope.', inclusionCriteria: 'Stable identity, certified listing-origin date, normalized ACTIVE status, and resolved scope.', exclusionCriteria: 'Missing/ambiguous origin date, duplicate identity, unknown status, or unresolved scope.', statusHandling: 'Include only normalized ACTIVE.', dateField: 'ListingContractDate or OnMarketDate', aggregation: 'Count and percentage by age band.', limitation: 'createdAt is local persistence time, not a source listing-origin date.' }),
  metric({ id: 'PENDING_VELOCITY', category: 'PACE', readiness: 'REQUIRES_MISSING_FIELD', requiredSourceFields: ['StatusChangeTimestamp', 'Property.status'], numerator: 'Count of certified transitions into PENDING in the requested period.', population: 'Status-event observations in the selected scope.', timeWindow: 'EXPLICIT_REQUESTED_PERIOD', inclusionCriteria: 'Stable identity, certified PENDING transition timestamp, normalized prior/current status, and resolved scope.', exclusionCriteria: 'Missing/ambiguous transition event, duplicate event, or unresolved scope.', statusHandling: 'A transition into PENDING is required; current pending status alone is insufficient.', dateField: 'StatusChangeTimestamp', aggregation: 'Count per period.', limitation: 'The current model retains only a current raw status.' }),
]);

export const CURRENT_MARKET_METRIC_SUPPLY_AND_SEGMENT: readonly MarketMetricDefinition[] = Object.freeze([
  metric({ id: 'PENDING_TO_ACTIVE_RATIO', category: 'SUPPLY_COMPETITION', readiness: 'READY_AFTER_STATUS_NORMALIZATION', requiredSourceFields: ['Property.mlsId', 'Property.status'], numerator: 'Count of current normalized PENDING rows.', denominator: 'Count of current normalized ACTIVE rows.', population: 'Current synchronized property rows within the selected scope.', inclusionCriteria: 'Stable identity, certified status mapping, and resolved scope.', exclusionCriteria: 'Unknown status, duplicate identity, or unresolved scope.', statusHandling: 'Count PENDING and ACTIVE using the same certified mapping and source cutoff.', dateField: 'Property.sourceModifiedAt', aggregation: 'Ratio.', limitation: 'This is a point-in-time competition proxy, not a period absorption rate.' }),
  metric({ id: 'MONTHS_OF_SUPPLY_AND_ABSORPTION', category: 'SUPPLY_COMPETITION', readiness: 'REQUIRES_HISTORICAL_OBSERVATIONS', requiredSourceFields: ['Normalized ACTIVE inventory', 'Certified CLOSED or PENDING transitions', 'CloseDate or StatusChangeTimestamp'], numerator: 'Current active count for months of supply, or completed transitions for absorption.', denominator: 'Versioned trailing-period closed/pending transition rate.', population: 'Certified current and historical listing observations in the selected scope.', timeWindow: 'EXPLICIT_TRAILING_PERIOD', inclusionCriteria: 'Certified current inventory, certified event history, stable identities, normalized statuses, and resolved scope.', exclusionCriteria: 'Partial retrieval, missing event date, duplicate identity/event, unknown status, or unresolved scope.', statusHandling: 'Use explicit certified ACTIVE and CLOSED/PENDING transition mappings.', dateField: 'CloseDate or StatusChangeTimestamp', aggregation: 'Versioned rate; no result when denominator is zero or history is incomplete.', limitation: 'A professionally defensible rate requires a retained or reliably reconstructed event period.' }),
  metric({ id: 'PROPERTY_TYPE_BEDROOM_SQFT_YEAR_BUILT_SEGMENTS', category: 'SEGMENT', readiness: 'READY_AFTER_FIELD_NORMALIZATION', requiredSourceFields: ['Property.propertyType', 'Property.beds', 'Property.sqft', 'Property.yearBuilt', 'Property.status'], numerator: 'Count or named metric value within a versioned segment.', denominator: 'Count of included rows for percentage metrics.', population: 'Current synchronized property rows within the selected scope and named status population.', inclusionCriteria: 'Stable identity, normalized field value/band, certified status, and resolved scope.', exclusionCriteria: 'Missing required segment field, duplicate identity, unknown status, or unresolved scope.', statusHandling: 'Apply the same certified status mapping as the parent metric.', dateField: 'Property.sourceModifiedAt', aggregation: 'Count, percentage, median, or mean only when the parent metric is separately defined.', limitation: 'Detached/attached and condo/townhome classifications require a versioned property-type normalization.' }),
  metric({ id: 'CITY_AND_ZIP_GEOGRAPHY', category: 'GEOGRAPHY', readiness: 'READY_AFTER_STATUS_NORMALIZATION', requiredSourceFields: ['Property.city', 'Property.zip', 'Property.status'], numerator: 'Parent metric numerator within the stored city or ZIP scope.', population: 'Current synchronized property rows within the stored city or ZIP.', inclusionCriteria: 'Stable identity, non-empty stored city/ZIP, certified status, and source cutoff.', exclusionCriteria: 'Missing city/ZIP, duplicate identity, or unknown status.', statusHandling: 'Apply the same certified status mapping as the parent metric.', dateField: 'Property.sourceModifiedAt', aggregation: 'Use the parent metric aggregation.', limitation: 'City and ZIP normalization must preserve source values and mapping provenance.' }),
  metric({ id: 'CANONICAL_NEIGHBORHOOD_SUBMARKET_GEOGRAPHY', category: 'GEOGRAPHY', readiness: 'READY_AFTER_GEOGRAPHY_NORMALIZATION', requiredSourceFields: ['Property.neighborhood or Property.subdivision', 'Canonical geographic object relationship', 'Property.status'], numerator: 'Parent metric numerator within a canonical geographic object.', population: 'Current synchronized property rows with an approved canonical relationship.', inclusionCriteria: 'Stable identity, governed geographic relationship, certified status, and source cutoff.', exclusionCriteria: 'Ambiguous/unresolved geography, alias-only text, duplicate identity, or unknown status.', statusHandling: 'Apply the same certified status mapping as the parent metric.', dateField: 'Property.sourceModifiedAt', aggregation: 'Use the parent metric aggregation.', limitation: 'Raw neighborhood/subdivision strings do not independently authorize geography assignment.' }),
  metric({ id: 'COUNTY_GEOGRAPHY', category: 'GEOGRAPHY', readiness: 'REQUIRES_MISSING_FIELD', requiredSourceFields: ['CountyOrParish or governed county relationship', 'Property.status'], numerator: 'Parent metric numerator within a certified county scope.', population: 'Current synchronized property rows with a certified county relationship.', inclusionCriteria: 'Stable identity, certified county, certified status, and source cutoff.', exclusionCriteria: 'Missing/ambiguous county, duplicate identity, or unknown status.', statusHandling: 'Apply the same certified status mapping as the parent metric.', dateField: 'Property.sourceModifiedAt', aggregation: 'Use the parent metric aggregation.', limitation: 'The current Property model does not persist a county field.' }),
]);

export const CURRENT_MARKET_METRICS = Object.freeze([
  ...CURRENT_MARKET_METRIC_INVENTORY,
  ...CURRENT_MARKET_METRIC_PRICE,
  ...CURRENT_MARKET_METRIC_PACE,
  ...CURRENT_MARKET_METRIC_SUPPLY_AND_SEGMENT,
]);

export type HistoricalMarketEvidenceState = 'CAN_RECONSTRUCT_FROM_EXISTING_EVENT_HISTORY' | 'CAN_PARTIALLY_RECONSTRUCT' | 'REQUIRES_PROSPECTIVE_SNAPSHOT' | 'REQUIRES_SOURCE_HISTORICAL_QUERY' | 'NOT_RELIABLY_AVAILABLE';

export const HISTORICAL_MARKET_EVIDENCE_INVENTORY = Object.freeze([
  Object.freeze({ evidenceClass: 'CURRENT_STATE', state: 'NOT_RELIABLY_AVAILABLE' as const, repositoryFinding: 'Property rows represent current stored state, not a dated inventory snapshot.' }),
  Object.freeze({ evidenceClass: 'EVENT_HISTORY', state: 'NOT_RELIABLY_AVAILABLE' as const, repositoryFinding: 'No admitted repository writer or certified read proves status-event history availability.' }),
  Object.freeze({ evidenceClass: 'PRICE_HISTORY', state: 'NOT_RELIABLY_AVAILABLE' as const, repositoryFinding: 'PriceHistory schema exists, but no admitted writer or certified historical read establishes usable coverage.' }),
  Object.freeze({ evidenceClass: 'STATUS_HISTORY', state: 'REQUIRES_PROSPECTIVE_SNAPSHOT' as const, repositoryFinding: 'Property.status is current raw state; status transition time is not retained.' }),
  Object.freeze({ evidenceClass: 'OBSERVATION_HISTORY', state: 'REQUIRES_PROSPECTIVE_SNAPSHOT' as const, repositoryFinding: 'No certified periodic Market observation store exists.' }),
  Object.freeze({ evidenceClass: 'TRANSACTION_HISTORY', state: 'REQUIRES_SOURCE_HISTORICAL_QUERY' as const, repositoryFinding: 'Close price/date are not retained in the current Property model.' }),
]);

export const HISTORICAL_COMPARISON_READINESS = Object.freeze([
  Object.freeze({ comparison: '30_DAY_CHANGE', state: 'REQUIRES_PROSPECTIVE_SNAPSHOT' as const, requirement: 'Two comparable certified observations at least 30 days apart, or separately certified reconstructed history.' }),
  Object.freeze({ comparison: '90_DAY_CHANGE', state: 'REQUIRES_PROSPECTIVE_SNAPSHOT' as const, requirement: 'Two comparable certified observations at least 90 days apart, or separately certified reconstructed history.' }),
  Object.freeze({ comparison: 'YOY_CHANGE', state: 'REQUIRES_PROSPECTIVE_SNAPSHOT' as const, requirement: 'Two comparable certified observations approximately one year apart, or separately certified reconstructed history.' }),
]);

export const MARKET_SNAPSHOT_ARCHITECTURE_OPTIONS = Object.freeze([
  Object.freeze({ id: 'RAW_PROPERTY_SNAPSHOT', grain: 'Full source payload per listing and observation run.', storage: 'High', reproducibility: 'High', auditability: 'High', flexibility: 'High', queryComplexity: 'High', migrationComplexity: 'High', ratePolicyImpact: 'Neutral when derived from synchronized data; harmful if it induces separate retrieval.', rightsPosture: 'No raw retention is presumed necessary or authorized by this architecture package.', qualityPosture: 'Payload provenance can be strong but duplicated raw data increases governance burden.', operationalComplexity: 'High', pros: 'Maximum reconstruction detail.', cons: 'Excess duplication and retention surface.' }),
  Object.freeze({ id: 'PRECOMPUTED_MARKET_AGGREGATES_ONLY', grain: 'One metric aggregate per scope, segment, and observation run.', storage: 'Low', reproducibility: 'Low', auditability: 'Medium', flexibility: 'Low', queryComplexity: 'Low', migrationComplexity: 'Low', ratePolicyImpact: 'Low when derived from synchronized data.', rightsPosture: 'Derived retention only.', qualityPosture: 'Cannot reliably correct changed metric definitions without retained normalized evidence.', operationalComplexity: 'Low', pros: 'Smallest storage and simple reads.', cons: 'Formula changes cannot be audited or recomputed.' }),
  Object.freeze({ id: 'NORMALIZED_LISTING_OBSERVATION_PLUS_AGGREGATE', grain: 'One normalized listing observation per certified run plus versioned market aggregates.', storage: 'Moderate', reproducibility: 'High', auditability: 'High', flexibility: 'High', queryComplexity: 'Moderate', migrationComplexity: 'Moderate', ratePolicyImpact: 'Low when computed from already synchronized data and never re-queries the provider.', rightsPosture: 'Retains only the normalized fields needed for approved metrics and provenance.', qualityPosture: 'Supports correction, exclusion accounting, and visible degraded states.', operationalComplexity: 'Moderate', pros: 'Recomputable metrics without retaining full raw payloads.', cons: 'Requires a future governed schema and write path.' }),
]);

export const PREFERRED_MARKET_SNAPSHOT_ARCHITECTURE = Object.freeze({
  id: 'NORMALIZED_LISTING_OBSERVATION_PLUS_AGGREGATE',
  minimumViableGrain: Object.freeze({
    run: 'One certified observation run per source cutoff.',
    listing: 'One normalized listing observation per stable MLS listing identity and run.',
    aggregate: 'One metric aggregate per run, canonical scope, optional segment, and metric definition version.',
  }),
  futureOptionalGrain: Object.freeze(['property-type segment', 'bedroom band', 'price band', 'square-footage band', 'year-built band']),
  frequency: 'HYBRID_CERTIFIED_POST_SYNC_DAILY_CAP',
  frequencyRationale: 'At most one certified observation per source cutoff/day, derived from already synchronized data without a separate provider retrieval.',
  rawPayloadRetention: false,
  requiredContracts: Object.freeze(['DATA', 'COMPUTATION', 'SNAPSHOT', 'PROVENANCE', 'QUALITY', 'VERSIONING', 'RETENTION', 'FAIL_CLOSED', 'AGENT_CONSUMPTION']),
  retention: Object.freeze({ purpose: 'Reproduce certified internal metrics, compare periods, correct definitions, and audit quality.', minimumUsefulHorizon: 'At least 13 months after a certified observation for YoY comparison, subject to future controlling terms.', staleHandling: 'Retain provenance and mark stale/deprecated; never overwrite an observation in place.', correctionHandling: 'Append a corrected run linked to the superseded run.', terminationHandling: 'Future controlling terms may require deletion or restricted retention; enforce through a separately authorized policy and migration.' }),
});

export type MarketObservationQualityInput = Readonly<{
  sourceFresh: boolean;
  requiredFieldsComplete: boolean;
  statusNormalized: boolean;
  geographyResolved: boolean;
  sampleSufficient: boolean;
  duplicatesResolved: boolean;
  retrievalComplete: boolean;
  computationSucceeded: boolean;
  metricVersionKnown: boolean;
}>;

export type MarketObservationQualityResult = Readonly<{
  state: 'CERTIFIABLE' | 'DEGRADED' | 'BLOCKED';
  reasons: readonly string[];
}>;

export function assessMarketObservationQuality(input: MarketObservationQualityInput): MarketObservationQualityResult {
  const blocked = [
    !input.sourceFresh && 'SOURCE_FRESHNESS_FAILED',
    !input.retrievalComplete && 'SOURCE_RETRIEVAL_INCOMPLETE',
    !input.computationSucceeded && 'COMPUTATION_FAILED',
    !input.metricVersionKnown && 'METRIC_CONTRACT_VERSION_UNKNOWN',
  ].filter(Boolean) as string[];
  if (blocked.length) return Object.freeze({ state: 'BLOCKED', reasons: Object.freeze(blocked.sort()) });

  const degraded = [
    !input.requiredFieldsComplete && 'REQUIRED_FIELDS_INCOMPLETE',
    !input.statusNormalized && 'STATUS_NORMALIZATION_UNCERTAIN',
    !input.geographyResolved && 'GEOGRAPHY_UNRESOLVED',
    !input.sampleSufficient && 'MINIMUM_SAMPLE_NOT_MET',
    !input.duplicatesResolved && 'DUPLICATE_CONTAMINATION',
  ].filter(Boolean) as string[];
  return Object.freeze({ state: degraded.length ? 'DEGRADED' : 'CERTIFIABLE', reasons: Object.freeze(degraded.sort()) });
}

export function evaluateInheritedMarketSourceGovernance(proposedUse: SourceGovernanceUse): RestrictionTriggeredSourceGovernanceResult {
  return evaluateRestrictionTriggeredSourceGovernance({
    sourceAccessAuthorized: true,
    professionalPurpose: true,
    proposedUse,
    restrictionEvidence: [],
    knownTermsMateriallyAmbiguous: false,
    sourceQualitySufficient: true,
    historicalEvidenceAvailable: true,
    architectureReady: true,
  });
}

export const MARKET_ARCHITECTURE_PROTECTED_BOUNDARIES = Object.freeze({
  providerActivity: false,
  runtimeActivation: false,
  databaseAccess: false,
  databaseWrite: false,
  schemaMutation: false,
  snapshotWrite: false,
  schedulerActivation: false,
  publicDisplay: false,
  agentMutation: false,
  deployment: false,
});
