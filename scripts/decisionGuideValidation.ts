import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { DECISION_GUIDE_CITY_CONFIGS, type DecisionGuideKey } from '../lib/decisionGuidePlatform.js';

type DecisionGuideValidationOptions = {
  key: DecisionGuideKey;
  cityName: string;
  expectedNeighborhoodEvidence: string;
  packageScriptName: string;
};

const EXPLICIT_NEGATIVE_PROTECTED_CLASS_MARKER = 'data-answer-unit-protected-class-implication="false"';
const EXPLICIT_NEGATIVE_PROTECTED_CLASS_LIMITATION = 'This guide does not infer or rank protected-class characteristics.';
const EXPLICIT_NEGATIVE_INVESTMENT_LIMITATION = 'valuation, investment recommendation, or advice to buy or sell.';

function assertIncludes(source: string, expected: string, message: string) {
  assert(source.includes(expected), message);
}

function assertNoProhibitedClaims(source: string, cityName: string) {
  const semanticSource = source
    .split(EXPLICIT_NEGATIVE_PROTECTED_CLASS_MARKER).join('')
    .split(EXPLICIT_NEGATIVE_PROTECTED_CLASS_LIMITATION).join('')
    .split(EXPLICIT_NEGATIVE_INVESTMENT_LIMITATION).join('');
  const prohibited = [
    /best place/i,
    /best neighborhood/i,
    /safest/i,
    /school ranking/i,
    /safety ranking/i,
    /crime score/i,
    /demographic recommendation/i,
    /protected[-\s]class/i,
    /investment recommendation/i,
    /appreciation prediction/i,
    /guaranteed appreciation/i,
    /urgent/i,
    /OpenAI/i,
    /activate GIS/i,
    /activate telemetry/i,
    /new data provider/i,
    /Prisma\./i,
    /prisma\./i,
    /migration/i,
  ];

  for (const pattern of prohibited) {
    assert(!pattern.test(semanticSource), `${cityName} Decision Guide must not include prohibited claim or activation text: ${pattern}`);
  }
}

function assertSemanticSafetyFixtures() {
  const prohibited = [
    /protected[-\s]class/i,
    /investment recommendation/i,
  ];
  const safeFixtures = [
    EXPLICIT_NEGATIVE_PROTECTED_CLASS_MARKER,
    EXPLICIT_NEGATIVE_PROTECTED_CLASS_LIMITATION,
    EXPLICIT_NEGATIVE_INVESTMENT_LIMITATION,
  ];
  const unsafeFixtures = [
    'Protected-class implication = true.',
    'Best for a protected class.',
    'Protected-class ranking.',
    'Protected-class suitability recommendation.',
    'Demographic protected-class inference.',
    'Steering output for a protected class.',
    'This guide is an investment recommendation.',
  ];

  for (const [fixture, expected] of [
    ...safeFixtures.map((fixture) => [fixture, false] as const),
    ...unsafeFixtures.map((fixture) => [fixture, true] as const),
  ]) {
    const semanticFixture = fixture
      .split(EXPLICIT_NEGATIVE_PROTECTED_CLASS_MARKER).join('')
      .split(EXPLICIT_NEGATIVE_PROTECTED_CLASS_LIMITATION).join('')
      .split(EXPLICIT_NEGATIVE_INVESTMENT_LIMITATION).join('');
    assert.equal(prohibited.some((pattern) => pattern.test(semanticFixture)), expected, `Decision Guide semantic fixture failed: ${fixture}`);
  }
}

export async function assertDecisionGuidePlatformContract({
  key,
  cityName,
  expectedNeighborhoodEvidence,
  packageScriptName,
}: DecisionGuideValidationOptions) {
  assertSemanticSafetyFixtures();

  const [cityMarketPage, platformSource, packageJson] = await Promise.all([
    readFile('app/market/[city]/page.tsx', 'utf8'),
    readFile('lib/decisionGuidePlatform.ts', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);
  const combinedSource = `${cityMarketPage}\n${platformSource}`;
  const config = DECISION_GUIDE_CITY_CONFIGS[key as keyof typeof DECISION_GUIDE_CITY_CONFIGS];

  assert(config, `${cityName} Decision Guide must have a governed platform configuration.`);
  assert.equal(config.cityName, cityName, `${cityName} platform configuration must remain city-specific.`);

  assertIncludes(
    platformSource,
    'export type DecisionGuideKey =',
    'Decision Guide Platform must expose the reusable city guide key contract.',
  );
  assertIncludes(
    platformSource,
    'export const DECISION_GUIDE_CITY_CONFIGS',
    'Decision Guide Platform must expose governed city configurations.',
  );
  assertIncludes(
    platformSource,
    'export function buildDecisionGuide',
    'Decision Guide Platform must expose the deterministic governed-data guide builder.',
  );
  assertIncludes(
    platformSource,
    'export function buildDecisionGuideContinuityLinks',
    'Decision Guide Platform must expose reusable continuity links.',
  );
  assertIncludes(
    platformSource,
    'DECISION_GUIDE_TRUST_BOUNDARIES',
    'Decision Guide Platform must centralize trust-boundary flags.',
  );
  assertIncludes(
    platformSource,
    expectedNeighborhoodEvidence,
    `${cityName} guide must use existing governed neighborhood evidence.`,
  );

  assertIncludes(
    cityMarketPage,
    'buildDecisionGuide({',
    `${cityName} route must use the extracted Decision Guide Platform builder.`,
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={cityDecisionGuide ? `${cityDecisionGuide.key}-decision-guide-hero` : undefined}',
    `${cityName} Decision Guide hero must remain explicitly governed.`,
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-summary`}',
    `${cityName} Decision Guide summary must remain explicitly governed.`,
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-framework`}',
    `${cityName} guide must expose the Context -> Trade-offs -> Questions -> Evidence -> Next Step section.`,
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-context`}',
    `${cityName} guide must expose housing and practical living context.`,
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-tradeoffs`}',
    `${cityName} guide must expose balanced strengths and trade-offs.`,
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-questions`}',
    `${cityName} guide must expose verification questions.`,
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-neighborhoods`}',
    `${cityName} guide must expose neighborhood exploration continuity.`,
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-continuity`}',
    `${cityName} guide must expose market, search, buyer, seller, financing, and Grand Plan continuity.`,
  );
  assertIncludes(
    cityMarketPage,
    `data-${key}-decision-guide={cityDecisionGuide?.key === '${key}' ? 'true' : undefined}`,
    `${cityName} guide must remain explicitly gated to its city key.`,
  );
  assertIncludes(
    cityMarketPage,
    `data-${key}-decision-guide-framework={cityDecisionGuide.key === '${key}' ? DECISION_GUIDE_FRAMEWORK : undefined}`,
    `${cityName} guide must preserve the platform decision framework.`,
  );
  assertIncludes(
    cityMarketPage,
    `data-${key}-decision-guide-source={cityDecisionGuide.key === '${key}' ? DECISION_GUIDE_SOURCE : undefined}`,
    `${cityName} guide must preserve governed data source disclosure.`,
  );
  assertIncludes(
    cityMarketPage,
    `data-${key}-decision-guide-ai={cityDecisionGuide?.key === '${key}' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ai) : undefined}`,
    `${cityName} guide must explicitly avoid AI activation.`,
  );
  assertIncludes(
    cityMarketPage,
    `data-${key}-decision-guide-gis={cityDecisionGuide?.key === '${key}' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.gis) : undefined}`,
    `${cityName} guide must explicitly avoid GIS activation.`,
  );
  assertIncludes(
    cityMarketPage,
    `data-${key}-decision-guide-telemetry={cityDecisionGuide?.key === '${key}' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.telemetry) : undefined}`,
    `${cityName} guide must explicitly avoid telemetry activation.`,
  );
  assertIncludes(
    cityMarketPage,
    `data-${key}-decision-guide-ranking={cityDecisionGuide?.key === '${key}' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ranking) : undefined}`,
    `${cityName} guide must explicitly avoid rankings.`,
  );
  assertIncludes(
    cityMarketPage,
    `data-${key}-decision-guide-demographic-targeting={cityDecisionGuide?.key === '${key}' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.demographicTargeting) : undefined}`,
    `${cityName} guide must explicitly avoid demographic targeting.`,
  );
  assertIncludes(
    cityMarketPage,
    `data-${key}-decision-guide-school-ranking={cityDecisionGuide.key === '${key}' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.schoolRanking) : undefined}`,
    `${cityName} guide must explicitly avoid school ranking logic.`,
  );
  assertIncludes(
    cityMarketPage,
    `data-${key}-decision-guide-safety-ranking={cityDecisionGuide.key === '${key}' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.safetyRanking) : undefined}`,
    `${cityName} guide must explicitly avoid safety ranking logic.`,
  );
  assertIncludes(
    cityMarketPage,
    `data-${key}-decision-guide-investment-recommendation={cityDecisionGuide.key === '${key}' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.investmentRecommendation) : undefined}`,
    `${cityName} guide must explicitly avoid investment recommendations.`,
  );
  assertIncludes(
    cityMarketPage,
    '{item.label}',
    `${cityName} guide must render governed continuity labels directly.`,
  );
  assertIncludes(
    cityMarketPage,
    'data-local-decision-continuity-destination={item.destination}',
    `${cityName} guide must expose explicit continuity destination identity.`,
  );
  assertIncludes(
    cityMarketPage,
    'Explore {cityDecisionGuide.cityName} Neighborhoods',
    `${cityName} guide must provide direct city neighborhood continuity.`,
  );
  assertIncludes(
    platformSource,
    "{ label: `Search ${guide.cityName} Homes`, href: searchHref, destination: 'city-search' }",
    `${cityName} guide must preserve direct city search continuity.`,
  );
  assertIncludes(
    platformSource,
    "{ label: 'Buyer Guidance', href: '/buy', destination: 'buyer-guidance' }",
    `${cityName} guide must preserve Buyer continuity with accurate destination identity.`,
  );
  assertIncludes(
    platformSource,
    "{ label: 'Financing Guidance', href: '/buy#financing-confidence', destination: 'financing-confidence' }",
    `${cityName} guide must preserve financing education continuity without adding lender workflow.`,
  );
  assertIncludes(platformSource, "href: '/grand-plan'", `${cityName} guide must preserve Grand Plan continuity.`);
  assertIncludes(platformSource, "href: '/buy'", `${cityName} guide must preserve Buyer continuity.`);
  assertIncludes(platformSource, "href: '/sell'", `${cityName} guide must preserve Seller continuity.`);
  assertIncludes(
    cityMarketPage,
    'data-testid="reie-market-v8-decision-workspace"',
    'Certified city Market Decision Workspace must remain present.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid="cep-market-intelligence-summary"',
    'Certified city Market Decision Brief must remain present.',
  );

  assertNoProhibitedClaims(combinedSource, cityName);

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(packageData.scripts?.[packageScriptName], `package.json must expose the ${cityName} Decision Guide validation check.`);
}
