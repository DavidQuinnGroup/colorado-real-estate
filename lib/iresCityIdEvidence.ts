export const IRES_CITYID_OFFICIAL_EVIDENCE_STATUS = 'PROJECT_ATLAS_IRES_CITYID_OFFICIAL_EVIDENCE_ADMITTED' as const;
export const IRES_CITYID_VERSIONED_SOURCE_GEOGRAPHY_CONTRACT_STATUS = 'IRES_CITYID_VERSIONED_SOURCE_GEOGRAPHY_CONTRACT_CERTIFIED' as const;

export type IresCityIdObservation = Readonly<{
  sourceValue: string;
  reportedCityName: string;
  evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24';
}>;

export type IresCityIdResolution = Readonly<{
  sourceSystem: 'IRES';
  fieldName: 'IRE_CityID';
  sourceValue: string | null;
  observationState: 'OFFICIALLY_OBSERVED_HIGH_PRIORITY' | 'UNKNOWN_OR_UNMAPPED' | 'MISSING';
  reportedCityName: string | null;
  atlasGeographicObjectState: 'NOT_RECONCILED';
  listingDisposition: 'RETAIN_WITH_SOURCE_GEOGRAPHY_UNMAPPED';
  numericInference: 'PROHIBITED';
  coverageAssertion: false;
  activationState: 'NOT_AUTHORIZED';
}>;

export const IRES_CITYID_SOURCE_GEOGRAPHY_FIREWALL = {
  runtimeIngestion: false,
  listingAssignment: false,
  geographicObjectCreation: false,
  searchMapUse: false,
  publicDisplay: false,
  coverageClaim: false,
  activation: false,
} as const;

export const IRES_CITYID_OFFICIAL_EVIDENCE = {
  evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24',
  observedOn: '2026-08-24',
  sourceSystem: 'IRES',
  fieldName: 'IRE_CityID',
  fieldClassification: 'IRES_LOCAL_NON_STANDARD_FIELD',
  sourceDeliveryContext: 'MLS_GRID_IRES_DATASET',
  sourceIdentityRule: 'SOURCE_SPECIFIC_GEOGRAPHIC_KEY_NOT_ATLAS_CANONICAL_IDENTIFIER',
  reportedFullEnumeration: {
    status: 'OFFICIAL_RESPONSE_EXTERNAL_NOT_EMBEDDED',
    reportedCardinality: 'OVER_500_VALUES',
    refreshRequirement: 'AUTHORIZED_DATASET_DISTINCT_VALUES_QUERY_REQUIRED',
    mutableSourceStateCopiedIntoGeographicObjects: false,
  },
  evidenceLimits: {
    countyOrCityPartitionAvailableFromSupport: false,
    statewideCoverageClaim: false,
    sourceActivationAuthorized: false,
  },
  correctionAndRetirement: {
    correctionRequiredForConflictingObservation: true,
    retirementRequiredForSupersededEvidenceVersion: true,
  },
} as const;

export const IRES_CITYID_HIGH_PRIORITY_OFFICIAL_OBSERVATIONS: readonly IresCityIdObservation[] = [
  { sourceValue: '1', reportedCityName: 'Akron', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '3', reportedCityName: 'Arvada', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '9', reportedCityName: 'Boulder', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '11', reportedCityName: 'Brighton', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '12', reportedCityName: 'Broomfield', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '19', reportedCityName: 'Denver', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '24', reportedCityName: 'Erie', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '30', reportedCityName: 'Fort Collins', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '40', reportedCityName: 'Greeley', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '53', reportedCityName: 'Lafayette', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '60', reportedCityName: 'Longmont', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '61', reportedCityName: 'Louisville', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '62', reportedCityName: 'Loveland', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '70', reportedCityName: 'Niwot', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '93', reportedCityName: 'Superior', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '101', reportedCityName: 'Westminster', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '108', reportedCityName: 'Aurora', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '110', reportedCityName: 'Castle Rock', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '142', reportedCityName: 'Colorado Springs', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '173', reportedCityName: 'Highlands Ranch', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '178', reportedCityName: 'Pueblo', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '197', reportedCityName: 'Centennial', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '198', reportedCityName: 'Parker', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '255', reportedCityName: 'Durango', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '274', reportedCityName: 'Grand Junction', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '336', reportedCityName: 'Steamboat Springs', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '360', reportedCityName: 'Telluride', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
  { sourceValue: '370', reportedCityName: 'Aspen', evidenceReference: 'IRES_MLS_SUPPORT_2026_08_24' },
] as const;

const observationsBySourceValue = new Map(IRES_CITYID_HIGH_PRIORITY_OFFICIAL_OBSERVATIONS.map((item) => [item.sourceValue, item]));

export function resolveIresCityId(sourceValue: unknown): IresCityIdResolution {
  const normalizedSourceValue = typeof sourceValue === 'string' ? sourceValue.trim() : typeof sourceValue === 'number' && Number.isInteger(sourceValue) ? String(sourceValue) : '';
  if (!normalizedSourceValue) {
    return {
      sourceSystem: 'IRES', fieldName: 'IRE_CityID', sourceValue: null, observationState: 'MISSING', reportedCityName: null,
      atlasGeographicObjectState: 'NOT_RECONCILED', listingDisposition: 'RETAIN_WITH_SOURCE_GEOGRAPHY_UNMAPPED', numericInference: 'PROHIBITED', coverageAssertion: false, activationState: 'NOT_AUTHORIZED',
    };
  }

  const observation = observationsBySourceValue.get(normalizedSourceValue);
  return {
    sourceSystem: 'IRES', fieldName: 'IRE_CityID', sourceValue: normalizedSourceValue,
    observationState: observation ? 'OFFICIALLY_OBSERVED_HIGH_PRIORITY' : 'UNKNOWN_OR_UNMAPPED', reportedCityName: observation?.reportedCityName ?? null,
    atlasGeographicObjectState: 'NOT_RECONCILED', listingDisposition: 'RETAIN_WITH_SOURCE_GEOGRAPHY_UNMAPPED', numericInference: 'PROHIBITED', coverageAssertion: false, activationState: 'NOT_AUTHORIZED',
  };
}

export function validateIresCityIdEvidenceContract(): boolean {
  return IRES_CITYID_OFFICIAL_EVIDENCE_STATUS === 'PROJECT_ATLAS_IRES_CITYID_OFFICIAL_EVIDENCE_ADMITTED'
    && IRES_CITYID_VERSIONED_SOURCE_GEOGRAPHY_CONTRACT_STATUS === 'IRES_CITYID_VERSIONED_SOURCE_GEOGRAPHY_CONTRACT_CERTIFIED'
    && IRES_CITYID_OFFICIAL_EVIDENCE.reportedFullEnumeration.status === 'OFFICIAL_RESPONSE_EXTERNAL_NOT_EMBEDDED'
    && IRES_CITYID_OFFICIAL_EVIDENCE.reportedFullEnumeration.mutableSourceStateCopiedIntoGeographicObjects === false
    && IRES_CITYID_HIGH_PRIORITY_OFFICIAL_OBSERVATIONS.length > 0
    && IRES_CITYID_HIGH_PRIORITY_OFFICIAL_OBSERVATIONS.every((item) => resolveIresCityId(item.sourceValue).reportedCityName === item.reportedCityName)
    && Object.values(IRES_CITYID_SOURCE_GEOGRAPHY_FIREWALL).every((value) => value === false);
}
