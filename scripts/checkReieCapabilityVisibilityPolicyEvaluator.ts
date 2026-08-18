import assert from 'node:assert/strict';
import { evaluateReieCapabilityVisibilityPolicy, type ReieCapabilityVisibilityPolicyInput } from '../lib/reieCapabilityVisibilityPolicy.js';

const base: ReieCapabilityVisibilityPolicyInput = {
  capability: 'FINANCIAL_ILLUSTRATION',
  dataClass: 'FINANCIAL_ASSUMPTION',
  authorizationState: {
    capability: 'AUTHORIZED',
    approval: 'APPROVED',
    compliance: 'NOT_REQUIRED',
    activation: 'ACTIVE_BOUNDED_USE',
    customerSelected: true,
    agentReviewed: true,
    adminAuthorized: false,
  },
  role: 'AUTHENTICATED_CLIENT',
  sourcePosture: {
    identity: 'SOURCE_IDENTITY_UNKNOWN',
    rights: 'RIGHTS_UNKNOWN',
    freshness: 'FRESHNESS_UNKNOWN',
    evidence: 'EVIDENCE_UNKNOWN',
    activation: 'NOT_APPLICABLE',
    manifestMembership: 'NOT_IN_MANIFEST',
  },
  killSwitchActive: false,
  disclosure: 'SAFE_DISCLOSURE',
  professionalVerificationRequired: false,
};

const first = evaluateReieCapabilityVisibilityPolicy(base);
const second = evaluateReieCapabilityVisibilityPolicy({ ...base });
assert.deepEqual(first, second);
assert.equal(first.visibility, 'PRIVATE_CLIENT');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...base, role: 'PUBLIC_USER' }).visibility, 'GUIDED');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...base, authorizationState: { ...base.authorizationState, capability: 'NOT_AUTHORIZED' } }).visibility, 'NOT_AUTHORIZED');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...base, disclosure: 'COMPLIANCE_BLOCKED' }).visibility, 'COMPLIANCE_BLOCKED');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...base, professionalVerificationRequired: true, role: 'PUBLIC_USER' }).reasonCode, 'PROFESSIONAL_VERIFICATION_REQUIRED');
assert.equal(evaluateReieCapabilityVisibilityPolicy({ ...base, role: 'SYSTEM_INTERNAL' as never }).visibility, 'NOT_AUTHORIZED');

console.log('[reie-capability-visibility-policy-evaluator] ok: pure deterministic results, fail-closed authorization, role handling, and safe-disclosure behavior verified.');
