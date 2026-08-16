import {
  ADAMS_COUNTY_ASSESSOR_SOURCE_ID,
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

export { ADAMS_COUNTY_ASSESSOR_SOURCE_ID };

export const ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-16' as const;
export const ADAMS_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-ADAMS-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1',
  sourceId: ADAMS_COUNTY_ASSESSOR_SOURCE_ID,
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: ADAMS_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: ADAMS_COUNTY_ASSESSOR_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-ADAMS-COUNTY-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  publicSearchAuthority: 'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY',
  publicAccessAuthority: 'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY',
  propertyPortal: 'PROPERTY_PORTAL_NOT_AUTOMATION_AUTHORITY',
  assessorGis: 'ASSESSOR_GIS_NOT_ASSESSOR_RECORD_AUTHORITY',
  assessorDataDump: 'ASSESSOR_DATA_DUMP_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  downloadableGisData: 'DOWNLOADABLE_GIS_DATA_NOT_UNRESTRICTED_OR_REUSE_READY',
  assessorRecordNotTitle: 'ASSESSOR_RECORD_NOT_TITLE',
  assessorRecordNotDeedValidity: 'ASSESSOR_RECORD_NOT_DEED_VALIDITY',
  assessorRecordNotTreasurerTaxStatus: 'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS',
  assessorRecordNotCurrentOwnershipGuarantee: 'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE',
  assessedValueNotMarketValue: 'ASSESSED_VALUE_NOT_MARKET_VALUE',
  notTreasurer: 'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER',
  notPublicTrustee: 'COUNTY_ASSESSOR_NOT_PUBLIC_TRUSTEE',
  notRecorder: 'COUNTY_ASSESSOR_NOT_RECORDER',
  notPlanningOrZoning: 'COUNTY_ASSESSOR_NOT_PLANNING_OR_ZONING',
  notPermits: 'COUNTY_ASSESSOR_NOT_PERMITS',
  notParcelGis: 'COUNTY_ASSESSOR_NOT_PARCEL_GIS',
  noBoulderInheritance: 'BOULDER_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR',
  noArapahoeInheritance: 'ARAPAHOE_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR',
  noBroomfieldInheritance: 'BROOMFIELD_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR',
  noJeffersonInheritance: 'JEFFERSON_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR',
  noLarimerInheritance: 'LARIMER_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR',
  noWeldInheritance: 'WELD_SOURCE_FINDINGS_NOT_INHERITED_BY_ADAMS_ASSESSOR',
  rawData: 'RAW_COUNTY_PROPERTY_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
});

export function convertAdamsCountyAssessorSourceQualityEvidence() {
  return convertCountyStructuredEvidence(ADAMS_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeAdamsCountyAssessorSourceQualityEvidence() {
  const conversion = convertAdamsCountyAssessorSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: ADAMS_COUNTY_ASSESSOR_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeAdamsCountyAssessorSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeAdamsCountyAssessorSourceQualityEvidence());
}

export function createAdamsCountyAssessorSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountySourceQualityAssemblyRequest(convertAdamsCountyAssessorSourceQualityEvidence());
  if (!request) throw new Error('Exact Adams Assessor conversion must produce a sparse canonical assembly request.');
  return request;
}
