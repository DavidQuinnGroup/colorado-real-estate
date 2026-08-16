import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  BCOD_ADDRESS_POINTS_SOURCE_ID,
  BCOD_PARK_BOUNDARIES_SOURCE_ID,
  COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS,
  COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL,
  SOURCE_QUALITY_COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  convertCountyGeospatialStructuredEvidence,
  createCountyGeospatialSourceQualityAssemblyRequest,
} from '../lib/sourceQualityCountyGeospatialEvidenceConversionContract';
import {
  BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  convertGeospatialStructuredEvidence,
} from '../lib/sourceQualityGeospatialEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { getReieSourceRegistry } from '../lib/sourceRegistry';

const countyAddressRequest = {
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  schemaVersion: SOURCE_QUALITY_COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  conversionAuthorityClass: 'DELEGATED_COUNTY_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW',
} as const;

const valid = convertCountyGeospatialStructuredEvidence(countyAddressRequest);
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_ID, 'SRC-BCOD-ADDRESS-POINTS');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_ID, 'SRC-BCOD-PARK-BOUNDARIES');
assert.deepEqual(COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS, [
  'SRC-BCOD-ADDRESS-POINTS',
  'SRC-BCOD-PARK-BOUNDARIES',
]);
assert.equal(valid.classification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(valid.sourceId, BCOD_ADDRESS_POINTS_SOURCE_ID);
assert.equal(valid.linkages.length, 1);
assert.equal(valid.normalized?.source?.declaredActivationPosture, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(valid.normalized?.source?.claimEligible, false);
assert.equal(valid.normalized?.rights.posture, 'UNKNOWN');
assert.equal(valid.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(valid.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(valid.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(valid.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(valid.control?.classification, 'INSUFFICIENT_EVIDENCE');

const generic = convertGeospatialStructuredEvidence({
  ...countyAddressRequest,
  schemaVersion: 'REIE_SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_V1',
  conversionAuthorityClass: 'DELEGATED_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW',
});
assert.equal(generic.classification, 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.deepEqual(valid.linkages, generic.linkages);
assert.deepEqual(valid.normalized, generic.normalized);
assert.equal(valid.inputFingerprint, generic.inputFingerprint);
assert.equal(valid.conversionFingerprint, generic.conversionFingerprint);

const registry = getReieSourceRegistry();
for (const sourceId of [BCOD_ADDRESS_POINTS_SOURCE_ID, BCOD_PARK_BOUNDARIES_SOURCE_ID]) {
  const source = registry.records.find((record) => record.sourceId === sourceId);
  assert.ok(source);
  assert.equal(source.sourceClass, 'AUTHORITATIVE_SOURCE');
  assert.equal(source.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
  assert.equal(source.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
  assert.equal(source.claimEligible, false);
}

const park = convertCountyGeospatialStructuredEvidence({
  ...countyAddressRequest,
  sourceId: BCOD_PARK_BOUNDARIES_SOURCE_ID,
  sourceClass: 'COUNTY_GIS_PARK_BOUNDARIES',
  sourceConfirmation: { sourceId: BCOD_PARK_BOUNDARIES_SOURCE_ID, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{
    ...countyAddressRequest.evidenceReferences[0]!,
    sourceId: BCOD_PARK_BOUNDARIES_SOURCE_ID,
    evidenceReferenceId: 'GIS-CONVERSION-BCOD-PARK-BOUNDARIES-CERT-001',
  }],
});
assert.equal(park.classification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(park.sourceId, BCOD_PARK_BOUNDARIES_SOURCE_ID);
assert.notEqual(park.conversionFingerprint, valid.conversionFingerprint);

const city = convertCountyGeospatialStructuredEvidence({
  ...countyAddressRequest,
  sourceId: 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  sourceClass: 'COUNTY_GIS_ADDRESS_POINTS',
  sourceConfirmation: { sourceId: 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...countyAddressRequest.evidenceReferences[0]!, sourceId: 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS' }],
});
assert.equal(city.classification, 'COUNTY_GEOSPATIAL_SOURCE_INVALID');

for (const sourceId of ['SRC-UNKNOWN-GIS-SOURCE', 'EXP-SRC-BCOD-ADDRESS-POINTS', 'SRA-BCOD-ADDRESS-POINTS', 'SRC-BOULDER-COUNTY-PARCEL-GIS']) {
  assert.equal(convertCountyGeospatialStructuredEvidence({
    ...countyAddressRequest,
    sourceId,
    sourceClass: sourceId === 'SRC-BOULDER-COUNTY-PARCEL-GIS' ? 'COUNTY_GIS_PARCEL_GEOMETRY' : 'COUNTY_GIS_ADDRESS_POINTS',
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...countyAddressRequest.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_GEOSPATIAL_SOURCE_INVALID');
}

assert.equal(convertCountyGeospatialStructuredEvidence({
  ...countyAddressRequest,
  sourceClass: 'COUNTY_GIS_PARK_BOUNDARIES',
}).classification, 'COUNTY_GEOSPATIAL_SOURCE_MISMATCH');
const { sourceConfirmation: _sourceConfirmation, ...countyRequestWithoutConfirmation } = countyAddressRequest;
assert.equal(convertCountyGeospatialStructuredEvidence(countyRequestWithoutConfirmation).classification, 'COUNTY_GEOSPATIAL_SOURCE_CONFIRMATION_REQUIRED');
const { certificationReference: _certificationReference, ...countyRequestWithoutCertification } = countyAddressRequest;
assert.equal(convertCountyGeospatialStructuredEvidence(countyRequestWithoutCertification).classification, 'COUNTY_GEOSPATIAL_CERTIFICATION_REQUIRED');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...countyAddressRequest,
  fieldSensitivityPosture: 'UNKNOWN',
}).classification, 'COUNTY_GEOSPATIAL_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...countyAddressRequest,
  coordinates: [-105, 40],
}).classification, 'COUNTY_GEOSPATIAL_RAW_DATA_REJECTED');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...countyAddressRequest,
  evidenceReferences: [{ ...countyAddressRequest.evidenceReferences[0]!, parcelId: 'not allowed' }],
}).classification, 'COUNTY_GEOSPATIAL_RAW_DATA_REJECTED');

const assemblyRequest = createCountyGeospatialSourceQualityAssemblyRequest(valid);
assert.ok(assemblyRequest);
const assembly = assembleSourceQualitySummaries(assemblyRequest);
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');

assert.equal(COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.delegation, 'COUNTY_WRAPPER_DELEGATES_TO_GIS_PUBLIC_GEOSPATIAL_CONVERSION');
assert.equal(COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.noDuplicateConversionLogic, 'COUNTY_WRAPPER_DOES_NOT_DUPLICATE_HASHING_LINKAGE_NORMALIZATION_CONTROL_OR_ASSEMBLY');
assert.equal(COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.parcelAcceptance, 'PARCEL_GEOMETRY_SOURCE_NOT_ACCEPTED_WITHOUT_SEPARATE_AUTHORIZATION');

const runtime = await readFile(new URL('../lib/sourceQualityCountyGeospatialEvidenceConversionContract.ts', import.meta.url), 'utf8');
for (const required of ['convertGeospatialStructuredEvidence', 'createGeospatialSourceQualityAssemblyRequest']) assert.equal(runtime.includes(required), true);
for (const forbidden of ['createSourceQualityNamespacedFingerprint', 'normalizeSourceEvidence', 'summarizeSourceQuality', 'SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'sourceQualityOperationalManifestData']) {
  assert.equal(runtime.includes(forbidden), false, 'County wrapper must not duplicate or reference ' + forbidden);
}

console.log('[source-quality-county-geospatial-evidence-conversion-contract] ok: exact County GIS source references validate through a thin wrapper, delegate to generic GIS conversion, reject City/provider/EXP/SRA/parcel inputs, and preserve no-activation authority.');
