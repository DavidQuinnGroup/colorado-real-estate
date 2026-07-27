import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function assertNoRuntimeActivation(source: string, label: string, options: { allowExistingDataAccess?: boolean } = {}) {
  const blockedPattern = options.allowExistingDataAccess
    ? /gtag|GoogleAnalytics|\bSegment\b|Mixpanel|Amplitude|posthog|document\.cookie|localStorage\.setItem|fetch\(['"]\/api\/track-click|trackClick\(|trackForensicInteraction|GIS Sprint 9|OpenAI|chatbot|provider connection|migration/i
    : /gtag|GoogleAnalytics|\bSegment\b|Mixpanel|Amplitude|posthog|document\.cookie|localStorage\.setItem|fetch\(['"]\/api\/track-click|trackClick\(|trackForensicInteraction|GIS Sprint 9|OpenAI|chatbot|provider connection|Prisma\.|prisma\.|migration/i;

  assert(
    !source.match(blockedPattern),
    `${label} must not activate telemetry vendors, tracking APIs, GIS, AI, providers, Prisma, or migrations.`,
  );
}

async function main() {
  const [
    marketIndex,
    footer,
    searchPage,
    searchInterface,
    mapSidebar,
    propertyPage,
    cityMarketPage,
    neighborhoodMarketPage,
    sellPage,
    homeValueEstimator,
    measurementHelper,
    trackClickRoute,
    packageJson,
  ] = await Promise.all([
    readFile('app/market/page.tsx', 'utf8'),
    readFile('components/Footer.tsx', 'utf8'),
    readFile('app/search/page.tsx', 'utf8'),
    readFile('components/search/SearchInterface.tsx', 'utf8'),
    readFile('components/maps/MapSidebar.tsx', 'utf8'),
    readFile('app/properties/[id]/page.tsx', 'utf8'),
    readFile('app/market/[city]/page.tsx', 'utf8'),
    readFile('app/market/[city]/[slug]/page.tsx', 'utf8'),
    readFile('app/sell/page.tsx', 'utf8'),
    readFile('components/HomeValueEstimator.tsx', 'utf8'),
    readFile('lib/customerJourneyMeasurement.ts', 'utf8'),
    readFile('app/api/track-click/route.ts', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);

  assertIncludes(marketIndex, 'data-testid="cep-market-discovery-page"', 'Sprint 5 must add a governed market discovery destination.');
  assertIncludes(marketIndex, 'data-cep-measurement-active="false"', 'Market discovery must keep measurement inactive.');
  assertIncludes(marketIndex, 'No analytics vendor, cookie, tracking system, or new persistence is active.', 'Market discovery must disclose passive measurement posture.');
  assertIncludes(marketIndex, 'href="/search"', 'Market discovery must link to certified search.');
  assertIncludes(marketIndex, 'href="/sell"', 'Market discovery must link to certified seller review.');
  assertIncludes(marketIndex, 'buildCityMarketExperience', 'Market discovery must reuse existing market intelligence helper.');

  assertIncludes(footer, "{ label: 'Market', href: '/market' }", 'Footer must expose market discovery.');
  assertIncludes(searchPage, 'href: \'/market\'', 'Search authority links must expose market discovery.');
  assertIncludes(searchInterface, 'data-testid="cep-navigation-search-journey"', 'Search must expose journey continuity metadata.');
  assertIncludes(mapSidebar, 'data-testid="cep-navigation-sidebar-journey"', 'Search sidebar must expose journey continuity metadata.');
  assertIncludes(propertyPage, 'data-testid="cep-navigation-property-journey"', 'Property page must expose journey continuity metadata.');
  assertIncludes(cityMarketPage, 'data-testid="cep-navigation-market-journey"', 'City market page must expose journey continuity metadata.');
  assertIncludes(neighborhoodMarketPage, 'data-testid="cep-navigation-neighborhood-market-journey"', 'Neighborhood market page must expose journey continuity metadata.');
  assertIncludes(sellPage, 'data-testid="cep-navigation-seller-journey"', 'Seller page must expose journey continuity metadata.');
  assertIncludes(homeValueEstimator, 'data-cep-measurement-active="false"', 'Seller intake must expose passive measurement posture.');

  assertIncludes(measurementHelper, 'data-cep-measurement-active', 'Measurement helper must provide passive measurement attributes.');
  assertIncludes(measurementHelper, 'customerJourneyStages', 'Measurement helper must define governed journey stages.');
  assertIncludes(trackClickRoute, 'export async function GET', 'Existing track-click route must remain unchanged and available.');

  for (const [source, label, allowExistingDataAccess] of [
    [marketIndex, 'market index'],
    [footer, 'footer'],
    [searchPage, 'search page'],
    [searchInterface, 'search interface'],
    [mapSidebar, 'map sidebar'],
    [propertyPage, 'property page', true],
    [cityMarketPage, 'city market page'],
    [neighborhoodMarketPage, 'neighborhood market page', true],
    [sellPage, 'seller page'],
    [homeValueEstimator, 'seller intake'],
    [measurementHelper, 'measurement helper'],
  ] as const) {
    assertNoRuntimeActivation(source, label, { allowExistingDataAccess: Boolean(allowExistingDataAccess) });
  }

  assertNotIncludes(marketIndex, 'appraisal estimate', 'Market discovery must not introduce valuation claims.');
  assertNotIncludes(marketIndex, 'AI recommendation', 'Market discovery must not introduce AI guidance claims.');

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(
    packageData.scripts?.['check:cep-navigation-conversion-measurement-baseline'],
    'package.json must expose the Sprint 5 navigation/conversion/measurement check.',
  );

  console.log('[cep-navigation-conversion-measurement-baseline] ok: navigation continuity, passive measurement readiness, market discovery, and exclusion boundaries verified.');
}

main().catch((error) => {
  console.error('[cep-navigation-conversion-measurement-baseline] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
