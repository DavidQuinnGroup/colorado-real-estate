import type {
  AttributionPosture,
  CertificationPosture,
  FreshnessPosture,
  LinkagePosture,
  NormalizedSourceEvidence,
  ProvenancePosture,
  RightsPosture,
  SourceEvidenceLimitationCode,
  TechnicalAccessPosture,
} from './sourceQualityEvidenceNormalization';

export const SOURCE_QUALITY_CONTROL_SUMMARY_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_CONTROL_SUMMARY_V1' as const;

export type SourceQualitySummaryClassification =
  | 'REVIEW_POSTURE_COMPLETE'
  | 'REVIEW_REQUIRED'
  | 'INSUFFICIENT_EVIDENCE'
  | 'CONFLICT_REQUIRES_REVIEW'
  | 'INVALID_SOURCE_EVIDENCE';

export type SourceQualityHumanReviewReason =
  | 'RIGHTS_REVIEW_REQUIRED'
  | 'TECHNICAL_ACCESS_REVIEW_REQUIRED'
  | 'FRESHNESS_REVIEW_REQUIRED'
  | 'STALE_VERIFICATION_REVIEW_REQUIRED'
  | 'ATTRIBUTION_REVIEW_REQUIRED'
  | 'PROVENANCE_REVIEW_REQUIRED'
  | 'CERTIFICATION_REVIEW_REQUIRED'
  | 'LINKAGE_REVIEW_REQUIRED'
  | 'CONFLICT_REVIEW_REQUIRED';

export type SourceQualitySummaryFailureReason =
  | 'INVALID_NORMALIZATION_INPUT'
  | 'MISSING_CANONICAL_SOURCE_ID'
  | 'INVALID_NORMALIZATION_RESULT'
  | 'MALFORMED_CONTROLLED_REFERENCE';

export type SourceQualityReviewSummary = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_CONTROL_SUMMARY_SCHEMA_VERSION;
  classification: SourceQualitySummaryClassification;
  source: Readonly<{
    sourceId: string;
    sourceClass: string;
    responsibleOrganization: string;
    coverage: 'NOT_EXPOSED_BY_CANONICAL_NORMALIZATION';
    declaredActivationPosture: string;
    permittedUse: string;
    canonicalClaimEligible: boolean;
    canonicalCustomerDisclosureEligible: boolean;
    sourcePaths: readonly string[];
    freshnessExpectation: string;
    lastSourceVerificationDate: string;
    lastSuccessfulDataRefresh: string | null;
  }>;
  normalizedPostures: Readonly<{
    rights: RightsPosture;
    technicalAccess: TechnicalAccessPosture;
    freshness: FreshnessPosture;
    attribution: AttributionPosture;
    provenance: ProvenancePosture;
    certification: CertificationPosture;
    linkage: LinkagePosture;
    normalizationResult: NormalizedSourceEvidence['result'];
  }>;
  limitationCodes: readonly SourceEvidenceLimitationCode[];
  evidenceReferenceIds: readonly string[];
  certificationReferenceIds: readonly string[];
  conflictReferences: readonly NormalizedSourceEvidence['conflicts'][number][];
  humanReviewReasons: readonly SourceQualityHumanReviewReason[];
  activationFirewall: Readonly<{
    sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_SUMMARY';
    executiveReview: 'EXECUTIVE_REVIEW_REQUIRED_FOR_ACTIVATION';
    customerDisplayAuthority: 'NOT_GRANTED_BY_THIS_SUMMARY';
  }>;
  summaryFingerprint: string;
}>;

export type SourceQualityControlResult =
  | Readonly<{ classification: 'INVALID_SOURCE_EVIDENCE'; summary: null; reasons: readonly SourceQualitySummaryFailureReason[] }>
  | Readonly<{ classification: Exclude<SourceQualitySummaryClassification, 'INVALID_SOURCE_EVIDENCE'>; summary: SourceQualityReviewSummary; reasons: readonly [] }>;

const ID_PATTERN = /^[A-Za-z0-9._:-]{3,200}$/;
const NORMALIZATION_KEYS = ['source', 'rights', 'technicalAccess', 'activation', 'freshness', 'attribution', 'provenance', 'certification', 'linkagePosture', 'conflicts', 'result', 'reasons', 'normalizationFingerprint'];
const DIMENSION_KEYS = ['posture', 'linkagePosture', 'evidenceReferenceIds', 'limitationCodes'];
const SOURCE_KEYS = ['sourceId', 'sourceClass', 'responsibleOrganization', 'declaredActivationPosture', 'permittedUse', 'claimEligible', 'customerDisclosureEligible', 'sourcePaths', 'freshnessExpectation', 'lastSourceVerificationDate', 'lastSuccessfulDataRefresh'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(value).every((key) => keys.includes(key)) && keys.every((key) => key in value);
}

function validId(value: unknown): value is string {
  return typeof value === 'string' && ID_PATTERN.test(value);
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (isRecord(value)) return '{' + Object.keys(value).sort().map((key) => JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}';
  return JSON.stringify(value);
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(16).padStart(8, '0');
}

function uniqueSorted(values: readonly string[]) {
  return [...new Set(values)].sort();
}

function validDimension(value: unknown): value is NormalizedSourceEvidence['rights'] {
  return isRecord(value)
    && exactKeys(value, DIMENSION_KEYS)
    && typeof value.posture === 'string'
    && ['VERIFIED', 'PENDING', 'UNKNOWN', 'RESTRICTED', 'READY', 'BLOCKED', 'VERIFIED_CURRENT', 'STALE_VERIFICATION', 'DOMAIN_SPECIFIC', 'NONE_DOCUMENTED', 'REQUIRED', 'REQUIRED_PENDING_CONFIRMATION', 'COMPLETE', 'PARTIAL', 'INCOMPLETE', 'REFERENCED', 'ABSENT', 'UNVERIFIED'].includes(value.posture)
    && ['VERIFIED', 'PENDING', 'UNKNOWN', 'UNVERIFIED'].includes(String(value.linkagePosture))
    && Array.isArray(value.evidenceReferenceIds)
    && value.evidenceReferenceIds.every(validId)
    && Array.isArray(value.limitationCodes)
    && value.limitationCodes.every((code) => typeof code === 'string');
}

function canonicalNormalization(value: unknown): NormalizedSourceEvidence | null {
  if (!isRecord(value) || !exactKeys(value, NORMALIZATION_KEYS) || !isRecord(value.source) || !exactKeys(value.source, SOURCE_KEYS)) return null;
  if (!validId(value.source.sourceId) || typeof value.source.sourceClass !== 'string' || typeof value.source.responsibleOrganization !== 'string' || typeof value.source.declaredActivationPosture !== 'string' || typeof value.source.permittedUse !== 'string' || typeof value.source.claimEligible !== 'boolean' || typeof value.source.customerDisclosureEligible !== 'boolean' || !Array.isArray(value.source.sourcePaths) || !value.source.sourcePaths.every((entry) => typeof entry === 'string') || typeof value.source.freshnessExpectation !== 'string' || typeof value.source.lastSourceVerificationDate !== 'string' || (value.source.lastSuccessfulDataRefresh !== null && typeof value.source.lastSuccessfulDataRefresh !== 'string')) return null;
  if (![value.rights, value.technicalAccess, value.freshness, value.attribution, value.provenance, value.certification].every(validDimension)) return null;
  if (!['VERIFIED', 'PENDING', 'UNKNOWN', 'UNVERIFIED'].includes(String(value.linkagePosture)) || !Array.isArray(value.conflicts) || !['NORMALIZED', 'INSUFFICIENT_EVIDENCE', 'CONFLICT_REQUIRES_REVIEW', 'INVALID_LINKAGE'].includes(String(value.result)) || !Array.isArray(value.reasons) || !validId(value.normalizationFingerprint)) return null;
  for (const conflict of value.conflicts) {
    if (!isRecord(conflict) || !exactKeys(conflict, ['relationshipType', 'postures', 'evidenceReferenceIds']) || typeof conflict.relationshipType !== 'string' || !Array.isArray(conflict.postures) || !conflict.postures.every((entry) => typeof entry === 'string') || !Array.isArray(conflict.evidenceReferenceIds) || !conflict.evidenceReferenceIds.every(validId)) return null;
  }
  return value as NormalizedSourceEvidence;
}

function reviewReasons(normalized: NormalizedSourceEvidence): SourceQualityHumanReviewReason[] {
  const reasons = new Set<SourceQualityHumanReviewReason>();
  if (normalized.rights.posture !== 'VERIFIED') reasons.add('RIGHTS_REVIEW_REQUIRED');
  if (normalized.technicalAccess.posture !== 'READY') reasons.add('TECHNICAL_ACCESS_REVIEW_REQUIRED');
  if (normalized.freshness.posture !== 'VERIFIED_CURRENT') reasons.add('FRESHNESS_REVIEW_REQUIRED');
  if (normalized.freshness.posture === 'STALE_VERIFICATION') reasons.add('STALE_VERIFICATION_REVIEW_REQUIRED');
  if (normalized.attribution.posture !== 'NONE_DOCUMENTED') reasons.add('ATTRIBUTION_REVIEW_REQUIRED');
  if (normalized.provenance.posture !== 'COMPLETE') reasons.add('PROVENANCE_REVIEW_REQUIRED');
  if (normalized.certification.posture !== 'REFERENCED') reasons.add('CERTIFICATION_REVIEW_REQUIRED');
  if (normalized.linkagePosture !== 'VERIFIED') reasons.add('LINKAGE_REVIEW_REQUIRED');
  if (normalized.conflicts.length > 0 || normalized.result === 'CONFLICT_REQUIRES_REVIEW') reasons.add('CONFLICT_REVIEW_REQUIRED');
  return [...reasons].sort();
}

export function summarizeSourceQuality(input: unknown): SourceQualityControlResult {
  const normalized = canonicalNormalization(input);
  if (!normalized || !normalized.source) return { classification: 'INVALID_SOURCE_EVIDENCE', summary: null, reasons: ['INVALID_NORMALIZATION_INPUT'] };
  const source = normalized.source;
  if (normalized.result === 'INVALID_LINKAGE') return { classification: 'INVALID_SOURCE_EVIDENCE', summary: null, reasons: ['INVALID_NORMALIZATION_RESULT'] };
  const reasons = reviewReasons(normalized);
  const classification: Exclude<SourceQualitySummaryClassification, 'INVALID_SOURCE_EVIDENCE'> =
    normalized.result === 'CONFLICT_REQUIRES_REVIEW' ? 'CONFLICT_REQUIRES_REVIEW'
      : normalized.result === 'INSUFFICIENT_EVIDENCE' ? 'INSUFFICIENT_EVIDENCE'
        : reasons.length > 0 ? 'REVIEW_REQUIRED'
          : 'REVIEW_POSTURE_COMPLETE';
  const limitationCodes = uniqueSorted([
    ...normalized.rights.limitationCodes,
    ...normalized.technicalAccess.limitationCodes,
    ...normalized.freshness.limitationCodes,
    ...normalized.attribution.limitationCodes,
    ...normalized.provenance.limitationCodes,
    ...normalized.certification.limitationCodes,
  ]) as SourceEvidenceLimitationCode[];
  const evidenceReferenceIds = uniqueSorted([
    ...normalized.rights.evidenceReferenceIds,
    ...normalized.technicalAccess.evidenceReferenceIds,
    ...normalized.freshness.evidenceReferenceIds,
    ...normalized.attribution.evidenceReferenceIds,
    ...normalized.provenance.evidenceReferenceIds,
    ...normalized.certification.evidenceReferenceIds,
  ]);
  const summaryBasis = {
    schemaVersion: SOURCE_QUALITY_CONTROL_SUMMARY_SCHEMA_VERSION,
    classification,
    sourceId: source.sourceId,
    normalizationFingerprint: normalized.normalizationFingerprint,
    humanReviewReasons: reasons,
    limitationCodes,
    evidenceReferenceIds,
    conflicts: normalized.conflicts,
  };
  const summary: SourceQualityReviewSummary = {
    schemaVersion: SOURCE_QUALITY_CONTROL_SUMMARY_SCHEMA_VERSION,
    classification,
    source: {
      sourceId: source.sourceId,
      sourceClass: source.sourceClass,
      responsibleOrganization: source.responsibleOrganization,
      coverage: 'NOT_EXPOSED_BY_CANONICAL_NORMALIZATION',
      declaredActivationPosture: source.declaredActivationPosture,
      permittedUse: source.permittedUse,
      canonicalClaimEligible: source.claimEligible,
      canonicalCustomerDisclosureEligible: source.customerDisclosureEligible,
      sourcePaths: source.sourcePaths,
      freshnessExpectation: source.freshnessExpectation,
      lastSourceVerificationDate: source.lastSourceVerificationDate,
      lastSuccessfulDataRefresh: source.lastSuccessfulDataRefresh,
    },
    normalizedPostures: {
      rights: normalized.rights.posture,
      technicalAccess: normalized.technicalAccess.posture,
      freshness: normalized.freshness.posture,
      attribution: normalized.attribution.posture,
      provenance: normalized.provenance.posture,
      certification: normalized.certification.posture,
      linkage: normalized.linkagePosture,
      normalizationResult: normalized.result,
    },
    limitationCodes,
    evidenceReferenceIds,
    certificationReferenceIds: normalized.certification.evidenceReferenceIds,
    conflictReferences: normalized.conflicts,
    humanReviewReasons: reasons,
    activationFirewall: {
      sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_SUMMARY',
      executiveReview: 'EXECUTIVE_REVIEW_REQUIRED_FOR_ACTIVATION',
      customerDisplayAuthority: 'NOT_GRANTED_BY_THIS_SUMMARY',
    },
    summaryFingerprint: 'source-quality-summary:v1:' + hash(stable(summaryBasis)),
  };
  return { classification, summary, reasons: [] };
}
