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
const contactPage = read('app/contact/page.tsx');
const advisoryGuide = read('components/AdvisoryHandoffGuide.tsx');
const comparePage = read('app/compare/page.tsx');
const buyerReadinessGuide = read('components/BuyerFinancingReadinessGuide.tsx');
const sellerReadinessGuide = read('components/SellerReadinessGuide.tsx');
const grandPlanPage = read('app/grand-plan/page.tsx');
const publicTrust = read('scripts/checkPublicTrustReadiness.ts');
const evidenceFoundation = read('scripts/checkEvidenceDepthDataIntegrationFoundation.ts');

assertFileMissing('app/advisory-handoff/page.tsx');
assertFileMissing('app/advisory-readiness/page.tsx');
assertFileMissing('app/contact/advisory-readiness/page.tsx');
assertFileMissing('app/api/advisory-handoff/route.ts');
assertFileMissing('app/api/advisory-readiness/route.ts');

assert.equal(
  packageJson.scripts?.['check:advisory-handoff-readiness'],
  'npm run worker:build && node dist/scripts/checkAdvisoryHandoffReadiness.js',
  'package.json must expose Advisory Handoff Readiness validation.',
);
assertIncludes(tsconfig, 'scripts/checkAdvisoryHandoffReadiness.ts', 'Worker build must include Advisory Handoff Readiness validation.');

assertIncludes(contactPage, 'AdvisoryHandoffGuide', 'Contact page must render the Advisory Handoff guide.');
assertIncludes(contactPage, 'JourneyCohesionPanel', 'Contact page must preserve certified journey cohesion.');
assertIncludes(contactPage, 'PUBLIC_CONTACT_EMAIL_STATUS', 'Contact page must preserve public contact email status.');
assertIncludes(contactPage, 'PUBLIC_NOTIFICATION_EMAIL', 'Contact page must preserve notification sender status.');
assertIncludes(contactPage, 'Do not submit confidential negotiating positions', 'Contact page must preserve privacy boundary.');

for (const marker of [
  'data-testid="advisory-handoff-readiness-guide"',
  'id="advisory-readiness"',
  'data-advisory-handoff-surface="contact"',
  'data-advisory-handoff-route="/contact#advisory-readiness"',
  'data-advisory-handoff-presentational="true"',
  'data-advisory-handoff-persistence="false"',
  'data-advisory-handoff-automation="false"',
  'data-advisory-handoff-personalization="false"',
  'data-advisory-handoff-hidden-context-transfer="false"',
  'data-advisory-handoff-new-contact-fields="false"',
  'data-advisory-handoff-crm="false"',
  'data-advisory-handoff-lead-routing="false"',
  'data-advisory-handoff-lead-scoring="false"',
  'data-advisory-handoff-email="false"',
  'data-advisory-handoff-alerts="false"',
  'data-advisory-handoff-telemetry="false"',
  'data-advisory-handoff-provider-activation="false"',
  'data-advisory-handoff-evidence-metadata-exposure="false"',
]) {
  assertIncludes(advisoryGuide, marker, `Advisory Handoff guide must expose marker: ${marker}`);
}

for (const phrase of [
  'Advisory Readiness',
  'Prepare the conversation without turning preparation into a decision.',
  'market and city context',
  'comparison tradeoffs',
  'buyer readiness',
  'financing-readiness questions',
  'seller preparation',
  'property-specific questions',
  'due-diligence priorities',
  'Customer priorities are not inferred',
  'does not replace legal, tax, lending, appraisal, inspection, engineering, insurance, title',
  'Conversation Preparation',
  'What decision am I trying to make?',
  'Which markets, properties, or paths am I considering?',
  'Which assumptions remain uncertain?',
  'Which property-specific issues need verification?',
  'Which documents or facts may be useful to have available?',
  'data-testid="advisory-handoff-conversation-prompts"',
  'data-testid="advisory-handoff-journey-context-groups"',
  'data-testid="advisory-handoff-questions-to-bring"',
  'data-testid="advisory-handoff-evidence-aware-framing"',
  'data-testid="advisory-handoff-continuity"',
  'Evidence may differ in freshness',
  'Citywide context',
  'may not apply to a specific property',
  'incomplete or conflicting information may require further review',
  'organize the decision',
  'explain process',
  'identify where specialists may be needed',
]) {
  assertIncludes(advisoryGuide, phrase, `Advisory Handoff guide must include required content: ${phrase}`);
}

for (const group of ['Compare', 'Buy', 'Finance', 'Sell', 'Prepare', 'Verify', 'Discuss']) {
  assertIncludes(advisoryGuide, `label: '${group}'`, `Journey-context group must remain present: ${group}`);
}

for (const [label, href, destination] of [
  ['Contact / Advisory', '/contact', 'contact'],
  ['Compare Cities', '/compare', 'comparison'],
  ['Buyer Guidance', '/buy', 'buyer'],
  ['Financing Readiness', '/buy#financing-readiness', 'financing-readiness'],
  ['Seller Guidance', '/sell', 'seller'],
  ['Seller Readiness', '/home-worth#seller-readiness', 'seller-readiness'],
  ['Market Context', '/market', 'market'],
  ['Grand Plan', '/grand-plan', 'grand-plan'],
] as const) {
  assertIncludes(advisoryGuide, `label: '${label}'`, `${label} must be a governed advisory handoff CTA.`);
  assertIncludes(advisoryGuide, `href: '${href}'`, `${label} must route to ${href}.`);
  assertIncludes(advisoryGuide, `destination: '${destination}'`, `${label} must expose destination metadata.`);
}

assertIncludes(buyerReadinessGuide, "href: '/contact#advisory-readiness'", 'Buyer Financing Readiness must route advisory continuation to the handoff anchor.');
assertIncludes(sellerReadinessGuide, 'href="/contact#advisory-readiness"', 'Seller Readiness must route advisory continuation to the handoff anchor.');
assertIncludes(comparePage, "href: '/contact'", 'Cross-City Comparison must preserve its certified advisory route.');
assertIncludes(grandPlanPage, "href: '/contact'", 'Grand Plan must preserve its certified advisory route.');
assertIncludes(publicTrust, 'PUBLIC_CONTACT_EMAIL_STATUS', 'Public trust check must remain intact.');
assertIncludes(evidenceFoundation, 'providerCalls, 0', 'Evidence Depth foundation check must remain provider-free.');
assertIncludes(evidenceFoundation, 'networkAcquisition, false', 'Evidence Depth foundation check must remain network-free.');
assertIncludes(evidenceFoundation, 'persistenceWrites, false', 'Evidence Depth foundation check must remain persistence-free.');
assertIncludes(evidenceFoundation, 'publicRouteIntegration, false', 'Evidence Depth foundation check must remain non-public.');

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
  'type="hidden"',
  'FormData',
  'PrismaClient',
  'createCRM',
  'sendEmail',
  'queue',
]) {
  assertNotIncludes(advisoryGuide, runtimeActivation, `Advisory Handoff guide must not introduce intake, persistence, tracking, or automation: ${runtimeActivation}`);
}

for (const internalEvidenceLeak of [
  'PUBLIC_DISPLAY_PERMITTED',
  'ATTRIBUTION_REQUIRED_PUBLIC_DISPLAY',
  'INTERNAL_ANALYSIS_ONLY',
  'UNRESOLVED_CONFLICT',
  'MATERIALLY_CONFLICTING',
  'EvidencePosture',
  'sourceRights',
  'supportLevel',
  'provenanceChain',
  'publicUseEligibility',
  'evidenceDepthFixtures',
  'fixture-backed',
]) {
  assertNotIncludes(advisoryGuide, internalEvidenceLeak, `Advisory Handoff guide must not expose internal evidence metadata: ${internalEvidenceLeak}`);
}

for (const prohibitedClaim of [
  'lead quality',
  'qualified lead',
  'priority customer',
  'urgent',
  'act now',
  'guaranteed results',
  'guaranteed outcome',
  'school rating',
  'safety rating',
  'neighborhood desirability',
  'suitability score',
  'readiness score',
  'affordability conclusion',
  'qualification result',
  'valuation conclusion',
  'pricing recommendation',
  'investment recommendation',
  'personalized advice',
  'personalized recommendation',
  'we decide',
]) {
  assertNotIncludes(advisoryGuide, prohibitedClaim, `Advisory Handoff guide must not expose prohibited claim: ${prohibitedClaim}`);
}

console.log(
  '[advisory-handoff-readiness] ok: single Contact handoff anchor, conversation prompts, journey-context groups, evidence-aware limitation framing, advisor-role boundaries, restrained continuity, no hidden context transfer, no new fields, no persistence, and protected boundaries verified.',
);
