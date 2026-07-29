import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildMarketDecisionWorkspace } from '../lib/marketDecisionWorkspace.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const helper = read('lib/marketDecisionWorkspace.ts');
const marketIndex = read('app/market/page.tsx');
const cityMarketPage = read('app/market/[city]/page.tsx');
const neighborhoodMarketPage = read('app/market/[city]/[slug]/page.tsx');
const marketExperience = read('lib/marketIntelligenceExperience.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const sprintDoc = read('docs/project-atlas/executive-library/REIE-8-MARKET-INTELLIGENCE-V8.md');

assertIncludes(helper, 'buildMarketDecisionWorkspace', 'Market Intelligence v8 must expose a deterministic market decision helper.');
assertIncludes(helper, "scope: 'state' | 'city' | 'neighborhood'", 'Market Intelligence v8 must support state, city, and neighborhood surfaces.');
assertIncludes(helper, "lens: 'market-type' | 'buyer' | 'seller' | 'attention' | 'decision'", 'Market Intelligence v8 must define the five decision lenses.');
assertIncludes(helper, 'does not predict price movement', 'Market Intelligence v8 must keep runtime guidance explanatory.');

for (const [source, label, scope] of [
  [marketIndex, 'Market index', 'state'],
  [cityMarketPage, 'City market page', 'city'],
  [neighborhoodMarketPage, 'Neighborhood market page', 'neighborhood'],
] as const) {
  assertIncludes(source, 'buildMarketDecisionWorkspace', `${label} must compose the v8 market decision helper.`);
  assertIncludes(source, 'data-testid="reie-market-v8-decision-workspace"', `${label} must expose the v8 Market Decision Workspace.`);
  assertIncludes(source, 'data-testid="reie-market-v8-decision-item"', `${label} must expose deterministic market decision items.`);
  assertIncludes(source, `data-market-v8-scope="${scope}"`, `${label} must identify the v8 market workspace scope.`);
  assertIncludes(source, 'data-market-v8-ai="false"', `${label} must preserve no-AI boundary.`);
  assertIncludes(source, 'data-market-v8-forecasting="false"', `${label} must preserve no-forecasting boundary.`);
  assertIncludes(source, 'data-market-v8-gis="false"', `${label} must preserve no-public-GIS boundary.`);
  assertIncludes(source, 'data-market-v8-telemetry="false"', `${label} must preserve telemetry inactive boundary.`);
}

for (const expectedLens of ['market-type', 'buyer', 'seller', 'attention', 'decision']) {
  assertIncludes(helper, `lens: '${expectedLens}'`, `Market Decision Workspace must include ${expectedLens} lens.`);
}

assertIncludes(cityMarketPage, 'data-testid="cep-market-intelligence-summary"', 'City page must preserve CEP market intelligence summary.');
assertIncludes(neighborhoodMarketPage, 'data-testid="cep-market-intelligence-summary"', 'Neighborhood page must preserve CEP market intelligence summary.');
assertIncludes(marketExperience, 'buildCityMarketExperience', 'Existing city market experience helper must remain present.');
assertIncludes(marketExperience, 'buildNeighborhoodMarketExperience', 'Existing neighborhood market experience helper must remain present.');

const cityWorkspace = buildMarketDecisionWorkspace({
  scope: 'city',
  name: 'Boulder',
  marketSignal: 'Competitive but selective',
  competitivenessSignal: 'Active competition',
  timingSignal: 'Prepare before touring',
  pricingSignal: '$900K median / $500 per sq ft',
  inventorySignal: '80 active inventory signal',
  neighborhoodCount: 6,
  resilienceSignal: '6 neighborhood hubs and 82/100 average resilience',
  searchHref: '/search?city=Boulder',
  marketHref: '/market/boulder-co-housing-market',
});

assert.equal(cityWorkspace.items.length, 5, 'City market workspace must include five decision items.');
assert.match(cityWorkspace.orientation, /Boulder/, 'City market workspace must preserve local market name.');
assert.match(cityWorkspace.trustBoundary, /does not predict/i, 'Trust boundary must prohibit prediction claims.');
assert(cityWorkspace.items.some((item) => item.lens === 'buyer' && item.href.includes('/search')), 'Workspace must preserve search continuity.');
assert(cityWorkspace.items.some((item) => item.lens === 'seller' && item.href === '/sell'), 'Workspace must preserve seller continuity.');

const neighborhoodWorkspace = buildMarketDecisionWorkspace({
  scope: 'neighborhood',
  name: 'Downtown Boulder',
  city: 'Boulder',
  marketSignal: 'Indexed inventory signal',
  competitivenessSignal: 'Very limited selection',
  timingSignal: 'Plan diligence before writing',
  inventorySignal: '3 active inventory signal',
  resilienceSignal: 'High fire context, complex insurance complexity, and Front Range Mixed',
  searchHref: '/search?neighborhood=Downtown+Boulder',
  marketHref: '/market/boulder-co-housing-market',
});

assert.equal(neighborhoodWorkspace.items.length, 5, 'Neighborhood market workspace must include five decision items.');
assert.match(neighborhoodWorkspace.orientation, /Downtown Boulder/, 'Neighborhood market workspace must preserve neighborhood context.');
assert.match(neighborhoodWorkspace.items.find((item) => item.lens === 'attention')?.explanation || '', /fire context/i, 'Neighborhood workspace must surface local attention context.');

assertIncludes(sprintDoc, 'Decision Experience Index v2.0', 'Sprint documentation must include DEI v2.0.');
assertIncludes(sprintDoc, 'Total Score: 26 / 30', 'Sprint documentation must calculate total DEI score.');
assertIncludes(sprintDoc, 'Normalized DEI: 4.3 / 5', 'Sprint documentation must calculate normalized DEI score.');
for (const dimension of ['Decision Clarity', 'Decision Confidence', 'Educational Value', 'Trust', 'Decision Readiness', 'Decision Efficiency']) {
  assertIncludes(sprintDoc, dimension, `DEI v2.0 documentation must score ${dimension}.`);
}
assertIncludes(sprintDoc, 'No AI', 'Sprint documentation must preserve AI exclusion.');
assertIncludes(sprintDoc, 'No Forecasting', 'Sprint documentation must preserve forecasting exclusion.');
assertIncludes(sprintDoc, 'No Public Geographic Intelligence', 'Sprint documentation must preserve public GIS exclusion.');
assertIncludes(sprintDoc, 'No Mortgage Calculator', 'Sprint documentation must preserve mortgage-calculator exclusion.');

const combinedRuntime = [helper, marketIndex, cityMarketPage, neighborhoodMarketPage].join('\n');
for (const forbidden of [
  'OpenAI',
  'chatbot',
  'recommendation engine',
  'mortgage calculator',
  'preferred lender',
  'pre-approved',
  'document.cookie =',
  'localStorage.setItem',
  'sessionStorage.setItem',
  'GIS Sprint 9',
]) {
  assertNotIncludes(combinedRuntime, forbidden, `Market Intelligence v8 must not include unauthorized behavior or copy: ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:reie-market-intelligence-v8'],
  'npm run worker:build && node dist/scripts/checkReieMarketIntelligenceV8.js',
  'package.json must expose Market Intelligence v8 safety check.',
);

console.log('[reie-market-intelligence-v8] ok: market decision workspace, DEI v2.0 governance, transition continuity, and prohibited activation exclusions verified.');
