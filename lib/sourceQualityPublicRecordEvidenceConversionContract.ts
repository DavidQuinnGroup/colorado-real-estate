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

export const SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1' as const;

export const PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS = Object.freeze([
  'SRC-BOULDER-COUNTY-ASSESSOR',
  'SRC-BOULDER-COUNTY-TREASURER',
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
  'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
] as const);

export type PublicRecordSourceQualityConversionSourceClass =
  | 'COUNTY_ASSESSOR'
  | 'COUNTY_TREASURER'
  | 'COUNTY_PERMIT'
  | 'MUNICIPAL_OPEN_DATA_PERMIT'
  | 'MUNICIPAL_PERMIT_PORTAL';

export type PublicRecordEvidenceInputClass =
  | 'RIGHTS_READINESS_REFERENCE'
  | 'TECHNICAL_ACCESS_REFERENCE'
  | 'FRESHNESS_REFERENCE'
  | 'ATTRIBUTION_REFERENCE'
  | 'PROVENANCE_REFERENCE'
  | 'CERTIFICATION_REFERENCE';

export type PublicRecordFieldSensitivityPosture =
  | 'LOW_SENSITIVITY_PUBLIC_CONTEXT'
  | 'PROPERTY_RECORD_CONTEXT'
  | 'IDENTIFIER_BEARING_CONTEXT'
  | 'CONTACT_OR_PERSONAL_CONTEXT'
  | 'RESTRICTED_OR_UNREVIEWED'
  | 'UNKNOWN';

export type PublicRecordEvidenceConversionAuthorityClass =
  | 'EXECUTIVE_PUBLIC_RECORD_EVIDENCE_CONVERSION_REVIEW'
  | 'DELEGATED_PUBLIC_RECORD_EVIDENCE_CONVERSION_REVIEW'
  | 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW'
  | 'DELEGATED_COUNTY_EVIDENCE_CONVERSION_REVIEW';

export type PublicRecordEvidenceConversionResultClassification =
  | 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID'
  | 'PUBLIC_RECORD_SOURCE_CONFIRMATION_REQUIRED'
  | 'PUBLIC_RECORD_SOURCE_INVALID'
  | 'PUBLIC_RECORD_SOURCE_MISMATCH'
  | 'PUBLIC_RECORD_REFERENCE_INVALID'
  | 'PUBLIC_RECORD_CERTIFICATION_REQUIRED'
  | 'PUBLIC_RECORD_FIELD_SENSITIVITY_UNREVIEWED'
  | 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED'
  | 'PUBLIC_RECORD_EVIDENCE_INSUFFICIENT'
  | 'FAIL_CLOSED';

export type PublicRecordSourceConfirmation = Readonly<{
  sourceId: string;
  confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED';
  reviewedAt: string;
}>;

export type PublicRecordStructuredEvidenceReference = Readonly<{
  sourceId: string;
  inputClass: PublicRecordEvidenceInputClass;
  evidenceReferenceId: string;
  posture: string;
  verificationStatus: SourceEvidenceVerificationStatus;
  limitationCodes: readonly SourceEvidenceLimitationCode[];
}>;

export type PublicRecordSourceQualityEvidenceConversionRequest = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_SCHEMA_VERSION;
  sourceId: string;
  sourceClass: PublicRecordSourceQualityConversionSourceClass;
  sourceConfirmation?: PublicRecordSourceConfirmation;
  evidenceReferences: readonly PublicRecordStructuredEvidenceReference[];
  certificationReference?: SourceEvidenceCertificationReference;
  fieldSensitivityPosture: PublicRecordFieldSensitivityPosture;
  conversionAuthorityClass: PublicRecordEvidenceConversionAuthorityClass;
  reviewedAt: string;
}>;

export const PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL = Object.freeze({
  exactSourceBinding: 'EXACT_SOURCE_ID_REQUIRED_NO_ALIAS_OR_DISCOVERY',
  sourceActivation: 'PUBLIC_RECORD_SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_CONVERSION',
  retrieval: 'PUBLIC_RECORD_RETRIEVAL_NOT_AUTHORIZED_BY_CONVERSION',
  scraping: 'PUBLIC_RECORD_SCRAPING_NOT_AUTHORIZED_BY_CONVERSION',
  customerDisplay: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_CONVERSION',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_CONVERSION',
  rightsActivationSeparation: 'STRUCTURED_RIGHTS_READINESS_EVIDENCE_NOT_SOURCE_ACTIVATION',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  openDataFallacy: 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY',
  portalFallacy: 'PORTAL_EXISTENCE_NOT_AUTOMATION_OR_DISPLAY_AUTHORITY',
  manifestEligibility: 'LATER_MANIFEST_ELIGIBILITY_REQUIRES_SEPARATE_SOURCE_SPECIFIC_AUTHORIZATION',
});

export type PublicRecordSourceQualityEvidenceConversionResult = Readonly<{
  classification: PublicRecordEvidenceConversionResultClassification;
  sourceId: string | null;
  linkages: readonly SourceEvidenceLinkageRecord[];
  normalized: ReturnType<typeof normalizeSourceEvidence> | null;
  inputFingerprint: string;
  conversionFingerprint: string;
  reasons: readonly string[];
  firewall: typeof PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL;
}>;

const ID_PATTERN = /^[A-Z][A-Z0-9_-]{2,119}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const REQUEST_KEYS = ['schemaVersion', 'sourceId', 'sourceClass', 'sourceConfirmation', 'evidenceReferences', 'certificationReference', 'fieldSensitivityPosture', 'conversionAuthorityClass', 'reviewedAt'];
const CONFIRMATION_KEYS = ['sourceId', 'confirmationClass', 'reviewedAt'];
const REFERENCE_KEYS = ['sourceId', 'inputClass', 'evidenceReferenceId', 'posture', 'verificationStatus', 'limitationCodes'];
const CERTIFICATION_KEYS = ['certificationId', 'repositoryReference', 'referenceVersion', 'linkageReviewedDate'];
const NARRATIVE_OR_PII_KEYS = ['narrative', 'notes', 'email', 'phone', 'name', 'ownerName', 'applicantName', 'taxpayerName', 'contractorName', 'mailingAddress', 'address', 'parcel', 'parcelId', 'permit', 'permitNumber', 'inspection', 'customerRecord', 'propertyRecord', 'rawRecord', 'externalArtifact', 'agreementText', 'websiteProse', 'pdfText'];
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

const SOURCE_CLASSES: Record<(typeof PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS)[number], PublicRecordSourceQualityConversionSourceClass> = {
  'SRC-BOULDER-COUNTY-ASSESSOR': 'COUNTY_ASSESSOR',
  'SRC-BOULDER-COUNTY-TREASURER': 'COUNTY_TREASURER',
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS': 'COUNTY_PERMIT',
  'SRC-CITY-BOULDER-OPEN-DATA-PERMITS': 'MUNICIPAL_OPEN_DATA_PERMIT',
  'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL': 'MUNICIPAL_PERMIT_PORTAL',
};

const INPUT_MAPPINGS: Record<PublicRecordEvidenceInputClass, Readonly<{
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

function validConfirmation(value: unknown, sourceId: string, reviewedAt: string): value is PublicRecordSourceConfirmation {
  return isRecord(value)
    && exactKeys(value, CONFIRMATION_KEYS)
    && value.sourceId === sourceId
    && value.confirmationClass === 'EXACT_SOURCE_ID_CONFIRMED'
    && value.reviewedAt === reviewedAt
    && validDate(value.reviewedAt);
}

function normalizedRequest(value: PublicRecordSourceQualityEvidenceConversionRequest): unknown {
  return {
    ...value,
    evidenceReferences: [...value.evidenceReferences].sort((left, right) =>
      (left.inputClass + ':' + left.evidenceReferenceId).localeCompare(right.inputClass + ':' + right.evidenceReferenceId)),
  };
}

function validReference(value: unknown, sourceId: string): value is PublicRecordStructuredEvidenceReference {
  if (!isRecord(value) || hasNarrativeOrPiiKey(value) || !exactKeys(value, REFERENCE_KEYS)) return false;
  if (value.sourceId !== sourceId || !validId(value.evidenceReferenceId) || typeof value.inputClass !== 'string' || !Object.prototype.hasOwnProperty.call(INPUT_MAPPINGS, value.inputClass) || !['VERIFIED', 'PENDING', 'UNVERIFIED', 'REJECTED'].includes(String(value.verificationStatus))) return false;
  const mapping = INPUT_MAPPINGS[value.inputClass as PublicRecordEvidenceInputClass];
  return typeof value.posture === 'string'
    && mapping.allowedPostures.includes(value.posture)
    && Array.isArray(value.limitationCodes)
    && value.limitationCodes.every((code) => LIMITATION_CODES.includes(code as SourceEvidenceLimitationCode));
}

function fail(
  classification: Exclude<PublicRecordEvidenceConversionResultClassification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID'>,
  inputFingerprint: string,
  ...reasons: string[]
): PublicRecordSourceQualityEvidenceConversionResult {
  return {
    classification,
    sourceId: null,
    linkages: [],
    normalized: null,
    inputFingerprint,
    conversionFingerprint: 'public-record-source-quality-conversion:v1:' + hash(stable({ classification, inputFingerprint, reasons: [...new Set(reasons)].sort() })),
    reasons: [...new Set(reasons)].sort(),
    firewall: PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL,
  };
}

function toLinkage(
  reference: PublicRecordStructuredEvidenceReference,
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

export function createPublicRecordSourceQualityEvidenceConversionFingerprint(input: unknown): string {
  return 'public-record-source-quality-conversion-input:v1:' + hash(stable(input));
}

export function createPublicRecordSourceQualityConversionFingerprintBasis(
  request: PublicRecordSourceQualityEvidenceConversionRequest,
  linkages: readonly SourceEvidenceLinkageRecord[],
  normalizationFingerprint: string,
): unknown {
  return {
    request: normalizedRequest(request),
    linkages,
    normalizationFingerprint,
  };
}

export function createPublicRecordSourceQualityConversionFingerprint(input: unknown): string {
  return 'public-record-source-quality-conversion:v1:' + hash(stable(input));
}

export function convertPublicRecordStructuredEvidence(input: unknown): PublicRecordSourceQualityEvidenceConversionResult {
  const inputFingerprint = createPublicRecordSourceQualityEvidenceConversionFingerprint(input);
  if (!isRecord(input)) return fail('FAIL_CLOSED', inputFingerprint, 'INVALID_REQUEST_SHAPE');
  if (hasNarrativeOrPiiKey(input)) return fail('PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED', inputFingerprint, 'NARRATIVE_OR_PII_INPUT_NOT_COMPOSABLE');
  if (!exactKeys(input, REQUEST_KEYS)) return fail('PUBLIC_RECORD_REFERENCE_INVALID', inputFingerprint, 'UNSUPPORTED_REQUEST_FIELD');
  const sourceId = input.sourceId;
  const reviewedAt = input.reviewedAt;
  if (input.schemaVersion !== SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_SCHEMA_VERSION || !validId(sourceId) || !validDate(reviewedAt)) return fail('PUBLIC_RECORD_REFERENCE_INVALID', inputFingerprint, 'INVALID_REQUEST_SCHEMA_OR_ID_OR_DATE');
  if (!Object.prototype.hasOwnProperty.call(SOURCE_CLASSES, sourceId)) return fail('PUBLIC_RECORD_SOURCE_INVALID', inputFingerprint, 'EXACT_PUBLIC_RECORD_SOURCE_ID_REQUIRED');
  if (SOURCE_CLASSES[sourceId as keyof typeof SOURCE_CLASSES] !== input.sourceClass) return fail('PUBLIC_RECORD_SOURCE_MISMATCH', inputFingerprint, 'EXACT_PUBLIC_RECORD_SOURCE_ID_AND_CLASS_REQUIRED');
  if (!validConfirmation(input.sourceConfirmation, sourceId, reviewedAt)) return fail('PUBLIC_RECORD_SOURCE_CONFIRMATION_REQUIRED', inputFingerprint, 'EXACT_SOURCE_CONFIRMATION_REQUIRED');
  if (!validCertification(input.certificationReference)) return fail('PUBLIC_RECORD_CERTIFICATION_REQUIRED', inputFingerprint, 'CONTROLLED_CERTIFICATION_REFERENCE_REQUIRED');
  if (!['LOW_SENSITIVITY_PUBLIC_CONTEXT', 'PROPERTY_RECORD_CONTEXT', 'IDENTIFIER_BEARING_CONTEXT', 'CONTACT_OR_PERSONAL_CONTEXT', 'RESTRICTED_OR_UNREVIEWED', 'UNKNOWN'].includes(String(input.fieldSensitivityPosture))) return fail('PUBLIC_RECORD_FIELD_SENSITIVITY_UNREVIEWED', inputFingerprint, 'FIELD_SENSITIVITY_POSTURE_REQUIRED');
  if (input.fieldSensitivityPosture === 'UNKNOWN') return fail('PUBLIC_RECORD_FIELD_SENSITIVITY_UNREVIEWED', inputFingerprint, 'FIELD_SENSITIVITY_REVIEW_REQUIRED');
  if (!['EXECUTIVE_PUBLIC_RECORD_EVIDENCE_CONVERSION_REVIEW', 'DELEGATED_PUBLIC_RECORD_EVIDENCE_CONVERSION_REVIEW', 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW', 'DELEGATED_COUNTY_EVIDENCE_CONVERSION_REVIEW'].includes(String(input.conversionAuthorityClass))) return fail('PUBLIC_RECORD_REFERENCE_INVALID', inputFingerprint, 'CONVERSION_AUTHORITY_CLASS_REQUIRED');
  if (!Array.isArray(input.evidenceReferences) || input.evidenceReferences.length === 0) return fail('PUBLIC_RECORD_EVIDENCE_INSUFFICIENT', inputFingerprint, 'STRUCTURED_EVIDENCE_REFERENCE_REQUIRED');
  if (input.evidenceReferences.some((reference) => isRecord(reference) && hasNarrativeOrPiiKey(reference))) return fail('PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED', inputFingerprint, 'NARRATIVE_OR_PII_REFERENCE_NOT_COMPOSABLE');
  if (!input.evidenceReferences.every((reference) => validReference(reference, sourceId))) return fail('PUBLIC_RECORD_REFERENCE_INVALID', inputFingerprint, 'INVALID_OR_FOREIGN_STRUCTURED_REFERENCE');
  if (!input.evidenceReferences.some((reference) => reference.inputClass === 'CERTIFICATION_REFERENCE')) return fail('PUBLIC_RECORD_CERTIFICATION_REQUIRED', inputFingerprint, 'CERTIFICATION_LINKAGE_REFERENCE_REQUIRED');

  const request = input as PublicRecordSourceQualityEvidenceConversionRequest;
  const linkages = [...request.evidenceReferences]
    .sort((left, right) => (left.inputClass + ':' + left.evidenceReferenceId).localeCompare(right.inputClass + ':' + right.evidenceReferenceId))
    .map((reference) => toLinkage(reference, request.certificationReference!, request.reviewedAt));
  const normalized = normalizeSourceEvidence({ sourceId: request.sourceId, linkages });
  if (normalized.result === 'INVALID_LINKAGE') return fail('PUBLIC_RECORD_REFERENCE_INVALID', inputFingerprint, 'CANONICAL_NORMALIZATION_REJECTED_CONVERSION');
  const conversionFingerprint = createPublicRecordSourceQualityConversionFingerprint(
    createPublicRecordSourceQualityConversionFingerprintBasis(request, linkages, normalized.normalizationFingerprint),
  );
  return {
    classification: 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID',
    sourceId: request.sourceId,
    linkages,
    normalized,
    inputFingerprint,
    conversionFingerprint,
    reasons: [],
    firewall: PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL,
  };
}

export function createPublicRecordSourceQualityAssemblyRequest(
  conversion: PublicRecordSourceQualityEvidenceConversionResult,
): SourceQualitySummaryAssemblyRequest | null {
  if (conversion.classification !== 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID' || !conversion.sourceId || conversion.linkages.length === 0) return null;
  const certification = conversion.linkages.find((linkage) => linkage.relationshipType === 'CERTIFICATION')?.certificationReference;
  if (!certification) return null;
  return {
    schemaVersion: SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
    assemblyId: 'SQS-PUBLIC-RECORD-EVIDENCE-CONVERSION-001',
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
