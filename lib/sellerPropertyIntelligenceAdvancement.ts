import { getReieSourceRegistry, type ReieSourceRegistryRecord } from './sourceRegistry';

export const SELLER_INTELLIGENCE_ADVANCEMENT_STATUS = 'SELLER_INTELLIGENCE_ADVANCEMENT_IMPLEMENTED';
export const PROPERTY_INTELLIGENCE_DEEPENING_STATUS = 'PROPERTY_INTELLIGENCE_DEEPENING_IMPLEMENTED';

export type PropertyIntelligenceDeepeningInput = {
  address?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  propertyType?: string | null;
  status?: string | null;
  price?: number | null;
  sqft?: number | null;
  beds?: number | null;
  baths?: number | null;
  yearBuilt?: number | null;
  lotSize?: number | null;
  updatedAt?: Date | null;
  lastIntelligenceSync?: Date | null;
  photoCount?: number;
  relatedListingCount?: number;
};

export type PropertyIntelligenceEvidenceState =
  | 'known-public-fact'
  | 'reie-derived'
  | 'verification-required'
  | 'source-confirmation-pending'
  | 'blocked-not-authorized';

export type PropertyIntelligenceHistoryEvent = {
  key: 'CURRENT_STATUS' | 'LISTING_UPDATE' | 'INTELLIGENCE_SYNC' | 'CONSTRUCTION_ERA';
  label: string;
  evidence: string;
  interpretation: string;
  sourceId: string;
  state: PropertyIntelligenceEvidenceState;
};

export type PropertyIntelligenceDerivedFact = {
  key: 'PRICE_PER_SQUARE_FOOT' | 'EVIDENCE_COMPLETENESS' | 'COMPARISON_CONTEXT' | 'SELLER_PREPARATION_CONTEXT';
  label: string;
  value: string;
  explanation: string;
  sourceIds: string[];
  state: PropertyIntelligenceEvidenceState;
};

export type PropertyIntelligenceSourceTrace = {
  sourceId: string;
  label: string;
  state: ReieSourceRegistryRecord['productionActivationState'];
  customerStatus: ReieSourceRegistryRecord['customerStatus'];
  claimEligible: boolean;
  use: string;
};

export type PropertyIntelligenceDeepening = {
  status: typeof PROPERTY_INTELLIGENCE_DEEPENING_STATUS;
  summary: string;
  evidenceProfile: {
    knownPublicFacts: number;
    derivedFacts: number;
    unavailableFacts: number;
    verificationRequired: number;
    sourceConfirmationPending: number;
  };
  history: PropertyIntelligenceHistoryEvent[];
  derivedFacts: PropertyIntelligenceDerivedFact[];
  sourceTrace: PropertyIntelligenceSourceTrace[];
  sellerContext: {
    label: string;
    interpretation: string;
    professionalReview: string;
    href: string;
  }[];
  protectedBoundaries: {
    valuation: false;
    appraisal: false;
    listingPriceRecommendation: false;
    salePrediction: false;
    ranking: false;
    scoring: false;
    providerActivation: false;
    assessorRetrieval: false;
    taxRetrieval: false;
    permitRetrieval: false;
    bcodActivation: false;
    persistence: false;
    telemetry: false;
    customerDataMutation: false;
  };
};

export type SellerIntelligenceDimension = {
  key:
    | 'PROPERTY_EVIDENCE'
    | 'MARKET_POSITION_CONTEXT'
    | 'PROPERTY_PREPARATION'
    | 'TIMING'
    | 'SELLING_PROCESS_READINESS'
    | 'BUY_SELL_INTERDEPENDENCE';
  label: string;
  factFrame: string;
  interpretationFrame: string;
  reviewQuestion: string;
  href: string;
};

export type SellerIntelligenceAdvancement = {
  status: typeof SELLER_INTELLIGENCE_ADVANCEMENT_STATUS;
  summary: string;
  dimensions: SellerIntelligenceDimension[];
  sourceStates: PropertyIntelligenceSourceTrace[];
  continuityLinks: { label: string; href: string; purpose: string }[];
  protectedBoundaries: {
    valuationCertainty: false;
    listingPriceRecommendation: false;
    salePrediction: false;
    hiddenStateTransfer: false;
    protectedClassInference: false;
    telemetry: false;
    persistence: false;
    sourceActivation: false;
    customerDataMutation: false;
  };
};

function formatCurrency(value: number | null | undefined) {
  if (!value) return 'not available';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: Date | null | undefined) {
  if (!value) return null;

  return value.toISOString().slice(0, 10);
}

function registryTrace(sourceIds: string[]): PropertyIntelligenceSourceTrace[] {
  const registry = getReieSourceRegistry();

  return sourceIds.map((sourceId) => {
    const source = registry.records.find((record) => record.sourceId === sourceId);
    if (!source) throw new Error(`Missing REIE source registry record: ${sourceId}`);

    return {
      sourceId: source.sourceId,
      label: source.publicName,
      state: source.productionActivationState,
      customerStatus: source.customerStatus,
      claimEligible: source.claimEligible,
      use: source.currentReieUse,
    };
  });
}

export function buildPropertyIntelligenceDeepening(input: PropertyIntelligenceDeepeningInput): PropertyIntelligenceDeepening {
  const pricePerSquareFoot = input.price && input.sqft ? Math.round(input.price / input.sqft) : null;
  const knownPublicFacts = [
    input.address,
    input.city,
    input.neighborhood,
    input.propertyType,
    input.status,
    input.price,
    input.sqft,
    input.beds,
    input.baths,
    input.yearBuilt,
    input.lotSize,
  ].filter((value) => value !== null && value !== undefined && value !== '').length;
  const unavailableFacts = Math.max(0, 11 - knownPublicFacts);
  const placeLabel = input.neighborhood || input.city || 'this Colorado market';
  const updateDate = formatDate(input.updatedAt);
  const syncDate = formatDate(input.lastIntelligenceSync);

  const history: PropertyIntelligenceHistoryEvent[] = [
    {
      key: 'CURRENT_STATUS',
      label: 'Current public status',
      evidence: input.status || 'Listing status is not available in the current public facts.',
      interpretation: 'Status can organize next questions, but it does not establish availability, motivation, timing, or value.',
      sourceId: 'SRC-MLS-LISTING-DATA',
      state: input.status ? 'known-public-fact' : 'verification-required',
    },
    {
      key: 'LISTING_UPDATE',
      label: 'Listing update observed',
      evidence: updateDate ? `Last public listing update observed on ${updateDate}.` : 'No listing update timestamp is available.',
      interpretation: 'Freshness supports verification order only; it does not prove that every listing fact is current.',
      sourceId: 'SRC-MLS-LISTING-DATA',
      state: updateDate ? 'known-public-fact' : 'verification-required',
    },
    {
      key: 'INTELLIGENCE_SYNC',
      label: 'REIE sync marker',
      evidence: syncDate ? `Last REIE intelligence sync marker is ${syncDate}.` : 'No REIE intelligence sync marker is available.',
      interpretation: 'Sync context inherits listing-source limits and does not activate any external source.',
      sourceId: 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE',
      state: syncDate ? 'reie-derived' : 'verification-required',
    },
    {
      key: 'CONSTRUCTION_ERA',
      label: 'Construction-era prompt',
      evidence: input.yearBuilt ? `Public year-built field: ${input.yearBuilt}.` : 'Year built is not available in the current public facts.',
      interpretation: 'Construction era should guide record, systems, insurance, and inspection questions without creating a condition conclusion.',
      sourceId: 'SRC-MLS-LISTING-DATA',
      state: input.yearBuilt ? 'known-public-fact' : 'verification-required',
    },
  ];

  const derivedFacts: PropertyIntelligenceDerivedFact[] = [
    {
      key: 'PRICE_PER_SQUARE_FOOT',
      label: 'Price per listed square foot',
      value: pricePerSquareFoot ? `${formatCurrency(pricePerSquareFoot)} per listed sq ft` : 'Unavailable until price and square footage are both present',
      explanation: 'A deterministic arithmetic context from visible listing fields only; not a valuation, appraisal, or pricing conclusion.',
      sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE'],
      state: pricePerSquareFoot ? 'reie-derived' : 'verification-required',
    },
    {
      key: 'EVIDENCE_COMPLETENESS',
      label: 'Public fact completeness',
      value: `${knownPublicFacts} of 11 reviewed public fields are available`,
      explanation: 'Completeness identifies what a customer can review now and what should move to verification.',
      sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE'],
      state: unavailableFacts > 0 ? 'verification-required' : 'reie-derived',
    },
    {
      key: 'COMPARISON_CONTEXT',
      label: 'Related-listing comparison context',
      value: `${input.relatedListingCount ?? 0} related public listing${(input.relatedListingCount ?? 0) === 1 ? '' : 's'} available`,
      explanation: 'Comparison context frames factual similarities and differences only; it does not rank options or select a winner.',
      sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE'],
      state: input.relatedListingCount ? 'reie-derived' : 'verification-required',
    },
    {
      key: 'SELLER_PREPARATION_CONTEXT',
      label: 'Seller preparation carry-forward',
      value: `${input.propertyType || 'Property'} in ${placeLabel}`,
      explanation: 'Public property facts can prepare seller questions about records, condition, exposure, and buyer objections.',
      sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE'],
      state: 'reie-derived',
    },
  ];

  return {
    status: PROPERTY_INTELLIGENCE_DEEPENING_STATUS,
    summary:
      'Property Intelligence Deepening separates known public facts, deterministic derived context, source-readiness limits, and seller-relevant verification questions without changing data sources.',
    evidenceProfile: {
      knownPublicFacts,
      derivedFacts: derivedFacts.filter((fact) => fact.state === 'reie-derived').length,
      unavailableFacts,
      verificationRequired: history.filter((event) => event.state === 'verification-required').length + derivedFacts.filter((fact) => fact.state === 'verification-required').length,
      sourceConfirmationPending: 1,
    },
    history,
    derivedFacts,
    sourceTrace: registryTrace([
      'SRC-MLS-LISTING-DATA',
      'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE',
      'SRC-BOULDER-COUNTY-ASSESSOR',
      'SRC-BCOD-ADDRESS-POINTS',
      'SRC-BCOD-PARK-BOUNDARIES',
    ]),
    sellerContext: [
      {
        label: 'Property evidence for seller review',
        interpretation: 'Public facts identify what can be discussed now and which records or condition questions need confirmation.',
        professionalReview: 'Bring maintenance, permits, HOA, insurance, disclosure, title, and repair history into advisor or professional review.',
        href: '/sell#seller-intelligence-advancement',
      },
      {
        label: 'Market position without pricing certainty',
        interpretation: 'Market and related-listing context can frame exposure questions without producing a listing-price answer.',
        professionalReview: 'Review competition, condition, timing, and launch preparation together before deciding how to position the property.',
        href: '/market',
      },
      {
        label: 'Source limits before claims',
        interpretation: 'Assessor and BCOD categories remain unavailable for property-specific customer claims until separately authorized.',
        professionalReview: 'Use source limits as verification prompts, not as evidence that has already been retrieved.',
        href: '/sources',
      },
    ],
    protectedBoundaries: {
      valuation: false,
      appraisal: false,
      listingPriceRecommendation: false,
      salePrediction: false,
      ranking: false,
      scoring: false,
      providerActivation: false,
      assessorRetrieval: false,
      taxRetrieval: false,
      permitRetrieval: false,
      bcodActivation: false,
      persistence: false,
      telemetry: false,
      customerDataMutation: false,
    },
  };
}

export function buildSellerIntelligenceAdvancement(): SellerIntelligenceAdvancement {
  return {
    status: SELLER_INTELLIGENCE_ADVANCEMENT_STATUS,
    summary:
      'Seller Intelligence Advancement organizes public property evidence, market context, preparation questions, and cross-journey continuity without storing answers or activating new sources.',
    dimensions: [
      {
        key: 'PROPERTY_EVIDENCE',
        label: 'Property evidence',
        factFrame: 'Known property facts, media, records, preparation gaps, and source limitations should be separated before exposure.',
        interpretationFrame: 'Evidence readiness helps identify what can be discussed now and what requires verification.',
        reviewQuestion: 'Which property facts, records, and condition questions should be verified before pricing or launch decisions?',
        href: '/home-worth',
      },
      {
        key: 'MARKET_POSITION_CONTEXT',
        label: 'Market position context',
        factFrame: 'Market pages, search inventory, and related public listings frame alternatives buyers may see.',
        interpretationFrame: 'Market context helps form questions about competition and timing without asserting demand or value.',
        reviewQuestion: 'Which active alternatives and local context should shape the professional pricing conversation?',
        href: '/market',
      },
      {
        key: 'PROPERTY_PREPARATION',
        label: 'Property preparation',
        factFrame: 'Repairs, access, presentation, HOA materials, permits, insurance questions, and disclosures should be organized early.',
        interpretationFrame: 'Preparation reduces buyer-objection friction but still requires property-specific professional judgment.',
        reviewQuestion: 'What buyer-visible friction can be reduced before exposure?',
        href: '#seller-preparation',
      },
      {
        key: 'TIMING',
        label: 'Timing questions',
        factFrame: 'Timeline, next move, showing readiness, and competing inventory create the timing context.',
        interpretationFrame: 'Timing remains a decision question, not a forecast or market-timing instruction.',
        reviewQuestion: 'What must be true before the seller is ready for exposure?',
        href: '#seller-intake',
      },
      {
        key: 'SELLING_PROCESS_READINESS',
        label: 'Process readiness',
        factFrame: 'Title, tax, HOA, inspection, appraisal, insurance, contract, and closing questions belong in the right professional lane.',
        interpretationFrame: 'Process readiness helps route questions before they become negotiation pressure.',
        reviewQuestion: 'Which questions need advisor, inspector, attorney, CPA, title, insurer, HOA, or municipal review?',
        href: '/contact#advisory-readiness',
      },
      {
        key: 'BUY_SELL_INTERDEPENDENCE',
        label: 'Buy/sell interdependence',
        factFrame: 'A seller decision may depend on replacement-home search, financing assumptions, and move timing.',
        interpretationFrame: 'Cross-journey continuity keeps the public experience coherent without transferring hidden customer state.',
        reviewQuestion: 'How should sale preparation connect to search, financing, and the next housing decision?',
        href: '/grand-plan',
      },
    ],
    sourceStates: registryTrace([
      'SRC-MLS-LISTING-DATA',
      'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE',
      'SRC-BOULDER-COUNTY-ASSESSOR',
      'SRC-BCOD-ADDRESS-POINTS',
      'SRC-BCOD-PARK-BOUNDARIES',
    ]),
    continuityLinks: [
      { label: 'Source Registry', href: '/sources', purpose: 'Review source status and limits before relying on claims.' },
      { label: 'Grand Plan', href: '/grand-plan', purpose: 'Connect selling, buying, financing, and timing decisions.' },
      { label: 'Financing Readiness', href: '/buy#financing-readiness', purpose: 'Prepare buy-side assumptions when selling depends on the next purchase.' },
      { label: 'Advisory Readiness', href: '/contact#advisory-readiness', purpose: 'Carry unresolved professional questions into the right conversation.' },
    ],
    protectedBoundaries: {
      valuationCertainty: false,
      listingPriceRecommendation: false,
      salePrediction: false,
      hiddenStateTransfer: false,
      protectedClassInference: false,
      telemetry: false,
      persistence: false,
      sourceActivation: false,
      customerDataMutation: false,
    },
  };
}
