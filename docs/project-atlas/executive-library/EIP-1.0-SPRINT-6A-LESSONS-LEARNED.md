# PROJECT ATLAS(tm)

## Enterprise Implementation Program(tm) - Sprint 6A Lessons Learned

Status: `EIP_1.0_SPRINT_6A_PRODUCTION_RUNTIME_PACKAGING_CORRECTION_DEPLOYED_BLOCKED_AT_DRY_RUN_BY_MIGRATION_DIRECTORY_DEPENDENCY`

Date: July 25, 2026

---

## 1. Deployed Runtime Evidence Is Not Optional

Sprint 6 local dry-run validation succeeded, but the deployed protected route still failed because the production package did not include a Prisma Client runtime asset.

For production-internal persistence, local correctness and deployed runtime readiness are separate gates.

---

## 2. Packaging Corrections Should Be Route-Scoped

The correct response to a missing runtime asset is not to copy repository files broadly.

Sprint 6A uses a single route-scoped include for `./prisma/schema.prisma` because the failing code path is one protected admin route and the dependency is Prisma Client's generated node runtime.

---

## 3. Application Runtime Should Not Inspect Schema Files

The Sprint 6 pilot route and module do not read `schema.prisma`.

The new Sprint 6A validation preserves that rule by failing if the protected route or pilot module introduces schema-file reads, `readFile` calls, or `process.cwd()` file access.

---

## 4. Dry Run Must Remain A Zero-Mutation Contract

The Sprint 6A check runs the Sprint 6 dry-run path against a fake Prisma surface and blocks schema-file reads during execution.

The validated result remains:

- `dryRun=true`;
- `executed=false`;
- `writesPerformed=0`;
- planned creates within Sprint 6 limits;
- all eligibility and activation flags false.

---

## 5. Recommended Process Refinement

Future production-internal persistence sprints should include a deployment-packaging check before the first production dry-run attempt whenever a route imports generated ORM clients or native runtime dependencies.

This should be treated as operational readiness evidence, not as a substitute for dry-run, execute, inspection, idempotency, or rollback verification.

## 6. Validation Scripts Must Not Be Runtime Dependencies

The deployed Sprint 6A dry-run retry moved past the prior `schema.prisma` failure but exposed a new `prisma/migrations` directory scan.

Source review showed `lib/gma/internalMappingReviewQueue.ts` imports from `scripts/checkGmaReadOnlyMappingPreview.js`. That script performs repository validation and scans `prisma/migrations`, which is appropriate for build/check workflows but not for a deployed production route dependency graph.

The next correction should separate reusable deterministic fixture data from validation scripts so deployed admin routes can consume runtime-safe modules without repository file-system scans.
