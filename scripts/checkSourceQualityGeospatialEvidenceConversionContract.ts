import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS,
  GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL,
  SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  convertGeospatialStructuredEvidence,
  createGeospatialSourceQualityAssemblyRequest,
} from '../lib/sourceQualityGeospatialEvidenceConversionContract';
import { summarizeSourceQuality } from '../lib/sourceQualityControl';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { getReieSourceRegistry } from '../lib/sourceRegistry';

const registry = getReieSourceRegistry();
const addressSource = registry.records.find((record) => record.sourceId === 'SRC-BCOD-ADDRESS-POINTS');
assert.ok(addressSource);
assert.equal(addressSource.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(addressSource.category, 'BCOD_ADDRESS_POINTS');
assert.equal(addressSource.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(addressSource.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(addressSource.claimEligible, false);
assert.deepEqual(GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS, [
  'SRC-BCOD-ADDRESS-POINTS',
  'SRC-BCOD-PARK-BOUNDARIES',
  'SRC-BOULDER-COUNTY-PARCEL-GIS',
  'SRC-ARAPAHOE-COUNTY-PARCEL-GIS',
]);

const valid = convertGeospatialStructuredEvidence(BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST);
assert.equal(valid.classification, 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(valid.sourceId, 'SRC-BCOD-ADDRESS-POINTS');
assert.equal(valid.linkages.length, 1);
assert.equal(valid.linkages[0]?.sourceId, 'SRC-BCOD-ADDRESS-POINTS');
assert.equal(valid.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(valid.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(valid.linkages[0]?.posture, 'REFERENCED');
assert.equal(valid.normalized?.source?.declaredActivationPosture, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(valid.normalized?.source?.claimEligible, false);
assert.equal(valid.normalized?.rights.posture, 'UNKNOWN');
assert.equal(valid.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(valid.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(valid.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(valid.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(valid.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(valid.control?.classification, 'INSUFFICIENT_EVIDENCE');
assert.match(valid.inputFingerprint, /^source-quality-fingerprint:gis-public-geospatial-input:v1:sha256:[0-9a-f]{64}$/);
assert.match(valid.conversionFingerprint, /^source-quality-fingerprint:gis-public-geospatial-conversion:v1:sha256:[0-9a-f]{64}$/);
assert.equal(convertGeospatialStructuredEvidence(BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST).conversionFingerprint, valid.conversionFingerprint);

const reversed = convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  evidenceReferences: [...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST.evidenceReferences].reverse(),
});
assert.equal(reversed.classification, 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(reversed.conversionFingerprint, valid.conversionFingerprint);

const sensitivityChanged = convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  fieldSensitivityPosture: 'LOCATION_REFERENCE_CONTEXT',
});
assert.equal(sensitivityChanged.classification, 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.notEqual(sensitivityChanged.conversionFingerprint, valid.conversionFingerprint);

const { sourceConfirmation: _sourceConfirmation, ...requestWithoutConfirmation } = BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST;
const withoutConfirmation = convertGeospatialStructuredEvidence(requestWithoutConfirmation);
assert.equal(withoutConfirmation.classification, 'GEOSPATIAL_SOURCE_CONFIRMATION_REQUIRED');

const { certificationReference: _certificationReference, ...requestWithoutCertification } = BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST;
const withoutCertification = convertGeospatialStructuredEvidence(requestWithoutCertification);
assert.equal(withoutCertification.classification, 'GEOSPATIAL_CERTIFICATION_REQUIRED');

const withoutReviewDate = convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  reviewedAt: 'not-a-date',
});
assert.equal(withoutReviewDate.classification, 'GEOSPATIAL_REFERENCE_INVALID');

const unknownSensitivity = convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  fieldSensitivityPosture: 'UNKNOWN',
});
assert.equal(unknownSensitivity.classification, 'GEOSPATIAL_FIELD_SENSITIVITY_UNREVIEWED');

const foreignReference = convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  evidenceReferences: [{ ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BCOD-PARK-BOUNDARIES' }],
});
assert.equal(foreignReference.classification, 'GEOSPATIAL_REFERENCE_INVALID');

for (const sourceId of ['SRC-UNKNOWN-GIS-SOURCE', 'EXP-SRC-BCOD-ADDRESS-POINTS', 'SRA-BCOD-ADDRESS-POINTS', 'BCOD-ADDRESS-POINTS', 'EXP-SRC-BOULDER-COUNTY-PARCEL-GIS', 'SRA-BOULDER-COUNTY-PARCEL-GIS', 'SRC-PROVIDER-PARCEL-GIS']) {
  assert.equal(convertGeospatialStructuredEvidence({
    ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'GEOSPATIAL_SOURCE_INVALID');
}

const parcelAttempt = convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  sourceId: 'SRC-BOULDER-COUNTY-PARCEL-GIS',
  sourceClass: 'COUNTY_GIS_PARCEL_GEOMETRY',
  sourceConfirmation: { sourceId: 'SRC-BOULDER-COUNTY-PARCEL-GIS', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{
    ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST.evidenceReferences[0]!,
    sourceId: 'SRC-BOULDER-COUNTY-PARCEL-GIS',
    evidenceReferenceId: 'GIS-CONVERSION-BOULDER-COUNTY-PARCEL-GIS-CERT-001',
  }],
  certificationReference: {
    ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST.certificationReference!,
    certificationId: 'CERT-GIS-PUBLIC-GEOSPATIAL-PARCEL-GIS-CONVERSION-001',
  },
});
assert.equal(parcelAttempt.classification, 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(parcelAttempt.sourceId, 'SRC-BOULDER-COUNTY-PARCEL-GIS');
assert.equal(parcelAttempt.linkages[0]?.sourceId, 'SRC-BOULDER-COUNTY-PARCEL-GIS');
assert.equal(parcelAttempt.normalized?.source?.declaredActivationPosture, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(parcelAttempt.normalized?.source?.claimEligible, false);
assert.equal(parcelAttempt.normalized?.rights.posture, 'UNKNOWN');
assert.equal(parcelAttempt.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(parcelAttempt.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(parcelAttempt.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(parcelAttempt.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(parcelAttempt.control?.classification, 'INSUFFICIENT_EVIDENCE');
assert.match(parcelAttempt.inputFingerprint, /^source-quality-fingerprint:gis-public-geospatial-input:v1:sha256:[0-9a-f]{64}$/);
assert.match(parcelAttempt.conversionFingerprint, /^source-quality-fingerprint:gis-public-geospatial-conversion:v1:sha256:[0-9a-f]{64}$/);
assert.notEqual(parcelAttempt.conversionFingerprint, valid.conversionFingerprint);

const arapahoeParcelAttempt = convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  sourceId: 'SRC-ARAPAHOE-COUNTY-PARCEL-GIS',
  sourceClass: 'COUNTY_GIS_PARCEL_GEOMETRY',
  sourceConfirmation: { sourceId: 'SRC-ARAPAHOE-COUNTY-PARCEL-GIS', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-17' },
  evidenceReferences: [{
    ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST.evidenceReferences[0]!,
    sourceId: 'SRC-ARAPAHOE-COUNTY-PARCEL-GIS',
    evidenceReferenceId: 'SQE-ARAPAHOE-COUNTY-PARCEL-GIS-CERT-001',
  }],
  certificationReference: {
    ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST.certificationReference!,
    certificationId: 'CERT-ARAPAHOE-COUNTY-PARCEL-GIS-SOURCE-QUALITY-EVIDENCE-001',
    linkageReviewedDate: '2026-08-17',
  },
  reviewedAt: '2026-08-17',
});
assert.equal(arapahoeParcelAttempt.classification, 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(arapahoeParcelAttempt.sourceId, 'SRC-ARAPAHOE-COUNTY-PARCEL-GIS');
assert.equal(arapahoeParcelAttempt.normalized?.source?.declaredActivationPosture, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(arapahoeParcelAttempt.normalized?.source?.claimEligible, false);
assert.equal(arapahoeParcelAttempt.control?.classification, 'INSUFFICIENT_EVIDENCE');
assert.notEqual(arapahoeParcelAttempt.conversionFingerprint, parcelAttempt.conversionFingerprint);

assert.equal(convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  sourceId: 'SRC-BOULDER-COUNTY-PARCEL-GIS',
  sourceClass: 'COUNTY_GIS_ADDRESS_POINTS',
  sourceConfirmation: { sourceId: 'SRC-BOULDER-COUNTY-PARCEL-GIS', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-PARCEL-GIS' }],
}).classification, 'GEOSPATIAL_SOURCE_MISMATCH');
assert.equal(convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  sourceId: 'SRC-BOULDER-COUNTY-PARCEL-GIS',
  sourceClass: 'COUNTY_GIS_PARCEL_GEOMETRY',
  sourceConfirmation: { sourceId: 'SRC-BOULDER-COUNTY-PARCEL-GIS', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-PARCEL-GIS' }],
}).classification, 'GEOSPATIAL_CERTIFICATION_REQUIRED');
assert.equal(convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  sourceId: 'SRC-BCOD-ADDRESS-POINTS',
  sourceClass: 'COUNTY_GIS_PARCEL_GEOMETRY',
}).classification, 'GEOSPATIAL_SOURCE_MISMATCH');

const rawTopLevel = convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  coordinates: [-105, 40],
});
assert.equal(rawTopLevel.classification, 'GEOSPATIAL_RAW_DATA_REJECTED');
const rawReference = convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  evidenceReferences: [{ ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST.evidenceReferences[0]!, GeoJSON: {} }],
});
assert.equal(rawReference.classification, 'GEOSPATIAL_RAW_DATA_REJECTED');

const park = convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST,
  sourceId: 'SRC-BCOD-PARK-BOUNDARIES',
  sourceClass: 'COUNTY_GIS_PARK_BOUNDARIES',
  sourceConfirmation: { sourceId: 'SRC-BCOD-PARK-BOUNDARIES', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{
    ...BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST.evidenceReferences[0]!,
    sourceId: 'SRC-BCOD-PARK-BOUNDARIES',
    evidenceReferenceId: 'GIS-CONVERSION-BCOD-PARK-BOUNDARIES-CERT-001',
  }],
});
assert.equal(park.classification, 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(park.sourceId, 'SRC-BCOD-PARK-BOUNDARIES');
assert.notEqual(park.conversionFingerprint, valid.conversionFingerprint);

const summary = summarizeSourceQuality(valid.normalized);
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
const assemblyRequest = createGeospatialSourceQualityAssemblyRequest(valid);
assert.ok(assemblyRequest);
const assembly = assembleSourceQualitySummaries(assemblyRequest);
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');

assert.equal(GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.addressPointParcelFirewall, 'ADDRESS_POINT_NOT_PARCEL_CONFIRMATION');
assert.equal(GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.parkBoundaryFirewall, 'PARK_BOUNDARY_NOT_PROPERTY_OR_PARCEL_FACT');
assert.equal(GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.parcelOwnershipFirewall, 'PARCEL_GEOMETRY_NOT_OWNERSHIP');
assert.equal(GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.parcelLegalDescriptionFirewall, 'PARCEL_GEOMETRY_NOT_LEGAL_DESCRIPTION');
assert.equal(GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.parcelAssessorFirewall, 'PARCEL_GEOMETRY_NOT_ASSESSOR_RECORD');
assert.equal(GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.parcelTitleFirewall, 'PARCEL_GEOMETRY_NOT_TITLE');
assert.equal(GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.coordinateDisplayAuthority, 'COORDINATE_NOT_CUSTOMER_DISPLAY_AUTHORITY');
assert.equal(GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.gisDatasetUseAuthority, 'GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY');
assert.equal(GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.openDataFallacy, 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY');
assert.equal(GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');

const runtime = await readFile(new URL('../lib/sourceQualityGeospatialEvidenceConversionContract.ts', import.meta.url), 'utf8');
for (const forbidden of ['@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture']) {
  assert.equal(runtime.includes(forbidden), false, 'Contract must not reference ' + forbidden);
}
assert.equal(runtime.includes('normalizeSourceEvidence'), true);
assert.equal(runtime.includes('summarizeSourceQuality'), true);
assert.equal(runtime.includes('SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION'), true);
assert.equal(runtime.includes('gis-public-geospatial-input'), true);
assert.equal(runtime.includes('gis-public-geospatial-conversion'), true);
assert.equal(SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION, 'REIE_SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_V1');

console.log('[source-quality-geospatial-evidence-conversion-contract] ok: exact GIS source references convert through canonical linkage, normalization, control, and assembly with no activation, raw GIS data, network, database, Search, Typesense, CRM, rendering, or display authority.');
