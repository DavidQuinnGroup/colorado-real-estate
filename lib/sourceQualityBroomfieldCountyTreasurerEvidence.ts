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
import { BROOMFIELD_COUNTY_TREASURER_SOURCE_ID } from './sourceQualityCountyTreasurerExactSourceDefinitions';

export { BROOMFIELD_COUNTY_TREASURER_SOURCE_ID };
export const BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-17' as const;
export const BROOMFIELD_COUNTY_TREASURER_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-BROOMFIELD-COUNTY-TREASURER-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1',
  sourceId: BROOMFIELD_COUNTY_TREASURER_SOURCE_ID,
  sourceClass: 'COUNTY_TREASURER',
  sourceConfirmation: {
    sourceId: BROOMFIELD_COUNTY_TREASURER_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: BROOMFIELD_COUNTY_TREASURER_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-BROOMFIELD-COUNTY-TREASURER-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  registryActivation: 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  taxSearch: 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY',
  payment: 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY',
  taxCurrentness: 'TAX_CURRENTNESS_SOURCE_SPECIFIC',
  feeStatus: 'TREASURER_FEE_STATUS_SOURCE_SPECIFIC',
  certificateOfTaxesDue: 'CERTIFICATE_OF_TAXES_DUE_NOT_TITLE_OR_LIEN_CLEARANCE_GUARANTEE',
  paymentProviderFees: 'BROOMFIELD_PAYMENT_PROVIDER_FEES_SOURCE_SPECIFIC',
  onlineTreasurerPortal: 'BROOMFIELD_ONLINE_TREASURER_PORTAL_NOT_AUTOMATION_AUTHORITY',
  equapay: 'EQUAPAY_NOT_COUNTY_TAX_RECORD_AUTHORITY',
  financeDirector: 'FINANCE_DIRECTOR_INVESTMENT_RECONCILIATION_NOT_TREASURER_TAX_RECORD_AUTHORITY',
  revenueManager: 'REVENUE_MANAGER_ROLE_NOT_SEPARATE_SOURCE_IDENTITY',
  consolidatedCityCounty: 'CONSOLIDATED_CITY_COUNTY_NOT_AGGREGATE_SOURCE_AUTHORITY',
  publicTrustee: 'PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY',
  notAssessor: 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY',
  notTitle: 'TREASURER_RECORD_NOT_TITLE',
  notRecorder: 'TREASURER_RECORD_NOT_RECORDER_INDEX',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  noBoulderTreasurerInheritance: 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER',
  noArapahoeTreasurerInheritance: 'ARAPAHOE_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER',
  noAdamsTreasurerInheritance: 'ADAMS_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER',
  noJeffersonTreasurerInheritance: 'JEFFERSON_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER',
  noLarimerTreasurerInheritance: 'LARIMER_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER',
  noWeldTreasurerInheritance: 'WELD_TREASURER_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER',
  noBroomfieldAssessorInheritance: 'BROOMFIELD_ASSESSOR_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_TREASURER',
  rawData: 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
});

export function convertBroomfieldCountyTreasurerSourceQualityEvidence() {
  return convertCountyStructuredEvidence(BROOMFIELD_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeBroomfieldCountyTreasurerSourceQualityEvidence() {
  const conversion = convertBroomfieldCountyTreasurerSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: BROOMFIELD_COUNTY_TREASURER_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeBroomfieldCountyTreasurerSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeBroomfieldCountyTreasurerSourceQualityEvidence());
}

export function createBroomfieldCountyTreasurerSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountySourceQualityAssemblyRequest(convertBroomfieldCountyTreasurerSourceQualityEvidence());
  if (!request) throw new Error('Exact Broomfield Treasurer conversion must produce a sparse canonical assembly request.');
  return request;
}
