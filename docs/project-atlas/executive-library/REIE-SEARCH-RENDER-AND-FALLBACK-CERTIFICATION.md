# REIE Search Render and Fallback Certification

Status: `CERTIFIED_WITH_NARROW_REMEDIATION_CANDIDATE`

Date: 2026-08-11

Program: `REIE_SEARCH_RENDER_AND_FALLBACK_CERTIFICATION`

## Scope

This record measures and certifies the existing Search render, provider fallback, map/list, image, and trust posture without customer runtime changes.

Authorized work was measurement and documentation only. No pagination, virtualization, Search result limit change, ranking change, caching change, Typesense configuration change, API architecture change, schema change, database write, provider activation, telemetry, persistence, customer feature, deployment, or remediation implementation occurred.

## Architecture Inventory

- `/search` is a dynamic route and initially renders through `app/search/page.tsx`.
- The server-rendered Search page calls `searchPropertiesWithMeta({ limit: 250 })` from `lib/search/searchProperties.ts`.
- The server-rendered Search path uses Prisma first, and falls back to `searchSupabasePropertiesWithMeta` if Prisma fails.
- Client filter updates call `/api/search` through `components/search/SearchInterface.tsx`.
- `/api/search` is dynamic and caps `limit` at `250`, with `DEFAULT_LIMIT = 250` and `MAX_OFFSET = 10000`.
- `/api/search` attempts Typesense first through `searchTypesenseDocuments`.
- If Typesense fails, `/api/search` falls back to database/Prisma.
- If Prisma fails in that fallback path, it falls back again to established Supabase REST search.
- Public access excludes private-exclusive inventory unless contracted access is authorized by admin key.
- Search API metadata exposes `source`, `health`, `durationMs`, `returned`, `mapped`, `coordinateFiltered`, `filtersApplied`, `boundsApplied`, `smoke.ready`, `smoke.blockers`, `smoke.warnings`, and customer-experience fallback state.
- Search UI exposes stable DOM metadata for visible listing count, source, degraded state, loading state, map/list state, URL-only comparison state, no persistence, no telemetry, no provider activation, no ranking, no scoring, and no suitability inference.
- Map rendering is Leaflet-based in `components/maps/SearchMap.tsx`.
- Map markers are clustered by grid at zooms below `15`, with map zoom range `8` to `17`.
- Map tiles use OpenTopoMap. Optional Mapbox overlay remains disabled.
- Map tile failure changes `data-search-map-tile-status` to `unavailable` and preserves list-first use.
- Listing cards use `ResilientListingImage`, with lazy loading, async decoding, timeout fallback, image error fallback, and visible `Photo Pending` fallback labels.
- Property handoff remains `/properties/<id>`.
- Property Shortlist / Compare handoff remains browser URL state only through `compareIds`; Search API does not receive `compareIds`.

## Measurement Methodology

Evidence was gathered through:

- repository source inspection;
- existing deterministic checks;
- local Next dev server at `http://localhost:3000`;
- read-only local `/api/search` route probes;
- read-only production `/api/search` route probes at `https://davidquinngroup.com`;
- production `/search` HTML response inspection.

The browser connector was available but did not return readable inspection output in this session. Chrome was running, but no remote-debugging port was present. No browser-only claim is made beyond existing prior certification records, raw rendered HTML evidence, and deterministic source/route evidence.

## Measured Results

Local `/api/search` measurements:

| State | URL | HTTP | Wall time | API duration | Source | Health | Found | Returned | Mapped | Smoke |
| --- | --- | ---: | ---: | ---: | --- | --- | ---: | ---: | ---: | --- |
| Empty | `/api/search?city=NoSuchCitySearchRenderFallback&limit=5` | 200 | 5.496s | 3092ms | database | degraded | 0 | 0 | 0 | ready |
| Small | `/api/search?limit=1` | 200 | 6.392s | 4041ms | database | degraded | 1287 | 1 | 1 | ready |
| Moderate | `/api/search?city=Boulder&limit=25` | 200 | 5.754s | 3593ms | database | degraded | 38 | 25 | 25 | ready |
| High | `/api/search?limit=250` | 200 | 4.445s | 2193ms | database | degraded | 1287 | 250 | 250 | ready |
| Filtered | `/api/search?minPrice=700000&maxPrice=1200000&beds=3&limit=25` | 200 | 5.003s | 2703ms | database | degraded | 186 | 25 | 25 | ready |
| Bounds | `/api/search?north=40.10&south=39.95&east=-105.15&west=-105.35&limit=50` | 200 | 3.261s | 1063ms | database | degraded | 42 | 42 | 42 | ready |

Production `/api/search` measurements:

| State | URL | HTTP | Wall time | API duration | Source | Health | Found | Returned | Mapped | Smoke |
| --- | --- | ---: | ---: | ---: | --- | --- | ---: | ---: | ---: | --- |
| Empty | `/api/search?city=NoSuchCitySearchRenderFallback&limit=5` | 200 | 1.969s | 1255ms | database | degraded | 0 | 0 | 0 | ready |
| Small | `/api/search?limit=1` | 200 | 2.836s | 1363ms | database | degraded | 1287 | 1 | 1 | ready |
| High | `/api/search?limit=250` | 200 | 3.466s | 1848ms | database | degraded | 1287 | 250 | 250 | ready |

Production `/search` returned HTTP 200 in 3.235s with a 3,785,481-byte HTML response containing the guided Search frame, sidebar frame, and no automatic Grand Plan personalization claim.

## Result-Volume Findings

- Empty-state Search is fail-closed and returns zero results without error.
- Small result Search returns one public listing and honors `limit=1`.
- Moderate Boulder Search returns 25 of 38 matching public Active listings.
- High-result Search honors the current supported ceiling of `250`, with `found=1287`, `returned=250`, and `mapped=250`.
- Bounds Search returns 42 mapped results and records `boundsApplied=true`.
- Current result-volume behavior is bounded by the existing 250-result API/page ceiling.

## Provider / Fallback Findings

- Typesense is architecturally first in `/api/search`.
- In all local and production probes during this certification, `/api/search` returned `source=database`, `health=degraded`, `providerFallbackActive=true`, and `fallbackReason="Search provider fallback served the request."`
- No route probe returned `source=typesense`.
- The fallback state is customer-safe: HTTP 200, `smoke.ready=true`, `smoke.blockers=[]`, public access enforced, and relevance/status contract satisfied.
- The fallback state is honest: metadata marks the provider as degraded and avoids exposing raw provider error text to customers.
- If both Typesense and database fallback fail, the API returns an empty result set with HTTP 500 and customer-safe unavailable copy.
- Supabase fallback is established and deterministic through `lib/search/supabaseSearch.ts`, including default Active status filtering, public/private filtering, count metadata, bounded range, and photo fallback retrieval.

## Map / List / Image Findings

- List remains the criteria-led primary surface.
- Map uses only valid coordinate listings and exposes returned/mapped/coordinate-filtered metadata.
- In measured Search states, `coordinateFiltered=0` for the API states except the production page HTML was not parsed for client-side map state.
- Bounds Search reported one listing-photo placeholder warning, while preserving `smoke.ready=true`.
- `ResilientListingImage` provides timeout and error fallback to governed local imagery and exposes fallback metadata.
- Map tile failure handling is implemented as delayed/unavailable tile state and customer-safe "list remains ready" behavior.
- Deterministic map rendering safety passed.

## Hydration / Browser Findings

- The Search page is server-rendered with initial listing data and hands client state to `SearchInterface`.
- Client URL/filter restoration is deferred through `useEffect`.
- `compareIds` initializes as deterministic empty state and is restored after hydration.
- No current evidence showed a new hydration defect in API or HTML probes.
- Direct browser console evidence could not be captured in this session because the browser connector did not return readable inspection output and Chrome did not expose a CDP port.

## Customer Trust / Fail-Closed Findings

Search preserved the required trust boundaries:

- MORE AVAILABLE DATA does not mean a better property.
- SOURCE AVAILABILITY does not equal PROPERTY QUALITY.
- MISSING DATA does not equal NEGATIVE PROPERTY CONDITION.

No measured or inspected Search path introduced fabricated listing facts, hidden ranking, suitability claims, investment ranking, valuation, protected-class inference, misleading source certainty, customer-history dependence, persistence dependence, local/session storage shortlist persistence, tracking dependence, or telemetry dependence.

## Validation

Passed after rerun with filesystem permission for generated `dist` output:

- `npm run check:search-runtime-safety`
- `npm run check:search-listing-quality`
- `npm run check:map-rendering-safety`

Initial sandboxed attempts failed with `TS5033` `EPERM` while writing generated `dist` files. The rerun passed; the initial failure was permission-related, not a Search behavior failure.

## Protected-System Confirmation

No customer runtime files were modified. No production deployment was performed. No database/schema mutation, customer-data write, provider/source activation, Typesense configuration change, MLS synchronization, county/GIS acquisition, CRM/email action, alerts/workers action, telemetry action, auth change, account/identity change, persistence change, or customer feature implementation occurred.

## Final Disposition

`CERTIFIED_WITH_NARROW_REMEDIATION_CANDIDATE`

Existing Search is usable, bounded, customer-safe, and fail-closed across measured normal and degraded states. However, both local and production probes show Search serving from the database fallback rather than the primary Typesense path. This is not a customer-facing failure under current evidence, but it is a measured provider-health issue that justifies a separately authorized narrow remediation review.

## Remediation Candidate

Recommended next authorization:

`READY_FOR_REIE_SEARCH_PRIMARY_PROVIDER_HEALTH_REMEDIATION_REVIEW_AUTHORIZATION`

Candidate scope, if separately authorized:

- inspect current production Typesense host/key/connectivity/configuration health;
- verify collection availability and schema compatibility;
- verify whether the `listings` collection is reachable from production;
- confirm whether fallback is expected or accidental;
- restore primary provider health only if evidence shows a configuration/connectivity defect;
- preserve current database/Supabase fallback semantics and customer-safe degraded metadata.

Do not implement this remediation under the current certification authorization.
