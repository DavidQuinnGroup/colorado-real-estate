import {
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
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

export { BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID };

export const BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-16' as const;
export const BROOMFIELD_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-BROOMFIELD-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1',
  sourceId: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-BROOMFIELD-COUNTY-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL = Object.freeze({
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
  noBoulderInheritance: 'BOULDER_SOURCE_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_ASSESSOR',
  noArapahoeInheritance: 'ARAPAHOE_SOURCE_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_ASSESSOR',
  noCityCountyAggregation: 'CONSOLIDATED_CITY_COUNTY_STATUS_NOT_SOURCE_AGGREGATION_AUTHORITY',
  rawData: 'RAW_COUNTY_PROPERTY_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
});

export function convertBroomfieldCountyAssessorSourceQualityEvidence() {
  return convertCountyStructuredEvidence(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeBroomfieldCountyAssessorSourceQualityEvidence() {
  const conversion = convertBroomfieldCountyAssessorSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeBroomfieldCountyAssessorSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeBroomfieldCountyAssessorSourceQualityEvidence());
}

export function createBroomfieldCountyAssessorSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountySourceQualityAssemblyRequest(convertBroomfieldCountyAssessorSourceQualityEvidence());
  if (!request) throw new Error('Exact Broomfield Assessor conversion must produce a sparse canonical assembly request.');
  return request;
}
