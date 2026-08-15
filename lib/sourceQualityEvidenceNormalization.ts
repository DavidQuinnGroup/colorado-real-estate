import { getReieSourceRegistry, type ReieSourceActivationState, type ReieSourceClass } from './sourceRegistry';

export const SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_EVIDENCE_NORMALIZATION_V1' as const;

export const SOURCE_EVIDENCE_RELATIONSHIP_TYPES = ['RIGHTS', 'TECHNICAL_ACCESS', 'FRESHNESS', 'ATTRIBUTION', 'PROVENANCE', 'CERTIFICATION'] as const;
export const SOURCE_EVIDENCE_CLASSES = [
  'SOURCE_RIGHTS_READINESS',
  'EVIDENCE_DEPTH',
  'GEOGRAPHIC_PROVENANCE',
  'LICENSING_RESOLUTION',
  'PROVIDER_INVENTORY',
  'MLS_FRESHNESS',
  'DOMAIN_FRESHNESS',
  'CERTIFICATION',
  'NARRATIVE_ONLY',
] as const;
export const SOURCE_EVIDENCE_LIMITATION_CODES = [
  'RIGHTS_PENDING',
  'RIGHTS_RESTRICTED',
  'TECHNICAL_ACCESS_PENDING',
  'TECHNICAL_ACCESS_BLOCKED',
  'FRESHNESS_DOMAIN_SPECIFIC',
  'FRESHNESS_STALE_VERIFICATION',
  'ATTRIBUTION_REQUIRED',
  'ATTRIBUTION_PENDING_CONFIRMATION',
  'PROVENANCE_PARTIAL',
  'PROVENANCE_INCOMPLETE',
  'CERTIFICATION_ABSENT',
  'NARRATIVE_ONLY_NON_COMPOSABLE',
] as const;

export type SourceEvidenceRelationshipType = (typeof SOURCE_EVIDENCE_RELATIONSHIP_TYPES)[number];
export type SourceEvidenceClass = (typeof SOURCE_EVIDENCE_CLASSES)[number];
export type SourceEvidenceLimitationCode = (typeof SOURCE_EVIDENCE_LIMITATION_CODES)[number];
export type SourceEvidenceVerificationStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED' | 'REJECTED';
export type SourceEvidenceLinkageProvenance = 'EXPLICIT_REVIEWED_LINKAGE' | 'AUTHORITATIVE_EMBEDDED_SOURCE_ID' | 'CERTIFICATION_REFERENCE_ONLY';
export type RightsPosture = 'VERIFIED' | 'PENDING' | 'UNKNOWN' | 'RESTRICTED';
export type TechnicalAccessPosture = 'READY' | 'PENDING' | 'BLOCKED' | 'UNKNOWN';
export type FreshnessPosture = 'VERIFIED_CURRENT' | 'STALE_VERIFICATION' | 'UNKNOWN' | 'DOMAIN_SPECIFIC';
export type AttributionPosture = 'NONE_DOCUMENTED' | 'REQUIRED' | 'REQUIRED_PENDING_CONFIRMATION' | 'UNKNOWN';
export type ProvenancePosture = 'COMPLETE' | 'PARTIAL' | 'INCOMPLETE' | 'UNKNOWN';
export type CertificationPosture = 'REFERENCED' | 'ABSENT' | 'UNVERIFIED';
export type LinkagePosture = 'VERIFIED' | 'PENDING' | 'UNKNOWN' | 'UNVERIFIED';
export type SourceEvidenceNormalizationResult = 'NORMALIZED' | 'INSUFFICIENT_EVIDENCE' | 'CONFLICT_REQUIRES_REVIEW' | 'INVALID_LINKAGE';

export type SourceEvidenceCertificationReference = Readonly<{
  certificationId: string;
  repositoryReference: 'docs/project-atlas/executive-library/REIE-SOURCE-REGISTRY-GRAND-PLAN-ADVANCEMENT-PRODUCTION-CERTIFICATION.md' | 'docs/project-atlas/executive-library/SOURCE-RIGHTS-READINESS-1-PRODUCTION-CERTIFICATION.md' | 'docs/project-atlas/executive-library';
  referenceVersion: string;
  linkageReviewedDate: string;
}>;

type LinkageBase = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION;
  sourceId: string;
  evidenceClass: SourceEvidenceClass;
  authoritativeContractType:
    | 'SOURCE_RIGHTS_READINESS_CONTRACT'
    | 'EVIDENCE_DEPTH_CONTRACT'
    | 'GEOGRAPHIC_PROVENANCE_CONTRACT'
    | 'LICENSING_RESOLUTION_CONTRACT'
    | 'PROVIDER_INVENTORY_CONTRACT'
    | 'MLS_FRESHNESS_CONTRACT'
    | 'DOMAIN_FRESHNESS_CONTRACT'
    | 'CERTIFICATION_REFERENCE'
    | 'NARRATIVE_REFERENCE_ONLY';
  evidenceReferenceId: string;
  repositoryReference:
    | 'lib/sourceRightsActivationReadiness.ts'
    | 'lib/evidence-depth/evidencePosture.ts'
    | 'lib/geographic-intelligence/evidenceProvenanceContract.ts'
    | 'lib/geographic-intelligence/licensingResolutionContract.ts'
    | 'lib/geographic-intelligence/providerInventoryContract.ts'
    | 'lib/mls/sourceFreshness.ts'
    | 'DOMAIN_STRUCTURED_CONTRACT'
    | 'docs/project-atlas/executive-library';
  verificationStatus: SourceEvidenceVerificationStatus;
  certificationReference: SourceEvidenceCertificationReference | null;
  lastReviewedDate: string;
  limitationCodes: readonly SourceEvidenceLimitationCode[];
  linkageProvenance: SourceEvidenceLinkageProvenance;
}>;

export type SourceEvidenceLinkageRecord =
  | (LinkageBase & Readonly<{ relationshipType: 'RIGHTS'; posture: RightsPosture }>)
  | (LinkageBase & Readonly<{ relationshipType: 'TECHNICAL_ACCESS'; posture: TechnicalAccessPosture }>)
  | (LinkageBase & Readonly<{ relationshipType: 'FRESHNESS'; posture: FreshnessPosture }>)
  | (LinkageBase & Readonly<{ relationshipType: 'ATTRIBUTION'; posture: AttributionPosture }>)
  | (LinkageBase & Readonly<{ relationshipType: 'PROVENANCE'; posture: ProvenancePosture }>)
  | (LinkageBase & Readonly<{ relationshipType: 'CERTIFICATION'; posture: CertificationPosture }>);

export type SourceEvidenceNormalizationFailureReason =
  | 'INVALID_INPUT_SHAPE'
  | 'MISSING_SOURCE_ID'
  | 'UNKNOWN_SOURCE_ID'
  | 'MALFORMED_LINKAGE_RECORD'
  | 'FOREIGN_LINKAGE_SOURCE_ID'
  | 'INVALID_SCHEMA_VERSION'
  | 'UNKNOWN_EVIDENCE_CLASS'
  | 'UNKNOWN_RELATIONSHIP_TYPE'
  | 'INVALID_CONTRACT_REFERENCE'
  | 'MALFORMED_EVIDENCE_REFERENCE'
  | 'INVALID_VERIFICATION_STATUS'
  | 'INVALID_CERTIFICATION_REFERENCE'
  | 'INVALID_REVIEW_DATE'
  | 'INVALID_LIMITATION_CODE'
  | 'INVALID_LINKAGE_PROVENANCE';

export type NormalizedDimension<T> = Readonly<{
  posture: T;
  linkagePosture: LinkagePosture;
  evidenceReferenceIds: readonly string[];
  limitationCodes: readonly SourceEvidenceLimitationCode[];
}>;

export type NormalizedSourceEvidence = Readonly<{
  source: Readonly<{
    sourceId: string;
    sourceClass: ReieSourceClass;
    responsibleOrganization: string;
    declaredActivationPosture: ReieSourceActivationState;
    permittedUse: string;
    claimEligible: boolean;
    customerDisclosureEligible: boolean;
    sourcePaths: readonly string[];
    freshnessExpectation: string;
    lastSourceVerificationDate: string;
    lastSuccessfulDataRefresh: string | null;
  }> | null;
  rights: NormalizedDimension<RightsPosture>;
  technicalAccess: NormalizedDimension<TechnicalAccessPosture>;
  activation: Readonly<{ declaredPosture: ReieSourceActivationState | 'UNKNOWN'; sourceRegistryReference: 'lib/sourceRegistry.ts' | null }>;
  freshness: NormalizedDimension<FreshnessPosture>;
  attribution: NormalizedDimension<AttributionPosture>;
  provenance: NormalizedDimension<ProvenancePosture>;
  certification: NormalizedDimension<CertificationPosture>;
  linkagePosture: LinkagePosture;
  conflicts: readonly Readonly<{ relationshipType: SourceEvidenceRelationshipType; postures: readonly string[]; evidenceReferenceIds: readonly string[] }>[];
  result: SourceEvidenceNormalizationResult;
  reasons: readonly SourceEvidenceNormalizationFailureReason[];
  normalizationFingerprint: string;
}>;

const ID_PATTERN = /^[A-Z][A-Z0-9_-]{2,119}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_KEYS = ['schemaVersion', 'sourceId', 'evidenceClass', 'authoritativeContractType', 'evidenceReferenceId', 'repositoryReference', 'relationshipType', 'posture', 'verificationStatus', 'certificationReference', 'lastReviewedDate', 'limitationCodes', 'linkageProvenance'];
const EXPECTED_CONTRACT: Record<SourceEvidenceClass, string> = {
  SOURCE_RIGHTS_READINESS: 'SOURCE_RIGHTS_READINESS_CONTRACT',
  EVIDENCE_DEPTH: 'EVIDENCE_DEPTH_CONTRACT',
  GEOGRAPHIC_PROVENANCE: 'GEOGRAPHIC_PROVENANCE_CONTRACT',
  LICENSING_RESOLUTION: 'LICENSING_RESOLUTION_CONTRACT',
  PROVIDER_INVENTORY: 'PROVIDER_INVENTORY_CONTRACT',
  MLS_FRESHNESS: 'MLS_FRESHNESS_CONTRACT',
  DOMAIN_FRESHNESS: 'DOMAIN_FRESHNESS_CONTRACT',
  CERTIFICATION: 'CERTIFICATION_REFERENCE',
  NARRATIVE_ONLY: 'NARRATIVE_REFERENCE_ONLY',
};
const EXPECTED_REFERENCE: Record<SourceEvidenceClass, string> = {
  SOURCE_RIGHTS_READINESS: 'lib/sourceRightsActivationReadiness.ts',
  EVIDENCE_DEPTH: 'lib/evidence-depth/evidencePosture.ts',
  GEOGRAPHIC_PROVENANCE: 'lib/geographic-intelligence/evidenceProvenanceContract.ts',
  LICENSING_RESOLUTION: 'lib/geographic-intelligence/licensingResolutionContract.ts',
  PROVIDER_INVENTORY: 'lib/geographic-intelligence/providerInventoryContract.ts',
  MLS_FRESHNESS: 'lib/mls/sourceFreshness.ts',
  DOMAIN_FRESHNESS: 'DOMAIN_STRUCTURED_CONTRACT',
  CERTIFICATION: 'docs/project-atlas/executive-library',
  NARRATIVE_ONLY: 'docs/project-atlas/executive-library',
};
const ALLOWED_CLASSES: Record<SourceEvidenceRelationshipType, readonly SourceEvidenceClass[]> = {
  RIGHTS: ['SOURCE_RIGHTS_READINESS', 'LICENSING_RESOLUTION', 'EVIDENCE_DEPTH'],
  TECHNICAL_ACCESS: ['SOURCE_RIGHTS_READINESS', 'PROVIDER_INVENTORY'],
  FRESHNESS: ['MLS_FRESHNESS', 'DOMAIN_FRESHNESS', 'EVIDENCE_DEPTH', 'GEOGRAPHIC_PROVENANCE'],
  ATTRIBUTION: ['SOURCE_RIGHTS_READINESS', 'LICENSING_RESOLUTION', 'EVIDENCE_DEPTH', 'PROVIDER_INVENTORY'],
  PROVENANCE: ['EVIDENCE_DEPTH', 'GEOGRAPHIC_PROVENANCE'],
  CERTIFICATION: ['CERTIFICATION', 'NARRATIVE_ONLY'],
};
const ALLOWED_POSTURES: Record<SourceEvidenceRelationshipType, readonly string[]> = {
  RIGHTS: ['VERIFIED', 'PENDING', 'UNKNOWN', 'RESTRICTED'],
  TECHNICAL_ACCESS: ['READY', 'PENDING', 'BLOCKED', 'UNKNOWN'],
  FRESHNESS: ['VERIFIED_CURRENT', 'STALE_VERIFICATION', 'UNKNOWN', 'DOMAIN_SPECIFIC'],
  ATTRIBUTION: ['NONE_DOCUMENTED', 'REQUIRED', 'REQUIRED_PENDING_CONFIRMATION', 'UNKNOWN'],
  PROVENANCE: ['COMPLETE', 'PARTIAL', 'INCOMPLETE', 'UNKNOWN'],
  CERTIFICATION: ['REFERENCED', 'ABSENT', 'UNVERIFIED'],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function oneOf<T extends readonly string[]>(value: unknown, options: T): value is T[number] {
  return typeof value === 'string' && (options as readonly string[]).includes(value);
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && DATE_PATTERN.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00.000Z'));
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(16).padStart(8, '0');
}

function defaultDimension<T>(posture: T): NormalizedDimension<T> {
  return { posture, linkagePosture: 'UNKNOWN', evidenceReferenceIds: [], limitationCodes: [] };
}

function validCertification(value: unknown): SourceEvidenceCertificationReference | null {
  if (!isRecord(value)) return null;
  if (Object.keys(value).some((key) => !['certificationId', 'repositoryReference', 'referenceVersion', 'linkageReviewedDate'].includes(key))) return null;
  if (typeof value.certificationId !== 'string' || !ID_PATTERN.test(value.certificationId)) return null;
  if (typeof value.referenceVersion !== 'string' || !ID_PATTERN.test(value.referenceVersion)) return null;
  if (!validDate(value.linkageReviewedDate)) return null;
  if (value.repositoryReference !== 'docs/project-atlas/executive-library/REIE-SOURCE-REGISTRY-GRAND-PLAN-ADVANCEMENT-PRODUCTION-CERTIFICATION.md' && value.repositoryReference !== 'docs/project-atlas/executive-library/SOURCE-RIGHTS-READINESS-1-PRODUCTION-CERTIFICATION.md' && value.repositoryReference !== 'docs/project-atlas/executive-library') return null;
  return value as SourceEvidenceCertificationReference;
}

function validateLinkage(raw: unknown, sourceId: string, reasons: Set<SourceEvidenceNormalizationFailureReason>): SourceEvidenceLinkageRecord | null {
  if (!isRecord(raw)) {
    reasons.add('MALFORMED_LINKAGE_RECORD');
    return null;
  }
  if (Object.keys(raw).some((key) => !ALLOWED_KEYS.includes(key))) reasons.add('MALFORMED_LINKAGE_RECORD');
  if (raw.schemaVersion !== SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION) reasons.add('INVALID_SCHEMA_VERSION');
  if (typeof raw.sourceId !== 'string' || !ID_PATTERN.test(raw.sourceId)) reasons.add('MALFORMED_LINKAGE_RECORD');
  else if (raw.sourceId !== sourceId) reasons.add('FOREIGN_LINKAGE_SOURCE_ID');
  if (!oneOf(raw.evidenceClass, SOURCE_EVIDENCE_CLASSES)) reasons.add('UNKNOWN_EVIDENCE_CLASS');
  if (!oneOf(raw.relationshipType, SOURCE_EVIDENCE_RELATIONSHIP_TYPES)) reasons.add('UNKNOWN_RELATIONSHIP_TYPE');
  if (typeof raw.evidenceReferenceId !== 'string' || !ID_PATTERN.test(raw.evidenceReferenceId)) reasons.add('MALFORMED_EVIDENCE_REFERENCE');
  if (!oneOf(raw.verificationStatus, ['VERIFIED', 'PENDING', 'UNVERIFIED', 'REJECTED'] as const)) reasons.add('INVALID_VERIFICATION_STATUS');
  if (!validDate(raw.lastReviewedDate)) reasons.add('INVALID_REVIEW_DATE');
  if (!oneOf(raw.linkageProvenance, ['EXPLICIT_REVIEWED_LINKAGE', 'AUTHORITATIVE_EMBEDDED_SOURCE_ID', 'CERTIFICATION_REFERENCE_ONLY'] as const)) reasons.add('INVALID_LINKAGE_PROVENANCE');
  if (!Array.isArray(raw.limitationCodes) || raw.limitationCodes.some((value) => !oneOf(value, SOURCE_EVIDENCE_LIMITATION_CODES))) reasons.add('INVALID_LIMITATION_CODE');
  const certification = raw.certificationReference === null ? null : validCertification(raw.certificationReference);
  if (raw.certificationReference !== null && !certification) reasons.add('INVALID_CERTIFICATION_REFERENCE');
  if (oneOf(raw.evidenceClass, SOURCE_EVIDENCE_CLASSES) && oneOf(raw.relationshipType, SOURCE_EVIDENCE_RELATIONSHIP_TYPES)) {
    if (raw.authoritativeContractType !== EXPECTED_CONTRACT[raw.evidenceClass] || raw.repositoryReference !== EXPECTED_REFERENCE[raw.evidenceClass] || !ALLOWED_CLASSES[raw.relationshipType].includes(raw.evidenceClass)) reasons.add('INVALID_CONTRACT_REFERENCE');
    if (!ALLOWED_POSTURES[raw.relationshipType].includes(String(raw.posture))) reasons.add('MALFORMED_LINKAGE_RECORD');
    if (raw.relationshipType === 'CERTIFICATION' && !certification) reasons.add('INVALID_CERTIFICATION_REFERENCE');
  } else reasons.add('INVALID_CONTRACT_REFERENCE');
  return reasons.size === 0 ? raw as SourceEvidenceLinkageRecord : null;
}

function dimension<T extends string>(linkages: readonly SourceEvidenceLinkageRecord[], type: SourceEvidenceRelationshipType, fallback: T) {
  const relevant = linkages.filter((linkage) => linkage.relationshipType === type);
  if (relevant.length === 0) return { dimension: defaultDimension(fallback), conflict: null as NormalizedSourceEvidence['conflicts'][number] | null };
  const verified = relevant.filter((linkage) => linkage.verificationStatus === 'VERIFIED');
  const ids = relevant.map((linkage) => linkage.evidenceReferenceId).sort();
  const limitations = [...new Set(relevant.flatMap((linkage) => linkage.limitationCodes))].sort() as SourceEvidenceLimitationCode[];
  const linkagePosture: LinkagePosture = verified.length > 0 ? 'VERIFIED' : relevant.some((linkage) => linkage.verificationStatus === 'PENDING') ? 'PENDING' : relevant.some((linkage) => linkage.verificationStatus === 'UNVERIFIED') ? 'UNVERIFIED' : 'UNKNOWN';
  if (verified.length === 0) return { dimension: { posture: fallback, linkagePosture, evidenceReferenceIds: ids, limitationCodes: limitations }, conflict: null };
  const postures = [...new Set(verified.map((linkage) => linkage.posture))].sort();
  if (postures.length > 1) return { dimension: { posture: fallback, linkagePosture, evidenceReferenceIds: ids, limitationCodes: limitations }, conflict: { relationshipType: type, postures, evidenceReferenceIds: ids } };
  return { dimension: { posture: postures[0] as T, linkagePosture, evidenceReferenceIds: ids, limitationCodes: limitations }, conflict: null };
}

export function normalizeSourceEvidence(input: unknown): NormalizedSourceEvidence {
  const reasons = new Set<SourceEvidenceNormalizationFailureReason>();
  const sourceId = isRecord(input) && typeof input.sourceId === 'string' ? input.sourceId.trim() : '';
  if (!sourceId || !ID_PATTERN.test(sourceId)) reasons.add('MISSING_SOURCE_ID');
  const registryRecord = sourceId ? getReieSourceRegistry().records.find((record) => record.sourceId === sourceId) : null;
  if (sourceId && !registryRecord) reasons.add('UNKNOWN_SOURCE_ID');
  const rawLinkages = isRecord(input) && Array.isArray(input.linkages) ? input.linkages : null;
  if (!isRecord(input) || !rawLinkages) reasons.add('INVALID_INPUT_SHAPE');
  const linkages: SourceEvidenceLinkageRecord[] = [];
  for (const raw of rawLinkages ?? []) {
    const localReasons = new Set<SourceEvidenceNormalizationFailureReason>();
    const linkage = validateLinkage(raw, sourceId, localReasons);
    for (const reason of localReasons) reasons.add(reason);
    if (linkage) linkages.push(linkage);
  }
  const rights = dimension<RightsPosture>(linkages, 'RIGHTS', 'UNKNOWN');
  const technicalAccess = dimension<TechnicalAccessPosture>(linkages, 'TECHNICAL_ACCESS', 'UNKNOWN');
  const freshness = dimension<FreshnessPosture>(linkages, 'FRESHNESS', 'UNKNOWN');
  const attribution = dimension<AttributionPosture>(linkages, 'ATTRIBUTION', 'UNKNOWN');
  const provenance = dimension<ProvenancePosture>(linkages, 'PROVENANCE', 'UNKNOWN');
  const certification = dimension<CertificationPosture>(linkages, 'CERTIFICATION', 'ABSENT');
  const conflicts = [rights.conflict, technicalAccess.conflict, freshness.conflict, attribution.conflict, provenance.conflict, certification.conflict].filter(Boolean) as NormalizedSourceEvidence['conflicts'];
  const dimensions = [rights.dimension, technicalAccess.dimension, freshness.dimension, attribution.dimension, provenance.dimension, certification.dimension];
  const linkagePosture: LinkagePosture = dimensions.every((item) => item.linkagePosture === 'VERIFIED') ? 'VERIFIED' : dimensions.some((item) => item.linkagePosture === 'PENDING') ? 'PENDING' : dimensions.some((item) => item.linkagePosture === 'UNVERIFIED') ? 'UNVERIFIED' : 'UNKNOWN';
  const insufficient = !registryRecord || dimensions.some((item) => item.linkagePosture !== 'VERIFIED') || rights.dimension.posture === 'UNKNOWN' || rights.dimension.posture === 'PENDING' || technicalAccess.dimension.posture === 'UNKNOWN' || technicalAccess.dimension.posture === 'PENDING' || freshness.dimension.posture === 'UNKNOWN' || freshness.dimension.posture === 'STALE_VERIFICATION' || attribution.dimension.posture === 'UNKNOWN' || provenance.dimension.posture === 'UNKNOWN' || provenance.dimension.posture === 'INCOMPLETE' || certification.dimension.posture !== 'REFERENCED';
  const result: SourceEvidenceNormalizationResult = reasons.size > 0 ? 'INVALID_LINKAGE' : conflicts.length > 0 ? 'CONFLICT_REQUIRES_REVIEW' : insufficient ? 'INSUFFICIENT_EVIDENCE' : 'NORMALIZED';
  const source = registryRecord ? {
    sourceId: registryRecord.sourceId,
    sourceClass: registryRecord.sourceClass,
    responsibleOrganization: registryRecord.responsibleOrganization,
    declaredActivationPosture: registryRecord.productionActivationState,
    permittedUse: registryRecord.permittedUse,
    claimEligible: registryRecord.claimEligible,
    customerDisclosureEligible: registryRecord.customerDisclosureEligible,
    sourcePaths: registryRecord.sourcePaths,
    freshnessExpectation: registryRecord.freshnessExpectation,
    lastSourceVerificationDate: registryRecord.lastSourceVerificationDate,
    lastSuccessfulDataRefresh: registryRecord.lastSuccessfulDataRefresh,
  } : null;
  const output = {
    source,
    rights: rights.dimension,
    technicalAccess: technicalAccess.dimension,
    activation: { declaredPosture: source?.declaredActivationPosture ?? 'UNKNOWN', sourceRegistryReference: source ? 'lib/sourceRegistry.ts' as const : null },
    freshness: freshness.dimension,
    attribution: attribution.dimension,
    provenance: provenance.dimension,
    certification: certification.dimension,
    linkagePosture,
    conflicts,
    result,
    reasons: [...reasons].sort(),
  } as const;
  return { ...output, normalizationFingerprint: 'source-evidence-normalization:v1:' + hash(JSON.stringify(output)) };
}
