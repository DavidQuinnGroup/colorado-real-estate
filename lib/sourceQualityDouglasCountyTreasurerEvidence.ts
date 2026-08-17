import {
  convertCountyStructuredEvidence,
  createCountySourceQualityAssemblyRequest,
  type CountySourceQualityEvidenceConversionRequest,
} from './sourceQualityCountyEvidenceConversionContract';
import {
  normalizeSourceEvidence,
  type SourceEvidenceCertificationReference,
} from './sourceQualityEvidenceNormalization';
import { summarizeSourceQuality } from './sourceQualityControl';
import type { SourceQualitySummaryAssemblyRequest } from './sourceQualitySummaryAssembly';
import { DOUGLAS_COUNTY_TREASURER_SOURCE_ID } from './sourceQualityCountyTreasurerExactSourceDefinitions';

export { DOUGLAS_COUNTY_TREASURER_SOURCE_ID };
export const DOUGLAS_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-17' as const;
export const DOUGLAS_COUNTY_TREASURER_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const DOUGLAS_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-DOUGLAS-COUNTY-TREASURER-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: DOUGLAS_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const DOUGLAS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1',
  sourceId: DOUGLAS_COUNTY_TREASURER_SOURCE_ID,
  sourceClass: 'COUNTY_TREASURER',
  sourceConfirmation: {
    sourceId: DOUGLAS_COUNTY_TREASURER_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: DOUGLAS_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: DOUGLAS_COUNTY_TREASURER_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-DOUGLAS-COUNTY-TREASURER-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: DOUGLAS_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: DOUGLAS_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const DOUGLAS_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  registryActivation: 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  taxSearch: 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY',
  payment: 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY',
  taxCurrentness: 'TAX_CURRENTNESS_SOURCE_SPECIFIC',
  feeStatus: 'TREASURER_FEE_STATUS_SOURCE_SPECIFIC',
  currentnessArrears: 'DOUGLAS_TREASURER_BILLED_ONE_YEAR_IN_ARREARS_NOT_CURRENTNESS_GUARANTEE',
  statementReceipt: 'DOUGLAS_TAX_STATEMENT_RECEIPT_NOT_TITLE_OR_LIEN_CLEARANCE',
  lienDelinquency: 'DOUGLAS_TAX_LIEN_DELINQUENCY_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION',
  paymentVendor: 'DOUGLAS_PAYMENT_VENDOR_NOT_DATA_REUSE_OR_AUTOMATION_AUTHORITY',
  statementCertificateChannel: 'DOUGLAS_STATEMENT_OR_CERTIFICATE_OF_TAXES_DUE_DISTINCT_GOVERNED_CHANNEL',
  assessorParcelDetail: 'DOUGLAS_ASSESSOR_PARCEL_DETAIL_SEPARATE_SOURCE_AUTHORITY',
  publicTrustee: 'PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY',
  notAssessor: 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY',
  notTitle: 'TREASURER_RECORD_NOT_TITLE',
  notRecorder: 'TREASURER_RECORD_NOT_RECORDER_INDEX',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  noBoulderTreasurerInheritance: 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_DOUGLAS_TREASURER',
  noArapahoeTreasurerInheritance: 'ARAPAHOE_TREASURER_FINDINGS_NOT_INHERITED_BY_DOUGLAS_TREASURER',
  noAdamsTreasurerInheritance: 'ADAMS_TREASURER_FINDINGS_NOT_INHERITED_BY_DOUGLAS_TREASURER',
  noJeffersonTreasurerInheritance: 'JEFFERSON_TREASURER_FINDINGS_NOT_INHERITED_BY_DOUGLAS_TREASURER',
  noLarimerTreasurerInheritance: 'LARIMER_TREASURER_FINDINGS_NOT_INHERITED_BY_DOUGLAS_TREASURER',
  noBroomfieldTreasurerInheritance: 'BROOMFIELD_TREASURER_FINDINGS_NOT_INHERITED_BY_DOUGLAS_TREASURER',
  noWeldTreasurerInheritance: 'WELD_TREASURER_FINDINGS_NOT_INHERITED_BY_DOUGLAS_TREASURER',
  noDouglasAssessorInheritance: 'DOUGLAS_ASSESSOR_FINDINGS_NOT_INHERITED_BY_DOUGLAS_TREASURER',
  rawData: 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
});

export function convertDouglasCountyTreasurerSourceQualityEvidence() {
  return convertCountyStructuredEvidence(DOUGLAS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeDouglasCountyTreasurerSourceQualityEvidence() {
  const conversion = convertDouglasCountyTreasurerSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: DOUGLAS_COUNTY_TREASURER_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeDouglasCountyTreasurerSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeDouglasCountyTreasurerSourceQualityEvidence());
}

export function createDouglasCountyTreasurerSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountySourceQualityAssemblyRequest(convertDouglasCountyTreasurerSourceQualityEvidence());
  if (!request) throw new Error('Exact Douglas Treasurer conversion must produce a sparse canonical assembly request.');
  return request;
}
