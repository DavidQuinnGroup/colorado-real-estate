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

function assertBefore(source: string, first: string, second: string, message: string) {
  const firstIndex = source.indexOf(first);
  const secondIndex = source.indexOf(second);
  assert(firstIndex >= 0, `${first} must be present.`);
  assert(secondIndex >= 0, `${second} must be present.`);
  assert(firstIndex < secondIndex, message);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const contactPage = read('app/contact/page.tsx');
const advisoryGuide = read('components/AdvisoryHandoffGuide.tsx');
const comparePage = read('app/compare/page.tsx');
const buyerReadinessGuide = read('components/BuyerFinancingReadinessGuide.tsx');
const buyerPlanner = read('components/BuyerFinancingDecisionPlanner.tsx');
const sellerReadinessGuide = read('components/SellerReadinessGuide.tsx');
const grandPlanPage = read('app/grand-plan/page.tsx');
const publicTrust = read('scripts/checkPublicTrustReadiness.ts');
const evidenceFoundation = read('scripts/checkEvidenceDepthDataIntegrationFoundation.ts');

assertFileMissing('app/advisory-handoff/page.tsx');
assertFileMissing('app/advisory-readiness/page.tsx');
assertFileMissing('app/contact/advisory-readiness/page.tsx');
assertFileMissing('app/api/advisory-handoff/route.ts');
assertFileMissing('app/api/advisory-readiness/route.ts');
assertFileMissing('components/AdvisoryExperience.tsx');

assert.equal(
  packageJson.scripts?.['check:advisory-handoff-readiness'],
  'npm run worker:build && node dist/scripts/checkAdvisoryHandoffReadiness.js',
  'package.json must expose Advisory Handoff Readiness validation.',
);
assertIncludes(tsconfig, 'scripts/checkAdvisoryHandoffReadiness.ts', 'Worker build must include Advisory Handoff Readiness validation.');

assertIncludes(contactPage, 'AdvisoryHandoffGuide', 'Contact page must render the Advisory Handoff guide.');
assertBefore(contactPage, '<AdvisoryHandoffGuide />', '<TrustSection title="Production Status">', 'Advisory experience must precede dense Production Status content.');
assertIncludes(contactPage, 'JourneyCohesionPanel', 'Contact page must preserve certified journey cohesion.');
assertIncludes(contactPage, 'PUBLIC_CONTACT_EMAIL_STATUS', 'Contact page must preserve public contact email status.');
assertIncludes(contactPage, 'PUBLIC_NOTIFICATION_EMAIL', 'Contact page must preserve notification sender status.');
assertIncludes(contactPage, 'Do not submit confidential negotiating positions', 'Contact page must preserve privacy boundary.');
assertIncludes(contactPage, '<TrustSection title="Form Notice">', 'Contact page must preserve existing form notice.');

for (const marker of [
  'data-testid="advisory-handoff-readiness-guide"',
  'id="advisory-readiness"',
  'data-advisory-experience-phase="phase-1-structural-productization"',
  'data-advisory-experience-model="single-advisory-experience"',
  'data-advisory-journey-context-model="generic-single-experience-with-static-topics"',
  'data-advisory-contact-strategy="preparation-then-contact"',
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
  'What should I understand and prepare before beginning a focused professional conversation?',
  'Advisory prepares the conversation before Contact begins it.',
  'organize what you know',
  'identify what remains unresolved',
  'qualified professional',
  'Begin A Focused Conversation',
  'Turn REIE research into the first useful discussion.',
  'Conversation Preparation',
  'Bring a clear decision, not a perfect answer.',
  'Decision Context',
  'Static contexts only, chosen by the customer.',
  'Evidence Already Reviewed',
  'Bring the evidence that shaped the question.',
  'Professional Discussion',
  'Separate prompts from conclusions.',
  'Evidence And Professional Boundaries',
  'What Advisory Does Not Establish',
  'Contact Transition',
  'Use Contact when the questions are organized.',
  'does not automatically create',
  'brokerage relationship',
]) {
  assertIncludes(advisoryGuide, phrase, `Advisory Handoff guide must include required Phase 1 content: ${phrase}`);
}

for (const theme of [
  'Decision to discuss',
  'Timing and pressure',
  'Evidence already reviewed',
  'Assumptions to verify',
  'Open evidence gaps',
  'Professional questions',
]) {
  assertIncludes(advisoryGuide, `label: '${theme}'`, `Preparation theme must remain present: ${theme}`);
}

for (const topic of [
  'Buyer preparation',
  'Seller preparation',
  'Market interpretation',
  'Neighborhood investigation',
  'Property evaluation',
  'General decision review',
]) {
  assertIncludes(advisoryGuide, `label: '${topic}'`, `Static journey topic must remain present: ${topic}`);
}

for (const prompt of [
  'Which property-specific facts should be verified before relying on this context?',
  'Which financing assumptions belong with a qualified lender or other professional?',
  'Which title, ownership, HOA, insurance, permit, zoning, condition, or environmental questions remain open?',
  'Which market or pricing context needs professional interpretation rather than a certainty claim?',
  'Which timing, contingency, or transaction-strategy questions should be discussed before action?',
]) {
  assertIncludes(advisoryGuide, prompt, `Question-to-verify prompt must remain present: ${prompt}`);
}

for (const boundary of [
  'does not determine legal',
  'tax',
  'lending',
  'appraisal',
  'inspection',
  'engineering',
  'insurance',
  'title',
  'valuation',
  'suitability',
  'investment',
  'does not create a saved workspace',
  'automatically transfer planner inputs',
  'require uploads',
  'hidden lead score',
  'inferred financial profile',
  'establish a brokerage relationship',
  'approve financing',
  'determine affordability',
  'certify valuation',
  'guarantee pricing',
  'guarantee outcomes',
  'rank providers',
  'suitability conclusions',
]) {
  assertIncludes(advisoryGuide, boundary, `Privacy or professional boundary must remain present: ${boundary}`);
}

assertIncludes(advisoryGuide, 'Contact David Quinn Group', 'Contact David Quinn Group must be a governed advisory CTA.');
assertIncludes(advisoryGuide, 'href="/contact"', 'Contact David Quinn Group must route to /contact.');
assertIncludes(advisoryGuide, 'data-advisory-handoff-destination="contact"', 'Contact CTA must expose destination metadata.');
assertIncludes(advisoryGuide, 'href="#advisory-contact-transition"', 'Primary Advisory action must scroll to the safe Contact transition.');
assertIncludes(advisoryGuide, 'data-advisory-handoff-primary-action="begin-focused-conversation"', 'Primary Advisory action must expose certified action metadata.');

for (const [label, href, destination] of [
  ['Buyer Guidance', '/buy', 'buyer'],
  ['Seller Guidance', '/sell', 'seller'],
  ['Search Homes', '/search', 'search'],
  ['Market Context', '/market', 'market'],
  ['Grand Plan', '/grand-plan', 'grand-plan'],
] as const) {
  assertIncludes(advisoryGuide, label, `${label} must be a governed advisory CTA.`);
  assertIncludes(advisoryGuide, `href: '${href}'`, `${label} must route to ${href}.`);
  assertIncludes(advisoryGuide, `destination: '${destination}'`, `${label} must expose destination metadata.`);
}

assertIncludes(advisoryGuide, 'data-testid="advisory-handoff-advisor-role"', 'Advisor role section must be elevated.');
assertIncludes(advisoryGuide, 'data-testid="advisory-handoff-preparation-themes"', 'Preparation section must be inspectable.');
assertIncludes(advisoryGuide, 'data-testid="advisory-handoff-reviewed-evidence"', 'Reviewed evidence section must be inspectable.');
assertIncludes(advisoryGuide, 'data-testid="advisory-handoff-privacy-expectations"', 'Privacy section must be inspectable.');
assertIncludes(advisoryGuide, 'data-testid="advisory-handoff-contact-transition"', 'Contact transition must be inspectable.');
assertIncludes(advisoryGuide, 'data-testid="advisory-handoff-continuity"', 'Research continuations must be inspectable.');

assertIncludes(buyerReadinessGuide, "href: '/contact#advisory-readiness'", 'Buyer Financing Readiness must route advisory continuation to the handoff anchor.');
assertIncludes(buyerPlanner, 'href="/contact#advisory-readiness"', 'Buyer Financing Decision Planner must route advisory continuation to the handoff anchor.');
assertIncludes(sellerReadinessGuide, 'href="/contact#advisory-readiness"', 'Seller Readiness must route advisory continuation to the handoff anchor.');
assertIncludes(comparePage, "href: '/contact#advisory-readiness'", 'Cross-City Comparison must preserve its certified advisory route.');
assertIncludes(grandPlanPage, "href: '/contact#advisory-readiness'", 'Grand Plan must preserve its certified advisory route.');
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
  'scheduleMeeting(',
  'createAppointment',
  'Calendly',
]) {
  assertNotIncludes(advisoryGuide, runtimeActivation, `Advisory Handoff guide must not introduce intake, persistence, tracking, or automation: ${runtimeActivation}`);
}

for (const contextTransfer of [
  'URLSearchParams',
  'searchParams',
  'document.referrer',
  'referer',
  'utm_',
  'analytics',
  'personalized',
]) {
  assertNotIncludes(advisoryGuide, contextTransfer, `Advisory Handoff guide must not infer or personalize context: ${contextTransfer}`);
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
  'best neighborhood',
  'ideal for',
]) {
  assertNotIncludes(advisoryGuide, prohibitedClaim, `Advisory Handoff guide must not expose prohibited claim: ${prohibitedClaim}`);
}

console.log(
  '[advisory-handoff-readiness] ok: Phase 1 single Contact advisory experience, preparation-before-contact hierarchy, static journey topics, prompt-only verification model, privacy and professional boundaries, restrained continuity, no hidden context transfer, no new fields, no persistence, and protected boundaries verified.',
);
