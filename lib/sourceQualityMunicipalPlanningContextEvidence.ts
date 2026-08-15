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

export const MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID = 'SRC-MUNICIPAL-PLANNING-CONTEXT' as const;
export const MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT = '2026-08-15' as const;
export const MUNICIPAL_PLANNING_CONTEXT_MANIFEST_ELIGIBILITY = 'READY_WITH_KNOWN_GAPS' as const;

export const MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_CERTIFICATION: SourceEvidenceCertificationReference = Object.freeze({
  certificationId: 'CERT-MUNICIPAL-PLANNING-CONTEXT-SOURCE-QUALITY-EVIDENCE-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
});

export const MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES: readonly SourceEvidenceLinkageRecord[] = Object.freeze([
  {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId: MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
    evidenceClass: 'CERTIFICATION',
    authoritativeContractType: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'SQE-MUNICIPAL-PLANNING-CONTEXT-CERT-001',
    repositoryReference: 'docs/project-atlas/executive-library',
    relationshipType: 'CERTIFICATION',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    certificationReference: MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_CERTIFICATION,
    lastReviewedDate: MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
    limitationCodes: [],
    linkageProvenance: 'CERTIFICATION_REFERENCE_ONLY',
  },
]);

export const MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_FIREWALL = Object.freeze({
  registryActivation: 'SOURCE_REGISTRY_ACTIVATION_NOT_SOURCE_QUALITY_CERTIFICATION',
  sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST',
  customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_MANIFEST',
  publicSourceFallacy: 'PUBLIC_OR_MUNICIPAL_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
});

export function normalizeMunicipalPlanningContextSourceQualityEvidence() {
  return normalizeSourceEvidence({
    sourceId: MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
    linkages: MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES,
  });
}

export function summarizeMunicipalPlanningContextSourceQualityEvidence() {
  return summarizeSourceQuality(normalizeMunicipalPlanningContextSourceQualityEvidence());
}

export function createMunicipalPlanningContextSourceQualityAssemblyRequest(): SourceQualitySummaryAssemblyRequest {
  return {
    schemaVersion: SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
    assemblyId: 'SQS-MUNICIPAL-PLANNING-CONTEXT-SOURCE-QUALITY-EVIDENCE-001',
    coverageClass: 'PARTIAL_REVIEWED_SOURCE_SET',
    certificationReference: MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_CERTIFICATION,
    entries: [
      {
        sourceId: MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
        inclusionPosture: 'EXPLICITLY_SUPPLIED_SPARSE_REVIEW_SOURCE',
        linkages: MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES,
        certificationReference: MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_CERTIFICATION,
      },
    ],
  };
}
