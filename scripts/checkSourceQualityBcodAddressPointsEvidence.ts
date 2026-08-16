import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  BCOD_ADDRESS_POINTS_MANIFEST_ELIGIBILITY,
  BCOD_ADDRESS_POINTS_SOURCE_ID,
  BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CERTIFICATION,
  BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST,
  BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL,
  convertBcodAddressPointsSourceQualityEvidence,
  createBcodAddressPointsSourceQualityAssemblyRequest,
  normalizeBcodAddressPointsSourceQualityEvidence,
  summarizeBcodAddressPointsSourceQualityEvidence,
} from '../lib/sourceQualityBcodAddressPointsEvidence';
import {
  BCOD_PARK_BOUNDARIES_SOURCE_ID,
  COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS,
  convertCountyGeospatialStructuredEvidence,
  type CountyGeospatialSourceQualityConversionSourceClass,
} from '../lib/sourceQualityCountyGeospatialEvidenceConversionContract';
import { convertGeospatialStructuredEvidence } from '../lib/sourceQualityGeospatialEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { getReieSourceRegistry } from '../lib/sourceRegistry';

const conversion = convertBcodAddressPointsSourceQualityEvidence();
const normalized = normalizeBcodAddressPointsSourceQualityEvidence();
const summary = summarizeBcodAddressPointsSourceQualityEvidence();
const assembly = assembleSourceQualitySummaries(createBcodAddressPointsSourceQualityAssemblyRequest());
const registryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === BCOD_ADDRESS_POINTS_SOURCE_ID);

assert.equal(BCOD_ADDRESS_POINTS_SOURCE_ID, 'SRC-BCOD-ADDRESS-POINTS');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, BCOD_ADDRESS_POINTS_SOURCE_ID);
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_GIS_ADDRESS_POINTS');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, BCOD_ADDRESS_POINTS_SOURCE_ID);
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.reviewedAt, BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.repositoryReference, 'docs/project-atlas/executive-library');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.conversionAuthorityClass, 'DELEGATED_COUNTY_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, BCOD_ADDRESS_POINTS_SOURCE_ID);
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.posture, 'REFERENCED');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.verificationStatus, 'VERIFIED');
assert.deepEqual(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.limitationCodes, [
  'RIGHTS_PENDING',
  'TECHNICAL_ACCESS_PENDING',
  'FRESHNESS_DOMAIN_SPECIFIC',
  'ATTRIBUTION_PENDING_CONFIRMATION',
  'PROVENANCE_INCOMPLETE',
]);

assert.ok(registryRecord);
assert.equal(registryRecord?.publicName, 'Boulder County Address Points');
assert.equal(registryRecord?.responsibleOrganization, 'Boulder County Open Data');
assert.equal(registryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(registryRecord?.category, 'BCOD_ADDRESS_POINTS');
assert.equal(registryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(registryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(registryRecord?.claimEligible, false);
assert.equal(registryRecord?.lastSuccessfulDataRefresh, null);
assert.ok(COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS.includes(BCOD_ADDRESS_POINTS_SOURCE_ID));

assert.equal(conversion.classification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, BCOD_ADDRESS_POINTS_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.sourceId, BCOD_ADDRESS_POINTS_SOURCE_ID);
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.authoritativeContractType, 'CERTIFICATION_REFERENCE');
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');
assert.equal(conversion.linkages[0]?.linkageProvenance, 'CERTIFICATION_REFERENCE_ONLY');
assert.match(conversion.inputFingerprint, /^source-quality-fingerprint:gis-public-geospatial-input:v1:sha256:[0-9a-f]{64}$/);
assert.match(conversion.conversionFingerprint, /^source-quality-fingerprint:gis-public-geospatial-conversion:v1:sha256:[0-9a-f]{64}$/);
assert.equal(convertBcodAddressPointsSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertBcodAddressPointsSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);

assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, BCOD_ADDRESS_POINTS_SOURCE_ID);
assert.equal(normalized.source?.declaredActivationPosture, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(normalized.source?.claimEligible, false);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeBcodAddressPointsSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(BCOD_ADDRESS_POINTS_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');

const generic = convertGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST,
  schemaVersion: 'REIE_SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_V1',
  conversionAuthorityClass: 'DELEGATED_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW',
});
assert.equal(generic.classification, 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.deepEqual(generic.linkages, conversion.linkages);
assert.deepEqual(generic.normalized, conversion.normalized);
assert.equal(generic.inputFingerprint, conversion.inputFingerprint);
assert.equal(generic.conversionFingerprint, conversion.conversionFingerprint);

const { sourceConfirmation: _sourceConfirmation, ...requestWithoutConfirmation } = BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST;
assert.equal(convertCountyGeospatialStructuredEvidence(requestWithoutConfirmation).classification, 'COUNTY_GEOSPATIAL_SOURCE_CONFIRMATION_REQUIRED');
const { certificationReference: _certificationReference, ...requestWithoutCertification } = BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST;
assert.equal(convertCountyGeospatialStructuredEvidence(requestWithoutCertification).classification, 'COUNTY_GEOSPATIAL_CERTIFICATION_REQUIRED');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST,
  reviewedAt: 'not-a-date',
}).classification, 'COUNTY_GEOSPATIAL_REFERENCE_INVALID');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST,
  fieldSensitivityPosture: 'UNKNOWN',
}).classification, 'COUNTY_GEOSPATIAL_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST,
  coordinates: [-105, 40],
}).classification, 'COUNTY_GEOSPATIAL_RAW_DATA_REJECTED');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, geometry: {} }],
}).classification, 'COUNTY_GEOSPATIAL_RAW_DATA_REJECTED');
assert.equal(convertVariant(BCOD_PARK_BOUNDARIES_SOURCE_ID, 'COUNTY_GIS_PARK_BOUNDARIES').classification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.notEqual(convertVariant(BCOD_PARK_BOUNDARIES_SOURCE_ID, 'COUNTY_GIS_PARK_BOUNDARIES').conversionFingerprint, conversion.conversionFingerprint);
for (const sourceId of ['SRC-BOULDER-COUNTY-PARCEL-GIS', 'SRC-BOULDER-COUNTY-ASSESSOR', 'SRC-BOULDER-COUNTY-RECORDER-INDEX', 'SRC-BOULDER-COUNTY-TREASURER', 'SRC-BOULDER-COUNTY-ACCELA-PERMITS', 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS', 'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL', 'EXP-SRC-BCOD-ADDRESS-POINTS', 'SRA-BCOD-ADDRESS-POINTS']) {
  assert.notEqual(convertVariant(sourceId, sourceId === 'SRC-BOULDER-COUNTY-PARCEL-GIS' ? 'COUNTY_GIS_PARCEL_GEOMETRY' : 'COUNTY_GIS_ADDRESS_POINTS').classification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID', sourceId + ' must not inherit Address Points evidence');
}

assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.registryAuthorization, 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.retrieval, 'GIS_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.rawGisData, 'RAW_GIS_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.addressPointParcelFirewall, 'ADDRESS_POINT_NOT_PARCEL_CONFIRMATION');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.coordinateDisplayAuthority, 'COORDINATE_NOT_CUSTOMER_DISPLAY_AUTHORITY');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.gisDatasetUseAuthority, 'GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.openDataFallacy, 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.parcelInheritance, 'NO_INHERITANCE_FROM_BOULDER_COUNTY_PARCEL_GIS');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.parkBoundaryInheritance, 'NO_INHERITANCE_FROM_BCOD_PARK_BOUNDARIES');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.assessorInheritance, 'NO_INHERITANCE_FROM_BOULDER_COUNTY_ASSESSOR');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.recorderInheritance, 'NO_INHERITANCE_FROM_BOULDER_COUNTY_RECORDER');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.treasurerInheritance, 'NO_INHERITANCE_FROM_BOULDER_COUNTY_TREASURER');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.permitInheritance, 'NO_INHERITANCE_FROM_PERMIT_SOURCES');

const runtime = await readFile(new URL('../lib/sourceQualityBcodAddressPointsEvidence.ts', import.meta.url), 'utf8');
for (const required of ['convertCountyGeospatialStructuredEvidence', 'normalizeSourceEvidence', 'summarizeSourceQuality', 'createCountyGeospatialSourceQualityAssemblyRequest']) assert.equal(runtime.includes(required), true);
for (const forbidden of ["SRC-BOULDER-COUNTY-PARCEL-GIS'", "SRC-BCOD-PARK-BOUNDARIES'", "SRC-BOULDER-COUNTY-ASSESSOR'", "SRC-BOULDER-COUNTY-RECORDER-INDEX'", "SRC-BOULDER-COUNTY-TREASURER'", "SRC-BOULDER-COUNTY-ACCELA-PERMITS'", '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'coordinates:', 'geometry:', 'GeoJSON', 'owner', 'sourceRecordPayload', 'customerRecord', 'personData']) {
  assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
}

console.log('[source-quality-bcod-address-points-evidence] ok: exact Address Points certification-only metadata reuses canonical County GIS conversion with known gaps, no parcel or source inheritance, no raw GIS data, and no authority grant.');

function convertVariant(sourceId: string, sourceClass: CountyGeospatialSourceQualityConversionSourceClass) {
  return convertCountyGeospatialStructuredEvidence({
    ...BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceClass,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  });
}
