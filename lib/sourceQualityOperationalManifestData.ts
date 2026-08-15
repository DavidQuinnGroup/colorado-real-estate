import type { SourceEvidenceCertificationReference, SourceEvidenceLinkageRecord } from './sourceQualityEvidenceNormalization';
import {
  MLS_LISTING_DATA_SOURCE_ID,
  MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION,
  MLS_LISTING_DATA_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES,
} from './sourceQualityMlsListingDataEvidence';
import {
  SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
  type SourceQualityOperationalManifestInput,
} from './sourceQualityOperationalManifest';

const reviewedAt = '2026-08-15';
const manifestId = 'SQOM-INITIAL-001';

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
  ],
};
