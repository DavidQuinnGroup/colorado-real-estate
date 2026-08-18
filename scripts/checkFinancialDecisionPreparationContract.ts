import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildFinancialDecisionPreparation,
  validateFinancialDecisionPreparationInput,
  type ReieFinancialDecisionPreparationInput,
} from '../lib/financialDecisionPreparationContract.js';

const source = fs.readFileSync(path.resolve(process.cwd(), 'lib/financialDecisionPreparationContract.ts'), 'utf8');
for (const token of ['financialEngine', 'marketMetrics', 'MarketChart', 'strategyGenerator', 'MarketGauge', 'getMarketData', 'marketAnalytics', 'marketPulse', 'PrismaClient', '@prisma', 'fetch(', 'process.env', 'Typesense', 'sendEmail']) {
  assert.equal(source.includes(token), false, `financial preparation must not depend on ${token}`);
}

const fact = {
  id: 'goal-1', label: 'Selected financing preparation goal', value: 'Prepare questions', classification: 'USER_ASSUMPTION' as const,
  provenance: { origin: 'EXPLICIT_CUSTOMER_INPUT' as const, reference: 'customer-goal', sourceId: null, freshness: 'NOT_APPLICABLE' as const, rights: 'NOT_APPLICABLE' as const },
  visibility: 'GUIDED' as const, verification: 'NOT_REQUIRED' as const, prohibitedUse: ['No recommendation or conclusion.'],
};
const context: ReieFinancialDecisionPreparationInput['context'] = {
  schemaVersion: 'REIE_DECISION_CONTEXT_V1', mode: 'EXPLICIT_CONTEXT_ONLY', role: 'CUSTOMER',
  selectedGoals: [{ id: 'goal-1', domain: 'FINANCING', evidence: fact }], items: [], professionalHandoffs: [],
  sourcePosture: { state: 'UNVERIFIED', rights: 'UNKNOWN_OR_UNRESOLVED', freshness: 'UNKNOWN' },
  persistencePosture: 'NOT_PERSISTED', hiddenTransferPosture: 'PROHIBITED',
  prohibitedOutputs: ['NO_RECOMMENDATION', 'NO_AFFORDABILITY_CONCLUSION', 'NO_LENDER_RECOMMENDATION'],
};
const input: ReieFinancialDecisionPreparationInput = {
  context,
  preparationContext: 'FINANCING_PREPARATION_CONTEXT',
  scenarioInput: { purchasePrice: 500000, downPayment: 100000, interestRate: 6.5, loanTermYears: 30, propertyTaxes: 500 },
  fields: [{ id: 'field-price', key: 'purchasePrice', evidence: { ...fact, id: 'field-price', label: 'Purchase price assumption', value: 500000 }, prohibitedUse: ['No affordability or buying-power conclusion.'] }],
  movingCostCategories: ['Packing and transportation'], capexCategories: ['Inspection follow-up'], timeline: 'Before lender conversation',
  customerSelectedFinancialQuestions: ['Which assumptions should I verify with a lender?'], professionalHandoffs: [],
};
const valid = buildFinancialDecisionPreparation(input);
assert.equal(valid.classification, 'VALID_FINANCIAL_PREPARATION');
assert.equal(valid.scenario?.status, 'FINANCING_SCENARIO_CALCULATOR_IMPLEMENTED_ASSUMPTION_ONLY');
assert.ok(valid.calculations.some((item) => item.calculationType === 'PRINCIPAL_AND_INTEREST'));
assert.equal(valid.assumptions[0].classification, 'USER_ASSUMPTION');
assert.equal(valid.assumptions[0].provenance.origin, 'EXPLICIT_CUSTOMER_INPUT');
assert.ok(valid.missingInputs.some((item) => item.classification === 'NOT_AVAILABLE'));
assert.deepEqual(buildFinancialDecisionPreparation({ ...input, preparationContext: 'PROFESSIONAL_VERIFICATION' }).classification, 'VALID_FINANCIAL_PREPARATION');
assert.ok(validateFinancialDecisionPreparationInput({ ...input, fields: [{ ...input.fields[0], prohibitedUse: [] }] }).includes('FINANCIAL_PREPARATION_FIELD_PROHIBITED_USE_REQUIRED'));
assert.ok(validateFinancialDecisionPreparationInput({ ...input, context: { ...context, hiddenTransferPosture: 'ALLOWED' as never } }).includes('HIDDEN_TRANSFER_MUST_REMAIN_PROHIBITED'));
assert.equal(buildFinancialDecisionPreparation({ ...input, fields: [{ ...input.fields[0], evidence: { ...input.fields[0].evidence, classification: 'PROHIBITED_OUTPUT', value: null, visibility: 'COMPLIANCE_BLOCKED' } }] }).classification, 'FAIL_CLOSED');

console.log('[financial-decision-preparation-contract] ok: assumption-only calculator reuse, explicit evidence provenance, missing-input preparation, professional handoff boundary, no persistence, and fail-closed validation verified.');
