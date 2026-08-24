import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  IRES_CITYID_OFFICIAL_EVIDENCE,
  IRES_CITYID_SOURCE_GEOGRAPHY_FIREWALL,
  resolveIresCityId,
  validateIresCityIdEvidenceContract,
} from '../lib/iresCityIdEvidence';
import { IRES_CITYID_FIXTURES } from '../lib/iresCityIdEvidenceFixtures';

assert.equal(validateIresCityIdEvidenceContract(), true);
assert.equal(IRES_CITYID_OFFICIAL_EVIDENCE.reportedFullEnumeration.reportedCardinality, 'OVER_500_VALUES');
assert.equal(IRES_CITYID_OFFICIAL_EVIDENCE.reportedFullEnumeration.refreshRequirement, 'AUTHORIZED_DATASET_DISTINCT_VALUES_QUERY_REQUIRED');
assert.equal(IRES_CITYID_OFFICIAL_EVIDENCE.evidenceLimits.statewideCoverageClaim, false);
assert.equal(IRES_CITYID_OFFICIAL_EVIDENCE.evidenceLimits.sourceActivationAuthorized, false);

for (const [fixtureName, expectedCity] of Object.entries({ boulder: 'Boulder', broomfield: 'Broomfield', erie: 'Erie', lafayette: 'Lafayette', longmont: 'Longmont', louisville: 'Louisville', superior: 'Superior', westminster: 'Westminster', denver: 'Denver', niwot: 'Niwot' })) {
  assert.equal(IRES_CITYID_FIXTURES[fixtureName].reportedCityName, expectedCity);
  assert.equal(IRES_CITYID_FIXTURES[fixtureName].atlasGeographicObjectState, 'NOT_RECONCILED');
}

for (const fixture of Object.values(IRES_CITYID_FIXTURES)) {
  assert.equal(fixture.listingDisposition, 'RETAIN_WITH_SOURCE_GEOGRAPHY_UNMAPPED');
  assert.equal(fixture.numericInference, 'PROHIBITED');
  assert.equal(fixture.coverageAssertion, false);
  assert.equal(fixture.activationState, 'NOT_AUTHORIZED');
}

assert.equal(IRES_CITYID_FIXTURES.unknownFutureValue.observationState, 'UNKNOWN_OR_UNMAPPED');
assert.equal(IRES_CITYID_FIXTURES.unknownFutureValue.reportedCityName, null);
assert.equal(IRES_CITYID_FIXTURES.nonEquivalentLeadingZeroValue.observationState, 'UNKNOWN_OR_UNMAPPED');
assert.equal(IRES_CITYID_FIXTURES.missing.observationState, 'MISSING');
assert.equal(resolveIresCityId(9).reportedCityName, 'Boulder');
assert.deepEqual(IRES_CITYID_SOURCE_GEOGRAPHY_FIREWALL, { runtimeIngestion: false, listingAssignment: false, geographicObjectCreation: false, searchMapUse: false, publicDisplay: false, coverageClaim: false, activation: false });

const runtime = fs.readFileSync('lib/iresCityIdEvidence.ts', 'utf8');
for (const forbidden of ['@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'Typesense', 'SearchInterface', 'app/api', 'route.ts', 'sourceRegistry', 'sourceQualityOperationalManifestData', 'CRMTask', 'queue', 'worker']) {
  assert.equal(runtime.includes(forbidden), false, `CityID evidence contract must not reference ${forbidden}.`);
}

console.log('IRES_CITYID_OFFICIAL_EVIDENCE_CHECK: PASS');
