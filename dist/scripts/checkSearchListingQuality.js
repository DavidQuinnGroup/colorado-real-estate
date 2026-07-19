import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { DEFAULT_MARKETABLE_STATUS, getDefaultStatusFilter, getPrimarySearchPhoto, getSearchQualitySummary, hasExplicitStatusFilter, isDefaultMarketableStatus, normalizeSearchPhotos, sortListingsForLaunchQuality, } from '../lib/search/listingQuality.js';
const fixtureListings = [
    {
        id: 'active-with-photo',
        status: 'Active',
        price: 750000,
        photos: [
            { id: 'p1', url: ' ', order: 0 },
            { id: 'p2', url: 'https://cdn.example.com/listing-a.jpg', order: 1 },
            { id: 'p3', url: 'https://cdn.example.com/listing-a.jpg', order: 2 },
            { id: 'p4', url: 'javascript:alert(1)', order: 3 },
        ],
    },
    {
        id: 'active-without-photo',
        status: 'Active',
        price: 800000,
        photos: [{ id: 'p5', url: 'not-a-url', order: 0 }],
    },
    {
        id: 'sold-history',
        status: 'Sold',
        price: 900000,
        photos: [{ id: 'p6', url: 'https://cdn.example.com/sold.jpg', order: 0 }],
    },
    {
        id: 'pending-ambiguous',
        status: 'Pending',
        price: 700000,
        photos: [{ id: 'p7', url: '/reie-listing-modern.svg', order: 0 }],
    },
];
function defaultPublicResults(fixtures) {
    return sortListingsForLaunchQuality(fixtures.filter((listing) => isDefaultMarketableStatus(listing.status)));
}
async function assertSourceContracts() {
    const [apiRoute, supabaseSearch, searchProperties, searchInterface, searchMap, packageJson] = await Promise.all([
        readFile('app/api/search/route.ts', 'utf8'),
        readFile('lib/search/supabaseSearch.ts', 'utf8'),
        readFile('lib/search/searchProperties.ts', 'utf8'),
        readFile('components/search/SearchInterface.tsx', 'utf8'),
        readFile('components/maps/SearchMap.tsx', 'utf8'),
        readFile('package.json', 'utf8'),
    ]);
    assert(apiRoute.includes("getDefaultStatusFilter(params.status)"), 'Expected API route to apply canonical default status filter.');
    assert(apiRoute.includes("filters.push(hasExplicitStatusFilter(params.status) ? 'status' : 'defaultStatus')"), 'Expected API route to disclose default status filter metadata.');
    assert(apiRoute.includes('normalizeSearchPhotos(property.photos)'), 'Expected API route to sanitize Prisma photos.');
    assert(apiRoute.includes('normalizeSearchPhotos(photoMap.get(id) || [])'), 'Expected API route to sanitize Typesense photo lookups.');
    assert(apiRoute.includes('Search provider fallback served the request.'), 'Expected API route to keep fallback evidence without raw provider errors.');
    assert(!apiRoute.includes('Typesense search is unavailable; route is using database fallback.'), 'Expected public API smoke blockers not to expose raw provider failure wording.');
    assert(supabaseSearch.includes("filtered.ilike('status', getDefaultStatusFilter(params.status))"), 'Expected Supabase fallback to apply canonical status filtering.');
    assert(supabaseSearch.includes('normalizeSearchPhotos(photos)'), 'Expected Supabase fallback to sanitize photo values.');
    assert(supabaseSearch.includes("order('updatedAt', { ascending: false })"), 'Expected Supabase fallback to prioritize current inventory.');
    assert(searchProperties.includes("status: { equals: getDefaultStatusFilter(params.status), mode: 'insensitive' }"), 'Expected SSR search to apply canonical status filtering.');
    assert(searchProperties.includes('sortListingsForLaunchQuality(properties.map(mapSearchProperty))'), 'Expected SSR search to apply launch result ranking.');
    assert(searchInterface.includes("return 'Search ready';"), 'Expected visible search interface copy to avoid provider names.');
    assert(searchMap.includes("return 'search ready';"), 'Expected visible map diagnostics to avoid provider names.');
    assert(packageJson.includes('"check:search-listing-quality"'), 'Expected package script for search listing quality check.');
}
function assertFixtureContracts() {
    assert.equal(getDefaultStatusFilter(undefined), DEFAULT_MARKETABLE_STATUS, 'Expected default public search to use Active inventory.');
    assert.equal(getDefaultStatusFilter('Sold'), 'Sold', 'Expected explicit sold search to remain possible.');
    assert.equal(hasExplicitStatusFilter('Sold'), true, 'Expected explicit historical status filter to be recognized.');
    const defaultResults = defaultPublicResults(fixtureListings);
    assert(defaultResults.length > 0, 'Expected active default fixtures to remain visible.');
    assert(defaultResults.every((listing) => listing.status === 'Active'), 'Expected default fixtures to exclude sold and pending inventory.');
    const explicitSold = fixtureListings.filter((listing) => getDefaultStatusFilter('Sold') === listing.status);
    assert.equal(explicitSold.length, 1, 'Expected explicit sold fixture search to remain possible.');
    const normalizedPhotos = normalizeSearchPhotos(fixtureListings[0].photos);
    assert.deepEqual(normalizedPhotos.map((photo) => photo.url), ['https://cdn.example.com/listing-a.jpg'], 'Expected photo normalization to remove empty, duplicate, and malformed URLs.');
    assert.equal(getPrimarySearchPhoto(fixtureListings[1].photos), null, 'Expected malformed-only photo set to produce placeholder-ready null primary photo.');
    const sorted = sortListingsForLaunchQuality(defaultResults);
    assert.equal(sorted[0].id, 'active-with-photo', 'Expected listings with usable photography to be favored within the default result window.');
    const defaultSummary = getSearchQualitySummary(defaultResults, undefined);
    assert.equal(defaultSummary.defaultStatusContractApplied, true, 'Expected default status contract to be marked applied.');
    assert.equal(defaultSummary.statusContractSatisfied, true, 'Expected default active-only fixture results to satisfy relevance contract.');
    assert.equal(defaultSummary.missingPhotoCount, 1, 'Expected missing-photo state to be counted separately from eligibility.');
    const mixedDefaultSummary = getSearchQualitySummary(fixtureListings, undefined);
    assert.equal(mixedDefaultSummary.statusContractSatisfied, false, 'Expected mixed default fixture results to fail relevance contract.');
}
async function main() {
    await assertSourceContracts();
    assertFixtureContracts();
    console.log('[search-listing-quality] ok: default Active contract, explicit Sold support, provider-equivalent filters, photo fallback state, fallback metadata, and public diagnostic copy verified with stable fixtures.');
}
main().catch((error) => {
    console.error('[search-listing-quality] failed:', error instanceof Error ? error.message : error);
    process.exit(1);
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkSearchListingQuality.ts
