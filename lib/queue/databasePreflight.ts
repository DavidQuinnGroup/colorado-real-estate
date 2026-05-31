import { prisma } from '../prisma.js';

type WorkerDatabasePreflightContext = {
  queue: string;
  recoveryCommand?: string;
  worker: string;
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

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    await prisma.$disconnect().catch(() => undefined);
    throw new Error(
      [
        `Database preflight failed for ${context.worker} before consuming ${context.queue} jobs.`,
        getErrorMessage(error),
        `Run ${context.recoveryCommand || 'npm run supabase:check'} and resolve Supabase before starting this worker.`,
      ].join(' '),
    );
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/databasePreflight.ts
