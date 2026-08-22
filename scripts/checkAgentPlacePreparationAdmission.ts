import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  AGENT_PLACE_PREPARATION_ALLOWED_CITY_IDS,
  AGENT_PLACE_PREPARATION_CAPABILITY,
  AGENT_PLACE_PREPARATION_EVIDENCE_POLICY,
  AGENT_PLACE_PREPARATION_FUTURE_ROUTE,
  AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION,
  buildAgentPlacePreparationPacket,
} from '../lib/agent-advisory-workbench/agentPlacePreparationAdmission';
import { AGENT_PLACE_PREPARATION_FIXTURES } from '../lib/agent-advisory-workbench/agentPlacePreparationAdmissionFixtures';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

function expectFailure(name: keyof typeof AGENT_PLACE_PREPARATION_FIXTURES, reason: string) {
  const packet = buildAgentPlacePreparationPacket(AGENT_PLACE_PREPARATION_FIXTURES[name]);
  assert.equal(packet.admission, 'FAIL_CLOSED', `${name} must fail closed.`);
  assert.ok(packet.failureReasons.includes(reason), `${name} must include ${reason}.`);
  assert.equal(packet.city, null, `${name} must not emit a fallback place identity.`);
}

for (const name of ['boulder', 'louisville', 'lafayette'] as const) {
  const packet = buildAgentPlacePreparationPacket(AGENT_PLACE_PREPARATION_FIXTURES[name]);
  assert.equal(packet.admission, 'ADMITTED', `${name} must be admitted.`);
  assert.equal(packet.readiness, 'READY_FOR_AGENT_REVIEW');
  assert.equal(packet.city?.objectType, 'CITY');
  assert.equal(packet.city?.jurisdictionClass, 'MUNICIPALITY');
  assert.equal(packet.city?.guideMaturity, 'EDITORIALLY_CERTIFIED');
  assert.equal(packet.sourcePosture?.freshness, 'DATED_DURABLE_EDITORIAL');
  assert.equal(packet.routeClassification.privateRouteAuthorization, 'AUTHORIZED');
  assert.equal(packet.routeClassification.publicActivationState, 'NOT_AUTHORIZED');
  assert.equal(packet.protectedBoundaries.publicActivation, false);
  assert.ok(packet.safeReieSurfaces.some((surface) => surface.href === '/agent/prepare/market' && surface.display === 'PROGRESSIVE_DISCLOSURE'));
  assert.deepEqual(packet.talkingPoints.map((point) => point.label), ['FACT', 'CONTEXT', 'LIMITATION', 'VERIFICATION']);
}

assert.deepEqual(AGENT_PLACE_PREPARATION_ALLOWED_CITY_IDS, [
  'reie-city:boulder-co-real-estate',
  'reie-city:louisville-co-real-estate',
  'reie-city:lafayette-co-real-estate',
]);
assert.equal(AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION.capability, AGENT_PLACE_PREPARATION_CAPABILITY);
assert.equal(AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION.routePattern, AGENT_PLACE_PREPARATION_FUTURE_ROUTE);
assert.equal(AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION.requiredIdentityType, 'HUMAN_AGENT');
assert.equal(AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION.requiredRole, 'AGENT');
assert.equal(AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION.allowedMechanism, 'HUMAN_AGENT_SESSION');
assert.equal(AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION.mutationPosture, 'READ_ONLY');
assert.equal(AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION.noGenericAgentGrant, true);
assert.equal(AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION.adminInheritance, false);
assert.equal(AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION.mcpInheritance, false);

const policy = new Map(AGENT_PLACE_PREPARATION_EVIDENCE_POLICY.map((item) => [item.key, item]));
assert.equal(policy.get('canonical-city-identity')?.classification, 'AGENT_VISIBLE_FACT');
assert.equal(policy.get('current-authorized-market')?.classification, 'SOURCE_UNAVAILABLE');
assert.equal(policy.get('authorized-reie-market-surface')?.classification, 'PROGRESSIVE_DISCLOSURE');
assert.equal(policy.get('neighborhood-submarket-and-corridor-context')?.classification, 'NOT_AUTHORIZED');
assert.equal(policy.get('customer-and-admin-context')?.classification, 'ADMIN_ONLY');
assert.equal(policy.get('schools-safety-and-protected-class-inference')?.classification, 'NOT_AUTHORIZED');
assert.equal(policy.get('recommendation-ranking-and-property-assignment')?.classification, 'NOT_AUTHORIZED');

expectFailure('niwot', 'CITY_ONLY_P0_SCOPE_REQUIRED');
expectFailure('gunbarrel', 'CITY_ONLY_P0_SCOPE_REQUIRED');
expectFailure('tableMesa', 'CITY_ONLY_P0_SCOPE_REQUIRED');
expectFailure('neighborhood', 'CITY_ONLY_P0_SCOPE_REQUIRED');
expectFailure('unknownCity', 'UNKNOWN_OR_UNADMITTED_CANONICAL_CITY');
expectFailure('freeForm', 'FREE_FORM_PLACE_INPUT_PROHIBITED');
expectFailure('staleSource', 'STALE_OR_UNKNOWN_SOURCE');
expectFailure('unknownRights', 'SOURCE_RIGHTS_UNRESOLVED');
expectFailure('conflictingSource', 'CONFLICTING_SOURCE_EVIDENCE');
expectFailure('customerContext', 'CUSTOMER_CONTEXT_PROHIBITED');
expectFailure('adminContext', 'AGENT_ROLE_REQUIRED');
expectFailure('mcpContext', 'MCP_CONTEXT_PROHIBITED');
expectFailure('fairHousing', 'FAIR_HOUSING_SENSITIVE_REQUEST_PROHIBITED');
expectFailure('schoolQuality', 'SCHOOL_QUALITY_REQUEST_PROHIBITED');
expectFailure('safety', 'SAFETY_REQUEST_PROHIBITED');
expectFailure('recommendation', 'RECOMMENDATION_PROHIBITED');
expectFailure('providerRuntime', 'PROVIDER_RUNTIME_PROHIBITED');

const auth = source('lib/admin/adminAuth.ts');
const middleware = source('middleware.ts');
const agentShell = source('components/agent/AgentWorkspaceShell.tsx');
assert.ok(auth.includes("surface('/agent/prepare/place', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY'"), 'The exact Agent place route must be read-only without Admin inheritance.');
assert.ok(middleware.includes('pathname === "/agent/prepare/place"'), 'The exact Agent place route must use the existing Agent login redirect.');
assert.ok(agentShell.includes('href="/agent/prepare/place"') && agentShell.includes('Location Preparation'), 'The authorized Location Preparation capability must be visible in the Agent shell.');
assert.equal(existsSync(resolve(process.cwd(), 'app/agent/prepare/place/page.tsx')), true, 'The exact Agent place UI route must exist.');

console.log('AGENT_PLACE_PREPARATION_ADMISSION_CHECK: PASS');
