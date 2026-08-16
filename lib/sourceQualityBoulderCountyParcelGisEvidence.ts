import {
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID,
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

export { BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID };

export const BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-16' as const;
export const BOULDER_COUNTY_PARCEL_GIS_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-BOULDER-COUNTY-PARCEL-GIS-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST = Object.freeze<CountyGeospatialSourceQualityEvidenceConversionRequest>({
  schemaVersion: 'REIE_SOURCE_QUALITY_COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_V1',
  sourceId: BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID,
  sourceClass: 'COUNTY_GIS_PARCEL_GEOMETRY',
  sourceConfirmation: {
    sourceId: BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  },
  evidenceReferences: [{
    sourceId: BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-BOULDER-COUNTY-PARCEL-GIS-CERT-001',
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
  certificationReference: BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CERTIFICATION,
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'DELEGATED_COUNTY_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryStatus: 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION',
  registryAuthorization: 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION',
  registryActivation: 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  retrieval: 'GIS_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE',
  rawGisData: 'RAW_GIS_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE',
  parcelOwnershipFirewall: 'PARCEL_GEOMETRY_NOT_OWNERSHIP',
  parcelLegalDescriptionFirewall: 'PARCEL_GEOMETRY_NOT_LEGAL_DESCRIPTION',
  parcelAssessorFirewall: 'PARCEL_GEOMETRY_NOT_ASSESSOR_RECORD',
  parcelTitleFirewall: 'PARCEL_GEOMETRY_NOT_TITLE',
  gisDatasetUseAuthority: 'GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY',
  openDataFallacy: 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  addressPointsInheritance: 'NO_INHERITANCE_FROM_ADDRESS_POINTS',
  parkBoundaryInheritance: 'NO_INHERITANCE_FROM_PARK_BOUNDARIES',
  assessorInheritance: 'NO_INHERITANCE_FROM_BOULDER_COUNTY_ASSESSOR',
  recorderInheritance: 'NO_INHERITANCE_FROM_BOULDER_COUNTY_RECORDER',
  treasurerInheritance: 'NO_INHERITANCE_FROM_BOULDER_COUNTY_TREASURER',
  permitInheritance: 'NO_INHERITANCE_FROM_PERMIT_SOURCES',
});

export function convertBoulderCountyParcelGisSourceQualityEvidence() {
  return convertCountyGeospatialStructuredEvidence(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CONVERSION_REQUEST);
}

export function normalizeBoulderCountyParcelGisSourceQualityEvidence() {
  const conversion = convertBoulderCountyParcelGisSourceQualityEvidence();
  return normalizeSourceEvidence({
    sourceId: BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID,
    linkages: conversion.linkages,
  });
}

export function summarizeBoulderCountyParcelGisSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeBoulderCountyParcelGisSourceQualityEvidence());
}

export function createBoulderCountyParcelGisSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  const request = createCountyGeospatialSourceQualityAssemblyRequest(convertBoulderCountyParcelGisSourceQualityEvidence());
  if (!request) throw new Error('Exact Boulder County Parcel GIS conversion must produce a sparse canonical assembly request.');
  return request;
}
