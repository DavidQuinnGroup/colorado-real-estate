import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function assertIncludes(source: string, needle: string, message: string) {
  assert(source.includes(needle), message);
}

function assertExcludes(source: string, needle: string, message: string) {
  assert(!source.includes(needle), message);
}

async function main() {
  const [saveSearch, searchReturnContext, packageJson, tsconfigWorker, saveSearchApi] = await Promise.all([
    readFile('components/maps/SaveSearch.tsx', 'utf8'),
    readFile('lib/search/searchReturnContext.ts', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('tsconfig.worker.json', 'utf8'),
    readFile('app/api/save-search/route.ts', 'utf8'),
  ]);

  assertIncludes(saveSearch, 'buildReturnToSearchHref(searchParams)', 'Save Search must build a return link from current Search params.');
  assertIncludes(saveSearch, 'isSafeSearchReturnPath(safePath) ? safePath : \'/search\'', 'Malformed return context must fail closed to /search.');
  assertIncludes(saveSearch, 'SEARCH_RETURN_ALLOWED_CRITERIA', 'Return link must reuse the existing allowed Search criteria list.');
  assertIncludes(saveSearch, 'SEARCH_RETURN_SOURCE_VALUE', 'Return link must preserve the bounded Search origin marker.');
  assertIncludes(saveSearch, 'SEARCH_RETURN_SELECTED_PARAM', 'Return link must only preserve selected-listing context through existing validated search return behavior.');
  assertIncludes(saveSearch, 'isSearchReturnView(view)', 'Return link must only preserve bounded list/map view hints.');
  assertIncludes(searchReturnContext, "value.startsWith('//') || value.includes('://')", 'Search return context must reject external and protocol URLs.');
  assertIncludes(searchReturnContext, "parsed.pathname !== '/search'", 'Search return context must reject non-Search destinations.');

  for (const blockedParam of ['sort', 'bounds', 'zoom', 'scroll', 'advancedOpen', 'hovered', 'comparison']) {
    assertExcludes(saveSearch, `nextParams.set('${blockedParam}'`, `Return to Search must not preserve ${blockedParam}.`);
  }

  assertIncludes(saveSearch, 'MARKET_CONTEXT_BY_CITY', 'Known-city Market route allowlist must be local and explicit.');
  assertIncludes(saveSearch, 'getMarketContextLink(city)', 'Market link must depend on the current city.');
  assertIncludes(saveSearch, 'marketContextLink ? (', 'Unknown-city Market link must be omitted.');
  assertIncludes(saveSearch, 'data-testid="reie-save-search-market-link"', 'Known city Market link must render in the success state.');

  assertIncludes(saveSearch, 'data-testid="reie-save-search-continuation"', 'Success state must expose a continuation group.');
  assertIncludes(saveSearch, 'data-testid="reie-save-search-return-link"', 'Success state must include Return to this search.');
  assertIncludes(saveSearch, 'data-testid="reie-save-search-grand-plan-link"', 'Success state must link to Grand Plan.');
  assertIncludes(saveSearch, 'href="/grand-plan"', 'Grand Plan link must use the canonical route.');
  assertIncludes(saveSearch, 'data-testid="reie-save-search-sources-link"', 'Success state must link to Sources.');
  assertIncludes(saveSearch, 'href="/sources"', 'Sources link must use the canonical route.');
  assertIncludes(saveSearch, 'data-testid="reie-save-search-handoff-link"', 'Success state must include the certified professional handoff path.');
  assertIncludes(saveSearch, 'href="/contact"', 'Professional handoff must use the existing Contact route.');
  assertIncludes(saveSearch, 'data-testid="reie-save-search-reset"', 'Save another must remain available.');

  assertExcludes(saveSearch, 'data-save-search-user-id', 'Save Search must not expose response userId in customer-facing DOM.');
  assertExcludes(saveSearch, 'data-save-search-id', 'Save Search must not expose savedSearchId in customer-facing DOM.');
  assertExcludes(saveSearch, 'saveResult?.userId', 'Response userId must not be used by the Save Search presentation layer.');
  assertExcludes(saveSearch, 'saveResult?.savedSearchId', 'Response savedSearchId must not be used by the Save Search presentation layer.');
  assertExcludes(saveSearch, 'localStorage', 'Save Search must not add local storage persistence.');
  assertExcludes(saveSearch, 'sessionStorage', 'Save Search must not add session storage persistence.');
  assertExcludes(saveSearch, 'navigator.sendBeacon', 'Save Search must not add telemetry.');
  assertExcludes(saveSearch, 'analytics', 'Save Search must not add analytics.');
  assertExcludes(saveSearch, 'data-save-search-property-link', 'Save Search must not add a direct Property link.');
  assertIncludes(saveSearch, 'data-save-search-direct-property-link="false"', 'Save Search must explicitly mark direct Property links as absent.');

  assertIncludes(
    saveSearch,
    'Automated updates are not currently active; continue manually through Search, Market, or Sources.',
    'Blocked readiness copy must avoid alert-delivery promises.',
  );
  for (const forbiddenPromise of ['email delivery', 'alert delivery', 'delivered when', 'daily alerts', 'instant alerts', 'we will email']) {
    assertExcludes(saveSearch.toLowerCase(), forbiddenPromise, `Save Search copy must not promise ${forbiddenPromise}.`);
  }

  assertIncludes(saveSearch, "fetch('/api/save-search'", 'Save behavior must preserve the existing save-search API route.');
  assertIncludes(saveSearchApi, "schemaVersion: 'reie-save-search-v2'", 'Save-search API contract must remain unchanged.');

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert.equal(
    packageData.scripts?.['check:save-search-decision-continuity'],
    'npm run worker:build && node dist/scripts/checkSaveSearchDecisionContinuity.js',
    'package.json must expose the Save Search decision continuity check.',
  );
  assertIncludes(tsconfigWorker, 'scripts/checkSaveSearchDecisionContinuity.ts', 'Worker tsconfig must include the Save Search decision continuity check.');

  console.log(
    '[save-search-decision-continuity] ok: safe Search return, known-city Market continuation, unknown-city omission, Grand Plan, Sources, handoff, Save Another, identifier containment, blocked-readiness copy, and protected-system boundaries verified.',
  );
}

main().catch((error) => {
  console.error('[save-search-decision-continuity] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
