import { readFileSync } from "node:fs";
const adapterPath = "lib/search/runtimeAdapter.ts";
const routePath = "app/api/admin/enterprise/search-runtime-adapter/route.ts";
const publicRoutePath = "app/api/enterprise/search-runtime-adapter/route.ts";
const registryPath = "lib/enterprise-kpi/registry.ts";
function assert(condition, message) {
    if (!condition) {
        console.error(`FAIL: ${message}`);
        process.exitCode = 1;
    }
}
function read(path) {
    try {
        return readFileSync(path, "utf8");
    }
    catch (error) {
        console.error(`FAIL: unable to read ${path}: ${error instanceof Error ? error.message : "unknown error"}`);
        process.exitCode = 1;
        return "";
    }
}
const adapter = read(adapterPath);
const route = read(routePath);
const registry = read(registryPath);
assert(adapter.includes("SEARCH_RUNTIME_ADAPTER_ID = \"SEARCH_RUNTIME\""), "adapter identity must be stable.");
assert(adapter.includes("SEARCH_RUNTIME_PRODUCTION_ORIGIN = \"https://davidquinngroup.com\""), "adapter must use the authoritative production origin.");
assert(adapter.includes("SEARCH_RUNTIME_PROBE_REGISTRY_VERSION"), "adapter must define a governed probe registry version.");
assert(adapter.includes("KPI-SRCH-001"), "adapter must map KPI-SRCH-001.");
assert(!adapter.includes("KPI-PLAT-002"), "adapter must not map or reinterpret KPI-PLAT-002.");
assert(adapter.includes("SEARCH_RUNTIME_FORMULA"), "adapter must retain the canonical search runtime formula.");
assert(adapter.includes("SUCCESS") && adapter.includes("DEGRADED") && adapter.includes("FALLBACK") && adapter.includes("EMPTY_VALID"), "adapter must preserve usable runtime classifications.");
assert(adapter.includes("UNKNOWN") && adapter.includes("UNAVAILABLE"), "adapter must preserve excluded classifications.");
assert(adapter.includes("/api/search?limit=1"), "adapter must use the deterministic bounded search probe.");
assert(adapter.includes("PROBE_TIMEOUT_MS = 10_000"), "adapter probe must be bounded.");
assert(adapter.includes("redirect: \"manual\""), "adapter must not silently follow redirects.");
assert(adapter.includes("fallbackReasonPresent") && !adapter.includes("fallbackReason:"), "adapter must preserve fallback evidence without raw fallback detail.");
assert(adapter.includes("resultCount") && !adapter.includes("resultPayload") && !adapter.includes("payloadResults"), "adapter must persist counts, not result payloads.");
assert(!adapter.includes("queryText") && !adapter.includes("savedSearch") && !adapter.includes("sessionId"), "adapter must not persist search or session identifiers.");
assert(!adapter.includes("email") && !adapter.includes("phone") && !adapter.includes("ipAddress"), "adapter must not persist personal contact or address metadata.");
assert(!adapter.includes("prisma."), "adapter must use the enterprise adapter framework for persistence.");
assert(!adapter.includes("REIE_ADMIN_API_KEY") && !adapter.includes("ADMIN_API_KEY"), "adapter must not read or expose admin secrets.");
assert(route.includes("authorizeRepositoryAdminRequest"), "route must reuse the existing admin auth boundary.");
assert(route.includes("repositoryAdminUnauthorizedResponse"), "route must return the existing unauthorized response.");
assert(route.includes("invokeSearchRuntimeAdapter"), "route must invoke the search runtime adapter.");
assert(route.includes("inspectSearchRuntimeAdapter"), "route must expose admin-only inspection.");
assert(!route.includes("prisma."), "route must not perform direct persistence writes.");
assert(!route.includes("cookies().set") && !route.includes("NextResponse.redirect"), "route must not alter admin auth behavior.");
try {
    readFileSync(publicRoutePath, "utf8");
    assert(false, "public search runtime adapter route must not exist.");
}
catch {
    assert(true, "public route absence confirmed.");
}
assert(registry.includes("id: \"KPI-SRCH-001\""), "canonical KPI-SRCH-001 must remain registered.");
assert(registry.includes("KPI-PLAT-002 remains owned by Platform Availability Adapter"), "KPI-PLAT-002 boundary must remain documented.");
if (process.exitCode) {
    console.error("Search Runtime Adapter safety check failed.");
    process.exit(process.exitCode);
}
console.log("Search Runtime Adapter safety check passed.");
