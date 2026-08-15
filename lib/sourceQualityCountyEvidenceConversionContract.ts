import {
  SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
  normalizeSourceEvidence,
  type SourceEvidenceCertificationReference,
  type SourceEvidenceClass,
  type SourceEvidenceLimitationCode,
  type SourceEvidenceLinkageRecord,
  type SourceEvidenceVerificationStatus,
} from './sourceQualityEvidenceNormalization';
import {
  SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
  type SourceQualitySummaryAssemblyRequest,
} from './sourceQualitySummaryAssembly';

export const SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1' as const;
export const BOULDER_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-BOULDER-COUNTY-ASSESSOR' as const;

export const COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS = Object.freeze([
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  'SRC-BOULDER-COUNTY-TREASURER',
  'SRC-BOULDER-PERMIT-CANDIDATES',
] as const);

export type CountySourceQualityConversionSourceClass =
  | 'COUNTY_ASSESSOR'
  | 'COUNTY_TREASURER'
  | 'COUNTY_PERMIT_CANDIDATE';

export type CountyEvidenceInputClass =
  | 'RIGHTS_READINESS_REFERENCE'
  | 'TECHNICAL_ACCESS_REFERENCE'
  | 'FRESHNESS_REFERENCE'
  | 'ATTRIBUTION_REFERENCE'
  | 'PROVENANCE_REFERENCE'
  | 'CERTIFICATION_REFERENCE';

export type CountyFieldSensitivityPosture =
  | 'LOW_SENSITIVITY_PUBLIC_CONTEXT'
  | 'PROPERTY_RECORD_CONTEXT'
  | 'IDENTIFIER_BEARING_CONTEXT'
  | 'CONTACT_OR_PERSONAL_CONTEXT'
  | 'RESTRICTED_OR_UNREVIEWED'
  | 'UNKNOWN';

export type CountyEvidenceConversionAuthorityClass =
  | 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW'
  | 'DELEGATED_COUNTY_EVIDENCE_CONVERSION_REVIEW';

export type CountyEvidenceConversionResultClassification =
  | 'COUNTY_EVIDENCE_CONVERSION_VALID'
  | 'COUNTY_SOURCE_CONFIRMATION_REQUIRED'
  | 'COUNTY_EVIDENCE_REFERENCE_INVALID'
  | 'COUNTY_EVIDENCE_SOURCE_MISMATCH'
  | 'COUNTY_NARRATIVE_INPUT_REJECTED'
  | 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED'
  | 'COUNTY_CERTIFICATION_REQUIRED'
  | 'COUNTY_EVIDENCE_INSUFFICIENT'
  | 'FAIL_CLOSED';

export type CountySourceConfirmation = Readonly<{
  sourceId: string;
  confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED';
  reviewedAt: string;
}>;

export type CountyStructuredEvidenceReference = Readonly<{
  sourceId: string;
  inputClass: CountyEvidenceInputClass;
  evidenceReferenceId: string;
  posture: string;
  verificationStatus: SourceEvidenceVerificationStatus;
  limitationCodes: readonly SourceEvidenceLimitationCode[];
}>;

export type CountySourceQualityEvidenceConversionRequest = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_SCHEMA_VERSION;
  sourceId: string;
  sourceClass: CountySourceQualityConversionSourceClass;
  sourceConfirmation?: CountySourceConfirmation;
  evidenceReferences: readonly CountyStructuredEvidenceReference[];
  certificationReference?: SourceEvidenceCertificationReference;
  fieldSensitivityPosture: CountyFieldSensitivityPosture;
  conversionAuthorityClass: CountyEvidenceConversionAuthorityClass;
  reviewedAt: string;
}>;

export const COUNTY_SOURCE_QUALITY_CONVERSION_FIREWALL = Object.freeze({
  exactSourceBinding: 'EXACT_SOURCE_ID_REQUIRED_NO_ALIAS_OR_DISCOVERY',
  sourceActivation: 'COUNTY_SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_CONVERSION',
  retrieval: 'COUNTY_RETRIEVAL_NOT_AUTHORIZED_BY_CONVERSION',
  customerDisplay: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_CONVERSION',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_CONVERSION',
  rightsActivationSeparation: 'STRUCTURED_RIGHTS_READINESS_EVIDENCE_NOT_SOURCE_ACTIVATION',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  manifestEligibility: 'LATER_MANIFEST_ELIGIBILITY_REQUIRES_SEPARATE_SOURCE_SPECIFIC_AUTHORIZATION',
});

export type CountySourceQualityEvidenceConversionResult = Readonly<{
  classification: CountyEvidenceConversionResultClassification;
  sourceId: string | null;
  linkages: readonly SourceEvidenceLinkageRecord[];
  normalized: ReturnType<typeof normalizeSourceEvidence> | null;
  inputFingerprint: string;
  conversionFingerprint: string;
  reasons: readonly string[];
  firewall: typeof COUNTY_SOURCE_QUALITY_CONVERSION_FIREWALL;
}>;

const ID_PATTERN = /^[A-Z][A-Z0-9_-]{2,119}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const REQUEST_KEYS = ['schemaVersion', 'sourceId', 'sourceClass', 'sourceConfirmation', 'evidenceReferences', 'certificationReference', 'fieldSensitivityPosture', 'conversionAuthorityClass', 'reviewedAt'];
const CONFIRMATION_KEYS = ['sourceId', 'confirmationClass', 'reviewedAt'];
const REFERENCE_KEYS = ['sourceId', 'inputClass', 'evidenceReferenceId', 'posture', 'verificationStatus', 'limitationCodes'];
const CERTIFICATION_KEYS = ['certificationId', 'repositoryReference', 'referenceVersion', 'linkageReviewedDate'];
const NARRATIVE_OR_PII_KEYS = ['narrative', 'notes', 'email', 'phone', 'name', 'ownerName', 'mailingAddress', 'address', 'customerRecord', 'propertyRecord', 'rawRecord', 'externalArtifact'];
const LIMITATION_CODES: readonly SourceEvidenceLimitationCode[] = [
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
];

const SOURCE_CLASSES: Record<(typeof COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS)[number], CountySourceQualityConversionSourceClass> = {
  'SRC-BOULDER-COUNTY-ASSESSOR': 'COUNTY_ASSESSOR',
  'SRC-BOULDER-COUNTY-TREASURER': 'COUNTY_TREASURER',
  'SRC-BOULDER-PERMIT-CANDIDATES': 'COUNTY_PERMIT_CANDIDATE',
};

const INPUT_MAPPINGS: Record<CountyEvidenceInputClass, Readonly<{
  relationshipType: SourceEvidenceLinkageRecord['relationshipType'];
  evidenceClass: SourceEvidenceClass;
  authoritativeContractType: SourceEvidenceLinkageRecord['authoritativeContractType'];
  repositoryReference: SourceEvidenceLinkageRecord['repositoryReference'];
  allowedPostures: readonly string[];
  linkageProvenance: SourceEvidenceLinkageRecord['linkageProvenance'];
}>> = {
  RIGHTS_READINESS_REFERENCE: {
    relationshipType: 'RIGHTS',
    evidenceClass: 'SOURCE_RIGHTS_READINESS',
    authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT',
    repositoryReference: 'lib/sourceRightsActivationReadiness.ts',
    allowedPostures: ['VERIFIED', 'PENDING', 'UNKNOWN', 'RESTRICTED'],
    linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
  },
  TECHNICAL_ACCESS_REFERENCE: {
    relationshipType: 'TECHNICAL_ACCESS',
    evidenceClass: 'SOURCE_RIGHTS_READINESS',
    authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT',
    repositoryReference: 'lib/sourceRightsActivationReadiness.ts',
    allowedPostures: ['READY', 'PENDING', 'BLOCKED', 'UNKNOWN'],
    linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
  },
  FRESHNESS_REFERENCE: {
    relationshipType: 'FRESHNESS',
    evidenceClass: 'DOMAIN_FRESHNESS',
    authoritativeContractType: 'DOMAIN_FRESHNESS_CONTRACT',
    repositoryReference: 'DOMAIN_STRUCTURED_CONTRACT',
    allowedPostures: ['VERIFIED_CURRENT', 'STALE_VERIFICATION', 'UNKNOWN', 'DOMAIN_SPECIFIC'],
    linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
  },
  ATTRIBUTION_REFERENCE: {
    relationshipType: 'ATTRIBUTION',
    evidenceClass: 'SOURCE_RIGHTS_READINESS',
    authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT',
    repositoryReference: 'lib/sourceRightsActivationReadiness.ts',
    allowedPostures: ['NONE_DOCUMENTED', 'REQUIRED', 'REQUIRED_PENDING_CONFIRMATION', 'UNKNOWN'],
    linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
  },
  PROVENANCE_REFERENCE: {
    relationshipType: 'PROVENANCE',
    evidenceClass: 'EVIDENCE_DEPTH',
    authoritativeContractType: 'EVIDENCE_DEPTH_CONTRACT',
    repositoryReference: 'lib/evidence-depth/evidencePosture.ts',
    allowedPostures: ['COMPLETE', 'PARTIAL', 'INCOMPLETE', 'UNKNOWN'],
    linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
  },
  CERTIFICATION_REFERENCE: {
    relationshipType: 'CERTIFICATION',
    evidenceClass: 'CERTIFICATION',
    authoritativeContractType: 'CERTIFICATION_REFERENCE',
    repositoryReference: 'docs/project-atlas/executive-library',
    allowedPostures: ['REFERENCED', 'ABSENT', 'UNVERIFIED'],
    linkageProvenance: 'CERTIFICATION_REFERENCE_ONLY',
  },
};

export const BOULDER_COUNTY_ASSESSOR_CONVERSION_POSTURE = 'COUNTY_PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_READY_SOURCE_CONFIRMATION_REQUIRED' as const;

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

function hasNarrativeOrPiiKey(value: Record<string, unknown>): boolean {
  return Object.keys(value).some((key) => NARRATIVE_OR_PII_KEYS.includes(key));
}

function validCertification(value: unknown): value is SourceEvidenceCertificationReference {
  return isRecord(value)
    && exactKeys(value, CERTIFICATION_KEYS)
    && validId(value.certificationId)
    && value.repositoryReference === 'docs/project-atlas/executive-library'
    && validId(value.referenceVersion)
    && validDate(value.linkageReviewedDate);
}

function validConfirmation(value: unknown, sourceId: string, reviewedAt: string): value is CountySourceConfirmation {
  return isRecord(value)
    && exactKeys(value, CONFIRMATION_KEYS)
    && value.sourceId === sourceId
    && value.confirmationClass === 'EXACT_SOURCE_ID_CONFIRMED'
    && value.reviewedAt === reviewedAt
    && validDate(value.reviewedAt);
}

function normalizedRequest(value: CountySourceQualityEvidenceConversionRequest): unknown {
  return {
    ...value,
    evidenceReferences: [...value.evidenceReferences].sort((left, right) =>
      (left.inputClass + ':' + left.evidenceReferenceId).localeCompare(right.inputClass + ':' + right.evidenceReferenceId)),
  };
}

function validReference(value: unknown, sourceId: string): value is CountyStructuredEvidenceReference {
  if (!isRecord(value) || hasNarrativeOrPiiKey(value) || !exactKeys(value, REFERENCE_KEYS)) return false;
  if (value.sourceId !== sourceId || !validId(value.evidenceReferenceId) || typeof value.inputClass !== 'string' || !Object.prototype.hasOwnProperty.call(INPUT_MAPPINGS, value.inputClass) || !['VERIFIED', 'PENDING', 'UNVERIFIED', 'REJECTED'].includes(String(value.verificationStatus))) return false;
  const mapping = INPUT_MAPPINGS[value.inputClass as CountyEvidenceInputClass];
  return typeof value.posture === 'string'
    && mapping.allowedPostures.includes(value.posture)
    && Array.isArray(value.limitationCodes)
    && value.limitationCodes.every((code) => LIMITATION_CODES.includes(code as SourceEvidenceLimitationCode));
}

function fail(
  classification: Exclude<CountyEvidenceConversionResultClassification, 'COUNTY_EVIDENCE_CONVERSION_VALID'>,
  inputFingerprint: string,
  ...reasons: string[]
): CountySourceQualityEvidenceConversionResult {
  return {
    classification,
    sourceId: null,
    linkages: [],
    normalized: null,
    inputFingerprint,
    conversionFingerprint: 'county-source-quality-conversion:v1:' + hash(stable({ classification, inputFingerprint, reasons: [...new Set(reasons)].sort() })),
    reasons: [...new Set(reasons)].sort(),
    firewall: COUNTY_SOURCE_QUALITY_CONVERSION_FIREWALL,
  };
}

function toLinkage(
  reference: CountyStructuredEvidenceReference,
  certificationReference: SourceEvidenceCertificationReference,
  reviewedAt: string,
): SourceEvidenceLinkageRecord {
  const mapping = INPUT_MAPPINGS[reference.inputClass];
  return {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId: reference.sourceId,
    evidenceClass: mapping.evidenceClass,
    authoritativeContractType: mapping.authoritativeContractType,
    evidenceReferenceId: reference.evidenceReferenceId,
    repositoryReference: mapping.repositoryReference,
    relationshipType: mapping.relationshipType,
    posture: reference.posture,
    verificationStatus: reference.verificationStatus,
    certificationReference,
    lastReviewedDate: reviewedAt,
    limitationCodes: [...reference.limitationCodes].sort(),
    linkageProvenance: mapping.linkageProvenance,
  } as SourceEvidenceLinkageRecord;
}

export function createCountySourceQualityEvidenceConversionFingerprint(input: unknown): string {
  return 'county-source-quality-conversion-input:v1:' + hash(stable(input));
}

export function convertCountyStructuredEvidence(input: unknown): CountySourceQualityEvidenceConversionResult {
  const inputFingerprint = createCountySourceQualityEvidenceConversionFingerprint(input);
  if (!isRecord(input)) return fail('FAIL_CLOSED', inputFingerprint, 'INVALID_REQUEST_SHAPE');
  if (hasNarrativeOrPiiKey(input)) return fail('COUNTY_NARRATIVE_INPUT_REJECTED', inputFingerprint, 'NARRATIVE_OR_PII_INPUT_NOT_COMPOSABLE');
  if (!exactKeys(input, REQUEST_KEYS)) return fail('COUNTY_EVIDENCE_REFERENCE_INVALID', inputFingerprint, 'UNSUPPORTED_REQUEST_FIELD');
  const sourceId = input.sourceId;
  const reviewedAt = input.reviewedAt;
  if (input.schemaVersion !== SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_SCHEMA_VERSION || !validId(sourceId) || !validDate(reviewedAt)) return fail('COUNTY_EVIDENCE_REFERENCE_INVALID', inputFingerprint, 'INVALID_REQUEST_SCHEMA_OR_ID_OR_DATE');
  if (!Object.prototype.hasOwnProperty.call(SOURCE_CLASSES, sourceId) || SOURCE_CLASSES[sourceId as keyof typeof SOURCE_CLASSES] !== input.sourceClass) return fail('COUNTY_EVIDENCE_SOURCE_MISMATCH', inputFingerprint, 'EXACT_COUNTY_SOURCE_ID_AND_CLASS_REQUIRED');
  if (!validConfirmation(input.sourceConfirmation, sourceId, reviewedAt)) return fail('COUNTY_SOURCE_CONFIRMATION_REQUIRED', inputFingerprint, 'EXACT_SOURCE_CONFIRMATION_REQUIRED');
  if (!validCertification(input.certificationReference)) return fail('COUNTY_CERTIFICATION_REQUIRED', inputFingerprint, 'CONTROLLED_CERTIFICATION_REFERENCE_REQUIRED');
  if (!['LOW_SENSITIVITY_PUBLIC_CONTEXT', 'PROPERTY_RECORD_CONTEXT', 'IDENTIFIER_BEARING_CONTEXT', 'CONTACT_OR_PERSONAL_CONTEXT', 'RESTRICTED_OR_UNREVIEWED', 'UNKNOWN'].includes(String(input.fieldSensitivityPosture))) return fail('COUNTY_FIELD_SENSITIVITY_UNREVIEWED', inputFingerprint, 'FIELD_SENSITIVITY_POSTURE_REQUIRED');
  if (input.fieldSensitivityPosture === 'RESTRICTED_OR_UNREVIEWED' || input.fieldSensitivityPosture === 'UNKNOWN') return fail('COUNTY_FIELD_SENSITIVITY_UNREVIEWED', inputFingerprint, 'FIELD_SENSITIVITY_REVIEW_REQUIRED');
  if (!['EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW', 'DELEGATED_COUNTY_EVIDENCE_CONVERSION_REVIEW'].includes(String(input.conversionAuthorityClass))) return fail('COUNTY_EVIDENCE_REFERENCE_INVALID', inputFingerprint, 'CONVERSION_AUTHORITY_CLASS_REQUIRED');
  if (!Array.isArray(input.evidenceReferences) || input.evidenceReferences.length === 0) return fail('COUNTY_EVIDENCE_INSUFFICIENT', inputFingerprint, 'STRUCTURED_EVIDENCE_REFERENCE_REQUIRED');
  if (input.evidenceReferences.some((reference) => isRecord(reference) && hasNarrativeOrPiiKey(reference))) return fail('COUNTY_NARRATIVE_INPUT_REJECTED', inputFingerprint, 'NARRATIVE_OR_PII_REFERENCE_NOT_COMPOSABLE');
  if (!input.evidenceReferences.every((reference) => validReference(reference, sourceId))) return fail('COUNTY_EVIDENCE_REFERENCE_INVALID', inputFingerprint, 'INVALID_OR_FOREIGN_STRUCTURED_REFERENCE');
  if (!input.evidenceReferences.some((reference) => reference.inputClass === 'CERTIFICATION_REFERENCE')) return fail('COUNTY_CERTIFICATION_REQUIRED', inputFingerprint, 'CERTIFICATION_LINKAGE_REFERENCE_REQUIRED');

  const request = input as CountySourceQualityEvidenceConversionRequest;
  const linkages = [...request.evidenceReferences]
    .sort((left, right) => (left.inputClass + ':' + left.evidenceReferenceId).localeCompare(right.inputClass + ':' + right.evidenceReferenceId))
    .map((reference) => toLinkage(reference, request.certificationReference!, request.reviewedAt));
  const normalized = normalizeSourceEvidence({ sourceId: request.sourceId, linkages });
  if (normalized.result === 'INVALID_LINKAGE') return fail('COUNTY_EVIDENCE_REFERENCE_INVALID', inputFingerprint, 'CANONICAL_NORMALIZATION_REJECTED_CONVERSION');
  const conversionFingerprint = 'county-source-quality-conversion:v1:' + hash(stable({
    request: normalizedRequest(request),
    linkages,
    normalizationFingerprint: normalized.normalizationFingerprint,
  }));
  return {
    classification: 'COUNTY_EVIDENCE_CONVERSION_VALID',
    sourceId: request.sourceId,
    linkages,
    normalized,
    inputFingerprint,
    conversionFingerprint,
    reasons: [],
    firewall: COUNTY_SOURCE_QUALITY_CONVERSION_FIREWALL,
  };
}

export function createCountySourceQualityAssemblyRequest(
  conversion: CountySourceQualityEvidenceConversionResult,
): SourceQualitySummaryAssemblyRequest | null {
  if (conversion.classification !== 'COUNTY_EVIDENCE_CONVERSION_VALID' || !conversion.sourceId || conversion.linkages.length === 0) return null;
  const certification = conversion.linkages.find((linkage) => linkage.relationshipType === 'CERTIFICATION')?.certificationReference;
  if (!certification) return null;
  return {
    schemaVersion: SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
    assemblyId: 'SQS-COUNTY-EVIDENCE-CONVERSION-001',
    coverageClass: 'PARTIAL_REVIEWED_SOURCE_SET',
    certificationReference: certification,
    entries: [{
      sourceId: conversion.sourceId,
      inclusionPosture: 'EXPLICITLY_SUPPLIED_SPARSE_REVIEW_SOURCE',
      linkages: conversion.linkages,
      certificationReference: certification,
    }],
  };
}

export const BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-15',
  },
  evidenceReferences: [{
    sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'COUNTY-CONVERSION-SYNTHETIC-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: {
    certificationId: 'CERT-COUNTY-CONVERSION-SYNTHETIC-001',
    repositoryReference: 'docs/project-atlas/executive-library',
    referenceVersion: 'V01',
    linkageReviewedDate: '2026-08-15',
  },
  fieldSensitivityPosture: 'PROPERTY_RECORD_CONTEXT',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-15',
});
