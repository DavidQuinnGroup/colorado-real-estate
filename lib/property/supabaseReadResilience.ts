const TRANSIENT_TRANSPORT_CODES = new Set([
  'ENOTFOUND',
  'EAI_AGAIN',
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'UND_ERR_CONNECT_TIMEOUT',
]);

export const SUPABASE_PROPERTY_READ_MAX_ATTEMPTS = 3;
export const SUPABASE_PROPERTY_READ_BACKOFF_MS = [125, 300] as const;

export type SupabasePropertyReadResilienceEvent =
  | 'SUPABASE_READ_TRANSIENT_FAILURE'
  | 'SUPABASE_READ_RETRY_ATTEMPT'
  | 'SUPABASE_READ_RECOVERED_AFTER_RETRY'
  | 'SUPABASE_READ_RETRY_EXHAUSTED';

type ResilienceEventMetadata = {
  attempt: number;
  errorCode?: string;
};

type ResilientReadFetchOptions = {
  fetchImpl?: typeof fetch;
  sleep?: (milliseconds: number) => Promise<void>;
  onEvent?: (event: SupabasePropertyReadResilienceEvent, metadata: ResilienceEventMetadata) => void;
};

type ErrorLike = {
  code?: unknown;
  cause?: unknown;
  message?: unknown;
};

function sleep(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

function getReadMethod(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.method) return init.method.toUpperCase();
  if (input instanceof Request) return input.method.toUpperCase();
  return 'GET';
}

function findStructuredTransportCode(error: unknown, visited = new Set<unknown>()): string | null {
  if (!error || typeof error !== 'object' || visited.has(error)) return null;
  visited.add(error);

  const candidate = error as ErrorLike;
  if (typeof candidate.code === 'string' && TRANSIENT_TRANSPORT_CODES.has(candidate.code)) {
    return candidate.code;
  }

  return findStructuredTransportCode(candidate.cause, visited);
}

function findMessageTransportCode(error: unknown, visited = new Set<unknown>()): string | null {
  if (!error || typeof error !== 'object' || visited.has(error)) return null;
  visited.add(error);

  const candidate = error as ErrorLike;
  if (typeof candidate.message === 'string') {
    const match = candidate.message.match(/\b(ENOTFOUND|EAI_AGAIN|ECONNRESET|ETIMEDOUT|ECONNREFUSED|UND_ERR_CONNECT_TIMEOUT)\b/);
    if (match) return match[1];
  }

  return findMessageTransportCode(candidate.cause, visited);
}

export function getTransientSupabaseReadTransportCode(error: unknown) {
  return findStructuredTransportCode(error) || findMessageTransportCode(error);
}

function logResilienceEvent(event: SupabasePropertyReadResilienceEvent, metadata: ResilienceEventMetadata) {
  console.warn('[supabase-property-read]', event, metadata);
}

export function createSupabasePropertyReadFetch(options: ResilientReadFetchOptions = {}): typeof fetch {
  const fetchImpl = options.fetchImpl || fetch;
  const delay = options.sleep || sleep;
  const onEvent = options.onEvent || logResilienceEvent;

  return async (input, init) => {
    const method = getReadMethod(input, init);
    if (method !== 'GET' && method !== 'HEAD') {
      throw new Error(`Supabase property resilient transport only permits read requests; received ${method}.`);
    }

    for (let attempt = 1; attempt <= SUPABASE_PROPERTY_READ_MAX_ATTEMPTS; attempt += 1) {
      try {
        const response = await fetchImpl(input, init);
        if (attempt > 1) {
          onEvent('SUPABASE_READ_RECOVERED_AFTER_RETRY', { attempt });
        }
        return response;
      } catch (error) {
        const errorCode = getTransientSupabaseReadTransportCode(error);
        if (!errorCode) throw error;

        onEvent('SUPABASE_READ_TRANSIENT_FAILURE', { attempt, errorCode });
        if (attempt === SUPABASE_PROPERTY_READ_MAX_ATTEMPTS) {
          onEvent('SUPABASE_READ_RETRY_EXHAUSTED', { attempt, errorCode });
          throw error;
        }

        onEvent('SUPABASE_READ_RETRY_ATTEMPT', { attempt: attempt + 1, errorCode });
        await delay(SUPABASE_PROPERTY_READ_BACKOFF_MS[attempt - 1]);
      }
    }

    throw new Error('Supabase property resilient transport reached an unreachable state.');
  };
}
