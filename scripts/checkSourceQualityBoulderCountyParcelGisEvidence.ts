import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  BOULDER_COUNTY_PARCEL_GIS_MANIFEST_ELIGIBILITY,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL,
  convertBoulderCountyParcelGisSourceQualityEvidence,
  createBoulderCountyParcelGisSourceQualityAssemblyRequest,
  normalizeBoulderCountyParcelGisSourceQualityEvidence,
  summarizeBoulderCountyParcelGisSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyParcelGisEvidence';
import {
  BCOD_ADDRESS_POINTS_SOURCE_ID,
  BCOD_PARK_BOUNDARIES_SOURCE_ID,
  COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS,
  convertCountyGeospatialStructuredEvidence,
  type CountyGeospatialSourceQualityConversionSourceClass,
} from '../lib/sourceQualityCountyGeospatialEvidenceConversionContract';
import { convertGeospatialStructuredEvidence } from '../lib/sourceQualityGeospatialEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { getReieSourceRegistry } from '../lib/sourceRegistry';

const conversion = convertBoulderCountyParcelGisSourceQualityEvidence();
const normalized = normalizeBoulderCountyParcelGisSourceQualityEvidence();
const summary = summarizeBoulderCountyParcelGisSourceQualityEvidence();
const assembly = assembleSourceQualitySummaries(createBoulderCountyParcelGisSourceQualityAssemblyRequest());
const registryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID);

assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID, 'SRC-BOULDER-COUNTY-PARCEL-GIS');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_GIS_PARCEL_GEOMETRY');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.reviewedAt, BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.repositoryReference, 'docs/project-atlas/executive-library');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.conversionAuthorityClass, 'DELEGATED_COUNTY_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.posture, 'REFERENCED');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.verificationStatus, 'VERIFIED');
assert.deepEqual(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.limitationCodes, [
  'RIGHTS_PENDING',
  'TECHNICAL_ACCESS_PENDING',
  'FRESHNESS_DOMAIN_SPECIFIC',
  'ATTRIBUTION_PENDING_CONFIRMATION',
  'PROVENANCE_INCOMPLETE',
]);

assert.ok(registryRecord);
assert.equal(registryRecord?.publicName, 'Boulder County GIS Parcel Boundaries / Parcels');
assert.equal(registryRecord?.responsibleOrganization, "Boulder County Assessor's Office");
assert.equal(registryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(registryRecord?.category, 'PARCEL_GEOMETRY');
assert.equal(registryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(registryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(registryRecord?.claimEligible, false);
assert.equal(registryRecord?.lastSuccessfulDataRefresh, null);
assert.ok(COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS.includes(BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID));

assert.equal(conversion.classification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.sourceId, BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.authoritativeContractType, 'CERTIFICATION_REFERENCE');
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');
assert.equal(conversion.linkages[0]?.linkageProvenance, 'CERTIFICATION_REFERENCE_ONLY');
assert.match(conversion.inputFingerprint, /^source-quality-fingerprint:gis-public-geospatial-input:v1:sha256:[0-9a-f]{64}$/);
assert.match(conversion.conversionFingerprint, /^source-quality-fingerprint:gis-public-geospatial-conversion:v1:sha256:[0-9a-f]{64}$/);
assert.equal(convertBoulderCountyParcelGisSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertBoulderCountyParcelGisSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);

assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(normalized.source?.declaredActivationPosture, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(normalized.source?.claimEligible, false);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeBoulderCountyParcelGisSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');

const generic = convertGeospatialStructuredEvidence({
  ...BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST,
  schemaVersion: 'REIE_SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_V1',
  conversionAuthorityClass: 'DELEGATED_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW',
});
assert.equal(generic.classification, 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.deepEqual(generic.linkages, conversion.linkages);
assert.deepEqual(generic.normalized, conversion.normalized);
assert.equal(generic.inputFingerprint, conversion.inputFingerprint);
assert.equal(generic.conversionFingerprint, conversion.conversionFingerprint);

const { sourceConfirmation: _sourceConfirmation, ...requestWithoutConfirmation } = BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST;
assert.equal(convertCountyGeospatialStructuredEvidence(requestWithoutConfirmation).classification, 'COUNTY_GEOSPATIAL_SOURCE_CONFIRMATION_REQUIRED');
const { certificationReference: _certificationReference, ...requestWithoutCertification } = BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST;
assert.equal(convertCountyGeospatialStructuredEvidence(requestWithoutCertification).classification, 'COUNTY_GEOSPATIAL_CERTIFICATION_REQUIRED');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST,
  reviewedAt: 'not-a-date',
}).classification, 'COUNTY_GEOSPATIAL_REFERENCE_INVALID');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST,
  fieldSensitivityPosture: 'UNKNOWN',
}).classification, 'COUNTY_GEOSPATIAL_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST,
  geometry: {},
}).classification, 'COUNTY_GEOSPATIAL_RAW_DATA_REJECTED');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, parcelId: 'not allowed' }],
}).classification, 'COUNTY_GEOSPATIAL_RAW_DATA_REJECTED');

assert.equal(convertVariant(BCOD_ADDRESS_POINTS_SOURCE_ID, 'COUNTY_GIS_ADDRESS_POINTS').classification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(convertVariant(BCOD_PARK_BOUNDARIES_SOURCE_ID, 'COUNTY_GIS_PARK_BOUNDARIES').classification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.notEqual(convertVariant(BCOD_ADDRESS_POINTS_SOURCE_ID, 'COUNTY_GIS_ADDRESS_POINTS').conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(convertVariant(BCOD_PARK_BOUNDARIES_SOURCE_ID, 'COUNTY_GIS_PARK_BOUNDARIES').conversionFingerprint, conversion.conversionFingerprint);
for (const sourceId of ['SRC-BOULDER-COUNTY-ASSESSOR', 'SRC-BOULDER-COUNTY-RECORDER-INDEX', 'SRC-BOULDER-COUNTY-TREASURER', 'SRC-BOULDER-COUNTY-ACCELA-PERMITS', 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS', 'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL', 'EXP-SRC-BOULDER-COUNTY-PARCEL-GIS', 'SRA-BOULDER-COUNTY-PARCEL-GIS']) {
  assert.notEqual(convertVariant(sourceId, 'COUNTY_GIS_PARCEL_GEOMETRY').classification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID', sourceId + ' must not inherit Parcel GIS evidence');
}

assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.registryAuthorization, 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.retrieval, 'GIS_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.rawGisData, 'RAW_GIS_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.parcelOwnershipFirewall, 'PARCEL_GEOMETRY_NOT_OWNERSHIP');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.parcelLegalDescriptionFirewall, 'PARCEL_GEOMETRY_NOT_LEGAL_DESCRIPTION');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.parcelAssessorFirewall, 'PARCEL_GEOMETRY_NOT_ASSESSOR_RECORD');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.parcelTitleFirewall, 'PARCEL_GEOMETRY_NOT_TITLE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.gisDatasetUseAuthority, 'GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.openDataFallacy, 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.addressPointsInheritance, 'NO_INHERITANCE_FROM_ADDRESS_POINTS');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.parkBoundaryInheritance, 'NO_INHERITANCE_FROM_PARK_BOUNDARIES');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.assessorInheritance, 'NO_INHERITANCE_FROM_BOULDER_COUNTY_ASSESSOR');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.recorderInheritance, 'NO_INHERITANCE_FROM_BOULDER_COUNTY_RECORDER');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.treasurerInheritance, 'NO_INHERITANCE_FROM_BOULDER_COUNTY_TREASURER');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.permitInheritance, 'NO_INHERITANCE_FROM_PERMIT_SOURCES');

const runtime = await readFile(new URL('../lib/sourceQualityBoulderCountyParcelGisEvidence.ts', import.meta.url), 'utf8');
for (const required of ['convertCountyGeospatialStructuredEvidence', 'normalizeSourceEvidence', 'summarizeSourceQuality', 'createCountyGeospatialSourceQualityAssemblyRequest']) assert.equal(runtime.includes(required), true);
for (const forbidden of ["SRC-BCOD-ADDRESS-POINTS'", "SRC-BCOD-PARK-BOUNDARIES'", "SRC-BOULDER-COUNTY-ASSESSOR'", "SRC-BOULDER-COUNTY-RECORDER-INDEX'", "SRC-BOULDER-COUNTY-TREASURER'", "SRC-BOULDER-COUNTY-ACCELA-PERMITS'", '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'coordinates:', 'geometry:', 'GeoJSON', 'owner', 'sourceRecordPayload', 'customerRecord', 'personData']) {
  assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
}

console.log('[source-quality-boulder-county-parcel-gis-evidence] ok: exact Parcel GIS certification-only metadata reuses canonical County GIS conversion with known gaps, no source inheritance, no raw GIS data, and no authority grant.');

function convertVariant(sourceId: string, sourceClass: CountyGeospatialSourceQualityConversionSourceClass) {
  return convertCountyGeospatialStructuredEvidence({
    ...BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceClass,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  });
}
