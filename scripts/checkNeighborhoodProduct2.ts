import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function assertIncludes(source: string, expected: string, message: string) {
  assert(source.includes(expected), message);
}

function assertNoProhibitedClaims(source: string) {
  const prohibited = [
    /best neighborhood/i,
    /safest neighborhood/i,
    /school ranking/i,
    /crime score/i,
    /appreciation prediction/i,
    /investment recommendation/i,
    /demographic recommendation/i,
    /protected-class/i,
    /OpenAI/i,
    /activate GIS/i,
    /activate telemetry/i,
    /new data provider/i,
    /Prisma\./i,
    /prisma\./i,
    /migration/i,
  ];

  for (const pattern of prohibited) {
    assert(!pattern.test(source), `Neighborhood Product 2 must not include prohibited claim or activation text: ${pattern}`);
  }
}

async function main() {
  const [neighborhoodPage, marketExperience, packageJson] = await Promise.all([
    readFile('app/market/[city]/[slug]/page.tsx', 'utf8'),
    readFile('lib/marketIntelligenceExperience.ts', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);

  assertIncludes(
    neighborhoodPage,
    'data-testid="neighborhood-product-2-hero"',
    'Neighborhood Product 2 hero must be explicitly governed.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-testid="neighborhood-product-2-first-value"',
    'Neighborhood first-value interpretation must appear in the hero.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-testid="neighborhood-product-2-decision-framework"',
    'Neighborhood page must expose the Local Authority decision framework.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-neighborhood-product-2-framework="context-tradeoffs-questions-evidence-next-step"',
    'Neighborhood framework must preserve Context -> Trade-offs -> Questions -> Evidence -> Next Step.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-testid="neighborhood-product-2-verification"',
    'Neighborhood page must expose verification guidance before lower detail.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-neighborhood-product-2-fair-housing="neutral-non-ranking"',
    'Neighborhood page must declare neutral fair-housing posture.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-neighborhood-product-2-school-ranking="false"',
    'Neighborhood Product 2 must explicitly avoid school rankings.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-neighborhood-product-2-safety-ranking="false"',
    'Neighborhood Product 2 must explicitly avoid safety rankings.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-neighborhood-product-2-demographic-targeting="false"',
    'Neighborhood Product 2 must explicitly avoid demographic targeting.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-neighborhood-product-2-investment-projection="false"',
    'Neighborhood Product 2 must explicitly avoid investment projections.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-testid="cep-market-intelligence-summary"',
    'Certified neighborhood market summary must remain present.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-market-intelligence-scope="neighborhood"',
    'Neighborhood market scope metadata must remain present.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-market-intelligence-provider="none"',
    'Neighborhood market page must preserve no-provider boundary.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-market-intelligence-ai-generated="false"',
    'Neighborhood market page must preserve non-AI boundary.',
  );
  assertIncludes(
    neighborhoodPage,
    'data-market-intelligence-gis-activated="false"',
    'Neighborhood market page must preserve no-GIS boundary.',
  );
  assertIncludes(
    neighborhoodPage,
    'href={searchHref}',
    'Hero and framework must preserve neighborhood-to-search transition through the governed search href.',
  );
  assertIncludes(
    neighborhoodPage,
    'href={cityMarketHref}',
    'Hero and framework must preserve neighborhood-to-city-market transition.',
  );
  assertIncludes(
    marketExperience,
    'does not activate GIS providers, external geographic services, or AI-generated recommendations',
    'Market source note must preserve GIS/provider/AI exclusions.',
  );
  assertIncludes(
    marketExperience,
    'does not predict appreciation, availability, or tour access',
    'Neighborhood timing language must remain non-predictive.',
  );

  assertNoProhibitedClaims(neighborhoodPage);

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(packageData.scripts?.['check:neighborhood-product-2'], 'package.json must expose the Neighborhood Product 2 validation check.');

  console.log('[neighborhood-product-2] ok: decision framework, first-value interpretation, fair-housing boundaries, continuity, and prohibited activations verified.');
}

main().catch((error) => {
  console.error('[neighborhood-product-2] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
