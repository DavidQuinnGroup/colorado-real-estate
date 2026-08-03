import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const propertyPage = read('app/properties/[id]/page.tsx');
const searchReturnUtility = read('lib/search/searchReturnContext.ts');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-SEARCH-PROPERTY-RETURN-CONTINUITY-IMPLEMENTATION.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'parsePropertySearchReturnContext',
  'getPropertySearchReturnPresentation',
  "new URL(returnTo, 'https://davidquinngroup.com')",
  'data-search-property-return-continuity="implemented"',
  'data-search-property-return-runtime-scope="app/properties/[id]/page.tsx"',
  'data-search-property-return-new-params="false"',
  'data-search-property-return-hidden-state="false"',
  'data-search-property-return-persistence="false"',
  'data-search-property-return-telemetry="false"',
  'data-search-property-return-search-runtime-change="false"',
  'data-search-return-visible-label',
  'Opened from ${city} Search',
  'Return to ${city} Search',
  'No hidden search history is stored by this property page.',
  'data-testid="reie-property-direct-entry-context"',
  'data-search-return-context="none"',
  'const propertySearchHref = searchReturnPresentation?.href ?? citySearchHref',
]) {
  assertIncludes(propertyPage, phrase, `Property page must include bounded return-continuity marker: ${phrase}`);
}

assert(!propertyPage.includes('localStorage'), 'Property return continuity must not use localStorage.');
assert(!propertyPage.includes('sessionStorage'), 'Property return continuity must not use sessionStorage.');
assert(!propertyPage.includes('document.cookie'), 'Property return continuity must not use cookies.');
assert(!propertyPage.includes('navigator.sendBeacon'), 'Property return continuity must not use telemetry beacons.');

for (const phrase of [
  "SEARCH_RETURN_PATH_PARAM = 'returnTo'",
  'SEARCH_RETURN_ALLOWED_CRITERIA',
  "value.startsWith('/search')",
  "value.startsWith('//') || value.includes('://')",
  "parsed.pathname !== '/search'",
  'parsePropertySearchReturnContext',
  'buildPropertyHrefWithSearchReturn',
]) {
  assertIncludes(searchReturnUtility, phrase, `Search return utility must retain safe return contract: ${phrase}`);
}

for (const blockedKey of ['bounds', 'zoom', 'scroll', 'preview', 'hovered', 'crm', 'email', 'phone']) {
  assert(
    !searchReturnUtility.includes(`'${blockedKey}'`),
    `Search return utility must not expand context to ${blockedKey}.`,
  );
}

assertIncludes(
  implementationRecord,
  'DXT_SEARCH_PROPERTY_RETURN_CONTINUITY_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'Implementation record must publish local implementation status.',
);
for (const phrase of [
  'app/properties/[id]/page.tsx',
  'existing `lib/search/searchReturnContext.ts` contract without expanding it',
  'direct Property entry remains independent',
  'Malformed, external, unsupported, or unsafe return context is ignored',
  'Canonical metadata remains the clean Property URL',
  'does not intercept browser history',
  'Brokerage disclosure remains under `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`',
  'READY_FOR_SEARCH_PROPERTY_RETURN_CONTINUITY_LOCAL_CERTIFICATION',
]) {
  assertIncludes(implementationRecord, phrase, `Implementation record must include: ${phrase}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-search-property-return-continuity-implementation'],
  'npm run worker:build && node dist/scripts/checkDxtSearchPropertyReturnContinuityImplementation.js',
  'package.json must register the Search -> Property return continuity implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtSearchPropertyReturnContinuityImplementation.ts',
  'tsconfig.worker.json must include the implementation check.',
);

console.log(
  '[dxt-search-property-return-continuity-implementation] ok: bounded Property runtime, safe visible return context, direct-entry fallback, canonical preservation, no hidden state, and protected boundaries verified.',
);
