import dotenv from 'dotenv';

import {
  MLS_PAGE_DEFAULT_TIMEOUT_MS,
  MLS_PAGE_DEFAULT_TOP,
  MLS_PAGE_MAX_TIMEOUT_MS,
  MLS_PAGE_MAX_TOP,
} from '../queue/mlsPageQueue.js';
import { rateLimit } from './rateLimiter.js';

dotenv.config({ path: '.env.local' });

export type MlsPageListingPayload = Record<string, unknown>;

export type FetchMLSPageOptions = {
  page: number;
  top?: number;
  includeMedia?: boolean;
  timeoutMs?: number;
};

export type FetchMLSPageDiagnostics = {
  page: number;
  top: number;
  skip: number;
  includeMedia: boolean;
  timeoutMs: number;
  mediaExpansion: 'requested' | 'disabled';
  bounded: {
    page: boolean;
    top: boolean;
    timeoutMs: boolean;
  };
  limits: {
    maxTop: number;
    maxTimeoutMs: number;
  };
};

type MlsGridResponse = {
  value?: unknown;
  error?: unknown;
  message?: unknown;
  '@odata.error'?: unknown;
};

type MlsPageError = Error & {
  details?: unknown;
  retryAfterMs?: number;
  status?: number;
};

const includeMediaByDefault = process.env.MLS_GRID_INCLUDE_MEDIA !== 'false';
const maxErrorTextLength = 4000;

function getBaseUrl() {
  return (process.env.MLS_GRID_BASE_URL || process.env.MLS_API_URL || '').trim();
}

function getToken() {
  return (process.env.MLS_GRID_TOKEN || process.env.MLS_API_KEY || '').trim();
}

function getPageNumber(page: number) {
  if (!Number.isFinite(page) || page < 0) return 0;
  return Math.floor(page);
}

function getPageSize(top: number | undefined) {
  if (top === undefined || !Number.isFinite(top)) {
    return MLS_PAGE_DEFAULT_TOP;
  }

  return Math.max(1, Math.min(Math.floor(top), MLS_PAGE_MAX_TOP));
}

function getTimeoutMs(timeoutMs: number | undefined) {
  if (timeoutMs === undefined || !Number.isFinite(timeoutMs)) {
    return MLS_PAGE_DEFAULT_TIMEOUT_MS;
  }

  return Math.max(1000, Math.min(Math.floor(timeoutMs), MLS_PAGE_MAX_TIMEOUT_MS));
}

export function getFetchMLSPageDiagnostics({
  page,
  top = MLS_PAGE_DEFAULT_TOP,
  includeMedia = includeMediaByDefault,
  timeoutMs = MLS_PAGE_DEFAULT_TIMEOUT_MS,
}: FetchMLSPageOptions): FetchMLSPageDiagnostics {
  const safePage = getPageNumber(page);
  const safeTop = getPageSize(top);
  const safeTimeoutMs = getTimeoutMs(timeoutMs);

  return {
    page: safePage,
    top: safeTop,
    skip: safePage * safeTop,
    includeMedia,
    timeoutMs: safeTimeoutMs,
    mediaExpansion: includeMedia ? 'requested' : 'disabled',
    bounded: {
      page: safePage !== page,
      top: safeTop !== top,
      timeoutMs: safeTimeoutMs !== timeoutMs,
    },
    limits: {
      maxTop: MLS_PAGE_MAX_TOP,
      maxTimeoutMs: MLS_PAGE_MAX_TIMEOUT_MS,
    },
  };
}

function trimText(value: string, maxLength = maxErrorTextLength) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength)}\n[TRUNCATED]`;
}

function getErrorDetails(data: MlsGridResponse | unknown, responseText = '') {
  if (data && typeof data === 'object') {
    const response = data as MlsGridResponse;
    return response.error || response['@odata.error'] || response.message || response || trimText(responseText);
  }

  return data || trimText(responseText);
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError';
}

function parseRetryAfterMs(value: string | null) {
  if (!value) return undefined;

  const seconds = Number(value);

  if (Number.isFinite(seconds)) return Math.max(0, Math.floor(seconds * 1000));

  const dateMs = Date.parse(value);
  if (!Number.isFinite(dateMs)) return undefined;

  return Math.max(0, dateMs - Date.now());
}

function createMlsPageError(message: string, status?: number, details?: unknown, retryAfterMs?: number): MlsPageError {
  const error = new Error(message) as MlsPageError;
  error.status = status;
  error.details = details;
  error.retryAfterMs = retryAfterMs;
  return error;
}

function buildPropertyParams({ page, top = MLS_PAGE_DEFAULT_TOP, includeMedia = includeMediaByDefault }: FetchMLSPageOptions) {
  const diagnostics = getFetchMLSPageDiagnostics({
    page,
    top,
    includeMedia,
  });
  const params: Record<string, string | number> = {
    $orderby: 'ModificationTimestamp desc',
    $skip: diagnostics.skip,
    $top: diagnostics.top,
  };

  if (diagnostics.includeMedia) {
    params.$expand = 'Media';
  }

  return params;
}

function buildPropertyUrl(options: FetchMLSPageOptions) {
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

function isMlsPageError(error: unknown): error is MlsPageError {
  return error instanceof Error;
}

function shouldRetryWithoutMedia(error: unknown) {
  return isMlsPageError(error) && (error.status === 400 || error.status === 404 || error.status === 501);
}

function getListingsFromResponse(data: MlsGridResponse): MlsPageListingPayload[] {
  if (!Array.isArray(data.value)) {
    throw createMlsPageError('MLS Grid response did not include a value array.', 502, {
      details: getErrorDetails(data),
      responseKeys: data && typeof data === 'object' ? Object.keys(data) : [],
      valueType: typeof data.value,
    });
  }

  return data.value.filter(
    (listing): listing is MlsPageListingPayload => typeof listing === 'object' && listing !== null && !Array.isArray(listing),
  );
}

async function readJsonResponse(response: Response): Promise<{ data: MlsGridResponse; text: string }> {
  const text = await response.text();

  if (!text.trim()) return { data: {}, text };

  try {
    return {
      data: JSON.parse(text) as MlsGridResponse,
      text,
    };
  } catch {
    return {
      data: {
        message: trimText(text),
      },
      text,
    };
  }
}

async function requestMLSPage(options: FetchMLSPageOptions): Promise<MlsPageListingPayload[]> {
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
  const diagnostics = getFetchMLSPageDiagnostics(options);

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
      throw createMlsPageError(
        retryAfterMs
          ? `MLS Grid API error: ${response.status}. Retry after ${Math.ceil(retryAfterMs / 1000)}s.`
          : `MLS Grid API error: ${response.status}`,
        response.status,
        {
          details: getErrorDetails(data, text),
          diagnostics,
          params,
          retryAfterMs,
        },
        retryAfterMs,
      );
    }

    return getListingsFromResponse(data);
  } catch (error) {
    if (isAbortError(error)) {
      throw createMlsPageError(`MLS Grid request timed out after ${timeoutMs}ms.`, 408, {
        diagnostics,
        timeoutMs,
        params,
      });
    }

    if (isMlsPageError(error)) throw error;

    throw createMlsPageError(String(error || 'Unknown MLS Grid page fetch error.'));
  } finally {
    clearTimeout(timeout);
  }
}

function logFetchError(prefix: string, error: unknown) {
  const normalizedError = isMlsPageError(error)
    ? error
    : createMlsPageError(String(error || 'Unknown MLS Grid page fetch error.'));

  console.error(prefix, normalizedError.message);

  if (normalizedError.details) {
    console.error('MLS Grid fetch details:', normalizedError.details);
  }
}

export async function fetchMLSPage({
  page,
  top = MLS_PAGE_DEFAULT_TOP,
  includeMedia = includeMediaByDefault,
  timeoutMs = MLS_PAGE_DEFAULT_TIMEOUT_MS,
}: FetchMLSPageOptions): Promise<MlsPageListingPayload[]> {
  const safePage = getPageNumber(page);
  const safeTop = getPageSize(top);
  const safeTimeoutMs = getTimeoutMs(timeoutMs);
  const diagnostics = getFetchMLSPageDiagnostics({
    page: safePage,
    top: safeTop,
    includeMedia,
    timeoutMs: safeTimeoutMs,
  });

  try {
    const listings = await requestMLSPage({
      page: safePage,
      top: safeTop,
      includeMedia,
      timeoutMs: safeTimeoutMs,
    });

    console.log(
      `MLS returned ${listings.length} listings for page ${safePage}${includeMedia ? ' with media' : ''} ` +
        `(top=${diagnostics.top}, skip=${diagnostics.skip}, timeoutMs=${diagnostics.timeoutMs}).`,
    );

    return listings;
  } catch (error) {
    if (includeMedia && shouldRetryWithoutMedia(error)) {
      console.warn(`MLS media expansion failed for page ${safePage}. Retrying without Media expansion.`);

      try {
        const listings = await requestMLSPage({
          page: safePage,
          top: safeTop,
          includeMedia: false,
          timeoutMs: safeTimeoutMs,
        });

        console.log(
          `MLS returned ${listings.length} listings for page ${safePage} without media ` +
            `(top=${diagnostics.top}, skip=${diagnostics.skip}, timeoutMs=${diagnostics.timeoutMs}).`,
        );

        return listings;
      } catch (fallbackError) {
        logFetchError('MLS fallback fetch error:', fallbackError);
        throw fallbackError;
      }
    }

    logFetchError('MLS fetch error:', error);
    throw error;
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLSPage.ts
