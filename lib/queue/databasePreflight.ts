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

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message.replace(/\s+/g, ' ').trim();
  return String(error || 'Unknown database preflight failure.');
}

function shouldSkipDatabasePreflight() {
  const value = process.env.REIE_WORKER_SKIP_DATABASE_PREFLIGHT;
  return typeof value === 'string' && ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase());
}

export async function assertWorkerDatabaseReady(context: WorkerDatabasePreflightContext) {
  if (shouldSkipDatabasePreflight()) {
    console.warn(`REIE ${context.worker} database preflight skipped by REIE_WORKER_SKIP_DATABASE_PREFLIGHT.`);
    return;
  }

  await assertDatabaseReady({
    operation: `${context.worker} before consuming ${context.queue} jobs`,
    recoveryCommand: context.recoveryCommand,
  });
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
    throw new Error(
      [
        `Database preflight failed for ${context.operation}.`,
        getErrorMessage(error),
        `Run ${context.recoveryCommand || 'npm run supabase:check'} and resolve Supabase before continuing.`,
      ].join(' '),
    );
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/databasePreflight.ts
