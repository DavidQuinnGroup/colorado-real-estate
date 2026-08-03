import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const sellerPage = read('app/sell/page.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-SELLER-ADVISORY-CONTACT-CONTINUITY-IMPLEMENTATION.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-seller-advisory-contact-continuity="implemented"',
  'data-seller-advisory-contact-runtime-scope="app/sell/page.tsx"',
  'data-seller-advisory-contact-hidden-context="false"',
  'data-seller-advisory-contact-url-context="false"',
  'data-seller-advisory-contact-form-change="false"',
  'data-seller-advisory-contact-api-change="false"',
  'data-seller-advisory-contact-crm="false"',
  'data-seller-advisory-contact-email="false"',
  'data-seller-advisory-contact-scheduling="false"',
  'data-testid="reie-seller-professional-handoff"',
  'After preparing for market exposure, what should I understand before beginning a focused professional conversation?',
  'data-seller-handoff-primary-action="#seller-intake"',
  'data-seller-handoff-advisory="/contact#advisory-readiness"',
  'data-seller-handoff-contact="/contact#contact-route-choice"',
  'data-seller-handoff-hidden-context="false"',
  'data-seller-handoff-url-context="false"',
  'Request Seller Review',
  'Prepare Advisory Questions',
  'Start General Contact',
  'These links do not attach Seller context to Advisory or Contact.',
]) {
  assertIncludes(sellerPage, phrase, `Seller continuity implementation must include: ${phrase}`);
}

assertIncludes(
  sellerPage,
  'SELLER_PROFESSIONAL_HANDOFF_STEPS',
  'Seller page must define route-local handoff steps.',
);
assertIncludes(sellerPage, 'SELLER_HANDOFF_BOUNDARIES', 'Seller page must define route-local handoff boundaries.');

for (const prohibited of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
  'sellerContext=',
  'homeWorthContext=',
]) {
  assert(!sellerPage.includes(prohibited), `Seller continuity must not introduce ${prohibited}.`);
}

for (const phrase of [
  'Status: `DXT_SELLER_ADVISORY_CONTACT_CONTINUITY_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'app/sell/page.tsx',
  'Seller preparation remains the primary page purpose',
  'Advisory remains a preparation continuation',
  'Contact remains subordinate general initiation',
  'No Seller context is transferred automatically',
  'Home Value Estimator remains unchanged',
  'REIE_DXT_SELLER_ADVISORY_CONTACT_CONTINUITY_LOCAL_CERTIFICATION_READY',
]) {
  assertIncludes(implementationRecord, phrase, `Seller implementation record must include: ${phrase}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-seller-advisory-contact-continuity-implementation'],
  'npm run worker:build && node dist/scripts/checkDxtSellerAdvisoryContactContinuityImplementation.js',
  'package.json must register the Seller continuity implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtSellerAdvisoryContactContinuityImplementation.ts',
  'tsconfig.worker.json must include the Seller continuity implementation check.',
);

console.log(
  '[dxt-seller-advisory-contact-continuity-implementation] ok: route-local Seller handoff, Advisory/Contact distinction, no hidden context, and valuation boundaries verified.',
);
