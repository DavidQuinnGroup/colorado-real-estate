import { prisma } from '../prisma.js';

type WorkerDatabasePreflightContext = {
  queue: string;
  recoveryCommand?: string;
  worker: string;
};

type DatabasePreflightContext = {
  operation: string;
  recoveryCommand?: string;
};

export type DatabasePreflightDiagnostics = {
  module: 'databasePreflight';
  skipVariable: 'REIE_WORKER_SKIP_DATABASE_PREFLIGHT';
  skipEnabledValues: string[];
  skipDisabled: boolean;
  skipEnabled: boolean;
  skipTrimsAndIgnoresCase: boolean;
  workerOperation: string;
  workerRecoveryCommand: string;
  defaultRecoveryCommand: string;
  normalizedErrorMessage: string;
  failureMessageIncludesOperation: boolean;
  failureMessageIncludesRecoveryCommand: boolean;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message.replace(/\s+/g, ' ').trim();
  return String(error || 'Unknown database preflight failure.');
}

export function shouldSkipDatabasePreflight(env: Record<string, string | undefined> = process.env) {
  const value = env.REIE_WORKER_SKIP_DATABASE_PREFLIGHT;
  return typeof value === 'string' && ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase());
}

function getWorkerDatabasePreflightContext(context: WorkerDatabasePreflightContext): DatabasePreflightContext {
  return {
    operation: `${context.worker} before consuming ${context.queue} jobs`,
    recoveryCommand: context.recoveryCommand,
  };
}

function getDatabasePreflightFailureMessage(context: DatabasePreflightContext, error: unknown) {
  return [
    `Database preflight failed for ${context.operation}.`,
    getErrorMessage(error),
    `Run ${context.recoveryCommand || 'npm run supabase:check'} and resolve Supabase before continuing.`,
  ].join(' ');
}

export function getDatabasePreflightDiagnostics(): DatabasePreflightDiagnostics {
  const workerContext = getWorkerDatabasePreflightContext({
    queue: 'mls-sync',
    recoveryCommand: 'npm run supabase:check:json',
    worker: 'MLS sync worker',
  });
  const sampleError = new Error(' Supabase\nconnection\tfailed ');
  const failureMessage = getDatabasePreflightFailureMessage(workerContext, sampleError);

  return {
    module: 'databasePreflight',
    skipVariable: 'REIE_WORKER_SKIP_DATABASE_PREFLIGHT',
    skipEnabledValues: ['1', 'true', 'yes', 'y'],
    skipDisabled: shouldSkipDatabasePreflight({ REIE_WORKER_SKIP_DATABASE_PREFLIGHT: '0' }),
    skipEnabled: shouldSkipDatabasePreflight({ REIE_WORKER_SKIP_DATABASE_PREFLIGHT: 'true' }),
    skipTrimsAndIgnoresCase: shouldSkipDatabasePreflight({ REIE_WORKER_SKIP_DATABASE_PREFLIGHT: ' YES ' }),
    workerOperation: workerContext.operation,
    workerRecoveryCommand: workerContext.recoveryCommand || 'npm run supabase:check',
    defaultRecoveryCommand: 'npm run supabase:check',
    normalizedErrorMessage: getErrorMessage(sampleError),
    failureMessageIncludesOperation: failureMessage.includes(workerContext.operation),
    failureMessageIncludesRecoveryCommand: failureMessage.includes(workerContext.recoveryCommand || 'npm run supabase:check'),
  };
}

export async function assertWorkerDatabaseReady(context: WorkerDatabasePreflightContext) {
  if (shouldSkipDatabasePreflight()) {
    console.warn(`REIE ${context.worker} database preflight skipped by REIE_WORKER_SKIP_DATABASE_PREFLIGHT.`);
    return;
  }

  await assertDatabaseReady(getWorkerDatabasePreflightContext(context));
}

export async function assertDatabaseReady(context: DatabasePreflightContext) {
  if (shouldSkipDatabasePreflight()) {
    console.warn(`REIE database preflight skipped for ${context.operation} by REIE_WORKER_SKIP_DATABASE_PREFLIGHT.`);
    return;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    await prisma.$disconnect().catch(() => undefined);
    throw new Error(getDatabasePreflightFailureMessage(context, error));
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/databasePreflight.ts
