# PROJECT ATLAS(tm)

## Enterprise Implementation Program(tm) - Sprint 6A.1

### Lessons Learned

Status: `IMPLEMENTED_PENDING_DEPLOYED_DRY_RUN_EVIDENCE`

Date: July 25, 2026

---

## 1. Runtime Must Not Depend On Validation Scripts

The deployed `prisma/migrations` blocker showed that validation scripts can contain correct repository safety checks while still being unsafe as runtime dependencies.

Permanent rule:

`RUNTIME_MODULES_MUST_NOT_IMPORT_VALIDATION_SCRIPTS`

Scripts may import runtime-safe `lib/` contracts. Runtime modules may not import `scripts/` or `dist/scripts/`.

---

## 2. Fixture Contracts Need Runtime-Safe Ownership

The GMA read-only preview records are reused by internal EIP fixture/readiness modules. That makes them part of the internal runtime dependency graph even though they are non-customer-facing.

Reusable fixture contracts now belong in `lib/gma/readOnlyMappingPreviewFixtures.ts`.

Validation-specific assertions remain in `scripts/checkGmaReadOnlyMappingPreview.ts`.

---

## 3. Deployment Packaging Bugs Can Reveal Import Architecture Issues

Sprint 6A corrected the Prisma schema packaging artifact. The next deployed dry run then surfaced a separate architectural dependency issue: runtime path import of a checker that scans migration files.

The useful distinction:

- packaging issue: required runtime artifact missing from deployed bundle;
- dependency issue: runtime imported code that should only execute during repository validation.

Both need independent checks.

---

## 4. Safety Checks Should Prove The Full Protected Route Graph

Source string checks are useful but insufficient alone. Sprint 6A.1 adds a runtime dependency graph proof that imports and builds the Sprint 6 plan while blocking repository Prisma schema and migration filesystem access.

This creates a stronger deployment-readiness signal before production retry.

---

## 5. Production Execute Discipline Remains Correct

Both deployed blockers occurred before controlled execute. Because the workflow required dry-run success first, production GIO writes remained `0`.

The stop condition remains correct:

- no dry-run success;
- no execute;
- no mutation.

---

## 6. Recommended Future Refinement

Future EIP safety packages should include a generic repository rule:

- runtime roots cannot import `scripts/`;
- validation scripts can import `lib/`;
- reusable fixtures used by runtime or internal route graphs must live under runtime-safe `lib/` modules;
- validation-time repository scans must remain in scripts.

This should become a standard pre-deployment check for internal enterprise route work.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/EIP-1.0-SPRINT-6A-1-LESSONS-LEARNED.md -->
