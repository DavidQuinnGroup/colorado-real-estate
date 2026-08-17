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
import { LARIMER_COUNTY_TREASURER_SOURCE_ID } from './sourceQualityCountyTreasurerExactSourceDefinitions';

export { LARIMER_COUNTY_TREASURER_SOURCE_ID };
export const LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-17' as const;
export const LARIMER_COUNTY_TREASURER_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-LARIMER-COUNTY-TREASURER-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1',
  sourceId: LARIMER_COUNTY_TREASURER_SOURCE_ID,
  sourceClass: 'COUNTY_TREASURER',
  sourceConfirmation: {
    sourceId: LARIMER_COUNTY_TREASURER_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: LARIMER_COUNTY_TREASURER_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-LARIMER-COUNTY-TREASURER-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  registryActivation: 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  taxSearch: 'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY',
  payment: 'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY',
  taxCurrentness: 'TAX_CURRENTNESS_SOURCE_SPECIFIC',
  feeStatus: 'TREASURER_FEE_STATUS_SOURCE_SPECIFIC',
  combinedOffice: 'LARIMER_TREASURER_PUBLIC_TRUSTEE_COMBINED_OFFICE_NOT_COMBINED_SOURCE_AUTHORITY',
  scheduledMaintenance: 'LARIMER_SCHEDULED_MAINTENANCE_NOT_CURRENTNESS_GUARANTEE',
  currentStatements: 'LARIMER_CURRENT_STATEMENTS_NOT_COMPLETE_TAX_HISTORY',
  delinquentStatements: 'LARIMER_DELINQUENT_STATEMENTS_SOURCE_SPECIFIC',
  manufacturedHomeTax: 'LARIMER_MANUFACTURED_HOME_TAX_CHANNEL_SEPARATE',
  specialAssessment: 'LARIMER_SPECIAL_ASSESSMENT_CHANNEL_SEPARATE',
  exemptionDeferral: 'LARIMER_EXEMPTION_DEFERRAL_NOT_TAX_STATUS_CLEARANCE',
  paymentChannel: 'LARIMER_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY',
  foreclosureRelease: 'LARIMER_FORECLOSURE_RELEASE_NOT_TREASURER_RECORD_AUTHORITY',
  publicTrustee: 'LARIMER_PUBLIC_TRUSTEE_NOT_TREASURER_DATA_AUTHORITY',
  notAssessor: 'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY',
  notTitle: 'TREASURER_RECORD_NOT_TITLE',
  notRecorder: 'TREASURER_RECORD_NOT_RECORDER_INDEX',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  noBoulderTreasurerInheritance: 'BOULDER_TREASURER_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER',
  noArapahoeTreasurerInheritance: 'ARAPAHOE_TREASURER_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER',
  noAdamsTreasurerInheritance: 'ADAMS_TREASURER_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER',
  noJeffersonTreasurerInheritance: 'JEFFERSON_TREASURER_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER',
  noWeldTreasurerInheritance: 'WELD_TREASURER_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER',
  noLarimerAssessorInheritance: 'LARIMER_ASSESSOR_FINDINGS_NOT_INHERITED_BY_LARIMER_TREASURER',
  rawData: 'RAW_TAX_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
});

export function convertLarimerCountyTreasurerSourceQualityEvidence() {
  return convertCountyStructuredEvidence(LARIMER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeLarimerCountyTreasurerSourceQualityEvidence() {
  const conversion = convertLarimerCountyTreasurerSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: LARIMER_COUNTY_TREASURER_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeLarimerCountyTreasurerSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeLarimerCountyTreasurerSourceQualityEvidence());
}

export function createLarimerCountyTreasurerSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountySourceQualityAssemblyRequest(convertLarimerCountyTreasurerSourceQualityEvidence());
  if (!request) throw new Error('Exact Larimer Treasurer conversion must produce a sparse canonical assembly request.');
  return request;
}
