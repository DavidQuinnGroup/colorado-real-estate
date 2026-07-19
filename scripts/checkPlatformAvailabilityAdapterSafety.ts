import { readFileSync } from "node:fs";

const adapterPath = "lib/platform/availabilityAdapter.ts";
const routePath = "app/api/admin/enterprise/platform-availability-adapter/route.ts";
const publicRoutePath = "app/api/enterprise/platform-availability-adapter/route.ts";
const frameworkPath = "lib/enterprise-kpi/adapterFramework.ts";

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
const framework = read(frameworkPath);

assert(adapter.includes("PLATFORM_AVAILABILITY_ADAPTER_ID = \"PLATFORM_AVAILABILITY\""), "adapter identity must be stable.");
assert(adapter.includes("PLATFORM_AVAILABILITY_PRODUCTION_ORIGIN = \"https://davidquinngroup.com\""), "adapter must use the authoritative production origin.");
assert(adapter.includes("PLATFORM_AVAILABILITY_ENDPOINT_REGISTRY_VERSION"), "adapter must define a governed endpoint registry version.");
assert(adapter.includes("KPI-PLAT-001") && adapter.includes("KPI-PLAT-002"), "adapter must map the supported platform KPIs.");
assert(adapter.includes("UNSUPPORTED") && adapter.includes("UNAVAILABLE"), "adapter must report unsupported or unavailable metrics without fabrication.");
assert(adapter.includes("PROTECTED_UNAUTHENTICATED_401"), "adapter must preserve protected route semantics.");
assert(adapter.includes("SEARCH_API") && adapter.includes("/api/search?limit=1"), "adapter must include the search API endpoint.");
assert(adapter.includes("6137-baseline-rd-boulder-co-ire1349635"), "adapter must use the governed representative property route.");
assert(adapter.includes("AbortController") && adapter.includes("PROBE_TIMEOUT_MS = 10_000"), "adapter probes must be bounded.");
assert(adapter.includes("redirect: \"manual\""), "adapter must not silently follow external redirects.");
assert(adapter.includes("sanitizeErrorMessage"), "adapter must sanitize probe errors.");
assert(!adapter.includes("CRM") && !adapter.includes("MLS Grid") && !adapter.includes("Typesense reset"), "adapter must not include unauthorized operational integrations.");
assert(!adapter.includes("prisma."), "adapter must use the enterprise adapter framework for persistence.");
assert(!adapter.includes("ADMIN_API_KEY") && !adapter.includes("REIE_ADMIN_API_KEY"), "adapter must not read or expose admin secrets.");

assert(route.includes("authorizeRepositoryAdminRequest"), "route must reuse the existing admin auth boundary.");
assert(route.includes("repositoryAdminUnauthorizedResponse"), "route must return the existing unauthorized response.");
assert(route.includes("invokePlatformAvailabilityAdapter"), "route must invoke the platform availability adapter.");
assert(route.includes("inspectPlatformAvailabilityAdapter"), "route must expose admin-only inspection.");
assert(!route.includes("prisma."), "route must not perform direct persistence writes.");
assert(!route.includes("cookies().set") && !route.includes("NextResponse.redirect"), "route must not alter admin auth behavior.");

try {
  readFileSync(publicRoutePath, "utf8");
  assert(false, "public platform availability adapter route must not exist.");
} catch {
  assert(true, "public route absence confirmed.");
}

assert(framework.includes("sourceQueryRef: string | ((source: TSourceState) => string)"), "framework must support sanitized dynamic source references.");
assert(framework.includes("summarizeSourceState?: (source: TSourceState) => unknown"), "framework must support adapter source summaries.");

if (process.exitCode) {
  console.error("Platform Availability Adapter safety check failed.");
  process.exit(process.exitCode);
}

console.log("Platform Availability Adapter safety check passed.");
