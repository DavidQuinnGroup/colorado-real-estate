import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  ADAMS_COUNTY_TREASURER_MANIFEST_ELIGIBILITY,
  ADAMS_COUNTY_TREASURER_SOURCE_ID,
  ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL,
  convertAdamsCountyTreasurerSourceQualityEvidence,
  createAdamsCountyTreasurerSourceQualityAssemblyRequest,
  normalizeAdamsCountyTreasurerSourceQualityEvidence,
  summarizeAdamsCountyTreasurerSourceQualityEvidence,
} from '../lib/sourceQualityAdamsCountyTreasurerEvidence';
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const conversion = convertAdamsCountyTreasurerSourceQualityEvidence();
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_ID, 'SRC-ADAMS-COUNTY-TREASURER');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, ADAMS_COUNTY_TREASURER_SOURCE_ID);
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_TREASURER');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, ADAMS_COUNTY_TREASURER_SOURCE_ID);
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, ADAMS_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, ADAMS_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');

const boulderTreasurerConversion = convertCountyStructuredEvidence({
  ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  sourceId: 'SRC-BOULDER-COUNTY-TREASURER',
  sourceConfirmation: { sourceId: 'SRC-BOULDER-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
  evidenceReferences: [{ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-TREASURER' }],
});
assert.equal(boulderTreasurerConversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.notEqual(boulderTreasurerConversion.conversionFingerprint, conversion.conversionFingerprint);

const arapahoeTreasurerConversion = convertCountyStructuredEvidence({
  ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER',
  sourceConfirmation: { sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
  evidenceReferences: [{ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER' }],
});
assert.equal(arapahoeTreasurerConversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.notEqual(arapahoeTreasurerConversion.conversionFingerprint, conversion.conversionFingerprint);

for (const sourceId of ['SRC-ADAMS-COUNTY-ASSESSOR', 'SRC-ADAMS-COUNTY-PUBLIC-TRUSTEE', 'SRC-ADAMS-COUNTY-RECORDER', 'SRC-ADAMS-COUNTY-GIS', 'SRC-ADAMS-TAX-PAYMENT', 'SRC-ADAMS-TAX-SEARCH', 'SRC-ADAMS-TREASURER-DEED', 'SRC-ADAMS-DEED-APPLICATION', 'SRC-ADAMS-CERTIFICATE', 'SRC-ADAMS-TAX-LIEN', 'EXP-SRC-ADAMS-COUNTY-TREASURER', 'SRA-ADAMS-COUNTY-TREASURER', 'SRC-GENERIC-COUNTY-TREASURER', 'SRC-PROVIDER-COUNTY-TREASURER', 'SRC-UNKNOWN-COUNTY-SOURCE']) {
  const result = convertCountyStructuredEvidence({
    ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  });
  assert.notEqual(result.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
}

assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, sourceClass: 'COUNTY_ASSESSOR' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, certificationReference: undefined }).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, taxpayerName: 'not allowed' }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, rawRecord: 'not allowed' }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({
  ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER' }],
}).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertAdamsCountyTreasurerSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertAdamsCountyTreasurerSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);

const normalized = normalizeAdamsCountyTreasurerSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, ADAMS_COUNTY_TREASURER_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeAdamsCountyTreasurerSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeAdamsCountyTreasurerSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createAdamsCountyTreasurerSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(ADAMS_COUNTY_TREASURER_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');

assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxSearch, 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.payment, 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.treasurerDeed, 'TREASURER_DEED_NOT_TITLE_CLEARANCE');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.lienData, 'TAX_LIEN_DATA_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicTrustee, 'PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.feeStatus, 'TREASURER_FEE_STATUS_SOURCE_SPECIFIC');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxCurrentness, 'TAX_CURRENTNESS_SOURCE_SPECIFIC');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.reports, 'TREASURER_REPORTS_NOT_COMPLETE_TAX_RECORD_UNIVERSE');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notAssessor, 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notTitle, 'TREASURER_RECORD_NOT_TITLE');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notRecorder, 'TREASURER_RECORD_NOT_RECORDER_INDEX');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noBoulderTreasurerInheritance, 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_ADAMS_TREASURER');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noArapahoeTreasurerInheritance, 'ARAPAHOE_TREASURER_FINDINGS_NOT_INHERITED_BY_ADAMS_TREASURER');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noAdamsAssessorInheritance, 'ADAMS_ASSESSOR_FINDINGS_NOT_INHERITED_BY_ADAMS_TREASURER');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const runtime = await readFile(new URL('../lib/sourceQualityAdamsCountyTreasurerEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-ADAMS-COUNTY-TREASURER', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'SearchClient', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'tax search submission', 'online payment', 'payment submission', 'Treasurer deed action', 'tax-lien action', 'certificate action']) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
console.log('[source-quality-adams-county-treasurer-evidence] ok: exact Adams Treasurer certification-only metadata reuses canonical county conversion with known gaps, no tax search/payment/deed/lien/certificate/Public Trustee authority, no inheritance, no raw tax data, and no authority grant.');
