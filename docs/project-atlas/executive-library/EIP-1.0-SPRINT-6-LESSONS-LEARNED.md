# PROJECT ATLAS(tm)

## Enterprise Implementation Program(tm) - Sprint 6 Lessons Learned

Status: `EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT_CERTIFIED_AND_CLOSED`

Implementation date: July 25, 2026

---

## 1. Production Persistence Is A Separate Gate

Sprint 6 is the first EIP sprint where governed knowledge may enter production infrastructure.

That does not make the knowledge active, customer-visible, searchable, mappable, indexable, or usable by property intelligence.

---

## 2. Schema Discipline Matters

The existing GIO schema can store the minimum internal pilot object, source, aliases, observations, and eligibility defaults.

It cannot directly store every approval reference as first-class columns. The correct Sprint 6 response is to use supported observation metadata and governed documentation, not to create an unapproved schema expansion.

---

## 3. Idempotency Is Product Safety

A production-internal pilot must be safe to run twice.

The Sprint 6 implementation uses stable governed identity, source, alias, observation, and eligibility keys so repeated execution reuses existing rows instead of duplicating knowledge.

---

## 4. Internal-Only Must Be Visible In The Data

The pilot keeps the object `INTERNAL_ONLY`, the lifecycle `DRAFT`, and every eligibility flag false.

That makes the internal boundary inspectable in production data instead of relying only on documentation.

---

## 5. Recommended Next Step

Sprint 7 should remain internal.

The next valuable scope is a production-internal GIO inspection and governance read model that retrieves the persisted pilot row, source, observations, eligibility, and lineage without exposing it to search, maps, property pages, SEO, indexing, analytics, AI, or customers.

## 6. Deployment Gates Must Be Treated As Operational Evidence

Sprint 6 confirmed that a locally valid internal persistence workflow can still fail at the deployed route boundary.

The first production dry run returned HTTP `500` before any write was executed. The correct response was to stop before execute, harden the route to return catchable JSON errors, push the correction, and wait for deployment success before retrying.

After route hardening deployed, the production dry run returned the catchable JSON error `ENOENT: no such file or directory, open 'prisma/schema.prisma'`. That isolates the remaining blocker to deployed Prisma schema packaging/configuration, not to the governed Thornton data plan.

This reinforces the program rule that production persistence requires deployed-route evidence, not only local validation.

## 7. Generated ORM Runtime Assets Need Packaging Evidence

Sprint 6A confirmed that the route and pilot module did not read `schema.prisma`; the missing file came from Prisma Client's deployed node runtime packaging requirement.

The correction is intentionally route-scoped to the protected admin route and does not introduce a general repository-file access pattern.

## 8. Runtime Fixture Dependencies Must Not Import Validation Scripts

Sprint 6A.1 confirmed that protected runtime code can inherit deployment-only failures from validation scripts even when the protected route itself is clean.

The production dry run failed on `prisma/migrations` because runtime code imported a GMA checker that scanned repository migration files at module load. The correction moved deterministic GMA preview fixtures into `lib/gma/readOnlyMappingPreviewFixtures.ts` and kept repository/migration validation inside `scripts/`.

The durable lesson is that reusable fixtures belong in runtime-safe libraries; validation scripts may consume those fixtures, but runtime libraries must not consume validation scripts.

## 9. Authenticated Dry Run Is The Execute Gate

Sprint 6A.1 deployment was successful, but the first retry returned HTTP `401`. Treating that as an authentication blocker, not a packaging or persistence failure, prevented unauthorized credential guessing and preserved the controlled execute gate.

The later authenticated dry run `EIP-S6-DRY-20260725-005` returned HTTP `200`, `success=true`, `dryRun=true`, `executed=false`, and `writesPerformed=0`, proving the deployed route was ready before the controlled execute.

## 10. Idempotency Is Not Optional After A Production Write

The controlled execute created exactly the authorized internal pilot rows. The idempotency execute then reused the canonical object `cms10utak0002qa0l8mu7gr8i` with `writesPerformed=0`.

That second execute is what converts a one-time successful write into a governed persistence pattern.

## 11. Customer Invisibility Must Be Proved After Persistence

The final public-runtime smoke confirmed `/`, `/grand-plan`, `/search`, `/contact`, and `/api/search?limit=5` returned HTTP `200`, search continued using its existing database-backed governed runtime behavior, and the pilot did not activate search, maps, property pages, SEO, indexing, analytics, AI, or customer eligibility.

Sprint 6 therefore proved production-internal persistence without customer activation.
