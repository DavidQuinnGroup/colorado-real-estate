import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildFinancingScenario, calculateMonthlyPrincipalAndInterest } from '../lib/financingScenarioCalculator.js';
import { buildPropertyComparisonWorkspace } from '../lib/propertyComparisonIntelligence.js';
import { buildPropertyProduct31Model } from '../lib/propertyProduct31.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const comparisonModel = read('lib/propertyComparisonIntelligence.ts');
const financingModel = read('lib/financingScenarioCalculator.ts');
const productModel = read('lib/propertyProduct31.ts');
const propertyExperience = read('components/PropertyProduct31Experience.tsx');
const planner = read('components/BuyerFinancingDecisionPlanner.tsx');
const readinessGuide = read('components/BuyerFinancingReadinessGuide.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');

const monthlyPI = calculateMonthlyPrincipalAndInterest(400000, 6, 30);
assert(monthlyPI && monthlyPI > 2398 && monthlyPI < 2399, 'Mortgage principal and interest formula must be amortized correctly.');
assert.equal(calculateMonthlyPrincipalAndInterest(360000, 0, 30), 1000, 'Zero-interest edge case must divide by term months.');

const scenario = buildFinancingScenario({
  purchasePrice: 500000,
  downPayment: 100000,
  interestRate: 6,
  loanTermYears: 30,
  propertyTaxes: 450,
  homeownersInsurance: 180,
  hoaDues: 75,
  mortgageInsurance: 0,
});

assert.equal(scenario.status, 'FINANCING_SCENARIO_CALCULATOR_IMPLEMENTED_ASSUMPTION_ONLY');
assert.equal(scenario.requiredInputsComplete, true);
assert.equal(scenario.loanAmount, 400000);
assert(scenario.combinedMonthlyEstimate && scenario.combinedMonthlyEstimate > 3100 && scenario.combinedMonthlyEstimate < 3105);
assert(scenario.assumptions.every((assumption) => assumption.classification === 'USER_ASSUMPTION'));
assert.equal(scenario.boundaries.currentRateQuote, false);
assert.equal(scenario.boundaries.lenderQuote, false);
assert.equal(scenario.boundaries.approval, false);
assert.equal(scenario.boundaries.qualification, false);
assert.equal(scenario.boundaries.affordabilityConclusion, false);
assert.equal(scenario.boundaries.providerActivation, false);

const invalidScenario = buildFinancingScenario({
  purchasePrice: 500000,
  downPayment: 600000,
  interestRate: -1,
  loanTermYears: 30,
});
assert.equal(invalidScenario.requiredInputsComplete, false);
assert(invalidScenario.validationMessages.includes('Down payment cannot exceed the purchase price assumption.'));
assert(invalidScenario.validationMessages.includes('Interest-rate assumption cannot be negative.'));
assert.equal(invalidScenario.combinedMonthlyEstimate, null);

const comparison = buildPropertyComparisonWorkspace({
  subject: {
    id: 'subject',
    address: '100 Main St',
    city: 'Boulder',
    neighborhood: 'Mapleton Hill',
    price: 1000000,
    beds: 4,
    baths: 3,
    sqft: 2500,
    lotSize: 0.2,
    yearBuilt: 1970,
    propertyType: 'Detached',
    status: 'Active',
  },
  comparisons: [
    {
      id: 'comparison-1',
      address: '200 Main St',
      city: 'Boulder',
      neighborhood: 'Whittier',
      price: 850000,
      beds: 3,
      baths: 2,
      sqft: 1900,
      status: 'Active',
    },
  ],
});

assert.equal(comparison.status, 'PROPERTY_COMPARISON_INTELLIGENCE_IMPLEMENTED');
assert.equal(comparison.canCompare, true);
assert.equal(comparison.comparisons.length, 1);
assert(comparison.comparisons[0].synthesis.materiallyDifferent > 0, 'Comparison must surface factual differences.');
assert(comparison.comparisons[0].synthesis.evidenceUnavailable > 0, 'Comparison must surface missing data.');
assert(comparison.comparisons[0].synthesis.evidenceAsymmetry > 0, 'Comparison must surface evidence asymmetry.');
assert(comparison.comparisons[0].dimensions.some((dimension) => dimension.evidenceIntegrity === 'EVIDENCE ASYMMETRY'), 'Comparison must classify one-sided evidence availability.');
assert(comparison.comparisons[0].dimensions.some((dimension) => dimension.evidenceIntegrity === 'DERIVED / CALCULATED DIFFERENCE'), 'Comparison must classify calculated differences.');
assert(comparison.comparisons[0].integrity.limitations.some((limitation) => limitation.state === 'PROFESSIONAL JUDGMENT'), 'Comparison must keep professional judgment limitations.');
assert(comparison.comparisons[0].dimensions.every((dimension) => dimension.investigationPrompt.length > 20));
assert(comparison.comparisons[0].dimensions.every((dimension) => dimension.comparisonLimitation.length > 20));
assert.equal(comparison.protectedBoundaries.ranking, false);
assert.equal(comparison.protectedBoundaries.scoring, false);
assert.equal(comparison.protectedBoundaries.valuation, false);
assert.equal(comparison.protectedBoundaries.suitabilityRecommendation, false);
assert.equal(comparison.protectedBoundaries.financingApproval, false);

const product = buildPropertyProduct31Model({
  address: '100 Main St',
  city: 'Boulder',
  state: 'CO',
  zip: '80302',
  neighborhood: 'Mapleton Hill',
  propertyType: 'Detached',
  status: 'Active',
  price: 1000000,
  beds: 4,
  baths: 3,
  sqft: 2500,
  lotSize: 0.2,
  yearBuilt: 1970,
  relatedListings: [
    {
      id: 'comparison-1',
      address: '200 Main St',
      city: 'Boulder',
      state: 'CO',
      neighborhood: 'Whittier',
      price: 850000,
      beds: 3,
      baths: 2,
      sqft: 1900,
      status: 'Active',
    },
  ],
});

assert.equal(product.comparisonIntelligence.status, 'PROPERTY_COMPARISON_INTELLIGENCE_IMPLEMENTED');
assert.equal(product.comparisonIntelligence.protectedBoundaries.ranking, false);
assert.equal(product.comparisonIntelligence.protectedBoundaries.lenderQuote, false);

for (const marker of [
  'data-testid="property-comparison-intelligence"',
  'data-testid="property-comparison-intelligence-item"',
  'data-testid="property-comparison-dimension"',
  'data-testid="property-comparison-evidence-integrity-summary"',
  'data-testid="property-comparison-limitation"',
  'data-testid="property-comparison-source-methodology-link"',
  'data-property-comparison-ranking={String(model.comparisonIntelligence.protectedBoundaries.ranking)}',
  'data-property-comparison-scoring={String(model.comparisonIntelligence.protectedBoundaries.scoring)}',
  'data-property-comparison-financing-approval={String(model.comparisonIntelligence.protectedBoundaries.financingApproval)}',
]) {
  assertIncludes(propertyExperience, marker, `Property comparison surface missing marker: ${marker}`);
}

assertIncludes(productModel, 'comparisonIntelligence', 'Property Product 3.1 must expose comparison intelligence.');
assertIncludes(productModel, 'buildPropertyComparisonWorkspace', 'Property Product 3.1 must build comparison intelligence from related listings.');
assertIncludes(comparisonModel, 'More available data does not mean a better property', 'Comparison must preserve evidence asymmetry boundary.');
assertIncludes(planner, "import { buildFinancingScenario } from '@/lib/financingScenarioCalculator';", 'Planner must consume the reusable financing scenario engine.');
assertIncludes(planner, 'data-buyer-financing-planner-scenario-calculator="true"', 'Planner must mark the bounded scenario calculator as active.');
assertIncludes(readinessGuide, 'data-buyer-financing-readiness-scenario-calculator="true"', 'Buyer readiness must expose scenario-calculator activation.');
assertIncludes(readinessGuide, 'data-buyer-financing-readiness-payment-estimate-boundary="user-assumption-only"', 'Buyer readiness must preserve assumption-only payment boundary.');

for (const forbidden of [
  'best property',
  'winner',
  'loser',
  'recommended property',
  'investment score',
  'fit score',
  'affordability score',
  'you qualify',
  'you are approved',
  'current mortgage rate',
  'rate quote',
  'rate lock',
  'lender recommendation',
  'fetch(',
  'localStorage',
  'sessionStorage',
  'navigator.sendBeacon',
  'prisma.',
  'createClient(',
]) {
  assertNotIncludes([comparisonModel, financingModel, planner, propertyExperience].join('\n'), forbidden, `Comparison/financing intelligence must not include ${forbidden}.`);
}

assert.equal(
  packageJson.scripts?.['check:reie-comparison-financing-intelligence'],
  'npm run worker:build && node dist/scripts/checkReieComparisonFinancingIntelligence.js',
  'package.json must expose comparison/financing intelligence validation.',
);
assertIncludes(tsconfig, 'scripts/checkReieComparisonFinancingIntelligence.ts', 'Worker build must compile comparison/financing intelligence validation.');
assertIncludes(tsconfig, 'lib/propertyComparisonIntelligence.ts', 'Worker build must compile property comparison intelligence.');
assertIncludes(tsconfig, 'lib/financingScenarioCalculator.ts', 'Worker build must compile financing scenario calculator.');

console.log('[reie-comparison-financing-intelligence] ok: property comparison synthesis, financing scenario math, assumption boundaries, and protected-system exclusions verified.');
