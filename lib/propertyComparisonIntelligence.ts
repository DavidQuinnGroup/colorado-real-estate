import { buildFinancingScenario, type FinancingScenarioInput, type FinancingScenarioResult } from './financingScenarioCalculator.js';

export const PROPERTY_COMPARISON_INTELLIGENCE_STATUS = 'PROPERTY_COMPARISON_INTELLIGENCE_IMPLEMENTED';
export const PROPERTY_COMPARISON_INTELLIGENCE_VERSION = '1.0.0';

export type PropertyComparisonInput = {
  id: string;
  address: string;
  city?: string | null;
  state?: string | null;
  neighborhood?: string | null;
  price?: number | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  lotSize?: number | null;
  yearBuilt?: number | null;
  propertyType?: string | null;
  status?: string | null;
};

export type PropertyComparisonFactState = 'materially-different' | 'broadly-similar' | 'evidence-unavailable' | 'verification-required';
export type PropertyComparisonEvidenceIntegrityState =
  | 'SUPPORTED DIFFERENCE'
  | 'DERIVED / CALCULATED DIFFERENCE'
  | 'EVIDENCE ASYMMETRY'
  | 'UNAVAILABLE COMPARISON'
  | 'VERIFICATION REQUIRED'
  | 'PROFESSIONAL JUDGMENT';

export type PropertyComparisonVerificationAction =
  | 'CHECK SOURCE'
  | 'VERIFY WITH COUNTY'
  | 'REVIEW HOA DOCUMENTS'
  | 'ASK SELLER / LISTING AGENT'
  | 'DISCUSS WITH INSPECTOR'
  | 'DISCUSS WITH LENDER'
  | 'DISCUSS WITH ATTORNEY'
  | 'DISCUSS WITH TAX PROFESSIONAL'
  | 'DISCUSS WITH APPRAISER';

export type PropertyComparisonDimension = {
  key: 'price' | 'pricePerSquareFoot' | 'beds' | 'baths' | 'sqft' | 'lotSize' | 'yearBuilt' | 'propertyType' | 'status' | 'place' | 'financingScenario';
  label: string;
  state: PropertyComparisonFactState;
  evidence: string;
  evidenceIntegrity: PropertyComparisonEvidenceIntegrityState;
  evidenceBasis: 'KNOWN PROPERTY FACT' | 'USER ASSUMPTION' | 'CALCULATED ESTIMATE' | 'UNAVAILABLE / UNVERIFIED COST';
  comparisonLimitation: string;
  verificationAction: PropertyComparisonVerificationAction;
  subjectValue: string;
  comparisonValue: string;
  investigationPrompt: string;
};

export type PropertyComparisonIntegrityLimitation = {
  domain:
    | 'public records'
    | 'tax'
    | 'permit'
    | 'HOA'
    | 'condition / inspection'
    | 'title / legal'
    | 'financing assumptions';
  state: PropertyComparisonEvidenceIntegrityState;
  limitation: string;
  verificationAction: PropertyComparisonVerificationAction;
};

export type PropertyComparisonItem = {
  propertyId: string;
  address: string;
  href: string;
  headline: string;
  dimensions: PropertyComparisonDimension[];
  integrity: {
    headline: string;
    evidenceAsymmetry: string;
    decisionDifferenceSummary: string;
    limitations: PropertyComparisonIntegrityLimitation[];
  };
  synthesis: {
    materiallyDifferent: number;
    broadlySimilar: number;
    evidenceUnavailable: number;
    verificationRequired: number;
    supportedDifference: number;
    derivedCalculatedDifference: number;
    evidenceAsymmetry: number;
    unavailableComparison: number;
    professionalJudgment: number;
  };
  financingScenario?: FinancingScenarioResult;
};

export type PropertyComparisonWorkspace = {
  status: typeof PROPERTY_COMPARISON_INTELLIGENCE_STATUS;
  version: typeof PROPERTY_COMPARISON_INTELLIGENCE_VERSION;
  subject: PropertyComparisonInput;
  canCompare: boolean;
  comparisons: PropertyComparisonItem[];
  trustBoundary: string;
  sourceMethodologyHref: '/sources';
  evidenceAsymmetryBoundary: string;
  protectedBoundaries: {
    ranking: false;
    scoring: false;
    valuation: false;
    investmentAdvice: false;
    suitabilityRecommendation: false;
    fairHousingPreference: false;
    financingApproval: false;
    lenderQuote: false;
    providerActivation: false;
    persistence: false;
    telemetry: false;
  };
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function hasNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function formatCurrency(value: number | null | undefined) {
  return hasNumber(value) ? currencyFormatter.format(value) : 'not provided';
}

function formatNumber(value: number | null | undefined, suffix = '') {
  return hasNumber(value) ? `${value.toLocaleString('en-US')}${suffix}` : 'not provided';
}

function formatText(value: string | null | undefined) {
  return value?.trim() || 'not provided';
}

function pricePerSquareFoot(property: PropertyComparisonInput) {
  if (!hasNumber(property.price) || !hasNumber(property.sqft) || property.sqft <= 0) return null;
  return Math.round(property.price / property.sqft);
}

function getAvailabilityIntegrity(subjectAvailable: boolean, comparisonAvailable: boolean, derived = false): PropertyComparisonEvidenceIntegrityState {
  if (!subjectAvailable && !comparisonAvailable) return 'UNAVAILABLE COMPARISON';
  if (subjectAvailable !== comparisonAvailable) return 'EVIDENCE ASYMMETRY';
  return derived ? 'DERIVED / CALCULATED DIFFERENCE' : 'SUPPORTED DIFFERENCE';
}

function compareNumber({
  key,
  label,
  subject,
  comparison,
  formatter,
  threshold,
  prompt,
  verificationAction = 'CHECK SOURCE',
  derived = false,
}: {
  key: PropertyComparisonDimension['key'];
  label: string;
  subject: number | null | undefined;
  comparison: number | null | undefined;
  formatter: (value: number | null | undefined) => string;
  threshold: number;
  prompt: string;
  verificationAction?: PropertyComparisonVerificationAction;
  derived?: boolean;
}): PropertyComparisonDimension {
  const subjectAvailable = hasNumber(subject);
  const comparisonAvailable = hasNumber(comparison);
  if (!hasNumber(subject) || !hasNumber(comparison)) {
    const evidenceIntegrity = getAvailabilityIntegrity(subjectAvailable, comparisonAvailable, derived);
    return {
      key,
      label,
      state: 'evidence-unavailable',
      evidence: 'One or both listing facts are unavailable in the existing repository fields.',
      evidenceIntegrity,
      evidenceBasis: derived ? 'CALCULATED ESTIMATE' : 'KNOWN PROPERTY FACT',
      comparisonLimitation:
        evidenceIntegrity === 'EVIDENCE ASYMMETRY'
          ? 'One property has source-backed evidence in this domain while the other requires verification; this should not be interpreted as property quality.'
          : 'Comparable evidence is unavailable for this domain, so REIE cannot make a like-for-like comparison.',
      verificationAction,
      subjectValue: formatter(subject),
      comparisonValue: formatter(comparison),
      investigationPrompt: prompt,
    };
  }

  const delta = Math.abs(subject - comparison);
  const state: PropertyComparisonFactState = delta <= threshold ? 'broadly-similar' : 'materially-different';
  return {
    key,
    label,
    state,
    evidence: `Existing listing facts differ by ${formatter(delta).replace('$', '')}${label === 'Price' ? ' in listed price' : ''}.`,
    evidenceIntegrity: getAvailabilityIntegrity(true, true, derived),
    evidenceBasis: derived ? 'CALCULATED ESTIMATE' : 'KNOWN PROPERTY FACT',
    comparisonLimitation:
      state === 'materially-different'
        ? 'This is a source-backed factual difference, not a conclusion about which property is better.'
        : 'Comparable evidence supports a close factual comparison in this domain, without ranking either property.',
    verificationAction,
    subjectValue: formatter(subject),
    comparisonValue: formatter(comparison),
    investigationPrompt: prompt,
  };
}

function compareText({
  key,
  label,
  subject,
  comparison,
  prompt,
  verificationAction = 'ASK SELLER / LISTING AGENT',
}: {
  key: PropertyComparisonDimension['key'];
  label: string;
  subject?: string | null;
  comparison?: string | null;
  prompt: string;
  verificationAction?: PropertyComparisonVerificationAction;
}): PropertyComparisonDimension {
  const subjectValue = formatText(subject);
  const comparisonValue = formatText(comparison);
  if (subjectValue === 'not provided' || comparisonValue === 'not provided') {
    const evidenceIntegrity = getAvailabilityIntegrity(subjectValue !== 'not provided', comparisonValue !== 'not provided');
    return {
      key,
      label,
      state: 'evidence-unavailable',
      evidence: 'One or both fields are unavailable from listing facts.',
      evidenceIntegrity,
      evidenceBasis: 'KNOWN PROPERTY FACT',
      comparisonLimitation:
        evidenceIntegrity === 'EVIDENCE ASYMMETRY'
          ? 'One property has available listing evidence while the other does not; more available data does not mean a better property.'
          : 'Comparable evidence is unavailable for this domain.',
      verificationAction,
      subjectValue,
      comparisonValue,
      investigationPrompt: prompt,
    };
  }

  return {
    key,
    label,
    state: subjectValue.toLowerCase() === comparisonValue.toLowerCase() ? 'broadly-similar' : 'verification-required',
    evidence:
      subjectValue.toLowerCase() === comparisonValue.toLowerCase()
        ? 'Existing listing facts show the same value.'
        : 'Existing listing facts differ; confirm whether the difference changes the decision question.',
    evidenceIntegrity: subjectValue.toLowerCase() === comparisonValue.toLowerCase() ? 'SUPPORTED DIFFERENCE' : 'VERIFICATION REQUIRED',
    evidenceBasis: 'KNOWN PROPERTY FACT',
    comparisonLimitation:
      subjectValue.toLowerCase() === comparisonValue.toLowerCase()
        ? 'Comparable evidence supports this factual comparison without ranking either property.'
        : 'This difference requires verification before treating it as decision-significant.',
    verificationAction,
    subjectValue,
    comparisonValue,
    investigationPrompt: prompt,
  };
}

function buildFinancingDimension(
  subject: PropertyComparisonInput,
  comparison: PropertyComparisonInput,
  financingAssumption?: Omit<FinancingScenarioInput, 'purchasePrice'>,
): { dimension: PropertyComparisonDimension; scenario?: FinancingScenarioResult } {
  if (!financingAssumption || !hasNumber(comparison.price)) {
    return {
      dimension: {
        key: 'financingScenario',
        label: 'Financing scenario',
        state: 'evidence-unavailable',
        evidence: 'No user-entered financing scenario is attached to this comparison.',
        evidenceIntegrity: 'UNAVAILABLE COMPARISON',
        evidenceBasis: 'UNAVAILABLE / UNVERIFIED COST',
        comparisonLimitation: 'Comparable financing evidence is unavailable because no customer-entered assumption set is attached.',
        verificationAction: 'DISCUSS WITH LENDER',
        subjectValue: hasNumber(subject.price) ? 'available for user scenario' : 'price not provided',
        comparisonValue: hasNumber(comparison.price) ? 'available for user scenario' : 'price not provided',
        investigationPrompt: 'Use financing assumptions only as scenario estimates and verify with qualified lending professionals.',
      },
    };
  }

  const scenario = buildFinancingScenario({ ...financingAssumption, purchasePrice: comparison.price });
  return {
    scenario,
    dimension: {
      key: 'financingScenario',
      label: 'Financing scenario',
      state: scenario.combinedMonthlyEstimate === null ? 'verification-required' : 'materially-different',
      evidence: 'Scenario estimate uses the stated user assumptions and the compared property listed price only.',
      evidenceIntegrity:
        scenario.combinedMonthlyEstimate === null ? 'VERIFICATION REQUIRED' : 'DERIVED / CALCULATED DIFFERENCE',
      evidenceBasis: scenario.combinedMonthlyEstimate === null ? 'USER ASSUMPTION' : 'CALCULATED ESTIMATE',
      comparisonLimitation: 'Financing differences are scenario estimates from user assumptions, not affordability, approval, loan advice, or lender qualification.',
      verificationAction: 'DISCUSS WITH LENDER',
      subjectValue: 'subject scenario depends on the same user assumptions',
      comparisonValue:
        scenario.combinedMonthlyEstimate === null
          ? 'scenario incomplete'
          : `${formatCurrency(scenario.combinedMonthlyEstimate)} estimated monthly housing cost`,
      investigationPrompt: 'Compare the scenario sensitivity, not affordability or approval.',
    },
  };
}

function summarize(dimensions: PropertyComparisonDimension[]) {
  return {
    materiallyDifferent: dimensions.filter((dimension) => dimension.state === 'materially-different').length,
    broadlySimilar: dimensions.filter((dimension) => dimension.state === 'broadly-similar').length,
    evidenceUnavailable: dimensions.filter((dimension) => dimension.state === 'evidence-unavailable').length,
    verificationRequired: dimensions.filter((dimension) => dimension.state === 'verification-required').length,
    supportedDifference: dimensions.filter((dimension) => dimension.evidenceIntegrity === 'SUPPORTED DIFFERENCE').length,
    derivedCalculatedDifference: dimensions.filter((dimension) => dimension.evidenceIntegrity === 'DERIVED / CALCULATED DIFFERENCE').length,
    evidenceAsymmetry: dimensions.filter((dimension) => dimension.evidenceIntegrity === 'EVIDENCE ASYMMETRY').length,
    unavailableComparison: dimensions.filter((dimension) => dimension.evidenceIntegrity === 'UNAVAILABLE COMPARISON').length,
    professionalJudgment: dimensions.filter((dimension) => dimension.evidenceIntegrity === 'PROFESSIONAL JUDGMENT').length,
  };
}

function buildIntegrityLimitations(): PropertyComparisonIntegrityLimitation[] {
  return [
    {
      domain: 'public records',
      state: 'VERIFICATION REQUIRED',
      limitation: 'Assessor, tax, and permit records are not retrieved here, so public-record differences require source confirmation.',
      verificationAction: 'VERIFY WITH COUNTY',
    },
    {
      domain: 'tax',
      state: 'UNAVAILABLE COMPARISON',
      limitation: 'Tax records, exemptions, special districts, and future tax assumptions are not available as comparable evidence here.',
      verificationAction: 'DISCUSS WITH TAX PROFESSIONAL',
    },
    {
      domain: 'permit',
      state: 'UNAVAILABLE COMPARISON',
      limitation: 'Permit history is not retrieved here; absence of permit evidence is not evidence of condition or work quality.',
      verificationAction: 'VERIFY WITH COUNTY',
    },
    {
      domain: 'HOA',
      state: 'UNAVAILABLE COMPARISON',
      limitation: 'HOA documents, reserves, rules, dues, and pending assessments require document review before comparing obligations.',
      verificationAction: 'REVIEW HOA DOCUMENTS',
    },
    {
      domain: 'condition / inspection',
      state: 'PROFESSIONAL JUDGMENT',
      limitation: 'Photos and listing facts do not establish roof, structure, drainage, mechanical, plumbing, electrical, or environmental condition.',
      verificationAction: 'DISCUSS WITH INSPECTOR',
    },
    {
      domain: 'title / legal',
      state: 'PROFESSIONAL JUDGMENT',
      limitation: 'Title exceptions, easements, covenants, disclosures, water rights, and contract terms require appropriate review.',
      verificationAction: 'DISCUSS WITH ATTORNEY',
    },
    {
      domain: 'financing assumptions',
      state: 'PROFESSIONAL JUDGMENT',
      limitation: 'Loan terms, rate assumptions, insurance, appraisal, reserves, and closing costs remain customer-specific and lender-bound.',
      verificationAction: 'DISCUSS WITH LENDER',
    },
  ];
}

function summarizeIntegrity(dimensions: PropertyComparisonDimension[]) {
  const asymmetric = dimensions.filter((dimension) => dimension.evidenceIntegrity === 'EVIDENCE ASYMMETRY').length;
  const unsupported = dimensions.filter((dimension) =>
    ['EVIDENCE ASYMMETRY', 'UNAVAILABLE COMPARISON', 'VERIFICATION REQUIRED', 'PROFESSIONAL JUDGMENT'].includes(dimension.evidenceIntegrity),
  ).length;
  const supported = dimensions.filter((dimension) =>
    ['SUPPORTED DIFFERENCE', 'DERIVED / CALCULATED DIFFERENCE'].includes(dimension.evidenceIntegrity),
  ).length;

  return {
    headline:
      unsupported > 0
        ? 'Comparison evidence is mixed; some differences are source-backed while others require verification.'
        : 'Comparison evidence is source-backed for the displayed dimensions.',
    evidenceAsymmetry:
      asymmetric > 0
        ? 'One property has evidence in at least one domain where the other does not. More available data does not mean a better property.'
        : 'No one-sided evidence gap appears in the displayed listing-fact dimensions.',
    decisionDifferenceSummary:
      `${supported} displayed dimension${supported === 1 ? '' : 's'} can support a factual comparison; ${unsupported} displayed dimension${unsupported === 1 ? '' : 's'} should remain verification-bound or unavailable.`,
    limitations: buildIntegrityLimitations(),
  };
}

export function buildPropertyComparisonWorkspace({
  subject,
  comparisons,
  financingAssumption,
}: {
  subject: PropertyComparisonInput;
  comparisons: PropertyComparisonInput[];
  financingAssumption?: Omit<FinancingScenarioInput, 'purchasePrice'>;
}): PropertyComparisonWorkspace {
  const comparisonItems = comparisons.slice(0, 4).map((comparison) => {
    const financing = buildFinancingDimension(subject, comparison, financingAssumption);
    const dimensions: PropertyComparisonDimension[] = [
      compareNumber({
        key: 'price',
        label: 'Price',
        subject: subject.price,
        comparison: comparison.price,
        formatter: formatCurrency,
        threshold: 25000,
        prompt: 'Confirm whether the listed price difference changes cash, financing, appraisal, or negotiation questions.',
        verificationAction: 'ASK SELLER / LISTING AGENT',
      }),
      compareNumber({
        key: 'pricePerSquareFoot',
        label: 'Price per square foot',
        subject: pricePerSquareFoot(subject),
        comparison: pricePerSquareFoot(comparison),
        formatter: (value) => formatCurrency(value),
        threshold: 25,
        prompt: 'Use this arithmetic only as a listing-fact comparison; verify condition, finished area, and property details.',
        verificationAction: 'DISCUSS WITH APPRAISER',
        derived: true,
      }),
      compareNumber({ key: 'beds', label: 'Beds', subject: subject.beds, comparison: comparison.beds, formatter: (value) => formatNumber(value), threshold: 0, prompt: 'Confirm room counts and included spaces.', verificationAction: 'ASK SELLER / LISTING AGENT' }),
      compareNumber({ key: 'baths', label: 'Baths', subject: subject.baths, comparison: comparison.baths, formatter: (value) => formatNumber(value), threshold: 0, prompt: 'Confirm bathroom count, layout, and condition.', verificationAction: 'ASK SELLER / LISTING AGENT' }),
      compareNumber({ key: 'sqft', label: 'Square footage', subject: subject.sqft, comparison: comparison.sqft, formatter: (value) => formatNumber(value, ' sq ft'), threshold: 150, prompt: 'Confirm measurements, included spaces, and finished-area treatment.', verificationAction: 'CHECK SOURCE' }),
      compareNumber({ key: 'lotSize', label: 'Lot size', subject: subject.lotSize, comparison: comparison.lotSize, formatter: (value) => formatNumber(value, ' acres'), threshold: 0.05, prompt: 'Verify lot size through current source records before relying on it.', verificationAction: 'VERIFY WITH COUNTY' }),
      compareNumber({ key: 'yearBuilt', label: 'Year built', subject: subject.yearBuilt, comparison: comparison.yearBuilt, formatter: (value) => formatNumber(value), threshold: 5, prompt: 'Use construction era to focus inspection, permit, systems, and records questions.', verificationAction: 'DISCUSS WITH INSPECTOR' }),
      compareText({ key: 'propertyType', label: 'Property type', subject: subject.propertyType, comparison: comparison.propertyType, prompt: 'Confirm ownership structure, HOA, insurance, lending, and maintenance implications.' }),
      compareText({ key: 'status', label: 'Listing status', subject: subject.status, comparison: comparison.status, prompt: 'Confirm availability and timing before relying on status.' }),
      compareText({ key: 'place', label: 'Place context', subject: subject.neighborhood || subject.city, comparison: comparison.neighborhood || comparison.city, prompt: 'Use place context as orientation, not as a neighborhood ranking or suitability conclusion.' }),
      financing.dimension,
    ];

    return {
      propertyId: comparison.id,
      address: comparison.address,
      href: `/properties/${comparison.id}`,
      headline: `${formatText(comparison.city)} comparison using existing listing facts.`,
      dimensions,
      integrity: summarizeIntegrity(dimensions),
      synthesis: summarize(dimensions),
      financingScenario: financing.scenario,
    };
  });

  return {
    status: PROPERTY_COMPARISON_INTELLIGENCE_STATUS,
    version: PROPERTY_COMPARISON_INTELLIGENCE_VERSION,
    subject,
    canCompare: comparisonItems.length > 0,
    comparisons: comparisonItems,
    trustBoundary:
      'Property comparison shows factual differences, evidence asymmetry, unavailable evidence, professional-judgment boundaries, and verification prompts only; it does not rank, score, value, recommend, or infer suitability.',
    sourceMethodologyHref: '/sources',
    evidenceAsymmetryBoundary:
      'More available data does not mean a better property; unequal evidence means verification may be required before drawing a conclusion.',
    protectedBoundaries: {
      ranking: false,
      scoring: false,
      valuation: false,
      investmentAdvice: false,
      suitabilityRecommendation: false,
      fairHousingPreference: false,
      financingApproval: false,
      lenderQuote: false,
      providerActivation: false,
      persistence: false,
      telemetry: false,
    },
  };
}
