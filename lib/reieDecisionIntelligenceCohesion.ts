export const REIE_DECISION_INTELLIGENCE_COHESION_STATUS = 'REIE_DECISION_INTELLIGENCE_COHESION_IMPLEMENTED';

export type ReieDecisionCohesionSurface =
  | 'home'
  | 'search'
  | 'market'
  | 'compare'
  | 'city'
  | 'property'
  | 'neighborhood'
  | 'buyer'
  | 'seller'
  | 'financing'
  | 'grand-plan'
  | 'home-worth'
  | 'contact';

export type ReieCustomerEvidenceCue = {
  label: 'Supported fact' | 'Derived / calculated' | 'Assumption' | 'Unavailable' | 'Verification required' | 'Professional judgment';
  body: string;
};

export type ReieDecisionCohesionProfile = {
  status: typeof REIE_DECISION_INTELLIGENCE_COHESION_STATUS;
  surface: ReieDecisionCohesionSurface;
  evidenceLanguageModel: 'CUSTOMER_FACING_EVIDENCE_LANGUAGE';
  continuationModel: 'CURRENT_DECISION_NEXT_QUESTION_RELEVANT_TOOL_OPTIONAL_HANDOFF';
  sourceMethodologyHref: '/sources';
  cues: ReieCustomerEvidenceCue[];
  boundary: string;
  protectedBoundaries: {
    hiddenStateTransfer: false;
    personalization: false;
    telemetry: false;
    providerActivation: false;
    sourceRegistryChange: false;
    ranking: false;
    valuationConclusion: false;
    financialQualification: false;
    suitabilityConclusion: false;
  };
};

const standardBoundary =
  'Use this context to decide the next question. It does not rank places or properties, produce a value conclusion, qualify financing, or replace source and professional review.';

const defaultCues: ReieCustomerEvidenceCue[] = [
  {
    label: 'Supported fact',
    body: 'Shown when the current page has visible public context or certified product evidence for the claim.',
  },
  {
    label: 'Verification required',
    body: 'Shown when the next useful step depends on records, professionals, condition review, lender review, or customer-supplied facts.',
  },
  {
    label: 'Professional judgment',
    body: 'Shown when a real estate, lending, tax, legal, inspection, insurance, or appraisal question should move to the appropriate professional.',
  },
];

const surfaceCueOverrides: Partial<Record<ReieDecisionCohesionSurface, ReieCustomerEvidenceCue[]>> = {
  buyer: [
    {
      label: 'Assumption',
      body: 'Budget, timing, criteria, financing readiness, and tradeoffs remain preparation assumptions until reviewed against a lender, property, and transaction.',
    },
    {
      label: 'Verification required',
      body: 'Lender terms, property facts, taxes, insurance, HOA, title, inspection, and contract details need source or professional review.',
    },
    defaultCues[2],
  ],
  seller: [
    {
      label: 'Supported fact',
      body: 'Seller preparation can use visible market, inventory, property, and home-worth context as starting evidence.',
    },
    {
      label: 'Assumption',
      body: 'Condition, preparation impact, pricing posture, buyer response, and timing remain assumptions until the property and market are reviewed together.',
    },
    defaultCues[2],
  ],
  'home-worth': [
    {
      label: 'Derived / calculated',
      body: 'Home-worth context organizes value drivers and preparation questions without publishing an automated valuation or appraisal.',
    },
    {
      label: 'Verification required',
      body: 'Condition, improvements, buyer alternatives, tax, insurance, timing, and final pricing strategy require direct review.',
    },
    defaultCues[2],
  ],
  compare: [
    {
      label: 'Supported fact',
      body: 'Comparison uses certified market guides and visible decision dimensions, not customer-specific weighting.',
    },
    {
      label: 'Unavailable',
      body: 'The workspace does not know a customer shortlist, protected characteristics, lifestyle score, or the right city for a person.',
    },
    defaultCues[1],
  ],
  property: [
    {
      label: 'Supported fact',
      body: 'Property pages separate visible listing facts from derived context, unavailable facts, source posture, and inquiry preparation.',
    },
    {
      label: 'Verification required',
      body: 'Records, condition, measurements, costs, HOA, insurance, title, inspection, and professional conclusions remain verification-bound.',
    },
    defaultCues[2],
  ],
  'grand-plan': [
    {
      label: 'Assumption',
      body: 'Priorities and routines are planning inputs until they are tested against search, property, market, and advisory evidence.',
    },
    {
      label: 'Unavailable',
      body: 'The plan does not know outcomes, suitability, rankings, or private context that the customer has not chosen to share.',
    },
    defaultCues[1],
  ],
  contact: [
    {
      label: 'Supported fact',
      body: 'Contact can route a customer toward the right conversation path after evidence and questions are organized.',
    },
    {
      label: 'Professional judgment',
      body: 'A focused conversation is where brokerage, lending, tax, legal, inspection, insurance, and appraisal questions can be directed appropriately.',
    },
    defaultCues[1],
  ],
};

export function buildReieDecisionIntelligenceCohesionProfile(surface: ReieDecisionCohesionSurface): ReieDecisionCohesionProfile {
  return {
    status: REIE_DECISION_INTELLIGENCE_COHESION_STATUS,
    surface,
    evidenceLanguageModel: 'CUSTOMER_FACING_EVIDENCE_LANGUAGE',
    continuationModel: 'CURRENT_DECISION_NEXT_QUESTION_RELEVANT_TOOL_OPTIONAL_HANDOFF',
    sourceMethodologyHref: '/sources',
    cues: surfaceCueOverrides[surface] ?? defaultCues,
    boundary: standardBoundary,
    protectedBoundaries: {
      hiddenStateTransfer: false,
      personalization: false,
      telemetry: false,
      providerActivation: false,
      sourceRegistryChange: false,
      ranking: false,
      valuationConclusion: false,
      financialQualification: false,
      suitabilityConclusion: false,
    },
  };
}
