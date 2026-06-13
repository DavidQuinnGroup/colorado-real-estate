import dotenv from 'dotenv';
import { MLS_PAGE_DEFAULT_TIMEOUT_MS, MLS_PAGE_DEFAULT_TOP, MLS_PAGE_MAX_TIMEOUT_MS, MLS_PAGE_MAX_TOP, } from '../queue/mlsPageQueue.js';
import { rateLimit } from './rateLimiter.js';
dotenv.config({ path: '.env.local' });
const includeMediaByDefault = process.env.MLS_GRID_INCLUDE_MEDIA !== 'false';
const maxErrorTextLength = 4000;
function getBaseUrl() {
    return (process.env.MLS_GRID_BASE_URL || process.env.MLS_API_URL || '').trim();
}
function getToken() {
    return (process.env.MLS_GRID_TOKEN || process.env.MLS_API_KEY || '').trim();
}
function getPageNumber(page) {
    if (!Number.isFinite(page) || page < 0)
        return 0;
    return Math.floor(page);
}
function getPageSize(top) {
    if (top === undefined || !Number.isFinite(top)) {
        return MLS_PAGE_DEFAULT_TOP;
    }
    return Math.max(1, Math.min(Math.floor(top), MLS_PAGE_MAX_TOP));
}
function getTimeoutMs(timeoutMs) {
    if (timeoutMs === undefined || !Number.isFinite(timeoutMs)) {
        return MLS_PAGE_DEFAULT_TIMEOUT_MS;
    }
    return Math.max(1000, Math.min(Math.floor(timeoutMs), MLS_PAGE_MAX_TIMEOUT_MS));
}
function trimText(value, maxLength = maxErrorTextLength) {
    return value.length <= maxLength ? value : `${value.slice(0, maxLength)}\n[TRUNCATED]`;
}
function getErrorDetails(data, responseText = '') {
    if (data && typeof data === 'object') {
        const response = data;
        return response.error || response['@odata.error'] || response.message || response || trimText(responseText);
    }
    return data || trimText(responseText);
}
function isAbortError(error) {
    return error instanceof Error && error.name === 'AbortError';
}
function parseRetryAfterMs(value) {
    if (!value)
        return undefined;
    const seconds = Number(value);
    if (Number.isFinite(seconds))
        return Math.max(0, Math.floor(seconds * 1000));
    const dateMs = Date.parse(value);
    if (!Number.isFinite(dateMs))
        return undefined;
    return Math.max(0, dateMs - Date.now());
}
function createMlsPageError(message, status, details, retryAfterMs) {
    const error = new Error(message);
    error.status = status;
    error.details = details;
    error.retryAfterMs = retryAfterMs;
    return error;
}
function buildPropertyParams({ page, top = MLS_PAGE_DEFAULT_TOP, includeMedia = includeMediaByDefault }) {
    const safeTop = getPageSize(top);
    const safePage = getPageNumber(page);
    const params = {
        $orderby: 'ModificationTimestamp desc',
        $skip: safePage * safeTop,
        $top: safeTop,
    };
    if (includeMedia) {
        params.$expand = 'Media';
    }
    return params;
}
function buildPropertyUrl(options) {
    const baseUrl = getBaseUrl().replace(/\/+$/, '');
    if (!baseUrl) {
        throw createMlsPageError('Missing MLS_GRID_BASE_URL or MLS_API_URL.');
    }
    const url = new URL(`${baseUrl}/Property`);
    const params = buildPropertyParams(options);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
    });
    return url;
}
function isMlsPageError(error) {
    return error instanceof Error;
}
function shouldRetryWithoutMedia(error) {
    return isMlsPageError(error) && (error.status === 400 || error.status === 404 || error.status === 501);
}
function getListingsFromResponse(data) {
    if (!Array.isArray(data.value)) {
        throw createMlsPageError('MLS Grid response did not include a value array.', 502, {
            details: getErrorDetails(data),
            responseKeys: data && typeof data === 'object' ? Object.keys(data) : [],
            valueType: typeof data.value,
        });
    }
    return data.value.filter((listing) => typeof listing === 'object' && listing !== null && !Array.isArray(listing));
}
async function readJsonResponse(response) {
    const text = await response.text();
    if (!text.trim())
        return { data: {}, text };
    try {
        return {
            data: JSON.parse(text),
            text,
        };
    }
    catch {
        return {
            data: {
                message: trimText(text),
            },
            text,
        };
    }
}
async function requestMLSPage(options) {
    const token = getToken();
    if (!token) {
        throw createMlsPageError('Missing MLS_GRID_TOKEN or MLS_API_KEY.');
    }
    await rateLimit();
    const timeoutMs = getTimeoutMs(options.timeoutMs);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const requestUrl = buildPropertyUrl(options);
    const params = buildPropertyParams(options);
    try {
        const response = await fetch(requestUrl, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
        const { data, text } = await readJsonResponse(response);
        const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'));
        if (!response.ok) {
            throw createMlsPageError(retryAfterMs
                ? `MLS Grid API error: ${response.status}. Retry after ${Math.ceil(retryAfterMs / 1000)}s.`
                : `MLS Grid API error: ${response.status}`, response.status, {
                details: getErrorDetails(data, text),
                params,
                retryAfterMs,
            }, retryAfterMs);
        }
        return getListingsFromResponse(data);
    }
    catch (error) {
        if (isAbortError(error)) {
            throw createMlsPageError(`MLS Grid request timed out after ${timeoutMs}ms.`, 408, {
                timeoutMs,
                params,
            });
        }
        if (isMlsPageError(error))
            throw error;
        throw createMlsPageError(String(error || 'Unknown MLS Grid page fetch error.'));
    }
    finally {
        clearTimeout(timeout);
    }
}
function logFetchError(prefix, error) {
    const normalizedError = isMlsPageError(error)
        ? error
        : createMlsPageError(String(error || 'Unknown MLS Grid page fetch error.'));
    console.error(prefix, normalizedError.message);
    if (normalizedError.details) {
        console.error('MLS Grid fetch details:', normalizedError.details);
    }
}
export async function fetchMLSPage({ page, top = MLS_PAGE_DEFAULT_TOP, includeMedia = includeMediaByDefault, timeoutMs = MLS_PAGE_DEFAULT_TIMEOUT_MS, }) {
    const safePage = getPageNumber(page);
    const safeTop = getPageSize(top);
    const safeTimeoutMs = getTimeoutMs(timeoutMs);
    try {
        const listings = await requestMLSPage({
            page: safePage,
            top: safeTop,
            includeMedia,
            timeoutMs: safeTimeoutMs,
        });
        console.log(`MLS returned ${listings.length} listings for page ${safePage}${includeMedia ? ' with media.' : '.'}`);
        return listings;
    }
    catch (error) {
        if (includeMedia && shouldRetryWithoutMedia(error)) {
            console.warn(`MLS media expansion failed for page ${safePage}. Retrying without Media expansion.`);
            try {
                const listings = await requestMLSPage({
                    page: safePage,
                    top: safeTop,
                    includeMedia: false,
                    timeoutMs: safeTimeoutMs,
                });
                console.log(`MLS returned ${listings.length} listings for page ${safePage} without media.`);
                return listings;
            }
            catch (fallbackError) {
                logFetchError('MLS fallback fetch error:', fallbackError);
                throw fallbackError;
            }
        }
        logFetchError('MLS fetch error:', error);
        throw error;
    }
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLSPage.ts
