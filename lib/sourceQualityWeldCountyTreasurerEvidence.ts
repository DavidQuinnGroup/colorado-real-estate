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
import { WELD_COUNTY_TREASURER_SOURCE_ID } from './sourceQualityCountyTreasurerExactSourceDefinitions';

export { WELD_COUNTY_TREASURER_SOURCE_ID };
export const WELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-17' as const;
export const WELD_COUNTY_TREASURER_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const WELD_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-WELD-COUNTY-TREASURER-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: WELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1',
  sourceId: WELD_COUNTY_TREASURER_SOURCE_ID,
  sourceClass: 'COUNTY_TREASURER',
  sourceConfirmation: {
    sourceId: WELD_COUNTY_TREASURER_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: WELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: WELD_COUNTY_TREASURER_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-WELD-COUNTY-TREASURER-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: WELD_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: WELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const WELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  registryActivation: 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  taxSearch: 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY',
  payment: 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY',
  taxCurrentness: 'TAX_CURRENTNESS_SOURCE_SPECIFIC',
  feeStatus: 'TREASURER_FEE_STATUS_SOURCE_SPECIFIC',
  paymentFees: 'WELD_PAYMENT_FEES_SOURCE_SPECIFIC',
  taxDeadlines: 'WELD_TAX_DEADLINES_NOT_CURRENTNESS_GUARANTEE',
  taxLienSale: 'WELD_TAX_LIEN_SALE_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION',
  treasurerDeed: 'WELD_TREASURER_DEED_NOT_TITLE_CLEARANCE',
  lienPaymentRestrictions: 'WELD_LIEN_PAYMENT_RESTRICTIONS_APPLY',
  specialAssessment: 'WELD_SPECIAL_ASSESSMENT_CHANNEL_SEPARATE',
  manufacturedHomeTax: 'WELD_MANUFACTURED_HOME_TAX_CHANNEL_SEPARATE',
  distributionStatements: 'WELD_DISTRIBUTION_STATEMENTS_NOT_COMPLETE_TAX_RECORD_UNIVERSE',
  publicTrustee: 'WELD_PUBLIC_TRUSTEE_NOT_TREASURER_DATA_AUTHORITY',
  notAssessor: 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY',
  notTitle: 'TREASURER_RECORD_NOT_TITLE',
  notRecorder: 'TREASURER_RECORD_NOT_RECORDER_INDEX',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  noBoulderTreasurerInheritance: 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_WELD_TREASURER',
  noArapahoeTreasurerInheritance: 'ARAPAHOE_TREASURER_FINDINGS_NOT_INHERITED_BY_WELD_TREASURER',
  noAdamsTreasurerInheritance: 'ADAMS_TREASURER_FINDINGS_NOT_INHERITED_BY_WELD_TREASURER',
  noJeffersonTreasurerInheritance: 'JEFFERSON_TREASURER_FINDINGS_NOT_INHERITED_BY_WELD_TREASURER',
  noWeldAssessorInheritance: 'WELD_ASSESSOR_FINDINGS_NOT_INHERITED_BY_WELD_TREASURER',
  rawData: 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
});

export function convertWeldCountyTreasurerSourceQualityEvidence() {
  return convertCountyStructuredEvidence(WELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeWeldCountyTreasurerSourceQualityEvidence() {
  const conversion = convertWeldCountyTreasurerSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: WELD_COUNTY_TREASURER_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeWeldCountyTreasurerSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeWeldCountyTreasurerSourceQualityEvidence());
}

export function createWeldCountyTreasurerSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountySourceQualityAssemblyRequest(convertWeldCountyTreasurerSourceQualityEvidence());
  if (!request) throw new Error('Exact Weld Treasurer conversion must produce a sparse canonical assembly request.');
  return request;
}
