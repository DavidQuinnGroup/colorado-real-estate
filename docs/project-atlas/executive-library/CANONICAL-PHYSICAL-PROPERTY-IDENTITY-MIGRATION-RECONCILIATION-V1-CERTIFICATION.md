# Canonical Physical Property Identity Migration Reconciliation V1 Certification

## Result

`CANONICAL_PHYSICAL_PROPERTY_IDENTITY_MIGRATION_RECONCILIATION_V1` cleared the migration-order blocker on 2026-08-29. The controlled production Supabase target accepted, in Prisma order:

1. `20260824000000_add_canonical_physical_property_identity`
2. `20260829190000_add_output_persistence_foundation`

Both migrations are now recorded as finished and `prisma migrate status` reports that the database schema is up to date. The second migration was already authorized by the prior Output Persistence package and could only be reached through the standard ordered deployment after this predecessor passed its safety gates.

## Repository And Target

- Starting and applied repository SHA: `5e44c2807d43ffa75554f8ca996b50b2c3fde089` on `main`, equal to `origin/main`, with a clean worktree and `git diff --check` passing before the bounded pre-apply comment correction.
- Target: configured controlled production Supabase project `otmkoqvmhthitldlnjdk`, using the repository's Prisma production connection configuration. No connection string, credential, or token is recorded here.
- Migration SQL hashes immediately before deployment: canonical identity `3b2d37d04bf67977229b060fdd2d5d18bd7a8931bc18f30de62d5eed6f8d0f19`; output persistence `d5b420c530f32833758a754f1ca667413e8a84de002d84776a7a85e6b99ff67a`.

The only pre-apply repository edit corrected the predecessor migration's historical comment. It now states its enduring invariant: the migration is additive and intentionally empty, while source population and runtime activation require separate authorization. The executable SQL is otherwise unchanged.

## Migration Inventory And Safety Classification

The predecessor migration is `PURELY_ADDITIVE`:

- Adds `MLS_LISTING` and `SOURCE_PROPERTY_RECORD` enum values to `PropertySourceIdentifierType`.
- Creates seven canonical-identity enums and four empty tables: `CanonicalPhysicalProperty`, `CanonicalPhysicalPropertySourceIdentityMapping`, `CanonicalPhysicalPropertyObservation`, and `CanonicalPropertyListingEvent`.
- Adds indexes, uniqueness constraints, a fuzzy-candidate confirmation check constraint, and restrictive foreign keys.
- Does not alter the legacy `Property` table.
- Contains no `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `DROP`, data copy, or backfill SQL.

The target-schema precheck found none of the four tables, seven predecessor enums, or predecessor migration-history record. There was no partial deployment or baseline-reconciliation condition.

## Domain Reconciliation

The existing `Property` record is a legacy listing-shaped hybrid, not the physical-property root. It has a unique MLS ID, listing status, price, listing facts, and owns `PropertyPhoto`, `PriceHistory`, and `OpenHouse` rows. Existing public routes, Search, Property Preparation, and MLS sync continue using this legacy record.

The new canonical model is intentionally adjacent and unpopulated:

- `CanonicalPhysicalProperty` represents a future durable physical-asset anchor.
- `PropertySourceIdentity` remains the source-specific identity layer.
- `CanonicalPropertyListingEvent` can later associate a legacy listing-shaped `Property` record with a canonical property without replacing either record.
- Unit is an explicit canonical field; no normalized-address merge or unit collapse occurs in this migration.
- Parcel, assessor, county, and jurisdiction identities remain source-observed/reviewable evidence. No county or statewide source activation occurred.

Current identity precedence is not activated or populated. The architecture preserves source-specific identifiers and confidence/basis states rather than inventing a production merge order.

## Target Data Integrity

Read-only aggregate checks before and after migration matched exactly:

| Measure | Before | After |
|---|---:|---:|
| `Property` rows | 75,490 | 75,490 |
| Active `Property` rows | 13,114 | 13,114 |
| Non-active `Property` rows | 62,376 | 62,376 |
| Blank MLS IDs | 0 | 0 |
| Blank addresses | 0 | 0 |
| Canonical-property rows | n/a | 0 |
| Canonical mappings | n/a | 0 |
| Canonical observations | n/a | 0 |
| Canonical listing events | n/a | 0 |

There are 2,414 aggregate duplicate-address groups in the legacy listing-shaped data. They are recorded as a future population concern, not an execution defect: this migration made no merge, correlation, or update decision. Existing `PropertyPhoto`, `PriceHistory`, and `OpenHouse` foreign keys remain unchanged. The new `CanonicalPropertyListingEvent.propertyId` relationship is restrictive and has no rows.

## Object And Compatibility Proof

Post-deployment verification found all four canonical tables and all seven canonical enums. Their restrictive foreign keys and migration indexes are present. The target also contains the seven output-persistence tables, eight output enums, six restrictive output foreign keys, and all six append-only output triggers from the already-authorized successor migration.

MLS sync, Search, public property routing, and Agent Property Preparation do not write or query the new canonical tables. The migration therefore has no runtime adapter requirement and does not widen off-market admission, public display, provider ingestion, or listing URL semantics.

## Boundaries Preserved

No canonical-property population, identity backfill, property merge, MLS/provider call, MLS/provider mutation, off-market activation, Search change, SavedSearch change, CRM mutation, customer-data mutation, financial persistence, delivery, Client Portal activation, or historical-output backfill occurred.

## Validation

- `npx prisma validate`: passed.
- `npm run check:canonical-physical-property-identity`: passed.
- `npx prisma migrate status`: database schema up to date after deployment.
- Post-deploy aggregate and catalog inspection: expected tables, enums, foreign keys, indexes, and output append-only triggers present; legacy counts unchanged.

## Continuation Result

The predecessor migration blocker is cleared. The successor Output Persistence schema migration completed in the same ordered deployment and its authenticated Agent runtime proof subsequently completed. The controlled non-client Seller Brief and Seller Update fixtures persisted, restored across a fresh authenticated browser context, remained idempotent, and rejected an append-only mutation. See [Output Persistence Foundation V1 Certification](./OUTPUT-PERSISTENCE-FOUNDATION-V1-CERTIFICATION.md) for the runtime record and the separate limitation: the existing PDF route remains fixture-based rather than loading a durable `OutputVersion`.
