import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  certifyPublicSearchEligibilityDiscoveryParity,
  type PublicSearchEligibilityDiscoveryParityCertificationInput,
} from '../lib/mls/publicSearchEligibilityDiscoveryParityCertification.js';
import { PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES } from '../lib/mls/publicSearchEligibilityRuntimeContract.js';
import { PUBLIC_SEARCH_ELIGIBILITY_STATES } from '../lib/mls/publicSearchEligibilityStateContract.js';

type FixtureInputOverrides = Partial<Omit<PublicSearchEligibilityDiscoveryParityCertificationInput, 'runtimeInput' | 'plannedSemantics' | 'evidence' | 'certificationOnlyBoundary'>> & {
  runtimeInput?: Partial<PublicSearchEligibilityDiscoveryParityCertificationInput['runtimeInput']>;
  plannedSemantics?: Partial<PublicSearchEligibilityDiscoveryParityCertificationInput['plannedSemantics']>;
  evidence?: Partial<PublicSearchEligibilityDiscoveryParityCertificationInput['evidence']>;
  certificationOnlyBoundary?: Partial<PublicSearchEligibilityDiscoveryParityCertificationInput['certificationOnlyBoundary']>;
};

const zeroBoundary = {
  alertEventCreated: false,
  alertQueueCreated: false,
  databaseAccessPerformed: false,
  emailSent: false,
  providerCallPerformed: false,
  runtimeActivationPerformed: false,
  savedSearchMutationPerformed: false,
  searchMutationPerformed: false,
  typesenseMutationPerformed: false,
} as const;

const completeEvidence = {
  databaseFallbackPlanSupplied: true,
  newListingPlanSupplied: true,
  publicSearchPlanSupplied: true,
  savedSearchPlanSupplied: true,
  typesensePlanSupplied: true,
} as const;

function input(
  overrides: FixtureInputOverrides = {},
): PublicSearchEligibilityDiscoveryParityCertificationInput {
  const base: PublicSearchEligibilityDiscoveryParityCertificationInput = {
    certificationOnlyBoundary: zeroBoundary,
    evidence: completeEvidence,
    plannedSemantics: {
      databaseSearchFallbackEligible: true,
      newListingAlertCandidate: true,
      publicSearchDiscoveryEligible: true,
      savedSearchEligible: true,
      typesenseIndexInclusionEligible: true,
    },
    runtimeInput: {
      activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility,
      authoritativeStatus: 'Active',
      consentForAlert: true,
      duplicateAlertEvent: false,
      isPrivateExclusive: false,
      otherPublicReadRestriction: false,
      publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible,
      savedSearchMatch: true,
      sourceFreshForSavedSearch: true,
    },
  };

  return {
    ...base,
    ...overrides,
    certificationOnlyBoundary: { ...base.certificationOnlyBoundary, ...overrides.certificationOnlyBoundary },
    evidence: { ...base.evidence, ...overrides.evidence },
    plannedSemantics: { ...base.plannedSemantics, ...overrides.plannedSemantics },
    runtimeInput: { ...base.runtimeInput, ...overrides.runtimeInput },
  };
}

function certify(overrides: FixtureInputOverrides = {}) {
  return certifyPublicSearchEligibilityDiscoveryParity(input(overrides));
}

const aligned = certify();
assert.equal(aligned.classification, 'PARITY', 'fully aligned certified-eligible plan should certify parity');
assert.equal(aligned.sharedPredicate.publicSearchDiscoveryEligible, true, 'public Search discovery should use canonical predicate');
assert.equal(aligned.sharedPredicate.typesenseIndexInclusionEligible, true, 'Typesense inclusion should equal canonical predicate');
assert.equal(aligned.sharedPredicate.databaseSearchFallbackEligible, true, 'database fallback should equal canonical predicate');
assert.equal(aligned.savedSearchPredicate.savedSearchEligible, true, 'Saved Search should compose from canonical predicate and additional requirements');
assert.equal(aligned.savedSearchPredicate.newListingAlertCandidate, true, 'NEW_LISTING should compose from Saved Search requirements');

const unverified = certify({
  plannedSemantics: {
    databaseSearchFallbackEligible: false,
    newListingAlertCandidate: false,
    publicSearchDiscoveryEligible: false,
    savedSearchEligible: false,
    typesenseIndexInclusionEligible: false,
  },
  runtimeInput: { publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified },
});
assert.equal(unverified.classification, 'PARITY', 'PUBLIC_SCOPE_UNVERIFIED should fail closed with aligned false semantics');
assert.equal(unverified.canonicalDecision.reason, 'PUBLIC_SCOPE_UNVERIFIED_FAIL_CLOSED');

const ineligible = certify({
  plannedSemantics: {
    databaseSearchFallbackEligible: false,
    newListingAlertCandidate: false,
    publicSearchDiscoveryEligible: false,
    savedSearchEligible: false,
    typesenseIndexInclusionEligible: false,
  },
  runtimeInput: { publicSearchEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible },
});
assert.equal(ineligible.classification, 'PARITY', 'CERTIFIED_INELIGIBLE should fail closed with aligned false semantics');
assert.equal(ineligible.canonicalDecision.reason, 'CERTIFIED_INELIGIBLE_FAIL_CLOSED');

const nullCertified = certify({
  plannedSemantics: {
    databaseSearchFallbackEligible: false,
    newListingAlertCandidate: false,
    publicSearchDiscoveryEligible: false,
    savedSearchEligible: false,
    typesenseIndexInclusionEligible: false,
  },
  runtimeInput: { publicSearchEligibility: null },
});
assert.equal(nullCertified.classification, 'PARITY', 'NULL should fail closed in CERTIFIED_ELIGIBILITY mode');
assert.equal(nullCertified.canonicalDecision.reason, 'CERTIFIED_ELIGIBILITY_REQUIRED_NULL_FAIL_CLOSED');

const privacyBlocked = certify({
  plannedSemantics: {
    databaseSearchFallbackEligible: false,
    newListingAlertCandidate: false,
    publicSearchDiscoveryEligible: false,
    savedSearchEligible: false,
    typesenseIndexInclusionEligible: false,
  },
  runtimeInput: { isPrivateExclusive: true },
});
assert.equal(privacyBlocked.classification, 'PARITY', 'private-exclusive listing should remain blocked across discovery surfaces');
assert.equal(privacyBlocked.canonicalDecision.reason, 'CERTIFIED_ELIGIBLE_PRIVATE_EXCLUSIVE_BLOCKED');

assert.equal(
  certify({ plannedSemantics: { publicSearchDiscoveryEligible: false } }).classification,
  'DIVERGENCE',
  'public Search predicate divergence must be explicit',
);
assert.equal(
  certify({ plannedSemantics: { typesenseIndexInclusionEligible: false } }).mismatches[0]?.surface,
  'TYPESENSE_INDEX_INCLUSION',
  'Typesense inclusion divergence must identify the surface',
);
assert.equal(
  certify({ plannedSemantics: { databaseSearchFallbackEligible: false } }).mismatches[0]?.surface,
  'DATABASE_SEARCH_FALLBACK',
  'database fallback divergence must identify the surface',
);
assert.equal(
  certify({ plannedSemantics: { savedSearchEligible: false } }).mismatches[0]?.surface,
  'SAVED_SEARCH',
  'Saved Search divergence must identify the surface',
);

const comingSoon = certify({
  plannedSemantics: {
    newListingAlertCandidate: false,
    savedSearchEligible: false,
  },
  runtimeInput: { authoritativeStatus: 'Coming Soon' },
});
assert.equal(comingSoon.classification, 'PARITY', 'Coming Soon may be Search eligible but not Saved Search NEW_LISTING eligible');
assert.equal(comingSoon.canonicalDecision.publicSearchEligible, true);
assert.equal(comingSoon.canonicalDecision.newListingAlertCandidate, false);

for (const [label, runtimeInput] of [
  ['freshness', { sourceFreshForSavedSearch: false }],
  ['criteria-match', { savedSearchMatch: false }],
  ['consent', { consentForAlert: false }],
  ['dedup', { duplicateAlertEvent: true }],
] as const) {
  const result = certify({
    plannedSemantics: {
      newListingAlertCandidate: false,
      savedSearchEligible: false,
    },
    runtimeInput,
  });
  assert.equal(result.classification, 'PARITY', `Saved Search ${label} requirement should fail closed when absent`);
  assert.equal(result.canonicalDecision.publicSearchEligible, true, `Saved Search ${label} should not rewrite public discovery`);
  assert.equal(result.savedSearchPredicate.savedSearchEligible, false, `Saved Search ${label} should block Saved Search`);
}

const insufficient = certify({
  evidence: { typesensePlanSupplied: false },
  plannedSemantics: { typesenseIndexInclusionEligible: null },
});
assert.equal(insufficient.classification, 'INSUFFICIENT_EVIDENCE', 'missing planned surface evidence must not certify parity');
assert.equal(insufficient.reasons.includes('MISSING_TYPESENSE_PLAN'), true);

const deterministicA = certify();
const deterministicB = certify();
assert.deepEqual(deterministicA, deterministicB, 'identical certification input must be deterministic');

assert.equal(
  certify({ certificationOnlyBoundary: { runtimeActivationPerformed: true as false } }).reasons.includes('RUNTIME_ACTIVATION_ATTEMPTED'),
  true,
  'certification must not activate runtime behavior',
);
assert.equal(
  certify({ certificationOnlyBoundary: { searchMutationPerformed: true as false } }).reasons.includes('SEARCH_MUTATION_ATTEMPTED'),
  true,
  'certification must not mutate Search',
);
assert.equal(
  certify({ certificationOnlyBoundary: { typesenseMutationPerformed: true as false } }).reasons.includes('TYPESENSE_MUTATION_ATTEMPTED'),
  true,
  'certification must not mutate Typesense',
);
assert.equal(
  certify({ certificationOnlyBoundary: { savedSearchMutationPerformed: true as false } }).reasons.includes('SAVED_SEARCH_MUTATION_ATTEMPTED'),
  true,
  'certification must not mutate Saved Search',
);
assert.equal(
  certify({ certificationOnlyBoundary: { alertEventCreated: true as false } }).reasons.includes('ALERT_EVENT_ATTEMPTED'),
  true,
  'certification must not create alert events',
);
assert.equal(
  certify({ certificationOnlyBoundary: { alertQueueCreated: true as false } }).reasons.includes('ALERT_QUEUE_ATTEMPTED'),
  true,
  'certification must not create alert queue records',
);
assert.equal(
  certify({ certificationOnlyBoundary: { emailSent: true as false } }).reasons.includes('EMAIL_ATTEMPTED'),
  true,
  'certification must not send email',
);

const legacy = certify({
  runtimeInput: {
    activationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.legacy,
    publicSearchEligibility: null,
  },
});
assert.equal(legacy.classification, 'PARITY', 'legacy mode should preserve current public criteria without requiring eligibility state');
assert.equal(legacy.canonicalDecision.eligibilityStateRequiredForPublicDiscovery, false);

const runtimeSource = readFileSync(resolve(process.cwd(), 'lib/mls/publicSearchEligibilityDiscoveryParityCertification.ts'), 'utf8');
assert.match(runtimeSource, /evaluatePublicSearchEligibilityRuntime/, 'parity contract must compose the canonical runtime predicate');
for (const protectedPattern of [/\bfetch\s*\(/i, /\bprisma\s*\./i, /\bcreateClient\s*\(/i, /\bprocess\.env\b/i, /\bwriteFile\w*\s*\(/i, /\bhttps?\s*\.request\s*\(/i, /\btypesenseClient\b/i, /\balertQueue\b/i, /\bsendEmail\b/i]) {
  assert(!protectedPattern.test(runtimeSource), `parity contract must not reference protected systems: ${protectedPattern}`);
}

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_NO_DB_NO_PROVIDER_NO_TYPESENSE_NO_ALERT_SIDE_EFFECT',
      classification: 'PUBLIC_SEARCH_ELIGIBILITY_DISCOVERY_PARITY_CERTIFICATION_ARCHITECTURE_IMPLEMENTED_AND_LOCALLY_CERTIFIED',
      cases: {
        alignedCertifiedEligible: 'PASS',
        publicScopeUnverifiedFailClosed: 'PASS',
        certifiedIneligibleFailClosed: 'PASS',
        nullFailClosedCertifiedMode: 'PASS',
        certifiedEligiblePrivacyBlocked: 'PASS',
        searchPredicateDivergence: 'PASS',
        typesenseInclusionDivergence: 'PASS',
        databaseFallbackDivergence: 'PASS',
        savedSearchDivergence: 'PASS',
        savedSearchExactActiveRequirement: 'PASS',
        savedSearchFreshnessRequirement: 'PASS',
        savedSearchCriteriaMatchRequirement: 'PASS',
        savedSearchConsentRequirement: 'PASS',
        savedSearchDedupRequirement: 'PASS',
        insufficientEvidenceClassification: 'PASS',
        deterministicIdenticalInput: 'PASS',
        cannotActivateRuntime: 'PASS',
        cannotMutateSearch: 'PASS',
        cannotMutateTypesense: 'PASS',
        cannotCreateSavedSearchEvents: 'PASS',
        cannotCreateAlertsEmail: 'PASS',
        legacyVersusCertifiedMode: 'PASS',
      },
      parity: aligned,
      zeroSideEffects: aligned.zeroSideEffects,
    },
    null,
    2,
  ),
);
