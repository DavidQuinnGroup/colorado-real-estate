# REIE Search Production Typesense Platform-Access Diagnostics

Program: `REIE_SEARCH_PRODUCTION_TYPESENSE_PLATFORM_ACCESS_DIAGNOSTICS`

Date: 2026-08-12

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Branch: `main`

## 1. Status

`PLATFORM_ACCESS_DIAGNOSTICS_COMPLETE_PRODUCTION_ROOT_CAUSE_NOT_ESTABLISHED`

The temporary Vercel diagnostic credential was retrieved from macOS Keychain at runtime, used only in-memory, and unset before reporting. Read-only Vercel access succeeded for project metadata, environment-variable metadata, deployment metadata, and deployment build events. No remediation was implemented.

## 2. Canonical Baseline

Baseline verification after fetching remote truth:

- Branch: `main`
- `HEAD = origin/main = 1e1e2f730dd67c88c68cd59bc91876c77c47148a`
- Divergence: `0 ahead / 0 behind`
- Worktree: clean

## 3. Vercel Read-Access Verification

Target Vercel project metadata:

- Team: `team_53Do8TFrDJHK8AJsziDVZyRQ`
- Project id: `prj_Ry5WCDfamYUq1oO7t1CwCVwTvh4G`
- Project name: `david-quinn-group-8rde`

Read-only access result:

- Keychain credential retrieval: succeeded.
- Project metadata: HTTP `200`, project name matched, framework `nextjs`, link type `github`.
- Environment metadata: HTTP `200`, `20` environment records.
- Deployment metadata: HTTP `200`, latest production deployments readable.
- Deployment events: HTTP `200`, build events readable.
- Current user/account identity endpoint: HTTP `404`; project-scoped/team-scoped read access still succeeded.

No Vercel configuration was changed.

## 4. Production Typesense Env Presence

Required names in Vercel Production:

- `TYPESENSE_HOST`: `PRESENT`
- `TYPESENSE_PORT`: `PRESENT`
- `TYPESENSE_PROTOCOL`: `PRESENT`
- `TYPESENSE_API_KEY`: `PRESENT`

Values were not printed, persisted, committed, or returned.

## 5. Production Env Scope Findings

All four Typesense records are scoped to Production and also appear scoped to Preview and Development:

- `TYPESENSE_HOST`: `development`, `preview`, `production`
- `TYPESENSE_PORT`: `development`, `preview`, `production`
- `TYPESENSE_PROTOCOL`: `development`, `preview`, `production`
- `TYPESENSE_API_KEY`: `development`, `preview`, `production`

No variable-name mismatch was found between Vercel metadata and repository code.

The metadata endpoint exposed value fields to the diagnostic process, but the returned forms were not usable as a safe plaintext Typesense connection contract:

- `TYPESENSE_HOST`: present, but did not validate as a plain hostname.
- `TYPESENSE_PORT`: present, but did not validate as numeric.
- `TYPESENSE_PROTOCOL`: present, but did not validate as `http` or `https`.
- `TYPESENSE_API_KEY`: present.

This is not treated as proof of production runtime misconfiguration because Vercel may represent encrypted environment values differently through metadata APIs than the values injected into Functions at runtime. No decrypted export/pull path was used.

## 6. Production Log / Provider Error Evidence

Deployment event APIs were readable, but they returned build events for the production deployment, not runtime Search request logs.

Observed latest production deployment metadata:

- Latest production deployment id: `dpl_HsWhu3KaDpB7aRNBgQJfhsaq99D8`
- State: `READY`
- Target: `production`
- GitHub commit SHA: `1e1e2f730dd67c88c68cd59bc91876c77c47148a`

Build-event examples confirmed clone/build activity for commit `1e1e2f7`. They did not contain the runtime `/api/search` Typesense exception.

Runtime/provider log evidence remains unavailable through the read-only REST path used in this diagnostic. No logging configuration was changed and no telemetry was added.

## 7. Endpoint / Network Health

Production endpoint/network health remains `UNKNOWN`.

Reason:

- The required Vercel Production variable names are present and scoped correctly.
- The metadata endpoint did not provide a safe plaintext endpoint shape suitable for a conclusive provider health request.
- A direct health URL could not be validly constructed from the metadata-returned forms without using a decrypted export/pull path.

No production provider networking, firewall, infrastructure, or credentials were changed.

## 8. Typesense Authentication Findings

Typesense authentication remains `UNKNOWN`.

Reason:

- `TYPESENSE_API_KEY` is present and Production-scoped.
- A safe authenticated provider read could not be completed without a valid plaintext endpoint contract.
- No authentication failure response from Typesense was observed.

## 9. Listings Collection Posture

Production `listings` collection posture remains `UNKNOWN`.

Reason:

- Repository runtime uses `LISTING_COLLECTION_NAME = "listings"`.
- Authenticated collection metadata inspection could not be completed without a valid plaintext endpoint contract.
- No collection-missing or schema-error response from Typesense was observed.

## 10. Schema / Query Compatibility

Repository-level schema/query compatibility still appears internally consistent:

- Search uses collection `listings`.
- Query fields: `address`, `city`, `neighborhood`, `subdivision`, `schoolDistrict`, `listingAgent`, `listingOffice`, `description`, `zip`, `mlsId`.
- Filter fields: `lat`, `lng`, `price`, `beds`, `baths`, `city`, `neighborhood`, `propertyType`, `status`, `isPrivateExclusive`.
- Sort fields: `price`, `updatedAt`.
- Runtime sort: `price:desc,updatedAt:desc`.
- Request limit remains bounded to `250`.

No repository-level schema/query incompatibility was proven.

## 11. Representative Request-Path Correlation

Representative public Search probe:

- `https://davidquinngroup.com/api/search?limit=1`
- HTTP status: `200`
- Wall time: `2880ms`
- API duration: `1461ms`
- `source=database`
- `health=degraded`
- `found=1287`
- `returned=1`
- `mapped=1`
- `smoke.ready=true`
- blockers `[]`
- `hasTypesenseContext=false`
- sanitized fallback reason: `Search provider fallback served the request.`
- generated at `2026-08-12T16:23:57.049Z`

Established path:

`Search request -> Typesense path did not return a successful response to the application -> database fallback -> successful HTTP 200 customer response`

Exact Typesense failure remains unavailable because runtime provider logs were not accessible.

## 12. Exact Root Cause, If Established

Exact production root cause was not established.

New evidence rules out one prior uncertainty: the four required Typesense variable names are present and Production-scoped in Vercel metadata.

Still not established:

- whether the runtime-injected values are correct;
- whether endpoint DNS/network/TLS is healthy;
- whether Typesense authentication succeeds;
- whether the `listings` collection exists and has documents;
- whether the live collection schema matches runtime query/filter/sort needs;
- the raw sanitized Typesense exception for the representative Search request.

## 13. Root-Cause Classification

`INSUFFICIENT_EVIDENCE_TO_DETERMINE_PRODUCTION_ROOT_CAUSE`

Rationale: Vercel env-name presence is confirmed, but runtime log evidence and conclusive provider health/collection metadata are still unavailable.

## 14. Customer-Impact Classification

`NO_MATERIAL_CUSTOMER_IMPACT_PROVEN`

Supporting evidence:

- Representative production Search request returned HTTP `200`.
- Database fallback served usable results.
- `smoke.ready=true`.
- blockers `[]`.
- No reliability or correctness defect was proven.

Provider health remains degraded because production Search still returns `source=database`.

## 15. Narrowest Remediation Proposal

No remediation is justified yet.

Narrowest next diagnostic step:

1. Use Vercel dashboard Runtime Logs, or an authorized Vercel CLI runtime logs path, to capture the sanitized runtime exception for `/api/search`.
2. If plaintext provider values are intentionally authorized for an in-memory diagnostic, run a non-mutating Typesense `/health` and `/collections/listings` metadata read.
3. Only after the raw failure category is established, propose the smallest correction.

Possible correction classes remain:

- endpoint/value correction;
- credential correction;
- provider/network correction;
- collection/index correction;
- schema/query correction;
- application-code correction.

None is selected yet.

## 16. Required Remediation Authorization

Separate authorization remains required before any:

- Vercel environment value change;
- credential rotation/correction;
- decrypted env export/pull for provider probing;
- Typesense configuration change;
- Typesense collection creation/drop/change;
- Typesense import/reindex/reset;
- provider infrastructure/network/firewall change;
- service restart;
- production redeploy;
- Search runtime/API/ranking/limit/cache change;
- Prisma schema/migration/database mutation;
- telemetry/logging instrumentation.

## 17. Validation Results

Executed:

- `git fetch origin main`
- branch/status/HEAD/origin/divergence verification
- Keychain retrieval of temporary diagnostic credential
- Vercel project metadata read
- Vercel Production env metadata read
- Vercel production deployment metadata read
- Vercel deployment events read
- Vercel env value-shape validation without printing values
- bounded public production Search API summary probe
- `unset`/delete of in-process `VERCEL_TOKEN`

External documentation consulted:

- Vercel REST deployment events documentation: deployment events are build-log oriented.
- Vercel runtime logs documentation: runtime logs are available through the dashboard Logs surface.
- Vercel environment variable documentation: environment values are encrypted at rest, and sensitive values can be non-readable after creation.

## 18. Files Changed

Documentation-only changes in this diagnostic:

- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/REIE-SEARCH-PRODUCTION-TYPESENSE-PLATFORM-ACCESS-DIAGNOSTICS.md`

## 19. Local Documentation Commit, If Any

This diagnostic record is preserved in one focused local documentation commit after validation. It must not be pushed without separate authorization.

## 20. Secret-Safety Confirmation

No secret values were printed, copied, persisted, documented, committed, or returned.

The temporary Vercel credential was used only in-memory. Typesense environment values were not included in reports or docs. The documentation records only variable names, presence/scope, status codes, categories, counts, and sanitized request metadata.

## 21. VERCEL_TOKEN_UNSET Confirmation

`VERCEL_TOKEN_UNSET=true`

The in-process environment variable was deleted before report generation. The Keychain credential was not deleted.

## 22. Protected-System Confirmation

Not performed:

- Vercel environment variable change.
- Credential reveal/change/rotation.
- Vercel permission/team/project configuration change.
- Typesense configuration change.
- Typesense collection/document mutation.
- Typesense import/reindex/reset.
- Provider infrastructure/network/firewall change.
- Service restart.
- Production redeploy.
- Search runtime/API/ranking/limit/cache modification.
- Prisma schema/migration/database mutation.
- MLS/source modification.
- Telemetry/analytics/logging instrumentation.
- CRM/email/worker/auth/persistence modification.

## 23. Executive Recommendation

Do not remediate yet.

The next highest-value action is to capture the runtime `/api/search` provider exception through Vercel Runtime Logs or to explicitly authorize an in-memory decrypted provider health/collection metadata diagnostic. Environment-name absence is no longer the leading explanation because all four required Typesense names are present and Production-scoped.

## 24. Next Authorization Gate

`READY_FOR_REIE_SEARCH_RUNTIME_LOG_OR_DECRYPTED_PROVIDER_READ_DIAGNOSTICS_AUTHORIZATION`

Do not push this documentation commit, deploy, remediate, mutate Typesense, change environment variables, restart/redeploy production, or expand access beyond read-only diagnostics without separate Executive HQ authorization.
