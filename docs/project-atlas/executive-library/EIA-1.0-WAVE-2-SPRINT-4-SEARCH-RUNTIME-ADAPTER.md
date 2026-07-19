# EIA 1.0 Wave 2 Sprint 4 Search Runtime Adapter

## Status

`IMPLEMENTED`

`VALIDATED`

`DEPLOYED`

`ACTIVATION_PENDING`

Sprint 4 implements the Search Runtime Adapter as an admin-only Enterprise Adapter Framework consumer. Certification is not closed until controlled authenticated production activation, persistence, idempotency, inspection, and security evidence are complete.

Sprint 5 is not authorized by this record.

`GAP-006` remains open.

## Scope

The adapter answers:

Did the search runtime execute correctly, and through which provider path?

It does not answer whether the search endpoint is merely reachable. That remains Platform Availability Adapter ownership through `KPI-PLAT-002`.

## Deployment Evidence

Implementation commit:

`a19a14d58b7fb2054a1ba7796af47754427503e3`

Git-triggered Vercel deployment:

- GitHub commit status: `success`
- Vercel description: `Deployment has completed`
- Vercel status ID: `50720205387`
- Deployment target: `CZbqYTzrQK57nNa3tvehpHZcMybi`

## Post-Deployment Health

Unauthenticated production probes after deployment:

- `/` returned `200`
- `/search` returned `200`
- `/api/search?limit=1` returned `200`
- `/api/admin/enterprise/search-runtime-adapter` GET without auth returned `401`
- `/api/admin/enterprise/search-runtime-adapter` POST without auth returned `401`
- `/api/enterprise/search-runtime-adapter` returned `404`

Search runtime public probe summary:

- `source=database`
- `health=degraded`
- `returned=1`
- `mapped=1`
- `coordinateFiltered=0`
- `resultCount=1`
- `ready=false`
- `blockerCount=1`
- `fallbackReasonPresent=true`

This corresponds to a valid fallback runtime path and preserves degraded/fallback evidence rather than converting it into an undifferentiated healthy signal.

Codex did not have an approved admin key in the local environment, so controlled authenticated activation remains owner-action pending.

## Canonical KPI

| Field | Value |
| --- | --- |
| KPI ID | `KPI-SRCH-001` |
| Name | Search Runtime Health Rate |
| Formula | `valid usable runtime executions / total eligible runtime executions × 100` |
| Unit | `PERCENT` |
| Observation Grain | One deterministic bounded runtime probe per governed observation window |
| Owner | REIE Platform |
| Steward | Search Platform Engineering |

## Runtime Classifications

Eligible usable outcomes:

- `SUCCESS`
- `DEGRADED`
- `FALLBACK`
- `EMPTY_VALID`

Unsuccessful outcomes:

- `FAILED`
- `INVALID`
- `TIMEOUT`

Excluded outcomes:

- `UNKNOWN`
- `UNAVAILABLE`

No separate degraded-rate or fallback-rate KPI is created by this implementation.

## Probe Registry

| Probe ID | Method | Path | Timeout | Purpose |
| --- | --- | --- | --- | --- |
| `BOUNDED_DEFAULT_SEARCH` | `GET` | `/api/search?limit=1` | 10 seconds | Deterministic bounded public search runtime probe |

The probe uses the authoritative production origin:

`https://davidquinngroup.com`

The probe registry version is:

`EIA-1.0-search-runtime-probe-registry-v1`

## Evidence Handling

The adapter preserves sanitized evidence for:

- Runtime classification
- Provider classification
- Fallback used
- Degraded state
- Ready state
- Blocker count
- Result count
- Response-validation state
- Probe registry version
- Source-state fingerprint

A value of `100%` does not suppress degraded or fallback evidence.

The adapter does not persist result payloads, listing identifiers, addresses, raw fallback messages, arbitrary search terms, saved-search data, user identifiers, session identifiers, or contact information.

## Provider Handling

Provider classification is derived from the governed search response contract:

- `TYPESENSE` when the response source is `typesense`
- `DATABASE` when the response source is `database`
- `UNKNOWN` when response source semantics are invalid
- `UNAVAILABLE` when the runtime probe is unavailable

The adapter does not infer a deeper provider path when the public search response does not expose it.

## Idempotency

The adapter uses the Enterprise Adapter Framework persistence lifecycle with:

- Source type: `search_runtime_adapter_invocation`
- Evidence type: `SEARCH_RUNTIME_SOURCE_STATE`
- Calculation version: `EIA-1.0-search-runtime-adapter-v1`
- Source-effective time: 15-minute governed observation window start
- Source-state fingerprint: sanitized classification and count evidence only

Identical governed runtime observations in the same window deduplicate through the existing framework and persistence repository.

## Access Control

The route is internal admin only:

`/api/admin/enterprise/search-runtime-adapter`

It reuses the existing repository admin authorization boundary and does not create a public adapter route.

## Privacy

The adapter is system telemetry only. It does not persist customer data, lead data, search text, saved-search filters, viewed listings, user identifiers, session identifiers, IP addresses, cookies, listing addresses, or result payloads.

## Database Changes

No Prisma schema change.

No migration.

No destructive data operation.

Live persistence occurs only when the admin-only route is invoked with `execute=true`.

## Known Limitations

- Search response timing is preserved only as bounded probe context and is not mapped to a Search Runtime KPI.
- Fallback utilization and degraded rate are preserved as evidence under `KPI-SRCH-001`; they are not separate governed KPIs.
- Certification remains pending until owner-approved authenticated production activation evidence is complete.

## Owner Activation Commands

Use an approved admin key in the environment. Do not paste credentials into logs.

Dry run:

```bash
curl --max-time 30 -s -X POST \
  -H "x-admin-key: ${REIE_ADMIN_API_KEY}" \
  "https://davidquinngroup.com/api/admin/enterprise/search-runtime-adapter?invocationId=SRCH-SPRINT4-DRYRUN" | jq
```

Execute:

```bash
curl --max-time 30 -s -X POST \
  -H "x-admin-key: ${REIE_ADMIN_API_KEY}" \
  "https://davidquinngroup.com/api/admin/enterprise/search-runtime-adapter?execute=true&invocationId=SRCH-SPRINT4-ACTIVATION-1" | jq
```

Idempotency invocation:

```bash
curl --max-time 30 -s -X POST \
  -H "x-admin-key: ${REIE_ADMIN_API_KEY}" \
  "https://davidquinngroup.com/api/admin/enterprise/search-runtime-adapter?execute=true&invocationId=SRCH-SPRINT4-ACTIVATION-2" | jq
```

Inspection:

```bash
curl --max-time 30 -s \
  -H "x-admin-key: ${REIE_ADMIN_API_KEY}" \
  "https://davidquinngroup.com/api/admin/enterprise/search-runtime-adapter" | jq
```
