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

export const ARAPAHOE_COUNTY_TREASURER_SOURCE_ID = 'SRC-ARAPAHOE-COUNTY-TREASURER' as const;
export const ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-16' as const;
export const ARAPAHOE_COUNTY_TREASURER_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-ARAPAHOE-COUNTY-TREASURER-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1',
  sourceId: ARAPAHOE_COUNTY_TREASURER_SOURCE_ID,
  sourceClass: 'COUNTY_TREASURER',
  sourceConfirmation: {
    sourceId: ARAPAHOE_COUNTY_TREASURER_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: ARAPAHOE_COUNTY_TREASURER_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-ARAPAHOE-COUNTY-TREASURER-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  registryActivation: 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  taxSearch: 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY',
  payment: 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY',
  extracts: 'TAX_EXTRACT_NOT_UNRESTRICTED_OR_REUSE_READY',
  certificateOfTaxesDue: 'CERTIFICATE_OF_TAXES_DUE_NOT_TITLE_OR_LIEN_CLEARANCE_GUARANTEE',
  lienOperations: 'TAX_LIEN_OPERATIONS_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  publicTrustee: 'PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY',
  notAssessor: 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY',
  notTitle: 'TREASURER_RECORD_NOT_TITLE',
  notRecorder: 'TREASURER_RECORD_NOT_RECORDER_INDEX',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  noBoulderTreasurerInheritance: 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_ARAPAHOE_TREASURER',
  noArapahoeAssessorInheritance: 'ARAPAHOE_ASSESSOR_FINDINGS_NOT_INHERITED_BY_ARAPAHOE_TREASURER',
  rawData: 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
});

export function convertArapahoeCountyTreasurerSourceQualityEvidence() {
  return convertCountyStructuredEvidence(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeArapahoeCountyTreasurerSourceQualityEvidence() {
  const conversion = convertArapahoeCountyTreasurerSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: ARAPAHOE_COUNTY_TREASURER_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeArapahoeCountyTreasurerSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeArapahoeCountyTreasurerSourceQualityEvidence());
}

export function createArapahoeCountyTreasurerSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountySourceQualityAssemblyRequest(convertArapahoeCountyTreasurerSourceQualityEvidence());
  if (!request) throw new Error('Exact Arapahoe Treasurer conversion must produce a sparse canonical assembly request.');
  return request;
}
