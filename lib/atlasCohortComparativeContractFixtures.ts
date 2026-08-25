import {
  ATLAS_COHORT_CONTRACT_VERSION,
  ATLAS_METRIC_ARTIFACT_CONTRACT_VERSION,
  type AtlasMetricArtifact,
  type AtlasCohortDefinition,
} from './atlasCohortComparativeContract';

const admittedSourceScope = Object.freeze({
  sourceIds: Object.freeze(['EXP-SRC-REIE-CITY-MARKET-DATA']),
  mlsSources: Object.freeze([]),
  sourceAdmission: 'ADMITTED' as const,
  populationCoverage: 'CERTIFIED' as const,
  sourceAsOf: '2026-08-25T00:00:00.000Z',
  knownExclusions: Object.freeze([]),
  limitations: Object.freeze(['Fixture only; no runtime calculation authorized.']),
});

const unresolvedIresRecoSourceScope = Object.freeze({
  sourceIds: Object.freeze(['IRES', 'RECO']),
  mlsSources: Object.freeze(['IRES', 'RECO']),
  sourceAdmission: 'REQUIRES_EVIDENCE' as const,
  populationCoverage: 'UNKNOWN' as const,
  sourceAsOf: null,
  knownExclusions: Object.freeze(['IRES + RECO equivalence to current ATLAS MLS Grid population is not proven.']),
  limitations: Object.freeze(['Source population requires authoritative evidence.']),
});

const mappedBoulder = Object.freeze({
  basis: 'ATLAS_CANONICAL_GEOGRAPHY' as const,
  sourceGeographyId: null,
  atlasGeographyId: 'ATLAS-GEO-BOULDER-CO',
  version: 'fixture-geography-v1',
  provenance: Object.freeze(['fixture']),
  mappingState: 'MAPPED' as const,
});

const unresolvedIresArea = Object.freeze({
  basis: 'SOURCE_SPECIFIC_GEOGRAPHY' as const,
  sourceGeographyId: 'IRES-AREA-1',
  atlasGeographyId: null,
  version: null,
  provenance: Object.freeze(['human-observed-ires-report']),
  mappingState: 'REQUIRES_RECONCILIATION' as const,
});

const confirmedIdentityPolicy = Object.freeze({
  canonicalIdentityBasis: 'ATLAS_CANONICAL_PROPERTY' as const,
  duplicateResolutionPolicy: 'ATLAS_CANONICAL_IDENTITY' as const,
  crossSourceMatchingPolicy: 'ADMITTED_VERSIONED_POLICY' as const,
  listingEpisodeTreatment: 'NOT_APPLICABLE' as const,
  relistingTreatment: 'NOT_APPLICABLE' as const,
  confidence: 'CONFIRMED' as const,
  coverage: 'COMPLETE' as const,
});

const iresNativeDuplicatePolicy = Object.freeze({
  canonicalIdentityBasis: 'SOURCE_IDENTITY' as const,
  duplicateResolutionPolicy: 'SOURCE_NATIVE_HIDDEN' as const,
  crossSourceMatchingPolicy: 'REQUIRES_ADMISSION' as const,
  listingEpisodeTreatment: 'UNRESOLVED' as const,
  relistingTreatment: 'REQUIRES_METHODOLOGY' as const,
  confidence: 'UNVERIFIED' as const,
  coverage: 'UNKNOWN' as const,
});

const baseCoverage = Object.freeze({
  sourceCoverage: Object.freeze({ representedSources: Object.freeze(['EXP-SRC-REIE-CITY-MARKET-DATA']), missingSources: Object.freeze([]), admittedPopulation: 'Repository-local fixture population.' }),
  fieldCoverage: Object.freeze({ eligibleCount: null, populatedCount: null, missingNullCount: null }),
  temporalCoverage: Object.freeze({ earliestEvidence: '2026-08-25T00:00:00.000Z', latestSourceAsOf: '2026-08-25T00:00:00.000Z', historicalGaps: Object.freeze([]), restatementLimitations: Object.freeze(['No restatement mechanism in Block 1.']) }),
  geographicCoverage: Object.freeze({ definitionVersion: 'fixture-geography-v1', mappingGaps: Object.freeze([]), unresolvedGeography: Object.freeze([]) }),
  identityCoverage: Object.freeze({ resolvedIdentities: null, unresolvedIdentities: null, duplicateConflicts: null }),
  provenanceRefs: Object.freeze(['IRES-AGENT-REPORTING-CAPABILITY-RECONCILIATION-PHASE-1']),
});

export const VALID_STOCK_COHORT_FIXTURE: AtlasCohortDefinition = Object.freeze({
  cohortDefinitionId: 'atlas.cohort.fixture.active-inventory.boulder.v1',
  cohortDefinitionVersion: ATLAS_COHORT_CONTRACT_VERSION,
  cohortType: 'STOCK_AS_OF_SNAPSHOT_COHORT',
  humanPurpose: 'Describe active inventory at one certified observation instant.',
  analyticalPurpose: 'Stock inventory snapshot.',
  creatorOrigin: 'REPOSITORY_FIXTURE',
  lifecycleStatus: 'CERTIFIED_ARCHITECTURE',
  reproducibilityPosture: 'REPRODUCIBLE',
  analyticalGrain: 'AS_OF_SNAPSHOT_MEMBER',
  stockFlowClass: 'STOCK',
  sourceScope: admittedSourceScope,
  identityDuplicatePolicy: confirmedIdentityPolicy,
  geography: mappedBoulder,
  period: Object.freeze({
    periodBasis: 'OBSERVATION_AS_OF_TIMESTAMP',
    form: 'AS_OF_INSTANT_SNAPSHOT',
    start: null,
    end: null,
    asOf: '2026-08-25T00:00:00.000Z',
    timezone: 'America/Denver',
    boundarySemantics: 'AS_OF_INSTANT',
    partialPeriodPolicy: 'REJECT',
    comparisonAlignmentPolicy: 'EXACT_MATCH',
  }),
  fieldAdmissionStates: ['FIELD_EXISTS', 'FIELD_INGESTED', 'FIELD_POPULATED', 'FIELD_SEMANTICS_ADMITTED', 'FIELD_RIGHTS_ADMITTED', 'FIELD_ELIGIBLE_FOR_ANALYTICS'] as const,
  nullMissingPolicy: ['UNKNOWN', 'EXCLUDED_BY_COHORT_DEFINITION'] as const,
  coverage: baseCoverage,
  scenarioBoundary: 'NOT_SCENARIO',
});

export const VALID_FLOW_COHORT_FIXTURE: AtlasCohortDefinition = Object.freeze({
  ...VALID_STOCK_COHORT_FIXTURE,
  cohortDefinitionId: 'atlas.cohort.fixture.new-listing-flow.boulder.v1',
  cohortType: 'STATUS_EVENT_FLOW_COHORT',
  analyticalGrain: 'EVENT',
  stockFlowClass: 'FLOW',
  period: Object.freeze({
    periodBasis: 'LISTING_DATE',
    form: 'CUSTOM_BOUNDED_PERIOD',
    start: '2026-08-01T00:00:00.000Z',
    end: '2026-09-01T00:00:00.000Z',
    asOf: null,
    timezone: 'America/Denver',
    boundarySemantics: 'INCLUSIVE_START_EXCLUSIVE_END',
    partialPeriodPolicy: 'ALLOW_WITH_LABEL',
    comparisonAlignmentPolicy: 'CALENDAR_ALIGNED',
  }),
});

export const INVALID_IRES_NATIVE_DUPLICATE_FIXTURE: AtlasCohortDefinition = Object.freeze({
  ...VALID_FLOW_COHORT_FIXTURE,
  cohortDefinitionId: 'atlas.cohort.fixture.ires-duplicates-hidden.v1',
  sourceScope: unresolvedIresRecoSourceScope,
  identityDuplicatePolicy: iresNativeDuplicatePolicy,
  geography: unresolvedIresArea,
  coverage: Object.freeze({
    ...baseCoverage,
    provenanceRefs: Object.freeze(['controlled-ires-human-observation']),
  }),
});

export const VALID_SCENARIO_COHORT_FIXTURE: AtlasCohortDefinition = Object.freeze({
  ...VALID_STOCK_COHORT_FIXTURE,
  cohortDefinitionId: 'atlas.cohort.fixture.scenario.v1',
  cohortType: 'SCENARIO_COHORT',
  analyticalGrain: 'SCENARIO_MODEL_OBSERVATION',
  stockFlowClass: 'SCENARIO',
  scenarioBoundary: 'MODELED_DATA_NEVER_OBSERVED_MARKET_EVIDENCE',
});

const metricCoverage = Object.freeze({
  ...baseCoverage,
  fieldCoverage: Object.freeze({ eligibleCount: 25, populatedCount: 25, missingNullCount: 0 }),
});

export const VALID_CURRENT_METRIC_ARTIFACT: AtlasMetricArtifact = Object.freeze({
  metricArtifactId: 'atlas.metric.fixture.active-count.current',
  metricDefinitionId: 'atlas.metric.active-listing-count',
  metricDefinitionVersion: 'metric-v1',
  metricFamily: 'INVENTORY',
  cohortDefinitionId: VALID_STOCK_COHORT_FIXTURE.cohortDefinitionId,
  cohortDefinitionVersion: ATLAS_COHORT_CONTRACT_VERSION,
  analyticalGrain: 'AS_OF_SNAPSHOT_MEMBER',
  period: VALID_STOCK_COHORT_FIXTURE.period,
  observationAsOf: '2026-08-25T00:00:00.000Z',
  sourceAsOf: '2026-08-25T00:00:00.000Z',
  calculationVersion: ATLAS_METRIC_ARTIFACT_CONTRACT_VERSION,
  value: 25,
  unit: 'count',
  aggregation: 'COUNT',
  eligiblePopulationCount: 25,
  includedPopulationCount: 25,
  excludedPopulationCount: 0,
  nullPopulationCount: 0,
  unknownPopulationCount: 0,
  coverage: metricCoverage,
  sourceProvenance: ['EXP-SRC-REIE-CITY-MARKET-DATA'],
  geographyProvenance: ['fixture-geography-v1'],
  identityPolicyVersion: 'identity-policy-v1',
  methodologyEvidence: ['admitted-fixture-methodology-v1'],
  limitations: ['Fixture only; no public/client output authority.'],
  rightsPolicy: Object.freeze({
    AGENT_ONLY: 'PERMITTED',
    CLIENT_PROFESSIONAL_REPORT: 'BLOCKED',
    PUBLIC_DISPLAY: 'BLOCKED',
    EXPORT: 'BLOCKED',
    INTERNAL_ARCHITECTURE: 'PERMITTED',
  }),
  createdAt: '2026-08-25T00:01:00.000Z',
  restatementState: 'ORIGINAL',
  artifactClass: 'DERIVED_METRIC_ARTIFACT',
  calculationKind: 'DERIVED_FROM_OBSERVED_EVIDENCE',
});

export const VALID_PRIOR_METRIC_ARTIFACT: AtlasMetricArtifact = Object.freeze({
  ...VALID_CURRENT_METRIC_ARTIFACT,
  metricArtifactId: 'atlas.metric.fixture.active-count.prior',
  value: 20,
  observationAsOf: '2026-07-25T00:00:00.000Z',
  sourceAsOf: '2026-07-25T00:00:00.000Z',
  period: Object.freeze({
    ...VALID_CURRENT_METRIC_ARTIFACT.period,
    asOf: '2026-07-25T00:00:00.000Z',
  }),
});

export const ZERO_DENOMINATOR_PRIOR_METRIC_ARTIFACT: AtlasMetricArtifact = Object.freeze({
  ...VALID_PRIOR_METRIC_ARTIFACT,
  metricArtifactId: 'atlas.metric.fixture.active-count.zero-prior',
  value: 0,
});

export const LIMITED_NULL_COVERAGE_METRIC_ARTIFACT: AtlasMetricArtifact = Object.freeze({
  ...VALID_PRIOR_METRIC_ARTIFACT,
  metricArtifactId: 'atlas.metric.fixture.active-count.limited-null-coverage',
  nullPopulationCount: 3,
  unknownPopulationCount: 0,
  coverage: Object.freeze({
    ...metricCoverage,
    fieldCoverage: Object.freeze({ eligibleCount: 25, populatedCount: 22, missingNullCount: 3 }),
  }),
  limitations: ['Fixture has material null coverage; display limitation required.'],
});

export const UNKNOWN_METHODOLOGY_METRIC_ARTIFACT: AtlasMetricArtifact = Object.freeze({
  ...VALID_CURRENT_METRIC_ARTIFACT,
  metricArtifactId: 'atlas.metric.fixture.dom.unknown-methodology',
  metricDefinitionId: 'atlas.metric.average-dom',
  metricDefinitionVersion: null,
  metricFamily: 'DAYS_ON_MARKET',
  calculationVersion: null,
  methodologyEvidence: [],
  value: 46,
});

export const PUBLIC_RIGHTS_BLOCKED_METRIC_ARTIFACT: AtlasMetricArtifact = Object.freeze({
  ...VALID_CURRENT_METRIC_ARTIFACT,
  metricArtifactId: 'atlas.metric.fixture.public-rights-blocked',
  rightsPolicy: Object.freeze({
    AGENT_ONLY: 'PERMITTED',
    CLIENT_PROFESSIONAL_REPORT: 'UNKNOWN',
    PUBLIC_DISPLAY: 'BLOCKED',
    EXPORT: 'UNKNOWN',
    INTERNAL_ARCHITECTURE: 'PERMITTED',
  }),
});

export const IRES_COMPARE_TWO_YEARS_FAILURE_ARTIFACT: AtlasMetricArtifact = Object.freeze({
  ...VALID_PRIOR_METRIC_ARTIFACT,
  metricArtifactId: 'atlas.metric.fixture.ires-compare-two-years-2025-zero',
  value: 0,
  period: Object.freeze({
    ...VALID_PRIOR_METRIC_ARTIFACT.period,
    start: '2026-01-01T00:00:00.000Z',
    end: '2026-08-25T00:00:00.000Z',
    asOf: null,
    form: 'CUSTOM_BOUNDED_PERIOD',
    periodBasis: 'LISTING_DATE',
  }),
  coverage: Object.freeze({
    ...metricCoverage,
    temporalCoverage: Object.freeze({
      earliestEvidence: '2026-01-01T00:00:00.000Z',
      latestSourceAsOf: '2026-08-25T00:00:00.000Z',
      historicalGaps: ['NOMINAL_2025_COMPARISON_RETAINED_2026_LISTING_DATE_RANGE'],
      restatementLimitations: ['IRES report label does not establish comparable prior-year cohort.'],
    }),
  }),
  limitations: ['Controlled IRES Compare Two Years failure-mode fixture.'],
});

export const SCENARIO_METRIC_ARTIFACT: AtlasMetricArtifact = Object.freeze({
  ...VALID_CURRENT_METRIC_ARTIFACT,
  metricArtifactId: 'atlas.metric.fixture.scenario-modeled-value',
  analyticalGrain: 'SCENARIO_MODEL_OBSERVATION',
  cohortDefinitionId: VALID_SCENARIO_COHORT_FIXTURE.cohortDefinitionId,
  calculationKind: 'SCENARIO_MODEL',
});
