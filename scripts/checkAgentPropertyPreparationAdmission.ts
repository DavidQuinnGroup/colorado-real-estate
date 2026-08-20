import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  AGENT_PROPERTY_PREPARATION_CAPABILITY,
  AGENT_PROPERTY_PREPARATION_EVIDENCE_POLICY,
  AGENT_PROPERTY_PREPARATION_FUTURE_ROUTE,
  AGENT_PROPERTY_PREPARATION_ROUTE_CLASSIFICATION,
  buildAgentPropertyPreparationPacket,
} from '../lib/agent-advisory-workbench/agentPropertyPreparationAdmission';
import { AGENT_PROPERTY_PREPARATION_FIXTURES } from '../lib/agent-advisory-workbench/agentPropertyPreparationAdmissionFixtures';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

function expectFailure(name: keyof typeof AGENT_PROPERTY_PREPARATION_FIXTURES, reason: string) {
  const packet = buildAgentPropertyPreparationPacket(AGENT_PROPERTY_PREPARATION_FIXTURES[name]);
  assert.equal(packet.admission, 'FAIL_CLOSED', `${name} must fail closed.`);
  assert.ok(packet.failureReasons.includes(reason), `${name} must include ${reason}.`);
  assert.equal(packet.snapshot, null, `${name} must not emit a fallback property snapshot.`);
}

const admitted = buildAgentPropertyPreparationPacket(AGENT_PROPERTY_PREPARATION_FIXTURES.admissible);
assert.equal(admitted.admission, 'ADMITTED');
assert.equal(admitted.capability, AGENT_PROPERTY_PREPARATION_CAPABILITY);
assert.equal(admitted.routeClassification.routePattern, AGENT_PROPERTY_PREPARATION_FUTURE_ROUTE);
assert.equal(admitted.routeClassification.requiredRole, 'AGENT');
assert.equal(admitted.routeClassification.activationState, 'NOT_AUTHORIZED');
assert.equal(admitted.routeClassification.noGenericAgentGrant, true);
assert.equal(admitted.routeClassification.adminInheritance, false);
assert.equal(admitted.snapshot?.slug, 'fixture-active-property');
assert.equal(admitted.sourcePosture?.freshness, 'CURRENT');
assert.ok(admitted.professionalCheckpoints.every((checkpoint) => checkpoint.label === 'Agent verification checkpoint'));
assert.ok(admitted.professionalCheckpoints.every((checkpoint) => checkpoint.role !== 'REAL_ESTATE_AGENT'));
assert.ok(admitted.safeReieSurfaces.some((surface) => surface.href === '/sources'));
assert.equal(admitted.protectedBoundaries.customerData, false);
assert.equal(admitted.protectedBoundaries.publicRecordRetrieval, false);

const policy = new Map(AGENT_PROPERTY_PREPARATION_EVIDENCE_POLICY.map((item) => [item.key, item]));
assert.equal(policy.get('canonical-identity')?.classification, 'AGENT_VISIBLE_FACT');
assert.equal(policy.get('price-history')?.classification, 'SOURCE_UNAVAILABLE');
assert.equal(policy.get('open-house')?.classification, 'SOURCE_UNAVAILABLE');
assert.equal(policy.get('listing-remarks')?.classification, 'NOT_AUTHORIZED');
assert.equal(policy.get('assessor-tax-parcel-ownership-permits')?.classification, 'SOURCE_UNAVAILABLE');
assert.equal(policy.get('admin-governance-context')?.classification, 'ADMIN_ONLY');
assert.equal(policy.get('recommendation-and-suitability')?.classification, 'NOT_AUTHORIZED');

expectFailure('incompleteEvidence', 'INSUFFICIENT_FACTUAL_EVIDENCE');
expectFailure('staleEvidence', 'STALE_OR_UNKNOWN_MATERIAL_EVIDENCE');
expectFailure('conflictingEvidence', 'CONFLICTING_MATERIAL_EVIDENCE');
expectFailure('unavailablePublicRecords', 'PUBLIC_RECORD_RETRIEVAL_PROHIBITED');
expectFailure('unknownProperty', 'UNKNOWN_OR_AMBIGUOUS_PROPERTY');
expectFailure('ambiguousProperty', 'UNKNOWN_OR_AMBIGUOUS_PROPERTY');
expectFailure('privateProperty', 'PRIVATE_OR_NONPUBLIC_PROPERTY_PROHIBITED');
expectFailure('missingSourceIdentity', 'MISSING_SOURCE_IDENTITY');
expectFailure('unauthorizedContext', 'AGENT_ROLE_REQUIRED');
expectFailure('prohibitedCustomerContext', 'CUSTOMER_CONTEXT_PROHIBITED');
expectFailure('syntheticProperty', 'SYNTHETIC_OR_UNKNOWN_PROPERTY_PROHIBITED');
expectFailure('providerRuntime', 'PROVIDER_RUNTIME_PROHIBITED');
expectFailure('prohibitedRecommendation', 'RECOMMENDATION_PROHIBITED');

const auth = source('lib/admin/adminAuth.ts');
const middleware = source('middleware.ts');
const agentShell = source('components/agent/AgentWorkspaceShell.tsx');
assert.ok(auth.includes("surface('/agent/prepare/market'"), 'Existing exact Agent Market classification must remain present.');
assert.ok(!auth.includes("surface('/agent/prepare/property'"), 'This gate must not activate the future Agent property route.');
assert.ok(middleware.includes('pathname === "/agent/prepare/market"'), 'Existing exact Agent Market middleware protection must remain present.');
assert.ok(!middleware.includes('pathname === "/agent/prepare/property"'), 'This gate must not widen middleware authorization.');
assert.ok(!agentShell.includes('/agent/prepare/property'), 'This gate must not add Agent navigation.');
assert.equal(existsSync(resolve(process.cwd(), 'app/agent/prepare/property')), false, 'This gate must not create the future Agent property UI route.');

console.log('AGENT_PROPERTY_PREPARATION_ADMISSION_CHECK: PASS');
