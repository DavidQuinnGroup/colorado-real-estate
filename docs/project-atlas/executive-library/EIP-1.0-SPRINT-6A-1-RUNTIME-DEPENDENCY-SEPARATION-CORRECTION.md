# PROJECT ATLAS(tm)

## Enterprise Implementation Program(tm) - Sprint 6A.1

### Runtime Dependency Separation Correction(tm)

Status: `EIP_1.0_SPRINT_6A_1_RUNTIME_DEPENDENCY_SEPARATION_CORRECTION_CERTIFIED_AND_CLOSED`

Implementation date: July 25, 2026

Starting HEAD: `c5bdca74fbf24c5a5e6801e1b0093005777d55c4`

Parent sprint: `EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT`

---

## 1. Executive Summary

Sprint 6A.1 corrects the second deployed dry-run blocker in the protected Sprint 6 production-internal persistence pilot route.

The correction does not change the Sprint 6 data plan, route authorization model, Prisma schema, migrations, customer runtime, or production write behavior. It separates reusable GMA preview fixtures from the GMA validation script so protected runtime code no longer imports a checker that scans repository migration files.

The correction was deployed successfully and verified by the authenticated production dry-run retry.

Sprint 6A.1 is certified and closed.

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

## 7. Production Verification Evidence

Deployment evidence:

- commit: `3a2874a6d936c81c3f5f4c5e1e6440d536065c39`;
- Vercel status ID: `51091139012`;
- status: `success`;
- description: `Deployment has completed`.

First production dry-run retry after deployment:

- invocation ID: `EIP-S6-DRY-20260725-004`;
- subject: `Thornton, Colorado`;
- scope: `CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT`;
- execute flag: absent or false.

Result:

- HTTP `401`;
- response: `Unauthorized. Send x-admin-key or Authorization: Bearer <key> when an admin key is configured.`;
- dry-run execution: not reached;
- controlled execute: not run;
- production GIO writes: `0`.

Interpretation:

- Sprint 6A.1 deployment succeeded;
- the migration-directory dependency correction had not yet been production-dry-run verified because the protected admin auth gate rejected the request;
- per stop conditions, no credential guessing or repeated production route retry was performed.

Authenticated production dry-run retry:

- invocation ID: `EIP-S6-DRY-20260725-005`;
- subject: `Thornton, Colorado`;
- scope: `CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT`;
- HTTP status: `200`;
- success: `true`;
- dryRun: `true`;
- executed: `false`;
- writesPerformed: `0`;
- planned `GeographicObject`: `1`;
- planned aliases: `2`;
- planned sources: `1`;
- planned observations: `6`;
- planned eligibility rows: `1`;
- planned `GeographicRelationship`: `0`;
- planned `PropertyGeographicRelationship`: `0`;
- all eligibility and activation flags: `false`;
- approval lineage: valid;
- rollback plan: available;
- stopConditions: `[]`.

Final determination:

- Sprint 6A.1 deployment and authenticated dry-run verification succeeded;
- runtime no longer imports the validation script path that scanned `prisma/migrations`;
- controlled execute authorization returned to the Sprint 6 charter after executive review.

Sprint 6A.1 final status:

- `EIP_1.0_SPRINT_6A_1_RUNTIME_DEPENDENCY_SEPARATION_CORRECTION_CERTIFIED_AND_CLOSED`

---

## 8. Risk Register

| Risk | Status | Mitigation |
| --- | --- | --- |
| Runtime imports validation script | Mitigated locally | Runtime imports now point to `lib/gma/readOnlyMappingPreviewFixtures.ts`; new safety rule scans runtime import specifiers |
| Protected route scans `prisma/migrations` | Mitigated locally | Route dependency graph validated under blocked schema/migration filesystem guard |
| Fixture outputs drift during extraction | Controlled | Existing GMA preview, queue, and decision fixture checks passed with expected counts |
| Schema or migration mutation | Controlled | New safety check asserts no Prisma schema/migration diff |
| Production dry-run auth failure | Closed | Authenticated retry `EIP-S6-DRY-20260725-005` returned HTTP `200` with zero writes |
| Production write before dry-run evidence | Closed | Execute did not run until dry-run evidence passed and executive review authorized Sprint 6 to resume |
| Customer-visible behavior changes | Controlled | No public/runtime integration changed |

---

## 9. Certification Recommendation

Implementation, deployment, and authenticated production dry-run verification succeeded.

Final recommendation:

`EIP_1.0_SPRINT_6A_1_RUNTIME_DEPENDENCY_SEPARATION_CORRECTION_CERTIFIED_AND_CLOSED`

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/EIP-1.0-SPRINT-6A-1-RUNTIME-DEPENDENCY-SEPARATION-CORRECTION.md -->
