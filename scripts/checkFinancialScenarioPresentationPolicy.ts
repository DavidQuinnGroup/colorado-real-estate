import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  REIE_FINANCIAL_SCENARIO_ALLOWED_OUTPUTS,
  REIE_FINANCIAL_SCENARIO_PROHIBITED_OUTPUTS,
  validateFinancialScenarioPresentation,
  type ReieFinancialScenarioPresentationItem,
} from '../lib/financialScenarioPresentationPolicy.js';

const source = fs.readFileSync(path.resolve(process.cwd(), 'lib/financialScenarioPresentationPolicy.ts'), 'utf8');
for (const token of ['from \'./financialEngine', 'from \'./marketMetrics', 'MarketChart', 'strategyGenerator', 'MarketGauge', 'getMarketData', 'marketAnalytics', 'marketPulse', 'PrismaClient', '@prisma', 'fetch(', 'process.env', 'Typesense', 'sendEmail']) {
  assert.equal(source.includes(token), false, `scenario policy must not depend on ${token}`);
}
assert.equal(REIE_FINANCIAL_SCENARIO_ALLOWED_OUTPUTS.length, 10);
assert.equal(REIE_FINANCIAL_SCENARIO_PROHIBITED_OUTPUTS.length, 25);
assert.ok(REIE_FINANCIAL_SCENARIO_PROHIBITED_OUTPUTS.includes('LOAN_APPROVAL'));
assert.ok(REIE_FINANCIAL_SCENARIO_PROHIBITED_OUTPUTS.includes('AI_PERSONALIZED_FINANCIAL_STRATEGY'));

const safe: ReieFinancialScenarioPresentationItem = {
  id: 'pi-1', kind: 'PRINCIPAL_AND_INTEREST_ILLUSTRATION', classification: 'DERIVED_ILLUSTRATION', value: 2500,
  inputs: ['purchasePrice', 'downPayment', 'interestRate', 'loanTermYears'], assumptions: ['User-entered assumptions'],
  calculationType: 'PRINCIPAL_AND_INTEREST', limitations: ['No approval, qualification, affordability, or lender conclusion.'], recommendation: false,
};
assert.equal(validateFinancialScenarioPresentation([safe]).classification, 'VALID_SAFE_PRESENTATION');
assert.equal(validateFinancialScenarioPresentation([{ ...safe, inputs: [] }]).classification, 'FAIL_CLOSED');
assert.equal(validateFinancialScenarioPresentation([{ ...safe, kind: 'LOAN_APPROVAL', classification: 'PROHIBITED_OUTPUT', value: null, limitations: ['Blocked'] }]).classification, 'FAIL_CLOSED');
assert.equal(validateFinancialScenarioPresentation([{ ...safe, recommendation: true as never }]).classification, 'FAIL_CLOSED');
assert.equal(validateFinancialScenarioPresentation([{ ...safe, kind: 'UNKNOWN' as never }]).classification, 'FAIL_CLOSED');

console.log('[financial-scenario-presentation-policy] ok: complete allowed/prohibited output taxonomy, visible-derivation metadata, recommendation prohibition, legacy-import quarantine, and fail-closed evaluation verified.');
