# REIE Search Primary Provider Health Remediation Review

Program: `REIE_SEARCH_PRIMARY_PROVIDER_HEALTH_REMEDIATION_REVIEW`

Date: 2026-08-11

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Branch: `main`

## 1. Status

`PRIMARY_PROVIDER_HEALTH_REVIEW_COMPLETE_PRODUCTION_ROOT_CAUSE_NOT_FULLY_ESTABLISHED_LOCAL_REACHABILITY_DEFECT_CONFIRMED`

Workstream 1 synchronization completed successfully. Workstream 2 remained diagnosis/proposal only. No runtime files, Search behavior, Typesense configuration, provider infrastructure, environment variables, schemas, data, workers, CRM, telemetry, deployment, or production mutation were changed.

## 2. Workstream 1 - Certification Sync Result

The already-completed Search Render and Fallback Certification documentation commit was pushed after the authorized exact-baseline checks matched:

- Pushed commit: `8d4485ff048fe253c2881a0e6e72521610f665a9`
- Commit message: `Certify search render fallback posture`
- Pushed scope: `docs/CHAT_START.md`; `docs/project-atlas/executive-library/REIE-SEARCH-RENDER-AND-FALLBACK-CERTIFICATION.md`
- Post-push verification: `HEAD = origin/main = 8d4485ff048fe253c2881a0e6e72521610f665a9`
- Post-push divergence: `0 ahead / 0 behind`

No deployment was performed.

## 3. Post-Sync Canonical Baseline

- Branch: `main`
- Canonical baseline before this review documentation: `8d4485ff048fe253c2881a0e6e72521610f665a9`
- Worktree before Workstream 2 documentation: clean

## 4. Typesense / Search Provider Architecture

Search API entry is `app/api/search/route.ts`.

Provider flow:

1. Parse bounded request parameters with `getSearchParams`.
2. Determine `public` or `contracted` access with `getAccessLevel`.
3. Attempt `searchTypesense(params, accessLevel)` first.
4. If Typesense succeeds, return `source=typesense` with Typesense context in `meta.typesense`.
5. If Typesense throws, capture the internal error as `fallbackReason`, then call `searchDatabase(params, accessLevel)`.
6. If Prisma database search throws, call the established Supabase REST fallback through `searchSupabasePropertiesWithMeta`.
7. Public response masks the raw provider error as `fallbackReason="Search provider fallback served the request."`
8. If both Typesense and database/Supabase fallback fail, return HTTP 500 with `Inventory search is temporarily unavailable.`

Typesense HTTP access is implemented in `lib/typesense/httpClient.ts` through direct `fetch` calls to `/collections/<collection>/documents/search` with `X-TYPESENSE-API-KEY`.

Typesense schema and collection constants are in `lib/typesense/schema.ts`.

Supabase fallback is implemented in `lib/search/supabaseSearch.ts`.

## 5. Provider-Selection Conditions

There is no observed intentional readiness gate or feature flag that skips Typesense in `app/api/search/route.ts`. The API attempts Typesense first on each request and falls back only after the Typesense call throws.

Typesense prerequisites by environment variable name:

- `TYPESENSE_HOST`
- `TYPESENSE_PORT`
- `TYPESENSE_PROTOCOL`
- `TYPESENSE_API_KEY`

Default values in code are local-development defaults:

- host: `localhost`
- port: `8109`
- protocol: `http`
- api key fallback: `xyz`

Database/Supabase fallback prerequisites by environment variable name:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

No secret values are recorded in this review.

## 6. Configuration / Environment Findings

Local environment presence check, names only:

- `.env.local` contains the required Typesense variable names.
- `.env.local` contains the required Supabase fallback variable names.
- `.env.local` contains `DATABASE_URL`.
- `.env` contains `DATABASE_URL`.
- `.env` does not contain the Typesense variable names.
- `.env` does not contain the Supabase fallback variable names.
- `.env.example` documents the required Typesense, Supabase, and database variable names.

Local variable presence alone does not prove provider availability. The read-only health check showed the configured local Typesense endpoint refused connections.

Production environment variable presence was not inspected because no Vercel environment, Typesense control plane, or production log access was authorized in this workstream.

## 7. Read-Only Connectivity / Health Findings

Local read-only command:

`npm run typesense:collections:check`

Result:

- Exit code: `1`
- Mode: `check=true`, `reset=false`, `collectionsOnly=true`
- Canonical schema validation completed locally for `properties` and `listings`.
- Collection inspection then failed with `ECONNREFUSED`.

The command did not create/drop/update collections, import documents, reset Typesense, or reindex data. The script log uses the inherited phrase `Typesense reindex starting`, but the active flags were read-only collection check flags.

Current production public API probes:

- `https://davidquinngroup.com/api/search?limit=1`: HTTP `200`, `source=database`, `health=degraded`, `found=1287`, `returned=1`, `mapped=1`, `durationMs=2145`, `smoke.ready=true`, blockers `[]`.
- `https://davidquinngroup.com/api/search?limit=250`: HTTP `200`, `source=database`, `health=degraded`, `found=1287`, `returned=250`, `mapped=250`, `durationMs=2055`, `smoke.ready=true`, blockers `[]`.

Production raw fallback cause remains intentionally masked by the API response.

## 8. Collection / Index Findings

Repository-defined collection identities:

- `PROPERTY_COLLECTION_NAME = "properties"`
- `LISTING_COLLECTION_NAME = "listings"`

The Search API uses the `listings` collection for live API queries.

Repository-defined schema contract:

- 33 canonical field rules.
- Typesense schema excludes reserved `id`, producing 32 collection fields.
- 23 required facet fields.
- 7 sortable fields.
- Query fields: `address`, `city`, `neighborhood`, `subdivision`, `schoolDistrict`, `listingAgent`, `listingOffice`, `description`, `zip`, `mlsId`.
- Filter fields: `lat`, `lng`, `price`, `beds`, `baths`, `city`, `neighborhood`, `propertyType`, `status`, `isPrivateExclusive`.
- Sort fields: `price`, `updatedAt`.
- Default sort: `price:desc,updatedAt:desc`.

The local read-only command validated the canonical schema definitions before failing to inspect live collections. It did not establish whether local or production live collections exist, contain documents, or match the expected schema.

## 9. Query / Runtime Findings

Typesense query construction in `searchTypesense`:

- `q`: request query, or `*` when empty.
- `query_by`: `SEARCH_SCHEMA_QUERY_BY`.
- `filter_by`: coordinate validity filters, optional numeric/bounds filters, exact city/neighborhood/propertyType/status filters, and public/private access filters.
- `sort_by`: `SEARCH_SCHEMA_DEFAULT_SORT_BY`.
- `page`: `Math.floor(offset / limit) + 1`.
- `per_page`: bounded request limit, maximum `250`.

Database fallback applies the same public/contracted access posture and active/default status posture through Prisma, then Supabase REST fallback if Prisma is unavailable.

Response labeling:

- `source=typesense` returns `health=healthy` unless coordinate filtering is applied.
- `source=database` returns `health=degraded` and `providerFallbackActive=true`.
- `smoke.ready` can remain true when fallback is serving a usable, bounded, public-safe response with no blockers.

## 10. Exact Fallback Trigger, If Established

Local exact trigger is established for the read-only local collection check: the configured local Typesense endpoint refused the connection with `ECONNREFUSED`.

For production API requests, the exact trigger is not established from public evidence alone. The API confirms fallback served the request, but intentionally masks the raw Typesense exception. Production could be failing due to configuration, reachability, authentication, collection/index posture, or query/runtime integration; the authorized evidence does not distinguish those causes.

## 11. Local vs Production Comparison

Local:

- Required Typesense variable names are present in `.env.local`.
- Read-only collection inspection fails with `ECONNREFUSED`.
- This proves a local configuration or provider reachability defect for the configured local endpoint.

Production:

- Public API currently returns HTTP `200` under database fallback.
- Current high-limit public probe returns the full ceiling of `250` mapped results.
- Production response is degraded from a provider-health perspective because `source=database`, not `source=typesense`.
- Production root cause is not provable without read-only production environment/log/control-plane evidence.

## 12. Customer-Impact Assessment

Provider health defect and customer-experience defect are separate.

Provider-health issue observed:

- Typesense is architecturally first, but measured production requests still return `source=database`.

Customer experience under current evidence:

- Search endpoint remains available at HTTP `200`.
- Search returns bounded public results.
- High-limit production probe returns `250` results.
- `smoke.ready=true`.
- No smoke blockers are reported.
- Public access and default active-status posture remain enforced.
- Fallback state is labeled degraded in response metadata.

No material customer-experience failure is proven by the current evidence. The proven issue is primary-provider health/posture, not Search unavailability.

## 13. Root-Cause Disposition

Best-supported disposition:

- Local: `TYPESENSE_CONFIGURATION_OR_REACHABILITY_DEFECT_CONFIRMED`
- Production exact root cause: `INSUFFICIENT_EVIDENCE_TO_DETERMINE_ROOT_CAUSE`

The overall production-facing conclusion is: primary-provider fallback is observable and current, but the exact production trigger is not established without additional read-only production diagnostics.

## 14. Narrowest Remediation Proposal, If Justified

No remediation is implemented by this review.

Narrowest justified next step is not a code change. It is a read-only production provider diagnostics gate:

1. Inspect production environment variable presence by name only.
2. Inspect production Search/Typesense logs for the raw Typesense exception.
3. Inspect Typesense provider health and collection metadata read-only.
4. Confirm whether the production `listings` collection exists, is reachable, has the expected schema, and contains indexed documents.
5. Only after root cause is established, authorize the smallest remediation:
   - environment/configuration if variables or endpoint are wrong;
   - provider infrastructure if the endpoint is down/unreachable;
   - collection/index remediation if collection or data posture is defective;
   - code remediation only if query/runtime integration is proven defective.

For local development only, the likely remediation is to start/restore the local Typesense service or correct local endpoint configuration. That is an environment/provider action, not a Search runtime change.

## 15. Required Authorization for Remediation

Required before any remediation:

- Explicit authorization to inspect production provider logs/environment/control-plane state read-only.
- Explicit authorization before changing any environment variable.
- Explicit authorization before changing provider infrastructure.
- Explicit authorization before creating, dropping, updating, importing, resetting, or reindexing Typesense collections.
- Explicit authorization before Search runtime code changes.
- Explicit authorization before deployment or production restart/redeploy.

## 16. Validation Results

Executed:

- `git fetch origin main`
- `git status --short --branch`
- `git rev-parse HEAD`
- `git rev-parse origin/main`
- `git diff --check origin/main...HEAD` before Workstream 1 push
- `git push origin main`
- post-push `git fetch origin main`
- post-push baseline/divergence/status verification
- `npm run typesense:collections:check`
- `curl --max-time 20 -s -w ... https://davidquinngroup.com/api/search?limit=1`
- bounded production high-limit API summary probe for `https://davidquinngroup.com/api/search?limit=250`

Expected diagnostic failure:

- `npm run typesense:collections:check` exited `1` after `ECONNREFUSED` during live collection inspection.

No runtime validation requiring mutation, reindex, worker execution, migrations, database writes, or deployment was run.

## 17. Files Changed

Documentation-only changes in Workstream 2:

- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/REIE-SEARCH-PRIMARY-PROVIDER-HEALTH-REMEDIATION-REVIEW.md`

## 18. Local Documentation Commit, If Any

This review is preserved in one focused local documentation commit after validation. It must remain local until separately authorized for synchronization.

## 19. Protected-System Confirmation

Not performed:

- Search runtime modification.
- Search API behavior modification.
- Typesense configuration change.
- Typesense collection creation/drop/update/reset/import/reindex.
- Provider credential change.
- Environment variable change.
- Prisma schema change.
- Migration.
- Database mutation.
- MLS ingestion/sync.
- County/GIS/provider source activation.
- Customer-data mutation.
- Telemetry or analytics addition.
- CRM/email/notification/worker/auth/persistence change.
- Deployment.

## 20. Executive Recommendation

Do not treat database fallback as a customer-facing outage under the current evidence. Search is serving usable bounded responses.

Do treat the current posture as a primary-provider health issue because the production API still reports `source=database` and `health=degraded` while the repository architecture attempts Typesense first.

Authorize a narrow read-only production diagnostics workstream before authorizing remediation.

## 21. Next Authorization Gate

`READY_FOR_REIE_SEARCH_PRODUCTION_TYPESENSE_READ_ONLY_PROVIDER_DIAGNOSTICS_AUTHORIZATION`

Do not implement remediation, mutate Typesense, change environment variables, deploy, or push this Workstream 2 documentation commit without separate Executive HQ authorization.
