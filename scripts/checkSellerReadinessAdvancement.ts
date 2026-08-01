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
const homeWorthPage = read('app/home-worth/page.tsx');
const sellerPage = read('app/sell/page.tsx');
const sellerReadinessGuide = read('components/SellerReadinessGuide.tsx');
const sellerForm = read('components/HomeValueEstimator.tsx');
const valuationRoute = read('app/api/valuation/route.ts');
const grandPlanPage = read('app/grand-plan/page.tsx');
const contactPage = read('app/contact/page.tsx');

assertFileMissing('app/seller-readiness/page.tsx');
assertFileMissing('app/api/seller-readiness/route.ts');

assert.equal(
  packageJson.scripts?.['check:seller-readiness-advancement'],
  'npm run worker:build && node dist/scripts/checkSellerReadinessAdvancement.js',
  'package.json must expose Seller Readiness Advancement validation.',
);
assertIncludes(tsconfig, 'scripts/checkSellerReadinessAdvancement.ts', 'Worker build must include Seller Readiness Advancement validation.');

assertIncludes(homeWorthPage, 'SellerReadinessGuide', 'Home Worth must render the seller readiness guide.');
assertIncludes(homeWorthPage, 'data-seller-readiness-advancement="true"', 'Home Worth must expose seller readiness advancement metadata.');
assertIncludes(homeWorthPage, 'href="#seller-readiness"', 'Home Worth must link directly to the readiness section.');
assertIncludes(sellerPage, 'data-testid="seller-readiness-entry"', 'Sell page must expose a restrained seller readiness entry.');
assertIncludes(sellerPage, 'Seller Readiness', 'Sell page must label the seller readiness entry accurately.');
assertIncludes(sellerPage, 'href="/home-worth#seller-readiness"', 'Sell page must route seller readiness to the Home Worth readiness section.');
assertIncludes(sellerPage, "label: 'Home Worth'", 'Sell page must preserve the certified Home Worth cohesion label.');
assertIncludes(sellerPage, "href: '/home-worth'", 'Sell page must preserve the certified Home Worth cohesion destination.');

for (const marker of [
  'data-testid="seller-readiness-guide"',
  'data-seller-readiness-surface="home-worth"',
  'data-seller-readiness-route="/home-worth#seller-readiness"',
  'data-seller-readiness-valuation="false"',
  'data-seller-readiness-pricing-output="false"',
  'data-seller-readiness-score="false"',
  'data-seller-readiness-persistence="false"',
  'data-seller-readiness-upload="false"',
  'data-seller-readiness-crm-automation="false"',
  'data-seller-readiness-email="false"',
  'data-seller-readiness-alerts="false"',
  'data-seller-readiness-telemetry="false"',
  'data-seller-readiness-ai="false"',
  'data-seller-readiness-provider-activation="false"',
]) {
  assertIncludes(sellerReadinessGuide, marker, `Seller Readiness guide must expose marker: ${marker}`);
}

for (const marker of [
  'data-testid="seller-evidence-readiness"',
  'data-seller-evidence-readiness-static="true"',
  'data-seller-evidence-readiness-metadata-exposure="false"',
  'data-seller-evidence-readiness-conclusions="false"',
  'data-seller-evidence-readiness-source-activation="false"',
]) {
  assertIncludes(sellerReadinessGuide, marker, `Seller Evidence Readiness section must expose marker: ${marker}`);
}

for (const phrase of [
  'Readiness means organizing facts',
  'not a valuation, appraisal, pricing recommendation',
  'general preparation guidance cannot replace property-specific advisor or qualified-source review',
  'property condition documentation',
  'known repairs and improvements',
  'maintenance history',
  'permits and project records',
  'HOA or association materials where applicable',
  'insurance questions',
  'municipal or HOA requirements',
  'inspection, structural, environmental, or other specialist questions',
  'data-testid="seller-readiness-preparation-checklist"',
  'data-testid="seller-readiness-documentation-inventory"',
  'data-testid="seller-readiness-property-context"',
  'data-testid="seller-readiness-market-context"',
  'data-testid="seller-readiness-advisory-preparation"',
  'data-testid="seller-readiness-next-step-continuity"',
  'Seller Guidance',
  'Market Context',
  'Grand Plan',
  'Advisory Guidance',
  'Seller Evidence Readiness',
  'Information to organize',
  'supplied by the homeowner',
  'Verification sources',
  'public or third-party records',
  'independent verification',
  'Professional review topics',
  'licensed or qualified professional review',
  'Conclusions REIE does not make',
  'Organizing information does not establish accuracy, completeness, condition, compliance, ownership, title status, permit',
  'status, insurability, value, recommended pricing, marketability, suitability, or sale outcome',
  'county, assessor, title, permit, HOA, insurance, utility, tax, and municipal record classes',
  'questions to discuss with the advisory team',
  'a score, grade, ranking, investment result, financing result, legal result, or professional determination',
]) {
  assertIncludes(sellerReadinessGuide, phrase, `Seller Readiness guide must include required readiness content: ${phrase}`);
}

for (const [label, href, destination] of [
  ['Seller Guidance', '/sell', 'seller-guidance'],
  ['Market Context', '/market', 'market-context'],
  ['Grand Plan', '/grand-plan', 'grand-plan'],
  ['Advisory Guidance', '/contact#advisory-readiness', 'advisory'],
] as const) {
  assertIncludes(sellerReadinessGuide, `href="${href}"`, `${label} must route to ${href}.`);
  assertIncludes(sellerReadinessGuide, `data-seller-readiness-destination="${destination}"`, `${label} must expose ${destination} destination metadata.`);
}

for (const prohibited of [
  'readiness score',
  'seller score',
  'seller grade',
  'readiness percentage',
  'pricing range',
  'estimated value',
  'Estimated Value',
  'automated valuation model',
  'comparable-sale calculation',
  'seller net sheet',
  'appraisal replacement',
  'guaranteed sale',
  'guaranteed outcome',
  'optimal timing',
  'predict demand',
  'forecast appreciation',
  'investment recommendation',
  'ideal seller',
  'best neighborhood',
  'school rating',
  'safety rating',
  'lead score',
  'saved readiness profile',
]) {
  assertNotIncludes(sellerReadinessGuide, prohibited, `Seller Readiness guide must not expose prohibited wording: ${prohibited}`);
}

for (const internalEvidenceExposure of [
  'PROPERTY_SELLER_EVIDENCE_READINESS',
  'propertySellerEvidenceReadiness',
  'propertySellerEvidenceReadinessFixtures',
  'evidenceId',
  'sourceId',
  'providerId',
  'rights enum',
  'support level',
  'freshness label',
  'conflict label',
  'eligibility outcome',
  'confidence percentage',
]) {
  assertNotIncludes(
    sellerReadinessGuide,
    internalEvidenceExposure,
    `Seller Evidence Readiness public copy must not expose internal evidence metadata: ${internalEvidenceExposure}`,
  );
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
  'FormData',
]) {
  assertNotIncludes(sellerReadinessGuide, runtimeActivation, `Seller Readiness guide must not introduce runtime persistence or tracking: ${runtimeActivation}`);
}

assertIncludes(homeWorthPage, 'data-reie-home-worth-automated-valuation="false"', 'Home Worth no-AVM boundary must remain visible.');
assertIncludes(homeWorthPage, 'not an automated home-value estimate', 'Home Worth must preserve no automated estimate language.');
assertIncludes(sellerForm, 'not an automated home-value estimate', 'Seller form must preserve no-AVM language.');
assertIncludes(sellerForm, 'data-conversion-automated-valuation="false"', 'Seller form must preserve no-AVM metadata.');
assertIncludes(valuationRoute, "type: 'strategy_intake'", 'Valuation backend must preserve strategy_intake behavior.');
assertIncludes(valuationRoute, 'emailSent: false', 'Valuation backend must preserve no-email status.');
assertNotIncludes(valuationRoute, 'resend.emails.send', 'Valuation backend must not send live email.');
assertNotIncludes(valuationRoute, 'optimizedValue', 'Valuation backend must not return unsupported valuation output.');
assertNotIncludes(valuationRoute, 'estimatedEquity', 'Valuation backend must not return unsupported equity output.');

assertIncludes(grandPlanPage, 'JourneyCohesionPanel', 'Grand Plan continuity must remain present.');
assertIncludes(contactPage, 'JourneyCohesionPanel', 'Contact continuity must remain present.');

console.log(
  '[seller-readiness-advancement] ok: single Home Worth readiness surface, preparation checklist, documentation inventory, qualified-source prompts, journey continuity, no valuation, no scoring, no persistence, and protected boundaries verified.',
);
