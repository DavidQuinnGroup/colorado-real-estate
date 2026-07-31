import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { getDecisionGuideRegistryEntry } from '../lib/coloradoDecisionGuideRegistry.js';
import { cities } from '../lib/cities.js';
import {
  buildDecisionGuide,
  buildDecisionGuideContinuityLinks,
  DECISION_GUIDE_TRUST_BOUNDARIES,
} from '../lib/decisionGuidePlatform.js';
import { neighborhoods } from '../lib/neighborhoods.js';

const PHASE_1_FOUNDATION_CITIES = ['Broomfield', 'Erie', 'Longmont', 'Westminster'] as const;
const PHASE_2_ENHANCEMENT_CANDIDATES = ['Longmont'] as const;
const PROHIBITED_PATTERNS = [
  /best place/i,
  /best neighborhood/i,
  /safest/i,
  /school ranking/i,
  /safety ranking/i,
  /crime score/i,
  /demographic recommendation/i,
  /investment\s+(?:opportunity|return|upside|ranking|score|grade|pick)/i,
  /appreciation prediction/i,
  /guaranteed appreciation/i,
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

function assertIncludes(source: string, expected: string, message: string) {
  assert(source.includes(expected), message);
}

function assertNoProhibitedClaims(source: string) {
  for (const pattern of PROHIBITED_PATTERNS) {
    assert(!pattern.test(source), `Local Decision Intelligence Phase 1 must not include prohibited claim or activation text: ${pattern}`);
  }
}

async function main() {
  const [platformSource, registrySource, cityMarketPage, packageJson, workerConfig] = await Promise.all([
    readFile('lib/decisionGuidePlatform.ts', 'utf8'),
    readFile('lib/coloradoDecisionGuideRegistry.ts', 'utf8'),
    readFile('app/market/[city]/page.tsx', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('tsconfig.worker.json', 'utf8'),
  ]);

  for (const cityName of PHASE_1_FOUNDATION_CITIES) {
    const city = cities.find((candidate) => normalize(candidate.name) === normalize(cityName));
    assert(city, `${cityName} must exist in governed city data.`);

    const registryEntry = getDecisionGuideRegistryEntry(city);
    const isPhase2EnhancementCandidate = PHASE_2_ENHANCEMENT_CANDIDATES.some((candidate) => normalize(candidate) === normalize(cityName));
    assert(registryEntry, `${cityName} must have a Decision Guide registry entry.`);
    assert.equal(registryEntry.publicEligibility, true, `${cityName} must remain public eligible for Phase 1.`);
    assert.equal(
      registryEntry.guideMaturity,
      isPhase2EnhancementCandidate ? 'ENHANCED_FOUNDATION' : 'FOUNDATION',
      `${cityName} must preserve its authorized maturity.`,
    );
    assert.equal(registryEntry.optionalEditorialOverride, false, `${cityName} must not be promoted to editorial certification.`);
    assert.deepEqual(registryEntry.ineligibilityReasons, [], `${cityName} must not carry fail-closed reasons.`);

    const cityNeighborhoods = neighborhoods.filter((neighborhood) => normalize(neighborhood.city) === normalize(city.name));
    const guide = buildDecisionGuide({
      city,
      cityNeighborhoods,
      marketSignal: 'Balanced conditions',
      eligibility: registryEntry,
    });

    assert(guide, `${cityName} must instantiate a foundation Local Decision Intelligence guide.`);
    assert.equal(guide.key, normalize(cityName).replace(/[^a-z0-9]+/g, '-'), `${cityName} guide key must stay slug-derived.`);
    assert.equal(
      guide.maturity,
      isPhase2EnhancementCandidate ? 'ENHANCED_FOUNDATION' : 'FOUNDATION',
      `${cityName} guide must disclose authorized maturity.`,
    );
    if (isPhase2EnhancementCandidate) {
      assert.match(guide.identity, /Enhanced Foundation Local Decision Intelligence/i, `${cityName} identity must disclose enhanced status.`);
      assert.match(guide.summaryIntro, /non-predictive/i, `${cityName} must preserve limitation-forward enhanced language.`);
    } else {
      assert.match(guide.identity, /foundation Colorado Decision Guide/i, `${cityName} identity must disclose foundation status.`);
      assert.match(guide.summaryIntro, /does not add unsupported local interpretation/i, `${cityName} must preserve foundation limitations.`);
    }

    assert(guide.decisionSnapshot.whereAmI.includes(cityName), `${cityName} Decision Snapshot must identify the city.`);
    assert(guide.decisionSnapshot.mattersMost.length > 0, `${cityName} Decision Snapshot must state what matters most.`);
    assert(guide.decisionSnapshot.payAttention.length > 0, `${cityName} Decision Snapshot must state what to watch.`);
    assert(guide.decisionSnapshot.verify.length > 0, `${cityName} Decision Snapshot must state what to verify.`);
    assert(guide.decisionSnapshot.bestNextStep.length > 0, `${cityName} Decision Snapshot must state the next step.`);

    assert(guide.marketContext.length >= 2, `${cityName} must provide Market Context.`);
    assert(guide.communityContext.length >= 2, `${cityName} must provide Community Context.`);
    assert(guide.housingContext.length >= 3, `${cityName} must preserve Housing Context.`);
    assert(guide.buyerConsiderations.length >= 2, `${cityName} must provide Buyer Considerations.`);
    assert(guide.sellerConsiderations.length >= 2, `${cityName} must provide Seller Considerations.`);
    assert(guide.verificationQuestions.length >= 4, `${cityName} must provide a Verification Checklist.`);
    assert(guide.evidenceLimitations.length >= 2, `${cityName} must provide Evidence & Limitations.`);

    const continuity = buildDecisionGuideContinuityLinks({
      guide,
      marketHref: `/market/${city.marketSlug}`,
      searchHref: `/search?city=${encodeURIComponent(city.name)}`,
    });
    assert(continuity.some((item) => item.href.startsWith('/search?city=')), `${cityName} must preserve Search Continuity.`);
    assert(continuity.some((item) => item.href === '/buy#financing-confidence'), `${cityName} must preserve Financing Continuity.`);
    assert(continuity.some((item) => item.href === '/grand-plan'), `${cityName} must preserve Grand Plan Continuity.`);
    assert(continuity.some((item) => item.href === '/contact'), `${cityName} must provide Advisory Continuity.`);
  }

  assertIncludes(cityMarketPage, 'data-testid={`${cityDecisionGuide.key}-decision-snapshot`}', 'City page must render the Decision Snapshot component.');
  assertIncludes(cityMarketPage, 'data-local-decision-intelligence="phase-1"', 'Decision Snapshot must expose Phase 1 metadata.');
  assertIncludes(cityMarketPage, 'data-local-decision-market-context="true"', 'City page must expose Market Context metadata.');
  assertIncludes(cityMarketPage, 'data-local-decision-community-context="true"', 'City page must expose Community Context metadata.');
  assertIncludes(cityMarketPage, 'data-local-decision-buyer-considerations="true"', 'City page must expose Buyer Considerations metadata.');
  assertIncludes(cityMarketPage, 'data-local-decision-seller-considerations="true"', 'City page must expose Seller Considerations metadata.');
  assertIncludes(cityMarketPage, 'data-local-decision-evidence-limitations="true"', 'City page must expose Evidence & Limitations metadata.');
  assertIncludes(cityMarketPage, 'data-local-decision-search-continuity="true"', 'City page must preserve Search Continuity metadata.');
  assertIncludes(cityMarketPage, 'data-local-decision-financing-continuity="true"', 'City page must preserve Financing Continuity metadata.');
  assertIncludes(cityMarketPage, 'data-local-decision-grand-plan-continuity="true"', 'City page must preserve Grand Plan Continuity metadata.');
  assertIncludes(cityMarketPage, 'data-local-decision-advisory-continuity="true"', 'City page must preserve Advisory Continuity metadata.');

  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.ai, false, 'Phase 1 must not activate AI.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.gis, false, 'Phase 1 must not activate public GIS.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.telemetry, false, 'Phase 1 must not activate telemetry.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.ranking, false, 'Phase 1 must not activate rankings.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.demographicTargeting, false, 'Phase 1 must not activate demographic targeting.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.schoolRanking, false, 'Phase 1 must not activate school rankings.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.safetyRanking, false, 'Phase 1 must not activate safety rankings.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.investmentRecommendation, false, 'Phase 1 must not activate investment recommendations.');

  const combinedSource = `${platformSource}\n${registrySource}\n${cityMarketPage}`;
  assertNoProhibitedClaims(combinedSource);

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(
    packageData.scripts?.['check:local-decision-intelligence-phase-1'],
    'package.json must expose the Local Decision Intelligence Phase 1 validation check.',
  );
  assert.match(
    workerConfig,
    /checkLocalDecisionIntelligencePhase1\.ts/,
    'Worker config must compile the Local Decision Intelligence Phase 1 validation check.',
  );

  console.log(
    `[local-decision-intelligence-phase-1] ok: ${PHASE_1_FOUNDATION_CITIES.length} Phase 1 city routes, Decision Snapshot, required sections, continuity paths, maturity boundaries, and protected-capability exclusions verified.`,
  );
}

main().catch((error) => {
  console.error('[local-decision-intelligence-phase-1] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
