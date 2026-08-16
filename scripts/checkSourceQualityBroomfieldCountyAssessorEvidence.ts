import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  BROOMFIELD_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL,
  convertBroomfieldCountyAssessorSourceQualityEvidence,
  createBroomfieldCountyAssessorSourceQualityAssemblyRequest,
  normalizeBroomfieldCountyAssessorSourceQualityEvidence,
  summarizeBroomfieldCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityBroomfieldCountyAssessorEvidence';
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
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const conversion = convertBroomfieldCountyAssessorSourceQualityEvidence();
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-BROOMFIELD-COUNTY-ASSESSOR');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_ASSESSOR');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.reviewedAt, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.sourceId, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');
assert.equal(conversion.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(conversion.normalized?.rights.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.provenance.posture, 'UNKNOWN');

assert.equal(convertBroomfieldCountyAssessorSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertBroomfieldCountyAssessorSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertBoulderCountyAssessorSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertArapahoeCountyAssessorSourceQualityEvidence().conversionFingerprint);
assert.notEqual(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId, BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId);
assert.notEqual(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId);

const changedReviewedAt = convertCountyStructuredEvidence({
  ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  reviewedAt: '2026-08-17',
  sourceConfirmation: {
    sourceId: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-17',
  },
  certificationReference: {
    ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
    linkageReviewedDate: '2026-08-17',
  },
});
assert.equal(changedReviewedAt.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.notEqual(changedReviewedAt.conversionFingerprint, conversion.conversionFingerprint);

for (const inheritedSourceId of [BOULDER_COUNTY_ASSESSOR_SOURCE_ID, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID] as const) {
  assert.equal(convertCountyStructuredEvidence({
    ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    evidenceReferences: [{ ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: inheritedSourceId }],
  }).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
}
assert.equal(convertCountyStructuredEvidence({ ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, certificationReference: undefined }).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertCountyStructuredEvidence({ ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, sourceClass: 'COUNTY_TREASURER' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
for (const sourceId of [
  'SRC-BOULDER-COUNTY-TREASURER',
  'SRC-BOULDER-COUNTY-RECORDER-INDEX',
  'SRC-BOULDER-COUNTY-PARCEL-GIS',
  'SRC-BROOMFIELD-GIS',
  'SRC-BROOMFIELD-COUNTY-TREASURER',
  'SRC-BROOMFIELD-COUNTY-RECORDER',
  'SRC-BROOMFIELD-COUNTY-PARCEL-GIS',
  'SRC-BROOMFIELD-GOVERNMENT',
  'EXP-SRC-BROOMFIELD-COUNTY-ASSESSOR',
  'SRA-BROOMFIELD-COUNTY-ASSESSOR',
  'SRC-PROVIDER-COUNTY-ASSESSOR',
  'SRC-UNKNOWN-COUNTY-SOURCE',
] as const) {
  assert.notEqual(convertCountyStructuredEvidence({
    ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID', sourceId + ' must not inherit Broomfield Assessor evidence.');
}
for (const rawKey of ['ownerName', 'address', 'mailingAddress', 'parcel', 'parcelId', 'taxpayerName', 'propertyRecord', 'rawRecord', 'narrative', 'pdfText', 'externalArtifact']) {
  assert.equal(convertCountyStructuredEvidence({
    ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    evidenceReferences: [{ ...BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, [rawKey]: 'not composable' }],
  }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
}

const normalized = normalizeBroomfieldCountyAssessorSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeBroomfieldCountyAssessorSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeBroomfieldCountyAssessorSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createBroomfieldCountyAssessorSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.source.sourceId, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');

assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotTitle, 'ASSESSOR_RECORD_NOT_TITLE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotDeedValidity, 'ASSESSOR_RECORD_NOT_DEED_VALIDITY');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotTreasurerTaxStatus, 'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotCurrentOwnershipGuarantee, 'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessedValueNotMarketValue, 'ASSESSED_VALUE_NOT_MARKET_VALUE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSearchAuthority, 'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicAccessAuthority, 'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notTreasurer, 'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notRecorder, 'COUNTY_ASSESSOR_NOT_RECORDER');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notParcelGis, 'COUNTY_ASSESSOR_NOT_PARCEL_GIS');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noBoulderInheritance, 'BOULDER_SOURCE_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_ASSESSOR');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noArapahoeInheritance, 'ARAPAHOE_SOURCE_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_ASSESSOR');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noCityCountyAggregation, 'CONSOLIDATED_CITY_COUNTY_STATUS_NOT_SOURCE_AGGREGATION_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');

const runtime = await readFile(new URL('../lib/sourceQualityBroomfieldCountyAssessorEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-BROOMFIELD-COUNTY-ASSESSOR', 'getReieSourceRegistry', 'sourceRegistry', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'SearchInterface', 'SearchIndex', 'typesense', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'owner', 'address', 'parcel', 'taxpayer', 'propertyRecord', 'rawRecord', 'valuationRows']) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
console.log('[source-quality-broomfield-county-assessor-evidence] ok: exact Broomfield Assessor certification-only metadata reuses canonical county conversion with known gaps, no Boulder or Arapahoe inheritance, no raw property data, and no authority grant.');
