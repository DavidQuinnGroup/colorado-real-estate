import { readFileSync } from "node:fs";

const adapterPath = "lib/internal-preview/previewAdapter.ts";
const routePath = "app/api/admin/enterprise/internal-preview-adapter/route.ts";
const publicRoutePath = "app/api/enterprise/internal-preview-adapter/route.ts";
const registryPath = "lib/enterprise-kpi/registry.ts";
const packagePath = "package.json";
const workerTsconfigPath = "tsconfig.worker.json";

function assert(condition: unknown, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  }
}

function read(path: string) {
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    console.error(`FAIL: unable to read ${path}: ${error instanceof Error ? error.message : "unknown error"}`);
    process.exitCode = 1;
    return "";
  }
}

const adapter = read(adapterPath);
const route = read(routePath);
const registry = read(registryPath);
const packageJson = read(packagePath);
const workerTsconfig = read(workerTsconfigPath);

assert(adapter.includes("INTERNAL_PREVIEW_ADAPTER_ID = \"INTERNAL_PREVIEW\""), "adapter identity must be stable.");
assert(adapter.includes("PROJECT-ATLAS-RC1-internal-preview-certification-v1"), "adapter must define a governed source version.");
assert(adapter.includes("release-candidate-board.json"), "adapter must read the governed release candidate board.");
assert(adapter.includes("RC1-CERT-001.md"), "adapter must read the governed RC1 certification record.");
assert(adapter.includes("CERTIFIED_FOR_INTERNAL_PREVIEW"), "adapter must preserve the certification decision.");
assert(adapter.includes("KPI-OPS-001"), "adapter must map operational issue status.");
assert(adapter.includes("KPI-CUST-001") && adapter.includes("KPI-GROW-002"), "adapter must inspect the Internal Preview KPI set.");
assert(adapter.includes("value: null"), "adapter must explicitly preserve unavailable preview telemetry sources.");
assert(adapter.includes("No governed roster table") && adapter.includes("No approved session telemetry"), "adapter must not infer unavailable customer metrics.");
assert(adapter.includes("SUPPORTED_BY_OTHER_ADAPTER"), "adapter must not claim platform or search adapter ownership.");
assert(!adapter.includes("fetch("), "adapter must not make live network calls.");
assert(!adapter.includes("prisma."), "adapter must use the enterprise adapter framework for persistence.");
assert(!adapter.includes("process.env.OPENAI") && !adapter.includes("openai"), "adapter must not invoke OpenAI.");
assert(!adapter.includes("MLS") && !adapter.includes("TitlePro247"), "adapter must not touch MLS or TitlePro247.");
assert(!adapter.includes("emailAddress") && !adapter.includes("phoneNumber") && !adapter.includes("sessionId") && !adapter.includes("ipAddress"), "adapter must not persist personal/session identifiers.");
assert(adapter.includes("do not infer participants from production User rows"), "adapter must explicitly prohibit production-user participant inference.");

assert(route.includes("authorizeRepositoryAdminRequest"), "route must reuse the existing admin auth boundary.");
assert(route.includes("repositoryAdminUnauthorizedResponse"), "route must return the existing unauthorized response.");
assert(route.includes("invokeInternalPreviewAdapter"), "route must invoke the Internal Preview adapter.");
assert(route.includes("inspectInternalPreviewAdapter"), "route must expose admin-only inspection.");
assert(route.includes("runtime = \"nodejs\""), "route must use the Node runtime for governed record reads.");
assert(!route.includes("prisma."), "route must not perform direct persistence writes.");
assert(!route.includes("cookies().set") && !route.includes("NextResponse.redirect"), "route must not alter admin auth behavior.");

try {
  readFileSync(publicRoutePath, "utf8");
  assert(false, "public Internal Preview adapter route must not exist.");
} catch {
  assert(true, "public route absence confirmed.");
}

for (const kpi of [
  "KPI-CUST-001",
  "KPI-CUST-002",
  "KPI-CUST-003",
  "KPI-CUST-004",
  "KPI-CUST-005",
  "KPI-OPS-001",
  "KPI-OPS-002",
  "KPI-BUS-001",
  "KPI-BUS-002",
  "KPI-GROW-001",
  "KPI-GROW-002",
]) {
  assert(registry.includes(`id: \"${kpi}\"`), `${kpi} must remain registered.`);
}

assert(packageJson.includes("check:internal-preview-adapter-safety"), "package script must expose the safety check.");
assert(workerTsconfig.includes("lib/internal-preview/**/*.ts"), "worker build must compile the adapter.");
assert(workerTsconfig.includes("scripts/checkInternalPreviewAdapterSafety.ts"), "worker build must compile the safety script.");

if (process.exitCode) {
  console.error("Internal Preview Adapter safety check failed.");
  process.exit(process.exitCode);
}

console.log("Internal Preview Adapter safety check passed.");
