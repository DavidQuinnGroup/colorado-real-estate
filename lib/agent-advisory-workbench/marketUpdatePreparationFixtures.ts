import type { MarketUpdatePreparationInput } from './marketUpdatePreparation';

export const MARKET_UPDATE_PREPARATION_FIXTURES = Object.freeze({
  buyerInventory: Object.freeze({ marketId: 'boulder-co-housing-market', audience: 'BUYER', purpose: 'BUYER_MARKET_UPDATE', topics: ['INVENTORY'], asOf: '2026-08-20' } satisfies MarketUpdatePreparationInput),
  sellerPrice: Object.freeze({ marketId: 'boulder-co-housing-market', audience: 'SELLER', purpose: 'SELLER_MARKET_UPDATE', topics: ['MEDIAN_PRICE'], asOf: '2026-08-20' } satisfies MarketUpdatePreparationInput),
  homeownerDaysOnMarket: Object.freeze({ marketId: 'lafayette-co-housing-market', audience: 'HOMEOWNER', purpose: 'HOMEOWNER_UPDATE', topics: ['DAYS_ON_MARKET'], asOf: '2026-08-20' } satisfies MarketUpdatePreparationInput),
  prospectAllTopics: Object.freeze({ marketId: 'lafayette-co-housing-market', audience: 'PROSPECT', purpose: 'MARKET_CHECK_IN', topics: ['INVENTORY', 'DAYS_ON_MARKET', 'MEDIAN_PRICE'], asOf: '2026-08-20' } satisfies MarketUpdatePreparationInput),
  generalInventory: Object.freeze({ marketId: 'lafayette-co-housing-market', audience: 'GENERAL', purpose: 'GENERAL_MARKET_CONVERSATION', topics: ['INVENTORY'], asOf: '2026-08-20' } satisfies MarketUpdatePreparationInput),
  missingTopic: Object.freeze({ marketId: 'boulder-co-housing-market', audience: 'GENERAL', purpose: 'MARKET_CHECK_IN', topics: [], asOf: '2026-08-20' } satisfies MarketUpdatePreparationInput),
  stale: Object.freeze({ marketId: 'boulder-co-housing-market', audience: 'GENERAL', purpose: 'MARKET_CHECK_IN', topics: ['INVENTORY'], asOf: '2026-08-30' } satisfies MarketUpdatePreparationInput),
});
