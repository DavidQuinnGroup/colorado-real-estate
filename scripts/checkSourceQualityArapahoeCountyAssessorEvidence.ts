import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  ARAPAHOE_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL,
  convertArapahoeCountyAssessorSourceQualityEvidence,
  createArapahoeCountyAssessorSourceQualityAssemblyRequest,
  normalizeArapahoeCountyAssessorSourceQualityEvidence,
  summarizeArapahoeCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityArapahoeCountyAssessorEvidence';
import {
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  convertBoulderCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyAssessorEvidence';
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const conversion = convertArapahoeCountyAssessorSourceQualityEvidence();
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-ARAPAHOE-COUNTY-ASSESSOR');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_ASSESSOR');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.reviewedAt, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.sourceId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');
assert.equal(conversion.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(conversion.normalized?.rights.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.provenance.posture, 'UNKNOWN');

assert.equal(convertArapahoeCountyAssessorSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertArapahoeCountyAssessorSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertBoulderCountyAssessorSourceQualityEvidence().conversionFingerprint);
assert.notEqual(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId, BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId);
assert.notEqual(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt);
assert.notEqual(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture);

const changedReviewedAt = convertCountyStructuredEvidence({
  ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  reviewedAt: '2026-08-17',
  sourceConfirmation: {
    sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-17',
  },
  certificationReference: {
    ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
    linkageReviewedDate: '2026-08-17',
  },
});
assert.equal(changedReviewedAt.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.notEqual(changedReviewedAt.conversionFingerprint, conversion.conversionFingerprint);

assert.equal(convertCountyStructuredEvidence({
  ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID }],
}).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, certificationReference: undefined }).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST, sourceClass: 'COUNTY_TREASURER' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
for (const sourceId of [
  'SRC-BOULDER-COUNTY-TREASURER',
  'SRC-BOULDER-COUNTY-RECORDER-INDEX',
  'SRC-BOULDER-COUNTY-PARCEL-GIS',
  'SRC-ARAPAHOE-PARCEL-SEARCH',
  'SRC-ARAPAHOE-ASSESSOR-DATA-MART',
  'SRC-ARAPAHOE-GIS',
  'EXP-SRC-ARAPAHOE-COUNTY-ASSESSOR',
  'SRA-ARAPAHOE-COUNTY-ASSESSOR',
  'SRC-PROVIDER-COUNTY-ASSESSOR',
  'SRC-UNKNOWN-COUNTY-SOURCE',
] as const) {
  assert.notEqual(convertCountyStructuredEvidence({
    ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID', sourceId + ' must not inherit Arapahoe Assessor evidence.');
}
for (const rawKey of ['ownerName', 'address', 'mailingAddress', 'parcel', 'parcelId', 'taxpayerName', 'propertyRecord', 'rawRecord', 'narrative', 'pdfText', 'externalArtifact']) {
  assert.equal(convertCountyStructuredEvidence({
    ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    evidenceReferences: [{ ...ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, [rawKey]: 'not composable' }],
  }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
}

const normalized = normalizeArapahoeCountyAssessorSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeArapahoeCountyAssessorSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeArapahoeCountyAssessorSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createArapahoeCountyAssessorSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.source.sourceId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');

assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotTitle, 'ASSESSOR_RECORD_NOT_TITLE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotDeedValidity, 'ASSESSOR_RECORD_NOT_DEED_VALIDITY');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotTreasurerTaxStatus, 'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessorRecordNotCurrentOwnershipGuarantee, 'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.assessedValueNotMarketValue, 'ASSESSED_VALUE_NOT_MARKET_VALUE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSearchAuthority, 'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicAccessAuthority, 'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notTreasurer, 'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notRecorder, 'COUNTY_ASSESSOR_NOT_RECORDER');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notParcelGis, 'COUNTY_ASSESSOR_NOT_PARCEL_GIS');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noBoulderInheritance, 'BOULDER_SOURCE_FINDINGS_NOT_INHERITED_BY_ARAPAHOE_ASSESSOR');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');

const runtime = await readFile(new URL('../lib/sourceQualityArapahoeCountyAssessorEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-ARAPAHOE-COUNTY-ASSESSOR', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'SearchInterface', 'SearchIndex', 'typesense', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'owner', 'address', 'parcel', 'taxpayer', 'propertyRecord', 'rawRecord']) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
console.log('[source-quality-arapahoe-county-assessor-evidence] ok: exact Arapahoe Assessor certification-only metadata reuses canonical county conversion with known gaps, no Boulder inheritance, no raw property data, and no authority grant.');
