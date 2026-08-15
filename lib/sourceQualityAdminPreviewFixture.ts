import {
  SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
  type SourceEvidenceCertificationReference,
  type SourceEvidenceLinkageRecord,
} from './sourceQualityEvidenceNormalization';
import {
  SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
  type SourceQualitySummaryAssemblyRequest,
} from './sourceQualitySummaryAssembly';

export const SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE_POSTURE = 'PREVIEW_FIXTURE_ONLY' as const;

const reviewedDate = '2026-08-15';

const certification: SourceEvidenceCertificationReference = {
  certificationId: 'CERT-PREVIEW-FIXTURE',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: reviewedDate,
};

function linkages(sourceId: string, suffix: string): SourceEvidenceLinkageRecord[] {
  return [
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'SOURCE_RIGHTS_READINESS', authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT', evidenceReferenceId: 'FIX-RIGHTS-' + suffix, repositoryReference: 'lib/sourceRightsActivationReadiness.ts', relationshipType: 'RIGHTS', posture: 'VERIFIED', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'PROVIDER_INVENTORY', authoritativeContractType: 'PROVIDER_INVENTORY_CONTRACT', evidenceReferenceId: 'FIX-TECH-' + suffix, repositoryReference: 'lib/geographic-intelligence/providerInventoryContract.ts', relationshipType: 'TECHNICAL_ACCESS', posture: 'READY', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'DOMAIN_FRESHNESS', authoritativeContractType: 'DOMAIN_FRESHNESS_CONTRACT', evidenceReferenceId: 'FIX-FRESH-' + suffix, repositoryReference: 'DOMAIN_STRUCTURED_CONTRACT', relationshipType: 'FRESHNESS', posture: 'VERIFIED_CURRENT', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'SOURCE_RIGHTS_READINESS', authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT', evidenceReferenceId: 'FIX-ATTR-' + suffix, repositoryReference: 'lib/sourceRightsActivationReadiness.ts', relationshipType: 'ATTRIBUTION', posture: 'NONE_DOCUMENTED', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'EVIDENCE_DEPTH', authoritativeContractType: 'EVIDENCE_DEPTH_CONTRACT', evidenceReferenceId: 'FIX-PROV-' + suffix, repositoryReference: 'lib/evidence-depth/evidencePosture.ts', relationshipType: 'PROVENANCE', posture: 'COMPLETE', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'CERTIFICATION', authoritativeContractType: 'CERTIFICATION_REFERENCE', evidenceReferenceId: 'FIX-CERT-' + suffix, repositoryReference: 'docs/project-atlas/executive-library', relationshipType: 'CERTIFICATION', posture: 'REFERENCED', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'CERTIFICATION_REFERENCE_ONLY' },
  ];
}

const completeSource = 'SRC-MUNICIPAL-PLANNING-CONTEXT';
const reviewSource = 'SRC-REIE-FINANCING-SCENARIO-CALCULATOR';
const conflictSource = 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE';
const insufficientSource = 'SRC-BOULDER-PERMIT-CANDIDATES';

const reviewLinkages = linkages(reviewSource, 'REVIEW').map((linkage) => linkage.relationshipType === 'ATTRIBUTION'
  ? { ...linkage, posture: 'REQUIRED' as const, limitationCodes: ['ATTRIBUTION_REQUIRED'] as const }
  : linkage) as SourceEvidenceLinkageRecord[];
const conflictBase = linkages(conflictSource, 'CONFLICT');
const conflictLinkages: SourceEvidenceLinkageRecord[] = [...conflictBase, { ...conflictBase[0], evidenceReferenceId: 'FIX-RIGHTS-CONFLICT', posture: 'RESTRICTED', limitationCodes: ['RIGHTS_RESTRICTED'] } as SourceEvidenceLinkageRecord];
const insufficientLinkages = linkages(insufficientSource, 'INSUFFICIENT').filter((linkage) => linkage.relationshipType !== 'CERTIFICATION');

export const SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE: SourceQualitySummaryAssemblyRequest = {
  schemaVersion: SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
  assemblyId: 'SQS-ADMIN-PREVIEW-FIXTURE',
  coverageClass: 'PARTIAL_REVIEWED_SOURCE_SET',
  certificationReference: certification,
  entries: [
    { sourceId: completeSource, inclusionPosture: 'EXPLICITLY_SUPPLIED_REVIEWED_SOURCE', linkages: linkages(completeSource, 'COMPLETE'), certificationReference: certification },
    { sourceId: reviewSource, inclusionPosture: 'EXPLICITLY_SUPPLIED_REVIEWED_SOURCE', linkages: reviewLinkages, certificationReference: certification },
    { sourceId: conflictSource, inclusionPosture: 'EXPLICITLY_SUPPLIED_REVIEWED_SOURCE', linkages: conflictLinkages, certificationReference: certification },
    { sourceId: insufficientSource, inclusionPosture: 'EXPLICITLY_SUPPLIED_SPARSE_REVIEW_SOURCE', linkages: insufficientLinkages, certificationReference: certification },
  ],
};
