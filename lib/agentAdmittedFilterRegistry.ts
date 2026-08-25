export const ADMITTED_FILTER_REGISTRY_WAVE_7_STATUS =
  'ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7_CERTIFIED' as const;
export const AGENT_ADMITTED_FILTER_REGISTRY_VERSION = 'AGENT_ADMITTED_FILTER_REGISTRY_V1' as const;
export const ADMITTED_FILTER_REGISTRY_NEXT_GATE = 'READY_FOR_ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION' as const;

export type AgentAdmittedFilterTier = 'QUICK_FILTER' | 'ADVANCED_PROPERTY_FILTER';
export type AgentAdmittedFilterOperator = 'EQUALS' | 'IN' | 'MINIMUM' | 'MAXIMUM' | 'EXACT';
export type AgentAdmittedFilterKey =
  | 'city'
  | 'zip'
  | 'propertyType'
  | 'statusScope'
  | 'priceMin'
  | 'priceMax'
  | 'bedsMin'
  | 'bedsMax'
  | 'bedsExact'
  | 'bathsMin'
  | 'bathsMax'
  | 'bathsExact'
  | 'sqftMin'
  | 'sqftMax'
  | 'yearBuiltMin'
  | 'yearBuiltMax'
  | 'lotSizeMin'
  | 'lotSizeMax';

export type AgentAdmittedFilterRegistration = Readonly<{
  key: AgentAdmittedFilterKey;
  propertyField: 'city' | 'zip' | 'propertyType' | 'status' | 'price' | 'beds' | 'baths' | 'sqft' | 'yearBuilt' | 'lotSize';
  tier: AgentAdmittedFilterTier;
  operator: AgentAdmittedFilterOperator;
  valueType: 'STRING_ENUM' | 'STRING_IDENTIFIER' | 'INTEGER' | 'DECIMAL';
  canonicalUnit: 'NONE' | 'USD' | 'COUNT' | 'LISTED_SQUARE_FEET' | 'YEAR' | 'ACRES';
  analyticalGrain: 'MLS_LISTING';
  sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION';
  rightsAudience: 'AGENT_ONLY';
  filterable: true;
  aggregatable: boolean;
  nullPolicy: 'RECORD_MUST_HAVE_POPULATED_VALUE';
  geographyActivation: false;
}>;

function registration(input: Omit<AgentAdmittedFilterRegistration, 'analyticalGrain' | 'sourceScope' | 'rightsAudience' | 'filterable' | 'nullPolicy' | 'geographyActivation'>): AgentAdmittedFilterRegistration {
  return Object.freeze({
    ...input,
    analyticalGrain: 'MLS_LISTING',
    sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
    rightsAudience: 'AGENT_ONLY',
    filterable: true,
    nullPolicy: 'RECORD_MUST_HAVE_POPULATED_VALUE',
    geographyActivation: false,
  });
}

export const AGENT_ADMITTED_FILTER_REGISTRY: Readonly<Record<AgentAdmittedFilterKey, AgentAdmittedFilterRegistration>> = Object.freeze({
  city: registration({ key: 'city', propertyField: 'city', tier: 'QUICK_FILTER', operator: 'EQUALS', valueType: 'STRING_ENUM', canonicalUnit: 'NONE', aggregatable: false }),
  zip: registration({ key: 'zip', propertyField: 'zip', tier: 'ADVANCED_PROPERTY_FILTER', operator: 'IN', valueType: 'STRING_IDENTIFIER', canonicalUnit: 'NONE', aggregatable: false }),
  propertyType: registration({ key: 'propertyType', propertyField: 'propertyType', tier: 'QUICK_FILTER', operator: 'EQUALS', valueType: 'STRING_ENUM', canonicalUnit: 'NONE', aggregatable: false }),
  statusScope: registration({ key: 'statusScope', propertyField: 'status', tier: 'QUICK_FILTER', operator: 'EQUALS', valueType: 'STRING_ENUM', canonicalUnit: 'NONE', aggregatable: false }),
  priceMin: registration({ key: 'priceMin', propertyField: 'price', tier: 'QUICK_FILTER', operator: 'MINIMUM', valueType: 'INTEGER', canonicalUnit: 'USD', aggregatable: true }),
  priceMax: registration({ key: 'priceMax', propertyField: 'price', tier: 'QUICK_FILTER', operator: 'MAXIMUM', valueType: 'INTEGER', canonicalUnit: 'USD', aggregatable: true }),
  bedsMin: registration({ key: 'bedsMin', propertyField: 'beds', tier: 'QUICK_FILTER', operator: 'MINIMUM', valueType: 'INTEGER', canonicalUnit: 'COUNT', aggregatable: true }),
  bedsMax: registration({ key: 'bedsMax', propertyField: 'beds', tier: 'ADVANCED_PROPERTY_FILTER', operator: 'MAXIMUM', valueType: 'INTEGER', canonicalUnit: 'COUNT', aggregatable: true }),
  bedsExact: registration({ key: 'bedsExact', propertyField: 'beds', tier: 'ADVANCED_PROPERTY_FILTER', operator: 'EXACT', valueType: 'INTEGER', canonicalUnit: 'COUNT', aggregatable: true }),
  bathsMin: registration({ key: 'bathsMin', propertyField: 'baths', tier: 'QUICK_FILTER', operator: 'MINIMUM', valueType: 'DECIMAL', canonicalUnit: 'COUNT', aggregatable: true }),
  bathsMax: registration({ key: 'bathsMax', propertyField: 'baths', tier: 'ADVANCED_PROPERTY_FILTER', operator: 'MAXIMUM', valueType: 'DECIMAL', canonicalUnit: 'COUNT', aggregatable: true }),
  bathsExact: registration({ key: 'bathsExact', propertyField: 'baths', tier: 'ADVANCED_PROPERTY_FILTER', operator: 'EXACT', valueType: 'DECIMAL', canonicalUnit: 'COUNT', aggregatable: true }),
  sqftMin: registration({ key: 'sqftMin', propertyField: 'sqft', tier: 'QUICK_FILTER', operator: 'MINIMUM', valueType: 'INTEGER', canonicalUnit: 'LISTED_SQUARE_FEET', aggregatable: true }),
  sqftMax: registration({ key: 'sqftMax', propertyField: 'sqft', tier: 'QUICK_FILTER', operator: 'MAXIMUM', valueType: 'INTEGER', canonicalUnit: 'LISTED_SQUARE_FEET', aggregatable: true }),
  yearBuiltMin: registration({ key: 'yearBuiltMin', propertyField: 'yearBuilt', tier: 'QUICK_FILTER', operator: 'MINIMUM', valueType: 'INTEGER', canonicalUnit: 'YEAR', aggregatable: true }),
  yearBuiltMax: registration({ key: 'yearBuiltMax', propertyField: 'yearBuilt', tier: 'QUICK_FILTER', operator: 'MAXIMUM', valueType: 'INTEGER', canonicalUnit: 'YEAR', aggregatable: true }),
  lotSizeMin: registration({ key: 'lotSizeMin', propertyField: 'lotSize', tier: 'ADVANCED_PROPERTY_FILTER', operator: 'MINIMUM', valueType: 'DECIMAL', canonicalUnit: 'ACRES', aggregatable: false }),
  lotSizeMax: registration({ key: 'lotSizeMax', propertyField: 'lotSize', tier: 'ADVANCED_PROPERTY_FILTER', operator: 'MAXIMUM', valueType: 'DECIMAL', canonicalUnit: 'ACRES', aggregatable: false }),
});

export const AGENT_COHORT_UNADMITTED_FILTER_KEYS = [
  'county',
  'subdivision',
  'neighborhood',
  'mlsArea',
  'mlsSubArea',
  'radius',
  'polygon',
  'ireCityId',
  'garageSpaces',
  'parkingSpaces',
  'hoa',
  'basement',
  'style',
  'newConstruction',
  'builder',
  'zoning',
  'utilities',
  'school',
  'remarks',
  'listingAgent',
  'listingOffice',
  'photo',
  'openHouse',
] as const;

export function getAgentAdmittedFilterRegistration(key: string) {
  return AGENT_ADMITTED_FILTER_REGISTRY[key as AgentAdmittedFilterKey] ?? null;
}

export function isAgentAdmittedFilterKey(key: string): key is AgentAdmittedFilterKey {
  return Boolean(getAgentAdmittedFilterRegistration(key));
}

export function isAgentUnadmittedFilterKey(key: string) {
  return (AGENT_COHORT_UNADMITTED_FILTER_KEYS as readonly string[]).includes(key);
}
