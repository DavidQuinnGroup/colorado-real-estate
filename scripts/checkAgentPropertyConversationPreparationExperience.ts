import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  getAgentPropertyPreparationHumanState,
  prepareAgentPropertyConversation,
} from '../lib/agent-advisory-workbench/agentPropertyConversationPreparation';
import { sanitizeAgentReturnPath } from '../lib/admin/adminAuth';
import { buildAgentPropertyPreparationPacket } from '../lib/agent-advisory-workbench/agentPropertyPreparationAdmission';
import { AGENT_PROPERTY_PREPARATION_FIXTURES } from '../lib/agent-advisory-workbench/agentPropertyPreparationAdmissionFixtures';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

function candidate(name: keyof typeof AGENT_PROPERTY_PREPARATION_FIXTURES) {
  const fixture = AGENT_PROPERTY_PREPARATION_FIXTURES[name];
  return { property: fixture.property, sourcePosture: fixture.sourcePosture };
}

function assertHumanState(
  name: keyof typeof AGENT_PROPERTY_PREPARATION_FIXTURES,
  expected: string,
) {
  const fixture = AGENT_PROPERTY_PREPARATION_FIXTURES[name];
  const packet = buildAgentPropertyPreparationPacket(fixture);
  assert.equal(getAgentPropertyPreparationHumanState(candidate(name), packet).label, expected, `${name} must have a deterministic human state.`);
}

const page = source('app/agent/prepare/property/page.tsx');
const experience = source('components/agent/PropertyConversationExperience.tsx');
const adapter = source('lib/agent-advisory-workbench/agentPropertyConversationPreparation.ts');
const repository = source('lib/agent-advisory-workbench/agentPropertyConversationPreparationRepository.ts');
const propertyApi = source('app/api/agent/prepare/property/route.ts');
const auth = source('lib/admin/adminAuth.ts');
const middleware = source('middleware.ts');
const agentShell = source('components/agent/AgentWorkspaceShell.tsx');
const publicPropertyPage = source('app/properties/[id]/page.tsx');
const marketPage = source('app/agent/prepare/market/page.tsx');

const admitted = prepareAgentPropertyConversation(candidate('admissible'));
assert.equal(admitted.packet.admission, 'ADMITTED');
assert.equal(admitted.packet.snapshot?.slug, 'fixture-active-property');
assert.equal(admitted.packet.sourcePosture?.freshness, 'CURRENT');
assert.equal(admitted.humanState.label, 'Ready for your review');
assert.ok(admitted.packet.professionalCheckpoints.every((checkpoint) => checkpoint.label === 'Agent verification checkpoint'));

assertHumanState('unknownProperty', 'Property unavailable');
assertHumanState('ambiguousProperty', 'More evidence is required');
assertHumanState('privateProperty', 'Property unavailable');
assertHumanState('syntheticProperty', 'Property unavailable');
assertHumanState('missingSourceIdentity', 'More evidence is required');
assertHumanState('staleEvidence', 'Currentness needs confirmation');
assertHumanState('incompleteEvidence', 'More evidence is required');
assertHumanState('conflictingEvidence', 'Conflicting information needs review');
assertHumanState('unauthorizedContext', 'Property unavailable');
assertHumanState('prohibitedCustomerContext', 'Property unavailable');
assertHumanState('unavailablePublicRecords', 'Professional verification needed');
assertHumanState('providerRuntime', 'Property unavailable');
assertHumanState('prohibitedRecommendation', 'Property unavailable');

const unsupportedJurisdiction = candidate('admissible');
const unsupportedPacket = buildAgentPropertyPreparationPacket({
  ...AGENT_PROPERTY_PREPARATION_FIXTURES.admissible,
  property: { ...unsupportedJurisdiction.property, state: 'WY' },
});
assert.equal(getAgentPropertyPreparationHumanState({ ...unsupportedJurisdiction, property: { ...unsupportedJurisdiction.property, state: 'WY' } }, unsupportedPacket).label, 'Property unavailable');

assert.ok(page.includes('PropertyConversationExperience') && !page.includes('getAgentPropertyConversationCandidates'), 'The exact route must render the Property experience without blocking on a repository read.');
assert.ok(auth.includes("surface('/agent/prepare/property', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY'"), 'Property preparation must be exact Agent-only read-only authorization.');
assert.ok(auth.includes("surface('/api/agent/prepare/property', 'READ_ONLY_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY'"), 'Deferred Property reads must remain exact Agent-only read-only authorization.');
assert.ok(!auth.includes("surface('/agent/:path*'"), 'Property preparation must not create a generic Agent authorization grant.');
assert.ok(middleware.includes('pathname === "/agent/prepare/property"') && middleware.includes('buildAgentLoginRedirect'), 'Unauthenticated Property preparation must use the existing Agent login flow.');
assert.equal(sanitizeAgentReturnPath('/agent/prepare/property'), '/agent/prepare/property', 'The exact Property route must survive the existing Agent login return-path allowlist.');
assert.equal(sanitizeAgentReturnPath('/agent/other'), '/agent', 'The Agent login return-path allowlist must remain exact and use the safe Workspace Home fallback.');
assert.ok(agentShell.includes('href="/agent/prepare/property"') && agentShell.includes('Property Preparation'), 'Property Preparation navigation must appear in the Agent shell.');
assert.ok(agentShell.includes('href="/agent/prepare/market"') && agentShell.includes('Market Preparation'), 'Existing Market Preparation navigation must remain.');

for (const expected of [
  'agent-property-conversation-experience',
  'agent-property-search-input',
  'agent-property-candidate-results',
  'agent-property-prepare-briefing',
  'agent-property-briefing',
  '60-second property briefing',
  'What matters',
  'Known now',
  'What needs verification',
  'Questions to prepare',
  'Agent verification checkpoints',
  'Sources &amp; limitations',
  'data-persistence="false"',
  'data-customer-data="false"',
  'data-provider-activity="false"',
  'data-public-record-retrieval="false"',
  'data-recommendation="false"',
  'data-fair-housing-inference="false"',
]) {
  assert.ok(experience.includes(expected), `Property experience must retain ${expected}.`);
}

assert.ok(experience.includes('candidate.property.slug === selectedSlug') && experience.includes('encodeURIComponent(selectedCandidate.property.slug)'), 'Selection must resolve only through the exact canonical Property.slug.');
assert.ok(experience.includes('fetch(`/api/agent/prepare/property?q=${encodeURIComponent(searchQuery)}`') && experience.includes('AUTOCOMPLETE_DEBOUNCE_MS') && experience.includes('agent-property-search-submit'), 'The compact selector read must remain Agent-initiated through debounced autocomplete with an explicit-search fallback.');
assert.ok(experience.includes("'NO_SEARCH_YET'") && experience.includes("'SEARCHING'") && experience.includes("'NO_MATCHES'") && experience.includes("'MATCHES_FOUND'"), 'Property search must expose explicit no-query, searching, no-result, and match states.');
for (const forbidden of ['localStorage', 'sessionStorage', 'XMLHttpRequest', 'sendBeacon', 'leadId', 'CRM', 'ATTOM', 'LightBox', 'assessor', 'permit lookup', 'recommendation score', 'suitability']) {
  assert.ok(!experience.includes(forbidden), `Property experience must not introduce ${forbidden}.`);
}

assert.ok(repository.includes("origin: 'REPOSITORY_PROPERTY'") && repository.includes('resolvedPropertyCount: 1'), 'Repository adapter must identify one real repository property.');
assert.ok(repository.includes('searchAgentPropertyConversationCandidateSummaries') && repository.includes('getAgentPropertyConversationCandidate(slug'), 'Repository reads must separate bounded search summaries from exact selected-property detail.');
assert.ok(repository.includes("sourceId: AGENT_PROPERTY_LISTING_SOURCE_ID") && repository.includes("sourceClass: 'EXISTING_REPOSITORY_LISTING_FACTS'"), 'Repository adapter must preserve source identity.');
assert.ok(repository.includes('sourceModifiedAt || record.lastIntelligenceSync || record.updatedAt') && repository.includes('CURRENT_LISTING_WINDOW_MS'), 'Repository adapter must calculate freshness from stored observation metadata.');
assert.ok(!repository.match(/create\(|update\(|delete\(|upsert\(|\$executeRaw|fetch\(/), 'Repository adapter must remain read-only and avoid external runtime calls.');
assert.ok(!adapter.match(/fetch\(|prisma\.|createClient\(|localStorage|sessionStorage/), 'Conversation adapter must stay a pure admission/presentation layer.');
assert.ok(propertyApi.includes("authorizeAdminRequest(request, { pathname: AGENT_PROPERTY_API_PATH, method: 'GET' })") && propertyApi.includes("'Cache-Control': 'private, no-store'"), 'Deferred Property reads must validate the exact Agent surface and remain private no-store.');
assert.ok(publicPropertyPage.includes('getPublicProperty'), 'The public Property page must retain its existing read path.');
assert.ok(marketPage.includes('MarketConversationExperience'), 'The existing Market workflow page must remain unchanged.');

console.log('AGENT_PROPERTY_CONVERSATION_PREPARATION_EXPERIENCE_CHECK: PASS');
