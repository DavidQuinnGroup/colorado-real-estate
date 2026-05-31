import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const DEFAULT_TOP = 50;
const MAX_TOP = 100;
const DEFAULT_TIMEOUT_MS = 30000;
function getBaseUrl() {
    return process.env.IRES_API_URL || process.env.MLS_GRID_BASE_URL || '';
}
function getAccessToken() {
    return process.env.IRES_ACCESS_TOKEN || process.env.MLS_GRID_TOKEN || '';
}
function getSafeSkip(skip) {
    if (!Number.isFinite(skip) || !skip || skip < 0)
        return 0;
    return Math.floor(skip);
}
function getSafeTop(top) {
    if (!Number.isFinite(top) || !top)
        return DEFAULT_TOP;
    return Math.max(1, Math.min(Math.floor(top), MAX_TOP));
}
function buildPropertyUrl(options) {
    const baseUrl = getBaseUrl().replace(/\/+$/, '');
    const url = new URL(`${baseUrl}/Property`);
    url.searchParams.set('$top', String(options.top));
    url.searchParams.set('$skip', String(options.skip));
    url.searchParams.set('$orderby', 'ModificationTimestamp desc');
    if (options.includeMedia) {
        url.searchParams.set('$expand', 'Media');
    }
    return url;
}
function getResponseDetails(data) {
    if (!data || typeof data !== 'object')
        return data;
    const maybeError = data;
    return maybeError.error || maybeError['@odata.error'] || maybeError.message || data;
}
async function requestIRESListings(options) {
    const token = getAccessToken();
    const baseUrl = getBaseUrl();
    if (!baseUrl) {
        console.warn('IRES fetch skipped: missing IRES_API_URL or MLS_GRID_BASE_URL.');
        return [];
    }
    if (!token) {
        console.warn('IRES fetch skipped: missing IRES_ACCESS_TOKEN or MLS_GRID_TOKEN.');
        return [];
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs);
    try {
        const response = await fetch(buildPropertyUrl(options), {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            signal: controller.signal,
        });
        const data = (await response.json().catch(() => ({})));
        if (!response.ok) {
            console.error('IRES fetch failed:', {
                status: response.status,
                details: getResponseDetails(data),
            });
            return [];
        }
        return Array.isArray(data.value) ? data.value : [];
    }
    catch (error) {
        if (error?.name === 'AbortError') {
            console.error(`IRES fetch timed out after ${options.timeoutMs}ms.`);
            return [];
        }
        console.error('IRES fetch error:', error?.message ?? error);
        return [];
    }
    finally {
        clearTimeout(timeout);
    }
}
export async function fetchIRESListings(skipOrOptions = 0) {
    const options = typeof skipOrOptions === 'number'
        ? { skip: skipOrOptions }
        : skipOrOptions;
    const safeOptions = {
        skip: getSafeSkip(options.skip),
        top: getSafeTop(options.top),
        includeMedia: options.includeMedia ?? process.env.MLS_GRID_INCLUDE_MEDIA !== 'false',
        timeoutMs: Math.max(1000, Math.min(options.timeoutMs ?? DEFAULT_TIMEOUT_MS, 120000)),
    };
    const listings = await requestIRESListings(safeOptions);
    console.log(`IRES returned ${listings.length} listings for skip ${safeOptions.skip}, top ${safeOptions.top}${safeOptions.includeMedia ? ' with media.' : '.'}`);
    return listings;
}
// lib/mls/fetchIRESListings.ts
