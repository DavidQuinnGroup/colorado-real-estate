import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const propertyPage = read('app/properties/[id]/page.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-PROPERTY-ADVISORY-CONTACT-CONTINUITY-IMPLEMENTATION.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-property-advisory-contact-continuity="implemented"',
  'data-property-advisory-contact-runtime-scope="app/properties/[id]/page.tsx"',
  'data-property-advisory-contact-property-inquiry-change="false"',
  'data-property-advisory-contact-advisory-runtime-change="false"',
  'data-property-advisory-contact-contact-runtime-change="false"',
  'data-property-advisory-contact-hidden-context="false"',
  'data-property-advisory-contact-url-context="false"',
  'data-property-advisory-contact-persistence="false"',
  'data-property-advisory-contact-telemetry="false"',
  'data-property-advisory-contact-api-change="false"',
  'data-testid="reie-property-professional-handoff"',
  'After evaluating this property, what should I prepare before beginning a property-specific professional conversation?',
  'data-property-handoff-primary-action="property-inquiry"',
  'data-property-handoff-property-inquiry="#property-contact"',
  'data-property-handoff-advisory="/contact#advisory-readiness"',
  'data-property-handoff-contact="/contact#contact-route-choice"',
  'data-property-handoff-hidden-context="false"',
  'data-property-handoff-url-context="false"',
  'data-property-handoff-form-change="false"',
  'data-property-handoff-api-change="false"',
  'data-property-handoff-crm="false"',
  'data-property-handoff-email="false"',
  'data-property-handoff-scheduling="false"',
  'Ask About This Property',
  'Prepare Advisory Questions',
  'Start General Contact',
  'These links do not attach this property to Contact or Advisory.',
]) {
  assertIncludes(propertyPage, phrase, `Property handoff implementation must include: ${phrase}`);
}

assertIncludes(
  propertyPage,
  'PROPERTY_PROFESSIONAL_HANDOFF_STEPS',
  'Property page must define route-local handoff steps.',
);
assertIncludes(
  propertyPage,
  'PROPERTY_HANDOFF_BOUNDARIES',
  'Property page must define route-local professional boundaries.',
);

for (const prohibited of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
  'propertySlug=',
  'propertyAddress=',
]) {
  assert(!propertyPage.includes(prohibited), `Property handoff must not introduce ${prohibited}.`);
}

for (const phrase of [
  'Status: `DXT_PROPERTY_ADVISORY_CONTACT_CONTINUITY_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'app/properties/[id]/page.tsx',
  'Property inquiry remains the dominant action',
  'Advisory remains a preparation layer',
  'Contact remains a general conversation-starting destination',
  'No property context is transferred automatically',
  'PropertyInquiryForm',
  'REIE_DXT_PROPERTY_ADVISORY_CONTACT_CONTINUITY_LOCAL_CERTIFICATION_READY',
]) {
  assertIncludes(implementationRecord, phrase, `Implementation record must include: ${phrase}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-property-advisory-contact-continuity-implementation'],
  'npm run worker:build && node dist/scripts/checkDxtPropertyAdvisoryContactContinuityImplementation.js',
  'package.json must register the Property -> Advisory -> Contact implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtPropertyAdvisoryContactContinuityImplementation.ts',
  'tsconfig.worker.json must include the Property -> Advisory -> Contact implementation check.',
);

console.log(
  '[dxt-property-advisory-contact-continuity-implementation] ok: route-local property handoff, distinct responsibilities, no hidden context, and protected dependencies verified.',
);
