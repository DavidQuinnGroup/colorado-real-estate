import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  createSourceQualityNamespacedFingerprint,
  SOURCE_QUALITY_DETERMINISTIC_FINGERPRINT_ALGORITHM,
  SOURCE_QUALITY_DETERMINISTIC_FINGERPRINT_UTILITY_VERSION,
} from '../lib/sourceQualityDeterministicFingerprint';

const governanceValue = {
  schemaVersion: 'REIE_SOURCE_QUALITY_GIS_EVIDENCE_CONVERSION_V1',
  sourceId: 'SRC-BCOD-ADDRESS-POINTS',
  sourceClass: 'COUNTY_GIS_ADDRESS_POINTS',
  certificationReference: { certificationId: 'CERT-SYNTHETIC-001', referenceVersion: 'V01' },
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
};

const same = createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', governanceValue);
assert.equal(same, createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', governanceValue));
assert.equal(same, createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', {
  fieldSensitivityPosture: governanceValue.fieldSensitivityPosture,
  certificationReference: governanceValue.certificationReference,
  sourceClass: governanceValue.sourceClass,
  sourceId: governanceValue.sourceId,
  schemaVersion: governanceValue.schemaVersion,
}));
assert.notEqual(same, createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', { ...governanceValue, sourceId: 'SRC-BCOD-PARK-BOUNDARIES' }));
assert.notEqual(same, createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', { ...governanceValue, sourceClass: 'COUNTY_GIS_PARCEL_GEOMETRY' }));
assert.notEqual(same, createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', { ...governanceValue, certificationReference: { ...governanceValue.certificationReference, referenceVersion: 'V02' } }));
assert.notEqual(same, createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', { ...governanceValue, fieldSensitivityPosture: 'IDENTIFIER_BEARING_CONTEXT' }));
assert.notEqual(same, createSourceQualityNamespacedFingerprint('gis-public-geospatial-conversion', governanceValue));
assert.notEqual(same, createSourceQualityNamespacedFingerprint('public-record-input', governanceValue));
assert.equal(createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', null).split(':').slice(0, 4).join(':'), `source-quality-fingerprint:gis-public-geospatial-input:${SOURCE_QUALITY_DETERMINISTIC_FINGERPRINT_UTILITY_VERSION}:${SOURCE_QUALITY_DETERMINISTIC_FINGERPRINT_ALGORITHM}`);
assert.match(same, /^source-quality-fingerprint:gis-public-geospatial-input:v1:sha256:[0-9a-f]{64}$/);

assert.equal(createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', null), createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', null));
assert.equal(createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', true), createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', true));
assert.equal(createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', 'escaped\nstring'), createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', 'escaped\nstring'));
assert.equal(createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', 1.25), createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', 1.25));
assert.notEqual(createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', [1, 2]), createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', [2, 1]));

for (const unsupported of [undefined, BigInt(1), () => null, Symbol('unsupported'), Number.NaN, Number.POSITIVE_INFINITY, new Date('2026-01-01')]) {
  assert.throws(() => createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', unsupported), TypeError);
}
assert.throws(() => createSourceQualityNamespacedFingerprint('GIS/INVALID' as never, governanceValue), TypeError);

const runtime = await readFile(new URL('../lib/sourceQualityDeterministicFingerprint.ts', import.meta.url), 'utf8');
for (const forbidden of ['Date.now', 'Math.random', 'process.env', 'fetch(', 'http://', 'https://', '@prisma/client', 'PrismaClient', 'CRMTask', 'Typesense', 'Search', 'queue', 'worker', 'coordinates', 'GeoJSON', 'parcelId', 'ownerName', 'address']) {
  assert.equal(runtime.includes(forbidden), false, 'Utility must not depend on ' + forbidden);
}
assert.equal(runtime.includes('createHash'), true);
assert.equal(runtime.includes('SOURCE_QUALITY_DETERMINISTIC_FINGERPRINT_UTILITY_VERSION'), true);
console.log('[source-quality-deterministic-fingerprint] ok');
