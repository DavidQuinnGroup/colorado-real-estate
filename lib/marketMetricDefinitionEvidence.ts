/**
 * Governs metric meaning separately from a reported market value. This module
 * is deliberately static: it does not retrieve, persist, or admit source data.
 */

export const MARKET_METRIC_DEFINITION_EVIDENCE_STATUS = 'PROJECT_ATLAS_MARKET_METRIC_DEFINITION_AND_EVIDENCE_CONTRACT_MVV' as const;
export const MARKET_METRIC_DEFINITION_EVIDENCE_VERSION = 'MARKET_METRIC_DEFINITION_EVIDENCE_V1' as const;

export const MARKET_METRIC_SEMANTIC_STATUSES = [
  'CERTIFIED',
  'PARTIALLY_DEFINED',
  'SEMANTICS_UNRESOLVED',
  'NOT_ADMITTED',
  'DEPRECATED',
] as const;
export type MarketMetricSemanticStatus = (typeof MARKET_METRIC_SEMANTIC_STATUSES)[number];

export const MARKET_METRIC_ALLOWED_USES = [
  'DISPLAY_RAW_OBSERVATION',
  'AGENT_PREPARATION',
  'AUDIENCE_UPDATE_PREPARATION',
  'HISTORICAL_COMPARISON',
  'DERIVED_CALCULATION',
  'COMPARATIVE_REPORTING',
  'PUBLIC_DISPLAY',
] as const;
export type MarketMetricAllowedUse = (typeof MARKET_METRIC_ALLOWED_USES)[number];

export const MARKET_METRIC_PROHIBITED_INTERPRETATIONS = [
  'NO_TREND_INFERENCE',
  'NO_FORECAST',
  'NO_BUYER_LEVERAGE_INFERENCE',
  'NO_SELLER_LEVERAGE_INFERENCE',
  'NO_AFFORDABILITY_INFERENCE',
  'NO_PROPERTY_VALUATION',
  'NO_PRICING_RECOMMENDATION',
  'NO_NEGOTIATION_RECOMMENDATION',
] as const;
export type MarketMetricProhibitedInterpretation = (typeof MARKET_METRIC_PROHIBITED_INTERPRETATIONS)[number];

export const MARKET_DOM_BASES = [
  'LISTING_DOM',
  'AVERAGE_DOM',
  'MEDIAN_DOM',
  'CDOM',
  'AVERAGE_CDOM',
  'MEDIAN_CDOM',
  'OTHER_DEFINED_DOM_MEASURE',
  'UNRESOLVED_DOM_MEASURE',
  'NOT_APPLICABLE',
] as const;
export type MarketDomBasis = (typeof MARKET_DOM_BASES)[number];

export const MARKET_PRICE_BASES = [
  'CURRENT_LIST_PRICE',
  'ORIGINAL_LIST_PRICE',
  'MEDIAN_LIST_PRICE',
  'AVERAGE_LIST_PRICE',
  'CLOSE_PRICE',
  'MEDIAN_CLOSE_PRICE',
  'AVERAGE_CLOSE_PRICE',
  'PRICE_PER_SQUARE_FOOT',
  'OTHER_DEFINED_PRICE_MEASURE',
  'UNRESOLVED_PRICE_MEASURE',
  'NOT_APPLICABLE',
] as const;
export type MarketPriceBasis = (typeof MARKET_PRICE_BASES)[number];

export const MARKET_ACTIVITY_CONCEPTS = [
  'ACTIVE_INVENTORY',
  'NEW_LISTINGS',
  'COMING_SOON',
  'PENDING',
  'CLOSED_SALES',
  'WITHDRAWN',
  'EXPIRED',
  'CANCELLED',
  'BACK_ON_MARKET',
  'PRICE_REDUCTIONS',
  'OTHER_DEFINED_ACTIVITY_MEASURE',
  'NOT_APPLICABLE',
] as const;
export type MarketActivityConcept = (typeof MARKET_ACTIVITY_CONCEPTS)[number];

export type MarketMetricFamily = 'INVENTORY' | 'DAYS_ON_MARKET' | 'PRICE' | 'ACTIVITY' | 'SUPPLY' | 'OTHER';
export type MarketMetricSourceFamily = 'REPOSITORY_CITY_MARKET_CONTEXT' | 'MLS' | 'IRES' | 'COUNTY_PUBLIC_RECORD' | 'OTHER';
export type MarketMetricFreshness = 'CURRENT' | 'STALE' | 'UNKNOWN';
export type MarketMetricVerificationState = 'CERTIFIED' | 'PROFESSIONAL_VERIFICATION_REQUIRED' | 'UNVERIFIED';
export type MarketMetricHistoricalComparisonStatus = 'CERTIFIED_COMPARABLE' | 'METADATA_REQUIRED' | 'HISTORICAL_EVIDENCE_REQUIRED' | 'NOT_ADMITTED';
export type MarketMetricComparabilityState = 'COMPARABLE' | 'COMPARABLE_WITH_LIMITATIONS' | 'NOT_COMPARABLE' | 'INSUFFICIENT_METADATA';

export type MarketMetricDefinition = Readonly<{
  metricDefinitionId: string;
  canonicalName: string;
  displayLabel: string;
  metricFamily: MarketMetricFamily;
  sourceFamily: MarketMetricSourceFamily;
  sourceConcept: string;
  unit: string;
  aggregationMethod: string | null;
  populationDefinition: string | null;
  listingStatusScope: string | null;
  propertyTypeScope: string | null;
  geographicScope: string | null;
  timeBasis: 'POINT_IN_TIME' | 'PERIOD_BASED' | 'UNRESOLVED';
  periodDefinition: string | null;
  priceBasis: MarketPriceBasis;
  domBasis: MarketDomBasis;
  activityConcept: MarketActivityConcept;
  calculationMethodVersion: string | null;
  sourceMethodologyReference: string | null;
  semanticStatus: MarketMetricSemanticStatus;
  admissionStatus: 'ADMITTED_FOR_LIMITED_USE' | 'NOT_ADMITTED';
  historicalComparisonStatus: MarketMetricHistoricalComparisonStatus;
  freshnessContract: string;
  limitations: readonly string[];
  prohibitedInterpretations: readonly MarketMetricProhibitedInterpretation[];
  allowedUses: readonly MarketMetricAllowedUse[];
}>;

export type MarketMetricObservation = Readonly<{
  observationId: string;
  metricDefinitionId: string;
  value: number | string;
  geographyId: string;
  geographyType: 'CITY' | 'ZIP' | 'NEIGHBORHOOD' | 'COUNTY' | 'OTHER';
  propertyPopulation: string | null;
  statusPopulation: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  asOfDate: string | null;
  sourceDate: string | null;
  atlasObservedDate: string;
  freshness: MarketMetricFreshness;
  sourceEvidenceId: string | null;
  sourceMethodologyReference: string | null;
  calculationMethodVersion: string | null;
  verificationState: MarketMetricVerificationState;
  limitations: readonly string[];
}>;

export type MarketMetricUseEvaluation = Readonly<{
  allowed: boolean;
  reason: 'ALLOWED' | 'USE_NOT_ADMITTED' | 'METRIC_NOT_ADMITTED' | 'OBSERVATION_DEFINITION_MISMATCH' | 'OBSERVATION_NOT_VERIFIED';
}>;

export type MarketMetricComparison = Readonly<{
  state: MarketMetricComparabilityState;
  reasons: readonly string[];
}>;

const defaultProhibitions = Object.freeze([
  'NO_TREND_INFERENCE',
  'NO_FORECAST',
  'NO_BUYER_LEVERAGE_INFERENCE',
  'NO_SELLER_LEVERAGE_INFERENCE',
  'NO_AFFORDABILITY_INFERENCE',
  'NO_PROPERTY_VALUATION',
  'NO_PRICING_RECOMMENDATION',
  'NO_NEGOTIATION_RECOMMENDATION',
] as const);

function unresolvedDefinition(input: Readonly<{
  metricDefinitionId: string;
  canonicalName: string;
  displayLabel: string;
  metricFamily: MarketMetricFamily;
  sourceConcept: string;
  unit: string;
  priceBasis: MarketPriceBasis;
  domBasis: MarketDomBasis;
  activityConcept: MarketActivityConcept;
  methodologyRequirement: string;
}>): MarketMetricDefinition {
  return Object.freeze({
    ...input,
    sourceFamily: 'REPOSITORY_CITY_MARKET_CONTEXT',
    aggregationMethod: null,
    populationDefinition: null,
    listingStatusScope: null,
    propertyTypeScope: null,
    geographicScope: null,
    timeBasis: 'UNRESOLVED',
    periodDefinition: null,
    calculationMethodVersion: null,
    sourceMethodologyReference: null,
    semanticStatus: 'SEMANTICS_UNRESOLVED',
    admissionStatus: 'ADMITTED_FOR_LIMITED_USE',
    historicalComparisonStatus: 'METADATA_REQUIRED',
    freshnessContract: 'The dated repository observation must remain visible and requires professional verification before reliance.',
    limitations: Object.freeze([
      'The repository contains a dated value but no admitted authoritative methodology defining aggregation, population, status scope, geography, period, or exclusions.',
      input.methodologyRequirement,
      'Historical existence does not make an observation certified comparable.',
    ]),
    prohibitedInterpretations: defaultProhibitions,
    allowedUses: Object.freeze(['DISPLAY_RAW_OBSERVATION', 'AGENT_PREPARATION', 'AUDIENCE_UPDATE_PREPARATION'] as const),
  });
}

export const MARKET_METRIC_DEFINITIONS = Object.freeze({
  INVENTORY_SIGNAL: unresolvedDefinition({
    metricDefinitionId: 'atlas.city-market.inventory-signal.v1',
    canonicalName: 'Inventory signal',
    displayLabel: 'Inventory signal (semantics unresolved)',
    metricFamily: 'INVENTORY',
    sourceConcept: 'Repository city inventory string',
    unit: 'Reported listing count',
    priceBasis: 'NOT_APPLICABLE',
    domBasis: 'NOT_APPLICABLE',
    activityConcept: 'ACTIVE_INVENTORY',
    methodologyRequirement: 'Authoritative source documentation defining included listing statuses, property population, geography, snapshot timestamp, and exclusions.',
  }),
  DAYS_ON_MARKET_SIGNAL: unresolvedDefinition({
    metricDefinitionId: 'atlas.city-market.days-on-market-signal.v1',
    canonicalName: 'Days-on-market signal',
    displayLabel: 'Days-on-market signal (semantics unresolved)',
    metricFamily: 'DAYS_ON_MARKET',
    sourceConcept: 'Repository city days-on-market string',
    unit: 'Reported days',
    priceBasis: 'NOT_APPLICABLE',
    domBasis: 'UNRESOLVED_DOM_MEASURE',
    activityConcept: 'NOT_APPLICABLE',
    methodologyRequirement: 'Authoritative source documentation defining whether this is average DOM, median DOM, CDOM, ADOM, or another calculation, including population, period, geography, relisting/reset behavior, off-market interval handling, and exclusions.',
  }),
  PRICE_SIGNAL: unresolvedDefinition({
    metricDefinitionId: 'atlas.city-market.price-signal.v1',
    canonicalName: 'Price signal',
    displayLabel: 'Price signal (semantics unresolved)',
    metricFamily: 'PRICE',
    sourceConcept: 'Repository city median-price string',
    unit: 'USD',
    priceBasis: 'UNRESOLVED_PRICE_MEASURE',
    domBasis: 'NOT_APPLICABLE',
    activityConcept: 'NOT_APPLICABLE',
    methodologyRequirement: 'Authoritative source documentation defining whether this is median list, original-list, sold, closed-sale, asking, or another price measure, including population, period, geography, and exclusions.',
  }),
});

export type CurrentMarketMetricDefinitionId = keyof typeof MARKET_METRIC_DEFINITIONS;

export function marketMetricDefinition(definitionId: CurrentMarketMetricDefinitionId): MarketMetricDefinition {
  return MARKET_METRIC_DEFINITIONS[definitionId];
}

export function displayMarketMetricLabel(definition: MarketMetricDefinition): string {
  return definition.semanticStatus === 'CERTIFIED' ? definition.displayLabel : `${definition.displayLabel}`;
}

export function evaluateMarketMetricUse(definition: MarketMetricDefinition, observation: MarketMetricObservation, use: MarketMetricAllowedUse): MarketMetricUseEvaluation {
  if (definition.admissionStatus !== 'ADMITTED_FOR_LIMITED_USE') return Object.freeze({ allowed: false, reason: 'METRIC_NOT_ADMITTED' });
  if (definition.metricDefinitionId !== observation.metricDefinitionId) return Object.freeze({ allowed: false, reason: 'OBSERVATION_DEFINITION_MISMATCH' });
  if (!definition.allowedUses.includes(use)) return Object.freeze({ allowed: false, reason: 'USE_NOT_ADMITTED' });
  if (observation.verificationState === 'UNVERIFIED') return Object.freeze({ allowed: false, reason: 'OBSERVATION_NOT_VERIFIED' });
  return Object.freeze({ allowed: true, reason: 'ALLOWED' });
}

function requiredComparisonMetadata(observation: MarketMetricObservation) {
  return [
    !observation.sourceEvidenceId && 'SOURCE_EVIDENCE_ID_MISSING',
    !observation.sourceMethodologyReference && 'SOURCE_METHODOLOGY_REFERENCE_MISSING',
    !observation.calculationMethodVersion && 'CALCULATION_METHOD_VERSION_MISSING',
    !observation.propertyPopulation && 'PROPERTY_POPULATION_MISSING',
    !observation.statusPopulation && 'STATUS_POPULATION_MISSING',
    !(observation.periodStart || observation.asOfDate) && 'PERIOD_METADATA_MISSING',
  ].filter(Boolean) as string[];
}

export function compareMarketMetricObservations(
  leftDefinition: MarketMetricDefinition,
  left: MarketMetricObservation,
  rightDefinition: MarketMetricDefinition,
  right: MarketMetricObservation,
): MarketMetricComparison {
  const missing = [...requiredComparisonMetadata(left), ...requiredComparisonMetadata(right)];
  if (missing.length) return Object.freeze({ state: 'INSUFFICIENT_METADATA', reasons: Object.freeze([...new Set(missing)].sort()) });

  const incompatible = [
    left.metricDefinitionId !== leftDefinition.metricDefinitionId && 'LEFT_OBSERVATION_DEFINITION_MISMATCH',
    right.metricDefinitionId !== rightDefinition.metricDefinitionId && 'RIGHT_OBSERVATION_DEFINITION_MISMATCH',
    leftDefinition.metricDefinitionId !== rightDefinition.metricDefinitionId && 'METRIC_DEFINITION_MISMATCH',
    left.sourceMethodologyReference !== right.sourceMethodologyReference && 'SOURCE_METHODOLOGY_MISMATCH',
    left.calculationMethodVersion !== right.calculationMethodVersion && 'CALCULATION_METHOD_VERSION_MISMATCH',
    leftDefinition.aggregationMethod !== rightDefinition.aggregationMethod && 'AGGREGATION_MISMATCH',
    leftDefinition.priceBasis !== rightDefinition.priceBasis && 'PRICE_BASIS_MISMATCH',
    leftDefinition.domBasis !== rightDefinition.domBasis && 'DOM_BASIS_MISMATCH',
    left.propertyPopulation !== right.propertyPopulation && 'PROPERTY_POPULATION_MISMATCH',
    left.statusPopulation !== right.statusPopulation && 'STATUS_POPULATION_MISMATCH',
    left.geographyType !== right.geographyType && 'GEOGRAPHY_TYPE_MISMATCH',
    left.geographyId !== right.geographyId && 'GEOGRAPHY_MISMATCH',
  ].filter(Boolean) as string[];
  if (incompatible.length) return Object.freeze({ state: 'NOT_COMPARABLE', reasons: Object.freeze(incompatible.sort()) });

  const limitations = [
    left.freshness !== 'CURRENT' || right.freshness !== 'CURRENT' ? 'SOURCE_FRESHNESS_NOT_CURRENT' : null,
    left.verificationState !== 'CERTIFIED' || right.verificationState !== 'CERTIFIED' ? 'OBSERVATION_CERTIFICATION_LIMITED' : null,
    leftDefinition.historicalComparisonStatus !== 'CERTIFIED_COMPARABLE' ? 'DEFINITION_HISTORICAL_COMPARISON_NOT_CERTIFIED' : null,
  ].filter(Boolean) as string[];
  return Object.freeze({ state: limitations.length ? 'COMPARABLE_WITH_LIMITATIONS' : 'COMPARABLE', reasons: Object.freeze(limitations.sort()) });
}

export const MARKET_METRIC_CONTRACT_PROTECTED_BOUNDARIES = Object.freeze({
  providerActivity: false,
  databaseAccess: false,
  databaseWrite: false,
  schemaMutation: false,
  historicalIngestion: false,
  runtimeActivation: false,
  publicDisplayActivation: false,
  deployment: false,
});
