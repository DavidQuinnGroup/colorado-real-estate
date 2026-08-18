import {
  buildFinancingScenario,
  type FinancingScenarioInput,
  type FinancingScenarioResult,
} from './financingScenarioCalculator.js';
import {
  validateReieDecisionContext,
  type ReieDecisionContext,
} from './reieDecisionContextContract.js';
import {
  validateReieDecisionEvidenceItem,
  type ReieDecisionEvidenceItem,
} from './reieDecisionEvidenceClassification.js';
import {
  validateReieProfessionalHandoffRequest,
  type ReieProfessionalHandoffRequest,
} from './reieProfessionalHandoffTaxonomy.js';

export const REIE_FINANCIAL_DECISION_PREPARATION_VERSION = 'REIE_MODULE_6_FINANCIAL_PREPARATION_V1' as const;

export const REIE_FINANCIAL_PREPARATION_CONTEXTS = [
  'FINANCING_PREPARATION_CONTEXT',
  'OWNERSHIP_COST_CONTEXT',
  'MOVING_COST_PREPARATION',
  'NET_PROCEEDS_INPUT_PREPARATION',
  'PROFESSIONAL_VERIFICATION',
] as const;

export type ReieFinancialPreparationContext = (typeof REIE_FINANCIAL_PREPARATION_CONTEXTS)[number];

export const REIE_FINANCIAL_PREPARATION_FIELD_KEYS = [
  'purchasePrice',
  'downPayment',
  'interestRate',
  'loanTermYears',
  'propertyTaxes',
  'homeownersInsurance',
  'hoaDues',
  'mortgageInsurance',
  'maintenance',
  'utilities',
  'otherRecurringCosts',
  'closingCosts',
  'movingCostCategory',
  'capexCategory',
  'timeline',
  'customerSelectedFinancialQuestion',
  'netProceedsInput',
] as const;

export type ReieFinancialPreparationFieldKey = (typeof REIE_FINANCIAL_PREPARATION_FIELD_KEYS)[number];

export type ReieFinancialPreparationField = Readonly<{
  id: string;
  key: ReieFinancialPreparationFieldKey;
  evidence: ReieDecisionEvidenceItem;
  prohibitedUse: readonly string[];
}>;

export type ReieFinancialDecisionPreparationInput = Readonly<{
  context: ReieDecisionContext;
  preparationContext: ReieFinancialPreparationContext;
  scenarioInput: FinancingScenarioInput;
  fields: readonly ReieFinancialPreparationField[];
  movingCostCategories: readonly string[];
  capexCategories: readonly string[];
  timeline: string | null;
  customerSelectedFinancialQuestions: readonly string[];
  professionalHandoffs: readonly ReieProfessionalHandoffRequest[];
}>;

export type ReieFinancialScenarioCalculation = Readonly<{
  inputs: readonly string[];
  assumptions: readonly string[];
  calculationType: 'PRINCIPAL_AND_INTEREST' | 'RECURRING_COST_SUBTOTAL' | 'COMBINED_MONTHLY_ILLUSTRATION';
  result: number;
  limitations: readonly string[];
}>;

export type ReieFinancialDecisionPreparationResult = Readonly<{
  classification: 'VALID_FINANCIAL_PREPARATION' | 'FAIL_CLOSED';
  context: ReieFinancialPreparationContext;
  scenario: FinancingScenarioResult | null;
  calculations: readonly ReieFinancialScenarioCalculation[];
  assumptions: readonly ReieDecisionEvidenceItem[];
  missingInputs: readonly ReieDecisionEvidenceItem[];
  professionalQuestions: readonly string[];
  reasons: readonly string[];
}>;

const NO_CONCLUSION = [
  'No approval, qualification, affordability, buying-power, lender, tax, legal, investment, or suitability conclusion.',
] as const;

function isContext(value: unknown): value is ReieFinancialPreparationContext {
  return typeof value === 'string' && REIE_FINANCIAL_PREPARATION_CONTEXTS.includes(value as ReieFinancialPreparationContext);
}

function isFieldKey(value: unknown): value is ReieFinancialPreparationFieldKey {
  return typeof value === 'string' && REIE_FINANCIAL_PREPARATION_FIELD_KEYS.includes(value as ReieFinancialPreparationFieldKey);
}

function validateField(field: ReieFinancialPreparationField): readonly string[] {
  const reasons = [...validateReieDecisionEvidenceItem(field.evidence)];
  if (!field.id.trim()) reasons.push('FINANCIAL_PREPARATION_FIELD_ID_REQUIRED');
  if (!isFieldKey(field.key)) reasons.push('FINANCIAL_PREPARATION_FIELD_KEY_INVALID');
  if (field.prohibitedUse.length === 0) reasons.push('FINANCIAL_PREPARATION_FIELD_PROHIBITED_USE_REQUIRED');
  if (field.evidence.classification === 'PROHIBITED_OUTPUT') reasons.push('FINANCIAL_PREPARATION_PROHIBITED_EVIDENCE_REJECTED');
  return reasons;
}

export function validateFinancialDecisionPreparationInput(input: ReieFinancialDecisionPreparationInput): readonly string[] {
  const reasons: string[] = [];
  if (!isContext(input.preparationContext)) reasons.push('FINANCIAL_PREPARATION_CONTEXT_INVALID');
  const contextValidation = validateReieDecisionContext({
    role: input.context.role,
    selectedGoals: input.context.selectedGoals,
    items: input.context.items,
    professionalHandoffs: input.context.professionalHandoffs,
    sourcePosture: input.context.sourcePosture,
    persistencePosture: input.context.persistencePosture,
    hiddenTransferPosture: input.context.hiddenTransferPosture,
    prohibitedOutputs: input.context.prohibitedOutputs,
  });
  if (contextValidation.classification !== 'VALID_EXPLICIT_CONTEXT') reasons.push(...contextValidation.reasons);
  const ids = new Set<string>();
  input.fields.forEach((field) => {
    reasons.push(...validateField(field));
    if (ids.has(field.id)) reasons.push('DUPLICATE_FINANCIAL_PREPARATION_FIELD_ID');
    ids.add(field.id);
  });
  input.professionalHandoffs.forEach((handoff) => reasons.push(...validateReieProfessionalHandoffRequest(handoff)));
  if (input.professionalHandoffs.some((handoff) => !input.context.professionalHandoffs.some((contextHandoff) => contextHandoff.id === handoff.id))) reasons.push('FINANCIAL_HANDOFF_MUST_EXIST_IN_CONTEXT');
  if (input.movingCostCategories.some((category) => !category.trim())) reasons.push('MOVING_COST_CATEGORY_INVALID');
  if (input.capexCategories.some((category) => !category.trim())) reasons.push('CAPEX_CATEGORY_INVALID');
  if (input.timeline !== null && !input.timeline.trim()) reasons.push('FINANCIAL_TIMELINE_INVALID');
  if (input.customerSelectedFinancialQuestions.some((question) => !question.trim())) reasons.push('FINANCIAL_QUESTION_INVALID');
  if (input.context.persistencePosture !== 'NOT_PERSISTED') reasons.push('FINANCIAL_PREPARATION_MUST_NOT_PERSIST');
  if (input.context.hiddenTransferPosture !== 'PROHIBITED') reasons.push('FINANCIAL_PREPARATION_HIDDEN_TRANSFER_PROHIBITED');
  return Object.freeze([...new Set(reasons)].sort());
}

function derivedEvidence(id: string, label: string, value: number): ReieDecisionEvidenceItem {
  return {
    id,
    label,
    value,
    classification: 'DERIVED_ILLUSTRATION',
    provenance: { origin: 'VISIBLE_ASSUMPTION_ILLUSTRATION', reference: 'financingScenarioCalculator', sourceId: null, freshness: 'NOT_APPLICABLE', rights: 'NOT_APPLICABLE' },
    visibility: 'GUIDED',
    verification: 'NOT_REQUIRED',
    prohibitedUse: NO_CONCLUSION,
  };
}

function missingEvidence(id: string, label: string): ReieDecisionEvidenceItem {
  return {
    id,
    label,
    value: null,
    classification: 'NOT_AVAILABLE',
    provenance: { origin: 'NONE', reference: null, sourceId: null, freshness: 'NOT_APPLICABLE', rights: 'NOT_APPLICABLE' },
    visibility: 'DATA_INSUFFICIENT',
    verification: 'REQUIRED',
    prohibitedUse: NO_CONCLUSION,
  };
}

export function buildFinancialDecisionPreparation(input: ReieFinancialDecisionPreparationInput): ReieFinancialDecisionPreparationResult {
  const reasons = validateFinancialDecisionPreparationInput(input);
  if (reasons.length > 0) return { classification: 'FAIL_CLOSED', context: input.preparationContext, scenario: null, calculations: [], assumptions: [], missingInputs: [], professionalQuestions: [], reasons };
  const scenario = buildFinancingScenario(input.scenarioInput);
  const calculations: ReieFinancialScenarioCalculation[] = [];
  if (scenario.principalAndInterest !== null) calculations.push({ inputs: ['purchasePrice', 'downPayment', 'interestRate', 'loanTermYears'], assumptions: ['User-entered purchase price, down payment, rate, and term.'], calculationType: 'PRINCIPAL_AND_INTEREST', result: scenario.principalAndInterest, limitations: [...NO_CONCLUSION] });
  if (scenario.optionalMonthlySubtotal > 0) calculations.push({ inputs: ['propertyTaxes', 'homeownersInsurance', 'hoaDues', 'mortgageInsurance', 'maintenance', 'utilities', 'otherRecurringCosts'], assumptions: ['Only user-entered recurring-cost assumptions are included.'], calculationType: 'RECURRING_COST_SUBTOTAL', result: scenario.optionalMonthlySubtotal, limitations: [...NO_CONCLUSION] });
  if (scenario.combinedMonthlyEstimate !== null) calculations.push({ inputs: ['principalAndInterest', 'optionalRecurringCosts'], assumptions: ['Visible arithmetic from the assumption-only calculator.'], calculationType: 'COMBINED_MONTHLY_ILLUSTRATION', result: scenario.combinedMonthlyEstimate, limitations: [...NO_CONCLUSION] });
  const assumptions = scenario.assumptions.map((assumption) => ({
    id: `assumption-${String(assumption.key)}`,
    label: assumption.label,
    value: assumption.value,
    classification: 'USER_ASSUMPTION' as const,
    provenance: { origin: 'EXPLICIT_CUSTOMER_INPUT' as const, reference: String(assumption.key), sourceId: null, freshness: 'NOT_APPLICABLE' as const, rights: 'NOT_APPLICABLE' as const },
    visibility: 'GUIDED' as const,
    verification: 'NOT_REQUIRED' as const,
    prohibitedUse: NO_CONCLUSION,
  }));
  const missingInputs = scenario.missingAssumptions.map((label, index) => missingEvidence(`missing-${index}`, label));
  return {
    classification: 'VALID_FINANCIAL_PREPARATION',
    context: input.preparationContext,
    scenario,
    calculations,
    assumptions,
    missingInputs,
    professionalQuestions: Object.freeze([...scenario.questions, ...input.customerSelectedFinancialQuestions]),
    reasons: Object.freeze([]),
  };
}
