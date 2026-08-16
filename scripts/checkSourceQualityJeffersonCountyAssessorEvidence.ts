import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  JEFFERSON_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL,
  convertJeffersonCountyAssessorSourceQualityEvidence,
  createJeffersonCountyAssessorSourceQualityAssemblyRequest,
  normalizeJeffersonCountyAssessorSourceQualityEvidence,
  summarizeJeffersonCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityJeffersonCountyAssessorEvidence';
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
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const conversion = convertJeffersonCountyAssessorSourceQualityEvidence();
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-JEFFERSON-COUNTY-ASSESSOR');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_ASSESSOR');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.reviewedAt, JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.sourceId, JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');
assert.equal(conversion.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(conversion.normalized?.rights.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.provenance.posture, 'UNKNOWN');

assert.equal(convertJeffersonCountyAssessorSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertJeffersonCountyAssessorSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertBoulderCountyAssessorSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertArapahoeCountyAssessorSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertBroomfieldCountyAssessorSourceQualityEvidence().conversionFingerprint);
assert.notEqual(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId, BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId);
assert.notEqual(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId);
assert.notEqual(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId);

const changedReviewedAt = convertCountyStructuredEvidence({
  ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  reviewedAt: '2026-08-17',
  sourceConfirmation: {
    sourceId: JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-17',
  },
  certificationReference: {
    ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
    linkageReviewedDate: '2026-08-17',
  },
});
assert.equal(changedReviewedAt.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.notEqual(changedReviewedAt.conversionFingerprint, conversion.conversionFingerprint);

for (const inheritedSourceId of [BOULDER_COUNTY_ASSESSOR_SOURCE_ID, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID] as const) {
  assert.equal(convertCountyStructuredEvidence({
    ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    evidenceReferences: [{ ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: inheritedSourceId }],
  }).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
}
assert.equal(convertCountyStructuredEvidence({ ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, certificationReference: undefined }).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertCountyStructuredEvidence({ ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, sourceClass: 'COUNTY_TREASURER' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
for (const sourceId of [
  'SRC-BOULDER-COUNTY-TREASURER',
  'SRC-BOULDER-COUNTY-RECORDER-INDEX',
  'SRC-BOULDER-COUNTY-PARCEL-GIS',
  'SRC-JEFFERSON-ASPIN',
  'SRC-JEFFERSON-GIS',
  'SRC-JEFFERSON-COUNTY-TREASURER',
  'SRC-JEFFERSON-COUNTY-RECORDER',
  'SRC-JEFFERSON-COUNTY-PARCEL-GIS',
  'SRC-JEFFERSON-GOVERNMENT',
  'EXP-SRC-JEFFERSON-COUNTY-ASSESSOR',
  'SRA-JEFFERSON-COUNTY-ASSESSOR',
  'SRC-PROVIDER-COUNTY-ASSESSOR',
  'SRC-UNKNOWN-COUNTY-SOURCE',
] as const) {
  assert.notEqual(convertCountyStructuredEvidence({
    ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID', sourceId + ' must not inherit Jefferson Assessor evidence.');
}
for (const rawKey of ['ownerName', 'address', 'mailingAddress', 'parcel', 'parcelId', 'taxpayerName', 'propertyRecord', 'rawRecord', 'narrative', 'pdfText', 'externalArtifact']) {
  assert.equal(convertCountyStructuredEvidence({
    ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    evidenceReferences: [{ ...JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, [rawKey]: 'not composable' }],
  }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
}

const normalized = normalizeJeffersonCountyAssessorSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeJeffersonCountyAssessorSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeJeffersonCountyAssessorSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createJeffersonCountyAssessorSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.source.sourceId, JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');

assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotTitle, 'ASSESSOR_RECORD_NOT_TITLE');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotDeedValidity, 'ASSESSOR_RECORD_NOT_DEED_VALIDITY');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotTreasurerTaxStatus, 'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotCurrentOwnershipGuarantee, 'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessedValueNotMarketValue, 'ASSESSED_VALUE_NOT_MARKET_VALUE');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSearchAuthority, 'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicAccessAuthority, 'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notTreasurer, 'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notRecorder, 'COUNTY_ASSESSOR_NOT_RECORDER');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notParcelGis, 'COUNTY_ASSESSOR_NOT_PARCEL_GIS');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noBoulderInheritance, 'BOULDER_SOURCE_FINDINGS_NOT_INHERITED_BY_JEFFERSON_ASSESSOR');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noArapahoeInheritance, 'ARAPAHOE_SOURCE_FINDINGS_NOT_INHERITED_BY_JEFFERSON_ASSESSOR');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noBroomfieldInheritance, 'BROOMFIELD_SOURCE_FINDINGS_NOT_INHERITED_BY_JEFFERSON_ASSESSOR');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noAspinOrGis, 'ASPIN_OR_GIS_NOT_ASSESSOR_SOURCE_AUTHORITY');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');

const runtime = await readFile(new URL('../lib/sourceQualityJeffersonCountyAssessorEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-JEFFERSON-COUNTY-ASSESSOR', 'getReieSourceRegistry', 'sourceRegistry', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'SearchInterface', 'SearchIndex', 'typesense', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'owner', 'address', 'parcel', 'taxpayer', 'propertyRecord', 'rawRecord', 'valuationRows']) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
console.log('[source-quality-jefferson-county-assessor-evidence] ok: exact Jefferson Assessor certification-only metadata reuses canonical county conversion with known gaps, no Boulder, Arapahoe, or Broomfield inheritance, no raw property data, and no authority grant.');
