import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function assertNoExcludedRuntime(source: string, label: string) {
  assert(
    !source.match(/OpenAI|chatbot|GIS Sprint 9|provider connection|external API|Prisma\.|prisma\.|migration|automated valuation score|forecast guarantee|appreciation guarantee/i),
    `${label} must not introduce excluded Sprint 4 runtime capabilities.`,
  );
}

async function main() {
  const [
    cityMarketPage,
    neighborhoodMarketPage,
    marketExperience,
    packageJson,
    gisLicensingStandard,
    searchRoute,
    propertyPage,
    valuationRoute,
  ] = await Promise.all([
    readFile('app/market/[city]/page.tsx', 'utf8'),
    readFile('app/market/[city]/[slug]/page.tsx', 'utf8'),
    readFile('lib/marketIntelligenceExperience.ts', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('docs/project-atlas/geographic-intelligence/GIS-1.0-LICENSING-AND-ATTRIBUTION-STANDARD.md', 'utf8'),
    readFile('app/api/search/route.ts', 'utf8'),
    readFile('app/properties/[id]/page.tsx', 'utf8'),
    readFile('app/api/valuation/route.ts', 'utf8'),
  ]);

  assert(cityMarketPage.includes('data-testid="cep-market-intelligence-summary"'), 'City market page must expose the Sprint 4 market summary.');
  assert(cityMarketPage.includes('data-market-intelligence-scope="city"'), 'City market summary must identify city scope.');
  assert(cityMarketPage.includes('data-market-intelligence-provider="none"'), 'City market summary must not introduce provider activation.');
  assert(cityMarketPage.includes('data-market-intelligence-ai-generated="false"'), 'City market summary must identify non-AI guidance.');
  assert(cityMarketPage.includes('data-market-intelligence-gis-activated="false"'), 'City market summary must identify no GIS activation.');
  assert(cityMarketPage.includes('data-testid="cep-market-intelligence-next-steps"'), 'City market page must expose next-step metadata.');
  assert(cityMarketPage.includes('href: formatSearchHref(city.name)') || marketExperience.includes("intent: 'search'"), 'City market next steps must preserve search integration.');
  assert(cityMarketPage.includes('href: \'/sell\'') || marketExperience.includes("href: '/sell'"), 'City market next steps must preserve seller review integration.');
  assert(cityMarketPage.includes('id="market-neighborhood-context"'), 'City market page must expose neighborhood context anchor.');

  assert(neighborhoodMarketPage.includes('data-testid="cep-market-intelligence-summary"'), 'Neighborhood page must expose the Sprint 4 market summary.');
  assert(neighborhoodMarketPage.includes('data-market-intelligence-scope="neighborhood"'), 'Neighborhood market summary must identify neighborhood scope.');
  assert(neighborhoodMarketPage.includes('data-market-intelligence-provider="none"'), 'Neighborhood market summary must not introduce provider activation.');
  assert(neighborhoodMarketPage.includes('data-market-intelligence-ai-generated="false"'), 'Neighborhood market summary must identify non-AI guidance.');
  assert(neighborhoodMarketPage.includes('data-market-intelligence-gis-activated="false"'), 'Neighborhood market summary must identify no GIS activation.');
  assert(neighborhoodMarketPage.includes('data-testid="cep-market-intelligence-source-note"'), 'Neighborhood market page must expose source boundary copy.');

  assert(marketExperience.includes('buildCityMarketExperience'), 'Market experience helper must expose city market summary builder.');
  assert(marketExperience.includes('buildNeighborhoodMarketExperience'), 'Market experience helper must expose neighborhood market summary builder.');
  assert(marketExperience.includes('It is not a forecast, appraisal, automated valuation, or provider-fed geographic analysis.'), 'City market source note must avoid unsupported certainty.');
  assert(marketExperience.includes('does not activate GIS providers, external geographic services, or AI-generated recommendations'), 'Neighborhood source note must preserve GIS and AI boundaries.');
  assert(marketExperience.includes('does not predict appreciation, availability, or tour access'), 'Neighborhood timing note must avoid unsupported prediction claims.');
  assert(marketExperience.includes('without promising future movement'), 'City direction note must avoid forecast claims.');

  assert(searchRoute.includes('export async function GET'), 'Sprint 4 must preserve search API route.');
  assert(propertyPage.includes('data-testid="cep-property-decision-brief"'), 'Sprint 4 must preserve certified property intelligence brief.');
  assert(valuationRoute.includes('export async function POST'), 'Sprint 4 must preserve existing seller intake backend boundary.');
  assert(gisLicensingStandard.includes('does not authorize provider contact'), 'GIS provider-contact boundary must remain documented.');

  for (const [source, label] of [
    [cityMarketPage, 'City market page'],
    [neighborhoodMarketPage, 'Neighborhood market page'],
    [marketExperience, 'Market experience helper'],
  ] as const) {
    assertNoExcludedRuntime(source, label);
  }

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(
    packageData.scripts?.['check:cep-market-intelligence-baseline'],
    'package.json must expose the CEP Sprint 4 market intelligence baseline check.',
  );

  console.log('[cep-market-intelligence-baseline] ok: market summaries, route continuity, source boundaries, and GIS/AI/provider exclusions verified.');
}

main().catch((error) => {
  console.error('[cep-market-intelligence-baseline] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
