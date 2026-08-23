import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { AGENT_PLACE_PREPARATION_ALLOWED_CITY_IDS } from '../lib/agent-advisory-workbench/agentPlacePreparationAdmission';
import { prepareAgentPlaceConversation } from '../lib/agent-advisory-workbench/agentPlaceConversationPreparation';
import { sanitizeAgentReturnPath } from '../lib/admin/adminAuth';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

const page = source('app/agent/prepare/place/page.tsx');
const experience = source('components/agent/PlaceConversationExperience.tsx');
const adapter = source('lib/agent-advisory-workbench/agentPlaceConversationPreparation.ts');
const admission = source('lib/agent-advisory-workbench/agentPlacePreparationAdmission.ts');
const auth = source('lib/admin/adminAuth.ts');
const middleware = source('middleware.ts');
const agentShell = source('components/agent/AgentWorkspaceShell.tsx');
const cityPage = source('app/market/[city]/page.tsx');
const neighborhoodProduct = source('lib/neighborhoodProduct3.ts');
const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

assert.deepEqual(AGENT_PLACE_PREPARATION_ALLOWED_CITY_IDS, [
  'reie-city:boulder-co-real-estate',
  'reie-city:louisville-co-real-estate',
  'reie-city:lafayette-co-real-estate',
]);

for (const cityId of AGENT_PLACE_PREPARATION_ALLOWED_CITY_IDS) {
  const result = prepareAgentPlaceConversation(cityId);
  assert.equal(result.packet.admission, 'ADMITTED', `${cityId} must be admitted through the place contract.`);
  assert.equal(result.humanState.label, 'Ready for your review');
  assert.equal(result.briefing?.city.canonicalPlaceId, cityId);
  assert.equal(result.briefing?.placeSnapshot[0]?.kind, 'FACT');
  assert.equal(result.briefing?.placeSnapshot[1]?.kind, 'CONTEXT');
  assert.ok(result.briefing?.headline.includes('Decide what'));
  assert.equal(result.packet.protectedBoundaries.customerData, false);
  assert.equal(result.packet.protectedBoundaries.persistence, false);
  assert.equal(result.packet.protectedBoundaries.providerRuntime, false);
  assert.equal(result.packet.protectedBoundaries.fairHousingInference, false);
}

assert.equal(prepareAgentPlaceConversation(null).humanState.label, 'Choose a city');
assert.equal(prepareAgentPlaceConversation('reie-city:unknown').humanState.label, 'Place unavailable');
assert.equal(prepareAgentPlaceConversation('reie-neighborhood:table-mesa', 'NEIGHBORHOOD').humanState.label, 'Place unavailable');

assert.ok(page.includes('PlaceConversationExperience'), 'The exact route must render the Place experience.');
assert.ok(existsSync(resolve(process.cwd(), 'app/agent/prepare/place/page.tsx')), 'The exact private Agent place route must exist.');
assert.ok(adapter.includes('buildAgentPlacePreparationPacket'), 'The experience must use the certified admission contract.');
assert.ok(adapter.includes('buildAgentPlacePreparationSourcePosture'), 'The experience must use the certified source posture.');
assert.ok(!adapter.match(/fetch\(|prisma\.|createClient\(|localStorage|sessionStorage|document\.cookie/), 'The place adapter must remain pure and ephemeral.');

for (const marker of [
  'agent-place-conversation-experience',
  'agent-place-empty-state',
  'agent-place-prepare-briefing',
  'agent-place-briefing',
  '60-second location briefing',
  'City identity and orientation',
  'What matters',
  'Facts and location context',
  'What needs verification',
  'Questions to prepare',
  'Municipal and professional checkpoints',
  'Sources &amp; limitations',
  'data-persistence="false"',
  'data-customer-data="false"',
  'data-provider-activity="false"',
  'data-recommendation="false"',
  'data-suitability="false"',
  'data-fair-housing-inference="false"',
]) assert.ok(experience.includes(marker), `Missing place experience marker: ${marker}.`);

for (const forbidden of [
  'localStorage', 'sessionStorage', 'document.cookie', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'CRM', 'customerName', 'leadId', 'MLS_GRID', 'IRES', 'ATTOM', 'LightBox', 'crime', 'safety score', 'school ranking', 'family friendly', 'young professional', 'retiree area', 'recommendation score', 'data-suitability="true"', 'Niwot', 'Gunbarrel', 'Table Mesa',
]) assert.equal(experience.includes(forbidden), false, `Place experience must not introduce ${forbidden}.`);

assert.ok(auth.includes("surface('/agent/prepare/place', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY'"), 'Place preparation must have exact Agent-only authorization.');
assert.ok(!auth.includes("surface('/agent/:path*'"), 'Place preparation must not create a generic Agent grant.');
assert.ok(middleware.includes('pathname === "/agent/prepare/place"') && middleware.includes('buildAgentLoginRedirect'), 'Unauthenticated Place access must use the Agent login flow.');
assert.equal(sanitizeAgentReturnPath('/agent/prepare/place'), '/agent/prepare/place', 'The exact Place route must survive the Agent return-path allowlist.');
assert.equal(sanitizeAgentReturnPath('/agent/place'), '/agent', 'Unknown Agent returns must fail closed to the safe Workspace Home fallback.');
assert.ok(agentShell.includes('href="/agent/prepare/place"') && agentShell.includes('Location Preparation'), 'Location Preparation must appear in the Agent shell.');
assert.ok(agentShell.includes('href="/agent/prepare/property"') && agentShell.includes('href="/agent/prepare/market"'), 'Property and Market navigation must remain.');

assert.ok(admission.includes("publicActivationState: 'NOT_AUTHORIZED'"), 'Private route authorization must not authorize public activation.');
assert.ok(cityPage.includes('getCityByMarketSlug'), 'The public City route must retain its existing read path.');
assert.ok(neighborhoodProduct.includes('NEIGHBORHOOD_PRODUCT_3_STATUS'), 'The public Neighborhood product must remain unchanged.');
assert.equal(packageJson.scripts?.['check:agent-place-conversation-preparation-experience'], 'jiti scripts/checkAgentPlaceConversationPreparationExperience.ts');

console.log('AGENT_PLACE_CONVERSATION_PREPARATION_EXPERIENCE_CHECK: PASS');
