import {
  normalizeSourceEvidence,
  type SourceEvidenceCertificationReference,
  type SourceEvidenceLimitationCode,
  type SourceEvidenceLinkageRecord,
  type SourceEvidenceVerificationStatus,
} from './sourceQualityEvidenceNormalization';
import type { SourceQualitySummaryAssemblyRequest } from './sourceQualitySummaryAssembly';
import {
  PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL,
  SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  convertPublicRecordStructuredEvidence,
  type PublicRecordEvidenceConversionResultClassification,
  type PublicRecordFieldSensitivityPosture,
  type PublicRecordSourceQualityConversionSourceClass,
  type PublicRecordSourceQualityEvidenceConversionRequest,
} from './sourceQualityPublicRecordEvidenceConversionContract';
import { SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION } from './sourceQualitySummaryAssembly';

export const SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_V1' as const;
export const BOULDER_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-BOULDER-COUNTY-ASSESSOR' as const;
export const ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-ARAPAHOE-COUNTY-ASSESSOR' as const;
export const BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-BROOMFIELD-COUNTY-ASSESSOR' as const;
export const JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-JEFFERSON-COUNTY-ASSESSOR' as const;
export const LARIMER_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-LARIMER-COUNTY-ASSESSOR' as const;
export const WELD_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-WELD-COUNTY-ASSESSOR' as const;
export const BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID = 'SRC-BOULDER-COUNTY-RECORDER-INDEX' as const;
export const BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID = 'SRC-BOULDER-COUNTY-ACCELA-PERMITS' as const;

export const COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS = Object.freeze([
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
  LARIMER_COUNTY_ASSESSOR_SOURCE_ID,
  WELD_COUNTY_ASSESSOR_SOURCE_ID,
  'SRC-BOULDER-COUNTY-TREASURER',
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
] as const);

export type CountySourceQualityConversionSourceClass =
  | 'COUNTY_ASSESSOR'
  | 'COUNTY_TREASURER'
  | 'COUNTY_RECORDED_DOCUMENT_INDEX'
  | 'COUNTY_PERMIT';

export type CountyEvidenceInputClass =
  | 'RIGHTS_READINESS_REFERENCE'
  | 'TECHNICAL_ACCESS_REFERENCE'
  | 'FRESHNESS_REFERENCE'
  | 'ATTRIBUTION_REFERENCE'
  | 'PROVENANCE_REFERENCE'
  | 'CERTIFICATION_REFERENCE';

export type CountyFieldSensitivityPosture = PublicRecordFieldSensitivityPosture;

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
  | 'COUNTY_SOURCE_INVALID'
  | 'COUNTY_NON_OPERATIONAL_CANDIDATE_REJECTED'
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
  publicSourceFallacy: PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL.publicSourceFallacy,
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

const SOURCE_CLASSES: Record<(typeof COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS)[number], CountySourceQualityConversionSourceClass> = {
  'SRC-BOULDER-COUNTY-ASSESSOR': 'COUNTY_ASSESSOR',
  'SRC-ARAPAHOE-COUNTY-ASSESSOR': 'COUNTY_ASSESSOR',
  'SRC-BROOMFIELD-COUNTY-ASSESSOR': 'COUNTY_ASSESSOR',
  'SRC-JEFFERSON-COUNTY-ASSESSOR': 'COUNTY_ASSESSOR',
  'SRC-LARIMER-COUNTY-ASSESSOR': 'COUNTY_ASSESSOR',
  'SRC-WELD-COUNTY-ASSESSOR': 'COUNTY_ASSESSOR',
  'SRC-BOULDER-COUNTY-TREASURER': 'COUNTY_TREASURER',
  'SRC-BOULDER-COUNTY-RECORDER-INDEX': 'COUNTY_RECORDED_DOCUMENT_INDEX',
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS': 'COUNTY_PERMIT',
};
const REQUEST_KEYS = ['schemaVersion', 'sourceId', 'sourceClass', 'sourceConfirmation', 'evidenceReferences', 'certificationReference', 'fieldSensitivityPosture', 'conversionAuthorityClass', 'reviewedAt'];
const NARRATIVE_OR_PII_KEYS = ['narrative', 'notes', 'email', 'phone', 'name', 'ownerName', 'applicantName', 'taxpayerName', 'contractorName', 'mailingAddress', 'address', 'parcel', 'parcelId', 'permit', 'permitNumber', 'inspection', 'customerRecord', 'propertyRecord', 'rawRecord', 'externalArtifact', 'agreementText', 'websiteProse', 'pdfText', 'documentImage', 'scannedInstrument', 'ocrText', 'fullText', 'signature', 'documentBody', 'legalDescription', 'certifiedCopyContent', 'rawInstrumentPayload', 'documentContentRedistribution'];

export const BOULDER_COUNTY_ASSESSOR_CONVERSION_POSTURE = 'COUNTY_PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_READY_SOURCE_CONFIRMATION_REQUIRED' as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (isRecord(value)) return '{' + Object.keys(value).sort().map((key) => JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}';
  return JSON.stringify(value);
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => key in value);
}

function hasNarrativeOrPiiKey(value: Record<string, unknown>): boolean {
  return Object.keys(value).some((key) => NARRATIVE_OR_PII_KEYS.includes(key));
}

function hash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(16).padStart(8, '0');
}

function normalizedCountyRequest(value: CountySourceQualityEvidenceConversionRequest): unknown {
  return {
    ...value,
    evidenceReferences: [...value.evidenceReferences].sort((left, right) =>
      (left.inputClass + ':' + left.evidenceReferenceId).localeCompare(right.inputClass + ':' + right.evidenceReferenceId)),
  };
}

function createCountyFailFingerprint(
  classification: CountyEvidenceConversionResultClassification,
  inputFingerprint: string,
  reasons: readonly string[],
): string {
  return 'county-source-quality-conversion:v1:' + hash(stable({ classification, inputFingerprint, reasons: [...new Set(reasons)].sort() }));
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
    conversionFingerprint: createCountyFailFingerprint(classification, inputFingerprint, reasons),
    reasons: [...new Set(reasons)].sort(),
    firewall: COUNTY_SOURCE_QUALITY_CONVERSION_FIREWALL,
  };
}

function toPublicRecordRequest(input: CountySourceQualityEvidenceConversionRequest): PublicRecordSourceQualityEvidenceConversionRequest {
  return {
    schemaVersion: SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_SCHEMA_VERSION,
    sourceId: input.sourceId,
    sourceClass: input.sourceClass as PublicRecordSourceQualityConversionSourceClass,
    sourceConfirmation: input.sourceConfirmation,
    evidenceReferences: input.evidenceReferences,
    certificationReference: input.certificationReference,
    fieldSensitivityPosture: input.fieldSensitivityPosture,
    conversionAuthorityClass: input.conversionAuthorityClass,
    reviewedAt: input.reviewedAt,
  };
}

function fromPublicRecordClassification(
  classification: PublicRecordEvidenceConversionResultClassification,
): Exclude<CountyEvidenceConversionResultClassification, 'COUNTY_EVIDENCE_CONVERSION_VALID'> {
  if (classification === 'PUBLIC_RECORD_SOURCE_CONFIRMATION_REQUIRED') return 'COUNTY_SOURCE_CONFIRMATION_REQUIRED';
  if (classification === 'PUBLIC_RECORD_SOURCE_INVALID') return 'COUNTY_SOURCE_INVALID';
  if (classification === 'PUBLIC_RECORD_SOURCE_MISMATCH') return 'COUNTY_EVIDENCE_SOURCE_MISMATCH';
  if (classification === 'PUBLIC_RECORD_REFERENCE_INVALID') return 'COUNTY_EVIDENCE_REFERENCE_INVALID';
  if (classification === 'PUBLIC_RECORD_CERTIFICATION_REQUIRED') return 'COUNTY_CERTIFICATION_REQUIRED';
  if (classification === 'PUBLIC_RECORD_FIELD_SENSITIVITY_UNREVIEWED') return 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED';
  if (classification === 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED') return 'COUNTY_NARRATIVE_INPUT_REJECTED';
  if (classification === 'PUBLIC_RECORD_EVIDENCE_INSUFFICIENT') return 'COUNTY_EVIDENCE_INSUFFICIENT';
  return 'FAIL_CLOSED';
}

export function createCountySourceQualityEvidenceConversionFingerprint(input: unknown): string {
  return 'county-source-quality-conversion-input:v1:' + hash(stable(input));
}

export function convertCountyStructuredEvidence(input: unknown): CountySourceQualityEvidenceConversionResult {
  const inputFingerprint = createCountySourceQualityEvidenceConversionFingerprint(input);
  if (isRecord(input) && hasNarrativeOrPiiKey(input)) return fail('COUNTY_NARRATIVE_INPUT_REJECTED', inputFingerprint, 'NARRATIVE_OR_PII_INPUT_NOT_COMPOSABLE');
  if (isRecord(input) && input.sourceId === 'SRC-BOULDER-PERMIT-CANDIDATES') return fail('COUNTY_NON_OPERATIONAL_CANDIDATE_REJECTED', inputFingerprint, 'NON_OPERATIONAL_PERMIT_CANDIDATE_NOT_CONVERSION_AUTHORITY');
  if (isRecord(input) && !exactKeys(input, REQUEST_KEYS)) return fail('COUNTY_EVIDENCE_REFERENCE_INVALID', inputFingerprint, 'UNSUPPORTED_REQUEST_FIELD');
  if (!isRecord(input) || input.schemaVersion !== SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_SCHEMA_VERSION || typeof input.sourceId !== 'string') {
    const converted = isRecord(input) ? convertPublicRecordStructuredEvidence({ ...input, schemaVersion: SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_SCHEMA_VERSION }) : null;
    if (converted && converted.classification !== 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID') return fail(fromPublicRecordClassification(converted.classification), inputFingerprint, ...converted.reasons);
    return fail('COUNTY_EVIDENCE_REFERENCE_INVALID', inputFingerprint, 'INVALID_REQUEST_SCHEMA_OR_ID_OR_DATE');
  }
  if (!Object.prototype.hasOwnProperty.call(SOURCE_CLASSES, input.sourceId)) return fail('COUNTY_SOURCE_INVALID', inputFingerprint, 'EXACT_COUNTY_SOURCE_ID_REQUIRED');
  if (SOURCE_CLASSES[input.sourceId as keyof typeof SOURCE_CLASSES] !== input.sourceClass) return fail('COUNTY_EVIDENCE_SOURCE_MISMATCH', inputFingerprint, 'EXACT_COUNTY_SOURCE_ID_AND_CLASS_REQUIRED');

  const request = input as CountySourceQualityEvidenceConversionRequest;
  const converted = convertPublicRecordStructuredEvidence(toPublicRecordRequest(request));
  if (converted.classification !== 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID') return fail(fromPublicRecordClassification(converted.classification), inputFingerprint, ...converted.reasons);
  const conversionFingerprint = 'county-source-quality-conversion:v1:' + hash(stable({
    request: normalizedCountyRequest(request),
    linkages: converted.linkages,
    normalizationFingerprint: converted.normalized?.normalizationFingerprint,
  }));
  return {
    classification: 'COUNTY_EVIDENCE_CONVERSION_VALID',
    sourceId: converted.sourceId,
    linkages: converted.linkages,
    normalized: converted.normalized,
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

export const ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-16',
  },
  evidenceReferences: [{
    sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'COUNTY-CONVERSION-ARAPAHOE-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: {
    certificationId: 'CERT-ARAPAHOE-COUNTY-ASSESSOR-CONVERSION-001',
    repositoryReference: 'docs/project-atlas/executive-library',
    referenceVersion: 'V01',
    linkageReviewedDate: '2026-08-16',
  },
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-16',
});

export const BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  sourceId: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-16',
  },
  evidenceReferences: [{
    sourceId: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'COUNTY-CONVERSION-BROOMFIELD-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: {
    certificationId: 'CERT-BROOMFIELD-COUNTY-ASSESSOR-CONVERSION-001',
    repositoryReference: 'docs/project-atlas/executive-library',
    referenceVersion: 'V01',
    linkageReviewedDate: '2026-08-16',
  },
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-16',
});

export const JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  sourceId: JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-16',
  },
  evidenceReferences: [{
    sourceId: JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'COUNTY-CONVERSION-JEFFERSON-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: {
    certificationId: 'CERT-JEFFERSON-COUNTY-ASSESSOR-CONVERSION-001',
    repositoryReference: 'docs/project-atlas/executive-library',
    referenceVersion: 'V01',
    linkageReviewedDate: '2026-08-16',
  },
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-16',
});

export const LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  sourceId: LARIMER_COUNTY_ASSESSOR_SOURCE_ID,
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: LARIMER_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-16',
  },
  evidenceReferences: [{
    sourceId: LARIMER_COUNTY_ASSESSOR_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'COUNTY-CONVERSION-LARIMER-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: {
    certificationId: 'CERT-LARIMER-COUNTY-ASSESSOR-CONVERSION-001',
    repositoryReference: 'docs/project-atlas/executive-library',
    referenceVersion: 'V01',
    linkageReviewedDate: '2026-08-16',
  },
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-16',
});

export const WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST = Object.freeze<CountySourceQualityEvidenceConversionRequest>({
  schemaVersion: SOURCE_QUALITY_COUNTY_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  sourceId: WELD_COUNTY_ASSESSOR_SOURCE_ID,
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: WELD_COUNTY_ASSESSOR_SOURCE_ID,
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-16',
  },
  evidenceReferences: [{
    sourceId: WELD_COUNTY_ASSESSOR_SOURCE_ID,
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'COUNTY-CONVERSION-WELD-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference: {
    certificationId: 'CERT-WELD-COUNTY-ASSESSOR-CONVERSION-001',
    repositoryReference: 'docs/project-atlas/executive-library',
    referenceVersion: 'V01',
    linkageReviewedDate: '2026-08-16',
  },
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-16',
});
