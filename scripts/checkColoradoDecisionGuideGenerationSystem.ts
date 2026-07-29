import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  getColoradoDecisionGuideRegistry,
  getDecisionGuideRegistryEntry,
  getPublicDecisionGuideRegistryEntries,
  getRepresentativeDecisionGuideCity,
} from '../lib/coloradoDecisionGuideRegistry.js';
import { cities } from '../lib/cities.js';
import { buildDecisionGuide, DECISION_GUIDE_TRUST_BOUNDARIES } from '../lib/decisionGuidePlatform.js';
import { neighborhoods } from '../lib/neighborhoods.js';

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function assertUnique(values: string[], label: string) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  assert.equal(duplicates.length, 0, `${label} must not contain duplicate values: ${duplicates.join(', ')}`);
}

function assertNoProhibitedClaims(source: string) {
  const prohibited = [
    /best place/i,
    /best neighborhood/i,
    /safest/i,
    /school ranking/i,
    /safety ranking/i,
    /crime score/i,
    /demographic recommendation/i,
    /protected-class/i,
    /investment recommendation/i,
    /appreciation prediction/i,
    /guaranteed appreciation/i,
    /urgent/i,
    /activate GIS/i,
    /activate telemetry/i,
    /new data provider/i,
    /Prisma\./i,
    /prisma\./i,
    /migration/i,
  ];

  for (const pattern of prohibited) {
    assert(!pattern.test(source), `Colorado Decision Guide generation system must not include prohibited claim or activation text: ${pattern}`);
  }
}

async function main() {
  const [platformSource, registrySource, cityMarketPage, sitemapSource, packageJson] = await Promise.all([
    readFile('lib/decisionGuidePlatform.ts', 'utf8'),
    readFile('lib/coloradoDecisionGuideRegistry.ts', 'utf8'),
    readFile('app/market/[city]/page.tsx', 'utf8'),
    readFile('app/sitemap.ts', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);
  const combinedSource = `${platformSource}\n${registrySource}\n${cityMarketPage}\n${sitemapSource}`;
  const registry = getColoradoDecisionGuideRegistry();
  const publicEntries = getPublicDecisionGuideRegistryEntries();

  assert(registry.length >= cities.length, 'Colorado Decision Guide Registry must cover at least all governed city-market entries.');
  assertUnique(registry.map((entry) => normalize(entry.canonicalName)), 'Canonical city names');
  assertUnique(registry.map((entry) => entry.routeSlug), 'Route slugs');
  assertUnique(publicEntries.map((entry) => entry.marketRoute ?? ''), 'Public eligible market routes');

  for (const city of cities) {
    const entry = getDecisionGuideRegistryEntry(city);
    assert(entry, `${city.name} must have a Colorado Decision Guide Registry entry.`);

    if (entry.marketRoute) {
      assert.equal(
        entry.marketRoute,
        `/market/${city.marketSlug}`,
        `${city.name} registry market route must stay reconciled with governed city market data.`,
      );
    }
  }

  for (const entry of registry) {
    assert.equal(entry.state, 'CO', `${entry.canonicalName} must remain a Colorado registry entry.`);
    assert(entry.routeSlug.length > 0, `${entry.canonicalName} must have a route slug.`);
    assert(entry.searchValue.length > 0, `${entry.canonicalName} must have a search value.`);
    assert(entry.freshness.length > 0, `${entry.canonicalName} must expose freshness.`);

    if (entry.publicEligibility) {
      assert(entry.marketRoute?.startsWith('/market/'), `${entry.canonicalName} public guide must have a market route.`);
      assert(entry.listingDataAvailability, `${entry.canonicalName} public guide must have listing/search availability.`);
      assert(entry.marketDataAvailability, `${entry.canonicalName} public guide must have governed market data.`);
      assert(entry.knowledgeSourceAvailability, `${entry.canonicalName} public guide must have knowledge-source availability.`);
      assert(entry.ineligibilityReasons.length === 0, `${entry.canonicalName} public guide must not carry ineligibility reasons.`);
    } else {
      assert(entry.ineligibilityReasons.length > 0, `${entry.canonicalName} ineligible guide must explain why it fails closed.`);
    }
  }

  const editorialCity = getRepresentativeDecisionGuideCity({ maturity: 'EDITORIALLY_CERTIFIED', publicEligibility: true });
  const evidenceBackedCity = getRepresentativeDecisionGuideCity({ maturity: 'EVIDENCE_BACKED' });
  const foundationCity = getRepresentativeDecisionGuideCity({ maturity: 'FOUNDATION', publicEligibility: true });
  const ineligibleCity = registry.find((entry) => !entry.publicEligibility && entry.marketRoute);

  assert(editorialCity, 'At least one editorially certified city must remain available.');
  assert(evidenceBackedCity, 'At least one evidence-backed registry city must be represented when neighborhood/search evidence exists.');
  assert(foundationCity, 'At least one foundation city must be publicly eligible.');
  assert(ineligibleCity, 'At least one market city must fail closed when minimum guide requirements are absent.');

  const foundationCityData = cities.find((city) => normalize(city.name) === normalize(foundationCity.canonicalName));
  assert(foundationCityData, 'Representative foundation city must resolve to city market data.');

  const generatedFoundationGuide = buildDecisionGuide({
    city: foundationCityData,
    cityNeighborhoods: neighborhoods.filter((neighborhood) => normalize(neighborhood.city) === normalize(foundationCityData.name)),
    marketSignal: 'Balanced conditions',
    eligibility: getDecisionGuideRegistryEntry(foundationCityData),
  });

  assert(generatedFoundationGuide, 'Representative foundation city must generate a guide.');
  assert.equal(generatedFoundationGuide.maturity, 'FOUNDATION', 'Representative foundation guide must retain FOUNDATION maturity.');
  assert.equal(generatedFoundationGuide.publicEligibility, true, 'Representative foundation guide must be publicly eligible.');
  assert.match(generatedFoundationGuide.identity, /foundation Colorado Decision Guide/i, 'Foundation guide must visibly disclose its bounded maturity.');
  assert.match(
    generatedFoundationGuide.summaryIntro,
    /does not add unsupported local interpretation/i,
    'Foundation guide must avoid unsupported city-specific interpretation.',
  );

  const ineligibleCityData = cities.find((city) => normalize(city.name) === normalize(ineligibleCity.canonicalName));
  assert(ineligibleCityData, 'Representative ineligible city must resolve to city market data.');
  assert.equal(
    buildDecisionGuide({
      city: ineligibleCityData,
      cityNeighborhoods: neighborhoods.filter((neighborhood) => normalize(neighborhood.city) === normalize(ineligibleCityData.name)),
      marketSignal: 'Balanced conditions',
      eligibility: getDecisionGuideRegistryEntry(ineligibleCityData),
    }),
    null,
    'Ineligible city must fail closed and not generate a public Decision Guide.',
  );

  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.ai, false, 'Decision guides must not activate AI.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.gis, false, 'Decision guides must not activate public GIS.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.telemetry, false, 'Decision guides must not activate telemetry.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.demographicTargeting, false, 'Decision guides must not use demographic targeting.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.schoolRanking, false, 'Decision guides must not include school ranking logic.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.safetyRanking, false, 'Decision guides must not include safety ranking logic.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.investmentRecommendation, false, 'Decision guides must not include investment recommendations.');

  assert.match(registrySource, /listingDataAvailability/, 'Registry must expose listing-data availability.');
  assert.match(registrySource, /guideMaturity/, 'Registry must expose guide maturity.');
  assert.match(registrySource, /publicEligibility/, 'Registry must expose public eligibility.');
  assert.match(registrySource, /ineligibilityReasons/, 'Registry must expose fail-closed reasons.');
  assert.match(cityMarketPage, /data-city-decision-guide-maturity/, 'Route must expose guide maturity metadata.');
  assert.match(cityMarketPage, /data-city-decision-guide-public-eligible/, 'Route must expose guide eligibility metadata.');
  assert.match(sitemapSource, /getPublicDecisionGuideRegistryEntries/, 'Sitemap must include only publicly eligible generated guides.');

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(
    packageData.scripts?.['check:colorado-decision-guide-generation-system'],
    'package.json must expose the Colorado Decision Guide Generation System validation check.',
  );

  assertNoProhibitedClaims(combinedSource);

  console.log(
    `[colorado-decision-guide-generation-system] ok: ${registry.length} registry cities, ${publicEntries.length} public eligible guides, ${registry.length - publicEntries.length} deferred/ineligible guides, maturity rules, fail-closed behavior, sitemap eligibility, and fair-housing boundaries verified.`,
  );
}

main().catch((error) => {
  console.error('[colorado-decision-guide-generation-system] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
