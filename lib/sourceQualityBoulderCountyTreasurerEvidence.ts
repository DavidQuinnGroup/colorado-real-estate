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

export const BOULDER_COUNTY_TREASURER_SOURCE_ID = 'SRC-BOULDER-COUNTY-TREASURER' as const;
export const BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-15' as const;
export const BOULDER_COUNTY_TREASURER_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-BOULDER-COUNTY-TREASURER-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1',
  sourceId: BOULDER_COUNTY_TREASURER_SOURCE_ID,
  sourceClass: 'COUNTY_TREASURER',
  sourceConfirmation: {
    sourceId: BOULDER_COUNTY_TREASURER_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: BOULDER_COUNTY_TREASURER_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-BOULDER-COUNTY-TREASURER-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'IDENTIFIER_BEARING_CONTEXT',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  registryTermsReview: 'TERMS_REVIEW_REQUIRED_NOT_RESOLVED_BY_EVIDENCE_PACKAGE',
  registryActivation: 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  retrieval: 'SCRAPING_OR_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  rawData: 'RAW_TAX_PROPERTY_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
});

export function convertBoulderCountyTreasurerSourceQualityEvidence() {
  return convertCountyStructuredEvidence(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeBoulderCountyTreasurerSourceQualityEvidence() {
  const conversion = convertBoulderCountyTreasurerSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: BOULDER_COUNTY_TREASURER_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeBoulderCountyTreasurerSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeBoulderCountyTreasurerSourceQualityEvidence());
}

export function createBoulderCountyTreasurerSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountySourceQualityAssemblyRequest(convertBoulderCountyTreasurerSourceQualityEvidence());
  if (!request) throw new Error('Exact Treasurer conversion must produce a sparse canonical assembly request.');
  return request;
}
