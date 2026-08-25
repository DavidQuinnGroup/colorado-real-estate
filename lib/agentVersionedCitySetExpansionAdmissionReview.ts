export const VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_STATUS =
  'VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_CERTIFIED' as const;

export const VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_VERSION =
  'VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_V1' as const;

export const VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_NEXT_GATE =
  'READY_FOR_VERSIONED_AGENT_LISTING_CITY_SET_AND_PRIORITY_CITY_EXPANSION_BOUNDED_IMPLEMENTATION_WAVE_9' as const;

export const RECOMMENDED_AGENT_CITY_AUTHORITY_NAME =
  'AGENT_ADMITTED_LISTING_CITY_SET_V1' as const;

export type AgentListingCitySemanticType =
  | 'MUNICIPALITY'
  | 'CITY_AND_COUNTY'
  | 'LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY'
  | 'UNINCORPORATED_COMMUNITY';

export type AgentListingCityAdmissionState =
  | 'CURRENTLY_ADMITTED'
  | 'READY_FOR_WAVE_9_RUNTIME_ADMISSION'
  | 'DEFERRED_NOT_WAVE_9_PRIORITY'
  | 'BLOCKED_BY_PLACE_IDENTITY';

export type AgentListingCityCoverage = Readonly<{
  totalRows: number;
  activeRows: number;
  activeResidentialRows: number;
  zipPopulation: number;
  distinctZips: number;
  pricePopulation: number;
  bedroomPopulation: number;
  bathroomPopulation: number;
  listedSqftPopulation: number;
  yearBuiltPopulation: number;
  lotAcreagePopulation: number;
  topZips: readonly (readonly [string, number])[];
  sourcePrefixes: readonly (readonly [string, number])[];
  observedLabels: readonly (readonly [string, number])[];
}>;

export type AgentListingCityReviewEntry = Readonly<{
  admissionKey: string;
  displayLabel: string;
  queryValues: readonly string[];
  semanticType: AgentListingCitySemanticType;
  admissionState: AgentListingCityAdmissionState;
  versionIntroduced: 'CURRENT_SIX_CITY_BASELINE' | 'PROPOSED_WAVE_9' | 'NOT_INTRODUCED';
  analyticalGrain: 'MLS_LISTING';
  sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION';
  rightsAudience: 'AGENT_ONLY';
  zipCompatible: boolean;
  comparisonCompatible: boolean;
  cohortNCompatible: boolean;
  iresCityId: string | null;
  governedGeographyRelationship: string;
  surfaceAvailability: Readonly<{
    sharedCohortEngine: boolean;
    currentCompetingListingContext: boolean;
    propertyPreparation: boolean;
    buyerPreparation: boolean;
    marketPreparation: boolean;
    locationPreparation: boolean;
    publicClientExport: false;
  }>;
  limitations: readonly string[];
  coverage: AgentListingCityCoverage;
}>;

const coverage = (input: AgentListingCityCoverage): AgentListingCityCoverage => Object.freeze({
  ...input,
  topZips: Object.freeze(input.topZips),
  sourcePrefixes: Object.freeze(input.sourcePrefixes),
  observedLabels: Object.freeze(input.observedLabels),
});

const surface = (locationPreparation: boolean) => Object.freeze({
  sharedCohortEngine: true,
  currentCompetingListingContext: true,
  propertyPreparation: true,
  buyerPreparation: true,
  marketPreparation: true,
  locationPreparation,
  publicClientExport: false as const,
});

const agentOnlySurface = surface(false);

export const VERSIONED_CITY_SET_REVIEW_OBSERVED_AT = '2026-08-25T20:51:57.562Z' as const;

export const CURRENT_SIX_AGENT_LISTING_CITY_KEYS = Object.freeze(['boulder', 'louisville', 'lafayette', 'superior', 'erie', 'longmont'] as const);
export const WAVE_9_READY_AGENT_LISTING_CITY_KEYS = Object.freeze(['denver', 'broomfield', 'westminster', 'brighton', 'arvada'] as const);
export const DEFERRED_AGENT_LISTING_CITY_KEYS = Object.freeze(['aurora'] as const);
export const BLOCKED_AGENT_LISTING_CITY_KEYS = Object.freeze(['niwot'] as const);

export const AGENT_LISTING_CITY_REVIEW_ENTRIES: readonly AgentListingCityReviewEntry[] = Object.freeze([
  entry('boulder', 'Boulder', 'MUNICIPALITY', 'CURRENTLY_ADMITTED', 'CURRENT_SIX_CITY_BASELINE', '9', true, 'EXISTING_LISTING_CITY_LABEL_ONLY', { totalRows: 1266, activeRows: 387, activeResidentialRows: 353, zipPopulation: 353, distinctZips: 5, pricePopulation: 353, bedroomPopulation: 353, bathroomPopulation: 353, listedSqftPopulation: 353, yearBuiltPopulation: 353, lotAcreagePopulation: 264, topZips: [['80304', 96], ['80302', 89], ['80301', 74], ['80303', 63], ['80305', 31]], sourcePrefixes: [['IRE', 353]], observedLabels: [['Boulder', 1266]] }, ['Existing six-city semantics must be preserved.']),
  entry('louisville', 'Louisville', 'MUNICIPALITY', 'CURRENTLY_ADMITTED', 'CURRENT_SIX_CITY_BASELINE', '61', true, 'EXISTING_LISTING_CITY_LABEL_ONLY', { totalRows: 227, activeRows: 48, activeResidentialRows: 46, zipPopulation: 46, distinctZips: 1, pricePopulation: 46, bedroomPopulation: 46, bathroomPopulation: 46, listedSqftPopulation: 46, yearBuiltPopulation: 46, lotAcreagePopulation: 37, topZips: [['80027', 46]], sourcePrefixes: [['IRE', 46]], observedLabels: [['Louisville', 227]] }, ['Existing six-city semantics must be preserved.']),
  entry('lafayette', 'Lafayette', 'MUNICIPALITY', 'CURRENTLY_ADMITTED', 'CURRENT_SIX_CITY_BASELINE', '53', true, 'EXISTING_LISTING_CITY_LABEL_ONLY', { totalRows: 417, activeRows: 59, activeResidentialRows: 54, zipPopulation: 54, distinctZips: 1, pricePopulation: 54, bedroomPopulation: 54, bathroomPopulation: 54, listedSqftPopulation: 54, yearBuiltPopulation: 54, lotAcreagePopulation: 51, topZips: [['80026', 54]], sourcePrefixes: [['IRE', 54]], observedLabels: [['Lafayette', 417]] }, ['Existing six-city semantics must be preserved.']),
  entry('superior', 'Superior', 'MUNICIPALITY', 'CURRENTLY_ADMITTED', 'CURRENT_SIX_CITY_BASELINE', '93', true, 'EXISTING_LISTING_CITY_LABEL_ONLY_WITH_KNOWN_BOUNDARY_COMPLEXITY_OUTSIDE_THIS_FILTER', { totalRows: 184, activeRows: 44, activeResidentialRows: 43, zipPopulation: 43, distinctZips: 1, pricePopulation: 43, bedroomPopulation: 43, bathroomPopulation: 43, listedSqftPopulation: 43, yearBuiltPopulation: 43, lotAcreagePopulation: 37, topZips: [['80027', 43]], sourcePrefixes: [['IRE', 43]], observedLabels: [['Superior', 184]] }, ['Existing six-city semantics must be preserved.']),
  entry('erie', 'Erie', 'MUNICIPALITY', 'CURRENTLY_ADMITTED', 'CURRENT_SIX_CITY_BASELINE', '24', true, 'EXISTING_LISTING_CITY_LABEL_ONLY', { totalRows: 1134, activeRows: 132, activeResidentialRows: 129, zipPopulation: 129, distinctZips: 2, pricePopulation: 129, bedroomPopulation: 129, bathroomPopulation: 129, listedSqftPopulation: 129, yearBuiltPopulation: 129, lotAcreagePopulation: 126, topZips: [['80516', 126], ['80026', 3]], sourcePrefixes: [['IRE', 129]], observedLabels: [['Erie', 1134]] }, ['Existing six-city semantics must be preserved.']),
  entry('longmont', 'Longmont', 'MUNICIPALITY', 'CURRENTLY_ADMITTED', 'CURRENT_SIX_CITY_BASELINE', '60', true, 'EXISTING_LISTING_CITY_LABEL_ONLY', { totalRows: 1226, activeRows: 271, activeResidentialRows: 248, zipPopulation: 248, distinctZips: 3, pricePopulation: 248, bedroomPopulation: 248, bathroomPopulation: 248, listedSqftPopulation: 248, yearBuiltPopulation: 248, lotAcreagePopulation: 228, topZips: [['80504', 103], ['80501', 74], ['80503', 71]], sourcePrefixes: [['IRE', 248]], observedLabels: [['Longmont', 1226]] }, ['Existing six-city semantics must be preserved.']),
  entry('denver', 'Denver', 'CITY_AND_COUNTY', 'READY_FOR_WAVE_9_RUNTIME_ADMISSION', 'PROPOSED_WAVE_9', '19', false, 'LISTING_CITY_LABEL_ONLY; DOES_NOT_ACTIVATE_CITY_AND_COUNTY_GEOGRAPHIC_OBJECT', { totalRows: 11134, activeRows: 2072, activeResidentialRows: 2013, zipPopulation: 2013, distinctZips: 39, pricePopulation: 2013, bedroomPopulation: 2013, bathroomPopulation: 2013, listedSqftPopulation: 2013, yearBuiltPopulation: 2013, lotAcreagePopulation: 1372, topZips: [['80211', 151], ['80210', 111], ['80220', 101], ['80202', 99], ['80204', 96], ['80205', 88]], sourcePrefixes: [['IRE', 2013]], observedLabels: [['Denver', 11134]] }, ['No public/client/export rights; Location Preparation requires separate surface subset approval.']),
  entry('broomfield', 'Broomfield', 'CITY_AND_COUNTY', 'READY_FOR_WAVE_9_RUNTIME_ADMISSION', 'PROPOSED_WAVE_9', '12', false, 'LISTING_CITY_LABEL_ONLY; CITY_AND_COUNTY PUBLIC_RECORD IDENTITY REMAINS SEPARATE', { totalRows: 1505, activeRows: 228, activeResidentialRows: 223, zipPopulation: 223, distinctZips: 3, pricePopulation: 223, bedroomPopulation: 223, bathroomPopulation: 223, listedSqftPopulation: 223, yearBuiltPopulation: 223, lotAcreagePopulation: 200, topZips: [['80020', 92], ['80023', 92], ['80021', 39]], sourcePrefixes: [['IRE', 223]], observedLabels: [['Broomfield', 1505]] }, ['City label admission must not imply assessor, county, parcel, or polygon authority.']),
  entry('westminster', 'Westminster', 'LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY', 'READY_FOR_WAVE_9_RUNTIME_ADMISSION', 'PROPOSED_WAVE_9', '101', false, 'LISTING_CITY_LABEL_ONLY; CROSS_COUNTY GEOGRAPHIC IDENTITY NOT ASSERTED', { totalRows: 1255, activeRows: 175, activeResidentialRows: 172, zipPopulation: 172, distinctZips: 6, pricePopulation: 172, bedroomPopulation: 172, bathroomPopulation: 172, listedSqftPopulation: 172, yearBuiltPopulation: 172, lotAcreagePopulation: 142, topZips: [['80031', 104], ['80030', 25], ['80021', 18], ['80234', 16], ['80020', 7], ['80023', 2]], sourcePrefixes: [['IRE', 172]], observedLabels: [['Westminster', 1255]] }, ['Admission cannot imply one county, assessor jurisdiction, or polygon.']),
  entry('brighton', 'Brighton', 'MUNICIPALITY', 'READY_FOR_WAVE_9_RUNTIME_ADMISSION', 'PROPOSED_WAVE_9', '11', false, 'LISTING_CITY_LABEL_ONLY', { totalRows: 1333, activeRows: 216, activeResidentialRows: 211, zipPopulation: 211, distinctZips: 3, pricePopulation: 211, bedroomPopulation: 211, bathroomPopulation: 211, listedSqftPopulation: 211, yearBuiltPopulation: 211, lotAcreagePopulation: 205, topZips: [['80601', 129], ['80602', 53], ['80603', 29]], sourcePrefixes: [['IRE', 211]], observedLabels: [['Brighton', 1333]] }, ['No county, subdivision, public-record, or public route admission included.']),
  entry('arvada', 'Arvada', 'MUNICIPALITY', 'READY_FOR_WAVE_9_RUNTIME_ADMISSION', 'PROPOSED_WAVE_9', '3', false, 'LISTING_CITY_LABEL_ONLY', { totalRows: 2578, activeRows: 294, activeResidentialRows: 287, zipPopulation: 287, distinctZips: 5, pricePopulation: 287, bedroomPopulation: 287, bathroomPopulation: 287, listedSqftPopulation: 287, yearBuiltPopulation: 287, lotAcreagePopulation: 250, topZips: [['80007', 72], ['80003', 65], ['80004', 59], ['80005', 58], ['80002', 33]], sourcePrefixes: [['IRE', 287]], observedLabels: [['Arvada', 2578]] }, ['Included as bounded high-value adjacent Front Range candidate, not statewide expansion.']),
  entry('aurora', 'Aurora', 'LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY', 'DEFERRED_NOT_WAVE_9_PRIORITY', 'NOT_INTRODUCED', '108', false, 'LISTING_CITY_LABEL_ONLY; LARGE CROSS_COUNTY CITY SHOULD BE REVIEWED IN LATER PRIORITY WAVE', { totalRows: 7451, activeRows: 996, activeResidentialRows: 981, zipPopulation: 981, distinctZips: 11, pricePopulation: 981, bedroomPopulation: 981, bathroomPopulation: 981, listedSqftPopulation: 981, yearBuiltPopulation: 981, lotAcreagePopulation: 810, topZips: [['80016', 159], ['80019', 142], ['80013', 126], ['80014', 116], ['80018', 113], ['80015', 85]], sourcePrefixes: [['IRE', 981]], observedLabels: [['Aurora', 7451]] }, ['Strong data exists, but this review keeps Wave 9 bounded to primary-plus-adjacent scope.']),
  entry('niwot', 'Niwot', 'UNINCORPORATED_COMMUNITY', 'BLOCKED_BY_PLACE_IDENTITY', 'NOT_INTRODUCED', '70', false, 'UNINCORPORATED_COMMUNITY; AUTHORITY_AND_BOUNDARY_UNRESOLVED', { totalRows: 67, activeRows: 20, activeResidentialRows: 20, zipPopulation: 20, distinctZips: 1, pricePopulation: 20, bedroomPopulation: 20, bathroomPopulation: 20, listedSqftPopulation: 20, yearBuiltPopulation: 20, lotAcreagePopulation: 19, topZips: [['80503', 20]], sourcePrefixes: [['IRE', 20]], observedLabels: [['Niwot', 67]] }, ['Do not call Niwot an incorporated municipality; governed place identity reconciliation remains required.']),
]);

export const VERSIONED_CITY_SET_PROTECTED_BOUNDARIES = Object.freeze({
  runtimeCityActivation: false,
  productionAllowlistMutation: false,
  databaseMutation: false,
  schemaMigration: false,
  providerActivity: false,
  mlsGridCall: false,
  iresCall: false,
  mlsSync: false,
  sourceActivation: false,
  typesenseMutation: false,
  crmMutation: false,
  emailMutation: false,
  secretMutation: false,
  publicClientExport: false,
  manualVercelAction: false,
  productionDeployment: false,
} as const);

function entry(
  admissionKey: string,
  displayLabel: string,
  semanticType: AgentListingCitySemanticType,
  admissionState: AgentListingCityAdmissionState,
  versionIntroduced: AgentListingCityReviewEntry['versionIntroduced'],
  iresCityId: string,
  locationPreparation: boolean,
  governedGeographyRelationship: string,
  cityCoverage: AgentListingCityCoverage,
  limitations: readonly string[],
): AgentListingCityReviewEntry {
  const blocked = admissionState === 'BLOCKED_BY_PLACE_IDENTITY';
  return Object.freeze({
    admissionKey,
    displayLabel,
    queryValues: Object.freeze([displayLabel]),
    semanticType,
    admissionState,
    versionIntroduced,
    analyticalGrain: 'MLS_LISTING',
    sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
    rightsAudience: 'AGENT_ONLY',
    zipCompatible: true,
    comparisonCompatible: !blocked,
    cohortNCompatible: !blocked,
    iresCityId,
    governedGeographyRelationship,
    surfaceAvailability: blocked ? Object.freeze({
      sharedCohortEngine: false,
      currentCompetingListingContext: false,
      propertyPreparation: false,
      buyerPreparation: false,
      marketPreparation: false,
      locationPreparation: false,
      publicClientExport: false as const,
    }) : locationPreparation ? surface(true) : agentOnlySurface,
    limitations: Object.freeze(limitations),
    coverage: coverage(cityCoverage),
  });
}

export function normalizeAgentListingCityLabel(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized ? normalized.toLowerCase() : null;
}

export function getAgentListingCityReviewEntry(keyOrLabel: string): AgentListingCityReviewEntry | null {
  const normalized = normalizeAgentListingCityLabel(keyOrLabel);
  return AGENT_LISTING_CITY_REVIEW_ENTRIES.find((entry) => (
    entry.admissionKey === normalized ||
    entry.displayLabel.toLowerCase() === normalized ||
    entry.queryValues.some((value) => value.toLowerCase() === normalized)
  )) ?? null;
}
