import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function assertMissing(path: string) {
  assert(!existsSync(path), `${path} must remain absent.`);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const buyPage = read('app/buy/page.tsx');
const readinessGuide = read('components/BuyerFinancingReadinessGuide.tsx');
const planner = read('components/BuyerFinancingDecisionPlanner.tsx');
const calculator = read('lib/financingScenarioCalculator.ts');
const financingConfidence = read('components/FinancingConfidenceEducation.tsx');
const specification = read(
  'docs/project-atlas/executive-library/REIE-BUYER-FINANCING-DECISION-PLANNER-PRODUCT-SPECIFICATION.md',
);
const implementation = read(
  'docs/project-atlas/executive-library/REIE-BUYER-FINANCING-DECISION-PLANNER-PHASE-1-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');

assert.equal(
  packageJson.scripts?.['check:buyer-financing-decision-planner'],
  'npm run worker:build && node dist/scripts/checkBuyerFinancingDecisionPlanner.js',
  'package.json must expose Buyer Financing Decision Planner validation.',
);
assertIncludes(
  tsconfig,
  'scripts/checkBuyerFinancingDecisionPlanner.ts',
  'Worker build must include Buyer Financing Decision Planner validation.',
);

for (const path of [
  'app/mortgage-calculator/page.tsx',
  'app/mortgage/page.tsx',
  'app/mortgages/page.tsx',
  'app/financing/page.tsx',
  'app/financing-readiness/page.tsx',
  'app/lender/page.tsx',
  'app/lenders/page.tsx',
  'app/api/mortgage/route.ts',
  'app/api/lender/route.ts',
  'app/api/financing/route.ts',
]) {
  assertMissing(path);
}

assertIncludes(buyPage, '<BuyerFinancingReadinessGuide />', 'Buy page must preserve the existing readiness surface.');
assertIncludes(
  readinessGuide,
  "import BuyerFinancingDecisionPlanner from './BuyerFinancingDecisionPlanner';",
  'Readiness guide must compose the bounded planner component.',
);
assertIncludes(
  readinessGuide,
  '<BuyerFinancingDecisionPlanner />',
  'Planner must live inside the financing-readiness section.',
);
assertIncludes(
  readinessGuide,
  'id="financing-readiness"',
  'Planner parent surface must remain /buy#financing-readiness.',
);

for (const marker of [
  "'use client'",
  'useState<PlannerValues>',
  'useMemo',
  'data-testid="buyer-financing-decision-planner"',
  'data-buyer-financing-planner-surface="/buy#financing-readiness"',
  'data-buyer-financing-planner-provider="false"',
  'data-buyer-financing-planner-persistence="session-only-no-persistence"',
  'data-buyer-financing-planner-new-route="false"',
  'data-buyer-financing-planner-live-rates="false"',
  'data-buyer-financing-planner-scenario-calculator="true"',
  'data-buyer-financing-planner-approval="false"',
  'data-buyer-financing-planner-qualification="false"',
  'data-buyer-financing-planner-affordability="false"',
  'data-buyer-financing-planner-buying-power="false"',
  'data-buyer-financing-planner-score="false"',
  'data-buyer-financing-planner-crm="false"',
  'data-buyer-financing-planner-telemetry="false"',
]) {
  assertIncludes(planner, marker, `Planner must include governance marker: ${marker}`);
}

for (const field of [
  'purchasePrice',
  'downPayment',
  'interestRate',
  "loanTermYears: '15' | '20' | '30'",
  'propertyTaxes',
  'homeownersInsurance',
  'hoaDues',
  'mortgageInsurance',
  'maintenance',
  'utilities',
  'otherRecurringCosts',
  'closingCosts',
]) {
  assertIncludes(planner, field, `Planner must include specified field: ${field}`);
}

for (const term of ['<option value="15">15 years</option>', '<option value="20">20 years</option>', '<option value="30">30 years</option>']) {
  assertIncludes(planner, term, `Planner must support fixed term selection: ${term}`);
}

for (const requiredCopy of [
  'Educational planning only',
  'User-entered assumptions only',
  'Not a loan quote',
  'approval',
  'qualification',
  'affordability determination',
  'rate guarantee',
  'professional verification',
  'Educational principal-and-interest estimate',
  'User-entered monthly assumptions',
  'Combined monthly assumption estimate',
  'Items to verify',
  'Questions to verify',
  'Professional conversation transition',
  'Do not submit confidential financial details through this planner',
  'Reset assumptions',
]) {
  assertIncludes(planner, requiredCopy, `Planner must include required bounded copy: ${requiredCopy}`);
}

for (const arithmetic of [
  'buildFinancingScenario',
  'calculateMonthlyPrincipalAndInterest',
  'purchasePrice - downPayment',
  'annualRate === 0',
  'Math.round(value)',
  'optionalMonthlySubtotal',
  'combinedMonthlyEstimate',
]) {
  assertIncludes(`${planner}\n${calculator}`, arithmetic, `Planner/calculator must include bounded arithmetic behavior: ${arithmetic}`);
}

for (const safeHandling of [
  'Down payment cannot exceed the purchase price assumption.',
  'Purchase price must be greater than zero before arithmetic can appear.',
  'Interest-rate assumption cannot be negative.',
  'cannot be negative',
  'does not include missing or unverified costs',
]) {
  assertIncludes(planner, safeHandling, `Planner must include safe handling copy: ${safeHandling}`);
}

for (const prohibited of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'fetch(',
  'XMLHttpRequest',
  'navigator.sendBeacon',
  'FormData',
  'prisma',
  'supabase',
  'analytics',
  'telemetry.track',
  'OpenAI',
  'provider rate',
  'lender feed',
  'recommended lender',
  'preferred lender',
  'best loan',
  'you qualify',
  'you are approved',
  'you can afford',
  'buying power',
  'affordability score',
  'readiness score',
  'confidence percentage',
  'approval meter',
  'maximum purchase price',
]) {
  assertNotIncludes(planner, prohibited, `Planner must not include prohibited behavior or wording: ${prohibited}`);
}

assertIncludes(
  financingConfidence,
  'data-financing-confidence-calculator="false"',
  'Existing Financing Confidence no-calculator boundary must remain.',
);
assertIncludes(
  financingConfidence,
  'data-financing-confidence-lender-workflow="false"',
  'Existing Financing Confidence no-lender-workflow boundary must remain.',
);

for (const doc of [specification, implementation, chatStart]) {
  assertIncludes(
    doc,
    'REIE_BUYER_FINANCING_DECISION_PLANNER',
    'Documentation and handoff must record the governed planner identity.',
  );
}
assertIncludes(implementation, 'implementation remains local, unpushed, and uncertified in production', 'Implementation record must preserve local-only status.');
assertIncludes(chatStart, 'Push remains unauthorized.', 'CHAT_START must preserve push prohibition.');

console.log(
  '[buyer-financing-decision-planner] ok: bounded planner surface, user-entered fields, limited arithmetic, disclosures, no provider, no persistence, no new route, advisory continuity, and prohibited outputs verified.',
);
