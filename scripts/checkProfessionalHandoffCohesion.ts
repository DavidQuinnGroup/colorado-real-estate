import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  REIE_PROFESSIONAL_HANDOFF_COHESION_STATUS,
  buildProfessionalHandoffCohesionProfile,
  type ProfessionalDomain,
  type ProfessionalHandoffSurface,
} from '../lib/professionalHandoffCohesion.js';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const allowedDomains: ProfessionalDomain[] = [
  'REAL ESTATE AGENT',
  'LENDER',
  'INSPECTOR / ENGINEER',
  'ATTORNEY',
  'TAX PROFESSIONAL',
  'APPRAISER',
];

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const model = read('lib/professionalHandoffCohesion.ts');
const panel = read('components/ProfessionalHandoffCohesionPanel.tsx');
const advisory = read('components/AdvisoryHandoffGuide.tsx');
const contact = read('app/contact/page.tsx');
const search = read('components/search/SearchInterface.tsx');
const property = read('app/properties/[id]/page.tsx');
const propertyInquiryForm = read('components/PropertyInquiryForm.tsx');
const propertyInquiryApi = read('app/api/property-inquiry/route.ts');

assert.equal(
  packageJson.scripts?.['check:professional-handoff-cohesion'],
  'npm run worker:build && node dist/scripts/checkProfessionalHandoffCohesion.js',
  'package.json must expose the professional handoff cohesion check.',
);
assertIncludes(tsconfig, 'lib/professionalHandoffCohesion.ts', 'Worker build must include the professional handoff model.');
assertIncludes(tsconfig, 'scripts/checkProfessionalHandoffCohesion.ts', 'Worker build must include the professional handoff check.');
assert.equal(REIE_PROFESSIONAL_HANDOFF_COHESION_STATUS, 'REIE_PROFESSIONAL_HANDOFF_COHESION_IMPLEMENTED');

const surfaces: ProfessionalHandoffSurface[] = ['search', 'property', 'advisory', 'contact'];

for (const surface of surfaces) {
  const profile = buildProfessionalHandoffCohesionProfile(surface);
  assert.equal(profile.status, REIE_PROFESSIONAL_HANDOFF_COHESION_STATUS);
  assert.equal(profile.sourceMethodologyHref, '/sources');
  assert.deepEqual(profile.evidenceLabels, ['UNAVAILABLE', 'VERIFICATION REQUIRED', 'PROFESSIONAL JUDGMENT']);
  assert(profile.standard.whatReieCanSupport.length > 40, `${surface} must explain what REIE can support.`);
  assert(profile.standard.whatRemainsUnresolved.length > 40, `${surface} must explain what remains unresolved.`);
  assert.equal(profile.standard.whoMayHelp.length, allowedDomains.length, `${surface} must use the authorized domain set.`);
  assert(profile.standard.whatToAsk.length >= 3, `${surface} must include focused questions to ask.`);
  assert(profile.standard.optionalNextAction.includes('Contact') || profile.standard.optionalNextAction.includes('Property Inquiry'), `${surface} must keep continuation optional and explicit.`);

  for (const domain of profile.standard.whoMayHelp) {
    assert(allowedDomains.includes(domain), `${surface} includes unauthorized professional domain: ${domain}`);
  }

  for (const boundary of Object.values(profile.protectedBoundaries)) {
    assert.equal(boundary, false, `${surface} protected boundary must remain false.`);
  }
}

for (const marker of [
  'data-testid="professional-handoff-cohesion-panel"',
  'data-pro-handoff-status={profile.status}',
  'data-pro-handoff-hidden-transfer={String(profile.protectedBoundaries.hiddenTransfer)}',
  'data-pro-handoff-contact-api-mutation={String(profile.protectedBoundaries.contactApiMutation)}',
  'data-pro-handoff-property-inquiry-api-mutation={String(profile.protectedBoundaries.propertyInquiryApiMutation)}',
  'data-pro-handoff-new-required-fields={String(profile.protectedBoundaries.newRequiredFields)}',
  'data-pro-handoff-hidden-fields={String(profile.protectedBoundaries.hiddenFields)}',
  'data-pro-handoff-brokerage-relationship-formation={String(profile.protectedBoundaries.brokerageRelationshipFormation)}',
  'data-pro-handoff-professional-conclusion={String(profile.protectedBoundaries.professionalConclusion)}',
  'data-pro-handoff-customer-data-expansion={String(profile.protectedBoundaries.customerDataExpansion)}',
  'What REIE Can Support',
  'What Remains Unresolved',
  'Who May Help Verify / Decide',
  'What To Ask',
  'This handoff is optional and customer-controlled.',
]) {
  assertIncludes(panel, marker, `Panel must include marker or visible standard: ${marker}`);
}

for (const [source, surface] of [
  [advisory, 'advisory'],
  [contact, 'contact'],
  [search, 'search'],
  [property, 'property'],
] as const) {
  assertIncludes(source, 'ProfessionalHandoffCohesionPanel', `${surface} must render the professional handoff panel.`);
  assertIncludes(source, `surface="${surface}"`, `${surface} must pass the correct professional handoff surface.`);
}

for (const source of [model, panel]) {
  for (const prohibitedRuntime of [
    'fetch(',
    'PrismaClient',
    'createClient(',
    'process.env',
    'navigator.sendBeacon',
    'localStorage',
    'sessionStorage',
    'document.cookie',
    'FormData',
    '<form',
    '<input',
    '<textarea',
  ]) {
    assertNotIncludes(source, prohibitedRuntime, `Professional handoff cohesion must not introduce protected runtime behavior: ${prohibitedRuntime}`);
  }
}

for (const source of [model, panel]) {
  for (const prohibitedClaim of [
    'best neighborhood',
    'safest neighborhood',
    'school ranking',
    'safety ranking',
    'investment recommendation',
    'suitability conclusion',
    'valuation certainty',
    'financial qualification',
    'guaranteed outcome',
    'lending approval',
    'attorney-client relationship',
    'tax-advisory relationship',
  ]) {
    assertNotIncludes(source, prohibitedClaim, `Professional handoff cohesion must not introduce prohibited claim: ${prohibitedClaim}`);
  }
}

assertIncludes(contact, 'data-dxt-contact-api-change="false"', 'Contact route must preserve no API change marker.');
assertIncludes(contact, 'data-dxt-contact-new-fields="false"', 'Contact route must preserve no new field marker.');
assertIncludes(contact, 'data-dxt-contact-hidden-context="false"', 'Contact route must preserve no hidden context marker.');
assertIncludes(contact, 'data-dxt-contact-persistence="false"', 'Contact route must preserve no persistence marker.');
assertIncludes(contact, 'data-dxt-contact-telemetry="false"', 'Contact route must preserve no telemetry marker.');
assertIncludes(property, 'data-property-advisory-contact-property-inquiry-change="false"', 'Property route must preserve Property Inquiry unchanged marker.');
assertIncludes(property, 'data-property-advisory-contact-api-change="false"', 'Property route must preserve no API change marker.');
assertIncludes(propertyInquiryForm, 'data-property-inquiry-required-field-contract="email-only"', 'Property Inquiry must remain email-only for required fields.');
assertIncludes(propertyInquiryApi, 'type PropertyInquiryBody', 'Property Inquiry API body contract must remain present.');
assertIncludes(propertyInquiryApi, 'export async function POST(request: Request)', 'Property Inquiry API POST route must remain present.');

for (const source of [advisory, contact, search, property, panel]) {
  assertNotIncludes(source, 'type="hidden"', 'Changed customer-facing surfaces must not add hidden inputs.');
  assertNotIncludes(source, "type='hidden'", 'Changed customer-facing surfaces must not add hidden inputs.');
}

assertIncludes(model, 'buildReieDecisionIntelligenceCohesionProfile', 'Professional handoff must reuse the certified Decision Intelligence Cohesion source-methodology vocabulary.');
assertIncludes(model, 'UNAVAILABLE', 'Professional handoff must preserve unavailable evidence language.');
assertIncludes(model, 'VERIFICATION REQUIRED', 'Professional handoff must preserve verification-required evidence language.');
assertIncludes(model, 'PROFESSIONAL JUDGMENT', 'Professional handoff must preserve professional-judgment evidence language.');

console.log('[professional-handoff-cohesion] ok: optional handoff standard, domains, evidence language, data minimization, Contact/Property Inquiry boundaries, and protected-system exclusions verified.');
