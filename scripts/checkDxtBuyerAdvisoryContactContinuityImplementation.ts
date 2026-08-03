import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const buyerPage = read('app/buy/page.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-BUYER-ADVISORY-CONTACT-CONTINUITY-IMPLEMENTATION.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-buyer-advisory-contact-continuity="implemented"',
  'data-buyer-advisory-contact-runtime-scope="app/buy/page.tsx"',
  'data-buyer-advisory-contact-hidden-context="false"',
  'data-buyer-advisory-contact-url-context="false"',
  'data-buyer-advisory-contact-form-change="false"',
  'data-buyer-advisory-contact-api-change="false"',
  'data-buyer-advisory-contact-crm="false"',
  'data-buyer-advisory-contact-email="false"',
  'data-buyer-advisory-contact-scheduling="false"',
  'data-testid="reie-buyer-professional-handoff"',
  'After preparing to buy, what should I understand before beginning a focused professional conversation?',
  'data-buyer-handoff-primary-action="search-preparation"',
  'data-buyer-handoff-advisory="/contact#advisory-readiness"',
  'data-buyer-handoff-contact="/contact#contact-route-choice"',
  'data-buyer-handoff-hidden-context="false"',
  'data-buyer-handoff-url-context="false"',
  'Continue Buyer Search',
  'Prepare Advisory Questions',
  'Start General Contact',
  'These links do not attach Buyer context to Advisory or Contact.',
]) {
  assertIncludes(buyerPage, phrase, `Buyer continuity implementation must include: ${phrase}`);
}

assertIncludes(
  buyerPage,
  'BUYER_PROFESSIONAL_HANDOFF_STEPS',
  'Buyer page must define route-local handoff steps.',
);
assertIncludes(buyerPage, 'BUYER_HANDOFF_BOUNDARIES', 'Buyer page must define route-local handoff boundaries.');

for (const prohibited of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
  'buyerContext=',
  'financingContext=',
]) {
  assert(!buyerPage.includes(prohibited), `Buyer continuity must not introduce ${prohibited}.`);
}

for (const phrase of [
  'Status: `DXT_BUYER_ADVISORY_CONTACT_CONTINUITY_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'app/buy/page.tsx',
  'Buyer preparation remains the primary page purpose',
  'Advisory remains a preparation continuation',
  'Contact remains a subordinate general conversation path',
  'No Buyer context is transferred automatically',
  'Buyer financing tools remain unchanged',
  'REIE_DXT_BUYER_ADVISORY_CONTACT_CONTINUITY_LOCAL_CERTIFICATION_READY',
]) {
  assertIncludes(implementationRecord, phrase, `Buyer implementation record must include: ${phrase}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-buyer-advisory-contact-continuity-implementation'],
  'npm run worker:build && node dist/scripts/checkDxtBuyerAdvisoryContactContinuityImplementation.js',
  'package.json must register the Buyer continuity implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtBuyerAdvisoryContactContinuityImplementation.ts',
  'tsconfig.worker.json must include the Buyer continuity implementation check.',
);

console.log(
  '[dxt-buyer-advisory-contact-continuity-implementation] ok: route-local Buyer handoff, Advisory/Contact distinction, no hidden context, and financing boundaries verified.',
);
