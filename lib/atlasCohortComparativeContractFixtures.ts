import {
  ATLAS_COHORT_CONTRACT_VERSION,
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
