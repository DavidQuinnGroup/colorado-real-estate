import type {
  SourceEvidenceCertificationReference,
  SourceEvidenceClass,
  SourceEvidenceLimitationCode,
  SourceEvidenceLinkageRecord,
} from './sourceQualityEvidenceNormalization';
import type { SourceQualitySummaryAssemblyRequest } from './sourceQualitySummaryAssembly';

export const SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_OPERATIONAL_MANIFEST_V1' as const;
const SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_SUMMARY_ASSEMBLY_V1' as const;

export type SourceQualityOperationalCoverageClass = 'PARTIAL_REVIEWED_SOURCE_SET';
export type SourceQualityOperationalInclusionClass = 'STRUCTURED_EVIDENCE_INCLUDED' | 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS';
export type SourceQualityOperationalReviewAuthorityClass = 'EXECUTIVE_SOURCE_GOVERNANCE_REVIEW' | 'DELEGATED_SOURCE_GOVERNANCE_REVIEW';
export type SourceQualityOperationalManifestResultClassification =
  | 'OPERATIONAL_MANIFEST_VALID'
  | 'PARTIAL_OPERATIONAL_MANIFEST_VALID'
  | 'MANIFEST_ENTRY_INVALID'
  | 'DUPLICATE_SOURCE_ID'
  | 'UNSUPPORTED_COVERAGE_CLASS'
  | 'UNSUPPORTED_INCLUSION_CLASS'
  | 'STRUCTURED_EVIDENCE_REQUIRED'
  | 'CERTIFICATION_REFERENCE_REQUIRED'
  | 'FAIL_CLOSED';

export type SourceQualityOperationalManifestEntryInput = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION;
  manifestId: string;
  sourceId: string;
  inclusionClass: SourceQualityOperationalInclusionClass;
  linkages: readonly SourceEvidenceLinkageRecord[];
  expectedEvidenceClasses: readonly SourceEvidenceClass[];
  certificationReference: SourceEvidenceCertificationReference;
  reviewedAt: string;
  reviewAuthorityClass: SourceQualityOperationalReviewAuthorityClass;
  limitationCodes: readonly SourceEvidenceLimitationCode[];
}>;

export type SourceQualityOperationalManifestInput = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION;
  manifestId: string;
  coverageClass: SourceQualityOperationalCoverageClass;
  suppliedDatasetScope: 'SUPPLIED_MANIFEST_ONLY';
  operationalPosture: 'OPERATIONAL_INPUT_POSTURE_ONLY';
  completenessClaim: 'NO_COMPLETENESS_CLAIM';
  reviewedAt: string;
  reviewAuthorityClass: SourceQualityOperationalReviewAuthorityClass;
  certificationReference: SourceEvidenceCertificationReference;
  entries: readonly SourceQualityOperationalManifestEntryInput[];
}>;

export type SourceQualityOperationalManifestEntry = SourceQualityOperationalManifestEntryInput & Readonly<{
  entryFingerprint: string;
}>;

export type SourceQualityOperationalManifest = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION;
  manifestId: string;
  coverageClass: 'PARTIAL_REVIEWED_SOURCE_SET';
  suppliedDatasetScope: 'SUPPLIED_MANIFEST_ONLY';
  operationalPosture: 'OPERATIONAL_INPUT_POSTURE_ONLY';
  completenessClaim: 'NO_COMPLETENESS_CLAIM';
  reviewedAt: string;
  reviewAuthorityClass: SourceQualityOperationalReviewAuthorityClass;
  certificationReference: SourceEvidenceCertificationReference;
  entries: readonly SourceQualityOperationalManifestEntry[];
  authorityFirewall: Readonly<{
    sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST';
    customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST';
    legalUse: 'LEGAL_USE_NOT_APPROVED_BY_MANIFEST';
    qualityScore: 'NO_QUALITY_SCORE';
    providerRanking: 'NO_PROVIDER_RANKING';
    completeness: 'NO_COMPLETENESS_CLAIM';
  }>;
  manifestFingerprint: string;
}>;

export type SourceQualityOperationalManifestResult = Readonly<{
  classification: SourceQualityOperationalManifestResultClassification;
  manifest: SourceQualityOperationalManifest | null;
  reasons: readonly string[];
}>;

const ID_PATTERN = /^[A-Z][A-Z0-9_-]{2,119}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MANIFEST_KEYS = ['schemaVersion', 'manifestId', 'coverageClass', 'suppliedDatasetScope', 'operationalPosture', 'completenessClaim', 'reviewedAt', 'reviewAuthorityClass', 'certificationReference', 'entries'];
const ENTRY_KEYS = ['schemaVersion', 'manifestId', 'sourceId', 'inclusionClass', 'linkages', 'expectedEvidenceClasses', 'certificationReference', 'reviewedAt', 'reviewAuthorityClass', 'limitationCodes'];
const LINKAGE_KEYS = ['schemaVersion', 'sourceId', 'evidenceClass', 'authoritativeContractType', 'evidenceReferenceId', 'repositoryReference', 'relationshipType', 'posture', 'verificationStatus', 'certificationReference', 'lastReviewedDate', 'limitationCodes', 'linkageProvenance'];
const CERTIFICATION_KEYS = ['certificationId', 'repositoryReference', 'referenceVersion', 'linkageReviewedDate'];
const EVIDENCE_CLASSES: readonly SourceEvidenceClass[] = ['SOURCE_RIGHTS_READINESS', 'EVIDENCE_DEPTH', 'GEOGRAPHIC_PROVENANCE', 'LICENSING_RESOLUTION', 'PROVIDER_INVENTORY', 'MLS_FRESHNESS', 'DOMAIN_FRESHNESS', 'CERTIFICATION', 'NARRATIVE_ONLY'];
const LIMITATION_CODES: readonly SourceEvidenceLimitationCode[] = ['RIGHTS_PENDING', 'RIGHTS_RESTRICTED', 'TECHNICAL_ACCESS_PENDING', 'TECHNICAL_ACCESS_BLOCKED', 'FRESHNESS_DOMAIN_SPECIFIC', 'FRESHNESS_STALE_VERIFICATION', 'ATTRIBUTION_REQUIRED', 'ATTRIBUTION_PENDING_CONFIRMATION', 'PROVENANCE_PARTIAL', 'PROVENANCE_INCOMPLETE', 'CERTIFICATION_ABSENT', 'NARRATIVE_ONLY_NON_COMPOSABLE'];
const PROHIBITED_FIELDS = ['notes', 'narrative', 'providerName', 'countyName', 'sourceUrl', 'url', 'fileName', 'semanticSimilarity', 'fuzzyMatch', 'rightsConclusion', 'activationAuthority', 'legalUseApproval', 'customerDisplayAuthority', 'qualityScore', 'ranking', 'credential', 'secret', 'email', 'phone', 'address', 'protectedCountyArtifact'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => key in value);
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

function sameSet(value: unknown, expected: readonly string[]): boolean {
  return Array.isArray(value) && value.length === expected.length && new Set(value).size === value.length && value.every((entry) => typeof entry === 'string' && expected.includes(entry));
}

function hasProhibitedField(value: Record<string, unknown>): boolean {
  return Object.keys(value).some((key) => PROHIBITED_FIELDS.includes(key));
}

function validCertificationReference(value: unknown): value is SourceEvidenceCertificationReference {
  return isRecord(value)
    && exactKeys(value, CERTIFICATION_KEYS)
    && validId(value.certificationId)
    && (value.repositoryReference === 'docs/project-atlas/executive-library/REIE-SOURCE-REGISTRY-GRAND-PLAN-ADVANCEMENT-PRODUCTION-CERTIFICATION.md' || value.repositoryReference === 'docs/project-atlas/executive-library/SOURCE-RIGHTS-READINESS-1-PRODUCTION-CERTIFICATION.md' || value.repositoryReference === 'docs/project-atlas/executive-library')
    && validId(value.referenceVersion)
    && validDate(value.linkageReviewedDate);
}

function validLinkage(value: unknown, sourceId: string): value is SourceEvidenceLinkageRecord {
  if (!isRecord(value) || hasProhibitedField(value) || !exactKeys(value, LINKAGE_KEYS)) return false;
  return value.schemaVersion === 'REIE_SOURCE_QUALITY_EVIDENCE_NORMALIZATION_V1'
    && value.sourceId === sourceId
    && EVIDENCE_CLASSES.includes(value.evidenceClass as SourceEvidenceClass)
    && validId(value.evidenceReferenceId)
    && ['RIGHTS', 'TECHNICAL_ACCESS', 'FRESHNESS', 'ATTRIBUTION', 'PROVENANCE', 'CERTIFICATION'].includes(String(value.relationshipType))
    && typeof value.posture === 'string'
    && ['VERIFIED', 'PENDING', 'UNVERIFIED', 'REJECTED'].includes(String(value.verificationStatus))
    && (value.certificationReference === null || validCertificationReference(value.certificationReference))
    && validDate(value.lastReviewedDate)
    && Array.isArray(value.limitationCodes)
    && value.limitationCodes.every((code) => LIMITATION_CODES.includes(code as SourceEvidenceLimitationCode))
    && ['EXPLICIT_REVIEWED_LINKAGE', 'AUTHORITATIVE_EMBEDDED_SOURCE_ID', 'CERTIFICATION_REFERENCE_ONLY'].includes(String(value.linkageProvenance));
}

function validEntry(value: unknown, manifestId: string): value is SourceQualityOperationalManifestEntryInput {
  if (!isRecord(value) || hasProhibitedField(value) || !exactKeys(value, ENTRY_KEYS)) return false;
  if (value.schemaVersion !== SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION || value.manifestId !== manifestId || typeof value.sourceId !== 'string' || !/^SRC-[A-Z0-9_-]+$/.test(value.sourceId)) return false;
  const sourceId = value.sourceId;
  if (!['STRUCTURED_EVIDENCE_INCLUDED', 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS'].includes(String(value.inclusionClass)) || !validCertificationReference(value.certificationReference) || !validDate(value.reviewedAt) || !['EXECUTIVE_SOURCE_GOVERNANCE_REVIEW', 'DELEGATED_SOURCE_GOVERNANCE_REVIEW'].includes(String(value.reviewAuthorityClass))) return false;
  if (!Array.isArray(value.linkages) || value.linkages.length === 0 || !value.linkages.every((linkage) => validLinkage(linkage, sourceId))) return false;
  const evidenceClasses = value.linkages.map((linkage) => linkage.evidenceClass);
  if (!Array.isArray(value.expectedEvidenceClasses) || !sameSet(value.expectedEvidenceClasses, [...new Set(evidenceClasses)].sort())) return false;
  return Array.isArray(value.limitationCodes) && value.limitationCodes.every((code) => LIMITATION_CODES.includes(code as SourceEvidenceLimitationCode));
}

export function createSourceQualityOperationalManifestFingerprint(value: unknown): string {
  return 'source-quality-operational-manifest:v1:' + hash(stable(value));
}

function fail(classification: Exclude<SourceQualityOperationalManifestResultClassification, 'OPERATIONAL_MANIFEST_VALID' | 'PARTIAL_OPERATIONAL_MANIFEST_VALID'>, ...reasons: string[]): SourceQualityOperationalManifestResult {
  return { classification, manifest: null, reasons: [...new Set(reasons)].sort() };
}

export function validateSourceQualityOperationalManifest(input: unknown): SourceQualityOperationalManifestResult {
  if (!isRecord(input) || hasProhibitedField(input) || !exactKeys(input, MANIFEST_KEYS)) return fail('FAIL_CLOSED', 'INVALID_MANIFEST_SHAPE');
  const manifestId = input.manifestId;
  if (input.schemaVersion !== SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION || !validId(manifestId) || !validDate(input.reviewedAt)) return fail('FAIL_CLOSED', 'INVALID_MANIFEST_ID_OR_DATE');
  if (input.coverageClass !== 'PARTIAL_REVIEWED_SOURCE_SET' || input.suppliedDatasetScope !== 'SUPPLIED_MANIFEST_ONLY' || input.operationalPosture !== 'OPERATIONAL_INPUT_POSTURE_ONLY' || input.completenessClaim !== 'NO_COMPLETENESS_CLAIM') return fail('UNSUPPORTED_COVERAGE_CLASS', 'NO_COMPLETENESS_CLAIM_REQUIRED');
  if (!['EXECUTIVE_SOURCE_GOVERNANCE_REVIEW', 'DELEGATED_SOURCE_GOVERNANCE_REVIEW'].includes(String(input.reviewAuthorityClass))) return fail('MANIFEST_ENTRY_INVALID', 'REVIEW_AUTHORITY_REQUIRED');
  if (!validCertificationReference(input.certificationReference)) return fail('CERTIFICATION_REFERENCE_REQUIRED', 'CERTIFICATION_REFERENCE_REQUIRED');
  if (!Array.isArray(input.entries) || input.entries.length === 0) return fail('STRUCTURED_EVIDENCE_REQUIRED', 'ENTRIES_REQUIRED');
  const entries = input.entries;
  const sourceIds = entries.filter(isRecord).map((entry) => entry.sourceId).filter((sourceId): sourceId is string => typeof sourceId === 'string');
  if (new Set(sourceIds).size !== sourceIds.length) return fail('DUPLICATE_SOURCE_ID', 'DUPLICATE_SOURCE_ID');
  const invalid = entries.find((entry) => !validEntry(entry, manifestId));
  if (invalid) {
    if (isRecord(invalid) && !validCertificationReference(invalid.certificationReference)) return fail('CERTIFICATION_REFERENCE_REQUIRED', 'ENTRY_CERTIFICATION_REFERENCE_REQUIRED');
    if (isRecord(invalid) && !['STRUCTURED_EVIDENCE_INCLUDED', 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS'].includes(String(invalid.inclusionClass))) return fail('UNSUPPORTED_INCLUSION_CLASS', 'UNSUPPORTED_INCLUSION_CLASS');
    if (isRecord(invalid) && (!Array.isArray(invalid.linkages) || invalid.linkages.length === 0)) return fail('STRUCTURED_EVIDENCE_REQUIRED', 'STRUCTURED_EVIDENCE_REQUIRED');
    return fail('MANIFEST_ENTRY_INVALID', 'MANIFEST_ENTRY_INVALID');
  }
  const manifestInput = input as SourceQualityOperationalManifestInput;
  const normalizedEntries = [...manifestInput.entries]
    .sort((left, right) => left.sourceId.localeCompare(right.sourceId))
    .map((entry) => {
      const basis = { ...entry, linkages: [...entry.linkages].sort((left, right) => left.evidenceReferenceId.localeCompare(right.evidenceReferenceId)), expectedEvidenceClasses: [...entry.expectedEvidenceClasses].sort(), limitationCodes: [...entry.limitationCodes].sort() };
      return { ...basis, entryFingerprint: createSourceQualityOperationalManifestFingerprint(basis) } as SourceQualityOperationalManifestEntry;
    });
  const manifestBasis = {
    schemaVersion: SOURCE_QUALITY_OPERATIONAL_MANIFEST_SCHEMA_VERSION,
    manifestId: manifestInput.manifestId,
    coverageClass: manifestInput.coverageClass,
    suppliedDatasetScope: manifestInput.suppliedDatasetScope,
    operationalPosture: manifestInput.operationalPosture,
    completenessClaim: manifestInput.completenessClaim,
    reviewedAt: manifestInput.reviewedAt,
    reviewAuthorityClass: manifestInput.reviewAuthorityClass,
    certificationReference: manifestInput.certificationReference,
    entries: normalizedEntries.map((entry) => ({ sourceId: entry.sourceId, entryFingerprint: entry.entryFingerprint })),
  };
  const manifest: SourceQualityOperationalManifest = {
    ...manifestBasis,
    coverageClass: 'PARTIAL_REVIEWED_SOURCE_SET',
    suppliedDatasetScope: 'SUPPLIED_MANIFEST_ONLY',
    operationalPosture: 'OPERATIONAL_INPUT_POSTURE_ONLY',
    completenessClaim: 'NO_COMPLETENESS_CLAIM',
    entries: normalizedEntries,
    authorityFirewall: {
      sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST',
      customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST',
      legalUse: 'LEGAL_USE_NOT_APPROVED_BY_MANIFEST',
      qualityScore: 'NO_QUALITY_SCORE',
      providerRanking: 'NO_PROVIDER_RANKING',
      completeness: 'NO_COMPLETENESS_CLAIM',
    },
    manifestFingerprint: createSourceQualityOperationalManifestFingerprint(manifestBasis),
  };
  return { classification: 'PARTIAL_OPERATIONAL_MANIFEST_VALID', manifest, reasons: [] };
}

export function sourceQualityOperationalManifestToAssemblyRequest(manifest: SourceQualityOperationalManifest): SourceQualitySummaryAssemblyRequest {
  return {
    schemaVersion: SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
    assemblyId: manifest.manifestId,
    coverageClass: manifest.coverageClass,
    certificationReference: manifest.certificationReference,
    entries: manifest.entries.map((entry) => ({
      sourceId: entry.sourceId,
      inclusionPosture: entry.inclusionClass === 'STRUCTURED_EVIDENCE_INCLUDED' ? 'EXPLICITLY_SUPPLIED_REVIEWED_SOURCE' : 'EXPLICITLY_SUPPLIED_SPARSE_REVIEW_SOURCE',
      linkages: entry.linkages,
      certificationReference: entry.certificationReference,
    })),
  };
}
