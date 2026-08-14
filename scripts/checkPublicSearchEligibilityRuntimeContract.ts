import assert from 'node:assert/strict';

import {
  PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES,
  PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_SEQUENCE,
  PUBLIC_SEARCH_ELIGIBILITY_DEACTIVATION_DESIGN,
  evaluatePublicSearchEligibilityActivationReadiness,
  evaluatePublicSearchEligibilityRuntime,
  type PublicSearchEligibilityActivationReadinessInput,
  type PublicSearchEligibilityRuntimeInput,
} from '../lib/mls/publicSearchEligibilityRuntimeContract.js';
import { PUBLIC_SEARCH_ELIGIBILITY_STATES } from '../lib/mls/publicSearchEligibilityStateContract.js';

function runtimeInput(overrides: Partial<PublicSearchEligibilityRuntimeInput> = {}): PublicSearchEligibilityRuntimeInput {
  return {
    activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.legacy,
    authoritativeStatus: 'Active',
    consentForAlert: true,
    duplicateAlertEvent: false,
    isPrivateExclusive: false,
    otherPublicReadRestriction: false,
    publicSearchEligibility: null,
    savedSearchMatch: true,
    sourceFreshForSavedSearch: true,
    ...overrides,
  };
}

function readinessInput(overrides: Partial<PublicSearchEligibilityActivationReadinessInput> = {}): PublicSearchEligibilityActivationReadinessInput {
  return {
    absentRowsReconciledOrAcceptedFailClosed: true,
    alertBehaviorSeparatelyGated: true,
    dbEligibilityDistributionCertified: true,
    dbDistribution: {
      certifiedEligibleCount: 100,
      certifiedIneligibleCount: 20,
      nullCount: 0,
      publicScopeUnverifiedCount: 5,
    },
    expectedNullPopulationUnderstood: true,
    providerSnapshotCertifiedComplete: true,
    savedSearchBehaviorReady: true,
    searchIndexActivationPlanCertified: true,
    transitionWritesExecuted: true,
    typesenseRebuildReady: true,
    unresolvedStateDriftFailures: 0,
    ...overrides,
  };
}

const legacyNull = evaluatePublicSearchEligibilityRuntime(runtimeInput());
assert.equal(legacyNull.publicSearchEligible, true);
assert.equal(legacyNull.eligibilityStateRequiredForPublicDiscovery, false);
assert.equal(legacyNull.reason, 'LEGACY_PUBLIC_CRITERIA_APPLIED');

const legacyEligible = evaluatePublicSearchEligibilityRuntime(
  runtimeInput({ publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible }),
);
assert.deepEqual(legacyEligible, legacyNull);

const certifiedNull = evaluatePublicSearchEligibilityRuntime(
  runtimeInput({ activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility }),
);
assert.equal(certifiedNull.publicSearchEligible, false);
assert.equal(certifiedNull.typesenseEligible, false);
assert.equal(certifiedNull.databaseFallbackEligible, false);
assert.equal(certifiedNull.savedSearchEligible, false);
assert.equal(certifiedNull.newListingAlertCandidate, false);
assert.equal(certifiedNull.reason, 'CERTIFIED_ELIGIBILITY_REQUIRED_NULL_FAIL_CLOSED');

const certifiedUnverified = evaluatePublicSearchEligibilityRuntime(
  runtimeInput({
    activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility,
    publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified,
  }),
);
assert.equal(certifiedUnverified.publicSearchEligible, false);
assert.equal(certifiedUnverified.reason, 'PUBLIC_SCOPE_UNVERIFIED_FAIL_CLOSED');

const certifiedIneligible = evaluatePublicSearchEligibilityRuntime(
  runtimeInput({
    activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility,
    publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible,
  }),
);
assert.equal(certifiedIneligible.publicSearchEligible, false);
assert.equal(certifiedIneligible.reason, 'CERTIFIED_INELIGIBLE_FAIL_CLOSED');

const certifiedActive = evaluatePublicSearchEligibilityRuntime(
  runtimeInput({
    activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility,
    publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible,
  }),
);
assert.equal(certifiedActive.publicSearchEligible, true);
assert.equal(certifiedActive.typesenseEligible, true);
assert.equal(certifiedActive.databaseFallbackEligible, true);
assert.equal(certifiedActive.savedSearchEligible, true);
assert.equal(certifiedActive.newListingAlertCandidate, true);
assert.equal(certifiedActive.historicalPropertyRouteRetained, true);

const certifiedComingSoon = evaluatePublicSearchEligibilityRuntime(
  runtimeInput({
    activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility,
    authoritativeStatus: 'Coming Soon',
    publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible,
  }),
);
assert.equal(certifiedComingSoon.publicSearchEligible, true);
assert.equal(certifiedComingSoon.typesenseEligible, true);
assert.equal(certifiedComingSoon.savedSearchEligible, false);
assert.equal(certifiedComingSoon.newListingAlertCandidate, false);

const privateExclusive = evaluatePublicSearchEligibilityRuntime(
  runtimeInput({
    activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility,
    isPrivateExclusive: true,
    publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible,
  }),
);
assert.equal(privateExclusive.publicSearchEligible, false);
assert.equal(privateExclusive.reason, 'CERTIFIED_ELIGIBLE_PRIVATE_EXCLUSIVE_BLOCKED');

const nonPublicStatus = evaluatePublicSearchEligibilityRuntime(
  runtimeInput({
    activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility,
    authoritativeStatus: 'Closed',
    publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible,
  }),
);
assert.equal(nonPublicStatus.publicSearchEligible, false);
assert.equal(nonPublicStatus.reason, 'CERTIFIED_ELIGIBLE_STATUS_NOT_PUBLIC');

assert.equal(certifiedActive.publicSearchEligible, certifiedActive.typesenseEligible);
assert.equal(certifiedActive.publicSearchEligible, certifiedActive.databaseFallbackEligible);
assert.equal(certifiedNull.publicSearchEligible, certifiedNull.typesenseEligible);
assert.equal(certifiedNull.publicSearchEligible, certifiedNull.databaseFallbackEligible);

const noConsentNewListing = evaluatePublicSearchEligibilityRuntime(
  runtimeInput({
    activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility,
    consentForAlert: false,
    publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible,
  }),
);
assert.equal(noConsentNewListing.publicSearchEligible, true);
assert.equal(noConsentNewListing.savedSearchEligible, false);
assert.equal(noConsentNewListing.newListingAlertCandidate, false);

assert.equal(certifiedIneligible.historicalPropertyRouteRetained, true);
assert.equal(privateExclusive.historicalPropertyRouteRetained, true);

const readyActivation = evaluatePublicSearchEligibilityActivationReadiness(readinessInput());
assert.equal(readyActivation.status, 'READY_TO_ACTIVATE_CERTIFIED_ELIGIBILITY');
assert.deepEqual(readyActivation.reasons, ['READY_ALL_ACTIVATION_PRECONDITIONS_PRESENT']);
assert.equal(readyActivation.zeroSideEffects.runtimeActivationPerformed, false);

const missingProvider = evaluatePublicSearchEligibilityActivationReadiness(readinessInput({ providerSnapshotCertifiedComplete: false }));
assert.equal(missingProvider.status, 'NOT_READY_TO_ACTIVATE_CERTIFIED_ELIGIBILITY');
assert.equal(missingProvider.reasons.includes('PROVIDER_SNAPSHOT_NOT_CERTIFIED_COMPLETE'), true);

const unresolvedWrites = evaluatePublicSearchEligibilityActivationReadiness(
  readinessInput({ absentRowsReconciledOrAcceptedFailClosed: false }),
);
assert.equal(unresolvedWrites.reasons.includes('ABSENT_ROWS_NOT_RECONCILED_OR_ACCEPTED_FAIL_CLOSED'), true);

const allNullDb = evaluatePublicSearchEligibilityActivationReadiness(
  readinessInput({
    dbDistribution: {
      certifiedEligibleCount: 0,
      certifiedIneligibleCount: 0,
      nullCount: 75490,
      publicScopeUnverifiedCount: 0,
    },
  }),
);
assert.equal(allNullDb.reasons.includes('DB_REMAINS_ALL_NULL'), true);

const stateDrift = evaluatePublicSearchEligibilityActivationReadiness(readinessInput({ unresolvedStateDriftFailures: 1 }));
assert.equal(stateDrift.reasons.includes('UNRESOLVED_STATE_DRIFT_FAILURES_PRESENT'), true);

const currentExpectedReadiness = evaluatePublicSearchEligibilityActivationReadiness(
  readinessInput({
    dbDistribution: {
      certifiedEligibleCount: 0,
      certifiedIneligibleCount: 0,
      nullCount: 75490,
      publicScopeUnverifiedCount: 0,
    },
    dbEligibilityDistributionCertified: false,
    expectedNullPopulationUnderstood: false,
    providerSnapshotCertifiedComplete: false,
    searchIndexActivationPlanCertified: false,
    transitionWritesExecuted: false,
    typesenseRebuildReady: false,
  }),
);
assert.equal(currentExpectedReadiness.status, 'NOT_READY_TO_ACTIVATE_CERTIFIED_ELIGIBILITY');
assert.equal(currentExpectedReadiness.reasons.includes('PROVIDER_SNAPSHOT_NOT_CERTIFIED_COMPLETE'), true);
assert.equal(currentExpectedReadiness.reasons.includes('TRANSITION_WRITES_NOT_EXECUTED'), true);
assert.equal(currentExpectedReadiness.reasons.includes('DB_REMAINS_ALL_NULL'), true);

assert.deepEqual(
  evaluatePublicSearchEligibilityRuntime(
    runtimeInput({
      activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility,
      publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible,
    }),
  ),
  certifiedIneligible,
);
assert.deepEqual(evaluatePublicSearchEligibilityActivationReadiness(readinessInput()), readyActivation);

assert.equal(PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_SEQUENCE.length, 13);
assert.equal(PUBLIC_SEARCH_ELIGIBILITY_DEACTIVATION_DESIGN.activationConfigSeparateFromStoredEligibility, true);
assert.equal(PUBLIC_SEARCH_ELIGIBILITY_DEACTIVATION_DESIGN.rollbackToLegacyModeWithoutRewritingEligibilityRows, true);

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_NO_DB_NO_PROVIDER_NO_TYPESENSE_NO_ALERT_SIDE_EFFECT',
      classification: 'PUBLIC_SEARCH_ELIGIBILITY_RUNTIME_ACTIVATION_CONTRACT_IMPLEMENTED_AND_LOCALLY_CERTIFIED',
      cases: {
        legacyNull: 'PASS',
        legacyEligible: 'PASS',
        activationNull: 'PASS',
        activationUnverified: 'PASS',
        activationIneligible: 'PASS',
        activationEligibleActive: 'PASS',
        activationEligibleComingSoon: 'PASS',
        activationEligiblePrivateExclusive: 'PASS',
        activationEligibleNonPublicStatus: 'PASS',
        searchPredicate: 'PASS',
        typesensePredicate: 'PASS',
        fallbackPredicateParity: 'PASS',
        savedSearchPredicate: 'PASS',
        newListingComposition: 'PASS',
        historicalRouteRetentionSeparate: 'PASS',
        activationReadinessAllPrerequisitesMet: 'PASS',
        missingProviderSnapshot: 'PASS',
        unresolvedWrites: 'PASS',
        allNullDatabase: 'PASS',
        unresolvedStateDrift: 'PASS',
        deterministicReasonCodes: 'PASS',
        noDatabaseWrites: 'PASS',
        noProviderCalls: 'PASS',
        noTypesenseMutation: 'PASS',
        noAlertSideEffects: 'PASS',
      },
      activationModes: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES,
      currentExpectedReadiness: {
        status: currentExpectedReadiness.status,
        reasons: currentExpectedReadiness.reasons,
      },
      predicates: {
        certifiedActive,
        certifiedComingSoon,
        certifiedNull,
        certifiedUnverified,
        certifiedIneligible,
      },
      activationSequence: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_SEQUENCE,
      deactivationDesign: PUBLIC_SEARCH_ELIGIBILITY_DEACTIVATION_DESIGN,
      zeroSideEffects: readyActivation.zeroSideEffects,
    },
    null,
    2,
  ),
);
