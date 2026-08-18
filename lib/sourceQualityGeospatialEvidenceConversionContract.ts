import {
  SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
  normalizeSourceEvidence,
  type SourceEvidenceCertificationReference,
  type SourceEvidenceLimitationCode,
  type SourceEvidenceLinkageRecord,
  type SourceEvidenceVerificationStatus,
} from './sourceQualityEvidenceNormalization';
import { summarizeSourceQuality } from './sourceQualityControl';
import {
  SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
  type SourceQualitySummaryAssemblyRequest,
} from './sourceQualitySummaryAssembly';
import { createSourceQualityNamespacedFingerprint } from './sourceQualityDeterministicFingerprint';

export const SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_V1' as const;

export const GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS = Object.freeze([
  'SRC-BCOD-ADDRESS-POINTS',
  'SRC-BCOD-PARK-BOUNDARIES',
  'SRC-BOULDER-COUNTY-PARCEL-GIS',
  'SRC-ARAPAHOE-COUNTY-PARCEL-GIS',
] as const);

export type GeospatialSourceQualityConversionSourceClass =
  | 'COUNTY_GIS_ADDRESS_POINTS'
  | 'COUNTY_GIS_PARK_BOUNDARIES'
  | 'COUNTY_GIS_PARCEL_GEOMETRY';

export type GeospatialEvidenceInputClass = 'CERTIFICATION_REFERENCE';

export type GeospatialFieldSensitivityPosture =
  | 'LOW_SENSITIVITY_PUBLIC_CONTEXT'
  | 'LOCATION_REFERENCE_CONTEXT'
  | 'IDENTIFIER_BEARING_CONTEXT'
  | 'RESTRICTED_OR_UNREVIEWED'
  | 'UNKNOWN';

export type GeospatialEvidenceConversionAuthorityClass =
  | 'EXECUTIVE_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW'
  | 'DELEGATED_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW';

export type GeospatialEvidenceConversionResultClassification =
  | 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID'
  | 'GEOSPATIAL_SOURCE_CONFIRMATION_REQUIRED'
  | 'GEOSPATIAL_SOURCE_INVALID'
  | 'GEOSPATIAL_SOURCE_MISMATCH'
  | 'GEOSPATIAL_REFERENCE_INVALID'
  | 'GEOSPATIAL_CERTIFICATION_REQUIRED'
  | 'GEOSPATIAL_FIELD_SENSITIVITY_UNREVIEWED'
  | 'GEOSPATIAL_RAW_DATA_REJECTED'
  | 'GEOSPATIAL_EVIDENCE_INSUFFICIENT'
  | 'FAIL_CLOSED';

export type GeospatialSourceConfirmation = Readonly<{
  sourceId: string;
  confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED';
  reviewedAt: string;
}>;

export type GeospatialStructuredEvidenceReference = Readonly<{
  sourceId: string;
  inputClass: GeospatialEvidenceInputClass;
  evidenceReferenceId: string;
  posture: 'REFERENCED';
  verificationStatus: SourceEvidenceVerificationStatus;
  limitationCodes: readonly SourceEvidenceLimitationCode[];
}>;

export type GeospatialSourceQualityEvidenceConversionRequest = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION;
  sourceId: string;
  sourceClass: GeospatialSourceQualityConversionSourceClass;
  sourceConfirmation?: GeospatialSourceConfirmation;
  evidenceReferences: readonly GeospatialStructuredEvidenceReference[];
  certificationReference?: SourceEvidenceCertificationReference;
  fieldSensitivityPosture: GeospatialFieldSensitivityPosture;
  conversionAuthorityClass: GeospatialEvidenceConversionAuthorityClass;
  reviewedAt: string;
}>;

export const GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL = Object.freeze({
  exactSourceBinding: 'EXACT_SOURCE_ID_REQUIRED_NO_ALIAS_OR_DISCOVERY',
  sourceActivation: 'GIS_SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_CONVERSION',
  retrieval: 'GIS_RETRIEVAL_NOT_AUTHORIZED_BY_CONVERSION',
  scraping: 'GIS_SCRAPING_NOT_AUTHORIZED_BY_CONVERSION',
  rendering: 'GIS_RENDERING_NOT_AUTHORIZED_BY_CONVERSION',
  customerDisplay: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_CONVERSION',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_CONVERSION',
  coordinateDisplayAuthority: 'COORDINATE_NOT_CUSTOMER_DISPLAY_AUTHORITY',
  addressPointParcelFirewall: 'ADDRESS_POINT_NOT_PARCEL_CONFIRMATION',
  parkBoundaryFirewall: 'PARK_BOUNDARY_NOT_PROPERTY_OR_PARCEL_FACT',
  parcelOwnershipFirewall: 'PARCEL_GEOMETRY_NOT_OWNERSHIP',
  parcelLegalDescriptionFirewall: 'PARCEL_GEOMETRY_NOT_LEGAL_DESCRIPTION',
  parcelAssessorFirewall: 'PARCEL_GEOMETRY_NOT_ASSESSOR_RECORD',
  parcelTitleFirewall: 'PARCEL_GEOMETRY_NOT_TITLE',
  gisDatasetUseAuthority: 'GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY',
  openDataFallacy: 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY',
  publicSourceFallacy: 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE',
  manifestEligibility: 'LATER_MANIFEST_ELIGIBILITY_REQUIRES_SEPARATE_SOURCE_SPECIFIC_AUTHORIZATION',
});

export type GeospatialSourceQualityEvidenceConversionResult = Readonly<{
  classification: GeospatialEvidenceConversionResultClassification;
  sourceId: string | null;
  linkages: readonly SourceEvidenceLinkageRecord[];
  normalized: ReturnType<typeof normalizeSourceEvidence> | null;
  control: ReturnType<typeof summarizeSourceQuality> | null;
  inputFingerprint: string;
  conversionFingerprint: string;
  reasons: readonly string[];
  firewall: typeof GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL;
}>;

const ID_PATTERN = /^[A-Z][A-Z0-9_-]{2,119}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const REQUEST_KEYS = ['schemaVersion', 'sourceId', 'sourceClass', 'sourceConfirmation', 'evidenceReferences', 'certificationReference', 'fieldSensitivityPosture', 'conversionAuthorityClass', 'reviewedAt'];
const CONFIRMATION_KEYS = ['sourceId', 'confirmationClass', 'reviewedAt'];
const REFERENCE_KEYS = ['sourceId', 'inputClass', 'evidenceReferenceId', 'posture', 'verificationStatus', 'limitationCodes'];
const CERTIFICATION_KEYS = ['certificationId', 'repositoryReference', 'referenceVersion', 'linkageReviewedDate'];
const RAW_GIS_KEYS = ['coordinate', 'coordinates', 'geometry', 'GeoJSON', 'feature', 'features', 'featureAttributes', 'attributes', 'address', 'addresses', 'parcelId', 'parcelIds', 'owner', 'ownerName', 'sourceRecordPayload', 'rawRecord', 'customerRecord', 'personData'];
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

const SOURCE_CLASSES: Record<(typeof GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS)[number], GeospatialSourceQualityConversionSourceClass> = {
  'SRC-BCOD-ADDRESS-POINTS': 'COUNTY_GIS_ADDRESS_POINTS',
  'SRC-BCOD-PARK-BOUNDARIES': 'COUNTY_GIS_PARK_BOUNDARIES',
  'SRC-BOULDER-COUNTY-PARCEL-GIS': 'COUNTY_GIS_PARCEL_GEOMETRY',
  'SRC-ARAPAHOE-COUNTY-PARCEL-GIS': 'COUNTY_GIS_PARCEL_GEOMETRY',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key)) && keys.filter((key) => key !== 'sourceConfirmation' && key !== 'certificationReference').every((key) => key in value);
}

function validId(value: unknown): value is string {
  return typeof value === 'string' && ID_PATTERN.test(value);
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && DATE_PATTERN.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00.000Z'));
}

function hasRawGisKey(value: Record<string, unknown>): boolean {
  return Object.keys(value).some((key) => RAW_GIS_KEYS.includes(key));
}

function validCertification(value: unknown): value is SourceEvidenceCertificationReference {
  return isRecord(value)
    && exactKeys(value, CERTIFICATION_KEYS)
    && validId(value.certificationId)
    && value.repositoryReference === 'docs/project-atlas/executive-library'
    && validId(value.referenceVersion)
    && validDate(value.linkageReviewedDate);
}

function validConfirmation(value: unknown, sourceId: string, reviewedAt: string): value is GeospatialSourceConfirmation {
  return isRecord(value)
    && exactKeys(value, CONFIRMATION_KEYS)
    && value.sourceId === sourceId
    && value.confirmationClass === 'EXACT_SOURCE_ID_CONFIRMED'
    && value.reviewedAt === reviewedAt
    && validDate(value.reviewedAt);
}

function normalizedRequest(value: GeospatialSourceQualityEvidenceConversionRequest): unknown {
  return {
    ...value,
    evidenceReferences: [...value.evidenceReferences].sort((left, right) =>
      (left.inputClass + ':' + left.evidenceReferenceId).localeCompare(right.inputClass + ':' + right.evidenceReferenceId)),
  };
}

function validReference(value: unknown, sourceId: string): value is GeospatialStructuredEvidenceReference {
  return isRecord(value)
    && !hasRawGisKey(value)
    && exactKeys(value, REFERENCE_KEYS)
    && value.sourceId === sourceId
    && value.inputClass === 'CERTIFICATION_REFERENCE'
    && validId(value.evidenceReferenceId)
    && value.posture === 'REFERENCED'
    && ['VERIFIED', 'PENDING', 'UNVERIFIED', 'REJECTED'].includes(String(value.verificationStatus))
    && Array.isArray(value.limitationCodes)
    && value.limitationCodes.every((code) => LIMITATION_CODES.includes(code as SourceEvidenceLimitationCode));
}

function validSourceSpecificCertification(
  sourceId: string,
  certificationReference: SourceEvidenceCertificationReference,
  references: readonly GeospatialStructuredEvidenceReference[],
): boolean {
  if (sourceId !== 'SRC-BOULDER-COUNTY-PARCEL-GIS' && sourceId !== 'SRC-ARAPAHOE-COUNTY-PARCEL-GIS') return true;
  return certificationReference.certificationId.includes('PARCEL-GIS')
    && references.every((reference) => reference.evidenceReferenceId.includes('PARCEL-GIS'));
}

function createFailFingerprint(
  classification: GeospatialEvidenceConversionResultClassification,
  inputFingerprint: string,
  reasons: readonly string[],
): string {
  return createSourceQualityNamespacedFingerprint('gis-public-geospatial-conversion', {
    classification,
    inputFingerprint,
    reasons: [...new Set(reasons)].sort(),
  });
}

function fail(
  classification: Exclude<GeospatialEvidenceConversionResultClassification, 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID'>,
  inputFingerprint: string,
  ...reasons: string[]
): GeospatialSourceQualityEvidenceConversionResult {
  return {
    classification,
    sourceId: null,
    linkages: [],
    normalized: null,
    control: null,
    inputFingerprint,
    conversionFingerprint: createFailFingerprint(classification, inputFingerprint, reasons),
    reasons: [...new Set(reasons)].sort(),
    firewall: GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL,
  };
}

function toLinkage(
  reference: GeospatialStructuredEvidenceReference,
  certificationReference: SourceEvidenceCertificationReference,
  reviewedAt: string,
): SourceEvidenceLinkageRecord {
  return {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId: reference.sourceId,
    evidenceClass: 'CERTIFICATION',
    authoritativeContractType: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: reference.evidenceReferenceId,
    repositoryReference: 'docs/project-atlas/executive-library',
    relationshipType: 'CERTIFICATION',
    posture: reference.posture,
    verificationStatus: reference.verificationStatus,
    certificationReference,
    lastReviewedDate: reviewedAt,
    limitationCodes: [...reference.limitationCodes].sort(),
    linkageProvenance: 'CERTIFICATION_REFERENCE_ONLY',
  };
}

export function createGeospatialSourceQualityEvidenceInputFingerprint(input: unknown): string {
  return createSourceQualityNamespacedFingerprint('gis-public-geospatial-input', input);
}

export function createGeospatialSourceQualityConversionFingerprint(input: unknown): string {
  return createSourceQualityNamespacedFingerprint('gis-public-geospatial-conversion', input);
}

export function convertGeospatialStructuredEvidence(input: unknown): GeospatialSourceQualityEvidenceConversionResult {
  const inputFingerprint = createGeospatialSourceQualityEvidenceInputFingerprint(input);
  if (!isRecord(input)) return fail('FAIL_CLOSED', inputFingerprint, 'INVALID_REQUEST_SHAPE');
  if (hasRawGisKey(input)) return fail('GEOSPATIAL_RAW_DATA_REJECTED', inputFingerprint, 'RAW_GIS_INPUT_NOT_COMPOSABLE');
  if (!exactKeys(input, REQUEST_KEYS)) return fail('GEOSPATIAL_REFERENCE_INVALID', inputFingerprint, 'UNSUPPORTED_REQUEST_FIELD');
  const sourceId = input.sourceId;
  const reviewedAt = input.reviewedAt;
  if (input.schemaVersion !== SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION || !validId(sourceId) || !validDate(reviewedAt)) return fail('GEOSPATIAL_REFERENCE_INVALID', inputFingerprint, 'INVALID_REQUEST_SCHEMA_OR_ID_OR_DATE');
  if (!Object.prototype.hasOwnProperty.call(SOURCE_CLASSES, sourceId)) return fail('GEOSPATIAL_SOURCE_INVALID', inputFingerprint, 'EXACT_GIS_SOURCE_ID_REQUIRED');
  if (SOURCE_CLASSES[sourceId as keyof typeof SOURCE_CLASSES] !== input.sourceClass) return fail('GEOSPATIAL_SOURCE_MISMATCH', inputFingerprint, 'EXACT_GIS_SOURCE_ID_AND_CLASS_REQUIRED');
  if (!validConfirmation(input.sourceConfirmation, sourceId, reviewedAt)) return fail('GEOSPATIAL_SOURCE_CONFIRMATION_REQUIRED', inputFingerprint, 'EXACT_SOURCE_CONFIRMATION_REQUIRED');
  if (!validCertification(input.certificationReference)) return fail('GEOSPATIAL_CERTIFICATION_REQUIRED', inputFingerprint, 'CONTROLLED_CERTIFICATION_REFERENCE_REQUIRED');
  if (!['LOW_SENSITIVITY_PUBLIC_CONTEXT', 'LOCATION_REFERENCE_CONTEXT', 'IDENTIFIER_BEARING_CONTEXT', 'RESTRICTED_OR_UNREVIEWED', 'UNKNOWN'].includes(String(input.fieldSensitivityPosture))) return fail('GEOSPATIAL_FIELD_SENSITIVITY_UNREVIEWED', inputFingerprint, 'FIELD_SENSITIVITY_POSTURE_REQUIRED');
  if (input.fieldSensitivityPosture === 'UNKNOWN') return fail('GEOSPATIAL_FIELD_SENSITIVITY_UNREVIEWED', inputFingerprint, 'FIELD_SENSITIVITY_REVIEW_REQUIRED');
  if (!['EXECUTIVE_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW', 'DELEGATED_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW'].includes(String(input.conversionAuthorityClass))) return fail('GEOSPATIAL_REFERENCE_INVALID', inputFingerprint, 'GIS_CONVERSION_AUTHORITY_CLASS_REQUIRED');
  if (!Array.isArray(input.evidenceReferences) || input.evidenceReferences.length === 0) return fail('GEOSPATIAL_EVIDENCE_INSUFFICIENT', inputFingerprint, 'STRUCTURED_CERTIFICATION_REFERENCE_REQUIRED');
  if (input.evidenceReferences.some((reference) => isRecord(reference) && hasRawGisKey(reference))) return fail('GEOSPATIAL_RAW_DATA_REJECTED', inputFingerprint, 'RAW_GIS_REFERENCE_NOT_COMPOSABLE');
  if (!input.evidenceReferences.every((reference) => validReference(reference, sourceId))) return fail('GEOSPATIAL_REFERENCE_INVALID', inputFingerprint, 'INVALID_OR_FOREIGN_STRUCTURED_REFERENCE');
  if (!input.evidenceReferences.some((reference) => reference.inputClass === 'CERTIFICATION_REFERENCE')) return fail('GEOSPATIAL_CERTIFICATION_REQUIRED', inputFingerprint, 'CERTIFICATION_LINKAGE_REFERENCE_REQUIRED');

  const request = input as GeospatialSourceQualityEvidenceConversionRequest;
  if (!validSourceSpecificCertification(request.sourceId, request.certificationReference!, request.evidenceReferences)) return fail('GEOSPATIAL_CERTIFICATION_REQUIRED', inputFingerprint, 'EXACT_PARCEL_GIS_CERTIFICATION_REFERENCE_REQUIRED');
  const linkages = [...request.evidenceReferences]
    .sort((left, right) => (left.inputClass + ':' + left.evidenceReferenceId).localeCompare(right.inputClass + ':' + right.evidenceReferenceId))
    .map((reference) => toLinkage(reference, request.certificationReference!, request.reviewedAt));
  const normalized = normalizeSourceEvidence({ sourceId: request.sourceId, linkages });
  if (normalized.result === 'INVALID_LINKAGE') return fail('GEOSPATIAL_REFERENCE_INVALID', inputFingerprint, 'CANONICAL_NORMALIZATION_REJECTED_CONVERSION');
  const control = summarizeSourceQuality(normalized);
  const classification: GeospatialEvidenceConversionResultClassification = 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID';
  const reasons: readonly string[] = [];
  const conversionFingerprint = createGeospatialSourceQualityConversionFingerprint({
    classification,
    request: normalizedRequest(request),
    linkages,
    normalizationFingerprint: normalized.normalizationFingerprint,
    controlClassification: control.classification,
    reasons,
  });
  return {
    classification,
    sourceId: request.sourceId,
    linkages,
    normalized,
    control,
    inputFingerprint,
    conversionFingerprint,
    reasons,
    firewall: GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL,
  };
}

export function createGeospatialSourceQualityAssemblyRequest(
  conversion: GeospatialSourceQualityEvidenceConversionResult,
): SourceQualitySummaryAssemblyRequest | null {
  if (conversion.classification !== 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID' || !conversion.sourceId || conversion.linkages.length === 0) return null;
  const certification = conversion.linkages.find((linkage) => linkage.relationshipType === 'CERTIFICATION')?.certificationReference;
  if (!certification) return null;
  return {
    schemaVersion: SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
    assemblyId: 'SQS-GIS-PUBLIC-GEOSPATIAL-EVIDENCE-CONVERSION-001',
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

export const BCOD_ADDRESS_POINTS_SYNTHETIC_GEOSPATIAL_CONVERSION_REQUEST = Object.freeze<GeospatialSourceQualityEvidenceConversionRequest>({
  schemaVersion: SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  sourceId: 'SRC-BCOD-ADDRESS-POINTS',
  sourceClass: 'COUNTY_GIS_ADDRESS_POINTS',
  sourceConfirmation: {
    sourceId: 'SRC-BCOD-ADDRESS-POINTS',
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-16',
  },
  evidenceReferences: [{
    sourceId: 'SRC-BCOD-ADDRESS-POINTS',
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'GIS-CONVERSION-BCOD-ADDRESS-POINTS-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [
      'RIGHTS_PENDING',
      'TECHNICAL_ACCESS_PENDING',
      'FRESHNESS_DOMAIN_SPECIFIC',
      'ATTRIBUTION_PENDING_CONFIRMATION',
      'PROVENANCE_INCOMPLETE',
    ],
  }],
  certificationReference: {
    certificationId: 'CERT-GIS-PUBLIC-GEOSPATIAL-CONVERSION-001',
    repositoryReference: 'docs/project-atlas/executive-library',
    referenceVersion: 'V01',
    linkageReviewedDate: '2026-08-16',
  },
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'DELEGATED_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-16',
});
