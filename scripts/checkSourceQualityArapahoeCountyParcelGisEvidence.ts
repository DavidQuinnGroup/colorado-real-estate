import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  ARAPAHOE_COUNTY_PARCEL_GIS_MANIFEST_ELIGIBILITY,
  ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID,
  ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CERTIFICATION,
  ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST,
  ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL,
  convertArapahoeCountyParcelGisSourceQualityEvidence,
  createArapahoeCountyParcelGisSourceQualityAssemblyRequest,
  normalizeArapahoeCountyParcelGisSourceQualityEvidence,
  summarizeArapahoeCountyParcelGisSourceQualityEvidence,
} from '../lib/sourceQualityArapahoeCountyParcelGisEvidence';
import {
  ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID as COUNTY_ARAPAHOE_PARCEL_GIS_SOURCE_ID,
  COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS,
  convertCountyGeospatialStructuredEvidence,
} from '../lib/sourceQualityCountyGeospatialEvidenceConversionContract';
import { convertGeospatialStructuredEvidence } from '../lib/sourceQualityGeospatialEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { getReieSourceRegistry } from '../lib/sourceRegistry';

const conversion = convertArapahoeCountyParcelGisSourceQualityEvidence();
const normalized = normalizeArapahoeCountyParcelGisSourceQualityEvidence();
const summary = summarizeArapahoeCountyParcelGisSourceQualityEvidence();
const assembly = assembleSourceQualitySummaries(createArapahoeCountyParcelGisSourceQualityAssemblyRequest());
const registryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID);

assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID, 'SRC-ARAPAHOE-COUNTY-PARCEL-GIS');
assert.equal(COUNTY_ARAPAHOE_PARCEL_GIS_SOURCE_ID, ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_GIS_PARCEL_GEOMETRY');
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.evidenceReferenceId, 'SQE-ARAPAHOE-COUNTY-PARCEL-GIS-CERT-001');
assert.deepEqual(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.limitationCodes, [
  'RIGHTS_PENDING',
  'TECHNICAL_ACCESS_PENDING',
  'FRESHNESS_DOMAIN_SPECIFIC',
  'ATTRIBUTION_PENDING_CONFIRMATION',
  'PROVENANCE_INCOMPLETE',
]);

assert.ok(registryRecord);
assert.equal(registryRecord?.publicName, 'Arapahoe County Parcels');
assert.equal(registryRecord?.responsibleOrganization, 'Arapahoe County Mapping / GIS');
assert.equal(registryRecord?.officialUrl, null);
assert.equal(registryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(registryRecord?.category, 'PARCEL_GEOMETRY');
assert.equal(registryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(registryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(registryRecord?.claimEligible, false);
assert.equal(registryRecord?.lastSuccessfulDataRefresh, null);
assert.ok(COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS.includes(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID));

const registryText = JSON.stringify(registryRecord);
for (const required of [
  'PARCEL_GEOMETRY_NOT_OWNERSHIP',
  'PARCEL_GEOMETRY_NOT_LEGAL_DESCRIPTION',
  'PARCEL_GEOMETRY_NOT_ASSESSOR_RECORD',
  'PARCEL_GEOMETRY_NOT_TITLE',
  'ARAPAHOE_PARCELS_NOT_ASSESSOR_PARCELS',
  'ASSESSOR_PARCELS_DERIVED_ENRICHED_LAYER_NOT_BASE_GEOMETRY_AUTHORITY',
  'AUMENTUM_DATAMART_NOT_PARCEL_GEOMETRY_AUTHORITY',
  'ARAPAMAP_NOT_PARCEL_SOURCE_IDENTITY',
  'ADDRESS_PARCEL_INFO_NOT_PARCEL_SOURCE_IDENTITY',
  'TAX_MAPS_DERIVATIVE_NOT_BASE_PARCEL_SOURCE',
]) assert.match(registryText, new RegExp(required));
assert.doesNotMatch(registryText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|PROVENANCE = COMPLETE/);

assert.equal(conversion.classification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.sourceId, ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.linkageProvenance, 'CERTIFICATION_REFERENCE_ONLY');
assert.match(conversion.inputFingerprint, /^source-quality-fingerprint:gis-public-geospatial-input:v1:sha256:[0-9a-f]{64}$/);
assert.match(conversion.conversionFingerprint, /^source-quality-fingerprint:gis-public-geospatial-conversion:v1:sha256:[0-9a-f]{64}$/);
assert.equal(convertArapahoeCountyParcelGisSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);

assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(normalized.source?.declaredActivationPosture, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(normalized.source?.claimEligible, false);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');

const generic = convertGeospatialStructuredEvidence({
  ...ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST,
  schemaVersion: 'REIE_SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_V1',
  conversionAuthorityClass: 'DELEGATED_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW',
});
assert.equal(generic.classification, 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID');
assert.equal(generic.sourceId, ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(generic.conversionFingerprint, conversion.conversionFingerprint);

const { sourceConfirmation: _sourceConfirmation, ...withoutConfirmation } = ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST;
assert.equal(convertCountyGeospatialStructuredEvidence(withoutConfirmation).classification, 'COUNTY_GEOSPATIAL_SOURCE_CONFIRMATION_REQUIRED');
const { certificationReference: _certificationReference, ...withoutCertification } = ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST;
assert.equal(convertCountyGeospatialStructuredEvidence(withoutCertification).classification, 'COUNTY_GEOSPATIAL_CERTIFICATION_REQUIRED');
assert.equal(convertCountyGeospatialStructuredEvidence({ ...ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST, geometry: {} }).classification, 'COUNTY_GEOSPATIAL_RAW_DATA_REJECTED');
assert.equal(convertCountyGeospatialStructuredEvidence({
  ...ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, parcelId: 'not allowed' }],
}).classification, 'COUNTY_GEOSPATIAL_RAW_DATA_REJECTED');

for (const sourceId of ['SRC-ARAPAHOE-COUNTY-ASSESSOR', 'SRC-ARAPAHOE-COUNTY-TREASURER', 'EXP-SRC-ARAPAHOE-COUNTY-PARCEL-GIS', 'SRA-ARAPAHOE-COUNTY-PARCEL-GIS', 'SRC-PROVIDER-ARAPAHOE-PARCEL-GIS']) {
  assert.notEqual(convertCountyGeospatialStructuredEvidence({
    ...ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID', sourceId + ' must not inherit Arapahoe Parcel GIS evidence');
}

const sourceQualityRuntime = await readFile(new URL('../lib/sourceQualityArapahoeCountyParcelGisEvidence.ts', import.meta.url), 'utf8');
for (const required of ['convertCountyGeospatialStructuredEvidence', 'normalizeSourceEvidence', 'summarizeSourceQuality', 'createCountyGeospatialSourceQualityAssemblyRequest', 'ASSESSOR_PARCELS_DERIVED_ENRICHED_LAYER_NOT_BASE_GEOMETRY_AUTHORITY']) assert.equal(sourceQualityRuntime.includes(required), true);
for (const forbidden of ['getReieSourceRegistry', 'sourceRegistry', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'coordinates:', 'geometry:', 'GeoJSON', 'owner', 'sourceRecordPayload', 'customerRecord', 'personData']) {
  assert.equal(sourceQualityRuntime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
}

const manifestData = await readFile(new URL('../lib/sourceQualityOperationalManifestData.ts', import.meta.url), 'utf8');
assert.equal(manifestData.includes('ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID'), true, 'Arapahoe Parcel GIS must be explicitly wired into Manifest data after structural gates pass.');
assert.equal(manifestData.includes('convertArapahoeCountyParcelGisSourceQualityEvidence'), true);

assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.baseParcelsAuthority, 'PARCELS_BASE_GEOMETRY_CADASTRAL_AUTHORITY');
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.assessorParcelsFirewall, 'ASSESSOR_PARCELS_DERIVED_ENRICHED_LAYER_NOT_BASE_GEOMETRY_AUTHORITY');
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.aumentumDataMartFirewall, 'AUMENTUM_DATAMART_NOT_PARCEL_GEOMETRY_AUTHORITY');
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.arapaMapFirewall, 'ARAPAMAP_NOT_PARCEL_SOURCE_IDENTITY');
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.addressParcelInfoFirewall, 'ADDRESS_PARCEL_INFO_NOT_PARCEL_SOURCE_IDENTITY');
assert.equal(ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.taxMapsFirewall, 'TAX_MAPS_DERIVATIVE_NOT_BASE_PARCEL_SOURCE');

console.log('[source-quality-arapahoe-county-parcel-gis-evidence] ok: exact base Parcels identity delegates to canonical County GIS conversion with certification-only metadata, explicit derived-layer firewalls, bounded Manifest inclusion, no raw GIS, and no authority grant.');
