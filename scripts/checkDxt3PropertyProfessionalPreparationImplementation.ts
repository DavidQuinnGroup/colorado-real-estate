import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const propertyPage = read('app/properties/[id]/page.tsx');
const implementation = read('docs/project-atlas/executive-library/REIE-DXT-3-PROPERTY-PROFESSIONAL-PREPARATION-IMPLEMENTATION.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-testid="dxt-3-property-professional-preparation"',
  'Property Professional Preparation',
  'After evaluating this property, what should I organize before asking or reaching out?',
  'Evidence reviewed in this experience',
  'Evidence still needed',
  'Assumptions',
  'Unknowns',
  'Questions to verify and prioritize',
  'What REIE cannot determine',
  'PROPERTY_PROFESSIONAL_PREPARATION_QUESTIONS',
  'PROPERTY_PROFESSIONAL_PREPARATION_PATHWAYS',
  'PROPERTY_PROFESSIONAL_PREPARATION_LIMITS',
]) {
  assertIncludes(propertyPage, phrase, `Property page must include DXT 3 preparation phrase: ${phrase}`);
}

for (const pathway of [
  'href="#property-contact"',
  'href="/contact#advisory-readiness"',
  'href="/contact#contact-route-choice"',
  'data-property-professional-preparation-primary-pathway="property-inquiry"',
  'data-property-professional-preparation-hidden-context="false"',
  'data-property-professional-preparation-url-context="false"',
  'data-property-professional-preparation-form-prefill="false"',
  'data-property-professional-preparation-persistence="false"',
  'data-property-professional-preparation-telemetry="false"',
  'data-property-professional-preparation-customer-profile="false"',
  'data-property-professional-preparation-form-change="false"',
  'data-property-professional-preparation-api-change="false"',
]) {
  assertIncludes(propertyPage, pathway, `Property page must preserve pathway/context contract: ${pathway}`);
}

for (const prohibited of [
  'saved choices',
  'recommendations',
  'risk findings',
  'scores',
  'lead classifications',
  'does not transfer hidden',
  'does not replace Property Inquiry',
]) {
  assertIncludes(propertyPage, prohibited, `Property page must include boundary wording: ${prohibited}`);
}

for (const phrase of [
  'Status: `DXT_3_PROPERTY_PROFESSIONAL_PREPARATION_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  '`READY_FOR_DXT_3_PROPERTY_PROFESSIONAL_PREPARATION_LOCAL_CERTIFICATION`',
  'Runtime authorization: `app/properties/[id]/page.tsx`',
  'PropertyInquiryForm changed: `false`',
  'Property Inquiry API changed: `false`',
  'Advisory runtime changed: `false`',
  'Contact runtime changed: `false`',
  'Search runtime or API changed: `false`',
  'Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.',
]) {
  assertIncludes(implementation, phrase, `Implementation record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_PROPERTY_PROFESSIONAL_PREPARATION_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION',
  'CHAT_START must record the Property professional preparation local-certification gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-property-professional-preparation-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt3PropertyProfessionalPreparationImplementation.js',
  'package.json must register the DXT 3 Property professional preparation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3PropertyProfessionalPreparationImplementation.ts',
  'tsconfig.worker.json must include the DXT 3 Property professional preparation check.',
);

console.log('[dxt-3-property-professional-preparation-implementation] ok: route-local Property preparation, pathway hierarchy, no hidden context, and protected boundaries verified.');
