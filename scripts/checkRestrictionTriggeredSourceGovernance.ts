import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  MLS_GRID_RATE_LIMIT_RESTRICTION,
  MLS_GRID_RIGHTS_CLARIFICATION_STATUS,
  PROJECT_ATLAS_RESTRICTION_TRIGGERED_SOURCE_GOVERNANCE_STATUS,
  evaluateRestrictionTriggeredSourceGovernance,
} from '../lib/sourceGovernanceRestrictionTriggered';
import { RESTRICTION_TRIGGERED_SOURCE_GOVERNANCE_FIXTURES as fixtures } from '../lib/sourceGovernanceRestrictionTriggeredFixtures';

const evaluate = (name: keyof typeof fixtures) => evaluateRestrictionTriggeredSourceGovernance(fixtures[name]);
const source = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

assert.equal(PROJECT_ATLAS_RESTRICTION_TRIGGERED_SOURCE_GOVERNANCE_STATUS, 'PROJECT_ATLAS_RESTRICTION_TRIGGERED_SOURCE_GOVERNANCE_CERTIFIED');
assert.equal(MLS_GRID_RIGHTS_CLARIFICATION_STATUS, 'AWAITING_RESPONSE_NONBLOCKING_FOR_ORDINARY_INTERNAL_PROFESSIONAL_ANALYSIS');
assert.equal(evaluate('currentMlsComputation').decision, 'NOT_BLOCKED_BY_PERMISSION_POSTURE');
assert.equal(evaluate('currentAggregation').decision, 'NOT_BLOCKED_BY_PERMISSION_POSTURE');
assert.equal(evaluate('currentAgentBriefing').decision, 'NOT_BLOCKED_BY_PERMISSION_POSTURE');
assert.equal(evaluate('pendingMlsGridInquiry').decision, 'NOT_BLOCKED_BY_PERMISSION_POSTURE');
assert.equal(evaluate('derivedSnapshotCreation').decision, 'BLOCKED_BY_ARCHITECTURE');
assert.equal(evaluate('snapshotRetention').decision, 'BLOCKED_BY_ARCHITECTURE');
assert.equal(evaluate('thirtyDayComparison').decision, 'BLOCKED_BY_MISSING_DATA');
assert.equal(evaluate('ninetyDayComparison').decision, 'BLOCKED_BY_MISSING_DATA');
assert.equal(evaluate('yearOverYearComparison').decision, 'BLOCKED_BY_MISSING_DATA');
assert.equal(evaluate('publicMarketDisplay').decision, 'BLOCKED_BY_OTHER_GOVERNANCE');
assert.equal(evaluate('clientFacingProfessionalReport').decision, 'NOT_BLOCKED_BY_PERMISSION_POSTURE');
assert.equal(evaluate('rawMlsRetention').decision, 'BLOCKED_BY_ARCHITECTURE');
assert.equal(evaluate('rateLimitedProviderRetrieval').decision, 'BLOCKED_BY_IDENTIFIED_RESTRICTION');
assert.equal(evaluate('rateLimitedProviderRetrieval').restrictionEvidenceReferences[0], MLS_GRID_RATE_LIMIT_RESTRICTION.evidenceReference);
assert.equal(evaluate('explicitRetentionRestriction').decision, 'BLOCKED_BY_IDENTIFIED_RESTRICTION');
assert.equal(evaluate('materiallyAmbiguousTerms').permissionPosture, 'CLARIFICATION_REQUIRED');
assert.equal(evaluate('uncitedRestrictionAssertion').decision, 'NOT_BLOCKED_BY_PERMISSION_POSTURE');
assert(evaluate('uncitedRestrictionAssertion').reasons.includes('RESTRICTION_EVIDENCE_NOT_IDENTIFIED'));
assert.equal(evaluate('insufficientSourceQuality').decision, 'BLOCKED_BY_SOURCE_QUALITY');

for (const result of Object.values(fixtures).map(evaluateRestrictionTriggeredSourceGovernance)) {
  assert.equal(result.providerContactRequired, false);
  assert.equal(result.sourceActivityAuthorized, false);
  assert.equal(result.runtimeActivationAuthorized, false);
}

const runtime = source('lib/sourceGovernanceRestrictionTriggered.ts');
const packageJson = source('package.json');
assert.doesNotMatch(runtime, /fetch\(|PrismaClient|prisma\.|process\.env|Typesense|CRM|next\//, 'Governance must remain pure and non-runtime.');
assert.match(packageJson, /check:restriction-triggered-source-governance/, 'The deterministic governance checker must be registered.');

console.log('RESTRICTION_TRIGGERED_SOURCE_GOVERNANCE_CHECK: PASS');
