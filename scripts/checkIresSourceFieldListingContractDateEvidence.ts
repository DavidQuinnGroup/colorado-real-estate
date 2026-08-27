import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  IRES_ABSENT_PROPERTY_IDX_FIELDS,
  IRES_DOM_EVIDENCE_MATRIX,
  IRES_PROPERTY_IDX_MAPPING_EVIDENCE_SOURCE,
  IRES_SOURCE_FIELD_EVIDENCE,
  IRES_SOURCE_FIELD_LISTING_CONTRACT_DATE_EVIDENCE_STATUS,
  IRES_SOURCE_FIELD_PROTECTED_BOUNDARIES,
  IRES_SOURCE_FIELD_RIGHTS_BOUNDARY,
  iresSourceFieldEvidence,
  validateIresSourceFieldListingContractDateEvidence,
} from '../lib/iresSourceFieldListingContractDateEvidence';
import { MARKET_METRIC_DEFINITIONS } from '../lib/marketMetricDefinitionEvidence';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const upsertListing = readFileSync('lib/mls/upsertListing.ts', 'utf8');
const contract = readFileSync('lib/iresSourceFieldListingContractDateEvidence.ts', 'utf8');
const report = readFileSync('docs/project-atlas/executive-library/IRES-SOURCE-FIELD-LISTINGCONTRACTDATE-EVIDENCE-ADMISSION-CERTIFICATION.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(IRES_SOURCE_FIELD_LISTING_CONTRACT_DATE_EVIDENCE_STATUS, 'IRES_SOURCE_FIELD_LISTINGCONTRACTDATE_EVIDENCE_ADMISSION_CERTIFIED');
assert.equal(validateIresSourceFieldListingContractDateEvidence(), true);
assert.deepEqual(IRES_PROPERTY_IDX_MAPPING_EVIDENCE_SOURCE, {
  sourceSystem: 'IRES',
  deliverySystem: 'MLS_GRID',
  subscriptionUseContext: 'IRES_PROPERTY_IDX',
  resource: 'Property',
  exportName: 'iresToGridMappingsPropertyIDX (1).csv',
  observedRows: 2282,
  observedUniqueGridFields: 290,
  observedUniqueMlsFields: 292,
  evidenceDate: '2026-08-27',
  sourcePath: 'MLS Grid > Mappings > IRES > IDX > Property resource',
});

for (const requiredField of [
  'ListingKey',
  'ListingId',
  'StandardStatus',
  'MlsStatus',
  'StatusChangeTimestamp',
  'ListingContractDate',
  'OriginatingSystemModificationTimestamp',
  'ListPrice',
  'OriginalListPrice',
  'PriceChangeTimestamp',
  'CloseDate',
  'ClosePrice',
  'DaysOnMarket',
  'IRE_CityID',
]) {
  assert.equal(iresSourceFieldEvidence(requiredField)?.availability, 'AVAILABLE', `${requiredField} must be source-available`);
}

for (const absentField of [
  'CumulativeDaysOnMarket',
  'MajorChangeType',
  'MajorChangeTimestamp',
  'PurchaseContractDate',
  'PreviousListPrice',
  'OnMarketDate',
  'OriginalEntryTimestamp',
  'ExpirationDate',
  'WithdrawnDate',
  'CanceledDate',
  'OffMarketDate',
]) {
  const evidence = iresSourceFieldEvidence(absentField);
  assert.equal(evidence?.availability, 'NOT_AVAILABLE', `${absentField} must be absent in current mapping`);
  assert.ok(evidence?.limitations.includes('NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.'));
  assert.ok(IRES_ABSENT_PROPERTY_IDX_FIELDS.includes(absentField));
}

const listingContractDate = iresSourceFieldEvidence('ListingContractDate');
assert.equal(listingContractDate?.iresField, 'ListDate');
assert.equal(listingContractDate?.semanticStatus, 'SEMANTICALLY_ADMITTED');
assert.ok(listingContractDate?.limitations.some((limitation) => limitation.includes('original-list-date basis only')));

const suppliedDom = iresSourceFieldEvidence('DaysOnMarket');
assert.equal(suppliedDom?.availability, 'AVAILABLE');
assert.equal(suppliedDom?.semanticStatus, 'NON_AUTHORITATIVE_REFERENCE_ONLY');
assert.equal(suppliedDom?.futureAction, 'METHODOLOGY_BLOCKED');
assert.ok(suppliedDom?.sourceEvidence.includes('recommends not relying'));

const statusChangeTimestamp = iresSourceFieldEvidence('StatusChangeTimestamp');
assert.equal(statusChangeTimestamp?.persistenceStatus, 'NOT_PERSISTED');
assert.ok(statusChangeTimestamp?.limitations.some((limitation) => limitation.includes('does not supply prior status')));
assert.ok(statusChangeTimestamp?.limitations.some((limitation) => limitation.includes('transition ledger')));

for (const saleField of ['CloseDate', 'ClosePrice']) {
  const evidence = iresSourceFieldEvidence(saleField);
  assert.equal(evidence?.availability, 'AVAILABLE');
  assert.equal(evidence?.persistenceStatus, 'NOT_PERSISTED');
  assert.equal(evidence?.futureAction, 'HISTORICAL_OBSERVATION_CANDIDATE');
  assert.ok(evidence?.limitations.some((limitation) => limitation.includes('does not establish provider-equivalent methodology')));
}

const cityId = iresSourceFieldEvidence('IRE_CityID');
assert.equal(cityId?.availability, 'AVAILABLE');
assert.equal(cityId?.persistenceStatus, 'NOT_PERSISTED');
assert.ok(cityId?.limitations.some((limitation) => limitation.includes('not an ATLAS canonical geography identifier')));

const domSubjects = new Map<string, string>(IRES_DOM_EVIDENCE_MATRIX.map((item) => [item.subject, item.status]));
assert.equal(domSubjects.get('ORIGINAL_LIST_DATE'), 'ADMITTED');
assert.equal(domSubjects.get('DAYS_SINCE_LISTING_CONTRACT_DATE'), 'ADMITTED_WITH_LIMITATIONS');
assert.equal(domSubjects.get('SUPPLIED_DOM'), 'NON_AUTHORITATIVE_REFERENCE_ONLY');
for (const held of ['ACTIVE_LISTING_DOM', 'SOLD_LISTING_DOM', 'AVERAGE_DOM', 'MEDIAN_DOM', 'CDOM', 'RELIST_RESET', 'OFF_MARKET_TREATMENT', 'PENDING_TREATMENT', 'IRES_COMPARE_TWO_YEARS_AVERAGE_DOM_EQUIVALENCE']) {
  assert.equal(domSubjects.get(held), 'HELD', `${held} must remain held`);
}

assert.equal(IRES_SOURCE_FIELD_RIGHTS_BOUNDARY.idxCurrentUse, 'UNCHANGED');
assert.equal(IRES_SOURCE_FIELD_RIGHTS_BOUNDARY.realEstateMarketAnalytics, 'RIGHTS_ALIGNMENT_PENDING_PROVIDER_RESPONSE');
assert.equal(IRES_SOURCE_FIELD_RIGHTS_BOUNDARY.historicalSupersededValueRetention, 'UNRESOLVED_HELD');
assert.equal(IRES_SOURCE_FIELD_RIGHTS_BOUNDARY.liveHistoricalCapture, 'NOT_AUTHORIZED');
assert.equal(IRES_SOURCE_FIELD_RIGHTS_BOUNDARY.aiAddendum, 'NOT_ACCEPTED');
assert.equal(Object.values(IRES_SOURCE_FIELD_PROTECTED_BOUNDARIES).every((value) => value === false), true);

const daysSinceListingContractDate = MARKET_METRIC_DEFINITIONS.DAYS_SINCE_LISTING_CONTRACT_DATE_CANDIDATE;
assert.equal(daysSinceListingContractDate.domBasis, 'DAYS_SINCE_LISTING_CONTRACT_DATE');
assert.equal(daysSinceListingContractDate.historicalComparisonStatus, 'NOT_ADMITTED');
assert.equal((daysSinceListingContractDate.allowedUses as readonly string[]).includes('PUBLIC_DISPLAY'), false);
assert.equal((daysSinceListingContractDate.allowedUses as readonly string[]).includes('HISTORICAL_COMPARISON'), false);

for (const forbiddenSchemaField of ['listingContractDate', 'originalListPrice', 'priceChangeTimestamp', 'statusChangeTimestamp', 'closeDate', 'closePrice', 'ireCityId', 'daysOnMarket']) {
  assert.equal(schema.includes(forbiddenSchemaField), false, `schema must not add ${forbiddenSchemaField}`);
}

const propertyDataMatch = upsertListing.match(/const propertyData: Prisma\.PropertyUncheckedCreateInput = \{[\s\S]*?\n  \};/);
assert(propertyDataMatch, 'missing propertyData block');
const propertyData = propertyDataMatch[0] ?? '';
for (const notPersisted of ['ListingContractDate', 'OriginalListPrice', 'PriceChangeTimestamp', 'StatusChangeTimestamp', 'CloseDate', 'ClosePrice', 'IRE_CityID', 'DaysOnMarket']) {
  assert.equal(propertyData.includes(notPersisted), false, `mapper must not persist ${notPersisted}`);
}

for (const forbiddenRuntimeToken of ['fetch(', 'new PrismaClient', 'prisma.', 'supabase.', 'typesense.', 'MLS_GRID_TOKEN', 'DATABASE_URL', 'process.env']) {
  assert.equal(contract.includes(forbiddenRuntimeToken), false, `inert evidence contract must not include runtime token ${forbiddenRuntimeToken}`);
}

for (const requiredReportToken of [
  'IRES_SOURCE_FIELD_LISTINGCONTRACTDATE_EVIDENCE_ADMISSION_CERTIFIED',
  'IRES-SUPPLIED DOM FIELD',
  'IRES LISTING CONTRACT DATE',
  'NO HISTORICAL RETENTION AUTHORIZATION WAS GRANTED',
  'NO CANONICAL-GEOGRAPHY EXPANSION IN THIS PACKAGE',
]) {
  assert.ok(report.includes(requiredReportToken), `report missing ${requiredReportToken}`);
}

assert.equal(
  packageJson.scripts?.['check:ires-source-field-listingcontractdate-evidence'],
  'jiti scripts/checkIresSourceFieldListingContractDateEvidence.ts',
);

assert.ok(IRES_SOURCE_FIELD_EVIDENCE.length >= 30, 'bounded high-value source-field registry must be populated');

console.log('IRES_SOURCE_FIELD_LISTINGCONTRACTDATE_EVIDENCE_CHECK: PASS');
