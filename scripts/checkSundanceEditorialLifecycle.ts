import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  SUNDANCE_EDITORIAL_ALLOWED_TRANSITIONS,
  SUNDANCE_EDITORIAL_GOVERNANCE_SEPARATIONS,
  SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES,
  SUNDANCE_EDITORIAL_PARENT_PILLAR,
  SUNDANCE_EDITORIAL_PROTECTED_BOUNDARIES,
  evaluateSundanceEditorialLifecycle,
  evaluateSundanceEditorialTransition,
  type SundanceEditorialLifecycleIssueCode,
  type SundanceEditorialLifecycleItem,
  type SundanceEditorialLifecycleState,
} from '../lib/sundanceEditorialLifecycle';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function issueCodes(item: SundanceEditorialLifecycleItem): readonly SundanceEditorialLifecycleIssueCode[] {
  return evaluateSundanceEditorialLifecycle(item).issues.map((issue) => issue.code);
}

function assertIncludes<T>(values: readonly T[], expected: T, message: string): void {
  assert.ok(values.includes(expected), message);
}

function transitionIssues(from: SundanceEditorialLifecycleState, to: SundanceEditorialLifecycleState) {
  return evaluateSundanceEditorialTransition({
    from,
    to,
    transitionId: 'TRANSITION-CHECK-001',
    transitionedAt: '2026-08-18T15:00:00.000Z',
    transitionedBy: 'PROJECT_ATLAS_CHECKER',
    reason: 'Deterministic lifecycle transition check.',
  });
}

const lifecycleSource = read('lib/sundanceEditorialLifecycle.ts');
const routeSource = read('app/sundance-film-festival/page.tsx');
const sitemapSource = read('app/sitemap.ts');
const articlesSource = read('lib/articles.ts');
const packageSource = read('package.json');

const fixtureEntries = Object.entries(SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES);
const expectedFixtureKeys = [
  'orientationDurable',
  'sourceReviewRequired',
  'freshnessReviewDue',
  'correctionRequired',
  'retired',
  'blockedProhibitedClaim',
] as const;

for (const fixtureKey of expectedFixtureKeys) {
  assert.ok(fixtureKey in SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES, `Missing abstract fixture: ${fixtureKey}.`);
}

const primaryPublicationPath: readonly SundanceEditorialLifecycleState[] = [
  'DRAFT',
  'SOURCE_REVIEW_REQUIRED',
  'EDITORIAL_REVIEW_REQUIRED',
  'APPROVED_FOR_PUBLICATION',
  'PUBLISHED',
];

for (let index = 0; index < primaryPublicationPath.length - 1; index += 1) {
  const from = primaryPublicationPath[index];
  const to = primaryPublicationPath[index + 1];
  assert.equal(transitionIssues(from, to).length, 0, `${from} -> ${to} must be allowed.`);
}

for (const to of ['FRESHNESS_REVIEW_DUE', 'CORRECTION_REQUIRED', 'RETIRED'] as const) {
  assert.equal(transitionIssues('PUBLISHED', to).length, 0, `PUBLISHED -> ${to} must be allowed.`);
}

for (const to of [
  'SOURCE_REVIEW_REQUIRED',
  'CORRECTION_REQUIRED',
  'RETIRED',
  'BLOCKED_REQUIRES_EXECUTIVE_OR_SPECIALIST_REVIEW',
] as const) {
  assert.equal(transitionIssues('FRESHNESS_REVIEW_DUE', to).length, 0, `FRESHNESS_REVIEW_DUE -> ${to} must be allowed.`);
}

assertIncludes(
  transitionIssues('DRAFT', 'PUBLISHED').map((item) => item.code),
  'SOURCE_REVIEW_BYPASS',
  'Draft publication must be rejected as a source-review bypass.',
);
assertIncludes(
  transitionIssues('SOURCE_REVIEW_REQUIRED', 'PUBLISHED').map((item) => item.code),
  'EDITORIAL_REVIEW_BYPASS',
  'Source review cannot bypass editorial review.',
);
assertIncludes(
  evaluateSundanceEditorialTransition({
    from: 'EDITORIAL_REVIEW_REQUIRED',
    to: 'APPROVED_FOR_PUBLICATION',
    transitionId: '',
    transitionedAt: '',
    transitionedBy: '',
    reason: '',
  }).map((item) => item.code),
  'AUDIT_METADATA_REQUIRED',
  'Transition audit metadata must be mandatory.',
);
assert.equal(SUNDANCE_EDITORIAL_ALLOWED_TRANSITIONS.RETIRED.length, 0, 'Retired records must not silently reactivate.');
assertIncludes(
  transitionIssues('RETIRED', 'SOURCE_REVIEW_REQUIRED').map((item) => item.code),
  'RETIRED_REACTIVATION_FORBIDDEN',
  'Retired reactivation must be explicitly forbidden.',
);

const orientation = SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES.orientationDurable;
const orientationEvaluation = evaluateSundanceEditorialLifecycle(orientation);
assert.equal(orientationEvaluation.valid, true, 'Durable abstract orientation fixture must satisfy the lifecycle contract.');
assert.equal(orientationEvaluation.publicEligible, true, 'Only the fully governed published fixture may be public eligible.');
assert.equal(orientationEvaluation.indexableEligible, true, 'Only the fully governed published fixture may be indexable.');

for (const [key, fixture] of fixtureEntries) {
  assert.equal(fixture.parentPillar, SUNDANCE_EDITORIAL_PARENT_PILLAR, `${key} must remain under the Sundance pillar.`);
  assert.equal(fixture.governedGeographicFact, false, `${key} cannot become governed geography.`);
  assert.equal(fixture.geographicAuthorityState, 'EDITORIAL_ONLY', `${key} must remain editorial-only.`);

  if (key !== 'orientationDurable') {
    const evaluation = evaluateSundanceEditorialLifecycle(fixture);
    assert.equal(evaluation.publicEligible, false, `${key} must not be public eligible.`);
    assert.equal(evaluation.indexableEligible, false, `${key} must not be indexable.`);
  }
}

const approvedNotPublished: SundanceEditorialLifecycleItem = {
  ...orientation,
  stableId: 'SUNDANCE-EDITORIAL-APPROVED-NOT-PUBLISHED',
  lifecycleState: 'APPROVED_FOR_PUBLICATION',
  publicationState: 'PUBLICATION_ELIGIBLE',
  indexabilityState: 'NOINDEX',
  publicationAuthorization: { authorized: false, authorizationId: null, authorizedAt: null },
  sitemapEligible: false,
};
const approvedEvaluation = evaluateSundanceEditorialLifecycle(approvedNotPublished);
assert.equal(approvedEvaluation.publicEligible, false, 'Approval must not imply publication.');
assert.equal(approvedEvaluation.indexableEligible, false, 'Approval must not imply indexability.');

const unresolvedRights: SundanceEditorialLifecycleItem = {
  ...orientation,
  stableId: 'SUNDANCE-EDITORIAL-UNRESOLVED-RIGHTS',
  rightsPosture: 'UNKNOWN',
};
assertIncludes(issueCodes(unresolvedRights), 'RIGHTS_NOT_VERIFIED', 'Unknown rights must fail closed.');

const stalePublished: SundanceEditorialLifecycleItem = {
  ...orientation,
  stableId: 'SUNDANCE-EDITORIAL-STALE-PUBLISHED',
  freshnessPosture: 'STALE_VERIFICATION',
};
assertIncludes(issueCodes(stalePublished), 'FRESHNESS_NOT_VERIFIED', 'Stale published content must fail closed.');

const unboundedTimeSensitive: SundanceEditorialLifecycleItem = {
  ...orientation,
  stableId: 'SUNDANCE-EDITORIAL-UNBOUNDED-TIME-SENSITIVE',
  editorialFactualClass: 'SOURCE_BACKED_FACTUAL_CONTEXT',
  freshnessPosture: 'VERIFIED_CURRENT',
  effectiveFrom: null,
  effectiveTo: null,
};
assertIncludes(issueCodes(unboundedTimeSensitive), 'TIME_BOUNDS_REQUIRED', 'Time-sensitive facts require effective bounds.');

assertIncludes(
  issueCodes(SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES.blockedProhibitedClaim),
  'PROHIBITED_CLAIM',
  'Structured yield or commercial claims must be rejected.',
);

const blockedPublicationAttempt: SundanceEditorialLifecycleItem = {
  ...SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES.blockedProhibitedClaim,
  stableId: 'SUNDANCE-EDITORIAL-BLOCKED-PUBLICATION-ATTEMPT',
  publicationState: 'PUBLISHED',
  indexabilityState: 'INDEXABLE',
  sitemapEligible: true,
};
assertIncludes(
  issueCodes(blockedPublicationAttempt),
  'BLOCKED_PUBLICATION_FORBIDDEN',
  'Blocked material must reject publication and indexability attempts.',
);

const correctionPublicationAttempt: SundanceEditorialLifecycleItem = {
  ...SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES.correctionRequired,
  stableId: 'SUNDANCE-EDITORIAL-CORRECTION-PUBLICATION-ATTEMPT',
  publicationState: 'PUBLISHED',
  indexabilityState: 'INDEXABLE',
};
assertIncludes(
  issueCodes(correctionPublicationAttempt),
  'CORRECTION_REQUIRES_PUBLIC_RELIANCE_SUSPENSION',
  'Correction-required material must suspend public reliance.',
);

const limitationTextIsNotAClaim: SundanceEditorialLifecycleItem = {
  ...orientation,
  stableId: 'SUNDANCE-EDITORIAL-LIMITATION-TEXT',
  publicLimitationText:
    'No yield, Festival Multiplier, appreciation, market impact, rental return, property ranking, suitability, ticketing, booking, or lodging inventory claim is authorized.',
};
assert.ok(
  !issueCodes(limitationTextIsNotAClaim).includes('PROHIBITED_CLAIM'),
  'Explicit limitation text must not be misclassified as a prohibited claim.',
);

const editorialGeographyViolation: SundanceEditorialLifecycleItem = {
  ...orientation,
  stableId: 'SUNDANCE-EDITORIAL-GEOGRAPHY-VIOLATION',
  governedGeographicFact: true,
};
assertIncludes(
  issueCodes(editorialGeographyViolation),
  'EDITORIAL_GEOGRAPHY_CONVERSION_FORBIDDEN',
  'Editorial records must not become governed geographic facts.',
);

const sitemapWithoutAuthority: SundanceEditorialLifecycleItem = {
  ...SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES.sourceReviewRequired,
  stableId: 'SUNDANCE-EDITORIAL-SITEMAP-WITHOUT-AUTHORITY',
  sitemapEligible: true,
};
assertIncludes(
  issueCodes(sitemapWithoutAuthority),
  'SITEMAP_NOT_PUBLICATION_AUTHORITY',
  'Sitemap presence must not create publication authority.',
);

for (const expected of [
  'SOURCE_IDENTITY_NOT_RIGHTS_NOT_PUBLICATION',
  'SOURCE_QUALITY_NOT_PUBLICATION',
  'APPROVAL_NOT_PUBLICATION',
  'PUBLICATION_NOT_GOVERNED_GEOGRAPHIC_FACT',
  'EDITORIAL_AEO_PROMINENCE_NOT_FACTUAL_AUTHORITY',
] as const) {
  assertIncludes(SUNDANCE_EDITORIAL_GOVERNANCE_SEPARATIONS, expected, `Missing governance separation: ${expected}.`);
}

assert.ok(
  Object.values(SUNDANCE_EDITORIAL_PROTECTED_BOUNDARIES).every((value) => value === false),
  'The lifecycle foundation must activate no protected system.',
);
assert.match(routeSource, /data-testid="sundance-editorial-authority-page"/, 'The existing Sundance pillar must remain present.');
assert.match(routeSource, /data-editorial-authority-booking="false"/, 'The Sundance route must continue to block booking behavior.');
assert.match(routeSource, /data-editorial-authority-market-impact-claims="false"/, 'The route must continue to block market-impact claims.');
assert.match(sitemapSource, /url\('\/sundance-film-festival'\)/, 'The existing parent pillar must remain in the sitemap.');
assert.ok(!articlesSource.includes('orientation-durable'), 'Abstract lifecycle fixtures must not create article records.');
assert.match(packageSource, /check:sundance-editorial-lifecycle/, 'Package scripts must expose the deterministic lifecycle checker.');

for (const forbiddenRuntimeCoupling of [
  'fetch(',
  'prisma',
  'sourceQualityOperationalManifestData',
  'getReieSourceRegistry',
  'app/sitemap',
  'app/articles',
]) {
  assert.ok(
    !lifecycleSource.includes(forbiddenRuntimeCoupling),
    `Lifecycle contract must not introduce runtime or activation coupling: ${forbiddenRuntimeCoupling}.`,
  );
}

console.log('SUNDANCE_EDITORIAL_LIFECYCLE_CHECK: PASS');
console.log(`fixtures=${fixtureEntries.length}`);
console.log(`parent_pillar=${SUNDANCE_EDITORIAL_PARENT_PILLAR}`);
console.log('publication_authority=EXPLICIT_FAIL_CLOSED');
console.log('article_generation=false');
console.log('article_publication=false');
console.log('runtime_activation=false');
