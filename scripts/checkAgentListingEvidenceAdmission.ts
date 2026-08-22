import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { evaluateAgentListingEvidenceAdmission } from '../lib/agent-advisory-workbench/agentListingEvidenceAdmission';
import { AGENT_LISTING_EVIDENCE_ADMISSION_FIXTURES } from '../lib/agent-advisory-workbench/agentListingEvidenceAdmissionFixtures';

function source(path: string) { return readFileSync(resolve(process.cwd(), path), 'utf8'); }

function expectState(name: keyof typeof AGENT_LISTING_EVIDENCE_ADMISSION_FIXTURES, state: string, reason: string) {
  const result = evaluateAgentListingEvidenceAdmission(AGENT_LISTING_EVIDENCE_ADMISSION_FIXTURES[name]);
  assert.equal(result.state, state, `${name} must return ${state}.`);
  assert.ok(result.reasons.includes(reason as never), `${name} must include ${reason}.`);
  assert.equal(result.admitted, false, `${name} must not admit evidence.`);
  assert.equal(result.identity, null, `${name} must not emit an identity.`);
}

const admitted = evaluateAgentListingEvidenceAdmission(AGENT_LISTING_EVIDENCE_ADMISSION_FIXTURES.admitted);
assert.equal(admitted.state, 'ADMITTED_WITH_LIMITATIONS');
assert.equal(admitted.admitted, true);
assert.equal(admitted.identity?.canonicalPropertyReference, 'property:fixture-listing-property');
assert.equal(admitted.identity?.listingReference, 'MLS-FIXTURE-1');
assert.equal(admitted.evidence.length, 4);
assert.ok(admitted.evidence.every((item) => item.sourceId === 'REIE_STORED_LISTING_FACTS'));
assert.ok(admitted.evidence.every((item) => item.rights === 'PRIVATE_AGENT_PREPARATION_ONLY'));
assert.ok(admitted.evidence.every((item) => item.displayRights === 'PRIVATE_AGENT_DISPLAY_WITH_SOURCE_REFERENCE'));
assert.ok(admitted.evidence.every((item) => item.attributionRequirement === 'SOURCE_REFERENCE_REQUIRED'));
assert.ok(admitted.evidence.every((item) => item.freshness === 'CURRENT'));
assert.ok(admitted.evidence.every((item) => item.professionalVerificationRequired));
assert.ok(admitted.evidence.every((item) => item.prohibitedUses.includes('PUBLIC_DISPLAY')));
assert.equal(admitted.protectedBoundaries.persistence, false);
assert.equal(admitted.protectedBoundaries.providerRuntime, false);
assert.equal(admitted.protectedBoundaries.publicActivation, false);
assert.equal(admitted.protectedBoundaries.mlsActivity, false);
assert.equal(admitted.protectedBoundaries.listingCreation, false);
assert.equal(admitted.protectedBoundaries.marketingActivation, false);

expectState('missingIdentity', 'IDENTITY_MISSING', 'IDENTITY_MISSING');
expectState('identityConflict', 'IDENTITY_CONFLICT', 'IDENTITY_CONFLICT');
expectState('missingProvenance', 'INSUFFICIENT_PROVENANCE', 'SOURCE_IDENTITY_REQUIRED');
expectState('staleEvidence', 'STALE', 'STALE_EVIDENCE');
expectState('restrictedRights', 'RIGHTS_RESTRICTED', 'RIGHTS_RESTRICTED');
expectState('conflictingEvidence', 'CONFLICTING', 'CONFLICTING_EVIDENCE');
expectState('uncertainJurisdiction', 'JURISDICTION_UNCERTAIN', 'UNSUPPORTED_JURISDICTION');
expectState('providerRuntime', 'NOT_ADMITTED', 'PROVIDER_RUNTIME_PROHIBITED');

const listingExperience = source('components/agent/ListingPreparationExperience.tsx');
const listingContract = source('lib/agent-advisory-workbench/agentListingEvidenceAdmission.ts');
const propertyApi = source('app/api/agent/prepare/property/route.ts');
const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

for (const marker of ['agent-listing-evidence-selector', 'agent-listing-evidence-readiness', 'agent-listing-evidence-source-detail', 'What we know for this Listing preparation', 'What needs verification', 'What to prepare next', 'Source, freshness &amp; limitations', 'data-same-page-decision-continuity="true"', 'data-listing-identity-retention="false"']) assert.ok(listingExperience.includes(marker), `Missing Listing evidence marker: ${marker}`);
assert.ok(listingExperience.includes("fetch('/api/agent/prepare/property', { cache: 'no-store', credentials: 'same-origin' })"));
assert.ok(listingExperience.includes('encodeURIComponent(selectedCandidate.property.slug)'));
assert.ok(listingExperience.includes('evaluateAgentListingEvidenceAdmission({ candidate: payload.candidate'));
assert.ok(propertyApi.includes("authorizeAdminRequest(request, { pathname: AGENT_PROPERTY_API_PATH, method: 'GET' })"));
assert.ok(propertyApi.includes("'Cache-Control': 'private, no-store'"));
for (const forbidden of ['localStorage', 'sessionStorage', 'document.cookie', 'REIE_AGENT_CREDENTIAL', 'customerName', 'leadId', 'MLS_GRID', 'IRES', 'prisma', 'createClient', 'provider fetch', 'listing creation', 'marketing activation', 'price recommendation']) {
  assert.equal(listingContract.includes(forbidden), false, `Listing evidence contract must not introduce ${forbidden}.`);
  assert.equal(listingExperience.includes(forbidden), false, `Listing experience must not introduce ${forbidden}.`);
}
assert.equal(packageJson.scripts?.['check:agent-listing-evidence-admission'], 'jiti scripts/checkAgentListingEvidenceAdmission.ts');

console.log('AGENT_LISTING_EVIDENCE_ADMISSION_CHECK: PASS');
