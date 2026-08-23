import {
  displayMarketMetricLabel,
  marketMetricDefinition,
  type CurrentMarketMetricDefinitionId,
} from '../marketMetricDefinitionEvidence';

export const MARKET_METRIC_SEMANTICS_STATUS = 'PROJECT_ATLAS_MARKET_METRIC_SEMANTICS_GOVERNANCE_MVV' as const;

export const MARKET_METRIC_SEMANTIC_STATES = [
  'SEMANTICS_ESTABLISHED',
  'METRIC_SEMANTICS_UNRESOLVED',
] as const;

export type MarketMetricSemanticState = (typeof MARKET_METRIC_SEMANTIC_STATES)[number];
export type MarketMetricSemanticId = 'INVENTORY' | 'DAYS_ON_MARKET' | 'MEDIAN_PRICE';

export type MarketMetricSemantics = Readonly<{
  id: MarketMetricSemanticId;
  displayLabel: string;
  sourceConcept: string;
  unit: string;
  aggregation: string;
  geography: string;
  propertyPopulation: string;
  period: string;
  timing: 'POINT_IN_TIME' | 'PERIOD_BASED' | 'UNRESOLVED';
  marketSide: 'LIST_SIDE' | 'PENDING_SIDE' | 'CLOSED_SALE_SIDE' | 'UNRESOLVED';
  exclusions: string;
  verificationStatus: 'PROFESSIONAL_VERIFICATION_REQUIRED';
  semanticState: MarketMetricSemanticState;
  semanticConfidence: 'UNRESOLVED';
  limitations: string;
  authoritativeDocumentationRequired: string;
}>;

const definitionIdByMetric: Readonly<Record<MarketMetricSemanticId, CurrentMarketMetricDefinitionId>> = Object.freeze({
  INVENTORY: 'INVENTORY_SIGNAL',
  DAYS_ON_MARKET: 'DAYS_ON_MARKET_SIGNAL',
  MEDIAN_PRICE: 'PRICE_SIGNAL',
});

function unresolved(id: MarketMetricSemanticId): MarketMetricSemantics {
  const definition = marketMetricDefinition(definitionIdByMetric[id]);
  return Object.freeze({
    id,
    displayLabel: displayMarketMetricLabel(definition),
    sourceConcept: definition.sourceConcept,
    unit: definition.unit,
    aggregation: definition.aggregationMethod ?? 'Not established by admitted repository evidence.',
    geography: 'City market identifier is present; source geography definition is not admitted.',
    propertyPopulation: definition.populationDefinition ?? 'Not established by admitted repository evidence.',
    period: definition.periodDefinition ?? 'Recorded repository reference date only; metric period is not established.',
    timing: definition.timeBasis,
    marketSide: 'UNRESOLVED',
    exclusions: 'Not established by admitted repository evidence.',
    verificationStatus: 'PROFESSIONAL_VERIFICATION_REQUIRED',
    semanticState: 'METRIC_SEMANTICS_UNRESOLVED',
    semanticConfidence: 'UNRESOLVED',
    limitations: definition.limitations[0] ?? 'Authoritative methodology remains required.',
    authoritativeDocumentationRequired: definition.limitations[1] ?? 'Authoritative methodology remains required.',
  });
}

export const MARKET_METRIC_SEMANTICS: Readonly<Record<MarketMetricSemanticId, MarketMetricSemantics>> = Object.freeze({
  INVENTORY: unresolved('INVENTORY'),
  DAYS_ON_MARKET: unresolved('DAYS_ON_MARKET'),
  MEDIAN_PRICE: unresolved('MEDIAN_PRICE'),
});

export function marketMetricSemantics(metric: MarketMetricSemanticId) {
  return MARKET_METRIC_SEMANTICS[metric];
}
