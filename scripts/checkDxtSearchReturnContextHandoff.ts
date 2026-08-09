import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function main() {
  const [utility, searchInterface, selectedDrawer, propertyPage, packageJson, tsconfigWorker] = await Promise.all([
    readFile('lib/search/searchReturnContext.ts', 'utf8'),
    readFile('components/search/SearchInterface.tsx', 'utf8'),
    readFile('components/maps/SelectedPropertyDrawer.tsx', 'utf8'),
    readFile('app/properties/[id]/page.tsx', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('tsconfig.worker.json', 'utf8'),
  ]);

  assert(utility.includes("SEARCH_RETURN_SOURCE_VALUE = 'search'"), 'Search return source must be explicit.');
  assert(utility.includes("SEARCH_RETURN_PATH_PARAM = 'returnTo'"), 'Property return path param must be explicit.');
  assert(utility.includes('SEARCH_RETURN_ALLOWED_CRITERIA'), 'Allowed Search return criteria must be centralized.');
  for (const key of ['q', 'city', 'minPrice', 'maxPrice', 'beds', 'baths', 'propertyType']) {
    assert(utility.includes(`'${key}'`), `Allowed Search return criteria must include ${key}.`);
  }
  for (const blockedKey of ['sort', 'bounds', 'zoom', 'scroll', 'advancedOpen', 'hovered', 'comparison']) {
    assert(!utility.includes(`'${blockedKey}'`), `Search return context must not include ${blockedKey}.`);
  }
  assert(utility.includes("value.startsWith('/search')"), 'Return paths must be internal Search paths.');
  assert(utility.includes("value.startsWith('//') || value.includes('://')"), 'Return paths must reject external origins and protocol URLs.');
  assert(utility.includes("parsed.pathname !== '/search'"), 'Return paths must reject non-Search destinations.');
  assert(utility.includes('isSafePropertyId'), 'Selected property identity must be bounded and validated.');
  assert(utility.includes('isSearchReturnView'), 'Mobile view hint must be bounded.');
  assert(utility.includes('parsePropertySearchReturnContext'), 'Property route must use a bounded parser.');
  assert(utility.includes('parseSearchReturnContext'), 'Search route must use a bounded parser.');

  assert(searchInterface.includes('parseSearchReturnContext'), 'Search must parse explicit return context.');
  assert(searchInterface.includes('data-search-return-context-handoff="bounded-url-and-history-state"'), 'Search must expose bounded return-context handoff metadata.');
  assert(searchInterface.includes('data-search-property-context-restoration="deferred"'), 'Full property context restoration must remain deferred.');
  assert(searchInterface.includes('data-search-map-visual-normalization="deferred"'), 'Map Visual-Language Normalization must remain deferred.');
  assert(searchInterface.includes('data-search-brokerage-disclosure-hold="EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING"'), 'Brokerage disclosure hold must remain active.');
  assert(searchInterface.includes('restoreSelectedId'), 'Search must restore selected property only from bounded context.');
  assert(searchInterface.includes('getVisibleSelectionId'), 'Search must clear stale or invisible selected-property context.');
  assert(searchInterface.includes('setMobileView(returnContext.view)'), 'Search must restore only bounded mobile list/map hints.');
  assert(searchInterface.includes('updateUrl: !returnContext'), 'Search must not strip explicit return context on initial return restoration.');
  assert(searchInterface.includes('<SelectedPropertyDrawer property={selectedProperty} onClose={() => setSelectedId(null)} />'), 'Selected property drawer integration must preserve existing preview contract.');

  assert(selectedDrawer.includes('buildSearchReturnPath'), 'Selected drawer must build a bounded Search return URL.');
  assert(selectedDrawer.includes('buildPropertyHrefWithSearchReturn'), 'Selected drawer must attach only validated return URLs to property links.');
  assert(selectedDrawer.includes('new URLSearchParams(window.location.search)'), 'Selected drawer must use URL-backed criteria, not hidden storage.');
  assert(selectedDrawer.includes('data-search-return-handoff="bounded-url"'), 'Selected drawer must expose bounded URL handoff metadata.');
  assert(selectedDrawer.includes('data-testid="reie-selected-property-detail-link"'), 'Selected drawer must preserve the property detail CTA.');

  assert(propertyPage.includes('searchParams?: Promise<Record<string, string | string[] | undefined>>'), 'Property page must receive query context without route changes.');
  assert(propertyPage.includes('parsePropertySearchReturnContext'), 'Property page must validate return context before rendering.');
  assert(propertyPage.includes('data-testid="reie-property-search-return-context"'), 'Property page must render contextual return action only for valid Search origin.');
  assert(propertyPage.includes('data-testid="reie-property-return-to-search"'), 'Property page must expose accessible Return to Search Results action.');
  assert(propertyPage.includes('Return to Search Results'), 'Property page return action must use bounded customer-facing language.');
  assert(propertyPage.includes('data-testid="reie-property-direct-entry-context"'), 'Property page must preserve direct-entry fallback without fabricated Search origin.');
  assert(propertyPage.includes('data-search-return-context="none"'), 'Direct property entry must remain independent of Search context.');

  const propertyReturnSnippet = propertyPage.slice(
    propertyPage.indexOf('data-testid="reie-property-search-return-context"'),
    propertyPage.indexOf('<DecisionRow label="Calculated Price / Sq Ft"'),
  );
  assert(propertyReturnSnippet.includes('Return to Search Results'), 'Property return-context snippet must be present for prohibited-language review.');

  for (const [label, source] of [
    ['utility', utility],
    ['search interface', searchInterface],
    ['selected drawer', selectedDrawer],
    ['property return context', propertyReturnSnippet],
  ] as const) {
    assert(!source.match(/localStorage|sessionStorage|document\.cookie|navigator\.sendBeacon|gtag|analytics\(|trackEvent|CRM|customer profile|recommended lender|best home|ideal for|school ranking|crime ranking|approved for|qualified for|affordable/i), `${label} must not introduce persistence, telemetry, CRM, provider, recommendation, qualification, affordability, or protected claim language.`);
  }

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert.equal(
    packageData.scripts?.['check:dxt-search-return-context-handoff'],
    'npm run worker:build && node dist/scripts/checkDxtSearchReturnContextHandoff.js',
    'package.json must expose the DXT Search return-context handoff check.',
  );
  assert(tsconfigWorker.includes('scripts/checkDxtSearchReturnContextHandoff.ts'), 'Worker tsconfig must include the focused return-context handoff check.');
  assert(tsconfigWorker.includes('lib/search/searchReturnContext.ts'), 'Worker tsconfig must include the bounded Search return context utility.');

  console.log('[dxt-search-return-context-handoff] ok: internal Search return URL, explicit origin, bounded criteria, selected-property restoration, mobile hint, direct-entry fallback, no persistence, no telemetry, and protected deferrals verified.');
}

main().catch((error) => {
  console.error('[dxt-search-return-context-handoff] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
