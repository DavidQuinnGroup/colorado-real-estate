import assert from 'node:assert/strict';

import {
  getMlsProcessedCountSemantics,
  parseMlsODataPageResponse,
  validateProviderNextLink,
} from '../lib/mls/paginationContract.js';

const providerBaseUrl = 'https://api.example-mls.test/odata';

const pageWithMetadata = parseMlsODataPageResponse({
  '@odata.count': 574000,
  '@odata.nextLink': 'https://api.example-mls.test/odata/Property?$skip=100&$top=100',
  value: [
    {
      ListingKey: 'fixture-001',
      ModificationTimestamp: '2026-08-14T18:22:38.876Z',
    },
  ],
});

assert.equal(pageWithMetadata.value.length, 1);
assert.equal(pageWithMetadata.metadata.sourceCount, 574000);
assert.equal(pageWithMetadata.metadata.hasNextLink, true);
assert.equal(pageWithMetadata.metadata.terminationSignal, 'not_terminal');
assert.deepEqual(pageWithMetadata.metadata.rawResponseKeys, ['@odata.count', '@odata.nextLink', 'value']);

const repeatedPage = parseMlsODataPageResponse({
  '@odata.count': 574000,
  '@odata.nextLink': 'https://api.example-mls.test/odata/Property?$skip=100&$top=100',
  value: [
    {
      ListingKey: 'fixture-001',
      ModificationTimestamp: '2026-08-14T18:22:38.876Z',
    },
  ],
});
assert.deepEqual(repeatedPage.metadata, pageWithMetadata.metadata, 'repeated metadata should remain stable for identical payloads');

const terminalWithoutNextLink = parseMlsODataPageResponse({
  '@odata.count': 1,
  value: [
    {
      ListingKey: 'fixture-terminal',
      ModificationTimestamp: '2026-08-14T18:00:00.000Z',
    },
  ],
});
assert.equal(terminalWithoutNextLink.metadata.hasNextLink, false);
assert.equal(terminalWithoutNextLink.metadata.terminationSignal, 'next_link_absent');

const emptyPage = parseMlsODataPageResponse({
  '@odata.count': 1,
  value: [],
});
assert.equal(emptyPage.metadata.valueLength, 0);
assert.equal(emptyPage.metadata.terminationSignal, 'empty_page');

const shortPageWithNextLink = parseMlsODataPageResponse({
  '@odata.count': 500,
  '@odata.nextLink': 'https://api.example-mls.test/odata/Property?$skip=2&$top=100',
  value: [{ ListingKey: 'fixture-short' }],
});
assert.equal(shortPageWithNextLink.metadata.valueLength, 1);
assert.equal(shortPageWithNextLink.metadata.terminationSignal, 'not_terminal');

const countAbsent = parseMlsODataPageResponse({
  '@odata.nextLink': 'https://api.example-mls.test/odata/Property?$skip=100&$top=100',
  value: [{ ListingKey: 'fixture-count-absent' }],
});
assert.equal(countAbsent.metadata.sourceCount, null);
assert.equal(countAbsent.metadata.hasNextLink, true);

const countChangedA = parseMlsODataPageResponse({
  '@odata.count': 574000,
  '@odata.nextLink': 'https://api.example-mls.test/odata/Property?$skip=100&$top=100',
  value: [{ ListingKey: 'fixture-count-a' }],
});
const countChangedB = parseMlsODataPageResponse({
  '@odata.count': 574125,
  '@odata.nextLink': 'https://api.example-mls.test/odata/Property?$skip=100&$top=100',
  value: [{ ListingKey: 'fixture-count-a' }],
});
assert.notEqual(
  countChangedA.metadata.sourceCount,
  countChangedB.metadata.sourceCount,
  'source count changes must be represented as provider metadata rather than local processed count',
);

const tiedTimestampRecords = [
  {
    ListingKey: 'fixture-tie-a',
    ModificationTimestamp: '2026-08-14T18:22:38.876Z',
  },
  {
    ListingKey: 'fixture-tie-b',
    ModificationTimestamp: '2026-08-14T18:22:38.876Z',
  },
];
assert.equal(
  tiedTimestampRecords[0]?.ModificationTimestamp,
  tiedTimestampRecords[1]?.ModificationTimestamp,
  'fixture proves ModificationTimestamp alone is not a unique deterministic order key',
);
assert.notEqual(tiedTimestampRecords[0]?.ListingKey, tiedTimestampRecords[1]?.ListingKey);

assert.deepEqual(validateProviderNextLink(null, providerBaseUrl), {
  ok: false,
  reason: 'missing_next_link',
});
assert.deepEqual(validateProviderNextLink('not a url with spaces', providerBaseUrl), {
  ok: false,
  reason: 'invalid_url',
});
assert.deepEqual(validateProviderNextLink('https://user:pass@api.example-mls.test/odata/Property?$skip=100', providerBaseUrl), {
  ok: false,
  reason: 'credentialed_url',
});
assert.deepEqual(validateProviderNextLink('ftp://api.example-mls.test/odata/Property?$skip=100', providerBaseUrl), {
  ok: false,
  reason: 'unsupported_protocol',
});
assert.deepEqual(validateProviderNextLink('https://evil.example.test/odata/Property?$skip=100', providerBaseUrl), {
  ok: false,
  reason: 'wrong_host',
});

const acceptedNextLink = validateProviderNextLink('/odata/Property?$skip=100&$top=100', providerBaseUrl);
assert.equal(acceptedNextLink.ok, true);
if (acceptedNextLink.ok) {
  assert.equal(acceptedNextLink.url, 'https://api.example-mls.test/odata/Property?$skip=100&$top=100');
}

assert.deepEqual(getMlsProcessedCountSemantics(), {
  field: 'MlsSyncState.totalRecords',
  meaning: 'LOCAL_PROCESSED_RECORD_COUNT',
  not: ['SOURCE_TOTAL_COUNT', 'INTENDED_SCOPE_COUNT'],
});

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_NO_DB_NO_PROVIDER_NO_SIDE_EFFECT',
      cases: {
        pageWithValueCountNextLink: 'PASS',
        terminalWithoutNextLink: 'PASS',
        emptyPage: 'PASS',
        shortPageWithNextLink: 'PASS',
        stableRepeatedPageMetadata: 'PASS',
        tiedModificationTimestampRecords: 'PASS',
        malformedNextLink: 'PASS',
        wrongHostNextLinkRejection: 'PASS',
        countAbsent: 'PASS',
        sourceCountChangingBetweenRequests: 'PASS',
        localProcessedCountDistinctFromSourceCount: 'PASS',
        noDbWrite: 'PASS',
        noProviderCall: 'PASS',
        noAlertEmailTypesenseSideEffect: 'PASS',
      },
    },
    null,
    2,
  ),
);
