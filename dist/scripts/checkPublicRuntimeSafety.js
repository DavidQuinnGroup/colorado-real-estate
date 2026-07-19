import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const prohibitedDdlPatterns = [
    /CREATE\s+EXTENSION/i,
    /CREATE\s+TABLE/i,
    /ALTER\s+TABLE/i,
    /CREATE\s+INDEX/i,
    /\$executeRawUnsafe/,
    /ensure[A-Za-z0-9]*Schema/,
    /gen_random_uuid\(\)/i,
];
const publicRoutes = [
    "app/api/property-inquiry/route.ts",
    "app/api/save-search/route.ts",
];
const adminCredentialReaders = [
    "middleware.ts",
    "app/api/admin/repository/auth.ts",
    "app/api/admin/control-state/route.ts",
    "app/api/admin/crm-tasks/route.ts",
    "app/api/admin/crm-tasks/[id]/route.ts",
    "app/api/admin/dead-letter/route.ts",
    "app/api/admin/intake-signals/route.ts",
    "app/api/admin/intake-signals/[id]/route.ts",
    "app/api/mls/sync/route.ts",
    "app/api/mls/status/route.ts",
    "app/api/mls/retry/route.ts",
    "app/api/process-alerts/route.ts",
    "app/api/search/route.ts",
];
function read(filePath) {
    return fs.readFileSync(filePath, "utf8");
}
function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(fullPath) : [fullPath];
    });
}
for (const route of publicRoutes) {
    const source = read(route);
    for (const pattern of prohibitedDdlPatterns) {
        assert.equal(pattern.test(source), false, `${route} contains prohibited request-path DDL/bootstrap pattern ${pattern}`);
    }
    assert.match(source, /assertPublicRuntimeSchema/, `${route} must assert governed schema availability before writes.`);
    assert.match(source, /schema-unavailable/, `${route} must fail safely when governed schema is unavailable.`);
}
const schemaSafety = read("lib/runtime/publicSchemaSafety.ts");
assert.match(schemaSafety, /to_regclass/, "Schema assertion must check table availability without mutation.");
assert.match(schemaSafety, /information_schema\.columns/, "Schema assertion must check column availability without mutation.");
assert.equal(/\$executeRawUnsafe|CREATE\s+TABLE|ALTER\s+TABLE|CREATE\s+EXTENSION|CREATE\s+INDEX/i.test(schemaSafety), false);
for (const filePath of adminCredentialReaders) {
    const source = read(filePath);
    assert.equal(/searchParams\.get\(["']adminKey["']\)/.test(source), false, `${filePath} must not accept admin credentials from query parameters.`);
}
const middleware = read("middleware.ts");
assert.match(middleware, /"\/admin\/:path\*"/, "Middleware must protect /admin/* by default.");
assert.match(middleware, /"\/api\/admin\/:path\*"/, "Middleware must protect /api/admin/* by default.");
assert.doesNotMatch(middleware, /NextResponse\.redirect/, "Middleware must not redirect with credential-bearing URLs.");
assert.doesNotMatch(middleware, /cookies\.set/, "Middleware must not set admin credential cookies from URL credentials.");
assert.match(middleware, /headers\.get\("x-admin-key"\)/, "Header admin authentication must remain available.");
assert.match(middleware, /authorization/, "Bearer admin authentication must remain available.");
const repositoryAuth = read("app/api/admin/repository/auth.ts");
assert.match(repositoryAuth, /headers\.get\("x-admin-key"\)/, "Repository auth must preserve x-admin-key.");
assert.match(repositoryAuth, /authorization/, "Repository auth must preserve bearer tokens.");
assert.doesNotMatch(repositoryAuth, /adminKey when/, "Unauthorized message must not advertise query-string credentials.");
const toggleAccess = read("app/api/admin/toggle-access/route.ts");
assert.match(toggleAccess, /authorizeRepositoryAdminRequest/, "Toggle access route must be protected in-route.");
assert.match(toggleAccess, /repositoryAdminUnauthorizedResponse/, "Toggle access route must return governed unauthorized response.");
const adminPageFiles = walk("app/admin").filter((filePath) => filePath.endsWith(".tsx"));
const adminApiRouteFiles = walk("app/api/admin").filter((filePath) => filePath.endsWith("route.ts"));
assert.ok(adminPageFiles.length >= 3, "Expected admin page routes to be discoverable.");
assert.ok(adminApiRouteFiles.length >= 40, "Expected admin API routes to be discoverable.");
const requestPathDdl = walk("app/api")
    .filter((filePath) => filePath.endsWith("route.ts"))
    .filter((filePath) => /CREATE\s+TABLE|ALTER\s+TABLE|CREATE\s+EXTENSION|CREATE\s+INDEX|\$executeRawUnsafe/i.test(read(filePath)));
assert.deepEqual(requestPathDdl, [], "Request-path DDL must not exist in app/api route handlers.");
console.log("[public-runtime-safety] ok: public DDL removed, missing-schema failures are safe, query admin credentials are rejected, and admin namespaces are protected.");
