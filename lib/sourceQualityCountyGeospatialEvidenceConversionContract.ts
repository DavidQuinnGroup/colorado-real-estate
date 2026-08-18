import {
  SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL,
  convertGeospatialStructuredEvidence,
  createGeospatialSourceQualityAssemblyRequest,
  type GeospatialEvidenceConversionResultClassification,
  type GeospatialFieldSensitivityPosture,
  type GeospatialSourceQualityConversionSourceClass,
  type GeospatialSourceQualityEvidenceConversionRequest,
  type GeospatialSourceQualityEvidenceConversionResult,
} from './sourceQualityGeospatialEvidenceConversionContract';

export const SOURCE_QUALITY_COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_V1' as const;
export const BCOD_ADDRESS_POINTS_SOURCE_ID = 'SRC-BCOD-ADDRESS-POINTS' as const;
export const BCOD_PARK_BOUNDARIES_SOURCE_ID = 'SRC-BCOD-PARK-BOUNDARIES' as const;
export const BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID = 'SRC-BOULDER-COUNTY-PARCEL-GIS' as const;
export const ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID = 'SRC-ARAPAHOE-COUNTY-PARCEL-GIS' as const;

export const COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS = Object.freeze([
  BCOD_ADDRESS_POINTS_SOURCE_ID,
  BCOD_PARK_BOUNDARIES_SOURCE_ID,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID,
  ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_ID,
] as const);

export type CountyGeospatialSourceQualityConversionSourceClass = GeospatialSourceQualityConversionSourceClass;

export type CountyGeospatialEvidenceConversionAuthorityClass =
  | 'EXECUTIVE_COUNTY_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW'
  | 'DELEGATED_COUNTY_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW';

export type CountyGeospatialEvidenceConversionResultClassification =
  | 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID'
  | 'COUNTY_GEOSPATIAL_SOURCE_CONFIRMATION_REQUIRED'
  | 'COUNTY_GEOSPATIAL_SOURCE_INVALID'
  | 'COUNTY_GEOSPATIAL_SOURCE_MISMATCH'
  | 'COUNTY_GEOSPATIAL_REFERENCE_INVALID'
  | 'COUNTY_GEOSPATIAL_CERTIFICATION_REQUIRED'
  | 'COUNTY_GEOSPATIAL_FIELD_SENSITIVITY_UNREVIEWED'
  | 'COUNTY_GEOSPATIAL_RAW_DATA_REJECTED'
  | 'COUNTY_GEOSPATIAL_EVIDENCE_INSUFFICIENT'
  | 'FAIL_CLOSED';

export type CountyGeospatialSourceQualityEvidenceConversionRequest = Readonly<
  Omit<GeospatialSourceQualityEvidenceConversionRequest, 'schemaVersion' | 'conversionAuthorityClass'> & {
    schemaVersion: typeof SOURCE_QUALITY_COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION;
    fieldSensitivityPosture: GeospatialFieldSensitivityPosture;
    conversionAuthorityClass: CountyGeospatialEvidenceConversionAuthorityClass;
  }
>;

export type CountyGeospatialSourceQualityEvidenceConversionResult = Readonly<
  Omit<GeospatialSourceQualityEvidenceConversionResult, 'classification' | 'firewall'> & {
    classification: CountyGeospatialEvidenceConversionResultClassification;
    firewall: Readonly<Record<string, string>>;
  }
>;

export const COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL = Object.freeze({
  exactSourceBinding: 'COUNTY_EXACT_SOURCE_ID_REQUIRED_NO_ALIAS_OR_DISCOVERY',
  delegation: 'COUNTY_WRAPPER_DELEGATES_TO_GIS_PUBLIC_GEOSPATIAL_CONVERSION',
  noDuplicateConversionLogic: 'COUNTY_WRAPPER_DOES_NOT_DUPLICATE_HASHING_LINKAGE_NORMALIZATION_CONTROL_OR_ASSEMBLY',
  sourceActivation: 'COUNTY_GIS_SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_CONVERSION',
  retrieval: 'COUNTY_GIS_RETRIEVAL_NOT_AUTHORIZED_BY_CONVERSION',
  customerDisplay: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_CONVERSION',
  legalUse: 'LEGAL_USE_NOT_APPROVED_BY_CONVERSION',
  parcelAcceptance: 'PARCEL_GEOMETRY_ACCEPTED_ONLY_FOR_EXACT_AUTHORIZED_SOURCE',
});

const SOURCE_CLASSES: Record<(typeof COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS)[number], CountyGeospatialSourceQualityConversionSourceClass> = {
  'SRC-BCOD-ADDRESS-POINTS': 'COUNTY_GIS_ADDRESS_POINTS',
  'SRC-BCOD-PARK-BOUNDARIES': 'COUNTY_GIS_PARK_BOUNDARIES',
  'SRC-BOULDER-COUNTY-PARCEL-GIS': 'COUNTY_GIS_PARCEL_GEOMETRY',
  'SRC-ARAPAHOE-COUNTY-PARCEL-GIS': 'COUNTY_GIS_PARCEL_GEOMETRY',
};

const REQUEST_KEYS = ['schemaVersion', 'sourceId', 'sourceClass', 'sourceConfirmation', 'evidenceReferences', 'certificationReference', 'fieldSensitivityPosture', 'conversionAuthorityClass', 'reviewedAt'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key)) && keys.filter((key) => key !== 'sourceConfirmation' && key !== 'certificationReference').every((key) => key in value);
}

function classificationFromGeneric(
  classification: GeospatialEvidenceConversionResultClassification,
): Exclude<CountyGeospatialEvidenceConversionResultClassification, 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID'> {
  if (classification === 'GEOSPATIAL_SOURCE_CONFIRMATION_REQUIRED') return 'COUNTY_GEOSPATIAL_SOURCE_CONFIRMATION_REQUIRED';
  if (classification === 'GEOSPATIAL_SOURCE_INVALID') return 'COUNTY_GEOSPATIAL_SOURCE_INVALID';
  if (classification === 'GEOSPATIAL_SOURCE_MISMATCH') return 'COUNTY_GEOSPATIAL_SOURCE_MISMATCH';
  if (classification === 'GEOSPATIAL_REFERENCE_INVALID') return 'COUNTY_GEOSPATIAL_REFERENCE_INVALID';
  if (classification === 'GEOSPATIAL_CERTIFICATION_REQUIRED') return 'COUNTY_GEOSPATIAL_CERTIFICATION_REQUIRED';
  if (classification === 'GEOSPATIAL_FIELD_SENSITIVITY_UNREVIEWED') return 'COUNTY_GEOSPATIAL_FIELD_SENSITIVITY_UNREVIEWED';
  if (classification === 'GEOSPATIAL_RAW_DATA_REJECTED') return 'COUNTY_GEOSPATIAL_RAW_DATA_REJECTED';
  if (classification === 'GEOSPATIAL_EVIDENCE_INSUFFICIENT') return 'COUNTY_GEOSPATIAL_EVIDENCE_INSUFFICIENT';
  return 'FAIL_CLOSED';
}

function failFromGeneric(
  converted: GeospatialSourceQualityEvidenceConversionResult,
): CountyGeospatialSourceQualityEvidenceConversionResult {
  return {
    ...converted,
    classification: classificationFromGeneric(converted.classification),
    firewall: {
      ...converted.firewall,
      ...COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL,
    },
  };
}

function toGenericRequest(input: CountyGeospatialSourceQualityEvidenceConversionRequest): GeospatialSourceQualityEvidenceConversionRequest {
  return {
    ...input,
    schemaVersion: SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION,
    conversionAuthorityClass: input.conversionAuthorityClass === 'EXECUTIVE_COUNTY_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW'
      ? 'EXECUTIVE_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW'
      : 'DELEGATED_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW',
  };
}

export function convertCountyGeospatialStructuredEvidence(input: unknown): CountyGeospatialSourceQualityEvidenceConversionResult {
  if (!isRecord(input) || !exactKeys(input, REQUEST_KEYS) || input.schemaVersion !== SOURCE_QUALITY_COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION || typeof input.sourceId !== 'string') {
    return failFromGeneric(convertGeospatialStructuredEvidence(isRecord(input) ? { ...input, schemaVersion: SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION } : input));
  }
  if (!Object.prototype.hasOwnProperty.call(SOURCE_CLASSES, input.sourceId)) {
    return failFromGeneric(convertGeospatialStructuredEvidence({ ...input, schemaVersion: SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION }));
  }
  if (SOURCE_CLASSES[input.sourceId as keyof typeof SOURCE_CLASSES] !== input.sourceClass) {
    return failFromGeneric(convertGeospatialStructuredEvidence({ ...input, schemaVersion: SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION }));
  }
  if (!['EXECUTIVE_COUNTY_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW', 'DELEGATED_COUNTY_GIS_PUBLIC_GEOSPATIAL_EVIDENCE_CONVERSION_REVIEW'].includes(String(input.conversionAuthorityClass))) {
    return failFromGeneric(convertGeospatialStructuredEvidence({ ...input, schemaVersion: SOURCE_QUALITY_GEOSPATIAL_EVIDENCE_CONVERSION_SCHEMA_VERSION }));
  }

  const converted = convertGeospatialStructuredEvidence(toGenericRequest(input as CountyGeospatialSourceQualityEvidenceConversionRequest));
  if (converted.classification !== 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID') return failFromGeneric(converted);
  return {
    ...converted,
    classification: 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID',
    firewall: {
      ...converted.firewall,
      ...COUNTY_GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL,
    },
  };
}

export function createCountyGeospatialSourceQualityAssemblyRequest(
  conversion: CountyGeospatialSourceQualityEvidenceConversionResult,
) {
  if (conversion.classification !== 'COUNTY_GEOSPATIAL_EVIDENCE_CONVERSION_VALID') return null;
  return createGeospatialSourceQualityAssemblyRequest({
    ...conversion,
    classification: 'GEOSPATIAL_EVIDENCE_CONVERSION_VALID',
    firewall: GEOSPATIAL_SOURCE_QUALITY_CONVERSION_FIREWALL,
  });
}
