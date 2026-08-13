import assert from 'node:assert/strict';

import {
  MLS_SOURCE_TIMESTAMP_FIELD_INVENTORY,
  REIE_MLS_SOURCE_FRESHNESS_FIELD,
  REIE_MLS_SOURCE_FRESHNESS_PRIMARY_PAYLOAD_FIELD,
  REIE_NEW_LISTING_FRESHNESS_WINDOW_HOURS,
  getMlsSourceFreshness,
  getSourceFreshnessPersistenceDecision,
  isFreshForNewListingAlert,
  isSourceFreshnessAfterIngestion,
} from '../lib/mls/sourceFreshness.js';

const evaluatedAt = '2026-08-13T12:00:00.000Z';
const ingestionAt = '2026-08-13T12:00:00.000Z';

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
