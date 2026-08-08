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

export type PropertyComparisonDimension = {
  key: 'price' | 'pricePerSquareFoot' | 'beds' | 'baths' | 'sqft' | 'lotSize' | 'yearBuilt' | 'propertyType' | 'status' | 'place' | 'financingScenario';
  label: string;
  state: PropertyComparisonFactState;
  evidence: string;
  subjectValue: string;
  comparisonValue: string;
  investigationPrompt: string;
};

export type PropertyComparisonItem = {
  propertyId: string;
  address: string;
  href: string;
  headline: string;
  dimensions: PropertyComparisonDimension[];
  synthesis: {
    materiallyDifferent: number;
    broadlySimilar: number;
    evidenceUnavailable: number;
    verificationRequired: number;
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

function compareNumber({
  key,
  label,
  subject,
  comparison,
  formatter,
  threshold,
  prompt,
}: {
  key: PropertyComparisonDimension['key'];
  label: string;
  subject: number | null | undefined;
  comparison: number | null | undefined;
  formatter: (value: number | null | undefined) => string;
  threshold: number;
  prompt: string;
}): PropertyComparisonDimension {
  if (!hasNumber(subject) || !hasNumber(comparison)) {
    return {
      key,
      label,
      state: 'evidence-unavailable',
      evidence: 'One or both listing facts are unavailable in the existing repository fields.',
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
}: {
  key: PropertyComparisonDimension['key'];
  label: string;
  subject?: string | null;
  comparison?: string | null;
  prompt: string;
}): PropertyComparisonDimension {
  const subjectValue = formatText(subject);
  const comparisonValue = formatText(comparison);
  if (subjectValue === 'not provided' || comparisonValue === 'not provided') {
    return {
      key,
      label,
      state: 'evidence-unavailable',
      evidence: 'One or both fields are unavailable from listing facts.',
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
      }),
      compareNumber({
        key: 'pricePerSquareFoot',
        label: 'Price per square foot',
        subject: pricePerSquareFoot(subject),
        comparison: pricePerSquareFoot(comparison),
        formatter: (value) => formatCurrency(value),
        threshold: 25,
        prompt: 'Use this arithmetic only as a listing-fact comparison; verify condition, finished area, and property details.',
      }),
      compareNumber({ key: 'beds', label: 'Beds', subject: subject.beds, comparison: comparison.beds, formatter: (value) => formatNumber(value), threshold: 0, prompt: 'Confirm room counts and included spaces.' }),
      compareNumber({ key: 'baths', label: 'Baths', subject: subject.baths, comparison: comparison.baths, formatter: (value) => formatNumber(value), threshold: 0, prompt: 'Confirm bathroom count, layout, and condition.' }),
      compareNumber({ key: 'sqft', label: 'Square footage', subject: subject.sqft, comparison: comparison.sqft, formatter: (value) => formatNumber(value, ' sq ft'), threshold: 150, prompt: 'Confirm measurements, included spaces, and finished-area treatment.' }),
      compareNumber({ key: 'lotSize', label: 'Lot size', subject: subject.lotSize, comparison: comparison.lotSize, formatter: (value) => formatNumber(value, ' acres'), threshold: 0.05, prompt: 'Verify lot size through current source records before relying on it.' }),
      compareNumber({ key: 'yearBuilt', label: 'Year built', subject: subject.yearBuilt, comparison: comparison.yearBuilt, formatter: (value) => formatNumber(value), threshold: 5, prompt: 'Use construction era to focus inspection, permit, systems, and records questions.' }),
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
      'Property comparison shows factual differences, similarities, unavailable evidence, and verification prompts only; it does not rank, score, value, recommend, or infer suitability.',
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
