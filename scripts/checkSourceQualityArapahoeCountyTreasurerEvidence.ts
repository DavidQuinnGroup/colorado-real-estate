import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  ARAPAHOE_COUNTY_TREASURER_MANIFEST_ELIGIBILITY,
  ARAPAHOE_COUNTY_TREASURER_SOURCE_ID,
  ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL,
  convertArapahoeCountyTreasurerSourceQualityEvidence,
  createArapahoeCountyTreasurerSourceQualityAssemblyRequest,
  normalizeArapahoeCountyTreasurerSourceQualityEvidence,
  summarizeArapahoeCountyTreasurerSourceQualityEvidence,
} from '../lib/sourceQualityArapahoeCountyTreasurerEvidence';
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const conversion = convertArapahoeCountyTreasurerSourceQualityEvidence();
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_ID, 'SRC-ARAPAHOE-COUNTY-TREASURER');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, ARAPAHOE_COUNTY_TREASURER_SOURCE_ID);
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_TREASURER');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, ARAPAHOE_COUNTY_TREASURER_SOURCE_ID);
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, ARAPAHOE_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, ARAPAHOE_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');

const boulderTreasurerConversion = convertCountyStructuredEvidence({
  ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  sourceId: 'SRC-BOULDER-COUNTY-TREASURER',
  sourceConfirmation: { sourceId: 'SRC-BOULDER-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
  evidenceReferences: [{ ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-TREASURER' }],
});
assert.equal(boulderTreasurerConversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.notEqual(boulderTreasurerConversion.conversionFingerprint, conversion.conversionFingerprint);

for (const sourceId of ['SRC-ARAPAHOE-COUNTY-ASSESSOR', 'SRC-ARAPAHOE-COUNTY-PUBLIC-TRUSTEE', 'SRC-ARAPAHOE-COUNTY-RECORDER', 'SRC-ARAPAHOE-COUNTY-GIS', 'SRC-ARAPAHOE-TAX-PAYMENT', 'SRC-ARAPAHOE-TAX-EXTRACT', 'SRC-ARAPAHOE-CERTIFICATE-OF-TAXES-DUE', 'SRC-ARAPAHOE-TAX-LIEN', 'EXP-SRC-ARAPAHOE-COUNTY-TREASURER', 'SRA-ARAPAHOE-COUNTY-TREASURER', 'SRC-GENERIC-COUNTY-TREASURER', 'SRC-PROVIDER-COUNTY-TREASURER', 'SRC-UNKNOWN-COUNTY-SOURCE']) {
  const result = convertCountyStructuredEvidence({
    ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  });
  assert.notEqual(result.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
}

assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, sourceClass: 'COUNTY_ASSESSOR' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, certificationReference: undefined }).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, taxpayerName: 'not allowed' }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, rawRecord: 'not allowed' }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({
  ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-TREASURER' }],
}).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertArapahoeCountyTreasurerSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertArapahoeCountyTreasurerSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);

const normalized = normalizeArapahoeCountyTreasurerSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, ARAPAHOE_COUNTY_TREASURER_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeArapahoeCountyTreasurerSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeArapahoeCountyTreasurerSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createArapahoeCountyTreasurerSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(ARAPAHOE_COUNTY_TREASURER_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');

assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxSearch, 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.payment, 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.extracts, 'TAX_EXTRACT_NOT_UNRESTRICTED_OR_REUSE_READY');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.certificateOfTaxesDue, 'CERTIFICATE_OF_TAXES_DUE_NOT_TITLE_OR_LIEN_CLEARANCE_GUARANTEE');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.lienOperations, 'TAX_LIEN_OPERATIONS_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicTrustee, 'PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notAssessor, 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notTitle, 'TREASURER_RECORD_NOT_TITLE');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notRecorder, 'TREASURER_RECORD_NOT_RECORDER_INDEX');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noBoulderTreasurerInheritance, 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_ARAPAHOE_TREASURER');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noArapahoeAssessorInheritance, 'ARAPAHOE_ASSESSOR_FINDINGS_NOT_INHERITED_BY_ARAPAHOE_TREASURER');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const runtime = await readFile(new URL('../lib/sourceQualityArapahoeCountyTreasurerEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-ARAPAHOE-COUNTY-TREASURER', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'SearchClient', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'Tax Search submission', 'online payment', 'Certificate purchase', 'tax extract download']) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
console.log('[source-quality-arapahoe-county-treasurer-evidence] ok: exact Arapahoe Treasurer certification-only metadata reuses canonical county conversion with known gaps, no payment/extract/certificate/lien/Public Trustee authority, no inheritance, no raw tax data, and no authority grant.');
