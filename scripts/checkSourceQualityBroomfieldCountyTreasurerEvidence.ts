import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  BROOMFIELD_COUNTY_TREASURER_MANIFEST_ELIGIBILITY,
  BROOMFIELD_COUNTY_TREASURER_SOURCE_ID,
  BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL,
  convertBroomfieldCountyTreasurerSourceQualityEvidence,
  createBroomfieldCountyTreasurerSourceQualityAssemblyRequest,
  normalizeBroomfieldCountyTreasurerSourceQualityEvidence,
  summarizeBroomfieldCountyTreasurerSourceQualityEvidence,
} from '../lib/sourceQualityBroomfieldCountyTreasurerEvidence';
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { convertPublicRecordStructuredEvidence } from '../lib/sourceQualityPublicRecordEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { convertBoulderCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityBoulderCountyTreasurerEvidence';
import { convertArapahoeCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityArapahoeCountyTreasurerEvidence';
import { convertAdamsCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityAdamsCountyTreasurerEvidence';
import { convertJeffersonCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityJeffersonCountyTreasurerEvidence';
import { convertLarimerCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityLarimerCountyTreasurerEvidence';
import { convertWeldCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityWeldCountyTreasurerEvidence';
import { BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID } from '../lib/sourceQualityCountyAssessorExactSourceDefinitions';

const conversion = convertBroomfieldCountyTreasurerSourceQualityEvidence();
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_ID, 'SRC-BROOMFIELD-COUNTY-TREASURER');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, BROOMFIELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_TREASURER');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, BROOMFIELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.reviewedAt, BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, BROOMFIELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, BROOMFIELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.sourceId, BROOMFIELD_COUNTY_TREASURER_SOURCE_ID);
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
  ...BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1',
});
assert.equal(publicRecordConversion.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(publicRecordConversion.sourceId, BROOMFIELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(publicRecordConversion.linkages[0]?.relationshipType, 'CERTIFICATION');

assert.equal(convertBroomfieldCountyTreasurerSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertBroomfieldCountyTreasurerSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertBoulderCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertArapahoeCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertAdamsCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertJeffersonCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertLarimerCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.notEqual(conversion.conversionFingerprint, convertWeldCountyTreasurerSourceQualityEvidence().conversionFingerprint);

for (const sourceId of [
  'SRC-SYNTHETIC-COUNTY-TREASURER',
  'SRC-UNREGISTERED-COUNTY-TREASURER',
  'SRC-FAKE-COUNTY-TREASURER',
  'SRC-GENERIC-COUNTY-TREASURER',
  'SRC-PROVIDER-COUNTY-TREASURER',
  'EXP-SRC-BROOMFIELD-COUNTY-TREASURER',
  'SRA-BROOMFIELD-COUNTY-TREASURER',
  'SRC-BROOMFIELD-COUNTY-PUBLIC-TRUSTEE',
  'SRC-BROOMFIELD-COUNTY-RECORDER',
  'SRC-BROOMFIELD-COUNTY-GIS',
  'SRC-BROOMFIELD-COUNTY-PARCEL-GIS',
  'SRC-BROOMFIELD-GOVERNMENT',
]) {
  const request = {
    ...BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  } as const;
  assert.equal(convertCountyStructuredEvidence(request).classification, 'COUNTY_SOURCE_INVALID');
}

assert.equal(convertCountyStructuredEvidence({
  ...BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID }],
}).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertCountyStructuredEvidence({ ...BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, sourceClass: 'COUNTY_ASSESSOR' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({ ...BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, certificationReference: undefined }).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
for (const rawKey of ['ownerName', 'address', 'mailingAddress', 'parcel', 'parcelId', 'taxpayerName', 'propertyRecord', 'rawRecord', 'narrative', 'pdfText', 'externalArtifact', 'accountNumber']) {
  assert.notEqual(convertCountyStructuredEvidence({
    ...BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
    evidenceReferences: [{ ...BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, [rawKey]: 'not composable' }],
  }).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
}

const normalized = normalizeBroomfieldCountyTreasurerSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, BROOMFIELD_COUNTY_TREASURER_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeBroomfieldCountyTreasurerSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeBroomfieldCountyTreasurerSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createBroomfieldCountyTreasurerSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly?.summaries[0]?.source.sourceId, BROOMFIELD_COUNTY_TREASURER_SOURCE_ID);

assert.equal(BROOMFIELD_COUNTY_TREASURER_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxSearch, 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.payment, 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.taxCurrentness, 'TAX_CURRENTNESS_SOURCE_SPECIFIC');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.feeStatus, 'TREASURER_FEE_STATUS_SOURCE_SPECIFIC');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.certificateOfTaxesDue, 'CERTIFICATE_OF_TAXES_DUE_NOT_TITLE_OR_LIEN_CLEARANCE_GUARANTEE');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.paymentProviderFees, 'BROOMFIELD_PAYMENT_PROVIDER_FEES_SOURCE_SPECIFIC');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.onlineTreasurerPortal, 'BROOMFIELD_ONLINE_TREASURER_PORTAL_NOT_AUTOMATION_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.equapay, 'EQUAPAY_NOT_COUNTY_TAX_RECORD_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.financeDirector, 'FINANCE_DIRECTOR_INVESTMENT_RECONCILIATION_NOT_TREASURER_TAX_RECORD_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.revenueManager, 'REVENUE_MANAGER_ROLE_NOT_SEPARATE_SOURCE_IDENTITY');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.consolidatedCityCounty, 'CONSOLIDATED_CITY_COUNTY_NOT_AGGREGATE_SOURCE_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicTrustee, 'PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notAssessor, 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notTitle, 'TREASURER_RECORD_NOT_TITLE');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.notRecorder, 'TREASURER_RECORD_NOT_RECORDER_INDEX');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noBoulderTreasurerInheritance, 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noArapahoeTreasurerInheritance, 'ARAPAHOE_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noAdamsTreasurerInheritance, 'ADAMS_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noJeffersonTreasurerInheritance, 'JEFFERSON_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noLarimerTreasurerInheritance, 'LARIMER_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noWeldTreasurerInheritance, 'WELD_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.noBroomfieldAssessorInheritance, 'BROOMFIELD_ASSESSOR_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const runtime = await readFile(new URL('../lib/sourceQualityBroomfieldCountyTreasurerEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-BROOMFIELD-COUNTY-TREASURER', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'SearchInterface', 'searchParams', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceRegistry', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'ownerName', 'taxpayerName', 'mailingAddress', 'parcelId', 'accountNumber', 'propertyRecord']) {
  assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
}

console.log('[source-quality-broomfield-county-treasurer-evidence] ok: exact Broomfield Treasurer certification-only metadata reuses canonical county/public-record conversion with known gaps, Broomfield portal/payment-provider/certificate/Finance Director/Revenue Manager/consolidated-government firewalls, no inheritance, no raw tax data, and no authority grant.');
