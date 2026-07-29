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
    assert(!pattern.test(source), `Boulder Decision Guide must not include prohibited claim or activation text: ${pattern}`);
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
    'Boulder Decision Guide must use the deterministic governed-data city guide builder.',
  );
  assertIncludes(
    cityMarketPage,
    "if (city.name === 'Boulder') return 'boulder';",
    'Boulder Decision Guide must remain explicitly gated to Boulder.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={cityDecisionGuide ? `${cityDecisionGuide.key}-decision-guide-hero` : undefined}',
    'Boulder Decision Guide hero must be explicitly governed.',
  );
  assertIncludes(
    cityMarketPage,
    "summaryEyebrow: 'Boulder Decision Summary'",
    'Boulder Decision Summary must be present.',
  );
  assertIncludes(
    cityMarketPage,
    "data-boulder-decision-guide-framework={cityDecisionGuide.key === 'boulder' ? 'context-tradeoffs-questions-evidence-next-step' : undefined}",
    'Boulder guide must preserve Context -> Trade-offs -> Questions -> Evidence -> Next Step.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-framework`}',
    'Boulder guide must expose the framework section.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-context`}',
    'Boulder guide must expose housing and practical living context.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-tradeoffs`}',
    'Boulder guide must expose balanced strengths and trade-offs.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-questions`}',
    'Boulder guide must expose verification questions.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-neighborhoods`}',
    'Boulder guide must expose neighborhood exploration continuity.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-continuity`}',
    'Boulder guide must expose market, search, buyer, seller, and Grand Plan continuity.',
  );
  assertIncludes(
    cityMarketPage,
    'Search {cityDecisionGuide.cityName} Homes',
    'Boulder guide must provide direct Boulder search continuity.',
  );
  assertIncludes(
    cityMarketPage,
    'Explore {cityDecisionGuide.cityName} Neighborhoods',
    'Boulder guide must provide direct Boulder neighborhood continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "href: '/grand-plan'",
    'Boulder guide must preserve Grand Plan continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "href: '/buy'",
    'Boulder guide must preserve Buyer continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "href: '/sell'",
    'Boulder guide must preserve Seller continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "data-boulder-decision-guide-ai={cityDecisionGuide?.key === 'boulder' ? 'false' : undefined}",
    'Boulder guide must explicitly avoid AI activation.',
  );
  assertIncludes(
    cityMarketPage,
    "data-boulder-decision-guide-gis={cityDecisionGuide?.key === 'boulder' ? 'false' : undefined}",
    'Boulder guide must explicitly avoid GIS activation.',
  );
  assertIncludes(
    cityMarketPage,
    "data-boulder-decision-guide-telemetry={cityDecisionGuide?.key === 'boulder' ? 'false' : undefined}",
    'Boulder guide must explicitly avoid telemetry activation.',
  );
  assertIncludes(
    cityMarketPage,
    "data-boulder-decision-guide-ranking={cityDecisionGuide?.key === 'boulder' ? 'false' : undefined}",
    'Boulder guide must explicitly avoid rankings.',
  );
  assertIncludes(
    cityMarketPage,
    "data-boulder-decision-guide-demographic-targeting={cityDecisionGuide?.key === 'boulder' ? 'false' : undefined}",
    'Boulder guide must explicitly avoid demographic targeting.',
  );
  assertIncludes(
    cityMarketPage,
    "data-boulder-decision-guide-school-ranking={cityDecisionGuide.key === 'boulder' ? 'false' : undefined}",
    'Boulder guide must explicitly avoid school rankings.',
  );
  assertIncludes(
    cityMarketPage,
    "data-boulder-decision-guide-safety-ranking={cityDecisionGuide.key === 'boulder' ? 'false' : undefined}",
    'Boulder guide must explicitly avoid safety rankings.',
  );
  assertIncludes(
    cityMarketPage,
    "data-boulder-decision-guide-investment-recommendation={cityDecisionGuide.key === 'boulder' ? 'false' : undefined}",
    'Boulder guide must explicitly avoid investment recommendations.',
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
  assert(packageData.scripts?.['check:boulder-decision-guide'], 'package.json must expose the Boulder Decision Guide validation check.');

  console.log('[boulder-decision-guide] ok: guide architecture, Boulder continuity, fair-housing boundaries, and prohibited activations verified.');
}

main().catch((error) => {
  console.error('[boulder-decision-guide] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
