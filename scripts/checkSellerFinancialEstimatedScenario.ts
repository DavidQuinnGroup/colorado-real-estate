import assert from 'node:assert/strict';
import { calculateSellerFinancialScenario, validateSellerFinancialScenarioRequest } from '../lib/sellerFinancialEstimatedScenario';

const base = validateSellerFinancialScenarioRequest({ scenarioKey: 'ATLAS CERTIFICATION', inputs: [
  { key: 'SALE_PRICE', state: 'VALUE', amountCents: 650_000_55, sourceClass: 'SCENARIO_ASSUMPTION' },
  { key: 'PAYOFF', state: 'VALUE', amountCents: 200_000_25, sourceClass: 'AGENT_ESTIMATE' },
  { key: 'SELLING_COMPENSATION', state: 'VALUE', amountCents: 19_500_02, sourceClass: 'SCENARIO_ASSUMPTION' },
  { key: 'SELLER_CONCESSION', state: 'VALUE', amountCents: 0, sourceClass: 'SCENARIO_ASSUMPTION' },
  { key: 'PREPARATION_ALLOWANCE', state: 'UNKNOWN', amountCents: null, sourceClass: 'UNKNOWN' },
] });
const result = calculateSellerFinancialScenario(base.inputs);
assert.equal(result.state, 'ESTIMATED');
assert.equal(result.estimatedNetProceedsCents, 430_500_28);
assert.deepEqual(result.optionalUnknownInputs, ['PREPARATION_ALLOWANCE']);
const held = calculateSellerFinancialScenario(validateSellerFinancialScenarioRequest({ ...base, inputs: base.inputs.map((input) => input.key === 'PAYOFF' ? { ...input, state: 'UNKNOWN', amountCents: null, sourceClass: 'UNKNOWN' } : input) }).inputs);
assert.equal(held.state, 'INCOMPLETE_ESTIMATE');
assert.throws(() => validateSellerFinancialScenarioRequest({ scenarioKey: 'bad', inputs: [{ key: 'SALE_PRICE', state: 'VALUE', amountCents: -1, sourceClass: 'SCENARIO_ASSUMPTION' }] }));
console.log('SELLER_FINANCIAL_ESTIMATED_SCENARIO_CHECK: PASS');
