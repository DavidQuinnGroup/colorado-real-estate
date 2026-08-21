import type { MarketObservationQualityInput } from './internalMarketComputationArchitecture';

export const MARKET_OBSERVATION_QUALITY_FIXTURES: Readonly<Record<string, MarketObservationQualityInput>> = Object.freeze({
  certifiable: Object.freeze({ sourceFresh: true, requiredFieldsComplete: true, statusNormalized: true, geographyResolved: true, sampleSufficient: true, duplicatesResolved: true, retrievalComplete: true, computationSucceeded: true, metricVersionKnown: true }),
  degraded: Object.freeze({ sourceFresh: true, requiredFieldsComplete: false, statusNormalized: false, geographyResolved: false, sampleSufficient: false, duplicatesResolved: false, retrievalComplete: true, computationSucceeded: true, metricVersionKnown: true }),
  stale: Object.freeze({ sourceFresh: false, requiredFieldsComplete: true, statusNormalized: true, geographyResolved: true, sampleSufficient: true, duplicatesResolved: true, retrievalComplete: true, computationSucceeded: true, metricVersionKnown: true }),
  incompleteRetrieval: Object.freeze({ sourceFresh: true, requiredFieldsComplete: true, statusNormalized: true, geographyResolved: true, sampleSufficient: true, duplicatesResolved: true, retrievalComplete: false, computationSucceeded: true, metricVersionKnown: true }),
  unknownVersion: Object.freeze({ sourceFresh: true, requiredFieldsComplete: true, statusNormalized: true, geographyResolved: true, sampleSufficient: true, duplicatesResolved: true, retrievalComplete: true, computationSucceeded: true, metricVersionKnown: false }),
});
