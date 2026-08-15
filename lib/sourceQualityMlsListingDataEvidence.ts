import {
  SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
  normalizeSourceEvidence,
  type SourceEvidenceCertificationReference,
  type SourceEvidenceLinkageRecord,
} from './sourceQualityEvidenceNormalization';
import { summarizeSourceQuality } from './sourceQualityControl';
import {
  SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
  type SourceQualitySummaryAssemblyRequest,
} from './sourceQualitySummaryAssembly';

export const MLS_LISTING_DATA_SOURCE_ID = 'SRC-MLS-LISTING-DATA' as const;
export const MLS_LISTING_DATA_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-15' as const;
export const MLS_LISTING_DATA_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-MLS-LISTING-DATA-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: MLS_LISTING_DATA_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES: readonly SourceEvidenceLinkageRecord[] = Object.freeze([
  {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId: MLS_LISTING_DATA_SOURCE_ID,
    evidenceClass: 'CERTIFICATION',
    authoritativeContractType: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-MLS-LISTING-DATA-CERT-001',
    repositoryReference: 'docs/project-atlas/executive-library',
    relationshipType: 'CERTIFICATION',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    certificationReference: MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION,
    lastReviewedDate: MLS_LISTING_DATA_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
    limitationCodes: [],
    linkageProvenance: 'CERTIFICATION_REFERENCE_ONLY',
  },
]);

export const MLS_LISTING_DATA_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryActivation: 'SOURCE_REGISTRY_ACTIVATION_NOT_SOURCE_QUALITY_CERTIFICATION',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_MANIFEST',
});

export function normalizeMlsListingDataSourceQualityEvidence() {
  return normalizeSourceEvidence({
    sourceId: MLS_LISTING_DATA_SOURCE_ID,
    linkages: MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES,
  });
}

export function summarizeMlsListingDataSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeMlsListingDataSourceQualityEvidence());
}

export function createMlsListingDataSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  return {
    schemaVersion: SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
    assemblyId: 'SQS-MLS-LISTING-DATA-SOURCE-QUALITY-EVIDENCE-001',
    coverageClass: 'PARTIAL_REVIEWED_SOURCE_SET',
    certificationReference: MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION,
    entries: [
      {
        sourceId: MLS_LISTING_DATA_SOURCE_ID,
        inclusionPosture: 'EXPLICITLY_SUPPLIED_SPARSE_REVIEW_SOURCE',
        linkages: MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES,
        certificationReference: MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION,
      },
    ],
  };
}
