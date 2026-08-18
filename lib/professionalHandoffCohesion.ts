import { buildReieDecisionIntelligenceCohesionProfile, type ReieDecisionCohesionSurface } from './reieDecisionIntelligenceCohesion';

export const REIE_PROFESSIONAL_HANDOFF_COHESION_STATUS = 'REIE_PROFESSIONAL_HANDOFF_COHESION_IMPLEMENTED';

export type ProfessionalHandoffSurface = Extract<ReieDecisionCohesionSurface, 'search' | 'property' | 'contact'> | 'advisory';

export type ProfessionalDomain =
  | 'REAL ESTATE AGENT'
  | 'LENDER'
  | 'INSPECTOR / ENGINEER'
  | 'ATTORNEY'
  | 'TAX PROFESSIONAL'
  | 'APPRAISER';

export type ProfessionalHandoffCohesionProfile = {
  status: typeof REIE_PROFESSIONAL_HANDOFF_COHESION_STATUS;
  surface: ProfessionalHandoffSurface;
  sourceMethodologyHref: '/sources';
  evidenceLabels: ['UNAVAILABLE', 'VERIFICATION REQUIRED', 'PROFESSIONAL JUDGMENT'];
  standard: {
    whatReieCanSupport: string;
    whatRemainsUnresolved: string;
    whoMayHelp: ProfessionalDomain[];
    whatToAsk: string[];
    optionalNextAction: string;
  };
  protectedBoundaries: {
    hiddenTransfer: false;
    contactApiMutation: false;
    propertyInquiryApiMutation: false;
    crmEmailExpansion: false;
    newRequiredFields: false;
    hiddenFields: false;
    persistence: false;
    telemetry: false;
    brokerageRelationshipFormation: false;
    professionalConclusion: false;
    providerActivation: false;
    customerDataExpansion: false;
  };
};

const protectedBoundaries: ProfessionalHandoffCohesionProfile['protectedBoundaries'] = {
  hiddenTransfer: false,
  contactApiMutation: false,
  propertyInquiryApiMutation: false,
  crmEmailExpansion: false,
  newRequiredFields: false,
  hiddenFields: false,
  persistence: false,
  telemetry: false,
  brokerageRelationshipFormation: false,
  professionalConclusion: false,
  providerActivation: false,
  customerDataExpansion: false,
};

const profileBySurface: Record<ProfessionalHandoffSurface, ProfessionalHandoffCohesionProfile['standard']> = {
  search: {
    whatReieCanSupport: 'Search can help compare visible listings, criteria, list context, and map context before one property deserves closer review.',
    whatRemainsUnresolved: 'Condition, records, costs, HOA, insurance, taxes, title, financing, and whether a property is right for you remain unresolved from Search alone.',
    whoMayHelp: ['REAL ESTATE AGENT', 'LENDER', 'INSPECTOR / ENGINEER', 'ATTORNEY', 'TAX PROFESSIONAL', 'APPRAISER'],
    whatToAsk: [
      'Which homes should I inspect further based on visible criteria rather than ranking?',
      'Which facts need source or professional verification before I rely on this property?',
      'Should I keep researching, compare options, verify evidence, or ask a professional?',
    ],
    optionalNextAction: 'Open a Property view, refine Search, compare market context, or choose Contact only when you want to start a conversation.',
  },
  property: {
    whatReieCanSupport: 'Property can organize public listing facts, property intelligence, source limits, comparison context, and inquiry preparation.',
    whatRemainsUnresolved: 'Records, physical condition, measurements, costs, financing terms, title, HOA, insurance, tax, legal, and valuation questions remain verification-bound.',
    whoMayHelp: ['REAL ESTATE AGENT', 'LENDER', 'INSPECTOR / ENGINEER', 'ATTORNEY', 'TAX PROFESSIONAL', 'APPRAISER'],
    whatToAsk: [
      'Which listing facts and records should be confirmed before touring or writing?',
      'Which condition, cost, title, HOA, insurance, tax, financing, or appraisal questions need review?',
      'Is this a property-specific inquiry, Advisory preparation, continued comparison, or general Contact question?',
    ],
    optionalNextAction: 'Use Property Inquiry for this address, continue comparing, prepare Advisory questions, or choose Contact for a broader conversation.',
  },
  advisory: {
    whatReieCanSupport: 'Advisory can turn visible REIE research into organized evidence, assumptions, unknowns, and professional questions.',
    whatRemainsUnresolved: 'The professional judgment, documents, property details, financing review, legal review, tax review, inspection, and appraisal conclusions remain outside REIE.',
    whoMayHelp: ['REAL ESTATE AGENT', 'LENDER', 'INSPECTOR / ENGINEER', 'ATTORNEY', 'TAX PROFESSIONAL', 'APPRAISER'],
    whatToAsk: [
      'What evidence is available, unavailable, stale, conflicting, or verification-required?',
      'Which professional domain should review each unresolved question?',
      'What should I prepare before I choose whether to begin Contact?',
    ],
    optionalNextAction: 'Continue preparation, return to the route that owns the evidence, or choose Contact when the question is ready.',
  },
  contact: {
    whatReieCanSupport: 'Contact can explain the safest public path for starting a conversation without collecting hidden route context.',
    whatRemainsUnresolved: 'Customer intent, representation status, professional scope, private facts, documents, and relationship terms remain unresolved until discussed.',
    whoMayHelp: ['REAL ESTATE AGENT', 'LENDER', 'INSPECTOR / ENGINEER', 'ATTORNEY', 'TAX PROFESSIONAL', 'APPRAISER'],
    whatToAsk: [
      'Is this property-specific, advisory preparation, continued research, comparison, or a general conversation?',
      'Which unresolved facts should I bring manually and which should stay private until disclosures are discussed?',
      'Which professional may help verify or interpret the question?',
    ],
    optionalNextAction: 'Choose the existing path that matches the question; Contact is optional and does not automatically receive REIE state.',
  },
};

function toDecisionSurface(surface: ProfessionalHandoffSurface): ReieDecisionCohesionSurface {
  return surface === 'advisory' ? 'contact' : surface;
}

export function buildProfessionalHandoffCohesionProfile(surface: ProfessionalHandoffSurface): ProfessionalHandoffCohesionProfile {
  const decisionProfile = buildReieDecisionIntelligenceCohesionProfile(toDecisionSurface(surface));

  return {
    status: REIE_PROFESSIONAL_HANDOFF_COHESION_STATUS,
    surface,
    sourceMethodologyHref: decisionProfile.sourceMethodologyHref,
    evidenceLabels: ['UNAVAILABLE', 'VERIFICATION REQUIRED', 'PROFESSIONAL JUDGMENT'],
    standard: profileBySurface[surface],
    protectedBoundaries,
  };
}
