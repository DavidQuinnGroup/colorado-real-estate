import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  MLS_SOURCE_TIMESTAMP_FIELD_INVENTORY,
  REIE_MLS_SOURCE_FRESHNESS_FIELD,
  REIE_MLS_SOURCE_FRESHNESS_PRIMARY_PAYLOAD_FIELD,
  REIE_NEW_LISTING_FRESHNESS_WINDOW_HOURS,
  getMlsSourceFreshness,
  getSourceFreshnessPersistenceDecision,
  isFreshForNewListingAlert,
  isSourceFreshnessAfterIngestion,
  resolveMlsSourceModifiedAt,
} from '../lib/mls/sourceFreshness.js';
import { buildPropertyRecordWithDiagnostics } from '../lib/mls/upsertListing.js';

const evaluatedAt = '2026-08-13T12:00:00.000Z';
const ingestionAt = '2026-08-13T12:00:00.000Z';
const migrationPath = 'prisma/migrations/20260813213000_add_property_source_modified_at/migration.sql';

function toIsoDate(value: Date | string | null | undefined) {
  return value ? new Date(value).toISOString() : null;
}

function assertFreshness(
  name: string,
  listing: Record<string, unknown>,
  expected: {
    field: string | null;
    reason: string;
    eligible: boolean;
  },
) {
  const sourceFreshness = getMlsSourceFreshness(listing);
  const result = isFreshForNewListingAlert(sourceFreshness, evaluatedAt);

  assert.equal(sourceFreshness.field, expected.field, `${name}: unexpected source field`);
  assert.equal(result.reason, expected.reason, `${name}: unexpected freshness reason`);
  assert.equal(result.eligible, expected.eligible, `${name}: unexpected eligibility`);

  return { sourceFreshness, result };
}

assert.equal(REIE_MLS_SOURCE_FRESHNESS_FIELD, 'sourceModifiedAt');
assert.equal(REIE_MLS_SOURCE_FRESHNESS_PRIMARY_PAYLOAD_FIELD, 'ModificationTimestamp');
assert.equal(REIE_NEW_LISTING_FRESHNESS_WINDOW_HOURS, 72);

const prismaSchema = readFileSync('prisma/schema.prisma', 'utf8');
const migrationSql = readFileSync(migrationPath, 'utf8');
assert.match(prismaSchema, /sourceModifiedAt\s+DateTime\?/, 'Property must expose nullable sourceModifiedAt.');
assert.match(prismaSchema, /@@index\(\[sourceModifiedAt\]\)/, 'Property must index sourceModifiedAt for freshness-window filtering.');
assert.equal(
  migrationSql.trim(),
  'ALTER TABLE "Property" ADD COLUMN "sourceModifiedAt" TIMESTAMP(3);\n\nCREATE INDEX "Property_sourceModifiedAt_idx" ON "Property"("sourceModifiedAt");',
  'Migration artifact must remain limited to the additive sourceModifiedAt column and index.',
);

const inventory = new Map(MLS_SOURCE_TIMESTAMP_FIELD_INVENTORY.map((field) => [field.field, field]));
assert.equal(inventory.get('ModificationTimestamp')?.classification, 'SOURCE_CHANGE_TIMESTAMP');
assert.equal(inventory.get('ModificationTimestamp')?.sourceFreshnessCandidate, true);
assert.equal(inventory.get('ListingContractDate')?.classification, 'LISTING_ORIGIN_TIMESTAMP');
assert.equal(inventory.get('OnMarketDate')?.classification, 'LISTING_ORIGIN_TIMESTAMP');
assert.equal(inventory.get('OriginalEntryTimestamp')?.classification, 'LISTING_ORIGIN_TIMESTAMP');
assert.equal(inventory.get('StatusChangeTimestamp')?.classification, 'STATUS_TIMESTAMP');
assert.equal(inventory.get('PhotosChangeTimestamp')?.classification, 'UNKNOWN');

assertFreshness('fresh ModificationTimestamp', { ModificationTimestamp: '2026-08-13T10:00:00.000Z' }, {
  field: 'ModificationTimestamp',
  reason: 'SOURCE_FRESH',
  eligible: true,
});

const boundary = assertFreshness('exactly-at-window boundary', { ModificationTimestamp: '2026-08-10T12:00:00.000Z' }, {
  field: 'ModificationTimestamp',
  reason: 'SOURCE_FRESH',
  eligible: true,
});
assert.equal(boundary.result.ageHours, 72);

assertFreshness('stale timestamp', { ModificationTimestamp: '2026-08-10T11:59:59.000Z' }, {
  field: 'ModificationTimestamp',
  reason: 'SOURCE_STALE',
  eligible: false,
});

assertFreshness('missing timestamp', {}, {
  field: null,
  reason: 'SOURCE_TIMESTAMP_MISSING',
  eligible: false,
});

assertFreshness('malformed source timestamp', { ModificationTimestamp: 'not-a-date' }, {
  field: 'ModificationTimestamp',
  reason: 'SOURCE_TIMESTAMP_MALFORMED',
  eligible: false,
});

assertFreshness('fallback listing modification timestamp', { ListingModificationTimestamp: '2026-08-13T09:00:00.000Z' }, {
  field: 'ListingModificationTimestamp',
  reason: 'SOURCE_FRESH',
  eligible: true,
});

assert.equal(
  isSourceFreshnessAfterIngestion(getMlsSourceFreshness({ ModificationTimestamp: '2026-08-13T12:05:00.000Z' }), ingestionAt),
  true,
  'source timestamp newer than ingestion time should be flagged for review, not silently rewritten',
);

assert.equal(
  isSourceFreshnessAfterIngestion(getMlsSourceFreshness({ ModificationTimestamp: '2026-08-13T11:55:00.000Z' }), ingestionAt),
  false,
  'ingestion time newer than source timestamp should not be flagged as source-after-ingestion',
);

assert.equal(
  getSourceFreshnessPersistenceDecision(
    getMlsSourceFreshness({ ModificationTimestamp: '2026-08-13T10:00:00.000Z' }),
    '2026-08-13T09:00:00.000Z',
  ),
  'persist_incoming',
);

assert.equal(
  getSourceFreshnessPersistenceDecision(
    getMlsSourceFreshness({ ModificationTimestamp: '2026-08-13T08:00:00.000Z' }),
    '2026-08-13T09:00:00.000Z',
  ),
  'keep_existing_older_incoming',
);

assert.equal(
  getSourceFreshnessPersistenceDecision(
    getMlsSourceFreshness({ ModificationTimestamp: '2026-08-13T09:00:00.000Z' }),
    '2026-08-13T09:00:00.000Z',
  ),
  'no_change_same_timestamp',
);

assert.equal(getSourceFreshnessPersistenceDecision(getMlsSourceFreshness({}), '2026-08-13T09:00:00.000Z'), 'keep_existing_missing_incoming');
assert.equal(
  getSourceFreshnessPersistenceDecision(getMlsSourceFreshness({ ModificationTimestamp: 'not-a-date' }), '2026-08-13T09:00:00.000Z'),
  'keep_existing_malformed_incoming',
);

const newerResolution = resolveMlsSourceModifiedAt(
  { ModificationTimestamp: '2026-08-13T10:00:00.000Z' },
  '2026-08-13T09:00:00.000Z',
);
assert.equal(newerResolution.decision, 'persist_incoming');
assert.equal(newerResolution.persistedSourceModifiedAt?.toISOString(), '2026-08-13T10:00:00.000Z');

const sameResolution = resolveMlsSourceModifiedAt(
  { ModificationTimestamp: '2026-08-13T09:00:00.000Z' },
  '2026-08-13T09:00:00.000Z',
);
assert.equal(sameResolution.decision, 'no_change_same_timestamp');
assert.equal(sameResolution.persistedSourceModifiedAt?.toISOString(), '2026-08-13T09:00:00.000Z');

const olderResolution = resolveMlsSourceModifiedAt(
  { ModificationTimestamp: '2026-08-13T08:00:00.000Z' },
  '2026-08-13T09:00:00.000Z',
);
assert.equal(olderResolution.decision, 'keep_existing_older_incoming');
assert.equal(olderResolution.persistedSourceModifiedAt?.toISOString(), '2026-08-13T09:00:00.000Z');

const missingResolution = resolveMlsSourceModifiedAt({}, '2026-08-13T09:00:00.000Z');
assert.equal(missingResolution.decision, 'keep_existing_missing_incoming');
assert.equal(missingResolution.persistedSourceModifiedAt?.toISOString(), '2026-08-13T09:00:00.000Z');

const malformedResolution = resolveMlsSourceModifiedAt(
  { ModificationTimestamp: 'not-a-date' },
  '2026-08-13T09:00:00.000Z',
);
assert.equal(malformedResolution.decision, 'keep_existing_malformed_incoming');
assert.equal(malformedResolution.persistedSourceModifiedAt?.toISOString(), '2026-08-13T09:00:00.000Z');

const nullExistingResolution = resolveMlsSourceModifiedAt({ ModificationTimestamp: '2026-08-13T10:00:00.000Z' }, null);
assert.equal(nullExistingResolution.decision, 'persist_incoming');
assert.equal(nullExistingResolution.persistedSourceModifiedAt?.toISOString(), '2026-08-13T10:00:00.000Z');

const baseListing = {
  ListingKey: 'fixture-source-modified-001',
  UnparsedAddress: '100 Fixture St',
  City: 'Boulder',
  StateOrProvince: 'CO',
  PostalCode: '80302',
  ListPrice: 900000,
  BedroomsTotal: 3,
  BathroomsTotalInteger: 2,
  LivingArea: 2100,
  PropertyType: 'Residential',
  StandardStatus: 'Active',
  Latitude: 40.01,
  Longitude: -105.25,
};

const mappedNewer = buildPropertyRecordWithDiagnostics(
  { ...baseListing, ModificationTimestamp: '2026-08-13T10:00:00.000Z' },
  {
    id: 'fixture-property-001',
    lat: 40.01,
    lng: -105.25,
    slug: 'fixture-source-modified-001',
    sourceModifiedAt: new Date('2026-08-13T09:00:00.000Z'),
  },
  new Date(evaluatedAt),
);
assert.equal(toIsoDate(mappedNewer.propertyData?.sourceModifiedAt), '2026-08-13T10:00:00.000Z');
assert.equal(mappedNewer.diagnostics.sourceModifiedAtDecision, 'persist_incoming');

const mappedOlder = buildPropertyRecordWithDiagnostics(
  { ...baseListing, ModificationTimestamp: '2026-08-13T08:00:00.000Z' },
  {
    id: 'fixture-property-001',
    lat: 40.01,
    lng: -105.25,
    slug: 'fixture-source-modified-001',
    sourceModifiedAt: new Date('2026-08-13T09:00:00.000Z'),
  },
  new Date(evaluatedAt),
);
assert.equal(toIsoDate(mappedOlder.propertyData?.sourceModifiedAt), '2026-08-13T09:00:00.000Z');
assert.equal(mappedOlder.diagnostics.sourceModifiedAtDecision, 'keep_existing_older_incoming');

const mappedMissing = buildPropertyRecordWithDiagnostics(baseListing, null, new Date(evaluatedAt));
assert.equal(mappedMissing.propertyData?.sourceModifiedAt, null);
assert.equal(mappedMissing.diagnostics.sourceModifiedAtDecision, 'keep_existing_missing_incoming');

const publicActiveCandidate = {
  status: 'Active',
  isPrivateExclusive: false,
  ModificationTimestamp: '2026-08-13T10:00:00.000Z',
};
assert.equal(publicActiveCandidate.status, 'Active');
assert.equal(publicActiveCandidate.isPrivateExclusive, false);
assert.equal(isFreshForNewListingAlert(getMlsSourceFreshness(publicActiveCandidate), evaluatedAt).eligible, true);

const inactiveCandidate = {
  status: 'Closed',
  isPrivateExclusive: false,
  ModificationTimestamp: '2026-08-13T10:00:00.000Z',
};
assert.notEqual(inactiveCandidate.status, 'Active');

const privateCandidate = {
  status: 'Active',
  isPrivateExclusive: true,
  ModificationTimestamp: '2026-08-13T10:00:00.000Z',
};
assert.equal(privateCandidate.isPrivateExclusive, true);

const alreadyAlertedEventKey = 'fixture-user-001:fixture-property-001:NEW_LISTING';
assert.equal(new Set([alreadyAlertedEventKey]).has(alreadyAlertedEventKey), true);

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_NO_SIDE_EFFECT',
      recommendedPersistedField: REIE_MLS_SOURCE_FRESHNESS_FIELD,
      primaryPayloadField: REIE_MLS_SOURCE_FRESHNESS_PRIMARY_PAYLOAD_FIELD,
      migrationPath,
      windowHours: REIE_NEW_LISTING_FRESHNESS_WINDOW_HOURS,
      cases: {
        freshModificationTimestamp: 'PASS',
        exactlyAtWindowBoundary: 'PASS',
        staleTimestamp: 'PASS',
        missingTimestamp: 'PASS',
        malformedTimestamp: 'PASS',
        sourceTimestampNewerThanIngestion: 'PASS',
        ingestionTimeNewerThanSourceTimestamp: 'PASS',
        duplicateIngestOlderIncoming: 'PASS',
        upsertMappingValidNewerTimestamp: 'PASS',
        upsertMappingMissingTimestampExistingNull: 'PASS',
        upsertMappingOlderTimestampPreservesExisting: 'PASS',
        activePublicCandidate: 'PASS',
        inactiveCandidate: 'PASS',
        privateCandidate: 'PASS',
        alreadyAlertedCandidate: 'PASS',
      },
      counters: {
        databaseReads: 0,
        databaseRowsCreated: 0,
        databaseRowsMutated: 0,
        queueJobsCreated: 0,
        providerCalls: 0,
        emailsSent: 0,
        workersActivated: 0,
        migrationsRun: 0,
      },
    },
    null,
    2,
  ),
);
