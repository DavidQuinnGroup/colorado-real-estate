export type MlsODataPayload<T extends Record<string, unknown> = Record<string, unknown>> = {
  value?: unknown;
  '@odata.count'?: unknown;
  '@odata.nextLink'?: unknown;
  error?: unknown;
  message?: unknown;
  '@odata.error'?: unknown;
};

export type MlsPaginationTerminationSignal = 'next_link_absent' | 'empty_page' | 'not_terminal';

export type MlsNextLinkValidation =
  | {
      ok: true;
      url: string;
    }
  | {
      ok: false;
      reason: 'missing_base_url' | 'missing_next_link' | 'invalid_url' | 'credentialed_url' | 'unsupported_protocol' | 'wrong_host';
    };

export type MlsPageMetadata = {
  sourceCount: number | null;
  nextLink: string | null;
  hasNextLink: boolean;
  terminationSignal: MlsPaginationTerminationSignal;
  valueLength: number;
  rawResponseKeys: string[];
};

export type MlsPageResponse<T extends Record<string, unknown> = Record<string, unknown>> = {
  value: T[];
  metadata: MlsPageMetadata;
};

export function toMlsValueArray<T extends Record<string, unknown> = Record<string, unknown>>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];

  return value.filter((entry): entry is T => typeof entry === 'object' && entry !== null && !Array.isArray(entry));
}

function getRawResponseKeys(payload: MlsODataPayload | unknown) {
  return payload && typeof payload === 'object' ? Object.keys(payload) : [];
}

function getSourceCount(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function getNextLink(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function getTerminationSignal(valueLength: number, hasNextLink: boolean): MlsPaginationTerminationSignal {
  if (valueLength === 0) return 'empty_page';
  if (!hasNextLink) return 'next_link_absent';
  return 'not_terminal';
}

export function parseMlsODataPageResponse<T extends Record<string, unknown> = Record<string, unknown>>(
  payload: MlsODataPayload<T>,
): MlsPageResponse<T> {
  const value = toMlsValueArray<T>(payload.value);
  const nextLink = getNextLink(payload['@odata.nextLink']);
  const hasNextLink = Boolean(nextLink);

  return {
    value,
    metadata: {
      sourceCount: getSourceCount(payload['@odata.count']),
      nextLink,
      hasNextLink,
      terminationSignal: getTerminationSignal(value.length, hasNextLink),
      valueLength: value.length,
      rawResponseKeys: getRawResponseKeys(payload),
    },
  };
}

export function validateProviderNextLink(nextLink: string | null | undefined, providerBaseUrl: string): MlsNextLinkValidation {
  if (!nextLink?.trim()) {
    return {
      ok: false,
      reason: 'missing_next_link',
    };
  }

  if (/\s/.test(nextLink)) {
    return {
      ok: false,
      reason: 'invalid_url',
    };
  }

  if (!providerBaseUrl.trim()) {
    return {
      ok: false,
      reason: 'missing_base_url',
    };
  }

  let baseUrl: URL;
  let url: URL;

  try {
    baseUrl = new URL(providerBaseUrl);
    url = new URL(nextLink, baseUrl);
  } catch {
    return {
      ok: false,
      reason: 'invalid_url',
    };
  }

  if (url.username || url.password) {
    return {
      ok: false,
      reason: 'credentialed_url',
    };
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return {
      ok: false,
      reason: 'unsupported_protocol',
    };
  }

  if (url.host !== baseUrl.host) {
    return {
      ok: false,
      reason: 'wrong_host',
    };
  }

  return {
    ok: true,
    url: url.toString(),
  };
}

export function getMlsProcessedCountSemantics() {
  return {
    field: 'MlsSyncState.totalRecords',
    meaning: 'LOCAL_PROCESSED_RECORD_COUNT',
    not: ['SOURCE_TOTAL_COUNT', 'INTENDED_SCOPE_COUNT'],
  } as const;
}
