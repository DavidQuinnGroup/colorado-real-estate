import dotenv from "dotenv";

import {
  MLS_PAGE_DEFAULT_LAST_SYNC,
  MLS_PAGE_DEFAULT_TIMEOUT_MS,
  MLS_PAGE_DEFAULT_TOP,
  MLS_PAGE_MAX_TIMEOUT_MS,
  MLS_PAGE_MAX_TOP,
} from "../queue/mlsPageQueue.js";
import { rateLimit } from "./rateLimiter.js";

dotenv.config({ path: ".env.local" });

const includeMediaByDefault = process.env.MLS_GRID_INCLUDE_MEDIA !== "false";
const maxErrorTextLength = 4000;

export type MlsGridListingPayload = Record<string, unknown>;

export type FetchMLSGridListingsOptions = {
  skip: number;
  top: number;
  lastSync: string;
  includeMedia?: boolean;
  timeoutMs?: number;
};

export type MlsGridRequestDiagnostics = {
  skip: number;
  top: number;
  lastSync: string;
  includeMedia: boolean;
  mediaExpansion: "requested" | "disabled";
  timeoutMs: number;
  baseUrlConfigured: boolean;
  tokenConfigured: boolean;
  requestPath: string;
  requestUrl?: string;
  query: {
    $top: number;
    $skip: number;
    $filter: string;
    $orderby: "ModificationTimestamp asc";
    $expand?: "Media";
  };
  bounded: {
    skip: boolean;
    top: boolean;
    lastSync: boolean;
    timeoutMs: boolean;
  };
  limits: {
    minSkip: number;
    maxSkip: number;
    minTop: number;
    maxTop: number;
    minTimeoutMs: number;
    maxTimeoutMs: number;
  };
};

type MlsGridResponse = {
  value?: unknown;
  error?: unknown;
  message?: unknown;
  "@odata.error"?: unknown;
};

type MlsGridError = Error & {
  details?: unknown;
  retryAfterMs?: number;
  status?: number;
};

function getBaseUrl() {
  return (process.env.MLS_GRID_BASE_URL || process.env.MLS_API_URL || "").trim();
}

function getToken() {
  return (process.env.MLS_GRID_TOKEN || process.env.MLS_API_KEY || "").trim();
}

function getSafeInteger(
  value: number | undefined,
  fallback: number,
  min = 0,
  max = Number.MAX_SAFE_INTEGER
) {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.min(Math.max(Math.floor(value), min), max);
}

function getSafeLastSync(lastSync: string | undefined) {
  if (!lastSync) return MLS_PAGE_DEFAULT_LAST_SYNC;

  const parsed = new Date(lastSync);

  if (Number.isNaN(parsed.getTime())) {
    return MLS_PAGE_DEFAULT_LAST_SYNC;
  }

  return parsed.toISOString();
}

export function getMlsGridRequestDiagnostics(
  options: Partial<FetchMLSGridListingsOptions> = {}
): MlsGridRequestDiagnostics {
  const skip = getSafeInteger(options.skip, 0);
  const top = getSafeInteger(options.top, MLS_PAGE_DEFAULT_TOP, 1, MLS_PAGE_MAX_TOP);
  const lastSync = getSafeLastSync(options.lastSync);
  const includeMedia = options.includeMedia ?? includeMediaByDefault;
  const timeoutMs = getSafeInteger(options.timeoutMs, MLS_PAGE_DEFAULT_TIMEOUT_MS, 1000, MLS_PAGE_MAX_TIMEOUT_MS);
  const baseUrl = getBaseUrl().replace(/\/+$/, "");
  const requestPath = "/Property";
  const query: MlsGridRequestDiagnostics["query"] = {
    $top: top,
    $skip: skip,
    $filter: `ModificationTimestamp gt ${lastSync}`,
    $orderby: "ModificationTimestamp asc",
    ...(includeMedia ? { $expand: "Media" as const } : {}),
  };
  let requestUrl: string | undefined;

  if (baseUrl) {
    const url = new URL(`${baseUrl}${requestPath}`);
    url.searchParams.set("$top", String(query.$top));
    url.searchParams.set("$skip", String(query.$skip));
    url.searchParams.set("$filter", query.$filter);
    url.searchParams.set("$orderby", query.$orderby);

    if (query.$expand) {
      url.searchParams.set("$expand", query.$expand);
    }

    requestUrl = url.toString();
  }

  return {
    skip,
    top,
    lastSync,
    includeMedia,
    mediaExpansion: includeMedia ? "requested" : "disabled",
    timeoutMs,
    baseUrlConfigured: Boolean(baseUrl),
    tokenConfigured: Boolean(getToken()),
    requestPath,
    ...(requestUrl ? { requestUrl } : {}),
    query,
    bounded: {
      skip: options.skip !== undefined && skip !== options.skip,
      top: options.top !== undefined && top !== options.top,
      lastSync: options.lastSync !== undefined && lastSync !== options.lastSync,
      timeoutMs: options.timeoutMs !== undefined && timeoutMs !== options.timeoutMs,
    },
    limits: {
      minSkip: 0,
      maxSkip: Number.MAX_SAFE_INTEGER,
      minTop: 1,
      maxTop: MLS_PAGE_MAX_TOP,
      minTimeoutMs: 1000,
      maxTimeoutMs: MLS_PAGE_MAX_TIMEOUT_MS,
    },
  };
}

function trimText(value: string, maxLength = maxErrorTextLength) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength)}\n[TRUNCATED]`;
}

function getErrorDetails(data: MlsGridResponse, responseText: string) {
  return data.error || data["@odata.error"] || data.message || data || trimText(responseText);
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function isMlsGridError(error: unknown): error is MlsGridError {
  return error instanceof Error;
}

function parseRetryAfterMs(value: string | null) {
  if (!value) return undefined;

  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, Math.floor(seconds * 1000));

  const dateMs = Date.parse(value);
  if (!Number.isFinite(dateMs)) return undefined;

  return Math.max(0, dateMs - Date.now());
}

function createMlsGridError(message: string, status?: number, details?: unknown, retryAfterMs?: number): MlsGridError {
  const error = new Error(message) as MlsGridError;
  error.status = status;
  error.details = details;
  error.retryAfterMs = retryAfterMs;
  return error;
}

function buildPropertyUrl({
  skip,
  top,
  lastSync,
  includeMedia = includeMediaByDefault,
}: FetchMLSGridListingsOptions) {
  const baseUrl = getBaseUrl().replace(/\/+$/, "");

  if (!baseUrl) {
    throw new Error("Missing MLS_GRID_BASE_URL or MLS_API_URL.");
  }

  const url = new URL(`${baseUrl}/Property`);

  url.searchParams.set("$top", String(getSafeInteger(top, MLS_PAGE_DEFAULT_TOP, 1, MLS_PAGE_MAX_TOP)));
  url.searchParams.set("$skip", String(getSafeInteger(skip, 0)));
  url.searchParams.set("$filter", `ModificationTimestamp gt ${getSafeLastSync(lastSync)}`);
  url.searchParams.set("$orderby", "ModificationTimestamp asc");

  if (includeMedia) {
    url.searchParams.set("$expand", "Media");
  }

  return url;
}

function getListingsFromResponse(data: MlsGridResponse, requestLabel: string): MlsGridListingPayload[] {
  if (!Array.isArray(data.value)) {
    throw createMlsGridError(`MLS Grid response for ${requestLabel} did not include a value array.`, 502, {
      responseKeys: Object.keys(data),
      valueType: typeof data.value,
    });
  }

  return data.value.filter(
    (listing): listing is MlsGridListingPayload =>
      typeof listing === "object" && listing !== null && !Array.isArray(listing)
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

function shouldRetryWithoutMedia(error: unknown) {
  return (
    isMlsGridError(error) &&
    (error.status === 400 || error.status === 404 || error.status === 501)
  );
}

async function requestListings(
  options: FetchMLSGridListingsOptions
): Promise<MlsGridListingPayload[]> {
  const token = getToken();

  if (!token) {
    throw new Error("Missing MLS_GRID_TOKEN or MLS_API_KEY.");
  }

  await rateLimit();

  const timeoutMs = getSafeInteger(options.timeoutMs, MLS_PAGE_DEFAULT_TIMEOUT_MS, 1000, MLS_PAGE_MAX_TIMEOUT_MS);
  const diagnostics = getMlsGridRequestDiagnostics(options);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const requestUrl = buildPropertyUrl(options);
  const requestLabel = `skip ${requestUrl.searchParams.get("$skip") || "0"}`;

  try {
    const response = await fetch(requestUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    const { data, text } = await readJsonResponse(response);
    const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));

    if (!response.ok) {
      throw createMlsGridError(
        retryAfterMs
          ? `MLS Grid API error: ${response.status}. Retry after ${Math.ceil(retryAfterMs / 1000)}s.`
          : `MLS Grid API error: ${response.status}`,
        response.status,
        {
          details: getErrorDetails(data, text),
          request: {
            diagnostics,
            includeMedia: options.includeMedia ?? includeMediaByDefault,
            skip: requestUrl.searchParams.get("$skip"),
            top: requestUrl.searchParams.get("$top"),
          },
          retryAfterMs,
        },
        retryAfterMs
      );
    }

    return getListingsFromResponse(data, requestLabel);
  } catch (error) {
    if (isAbortError(error)) {
      throw createMlsGridError(`MLS Grid request timed out after ${timeoutMs}ms.`, 408, {
        timeoutMs,
        request: {
          diagnostics,
          includeMedia: options.includeMedia ?? includeMediaByDefault,
          skip: requestUrl.searchParams.get("$skip"),
          top: requestUrl.searchParams.get("$top"),
        },
      });
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchMLSGridListings({
  skip,
  top,
  lastSync,
  includeMedia = includeMediaByDefault,
  timeoutMs = MLS_PAGE_DEFAULT_TIMEOUT_MS,
}: FetchMLSGridListingsOptions): Promise<MlsGridListingPayload[]> {
  const safeSkip = getSafeInteger(skip, 0);
  const safeTop = getSafeInteger(top, MLS_PAGE_DEFAULT_TOP, 1, MLS_PAGE_MAX_TOP);
  const safeLastSync = getSafeLastSync(lastSync);
  const safeTimeoutMs = getSafeInteger(timeoutMs, MLS_PAGE_DEFAULT_TIMEOUT_MS, 1000, MLS_PAGE_MAX_TIMEOUT_MS);

  try {
    const listings = await requestListings({
      skip: safeSkip,
      top: safeTop,
      lastSync: safeLastSync,
      includeMedia,
      timeoutMs: safeTimeoutMs,
    });

    console.log(
      `MLS Grid returned ${listings.length} listings from skip ${safeSkip}${includeMedia ? " with media." : "."}`
    );
    return listings;
  } catch (error) {
    if (includeMedia && shouldRetryWithoutMedia(error)) {
      console.warn(`MLS Grid media expansion failed from skip ${safeSkip}. Retrying without media.`);

      const listings = await requestListings({
        skip: safeSkip,
        top: safeTop,
        lastSync: safeLastSync,
        includeMedia: false,
        timeoutMs: safeTimeoutMs,
      });

      console.log(`MLS Grid returned ${listings.length} listings from skip ${safeSkip} without media.`);
      return listings;
    }

    if (isMlsGridError(error) && error.details) {
      console.error("MLS Grid fetch details:", error.details);
    }

    throw error;
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/mlsGridClient.ts
