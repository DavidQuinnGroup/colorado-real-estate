import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  JEFFERSON_COUNTY_TREASURER_MANIFEST_ELIGIBILITY,
  JEFFERSON_COUNTY_TREASURER_SOURCE_ID,
  JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL,
  convertJeffersonCountyTreasurerSourceQualityEvidence,
  createJeffersonCountyTreasurerSourceQualityAssemblyRequest,
  normalizeJeffersonCountyTreasurerSourceQualityEvidence,
  summarizeJeffersonCountyTreasurerSourceQualityEvidence,
} from '../lib/sourceQualityJeffersonCountyTreasurerEvidence';
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { convertPublicRecordStructuredEvidence } from '../lib/sourceQualityPublicRecordEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { convertBoulderCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityBoulderCountyTreasurerEvidence';
import { convertArapahoeCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityArapahoeCountyTreasurerEvidence';
import { convertAdamsCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityAdamsCountyTreasurerEvidence';
import { JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID } from '../lib/sourceQualityCountyAssessorExactSourceDefinitions';

const conversion = convertJeffersonCountyTreasurerSourceQualityEvidence();
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_ID, 'SRC-JEFFERSON-COUNTY-TREASURER');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, JEFFERSON_COUNTY_TREASURER_SOURCE_ID);
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_TREASURER');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, JEFFERSON_COUNTY_TREASURER_SOURCE_ID);
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, JEFFERSON_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, JEFFERSON_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');

const publicRecordConversion = convertPublicRecordStructuredEvidence({
  ...JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1',
});
assert.equal(publicRecordConversion.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(publicRecordConversion.sourceId, JEFFERSON_COUNTY_TREASURER_SOURCE_ID);
assert.equal(publicRecordConversion.linkages[0]?.relationshipType, 'CERTIFICATION');

for (const sourceId of [
  'SRC-LARIMER-COUNTY-TREASURER',
  'SRC-BROOMFIELD-COUNTY-TREASURER',
  'SRC-FAKE-COUNTY-TREASURER',
  'SRC-GENERIC-COUNTY-TREASURER',
  'SRC-PROVIDER-COUNTY-TREASURER',
  'EXP-SRC-JEFFERSON-COUNTY-TREASURER',
  'SRA-JEFFERSON-COUNTY-TREASURER',
  'SRC-JEFFERSON-COUNTY-PUBLIC-TRUSTEE',
  'SRC-JEFFERSON-COUNTY-RECORDER',
  'SRC-JEFFERSON-COUNTY-GIS',
]) {
  const request = {
    ...JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  } as const;
  assert.equal(convertCountyStructuredEvidence(request).classification, 'COUNTY_SOURCE_INVALID');
}

const assessorInheritance = {
  ...JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID }],
} as const;
assert.equal(convertCountyStructuredEvidence(assessorInheritance).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');

const missingCertification = convertCountyStructuredEvidence({
  ...JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  certificationReference: undefined,
});
assert.equal(missingCertification.classification, 'COUNTY_CERTIFICATION_REQUIRED');
const missingReviewedAt = convertCountyStructuredEvidence({
  ...JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  reviewedAt: '',
});
assert.equal(missingReviewedAt.classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertJeffersonCountyTreasurerSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertJeffersonCountyTreasurerSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertBoulderCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertArapahoeCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertAdamsCountyTreasurerSourceQualityEvidence().conversionFingerprint);

const normalized = normalizeJeffersonCountyTreasurerSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, JEFFERSON_COUNTY_TREASURER_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeJeffersonCountyTreasurerSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeJeffersonCountyTreasurerSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createJeffersonCountyTreasurerSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(JEFFERSON_COUNTY_TREASURER_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxCertificatesPortal, 'TAX_CERTIFICATES_NOT_AVAILABLE_THROUGH_PORTAL');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxLienSale, 'TAX_LIEN_SALE_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.deedApplication, 'DEED_APPLICATION_NOT_TITLE_CLEARANCE');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxSearch, 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.payment, 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicTrustee, 'PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notAssessor, 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notTitle, 'TREASURER_RECORD_NOT_TITLE');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notRecorder, 'TREASURER_RECORD_NOT_RECORDER_INDEX');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noBoulderTreasurerInheritance, 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_JEFFERSON_TREASURER');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noArapahoeTreasurerInheritance, 'ARAPAHOE_TREASURER_FINDINGS_NOT_INHERITED_BY_JEFFERSON_TREASURER');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noAdamsTreasurerInheritance, 'ADAMS_TREASURER_FINDINGS_NOT_INHERITED_BY_JEFFERSON_TREASURER');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noJeffersonAssessorInheritance, 'JEFFERSON_ASSESSOR_FINDINGS_NOT_INHERITED_BY_JEFFERSON_TREASURER');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const runtime = await readFile(new URL('../lib/sourceQualityJeffersonCountyTreasurerEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-JEFFERSON-COUNTY-TREASURER', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'SearchInterface', 'searchParams', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceRegistry', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'ownerName', 'taxpayerName', 'mailingAddress', 'parcelId', 'accountNumber', 'propertyRecord']) {
  assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
}
console.log('[source-quality-jefferson-county-treasurer-evidence] ok: exact Jefferson Treasurer certification-only metadata reuses canonical county/public-record conversion with known gaps, certificate/lien/deed/Public Trustee firewalls, no inheritance, no raw tax data, and no authority grant.');
