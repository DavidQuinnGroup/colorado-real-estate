# PROJECT ATLAS(tm)

## Enterprise Implementation Program(tm) - Sprint 6A

### Production Runtime Packaging Correction(tm)

Status: `EIP_1.0_SPRINT_6A_PRODUCTION_RUNTIME_PACKAGING_CORRECTION_DEPLOYED_BLOCKED_AT_DRY_RUN_BY_MIGRATION_DIRECTORY_DEPENDENCY`

Implementation date: July 25, 2026

Starting HEAD: `c1ae3c841d714012145d348cc130143ca6159da1`

Parent sprint: `EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT`

---

## 1. Executive Summary

Sprint 6A corrects a deployed runtime packaging blocker discovered during the protected Sprint 6 production dry-run path.

The blocked dry-run response was:

- invocation ID: `EIP-S6-DRY-20260725-002`;
- HTTP status: `500`;
- error: `ENOENT: no such file or directory, open 'prisma/schema.prisma'`;
- execute attempted: no;
- production GIO writes: `0`.

The correction does not change the Sprint 6 data plan. It adds a route-scoped package tracing include for the one Prisma schema asset required by Prisma Client's node runtime while preserving the application-level rule that runtime code must not inspect `schema.prisma`.

---

## 2. Root-Cause Investigation

Repository source review found:

- `app/api/admin/enterprise/geographic-persistence-pilot/route.ts` does not read `schema.prisma`;
- `lib/eip/controlledProductionInternalGeographicPersistencePilot.ts` does not read `schema.prisma`;
- no public runtime path imports the Sprint 6 pilot module;
- no public runtime path references the protected pilot route.

Generated Prisma Client review found:

- `node_modules/.prisma/client/index.js` includes generated configuration for `sourceFilePath` pointing to `prisma/schema.prisma`;
- Prisma Client includes an inline schema but still configures node-engine schema paths;
- deployed Vercel output did not include the required schema asset for the protected admin route.

Determination:

`SPRINT_6A_ROOT_CAUSE_CONFIRMED_AS_PRISMA_CLIENT_ROUTE_PACKAGE_TRACING_GAP`

---

## 3. Implemented Correction

Updated file:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/next.config.ts`

Correction:

- added `outputFileTracingIncludes`;
- scoped include to `/api/admin/enterprise/geographic-persistence-pilot`;
- included only `./prisma/schema.prisma`.

No Prisma schema change was made.

No migration was created.

No runtime customer path was changed.

---

## 4. Validation Implementation

Created validation script:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkEipSprint6aProductionRuntimePackagingCorrection.ts`

Added package command:

- `npm run check:eip-sprint-6a-production-runtime-packaging-correction`

Validation proves:

- package include is route-scoped;
- broad repository or broad Prisma file tracing is absent;
- protected admin route has no schema-file read;
- Sprint 6 pilot module has no schema-file read;
- dry-run construction succeeds with `prisma/schema.prisma` reads blocked;
- dry run remains zero mutation;
- write limits remain one object, two aliases, one source, six observations, one eligibility row, zero relationships, zero property relationships;
- eligibility and activation flags remain false;
- no public runtime consumer imports or references the Sprint 6 pilot.

---

## 5. Local Validation Evidence

Command:

```bash
npm run check:eip-sprint-6a-production-runtime-packaging-correction
```

Result:

- passed.

Output summary:

- route-scoped Prisma schema packaging passed;
- no app or pilot schema inspection found;
- dry-run zero-mutation contract passed;
- unchanged Sprint 6 limits passed;
- false eligibility passed;
- no public/runtime consumers passed;
- validation wiring passed.

---

## 6. Runtime Isolation Verification

Runtime isolation remains unchanged:

- public API: none added;
- search consumption: none;
- map consumption: none;
- property consumption: none;
- SEO consumption: none;
- public page visibility: none;
- customer eligibility: none;
- vendor activation: none;
- MLS activation: none;
- CRM, alert, email, analytics, and AI activation: none.

The protected route remains under:

- `/api/admin/enterprise/geographic-persistence-pilot`

Admin authorization remains required through the existing repository admin auth boundary.

---

## 7. Production Verification Status

Correction deployment evidence:

- commit: `a8f09faf2e9011d78b995359b11e97bdbc80f79d`;
- Vercel status ID: `51090831312`;
- status: `success`;
- description: `Deployment has completed`.

Production dry-run retry:

- invocation ID: `EIP-S6-DRY-20260725-003`;
- HTTP status: `500`;
- result: `success=false`;
- error: `ENOENT: no such file or directory, scandir 'prisma/migrations'`;
- execute attempted: no;
- production GIO writes performed: `0`.

Interpretation:

- the route-scoped schema packaging correction resolved the previously observed `prisma/schema.prisma` file-open failure;
- deployed runtime then exposed a new file-system dependency on `prisma/migrations`;
- source investigation shows `lib/gma/internalMappingReviewQueue.ts` imports from `scripts/checkGmaReadOnlyMappingPreview.js`, and that validation script scans `prisma/migrations` at module load;
- this validation-script dependency reaches the protected Sprint 6 admin route through the EIP fixture/readiness dependency chain.

Current determination:

`SPRINT_6A_DEPLOYED_DRY_RUN_BLOCKED_BY_VALIDATION_SCRIPT_RUNTIME_LEAK`

Required next production dry run:

- invocation ID: `EIP-S6-DRY-20260725-003`;
- expected HTTP status: `200`;
- expected `success`: `true`;
- expected `dryRun`: `true`;
- expected `executed`: `false`;
- expected `writesPerformed`: `0`;
- expected planned creates: object `1`, aliases `2`, source `1`, observations `6`, eligibility row `1`, relationships `0`, property relationships `0`;
- expected eligibility flags: all false;
- expected rollback plan: present.

Controlled execute remains prohibited until this dry run succeeds.

---

## 8. Google Doc Governance Evidence

Google Doc:

- title: `PROJECT ATLAS REIE V 7.1 - ADJUSTMENTS & MODIFICATIONS`;
- document ID: `1jfTLWoRNuuQ0DhJZSjTWx96n72VLZGPqO371FCjbkBs`;
- tab: `t.0`.

Sprint 6A addendum recorded:

- Sprint 6 blocked status;
- blocked dry-run evidence;
- no execute run and no production GIO write;
- Sprint 6A authorization;
- root-cause determination;
- route-scoped correction scope;
- continued prohibition on Sprint 6 controlled execute until deployed dry-run success.

Readback revision after Sprint 6A addendum:

- `AIroW36d83cu-D2jgMNIXyhETtDew3QJAFdpjH22W6qcLpaoogXytvakJTKgqIuPu4Uz9NSbURPdm1pRpfSdcRejXN-DiRyybPElUKvpsGI`

Readback revision after deployed dry-run blocker addendum:

- `AIroW34KVXr1_pKS5rmREkKatisygg_9MPXuzssIr701Wcw5yjfcUrfSqd_vGBxdNAkLxhCenUv1BmbGRkGEnf54vzeZr8ecokBGSS-_CB4`

---

## 9. Risk Register

| Risk | Status | Mitigation |
| --- | --- | --- |
| Prisma Client requires schema artifact in deployed node route | Mitigated locally | Route-scoped file tracing include |
| Validation script dependency leaks into deployed admin route and scans `prisma/migrations` | Open blocker | Requires separate correction to separate runtime-safe fixture modules from validation scripts |
| Broad repository file exposure | Controlled | Include is limited to `./prisma/schema.prisma` for one admin route |
| Runtime schema inspection pattern | Rejected | Route and pilot module do not read schema files |
| Production writes before dry-run evidence | Blocked | Execute remains prohibited until deployed dry run succeeds |
| Customer visibility | Controlled | No public consumer or eligibility activation |

---

## 10. Certification Recommendation

Sprint 6A is not certified.

Recommended next action:

- authorize a narrow runtime dependency separation correction that removes production-route imports from validation scripts and keeps repository file scans in build/check scripts only.

Certification recommendation remains deferred:

`EIP_1.0_SPRINT_6A_PRODUCTION_RUNTIME_PACKAGING_CORRECTION_CERTIFIED_AND_CLOSED`

Sprint 6 controlled execute may resume only after Sprint 6A production dry-run verification succeeds.
