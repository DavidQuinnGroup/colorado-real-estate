import {
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
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

export { ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID };

export const ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-16' as const;
export const ARAPAHOE_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-ARAPAHOE-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1',
  sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-ARAPAHOE-COUNTY-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  publicSearchAuthority: 'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY',
  publicAccessAuthority: 'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY',
  assessorRecordNotTitle: 'ASSESSOR_RECORD_NOT_TITLE',
  assessorRecordNotDeedValidity: 'ASSESSOR_RECORD_NOT_DEED_VALIDITY',
  assessorRecordNotTreasurerTaxStatus: 'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS',
  assessorRecordNotCurrentOwnershipGuarantee: 'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE',
  assessedValueNotMarketValue: 'ASSESSED_VALUE_NOT_MARKET_VALUE',
  notTreasurer: 'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER',
  notRecorder: 'COUNTY_ASSESSOR_NOT_RECORDER',
  notParcelGis: 'COUNTY_ASSESSOR_NOT_PARCEL_GIS',
  noBoulderInheritance: 'BOULDER_SOURCE_FINDINGS_NOT_INHERITED_BY_ARAPAHOE_ASSESSOR',
  rawData: 'RAW_COUNTY_PROPERTY_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
});

export function convertArapahoeCountyAssessorSourceQualityEvidence() {
  return convertCountyStructuredEvidence(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeArapahoeCountyAssessorSourceQualityEvidence() {
  const conversion = convertArapahoeCountyAssessorSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeArapahoeCountyAssessorSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeArapahoeCountyAssessorSourceQualityEvidence());
}

export function createArapahoeCountyAssessorSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountySourceQualityAssemblyRequest(convertArapahoeCountyAssessorSourceQualityEvidence());
  if (!request) throw new Error('Exact Arapahoe Assessor conversion must produce a sparse canonical assembly request.');
  return request;
}
