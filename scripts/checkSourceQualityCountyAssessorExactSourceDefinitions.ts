import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  ADAMS_COUNTY_ASSESSOR_SOURCE_ID,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
  COUNTY_ASSESSOR_EXACT_SOURCE_CLASS,
  COUNTY_ASSESSOR_EXACT_SOURCE_CLASS_BY_ID,
  COUNTY_ASSESSOR_EXACT_SOURCE_DEFINITIONS,
  COUNTY_ASSESSOR_EXACT_SOURCE_IDS,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
  LARIMER_COUNTY_ASSESSOR_SOURCE_ID,
  WELD_COUNTY_ASSESSOR_SOURCE_ID,
  isCountyAssessorExactSourceId,
} from '../lib/sourceQualityCountyAssessorExactSourceDefinitions';
import { getReieSourceRegistry } from '../lib/sourceRegistry';

const expectedSourceIds = [
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  ADAMS_COUNTY_ASSESSOR_SOURCE_ID,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
  LARIMER_COUNTY_ASSESSOR_SOURCE_ID,
  WELD_COUNTY_ASSESSOR_SOURCE_ID,
] as const;

assert.equal(COUNTY_ASSESSOR_EXACT_SOURCE_CLASS, 'COUNTY_ASSESSOR');
assert.deepEqual(COUNTY_ASSESSOR_EXACT_SOURCE_IDS, expectedSourceIds);
assert.equal(COUNTY_ASSESSOR_EXACT_SOURCE_DEFINITIONS.length, 7);
assert.equal(new Set(COUNTY_ASSESSOR_EXACT_SOURCE_IDS).size, COUNTY_ASSESSOR_EXACT_SOURCE_IDS.length);
for (const definition of COUNTY_ASSESSOR_EXACT_SOURCE_DEFINITIONS) {
  assert.equal(definition.sourceClass, 'COUNTY_ASSESSOR');
  assert.equal(definition.jurisdiction.state, 'Colorado');
  assert.ok(definition.jurisdiction.county.length > 0);
  assert.ok(definition.responsibleOrganization.length > 0);
  assert.equal(COUNTY_ASSESSOR_EXACT_SOURCE_CLASS_BY_ID[definition.sourceId], 'COUNTY_ASSESSOR');
  assert.equal(isCountyAssessorExactSourceId(definition.sourceId), true);
  const registryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === definition.sourceId);
  assert.ok(registryRecord, 'Definition source must have an independent Registry record: ' + definition.sourceId);
  assert.equal(registryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
  assert.equal(registryRecord?.category, 'COUNTY_ASSESSOR');
}
for (const sourceId of ['SRC-DOUGLAS-COUNTY-ASSESSOR', 'SRC-DENVER-COUNTY-ASSESSOR', 'SRC-FAKE-COUNTY-ASSESSOR', 'SRC-GENERIC-COUNTY-ASSESSOR', 'SRC-PROVIDER-COUNTY-ASSESSOR']) {
  assert.equal(isCountyAssessorExactSourceId(sourceId), false);
  assert.equal(Object.prototype.hasOwnProperty.call(COUNTY_ASSESSOR_EXACT_SOURCE_CLASS_BY_ID, sourceId), false);
  assert.equal(getReieSourceRegistry().records.some((record) => record.sourceId === sourceId), false);
}

const source = await readFile(new URL('../lib/sourceQualityCountyAssessorExactSourceDefinitions.ts', import.meta.url), 'utf8');
for (const forbidden of [
  'reviewedAt',
  'certification',
  'evidence',
  'Manifest',
  'manifest',
  'activation',
  'claimEligible',
  'fieldSensitivity',
  'rights',
  'technicalAccess',
  'freshness',
  'attribution',
  'provenance',
  'fee',
  'wildcard',
  'prefix',
  'fetch(',
  'http://',
  'https://',
  '@prisma/client',
  'PrismaClient',
  'process.env',
  'Typesense',
  'Search',
  'queue',
  'worker',
]) {
  assert.equal(source.includes(forbidden), false, 'County Assessor exact-source definitions must not include ' + forbidden);
}
console.log('[source-quality-county-assessor-exact-source-definitions] ok: seven finite exact County Assessor identities expose identity-level metadata only, reject unknown assessor-looking ids, and do not centralize governance, evidence, activation, runtime, or wildcard behavior.');
