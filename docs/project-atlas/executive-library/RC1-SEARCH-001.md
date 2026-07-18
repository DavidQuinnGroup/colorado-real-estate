# RC1 SEARCH-001 - Production Search Runtime Failure

Issue: `SEARCH-001`  
Severity: Critical  
Baseline: `27a77b4`  
Initial status: `OPEN`  
Current status: `CLOSED`

## Status Progression

| Status | Evidence |
| --- | --- |
| `OPEN` | Production commit `27a77b4` deployed Ready, but `/search` returned 500 and `/api/search?limit=1` returned 500. |
| `ROOT_CAUSE_VERIFIED` | Vercel runtime logs showed `PrismaClientInitializationError` for `/search` and `/api/search`: `Environment variable not found: DATABASE_URL`. |
| `FIX_IN_PROGRESS` | Source correction added a direct Supabase REST read fallback for production search when Prisma cannot initialize. |
| `READY_FOR_VERIFICATION` | `npm run check:search-runtime-safety` passed with one bounded result and verified empty-result behavior; full local validation passed before commit and push. |
| `PRODUCTION_VERIFIED` | Deployment `dpl_4uspEJF4ftuuSeS7jWZzpqfGdXAY` reached Ready from commit `dae8f6d`; `/search`, `/api/search?limit=1`, a bounded city filter, and an empty-result query all returned 200. |
| `CLOSED` | SEARCH-001 is production verified; remaining RC1 work is tracked separately and must not be handled under SEARCH-001. |

## Production Evidence

Before remediation:

- Deployment: `dpl_FEcXAiKh4oWqRZd4zCPN9tNs9epK`.
- Deployment status: Ready.
- `/`: 200.
- `www`: 308 to root.
- `/search`: 500.
- `/api/search?limit=1`: 500.
- `/robots.txt`: 200.
- `/sitemap.xml`: 200.

Vercel runtime log evidence:

```text
Environment variable not found: DATABASE_URL.
```

The API returned a controlled response instead of exposing the raw database error:

```json
{
  "source": "database",
  "fallbackReason": "fetch failed",
  "error": "Inventory search is temporarily unavailable."
}
```

## Root Cause

`DATABASE_URL` is absent from Vercel Production. Prisma requires `DATABASE_URL` from `prisma/schema.prisma`, so production runtime Prisma queries fail during client initialization.

## Environment Findings

Vercel Production environment variable names observed:

- `PUBLIC_SITE_URL`.
- `NEXT_PUBLIC_SITE_URL`.
- `NEXT_PUBLIC_SUPABASE_URL`.
- `SUPABASE_SERVICE_ROLE_KEY`.
- `TYPESENSE_HOST`.
- `TYPESENSE_PORT`.
- `TYPESENSE_PROTOCOL`.
- `TYPESENSE_API_KEY`.

Not observed in Vercel Production:

- `DATABASE_URL`.
- `DIRECT_URL`.

No secret values were printed or committed.

## Typesense Findings

Typesense variables are present by name in Vercel Production, but `/api/search` still received a provider failure with `fallbackReason:"fetch failed"`.

Typesense reset and reindex were not run. Typesense remains a provider path, but SEARCH-001's confirmed production blocker is the database fallback failure caused by missing `DATABASE_URL`.

## Database Fallback Findings

The fallback does not perform an internal HTTP self-fetch. It uses direct server-side database access.

Before remediation:

- `/search` called Prisma directly through `lib/search/searchProperties.ts`.
- `/api/search` tried Typesense first, then Prisma fallback through `app/api/search/route.ts`.
- Both failed when Prisma could not initialize without `DATABASE_URL`.

After remediation:

- Prisma remains the primary database path.
- If Prisma initialization/query fails, search reads directly from Supabase REST using existing `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- The Supabase fallback is read-only and bounded by limit/offset.

## Files Changed

- `app/api/search/route.ts`.
- `lib/search/searchProperties.ts`.
- `lib/search/supabaseSearch.ts`.
- `scripts/checkSearchRuntimeSafety.ts`.
- `dist/scripts/checkSearchRuntimeSafety.js`.
- `package.json`.
- `tsconfig.worker.json`.
- `docs/project-atlas/executive-library/PROJECT-ATLAS-RELEASE-CANDIDATE-BOARD.md`.
- `docs/project-atlas/executive-library/release-candidate-board.json`.
- `docs/project-atlas/executive-library/RC1-SEARCH-001.md`.

## Tests

Added:

```text
npm run check:search-runtime-safety
```

The check:

- Uses Supabase REST read access.
- Requests a bounded public search result with `limit=1`.
- Verifies public results exclude private inventory.
- Verifies a valid empty-result query returns zero results.
- Does not mutate database rows.
- Does not call Typesense reset/reindex, MLS Grid, email, queues, CRM, OpenAI, or TitlePro247.

## Deployment

- Commit: `dae8f6d Fix production search runtime`.
- Deployment: `dpl_4uspEJF4ftuuSeS7jWZzpqfGdXAY`.
- Deployment status: Ready.

## Production Evidence After Fix

- `/`: 200.
- `/search`: 200.
- `/api/search?limit=1`: 200, `source:"database"`, `fallbackReason:"fetch failed"`, `found:15281`, `returned:1`, `mapped:1`, `results:1`, `health:"degraded"`.
- `/api/search?limit=2&city=Boulder`: 200, `found:540`, `returned:2`, `mapped:2`, `results:2`, filters `["city","publicAccess"]`.
- `/api/search?limit=2&city=NoSuchCitySearch001`: 200, `found:0`, `returned:0`, `mapped:0`, `results:0`, filters `["city","publicAccess"]`.
- Typesense provider remained unavailable with `fallbackReason:"fetch failed"`, and database/Supabase fallback degraded safely.

## Residual Risks

- Typesense provider health remains degraded until separately verified or repaired.
- Vercel Production still lacks `DATABASE_URL`; Prisma-backed runtime paths outside search may fail until the environment is corrected or given their own bounded fallback.
- Invalid-token unsubscribe remains a separate runtime issue and must not be handled under SEARCH-001.

## Closure Decision

Closed. SEARCH-001 reached `PRODUCTION_VERIFIED` and `CLOSED` after the production deployment reached Ready and search route validation passed.
