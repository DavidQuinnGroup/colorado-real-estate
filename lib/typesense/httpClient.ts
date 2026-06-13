type TypesenseRequestOptions = {
  searchParams?: Record<string, string | number | boolean | undefined>;
};

type TypesenseHttpError = Error & {
  httpStatus?: number;
  response?: unknown;
};

const TYPESENSE_HOST = process.env.TYPESENSE_HOST || 'localhost';
const TYPESENSE_PORT = Number(process.env.TYPESENSE_PORT || 8109);
const TYPESENSE_PROTOCOL = process.env.TYPESENSE_PROTOCOL || 'http';
const TYPESENSE_API_KEY = process.env.TYPESENSE_API_KEY || 'xyz';

function getTypesenseBaseUrl() {
  const port = Number.isFinite(TYPESENSE_PORT) ? TYPESENSE_PORT : 8109;
  return `${TYPESENSE_PROTOCOL}://${TYPESENSE_HOST}:${port}`;
}

function createTypesenseHttpError(message: string, httpStatus?: number, response?: unknown): TypesenseHttpError {
  const error = new Error(message) as TypesenseHttpError;
  error.httpStatus = httpStatus;
  error.response = response;
  return error;
}

function getErrorMessage(response: unknown) {
  if (response && typeof response === 'object') {
    const candidate = response as { message?: unknown; error?: unknown };
    if (typeof candidate.message === 'string') return candidate.message;
    if (typeof candidate.error === 'string') return candidate.error;
  }

  if (typeof response === 'string' && response.trim()) return response;
  return 'Typesense request failed';
}

async function readTypesenseResponse(response: Response) {
  const text = await response.text();
  if (!text.trim()) return {};

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function requestTypesense<TResponse>(path: string, options: TypesenseRequestOptions = {}) {
  const url = new URL(path, getTypesenseBaseUrl());

  Object.entries(options.searchParams || {}).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-TYPESENSE-API-KEY': TYPESENSE_API_KEY,
    },
  });
  const data = await readTypesenseResponse(response);

  if (!response.ok) {
    throw createTypesenseHttpError(getErrorMessage(data), response.status, data);
  }

  return data as TResponse;
}

export function retrieveTypesenseCollection<TResponse>(collectionName: string) {
  return requestTypesense<TResponse>(`/collections/${encodeURIComponent(collectionName)}`);
}

export function searchTypesenseDocuments<TResponse>(
  collectionName: string,
  searchParams: TypesenseRequestOptions['searchParams'],
) {
  return requestTypesense<TResponse>(`/collections/${encodeURIComponent(collectionName)}/documents/search`, {
    searchParams,
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/httpClient.ts
