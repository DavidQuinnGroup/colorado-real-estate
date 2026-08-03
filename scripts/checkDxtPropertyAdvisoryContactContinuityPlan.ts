import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read('docs/project-atlas/executive-library/REIE-DXT-PROPERTY-ADVISORY-CONTACT-CONTINUITY-IMPLEMENTATION-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'PROPERTY_ADVISORY_CONTACT_CONTINUITY_PLAN_READY',
  'After evaluating this property, what should I prepare before beginning a property-specific professional conversation?',
  'Current CTA And Destination Assessment',
  'Responsibility Model',
  'Property evaluates the specific property',
  'Property inquiry remains the property-specific information path',
  'Advisory prepares the professional conversation',
  'Contact begins a general conversation',
  'Dominant-Action Recommendation',
  'Advisory Treatment',
  'Contact Treatment',
  'Property Inquiry Treatment',
  'Context Classification',
  'Prohibited Transfer',
  'Direct-Entry Requirements',
  'Proposed Implementation Phases',
  'Proposed File Ownership',
  'Shared-File Risks',
  'Deterministic Certification Criteria',
  'Accepted Limitations',
]) {
  assertIncludes(plan, phrase, `Property/Advisory/Contact plan must include: ${phrase}`);
}

for (const prohibited of [
  'identity',
  'email',
  'phone',
  'private notes',
  'affordability',
  'financing assumptions',
  'inquiry form content',
  'saved properties',
  'property-view history',
  'browsing history',
  'inferred preferences',
  'protected characteristics',
  'CRM status',
  'lead score',
  'telemetry-derived context',
  'confidential information',
]) {
  assertIncludes(plan, prohibited, `Plan must prohibit automatic transfer of ${prohibited}.`);
}

for (const protectedZone of [
  'PropertyInquiryForm',
  'LeadCapture',
  'submission APIs',
  'CRM adapters',
  'email integrations',
  'scheduling integrations',
  'persistence',
  'telemetry',
  'Search',
  'navigation',
  'footer',
  'brokerage disclosure',
]) {
  assertIncludes(plan, protectedZone, `Plan must identify protected zone: ${protectedZone}.`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_PROPERTY_ADVISORY_CONTACT_CONTINUITY_PLAN_CERTIFICATION',
  'CHAT_START must record the secondary planning certification gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-property-advisory-contact-continuity-plan'],
  'npm run worker:build && node dist/scripts/checkDxtPropertyAdvisoryContactContinuityPlan.js',
  'package.json must register Property/Advisory/Contact planning check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtPropertyAdvisoryContactContinuityPlan.ts',
  'tsconfig.worker.json must include Property/Advisory/Contact planning check.',
);

console.log(
  '[dxt-property-advisory-contact-continuity-plan] ok: CTA assessment, responsibility model, context classification, prohibited transfer, file ownership, shared risks, and certification criteria verified.',
);
