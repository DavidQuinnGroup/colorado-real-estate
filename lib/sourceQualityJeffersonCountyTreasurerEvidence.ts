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
import { JEFFERSON_COUNTY_TREASURER_SOURCE_ID } from './sourceQualityCountyTreasurerExactSourceDefinitions';

export { JEFFERSON_COUNTY_TREASURER_SOURCE_ID };
export const JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-17' as const;
export const JEFFERSON_COUNTY_TREASURER_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-JEFFERSON-COUNTY-TREASURER-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1',
  sourceId: JEFFERSON_COUNTY_TREASURER_SOURCE_ID,
  sourceClass: 'COUNTY_TREASURER',
  sourceConfirmation: {
    sourceId: JEFFERSON_COUNTY_TREASURER_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: JEFFERSON_COUNTY_TREASURER_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-JEFFERSON-COUNTY-TREASURER-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  registryActivation: 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  taxSearch: 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY',
  payment: 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY',
  taxCertificatesPortal: 'TAX_CERTIFICATES_NOT_AVAILABLE_THROUGH_PORTAL',
  taxLienSale: 'TAX_LIEN_SALE_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION',
  deedApplication: 'DEED_APPLICATION_NOT_TITLE_CLEARANCE',
  publicTrustee: 'PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY',
  feeStatus: 'TREASURER_FEE_STATUS_SOURCE_SPECIFIC',
  taxCurrentness: 'TAX_CURRENTNESS_SOURCE_SPECIFIC',
  notAssessor: 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY',
  notTitle: 'TREASURER_RECORD_NOT_TITLE',
  notRecorder: 'TREASURER_RECORD_NOT_RECORDER_INDEX',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  noBoulderTreasurerInheritance: 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_JEFFERSON_TREASURER',
  noArapahoeTreasurerInheritance: 'ARAPAHOE_TREASURER_FINDINGS_NOT_INHERITED_BY_JEFFERSON_TREASURER',
  noAdamsTreasurerInheritance: 'ADAMS_TREASURER_FINDINGS_NOT_INHERITED_BY_JEFFERSON_TREASURER',
  noJeffersonAssessorInheritance: 'JEFFERSON_ASSESSOR_FINDINGS_NOT_INHERITED_BY_JEFFERSON_TREASURER',
  rawData: 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
});

export function convertJeffersonCountyTreasurerSourceQualityEvidence() {
  return convertCountyStructuredEvidence(JEFFERSON_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeJeffersonCountyTreasurerSourceQualityEvidence() {
  const conversion = convertJeffersonCountyTreasurerSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: JEFFERSON_COUNTY_TREASURER_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeJeffersonCountyTreasurerSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeJeffersonCountyTreasurerSourceQualityEvidence());
}

export function createJeffersonCountyTreasurerSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountySourceQualityAssemblyRequest(convertJeffersonCountyTreasurerSourceQualityEvidence());
  if (!request) throw new Error('Exact Jefferson Treasurer conversion must produce a sparse canonical assembly request.');
  return request;
}
