import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { getDecisionGuideRegistryEntry } from '../lib/coloradoDecisionGuideRegistry.js';
import { cities } from '../lib/cities.js';
import {
  buildDecisionGuide,
  buildDecisionGuideContinuityLinks,
  DECISION_GUIDE_TRUST_BOUNDARIES,
  ENHANCED_FOUNDATION_CITY_CONFIGS,
} from '../lib/decisionGuidePlatform.js';
import { neighborhoods } from '../lib/neighborhoods.js';

const PHASE_2_WAVE_2_CITIES = ['Broomfield', 'Superior'] as const;
const PRESERVED_ENHANCED_FOUNDATION_CITIES = ['Longmont', 'Denver', 'Erie', 'Westminster'] as const;
const PRESERVED_EDITORIAL_CITIES = ['Boulder', 'Louisville', 'Lafayette'] as const;

const PROHIBITED_PATTERNS = [
  /best place/i,
  /best neighborhood/i,
  /safest/i,
  /school ranking/i,
  /safety ranking/i,
  /crime score/i,
  /demographic recommendation/i,
  /protected-class/i,
  /suitability claims/i,
  /investment\s+(?:opportunity|return|upside|ranking|score|grade|pick|recommendation)/i,
  /(?<!not )appreciation predictions?/i,
  /guaranteed appreciation/i,
  /urgency claim/i,
  /activate GIS/i,
  /activate telemetry/i,
  /new data provider/i,
  /mortgage calculator/i,
  /lender integration/i,
  /Prisma\./i,
  /prisma\./i,
  /migration/i,
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function slugifyCity(value: string) {
  return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function assertNoProhibitedClaims(source: string) {
  for (const pattern of PROHIBITED_PATTERNS) {
    assert(!pattern.test(source), `Local Decision Intelligence Phase 2 Wave 2 must not include prohibited claim or activation text: ${pattern}`);
  }
}

function assertGuideTextIncludes(source: string, expected: RegExp, cityName: string, message: string) {
  assert.match(source, expected, `${cityName} ${message}`);
}

function assertContinuityContract({
  cityName,
  marketHref,
  searchHref,
  continuity,
}: {
  cityName: string;
  marketHref: string;
  searchHref: string;
  continuity: ReturnType<typeof buildDecisionGuideContinuityLinks>;
}) {
  const expectedLinks = [
    { label: 'Market Context', href: marketHref, destination: 'market' },
    { label: `Search ${cityName} Homes`, href: searchHref, destination: 'city-search' },
    { label: 'Buyer Guidance', href: '/buy', destination: 'buyer-guidance' },
    { label: 'Seller Guidance', href: '/sell', destination: 'seller-guidance' },
    { label: 'Financing Guidance', href: '/buy#financing-confidence', destination: 'financing-confidence' },
    { label: 'Grand Plan', href: '/grand-plan', destination: 'grand-plan' },
    { label: 'Advisory Guidance', href: '/contact', destination: 'advisory' },
  ] as const;

  assert.equal(continuity.length, expectedLinks.length, `${cityName} must expose the complete shared Decision Guide continuity contract.`);

  for (const expected of expectedLinks) {
    assert(
      continuity.some(
        (item) => item.label === expected.label && item.href === expected.href && item.destination === expected.destination,
      ),
      `${cityName} continuity must render ${expected.label} with ${expected.href} and ${expected.destination}.`,
    );
  }

  assert(
    !continuity.some((item) => item.href === '/buy' && /^Search .+ Homes$/.test(item.label)),
    `${cityName} /buy continuity must not render with the city-search label.`,
  );
  assert(
    !continuity.some((item) => item.destination === 'city-search' && item.href !== searchHref),
    `${cityName} city-search destination identity must only be used for the city-search URL.`,
  );
}

function assertEnhancedFoundationCity(cityName: (typeof PHASE_2_WAVE_2_CITIES)[number]) {
  const city = cities.find((candidate) => normalize(candidate.name) === normalize(cityName));
  assert(city, `${cityName} must exist in governed city data.`);
  assert.equal(city.marketSlug, `${slugifyCity(cityName)}-co-housing-market`, `${cityName} must use the canonical market route convention.`);

  const registryEntry = getDecisionGuideRegistryEntry(city);
  assert(registryEntry, `${cityName} must have a Decision Guide registry entry.`);
  assert.equal(registryEntry.publicEligibility, true, `${cityName} must be public eligible after Wave 2 implementation.`);
  assert.equal(registryEntry.guideMaturity, 'ENHANCED_FOUNDATION', `${cityName} must disclose ENHANCED_FOUNDATION maturity.`);
  assert.notEqual(registryEntry.guideMaturity, 'EVIDENCE_BACKED', `${cityName} must not be promoted to EVIDENCE_BACKED.`);
  assert.notEqual(registryEntry.guideMaturity, 'EDITORIALLY_CERTIFIED', `${cityName} must not be promoted to EDITORIALLY_CERTIFIED.`);
  assert.equal(registryEntry.marketRoute, `/market/${city.marketSlug}`, `${cityName} market route must reconcile with city data.`);
  assert.equal(registryEntry.optionalEditorialOverride, false, `${cityName} must not use editorial override.`);
  assert.deepEqual(registryEntry.ineligibilityReasons, [], `${cityName} must not carry fail-closed reasons after canonical reconciliation.`);

  const cityNeighborhoods = neighborhoods.filter((neighborhood) => normalize(neighborhood.city) === normalize(city.name));
  const guide = buildDecisionGuide({
    city,
    cityNeighborhoods,
    marketSignal: 'Balanced conditions',
    eligibility: registryEntry,
  });

  assert(guide, `${cityName} must instantiate an Enhanced Foundation Local Decision Intelligence guide.`);
  assert.equal(guide.key, slugifyCity(cityName), `${cityName} guide key must stay slug-derived.`);
  assert.equal(guide.maturity, 'ENHANCED_FOUNDATION', `${cityName} guide must disclose ENHANCED_FOUNDATION maturity.`);
  assert.match(guide.identity, /Enhanced Foundation Local Decision Intelligence/i, `${cityName} identity must disclose enhanced maturity.`);
  assert.match(guide.identity, /not a forecast, valuation, ranking/i, `${cityName} identity must preserve non-predictive boundaries.`);

  assert(guide.decisionSnapshot.whereAmI.includes(cityName), `${cityName} Decision Snapshot must identify the city.`);
  assert(guide.decisionSnapshot.mattersMost.length > 80, `${cityName} Decision Snapshot must explain what materially shapes the city.`);
  assert(guide.decisionSnapshot.payAttention.length > 80, `${cityName} Decision Snapshot must explain deeper review topics.`);
  assert(guide.decisionSnapshot.verify.length > 80, `${cityName} Decision Snapshot must explain what the platform cannot conclude.`);
  assert.match(guide.decisionSnapshot.bestNextStep, new RegExp(`Search ${cityName} homes`, 'i'), `${cityName} Decision Snapshot must identify the next action.`);

  assert(guide.communityContext.length >= 5, `${cityName} must provide Local Character and community context.`);
  assert(guide.marketContext.length >= 3, `${cityName} must provide Market Drivers.`);
  assert(guide.practicalContext.length >= 3, `${cityName} must provide neutral conditional lifestyle decision criteria.`);
  assert(guide.buyerConsiderations.length >= 2, `${cityName} must provide Buyer Guidance.`);
  assert(guide.sellerConsiderations.length >= 2, `${cityName} must provide Seller Guidance.`);
  assert(guide.verificationQuestions.length >= 5, `${cityName} must provide due-diligence verification questions.`);
  assert(guide.evidenceLimitations.length >= 3, `${cityName} must provide maturity and evidence boundaries.`);

  const guideText = JSON.stringify(guide);
  assertGuideTextIncludes(guideText, /If (commuting|walkability|urban services|historic housing|newer construction|lot size|access to recreation|HOA structure) matters/i, cityName, 'must use conditional lifestyle framing.');
  assertGuideTextIncludes(guideText, /qualified (sources|review|inspector|professional|professionals)/i, cityName, 'must direct due diligence to qualified sources.');
  assertGuideTextIncludes(guideText, /does not forecast|not a forecast|does not forecast demand|does not promise|does not rate|does not certify/i, cityName, 'must avoid predictive or definitive conclusions.');

  if (cityName === 'Broomfield') {
    assertGuideTextIncludes(guideText, /city and county|municipal structure|Boulder and Denver corridors/i, cityName, 'must include city-specific municipal and regional-access context.');
  }

  if (cityName === 'Superior') {
    assert.equal(cityNeighborhoods.length, 3, 'Superior must preserve its three governed neighborhood records.');
    assertGuideTextIncludes(guideText, /planned-community|Boulder County|rebuilding|redevelopment/i, cityName, 'must include city-specific durable context.');
    assertGuideTextIncludes(guideText, /citywide page does not certify|property-specific|public records|municipalities|insurers/i, cityName, 'must preserve sensitive-context verification boundaries.');
    assertGuideTextIncludes(guideText, /hazard certification|insurance advice|hazard service/i, cityName, 'must explicitly avoid sensitive-context activation.');
  }

  const continuity = buildDecisionGuideContinuityLinks({
    guide,
    marketHref: `/market/${city.marketSlug}`,
    searchHref: `/search?city=${encodeURIComponent(city.name)}`,
  });
  assertContinuityContract({
    cityName,
    marketHref: `/market/${city.marketSlug}`,
    searchHref: `/search?city=${encodeURIComponent(city.name)}`,
    continuity,
  });
}

async function main() {
  const [platformSource, registrySource, cityMarketPage, packageJson, workerConfig, citySource, searchControls] = await Promise.all([
    readFile('lib/decisionGuidePlatform.ts', 'utf8'),
    readFile('lib/coloradoDecisionGuideRegistry.ts', 'utf8'),
    readFile('app/market/[city]/page.tsx', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('tsconfig.worker.json', 'utf8'),
    readFile('lib/cities.ts', 'utf8'),
    readFile('components/search/SearchControls.tsx', 'utf8'),
  ]);

  for (const cityName of PHASE_2_WAVE_2_CITIES) {
    assertEnhancedFoundationCity(cityName);
  }

  for (const cityName of PRESERVED_ENHANCED_FOUNDATION_CITIES) {
    const city = cities.find((candidate) => normalize(candidate.name) === normalize(cityName));
    assert(city, `${cityName} must remain in city data.`);
    const registryEntry = getDecisionGuideRegistryEntry(city);
    assert(registryEntry, `${cityName} must remain registered.`);
    assert.equal(registryEntry.guideMaturity, 'ENHANCED_FOUNDATION', `${cityName} must preserve ENHANCED_FOUNDATION maturity.`);
  }

  for (const cityName of PRESERVED_EDITORIAL_CITIES) {
    const city = cities.find((candidate) => normalize(candidate.name) === normalize(cityName));
    assert(city, `${cityName} must remain in city data.`);
    const registryEntry = getDecisionGuideRegistryEntry(city);
    assert(registryEntry, `${cityName} must remain registered.`);
    assert.equal(registryEntry.guideMaturity, 'EDITORIALLY_CERTIFIED', `${cityName} must preserve editorial certification.`);
    assert.equal(registryEntry.optionalEditorialOverride, true, `${cityName} must preserve its editorial override.`);
  }

  assert(ENHANCED_FOUNDATION_CITY_CONFIGS.broomfield, 'Broomfield must have an enhanced foundation configuration.');
  assert(ENHANCED_FOUNDATION_CITY_CONFIGS.superior, 'Superior must have an enhanced foundation configuration.');
  assert(ENHANCED_FOUNDATION_CITY_CONFIGS.longmont, 'Longmont must preserve its enhanced foundation configuration.');
  assert(ENHANCED_FOUNDATION_CITY_CONFIGS.denver, 'Denver must preserve its enhanced foundation configuration.');
  assert.match(citySource, /superior-co-housing-market/, 'Superior route must exist in governed city market data.');
  assert.match(registrySource, /marketRoute: '\/market\/superior-co-housing-market'/, 'Superior registry route must be public and canonical.');
  assert.doesNotMatch(registrySource, /canonicalName: 'Superior'[\s\S]{0,220}missing-market-route/, 'Superior must no longer carry missing-market-route.');
  assert.doesNotMatch(registrySource, /canonicalName: 'Superior'[\s\S]{0,220}missing-market-data/, 'Superior must no longer carry missing-market-data.');
  assert.match(searchControls, /City or town/, 'Search must remain generic city text input without ranking or search-ranking mutation.');
  assert.match(cityMarketPage, /phase-2-enhanced-foundation/, 'City page must expose wave-agnostic enhanced foundation metadata.');
  assert.match(cityMarketPage, /DECISION_GUIDE_ENHANCED_FOUNDATION_SOURCE/, 'City page must expose enhanced foundation source metadata.');
  assert.match(
    cityMarketPage,
    /data-local-decision-continuity-destination=\{item\.destination\}/,
    'City page must expose explicit continuity destination identity.',
  );
  assert.match(cityMarketPage, /\{item\.label\}/, 'City page must render continuity labels from the governed contract.');
  assert.doesNotMatch(
    cityMarketPage,
    /item\.destination === 'search'\s*\?\s*<>\s*Search/,
    'Continuity label rendering must not depend on an overloaded search measurement destination.',
  );

  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.ai, false, 'Wave 2 must not activate AI.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.gis, false, 'Wave 2 must not activate public GIS.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.telemetry, false, 'Wave 2 must not activate telemetry.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.ranking, false, 'Wave 2 must not activate rankings.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.demographicTargeting, false, 'Wave 2 must not activate demographic targeting.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.schoolRanking, false, 'Wave 2 must not activate school rankings.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.safetyRanking, false, 'Wave 2 must not activate safety rankings.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.investmentRecommendation, false, 'Wave 2 must not activate investment recommendations.');

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(
    packageData.scripts?.['check:local-decision-intelligence-phase-2-wave-2'],
    'package.json must expose the Local Decision Intelligence Phase 2 Wave 2 validation check.',
  );
  assert.match(
    workerConfig,
    /checkLocalDecisionIntelligencePhase2Wave2\.ts/,
    'Worker config must compile the Local Decision Intelligence Phase 2 Wave 2 validation check.',
  );

  assertNoProhibitedClaims(`${platformSource}\n${registrySource}\n${cityMarketPage}\n${citySource}`);

  console.log(
    `[local-decision-intelligence-phase-2-wave-2] ok: ${PHASE_2_WAVE_2_CITIES.length} Wave 2 enhanced foundation cities, Superior canonical route and registry reconciliation, preserved Wave 1 and editorial maturities, exact continuity contract, fair-housing boundaries, sensitive-context safeguards, and protected-capability exclusions verified.`,
  );
}

main().catch((error) => {
  console.error('[local-decision-intelligence-phase-2-wave-2] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
