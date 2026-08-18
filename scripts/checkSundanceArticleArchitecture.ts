import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  SUNDANCE_ARTICLE_ARCHITECTURE_FIXTURES,
  SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES,
} from '../lib/sundanceArticleArchitectureFixtures';
import {
  SUNDANCE_ARTICLE_INTERNAL_LINK_DESTINATIONS,
  SUNDANCE_ARTICLE_PARENT_PILLAR,
  SUNDANCE_ARTICLE_PROTECTED_BOUNDARIES,
  evaluateSundanceArticleArchitecture,
  type SundanceArticleArchitectureCandidate,
  type SundanceArticleArchitectureIssueCode,
  type SundanceArticleArchitectureRecord,
} from '../lib/sundanceArticleArchitecture';

function read(path: string): string {
  return fs.readFileSync(path, 'utf8');
}

function issueCodes(record: SundanceArticleArchitectureCandidate, peers: readonly SundanceArticleArchitectureCandidate[] = []) {
  return evaluateSundanceArticleArchitecture(record, peers).issues.map((item) => item.code);
}

function expectIssue(record: SundanceArticleArchitectureCandidate, code: SundanceArticleArchitectureIssueCode, peers: readonly SundanceArticleArchitectureCandidate[] = []) {
  assert.ok(issueCodes(record, peers).includes(code), `${record.stableArticleId} must reject with ${code}.`);
}

const architecture = Object.values(SUNDANCE_ARTICLE_ARCHITECTURE_FIXTURES);
const architectureSource = read('lib/sundanceArticleArchitecture.ts');
const fixtureSource = read('lib/sundanceArticleArchitectureFixtures.ts');
const lifecycleSource = read('lib/sundanceEditorialLifecycle.ts');
const routeSource = read('app/sundance-film-festival/page.tsx');
const sitemapSource = read('app/sitemap.ts');
const packageSource = read('package.json');

assert.equal(architecture.length, 7, 'Architecture must contain one valid abstract item for each required cluster.');
assert.deepEqual(
  new Set(architecture.map((item) => item.cluster)),
  new Set(['PLACE_GEOGRAPHY', 'SEASONAL_TEMPORARY_PERMANENT', 'RELOCATION_TRAVEL_PATTERN', 'PROPERTY_VERIFICATION', 'LOCAL_RULE_MUNICIPAL', 'PROFESSIONAL_PREPARATION', 'SOURCE_METHODOLOGY']),
  'Architecture must retain the finite seven-cluster taxonomy.',
);

for (const record of architecture) {
  const evaluation = evaluateSundanceArticleArchitecture(record, architecture);
  assert.equal(evaluation.valid, true, `${record.stableArticleId} must be a valid architecture-only record.`);
  assert.equal(evaluation.publicationEligible, false, 'Architecture must never create publication eligibility.');
  assert.equal(evaluation.indexabilityEligible, false, 'Architecture must never create indexability.');
  assert.equal(evaluation.sitemapEligible, false, 'Architecture must never create sitemap eligibility.');
  assert.equal(record.parentPillar, SUNDANCE_ARTICLE_PARENT_PILLAR, 'Architecture must bind to the Sundance pillar.');
  assert.equal(record.pillarRelationship, 'SUPPORTING_ARTICLE', 'Architecture must remain supporting-only.');
  assert.equal(record.publicationEffect, 'NONE', 'Architecture must have no publication effect.');
  assert.deepEqual(record.effects, { createsIndexability: false, createsRoute: false, createsSitemapMembership: false });
  assert.ok(record.internalLinkDestinations.every((destination) => SUNDANCE_ARTICLE_INTERNAL_LINK_DESTINATIONS.includes(destination)));
}

expectIssue(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES.duplicateIntent, 'DUPLICATE_CUSTOMER_INTENT', architecture);
expectIssue(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES.missingLifecycleBinding, 'LIFECYCLE_BINDING_INVALID');
expectIssue(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES.unknownRights, 'SOURCE_POSTURE_INCOMPATIBLE');
expectIssue(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES.staleSource, 'SOURCE_POSTURE_INCOMPATIBLE');
expectIssue(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES.prohibitedClaim, 'PROHIBITED_CLAIM');
expectIssue(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES.unpublishedLifecycleItem, 'LIFECYCLE_NOT_ELIGIBLE');
expectIssue(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES.correctionItem, 'LIFECYCLE_NOT_ELIGIBLE');
expectIssue(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES.retiredItem, 'LIFECYCLE_NOT_ELIGIBLE');
expectIssue(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES.indexabilityMismatch, 'EFFECT_NOT_NONE');
expectIssue(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES.sitemapImplicationAttempt, 'EFFECT_NOT_NONE');
expectIssue(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES.unsafeInternalLink, 'INTERNAL_LINK_DESTINATION_INVALID');

assert.deepEqual(SUNDANCE_ARTICLE_PROTECTED_BOUNDARIES, {
  articleContent: false,
  articleGeneration: false,
  articlePublication: false,
  articleRoute: false,
  databasePersistence: false,
  indexability: false,
  providerActivation: false,
  searchMutation: false,
  sitemapMembership: false,
});

for (const forbiddenImport of [
  "'./articles'",
  "'./content/generateNeighborhoodArticle'",
  "'./content/generateBuyerGuide'",
  "'./content/generateMarketArticle'",
  "'./content/publishArticle'",
  "'./content/scheduleContent'",
  "'./linking/getBlogLinks'",
  "'./schema/articleSchema'",
]) {
  assert.ok(!architectureSource.includes(forbiddenImport), `Architecture must not import legacy helper ${forbiddenImport}.`);
}

assert.ok(!fixtureSource.match(/ticket information|lodging inventory|rental return|market impact/i), 'Fixtures must not contain current-event or prohibited article prose.');
assert.match(lifecycleSource, /EDITORIAL_AEO_PROMINENCE_NOT_FACTUAL_AUTHORITY/, 'Lifecycle editorial-separation guard must remain canonical.');
assert.match(routeSource, /data-testid="sundance-editorial-authority-page"/, 'Existing Sundance pillar must remain the only route surface.');
assert.match(sitemapSource, /url\('\/sundance-film-festival'\)/, 'Existing Sundance pillar sitemap entry must remain unchanged.');
assert.match(packageSource, /check:sundance-article-architecture/, 'Package scripts must expose the architecture checker.');

console.log('SUNDANCE_ARTICLE_AEO_ARCHITECTURE_CHECK: PASS');
console.log(`fixtures=${architecture.length + Object.keys(SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES).length}`);
console.log('publication_effect=NONE');
console.log('route_indexability_sitemap=false');
