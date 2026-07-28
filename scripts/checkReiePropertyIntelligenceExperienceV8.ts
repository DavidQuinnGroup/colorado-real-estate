import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildPropertyDecisionWorkspace } from '../lib/property/propertyDecisionWorkspace.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const helper = read('lib/property/propertyDecisionWorkspace.ts');
const propertyPage = read('app/properties/[id]/page.tsx');
const inquiryForm = read('components/PropertyInquiryForm.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const sprintDoc = read('docs/project-atlas/executive-library/REIE-8-PROPERTY-INTELLIGENCE-EXPERIENCE-V8.md');

assertIncludes(helper, 'buildPropertyDecisionWorkspace', 'Property Intelligence v8 must expose a deterministic decision-workspace helper.');
assertIncludes(helper, "posture: 'ready-to-compare' | 'verify-records' | 'complete-core-facts'", 'Property Intelligence v8 must classify decision posture without AI.');
assertIncludes(helper, 'Public listing facts and existing site context only', 'Property Intelligence v8 must preserve public-fact trust boundary.');

assertIncludes(propertyPage, 'buildPropertyDecisionWorkspace', 'Property page must compose the v8 decision workspace helper.');
assertIncludes(propertyPage, 'data-testid="reie-property-v8-decision-readiness-plan"', 'Property page must expose the v8 Decision Readiness Plan.');
assertIncludes(propertyPage, 'data-testid="reie-property-v8-decision-readiness-item"', 'Property page must expose deterministic readiness items.');
assertIncludes(propertyPage, 'data-property-v8-ai="false"', 'Property page must explicitly preserve no-AI boundary.');
assertIncludes(propertyPage, 'data-property-v8-gis="false"', 'Property page must explicitly preserve no-public-GIS boundary.');
assertIncludes(propertyPage, 'data-property-v8-telemetry="false"', 'Property page must explicitly preserve telemetry inactive boundary.');
assertIncludes(propertyPage, 'data-property-v8-lender-workflow="false"', 'Property page must explicitly preserve lender workflow exclusion.');
assertIncludes(propertyPage, 'id="property-facts"', 'Decision readiness plan must link to existing listing facts.');
assertIncludes(propertyPage, 'id="property-questions-forward"', 'Decision readiness plan must link to existing verification questions.');

for (const expectedStage of ['understand', 'compare', 'verify', 'discuss', 'next']) {
  assertIncludes(helper, `stage: '${expectedStage}'`, `Decision readiness plan must include ${expectedStage} stage.`);
}

const readyWorkspace = buildPropertyDecisionWorkspace({
  address: '100 Main St',
  city: 'Boulder',
  neighborhood: 'Mapleton Hill',
  propertyType: 'Residential',
  status: 'Active',
  price: 950000,
  sqft: 2100,
  beds: 3,
  baths: 2,
  relatedListingCount: 4,
  authorityLinkCount: 2,
  marketPathwayLabel: 'Boulder Market Brief',
  marketPathwayHref: '/market/boulder-co-housing-market',
});

assert.equal(readyWorkspace.posture, 'ready-to-compare', 'Complete public facts should create a ready-to-compare posture.');
assert.equal(readyWorkspace.readinessItems.length, 5, 'Decision workspace must include five readiness stages.');
assert.match(readyWorkspace.rationale, /Mapleton Hill/, 'Decision workspace must preserve local context.');
assert.match(readyWorkspace.trustBoundary, /no AI/i, 'Trust boundary must preserve no-AI exclusion.');

const verifyWorkspace = buildPropertyDecisionWorkspace({
  city: 'Longmont',
  propertyType: 'Residential',
  price: 700000,
  sqft: 1800,
  beds: 3,
  baths: 2,
  hasPolybutyleneRisk: true,
});

assert.equal(verifyWorkspace.posture, 'verify-records', 'Record-sensitive property signals should prioritize verification.');
assert.match(verifyWorkspace.headline, /records/i, 'Verify posture must foreground records.');

const incompleteWorkspace = buildPropertyDecisionWorkspace({
  city: 'Denver',
  propertyType: 'Condo',
  price: 500000,
});

assert.equal(incompleteWorkspace.posture, 'complete-core-facts', 'Incomplete core facts should not be treated as ready.');

assertIncludes(sprintDoc, 'Decision Experience Index', 'Sprint documentation must include the Decision Experience Index.');
assertIncludes(sprintDoc, 'Overall DEI score: 4.4 / 5', 'Sprint documentation must calculate the DEI score.');
for (const dimension of ['Decision Clarity', 'Decision Confidence', 'Educational Value', 'Trust', 'Decision Readiness']) {
  assertIncludes(sprintDoc, dimension, `DEI documentation must score ${dimension}.`);
}
assertIncludes(sprintDoc, 'No AI', 'Sprint documentation must preserve AI exclusion.');
assertIncludes(sprintDoc, 'No GIS activation', 'Sprint documentation must preserve GIS exclusion.');
assertIncludes(sprintDoc, 'No Mortgage Calculator', 'Sprint documentation must preserve mortgage-calculator exclusion.');

assert(!propertyPage.match(/INSERT INTO|UPDATE "|DELETE FROM|prisma\.[a-zA-Z]+\.create|prisma\.[a-zA-Z]+\.update|prisma\.[a-zA-Z]+\.delete/), 'Property page must remain read-only.');
assert(!propertyPage.includes("fetch('/api/property-inquiry'"), 'Property page must not submit inquiries directly.');
assert(inquiryForm.includes("fetch('/api/property-inquiry'"), 'Inquiry submission boundary must remain in the inquiry form.');

const combinedRuntime = [helper, propertyPage].join('\n');
for (const forbidden of [
  'OpenAI',
  'chatbot',
  'recommendation engine',
  'mortgage calculator',
  'preferred lender',
  'pre-approved',
  'document.cookie =',
  'localStorage.setItem',
  'sessionStorage.setItem',
  'provider activation',
  'GIS Sprint 9',
]) {
  assertNotIncludes(combinedRuntime, forbidden, `Property Intelligence v8 must not include unauthorized behavior or copy: ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:reie-property-intelligence-experience-v8'],
  'npm run worker:build && node dist/scripts/checkReiePropertyIntelligenceExperienceV8.js',
  'package.json must expose Property Intelligence v8 safety check.',
);

console.log('[reie-property-intelligence-experience-v8] ok: decision workspace, DEI governance, read-only boundaries, and prohibited activation exclusions verified.');
