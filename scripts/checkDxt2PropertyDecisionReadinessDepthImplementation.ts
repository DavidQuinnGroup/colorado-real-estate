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
  'docs/project-atlas/executive-library/REIE-DXT-2-PROPERTY-DECISION-READINESS-DEPTH-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-dxt-2-property-readiness-depth="implemented"',
  'data-dxt-2-property-readiness-runtime-scope="app/properties/[id]/page.tsx"',
  'data-dxt-2-property-readiness-existing-evidence-only="true"',
  'data-dxt-2-property-readiness-search-change="false"',
  'data-dxt-2-property-readiness-inquiry-change="false"',
  'data-dxt-2-property-readiness-provider-activation="false"',
  'data-dxt-2-property-readiness-ai="false"',
  'data-dxt-2-property-readiness-scoring="false"',
  'data-dxt-2-property-readiness-persistence="false"',
  'data-dxt-2-property-readiness-telemetry="false"',
  'data-dxt-2-property-readiness-api-change="false"',
  'data-testid="dxt-2-property-decision-readiness-depth"',
  'Is this property sufficiently understood to justify more time, inquiry, touring, comparison, or professional preparation?',
  'Evidence available now',
  'Evidence still missing',
  'Assumptions to separate',
  'Unknowns to verify',
  'Confidence boundaries',
  'What must be verified',
  'Questions to carry forward',
  'The next step is justified when the customer can name what is known',
  'PROPERTY_READINESS_MISSING_EVIDENCE',
  'PROPERTY_READINESS_ASSUMPTIONS',
  'PROPERTY_READINESS_UNKNOWNS',
  'PROPERTY_READINESS_CONFIDENCE_BOUNDARIES',
]) {
  assertIncludes(propertyPage, phrase, `Property readiness implementation must include: ${phrase}`);
}

for (const prohibited of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
  'propertyReadinessScore',
  'readinessScore',
  'recommendedProperty',
]) {
  assert(!propertyPage.includes(prohibited), `Property readiness must not introduce ${prohibited}.`);
}

for (const phrase of [
  'Status: `DXT_2_PROPERTY_DECISION_READINESS_DEPTH_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'READY_FOR_DXT_2_PROPERTY_DECISION_READINESS_DEPTH_LOCAL_CERTIFICATION',
  'app/properties/[id]/page.tsx',
  'Is this property sufficiently understood to justify more time, inquiry, touring, comparison, or professional preparation?',
  'Evidence still missing',
  'Confidence is expressed as a boundary, not a score.',
  'No property context is added to Advisory or Contact URLs.',
  'no Search runtime change',
  'no PropertyInquiryForm change',
  'no provider activation',
  'no AI advice',
]) {
  assertIncludes(implementationRecord, phrase, `Property readiness record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_2_PROPERTY_DECISION_READINESS_DEPTH_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION',
  'CHAT_START must record the Property readiness local-certification and push gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-property-decision-readiness-depth-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt2PropertyDecisionReadinessDepthImplementation.js',
  'package.json must register the DXT 2 Property readiness implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2PropertyDecisionReadinessDepthImplementation.ts',
  'tsconfig.worker.json must include the DXT 2 Property readiness implementation check.',
);

console.log(
  '[dxt-2-property-decision-readiness-depth-implementation] ok: route-local Property readiness depth, existing evidence, and protected boundaries verified.',
);
