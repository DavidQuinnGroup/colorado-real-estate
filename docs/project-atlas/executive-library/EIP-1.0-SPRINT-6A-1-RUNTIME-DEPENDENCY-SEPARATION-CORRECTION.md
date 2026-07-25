# PROJECT ATLAS(tm)

## Enterprise Implementation Program(tm) - Sprint 6A.1

### Runtime Dependency Separation Correction(tm)

Status: `IMPLEMENTED_PENDING_FULL_VALIDATION_DEPLOYMENT_AND_DRY_RUN`

Implementation date: July 25, 2026

Starting HEAD: `c5bdca74fbf24c5a5e6801e1b0093005777d55c4`

Parent sprint: `EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT`

---

## 1. Executive Summary

Sprint 6A.1 corrects the second deployed dry-run blocker in the protected Sprint 6 production-internal persistence pilot route.

The correction does not change the Sprint 6 data plan, route authorization model, Prisma schema, migrations, customer runtime, or production write behavior. It separates reusable GMA preview fixtures from the GMA validation script so protected runtime code no longer imports a checker that scans repository migration files.

Controlled execute remains prohibited pending deployed dry-run success and executive review.

---

## 2. Root-Cause Evidence

Production dry-run blocker:

- invocation ID: `EIP-S6-DRY-20260725-003`;
- HTTP status: `500`;
- error: `ENOENT: no such file or directory, scandir 'prisma/migrations'`;
- execute attempted: no;
- production GIO writes: `0`.

Confirmed import path from protected route to migration scan:

1. `app/api/admin/enterprise/geographic-persistence-pilot/route.ts`
2. `lib/eip/controlledProductionInternalGeographicPersistencePilot.ts`
3. `lib/eip/internalGeographicReadModel.ts`
4. `lib/eip/internalGeographicPersistenceProof.ts`
5. `lib/gma/internalReviewDecisionFixture.ts`
6. `lib/gma/internalMappingReviewQueue.ts`
7. `scripts/checkGmaReadOnlyMappingPreview.js`
8. top-level `fs.readdirSync("prisma/migrations")`

Determination:

`SPRINT_6A_1_ROOT_CAUSE_CONFIRMED_AS_RUNTIME_TO_VALIDATION_SCRIPT_DEPENDENCY_LEAK`

---

## 3. Implemented Correction

Created runtime-safe fixture module:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/gma/readOnlyMappingPreviewFixtures.ts`

The module contains:

- deterministic preview record types;
- pure normalization and preview ID helpers;
- deterministic read-only preview record construction;
- no filesystem access;
- no Prisma access;
- no network access;
- no environment access;
- no schema or migration inspection;
- no script import.

Updated runtime consumer:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/gma/internalMappingReviewQueue.ts`

Change:

- replaced import from `../../scripts/checkGmaReadOnlyMappingPreview.js`;
- now imports from `./readOnlyMappingPreviewFixtures.js`.

Updated validation script:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkGmaReadOnlyMappingPreview.ts`

Change:

- now validates records exported by the runtime-safe fixture module;
- keeps schema, package, migration, and runtime-scan assertions in `scripts/` only.

---

## 4. New Safety Gate

Created validation script:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkEipSprint6aRuntimeDependencySeparation.ts`

Added package command:

```bash
npm run check:eip-sprint-6a-runtime-dependency-separation
```

The check proves:

- protected route dynamically imports only Prisma and the Sprint 6 pilot module;
- protected route has no repository file reads or migration scans;
- `lib/gma/internalMappingReviewQueue.ts` no longer imports `scripts/`;
- validation script imports runtime-safe fixtures from `lib/gma`;
- runtime-safe fixture module contains no filesystem, Prisma, environment, network, schema, migration, or script dependency;
- runtime source roots do not import `scripts/` or `dist/scripts/`;
- Prisma schema and migrations are unchanged in the working diff;
- protected route dependency graph can import and build the Sprint 6 plan while repository Prisma schema and migration filesystem access is blocked;
- Sprint 6 dry-run contract remains `success=true`, `dryRun=true`, `executed=false`, `writesPerformed=0`;
- planned creates remain one object, two aliases, one source, six observations, one eligibility row, zero relationships, and zero property relationships;
- all eligibility and activation flags remain false.

---

## 5. Focused Validation Evidence

Commands run:

```bash
npm run worker:build
npm run check:gma-read-only-mapping-preview
npm run check:gma-internal-mapping-review-queue
npm run check:gma-internal-review-decision-fixture
npm run check:eip-sprint-6-controlled-production-internal-geographic-persistence-pilot
npm run check:eip-sprint-6a-production-runtime-packaging-correction
npm run check:eip-sprint-6a-runtime-dependency-separation
```

Results:

- worker build: passed;
- GMA read-only mapping preview: passed with `91` deterministic preview records;
- GMA review queue: passed with `91` queue items and no active eligibility;
- GMA review decision fixture: passed with `10` fixture decisions;
- Sprint 6 pilot safety: passed;
- Sprint 6A packaging safety: passed;
- Sprint 6A.1 runtime dependency separation: passed.

Sprint 6A.1 check output summary:

- runtime-to-scripts imports blocked;
- GMA preview fixtures separated into `lib/gma`;
- protected route graph does not read `prisma/schema.prisma` or scan `prisma/migrations`;
- Sprint 6 dry run remains zero mutation;
- eligibility remains false;
- schema and migrations remain unchanged.

---

## 6. Runtime Isolation Verification

Runtime isolation remains unchanged:

- public API: none added;
- public route: none added;
- search consumption: none;
- map consumption: none;
- property consumption: none;
- SEO consumption: none;
- public page visibility: none;
- customer eligibility: none;
- indexing: none;
- analytics: none;
- AI consumption: none;
- vendor, MLS, CRM, alert, email activation: none.

Protected route remains:

- `/api/admin/enterprise/geographic-persistence-pilot`

Admin authorization remains required.

---

## 7. Production Verification Plan

After full local validation, commit, push, and successful deployment, retry production dry run with a new invocation ID:

- recommended invocation ID: `EIP-S6-DRY-20260725-004`;
- subject: `Thornton, Colorado`;
- scope: `CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT`;
- execute flag: absent or false.

Required result:

- HTTP `200`;
- `success=true`;
- `dryRun=true`;
- `executed=false`;
- `writesPerformed=0`;
- planned creates within authorized limits;
- all eligibility flags false;
- all activation flags false;
- relationship and property relationship planned creates `0`;
- rollback plan available;
- stop conditions empty.

Controlled execute remains prohibited after dry-run success until executive review confirms continuation.

---

## 8. Risk Register

| Risk | Status | Mitigation |
| --- | --- | --- |
| Runtime imports validation script | Mitigated locally | Runtime imports now point to `lib/gma/readOnlyMappingPreviewFixtures.ts`; new safety rule scans runtime import specifiers |
| Protected route scans `prisma/migrations` | Mitigated locally | Route dependency graph validated under blocked schema/migration filesystem guard |
| Fixture outputs drift during extraction | Controlled | Existing GMA preview, queue, and decision fixture checks passed with expected counts |
| Schema or migration mutation | Controlled | New safety check asserts no Prisma schema/migration diff |
| Production write before dry-run evidence | Blocked | Execute remains prohibited |
| Customer-visible behavior changes | Controlled | No public/runtime integration changed |

---

## 9. Certification Recommendation

Local implementation is eligible to proceed to full validation, commit, push, deployment verification, and dry-run retry.

Certification remains deferred until:

- all required validation passes;
- deployment succeeds;
- production dry run returns the required zero-mutation success evidence;
- controlled execute remains paused for executive review.

Current recommendation:

`EIP_1.0_SPRINT_6A_1_RUNTIME_DEPENDENCY_SEPARATION_CORRECTION_READY_FOR_FULL_VALIDATION_AND_DEPLOYMENT`

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/EIP-1.0-SPRINT-6A-1-RUNTIME-DEPENDENCY-SEPARATION-CORRECTION.md -->
