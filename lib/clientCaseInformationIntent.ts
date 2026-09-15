export type ClientCaseInformationIntent =
  | 'objectives'
  | 'target-cities'
  | 'purchase-price-range'
  | 'min-bedrooms'
  | 'property-occupancy'
  | null;

export const CLIENT_CASE_INFORMATION_REQUIREMENT_INTENTS: Readonly<Record<string, Exclude<ClientCaseInformationIntent, null>>> = {
  BUYER_DECISION_OBJECTIVE: 'objectives',
  FINANCIAL_STRATEGY_OBJECTIVE: 'objectives',
  BUYER_DECISION_TARGET_CITIES: 'target-cities',
  MARKET_INTELLIGENCE_TARGET_CITIES: 'target-cities',
  BUYER_DECISION_PRICE_RANGE: 'purchase-price-range',
  BUYER_DECISION_MIN_BEDROOMS: 'min-bedrooms',
};

export function informationIntentFromRequirement(value: string | undefined): ClientCaseInformationIntent {
  return value ? CLIENT_CASE_INFORMATION_REQUIREMENT_INTENTS[value] ?? null : null;
}

export function clientCaseInformationHref(clientCaseId: string, requirementId: string) {
  const intent = informationIntentFromRequirement(requirementId);
  return intent ? `/agent/clients/${encodeURIComponent(clientCaseId)}/information?requirement=${encodeURIComponent(requirementId)}` : null;
}
