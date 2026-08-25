import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  HISTORICAL_EVIDENCE_FOUNDATION_ADMISSION_REVIEW_STATUS,
  HISTORICAL_EVIDENCE_FOUNDATION_NEXT_GATE,
  HISTORICAL_EVIDENCE_FOUNDATION_PROTECTED_BOUNDARIES,
  HISTORICAL_EVIDENCE_FOUNDATION_QUESTION_READINESS,
  HISTORICAL_EVIDENCE_FOUNDATION_REPOSITORY_FINDINGS,
  HISTORICAL_EVIDENCE_FOUNDATION_REQUIREMENTS,
  HISTORICAL_EVIDENCE_FOUNDATION_TRUTH_DISTINCTIONS,
} from '../lib/historicalEvidenceFoundationAdmissionReview';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const upsertListing = readFileSync('lib/mls/upsertListing.ts', 'utf8');
const contract = readFileSync('lib/historicalEvidenceFoundationAdmissionReview.ts', 'utf8');
const report = readFileSync('docs/project-atlas/executive-library/HISTORICAL-EVIDENCE-FOUNDATION-ADMISSION-REVIEW.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

function modelBlock(modelName: string): string {
  const match = schema.match(new RegExp(`model ${modelName} \\{[\\s\\S]*?\\n\\}`));
  assert(match, `missing model ${modelName}`);
  return match[0] ?? '';
}

function propertyDataBlock(): string {
  const match = upsertListing.match(/const propertyData: Prisma\.PropertyUncheckedCreateInput = \{[\s\S]*?\n  \};/);
  assert(match, 'missing PropertyUncheckedCreateInput block');
  return match[0] ?? '';
}

assert.equal(HISTORICAL_EVIDENCE_FOUNDATION_ADMISSION_REVIEW_STATUS, 'HISTORICAL_EVIDENCE_FOUNDATION_ADMISSION_REVIEW_CERTIFIED');
assert.equal(HISTORICAL_EVIDENCE_FOUNDATION_NEXT_GATE, 'READY_FOR_PROSPECTIVE_LISTING_OBSERVATION_AND_EVENT_EVIDENCE_FOUNDATION');

for (const [boundary, value] of Object.entries(HISTORICAL_EVIDENCE_FOUNDATION_PROTECTED_BOUNDARIES)) {
  assert.equal(value, false, `${boundary} must remain false`);
}

for (const distinction of [
  'CURRENT_ROW_NOT_HISTORICAL_SNAPSHOT',
  'DATE_FIELD_NOT_EVENT_LEDGER',
  'PRICE_HISTORY_ROW_NOT_COMPLETE_LISTING_HISTORY_UNLESS_PROVEN',
  'CURRENT_ACTIVE_INVENTORY_NOT_PAST_ACTIVE_INVENTORY',
  'PROSPECTIVE_EVENT_CAPTURE_NOT_RETROSPECTIVE_HISTORY',
  'MLS_REPORT_OUTPUT_NOT_ATLAS_METHODOLOGY_ADMISSION',
  'IRES_AGENT_REPORTING_CAPABILITY_NOT_AUTHORIZED_MLS_GRID_HISTORICAL_EVIDENCE',
]) {
  assert(HISTORICAL_EVIDENCE_FOUNDATION_TRUTH_DISTINCTIONS.includes(distinction as never), `missing distinction ${distinction}`);
  assert(report.includes(distinction), `report missing distinction ${distinction}`);
}

const property = modelBlock('Property');
for (const admittedCurrentField of ['price', 'status', 'createdAt', 'updatedAt', 'sourceModifiedAt']) {
  assert(property.includes(admittedCurrentField), `Property missing current field ${admittedCurrentField}`);
}
for (const missingHistoricalField of [
  'closeDate',
  'closedDate',
  'closePrice',
  'salePrice',
  'soldPrice',
  'originalListPrice',
  'listDate',
  'listingContractDate',
  'onMarketDate',
  'pendingDate',
  'withdrawnDate',
  'expirationDate',
  'daysOnMarket',
  'cumulativeDaysOnMarket',
  'dom',
  'cdom',
]) {
  assert(!property.includes(missingHistoricalField), `Property unexpectedly includes ${missingHistoricalField}`);
}

const priceHistory = modelBlock('PriceHistory');
for (const field of ['propertyId', 'price', 'event', 'date']) {
  assert(priceHistory.includes(field), `PriceHistory missing ${field}`);
}
for (const absentField of ['sourceId', 'oldPrice', 'newPrice', 'direction', 'observedAt', 'effectiveAt', 'rightsPostureReference', 'correction', 'supersededById']) {
  assert(!priceHistory.includes(absentField), `PriceHistory unexpectedly includes ${absentField}`);
}
assert(priceHistory.includes('onDelete: Cascade'), 'PriceHistory must be recognized as cascade-linked to current Property');

const openHouse = modelBlock('OpenHouse');
for (const field of ['propertyId', 'startTime', 'endTime']) {
  assert(openHouse.includes(field), `OpenHouse missing ${field}`);
}
for (const absentField of ['sourceId', 'sourceEventId', 'observedAt', 'effectiveAt', 'rightsPostureReference', 'correction', 'supersededById']) {
  assert(!openHouse.includes(absentField), `OpenHouse unexpectedly includes ${absentField}`);
}

const propertyData = propertyDataBlock();
for (const mappedCurrentField of ['ListPrice', 'CurrentPrice', 'StandardStatus', 'MlsStatus', 'sourceModifiedAt']) {
  assert(upsertListing.includes(mappedCurrentField), `MLS upsert missing expected current mapping evidence ${mappedCurrentField}`);
}
for (const notPersisted of [
  'CloseDate',
  'ClosePrice',
  'OriginalListPrice',
  'ListingContractDate',
  'OnMarketDate',
  'DaysOnMarket',
  'CumulativeDaysOnMarket',
]) {
  assert(!propertyData.includes(notPersisted), `Property data unexpectedly persists ${notPersisted}`);
}

assert(HISTORICAL_EVIDENCE_FOUNDATION_REPOSITORY_FINDINGS.length >= 9, 'repository finding inventory must be populated');
assert(HISTORICAL_EVIDENCE_FOUNDATION_QUESTION_READINESS.length >= 7, 'historical question readiness inventory must be populated');
assert(HISTORICAL_EVIDENCE_FOUNDATION_REQUIREMENTS.prospective.length >= 5, 'prospective requirements must be populated');
assert(HISTORICAL_EVIDENCE_FOUNDATION_REQUIREMENTS.retrospective.length >= 3, 'retrospective requirements must be populated');
assert(HISTORICAL_EVIDENCE_FOUNDATION_REQUIREMENTS.reportEvidence.length >= 2, 'report evidence requirements must be populated');

for (const forbiddenRuntimeToken of ['fetch(', 'new PrismaClient', 'prisma.', 'supabase.', 'typesense.', 'MLS_GRID_API_KEY', 'DATABASE_URL']) {
  assert(!contract.includes(forbiddenRuntimeToken), `inert contract must not include runtime token ${forbiddenRuntimeToken}`);
}

for (const requiredReportToken of [
  '1. WORKSTREAM IDENTITY',
  '50. Price reductions',
  '100. Retrospective foundation classification',
  '146. Implementation-readiness / blocker matrix',
  '163. Git / commit / push state',
  'HISTORICAL_EVIDENCE_FOUNDATION_ADMISSION_REVIEW_CERTIFIED',
  'READY_FOR_PROSPECTIVE_LISTING_OBSERVATION_AND_EVENT_EVIDENCE_FOUNDATION',
]) {
  assert(report.includes(requiredReportToken), `report missing ${requiredReportToken}`);
}

for (let index = 1; index <= 163; index += 1) {
  assert(report.includes(`${index}. `), `report missing numbered item ${index}`);
}

assert.equal(
  packageJson.scripts?.['check:historical-evidence-foundation-admission-review'],
  'jiti scripts/checkHistoricalEvidenceFoundationAdmissionReview.ts',
);

console.log('HISTORICAL_EVIDENCE_FOUNDATION_ADMISSION_REVIEW_CHECK: PASS');
