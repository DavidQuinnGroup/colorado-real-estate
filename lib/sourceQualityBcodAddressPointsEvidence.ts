import {
  BCOD_ADDRESS_POINTS_SOURCE_ID,
  convertCountyGeospatialStructuredEvidence,
  createCountyGeospatialSourceQualityAssemblyRequest,
  type CountyGeospatialSourceQualityEvidenceConversionRequest,
} from './sourceQualityCountyGeospatialEvidenceConversionContract';
import {
  normalizeSourceEvidence,
  type SourceEvidenceCertificationReference,
} from './sourceQualityEvidenceNormalization';
import { summarizeSourceQuality } from './sourceQualityControl';
import type { SourceQualitySummaryAssemblyRequest } from './sourceQualitySummaryAssembly';

export { BCOD_ADDRESS_POINTS_SOURCE_ID };

export const BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-16' as const;
export const BCOD_ADDRESS_POINTS_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-BCOD-ADDRESS-POINTS-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountyGeospatialSourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_V1',
  sourceId: BCOD_ADDRESS_POINTS_SOURCE_ID,
  sourceClass: 'COUNTY_GIS_ADDRESS_POINTS',
  sourceConfirmation: {
    sourceId: BCOD_ADDRESS_POINTS_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: BCOD_ADDRESS_POINTS_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-BCOD-ADDRESS-POINTS-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [
      'RIGHTS_PENDING',
      'TECHNICAL_ACCESS_PENDING',
      'FRESHNESS_DOMAIN_SPECIFIC',
      'ATTRIBUTION_PENDING_CONFIRMATION',
      'PROVENANCE_INCOMPLETE',
    ],
  }],
  certificationReference: BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'DELEGATED_COUNTY_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  registryAuthorization: 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION',
  registryActivation: 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  retrieval: 'GIS_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  rawGisData: 'RAW_GIS_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  addressPointParcelFirewall: 'ADDRESS_POINT_NOT_PARCEL_CONFIRMATION',
  coordinateDisplayAuthority: 'COORDINATE_NOT_CUSTOMER_DISPLAY_AUTHORITY',
  gisDatasetUseAuthority: 'GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY',
  openDataFallacy: 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  parcelInheritance: 'NO_INHERITANCE_FROM_BOULDER_COUNTY_PARCEL_GIS',
  parkBoundaryInheritance: 'NO_INHERITANCE_FROM_BCOD_PARK_BOUNDARIES',
  assessorInheritance: 'NO_INHERITANCE_FROM_BOULDER_COUNTY_ASSESSOR',
  recorderInheritance: 'NO_INHERITANCE_FROM_BOULDER_COUNTY_RECORDER',
  treasurerInheritance: 'NO_INHERITANCE_FROM_BOULDER_COUNTY_TREASURER',
  permitInheritance: 'NO_INHERITANCE_FROM_PERMIT_SOURCES',
});

export function convertBcodAddressPointsSourceQualityEvidence() {
  return convertCountyGeospatialStructuredEvidence(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeBcodAddressPointsSourceQualityEvidence() {
  const conversion = convertBcodAddressPointsSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: BCOD_ADDRESS_POINTS_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeBcodAddressPointsSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeBcodAddressPointsSourceQualityEvidence());
}

export function createBcodAddressPointsSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountyGeospatialSourceQualityAssemblyRequest(convertBcodAddressPointsSourceQualityEvidence());
  if (!request) throw new Error('Exact BCOD Address Points conversion must produce a sparse canonical assembly request.');
  return request;
}
