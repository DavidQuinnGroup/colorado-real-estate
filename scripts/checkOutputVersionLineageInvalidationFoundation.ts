import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  adaptPostLaunchReviewToOutputVersion,
  adaptSellerDecisionBriefV2ToOutputVersion,
  adaptSellerPricingToOutputVersion,
  adaptSellerUpdateToOutputVersion,
  atlasOutputFingerprint,
  ATLAS_OUTPUT_DEPENDENCY_TYPES,
  ATLAS_OUTPUT_DIFF_CLASSES,
  ATLAS_OUTPUT_DIFF_SEVERITIES,
  ATLAS_OUTPUT_INVALIDATION_STATES,
  ATLAS_OUTPUT_LINEAGE_REASON_CODES,
  ATLAS_OUTPUT_REUSE_CLASSIFICATIONS,
  ATLAS_OUTPUT_SOURCE_SNAPSHOT_STATES,
  ATLAS_OUTPUT_UPSTREAM_CHANGE_TYPES,
  ATLAS_OUTPUT_VERSION_CREATION_REASONS,
  ATLAS_OUTPUT_VERSION_LIFECYCLE_STATES,
  buildOutputVersionLineageInvalidationFoundation,
  evaluateOutputInvalidation,
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_NEXT_GATE,
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_PERSISTENCE_POSITION,
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_PRODUCT_STATUS,
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_STATUS,
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION,
  outputVersionTransitionAllowed,
  reviewedOutputRequiresSuccessor,
} from '../lib/outputVersionLineageInvalidationFoundation';
import {
  SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_VERSION,
  SELLER_POST_LAUNCH_REVIEW_VERSION,
  SELLER_UPDATE_PRODUCT_VERSION,
} from '../lib/sellerPostLaunchCurrentContextReview';
import {
  SELLER_PRICING_FINANCIAL_LINK_VERSION,
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION,
  SELLER_PRICING_SCENARIO_VERSION,
} from '../lib/sellerPricingPositioningDecisionFramework';
import { SELLER_DECISION_BRIEF_V2_VERSION } from '../lib/sellerDecisionBriefV2';
import { AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION } from '../lib/agentCurrentSnapshotComparison';
import { CURRENT_COMPETING_LISTING_CONTEXT_VERSION } from '../lib/agentCurrentCompetingListingContext';
import { REIE_FINANCIAL_DECISION_PREPARATION_VERSION } from '../lib/financialDecisionPreparationContract';

const contractSource = readFileSync('lib/outputVersionLineageInvalidationFoundation.ts', 'utf8');
const componentSource = readFileSync('components/agent/SellerDecisionBriefCompositionPreview.tsx', 'utf8');
const reportSource = readFileSync('docs/project-atlas/executive-library/OUTPUT-VERSION-LINEAGE-AND-INVALIDATION-FOUNDATION-V1-CERTIFICATION.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_STATUS, 'OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1_CERTIFIED_WITH_HOLDS');
assert.equal(OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION, 'OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1');
assert.equal(OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_NEXT_GATE, 'READY_FOR_PRINT_PDF_OUTPUT_PRODUCT_ARCHITECTURE');
assert.equal(
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_PRODUCT_STATUS,
  'OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1_CERTIFIED_DOMAIN_ONLY_PRINT_PDF_PERSISTENCE_DELIVERY_HELD',
);
assert.equal(OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_PERSISTENCE_POSITION, 'DOMAIN_ONLY_SUFFICIENT_FOR_CURRENT_PHASE');

const foundation = buildOutputVersionLineageInvalidationFoundation();
assert.equal(foundation.status, OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_STATUS);
assert.equal(foundation.version, OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION);
assert.equal(foundation.route, '/agent/prepare/seller/presentation');
assert.equal(foundation.outputVersions.length, 11);
assert.equal(foundation.sectionInstances.length, 6);
assert.equal(foundation.moduleInstances.length, 9);
assert.equal(foundation.sourceSnapshots.length, 7);
assert.equal(foundation.evidenceSnapshots.length, 10);
assert.equal(foundation.dependencies.length, 15);
assert.equal(foundation.invalidationEvaluations.length, 12);
assert.equal(foundation.diffs.length, 7);
assert.equal(foundation.sellerVersionChain.length, 10);
assert.equal(foundation.pricingLineage.length, 8);
assert.equal(foundation.postLaunchLineage.length, 10);
assert.equal(foundation.financialInvalidations.length, 4);
assert.equal(foundation.reuseRules.length, 9);
assert.equal(foundation.subjectAudienceTransform.length, 10);
assert.equal(foundation.agentVersionUi.length, 10);
assert.equal(foundation.dependencyWarnings.length, 7);
assert.equal(foundation.fingerprints.length, 5);
assert.equal(foundation.reproducibilityInputs.length, 23);
assert.equal(foundation.persistenceMapping.length, 10);
assert(foundation.questionCoverage.length >= 28);
assert.equal(foundation.nextGateRanking.length, 4);

for (const state of ATLAS_OUTPUT_VERSION_LIFECYCLE_STATES) assert(contractSource.includes(state), `missing lifecycle state ${state}`);
for (const reason of ATLAS_OUTPUT_LINEAGE_REASON_CODES) assert(contractSource.includes(reason), `missing lineage reason ${reason}`);
for (const reason of ATLAS_OUTPUT_VERSION_CREATION_REASONS) assert(contractSource.includes(reason), `missing creation reason ${reason}`);
for (const dependencyType of ATLAS_OUTPUT_DEPENDENCY_TYPES) {
  assert(foundation.dependencies.some((dependency) => dependency.dependencyType === dependencyType), `missing dependency type ${dependencyType}`);
}
for (const state of ATLAS_OUTPUT_INVALIDATION_STATES) {
  assert(foundation.dependencies.some((dependency) => dependency.currentState === state || dependency.invalidationPolicy === state) || foundation.invalidationEvaluations.some((evaluation) => evaluation.resultingState === state), `missing invalidation state ${state}`);
}
for (const diffClass of ATLAS_OUTPUT_DIFF_CLASSES) {
  assert(foundation.diffs.some((diff) => diff.diffClass === diffClass) || contractSource.includes(diffClass), `missing diff class ${diffClass}`);
}
for (const severity of ATLAS_OUTPUT_DIFF_SEVERITIES) {
  assert(foundation.diffs.some((diff) => diff.severity === severity) || contractSource.includes(severity), `missing diff severity ${severity}`);
}
for (const changeType of ATLAS_OUTPUT_UPSTREAM_CHANGE_TYPES) {
  assert.equal(foundation.invalidationEvaluations.some((evaluation) => evaluation.upstreamChange === changeType), true, `missing upstream change ${changeType}`);
}
for (const reuse of ATLAS_OUTPUT_REUSE_CLASSIFICATIONS) {
  assert(contractSource.includes(reuse), `missing reuse classification ${reuse}`);
}
for (const state of ATLAS_OUTPUT_SOURCE_SNAPSHOT_STATES) {
  assert(foundation.sourceSnapshots.some((snapshot) => snapshot.state === state), `missing source snapshot state ${state}`);
}

assert.equal(outputVersionTransitionAllowed('DRAFT', 'COMPOSED'), true);
assert.equal(outputVersionTransitionAllowed('COMPOSED', 'AGENT_REVIEW_REQUIRED'), true);
assert.equal(outputVersionTransitionAllowed('AGENT_REVIEW_REQUIRED', 'AGENT_REVIEWED'), true);
assert.equal(outputVersionTransitionAllowed('AGENT_REVIEWED', 'READY_FOR_SELLER_REVIEW'), true);
assert.equal(outputVersionTransitionAllowed('READY_FOR_SELLER_REVIEW', 'SELLER_REVIEWED_OR_PRESENTED'), true);
assert.equal(outputVersionTransitionAllowed('SELLER_REVIEWED_OR_PRESENTED', 'SUPERSEDED'), true);
assert.equal(outputVersionTransitionAllowed('SUPERSEDED', 'ARCHIVED_HISTORICAL_REFERENCE'), true);
assert.equal(outputVersionTransitionAllowed('DRAFT', 'SELLER_REVIEWED_OR_PRESENTED'), false);

const currentVersion = foundation.outputVersions.find((version) => version.id === 'seller-update-current-version');
assert(currentVersion);
assert.equal(currentVersion.lifecycleState, 'READY_FOR_SELLER_REVIEW');
assert.equal(currentVersion.contentVersion, SELLER_UPDATE_PRODUCT_VERSION);
assert.equal(currentVersion.priorReviewedVersion, 'seller-update-superseded-version');
assert.equal(currentVersion.supersedesVersion, 'seller-update-superseded-version');
assert.equal(currentVersion.evidenceSnapshotReferences[0]?.id, 'evidence-snapshot-seller-update-current');
assert.equal(currentVersion.pricingReferences[0]?.version, SELLER_PRICING_SCENARIO_VERSION);
assert.equal(currentVersion.postLaunchReferences[0]?.version, SELLER_POST_LAUNCH_REVIEW_VERSION);
assert.equal(currentVersion.sellerClientDecisionReferences[0]?.version, 'SELLER_POST_LAUNCH_SELLER_DECISION_V1');
assert.equal(reviewedOutputRequiresSuccessor(currentVersion, true), true);
assert.equal(reviewedOutputRequiresSuccessor(currentVersion, false), false);

assert.equal(adaptSellerDecisionBriefV2ToOutputVersion()?.contentVersion, SELLER_DECISION_BRIEF_V2_VERSION);
assert.equal(adaptSellerPricingToOutputVersion()?.contentVersion, SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION);
assert.equal(adaptPostLaunchReviewToOutputVersion()?.contentVersion, SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_VERSION);
assert.equal(adaptSellerUpdateToOutputVersion()?.contentVersion, SELLER_UPDATE_PRODUCT_VERSION);

assert.equal(evaluateOutputInvalidation('MARKET_REFRESH').resultingState, 'REFRESH_RECOMMENDED');
assert.equal(evaluateOutputInvalidation('SEARCH_BAND_CHANGE').resultingState, 'RECOMPUTE_REQUIRED');
assert.equal(evaluateOutputInvalidation('PRICE_ASSUMPTION_CHANGE').recompute, true);
assert.equal(evaluateOutputInvalidation('FINANCIAL_CONSTRAINT_CHANGE').dependency, 'FINANCIAL_DEPENDENCY');
assert.equal(evaluateOutputInvalidation('RIGHTS_CHANGE').resultingState, 'RIGHTS_REVIEW_REQUIRED');
assert.equal(evaluateOutputInvalidation('FRESHNESS_CHANGE').resultingState, 'FRESHNESS_REVIEW_REQUIRED');
assert.equal(evaluateOutputInvalidation('PRESENTATION_ONLY_CHANGE').recompose, false);

assert.equal(
  atlasOutputFingerprint('OUTPUT_CONTENT_FINGERPRINT', { a: 1, b: ['x', 'y'] }),
  atlasOutputFingerprint('OUTPUT_CONTENT_FINGERPRINT', { b: ['x', 'y'], a: 1 }),
  'fingerprint must be stable across object key order',
);
assert.notEqual(
  atlasOutputFingerprint('OUTPUT_CONTENT_FINGERPRINT', { content: 'same', render: 'a' }),
  atlasOutputFingerprint('OUTPUT_CONTENT_FINGERPRINT', { content: 'changed', render: 'a' }),
  'material content changes must change fingerprint',
);
assert.equal(
  atlasOutputFingerprint('OUTPUT_CONTENT_FINGERPRINT', { content: 'same' }),
  atlasOutputFingerprint('OUTPUT_CONTENT_FINGERPRINT', { content: 'same' }),
  'render-only exclusions can preserve content fingerprint when inputs omit render detail',
);

for (const id of [
  'dep-property-fact-module',
  'dep-market-module',
  'dep-market-pricing-context',
  'dep-competition-pricing-scenario',
  'dep-search-band-price-option',
  'dep-agent-narrative-output',
  'dep-recommendation-decision',
  'dep-pricing-financial-link',
  'dep-post-launch-seller-update',
  'dep-rights-output-module',
  'dep-freshness-output-module',
]) {
  assert(foundation.dependencies.some((dependency) => dependency.id === id), `missing dependency ${id}`);
}

for (const token of [
  SELLER_DECISION_BRIEF_V2_VERSION,
  SELLER_PRICING_SCENARIO_VERSION,
  SELLER_PRICING_FINANCIAL_LINK_VERSION,
  SELLER_POST_LAUNCH_REVIEW_VERSION,
  SELLER_UPDATE_PRODUCT_VERSION,
  AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION,
  CURRENT_COMPETING_LISTING_CONTEXT_VERSION,
  REIE_FINANCIAL_DECISION_PREPARATION_VERSION,
]) {
  assert(JSON.stringify(foundation).includes(token), `fixture missing version token ${token}`);
}

for (const token of [
  'data-testid="output-version-lineage-invalidation-foundation"',
  'data-testid="output-version-current-badge"',
  'data-testid="output-version-history-panel"',
  'data-testid="output-version-compare-to-prior"',
  'data-testid="output-version-diff-summary"',
  'data-testid="output-version-dependency-warnings"',
  'data-testid="output-version-successor-actions"',
  'data-testid="output-version-reuse-rules"',
  'data-testid="output-version-render-seam"',
  'data-testid="output-version-persistence-seam"',
  'OutputVersionBadge',
  'OutputVersionHistory',
  'OutputVersionDiffSummary',
  'OutputDependencyWarnings',
  'OutputRenderVersionSeam',
  'OutputPersistenceSeam',
  'Output version',
]) {
  assert(componentSource.includes(token), `UI missing token ${token}`);
}

for (const token of [
  'OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1_CERTIFIED_WITH_HOLDS',
  'OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1',
  'READY_FOR_PRINT_PDF_OUTPUT_PRODUCT_ARCHITECTURE',
  'DOMAIN_ONLY_SUFFICIENT_FOR_CURRENT_PHASE',
  'OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1_CERTIFIED_DOMAIN_ONLY_PRINT_PDF_PERSISTENCE_DELIVERY_HELD',
]) {
  assert(reportSource.includes(token), `certification report missing token ${token}`);
}

for (const [boundary, value] of Object.entries(foundation.protectedBoundaries)) {
  assert.equal(value, false, `protected boundary ${boundary} must remain false`);
}

for (const forbidden of [
  'PrismaClient',
  'prisma.',
  'supabase.',
  'typesense.',
  'fetch(',
  'MLS_GRID_TOKEN',
  'DATABASE_URL',
  'sendEmail',
  'resend',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.share',
]) {
  assert.equal(contractSource.includes(forbidden), false, `output version foundation must not include runtime token ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:output-version-lineage-invalidation-foundation'],
  'jiti scripts/checkOutputVersionLineageInvalidationFoundation.ts',
);
assert.deepEqual(buildOutputVersionLineageInvalidationFoundation(), foundation, 'foundation fixture must be deterministic');

console.log('OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_CHECK: PASS');
