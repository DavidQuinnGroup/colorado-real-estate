import type { NeighborhoodProduct3EvidenceState, NeighborhoodProduct3InventoryState } from './neighborhoodProduct3';
import { getReieSourceRegistry, type ReieSourceRegistryRecord } from './sourceRegistry';

export const BUYER_PLACE_INTELLIGENCE_ADVANCEMENT_STATUS = 'BUYER_PLACE_INTELLIGENCE_ADVANCEMENT_IMPLEMENTED';
export const BUYER_INTELLIGENCE_ADVANCEMENT_STATUS = 'BUYER_INTELLIGENCE_ADVANCEMENT_IMPLEMENTED';
export const PLACE_INTELLIGENCE_DEEPENING_STATUS = 'PLACE_INTELLIGENCE_DEEPENING_IMPLEMENTED';

export type BuyerDecisionIntelligenceLaneKey =
  | 'PROPERTY_READINESS'
  | 'COMPARISON_READINESS'
  | 'FINANCING_ASSUMPTIONS'
  | 'DUE_DILIGENCE'
  | 'PLACE_MARKET_CONTEXT'
  | 'PROFESSIONAL_HANDOFF';

export type PlaceIntelligenceDimensionKey =
  | 'PLACE_IDENTITY'
  | 'GEOGRAPHIC_CONTEXT'
  | 'MARKET_EVIDENCE'
  | 'BUILT_ENVIRONMENT'
  | 'RELATED_PLACE_CONTEXT'
  | 'DECISION_QUESTIONS';

export type BuyerDecisionIntelligenceLane = Readonly<{
  key: BuyerDecisionIntelligenceLaneKey;
  label: string;
  fact: string;
  meaning: string;
  openQuestion: string;
  verificationAction: string;
  href: string;
  sourceIds: readonly string[];
}>;

export type BuyerDecisionIntelligenceModel = Readonly<{
  status: typeof BUYER_INTELLIGENCE_ADVANCEMENT_STATUS;
  governingQuestion: string;
  lanes: readonly BuyerDecisionIntelligenceLane[];
  continuityLinks: readonly {
    label: string;
    href: string;
    destination: 'search' | 'property' | 'compare' | 'buy' | 'financing' | 'market' | 'grand-plan' | 'advisory';
  }[];
  sourceRecords: readonly ReieSourceRegistryRecord[];
  protectedBoundaries: {
    offerPriceCertainty: false;
    guaranteedAcceptanceStrategy: false;
    valuationAppraisalCertainty: false;
    affordabilityJudgment: false;
    investmentRecommendation: false;
    legalAdvice: false;
    inspectionConclusion: false;
    lendingQualification: false;
    hiddenSuitabilityScoring: false;
    hiddenStateTransfer: false;
    persistence: false;
    telemetry: false;
    crmEmail: false;
    providerActivation: false;
    apiChange: false;
  };
}>;

export type PlaceIntelligenceDimension = Readonly<{
  key: PlaceIntelligenceDimensionKey;
  label: string;
  fact: string;
  meaning: string;
  investigate: string;
  sourcePosture: string;
  href: string;
  sourceIds: readonly string[];
}>;

export type PlaceIntelligenceDeepeningModel = Readonly<{
  status: typeof PLACE_INTELLIGENCE_DEEPENING_STATUS;
  governingQuestion: string;
  subject: string;
  city: string;
  evidenceState: NeighborhoodProduct3EvidenceState;
  dimensions: readonly PlaceIntelligenceDimension[];
  sourceRecords: readonly ReieSourceRegistryRecord[];
  protectedBoundaries: {
    schoolRanking: false;
    safetyRanking: false;
    crimeSteering: false;
    familySuitability: false;
    demographicPreference: false;
    socioeconomicSorting: false;
    placeOrderingConclusion: false;
    lifestyleFitScoring: false;
    investmentRanking: false;
    appreciationPrediction: false;
    fairHousingProxy: false;
    publicGisActivation: false;
    providerActivation: false;
    persistence: false;
    telemetry: false;
    apiChange: false;
  };
}>;

function registryRecords(sourceIds: readonly string[]) {
  const registry = getReieSourceRegistry();
  return sourceIds
    .map((sourceId) => registry.records.find((record) => record.sourceId === sourceId))
    .filter((record): record is ReieSourceRegistryRecord => Boolean(record));
}

export function buildBuyerDecisionIntelligenceModel(): BuyerDecisionIntelligenceModel {
  const sourceIds = [
    'SRC-MLS-LISTING-DATA',
    'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE',
    'SRC-REIE-FINANCING-SCENARIO-CALCULATOR',
    'SRC-MUNICIPAL-PLANNING-CONTEXT',
    'SRC-BOULDER-COUNTY-ASSESSOR',
  ] as const;

  return {
    status: BUYER_INTELLIGENCE_ADVANCEMENT_STATUS,
    governingQuestion:
      'What should I understand, compare, verify, and prepare before deciding whether and how to pursue a property?',
    lanes: [
      {
        key: 'PROPERTY_READINESS',
        label: 'Property readiness',
        fact: 'Property pages and Search expose listing facts, visible evidence, confidence cues, and verification prompts when a home is selected.',
        meaning: 'A buyer can separate what is visible from what still needs address-level review before treating a property as serious.',
        openQuestion: 'Which condition, records, tax, insurance, HOA, title, disclosure, or inspection facts are still missing for this address?',
        verificationAction: 'Open the property path from Search and carry the unresolved facts to the appropriate professional review.',
        href: '/search',
        sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-BOULDER-COUNTY-ASSESSOR'],
      },
      {
        key: 'COMPARISON_READINESS',
        label: 'Comparison readiness',
        fact: 'REIE comparison intelligence can organize factual differences, missing evidence, and verification prompts across visible alternatives.',
        meaning: 'The useful comparison is not a winner selection; it is a clearer view of what differs and what remains unresolved.',
        openQuestion: 'Which alternative has stronger visible evidence, and which differences still depend on source or professional confirmation?',
        verificationAction: 'Use Compare after selecting alternatives, then return to Search or Property when a missing fact controls the next decision.',
        href: '/compare',
        sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE'],
      },
      {
        key: 'FINANCING_ASSUMPTIONS',
        label: 'Financing assumptions',
        fact: 'Buyer financing education and deterministic scenarios can frame assumptions without lender quotes, approval, or qualification.',
        meaning: 'Financing context is useful when it names the assumption and the professional question rather than deciding capacity.',
        openQuestion: 'Which rate, cash, payment, closing-cost, timing, tax, insurance, or documentation assumptions need lender review?',
        verificationAction: 'Review financing education, then take the specific assumptions to a lender or financial professional.',
        href: '/buy#buyer-financing-confidence',
        sourceIds: ['SRC-REIE-FINANCING-SCENARIO-CALCULATOR'],
      },
      {
        key: 'DUE_DILIGENCE',
        label: 'Due diligence',
        fact: 'REIE can surface inspection, public-record, property-evidence, and documentation gaps from existing public route context.',
        meaning: 'The next step is better question preparation, not a conclusion about condition, legal status, or transaction risk.',
        openQuestion: 'Which record, inspection, title, insurance, permit, disclosure, or contract issue needs a qualified reviewer before reliance?',
        verificationAction: 'Carry unresolved diligence items into Property review, Advisory preparation, or the correct professional channel.',
        href: '/contact#advisory-readiness',
        sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-BOULDER-COUNTY-ASSESSOR'],
      },
      {
        key: 'PLACE_MARKET_CONTEXT',
        label: 'Place and market context',
        fact: 'Market, LDI, and neighborhood routes provide governed place context, route-level freshness posture, and limitation boundaries.',
        meaning: 'A buyer can understand the surrounding context while keeping personal priorities and property-specific reliance separate.',
        openQuestion: 'Which city, neighborhood, inventory, timing, and source-freshness assumptions should be checked before narrowing the search?',
        verificationAction: 'Review Market and neighborhood context, then use Search to confirm current inventory and property-level details.',
        href: '/market',
        sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-MUNICIPAL-PLANNING-CONTEXT'],
      },
      {
        key: 'PROFESSIONAL_HANDOFF',
        label: 'Professional handoff',
        fact: 'Grand Plan and Advisory routes help organize next questions without hidden context transfer, saved inputs, or customer-data mutation.',
        meaning: 'The strongest handoff is a visible list of assumptions, unknowns, and verification needs that the customer controls.',
        openQuestion: 'Which questions are ready for advisor, lender, inspector, title, insurance, tax, legal, or records review?',
        verificationAction: 'Use Grand Plan or Advisory to organize the conversation, then begin Contact only when the customer chooses.',
        href: '/grand-plan',
        sourceIds: ['SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE', 'SRC-REIE-FINANCING-SCENARIO-CALCULATOR'],
      },
    ],
    continuityLinks: [
      { label: 'Search', href: '/search', destination: 'search' },
      { label: 'Property', href: '/search', destination: 'property' },
      { label: 'Compare', href: '/compare', destination: 'compare' },
      { label: 'Buy', href: '/buy', destination: 'buy' },
      { label: 'Financing', href: '/buy#buyer-financing-confidence', destination: 'financing' },
      { label: 'Market', href: '/market', destination: 'market' },
      { label: 'Grand Plan', href: '/grand-plan', destination: 'grand-plan' },
      { label: 'Advisory', href: '/contact#advisory-readiness', destination: 'advisory' },
    ],
    sourceRecords: registryRecords(sourceIds),
    protectedBoundaries: {
      offerPriceCertainty: false,
      guaranteedAcceptanceStrategy: false,
      valuationAppraisalCertainty: false,
      affordabilityJudgment: false,
      investmentRecommendation: false,
      legalAdvice: false,
      inspectionConclusion: false,
      lendingQualification: false,
      hiddenSuitabilityScoring: false,
      hiddenStateTransfer: false,
      persistence: false,
      telemetry: false,
      crmEmail: false,
      providerActivation: false,
      apiChange: false,
    },
  };
}

export function buildPlaceIntelligenceDeepeningModel({
  neighborhood,
  inventoryState,
  evidenceState,
  marketLabels,
  cityMarketHref,
  searchHref,
  relatedPlaceNames,
}: {
  neighborhood: {
    name: string;
    city: string;
    primaryAnchor: string;
    era: string;
    constructionDNA: string;
    fireRisk: string;
    insuranceComplexity: string;
    soilType: string;
  };
  inventoryState: NeighborhoodProduct3InventoryState;
  evidenceState: NeighborhoodProduct3EvidenceState;
  marketLabels: {
    inventory: string;
    competitiveness: string;
    timing: string;
  };
  cityMarketHref: string;
  searchHref: string;
  relatedPlaceNames: readonly string[];
}): PlaceIntelligenceDeepeningModel {
  const sourceIds = ['SRC-MLS-LISTING-DATA', 'SRC-MUNICIPAL-PLANNING-CONTEXT'] as const;
  const relatedPlaces = relatedPlaceNames.length > 0 ? relatedPlaceNames.join(', ') : 'nearby governed place routes';
  const inventoryFact =
    inventoryState.source === 'typesense'
      ? `${inventoryState.count} indexed listing signal${inventoryState.count === 1 ? '' : 's'} are available for this neighborhood name during page rendering.`
      : 'A direct Search path is available, but the page is not presenting a live indexed neighborhood count.';

  return {
    status: PLACE_INTELLIGENCE_DEEPENING_STATUS,
    governingQuestion:
      'What is this place, what evidence does REIE have about it, and what should I investigate when deciding whether the location works for my own stated priorities?',
    subject: neighborhood.name,
    city: neighborhood.city,
    evidenceState,
    dimensions: [
      {
        key: 'PLACE_IDENTITY',
        label: 'Place identity',
        fact: `${neighborhood.name} is presented as a governed neighborhood route within ${neighborhood.city}, anchored by ${neighborhood.primaryAnchor}.`,
        meaning: 'The route establishes orientation and naming context before any property-specific decision.',
        investigate: 'Confirm the exact boundary, services, and location assumptions that matter to your own search before relying on the label.',
        sourcePosture: 'Governed neighborhood route data; not a parcel boundary or legal description.',
        href: cityMarketHref,
        sourceIds: ['SRC-MUNICIPAL-PLANNING-CONTEXT'],
      },
      {
        key: 'GEOGRAPHIC_CONTEXT',
        label: 'Geographic context',
        fact: `${neighborhood.primaryAnchor} is the visible orientation point used for the ${neighborhood.name} place story.`,
        meaning: 'Geography can frame touring, commute review, and access questions without deciding personal fit.',
        investigate: 'Check travel patterns, access, seasonal conditions, services, and exact distances using sources appropriate to your needs.',
        sourcePosture: 'Route-level orientation only; no public GIS layer, map analysis, or new provider data is activated.',
        href: searchHref,
        sourceIds: ['SRC-MUNICIPAL-PLANNING-CONTEXT'],
      },
      {
        key: 'MARKET_EVIDENCE',
        label: 'Market evidence',
        fact: `${neighborhood.name} connects to ${neighborhood.city} market context through ${marketLabels.inventory.toLowerCase()}, ${marketLabels.competitiveness.toLowerCase()}, and ${marketLabels.timing.toLowerCase()}.`,
        meaning: 'Market context helps frame timing and inventory questions, but it is not a forecast, valuation, or recommendation.',
        investigate: 'Compare city-market context with current Search results before relying on neighborhood-level market signals.',
        sourcePosture: 'Existing market and listing context with route-level freshness limitations.',
        href: cityMarketHref,
        sourceIds: ['SRC-MLS-LISTING-DATA'],
      },
      {
        key: 'BUILT_ENVIRONMENT',
        label: 'Built environment',
        fact: `${neighborhood.era} housing context and ${neighborhood.constructionDNA.toLowerCase()} are visible as neighborhood-level orientation.`,
        meaning: 'Built-environment context is useful only when it becomes property-specific diligence.',
        investigate: 'Verify age, condition, systems, drainage, roof, records, permits, insurance, and inspection needs for each address.',
        sourcePosture: 'Static neighborhood context; address-level facts require Search, Property, records, and professional review.',
        href: searchHref,
        sourceIds: ['SRC-MLS-LISTING-DATA'],
      },
      {
        key: 'RELATED_PLACE_CONTEXT',
        label: 'Related place context',
        fact: `${relatedPlaces} provide user-controlled routes for comparing surrounding place context.`,
        meaning: 'Nearby context supports exploration without ranking one place above another.',
        investigate: 'Open related places to compare evidence, limitations, Search paths, and verification questions side by side.',
        sourcePosture: 'Governed internal route relationship; no steering, scoring, or audience targeting.',
        href: '#nearby-neighborhoods',
        sourceIds: ['SRC-MUNICIPAL-PLANNING-CONTEXT'],
      },
      {
        key: 'DECISION_QUESTIONS',
        label: 'Decision questions',
        fact: inventoryFact,
        meaning: 'The useful output is a clearer investigation list for the customer, not a conclusion about where to live.',
        investigate: `Ask whether current property evidence, ${neighborhood.soilType.toLowerCase()} soil context, ${neighborhood.fireRisk.toLowerCase()} fire context, and ${neighborhood.insuranceComplexity.toLowerCase()} insurance complexity matter for a specific property.`,
        sourcePosture: 'Existing route and search-path evidence only; unsupported facts remain verification-bound.',
        href: '#neighborhood-verification-questions',
        sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-MUNICIPAL-PLANNING-CONTEXT'],
      },
    ],
    sourceRecords: registryRecords(sourceIds),
    protectedBoundaries: {
      schoolRanking: false,
      safetyRanking: false,
      crimeSteering: false,
      familySuitability: false,
      demographicPreference: false,
      socioeconomicSorting: false,
      placeOrderingConclusion: false,
      lifestyleFitScoring: false,
      investmentRanking: false,
      appreciationPrediction: false,
      fairHousingProxy: false,
      publicGisActivation: false,
      providerActivation: false,
      persistence: false,
      telemetry: false,
      apiChange: false,
    },
  };
}
