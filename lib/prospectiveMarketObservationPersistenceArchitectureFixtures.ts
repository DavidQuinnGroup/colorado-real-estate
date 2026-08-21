import type { CertifiedMarketAggregateObservation, ProspectiveMarketObservationWriteInput } from './prospectiveMarketObservationPersistenceArchitecture';

const versions = Object.freeze({ metricDefinition: 'CURRENT_MARKET_METRICS_V1', normalization: 'CURRENT_MARKET_NORMALIZATION_V1', geography: 'CITY_ZIP_SCOPE_V1', statusTaxonomy: 'CURRENT_STATUS_TAXONOMY_V1', propertyTypeTaxonomy: 'CURRENT_PROPERTY_TYPE_TAXONOMY_V1', sparseDataPolicy: 'MINIMUM_SAMPLE_POLICY_V1' });

export const PROSPECTIVE_MARKET_OBSERVATION_WRITE_FIXTURE: ProspectiveMarketObservationWriteInput = Object.freeze({ currentComputationCertified: true, sourceCutoffKnown: true, normalizationVersionKnown: true, metricVersionKnown: true, sampleSufficient: true, sourceFresh: true, sourceConflictFree: true, governancePermitsInternalAggregateRetention: true, duplicateObservationExists: false });

export const CURRENT_CERTIFIED_MARKET_OBSERVATION: CertifiedMarketAggregateObservation = Object.freeze({
  observationId: 'OBS-CURRENT-001', observationAt: '2026-08-21T12:00:00.000Z', sourceCutoff: '2026-08-21T10:00:00.000Z', sourceSetId: 'FIXTURE_CURRENT_PROPERTY_SOURCE_SET', geography: Object.freeze({ type: 'CITY', id: 'Boulder' }), metric: 'MEDIAN_ACTIVE_LIST_PRICE', statusScope: 'ACTIVE', propertyTypeScope: null, priceBandScope: null, value: 900_000, sampleSize: 12, excludedRecordCount: 2, freshness: 'CURRENT_CERTIFIED', certificationState: 'CERTIFIED', versions, governanceVersion: 'RESTRICTION_TRIGGERED_SOURCE_GOVERNANCE_V1', limitations: Object.freeze([]), invalidatedAt: null, invalidationReason: null,
});

export const PRIOR_CERTIFIED_MARKET_OBSERVATION: CertifiedMarketAggregateObservation = Object.freeze({ ...CURRENT_CERTIFIED_MARKET_OBSERVATION, observationId: 'OBS-PRIOR-001', observationAt: '2026-07-22T12:00:00.000Z', sourceCutoff: '2026-07-22T10:00:00.000Z', value: 875_000 });
