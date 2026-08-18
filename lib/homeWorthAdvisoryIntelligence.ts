import { getReieSourceRegistry, type ReieSourceRegistryRecord } from './sourceRegistry';

export const HOME_WORTH_ADVISORY_INTELLIGENCE_STATUS = 'HOME_WORTH_ADVISORY_INTELLIGENCE_IMPLEMENTED';
export const HOME_WORTH_INTELLIGENCE_ADVANCEMENT_STATUS = 'HOME_WORTH_INTELLIGENCE_ADVANCEMENT_IMPLEMENTED';
export const ADVISORY_HANDOFF_INTELLIGENCE_STATUS = 'ADVISORY_HANDOFF_INTELLIGENCE_DEEPENED';

export type HomeWorthIntelligenceStepKey =
  | 'PROPERTY_EVIDENCE'
  | 'MARKET_CONTEXT'
  | 'DERIVED_CONTEXT'
  | 'UNKNOWN_VERIFICATION'
  | 'PROFESSIONAL_VALUE_QUESTIONS';

export type HomeWorthIntelligenceStep = {
  key: HomeWorthIntelligenceStepKey;
  label: string;
  evidence: string;
  meaning: string;
  unknown: string;
  verify: string;
  href: string;
  sourceIds: string[];
};

export type HomeWorthSourcePosture = {
  sourceId: string;
  label: string;
  state: ReieSourceRegistryRecord['productionActivationState'];
  customerStatus: ReieSourceRegistryRecord['customerStatus'];
  claimEligible: boolean;
  use: string;
};

export type HomeWorthIntelligenceModel = {
  status: typeof HOME_WORTH_INTELLIGENCE_ADVANCEMENT_STATUS;
  governingQuestion: string;
  customerSequence: readonly [
    'PROPERTY_EVIDENCE',
    'MARKET_CONTEXT',
    'WHAT_IS_UNKNOWN',
    'WHAT_TO_VERIFY',
    'WHAT_TO_DISCUSS_NEXT',
  ];
  steps: HomeWorthIntelligenceStep[];
  sourcePosture: HomeWorthSourcePosture[];
  continuityLinks: { label: string; href: string; purpose: string }[];
  protectedBoundaries: {
    automatedHomeValue: false;
    avm: false;
    appraisal: false;
    guaranteedSalePrice: false;
    definitiveListingPrice: false;
    expectedAppreciation: false;
    predictedBuyerDemand: false;
    predictedDaysOnMarket: false;
    guaranteedNetProceeds: false;
    valueCertainty: false;
    listingPriceRecommendation: false;
    saleOutcomePrediction: false;
    providerActivation: false;
    assessorRetrieval: false;
    taxRetrieval: false;
    permitRetrieval: false;
    bcodActivation: false;
    hiddenStateTransfer: false;
    crmEmail: false;
    persistence: false;
    telemetry: false;
    customerDataMutation: false;
  };
};

export type AdvisoryDecisionContextKey =
  | 'BUYING'
  | 'SELLING'
  | 'PROPERTY_SPECIFIC'
  | 'COMPARISON'
  | 'FINANCING'
  | 'PLACE_MARKET'
  | 'LINKED_BUY_SELL';

export type AdvisoryProfessionalDomainKey =
  | 'REAL_ESTATE_AGENT_DISCUSSION'
  | 'LENDER_DISCUSSION'
  | 'INSPECTOR_ENGINEER_DISCUSSION'
  | 'ATTORNEY_DISCUSSION'
  | 'TAX_PROFESSIONAL_DISCUSSION'
  | 'APPRAISER_DISCUSSION';

export type AdvisoryDecisionContext = {
  key: AdvisoryDecisionContextKey;
  label: string;
  knownEvidence: string;
  unresolved: string;
  nextQuestion: string;
};

export type AdvisoryProfessionalDomain = {
  key: AdvisoryProfessionalDomainKey;
  label: string;
  routeBy: string;
  bring: string;
  boundary: string;
};

export type AdvisoryPreparationIntelligenceModel = {
  status: typeof ADVISORY_HANDOFF_INTELLIGENCE_STATUS;
  governingQuestion: string;
  contexts: AdvisoryDecisionContext[];
  professionalDomains: AdvisoryProfessionalDomain[];
  protectedBoundaries: {
    hiddenSearchTransfer: false;
    hiddenComparisonTransfer: false;
    hiddenFinancingTransfer: false;
    hiddenGrandPlanTransfer: false;
    hiddenSellerTransfer: false;
    inferredIntentTransfer: false;
    browsingBehaviorTransfer: false;
    protectedClassDataTransfer: false;
    newRequiredFields: false;
    contactMutation: false;
    propertyInquiryMutation: false;
    crmEmail: false;
    scheduling: false;
    leadScoring: false;
    telemetry: false;
    brokerageRelationship: false;
    agencyRelationship: false;
    representation: false;
    fiduciaryRelationship: false;
    lenderRelationship: false;
    legalRelationship: false;
    taxAdvisoryRelationship: false;
    appraisalRelationship: false;
    providerActivation: false;
  };
};

function registryTrace(sourceIds: string[]): HomeWorthSourcePosture[] {
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

export function buildHomeWorthIntelligenceModel(): HomeWorthIntelligenceModel {
  return {
    status: HOME_WORTH_INTELLIGENCE_ADVANCEMENT_STATUS,
    governingQuestion:
      'What evidence can REIE help me understand about my property and current market context before I discuss value and pricing with a real estate professional?',
    customerSequence: ['PROPERTY_EVIDENCE', 'MARKET_CONTEXT', 'WHAT_IS_UNKNOWN', 'WHAT_TO_VERIFY', 'WHAT_TO_DISCUSS_NEXT'],
    steps: [
      {
        key: 'PROPERTY_EVIDENCE',
        label: 'Property evidence',
        evidence: 'Known public listing facts, media, property characteristics, and seller preparation prompts should be organized before value is discussed.',
        meaning: 'Evidence helps identify what can be reviewed now and which facts need confirmation before a professional pricing conversation.',
        unknown: 'Records, condition, improvements, permits, HOA materials, insurance issues, title items, and disclosure questions may be incomplete here.',
        verify: 'Bring property documents, preparation notes, and unresolved record questions into seller or source review.',
        href: '/sell#seller-intelligence-advancement',
        sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE'],
      },
      {
        key: 'MARKET_CONTEXT',
        label: 'Market context',
        evidence: 'Market pages, city-market evidence, and visible inventory can frame the alternatives a buyer may consider.',
        meaning: 'Market context supports better questions about positioning, timing, and competition without predicting demand or sale results.',
        unknown: 'Current buyer response, private showing feedback, seller motivation, and negotiated outcomes are not known from public context alone.',
        verify: 'Review local alternatives and route-level evidence with a real estate professional before relying on market context.',
        href: '/market',
        sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-MUNICIPAL-PLANNING-CONTEXT'],
      },
      {
        key: 'DERIVED_CONTEXT',
        label: 'Derived context',
        evidence: 'REIE may show deterministic context such as price per listed square foot when the required public facts are already available.',
        meaning: 'Derived context is arithmetic or organizational context only, not a pricing opinion or outcome forecast.',
        unknown: 'Listed square footage, property condition, concessions, updates, quality, lot utility, and buyer perception still require verification.',
        verify: 'Use derived context as a question prompt beside comparables, preparation, and source limits.',
        href: '/search',
        sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE'],
      },
      {
        key: 'UNKNOWN_VERIFICATION',
        label: 'Unknown and verification model',
        evidence: 'Assessor, tax, permit, and BCOD categories remain separated by their Source Registry posture.',
        meaning: 'Unavailable or blocked sources become verification prompts rather than customer-facing property claims.',
        unknown: 'Provider-confirmation, retrieval permission, legal interpretation, and property-specific record freshness may still be unresolved.',
        verify: 'Check Source Registry posture before treating records, boundaries, or official-source details as claim-ready.',
        href: '/sources',
        sourceIds: [
          'SRC-BOULDER-COUNTY-ASSESSOR',
          'SRC-BOULDER-COUNTY-TREASURER',
          'SRC-BOULDER-PERMIT-CANDIDATES',
          'SRC-BCOD-ADDRESS-POINTS',
          'SRC-BCOD-PARK-BOUNDARIES',
        ],
      },
      {
        key: 'PROFESSIONAL_VALUE_QUESTIONS',
        label: 'Professional value questions',
        evidence: 'A useful value discussion should carry property facts, market context, preparation questions, and source limitations together.',
        meaning: 'REIE prepares the conversation; a qualified professional interprets the evidence in context.',
        unknown: 'Listing strategy, pricing decisions, appraisal questions, net proceeds, and transaction outcomes are not determined here.',
        verify: 'Use Advisory or Contact when the question is ready for a professional conversation with no hidden state transfer.',
        href: '/contact#advisory-readiness',
        sourceIds: ['SRC-MLS-LISTING-DATA', 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE'],
      },
    ],
    sourcePosture: registryTrace([
      'SRC-MLS-LISTING-DATA',
      'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE',
      'SRC-MUNICIPAL-PLANNING-CONTEXT',
      'SRC-BOULDER-COUNTY-ASSESSOR',
      'SRC-BOULDER-COUNTY-TREASURER',
      'SRC-BOULDER-PERMIT-CANDIDATES',
      'SRC-BCOD-ADDRESS-POINTS',
      'SRC-BCOD-PARK-BOUNDARIES',
    ]),
    continuityLinks: [
      { label: 'Seller Strategy', href: '/sell', purpose: 'Carry home-worth evidence into seller preparation.' },
      { label: 'Property Search', href: '/search', purpose: 'Review active alternatives as factual market context.' },
      { label: 'Market Context', href: '/market', purpose: 'Understand local evidence before discussing positioning.' },
      { label: 'Source Registry', href: '/sources', purpose: 'Check source status and claim eligibility.' },
      { label: 'Advisory Readiness', href: '/contact#advisory-readiness', purpose: 'Route unresolved questions to a professional discussion.' },
    ],
    protectedBoundaries: {
      automatedHomeValue: false,
      avm: false,
      appraisal: false,
      guaranteedSalePrice: false,
      definitiveListingPrice: false,
      expectedAppreciation: false,
      predictedBuyerDemand: false,
      predictedDaysOnMarket: false,
      guaranteedNetProceeds: false,
      valueCertainty: false,
      listingPriceRecommendation: false,
      saleOutcomePrediction: false,
      providerActivation: false,
      assessorRetrieval: false,
      taxRetrieval: false,
      permitRetrieval: false,
      bcodActivation: false,
      hiddenStateTransfer: false,
      crmEmail: false,
      persistence: false,
      telemetry: false,
      customerDataMutation: false,
    },
  };
}

export function buildAdvisoryPreparationIntelligenceModel(): AdvisoryPreparationIntelligenceModel {
  return {
    status: ADVISORY_HANDOFF_INTELLIGENCE_STATUS,
    governingQuestion: 'What have I learned, what remains unresolved, and what should I discuss with a professional next?',
    contexts: [
      {
        key: 'BUYING',
        label: 'Buying',
        knownEvidence: 'Search criteria, property facts, financing education, and comparison context may help frame buyer questions.',
        unresolved: 'Offer posture, affordability, lender qualification, inspections, insurance, title, and contract strategy remain professional-review items.',
        nextQuestion: 'What should be verified before moving from search context to a specific property decision?',
      },
      {
        key: 'SELLING',
        label: 'Selling',
        knownEvidence: 'Home-worth preparation, seller readiness, property evidence, and market context can organize the first seller discussion.',
        unresolved: 'Pricing strategy, preparation scope, disclosures, timing, appraisal risk, and negotiation posture require professional interpretation.',
        nextQuestion: 'Which evidence should be confirmed before making pricing or launch decisions?',
      },
      {
        key: 'PROPERTY_SPECIFIC',
        label: 'Property specific',
        knownEvidence: 'Visible facts, photos, listing fields, source posture, and deterministic property context can identify review questions.',
        unresolved: 'Records, condition, boundaries, permits, tax, HOA, title, environmental, drainage, soil, and structural questions may remain open.',
        nextQuestion: 'Which property facts need official source or specialist confirmation?',
      },
      {
        key: 'COMPARISON',
        label: 'Comparison',
        knownEvidence: 'Comparable property and market context can clarify differences a customer wants to discuss.',
        unresolved: 'Relative value, investment merit, ranking, outcome likelihood, and negotiation leverage are not determined by REIE.',
        nextQuestion: 'Which differences matter enough to review with a professional?',
      },
      {
        key: 'FINANCING',
        label: 'Financing',
        knownEvidence: 'Financing education and scenario framing can prepare lender questions.',
        unresolved: 'Qualification, approval, rate availability, loan terms, affordability, and tax consequences require qualified review.',
        nextQuestion: 'Which assumptions should go to a lender or tax professional before action?',
      },
      {
        key: 'PLACE_MARKET',
        label: 'Place and market',
        knownEvidence: 'City, neighborhood, and market surfaces can provide route-qualified context and source limitations.',
        unresolved: 'Suitability, safety, school quality, demographic fit, appreciation, and market-timing conclusions are not created here.',
        nextQuestion: 'Which local context should be verified before relying on it for a decision?',
      },
      {
        key: 'LINKED_BUY_SELL',
        label: 'Linked buy/sell',
        knownEvidence: 'Grand Plan and journey continuity can connect selling, buying, financing, timing, and advisory preparation.',
        unresolved: 'Sequencing, contingencies, cash flow, lender requirements, sale timing, and risk tolerance need professional review.',
        nextQuestion: 'What needs to be coordinated before one housing decision depends on another?',
      },
    ],
    professionalDomains: [
      {
        key: 'REAL_ESTATE_AGENT_DISCUSSION',
        label: 'Real estate agent discussion',
        routeBy: 'Market context, property evidence, pricing preparation, search alternatives, seller readiness, and transaction strategy questions.',
        bring: 'Property facts, market pages, comparison notes, timing goals, preparation concerns, and unresolved source limitations.',
        boundary: 'Advisory preparation does not create agency, representation, fiduciary duties, pricing certainty, or transaction instructions by itself.',
      },
      {
        key: 'LENDER_DISCUSSION',
        label: 'Lender discussion',
        routeBy: 'Financing assumptions, cash planning, pre-approval, payment sensitivity, contingencies, and buy/sell sequencing.',
        bring: 'Scenario questions, financing assumptions, timing needs, and lender-specific documentation questions.',
        boundary: 'REIE does not determine qualification, approval, affordability, rate availability, or loan terms.',
      },
      {
        key: 'INSPECTOR_ENGINEER_DISCUSSION',
        label: 'Inspector / engineer discussion',
        routeBy: 'Condition, structure, drainage, soil, environmental, systems, remodel, repair, or property-risk questions.',
        bring: 'Photos, visible facts, disclosure prompts, maintenance notes, year-built context, and unresolved condition questions.',
        boundary: 'REIE does not inspect, engineer, certify condition, or replace specialist review.',
      },
      {
        key: 'ATTORNEY_DISCUSSION',
        label: 'Attorney discussion',
        routeBy: 'Contract, title, easement, HOA, disclosure, boundary, legal-risk, or document-interpretation questions.',
        bring: 'The document type, open issue, transaction context, and the exact question that needs legal interpretation.',
        boundary: 'REIE does not provide legal advice, document interpretation, representation, or attorney-client relationship formation.',
      },
      {
        key: 'TAX_PROFESSIONAL_DISCUSSION',
        label: 'Tax professional discussion',
        routeBy: 'Tax basis, capital gains, property-tax, escrow, deduction, investment, or entity-ownership questions.',
        bring: 'Your tax question, timing, ownership facts, and any source records a qualified professional asks to review.',
        boundary: 'REIE does not provide tax advice, tax planning, tax filing guidance, or tax-professional relationship formation.',
      },
      {
        key: 'APPRAISER_DISCUSSION',
        label: 'Appraiser discussion',
        routeBy: 'Formal valuation, lender appraisal, estate, divorce, tax appeal, litigation, or documented opinion-of-value needs.',
        bring: 'Property facts, comparable questions, intended use, effective date questions, and any required professional appraisal scope.',
        boundary: 'REIE does not create an appraisal, appraiser relationship, appraisal conclusion, or formal opinion of value.',
      },
    ],
    protectedBoundaries: {
      hiddenSearchTransfer: false,
      hiddenComparisonTransfer: false,
      hiddenFinancingTransfer: false,
      hiddenGrandPlanTransfer: false,
      hiddenSellerTransfer: false,
      inferredIntentTransfer: false,
      browsingBehaviorTransfer: false,
      protectedClassDataTransfer: false,
      newRequiredFields: false,
      contactMutation: false,
      propertyInquiryMutation: false,
      crmEmail: false,
      scheduling: false,
      leadScoring: false,
      telemetry: false,
      brokerageRelationship: false,
      agencyRelationship: false,
      representation: false,
      fiduciaryRelationship: false,
      lenderRelationship: false,
      legalRelationship: false,
      taxAdvisoryRelationship: false,
      appraisalRelationship: false,
      providerActivation: false,
    },
  };
}
