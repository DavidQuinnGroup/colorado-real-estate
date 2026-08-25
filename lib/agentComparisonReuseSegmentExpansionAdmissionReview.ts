export const AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_REVIEW_STATUS =
  'AGENT_COMPARISON_REUSE_AND_SEGMENT_EXPANSION_REVIEW_CERTIFIED' as const;

export const AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_NEXT_GATE =
  'READY_FOR_AGENT_DECISION_COMPARISON_REUSE_AND_INTERVAL_SEMANTICS_BOUNDED_IMPLEMENTATION_WAVE_4' as const;

export const AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_REVIEW_VERSION =
  'AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_ADMISSION_REVIEW_V1' as const;

export type AgentComparisonSurfaceId =
  | 'MARKET_UPDATE_PREPARATION'
  | 'MARKET_PREPARATION'
  | 'LOCATION_PREPARATION'
  | 'BUYER_PREPARATION'
  | 'SELLER_PREPARATION'
  | 'LISTING_PREPARATION'
  | 'PROPERTY_PREPARATION';

export type AgentComparisonReuseState =
  | 'ALREADY_IMPLEMENTED'
  | 'REUSE_NOW_AFTER_SMALL_LOCAL_FOUNDATION'
  | 'REUSE_AFTER_SUBJECT_PROPERTY_BENCHMARK'
  | 'DEFER_UNTIL_GRAIN_CONTRACT_EXISTS';

export type AgentComparisonValue = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AgentComparisonRisk = 'LOW' | 'MEDIUM' | 'HIGH';

export type AgentComparisonSurfaceReview = Readonly<{
  surface: AgentComparisonSurfaceId;
  reuseState: AgentComparisonReuseState;
  laborReplacementValue: AgentComparisonValue;
  implementationCost: 'SMALL' | 'MODERATE' | 'LARGE';
  methodologyRisk: AgentComparisonRisk;
  requiredFoundation: readonly string[];
}>;

export const AGENT_COMPARISON_SURFACE_REUSE_REVIEW: readonly AgentComparisonSurfaceReview[] = Object.freeze([
  { surface: 'LOCATION_PREPARATION', reuseState: 'REUSE_NOW_AFTER_SMALL_LOCAL_FOUNDATION', laborReplacementValue: 'VERY_HIGH', implementationCost: 'SMALL', methodologyRisk: 'LOW', requiredFoundation: Object.freeze(['CITY_SET_ALIGNMENT', 'SURFACE_COPY_GUARD', 'NO_RECOMMENDATION_OR_RANKING_COPY']) },
  { surface: 'BUYER_PREPARATION', reuseState: 'REUSE_NOW_AFTER_SMALL_LOCAL_FOUNDATION', laborReplacementValue: 'VERY_HIGH', implementationCost: 'MODERATE', methodologyRisk: 'MEDIUM', requiredFoundation: Object.freeze(['BUYER_CRITERIA_TO_COHORT_ADAPTER', 'NO_SUITABILITY_OR_OFFER_STRATEGY', 'SESSION_ONLY_INPUT_BOUNDARY']) },
  { surface: 'MARKET_PREPARATION', reuseState: 'REUSE_NOW_AFTER_SMALL_LOCAL_FOUNDATION', laborReplacementValue: 'HIGH', implementationCost: 'SMALL', methodologyRisk: 'LOW', requiredFoundation: Object.freeze(['SHARED_COMPARISON_SURFACE_CONFIG', 'NO_MARKET_UPDATE_NARRATIVE_COUPLING']) },
  { surface: 'MARKET_UPDATE_PREPARATION', reuseState: 'ALREADY_IMPLEMENTED', laborReplacementValue: 'HIGH', implementationCost: 'SMALL', methodologyRisk: 'LOW', requiredFoundation: Object.freeze(['MAINTAIN_EXISTING_WAVE_3_GUARDS']) },
  { surface: 'SELLER_PREPARATION', reuseState: 'REUSE_AFTER_SUBJECT_PROPERTY_BENCHMARK', laborReplacementValue: 'HIGH', implementationCost: 'MODERATE', methodologyRisk: 'HIGH', requiredFoundation: Object.freeze(['SUBJECT_PROPERTY_BENCHMARK_CONTRACT', 'NO_CMA_OR_PRICING_RECOMMENDATION']) },
  { surface: 'LISTING_PREPARATION', reuseState: 'REUSE_AFTER_SUBJECT_PROPERTY_BENCHMARK', laborReplacementValue: 'HIGH', implementationCost: 'MODERATE', methodologyRisk: 'HIGH', requiredFoundation: Object.freeze(['SUBJECT_PROPERTY_BENCHMARK_CONTRACT', 'LISTING_LIFECYCLE_RIGHTS_BOUNDARY']) },
  { surface: 'PROPERTY_PREPARATION', reuseState: 'DEFER_UNTIL_GRAIN_CONTRACT_EXISTS', laborReplacementValue: 'MEDIUM', implementationCost: 'LARGE', methodologyRisk: 'HIGH', requiredFoundation: Object.freeze(['MLS_LISTING_TO_PHYSICAL_PROPERTY_GRAIN_FIREWALL', 'SUBJECT_PROPERTY_BENCHMARK_CONTRACT']) },
]);

export type AgentComparisonSegmentTier = 'QUICK_FILTERS' | 'ADVANCED_PROPERTY_FILTERS' | 'EXPERT_MLS_FILTERS' | 'DEFERRED';
export type AgentComparisonAdmissionState =
  | 'ADMITTED_NOW'
  | 'READY_AFTER_INTERVAL_CONTRACT'
  | 'READY_AFTER_SMALL_LOCAL_FOUNDATION'
  | 'BLOCKED_BY_SOURCE_SEMANTICS'
  | 'BLOCKED_BY_FIELD_ABSENCE'
  | 'BLOCKED_BY_RIGHTS_OR_AUDIENCE_POLICY'
  | 'BLOCKED_BY_GRAIN_CONTRACT';

export type AgentComparisonSegmentReview = Readonly<{
  field: string;
  tier: AgentComparisonSegmentTier;
  admissionState: AgentComparisonAdmissionState;
  filterSafe: boolean;
  aggregationAdmitted: boolean;
  agentValue: AgentComparisonValue;
  reason: string;
}>;

export const AGENT_COMPARISON_SEGMENTATION_REVIEW: readonly AgentComparisonSegmentReview[] = Object.freeze([
  { field: 'city', tier: 'QUICK_FILTERS', admissionState: 'ADMITTED_NOW', filterSafe: true, aggregationAdmitted: false, agentValue: 'VERY_HIGH', reason: 'Existing cohort allowlist supports six current city values.' },
  { field: 'propertyType:Residential', tier: 'QUICK_FILTERS', admissionState: 'ADMITTED_NOW', filterSafe: true, aggregationAdmitted: false, agentValue: 'HIGH', reason: 'Residential is the only admitted property-type value.' },
  { field: 'statusScope:Active', tier: 'QUICK_FILTERS', admissionState: 'ADMITTED_NOW', filterSafe: true, aggregationAdmitted: false, agentValue: 'HIGH', reason: 'Active is the only admitted current status scope.' },
  { field: 'priceMin/priceMax', tier: 'QUICK_FILTERS', admissionState: 'READY_AFTER_INTERVAL_CONTRACT', filterSafe: true, aggregationAdmitted: true, agentValue: 'VERY_HIGH', reason: 'Already filtered and aggregated; adjacent-band semantics need explicit contract.' },
  { field: 'bedsMin/bedsMax/exactBeds', tier: 'ADVANCED_PROPERTY_FILTERS', admissionState: 'READY_AFTER_INTERVAL_CONTRACT', filterSafe: true, aggregationAdmitted: true, agentValue: 'HIGH', reason: 'Minimum beds exists; max/exact need interval grammar.' },
  { field: 'bathsMin/bathsMax/exactBaths', tier: 'ADVANCED_PROPERTY_FILTERS', admissionState: 'READY_AFTER_INTERVAL_CONTRACT', filterSafe: true, aggregationAdmitted: true, agentValue: 'HIGH', reason: 'Minimum baths exists; max/exact need interval grammar.' },
  { field: 'sqftMin/sqftMax', tier: 'ADVANCED_PROPERTY_FILTERS', admissionState: 'READY_AFTER_INTERVAL_CONTRACT', filterSafe: true, aggregationAdmitted: true, agentValue: 'HIGH', reason: 'Already filtered and aggregated; finished-area semantics remain limited to listed square feet.' },
  { field: 'yearBuiltMin/yearBuiltMax', tier: 'ADVANCED_PROPERTY_FILTERS', admissionState: 'READY_AFTER_INTERVAL_CONTRACT', filterSafe: true, aggregationAdmitted: true, agentValue: 'MEDIUM', reason: 'Already filtered and aggregated; ranges need adjacent-band policy.' },
  { field: 'zip', tier: 'ADVANCED_PROPERTY_FILTERS', admissionState: 'READY_AFTER_SMALL_LOCAL_FOUNDATION', filterSafe: true, aggregationAdmitted: false, agentValue: 'HIGH', reason: 'Schema field exists but canonical geography/version coverage needs local admission.' },
  { field: 'neighborhood', tier: 'EXPERT_MLS_FILTERS', admissionState: 'BLOCKED_BY_SOURCE_SEMANTICS', filterSafe: false, aggregationAdmitted: false, agentValue: 'HIGH', reason: 'Optional string exists but source meaning and geographic object mapping are unresolved.' },
  { field: 'subdivision', tier: 'EXPERT_MLS_FILTERS', admissionState: 'BLOCKED_BY_SOURCE_SEMANTICS', filterSafe: false, aggregationAdmitted: false, agentValue: 'HIGH', reason: 'Optional string exists but source semantics and duplicate naming policy are unresolved.' },
  { field: 'schoolDistrict', tier: 'EXPERT_MLS_FILTERS', admissionState: 'BLOCKED_BY_RIGHTS_OR_AUDIENCE_POLICY', filterSafe: false, aggregationAdmitted: false, agentValue: 'MEDIUM', reason: 'Field exists but school/fair-housing and source-rights posture require separate review.' },
  { field: 'lotSize', tier: 'EXPERT_MLS_FILTERS', admissionState: 'BLOCKED_BY_SOURCE_SEMANTICS', filterSafe: false, aggregationAdmitted: false, agentValue: 'MEDIUM', reason: 'Schema field exists but unit/coverage/index/admission are not certified.' },
  { field: 'lat/lng/radius/polygon', tier: 'EXPERT_MLS_FILTERS', admissionState: 'BLOCKED_BY_SOURCE_SEMANTICS', filterSafe: false, aggregationAdmitted: false, agentValue: 'HIGH', reason: 'Coordinates exist but map/radius/polygon comparison needs geography governance.' },
  { field: 'nonResidentialPropertyType', tier: 'EXPERT_MLS_FILTERS', admissionState: 'BLOCKED_BY_SOURCE_SEMANTICS', filterSafe: false, aggregationAdmitted: false, agentValue: 'MEDIUM', reason: 'Raw propertyType field exists; value taxonomy outside Residential is not admitted.' },
  { field: 'statusBeyondActive', tier: 'EXPERT_MLS_FILTERS', admissionState: 'BLOCKED_BY_SOURCE_SEMANTICS', filterSafe: false, aggregationAdmitted: false, agentValue: 'HIGH', reason: 'Current status string exists; pending/sold/closed semantics require event-basis methodology.' },
  { field: 'listingAgent/listingOffice', tier: 'EXPERT_MLS_FILTERS', admissionState: 'BLOCKED_BY_RIGHTS_OR_AUDIENCE_POLICY', filterSafe: false, aggregationAdmitted: false, agentValue: 'MEDIUM', reason: 'Professional/entity reporting is rights-sensitive and denominator-dependent.' },
  { field: 'garage/hoa/basement/style/condition/newConstruction/waterfront/zoning/county', tier: 'DEFERRED', admissionState: 'BLOCKED_BY_FIELD_ABSENCE', filterSafe: false, aggregationAdmitted: false, agentValue: 'HIGH', reason: 'Expected Agent criteria are not present as normalized Property schema fields.' },
  { field: 'subjectPropertyIdentity', tier: 'DEFERRED', admissionState: 'BLOCKED_BY_GRAIN_CONTRACT', filterSafe: false, aggregationAdmitted: false, agentValue: 'VERY_HIGH', reason: 'Subject-property benchmark must not silently convert MLS listing grain to physical-property grain.' },
]);

export type AgentComparisonIntervalMode = 'CURRENT_INCLUSIVE' | 'PROPOSED_HALF_OPEN_ADJACENT_SAFE';
export type AgentComparisonRange = Readonly<{ min: number | null; max: number | null }>;
export type AgentComparisonRangeRelationship = 'DISJOINT' | 'OVERLAPPING' | 'SUBSET' | 'SUPERSET' | 'SAME_POPULATION';

export function classifyAdmissionReviewRangeRelationship(left: AgentComparisonRange, right: AgentComparisonRange, mode: AgentComparisonIntervalMode): AgentComparisonRangeRelationship {
  if (left.min === right.min && left.max === right.max) return 'SAME_POPULATION';
  const leftMin = left.min ?? Number.NEGATIVE_INFINITY;
  const leftMax = left.max ?? Number.POSITIVE_INFINITY;
  const rightMin = right.min ?? Number.NEGATIVE_INFINITY;
  const rightMax = right.max ?? Number.POSITIVE_INFINITY;
  const disjoint = mode === 'PROPOSED_HALF_OPEN_ADJACENT_SAFE' ? leftMax <= rightMin || rightMax <= leftMin : leftMax < rightMin || rightMax < leftMin;
  if (disjoint) return 'DISJOINT';
  if (leftMin >= rightMin && leftMax <= rightMax) return 'SUBSET';
  if (leftMin <= rightMin && leftMax >= rightMax) return 'SUPERSET';
  return 'OVERLAPPING';
}

export function evaluateSegmentFieldAdmission(field: string): AgentComparisonSegmentReview {
  const match = AGENT_COMPARISON_SEGMENTATION_REVIEW.find((item) => item.field === field);
  return match ?? Object.freeze({ field, tier: 'DEFERRED', admissionState: 'BLOCKED_BY_FIELD_ABSENCE', filterSafe: false, aggregationAdmitted: false, agentValue: 'LOW', reason: 'No admitted review record exists for this field.' });
}

export const AGENT_COMPARISON_COHORT_N_REVIEW = Object.freeze({
  runtimeEngine: 'READY_FOR_2_TO_6_COHORTS',
  currentApiUi: 'A_B_ONLY',
  nextAdmissionState: 'READY_AFTER_SMALL_LOCAL_FOUNDATION',
  requiredFoundation: Object.freeze(['REQUEST_GRAMMAR_FOR_N_COHORTS', 'COHORT_COLOR_LABEL_IDENTITY', 'PARTIAL_FAILURE_ARTIFACT', 'NO_RANKING_WHEN_REQUIRED_COHORTS_FAIL']),
} as const);

export function evaluateMultiCohortFailurePolicy(cohortStates: readonly ('READY' | 'NO_DATA' | 'RIGHTS_BLOCKED' | 'ERROR')[]) {
  const failures = cohortStates.filter((state) => state !== 'READY');
  if (failures.length === 0) return 'ALL_COHORTS_COMPARABLE' as const;
  if (failures.some((state) => state === 'RIGHTS_BLOCKED')) return 'FAIL_AFFECTED_COMPARISON_RIGHTS_BLOCKED' as const;
  return 'RETURN_VALID_COHORTS_WITH_EXPLICIT_FAILED_COHORTS_NO_RANK' as const;
}

export const AGENT_COMPARISON_NEXT_IMPLEMENTATION_PACKAGE = Object.freeze({
  gate: AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_NEXT_GATE,
  title: 'Agent Decision Comparison Reuse and Interval Semantics - Bounded Implementation Wave 4',
  includedScope: Object.freeze([
    'Extract shared current-snapshot comparison surface configuration from the Market Update implementation.',
    'Mount bounded comparison reuse in Location Preparation, Buyer Preparation, and Market Preparation.',
    'Add explicit interval semantics for numeric comparison presets while preserving current Quick Filter behavior.',
    'Keep Agent-only, read-only, current-snapshot, MLS-listing-grain boundaries.',
  ]),
  excludedScope: Object.freeze([
    'Cohort-N UI/API runtime.',
    'Seller, Listing, or Property subject-property benchmarking.',
    'Historical comparisons, sold metrics, DOM/CDOM, recommendations, client/public output, export/PDF, and provider writes.',
  ]),
} as const);

export const AGENT_COMPARISON_REVIEW_PROTECTED_BOUNDARIES = Object.freeze({
  runtimeImplementation: false,
  databaseMutation: false,
  providerMutation: false,
  mlsMutation: false,
  supabaseMutation: false,
  typesenseMutation: false,
  crmMutation: false,
  emailMutation: false,
  deployment: false,
  secrets: false,
  customerData: false,
  publicOrClientOutput: false,
} as const);
