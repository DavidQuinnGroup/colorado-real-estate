import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  buildCustomerControlledComparisonWorkspace,
  CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS,
  CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MIN_SELECTIONS,
  CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE,
  parseCustomerControlledComparisonIds,
} from '../lib/property/customerControlledComparison.js';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string): void {
  assert(!source.includes(value), message);
}

function snippetAfter(source: string, marker: string, length: number): string {
  const start = source.indexOf(marker);
  assert(start >= 0, `Expected marker not found: ${marker}`);
  return source.slice(start, start + length);
}

const comparePage = read('app/properties/compare/page.tsx');
const cityComparePage = read('app/compare/page.tsx');
const comparisonContract = read('lib/property/customerControlledComparison.ts');
const publicPropertyRead = read('lib/property/publicPropertyRead.ts');
const searchInterface = read('components/search/SearchInterface.tsx');
const selectedDrawer = read('components/maps/SelectedPropertyDrawer.tsx');
const propertyPage = read('app/properties/[id]/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

assert.equal(CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE, '/properties/compare', 'Property comparison route must remain separate from city Compare.');
assert.equal(CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MIN_SELECTIONS, 2, 'Property comparison must require two selected homes.');
assert.equal(CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS, 3, 'Property comparison must cap customer selection at three homes.');
assert.equal(
  packageJson.scripts?.['check:customer-controlled-property-shortlist'],
  'npm run worker:build && node dist/scripts/checkCustomerControlledPropertyShortlist.js',
  'package.json must expose the customer-controlled shortlist check.',
);
assertIncludes(tsconfigWorker, 'scripts/checkCustomerControlledPropertyShortlist.ts', 'Worker build must compile the shortlist check.');

assertIncludes(comparePage, 'data-testid="customer-controlled-property-comparison-page"', 'Property comparison page must expose deterministic page marker.');
assertIncludes(comparePage, 'data-property-comparison-query-param="ids"', 'Property comparison must use ids query state.');
assertIncludes(comparePage, 'data-property-comparison-cities-param="ignored"', 'Property comparison must not consume city Compare state.');
assertIncludes(comparePage, 'data-property-comparison-city-route-affected="false"', 'Property comparison must disclose city Compare isolation.');
assertIncludes(comparePage, 'robots:', 'Property comparison metadata must define robots.');
assertIncludes(comparePage, 'index: false', 'Property comparison route must be noindex.');
assertIncludes(comparePage, 'follow: true', 'Property comparison route must remain follow.');
assertIncludes(comparePage, 'data-property-comparison-storage="false"', 'Property comparison must not persist state.');
assertIncludes(comparePage, 'data-property-comparison-api="false"', 'Property comparison must not introduce a public API.');
assertIncludes(comparePage, 'data-property-comparison-provider-activation="false"', 'Property comparison must not activate providers.');
assertIncludes(comparePage, 'data-property-comparison-ranking="false"', 'Property comparison must not rank.');
assertIncludes(comparePage, 'data-property-comparison-recommendation="false"', 'Property comparison must not recommend.');
assertIncludes(comparePage, 'data-property-comparison-suitability="false"', 'Property comparison must not infer suitability.');
assertIncludes(comparePage, 'data-property-comparison-valuation="false"', 'Property comparison must not value homes.');
assertIncludes(comparePage, 'Property pages, Sources, Property Inquiry, and Advisory', 'Property comparison must include the required verify surfaces.');
assertIncludes(comparePage, 'MORE AVAILABLE DATA does not mean a better property', 'Property comparison must preserve data-availability trust boundary.');
assertIncludes(comparePage, 'SOURCE AVAILABILITY does not equal PROPERTY QUALITY', 'Property comparison must preserve source-quality trust boundary.');
assertIncludes(comparePage, 'MISSING DATA does not equal NEGATIVE PROPERTY CONDITION', 'Property comparison must preserve missing-data trust boundary.');

assertIncludes(cityComparePage, 'data-testid="cross-city-decision-comparison-page"', 'Existing city Compare page must remain present.');
assertNotIncludes(cityComparePage, 'data-property-comparison-query-param="ids"', 'City Compare must not consume property ids.');

assertIncludes(publicPropertyRead, 'findMany({', 'Shortlist read helper must use one bounded Property findMany.');
assertIncludes(publicPropertyRead, 'take: 3', 'Shortlist read helper must cap Prisma read at three records.');
assertIncludes(publicPropertyRead, 'id: {', 'Shortlist read helper must read selected homes by Property.id.');
assertIncludes(publicPropertyRead, '.slice(0, 3)', 'Shortlist fallback must be capped at three records.');
assertIncludes(propertyPage, 'getPublicProperty(id)', 'Property route must use the extracted public property reader.');

assertIncludes(searchInterface, 'data-search-compare-ids-state="browser-url-only"', 'Search must disclose compareIds as browser URL state only.');
assertIncludes(searchInterface, 'data-search-compare-ids-api-param="false"', 'Search must not send compareIds to the Search API.');
assertIncludes(searchInterface, "params.set('compareIds', compareIds)", 'Search must preserve compareIds through filter URL updates.');
assertIncludes(searchInterface, 'buildSearchUrl(nextFilters)', 'Search API calls must remain driven by Search filters only.');
assertIncludes(searchInterface, 'property-shortlist-control', 'Search must expose compact shortlist control.');
assertIncludes(searchInterface, 'map and list selection do not add homes automatically', 'Search must disclose explicit customer shortlist control.');
assertIncludes(searchInterface, 'getPropertyComparisonHref(compareIds)', 'Search must build the property comparison route only from shortlist ids.');
assertIncludes(selectedDrawer, 'Add to comparison', 'Selected property drawer must expose explicit add action.');
assertIncludes(selectedDrawer, 'Remove from comparison', 'Selected property drawer must expose explicit remove action.');
assertIncludes(selectedDrawer, 'data-property-comparison-customer-controlled="true"', 'Drawer action must disclose customer control.');

const emptySelection = parseCustomerControlledComparisonIds(undefined);
assert.equal(emptySelection.canCompare, false, 'Empty direct entry must not compare.');
assert.equal(emptySelection.notices.some((notice) => notice.reason === 'empty'), true, 'Empty direct entry must explain selection requirement.');

const oneSelection = parseCustomerControlledComparisonIds('alpha');
assert.deepEqual(oneSelection.acceptedIds, ['alpha'], 'One valid id must be retained without side-by-side comparison.');
assert.equal(oneSelection.canCompare, false, 'One valid id must not enable side-by-side comparison.');
assert.equal(oneSelection.notices.some((notice) => notice.reason === 'single-selection'), true, 'One valid id must ask for one more.');

const duplicateSelection = parseCustomerControlledComparisonIds('bravo,alpha,bravo');
assert.deepEqual(duplicateSelection.acceptedIds, ['bravo', 'alpha'], 'Duplicate ids must be deduped without treating order as preference.');
assert.deepEqual(duplicateSelection.canonicalIds, ['alpha', 'bravo'], 'Canonical ids must be lexical for shareable URL ordering.');
assert.equal(duplicateSelection.canCompare, true, 'Two unique valid ids must enable read attempt.');
assert.equal(duplicateSelection.notices.some((notice) => notice.reason === 'duplicate'), true, 'Duplicate omission must be visible.');

const malformedSelection = parseCustomerControlledComparisonIds('alpha,bad/id,carrot');
assert.deepEqual(malformedSelection.acceptedIds, ['alpha', 'carrot'], 'Malformed ids must be omitted without arbitrary lookup.');
assert.equal(malformedSelection.notices.some((notice) => notice.reason === 'malformed'), true, 'Malformed omission must be visible.');

const overLimitSelection = parseCustomerControlledComparisonIds('a,b,c,d');
assert.equal(overLimitSelection.canAttemptRead, false, 'Over-limit raw state must fail closed before read.');
assert.equal(overLimitSelection.acceptedIds.length, 0, 'Over-limit raw state must not be truncated.');
assert.equal(overLimitSelection.notices.some((notice) => notice.reason === 'selection-limit'), true, 'Over-limit raw state must explain three-home limit.');

const oversizedSelection = parseCustomerControlledComparisonIds('x'.repeat(700));
assert.equal(oversizedSelection.isOversized, true, 'Oversized query state must fail closed.');
assert.equal(oversizedSelection.canAttemptRead, false, 'Oversized query state must not read.');

const workspace = buildCustomerControlledComparisonWorkspace({
  selection: parseCustomerControlledComparisonIds('id2,id1,id3'),
  properties: [
    {
      id: 'id1',
      address: '100 Alpha St',
      city: 'Boulder',
      state: 'CO',
      price: 900000,
      beds: 3,
      baths: 2,
      sqft: 1800,
      lotSize: 0.16,
      yearBuilt: 1978,
      propertyType: 'Single Family',
      status: 'Active',
      updatedAt: new Date('2026-08-01T12:00:00Z'),
      lastIntelligenceSync: null,
    },
    {
      id: 'id2',
      address: '200 Bravo St',
      city: 'Boulder',
      state: 'CO',
      price: 1000000,
      beds: null,
      baths: 3,
      sqft: 2000,
      lotSize: null,
      yearBuilt: 1988,
      propertyType: 'Single Family',
      status: 'Active',
      updatedAt: new Date('2026-08-02T12:00:00Z'),
      lastIntelligenceSync: new Date('2026-08-03T12:00:00Z'),
    },
  ],
});

assert.equal(workspace.canCompare, true, 'Two available homes must render comparison.');
assert.equal(workspace.rows.some((row) => row.key === 'pricePerSquareFoot' && row.source === 'Public listing facts + labelled arithmetic'), true, 'Price per square foot must be labelled arithmetic.');
assert.equal(workspace.rows.some((row) => row.cells.some((cell) => cell.evidenceState === 'ASYMMETRIC')), true, 'Missing one-sided fields must expose asymmetry.');
assert.equal(workspace.sourceTransparency.length, 4, 'Valid comparison must expose four source transparency tiles.');
assert.equal(workspace.sourceTransparency.some((item) => item.label === 'Verify' && item.href === '/sources'), true, 'Verify tile must use /sources.');
assert.deepEqual(Object.values(workspace.protectedBoundaries).filter(Boolean), [], 'All protected boundary flags must remain false.');

const implementationSnippets = [
  comparePage,
  comparisonContract,
  snippetAfter(searchInterface, 'data-testid="property-shortlist-control"', 5200),
  snippetAfter(selectedDrawer, 'data-testid="reie-selected-property-comparison-toggle"', 2200),
];

for (const source of implementationSnippets) {
  for (const blocked of [
    'best property',
    'winner',
    'recommended property',
    'fit score',
    'investment return',
    'appreciation',
    'school quality',
    'crime',
    'demographics',
    'safety score',
    'efficiencyScore',
    'resilienceScore',
    'providerContact',
    'credential',
    'trackEvent',
    'createCRM',
    'sendEmail',
    'typesense',
  ]) {
    assertNotIncludes(source, blocked, `Customer-controlled property shortlist must not expose prohibited text or protected dependency: ${blocked}`);
  }
}

for (const forbiddenPath of [
  'app/api/properties/compare/route.ts',
  'app/api/property-compare/route.ts',
  'app/compare/properties/page.tsx',
]) {
  assert.equal(fs.existsSync(forbiddenPath), false, `Do not create competing or API route: ${forbiddenPath}`);
}

console.log(
  '[customer-controlled-property-shortlist] ok: explicit 2-3 home shortlist, /properties/compare route isolation, ids-only URL contract, fail-closed parsing, bounded public read adapter, source transparency, and protected-system boundaries verified.',
);
