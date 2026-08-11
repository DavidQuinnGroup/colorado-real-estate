import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  buildCrossCityComparisonWorkspace,
  getCrossCityComparisonIneligibleSlugs,
} from '../lib/crossCityComparison.js';

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

const propertyPage = read('app/properties/[id]/page.tsx');
const comparePage = read('app/compare/page.tsx');
const comparisonModel = read('lib/crossCityComparison.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const localSourceFreshnessCue = read('components/LocalSourceFreshnessCue.tsx');

assert.equal(
  packageJson.scripts?.['check:decision-moment-source-transparency'],
  'npm run worker:build && node dist/scripts/checkDecisionMomentSourceTransparency.js',
  'package.json must expose the Decision-Moment Source Transparency check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDecisionMomentSourceTransparency.ts',
  'Worker build must include the Decision-Moment Source Transparency check.',
);

assertIncludes(propertyPage, 'data-testid="cep-property-intelligence-source-status"', 'Property must refine the existing source status grid.');
assertIncludes(propertyPage, "label: 'Source'", 'Property source tile must exist.');
assertIncludes(propertyPage, "label: 'Period / Freshness'", 'Property period/freshness tile must exist.');
assertIncludes(propertyPage, "label: 'Limitation'", 'Property limitation tile must exist.');
assertIncludes(propertyPage, "label: 'Verify'", 'Property verify tile must exist.');
assertIncludes(propertyPage, 'property.lastIntelligenceSync || property.updatedAt', 'Property freshness must prefer lastIntelligenceSync with updatedAt fallback.');
assertIncludes(propertyPage, "property.lastIntelligenceSync ? 'lastIntelligenceSync' : property.updatedAt ? 'updatedAt' : 'unavailable'", 'Property must expose freshness source hierarchy.');
assertIncludes(propertyPage, 'Listing update time is unavailable; confirm current information before relying.', 'Property must fail closed when freshness is unavailable.');
assertNotIncludes(propertyPage, "value: 'Current'", 'Property must not synthesize Current as freshness.');
assertIncludes(propertyPage, 'data-property-intelligence-public-records="verification-required"', 'Property public-record domains must remain verification-required.');
assertIncludes(propertyPage, 'data-property-intelligence-record-retrieval="false"', 'Property must not retrieve new records.');
assertIncludes(propertyPage, "href: '#property-contact'", 'Property verify path must use #property-contact.');
assertIncludes(propertyPage, "secondaryHref: '/sources'", 'Property must preserve /sources methodology path.');
assertIncludes(propertyPage, 'Visible listing facts do not establish condition, title, taxes, permits, insurance, zoning or legal use, valuation, or parcel/account correlation.', 'Property limitation must state reliance boundary.');
assertNotIncludes(propertyPage, 'assessorVerified', 'Property must not present assessor records as verified evidence.');
assertNotIncludes(propertyPage, 'taxVerified', 'Property must not present tax records as verified evidence.');
assertNotIncludes(propertyPage, 'permitVerified', 'Property must not present permit records as verified evidence.');

assertIncludes(comparePage, 'data-testid="cross-city-source-transparency"', 'Compare must expose route-local source transparency.');
assertIncludes(comparePage, 'How to read this comparison', 'Compare section heading must be present.');
assertIncludes(comparePage, '!workspace.canCompare ? (', 'Compare source transparency must remain inside the canCompare branch.');
assertIncludes(comparePage, 'data-cross-city-registry-freshness-only="true"', 'Compare freshness must be registry-only.');
assertIncludes(comparePage, 'data-cross-city-live-market-feed="false"', 'Compare must disclose no live market feed.');
assertIncludes(comparePage, 'data-cross-city-ranking="false"', 'Compare must disclose no ranking.');
assertIncludes(comparePage, 'data-cross-city-recommendation="false"', 'Compare must disclose no recommendation.');
assertIncludes(comparePage, 'data-cross-city-suitability="false"', 'Compare must disclose no suitability conclusion.');
assertIncludes(comparePage, 'data-testid="cross-city-source-transparency-verify-link"', 'Compare verify action must be a link.');
assertIncludes(comparePage, 'Sources & Methodology', 'Compare verify action must point customers to methodology.');
assertIncludes(comparisonModel, "label: 'Source'", 'Compare source transparency model must include Source.');
assertIncludes(comparisonModel, "label: 'Period / Freshness'", 'Compare source transparency model must include Period / Freshness.');
assertIncludes(comparisonModel, "label: 'Limitation'", 'Compare source transparency model must include Limitation.');
assertIncludes(comparisonModel, "label: 'Verify'", 'Compare source transparency model must include Verify.');
assertIncludes(comparisonModel, 'registryFreshness: entry.freshness', 'Compare freshness must come from existing Decision Guide Registry entries.');
assertIncludes(comparisonModel, 'not a live market feed', 'Compare must distinguish guide freshness from a live market feed.');
assertIncludes(comparisonModel, 'public eligible city Decision Guide context only', 'Compare source must use existing eligible Decision Guide context.');
assertIncludes(comparisonModel, "href: '/sources'", 'Compare verify methodology action must use /sources.');

const emptyWorkspace = buildCrossCityComparisonWorkspace();
assert.equal(emptyWorkspace.canCompare, false, 'Empty Compare state must not be comparable.');
assert.equal(emptyWorkspace.sourceTransparency.length, 0, 'Empty Compare state must not render comparison evidence.');

const rejectedWorkspace = buildCrossCityComparisonWorkspace('niwot,gunbarrel');
assert.equal(rejectedWorkspace.canCompare, false, 'Rejected Compare selections must not become comparable.');
assert.equal(rejectedWorkspace.selectedMarkets.length, 0, 'Rejected Compare selections must not become selected markets.');
assert.equal(rejectedWorkspace.sourceTransparency.length, 0, 'Rejected Compare selections must not become comparison evidence.');
assert(getCrossCityComparisonIneligibleSlugs().includes('niwot'), 'Niwot must remain unsupported for comparison evidence.');
assert(getCrossCityComparisonIneligibleSlugs().includes('gunbarrel'), 'Gunbarrel must remain unsupported for comparison evidence.');

const validWorkspace = buildCrossCityComparisonWorkspace('boulder,broomfield');
assert.equal(validWorkspace.canCompare, true, 'Two eligible markets must enable comparison.');
assert.equal(validWorkspace.sourceTransparency.length, 4, 'Valid Compare state must expose the four source transparency tiles.');
assert(validWorkspace.sourceTransparency.some((item) => item.label === 'Source' && item.value.includes('Decision Guide')), 'Valid Compare state must identify the source.');
assert(validWorkspace.sourceTransparency.some((item) => item.label === 'Period / Freshness' && item.detail.includes('not a live market feed')), 'Valid Compare state must disclose registry freshness and no live feed.');
assert(validWorkspace.sourceTransparency.some((item) => item.label === 'Limitation' && item.detail.includes('does not establish property-specific facts')), 'Valid Compare state must disclose comparison limits.');
assert(validWorkspace.sourceTransparency.some((item) => item.label === 'Verify' && item.href === '/sources'), 'Valid Compare state must use /sources for verification.');

for (const item of validWorkspace.sourceTransparency) {
  for (const blocked of [
    'winner',
    'recommended city',
    'suitability',
    'desirability',
    'safety',
    'school quality',
    'demographic',
    'investment',
    'appreciation',
    'valuation conclusion',
    'personalized conclusion',
    'source id',
    'fingerprint',
    'provider email',
  ]) {
    assertNotIncludes(`${item.value} ${item.detail}`, blocked, `Compare source transparency must not expose prohibited claim or internal metadata: ${blocked}`);
  }
}

const protectedBoundarySnippets = [
  snippetAfter(propertyPage, 'data-testid="cep-property-intelligence-source-status"', 2200),
  snippetAfter(comparePage, 'data-testid="cross-city-source-transparency"', 2600),
  snippetAfter(comparisonModel, 'function buildSourceTransparency', 2200),
];

for (const source of protectedBoundarySnippets) {
  for (const blocked of [
    'providerContact',
    'providerEmail',
    'credential',
    'sourceFingerprint',
    'acquisitionMethod',
    'rightsDeliberation',
    'countyOperationalState',
    'createCRM',
    'sendEmail',
    'trackEvent',
    'prisma.',
    'new PrismaClient',
    'typesense',
    'mlsSync',
  ]) {
    assertNotIncludes(source, blocked, `Decision-Moment Source Transparency must not introduce protected dependency: ${blocked}`);
  }
}

assert(!fs.existsSync('components/DecisionMomentSourceTransparencyCue.tsx'), 'Do not create a shared DecisionMomentSourceTransparencyCue component.');
assert.equal(localSourceFreshnessCue, read('components/LocalSourceFreshnessCue.tsx'), 'LocalSourceFreshnessCue must remain readable and unchanged during this check.');
assertNotIncludes(comparePage, 'LocalSourceFreshnessCue', 'Compare must not reuse or alter LocalSourceFreshnessCue semantics.');
assertNotIncludes(propertyPage, 'LocalSourceFreshnessCue', 'Property must not reuse or alter LocalSourceFreshnessCue semantics.');

console.log(
  '[decision-moment-source-transparency] ok: Property and Compare expose Source, Period/Freshness, Limitation, Verify with fail-closed freshness, registry-only Compare freshness, /sources methodology, property-specific verify path, and no protected-system expansion.',
);
