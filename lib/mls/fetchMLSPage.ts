import dotenv from 'dotenv';

import {
  MLS_PAGE_DEFAULT_TIMEOUT_MS,
  MLS_PAGE_DEFAULT_TOP,
  MLS_PAGE_MAX_TIMEOUT_MS,
  MLS_PAGE_MAX_TOP,
} from '../queue/mlsPageQueue.js';
import { parseMlsODataPageResponse, validateProviderNextLink, type MlsPageResponse } from './paginationContract.js';
import {
  executeMlsGridRequest,
  isRetryableMlsGridStatus,
  readMlsGridRetryPolicy,
  waitForMlsGridRetry,
} from './rateLimiter.js';

dotenv.config({ path: '.env.local' });

export type MlsPageListingPayload = Record<string, unknown>;

export type FetchMLSPageOptions = {
  page: number;
  top?: number;
  includeMedia?: boolean;
  orderBy?: string;
  filter?: string;
  requestCount?: boolean;
  timeoutMs?: number;
};

export type FetchMLSPageDiagnostics = {
  page: number;
  top: number;
  skip: number;
  includeMedia: boolean;
  requestCount: boolean;
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
  requestCount = false,
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
    requestCount,
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

function buildPropertyParams({
  page,
  top = MLS_PAGE_DEFAULT_TOP,
  includeMedia = includeMediaByDefault,
  orderBy = 'ModificationTimestamp desc',
  filter,
  requestCount = false,
}: FetchMLSPageOptions) {
  const diagnostics = getFetchMLSPageDiagnostics({
    page,
    top,
    includeMedia,
    requestCount,
  });
  const params: Record<string, string | number> = {
    $orderby: orderBy,
    $skip: diagnostics.skip,
    $top: diagnostics.top,
  };

  if (filter?.trim()) {
    params.$filter = filter.trim();
  }

  if (diagnostics.requestCount) {
    params.$count = 'true';
  }

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

function getSafeRequestContext(requestUrl: URL) {
  return {
    host: requestUrl.host,
    pathname: requestUrl.pathname,
    queryKeys: Array.from(requestUrl.searchParams.keys()).sort(),
  };
}

function isMlsPageError(error: unknown): error is MlsPageError {
  return error instanceof Error;
}

function shouldRetryWithoutMedia(error: unknown) {
  return isMlsPageError(error) && (error.status === 400 || error.status === 404 || error.status === 501);
}

function getPageResponseFromResponse(data: MlsGridResponse): MlsPageResponse<MlsPageListingPayload> {
  if (!Array.isArray(data.value)) {
    throw createMlsPageError('MLS Grid response did not include a value array.', 502, {
      details: getErrorDetails(data),
      responseKeys: data && typeof data === 'object' ? Object.keys(data) : [],
      valueType: typeof data.value,
    });
  }

  return parseMlsODataPageResponse<MlsPageListingPayload>(data);
}

function getListingsFromResponse(data: MlsGridResponse): MlsPageListingPayload[] {
  return getPageResponseFromResponse(data).value;
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

async function requestMLSPageResponseUrl(
  requestUrl: URL,
  timeoutMs: number,
  diagnostics: FetchMLSPageDiagnostics | Record<string, unknown>,
): Promise<MlsPageResponse<MlsPageListingPayload>> {
  const token = getToken();

  if (!token) {
    throw createMlsPageError('Missing MLS_GRID_TOKEN or MLS_API_KEY.');
  }

  const requestContext = getSafeRequestContext(requestUrl);
  const retryPolicy = readMlsGridRetryPolicy();

  for (let attempt = 0; attempt <= retryPolicy.maxRetries; attempt += 1) {
    try {
      return await executeMlsGridRequest(async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

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
                request: requestContext,
                retryAfterMs,
              },
              retryAfterMs,
            );
          }

          return getPageResponseFromResponse(data);
        } catch (error) {
          if (isAbortError(error)) {
            throw createMlsPageError(`MLS Grid request timed out after ${timeoutMs}ms.`, 408, {
              diagnostics,
              timeoutMs,
              request: requestContext,
            });
          }

          if (isMlsPageError(error)) throw error;

          throw createMlsPageError(String(error || 'Unknown MLS Grid page fetch error.'));
        } finally {
          clearTimeout(timeout);
        }
      });
    } catch (error) {
      const shouldRetry =
        isMlsPageError(error) && isRetryableMlsGridStatus(error.status) && attempt < retryPolicy.maxRetries;

      if (!shouldRetry) {
        throw error;
      }

      await waitForMlsGridRetry(attempt, isMlsPageError(error) ? error.retryAfterMs : undefined);
    }
  }

  throw createMlsPageError('MLS Grid request retry loop exhausted.', 503, { diagnostics, request: requestContext });
}

async function requestMLSPageResponse(options: FetchMLSPageOptions): Promise<MlsPageResponse<MlsPageListingPayload>> {
  const timeoutMs = getTimeoutMs(options.timeoutMs);
  const requestUrl = buildPropertyUrl(options);
  const diagnostics = getFetchMLSPageDiagnostics(options);

  return requestMLSPageResponseUrl(requestUrl, timeoutMs, diagnostics);
}

async function requestMLSPage(options: FetchMLSPageOptions): Promise<MlsPageListingPayload[]> {
  const response = await requestMLSPageResponse(options);
  return response.value;
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
  filter,
  page,
  top = MLS_PAGE_DEFAULT_TOP,
  includeMedia = includeMediaByDefault,
  orderBy = 'ModificationTimestamp desc',
  requestCount = false,
  timeoutMs = MLS_PAGE_DEFAULT_TIMEOUT_MS,
}: FetchMLSPageOptions): Promise<MlsPageListingPayload[]> {
  const safePage = getPageNumber(page);
  const safeTop = getPageSize(top);
  const safeTimeoutMs = getTimeoutMs(timeoutMs);
  const diagnostics = getFetchMLSPageDiagnostics({
    page: safePage,
    top: safeTop,
    includeMedia,
    requestCount,
    timeoutMs: safeTimeoutMs,
  });

  try {
    const listings = await requestMLSPage({
      filter,
      page: safePage,
      top: safeTop,
      includeMedia,
      orderBy,
      requestCount,
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
          filter,
          page: safePage,
          top: safeTop,
          includeMedia: false,
          orderBy,
          requestCount,
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

export async function fetchMLSPageResponse({
  filter,
  page,
  top = MLS_PAGE_DEFAULT_TOP,
  includeMedia = includeMediaByDefault,
  orderBy = 'ModificationTimestamp desc',
  requestCount = true,
  timeoutMs = MLS_PAGE_DEFAULT_TIMEOUT_MS,
}: FetchMLSPageOptions): Promise<MlsPageResponse<MlsPageListingPayload>> {
  const safePage = getPageNumber(page);
  const safeTop = getPageSize(top);
  const safeTimeoutMs = getTimeoutMs(timeoutMs);
  const diagnostics = getFetchMLSPageDiagnostics({
    page: safePage,
    top: safeTop,
    includeMedia,
    requestCount,
    timeoutMs: safeTimeoutMs,
  });

  try {
    const response = await requestMLSPageResponse({
      filter,
      page: safePage,
      top: safeTop,
      includeMedia,
      orderBy,
      requestCount,
      timeoutMs: safeTimeoutMs,
    });

    console.log(
      `MLS returned ${response.value.length} listings for page ${safePage}${includeMedia ? ' with media' : ''} ` +
        `(top=${diagnostics.top}, skip=${diagnostics.skip}, count=${response.metadata.sourceCount ?? 'absent'}, ` +
        `nextLink=${response.metadata.hasNextLink ? 'present' : 'absent'}, timeoutMs=${diagnostics.timeoutMs}).`,
    );

    return response;
  } catch (error) {
    if (includeMedia && shouldRetryWithoutMedia(error)) {
      console.warn(`MLS media expansion failed for page ${safePage}. Retrying without Media expansion.`);

      try {
        const response = await requestMLSPageResponse({
          filter,
          page: safePage,
          top: safeTop,
          includeMedia: false,
          orderBy,
          requestCount,
          timeoutMs: safeTimeoutMs,
        });

        console.log(
          `MLS returned ${response.value.length} listings for page ${safePage} without media ` +
            `(top=${diagnostics.top}, skip=${diagnostics.skip}, count=${response.metadata.sourceCount ?? 'absent'}, ` +
            `nextLink=${response.metadata.hasNextLink ? 'present' : 'absent'}, timeoutMs=${diagnostics.timeoutMs}).`,
        );

        return response;
      } catch (fallbackError) {
        logFetchError('MLS fallback fetch error:', fallbackError);
        throw fallbackError;
      }
    }

    logFetchError('MLS fetch error:', error);
    throw error;
  }
}

export async function fetchMLSPageResponseFromNextLink(
  nextLink: string,
  {
    timeoutMs = MLS_PAGE_DEFAULT_TIMEOUT_MS,
  }: Pick<FetchMLSPageOptions, 'timeoutMs'> = {},
): Promise<MlsPageResponse<MlsPageListingPayload>> {
  const safeTimeoutMs = getTimeoutMs(timeoutMs);
  const validation = validateProviderNextLink(nextLink, getBaseUrl());

  if (!validation.ok) {
    throw createMlsPageError(`Rejected MLS Grid nextLink: ${validation.reason}.`, 400, {
      reason: validation.reason,
    });
  }

  const requestUrl = new URL(validation.url);
  const response = await requestMLSPageResponseUrl(requestUrl, safeTimeoutMs, {
    mode: 'provider_next_link',
    request: getSafeRequestContext(requestUrl),
  });

  console.log(
    `MLS returned ${response.value.length} listings from provider nextLink ` +
      `(count=${response.metadata.sourceCount ?? 'absent'}, nextLink=${response.metadata.hasNextLink ? 'present' : 'absent'}, ` +
      `timeoutMs=${safeTimeoutMs}).`,
  );

  return response;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLSPage.ts
