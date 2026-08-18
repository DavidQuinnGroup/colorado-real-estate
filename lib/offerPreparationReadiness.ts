import type { PropertyEvidenceCompletenessState } from './propertyEvidenceCompletenessVerification';
import type { PropertyProduct31Model } from './propertyProduct31';

export const OFFER_PREPARATION_READINESS_STATUS = 'OFFER_PREPARATION_READINESS_IMPLEMENTED' as const;

export type OfferPreparationStageKey = 'UNDERSTAND' | 'COMPARE' | 'VERIFY' | 'PREPARE' | 'NEXT_STEP';

export type OfferPreparationInput = {
  propertyLabel: string;
  searchHref: string;
  compareHref: string;
  financingHref: string;
  grandPlanHref: string;
  sourcesHref: '/sources';
  inquiryHref: string;
  productModel: PropertyProduct31Model;
};

export type OfferPreparationStage = {
  key: OfferPreparationStageKey;
  label: string;
  question: string;
  evidenceState: PropertyEvidenceCompletenessState | 'CUSTOMER CONTROLLED';
  guidance: string;
  action: string;
  href: string;
};

export type OfferPreparationReadiness = {
  status: typeof OFFER_PREPARATION_READINESS_STATUS;
  governingQuestion: 'What should I verify and discuss before deciding whether and how to pursue this property?';
  propertyLabel: string;
  stages: OfferPreparationStage[];
  evidenceLimits: string[];
  verificationDomains: string[];
  continuityLinks: Array<{
    label: 'Search' | 'Compare' | 'Financing readiness' | 'Grand Plan' | 'Sources' | 'Property Inquiry';
    href: string;
    role: string;
  }>;
  sourceTrustBoundaries: [
    'MORE AVAILABLE DATA DOES NOT MEAN A BETTER PROPERTY',
    'SOURCE AVAILABILITY DOES NOT EQUAL PROPERTY QUALITY',
    'MISSING COUNTY DATA DOES NOT EQUAL NEGATIVE PROPERTY CONDITION',
  ];
  prohibitedOutputs: {
    offerPrice: false;
    bidRecommendation: false;
    escalationAmount: false;
    acceptancePrediction: false;
    negotiationStrategy: false;
    contractLanguage: false;
    offerForm: false;
    offerSubmission: false;
    valuation: false;
    appraisal: false;
    rankingWinner: false;
    suitabilityConclusion: false;
    investmentConclusion: false;
    legalAdvice: false;
    taxAdvice: false;
    lenderAdvice: false;
    financingApproval: false;
    lenderMatching: false;
    automatedRecommendation: false;
  };
  protectedBoundaries: {
    hiddenCustomerState: false;
    persistence: false;
    api: false;
    authentication: false;
    crm: false;
    email: false;
    telemetry: false;
    mls: false;
    typesense: false;
    providerActivation: false;
    countyActivation: false;
    publicGis: false;
    localStorage: false;
    sessionStorage: false;
    protectedClassInference: false;
    demographicSteering: false;
    schoolRanking: false;
    safetyRanking: false;
    neighborhoodSuitability: false;
  };
};

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function buildOfferPreparationReadiness(input: OfferPreparationInput): OfferPreparationReadiness {
  const verificationDomains = unique(
    input.productModel.evidenceCompleteness.domains
      .filter((domain) => domain.state !== 'SUPPORTED FACT')
      .map((domain) => domain.label),
  );
  const missingDomainCount = verificationDomains.length;
  const comparisonReady = input.productModel.comparisonIntelligence.canCompare;
  const profileEvidence = input.productModel.profile.some((item) => item.state === 'incomplete' || item.state === 'verify-next')
    ? 'VERIFICATION REQUIRED'
    : 'SUPPORTED FACT';

  return {
    status: OFFER_PREPARATION_READINESS_STATUS,
    governingQuestion: 'What should I verify and discuss before deciding whether and how to pursue this property?',
    propertyLabel: input.propertyLabel,
    stages: [
      {
        key: 'UNDERSTAND',
        label: 'Understand',
        question: 'Which facts are supported, calculated, missing, or professional-review bound?',
        evidenceState: profileEvidence,
        guidance:
          'Start from visible listing facts, Property DNA, confidence facets, and evidence-completeness states. Treat unavailable or conflicted evidence as verification work, not as a property conclusion.',
        action: 'Review property evidence',
        href: '#property-decision-profile',
      },
      {
        key: 'COMPARE',
        label: 'Compare',
        question: 'Which alternatives or market context should frame the next question?',
        evidenceState: comparisonReady ? 'DERIVED / CALCULATED' : 'VERIFICATION REQUIRED',
        guidance:
          'Use comparison and market context to identify factual differences and evidence asymmetry. Do not turn comparison into a winner, ranking, valuation, or suitability conclusion.',
        action: 'Open comparison context',
        href: input.compareHref,
      },
      {
        key: 'VERIFY',
        label: 'Verify',
        question: 'Which records, assumptions, and professional questions must be checked before relying on the property?',
        evidenceState: missingDomainCount > 0 ? 'VERIFICATION REQUIRED' : 'PROFESSIONAL JUDGMENT',
        guidance:
          'Organize property records, permits, condition, HOA, title, insurance, tax, and financing assumptions for the appropriate source or professional before relying on them.',
        action: 'Review verification checklist',
        href: '#property-verification-checklist',
      },
      {
        key: 'PREPARE',
        label: 'Prepare',
        question: 'Which topics belong with a real-estate professional, lender, inspector, title or closing professional, attorney, or tax professional?',
        evidenceState: 'PROFESSIONAL JUDGMENT',
        guidance:
          'Prepare questions and documents for the right professional conversation. This product organizes topics only; it does not provide professional advice.',
        action: 'Prepare property inquiry',
        href: input.inquiryHref,
      },
      {
        key: 'NEXT_STEP',
        label: 'Next Step',
        question: 'What customer-controlled path should continue the decision?',
        evidenceState: 'CUSTOMER CONTROLLED',
        guidance:
          'Continue through Search, comparison, financing education, Grand Plan, Sources, or a property inquiry. No hidden state or unsubmitted customer context is transferred.',
        action: 'Choose next path',
        href: input.searchHref,
      },
    ],
    evidenceLimits: [
      'Public listing facts and existing REIE presentation contracts are orientation, not complete diligence.',
      'Calculated fields depend on visible listing inputs and remain derived context.',
      'Unavailable tax, permit, assessor, HOA, title, insurance, condition, and financing details remain verification required.',
      'Missing evidence is neutral and must not be treated as negative property condition.',
    ],
    verificationDomains,
    continuityLinks: [
      { label: 'Search', href: input.searchHref, role: 'Return to visible listing context.' },
      { label: 'Compare', href: input.compareHref, role: 'Review neutral comparison context.' },
      { label: 'Financing readiness', href: input.financingHref, role: 'Prepare lender and ownership-cost questions.' },
      { label: 'Grand Plan', href: input.grandPlanHref, role: 'Keep the decision connected to the broader plan.' },
      { label: 'Sources', href: input.sourcesHref, role: 'Review source and methodology boundaries.' },
      { label: 'Property Inquiry', href: input.inquiryHref, role: 'Ask a customer-controlled property question.' },
    ],
    sourceTrustBoundaries: [
      'MORE AVAILABLE DATA DOES NOT MEAN A BETTER PROPERTY',
      'SOURCE AVAILABILITY DOES NOT EQUAL PROPERTY QUALITY',
      'MISSING COUNTY DATA DOES NOT EQUAL NEGATIVE PROPERTY CONDITION',
    ],
    prohibitedOutputs: {
      offerPrice: false,
      bidRecommendation: false,
      escalationAmount: false,
      acceptancePrediction: false,
      negotiationStrategy: false,
      contractLanguage: false,
      offerForm: false,
      offerSubmission: false,
      valuation: false,
      appraisal: false,
      rankingWinner: false,
      suitabilityConclusion: false,
      investmentConclusion: false,
      legalAdvice: false,
      taxAdvice: false,
      lenderAdvice: false,
      financingApproval: false,
      lenderMatching: false,
      automatedRecommendation: false,
    },
    protectedBoundaries: {
      hiddenCustomerState: false,
      persistence: false,
      api: false,
      authentication: false,
      crm: false,
      email: false,
      telemetry: false,
      mls: false,
      typesense: false,
      providerActivation: false,
      countyActivation: false,
      publicGis: false,
      localStorage: false,
      sessionStorage: false,
      protectedClassInference: false,
      demographicSteering: false,
      schoolRanking: false,
      safetyRanking: false,
      neighborhoodSuitability: false,
    },
  };
}
