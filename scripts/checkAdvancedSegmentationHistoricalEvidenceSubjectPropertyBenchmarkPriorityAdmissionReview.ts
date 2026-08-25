import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path: string) => fs.readFileSync(path, 'utf8');

const reviewPath = 'docs/project-atlas/executive-library/ADVANCED-SEGMENTATION-HISTORICAL-EVIDENCE-SUBJECT-PROPERTY-BENCHMARK-PRIORITY-AND-ADMISSION-REVIEW.md';
const review = read(reviewPath);
const schema = read('prisma/schema.prisma');
const cohortBuilder = read('lib/agentCohortBuilder.ts');
const cohortCount = read('lib/agentCohortCount.ts');
const aggregation = read('lib/agentCohortAggregation.ts');
const comparison = read('lib/agentCurrentSnapshotComparison.ts');
const upsert = read('lib/mls/upsertListing.ts');
const freshness = read('lib/mls/sourceFreshness.ts');
const marketArchitecture = read('lib/internalMarketComputationArchitecture.ts');
const prospective = read('lib/prospectiveMarketObservationPersistenceArchitecture.ts');
const propertyPreparationRepository = read('lib/agent-advisory-workbench/agentPropertyConversationPreparationRepository.ts');
const propertyPreparation = read('lib/agent-advisory-workbench/agentPropertyConversationPreparation.ts');
const identity = read('lib/property/canonicalPhysicalPropertyIdentity.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const propertyModel = schema.match(/^model Property \{[\s\S]*?^}/m)?.[0] ?? '';

for (const field of ['price', 'beds', 'baths', 'sqft', 'lotSize', 'yearBuilt', 'propertyType', 'status', 'zip', 'neighborhood', 'subdivision', 'schoolDistrict', 'sourceModifiedAt']) {
  assert(propertyModel.includes(field), `Property schema must expose audited field ${field}.`);
}
for (const unsupported of ['garageSpaces', 'hoaAmount', 'builderName', 'waterRights', 'zoning']) {
  assert.equal(propertyModel.includes(unsupported), false, `${unsupported} must not be treated as present on Property.`);
}

for (const admittedFilter of ['city', 'propertyType', 'statusScope', 'priceMin', 'priceMax', 'bedsMin', 'bathsMin', 'sqftMin', 'sqftMax', 'yearBuiltMin', 'yearBuiltMax']) {
  assert(cohortBuilder.includes(`'${admittedFilter}'`), `Cohort builder must retain admitted filter ${admittedFilter}.`);
}
assert(cohortCount.includes('buildAgentCohortPrismaWhere'));
assert(aggregation.includes('current-asking-list-price-median'));
assert(comparison.includes('COHORT_N_RUNTIME_READY'));

for (const mappedField of ['ListingKey', 'ListingId', 'ListPrice', 'CurrentPrice', 'BedroomsTotal', 'LivingArea', 'LotSizeAcres', 'SubdivisionName', 'HighSchoolDistrict', 'StandardStatus']) {
  assert(upsert.includes(mappedField), `MLS mapper evidence missing ${mappedField}.`);
}
assert(freshness.includes('ModificationTimestamp'));
assert(freshness.includes('StatusChangeTimestamp'));
assert(freshness.includes('sourceFreshnessCandidate: false'));

assert(marketArchitecture.includes('Property rows represent current stored state, not a dated inventory snapshot.'));
assert(marketArchitecture.includes('Close price/date are not retained in the current Property model.'));
assert(marketArchitecture.includes('NORMALIZED_LISTING_OBSERVATION_PLUS_AGGREGATE'));
assert(prospective.includes('WRITE_ARCHITECTURE_READY'));
assert(prospective.includes('providerRetrieval: false'));
assert(prospective.includes('persistenceExecuted: false'));

assert(propertyPreparationRepository.includes('mlsId'));
assert(propertyPreparationRepository.includes('slug'));
assert(propertyPreparationRepository.includes('sourceModifiedAt'));
assert(propertyPreparation.includes('it establishes listing position and configuration, not condition, value, or property-specific conclusions'));
assert(identity.includes('PROPERTY_IDENTITY_SOURCE_ADMISSION_REQUIRED'));
assert(identity.includes('STATEWIDE_PROPERTY_IDENTITY_DATA_REQUIRED'));
assert(identity.includes('HISTORICAL_MLS_USE_RECONCILIATION_REQUIRED'));

for (const invariant of [
  'FIELD PRESENT != FIELD SEMANTICS ADMITTED',
  'CURRENT PROJECTION != HISTORICAL SNAPSHOT',
  'OLD DATE ON CURRENT ROW != HISTORICAL AS-OF EVIDENCE',
  'MLS LISTING != PHYSICAL PROPERTY',
  'CURRENT COMPETING LISTING CONTEXT != CMA',
  'AGENT_ONLY RIGHTS DO NOT IMPLY CLIENT/PUBLIC/EXPORT RIGHTS',
]) {
  assert(review.includes(invariant), `Review must preserve invariant ${invariant}.`);
}

for (const required of [
  'READY_FOR_CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION',
  'CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6',
  'ADVANCED_SEGMENTATION_HISTORICAL_EVIDENCE_SUBJECT_PROPERTY_BENCHMARK_PRIORITY_AND_ADMISSION_REVIEW_CERTIFIED',
  'HISTORICAL_MLS_USE_RECONCILIATION_REQUIRED',
  'NO_SECONDARY_PARALLEL_WORK_RECOMMENDED_FOR_NEXT_GATE',
  'DATABASE MUTATION: NONE',
]) {
  assert(review.includes(required), `Review missing required conclusion ${required}.`);
}

assert.equal(packageJson.scripts?.['check:advanced-segmentation-historical-evidence-subject-property-benchmark-priority-admission-review'], 'jiti scripts/checkAdvancedSegmentationHistoricalEvidenceSubjectPropertyBenchmarkPriorityAdmissionReview.ts');

console.log('ADVANCED_SEGMENTATION_HISTORICAL_EVIDENCE_SUBJECT_PROPERTY_BENCHMARK_PRIORITY_ADMISSION_REVIEW_CHECK: PASS');
