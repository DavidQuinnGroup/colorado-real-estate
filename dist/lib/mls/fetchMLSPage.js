import axios from 'axios';
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
function getErrorDetails(data) {
    if (data && typeof data === 'object') {
        const response = data;
        return response.error || response['@odata.error'] || response.message || response;
    }
    return data;
}
function parseRetryAfterMs(value) {
    if (!value)
        return undefined;
    const rawValue = Array.isArray(value) ? value[0] : String(value);
    const seconds = Number(rawValue);
    if (Number.isFinite(seconds))
        return Math.max(0, Math.floor(seconds * 1000));
    const dateMs = Date.parse(rawValue);
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
function isMlsPageError(error) {
    return error instanceof Error;
}
function getAxiosStatus(error) {
    if (axios.isAxiosError(error)) {
        return error.response?.status ?? null;
    }
    return null;
}
function getAxiosDetails(error) {
    if (axios.isAxiosError(error)) {
        if (error.response?.data)
            return getErrorDetails(error.response.data);
        if (error.response?.statusText)
            return error.response.statusText;
        return trimText(error.message);
    }
    return error instanceof Error ? error.message : error;
}
function normalizeAxiosError(error) {
    if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
            return createMlsPageError(`MLS Grid request timed out after ${error.config?.timeout ?? MLS_PAGE_DEFAULT_TIMEOUT_MS}ms.`, 408, {
                timeoutMs: error.config?.timeout ?? MLS_PAGE_DEFAULT_TIMEOUT_MS,
                params: error.config?.params,
            });
        }
        const status = getAxiosStatus(error) ?? undefined;
        const retryAfterMs = parseRetryAfterMs(error.response?.headers?.['retry-after']);
        return createMlsPageError(retryAfterMs ? `MLS Grid API error: ${status}. Retry after ${Math.ceil(retryAfterMs / 1000)}s.` : `MLS Grid API error${status ? `: ${status}` : ''}`, status, {
            details: getAxiosDetails(error),
            params: error.config?.params,
            retryAfterMs,
        }, retryAfterMs);
    }
    if (isMlsPageError(error))
        return error;
    return createMlsPageError(String(error || 'Unknown MLS Grid page fetch error.'));
}
function shouldRetryWithoutMedia(error) {
    const normalizedError = normalizeAxiosError(error);
    return normalizedError.status === 400 || normalizedError.status === 404 || normalizedError.status === 501;
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
async function requestMLSPage(options) {
    const baseUrl = getBaseUrl().replace(/\/+$/, '');
    const token = getToken();
    if (!baseUrl) {
        throw createMlsPageError('Missing MLS_GRID_BASE_URL or MLS_API_URL.');
    }
    if (!token) {
        throw createMlsPageError('Missing MLS_GRID_TOKEN or MLS_API_KEY.');
    }
    await rateLimit();
    try {
        const response = await axios.get(`${baseUrl}/Property`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            params: buildPropertyParams(options),
            timeout: getTimeoutMs(options.timeoutMs),
        });
        return getListingsFromResponse(response.data);
    }
    catch (error) {
        throw normalizeAxiosError(error);
    }
}
function logFetchError(prefix, error) {
    const normalizedError = normalizeAxiosError(error);
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
