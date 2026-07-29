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
    assert(!pattern.test(source), `Lafayette Decision Guide must not include prohibited claim or activation text: ${pattern}`);
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
    'Lafayette Decision Guide must use the deterministic governed-data city guide builder.',
  );
  assertIncludes(
    cityMarketPage,
    "if (city.name === 'Lafayette') return 'lafayette';",
    'Lafayette Decision Guide must be explicitly gated to Lafayette.',
  );
  assertIncludes(
    cityMarketPage,
    "key: 'boulder' | 'louisville' | 'lafayette'",
    'City Decision Guide type must include Lafayette without broad activation.',
  );
  assertIncludes(
    cityMarketPage,
    "summaryEyebrow: 'Lafayette Decision Summary'",
    'Lafayette Decision Summary must be present.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={cityDecisionGuide ? `${cityDecisionGuide.key}-decision-guide-hero` : undefined}',
    'Lafayette Decision Guide hero must be explicitly governed.',
  );
  assertIncludes(
    cityMarketPage,
    "data-lafayette-decision-guide-framework={cityDecisionGuide.key === 'lafayette' ? 'context-tradeoffs-questions-evidence-next-step' : undefined}",
    'Lafayette guide must preserve Context -> Trade-offs -> Questions -> Evidence -> Next Step.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-framework`}',
    'Lafayette guide must expose the framework section.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-context`}',
    'Lafayette guide must expose housing and practical living context.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-tradeoffs`}',
    'Lafayette guide must expose balanced strengths and trade-offs.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-questions`}',
    'Lafayette guide must expose verification questions.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-neighborhoods`}',
    'Lafayette guide must expose neighborhood exploration continuity.',
  );
  assertIncludes(
    cityMarketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-continuity`}',
    'Lafayette guide must expose market, search, buyer, seller, financing, and Grand Plan continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "Indian Peaks, Waneka Lake, Old Town Lafayette, and Anna's Farm",
    'Lafayette guide must use existing governed Lafayette neighborhood evidence.',
  );
  assertIncludes(
    cityMarketPage,
    'Search {cityDecisionGuide.cityName} Homes',
    'Lafayette guide must provide direct Lafayette search continuity.',
  );
  assertIncludes(
    cityMarketPage,
    'Explore {cityDecisionGuide.cityName} Neighborhoods',
    'Lafayette guide must provide direct Lafayette neighborhood continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "{ label: 'Financing Guidance', href: '/buy#financing-confidence', destination: 'inquiry' }",
    'Lafayette guide must preserve financing education continuity without adding lender workflow.',
  );
  assertIncludes(
    cityMarketPage,
    "href: '/grand-plan'",
    'Lafayette guide must preserve Grand Plan continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "href: '/buy'",
    'Lafayette guide must preserve Buyer continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "href: '/sell'",
    'Lafayette guide must preserve Seller continuity.',
  );
  assertIncludes(
    cityMarketPage,
    "data-lafayette-decision-guide-ai={cityDecisionGuide?.key === 'lafayette' ? 'false' : undefined}",
    'Lafayette guide must explicitly avoid AI activation.',
  );
  assertIncludes(
    cityMarketPage,
    "data-lafayette-decision-guide-gis={cityDecisionGuide?.key === 'lafayette' ? 'false' : undefined}",
    'Lafayette guide must explicitly avoid GIS activation.',
  );
  assertIncludes(
    cityMarketPage,
    "data-lafayette-decision-guide-telemetry={cityDecisionGuide?.key === 'lafayette' ? 'false' : undefined}",
    'Lafayette guide must explicitly avoid telemetry activation.',
  );
  assertIncludes(
    cityMarketPage,
    "data-lafayette-decision-guide-ranking={cityDecisionGuide?.key === 'lafayette' ? 'false' : undefined}",
    'Lafayette guide must explicitly avoid rankings.',
  );
  assertIncludes(
    cityMarketPage,
    "data-lafayette-decision-guide-demographic-targeting={cityDecisionGuide?.key === 'lafayette' ? 'false' : undefined}",
    'Lafayette guide must explicitly avoid demographic targeting.',
  );
  assertIncludes(
    cityMarketPage,
    "data-lafayette-decision-guide-school-ranking={cityDecisionGuide.key === 'lafayette' ? 'false' : undefined}",
    'Lafayette guide must explicitly avoid school rankings.',
  );
  assertIncludes(
    cityMarketPage,
    "data-lafayette-decision-guide-safety-ranking={cityDecisionGuide.key === 'lafayette' ? 'false' : undefined}",
    'Lafayette guide must explicitly avoid safety rankings.',
  );
  assertIncludes(
    cityMarketPage,
    "data-lafayette-decision-guide-investment-recommendation={cityDecisionGuide.key === 'lafayette' ? 'false' : undefined}",
    'Lafayette guide must explicitly avoid investment recommendations.',
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
  assert(packageData.scripts?.['check:lafayette-decision-guide'], 'package.json must expose the Lafayette Decision Guide validation check.');

  console.log('[lafayette-decision-guide] ok: guide architecture, Lafayette continuity, fair-housing boundaries, and prohibited activations verified.');
}

main().catch((error) => {
  console.error('[lafayette-decision-guide] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
