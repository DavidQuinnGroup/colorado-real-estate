import { Redis, type RedisOptions } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const MAX_RECONNECT_DELAY_MS = 30_000;
const ONE_SHOT_RECONNECT_ATTEMPTS = 2;
const ONE_SHOT_COMMAND_NAMES = new Set(['run:queue-dashboard', 'run:mls-sync', 'run:mls-sync:dry', 'run:mls-sync:live']);
const redisErrorLogState = new Map<string, { count: number; lastMessage: string }>();
const redisConnections = new Set<Redis>();

type RedisDiagnosticsContext = {
  argv?: string[];
  lifecycleEvent?: string;
  redisRetryMode?: string;
  redisUrl?: string;
};

export type RedisConnectionDiagnostics = {
  connectionName: string;
  configured: boolean;
  host: string;
  port: number;
  db?: number;
  usernameConfigured: boolean;
  passwordConfigured: boolean;
  tls: boolean;
  retryMode: 'bounded' | 'continuous';
  oneShotReconnectAttempts: number;
  maxReconnectDelayMs: number;
  sampleRetryDelaysMs: Array<number | null>;
  options: {
    enableReadyCheck: false;
    lazyConnect: true;
    maxRetriesPerRequest: null;
  };
  commands: {
    queueDashboard: string;
    dryRunSync: string;
    startMlsWorker: string;
    startMlsPageWorker: string;
    infraUp: string;
  };
};

function getRetryDelay(attempt: number) {
  return Math.min(attempt * 500, MAX_RECONNECT_DELAY_MS);
}

function isOneShotProcess(context: RedisDiagnosticsContext = {}) {
  const lifecycleEvent = context.lifecycleEvent ?? process.env.npm_lifecycle_event ?? '';
  const argv = (context.argv ?? process.argv).join(' ');

  return (
    (context.redisRetryMode ?? process.env.REIE_REDIS_RETRY_MODE) === 'bounded' ||
    ONE_SHOT_COMMAND_NAMES.has(lifecycleEvent) ||
    argv.includes('queueDashboard') ||
    argv.includes('mlsSync')
  );
}

function getRetryStrategy(context: RedisDiagnosticsContext = {}) {
  if (!isOneShotProcess(context)) return getRetryDelay;

  return (attempt: number) => {
    if (attempt > ONE_SHOT_RECONNECT_ATTEMPTS) return null;
    return getRetryDelay(attempt);
  };
}

function buildRedisOptions(connectionName: string): RedisOptions {
  return {
    connectionName,
    enableReadyCheck: false,
    lazyConnect: true,
    maxRetriesPerRequest: null,
    retryStrategy: getRetryStrategy(),
  };
}

function parseRedisUrl(redisUrl: string): RedisOptions {
  const url = new URL(redisUrl);
  const db = url.pathname.replace(/^\//, '');
  const dbNumber = db ? Number(db) : undefined;

  return {
    host: url.hostname || '127.0.0.1',
    port: url.port ? Number(url.port) : 6379,
    username: url.username ? decodeURIComponent(url.username) : undefined,
    password: url.password ? decodeURIComponent(url.password) : undefined,
    db: dbNumber !== undefined && Number.isFinite(dbNumber) ? dbNumber : undefined,
    tls: url.protocol === 'rediss:' ? {} : undefined,
  };
}

export function getRedisConnectionDiagnostics(
  connectionName = 'reie-bullmq',
  context: RedisDiagnosticsContext = {},
): RedisConnectionDiagnostics {
  const redisUrl = context.redisUrl ?? REDIS_URL;
  const parsed = parseRedisUrl(redisUrl);
  const retryStrategy = getRetryStrategy(context);
  const retryMode = isOneShotProcess(context) ? 'bounded' : 'continuous';

  return {
    connectionName,
    configured: Boolean(context.redisUrl ?? process.env.REDIS_URL),
    host: parsed.host ?? '127.0.0.1',
    port: parsed.port ?? 6379,
    db: parsed.db,
    usernameConfigured: Boolean(parsed.username),
    passwordConfigured: Boolean(parsed.password),
    tls: Boolean(parsed.tls),
    retryMode,
    oneShotReconnectAttempts: ONE_SHOT_RECONNECT_ATTEMPTS,
    maxReconnectDelayMs: MAX_RECONNECT_DELAY_MS,
    sampleRetryDelaysMs: [1, 2, 3].map((attempt) => retryStrategy(attempt)),
    options: {
      enableReadyCheck: false,
      lazyConnect: true,
      maxRetriesPerRequest: null,
    },
    commands: {
      queueDashboard: 'npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000',
      dryRunSync: 'npm run run:mls-sync:dry',
      startMlsWorker: 'npm run run:worker:mls',
      startMlsPageWorker: 'npm run run:worker:mls-page',
      infraUp: 'npm run infra:up',
    },
  };
}

function attachRedisDiagnostics(client: Redis, connectionName: string) {
  client.on('error', (error) => {
    const state = redisErrorLogState.get(connectionName) || { count: 0, lastMessage: '' };
    const message = error.message || error.name || String(error);
    const errorCode = (error as NodeJS.ErrnoException).code;
    const summary = errorCode ? `${message} (${errorCode})` : message;
    const isOneShot = isOneShotProcess();

    state.count += 1;

    if ((isOneShot && state.count === 1) || (!isOneShot && (state.count <= 3 || state.lastMessage !== summary))) {
      console.error(`REIE Redis connection "${connectionName}" error: ${summary}`);
    }

    state.lastMessage = summary;
    redisErrorLogState.set(connectionName, state);
  });

  client.on('reconnecting', (delay: number) => {
    const retryMode = isOneShotProcess() ? 'bounded' : 'continuous';
    const state = redisErrorLogState.get(`${connectionName}:reconnect`) || { count: 0, lastMessage: '' };

    state.count += 1;
    redisErrorLogState.set(`${connectionName}:reconnect`, state);

    if (retryMode === 'bounded' && state.count > 1) return;

    console.warn(`REIE Redis connection "${connectionName}" reconnecting in ${delay}ms (${retryMode}).`);
  });

  return client;
}

export function getRedisUrl() {
  return REDIS_URL;
}

export function getRedisConnection(connectionName = 'reie-bullmq') {
  const connection = attachRedisDiagnostics(new Redis({ ...parseRedisUrl(REDIS_URL), ...buildRedisOptions(connectionName) }), connectionName);
  redisConnections.add(connection);
  return connection;
}

export function getSharedRedisConnection() {
  return getRedisConnection('reie-shared');
}

export async function closeRedisConnections() {
  await Promise.allSettled(
    [...redisConnections].map(async (connection) => {
      redisConnections.delete(connection);
      connection.disconnect(false);
    }),
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/redis.ts
