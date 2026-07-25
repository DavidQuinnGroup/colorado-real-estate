# PROJECT ATLAS(tm)

## Enterprise Implementation Program(tm) - Sprint 6 Lessons Learned

Status: `EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT_IN_PROGRESS`

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
