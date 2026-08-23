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

const unresolved = (id: MarketMetricSemanticId, sourceConcept: string, displayLabel: string, unit: string, documentation: string): MarketMetricSemantics => Object.freeze({
  id,
  displayLabel,
  sourceConcept,
  unit,
  aggregation: 'Not established by admitted repository evidence.',
  geography: 'City market identifier is present; source geography definition is not admitted.',
  propertyPopulation: 'Not established by admitted repository evidence.',
  period: 'Recorded repository reference date only; metric period is not established.',
  timing: 'UNRESOLVED',
  marketSide: 'UNRESOLVED',
  exclusions: 'Not established by admitted repository evidence.',
  verificationStatus: 'PROFESSIONAL_VERIFICATION_REQUIRED',
  semanticState: 'METRIC_SEMANTICS_UNRESOLVED',
  semanticConfidence: 'UNRESOLVED',
  limitations: 'The repository contains a dated city value but not the authoritative source definition required to state the aggregation, population, status scope, or comparison meaning precisely.',
  authoritativeDocumentationRequired: documentation,
});

export const MARKET_METRIC_SEMANTICS: Readonly<Record<MarketMetricSemanticId, MarketMetricSemantics>> = Object.freeze({
  INVENTORY: unresolved(
    'INVENTORY',
    'Repository city inventory string',
    'Inventory signal (semantics unresolved)',
    'Reported listing count',
    'Authoritative source documentation defining included listing statuses, property population, geography, snapshot timestamp, and exclusions.',
  ),
  DAYS_ON_MARKET: unresolved(
    'DAYS_ON_MARKET',
    'Repository city days-on-market string',
    'Days-on-market signal (semantics unresolved)',
    'Reported days',
    'Authoritative source documentation defining whether this is average DOM, median DOM, CDOM, ADOM, or another calculation, including population, period, geography, and exclusions.',
  ),
  MEDIAN_PRICE: unresolved(
    'MEDIAN_PRICE',
    'Repository city median-price string',
    'Price signal (semantics unresolved)',
    'USD',
    'Authoritative source documentation defining whether this is median list, original-list, sold, closed-sale, asking, or another price measure, including population, period, geography, and exclusions.',
  ),
});

export function marketMetricSemantics(metric: MarketMetricSemanticId) {
  return MARKET_METRIC_SEMANTICS[metric];
}
