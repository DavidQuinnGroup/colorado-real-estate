import "../lib/env/loadNodeEnv.js";

import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

import { GOF_WAVE_3_AUTHORIZATION_SCOPE, buildGofWave3ColoradoPersistenceContract } from "../lib/gof/coloradoControlledProductionPersistence.js";
import {
  executeGofWave3bColoradoProductionPersistence,
  type GofWave3bExecutionControls,
  type GofWave3bMode,
} from "../lib/gof/coloradoProductionExecutionAdapter.js";

export type GofWave3bCliOptions = Readonly<{
  mode: GofWave3bMode;
  scope: string;
  expectedCommit: string | null;
  candidateFingerprint: string | null;
  confirmProduction: boolean;
  authorizationId: string | null;
  operatorId: string | null;
  acknowledgePersistenceNotRetrieval: boolean;
  acknowledgeNoRelationships: boolean;
  acknowledgeNoCustomerVisibility: boolean;
  help: boolean;
}>;

type Env = Readonly<Record<string, string | undefined>>;

const TOKEN_ENV = "GOF_WAVE_3B_OPERATOR_AUTHORIZATION_TOKEN";

export function parseGofWave3bCliOptions(argv: readonly string[]): GofWave3bCliOptions {
  const values = new Map<string, string>();
  let mode: GofWave3bMode = "dry-run";
  let selectedModeFlag: string | null = null;
  let help = false;
  const flags = new Set<string>();
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      help = true;
      continue;
    }
    if (arg === "--dry-run") {
      if (selectedModeFlag) throw new Error("GOF Wave 3B accepts only one mode flag.");
      selectedModeFlag = arg;
      mode = "dry-run";
      continue;
    }
    if (arg === "--execute") {
      if (selectedModeFlag) throw new Error("GOF Wave 3B accepts only one mode flag.");
      selectedModeFlag = arg;
      mode = "execute";
      continue;
    }
    if (arg === "--verify") {
      if (selectedModeFlag) throw new Error("GOF Wave 3B accepts only one mode flag.");
      selectedModeFlag = arg;
      mode = "verify";
      continue;
    }
    if ([
      "--confirm-production",
      "--acknowledge-persistence-not-retrieval",
      "--acknowledge-no-relationships",
      "--acknowledge-no-customer-visibility",
    ].includes(arg)) {
      flags.add(arg);
      continue;
    }
    if (arg.startsWith("--") && arg.includes("=")) {
      const separator = arg.indexOf("=");
      const key = arg.slice(0, separator);
      const value = arg.slice(separator + 1);
      values.set(key, value);
      continue;
    }
    if (arg.startsWith("--")) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}.`);
      values.set(arg, value);
      index += 1;
      continue;
    }
    throw new Error(`Unsupported argument: ${arg}`);
  }
  return Object.freeze({
    mode,
    scope: values.get("--scope") ?? GOF_WAVE_3_AUTHORIZATION_SCOPE,
    expectedCommit: values.get("--expected-commit") ?? null,
    candidateFingerprint: values.get("--candidate-fingerprint") ?? null,
    confirmProduction: flags.has("--confirm-production"),
    authorizationId: values.get("--authorization-id") ?? null,
    operatorId: values.get("--operator-id") ?? null,
    acknowledgePersistenceNotRetrieval: flags.has("--acknowledge-persistence-not-retrieval"),
    acknowledgeNoRelationships: flags.has("--acknowledge-no-relationships"),
    acknowledgeNoCustomerVisibility: flags.has("--acknowledge-no-customer-visibility"),
    help,
  });
}

export function usage(): string {
  return [
    "Usage:",
    "  npm run activate:gof-wave-3b-colorado-persistence -- --dry-run",
    "  npm run activate:gof-wave-3b-colorado-persistence -- --execute --scope GOF_WAVE_3_CONTROLLED_COLORADO_PRODUCTION_PERSISTENCE_ACTIVATION --expected-commit <COMMIT> --candidate-fingerprint <FINGERPRINT> --confirm-production --authorization-id <ID> --operator-id <ID> --acknowledge-persistence-not-retrieval --acknowledge-no-relationships --acknowledge-no-customer-visibility",
    "",
    "Execution also requires GOF_WAVE_3B_OPERATOR_AUTHORIZATION_TOKEN in the environment.",
  ].join("\n");
}

export function buildGofWave3bControls(options: GofWave3bCliOptions, env: Env): GofWave3bExecutionControls {
  const repository = readRepositoryControl(options.expectedCommit);
  const fingerprint = options.candidateFingerprint ?? buildGofWave3ColoradoPersistenceContract().evidenceFingerprint;
  if (options.mode === "execute") {
    if (!options.expectedCommit) throw new Error("GOF Wave 3B execute requires --expected-commit.");
    if (options.scope !== GOF_WAVE_3_AUTHORIZATION_SCOPE) throw new Error("GOF Wave 3B execute requires exact activation scope.");
    if (!options.confirmProduction) throw new Error("GOF Wave 3B execute requires --confirm-production.");
    if (!options.authorizationId || !options.operatorId) throw new Error("GOF Wave 3B execute requires operator authorization metadata.");
    if (!env[TOKEN_ENV]) throw new Error(`GOF Wave 3B execute requires ${TOKEN_ENV}.`);
  }
  return Object.freeze({
    mode: options.mode,
    executionScope: options.scope,
    environment: "production",
    confirmProduction: options.mode === "execute" ? options.confirmProduction : true,
    certifiedCandidateFingerprint: fingerprint,
    repository,
    operatorAuthorization: options.authorizationId && options.operatorId
      ? Object.freeze({
          authorizationId: options.authorizationId,
          operatorId: options.operatorId,
          authorizedAt: new Date().toISOString(),
          tokenPresent: Boolean(env[TOKEN_ENV]),
          acknowledgesPersistenceNotRetrieval: options.acknowledgePersistenceNotRetrieval as true,
          acknowledgesNoRelationships: options.acknowledgeNoRelationships as true,
          acknowledgesNoCustomerVisibility: options.acknowledgeNoCustomerVisibility as true,
        })
      : null,
  });
}

async function main(): Promise<void> {
  const options = parseGofWave3bCliOptions(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  assertMigrationsUpToDate();
  const controls = buildGofWave3bControls(options, process.env);
  const prisma = new PrismaClient();
  try {
    const result = await executeGofWave3bColoradoProductionPersistence(prisma, controls);
    console.log(JSON.stringify(redactForOutput(result), null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

function readRepositoryControl(expectedCommit: string | null): GofWave3bExecutionControls["repository"] {
  const branch = execGit(["rev-parse", "--abbrev-ref", "HEAD"]);
  const head = execGit(["rev-parse", "HEAD"]);
  const originMain = execGit(["rev-parse", "origin/main"]);
  const status = execGit(["status", "--porcelain"]);
  return Object.freeze({
    branch: branch as "main",
    head,
    originMain,
    expectedCommit: expectedCommit ?? head,
    workingTreeClean: status.length === 0,
  });
}

function assertMigrationsUpToDate(): void {
  const output = execFileSync("npx", ["prisma", "migrate", "status"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (!output.includes("Database schema is up to date!")) {
    throw new Error("GOF Wave 3B requires Prisma migration status to be up to date.");
  }
}

function execGit(args: readonly string[]): string {
  return execFileSync("git", [...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function redactForOutput(result: Awaited<ReturnType<typeof executeGofWave3bColoradoProductionPersistence>>) {
  return {
    invocationId: result.invocationId,
    mode: result.mode,
    status: result.status,
    targetEnvironment: result.targetEnvironment,
    repository: result.repository,
    candidateFingerprint: result.candidateFingerprint,
    preflightStatus: result.preflightStatus,
    created: result.created,
    deduplicated: result.deduplicated,
    conflictCount: result.conflictCount,
    relationshipWrites: result.relationshipWrites,
    propertyRelationshipWrites: result.propertyRelationshipWrites,
    thorntonVerification: result.thorntonVerification,
    postWriteVerificationStatus: result.postWriteVerificationStatus,
    retrievalEnabled: result.retrievalEnabled,
    customerVisibilityEnabled: result.customerVisibilityEnabled,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
