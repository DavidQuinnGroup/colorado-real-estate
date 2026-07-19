# EIA 1.0 Wave 2 Sprint 3 Platform Availability Adapter

## Sprint Status

```text
CERTIFIED_AND_CLOSED
```

Sprint 3 is certified and closed after completed owner-run production activation, idempotency validation, inspection evidence, and executive review.

Sprint 4, Search Runtime Adapter, is authorized for implementation by executive review after completed Sprint 3 activation evidence. Sprint 5 is not authorized by this record.

## Scope

Sprint 3 implements the Platform Availability Adapter as an admin-only Enterprise Adapter Framework consumer.

The adapter observes the authoritative production host:

```text
https://davidquinngroup.com
```

It performs bounded, unauthenticated, read-only availability probes against governed same-origin endpoints and persists only supported platform KPI observations when explicitly invoked with `execute=true` through the protected admin route.

## Architectural Findings

Canonical platform KPI inspection found two Sprint 3-supported KPIs:

| KPI | Name | Sprint 3 handling |
| --- | --- | --- |
| `KPI-PLAT-001` | Production Availability | Supported |
| `KPI-PLAT-002` | Search API Success Rate | Supported |

Canonical platform KPI inspection also found unavailable metrics:

| KPI | Name | Sprint 3 handling |
| --- | --- | --- |
| `KPI-PLAT-003` | Search Response Time | `UNAVAILABLE` because governed notes prohibit inferring it from one-off probe timings |
| `KPI-PLAT-004` | Application Error Rate | `UNAVAILABLE` because no approved production monitoring feed is available to this adapter |

Additional requested metrics without governed KPI IDs are returned as `UNSUPPORTED`; no KPI IDs or formulas are fabricated.

## Implemented

Sprint 3 adds:

- `lib/platform/availabilityAdapter.ts`
- `app/api/admin/enterprise/platform-availability-adapter/route.ts`
- `scripts/checkPlatformAvailabilityAdapterSafety.ts`
- `npm run check:platform-availability-adapter-safety`

The Enterprise Adapter Framework was extended additively to support:

- Dynamic sanitized source query references derived from adapter source state.
- Optional source summaries in adapter invocation results.

The Repository Governance Adapter remains compatible with the static source-query-reference path and its Sprint 2 behavior is preserved.

## Endpoint Registry

Endpoint registry version:

```text
EIA-1.0-platform-availability-registry-v1
```

Registered endpoints:

| Endpoint ID | Method | Path | Expected status | Auth expectation |
| --- | --- | --- | --- | --- |
| `HOME` | `GET` | `/` | `200` | Public |
| `SEARCH_UI` | `GET` | `/search` | `200` | Public |
| `SEARCH_API` | `GET` | `/api/search?limit=1` | `200` | Public |
| `PROPERTY_ROUTE` | `GET` | `/properties/6137-baseline-rd-boulder-co-ire1349635` | `200` | Public |
| `ENTERPRISE_AUTH_BOUNDARY` | `GET` | `/api/admin/enterprise/health` | `401` | Protected unauthenticated boundary |

The representative property route is the governed property-route safety sample already used by existing production checks.

## Protected-Route Semantics

The adapter route is:

```text
/api/admin/enterprise/platform-availability-adapter
```

It reuses `authorizeRepositoryAdminRequest` and returns the existing unauthorized response when no valid admin credential is supplied.

There is no public platform availability adapter route.

For the protected route probe, HTTP `401` is classified as `HEALTHY_AUTH_BOUNDARY`. HTTP `200` is classified as `SECURITY_FAILURE`.

## Search API Semantics

The search API probe requires HTTP `200` and a valid JSON response shape with bounded summary fields.

`health="degraded"` or `source="database"` remains a successful route availability result for `KPI-PLAT-002`, while the source summary records the degraded state. The adapter does not convert a database fallback into a false Typesense-health claim.

## Models

No Prisma models were added or changed.

The adapter writes through existing EIA persistence models only when explicitly invoked with `execute=true`:

- EIA provenance.
- EIA evidence reference.
- EIA KPI observation.
- EIA KPI evaluation.
- EIA evidence link.

## Model Ownership

| Surface | Owner |
| --- | --- |
| Platform Availability Adapter | REIE Platform |
| Endpoint registry | Platform Engineering |
| EIA persistence framework | PROJECT ATLAS Executive Architecture |
| Canonical KPI registry | Enterprise Architecture Office |

## Immutability Classifications

| Object | Classification |
| --- | --- |
| Endpoint registry version | Governed immutable version string |
| Observation window | Immutable 15-minute bucket per invocation time |
| Source fingerprint | Immutable normalized source-state hash |
| Evidence reference content hash | Immutable source fingerprint |
| KPI observations/evaluations | Idempotent historical records |

## Relationships

The adapter creates the standard Wave 1 EIA persistence relationships in execute mode:

- Provenance supports evidence reference.
- Evidence reference supports KPI observations.
- Evidence reference supports KPI evaluations.

No customer, CRM, MLS, queue, email, worker, scheduler, cron, or Typesense relationships are introduced.

## Indexes

No database indexes were added or changed.

Idempotency continues to rely on the existing Wave 1 persistence unique keys and lookup semantics.

## Constraints

No database constraints were added or changed.

Runtime constraints are code-governed:

- Same-origin endpoint allowlist.
- `GET` only.
- 10-second probe timeout.
- Manual redirect handling.
- No secret-bearing request headers.
- Admin-only route access.

## Provenance Handling

Execute mode creates `LIVE` EIA provenance with:

- Source system: `REIE Production Platform`
- Source type: `platform_availability_adapter_invocation`
- Evidence type: `PLATFORM_AVAILABILITY_SOURCE_STATE`
- Calculation version: `EIA-1.0-platform-availability-adapter-v1`
- Environment from the Enterprise Adapter Framework.
- Privacy `SYSTEM` for provenance/evidence.
- Privacy `INTERNAL` for observations/evaluations.
- Retention `AUDIT` for provenance/evidence.
- Retention `HISTORICAL` for observations/evaluations.

The source query reference is sanitized and contains only the production origin, endpoint registry version, observation window, endpoint IDs, paths, observed statuses, and classifications.

## Evidence Lineage

Evidence lineage is derived from the normalized source-state fingerprint.

The fingerprint includes:

- Adapter identity and version.
- Production origin.
- Endpoint registry version.
- Observation window start.
- Endpoint IDs.
- Methods and paths.
- Expected statuses.
- Auth expectations.
- Observed statuses.
- Classifications.
- Validation states.
- Search API bounded summary fields.
- Unsupported metric declarations.

The fingerprint excludes:

- Raw response bodies.
- Credentials.
- Headers containing credentials.
- Probe timestamps other than the governed observation window.
- Latency values.

## Fixture Handling

The adapter does not read, promote, aggregate, or persist fixture observations.

All persisted adapter observations are explicitly classified as `LIVE` and require protected manual execute invocation.

## Idempotency

The adapter uses a 15-minute governed observation window for `sourceEffectiveAt`.

Repeated execute invocations with unchanged normalized source state in the same observation window deduplicate through the existing Wave 1 persistence idempotency semantics.

Changed endpoint classifications, statuses, search API availability shape, or a later observation window produce a new source fingerprint and a new governed observation state.

## Access-Control Review

Confirmed design:

- Admin route only.
- Existing Repository admin auth reused.
- No public route.
- No admin key weakening.
- No local credential generation.
- No secret exposure in adapter output.

If the approved admin key is unavailable in Codex's environment, production activation remains pending owner action and is not an implementation failure.

## Privacy Review

The adapter does not inspect customer records and does not request or persist customer names, emails, phone numbers, messages, saved searches, CRM state, MLS source payloads, or raw search results.

Search API response handling stores only bounded route-health summary fields.

## Retention And Archival

Retention follows existing Wave 1 EIA persistence policy:

- Provenance/evidence: `AUDIT`.
- Observations/evaluations: `HISTORICAL`.

No new archival process is introduced.

## Production-Write Review

Authorized write surface is limited to governed EIA persistence in explicit execute mode.

Confirmed absent from the implementation:

- Live intelligence ingestion.
- Historical backfill.
- Production seed.
- Cron or scheduler activation.
- Worker activation.
- Queue release.
- Email activation.
- CRM mutation.
- MLS mutation.
- Typesense mutation.
- Official decision-workflow activation.
- Automatic operational writes.
- Public intelligence exposure.

## Safety Check

Sprint 3 adds:

```text
npm run check:platform-availability-adapter-safety
```

The safety check verifies:

- Stable adapter identity.
- Authoritative production origin.
- Governed endpoint registry.
- Supported KPI mapping.
- Unsupported/unavailable metric reporting.
- Protected-route semantics.
- Search API route coverage.
- Representative property route coverage.
- Bounded timeout.
- Manual redirects.
- Error sanitization.
- No direct Prisma usage in adapter or route.
- Existing admin auth reuse.
- No public adapter route.
- Framework support for dynamic source references and source summaries.

## Validation Results

Local validation completed on July 19, 2026 at 10:15 MDT.

Passed:

```text
npm run check:platform-availability-adapter-safety
npm run check:enterprise-adapter-framework-safety
npm run check:repository-governance-adapter-safety
npm run check:enterprise-intelligence-persistence-safety
npm run check:enterprise-kpi-safety
npm run check:enterprise-intelligence-safety
npm run check:enterprise-executive-workspace-safety
npm run check:enterprise-decision-support-safety
npm run check:enterprise-learning-system-safety
npm run check:search-runtime-safety
npm run check:property-route-safety
npm run check:unsubscribe-safety
npm run check:track-click-runtime-safety
npm run typecheck
npm run lint
npm run build
npx prisma validate
npx prisma migrate status
git diff --check
```

No Prisma schema change, migration, database reset, `prisma db push`, live sync, worker activation, queue processing, email send, CRM mutation, MLS request, Typesense mutation, OpenAI call, or TitlePro247 call was performed.

## Deployment

Implementation commit:

```text
52fd69307fd6249f3b87eee7c39cc416b507e824
```

Git-triggered Vercel deployment completed successfully.

Deployment evidence:

```text
GitHub commit status: success
Vercel context: Vercel
Description: Deployment has completed
Status ID: 50719137999
Target: https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/8DRwhyQGb551yJqm97b58ex3C6te
```

## Post-Deployment Health

Unauthenticated production probes completed after deployment:

| Probe | Expected | Result |
| --- | --- | --- |
| `/` | `200` | `200` |
| `/search` | `200` | `200` |
| `/api/search?limit=1` | `200` | `200` |
| `/properties/6137-baseline-rd-boulder-co-ire1349635` | `200` | `200` |
| `/api/admin/enterprise/health` without auth | `401` | `401` |
| `/api/admin/enterprise/platform-availability-adapter` without auth | `401` | `401` |
| `POST /api/admin/enterprise/platform-availability-adapter` without auth | `401` | `401` |
| `/api/enterprise/platform-availability-adapter` | `404` | `404` |

Search API bounded summary:

```text
source = database
health = degraded
ready = false
blockerCount = 1
resultCount = 1
```

This confirms route availability with explicit degraded search-source posture.

## Activation Boundary

Sprint 3 production activation is complete.

Activation status:

```text
CERTIFIED_AND_CLOSED
```

## Executive Certification

EIA 1.0 Wave 2 Sprint 3, Platform Availability Adapter, is certified and closed.

Certification authority: PROJECT ATLAS Executive Architecture.

Certification basis:

- Runtime commit `52fd69307fd6249f3b87eee7c39cc416b507e824`.
- Documentation handoff commit `e5dc522749c09ced63775614520f5660b12ca352`.
- Adapter ID `PLATFORM_AVAILABILITY`.
- Adapter version `1.0.0`.
- Environment `PRODUCTION`.
- Controlled dry-run evidence.
- Controlled production activation evidence.
- Same-window idempotency validation.
- Authorized inspection evidence.
- Security validation.
- Production-write review.

## Controlled Dry-Run Evidence

Invocation:

```text
PLAT-SPRINT3-DRYRUN
```

Verified:

```text
success = true
mode = DRY_RUN
writesEiaPersistence = false
sourceStatus = SUCCESS
validationStatus = SUCCESS
persistenceStatus = SUCCESS
overallStatus = SUCCESS
observationsAttempted = 2
observationsPersisted = 0
observationsDeduplicated = 0
validationFailures = 0
persistenceFailures = 0
```

Supported KPI dry-run values:

```text
KPI-PLAT-001 Production Availability = 100%
KPI-PLAT-002 Search API Success Rate = 100%
```

Unsupported or unavailable metrics remained explicit:

| Metric | Status |
| --- | --- |
| Critical Route Availability | `UNSUPPORTED` |
| Protected Route Integrity | `UNSUPPORTED` |
| `KPI-PLAT-003` Search Response Time | `UNAVAILABLE` |
| `KPI-PLAT-004` Application Error Rate | `UNAVAILABLE` |
| Search Provider Quality | `UNSUPPORTED` |

## Endpoint Classification Evidence

Verified endpoint classifications:

| Endpoint | Status | Classification |
| --- | --- | --- |
| `HOME` | `200` | `AVAILABLE` |
| `SEARCH_UI` | `200` | `AVAILABLE` |
| `SEARCH_API` | `200` | `AVAILABLE_DEGRADED` |
| `PROPERTY_ROUTE` | `200` | `AVAILABLE` |
| `ENTERPRISE_AUTH_BOUNDARY` | `401` | `HEALTHY_AUTH_BOUNDARY` |

The Search API degradation was preserved separately from endpoint availability.

The protected unauthenticated `401` was correctly treated as healthy access control.

## Controlled Production Activation

Invocation:

```text
PLAT-SPRINT3-ACTIVATION-1
```

Verified:

```text
success = true
mode = EXECUTE
writesEiaPersistence = true
overallStatus = SUCCESS
persistenceStatus = SUCCESS
observationsAttempted = 2
observationsPersisted = 2
observationsDeduplicated = 0
validationFailures = 0
persistenceFailures = 0
```

## Persisted Observation Evidence

Persisted live observations:

| KPI | Value |
| --- | --- |
| `KPI-PLAT-001` | `100` |
| `KPI-PLAT-002` | `100` |

Each persisted observation was verified with:

```text
environment = PRODUCTION
dataOrigin = LIVE
confidence = HIGH
freshness = FRESH
privacy = INTERNAL
sensitivity = INTERNAL
retention = HISTORICAL
immutability = APPEND_ONLY
```

## Idempotency Validation

Invocation:

```text
PLAT-SPRINT3-ACTIVATION-2
```

Verified within the same governed 15-minute observation window:

```text
overallStatus = SUCCESS
persistenceStatus = SUCCESS
observationsAttempted = 2
observationsPersisted = 0
observationsDeduplicated = 2
validationFailures = 0
persistenceFailures = 0
```

The original observation and evaluation records were reused. No uncontrolled duplicate history was created.

## Inspection Evidence

Verified:

```text
adapterId = PLATFORM_AVAILABILITY
adapterVersion = 1.0.0
environment = PRODUCTION
latestLiveObservationCount = 2
manualInvocationOnly = true
publicExposure = false
productionOrigin = https://davidquinngroup.com
endpointRegistryVersion = EIA-1.0-platform-availability-registry-v1
```

Supported KPIs:

```text
KPI-PLAT-001
KPI-PLAT-002
```

## Security Validation

Confirmed:

```text
Admin authentication required
Unauthenticated GET = 401
Unauthenticated POST = 401
Public-equivalent route = 404
```

## Production-Write Review

Confirmed absent during Sprint 3:

```text
No customer mutation
No CRM mutation
No MLS mutation
No Typesense mutation
No Repository mutation
No email action
No queue release
No worker activation
No scheduler activation
No cron activation
No automatic invocation
No fixture persistence as live evidence
```

## Known Limitations

`KPI-PLAT-003` and `KPI-PLAT-004` remain defined but unavailable to this adapter.

Critical route availability and protected-route integrity remain reported as unsupported because no canonical governed KPI IDs exist in the current registry.

The adapter does not measure provider-level search quality or application error rate. Those require separately governed sources.

`GAP-006` remains:

```text
OPEN_MATERIAL_REDUCED
```

Sprint 5 is not authorized by this record.

## Closure Determination

EIA 1.0 Wave 2 Sprint 3, Platform Availability Adapter, is:

```text
CERTIFIED_AND_CLOSED
```

EIA 1.0 Wave 2 Sprint 4, Search Runtime Adapter, is:

```text
AUTHORIZED_FOR_IMPLEMENTATION
```

This Sprint 4 authorization comes from executive review after completed Sprint 3 activation evidence.

`GAP-006` remains:

```text
OPEN_MATERIAL_REDUCED
```

## Rollback Procedure

Revert the Sprint 3 implementation commit and redeploy.

No database rollback is required because Sprint 3 introduces no Prisma schema change and no migration.

Historical EIA observations created by previously authorized adapter invocations should be preserved.
