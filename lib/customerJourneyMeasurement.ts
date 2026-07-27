export type CustomerJourneyStage = 'search' | 'property' | 'market' | 'seller' | 'inquiry';

export type CustomerJourneyAction =
  | 'start-search'
  | 'view-property'
  | 'view-market'
  | 'request-seller-review'
  | 'ask-property-question'
  | 'continue-journey';

type MeasurementAttributesInput = {
  surface: string;
  stage: CustomerJourneyStage;
  action: CustomerJourneyAction;
  destination: CustomerJourneyStage;
};

export const customerJourneyStages: CustomerJourneyStage[] = ['search', 'property', 'market', 'seller', 'inquiry'];

export const customerJourneyActions: CustomerJourneyAction[] = [
  'start-search',
  'view-property',
  'view-market',
  'request-seller-review',
  'ask-property-question',
  'continue-journey',
];

export function getJourneyMeasurementAttributes({
  surface,
  stage,
  action,
  destination,
}: MeasurementAttributesInput) {
  return {
    'data-cep-measurement-ready': 'true',
    'data-cep-measurement-active': 'false',
    'data-cep-measurement-surface': surface,
    'data-cep-journey-stage': stage,
    'data-cep-journey-action': action,
    'data-cep-journey-destination': destination,
  };
}
