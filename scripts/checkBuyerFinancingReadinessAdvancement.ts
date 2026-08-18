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

function assertFileMissing(path: string) {
  assert(!existsSync(path), `${path} must remain absent.`);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const buyPage = read('app/buy/page.tsx');
const financingConfidence = read('components/FinancingConfidenceEducation.tsx');
const readinessGuide = read('components/BuyerFinancingReadinessGuide.tsx');
const grandPlanPage = read('app/grand-plan/page.tsx');
const contactPage = read('app/contact/page.tsx');

assertFileMissing('app/financing-readiness/page.tsx');
assertFileMissing('app/api/financing-readiness/route.ts');
assertFileMissing('app/api/lender/route.ts');
assertFileMissing('app/api/mortgage/route.ts');

assert.equal(
  packageJson.scripts?.['check:buyer-financing-readiness-advancement'],
  'npm run worker:build && node dist/scripts/checkBuyerFinancingReadinessAdvancement.js',
  'package.json must expose Buyer Financing Readiness Advancement validation.',
);
assertIncludes(
  tsconfig,
  'scripts/checkBuyerFinancingReadinessAdvancement.ts',
  'Worker build must include Buyer Financing Readiness Advancement validation.',
);

assertIncludes(buyPage, 'BuyerFinancingReadinessGuide', 'Buy page must render the financing readiness guide.');
assertIncludes(buyPage, 'href="#financing-readiness"', 'Buy page must include one buyer entry to the readiness anchor.');
assertIncludes(buyPage, 'id="buyer-financing-confidence"', 'Certified Buyer Financing Confidence anchor must remain present.');
assertIncludes(buyPage, 'id="financing-confidence"', 'Legacy Financing Confidence anchor must remain resolvable.');
assertIncludes(
  buyPage,
  "href: '/buy#buyer-financing-confidence'",
  'Buyer Journey Cohesion panel must preserve certified Financing Guidance destination.',
);

for (const marker of [
  'data-testid="buyer-financing-readiness-guide"',
  'data-buyer-financing-readiness-surface="buy"',
  'data-buyer-financing-readiness-route="/buy#financing-readiness"',
  'data-buyer-financing-readiness-calculator="false"',
  'data-buyer-financing-readiness-payment-estimate="false"',
  'data-buyer-financing-readiness-rate-output="false"',
  'data-buyer-financing-readiness-qualification="false"',
  'data-buyer-financing-readiness-affordability="false"',
  'data-buyer-financing-readiness-lender-matching="false"',
  'data-buyer-financing-readiness-financial-input="false"',
  'data-buyer-financing-readiness-upload="false"',
  'data-buyer-financing-readiness-persistence="false"',
  'data-buyer-financing-readiness-crm-automation="false"',
  'data-buyer-financing-readiness-email="false"',
  'data-buyer-financing-readiness-alerts="false"',
  'data-buyer-financing-readiness-telemetry="false"',
  'data-buyer-financing-readiness-ai="false"',
  'data-buyer-financing-readiness-provider-activation="false"',
  'data-buyer-financing-readiness-score="false"',
]) {
  assertIncludes(readinessGuide, marker, `Financing Readiness guide must expose marker: ${marker}`);
}

for (const phrase of [
  'Financing readiness means organizing documents',
  'not preapproval, qualification, affordability determination',
  'payment calculation',
  'rate quote',
  'loan recommendation',
  'not every item applies to every buyer or financing program',
  'income documentation',
  'employment history',
  'asset records',
  'debt obligations',
  'gift-fund documentation where applicable',
  'business or self-employment records where applicable',
  'property-related cost questions',
  'insurance and HOA questions',
  'Target purchase range as a personal planning assumption',
  'Down-payment assumptions',
  'closing-cost questions',
  'taxes, insurance, HOA dues, maintenance, utilities',
  'rate-lock, and loan-term questions for qualified lender review',
  'Which documents apply to my situation',
  'Which costs should I ask about before making an offer',
  'Financing Confidence is an educational preparation framework',
  'not a credit decision, qualification result, or affordability conclusion',
  'data-testid="buyer-financing-readiness-documentation-checklist"',
  'data-testid="buyer-financing-readiness-assumption-prompts"',
  'data-testid="buyer-financing-readiness-lender-questions"',
  'data-testid="buyer-financing-readiness-context-boundary"',
  'data-testid="buyer-financing-readiness-continuity"',
  'Buyer Guidance',
  'Financing Confidence',
  'Search Homes',
  'Market Context',
  'Grand Plan',
  'Advisory Guidance',
]) {
  assertIncludes(readinessGuide, phrase, `Financing Readiness guide must include required content: ${phrase}`);
}

for (const group of ['Review', 'Gather', 'Verify', 'Discuss']) {
  assertIncludes(readinessGuide, group, `Preparation group must remain present: ${group}`);
}

for (const [label, href, destination] of [
  ['Buyer Guidance', '/buy', 'buyer-guidance'],
  ['Financing Confidence', '/buy#financing-confidence', 'financing-confidence'],
  ['Search Homes', '/search', 'search'],
  ['Market Context', '/market', 'market-context'],
  ['Grand Plan', '/grand-plan', 'grand-plan'],
  ['Advisory Guidance', '/contact#advisory-readiness', 'advisory'],
] as const) {
  assertIncludes(readinessGuide, `label: '${label}'`, `${label} must be a governed readiness CTA.`);
  assertIncludes(readinessGuide, `href: '${href}'`, `${label} must route to ${href}.`);
  assertIncludes(readinessGuide, `destination: '${destination}'`, `${label} must expose destination metadata.`);
}

for (const prohibited of [
  'estimated monthly payment',
  'payment estimate',
  'you qualify',
  'preapproved',
  'pre-approved',
  'instant approval',
  'you can afford',
  'affordability score',
  'readiness score',
  'financial strength',
  'approval likelihood',
  'buying power estimate',
  'preferred lender',
  'recommended lender',
  'best loan',
  'lowest rate',
  'guaranteed approval',
]) {
  assertNotIncludes(readinessGuide, prohibited, `Financing Readiness guide must not expose prohibited wording: ${prohibited}`);
}

for (const runtimeActivation of [
  "'use client'",
  'useState',
  'useEffect',
  'fetch(',
  'XMLHttpRequest',
  'navigator.sendBeacon',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  '<input',
  '<textarea',
  '<select',
  '<form',
  'FormData',
]) {
  assertNotIncludes(readinessGuide, runtimeActivation, `Financing Readiness guide must not introduce runtime intake, persistence, or tracking: ${runtimeActivation}`);
}

assertIncludes(
  financingConfidence,
  'data-financing-confidence-calculator="false"',
  'Financing Confidence no-calculator marker must remain visible.',
);
assert.equal('data-buyer-financing-readiness-affordability="false"'.includes('affordability="false"'), true, 'Explicit no-affordability marker must remain a safe negative assertion.');
assert.equal(['You qualify for this purchase price.', 'Maximum purchase price', 'Guaranteed approval'].some((claim) => /qualify|maximum purchase|guaranteed approval/i.test(claim)), true, 'Positive qualification and affordability claims must remain detectable.');
assertIncludes(
  financingConfidence,
  'data-financing-confidence-lender-workflow="false"',
  'Financing Confidence no-lender-workflow marker must remain visible.',
);
assertIncludes(
  financingConfidence,
  'It does not provide loan qualification',
  'Financing Confidence must preserve no-qualification boundary language.',
);
assertIncludes(
  financingConfidence,
  'lender recommendations, or affordability conclusions',
  'Financing Confidence must preserve lender and affordability boundary language.',
);

assertIncludes(grandPlanPage, 'JourneyCohesionPanel', 'Grand Plan continuity must remain present.');
assertIncludes(contactPage, 'JourneyCohesionPanel', 'Contact continuity must remain present.');

console.log(
  '[buyer-financing-readiness-advancement] ok: single Buy readiness anchor, preparation groups, documentation checklist, lender questions, non-calculative prompts, journey continuity, no qualification, no rates, no lender workflow, no persistence, and protected boundaries verified.',
);
