export const ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_STATUS =
  'ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_CERTIFIED' as const;

export const ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_VERSION =
  'ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_V1' as const;

export const ZIP_POSTAL_LISTING_FILTER_FOUNDATION_NEXT_GATE =
  'READY_FOR_ZIP_POSTAL_LISTING_FILTER_BOUNDED_IMPLEMENTATION_WAVE_8' as const;

export type ZipPostalListingFilterReadiness =
  | 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION'
  | 'READY_AFTER_SURFACE_ADAPTER'
  | 'BLOCKED_BY_CURRENT_GEOGRAPHY_CONTRACT'
  | 'DEFER';

export const ZIP_POSTAL_LISTING_FIELD_CONTRACT = Object.freeze({
  filterIdRecommendation: 'zip',
  semanticName: 'LISTING_POSTAL_CODE_FILTER_V1',
  repositoryField: 'Property.zip',
  propertyField: 'zip',
  sourceFields: Object.freeze(['PostalCode', 'Zip', 'zip']),
  dataType: 'STRING_IDENTIFIER',
  schemaNullability: 'REQUIRED_STRING_WITH_INGESTION_UNKNOWN_SENTINEL',
  unknownSentinel: '00000',
  addressRole: 'CURRENT_LISTING_PROPERTY_LOCATION_ADDRESS',
  analyticalGrain: 'MLS_LISTING',
  sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
  rightsAudience: 'AGENT_ONLY',
  registryTier: 'ADVANCED_PROPERTY_FILTER',
  controlType: 'SEARCHABLE_MULTI_SELECT_WITH_SINGLE_VALUE_MODE',
  allowedOperators: Object.freeze(['EQUALS', 'IN']),
  blockedOperators: Object.freeze(['MINIMUM', 'MAXIMUM', 'LESS_THAN', 'GREATER_THAN', 'NUMERIC_RANGE', 'PREFIX', 'CONTAINS']),
  geographyActivation: false,
  aggregatable: false,
  metricAdmission: false,
  defaultCompetingCohortDerivation: false,
  publicClientExport: false,
} as const);

export const ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE = Object.freeze({
  observedAt: '2026-08-25T20:16:38.270Z',
  allPropertyRows: Object.freeze({
    total: 75490,
    populated: 75490,
    nullish: 0,
    fiveDigit: 75490,
    zipPlus4: 0,
    malformed: 0,
    whitespacePadded: 0,
    sentinel00000: 0,
    leadingZeroCurrentRows: 0,
    distinctBaseZipCount: 419,
  }),
  activeResidentialRows: Object.freeze({
    total: 12006,
    populated: 12006,
    fiveDigit: 12006,
    distinctBaseZipCount: 328,
  }),
  sixCityRows: Object.freeze({
    total: 4454,
    populated: 4454,
    fiveDigit: 4454,
    distinctBaseZipCount: 12,
  }),
  sixCityActiveResidentialRows: Object.freeze({
    total: 873,
    populated: 873,
    fiveDigit: 873,
    distinctBaseZipCount: 11,
  }),
  sixCityActiveResidentialDistribution: Object.freeze({
    Boulder: Object.freeze([['80304', 96], ['80302', 89], ['80301', 74], ['80303', 63], ['80305', 31]] as const),
    Louisville: Object.freeze([['80027', 46]] as const),
    Lafayette: Object.freeze([['80026', 54]] as const),
    Superior: Object.freeze([['80027', 43]] as const),
    Erie: Object.freeze([['80516', 126], ['80026', 3]] as const),
    Longmont: Object.freeze([['80504', 103], ['80501', 74], ['80503', 71]] as const),
  }),
} as const);

export const ZIP_POSTAL_LISTING_IMPLEMENTATION_READINESS = Object.freeze({
  fieldSemantics: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION',
  normalization: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION',
  exactFilter: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION',
  multiSelectFilter: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION',
  zipOnlyCohort: 'BLOCKED_BY_CURRENT_GEOGRAPHY_CONTRACT',
  cityZipCohort: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION',
  priorityOneComposition: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION',
  comparativeIntelligence: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION',
  cohortN: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION',
  buyerMapping: 'DEFER',
  locationRefinement: 'READY_AFTER_SURFACE_ADAPTER',
  marketSegmentation: 'READY_AFTER_SURFACE_ADAPTER',
  currentCompetingListingContextRefinement: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION',
  subjectZipDisplay: 'READY_AFTER_SURFACE_ADAPTER',
} satisfies Record<string, ZipPostalListingFilterReadiness>);

export type ZipPostalNormalizationResult = Readonly<{
  ready: boolean;
  normalized: string | null;
  reasons: readonly string[];
}>;

export function normalizeZipPostalListingFilterValue(value: unknown): ZipPostalNormalizationResult {
  if (value === null || value === undefined) return Object.freeze({ ready: false, normalized: null, reasons: Object.freeze(['ZIP_UNKNOWN']) });
  if (typeof value !== 'string') return Object.freeze({ ready: false, normalized: null, reasons: Object.freeze(['ZIP_MUST_BE_STRING']) });
  const trimmed = value.trim();
  if (!trimmed) return Object.freeze({ ready: false, normalized: null, reasons: Object.freeze(['ZIP_BLANK']) });
  if (trimmed === ZIP_POSTAL_LISTING_FIELD_CONTRACT.unknownSentinel) return Object.freeze({ ready: false, normalized: null, reasons: Object.freeze(['ZIP_UNKNOWN_SENTINEL']) });
  const plusFour = trimmed.match(/^(\d{5})-\d{4}$/);
  if (plusFour) return Object.freeze({ ready: true, normalized: plusFour[1], reasons: Object.freeze(['ZIP_PLUS_4_NORMALIZED_TO_BASE_FIVE_DIGIT']) });
  if (!/^\d{5}$/.test(trimmed)) return Object.freeze({ ready: false, normalized: null, reasons: Object.freeze(['ZIP_MALFORMED']) });
  return Object.freeze({ ready: true, normalized: trimmed, reasons: Object.freeze([]) });
}

export function normalizeZipPostalListingFilterSet(values: readonly unknown[]): ZipPostalNormalizationResult {
  const normalized = new Set<string>();
  const reasons = new Set<string>();
  for (const value of values) {
    const result = normalizeZipPostalListingFilterValue(value);
    for (const reason of result.reasons) reasons.add(reason);
    if (!result.ready || !result.normalized) return Object.freeze({ ready: false, normalized: null, reasons: Object.freeze([...reasons].sort()) });
    normalized.add(result.normalized);
  }
  if (normalized.size === 0) return Object.freeze({ ready: false, normalized: null, reasons: Object.freeze(['ZIP_SET_EMPTY']) });
  return Object.freeze({ ready: true, normalized: [...normalized].sort().join(','), reasons: Object.freeze([...reasons].sort()) });
}

export const ZIP_POSTAL_LISTING_PROTECTED_BOUNDARIES = Object.freeze({
  runtimeFilterImplementation: false,
  uiActivation: false,
  queryActivation: false,
  productionRegistryActivation: false,
  databaseMutation: false,
  schemaMigration: false,
  providerActivity: false,
  mlsGridCall: false,
  iresCall: false,
  mlsSync: false,
  sourceActivation: false,
  typesenseMutation: false,
  crmEmailMutation: false,
  publicClientExport: false,
  canonicalZipGeographyActivation: false,
  newMunicipalityActivation: false,
  historicalAnalytics: false,
  soldComparable: false,
  subjectBenchmark: false,
  cmaValuationRecommendation: false,
} as const);
