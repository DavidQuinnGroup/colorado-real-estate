import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  buildMarketNewsletterAgentReviewPackage,
  getSupportedMarketNewsletterPackageCities,
  MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_STATUS,
  MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG,
  MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_VERSION,
} from '../lib/content/marketNewsletterPackage.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function flagTypes(packageUnderReview: ReturnType<typeof buildMarketNewsletterAgentReviewPackage>) {
  return new Set(packageUnderReview.reviewFlags.map((flag) => flag.type));
}

const helper = read('lib/content/marketNewsletterPackage.ts');
const adminRoute = read('app/admin/market-newsletter-package/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

const boulderPackage = buildMarketNewsletterAgentReviewPackage({
  geographySlug: MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG,
  generatedAt: '2026-08-13T00:00:00.000Z',
});
const boulderPackageAgain = buildMarketNewsletterAgentReviewPackage({
  geographySlug: MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG,
  generatedAt: '2026-08-13T00:00:00.000Z',
});

assert.equal(MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_STATUS, 'RECURRING_MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_MVV');
assert.equal(MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_VERSION, '1.0.0');
assert.equal(MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG, 'boulder-co-housing-market');
assert.deepEqual(getSupportedMarketNewsletterPackageCities().map((city) => city.marketSlug), ['boulder-co-housing-market']);

assert.deepEqual(boulderPackage, boulderPackageAgain, 'Package output must be deterministic for identical inputs.');
assert.equal(boulderPackage.status, 'READY_FOR_AGENT_REVIEW');
assert.equal(boulderPackage.geography.cityName, 'Boulder');
assert.equal(boulderPackage.geography.supported, true);
assert.equal(boulderPackage.customerCommunicationAuthorized, false);
assert.equal(boulderPackage.automaticPublicationAuthorized, false);
assert.equal(boulderPackage.emailSendingAuthorized, false);
assert.equal(boulderPackage.schedulerAuthorized, false);
assert.equal(boulderPackage.providerDependency, false);
assert.equal(boulderPackage.writeSideEffects, false);
assert.equal(boulderPackage.marketSnapshot.metrics.length, 6);
assert.equal(boulderPackage.marketSnapshot.chartReadyData.length, 4);
assert(boulderPackage.sourceReferences.length >= 6, 'Package must expose source references.');
assert(boulderPackage.agentTalkingPointInputs.length >= 4, 'Package must expose talking-point inputs.');
assert(boulderPackage.customerEducationInputs.length >= 4, 'Package must expose customer-education inputs.');
assert(boulderPackage.editorialChecklist.length >= 5, 'Package must expose editorial checklist.');

const normalFlags = flagTypes(boulderPackage);
assert(normalFlags.has('INSUFFICIENT_COMPARISON_PERIOD'), 'Package must flag insufficient comparison period.');
assert(normalFlags.has('UNSUPPORTED_METRIC'), 'Package must flag unsupported omitted metrics.');
assert(normalFlags.has('MANUAL_VERIFICATION_NEEDED'), 'Package must require human review.');

const inventoryMetric = boulderPackage.marketSnapshot.metrics.find((metric) => metric.label === 'Active inventory signal');
assert(inventoryMetric, 'Package must include active inventory signal.');
assert.equal(inventoryMetric.value, '58');
assert.equal(inventoryMetric.classification, 'FACT');

const postureMetric = boulderPackage.marketSnapshot.metrics.find((metric) => metric.label === 'Market posture');
assert(postureMetric, 'Package must include derived market posture.');
assert.equal(postureMetric.value, 'Strong seller pressure');
assert.equal(postureMetric.classification, 'DERIVED_METRIC');

assert.equal(boulderPackage.periodComparison.supported, false);
assert.match(boulderPackage.periodComparison.summary, /intentionally omitted/i);

const unsupportedPackage = buildMarketNewsletterAgentReviewPackage({
  geographySlug: 'denver-co-housing-market',
  generatedAt: '2026-08-13T00:00:00.000Z',
});
assert.equal(unsupportedPackage.status, 'FAIL_CLOSED');
assert(flagTypes(unsupportedPackage).has('UNSUPPORTED_GEOGRAPHY'), 'Unsupported geography must fail closed.');
assert.equal(unsupportedPackage.marketSnapshot.metrics.length, 0);

const invalidPeriodPackage = buildMarketNewsletterAgentReviewPackage({
  geographySlug: MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG,
  generatedAt: '2026-08-13T00:00:00.000Z',
  reportingPeriod: {
    id: 'invalid',
    label: 'Invalid period',
    startsAt: '2026-09-30',
    endsAt: '2026-09-01',
  },
});
assert.equal(invalidPeriodPackage.status, 'FAIL_CLOSED');
assert(flagTypes(invalidPeriodPackage).has('INVALID_PERIOD'), 'Invalid period must fail closed.');

const missingEvidencePackage = buildMarketNewsletterAgentReviewPackage({
  geographySlug: MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG,
  generatedAt: '2026-08-13T00:00:00.000Z',
  evidenceScenario: 'MISSING_MARKET_EVIDENCE',
});
assert.equal(missingEvidencePackage.status, 'FAIL_CLOSED');
assert(flagTypes(missingEvidencePackage).has('MISSING_EVIDENCE'), 'Missing evidence must fail closed.');

const staleEvidencePackage = buildMarketNewsletterAgentReviewPackage({
  geographySlug: MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG,
  generatedAt: '2026-08-13T00:00:00.000Z',
  evidenceScenario: 'STALE_SOURCE_EVIDENCE',
});
assert(flagTypes(staleEvidencePackage).has('STALE_EVIDENCE'), 'Stale evidence posture must be represented.');

const conflictPackage = buildMarketNewsletterAgentReviewPackage({
  geographySlug: MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG,
  generatedAt: '2026-08-13T00:00:00.000Z',
  evidenceScenario: 'SOURCE_CONFLICT',
});
assert(flagTypes(conflictPackage).has('SOURCE_CONFLICT'), 'Conflict posture must be represented.');

for (const marker of [
  'data-testid="market-newsletter-agent-review-package"',
  'data-market-newsletter-agent-review="true"',
  'data-market-newsletter-package-email="false"',
  'data-market-newsletter-package-scheduler="false"',
  'data-market-newsletter-package-customer-communication="false"',
  'data-market-newsletter-package-provider-dependency="false"',
  'data-market-newsletter-package-write-side-effects="false"',
  'Market Snapshot',
  'Review Flags',
  'Agent Talking-Point Inputs',
  'Customer-Education Inputs',
  'Source / Freshness References',
  'Human Judgment Boundary',
]) {
  assertIncludes(adminRoute, marker, `Admin preview route must include ${marker}.`);
}

for (const required of [
  'buildCityMarketExperience',
  'buildCityMarketProduct3Experience',
  'getPublicSourceRegistryRecords',
  'articles',
  'neighborhoods',
  'getCityByMarketSlug',
]) {
  assertIncludes(helper, required, `Package helper must reuse ${required}.`);
}

for (const forbidden of [
  '../prisma',
  '@/lib/prisma',
  'new PrismaClient',
  'sendEmail',
  'Resend',
  'AlertQueue',
  'AlertEvent',
  'SavedSearch',
  'CRMTask',
  'fetch(',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'OpenAI',
  'LightBox',
  'ATTOM',
  'Typesense',
  'queue',
  'worker',
  'cron',
]) {
  assertNotIncludes(helper, forbidden, `Package helper must not include protected dependency: ${forbidden}`);
}

for (const forbiddenCopy of [
  'best neighborhood',
  'safest',
  'school ranking',
  'crime',
  'will appreciate',
  'guaranteed',
  'buy now',
  'sell now',
]) {
  assertNotIncludes(
    [helper, adminRoute].join('\n'),
    forbiddenCopy,
    `Package surfaces must not include prohibited recommendation language: ${forbiddenCopy}`,
  );
}

assert.equal(
  packageJson.scripts?.['check:market-newsletter-agent-review-package'],
  'npm run worker:build && node dist/scripts/checkMarketNewsletterAgentReviewPackage.js',
  'package.json must register the market newsletter package check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkMarketNewsletterAgentReviewPackage.ts',
  'tsconfig.worker.json must include the market newsletter package check.',
);
assertIncludes(
  chatStart,
  'RECURRING_MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_MVV_IMPLEMENTED_AND_LOCALLY_CERTIFIED',
  'CHAT_START must record the local implementation and certification handoff.',
);

console.log(
  '[market-newsletter-agent-review-package] ok: Boulder package contract, fail-closed states, review flags, source references, protected boundaries, admin preview, and deterministic output verified.',
);
