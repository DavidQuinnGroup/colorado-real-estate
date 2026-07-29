import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function assertIncludes(source: string, expected: string, message: string) {
  assert(source.includes(expected), message);
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
    /OpenAI/i,
    /activate GIS/i,
    /activate telemetry/i,
    /new data provider/i,
    /Prisma\./i,
    /prisma\./i,
    /migration/i,
  ];

  for (const pattern of prohibited) {
    assert(!pattern.test(source), `Louisville Decision Guide must not include prohibited claim or activation text: ${pattern}`);
  }
}

async function main() {
  const [cityMarketPage, packageJson] = await Promise.all([
    readFile('app/market/[city]/page.tsx', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);

  assertIncludes(
    cityMarketPage,
    'function buildCityDecisionGuide',
    'Louisville Decision Guide must use the deterministic governed-data city guide builder.',
  );
  assertIncludes(
    cityMarketPage,
    "if (city.name === 'Louisville') return 'louisville';",
    'Louisville Decision Guide must be explicitly gated to Louisville.',
  );
  assertIncludes(
    cityMarketPage,
    "key: 'boulder' | 'louisville' | 'lafayette'",
    'City Decision Guide type must include Louisville without broad activation.',
  );
  assertIncludes(
    cityMarketPage,
    "summaryEyebrow: 'Louisville Decision Summary'",
    'Louisville Decision Summary must be present.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={cityDecisionGuide ? `${cityDecisionGuide.key}-decision-guide-hero` : undefined}',
    'Louisville Decision Guide hero must be explicitly governed.',
  );
  assertIncludes(
    cityMarketPage,
    "data-louisville-decision-guide-framework={cityDecisionGuide.key === 'louisville' ? 'context-tradeoffs-questions-evidence-next-step' : undefined}",
    'Louisville guide must preserve Context -> Trade-offs -> Questions -> Evidence -> Next Step.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-framework`}',
    'Louisville guide must expose the framework section.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-context`}',
    'Louisville guide must expose housing and practical living context.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-tradeoffs`}',
    'Louisville guide must expose balanced strengths and trade-offs.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-questions`}',
    'Louisville guide must expose verification questions.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-neighborhoods`}',
    'Louisville guide must expose neighborhood exploration continuity.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-continuity`}',
    'Louisville guide must expose market, search, buyer, seller, financing, and Grand Plan continuity.',
  );
  assertIncludes(
    cityMarketPage,
    'Old Town Louisville, Coal Creek Ranch, Centennial Valley, North End, and Steel Ranch',
    'Louisville guide must use existing governed Louisville neighborhood evidence.',
  );
  assertIncludes(
    cityMarketPage,
    'Search {cityDecisionGuide.cityName} Homes',
    'Louisville guide must provide direct Louisville search continuity.',
  );
  assertIncludes(
    cityMarketPage,
    'Explore {cityDecisionGuide.cityName} Neighborhoods',
    'Louisville guide must provide direct Louisville neighborhood continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "{ label: 'Financing Guidance', href: '/buy#financing-confidence', destination: 'inquiry' }",
    'Louisville guide must preserve financing education continuity without adding lender workflow.',
  );
  assertIncludes(
    cityMarketPage,
    "href: '/grand-plan'",
    'Louisville guide must preserve Grand Plan continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "href: '/buy'",
    'Louisville guide must preserve Buyer continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "href: '/sell'",
    'Louisville guide must preserve Seller continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "data-louisville-decision-guide-ai={cityDecisionGuide?.key === 'louisville' ? 'false' : undefined}",
    'Louisville guide must explicitly avoid AI activation.',
  );
  assertIncludes(
    cityMarketPage,
    "data-louisville-decision-guide-gis={cityDecisionGuide?.key === 'louisville' ? 'false' : undefined}",
    'Louisville guide must explicitly avoid GIS activation.',
  );
  assertIncludes(
    cityMarketPage,
    "data-louisville-decision-guide-telemetry={cityDecisionGuide?.key === 'louisville' ? 'false' : undefined}",
    'Louisville guide must explicitly avoid telemetry activation.',
  );
  assertIncludes(
    cityMarketPage,
    "data-louisville-decision-guide-ranking={cityDecisionGuide?.key === 'louisville' ? 'false' : undefined}",
    'Louisville guide must explicitly avoid rankings.',
  );
  assertIncludes(
    cityMarketPage,
    "data-louisville-decision-guide-demographic-targeting={cityDecisionGuide?.key === 'louisville' ? 'false' : undefined}",
    'Louisville guide must explicitly avoid demographic targeting.',
  );
  assertIncludes(
    cityMarketPage,
    "data-louisville-decision-guide-school-ranking={cityDecisionGuide.key === 'louisville' ? 'false' : undefined}",
    'Louisville guide must explicitly avoid school rankings.',
  );
  assertIncludes(
    cityMarketPage,
    "data-louisville-decision-guide-safety-ranking={cityDecisionGuide.key === 'louisville' ? 'false' : undefined}",
    'Louisville guide must explicitly avoid safety rankings.',
  );
  assertIncludes(
    cityMarketPage,
    "data-louisville-decision-guide-investment-recommendation={cityDecisionGuide.key === 'louisville' ? 'false' : undefined}",
    'Louisville guide must explicitly avoid investment recommendations.',
  );
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

  assertNoProhibitedClaims(cityMarketPage);

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(packageData.scripts?.['check:louisville-decision-guide'], 'package.json must expose the Louisville Decision Guide validation check.');

  console.log('[louisville-decision-guide] ok: guide architecture, Louisville continuity, fair-housing boundaries, and prohibited activations verified.');
}

main().catch((error) => {
  console.error('[louisville-decision-guide] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
