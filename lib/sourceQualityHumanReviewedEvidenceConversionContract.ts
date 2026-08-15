import {
  SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
  normalizeSourceEvidence,
  type SourceEvidenceCertificationReference,
  type SourceEvidenceLimitationCode,
  type SourceEvidenceLinkageRecord,
} from './sourceQualityEvidenceNormalization';

export const SOURCE_QUALITY_HUMAN_REVIEWED_EVIDENCE_CONVERSION_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_HUMAN_REVIEWED_EVIDENCE_CONVERSION_V1' as const;

export type HumanReviewedFindingClass =
  | 'RIGHTS'
  | 'TECHNICAL_ACCESS'
  | 'FRESHNESS'
  | 'ATTRIBUTION'
  | 'FEE'
  | 'DISCLAIMER'
  | 'REFERRAL'
  | 'FOLLOW_UP'
  | 'PROVENANCE';

export type HumanReviewedEvidenceConversionResultClassification =
  | 'HUMAN_REVIEWED_EVIDENCE_CONVERSION_VALID'
  | 'HUMAN_REVIEW_REQUIRED'
  | 'SOURCE_ID_INVALID'
  | 'SOURCE_MISMATCH'
  | 'FINDING_CLASS_UNSUPPORTED'
  | 'FINDING_POSTURE_UNSUPPORTED'
  | 'EVIDENCE_REFERENCE_REQUIRED'
  | 'CERTIFICATION_REQUIRED'
  | 'REVIEW_AUTHORITY_UNSUPPORTED'
  | 'NARRATIVE_INPUT_REJECTED'
  | 'PII_OR_SECRET_INPUT_REJECTED'
  | 'CONFLICT_REQUIRES_REVIEW'
  | 'FAIL_CLOSED';

export type HumanReviewedEvidenceReference = Readonly<{
  sourceId: string;
  referenceClass: 'HUMAN_REVIEWED_EVIDENCE_REFERENCE';
  referenceId: string;
}>;

export type HumanReviewedSourceQualityEvidenceRequest = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_HUMAN_REVIEWED_EVIDENCE_CONVERSION_SCHEMA_VERSION;
  sourceId: string;
  findingClass: HumanReviewedFindingClass;
  findingPosture: string;
  humanReviewAssertion: 'HUMAN_REVIEW_COMPLETED';
  evidenceReference: HumanReviewedEvidenceReference;
  reviewAuthorityClass: 'EXECUTIVE_SOURCE_GOVERNANCE_REVIEW' | 'DELEGATED_SOURCE_GOVERNANCE_REVIEW';
  reviewedAt: string;
  certificationReference: SourceEvidenceCertificationReference;
  limitationCodes?: readonly SourceEvidenceLimitationCode[];
}>;

export type HumanReviewedGovernanceFinding = Readonly<{
  sourceId: string;
  findingClass: Exclude<HumanReviewedFindingClass, 'RIGHTS' | 'TECHNICAL_ACCESS' | 'FRESHNESS' | 'ATTRIBUTION' | 'PROVENANCE'>;
  findingPosture: string;
  evidenceReferenceId: string;
  reviewAuthorityClass: HumanReviewedSourceQualityEvidenceRequest['reviewAuthorityClass'];
  reviewedAt: string;
}>;

export type HumanReviewedEvidenceConversionResult = Readonly<{
  classification: HumanReviewedEvidenceConversionResultClassification;
  sourceId: string | null;
  linkages: readonly SourceEvidenceLinkageRecord[];
  governanceFinding: HumanReviewedGovernanceFinding | null;
  inputFingerprint: string;
  conversionFingerprint: string;
  reasons: readonly string[];
  firewall: typeof HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL;
}>;

const ID_PATTERN = /^[A-Z][A-Z0-9_-]{2,119}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const REQUEST_KEYS = ['schemaVersion', 'sourceId', 'findingClass', 'findingPosture', 'humanReviewAssertion', 'evidenceReference', 'reviewAuthorityClass', 'reviewedAt', 'certificationReference', 'limitationCodes'];
const REFERENCE_KEYS = ['sourceId', 'referenceClass', 'referenceId'];
const CERTIFICATION_KEYS = ['certificationId', 'repositoryReference', 'referenceVersion', 'linkageReviewedDate'];
const NARRATIVE_KEYS = ['narrative', 'notes', 'summary', 'rationale', 'quote', 'emailBody', 'documentBody', 'pdfText', 'websiteText', 'correspondence', 'chatTranscript'];
const SENSITIVE_KEYS = ['name', 'email', 'phone', 'address', 'ownerName', 'customerData', 'credential', 'apiKey', 'password', 'secret'];
const LIMITATION_CODES: readonly SourceEvidenceLimitationCode[] = ['RIGHTS_PENDING', 'RIGHTS_RESTRICTED', 'TECHNICAL_ACCESS_PENDING', 'TECHNICAL_ACCESS_BLOCKED', 'FRESHNESS_DOMAIN_SPECIFIC', 'FRESHNESS_STALE_VERIFICATION', 'ATTRIBUTION_REQUIRED', 'ATTRIBUTION_PENDING_CONFIRMATION', 'PROVENANCE_PARTIAL', 'PROVENANCE_INCOMPLETE', 'CERTIFICATION_ABSENT', 'NARRATIVE_ONLY_NON_COMPOSABLE'];

export const HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL = Object.freeze({
  modelDoesNotParseNarrative: 'MODEL_DOES_NOT_PARSE_SOURCE_NARRATIVE',
  humanReviewRequired: 'HUMAN_REVIEW_REQUIRED',
  exactSourceIdRequired: 'EXACT_SOURCE_ID_REQUIRED',
  finiteFindingRequired: 'FINITE_STRUCTURED_FINDING_REQUIRED',
  controlledReferenceRequired: 'CONTROLLED_EVIDENCE_REFERENCE_REQUIRED',
  reviewedAtRequired: 'REVIEWED_AT_REQUIRED',
  certificationRequired: 'CERTIFICATION_REQUIRED',
  noAutomaticRightsInference: 'NO_AUTOMATIC_RIGHTS_INFERENCE',
  evidenceOnly: 'STRUCTURED_HUMAN_FINDING_IS_EVIDENCE_ONLY',
  activation: 'SOURCE_ACTIVATION_SEPARATELY_GOVERNED',
  retrieval: 'SCRAPING_OR_RETRIEVAL_SEPARATELY_GOVERNED',
  customerDisplay: 'CUSTOMER_DISPLAY_SEPARATELY_GOVERNED',
  legalUse: 'LEGAL_USE_SEPARATELY_GOVERNED',
});

const FINDING_MAP: Record<HumanReviewedFindingClass, Readonly<{
  postures: readonly string[];
  relationshipType: 'RIGHTS' | 'TECHNICAL_ACCESS' | 'FRESHNESS' | 'ATTRIBUTION' | 'PROVENANCE' | null;
  evidenceClass: string | null;
  contractType: string | null;
  repositoryReference: string | null;
  canonicalPostures: Readonly<Record<string, string>>;
}>> = {
  RIGHTS: {
    postures: ['RIGHTS_PERMITTED', 'RIGHTS_RESTRICTED', 'RIGHTS_PROHIBITED', 'RIGHTS_UNKNOWN'],
    relationshipType: 'RIGHTS', evidenceClass: 'SOURCE_RIGHTS_READINESS', contractType: 'SOURCE_RIGHTS_READINESS_CONTRACT', repositoryReference: 'lib/sourceRightsActivationReadiness.ts',
    canonicalPostures: { RIGHTS_PERMITTED: 'VERIFIED', RIGHTS_RESTRICTED: 'RESTRICTED', RIGHTS_PROHIBITED: 'RESTRICTED', RIGHTS_UNKNOWN: 'UNKNOWN' },
  },
  TECHNICAL_ACCESS: {
    postures: ['TECHNICAL_ACCESS_AVAILABLE', 'TECHNICAL_ACCESS_RESTRICTED', 'TECHNICAL_ACCESS_UNAVAILABLE', 'TECHNICAL_ACCESS_UNKNOWN'],
    relationshipType: 'TECHNICAL_ACCESS', evidenceClass: 'SOURCE_RIGHTS_READINESS', contractType: 'SOURCE_RIGHTS_READINESS_CONTRACT', repositoryReference: 'lib/sourceRightsActivationReadiness.ts',
    canonicalPostures: { TECHNICAL_ACCESS_AVAILABLE: 'READY', TECHNICAL_ACCESS_RESTRICTED: 'BLOCKED', TECHNICAL_ACCESS_UNAVAILABLE: 'BLOCKED', TECHNICAL_ACCESS_UNKNOWN: 'UNKNOWN' },
  },
  FRESHNESS: {
    postures: ['FRESHNESS_DOCUMENTED', 'FRESHNESS_DOMAIN_SPECIFIC', 'FRESHNESS_UNKNOWN'],
    relationshipType: 'FRESHNESS', evidenceClass: 'DOMAIN_FRESHNESS', contractType: 'DOMAIN_FRESHNESS_CONTRACT', repositoryReference: 'DOMAIN_STRUCTURED_CONTRACT',
    canonicalPostures: { FRESHNESS_DOCUMENTED: 'DOMAIN_SPECIFIC', FRESHNESS_DOMAIN_SPECIFIC: 'DOMAIN_SPECIFIC', FRESHNESS_UNKNOWN: 'UNKNOWN' },
  },
  ATTRIBUTION: {
    postures: ['ATTRIBUTION_REQUIRED', 'ATTRIBUTION_NOT_DOCUMENTED', 'ATTRIBUTION_UNKNOWN'],
    relationshipType: 'ATTRIBUTION', evidenceClass: 'SOURCE_RIGHTS_READINESS', contractType: 'SOURCE_RIGHTS_READINESS_CONTRACT', repositoryReference: 'lib/sourceRightsActivationReadiness.ts',
    canonicalPostures: { ATTRIBUTION_REQUIRED: 'REQUIRED', ATTRIBUTION_NOT_DOCUMENTED: 'UNKNOWN', ATTRIBUTION_UNKNOWN: 'UNKNOWN' },
  },
  FEE: { postures: ['FEE_REQUIRED', 'FEE_NOT_DOCUMENTED', 'FEE_UNKNOWN'], relationshipType: null, evidenceClass: null, contractType: null, repositoryReference: null, canonicalPostures: {} },
  DISCLAIMER: { postures: ['DISCLAIMER_REQUIRED', 'DISCLAIMER_NOT_DOCUMENTED', 'DISCLAIMER_UNKNOWN'], relationshipType: null, evidenceClass: null, contractType: null, repositoryReference: null, canonicalPostures: {} },
  REFERRAL: { postures: ['REFERRAL_REQUIRED', 'REFERRAL_NOT_REQUIRED_DOCUMENTED', 'REFERRAL_UNKNOWN'], relationshipType: null, evidenceClass: null, contractType: null, repositoryReference: null, canonicalPostures: {} },
  FOLLOW_UP: { postures: ['FOLLOW_UP_REQUIRED', 'FOLLOW_UP_NOT_REQUIRED_DOCUMENTED', 'FOLLOW_UP_UNKNOWN'], relationshipType: null, evidenceClass: null, contractType: null, repositoryReference: null, canonicalPostures: {} },
  PROVENANCE: {
    postures: ['PROVENANCE_PARTIAL', 'PROVENANCE_INCOMPLETE', 'PROVENANCE_UNKNOWN'],
    relationshipType: 'PROVENANCE', evidenceClass: 'EVIDENCE_DEPTH', contractType: 'EVIDENCE_DEPTH_CONTRACT', repositoryReference: 'lib/evidence-depth/evidencePosture.ts',
    canonicalPostures: { PROVENANCE_PARTIAL: 'PARTIAL', PROVENANCE_INCOMPLETE: 'INCOMPLETE', PROVENANCE_UNKNOWN: 'UNKNOWN' },
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key)) && keys.filter((key) => key !== 'limitationCodes').every((key) => key in value);
}

function validId(value: unknown): value is string {
  return typeof value === 'string' && ID_PATTERN.test(value);
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && DATE_PATTERN.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00.000Z'));
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (isRecord(value)) return '{' + Object.keys(value).sort().map((key) => JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}';
  return JSON.stringify(value);
}

function hash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(16).padStart(8, '0');
}

function hasAnyKey(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).some((key) => keys.includes(key));
}

function validCertification(value: unknown): value is SourceEvidenceCertificationReference {
  return isRecord(value)
    && Object.keys(value).length === CERTIFICATION_KEYS.length
    && CERTIFICATION_KEYS.every((key) => key in value)
    && validId(value.certificationId)
    && value.repositoryReference === 'docs/project-atlas/executive-library'
    && validId(value.referenceVersion)
    && validDate(value.linkageReviewedDate);
}

function validReference(value: unknown, sourceId: string): value is HumanReviewedEvidenceReference {
  return isRecord(value)
    && Object.keys(value).length === REFERENCE_KEYS.length
    && REFERENCE_KEYS.every((key) => key in value)
    && value.sourceId === sourceId
    && value.referenceClass === 'HUMAN_REVIEWED_EVIDENCE_REFERENCE'
    && validId(value.referenceId);
}

function fail(
  classification: Exclude<HumanReviewedEvidenceConversionResultClassification, 'HUMAN_REVIEWED_EVIDENCE_CONVERSION_VALID'>,
  inputFingerprint: string,
  ...reasons: string[]
): HumanReviewedEvidenceConversionResult {
  return {
    classification, sourceId: null, linkages: [], governanceFinding: null, inputFingerprint,
    conversionFingerprint: 'human-reviewed-evidence-conversion:v1:' + hash(stable({ classification, inputFingerprint, reasons: [...new Set(reasons)].sort() })),
    reasons: [...new Set(reasons)].sort(), firewall: HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL,
  };
}

function certificationLinkage(request: HumanReviewedSourceQualityEvidenceRequest): SourceEvidenceLinkageRecord {
  return {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId: request.sourceId, evidenceClass: 'CERTIFICATION', authoritativeContractType: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: request.evidenceReference.referenceId, repositoryReference: 'docs/project-atlas/executive-library',
    relationshipType: 'CERTIFICATION', posture: 'REFERENCED', verificationStatus: 'VERIFIED',
    certificationReference: request.certificationReference, lastReviewedDate: request.reviewedAt,
    limitationCodes: [...(request.limitationCodes ?? [])].sort(), linkageProvenance: 'CERTIFICATION_REFERENCE_ONLY',
  };
}

function dimensionLinkage(request: HumanReviewedSourceQualityEvidenceRequest, mapping: typeof FINDING_MAP[HumanReviewedFindingClass]): SourceEvidenceLinkageRecord | null {
  if (!mapping.relationshipType || !mapping.evidenceClass || !mapping.contractType || !mapping.repositoryReference) return null;
  return {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId: request.sourceId, evidenceClass: mapping.evidenceClass, authoritativeContractType: mapping.contractType,
    evidenceReferenceId: request.evidenceReference.referenceId, repositoryReference: mapping.repositoryReference,
    relationshipType: mapping.relationshipType, posture: mapping.canonicalPostures[request.findingPosture]!,
    verificationStatus: 'VERIFIED', certificationReference: request.certificationReference,
    lastReviewedDate: request.reviewedAt, limitationCodes: [...(request.limitationCodes ?? [])].sort(),
    linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
  } as SourceEvidenceLinkageRecord;
}

export function createHumanReviewedEvidenceInputFingerprint(input: unknown): string {
  return 'human-reviewed-evidence-input:v1:' + hash(stable(input));
}

export function convertHumanReviewedSourceQualityEvidence(input: unknown): HumanReviewedEvidenceConversionResult {
  const inputFingerprint = createHumanReviewedEvidenceInputFingerprint(input);
  if (!isRecord(input)) return fail('FAIL_CLOSED', inputFingerprint, 'INVALID_REQUEST_SHAPE');
  if (hasAnyKey(input, NARRATIVE_KEYS)) return fail('NARRATIVE_INPUT_REJECTED', inputFingerprint, 'NARRATIVE_CONTENT_NOT_COMPOSABLE');
  if (hasAnyKey(input, SENSITIVE_KEYS)) return fail('PII_OR_SECRET_INPUT_REJECTED', inputFingerprint, 'PII_OR_SECRET_CONTENT_NOT_COMPOSABLE');
  if (!exactKeys(input, REQUEST_KEYS)) return fail('FAIL_CLOSED', inputFingerprint, 'UNSUPPORTED_REQUEST_FIELD');
  if (input.schemaVersion !== SOURCE_QUALITY_HUMAN_REVIEWED_EVIDENCE_CONVERSION_SCHEMA_VERSION || !validId(input.sourceId) || !validDate(input.reviewedAt)) return fail('SOURCE_ID_INVALID', inputFingerprint, 'INVALID_SOURCE_ID_OR_REVIEW_DATE');
  if (input.humanReviewAssertion !== 'HUMAN_REVIEW_COMPLETED') return fail('HUMAN_REVIEW_REQUIRED', inputFingerprint, 'HUMAN_REVIEW_COMPLETED_REQUIRED');
  if (input.reviewAuthorityClass !== 'EXECUTIVE_SOURCE_GOVERNANCE_REVIEW' && input.reviewAuthorityClass !== 'DELEGATED_SOURCE_GOVERNANCE_REVIEW') return fail('REVIEW_AUTHORITY_UNSUPPORTED', inputFingerprint, 'GOVERNED_REVIEW_AUTHORITY_REQUIRED');
  if (!isRecord(input.evidenceReference)) return fail('EVIDENCE_REFERENCE_REQUIRED', inputFingerprint, 'CONTROLLED_NON_CONTENT_EVIDENCE_REFERENCE_REQUIRED');
  if (!validReference(input.evidenceReference, input.sourceId)) return fail('SOURCE_MISMATCH', inputFingerprint, 'CONTROLLED_REFERENCE_EXACT_SOURCE_BINDING_REQUIRED');
  if (!validCertification(input.certificationReference)) return fail('CERTIFICATION_REQUIRED', inputFingerprint, 'CONTROLLED_CERTIFICATION_REFERENCE_REQUIRED');
  if (typeof input.findingClass !== 'string' || !Object.prototype.hasOwnProperty.call(FINDING_MAP, input.findingClass)) return fail('FINDING_CLASS_UNSUPPORTED', inputFingerprint, 'FINITE_FINDING_CLASS_REQUIRED');
  const mapping = FINDING_MAP[input.findingClass as HumanReviewedFindingClass];
  if (typeof input.findingPosture !== 'string' || !mapping.postures.includes(input.findingPosture)) return fail('FINDING_POSTURE_UNSUPPORTED', inputFingerprint, 'FINITE_FINDING_POSTURE_REQUIRED');
  if (input.limitationCodes !== undefined && (!Array.isArray(input.limitationCodes) || input.limitationCodes.some((code) => !LIMITATION_CODES.includes(code as SourceEvidenceLimitationCode)))) return fail('FAIL_CLOSED', inputFingerprint, 'INVALID_LIMITATION_CODE');

  const sourceProbe = normalizeSourceEvidence({ sourceId: input.sourceId, linkages: [] });
  if (!sourceProbe.source) return fail('SOURCE_ID_INVALID', inputFingerprint, 'CANONICAL_SOURCE_ID_REQUIRED');
  const request = input as HumanReviewedSourceQualityEvidenceRequest;
  const linkages = [certificationLinkage(request), dimensionLinkage(request, mapping)].filter(Boolean) as SourceEvidenceLinkageRecord[];
  const normalized = normalizeSourceEvidence({ sourceId: request.sourceId, linkages });
  if (normalized.result === 'INVALID_LINKAGE') return fail('FAIL_CLOSED', inputFingerprint, 'CANONICAL_LINKAGE_REJECTED');
  const governanceFinding = mapping.relationshipType === null ? {
    sourceId: request.sourceId,
    findingClass: request.findingClass as HumanReviewedGovernanceFinding['findingClass'],
    findingPosture: request.findingPosture,
    evidenceReferenceId: request.evidenceReference.referenceId,
    reviewAuthorityClass: request.reviewAuthorityClass,
    reviewedAt: request.reviewedAt,
  } : null;
  const classification = normalized.result === 'CONFLICT_REQUIRES_REVIEW' ? 'CONFLICT_REQUIRES_REVIEW' : 'HUMAN_REVIEWED_EVIDENCE_CONVERSION_VALID';
  return {
    classification, sourceId: request.sourceId, linkages, governanceFinding, inputFingerprint,
    conversionFingerprint: 'human-reviewed-evidence-conversion:v1:' + hash(stable({ request, linkages, normalizationFingerprint: normalized.normalizationFingerprint })),
    reasons: classification === 'CONFLICT_REQUIRES_REVIEW' ? ['CANONICAL_CONFLICT_REQUIRES_REVIEW'] : [],
    firewall: HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL,
  };
}
