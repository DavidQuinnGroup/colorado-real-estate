import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  formatAgentCurrencyFromCents,
  formatAgentLoanTerm,
  formatAgentRateFromBasisPoints,
  humanizeOutputReviewState,
  humanizeScenarioReferenceType,
  humanizeScenarioRole,
  humanizeStrategyKeyFallback,
  humanizeStrategyProfile,
  scenarioMetricPresentation,
} from '../lib/agentWorkspacePresentation';

const root = process.cwd();
const read = (path: string) => readFile(resolve(root, path), 'utf8');

assert.equal(formatAgentCurrencyFromCents(80_000_000), '$800,000');
assert.equal(formatAgentCurrencyFromCents(-257_024, { monthly: true }), '-$2,570/mo');
assert.equal(formatAgentCurrencyFromCents(0), '$0');
assert.equal(formatAgentCurrencyFromCents(null), 'Not recorded');
assert.equal(formatAgentRateFromBasisPoints(650), '6.50%');
assert.equal(formatAgentRateFromBasisPoints(725), '7.25%');
assert.equal(formatAgentRateFromBasisPoints(0), '0.00%');
assert.equal(formatAgentRateFromBasisPoints(null), 'Not recorded');
assert.equal(formatAgentLoanTerm(360), '30 years');
assert.equal(formatAgentLoanTerm(180), '15 years');
assert.equal(formatAgentLoanTerm(12), '1 year');
assert.equal(formatAgentLoanTerm(18), '18 months');
assert.equal(humanizeScenarioRole('CURRENT_HOME_SELL'), 'Current home - Sell');
assert.equal(humanizeScenarioRole('REPLACEMENT_PRIMARY_ACQUIRE'), 'Replacement primary - Buy');
assert.equal(humanizeScenarioReferenceType('HYPOTHETICAL'), 'Hypothetical property');
assert.equal(humanizeOutputReviewState('AGENT_REVIEW_REQUIRED'), 'Agent review required');
assert.equal(humanizeStrategyProfile('KEEP_EXISTING_CONVERT_TO_RENTAL_AND_BUY_PRIMARY'), 'Keep current home as a rental and buy a primary residence');
assert.equal(humanizeStrategyKeyFallback('ATLAS_SYNTHETIC_SELL_EXISTING_BUY_PRIMARY'), 'Sell Existing Buy Primary');
assert.deepEqual(Object.values(scenarioMetricPresentation).map((metric) => metric.label), [
  'Liquidity after planned sale',
  'Cash required before sale proceeds',
  'Modeled monthly property cash flow after sale',
  'Estimated net sale proceeds',
]);

const [page, multiProperty, strategySuite, hierarchy] = await Promise.all([
  read('app/agent/strategy/page.tsx'),
  read('components/agent/MultiPropertyFinancialScenarioWorkspace.tsx'),
  read('components/agent/MultiDimensionalStrategyWorkspace.tsx'),
  read('lib/agentWorkspacePresentation.ts'),
]);

assert.match(page, /<h1[^>]*>Financial Strategy<\/h1>/, 'Financial Strategy must be the page heading.');
for (const heading of ['Multi-property financial scenarios', 'New scenario version', 'Owned scenario versions']) assert.ok(multiProperty.includes(heading), `Scenario workspace must include ${heading}.`);
for (const key of Object.keys(scenarioMetricPresentation)) assert.ok(multiProperty.includes(`scenarioMetricPresentation.${key}`), `Scenario workspace must render the ${key} presentation mapping.`);
assert.doesNotMatch(multiProperty, /label="Timed liquidity"|label="Bridge liquidity"/, 'Raw Scenario metric terminology must not be primary UI labels.');
assert.doesNotMatch(multiProperty, /Bridge loan/i, 'Scenario presentation must not imply bridge financing.');
assert.match(multiProperty, /Interest rate \(%\)/);
assert.match(multiProperty, /Loan term \(years\)/);
assert.match(multiProperty, /Scenario key:/);
assert.match(multiProperty, /Technical fingerprint:/);
assert.match(strategySuite, /<h2[^>]*>Multi-Dimensional Strategy Suite<\/h2>/);
assert.match(strategySuite, /Technical ID:/);
assert.match(strategySuite, /min-w-0/);
assert.match(strategySuite, /xl:grid-cols-2/);
assert.doesNotMatch(strategySuite, /<h1/);
for (const token of ['page:', 'section:', 'subsection:', 'card:', 'field:', 'supporting:']) assert.ok(hierarchy.includes(token), `Hierarchy token ${token} must be centralized.`);

console.log('AGENT_WORKSPACE_INFORMATION_HIERARCHY_AND_FINANCIAL_TERMINOLOGY_CHECK: PASS');
