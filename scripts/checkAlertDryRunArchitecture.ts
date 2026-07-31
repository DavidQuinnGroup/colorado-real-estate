import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type CheckResult = {
  file: string;
  forbidden: string[];
};

const filesToScan = [
  'lib/alerts/intent/types.ts',
  'lib/alerts/intent/evaluateAlertIntent.ts',
  'lib/alerts/intent/fixtures.ts',
  'scripts/runAlertIntentFixtures.ts',
];

const forbiddenPatterns: [RegExp, string][] = [
  [/@prisma\/client/, '@prisma/client import'],
  [/from ['"][^'"]*prisma[^'"]*['"]/, 'Prisma module import'],
  [/from ['"]bullmq['"]/, 'BullMQ import'],
  [/new\s+Queue\b/, 'BullMQ Queue constructor'],
  [/new\s+Worker\b/, 'BullMQ Worker constructor'],
  [/from ['"][^'"]*redis[^'"]*['"]/, 'Redis import'],
  [/from ['"]resend['"]/, 'Resend import'],
  [/from ['"][^'"]*\/app\//, 'route/app import'],
  [/from ['"][^'"]*\/workers?\//, 'worker import'],
  [/loadNodeEnv/, 'environment loader import'],
  [/process\.env/, 'environment access'],
  [/node:fs|['"]fs['"]/, 'filesystem import'],
  [/node:net|['"]net['"]|node:http|['"]http['"]|node:https|['"]https['"]/, 'network import'],
  [/matchAndNotify|queueAlert\(|enqueueAlert\(|processAlertQueue|processAlertById/, 'live orchestration reference'],
  [/\.(create|update|delete|upsert|createMany|updateMany|deleteMany)\s*\(/, 'Prisma-style write method call'],
  [/\$transaction\s*\(/, 'Prisma transaction call'],
  [/\.(add|remove|retry|promote)\s*\(/, 'BullMQ mutation method call'],
  [/emails\.send\s*\(/, 'provider send call'],
];

function scanFile(file: string): CheckResult {
  const absolutePath = resolve(file);
  const source = readFileSync(absolutePath, 'utf8');
  const forbidden = forbiddenPatterns
    .filter(([pattern]) => pattern.test(source))
    .map(([, label]) => label);

  return {
    file,
    forbidden,
  };
}

const results = filesToScan.map(scanFile);
const failures = results.filter((result) => result.forbidden.length > 0);

console.log(
  JSON.stringify(
    {
      success: failures.length === 0,
      check: 'alert-dry-run-architecture',
      scannedFiles: filesToScan.length,
      writesFiles: false,
      mutatesDatabase: false,
      mutatesQueue: false,
      callsProvider: false,
      activatesWorkers: false,
      failures,
    },
    null,
    2,
  ),
);

if (failures.length > 0) process.exitCode = 1;
