import type { PropertyProduct31ChecklistItem } from './propertyProduct31';
import type { PropertyGeographicSourceIntelligence } from './property/propertyAuthoritativeSourceIntelligence';
import type { PropertyComparisonWorkspace } from './propertyComparisonIntelligence';
import type { PropertyIntelligenceDeepening } from './sellerPropertyIntelligenceAdvancement';

export const PROPERTY_INQUIRY_PREPARATION_INTELLIGENCE_STATUS = 'PROPERTY_INQUIRY_PREPARATION_INTELLIGENCE_IMPLEMENTED';
export const DECISION_JOURNEY_CONTINUITY_DEEPENING_STATUS = 'DECISION_JOURNEY_CONTINUITY_DEEPENED';
export const PROPERTY_INQUIRY_DECISION_CONTINUITY_STATUS = 'PROPERTY_INQUIRY_DECISION_CONTINUITY_IMPLEMENTED';

export type PropertyInquiryPreparationCategoryKey =
  | 'PROPERTY_FACTS'
  | 'DERIVED_CONTEXT'
  | 'SOURCE_EVIDENCE_POSTURE'
  | 'UNVERIFIED_UNAVAILABLE'
  | 'QUESTIONS_TO_CONSIDER';

export type PropertyInquiryProfessionalDomain =
  | 'REAL_ESTATE_AGENT'
  | 'LENDER'
  | 'INSPECTOR_ENGINEER'
  | 'ATTORNEY'
  | 'TAX_PROFESSIONAL'
  | 'APPRAISER';

export type PropertyInquiryPreparationCategory = {
  key: PropertyInquiryPreparationCategoryKey;
  label: string;
  known: string;
  usefulAsk: string;
  verification: string;
  professionalDomain: PropertyInquiryProfessionalDomain;
  href: string;
};

export type PropertyInquiryPreparationIntelligence = {
  status: typeof PROPERTY_INQUIRY_PREPARATION_INTELLIGENCE_STATUS;
  governingQuestion: string;
  relationship: 'SOURCE_EVIDENCE_PROPERTY_INTELLIGENCE_PRE_INQUIRY_PREPARATION_USER_CONTROLLED_INQUIRY';
  categories: PropertyInquiryPreparationCategory[];
  protectedBoundaries: {
    apiMutation: false;
    requiredFieldExpansion: false;
    hiddenPayloadExpansion: false;
    autoPopulateNotes: false;
    crmEmailChange: false;
    persistenceChange: false;
    notificationChange: false;
    propertyAnalysisTransfer: false;
    comparisonStateTransfer: false;
    financingAssumptionTransfer: false;
    grandPlanStateTransfer: false;
    browsingHistoryTransfer: false;
    leadMetadataExpansion: false;
    relationshipFormation: false;
    valuationCertainty: false;
    financialQualification: false;
    providerActivation: false;
    telemetry: false;
    customerDataExpansion: false;
  };
};

export type PropertyInquiryPreparationInput = {
  deepening: PropertyIntelligenceDeepening;
  authoritativeSources: PropertyGeographicSourceIntelligence;
  comparisonIntelligence: PropertyComparisonWorkspace;
  checklist: readonly PropertyProduct31ChecklistItem[];
};

export type DecisionJourneyContinuityAction = {
  label: string;
  currentDecision: string;
  nextQuestion: string;
  tool: string;
  href: string;
  professionalHandoff: string;
};

export type DecisionJourneyContinuityDeepening = {
  status: typeof DECISION_JOURNEY_CONTINUITY_DEEPENING_STATUS;
  governingQuestion: string;
  standard: 'CURRENT_DECISION_RELEVANT_NEXT_QUESTION_RELEVANT_REIE_TOOL_OPTIONAL_PROFESSIONAL_HANDOFF';
  primaryActions: DecisionJourneyContinuityAction[];
  preservedAlternatives: string[];
  protectedBoundaries: {
    hiddenStateTransfer: false;
    profiling: false;
    personalization: false;
    browsingHistoryTransfer: false;
    comparisonStateTransfer: false;
    financingStateTransfer: false;
    crmStateTransfer: false;
    telemetryExpansion: false;
    propertyRanking: false;
    neighborhoodRanking: false;
    suitabilityScoring: false;
    investmentScoring: false;
    protectedClassInference: false;
    demographicSteering: false;
    schoolRanking: false;
    safetyRanking: false;
    valuationCertainty: false;
    financialQualification: false;
  };
};

function summarizeSourcePosture(input: PropertyInquiryPreparationInput) {
  const claimEligible = input.authoritativeSources.selectedSources.filter((source) => source.claimEligible).length;
  const totalSources = input.authoritativeSources.selectedSources.length;
  return `${claimEligible} of ${totalSources} source context areas are currently claim-eligible; record-sensitive items remain verification-bound.`;
}

function summarizeUnavailable(input: PropertyInquiryPreparationInput) {
  const unavailableFacts = input.deepening.evidenceProfile.unavailableFacts;
  const sourcePending = input.deepening.evidenceProfile.sourceConfirmationPending;
  return `${unavailableFacts} unavailable fact categories and ${sourcePending} source-confirmation items should stay framed as questions.`;
}

export function buildPropertyInquiryPreparationIntelligence(
  input: PropertyInquiryPreparationInput,
): PropertyInquiryPreparationIntelligence {
  const comparisonLabel = input.comparisonIntelligence.canCompare
    ? 'Factual comparison context is available from related public listings.'
    : 'Comparison remains available through search and market context when related listings are limited.';

  return {
    status: PROPERTY_INQUIRY_PREPARATION_INTELLIGENCE_STATUS,
    governingQuestion: 'What do I know about this property, what remains uncertain, and what would be useful to ask before I contact someone about it?',
    relationship: 'SOURCE_EVIDENCE_PROPERTY_INTELLIGENCE_PRE_INQUIRY_PREPARATION_USER_CONTROLLED_INQUIRY',
    categories: [
      {
        key: 'PROPERTY_FACTS',
        label: 'Property facts',
        known: `${input.deepening.evidenceProfile.knownPublicFacts} public fact categories are available for first-pass review.`,
        usefulAsk: 'Ask which listing facts, measurements, inclusions, or status details should be confirmed before relying on them.',
        verification: 'Confirm listing fields, measurements, status, included features, and updates with the appropriate property professional.',
        professionalDomain: 'REAL_ESTATE_AGENT',
        href: '#property-facts',
      },
      {
        key: 'DERIVED_CONTEXT',
        label: 'Derived context',
        known: `${input.deepening.evidenceProfile.derivedFacts} derived context categories organize the public facts without adding a conclusion.`,
        usefulAsk: `${comparisonLabel} Ask which differences matter enough to inspect, compare, or discuss.`,
        verification: 'Use derived context as a prompt for comparison, not as a valuation, appraisal, lending, or condition finding.',
        professionalDomain: 'APPRAISER',
        href: '#property-comparable-context',
      },
      {
        key: 'SOURCE_EVIDENCE_POSTURE',
        label: 'Source / evidence posture',
        known: summarizeSourcePosture(input),
        usefulAsk: 'Ask which assessor, tax, permit, HOA, insurance, or listing-source records should be checked before next steps.',
        verification: 'Keep source freshness, jurisdiction, and record correlation explicit until confirmed through authorized channels.',
        professionalDomain: 'ATTORNEY',
        href: '#property-source-readiness',
      },
      {
        key: 'UNVERIFIED_UNAVAILABLE',
        label: 'Unverified / unavailable',
        known: summarizeUnavailable(input),
        usefulAsk: 'Ask what remains unavailable on the page and which professional should verify the missing or uncertain item.',
        verification: 'Do not treat missing records, condition, drainage, structure, title, tax, insurance, or financing details as resolved.',
        professionalDomain: 'INSPECTOR_ENGINEER',
        href: '#property-verification-checklist',
      },
      {
        key: 'QUESTIONS_TO_CONSIDER',
        label: 'Questions to consider',
        known: `${input.checklist.length} checklist categories are available to shape a focused inquiry.`,
        usefulAsk: 'Ask only the question you want to share; the inquiry form does not copy this page context into the submission.',
        verification: 'Route tax, lending, inspection, legal, appraisal, and brokerage questions to the appropriate professional.',
        professionalDomain: 'LENDER',
        href: '#property-contact',
      },
    ],
    protectedBoundaries: {
      apiMutation: false,
      requiredFieldExpansion: false,
      hiddenPayloadExpansion: false,
      autoPopulateNotes: false,
      crmEmailChange: false,
      persistenceChange: false,
      notificationChange: false,
      propertyAnalysisTransfer: false,
      comparisonStateTransfer: false,
      financingAssumptionTransfer: false,
      grandPlanStateTransfer: false,
      browsingHistoryTransfer: false,
      leadMetadataExpansion: false,
      relationshipFormation: false,
      valuationCertainty: false,
      financialQualification: false,
      providerActivation: false,
      telemetry: false,
      customerDataExpansion: false,
    },
  };
}

export function buildDecisionJourneyContinuityDeepening(): DecisionJourneyContinuityDeepening {
  return {
    status: DECISION_JOURNEY_CONTINUITY_DEEPENING_STATUS,
    governingQuestion: "After learning something here, is the customer's next useful REIE action clear?",
    standard: 'CURRENT_DECISION_RELEVANT_NEXT_QUESTION_RELEVANT_REIE_TOOL_OPTIONAL_PROFESSIONAL_HANDOFF',
    primaryActions: [
      {
        label: 'Compare evidence',
        currentDecision: 'The property facts are understood enough to compare.',
        nextQuestion: 'Which public differences are worth carrying into the next comparison?',
        tool: 'Property comparable context',
        href: '#property-comparable-context',
        professionalHandoff: 'Use an appraiser or real estate professional when comparison becomes valuation-sensitive.',
      },
      {
        label: 'Verify sources',
        currentDecision: 'The property raises source, record, or condition questions.',
        nextQuestion: 'Which evidence is missing, aging, or not claim-eligible yet?',
        tool: 'Source readiness and verification checklist',
        href: '#property-source-readiness',
        professionalHandoff: 'Use inspector, engineer, attorney, tax, insurance, or records professionals for domain-specific verification.',
      },
      {
        label: 'Ask with context',
        currentDecision: 'A property-specific question is ready for human follow-up.',
        nextQuestion: 'What do I want to type and share before someone contacts me?',
        tool: 'Property Inquiry',
        href: '#property-contact',
        professionalHandoff: 'Use brokerage follow-up for property-specific conversation after disclosures and relationship boundaries are clear.',
      },
    ],
    preservedAlternatives: ['Search', 'Market/Place', 'Financing', 'Advisory', 'Grand Plan', 'Sources'],
    protectedBoundaries: {
      hiddenStateTransfer: false,
      profiling: false,
      personalization: false,
      browsingHistoryTransfer: false,
      comparisonStateTransfer: false,
      financingStateTransfer: false,
      crmStateTransfer: false,
      telemetryExpansion: false,
      propertyRanking: false,
      neighborhoodRanking: false,
      suitabilityScoring: false,
      investmentScoring: false,
      protectedClassInference: false,
      demographicSteering: false,
      schoolRanking: false,
      safetyRanking: false,
      valuationCertainty: false,
      financialQualification: false,
    },
  };
}
