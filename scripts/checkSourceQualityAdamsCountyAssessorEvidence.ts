import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  ADAMS_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY,
  ADAMS_COUNTY_ASSESSOR_SOURCE_ID,
  ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL,
  convertAdamsCountyAssessorSourceQualityEvidence,
  createAdamsCountyAssessorSourceQualityAssemblyRequest,
  normalizeAdamsCountyAssessorSourceQualityEvidence,
  summarizeAdamsCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityAdamsCountyAssessorEvidence';
import {
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  convertArapahoeCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityArapahoeCountyAssessorEvidence';
import {
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  convertBoulderCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyAssessorEvidence';
import {
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  convertBroomfieldCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityBroomfieldCountyAssessorEvidence';
import {
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  convertJeffersonCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityJeffersonCountyAssessorEvidence';
import {
  LARIMER_COUNTY_ASSESSOR_SOURCE_ID,
  LARIMER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  convertLarimerCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityLarimerCountyAssessorEvidence';
import {
  WELD_COUNTY_ASSESSOR_SOURCE_ID,
  WELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  convertWeldCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityWeldCountyAssessorEvidence';
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const conversion = convertAdamsCountyAssessorSourceQualityEvidence();
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-ADAMS-COUNTY-ASSESSOR');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, ADAMS_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_ASSESSOR');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, ADAMS_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.reviewedAt, ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, ADAMS_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, ADAMS_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.sourceId, ADAMS_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');
assert.equal(conversion.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(conversion.normalized?.rights.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.provenance.posture, 'UNKNOWN');

assert.equal(convertAdamsCountyAssessorSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertAdamsCountyAssessorSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);
for (const priorConversion of [
  convertBoulderCountyAssessorSourceQualityEvidence(),
  convertArapahoeCountyAssessorSourceQualityEvidence(),
  convertBroomfieldCountyAssessorSourceQualityEvidence(),
  convertJeffersonCountyAssessorSourceQualityEvidence(),
  convertLarimerCountyAssessorSourceQualityEvidence(),
  convertWeldCountyAssessorSourceQualityEvidence(),
] as const) {
  assert.notEqual(conversion.inputFingerprint, priorConversion.inputFingerprint);
  assert.notEqual(conversion.conversionFingerprint, priorConversion.conversionFingerprint);
}
for (const certificationId of [
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId,
  LARIMER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId,
  WELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId,
] as const) {
  assert.notEqual(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId, certificationId);
}

const changedReviewedAt = convertCountyStructuredEvidence({
  ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  reviewedAt: '2026-08-17',
  sourceConfirmation: {
    sourceId: ADAMS_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-17',
  },
  certificationReference: {
    ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
    linkageReviewedDate: '2026-08-17',
  },
});
assert.equal(changedReviewedAt.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.notEqual(changedReviewedAt.conversionFingerprint, conversion.conversionFingerprint);

for (const inheritedSourceId of [
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
  LARIMER_COUNTY_ASSESSOR_SOURCE_ID,
  WELD_COUNTY_ASSESSOR_SOURCE_ID,
] as const) {
  assert.equal(convertCountyStructuredEvidence({
    ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    evidenceReferences: [{ ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: inheritedSourceId }],
  }).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
}
assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, certificationReference: undefined }).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, sourceClass: 'COUNTY_TREASURER' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
for (const sourceId of [
  'SRC-ADAMS-PROPERTY-PORTAL',
  'SRC-ADAMS-GIS-INTERACTIVE-MAPS',
  'SRC-ADAMS-DOWNLOADABLE-GIS-DATA',
  'SRC-ADAMS-ASSESSOR-DATA-DUMP',
  'SRC-ADAMS-COUNTY-TREASURER',
  'SRC-ADAMS-PUBLIC-TRUSTEE',
  'SRC-ADAMS-COUNTY-RECORDER',
  'SRC-ADAMS-PLANNING-DEVELOPMENT',
  'SRC-ADAMS-PERMITS-LICENSING',
  'SRC-ADAMS-COUNTY-PARCEL-GIS',
  'EXP-SRC-ADAMS-COUNTY-ASSESSOR',
  'SRA-ADAMS-COUNTY-ASSESSOR',
  'SRC-PROVIDER-COUNTY-ASSESSOR',
  'SRC-UNKNOWN-COUNTY-SOURCE',
] as const) {
  assert.notEqual(convertCountyStructuredEvidence({
    ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID', sourceId + ' must not inherit Adams Assessor evidence.');
}
for (const rawKey of ['ownerName', 'address', 'mailingAddress', 'parcel', 'parcelId', 'taxpayerName', 'propertyRecord', 'rawRecord', 'narrative', 'pdfText', 'externalArtifact']) {
  assert.equal(convertCountyStructuredEvidence({
    ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    evidenceReferences: [{ ...ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, [rawKey]: 'not composable' }],
  }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
}

const normalized = normalizeAdamsCountyAssessorSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, ADAMS_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeAdamsCountyAssessorSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeAdamsCountyAssessorSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createAdamsCountyAssessorSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.source.sourceId, ADAMS_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(ADAMS_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');

assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotTitle, 'ASSESSOR_RECORD_NOT_TITLE');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotDeedValidity, 'ASSESSOR_RECORD_NOT_DEED_VALIDITY');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotTreasurerTaxStatus, 'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotCurrentOwnershipGuarantee, 'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessedValueNotMarketValue, 'ASSESSED_VALUE_NOT_MARKET_VALUE');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSearchAuthority, 'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicAccessAuthority, 'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.propertyPortal, 'PROPERTY_PORTAL_NOT_AUTOMATION_AUTHORITY');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorGis, 'ASSESSOR_GIS_NOT_ASSESSOR_RECORD_AUTHORITY');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorDataDump, 'ASSESSOR_DATA_DUMP_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.downloadableGisData, 'DOWNLOADABLE_GIS_DATA_NOT_UNRESTRICTED_OR_REUSE_READY');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notTreasurer, 'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notPublicTrustee, 'COUNTY_ASSESSOR_NOT_PUBLIC_TRUSTEE');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notRecorder, 'COUNTY_ASSESSOR_NOT_RECORDER');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notPlanningOrZoning, 'COUNTY_ASSESSOR_NOT_PLANNING_OR_ZONING');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notPermits, 'COUNTY_ASSESSOR_NOT_PERMITS');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notParcelGis, 'COUNTY_ASSESSOR_NOT_PARCEL_GIS');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noBoulderInheritance, 'BOULDER_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noArapahoeInheritance, 'ARAPAHOE_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noBroomfieldInheritance, 'BROOMFIELD_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noJeffersonInheritance, 'JEFFERSON_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noLarimerInheritance, 'LARIMER_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noWeldInheritance, 'WELD_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_COUNTY_PROPERTY_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const runtime = await readFile(new URL('../lib/sourceQualityAdamsCountyAssessorEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-ADAMS-COUNTY-ASSESSOR', 'getReieSourceRegistry', 'sourceRegistry', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'SearchInterface', 'SearchIndex', 'typesense', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'owner', 'address', 'parcelId', 'taxpayer', 'propertyRecord', 'rawRecord', 'valuationRows']) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
console.log('[source-quality-adams-county-assessor-evidence] ok: exact Adams Assessor certification-only metadata reuses canonical county conversion with known gaps, no cross-county inheritance, no Property Portal/GIS/Data Dump/Downloadable GIS authority, no raw property data, and no authority grant.');
