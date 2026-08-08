export const FINANCING_SCENARIO_CALCULATOR_STATUS = 'FINANCING_SCENARIO_CALCULATOR_IMPLEMENTED_ASSUMPTION_ONLY';
export const FINANCING_SCENARIO_CALCULATOR_VERSION = '1.0.0';

export type FinancingScenarioInput = {
  purchasePrice?: number | null;
  downPayment?: number | null;
  interestRate?: number | null;
  loanTermYears?: number | null;
  propertyTaxes?: number | null;
  homeownersInsurance?: number | null;
  hoaDues?: number | null;
  mortgageInsurance?: number | null;
  maintenance?: number | null;
  utilities?: number | null;
  otherRecurringCosts?: number | null;
  closingCosts?: number | null;
};

export type FinancingScenarioResult = {
  status: typeof FINANCING_SCENARIO_CALCULATOR_STATUS;
  version: typeof FINANCING_SCENARIO_CALCULATOR_VERSION;
  validationMessages: string[];
  requiredInputsComplete: boolean;
  loanAmount: number | null;
  principalAndInterest: number | null;
  optionalMonthlySubtotal: number;
  combinedMonthlyEstimate: number | null;
  closingCosts: number | null;
  assumptions: Array<{
    key: keyof FinancingScenarioInput;
    label: string;
    value: number;
    classification: 'USER_ASSUMPTION';
  }>;
  missingAssumptions: string[];
  questions: string[];
  boundaries: {
    currentRateQuote: false;
    lenderQuote: false;
    approval: false;
    qualification: false;
    affordabilityConclusion: false;
    buyingPowerConclusion: false;
    taxAdvice: false;
    financialAdvice: false;
    persistence: false;
    providerActivation: false;
  };
};

type MonthlyFieldKey = Exclude<
  keyof FinancingScenarioInput,
  'purchasePrice' | 'downPayment' | 'interestRate' | 'loanTermYears' | 'closingCosts'
>;

const optionalMonthlyFields: Array<{
  key: MonthlyFieldKey;
  label: string;
}> = [
  { key: 'propertyTaxes', label: 'Property taxes' },
  { key: 'homeownersInsurance', label: 'Homeowners insurance' },
  { key: 'hoaDues', label: 'HOA dues' },
  { key: 'mortgageInsurance', label: 'Monthly mortgage-insurance assumption' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'utilities', label: 'Utilities' },
  { key: 'otherRecurringCosts', label: 'Other recurring ownership costs' },
];

function finite(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function calculateMonthlyPrincipalAndInterest(loanAmount: number, annualRate: number, loanTermYears: number) {
  const months = loanTermYears * 12;

  if (months <= 0) return null;
  if (annualRate === 0) return loanAmount / months;

  const monthlyRate = annualRate / 100 / 12;
  const factor = (1 + monthlyRate) ** months;

  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

export function buildFinancingScenario(input: FinancingScenarioInput): FinancingScenarioResult {
  const purchasePrice = finite(input.purchasePrice);
  const downPayment = finite(input.downPayment);
  const interestRate = finite(input.interestRate);
  const loanTermYears = finite(input.loanTermYears) ?? 30;
  const validationMessages: string[] = [];

  if (purchasePrice !== null && purchasePrice <= 0) validationMessages.push('Purchase price must be greater than zero before arithmetic can appear.');
  if (downPayment !== null && downPayment < 0) validationMessages.push('Down payment cannot be negative.');
  if (interestRate !== null && interestRate < 0) validationMessages.push('Interest-rate assumption cannot be negative.');
  if (loanTermYears <= 0) validationMessages.push('Loan term must be greater than zero.');
  if (purchasePrice !== null && downPayment !== null && downPayment > purchasePrice) {
    validationMessages.push('Down payment cannot exceed the purchase price assumption.');
  }

  for (const field of optionalMonthlyFields) {
    const value = finite(input[field.key]);
    if (value !== null && value < 0) validationMessages.push(`${field.label} cannot be negative.`);
  }

  const closingCosts = finite(input.closingCosts);
  if (closingCosts !== null && closingCosts < 0) validationMessages.push('Closing-cost assumption cannot be negative.');

  const requiredInputsComplete =
    purchasePrice !== null &&
    downPayment !== null &&
    interestRate !== null &&
    purchasePrice > 0 &&
    downPayment >= 0 &&
    downPayment <= purchasePrice &&
    interestRate >= 0 &&
    loanTermYears > 0 &&
    validationMessages.length === 0;
  const loanAmount = requiredInputsComplete ? purchasePrice - downPayment : null;
  const principalAndInterest =
    loanAmount !== null ? calculateMonthlyPrincipalAndInterest(loanAmount, interestRate ?? 0, loanTermYears) : null;
  const assumptions: FinancingScenarioResult['assumptions'] = [];

  for (const [key, label] of [
    ['purchasePrice', 'Purchase price assumption'],
    ['downPayment', 'Down payment assumption'],
    ['interestRate', 'Interest-rate assumption'],
    ['loanTermYears', 'Loan term assumption'],
  ] as const) {
    const value = finite(input[key]);
    if (value !== null) assumptions.push({ key, label, value, classification: 'USER_ASSUMPTION' });
  }

  for (const field of optionalMonthlyFields) {
    const value = finite(input[field.key]);
    if (value !== null && value >= 0) assumptions.push({ key: field.key, label: field.label, value, classification: 'USER_ASSUMPTION' });
  }

  if (closingCosts !== null && closingCosts >= 0) {
    assumptions.push({ key: 'closingCosts', label: 'Closing costs and cash-to-close questions', value: closingCosts, classification: 'USER_ASSUMPTION' });
  }

  const optionalMonthlySubtotal = optionalMonthlyFields.reduce((sum, field) => {
    const value = finite(input[field.key]);
    return value !== null && value >= 0 ? sum + value : sum;
  }, 0);
  const combinedMonthlyEstimate = principalAndInterest !== null ? principalAndInterest + optionalMonthlySubtotal : null;
  const missingAssumptions = [
    purchasePrice === null ? 'Purchase price assumption' : null,
    downPayment === null ? 'Down payment assumption' : null,
    interestRate === null ? 'Interest-rate assumption' : null,
    ...optionalMonthlyFields.map((field) => (finite(input[field.key]) === null ? field.label : null)),
    closingCosts === null ? 'Closing costs and cash-to-close questions' : null,
  ].filter((value): value is string => Boolean(value));
  const questions = [
    'Which loan types, terms, lender fees, and timing rules should I review with a qualified lender?',
    'Which assumptions are included or excluded from any lender estimate I receive?',
    'Which property-specific facts could affect financing, insurance, HOA, timing, or offer strategy?',
    missingAssumptions.includes('Property taxes') ? 'What current tax information should be verified before relying on this property-cost assumption?' : null,
    missingAssumptions.includes('Homeowners insurance') ? 'What insurance assumptions should be confirmed before comparing monthly ownership costs?' : null,
    missingAssumptions.includes('HOA dues') ? 'Which HOA dues, reserves, transfer fees, rules, and included services should be reviewed?' : null,
    'Does mortgage insurance apply, and how should the amount be verified with a qualified lender?',
    missingAssumptions.includes('Closing costs and cash-to-close questions')
      ? 'Which closing costs, prepaid expenses, reserves, and cash-to-close items should be verified?'
      : null,
    interestRate !== null ? 'How would this user-entered rate assumption change if the lender quote, lock timing, or loan terms differ?' : null,
  ].filter((value): value is string => Boolean(value));

  return {
    status: FINANCING_SCENARIO_CALCULATOR_STATUS,
    version: FINANCING_SCENARIO_CALCULATOR_VERSION,
    validationMessages,
    requiredInputsComplete,
    loanAmount,
    principalAndInterest,
    optionalMonthlySubtotal,
    combinedMonthlyEstimate,
    closingCosts: closingCosts !== null && closingCosts >= 0 ? closingCosts : null,
    assumptions,
    missingAssumptions,
    questions: Array.from(new Set(questions)),
    boundaries: {
      currentRateQuote: false,
      lenderQuote: false,
      approval: false,
      qualification: false,
      affordabilityConclusion: false,
      buyingPowerConclusion: false,
      taxAdvice: false,
      financialAdvice: false,
      persistence: false,
      providerActivation: false,
    },
  };
}
