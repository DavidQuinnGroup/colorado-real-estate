import { prisma } from '@/lib/prisma';

import { getAppDatabasePreflightFailureMessage, shouldSkipAppDatabasePreflight } from './appDatabasePreflightDiagnostics';

type AppDatabasePreflightContext = {
  operation: string;
  recoveryCommand?: string;
};

export async function assertAppDatabaseReady(context: AppDatabasePreflightContext) {
  if (shouldSkipAppDatabasePreflight()) {
    console.warn(`REIE app database preflight skipped for ${context.operation} by REIE_WORKER_SKIP_DATABASE_PREFLIGHT.`);
    return;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    await prisma.$disconnect().catch(() => undefined);
    throw new Error(getAppDatabasePreflightFailureMessage(context, error));
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/appDatabasePreflight.ts
