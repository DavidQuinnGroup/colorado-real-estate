import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  adaptReieControlStateToCapabilityVisibility,
  validateReieControlStateVisibilityInput,
  type ReieControlStateVisibilityInput,
} from '../lib/reieControlStateVisibilityAdapter.js';

const source = fs.readFileSync(path.resolve(process.cwd(), 'lib/reieControlStateVisibilityAdapter.ts'), 'utf8');
for (const token of ['PrismaClient', '@prisma', 'fetch(', 'process.env', 'localStorage', 'sessionStorage', 'Typesense', 'sendEmail', 'REIEControlState']) {
  assert.equal(source.includes(token), false, `adapter must not depend on ${token}`);
}
assert.match(source, /strategyGateCanAuthorize: false/);
assert.match(source, /privateLayerCanAuthorize: false/);
assert.match(source, /mapPrecisionCanAuthorize: false/);

const base: ReieControlStateVisibilityInput = {
  strategyGate: 60,
  areaCloud: true,
  privateLayer: false,
  killSwitchActive: false,
  mode: 'ops',
  publicExposure: 'guided',
  mapPrecision: 'area-cloud',
  policy: {
    capability: 'FINANCIAL_ILLUSTRATION',
    dataClass: 'FINANCIAL_ASSUMPTION',
    authorizationState: {
      capability: 'AUTHORIZED', approval: 'APPROVED', compliance: 'NOT_REQUIRED', activation: 'ACTIVE_BOUNDED_USE',
      customerSelected: true, agentReviewed: true, adminAuthorized: false,
    },
    role: 'PUBLIC_USER',
    sourcePosture: { identity: 'SOURCE_IDENTITY_UNKNOWN', rights: 'RIGHTS_UNKNOWN', freshness: 'FRESHNESS_UNKNOWN', evidence: 'EVIDENCE_UNKNOWN', activation: 'NOT_APPLICABLE', manifestMembership: 'NOT_IN_MANIFEST' },
    disclosure: 'SAFE_DISCLOSURE',
    professionalVerificationRequired: false,
  },
};

const first = adaptReieControlStateToCapabilityVisibility(base);
assert.equal(first.classification, 'VALID_CONTROL_STATE_ADAPTATION');
assert.equal(first.policyResult?.visibility, 'GUIDED');
assert.equal(first.legacyPosture?.strategyGateCanAuthorize, false);
assert.deepEqual(first, adaptReieControlStateToCapabilityVisibility({ ...base }));
assert.equal(adaptReieControlStateToCapabilityVisibility({ ...base, killSwitchActive: true }).policyResult?.reasonCode, 'KILL_SWITCH_ACTIVE_OR_INVALID');
assert.equal(adaptReieControlStateToCapabilityVisibility({ ...base, mode: 'paused' }).policyResult?.reasonCode, 'KILL_SWITCH_ACTIVE_OR_INVALID');
assert.equal(adaptReieControlStateToCapabilityVisibility({ ...base, strategyGate: 100 }).policyResult?.visibility, 'GUIDED');
assert.equal(adaptReieControlStateToCapabilityVisibility({ ...base, privateLayer: true }).policyResult?.visibility, 'GUIDED');
assert.equal(adaptReieControlStateToCapabilityVisibility({ ...base, mapPrecision: 'exact' }).policyResult?.visibility, 'GUIDED');
assert.equal(adaptReieControlStateToCapabilityVisibility({ ...base, publicExposure: 'protected' }).policyResult?.visibility, 'GUIDED');
assert.equal(adaptReieControlStateToCapabilityVisibility({ ...base, policy: { ...base.policy, capability: 'MAP_PRECISION', dataClass: 'GEOGRAPHIC_CONTEXT' } }).policyResult?.reasonCode, 'SOURCE_IDENTITY_NOT_ESTABLISHED');
assert.equal(adaptReieControlStateToCapabilityVisibility({ ...base, policy: { ...base.policy, authorizationState: { ...base.policy.authorizationState, approval: 'APPROVED', activation: 'APPROVED_NOT_ACTIVATED' } } }).policyResult?.reasonCode, 'CAPABILITY_NOT_ACTIVATED');
assert.deepEqual(validateReieControlStateVisibilityInput({ ...base, strategyGate: 101 }), ['CONTROL_STATE_STRATEGY_GATE_INVALID']);
assert.deepEqual(validateReieControlStateVisibilityInput({ ...base, mode: 'unknown' }), ['CONTROL_STATE_MODE_INVALID']);

console.log('[reie-control-state-visibility-adapter] ok: pure control adaptation, kill-switch and paused dominance, legacy hint non-authority, source/activation preservation, and fail-closed input validation verified.');
