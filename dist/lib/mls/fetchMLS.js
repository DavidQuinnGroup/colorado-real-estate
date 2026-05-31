import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_MAX_PAGES = 1;
const DEFAULT_TIMEOUT_MS = 30000;
const MAX_PAGE_SIZE = 100;
const MAX_PAGES = 10;
const MAX_RECORDS = 1000;
function getBaseUrl() {
    return process.env.MLS_API_URL || process.env.MLS_GRID_BASE_URL || '';
}
function getAccessToken() {
    return process.env.MLS_API_KEY || process.env.MLS_GRID_TOKEN || '';
}
function getSafeInteger(value, fallback, min, max) {
    if (!Number.isFinite(value) || value === undefined)
        return fallback;
    return Math.max(min, Math.min(Math.floor(value), max));
}
function buildInitialPropertyUrl(options) {
    const baseUrl = getBaseUrl().replace(/\/+$/, '');
    const propertyUrl = baseUrl.endsWith('/Property') ? baseUrl : `${baseUrl}/Property`;
    const url = new URL(propertyUrl);
    if (!url.searchParams.has('$top')) {
        url.searchParams.set('$top', String(options.pageSize));
    }
    if (!url.searchParams.has('$skip')) {
        url.searchParams.set('$skip', String(options.startPage * options.pageSize));
    }
    if (!url.searchParams.has('$orderby')) {
        url.searchParams.set('$orderby', 'ModificationTimestamp desc');
    }
    if (options.includeMedia && !url.searchParams.has('$expand')) {
        url.searchParams.set('$expand', 'Media');
    }
    return url.toString();
}
function getResponseDetails(data) {
    if (!data || typeof data !== 'object')
        return data;
    const maybeError = data;
    return maybeError.error || maybeError['@odata.error'] || maybeError.message || data;
}
async function fetchMLSUrl(url, timeoutMs) {
    const token = getAccessToken();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            signal: controller.signal,
        });
        const data = (await response.json().catch(() => ({})));
        if (!response.ok) {
            console.error('MLS fetch failed:', {
                status: response.status,
                details: getResponseDetails(data),
            });
            return { listings: [], nextUrl: null };
        }
        return {
            listings: Array.isArray(data.value) ? data.value : [],
            nextUrl: typeof data['@odata.nextLink'] === 'string' ? data['@odata.nextLink'] : null,
        };
    }
    catch (error) {
        if (error?.name === 'AbortError') {
            console.error(`MLS fetch timed out after ${timeoutMs}ms.`);
            return { listings: [], nextUrl: null };
        }
        console.error('MLS fetch error:', error?.message ?? error);
        return { listings: [], nextUrl: null };
    }
    finally {
        clearTimeout(timeout);
    }
}
function getSafeOptions(options) {
    return {
        includeMedia: options.includeMedia ?? process.env.MLS_GRID_INCLUDE_MEDIA !== 'false',
        maxPages: getSafeInteger(options.maxPages, DEFAULT_MAX_PAGES, 1, MAX_PAGES),
        maxRecords: getSafeInteger(options.maxRecords, MAX_RECORDS, 1, MAX_RECORDS),
        pageSize: getSafeInteger(options.pageSize, DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE),
        startPage: getSafeInteger(options.startPage, 0, 0, Number.MAX_SAFE_INTEGER),
        timeoutMs: getSafeInteger(options.timeoutMs, DEFAULT_TIMEOUT_MS, 1000, 120000),
    };
}
export async function fetchMLSListings(options = {}) {
    const baseUrl = getBaseUrl();
    const token = getAccessToken();
    if (!baseUrl) {
        console.warn('MLS fetch skipped: missing MLS_API_URL or MLS_GRID_BASE_URL.');
        return [];
    }
    if (!token) {
        console.warn('MLS fetch skipped: missing MLS_API_KEY or MLS_GRID_TOKEN.');
        return [];
    }
    const safeOptions = getSafeOptions(options);
    const allListings = [];
    let nextUrl = buildInitialPropertyUrl(safeOptions);
    console.log('Starting bounded MLS listing fetch:', {
        includeMedia: safeOptions.includeMedia,
        maxPages: safeOptions.maxPages,
        maxRecords: safeOptions.maxRecords,
        pageSize: safeOptions.pageSize,
        startPage: safeOptions.startPage,
    });
    for (let page = 0; page < safeOptions.maxPages && nextUrl; page += 1) {
        const { listings, nextUrl: responseNextUrl } = await fetchMLSUrl(nextUrl, safeOptions.timeoutMs);
        if (!listings.length) {
            break;
        }
        allListings.push(...listings);
        console.log(`MLS bounded fetch page ${page + 1}/${safeOptions.maxPages}: ${allListings.length} listings collected.`);
        if (allListings.length >= safeOptions.maxRecords) {
            break;
        }
        nextUrl = responseNextUrl;
    }
    const boundedListings = allListings.slice(0, safeOptions.maxRecords);
    console.log(`MLS bounded fetch complete. Total listings: ${boundedListings.length}.`);
    return boundedListings;
}
// lib/mls/fetchMLS.ts
