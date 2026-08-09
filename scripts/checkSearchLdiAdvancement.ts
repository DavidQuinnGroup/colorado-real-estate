import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildSearchDiscoveryIntelligence,
  SEARCH_DISCOVERY_INTELLIGENCE_STATUS,
} from '../lib/searchDiscoveryIntelligence.js';
import { getDecisionGuideRegistryEntry } from '../lib/coloradoDecisionGuideRegistry.js';
import { cities } from '../lib/cities.js';
import {
  buildDecisionGuide,
  buildDecisionGuideContinuityLinks,
  DECISION_GUIDE_TRUST_BOUNDARIES,
  ENHANCED_FOUNDATION_CITY_CONFIGS,
} from '../lib/decisionGuidePlatform.js';
import { MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES } from '../lib/marketAeoPilot.js';
import { neighborhoods } from '../lib/neighborhoods.js';

const SEARCH_LDI_ADVANCEMENT_STATUS = 'SEARCH_LDI_ADVANCEMENT_LOCALLY_CERTIFIED';
const LDI_EXPANSION_WAVE_CITIES = ['Brighton', 'Firestone', 'Frederick'] as const;
const PRESERVED_INELIGIBLE_CITIES = ['Niwot', 'Gunbarrel', 'Thornton'] as const;
const SEARCH_CUE_KEYS = [
  'PROPERTY',
  'PLACE',
  'MARKET_CONTEXT',
  'EVIDENCE_AVAILABILITY',
  'COMPARISON_OPPORTUNITY',
  'NEXT_DECISION_STEP',
] as const;

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function slugifyCity(value: string) {
  return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function assertIncludes(source: string, expected: string, message: string) {
  assert(source.includes(expected), message);
}

function assertNotIncludes(source: string, forbidden: string, message: string) {
  assert(!source.includes(forbidden), message);
}

function assertSearchDiscoveryModel() {
  const zeroResultModel = buildSearchDiscoveryIntelligence({
    visibleListingCount: 0,
    activeCriteriaCount: 3,
    criteriaSummary: 'Boulder, townhome, up to $900k',
    evidenceLabel: 'Public listing evidence',
    hasZeroResults: true,
    isDegraded: true,
    selectedPropertyLabel: 'No property selected',
  });

  assert.equal(zeroResultModel.status, SEARCH_DISCOVERY_INTELLIGENCE_STATUS, 'Search Discovery status must be explicit.');
  assert.deepEqual(
    zeroResultModel.cues.map((cue) => cue.key),
    SEARCH_CUE_KEYS,
    'Search Discovery must expose exactly the authorized six decision cues.',
  );
  assert.match(zeroResultModel.cues.at(-1)?.interpretation ?? '', /Broaden criteria/i, 'Zero-result recovery must tell users to broaden criteria.');
  assert.match(zeroResultModel.cues.at(-1)?.nextStep ?? '', /Clear or broaden criteria/i, 'Zero-result next step must remain recovery-oriented.');

  for (const [key, value] of Object.entries(zeroResultModel.protectedBoundaries)) {
    assert.equal(value, false, `Search Discovery protected boundary ${key} must remain false.`);
  }

  const selectedModel = buildSearchDiscoveryIntelligence({
    visibleListingCount: 4,
    activeCriteriaCount: 1,
    criteriaSummary: 'Erie',
    evidenceLabel: 'Public listing evidence',
    hasZeroResults: false,
    isDegraded: false,
    selectedPropertyLabel: '123 Main Street',
  });
  assert.match(JSON.stringify(selectedModel), /123 Main Street/, 'Selected property context must be visible and deterministic.');
  assert.match(JSON.stringify(selectedModel), /Property, Compare, Market, Grand Plan, or Advisor/i, 'Search must preserve cross-route next-step continuity.');
}

function assertSearchComponentContract() {
  const component = read('components/search/SearchInterface.tsx');
  const model = read('lib/searchDiscoveryIntelligence.ts');
  const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
  const workerConfig = read('tsconfig.worker.json');
  const searchPages = read('data/searchPages.ts');

  assertIncludes(component, "buildSearchDiscoveryIntelligence", 'Search interface must use the deterministic Search Discovery model.');
  assertIncludes(component, 'data-testid="search-discovery-intelligence-advancement"', 'Search page must expose the Search Discovery section.');
  assertIncludes(component, 'data-testid="search-discovery-intelligence-cue"', 'Search page must expose deterministic Search Discovery cue markers.');
  assertIncludes(component, 'data-search-discovery-ranking={String(searchDiscoveryIntelligence.protectedBoundaries.ranking)}', 'Search page must disclose no ranking activation.');
  assertIncludes(component, 'data-search-discovery-scoring={String(searchDiscoveryIntelligence.protectedBoundaries.scoring)}', 'Search page must disclose no scoring activation.');
  assertIncludes(component, 'data-search-discovery-recommendation={String(searchDiscoveryIntelligence.protectedBoundaries.recommendation)}', 'Search page must disclose no recommendation activation.');
  assertIncludes(component, 'data-search-discovery-protected-class-inference={String(searchDiscoveryIntelligence.protectedBoundaries.protectedClassInference)}', 'Search page must disclose no protected-class inference.');
  assertIncludes(component, 'data-search-discovery-hidden-personalization={String(searchDiscoveryIntelligence.protectedBoundaries.hiddenPersonalization)}', 'Search page must disclose no hidden personalization.');
  assertIncludes(component, 'data-search-discovery-persistence={String(searchDiscoveryIntelligence.protectedBoundaries.persistence)}', 'Search page must disclose no persistence.');
  assertIncludes(component, 'data-search-discovery-telemetry={String(searchDiscoveryIntelligence.protectedBoundaries.telemetry)}', 'Search page must disclose no telemetry.');
  assertIncludes(component, 'data-search-discovery-api-change={String(searchDiscoveryIntelligence.protectedBoundaries.searchApiChange)}', 'Search page must disclose no Search API change.');
  assertIncludes(component, 'data-search-discovery-map-behavior-change={String(searchDiscoveryIntelligence.protectedBoundaries.mapBehaviorChange)}', 'Search page must disclose no map behavior change.');

  for (const forbidden of [
    'localStorage',
    'sessionStorage',
    'document.cookie',
    'navigator.sendBeacon',
    'process.env',
    'fetch(',
    'searchReadinessScore',
    'propertyRanking',
    'recommendedListing',
    'personalizedResults',
    'suitabilityScore',
  ]) {
    assertNotIncludes(model, forbidden, `Search Discovery model must not activate protected runtime behavior: ${forbidden}`);
  }

  for (const citySlug of ['brighton', 'firestone', 'frederick']) {
    assertIncludes(searchPages, `"${citySlug}"`, `${citySlug} must be supported by governed search page city routing.`);
  }

  assert.equal(
    packageJson.scripts?.['check:search-ldi-advancement'],
    'npm run worker:build && node dist/scripts/checkSearchLdiAdvancement.js',
    'package.json must expose the Search + LDI advancement check.',
  );
  assertIncludes(workerConfig, 'scripts/checkSearchLdiAdvancement.ts', 'Worker build must include the Search + LDI advancement check.');
}

function assertContinuityContract(cityName: string, marketHref: string, searchHref: string) {
  const city = cities.find((candidate) => normalize(candidate.name) === normalize(cityName));
  assert(city, `${cityName} must exist in governed city data.`);
  const registryEntry = getDecisionGuideRegistryEntry(city);
  assert(registryEntry, `${cityName} must have a registry entry.`);
  const cityNeighborhoods = neighborhoods.filter((neighborhood) => normalize(neighborhood.city) === normalize(city.name));
  const guide = buildDecisionGuide({
    city,
    cityNeighborhoods,
    marketSignal: 'Balanced conditions',
    eligibility: registryEntry,
  });
  assert(guide, `${cityName} must build a Decision Guide.`);

  const continuity = buildDecisionGuideContinuityLinks({ guide, marketHref, searchHref });
  const expectedLinks = [
    { label: 'Market Context', href: marketHref, destination: 'market' },
    { label: `Search ${cityName} Homes`, href: searchHref, destination: 'city-search' },
    { label: 'Buyer Guidance', href: '/buy', destination: 'buyer-guidance' },
    { label: 'Seller Guidance', href: '/sell', destination: 'seller-guidance' },
    { label: 'Financing Guidance', href: '/buy#financing-confidence', destination: 'financing-confidence' },
    { label: 'Grand Plan', href: '/grand-plan', destination: 'grand-plan' },
    { label: 'Advisory Guidance', href: '/contact', destination: 'advisory' },
  ] as const;

  assert.equal(continuity.length, expectedLinks.length, `${cityName} must expose the complete shared continuity contract.`);
  for (const expected of expectedLinks) {
    assert(
      continuity.some((item) => item.label === expected.label && item.href === expected.href && item.destination === expected.destination),
      `${cityName} continuity must include ${expected.label}.`,
    );
  }
}

function assertLdiWaveCity(cityName: (typeof LDI_EXPANSION_WAVE_CITIES)[number]) {
  const citySlug = slugifyCity(cityName);
  const city = cities.find((candidate) => normalize(candidate.name) === normalize(cityName));
  assert(city, `${cityName} must exist in governed city data.`);
  assert.equal(city.marketSlug, `${citySlug}-co-housing-market`, `${cityName} must use canonical city-market routing.`);

  const registryEntry = getDecisionGuideRegistryEntry(city);
  assert(registryEntry, `${cityName} must have a Decision Guide registry entry.`);
  assert.equal(registryEntry.publicEligibility, true, `${cityName} must be public eligible in this LDI expansion wave.`);
  assert.equal(registryEntry.guideMaturity, 'ENHANCED_FOUNDATION', `${cityName} must disclose ENHANCED_FOUNDATION maturity.`);
  assert.equal(registryEntry.marketRoute, `/market/${citySlug}-co-housing-market`, `${cityName} must preserve canonical market route.`);
  assert.equal(registryEntry.optionalEditorialOverride, false, `${cityName} must not use editorial override.`);
  assert.deepEqual(registryEntry.ineligibilityReasons, [], `${cityName} must not carry stale fail-closed reasons.`);
  assert(ENHANCED_FOUNDATION_CITY_CONFIGS[citySlug as keyof typeof ENHANCED_FOUNDATION_CITY_CONFIGS], `${cityName} must have an enhanced foundation config.`);

  const cityNeighborhoods = neighborhoods.filter((neighborhood) => normalize(neighborhood.city) === normalize(city.name));
  const guide = buildDecisionGuide({
    city,
    cityNeighborhoods,
    marketSignal: 'Balanced conditions',
    eligibility: registryEntry,
  });
  assert(guide, `${cityName} must instantiate an Enhanced Foundation Local Decision Intelligence guide.`);
  assert.equal(guide.key, citySlug, `${cityName} guide key must stay slug-derived.`);
  assert.equal(guide.maturity, 'ENHANCED_FOUNDATION', `${cityName} guide maturity must stay Enhanced Foundation.`);
  assert.match(guide.identity, /Enhanced Foundation Local Decision Intelligence/i, `${cityName} must disclose Enhanced Foundation identity.`);
  assert.match(guide.identity, /not a forecast, valuation, ranking/i, `${cityName} must preserve non-predictive boundaries.`);
  assert(guide.communityContext.length >= 5, `${cityName} must provide local character and community context.`);
  assert(guide.marketContext.length >= 3, `${cityName} must provide market context.`);
  assert(guide.practicalContext.length >= 3, `${cityName} must provide practical context.`);
  assert(guide.buyerConsiderations.length >= 2, `${cityName} must provide buyer considerations.`);
  assert(guide.sellerConsiderations.length >= 2, `${cityName} must provide seller considerations.`);
  assert(guide.evidenceLimitations.length >= 3, `${cityName} must provide evidence limitations.`);
  assert(guide.verificationQuestions.length >= 5, `${cityName} must provide verification questions.`);

  const guideText = JSON.stringify(guide);
  assert.match(guideText, /qualified (sources|review|inspector|professional|professionals)/i, `${cityName} must direct due diligence to qualified sources.`);
  assert.match(guideText, /does not forecast|not a forecast|does not promise|does not rate|does not certify/i, `${cityName} must avoid predictive conclusions.`);
  assert.match(guideText, /county|jurisdiction|municipal/i, `${cityName} must preserve local source verification context.`);

  for (const pattern of [
    /best place/i,
    /best neighborhood/i,
    /safest/i,
    /school ranking/i,
    /safety ranking/i,
    /crime score/i,
    /demographic recommendation/i,
    /suitable for/i,
    /protected-class/i,
    /investment\s+(?:opportunity|return|upside|ranking|score|grade|pick|recommendation)/i,
    /(?<!not )appreciation predictions?/i,
    /guaranteed appreciation/i,
    /urgency claim/i,
    /activate GIS/i,
    /activate telemetry/i,
    /new data provider/i,
    /Prisma\./i,
    /migration/i,
  ]) {
    assert.doesNotMatch(guideText, pattern, `${cityName} must not contain prohibited claim or activation text: ${pattern}`);
  }

  assertContinuityContract(cityName, `/market/${citySlug}-co-housing-market`, `/search?city=${encodeURIComponent(cityName)}`);
}

function assertContainment() {
  const registrySource = read('lib/coloradoDecisionGuideRegistry.ts');
  const sourceRegistryDoc = read('docs/project-atlas/executive-library/REIE-SOURCE-REGISTRY-GRAND-PLAN-ADVANCEMENT-PRODUCTION-CERTIFICATION.md');

  for (const cityName of PRESERVED_INELIGIBLE_CITIES) {
    const city = cities.find((candidate) => normalize(candidate.name) === normalize(cityName));
    assert(city, `${cityName} must remain in governed city data.`);
    const registryEntry = getDecisionGuideRegistryEntry(city);
    assert(registryEntry, `${cityName} must remain registered.`);
    assert.equal(registryEntry.publicEligibility, false, `${cityName} must remain fail-closed.`);
    assert(registryEntry.ineligibilityReasons.length > 0, `${cityName} must retain ineligibility reasons.`);
  }

  assertIncludes(registrySource, "marketRoute: null", 'Niwot must preserve null market route until separately authorized.');
  assertIncludes(sourceRegistryDoc, 'Boulder County Assessor', 'Source Registry certification context must remain documented.');
  assert.match(sourceRegistryDoc, /AWAITING_PROVIDER_CONFIRMATION|provider confirmation/i, 'Boulder County Assessor must remain provider-confirmation bound.');
  assert.match(sourceRegistryDoc, /BCOD/i, 'BCOD containment must remain documented.');
  assert(!MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES.includes('brighton-co-housing-market' as never), 'Market/AEO Wave 2 allowlist must not expand to Brighton.');
  assert(!MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES.includes('firestone-co-housing-market' as never), 'Market/AEO Wave 2 allowlist must not expand to Firestone.');
  assert(!MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES.includes('frederick-co-housing-market' as never), 'Market/AEO Wave 2 allowlist must not expand to Frederick.');

  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.ai, false, 'LDI expansion must not activate AI.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.gis, false, 'LDI expansion must not activate public GIS.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.telemetry, false, 'LDI expansion must not activate telemetry.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.ranking, false, 'LDI expansion must not activate rankings.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.demographicTargeting, false, 'LDI expansion must not activate demographic targeting.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.schoolRanking, false, 'LDI expansion must not activate school rankings.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.safetyRanking, false, 'LDI expansion must not activate safety rankings.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.investmentRecommendation, false, 'LDI expansion must not activate investment recommendations.');
}

assertSearchDiscoveryModel();
assertSearchComponentContract();
for (const cityName of LDI_EXPANSION_WAVE_CITIES) {
  assertLdiWaveCity(cityName);
}
assertContainment();

console.log(
  `[search-ldi-advancement] ok: ${SEARCH_LDI_ADVANCEMENT_STATUS}; Search Discovery Intelligence, Brighton/Firestone/Frederick Enhanced Foundation LDI, continuity, fair-housing boundaries, Source Registry status, Market/AEO containment, and protected-system exclusions verified.`,
);
