import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  LARIMER_COUNTY_TREASURER_MANIFEST_ELIGIBILITY,
  LARIMER_COUNTY_TREASURER_SOURCE_ID,
  LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL,
  convertLarimerCountyTreasurerSourceQualityEvidence,
  createLarimerCountyTreasurerSourceQualityAssemblyRequest,
  normalizeLarimerCountyTreasurerSourceQualityEvidence,
  summarizeLarimerCountyTreasurerSourceQualityEvidence,
} from '../lib/sourceQualityLarimerCountyTreasurerEvidence';
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { convertPublicRecordStructuredEvidence } from '../lib/sourceQualityPublicRecordEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { convertBoulderCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityBoulderCountyTreasurerEvidence';
import { convertArapahoeCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityArapahoeCountyTreasurerEvidence';
import { convertAdamsCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityAdamsCountyTreasurerEvidence';
import { convertJeffersonCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityJeffersonCountyTreasurerEvidence';
import { convertWeldCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityWeldCountyTreasurerEvidence';
import { LARIMER_COUNTY_ASSESSOR_SOURCE_ID } from '../lib/sourceQualityCountyAssessorExactSourceDefinitions';

const conversion = convertLarimerCountyTreasurerSourceQualityEvidence();
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_ID, 'SRC-LARIMER-COUNTY-TREASURER');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, LARIMER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_TREASURER');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, LARIMER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.reviewedAt, LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, LARIMER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, LARIMER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.sourceId, LARIMER_COUNTY_TREASURER_SOURCE_ID);
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
  ...LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1',
});
assert.equal(publicRecordConversion.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(publicRecordConversion.sourceId, LARIMER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(publicRecordConversion.linkages[0]?.relationshipType, 'CERTIFICATION');

assert.equal(convertLarimerCountyTreasurerSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertLarimerCountyTreasurerSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertBoulderCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertArapahoeCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertAdamsCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertJeffersonCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertWeldCountyTreasurerSourceQualityEvidence().conversionFingerprint);

for (const sourceId of [
  'SRC-SYNTHETIC-COUNTY-TREASURER',
  'SRC-UNREGISTERED-COUNTY-TREASURER',
  'SRC-FAKE-COUNTY-TREASURER',
  'SRC-GENERIC-COUNTY-TREASURER',
  'SRC-PROVIDER-COUNTY-TREASURER',
  'EXP-SRC-LARIMER-COUNTY-TREASURER',
  'SRA-LARIMER-COUNTY-TREASURER',
  'SRC-LARIMER-COUNTY-PUBLIC-TRUSTEE',
  'SRC-LARIMER-COUNTY-RECORDER',
  'SRC-LARIMER-COUNTY-GIS',
  'SRC-LARIMER-COUNTY-PARCEL-GIS',
]) {
  const request = {
    ...LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  } as const;
  assert.equal(convertCountyStructuredEvidence(request).classification, 'COUNTY_SOURCE_INVALID');
}

assert.equal(convertCountyStructuredEvidence({
  ...LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: LARIMER_COUNTY_ASSESSOR_SOURCE_ID }],
}).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertCountyStructuredEvidence({ ...LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, sourceClass: 'COUNTY_ASSESSOR' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({ ...LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, certificationReference: undefined }).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
for (const rawKey of ['ownerName', 'address', 'mailingAddress', 'parcel', 'parcelId', 'taxpayerName', 'propertyRecord', 'rawRecord', 'narrative', 'pdfText', 'externalArtifact', 'accountNumber']) {
  assert.notEqual(convertCountyStructuredEvidence({
    ...LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
    evidenceReferences: [{ ...LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, [rawKey]: 'not composable' }],
  }).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
}

const normalized = normalizeLarimerCountyTreasurerSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, LARIMER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeLarimerCountyTreasurerSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeLarimerCountyTreasurerSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createLarimerCountyTreasurerSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly?.summaries[0]?.source.sourceId, LARIMER_COUNTY_TREASURER_SOURCE_ID);

assert.equal(LARIMER_COUNTY_TREASURER_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxSearch, 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.payment, 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxCurrentness, 'TAX_CURRENTNESS_SOURCE_SPECIFIC');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.feeStatus, 'TREASURER_FEE_STATUS_SOURCE_SPECIFIC');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.combinedOffice, 'LARIMER_TREASURER_PUBLIC_TRUSTEE_COMBINED_OFFICE_NOT_COMBINED_SOURCE_AUTHORITY');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.scheduledMaintenance, 'LARIMER_SCHEDULED_MAINTENANCE_NOT_CURRENTNESS_GUARANTEE');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.currentStatements, 'LARIMER_CURRENT_STATEMENTS_NOT_COMPLETE_TAX_HISTORY');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.delinquentStatements, 'LARIMER_DELINQUENT_STATEMENTS_SOURCE_SPECIFIC');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.manufacturedHomeTax, 'LARIMER_MANUFACTURED_HOME_TAX_CHANNEL_SEPARATE');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.specialAssessment, 'LARIMER_SPECIAL_ASSESSMENT_CHANNEL_SEPARATE');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.exemptionDeferral, 'LARIMER_EXEMPTION_DEFERRAL_NOT_TAX_STATUS_CLEARANCE');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.paymentChannel, 'LARIMER_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.foreclosureRelease, 'LARIMER_FORECLOSURE_RELEASE_NOT_TREASURER_RECORD_AUTHORITY');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicTrustee, 'LARIMER_PUBLIC_TRUSTEE_NOT_TREASURER_DATA_AUTHORITY');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notAssessor, 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notTitle, 'TREASURER_RECORD_NOT_TITLE');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notRecorder, 'TREASURER_RECORD_NOT_RECORDER_INDEX');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noBoulderTreasurerInheritance, 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noArapahoeTreasurerInheritance, 'ARAPAHOE_TREASURER_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noAdamsTreasurerInheritance, 'ADAMS_TREASURER_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noJeffersonTreasurerInheritance, 'JEFFERSON_TREASURER_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noWeldTreasurerInheritance, 'WELD_TREASURER_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noLarimerAssessorInheritance, 'LARIMER_ASSESSOR_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const runtime = await readFile(new URL('../lib/sourceQualityLarimerCountyTreasurerEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-LARIMER-COUNTY-TREASURER', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'SearchInterface', 'searchParams', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceRegistry', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'ownerName', 'taxpayerName', 'mailingAddress', 'parcelId', 'accountNumber', 'propertyRecord']) {
  assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
}

console.log('[source-quality-larimer-county-treasurer-evidence] ok: exact Larimer Treasurer certification-only metadata reuses canonical county/public-record conversion with known gaps, Larimer current/delinquent/manufactured-home/special-assessment/payment/Public Trustee firewalls, no inheritance, no raw tax data, and no authority grant.');
