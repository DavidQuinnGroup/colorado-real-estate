import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  evaluatePublicSearchEligibilityActivationOperationsReadiness,
  type PublicSearchEligibilityActivationOperationsReadinessInput,
} from '../lib/mls/publicSearchEligibilityActivationOperationsReadiness.js';
import { PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES } from '../lib/mls/publicSearchEligibilityRuntimeContract.js';

type FixtureInputOverrides = Partial<Omit<PublicSearchEligibilityActivationOperationsReadinessInput, 'dbDistribution' | 'rollback' | 'auditEvidence' | 'protectedActions' | 'discoveryParityCertification'>> & {
  dbDistribution?: Partial<NonNullable<PublicSearchEligibilityActivationOperationsReadinessInput['dbDistribution']>> | null;
  rollback?: Partial<NonNullable<PublicSearchEligibilityActivationOperationsReadinessInput['rollback']>> | null;
  auditEvidence?: Partial<NonNullable<PublicSearchEligibilityActivationOperationsReadinessInput['auditEvidence']>> | null;
  protectedActions?: Partial<PublicSearchEligibilityActivationOperationsReadinessInput['protectedActions']>;
  discoveryParityCertification?: PublicSearchEligibilityActivationOperationsReadinessInput['discoveryParityCertification'];
};

const protectedActions = {
  alertOrEmailAttempted: false,
  databaseWriteAttempted: false,
  deploymentAttempted: false,
  providerCallAttempted: false,
  runtimeActivationAttempted: false,
  runtimeDeactivationAttempted: false,
  savedSearchMutationAttempted: false,
  searchMutationAttempted: false,
  typesenseMutationAttempted: false,
};

const auditEvidence = {
  activationModeBeforeAfterRecorded: true,
  canonicalCommitRecorded: true,
  dbDistributionRecorded: true,
  discoveryParityCertificationRecorded: true,
  operatorAuthorizationRecorded: true,
  planFingerprintRecorded: true,
  postActivationCertificationPlanRecorded: true,
  providerSnapshotFingerprintRecorded: true,
  rollbackReadinessRecorded: true,
  stopThresholdsRecorded: true,
  writeSetFingerprintRecorded: true,
};

const rollback = {
  incidentEvidenceCaptureDefined: true,
  legacyDeactivationAvailable: true,
  noEligibilityRowRewriteRequired: true,
  postRollbackSearchVerificationDefined: true,
  typesenseSearchConsistencyFollowUpDefined: true,
};

const dbDistribution = {
  certifiedEligibleCount: 100,
  certifiedIneligibleCount: 20,
  nullCount: 0,
  publicScopeUnverifiedCount: 5,
};

function input(overrides: FixtureInputOverrides = {}): PublicSearchEligibilityActivationOperationsReadinessInput {
  const base: PublicSearchEligibilityActivationOperationsReadinessInput = {
    activationAuthorizationSupplied: true,
    activationModeBefore: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.legacy,
    alertGateSeparatelyClosed: true,
    auditEvidence,
    canonicalCommit: 'future-certified-commit',
    databaseFallbackReadinessCertified: true,
    dbDistribution,
    dbEligibilityDistributionCertified: true,
    discoveryParityCertification: {
      classification: 'PARITY',
      reasons: ['PARITY_WITH_CANONICAL_PUBLIC_DISCOVERY_PREDICATE'],
    },
    expectedNullPopulationUnderstood: true,
    explicitStopConditionPresent: false,
    protectedActions,
    protectedSystemPrerequisiteFailure: false,
    providerSnapshotCertifiedComplete: true,
    requestedActivationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility,
    rollback,
    savedSearchReadinessCertified: true,
    searchReadinessCertified: true,
    storedEligibilityRowsPresent: true,
    transitionWritesExecutedAsAuthorized: true,
    typesenseRebuildReadinessCertified: true,
    unresolvedMaterialDriftCount: 0,
  };

  return {
    ...base,
    ...overrides,
    auditEvidence: overrides.auditEvidence === null ? null : { ...base.auditEvidence!, ...overrides.auditEvidence },
    dbDistribution: overrides.dbDistribution === null ? null : { ...base.dbDistribution!, ...overrides.dbDistribution },
    protectedActions: { ...base.protectedActions, ...overrides.protectedActions },
    rollback: overrides.rollback === null ? null : { ...base.rollback!, ...overrides.rollback },
  };
}

function evaluate(overrides: FixtureInputOverrides = {}) {
  return evaluatePublicSearchEligibilityActivationOperationsReadiness(input(overrides));
}

const ready = evaluate();
assert.equal(ready.classification, 'READY_FOR_CONTROLLED_ACTIVATION', 'complete supplied evidence should be ready');
assert.equal(ready.activationAuthority.readyForControlledActivation, true, 'ready evidence plus explicit authorization should satisfy activation authority');
assert.equal(ready.storedEligibilityState.authorizesActivation, false, 'stored eligibility rows must never authorize activation by themselves');

assert.equal(evaluate({ providerSnapshotCertifiedComplete: false }).reasons.includes('PROVIDER_SNAPSHOT_INCOMPLETE'), true);
assert.equal(evaluate({ transitionWritesExecutedAsAuthorized: false }).reasons.includes('TRANSITION_WRITES_NOT_EXECUTED_AS_AUTHORIZED'), true);
assert.equal(evaluate({ dbEligibilityDistributionCertified: false }).reasons.includes('DB_ELIGIBILITY_DISTRIBUTION_UNCERTIFIED'), true);
assert.equal(evaluate({ expectedNullPopulationUnderstood: false }).reasons.includes('NULL_POPULATION_UNRESOLVED'), true);
assert.equal(
  evaluate({ discoveryParityCertification: { classification: 'DIVERGENCE', reasons: ['PUBLIC_SEARCH_DIVERGES_FROM_CANONICAL_PREDICATE'] } }).classification,
  'STOP_CONDITION_PRESENT',
);
assert.equal(evaluate({ searchReadinessCertified: false }).reasons.includes('SEARCH_READINESS_UNCERTIFIED'), true);
assert.equal(evaluate({ typesenseRebuildReadinessCertified: false }).reasons.includes('TYPESENSE_REBUILD_READINESS_UNCERTIFIED'), true);
assert.equal(evaluate({ databaseFallbackReadinessCertified: false }).reasons.includes('DATABASE_FALLBACK_READINESS_UNCERTIFIED'), true);
assert.equal(evaluate({ savedSearchReadinessCertified: false }).reasons.includes('SAVED_SEARCH_READINESS_UNCERTIFIED'), true);
assert.equal(evaluate({ rollback: { noEligibilityRowRewriteRequired: false } }).reasons.includes('ROLLBACK_READINESS_MISSING'), true);
assert.equal(evaluate({ auditEvidence: { operatorAuthorizationRecorded: false } }).reasons.includes('AUDIT_EVIDENCE_INCOMPLETE'), true);
assert.equal(evaluate({ unresolvedMaterialDriftCount: 1 }).classification, 'STOP_CONDITION_PRESENT');
assert.equal(evaluate({ explicitStopConditionPresent: true }).reasons.includes('EXPLICIT_STOP_CONDITION_PRESENT'), true);
assert.equal(evaluate({ providerSnapshotCertifiedComplete: null }).classification, 'INSUFFICIENT_EVIDENCE');

const deterministicA = evaluate();
const deterministicB = evaluate();
assert.deepEqual(deterministicA, deterministicB, 'identical input should produce deterministic readiness output');

const storedRowsOnly = evaluate({ activationAuthorizationSupplied: false });
assert.equal(storedRowsOnly.reasons.includes('STORED_ELIGIBILITY_STATE_DOES_NOT_AUTHORIZE_ACTIVATION'), true);
assert.equal(storedRowsOnly.activationAuthority.readyForControlledActivation, false);

const runtimeAttempt = evaluate({ protectedActions: { runtimeActivationAttempted: true } });
assert.equal(runtimeAttempt.reasons.includes('RUNTIME_ACTIVATION_ATTEMPTED'), true, 'readiness evaluation must not activate runtime');

const rollbackReadiness = evaluate();
assert.equal(rollbackReadiness.rollbackAndDeactivation.rewritesStoredEligibilityRows, false, 'rollback readiness must not rewrite stored eligibility rows');
assert.equal(rollbackReadiness.rollbackAndDeactivation.deactivationMode, PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.legacy, 'deactivation returns to LEGACY mode');

assert.equal(evaluate({ protectedActions: { providerCallAttempted: true } }).reasons.includes('PROVIDER_CALL_ATTEMPTED'), true);
assert.equal(evaluate({ protectedActions: { databaseWriteAttempted: true } }).reasons.includes('DATABASE_WRITE_ATTEMPTED'), true);
assert.equal(evaluate({ protectedActions: { searchMutationAttempted: true } }).reasons.includes('SEARCH_MUTATION_ATTEMPTED'), true);
assert.equal(evaluate({ protectedActions: { typesenseMutationAttempted: true } }).reasons.includes('TYPESENSE_MUTATION_ATTEMPTED'), true);
assert.equal(evaluate({ protectedActions: { savedSearchMutationAttempted: true } }).reasons.includes('SAVED_SEARCH_MUTATION_ATTEMPTED'), true);
assert.equal(evaluate({ protectedActions: { alertOrEmailAttempted: true } }).reasons.includes('ALERT_OR_EMAIL_ATTEMPTED'), true);
assert.equal(evaluate({ protectedActions: { deploymentAttempted: true } }).reasons.includes('DEPLOYMENT_ATTEMPTED'), true);

const runtimeSource = readFileSync(resolve(process.cwd(), 'lib/mls/publicSearchEligibilityActivationOperationsReadiness.ts'), 'utf8');
for (const requiredComposition of [
  'evaluatePublicSearchEligibilityActivationReadiness',
  'PUBLIC_SEARCH_ELIGIBILITY_DEACTIVATION_DESIGN',
  'PublicSearchEligibilityDiscoveryParityCertification',
]) {
  assert(runtimeSource.includes(requiredComposition), `operations readiness must compose ${requiredComposition}`);
}
for (const protectedPattern of [/\bfetch\s*\(/i, /\bprisma\s*\./i, /\bcreateClient\s*\(/i, /\bprocess\.env\b/i, /\bwriteFile\w*\s*\(/i, /\bhttps?\s*\.request\s*\(/i, /\btypesenseClient\b/i, /\balertQueue\b/i, /\bsendEmail\b/i]) {
  assert(!protectedPattern.test(runtimeSource), `operations readiness must not reference protected systems: ${protectedPattern}`);
}

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_NO_DB_NO_PROVIDER_NO_TYPESENSE_NO_ALERT_SIDE_EFFECT',
      classification: 'PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_OPERATIONS_READINESS_IMPLEMENTED_AND_LOCALLY_CERTIFIED',
      cases: {
        fullyReadySuppliedEvidence: 'PASS',
        incompleteProviderSnapshot: 'PASS',
        writesNotExecuted: 'PASS',
        uncertifiedDbDistribution: 'PASS',
        unresolvedNullPopulation: 'PASS',
        discoveryParityFailure: 'PASS',
        searchDivergence: 'PASS',
        typesenseDivergence: 'PASS',
        fallbackDivergence: 'PASS',
        savedSearchDivergence: 'PASS',
        missingRollbackReadiness: 'PASS',
        missingAuditEvidence: 'PASS',
        materialDrift: 'PASS',
        explicitStopCondition: 'PASS',
        insufficientEvidence: 'PASS',
        deterministicIdenticalInput: 'PASS',
        storedEligibilityDoesNotAuthorizeActivation: 'PASS',
        activationReadinessDoesNotActivateRuntime: 'PASS',
        rollbackReadinessDoesNotRewriteRows: 'PASS',
        legacyDeactivationSemantics: 'PASS',
        noProviderCallCapability: 'PASS',
        noDbWriteCapability: 'PASS',
        noSearchTypesenseMutationCapability: 'PASS',
        noAlertEmailCapability: 'PASS',
        noDeploymentCapability: 'PASS',
      },
      ready,
      zeroSideEffects: ready.zeroSideEffects,
    },
    null,
    2,
  ),
);
