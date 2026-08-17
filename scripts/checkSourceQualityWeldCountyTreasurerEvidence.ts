import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  WELD_COUNTY_TREASURER_MANIFEST_ELIGIBILITY,
  WELD_COUNTY_TREASURER_SOURCE_ID,
  WELD_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  WELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL,
  convertWeldCountyTreasurerSourceQualityEvidence,
  createWeldCountyTreasurerSourceQualityAssemblyRequest,
  normalizeWeldCountyTreasurerSourceQualityEvidence,
  summarizeWeldCountyTreasurerSourceQualityEvidence,
} from '../lib/sourceQualityWeldCountyTreasurerEvidence';
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { convertPublicRecordStructuredEvidence } from '../lib/sourceQualityPublicRecordEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { convertBoulderCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityBoulderCountyTreasurerEvidence';
import { convertArapahoeCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityArapahoeCountyTreasurerEvidence';
import { convertAdamsCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityAdamsCountyTreasurerEvidence';
import { convertJeffersonCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityJeffersonCountyTreasurerEvidence';
import { WELD_COUNTY_ASSESSOR_SOURCE_ID } from '../lib/sourceQualityCountyAssessorExactSourceDefinitions';

const conversion = convertWeldCountyTreasurerSourceQualityEvidence();
assert.equal(WELD_COUNTY_TREASURER_SOURCE_ID, 'SRC-WELD-COUNTY-TREASURER');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, WELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_TREASURER');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, WELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.reviewedAt, WELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, WELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, WELD_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, WELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, WELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.sourceId, WELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');
assert.equal(conversion.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(conversion.normalized?.rights.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(conversion.normalized?.provenance.posture, 'UNKNOWN');

const publicRecordConversion = convertPublicRecordStructuredEvidence({
  ...WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1',
});
assert.equal(publicRecordConversion.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(publicRecordConversion.sourceId, WELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(publicRecordConversion.linkages[0]?.relationshipType, 'CERTIFICATION');

assert.equal(convertWeldCountyTreasurerSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertWeldCountyTreasurerSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertBoulderCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertArapahoeCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertAdamsCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertJeffersonCountyTreasurerSourceQualityEvidence().conversionFingerprint);

for (const sourceId of [
  'SRC-BROOMFIELD-COUNTY-TREASURER',
  'SRC-SYNTHETIC-COUNTY-TREASURER',
  'SRC-UNREGISTERED-COUNTY-TREASURER',
  'SRC-FAKE-COUNTY-TREASURER',
  'SRC-GENERIC-COUNTY-TREASURER',
  'SRC-PROVIDER-COUNTY-TREASURER',
  'EXP-SRC-WELD-COUNTY-TREASURER',
  'SRA-WELD-COUNTY-TREASURER',
  'SRC-WELD-COUNTY-PUBLIC-TRUSTEE',
  'SRC-WELD-COUNTY-RECORDER',
  'SRC-WELD-COUNTY-GIS',
  'SRC-WELD-COUNTY-PARCEL-GIS',
]) {
  const request = {
    ...WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: WELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  } as const;
  assert.equal(convertCountyStructuredEvidence(request).classification, 'COUNTY_SOURCE_INVALID');
}

assert.equal(convertCountyStructuredEvidence({
  ...WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: WELD_COUNTY_ASSESSOR_SOURCE_ID }],
}).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertCountyStructuredEvidence({ ...WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, sourceClass: 'COUNTY_ASSESSOR' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({ ...WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, certificationReference: undefined }).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
for (const rawKey of ['ownerName', 'address', 'mailingAddress', 'parcel', 'parcelId', 'taxpayerName', 'propertyRecord', 'rawRecord', 'narrative', 'pdfText', 'externalArtifact', 'accountNumber']) {
  assert.notEqual(convertCountyStructuredEvidence({
    ...WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
    evidenceReferences: [{ ...WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, [rawKey]: 'not composable' }],
  }).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
}

const normalized = normalizeWeldCountyTreasurerSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, WELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeWeldCountyTreasurerSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeWeldCountyTreasurerSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createWeldCountyTreasurerSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');

assert.equal(WELD_COUNTY_TREASURER_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxSearch, 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.payment, 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxCurrentness, 'TAX_CURRENTNESS_SOURCE_SPECIFIC');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.feeStatus, 'TREASURER_FEE_STATUS_SOURCE_SPECIFIC');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.paymentFees, 'WELD_PAYMENT_FEES_SOURCE_SPECIFIC');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxDeadlines, 'WELD_TAX_DEADLINES_NOT_CURRENTNESS_GUARANTEE');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxLienSale, 'WELD_TAX_LIEN_SALE_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.treasurerDeed, 'WELD_TREASURER_DEED_NOT_TITLE_CLEARANCE');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.lienPaymentRestrictions, 'WELD_LIEN_PAYMENT_RESTRICTIONS_APPLY');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.specialAssessment, 'WELD_SPECIAL_ASSESSMENT_CHANNEL_SEPARATE');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.manufacturedHomeTax, 'WELD_MANUFACTURED_HOME_TAX_CHANNEL_SEPARATE');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.distributionStatements, 'WELD_DISTRIBUTION_STATEMENTS_NOT_COMPLETE_TAX_RECORD_UNIVERSE');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicTrustee, 'WELD_PUBLIC_TRUSTEE_NOT_TREASURER_DATA_AUTHORITY');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notAssessor, 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notTitle, 'TREASURER_RECORD_NOT_TITLE');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notRecorder, 'TREASURER_RECORD_NOT_RECORDER_INDEX');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noBoulderTreasurerInheritance, 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_WELD_TREASURER');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noArapahoeTreasurerInheritance, 'ARAPAHOE_TREASURER_FINDINGS_NOT_INHERITED_BY_WELD_TREASURER');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noAdamsTreasurerInheritance, 'ADAMS_TREASURER_FINDINGS_NOT_INHERITED_BY_WELD_TREASURER');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noJeffersonTreasurerInheritance, 'JEFFERSON_TREASURER_FINDINGS_NOT_INHERITED_BY_WELD_TREASURER');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noWeldAssessorInheritance, 'WELD_ASSESSOR_FINDINGS_NOT_INHERITED_BY_WELD_TREASURER');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const runtime = await readFile(new URL('../lib/sourceQualityWeldCountyTreasurerEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-WELD-COUNTY-TREASURER', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'SearchInterface', 'searchParams', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceRegistry', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'ownerName', 'taxpayerName', 'mailingAddress', 'parcelId', 'accountNumber', 'propertyRecord']) {
  assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
}

console.log('[source-quality-weld-county-treasurer-evidence] ok: exact Weld Treasurer certification-only metadata reuses canonical county/public-record conversion with known gaps, Weld tax/lien/deed/special-assessment/manufactured-home/Public Trustee firewalls, no inheritance, no raw tax data, and no authority grant.');
