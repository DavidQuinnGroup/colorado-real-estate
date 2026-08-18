import {
  REIE_DECISION_EVIDENCE_CLASSIFICATIONS,
  type ReieDecisionEvidenceClassification,
  type ReieDecisionEvidenceValue,
} from './reieDecisionEvidenceClassification.js';

export const REIE_FINANCIAL_SCENARIO_ALLOWED_OUTPUTS = [
  'ASSUMPTION_INVENTORY',
  'PRINCIPAL_AND_INTEREST_ILLUSTRATION',
  'FIXED_RATE_AMORTIZATION_ILLUSTRATION',
  'RECURRING_COST_SUBTOTAL',
  'CAPEX_CATEGORY_PREPARATION',
  'MISSING_INPUT_LIST',
  'FACTUAL_SCENARIO_COMPARISON',
  'MOVING_COST_CATEGORIES',
  'NET_PROCEEDS_REQUIRED_INPUT_CHECKLIST',
  'PROFESSIONAL_QUESTIONS',
] as const;

export const REIE_FINANCIAL_SCENARIO_PROHIBITED_OUTPUTS = [
  'LOAN_APPROVAL', 'QUALIFICATION', 'PREQUALIFICATION', 'AFFORDABILITY_CONCLUSION', 'BUYING_POWER',
  'CURRENT_RATE', 'LENDER_QUOTE', 'LENDER_RANKING', 'LENDER_RECOMMENDATION', 'PRODUCT_SUITABILITY',
  'TAX_ADVICE', 'LEGAL_ADVICE', 'INVESTMENT_ADVICE', 'RETIREMENT_ADVICE', 'AUTOMATED_VALUATION',
  'APPRECIATION_FORECAST', 'YIELD_FORECAST', 'ROI_RECOMMENDATION', 'NET_PROCEEDS_CONCLUSION',
  'CASH_OUT_RECOMMENDATION', 'SALE_PROBABILITY', 'OFFER_STRATEGY', 'CONCESSION_STRATEGY',
  'NEGOTIATION_STRATEGY', 'AI_PERSONALIZED_FINANCIAL_STRATEGY',
] as const;

export type ReieFinancialScenarioOutputKind = (typeof REIE_FINANCIAL_SCENARIO_ALLOWED_OUTPUTS)[number] | (typeof REIE_FINANCIAL_SCENARIO_PROHIBITED_OUTPUTS)[number];

export type ReieFinancialScenarioPresentationItem = Readonly<{
  id: string;
  kind: ReieFinancialScenarioOutputKind;
  classification: ReieDecisionEvidenceClassification;
  value: ReieDecisionEvidenceValue;
  inputs: readonly string[];
  assumptions: readonly string[];
  calculationType: string | null;
  limitations: readonly string[];
  recommendation: false;
}>;

export type ReieFinancialScenarioPresentationValidation = Readonly<{
  classification: 'VALID_SAFE_PRESENTATION' | 'FAIL_CLOSED';
  items: readonly ReieFinancialScenarioPresentationItem[] | null;
  reasons: readonly string[];
}>;

function allowed(value: unknown): value is (typeof REIE_FINANCIAL_SCENARIO_ALLOWED_OUTPUTS)[number] {
  return typeof value === 'string' && REIE_FINANCIAL_SCENARIO_ALLOWED_OUTPUTS.includes(value as never);
}

export function validateFinancialScenarioPresentation(items: readonly ReieFinancialScenarioPresentationItem[]): ReieFinancialScenarioPresentationValidation {
  const reasons: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.id.trim()) reasons.push('FINANCIAL_PRESENTATION_ID_REQUIRED');
    if (seen.has(item.id)) reasons.push('FINANCIAL_PRESENTATION_DUPLICATE_ID');
    seen.add(item.id);
    if (!allowed(item.kind)) reasons.push('FINANCIAL_PRESENTATION_KIND_NOT_ALLOWED');
    if (!REIE_DECISION_EVIDENCE_CLASSIFICATIONS.includes(item.classification)) reasons.push('FINANCIAL_PRESENTATION_CLASSIFICATION_INVALID');
    if (item.classification === 'PROHIBITED_OUTPUT') reasons.push(`FINANCIAL_PRESENTATION_PROHIBITED_${item.kind}`);
    if (item.recommendation !== false) reasons.push('FINANCIAL_PRESENTATION_RECOMMENDATION_PROHIBITED');
    if (item.limitations.length === 0) reasons.push('FINANCIAL_PRESENTATION_LIMITATIONS_REQUIRED');
    if ((item.kind === 'PRINCIPAL_AND_INTEREST_ILLUSTRATION' || item.kind === 'FIXED_RATE_AMORTIZATION_ILLUSTRATION' || item.kind === 'RECURRING_COST_SUBTOTAL' || item.kind === 'FACTUAL_SCENARIO_COMPARISON')
      && (item.inputs.length === 0 || item.assumptions.length === 0 || !item.calculationType)) {
      reasons.push('FINANCIAL_PRESENTATION_DERIVED_ILLUSTRATION_METADATA_REQUIRED');
    }
    if (item.kind === 'PROFESSIONAL_QUESTIONS' && item.value === null) reasons.push('FINANCIAL_PRESENTATION_PROFESSIONAL_QUESTIONS_REQUIRED');
  }
  if (reasons.length > 0) return { classification: 'FAIL_CLOSED', items: null, reasons: Object.freeze([...new Set(reasons)].sort()) };
  return { classification: 'VALID_SAFE_PRESENTATION', items: Object.freeze([...items]), reasons: Object.freeze([]) };
}
