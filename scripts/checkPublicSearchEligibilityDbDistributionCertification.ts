import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  certifyPublicSearchEligibilityDbDistribution,
  type PublicSearchEligibilityDbDistributionCertificationInput,
} from '../lib/mls/publicSearchEligibilityDbDistributionCertification.js';

type Overrides = Partial<Omit<PublicSearchEligibilityDbDistributionCertificationInput, 'distribution' | 'transitionEvidence' | 'activationPrerequisites' | 'protectedBoundary'>> & {
  distribution?: Partial<NonNullable<PublicSearchEligibilityDbDistributionCertificationInput['distribution']>> | null;
  transitionEvidence?: Partial<NonNullable<PublicSearchEligibilityDbDistributionCertificationInput['transitionEvidence']>> | null;
  activationPrerequisites?: Partial<NonNullable<PublicSearchEligibilityDbDistributionCertificationInput['activationPrerequisites']>> | null;
  protectedBoundary?: Partial<PublicSearchEligibilityDbDistributionCertificationInput['protectedBoundary']>;
};

const finalDistribution = {
  certifiedEligibleCount: 80,
  certifiedIneligibleCount: 20,
  excludedOutOfScopeCount: 0,
  nullCount: 0,
  publicScopeUnverifiedCount: 0,
  totalClassifiedCount: 100,
  totalPropertyRows: 100,
};

const beforeDistribution = {
  certifiedEligibleCount: 70,
  certifiedIneligibleCount: 15,
  excludedOutOfScopeCount: 0,
  nullCount: 10,
  publicScopeUnverifiedCount: 5,
  totalClassifiedCount: 100,
  totalPropertyRows: 100,
};

const allNullDistribution = {
  certifiedEligibleCount: 0,
  certifiedIneligibleCount: 0,
  excludedOutOfScopeCount: 0,
  nullCount: 100,
  publicScopeUnverifiedCount: 0,
  totalClassifiedCount: 100,
  totalPropertyRows: 100,
};

const finalWithUnverifiedDistribution = {
  certifiedEligibleCount: 80,
  certifiedIneligibleCount: 20,
  excludedOutOfScopeCount: 0,
  nullCount: 0,
  publicScopeUnverifiedCount: 1,
  totalClassifiedCount: 101,
  totalPropertyRows: 101,
};

const finalWithNullDistribution = {
  certifiedEligibleCount: 80,
  certifiedIneligibleCount: 20,
  excludedOutOfScopeCount: 0,
  nullCount: 1,
  publicScopeUnverifiedCount: 0,
  totalClassifiedCount: 101,
  totalPropertyRows: 101,
};

const firstWriteDistribution = {
  certifiedEligibleCount: 5,
  certifiedIneligibleCount: 0,
  excludedOutOfScopeCount: 0,
  nullCount: 95,
  publicScopeUnverifiedCount: 0,
  totalClassifiedCount: 100,
  totalPropertyRows: 100,
};

const transitionEvidence = {
  batchFingerprint: 'batch-a',
  expectedAfterDistribution: finalDistribution,
  expectedBeforeDistribution: beforeDistribution,
  expectedWriteCount: 15,
  observedBatchFingerprint: 'batch-a',
  observedPlanFingerprint: 'plan-a',
  observedProviderSnapshotFingerprint: 'snapshot-a',
  observedWriteCount: 15,
  observedWriteSetFingerprint: 'write-a',
  planFingerprint: 'plan-a',
  providerSnapshotFingerprint: 'snapshot-a',
  providerSnapshotFingerprintRequired: true,
  transitionWritesExecuted: true,
  writeSetFingerprint: 'write-a',
};

const activationPrerequisites = {
  activationOperationsReadinessCertified: true,
  databaseFallbackReadinessCertified: true,
  discoveryParityCertified: true,
  operatorAuthorizationSupplied: true,
  providerSnapshotCertified: true,
  savedSearchReadinessCertified: true,
  searchReadinessCertified: true,
  transitionWriteChainCertified: true,
  typesenseReadinessCertified: true,
};

const protectedBoundary = {
  alertOrEmailAttempted: false,
  databaseAccessAttempted: false,
  databaseWriteAttempted: false,
  deploymentAttempted: false,
  providerCallAttempted: false,
  runtimeActivationAttempted: false,
  savedSearchMutationAttempted: false,
  searchMutationAttempted: false,
  typesenseMutationAttempted: false,
};

function input(overrides: Overrides = {}): PublicSearchEligibilityDbDistributionCertificationInput {
  const base: PublicSearchEligibilityDbDistributionCertificationInput = {
    activationPrerequisites,
    capturedAt: '2026-08-15T12:00:00.000Z',
    certificationContext: 'fixture-only final pre-activation DB distribution certification',
    distribution: finalDistribution,
    expectedNullPopulationUnderstood: true,
    finalActivationCertificationRequested: false,
    phase: 'FINAL_PRE_ACTIVATION_CERTIFICATION',
    protectedBoundary,
    transitionEvidence,
    unresolvedIdentityCount: 0,
    unresolvedStatusCount: 0,
  };

  return {
    ...base,
    ...overrides,
    activationPrerequisites:
      overrides.activationPrerequisites === null
        ? null
        : { ...base.activationPrerequisites!, ...overrides.activationPrerequisites },
    distribution: overrides.distribution === null ? null : { ...base.distribution!, ...overrides.distribution },
    protectedBoundary: { ...base.protectedBoundary, ...overrides.protectedBoundary },
    transitionEvidence:
      overrides.transitionEvidence === null ? null : { ...base.transitionEvidence!, ...overrides.transitionEvidence },
  };
}

function certify(overrides: Overrides = {}) {
  return certifyPublicSearchEligibilityDbDistribution(input(overrides));
}

const certified = certify();
assert.equal(certified.classification, 'CERTIFIED', 'valid reconciled final distribution should certify');
assert.equal(certified.reconciliation.reconciledToCertificationScope, true, 'distribution must reconcile mathematically');
assert.equal(certified.activationAuthority.distributionAloneAuthorizesRuntimeActivation, false, 'distribution cannot authorize runtime activation');

assert.equal(
  certify({
    distribution: allNullDistribution,
    expectedNullPopulationUnderstood: false,
    phase: 'INITIALIZATION_IN_PROGRESS',
    transitionEvidence: { expectedAfterDistribution: allNullDistribution },
  }).classification,
  'NOT_READY',
  'all-NULL distribution is not ready',
);
assert.equal(certify({ distribution: { nullCount: -1 } }).classification, 'FAIL_CLOSED', 'negative count must fail closed');
assert.equal(certify({ distribution: { certifiedEligibleCount: 101 } }).classification, 'FAIL_CLOSED', 'counts exceeding total must fail closed');
assert.equal(
  certify({ distribution: { certifiedEligibleCount: 70, totalClassifiedCount: 70 } }).classification,
  'FAIL_CLOSED',
  'counts below total without excluded scope must fail closed',
);
assert.equal(certify({ distribution: { totalPropertyRows: null } }).classification, 'FAIL_CLOSED', 'missing total must fail closed');
assert.equal(certify({ distribution: { publicScopeUnverifiedCount: null } }).classification, 'FAIL_CLOSED', 'missing state count must fail closed');
assert.equal(
  certify({
    distribution: finalWithUnverifiedDistribution,
    transitionEvidence: { expectedAfterDistribution: finalWithUnverifiedDistribution },
  }).classification,
  'NOT_READY',
  'PUBLIC_SCOPE_UNVERIFIED present during final certification must not certify',
);
assert.equal(
  certify({
    distribution: finalWithNullDistribution,
    transitionEvidence: { expectedAfterDistribution: finalWithNullDistribution },
  }).classification,
  'NOT_READY',
  'NULL remaining during final certification must not certify',
);
assert.equal(
  certify({
    distribution: firstWriteDistribution,
    expectedNullPopulationUnderstood: true,
    phase: 'FIRST_BOUNDED_WRITE',
    transitionEvidence: { expectedAfterDistribution: firstWriteDistribution },
  }).reasons.includes('FIRST_BOUNDED_WRITE_REMAINS_PARTIAL'),
  true,
  'bounded first-write phase should preserve partial initialization semantics',
);
assert.equal(certify({ phase: 'INITIALIZATION_IN_PROGRESS' }).classification, 'NOT_READY');
assert.equal(certify({ phase: 'INITIALIZATION_COMPLETE' }).classification, 'CERTIFIED');
assert.equal(certified.transitionEvidence.movementMatchesExpectedDistribution, true);
assert.equal(certify({ transitionEvidence: { observedWriteCount: 14 } }).classification, 'DIVERGENT');
assert.equal(certify({ transitionEvidence: { observedPlanFingerprint: 'plan-b' } }).classification, 'DIVERGENT');
assert.equal(certify({ transitionEvidence: { observedWriteSetFingerprint: 'write-b' } }).classification, 'DIVERGENT');
assert.equal(certify({ transitionEvidence: { observedProviderSnapshotFingerprint: 'snapshot-b' } }).classification, 'DIVERGENT');

const deterministicA = certify();
const deterministicB = certify();
assert.deepEqual(deterministicA, deterministicB, 'identical supplied input must produce deterministic output');

assert.equal(certified.activationAuthority.certifiedEligibilityModeActivated, false, 'certified distribution must not activate runtime');
assert.equal(certified.zeroSideEffects.databaseWritesPerformed, false, 'distribution certification cannot mutate DB');
assert.equal(certified.zeroSideEffects.providerCallsPerformed, false, 'distribution certification cannot call providers');
assert.equal(certified.zeroSideEffects.searchMutationPerformed, false, 'distribution certification cannot mutate Search');
assert.equal(certified.zeroSideEffects.typesenseMutationPerformed, false, 'distribution certification cannot mutate Typesense');
assert.equal(certified.zeroSideEffects.alertOrEmailPerformed, false, 'distribution certification cannot create alerts/email');
assert.equal(certify({ certificationContext: null }).classification, 'FAIL_CLOSED', 'missing evidence must fail closed');
assert.equal(
  certify({
    finalActivationCertificationRequested: true,
    phase: 'FIRST_BOUNDED_WRITE',
  }).classification,
  'NOT_READY',
  'contradictory rollout phase evidence must fail closed or not ready',
);
assert.equal(certify({ protectedBoundary: { databaseAccessAttempted: true } }).classification, 'FAIL_CLOSED');
assert.equal(certify({ protectedBoundary: { providerCallAttempted: true } }).classification, 'FAIL_CLOSED');
assert.equal(certify({ protectedBoundary: { databaseWriteAttempted: true } }).classification, 'FAIL_CLOSED');
assert.equal(certify({ protectedBoundary: { runtimeActivationAttempted: true } }).classification, 'FAIL_CLOSED');
assert.equal(certify({ protectedBoundary: { searchMutationAttempted: true } }).classification, 'FAIL_CLOSED');
assert.equal(certify({ protectedBoundary: { typesenseMutationAttempted: true } }).classification, 'FAIL_CLOSED');
assert.equal(certify({ protectedBoundary: { savedSearchMutationAttempted: true } }).classification, 'FAIL_CLOSED');
assert.equal(certify({ protectedBoundary: { alertOrEmailAttempted: true } }).classification, 'FAIL_CLOSED');

const contractSource = readFileSync(resolve(process.cwd(), 'lib/mls/publicSearchEligibilityDbDistributionCertification.ts'), 'utf8');
for (const requiredText of [
  'PUBLIC_SEARCH_ELIGIBILITY_STATES',
  'PUBLIC_SCOPE_UNVERIFIED_REMAINS_UNRESOLVED',
  'DISTRIBUTION_DOES_NOT_AUTHORIZE_RUNTIME_ACTIVATION',
  'FINAL_PRE_ACTIVATION_CERTIFICATION',
]) {
  assert(contractSource.includes(requiredText), `contract must preserve ${requiredText}`);
}
for (const protectedPattern of [/\bfetch\s*\(/i, /\bprisma\s*\./i, /\bcreateClient\s*\(/i, /\bprocess\.env\b/i, /\breadFile\w*\s*\(/i, /\bwriteFile\w*\s*\(/i, /\bhttps?\s*\.request\s*\(/i, /\btypesenseClient\b/i, /\balertQueue\b/i, /\bsendEmail\b/i]) {
  assert(!protectedPattern.test(contractSource), `contract must not reference protected systems: ${protectedPattern}`);
}

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_SUPPLIED_EVIDENCE_NO_DB_NO_PROVIDER_NO_TYPESENSE_NO_ALERT_SIDE_EFFECT',
      classification: 'PUBLIC_SEARCH_ELIGIBILITY_DB_DISTRIBUTION_CERTIFICATION_ARCHITECTURE_IMPLEMENTED_AND_LOCALLY_CERTIFIED',
      cases: {
        validReconciledDistributionEvidence: 'PASS',
        allNullDistributionNotReady: 'PASS',
        negativeCountFailClosed: 'PASS',
        countsExceedTotalFailClosed: 'PASS',
        countsBelowTotalFailClosed: 'PASS',
        missingTotalEvidence: 'PASS',
        missingStateCountEvidence: 'PASS',
        publicScopeUnverifiedFinalNotReady: 'PASS',
        nullRemainingFinalNotReady: 'PASS',
        boundedFirstWritePartial: 'PASS',
        initializationInProgress: 'PASS',
        initializationComplete: 'PASS',
        expectedMovementMatchesObserved: 'PASS',
        movementMismatch: 'PASS',
        planFingerprintMismatch: 'PASS',
        writeSetFingerprintMismatch: 'PASS',
        providerSnapshotFingerprintMismatch: 'PASS',
        deterministicIdenticalInput: 'PASS',
        certifiedDistributionDoesNotAuthorizeRuntime: 'PASS',
        cannotMutateDb: 'PASS',
        cannotCallProviders: 'PASS',
        cannotMutateSearchTypesense: 'PASS',
        cannotCreateAlertsEmail: 'PASS',
        missingEvidenceFailClosed: 'PASS',
        contradictoryPhaseEvidenceFailClosed: 'PASS',
      },
      certified,
    },
    null,
    2,
  ),
);
