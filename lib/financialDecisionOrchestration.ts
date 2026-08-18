import {
  REIE_FINANCIAL_PREPARATION_CONTEXTS,
  type ReieFinancialPreparationContext,
} from './financialDecisionPreparationContract.js';
import {
  validateMultiDimensionalStrategyOrchestration,
  type ReieModule8OrchestrationInput,
} from './multiDimensionalStrategyOrchestration.js';
import {
  validateReieProfessionalHandoffRequest,
  type ReieProfessionalHandoffRequest,
} from './reieProfessionalHandoffTaxonomy.js';

export const REIE_FINANCIAL_DECISION_ORCHESTRATION_VERSION = 'REIE_MODULE_6_ORCHESTRATION_HANDOFF_V1' as const;

export type ReieFinancialDecisionOrchestrationInput = Readonly<{
  module8: ReieModule8OrchestrationInput;
  financialContexts: readonly ReieFinancialPreparationContext[];
  financialHandoffs: readonly ReieProfessionalHandoffRequest[];
}>;

export type ReieFinancialDecisionOrchestrationValidation = Readonly<{
  classification: 'VALID_MODULE_6_ORCHESTRATION' | 'FAIL_CLOSED';
  orchestration: ReieFinancialDecisionOrchestrationInput | null;
  reasons: readonly string[];
}>;

export function validateFinancialDecisionOrchestration(input: ReieFinancialDecisionOrchestrationInput): ReieFinancialDecisionOrchestrationValidation {
  const reasons: string[] = [];
  const module8 = validateMultiDimensionalStrategyOrchestration(input.module8);
  if (module8.classification !== 'VALID_MODULE_8_ORCHESTRATION') reasons.push(...module8.reasons);
  for (const context of input.financialContexts) if (!REIE_FINANCIAL_PREPARATION_CONTEXTS.includes(context)) reasons.push('FINANCIAL_CONTEXT_INVALID');
  if (input.financialContexts.length === 0) reasons.push('FINANCIAL_CONTEXT_REQUIRED');
  input.financialHandoffs.forEach((handoff) => reasons.push(...validateReieProfessionalHandoffRequest(handoff)));
  if (input.financialHandoffs.some((handoff) => !input.module8.professionalHandoffs.some((contextHandoff) => contextHandoff.id === handoff.id))) reasons.push('FINANCIAL_HANDOFF_MUST_EXIST_IN_MODULE_8_CONTEXT');
  if (input.module8.context.persistencePosture !== 'NOT_PERSISTED') reasons.push('FINANCIAL_ORCHESTRATION_MUST_NOT_PERSIST');
  if (input.module8.context.hiddenTransferPosture !== 'PROHIBITED') reasons.push('FINANCIAL_ORCHESTRATION_HIDDEN_TRANSFER_PROHIBITED');
  if (reasons.length > 0) return { classification: 'FAIL_CLOSED', orchestration: null, reasons: Object.freeze([...new Set(reasons)].sort()) };
  return { classification: 'VALID_MODULE_6_ORCHESTRATION', orchestration: Object.freeze({ ...input }), reasons: Object.freeze([]) };
}
