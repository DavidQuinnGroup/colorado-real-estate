import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  HISTORICAL_FIELD_SET_V1_RECOMMENDATION,
  LISTING_EVENT_EVIDENCE_V1_RECOMMENDATION,
  LISTING_SOURCE_OBSERVATION_V1_RECOMMENDATION,
  PROSPECTIVE_EVIDENCE_AUTHORITY_MODEL,
  PROSPECTIVE_EVIDENCE_TRUTH_MODEL,
  PROSPECTIVE_EVENT_ADMISSION_SUMMARY,
  PROSPECTIVE_IMPLEMENTATION_SELECTION,
  PROSPECTIVE_LISTING_EPISODE_IDENTITY,
  PROSPECTIVE_LISTING_OBSERVATION_EVENT_EVIDENCE_FOUNDATION_STATUS,
  PROSPECTIVE_LISTING_OBSERVATION_EVENT_EVIDENCE_NEXT_GATE,
  PROSPECTIVE_LISTING_OBSERVATION_EVENT_EVIDENCE_PROTECTED_BOUNDARIES,
  PROSPECTIVE_RETENTION_RIGHTS_MATRIX,
  SOURCE_INGESTION_RUN_V1_RECOMMENDATION,
} from '../lib/prospectiveListingObservationEventEvidenceFoundation';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const upsertListing = readFileSync('lib/mls/upsertListing.ts', 'utf8');
const contract = readFileSync('lib/prospectiveListingObservationEventEvidenceFoundation.ts', 'utf8');
const report = readFileSync('docs/project-atlas/executive-library/PROSPECTIVE-LISTING-OBSERVATION-AND-EVENT-EVIDENCE-FOUNDATION-ADMISSION-REVIEW.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(
  PROSPECTIVE_LISTING_OBSERVATION_EVENT_EVIDENCE_FOUNDATION_STATUS,
  'PROSPECTIVE_LISTING_OBSERVATION_AND_EVENT_EVIDENCE_FOUNDATION_ADMISSION_REVIEW_CERTIFIED',
);
assert.equal(
  PROSPECTIVE_LISTING_OBSERVATION_EVENT_EVIDENCE_NEXT_GATE,
  'READY_FOR_HISTORICAL_RETENTION_RIGHTS_AND_MINIMAL_OBSERVATION_SCHEMA_AUTHORIZATION',
);

for (const [boundary, value] of Object.entries(PROSPECTIVE_LISTING_OBSERVATION_EVENT_EVIDENCE_PROTECTED_BOUNDARIES)) {
  assert.equal(value, false, `${boundary} must remain false`);
}

for (const distinction of [
  'SOURCE_OBSERVATION_NOT_EVENT',
  'OBSERVED_AT_NOT_EFFECTIVE_AT',
  'SOURCE_NATIVE_EVENT_NOT_ATLAS_DERIVED_EVENT',
  'FIRST_OBSERVED_NOT_ORIGINAL_MLS_STATE',
  'LISTING_DISAPPEARED_NOT_LISTING_CLOSED',
  'PROSPECTIVE_HISTORY_NOT_RETROSPECTIVE_HISTORY',
]) {
  assert(PROSPECTIVE_EVIDENCE_TRUTH_MODEL.includes(distinction as never), `missing truth distinction ${distinction}`);
  assert(report.includes(distinction), `report missing truth distinction ${distinction}`);
}

for (const authority of ['source-ingestion-run-v1', 'listing-source-observation-v1', 'listing-event-evidence-v1', 'property-current-projection', 'price-history']) {
  assert(PROSPECTIVE_EVIDENCE_AUTHORITY_MODEL.some((entry) => entry.id === authority), `missing authority ${authority}`);
}

assert.equal(PROSPECTIVE_LISTING_EPISODE_IDENTITY.basis, 'sourceSystem + sourceScope + sourceListingIdentity + listingEpisodeVersion');
for (const identifier of ['ListingKey', 'ListingId', 'mlsId']) {
  assert(PROSPECTIVE_LISTING_EPISODE_IDENTITY.sourceIdentityPreference.includes(identifier as never), `missing identity preference ${identifier}`);
  assert(upsertListing.includes(identifier), `upsertListing missing identifier evidence ${identifier}`);
}

for (const metadata of ['observationId', 'ingestionRunId', 'listingEpisodeId', 'observedAt', 'sourceModifiedAt', 'historicalFieldSetVersion', 'normalizationVersion', 'contentHash', 'rightsPolicyVersion']) {
  assert(LISTING_SOURCE_OBSERVATION_V1_RECOMMENDATION.requiredMetadata.includes(metadata as never), `observation metadata missing ${metadata}`);
}

for (const metadata of ['runId', 'sourceSystem', 'startedAt', 'completedAt', 'status', 'requestedScope', 'recordCountReceived', 'recordCountProcessed', 'recordCountFailed', 'retentionPolicyVersion']) {
  assert(SOURCE_INGESTION_RUN_V1_RECOMMENDATION.requiredMetadata.includes(metadata as never), `ingestion-run metadata missing ${metadata}`);
}

assert.equal(LISTING_EVENT_EVIDENCE_V1_RECOMMENDATION.deferFirstWave, true);
for (const origin of ['SOURCE_NATIVE', 'ATLAS_DERIVED_FROM_OBSERVATIONS', 'SOURCE_REPORTED_CURRENT_STATE_ONLY']) {
  assert(LISTING_EVENT_EVIDENCE_V1_RECOMMENDATION.origins.includes(origin as never), `event origin missing ${origin}`);
}

for (const includedField of ['normalizedStatus', 'askingListPrice', 'listingDateIfAuthoritative', 'closeDateIfAuthoritative', 'mlsReportedClosePriceIfAuthorized', 'listingCity', 'zip', 'sourceModifiedAt']) {
  assert(HISTORICAL_FIELD_SET_V1_RECOMMENDATION.include.includes(includedField as never), `field set include missing ${includedField}`);
}
for (const excludedField of ['publicRemarks', 'privateBrokerRemarks', 'photos', 'agentContactDetails', 'officeContactDetails', 'ownerInformation', 'consumerPii', 'crmInformation']) {
  assert(HISTORICAL_FIELD_SET_V1_RECOMMENDATION.exclude.includes(excludedField as never), `field set exclude missing ${excludedField}`);
}
for (const deferredField of ['rawPayload', 'photoHistory', 'remarksHistory', 'canonicalTransactionIdentity']) {
  assert(HISTORICAL_FIELD_SET_V1_RECOMMENDATION.defer.includes(deferredField as never), `field set defer missing ${deferredField}`);
}

assert(PROSPECTIVE_RETENTION_RIGHTS_MATRIX.some((entry) => entry.readiness === 'REQUIRES_EXECUTIVE_RIGHTS_DECISION'), 'rights matrix must preserve rights gate');
assert.equal(PROSPECTIVE_IMPLEMENTATION_SELECTION.selectedStrategy, 'INGESTION_RUN_PLUS_LISTING_OBSERVATION_FOUNDATION_FIRST');
assert.equal(PROSPECTIVE_IMPLEMENTATION_SELECTION.eventDecision, 'NO_EVENT_DERIVATION_IN_FIRST_PERSISTENCE_WAVE');
assert.equal(PROSPECTIVE_IMPLEMENTATION_SELECTION.sourceScopeRecommendation, 'EXECUTIVE_DECISION_REQUIRED');
assert.equal(PROSPECTIVE_IMPLEMENTATION_SELECTION.baselineScopeRecommendation, 'ALL_CURRENT_RETAINED_LISTING_EPISODES_IN_APPROVED_CAPTURE_SCOPE');
assert(PROSPECTIVE_IMPLEMENTATION_SELECTION.rightsGateDecision.includes('blocked until Executive approves historical retention rights'));

for (const eventId of ['listing-first-observed', 'new-listing', 'status-transition', 'price-change', 'close-event', 'disappearance-reappearance', 'source-correction-restatement']) {
  assert(PROSPECTIVE_EVENT_ADMISSION_SUMMARY.some((event) => event.id === eventId), `event admission missing ${eventId}`);
}

assert(upsertListing.includes('upsertListingWithExistingProperty'), 'current sync seam missing');
assert(upsertListing.includes('buildPropertyRecordWithDiagnostics'), 'normalization/diagnostics seam missing');
assert(upsertListing.includes('prisma.property.upsert'), 'current projection update missing');
assert(schema.includes('model PriceHistory'), 'PriceHistory model missing');
assert(schema.includes('model OpenHouse'), 'OpenHouse model missing');
assert(schema.includes('model PropertySourceIdentityObservation'), 'PropertySourceIdentityObservation model missing');
assert(schema.includes('model CanonicalPropertyListingEvent'), 'CanonicalPropertyListingEvent model missing');

for (const forbiddenRuntimeToken of ['fetch(', 'new PrismaClient', 'prisma.', 'supabase.', 'typesense.', 'MLS_GRID_TOKEN', 'DATABASE_URL']) {
  assert(!contract.includes(forbiddenRuntimeToken), `inert contract must not include runtime token ${forbiddenRuntimeToken}`);
}

for (let index = 1; index <= 223; index += 1) {
  assert(report.includes(`${index}. `), `report missing numbered item ${index}`);
}

for (const requiredReportToken of [
  'PROSPECTIVE_LISTING_OBSERVATION_AND_EVENT_EVIDENCE_FOUNDATION_ADMISSION_REVIEW_CERTIFIED',
  'READY_FOR_HISTORICAL_RETENTION_RIGHTS_AND_MINIMAL_OBSERVATION_SCHEMA_AUTHORIZATION',
  'SOURCE_INGESTION_RUN_V1',
  'LISTING_SOURCE_OBSERVATION_V1',
  'LISTING_EVENT_EVIDENCE_V1',
  'HISTORICAL_FIELD_SET_V1',
  'NO EVENT DERIVATION IN FIRST PERSISTENCE WAVE',
]) {
  assert(report.includes(requiredReportToken), `report missing ${requiredReportToken}`);
}

assert.equal(
  packageJson.scripts?.['check:prospective-listing-observation-event-evidence-foundation'],
  'jiti scripts/checkProspectiveListingObservationEventEvidenceFoundation.ts',
);

console.log('PROSPECTIVE_LISTING_OBSERVATION_EVENT_EVIDENCE_FOUNDATION_CHECK: PASS');
