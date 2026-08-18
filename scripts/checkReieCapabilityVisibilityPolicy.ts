import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {
  REIE_CAPABILITY_CATEGORIES,
  REIE_CAPABILITY_DATA_CLASSES,
  REIE_CAPABILITY_VISIBILITY_STATES,
  evaluateReieCapabilityVisibilityPolicy,
  type ReieCapabilityVisibilityPolicyInput,
} from '../lib/reieCapabilityVisibilityPolicy.js';

const source = fs.readFileSync(path.resolve(process.cwd(), 'lib/reieCapabilityVisibilityPolicy.ts'), 'utf8');
for (const token of ['fetch(', 'PrismaClient', '@prisma', 'process.env', 'localStorage', 'sessionStorage', 'CRMTask', 'Typesense', 'sendEmail', 'strategyGate', 'REIEControlState']) {
  assert.equal(source.includes(token), false, `visibility policy must not depend on ${token}`);
}
assert.equal(REIE_CAPABILITY_CATEGORIES.length, 11);
assert.equal(REIE_CAPABILITY_DATA_CLASSES.length, 9);
assert.deepEqual(REIE_CAPABILITY_VISIBILITY_STATES, ['PUBLIC', 'GUIDED', 'PRIVATE_CLIENT', 'AGENT_ONLY', 'ADMIN_ONLY', 'NOT_AUTHORIZED', 'NOT_READY', 'DATA_INSUFFICIENT', 'COMPLIANCE_BLOCKED']);

const sourceActive = {
  identity: 'SOURCE_IDENTITY_EXISTS' as const,
  rights: 'RIGHTS_APPROVED' as const,
  freshness: 'FRESHNESS_CURRENT' as const,
  evidence: 'EVIDENCE_SUFFICIENT' as const,
  activation: 'ACTIVE_FOR_BOUNDED_USE' as const,
  manifestMembership: 'NOT_IN_MANIFEST' as const,
};
const approved = {
  capability: 'AUTHORIZED' as const,
  approval: 'APPROVED' as const,
  compliance: 'NOT_REQUIRED' as const,
  activation: 'ACTIVE_BOUNDED_USE' as const,
  customerSelected: true,
  agentReviewed: true,
  adminAuthorized: false,
};
const publicInput: ReieCapabilityVisibilityPolicyInput = {
  capability: 'SPECIALIZED_HUB_CONTENT',
  dataClass: 'PUBLIC_EDUCATIONAL',
  authorizationState: approved,
  role: 'PUBLIC_USER',
  sourcePosture: sourceActive,
  killSwitchActive: false,
  disclosure: 'SAFE_DISCLOSURE',
  professionalVerificationRequired: false,
};

assert.equal(evaluateReieCapabilityVisibilityPolicy(publicInput).visibility, 'PUBLIC');
assert.deepEqual(evaluateReieCapabilityVisibilityPolicy({ ...publicInput, killSwitchActive: true }).visibility, 'NOT_AUTHORIZED');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...publicInput, capability: 'UNKNOWN' as never }).reasonCode, 'CAPABILITY_UNKNOWN');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...publicInput, dataClass: 'UNKNOWN' as never }).reasonCode, 'DATA_CLASS_UNKNOWN');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...publicInput, sourcePosture: { ...sourceActive, evidence: 'EVIDENCE_INSUFFICIENT' } }).visibility, 'DATA_INSUFFICIENT');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...publicInput, authorizationState: { ...approved, activation: 'APPROVED_NOT_ACTIVATED' } }).visibility, 'NOT_READY');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...publicInput, capability: 'INVESTMENT_INTELLIGENCE', dataClass: 'INVESTMENT_INTELLIGENCE', role: 'AGENT', authorizationState: { ...approved, compliance: 'PENDING' } }).visibility, 'COMPLIANCE_BLOCKED');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...publicInput, capability: 'INVESTMENT_INTELLIGENCE', dataClass: 'INVESTMENT_INTELLIGENCE', role: 'AGENT' }).visibility, 'COMPLIANCE_BLOCKED');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...publicInput, capability: 'SOURCE_QUALITY_DETAIL', dataClass: 'SOURCE_QUALITY_DETAIL', role: 'ADMIN' }).visibility, 'ADMIN_ONLY');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...publicInput, capability: 'PRIVATE_LISTING_CONTEXT', dataClass: 'PRIVATE_CLIENT_CONTEXT', role: 'PUBLIC_USER' }).visibility, 'NOT_AUTHORIZED');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...publicInput, sourcePosture: { ...sourceActive, manifestMembership: 'IN_MANIFEST' } }).visibility, 'PUBLIC');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...publicInput, role: 'PUBLIC_USER', authorizationState: { ...approved, capability: 'NOT_AUTHORIZED' } }).visibility, 'NOT_AUTHORIZED');

const trace = evaluateReieCapabilityVisibilityPolicy(publicInput).trace;
assert.deepEqual(trace.slice(0, 7), ['KILL_SWITCH', 'CAPABILITY_AUTHORIZATION', 'SOURCE_RIGHTS_EVIDENCE_FRESHNESS', 'APPROVAL_STATE', 'ACTIVATION_STATE', 'ROLE_ELIGIBILITY', 'SAFE_OUTPUT_DISCLOSURE']);

console.log('[reie-capability-visibility-policy] ok: required capabilities/states, source posture separation, ordered fail-closed evaluation, role boundaries, and no numeric/control-state/manifest inference verified.');
