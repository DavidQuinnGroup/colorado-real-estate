import type { SourceEvidenceCertificationReference, SourceEvidenceLinkageRecord } from './sourceQualityEvidenceNormalization';
import {
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  convertBoulderCountyAccelaPermitsSourceQualityEvidence,
} from './sourceQualityBoulderCountyAccelaPermitsEvidence';
import {
  BCOD_ADDRESS_POINTS_SOURCE_ID,
  BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CERTIFICATION,
  BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  convertBcodAddressPointsSourceQualityEvidence,
} from './sourceQualityBcodAddressPointsEvidence';
import {
  BCOD_PARK_BOUNDARIES_SOURCE_ID,
  BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_CERTIFICATION,
  BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  convertBcodParkBoundariesSourceQualityEvidence,
} from './sourceQualityBcodParkBoundariesEvidence';
import {
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  convertBoulderCountyAssessorSourceQualityEvidence,
} from './sourceQualityBoulderCountyAssessorEvidence';
import {
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  convertBoulderCountyParcelGisSourceQualityEvidence,
} from './sourceQualityBoulderCountyParcelGisEvidence';
import {
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  convertBoulderCountyRecorderIndexSourceQualityEvidence,
} from './sourceQualityBoulderCountyRecorderIndexEvidence';
import {
  BOULDER_COUNTY_TREASURER_SOURCE_ID,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  convertBoulderCountyTreasurerSourceQualityEvidence,
} from './sourceQualityBoulderCountyTreasurerEvidence';
import {
  CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID,
  CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_CERTIFICATION,
  CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  convertCityBoulderBuildingPermitsPortalSourceQualityEvidence,
} from './sourceQualityCityBoulderBuildingPermitsPortalEvidence';
import {
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CERTIFICATION,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  convertCityBoulderOpenDataPermitsSourceQualityEvidence,
} from './sourceQualityCityBoulderOpenDataPermitsEvidence';
import {
  MLS_LISTING_DATA_SOURCE_ID,
  MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION,
  MLS_LISTING_DATA_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES,
} from './sourceQualityMlsListingDataEvidence';
import {
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_CERTIFICATION,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES,
} from './sourceQualityMunicipalPlanningContextEvidence';
import {
  SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
  type SourceQualityOperationalManifestInput,
} from './sourceQualityOperationalManifest';

const reviewedAt = '2026-08-15';
const manifestId = 'SQOM-INITIAL-001';
const boulderCountyAccelaPermitsEvidence = convertBoulderCountyAccelaPermitsSourceQualityEvidence();
const boulderCountyAssessorEvidence = convertBoulderCountyAssessorSourceQualityEvidence();
const boulderCountyRecorderIndexEvidence = convertBoulderCountyRecorderIndexSourceQualityEvidence();
const boulderCountyTreasurerEvidence = convertBoulderCountyTreasurerSourceQualityEvidence();
const bcodAddressPointsEvidence = convertBcodAddressPointsSourceQualityEvidence();
const bcodParkBoundariesEvidence = convertBcodParkBoundariesSourceQualityEvidence();
const boulderCountyParcelGisEvidence = convertBoulderCountyParcelGisSourceQualityEvidence();
const cityBoulderBuildingPermitsPortalEvidence = convertCityBoulderBuildingPermitsPortalSourceQualityEvidence();
const cityBoulderOpenDataPermitsEvidence = convertCityBoulderOpenDataPermitsSourceQualityEvidence();

const certificationReference: SourceEvidenceCertificationReference = {
  certificationId: 'CERT-SQOM-INITIAL-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: reviewedAt,
};

function certificationLinkage(sourceId: string, evidenceReferenceId: string): SourceEvidenceLinkageRecord {
  return {
    schemaVersion: 'REIE_SOURCE_QUALITY_EVIDENCE_NORMALIZATION_V1',
    sourceId,
    evidenceClass: 'CERTIFICATION',
    authoritativeContractType: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId,
    repositoryReference: 'docs/project-atlas/executive-library',
    relationshipType: 'CERTIFICATION',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    certificationReference,
    lastReviewedDate: reviewedAt,
    limitationCodes: [],
    linkageProvenance: 'CERTIFICATION_REFERENCE_ONLY',
  };
}

export const SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA: SourceQualityOperationalManifestInput = {
  schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
  manifestId,
  coverageClass: 'PARTIAL_REVIEWED_SOURCE_SET',
  suppliedDatasetScope: 'SUPPLIED_MANIFEST_ONLY',
  operationalPosture: 'OPERATIONAL_INPUT_POSTURE_ONLY',
  completenessClaim: 'NO_COMPLETENESS_CLAIM',
  reviewedAt,
  reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
  certificationReference,
  entries: [
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: 'SRC-REIE-FINANCING-SCENARIO-CALCULATOR',
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: [certificationLinkage('SRC-REIE-FINANCING-SCENARIO-CALCULATOR', 'SQOM-CERT-FINANCE-001')],
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference,
      reviewedAt,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE',
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: [certificationLinkage('SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE', 'SQOM-CERT-COMPARISON-001')],
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference,
      reviewedAt,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: MLS_LISTING_DATA_SOURCE_ID,
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES,
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference: MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION,
      reviewedAt: MLS_LISTING_DATA_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES,
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference: MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_CERTIFICATION,
      reviewedAt: MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: boulderCountyAssessorEvidence.linkages,
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference: BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
      reviewedAt: BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: BOULDER_COUNTY_TREASURER_SOURCE_ID,
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: boulderCountyTreasurerEvidence.linkages,
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference: BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
      reviewedAt: BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: boulderCountyAccelaPermitsEvidence.linkages,
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference: BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CERTIFICATION,
      reviewedAt: BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID,
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: cityBoulderOpenDataPermitsEvidence.linkages,
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference: CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CERTIFICATION,
      reviewedAt: CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID,
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: cityBoulderBuildingPermitsPortalEvidence.linkages,
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference: CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_CERTIFICATION,
      reviewedAt: CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID,
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: boulderCountyRecorderIndexEvidence.linkages,
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference: BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CERTIFICATION,
      reviewedAt: BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: BCOD_ADDRESS_POINTS_SOURCE_ID,
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: bcodAddressPointsEvidence.linkages,
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference: BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CERTIFICATION,
      reviewedAt: BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: BCOD_PARK_BOUNDARIES_SOURCE_ID,
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: bcodParkBoundariesEvidence.linkages,
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference: BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_CERTIFICATION,
      reviewedAt: BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
    {
      schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
      manifestId,
      sourceId: BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID,
      inclusionClass: 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS',
      linkages: boulderCountyParcelGisEvidence.linkages,
      expectedEvidenceClasses: ['CERTIFICATION'],
      certificationReference: BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CERTIFICATION,
      reviewedAt: BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
      reviewAuthorityClass: 'DELEGATED_SOURCE_GOVERNANCE_REVIEW',
      limitationCodes: [],
    },
  ],
};
