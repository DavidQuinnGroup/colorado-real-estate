import 'dotenv/config';
import { spawn, ChildProcess } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type WorkerName = 'mls' | 'mls-page' | 'alert';

type WorkerDefinition = {
  name: WorkerName;
  label: string;
  script: string;
  env?: NodeJS.ProcessEnv;
};

const WORKER_NAMES: WorkerName[] = ['mls', 'mls-page', 'alert'];

const HELP_TEXT = `
REIE worker coordinator

Usage:
  node dist/workers/main.js [options]

Options:
  --workers=<list>   Comma-separated workers to run: mls,mls-page,alert.
  --help             Show this help text.

Environment:
  REIE_WORKERS       Fallback worker list when --workers is omitted.

Examples:
  node dist/workers/main.js
  node dist/workers/main.js --workers=mls,mls-page
  REIE_WORKERS=alert node dist/workers/main.js
`;

function printHelp() {
  console.log(HELP_TEXT.trim());
}

function getWorkerListArg(argv: string[]) {
  const arg = argv.find((value) => value.startsWith('--workers='));
  if (!arg) return process.env.REIE_WORKERS;

  return arg.split('=')[1];
}

function parseWorkerNames(argv: string[]): WorkerName[] | null {
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return null;
  }

  const requested = getWorkerListArg(argv);
  if (!requested) return WORKER_NAMES;

  const names = requested
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  const unknown = names.filter((name) => !WORKER_NAMES.includes(name as WorkerName));
  if (unknown.length) {
    throw new Error(`Unknown worker name(s): ${unknown.join(', ')}.`);
  }

  return names as WorkerName[];
}

function buildWorkerDefinitions(baseDir: string): WorkerDefinition[] {
  return [
    {
      name: 'mls',
      label: 'MLS Sync Worker',
      script: join(baseDir, 'mlsWorker.js'),
    },
    {
      name: 'mls-page',
      label: 'MLS Page Worker',
      script: join(baseDir, 'mlsPageWorker.js'),
    },
    {
      name: 'alert',
      label: 'Alert Worker',
      script: join(baseDir, 'alertWorker.js'),
    },
  ];
}

function startWorker(definition: WorkerDefinition) {
  const child = spawn(process.execPath, [definition.script], {
    env: {
      ...process.env,
      ...definition.env,
    },
    stdio: 'inherit',
  });

  child.on('exit', (code, signal) => {
    const reason = signal ? `signal ${signal}` : `code ${code}`;
    console.log(`${definition.label} exited with ${reason}.`);
  });

  child.on('error', (error) => {
    console.error(`${definition.label} failed to start:`, error);
  });

  console.log(`${definition.label} started with pid ${child.pid}.`);
  return child;
}

async function stopWorkers(children: ChildProcess[], signal: NodeJS.Signals) {
  console.log(`REIE worker coordinator received ${signal}. Stopping ${children.length} worker(s).`);

  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  process.exit(0);
}

async function main() {
  const selectedWorkers = parseWorkerNames(process.argv.slice(2));
  if (!selectedWorkers) return;

  const baseDir = dirname(fileURLToPath(import.meta.url));
  const definitions = buildWorkerDefinitions(baseDir).filter((definition) => selectedWorkers.includes(definition.name));
  const children = definitions.map(startWorker);

  process.on('SIGINT', (signal) => {
    void stopWorkers(children, signal);
  });

  process.on('SIGTERM', (signal) => {
    void stopWorkers(children, signal);
  });

  console.log('REIE worker coordinator online:', {
    workers: definitions.map((definition) => definition.name),
  });
}

main().catch((error) => {
  console.error('REIE worker coordinator failed:', error);
  process.exit(1);
});

// workers/main.ts
