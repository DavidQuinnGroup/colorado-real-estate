# PROJECT ATLAS(tm)

## Enterprise Implementation Program(tm) - Sprint 6A.1

### Runtime Dependency Separation Correction(tm) Charter

Status: `AUTHORIZED_FOR_NARROW_CORRECTION`

Authorization date: July 25, 2026

Baseline commit: `c5bdca74fbf24c5a5e6801e1b0093005777d55c4`

Parent package: `EIP_1.0_SPRINT_6A_PRODUCTION_RUNTIME_PACKAGING_CORRECTION`

---

## Executive Objective

Sprint 6A.1 is authorized to remove a validation-script runtime dependency from the protected Sprint 6 production dry-run route.

The correction is limited to separating reusable GMA preview fixtures and contracts from validation scripts so runtime modules can consume deterministic internal fixture records without importing `scripts/` modules or executing repository filesystem scans.

---

## Confirmed Blocker

Authenticated production dry run:

- invocation ID: `EIP-S6-DRY-20260725-003`;
- HTTP status: `500`;
- error: `ENOENT: no such file or directory, scandir 'prisma/migrations'`;
- execute attempted: no;
- production GIO writes: `0`.

Confirmed runtime-to-validation dependency path:

1. `app/api/admin/enterprise/geographic-persistence-pilot/route.ts`
2. `lib/eip/controlledProductionInternalGeographicPersistencePilot.ts`
3. `lib/eip/internalGeographicReadModel.ts`
4. `lib/eip/internalGeographicPersistenceProof.ts`
5. `lib/gma/internalReviewDecisionFixture.ts`
6. `lib/gma/internalMappingReviewQueue.ts`
7. `scripts/checkGmaReadOnlyMappingPreview.js`
8. top-level `fs.readdirSync("prisma/migrations")`

---

## Authorized Scope

Authorized:

- move deterministic GMA read-only mapping preview records and types into a runtime-safe `lib/gma` module;
- update runtime consumers to import only from the runtime-safe module;
- keep schema, migration, package, and runtime scans inside validation scripts;
- add a safety command proving runtime modules do not import `scripts/` modules;
- update governance documentation and handoff state;
- deploy the correction and retry dry run only after local validation passes.

Not authorized:

- production execute;
- GIO row insertion;
- schema or migration changes;
- search, map, property, SEO, page, indexing, analytics, AI, vendor, MLS, CRM, alert, email, or customer behavior changes;
- new geographic scope;
- property relationship creation;
- broad package tracing of repository directories.

---

## Required Safety Determinations

The correction must prove:

- `app`, `lib`, components, and workers do not import `scripts/` or `dist/scripts/`;
- `lib/gma/readOnlyMappingPreviewFixtures.ts` has no filesystem, Prisma, network, environment, migration, or schema dependencies;
- the GMA preview record output remains deterministic;
- the protected route dependency graph no longer reads `prisma/schema.prisma` or scans `prisma/migrations`;
- Sprint 6 write limits remain unchanged;
- Sprint 6 eligibility and activation flags remain false;
- dry-run validation remains zero mutation;
- Prisma schema and migrations remain unchanged.

---

## Stop Conditions

Stop immediately if:

- a runtime module still imports `scripts/`;
- a runtime import path reads repository files;
- validation requires a production mutation;
- eligibility becomes true;
- planned writes exceed one object, two aliases, one source, six observations, one eligibility row, zero relationships, and zero property relationships;
- controlled execute is requested before successful deployed dry-run review.

---

## Acceptance Criteria

Sprint 6A.1 succeeds when:

- reusable GMA preview fixtures are runtime-safe;
- validation scripts retain repository scans without being runtime dependencies;
- new safety validation passes;
- all existing Sprint 6, Sprint 6A, GMA, GKC, GIO, runtime, Prisma, type, lint, build, and fast checks pass;
- production deployment succeeds;
- dry run is retried with a new invocation ID and returns HTTP `200`, `success=true`, `dryRun=true`, `executed=false`, `writesPerformed=0`, all eligibility false, and rollback plan available;
- controlled execute remains paused for executive review.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/EIP-1.0-SPRINT-6A-1-RUNTIME-DEPENDENCY-SEPARATION-CORRECTION-CHARTER.md -->
