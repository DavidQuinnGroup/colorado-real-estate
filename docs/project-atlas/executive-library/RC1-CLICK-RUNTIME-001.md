# RC1-CLICK-RUNTIME-001 - AlertQueue clickedAt Persistence Diagnosis

Date opened: 2026-07-18
Current status: `CLOSED`
Parent issue: `CLICK-001`
Severity: `High`

## Scope

This diagnostic issue identified and corrected the runtime cause that prevented selected `AlertQueue.clickedAt` from persisting. No production tracking URL was invoked during diagnosis. The separately authorized final production proof then verified the deployed correction and closed parent issue `CLICK-001`.

## Controlled Record

- AlertQueue row: `cmq0zp6up010gpd4uh5anfex5`.
- User id: `cmmuzx3kt00004hk64jytoihs`.
- Listing/property id: `cmpy48m3d047b129oeqh0r22m`.
- Property URL: `https://davidquinngroup.com/properties/6137-baseline-rd-boulder-co-ire1349635`.
- Starting commit: `4e9cd1e`.
- Starting deployment: `5503812665`, status `success`.
- Corrected commit: `4c9d85c`.
- Corrected deployment: `5503914616`, status `success`.

## Root Cause

The production tracking route did not receive an AlertQueue id in the generated URL. It received user id, listing id, source, and destination. The writer therefore had to resolve the matching unclicked `AlertQueue` row by user plus listing identity inside `payload`.

The Prisma JSON-path `updateMany` returned zero rows for the controlled production row. The Supabase fallback introduced in `8dc4f87` then attempted to resolve a matching row by scanning unclicked rows for that user, but it used a single unordered page of 100 candidates:

```ts
.eq('userId', userId)
.is('clickedAt', null)
.in('status', ['sent', 'pending', 'processing'])
.limit(100)
```

Read-only production data-layer verification showed:

- Eligible unclicked sent/pending/processing rows for selected user: 118.
- Route-shaped fallback result with `limit(100)`: returned 100 rows.
- Selected row in route-shaped fallback result: no.
- Full scan result: returned 118 rows.
- Selected row index in full scan: 117.
- Matching selected-property rows in full scan: 1.
- Matching row id: `cmq0zp6up010gpd4uh5anfex5`.

The selected row was outside the fallback's first page. Interaction and heat-score writes succeeded because they did not depend on this paginated AlertQueue lookup.

## Schema Evidence

Read-only production schema verification:

| Column | Type | Nullable |
| --- | --- | --- |
| `id` | `text` | no |
| `userId` | `text` | no |
| `status` | `text` | yes |
| `createdAt` | `timestamp without time zone` | yes |
| `payload` | `jsonb` | yes |
| `clickedAt` | `timestamp without time zone` | yes |

This verifies the production REST column name is the camel-case `clickedAt`, and payload matching must account for `jsonb` payload identity fields.

## Correction

- `lib/tracking/store.ts` now pages bounded Supabase fallback candidates with `.range(from, to)` instead of scanning only one unordered 100-row page.
- The fallback orders by `createdAt` descending for deterministic pagination.
- The tracking store now marks `clickedAt` before enrichment and returns `tracked: false` if no unclicked matching alert can be marked.
- This prevents repeated synthetic requests from adding duplicate interaction or heat-score state after `clickedAt` has already been populated.
- `scripts/checkTrackClickRuntimeSafety.ts` reproduces the late-row failure shape with a synthetic selected row beyond page one.

## Test Evidence

Passed:

- `npm run check:track-click-runtime-safety`
  - Synthetic selected row starts with `clickedAt: null`.
  - Prisma mark returns zero rows.
  - Supabase fallback finds the row beyond the first page.
  - `clickedAt` changes from null to an ISO timestamp.
  - Exactly one synthetic interaction is created.
  - Heat score increments exactly once.
  - A repeated synthetic request does not change `clickedAt`, create a duplicate interaction, or increment heat again.
- `npm run check:track-click-safety`
- `npm run check:unsubscribe-safety`
- `npm run check:search-runtime-safety`
- `npm run check:property-route-safety`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Production Health

Read-only health checks passed without invoking `/api/track-click`:

- Selected property URL: HTTP 200.
- `/search`: HTTP 200.

## Final Production Proof

The refreshed `CLICK-001` assignment explicitly authorized exactly one final production `GET` request to the same controlled tracking URL after deployment `5503914616`.

Final proof results:

| Surface | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Selected alert clickedAt | `null` | `2026-07-18T17:59:15.571` | populated |
| Selected user heat score | 15 | 20 | +5 |
| Selected user interactions | 3 | 4 | +1 |
| Selected user `LISTING_CLICK` interactions | 3 | 4 | +1 |
| Selected property `LISTING_CLICK` interactions | 2 | 3 | +1 |
| EmailLog total | 78 | 78 | 0 |
| AlertQueue pending | 195 | 195 | 0 |
| AlertQueue sent | 85 | 85 | 0 |
| AlertQueue skipped | 3 | 3 | 0 |
| BullMQ `reie-alerts` waiting | 273 | 273 | 0 |
| BullMQ `reie-alerts` active | 0 | 0 | 0 |
| BullMQ `reie-alerts` delayed | 0 | 0 | 0 |
| BullMQ `reie-alerts` failed | 0 | 0 | 0 |
| CRM task count | 0 | 0 | 0 |
| Unsubscribe-token count | 57 | 57 | 0 |
| Active saved-search count | 1 | 1 | 0 |

HTTP evidence:

- Tracking route: HTTP 307.
- Redirect count: 1.
- Final destination: `https://davidquinngroup.com/properties/6137-baseline-rd-boulder-co-ire1349635`.
- Final destination status: HTTP 200.
- Vercel route evidence: `x-matched-path: /api/track-click` then `x-matched-path: /properties/[id]`.

Preferences remained readable after the proof:

- `avgPrice: 4625000`.
- `avgBeds: 4`.
- `topCities: ["Boulder"]`.
- No P2022 or schema error was observed.

No second tracking request was made.

## Files Changed

- `lib/tracking/store.ts`.
- `scripts/checkTrackClickRuntimeSafety.ts`.
- `scripts/checkTrackClickSafety.ts`.
- `package.json`.
- `tsconfig.worker.json`.
- `dist/lib/tracking/store.js`.
- `dist/scripts/checkTrackClickRuntimeSafety.js`.
- `dist/scripts/checkTrackClickSafety.js`.
- `docs/project-atlas/executive-library/PROJECT-ATLAS-RELEASE-CANDIDATE-BOARD.md`.
- `docs/project-atlas/executive-library/release-candidate-board.json`.
- `docs/project-atlas/executive-library/RC1-CLICK-RUNTIME-001.md`.

## Boundary

No production tracking URL request, email send, unsubscribe invocation, queue retry/drain, worker, scheduler, broad CRM/user/preference/saved-search mutation, MLS Grid request, OpenAI call, TitlePro247 call, Typesense reset/reindex, database reset, `prisma db push`, `npm audit fix`, force-push, or destructive Git operation was run during CLICK-RUNTIME-001.

## Closure Decision

`CLICK-RUNTIME-001` is `CLOSED`.

`CLICK-001` is `CLOSED`.

The deployed correction persisted `AlertQueue.clickedAt` during the one separately authorized final production proof, and unrelated production surfaces stayed isolated.
