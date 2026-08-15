import {
  convertPublicRecordStructuredEvidence,
  createPublicRecordSourceQualityAssemblyRequest,
  type PublicRecordSourceQualityEvidenceConversionRequest,
} from './sourceQualityPublicRecordEvidenceConversionContract';
import {
  normalizeSourceEvidence,
  type SourceEvidenceCertificationReference,
} from './sourceQualityEvidenceNormalization';
import { summarizeSourceQuality } from './sourceQualityControl';
import type { SourceQualitySummaryAssemblyRequest } from './sourceQualitySummaryAssembly';

export const CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID = 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS' as const;
export const CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-15' as const;
export const CITY_BOULDER_OPEN_DATA_PERMITS_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-CITY-BOULDER-OPEN-DATA-PERMITS-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<PublicRecordSourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1',
  sourceId: CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID,
  sourceClass: 'MUNICIPAL_OPEN_DATA_PERMIT',
  sourceConfirmation: {
    sourceId: CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-CITY-BOULDER-OPEN-DATA-PERMITS-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'IDENTIFIER_BEARING_CONTEXT',
  conversionAuthorityClass: 'EXECUTIVE_PUBLIC_RECORD_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  registryAuthorization: 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION',
  registryActivation: 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  retrieval: 'SCRAPING_OR_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  redistribution: 'REDISTRIBUTION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  openDataFallacy: 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY',
  rawData: 'RAW_PERMIT_PROPERTY_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
});

export function convertCityBoulderOpenDataPermitsSourceQualityEvidence() {
  return convertPublicRecordStructuredEvidence(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeCityBoulderOpenDataPermitsSourceQualityEvidence() {
  const conversion = convertCityBoulderOpenDataPermitsSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeCityBoulderOpenDataPermitsSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeCityBoulderOpenDataPermitsSourceQualityEvidence());
}

export function createCityBoulderOpenDataPermitsSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createPublicRecordSourceQualityAssemblyRequest(convertCityBoulderOpenDataPermitsSourceQualityEvidence());
  if (!request) throw new Error('Exact City Open Data conversion must produce a sparse canonical assembly request.');
  return request;
}
