# Objective-Property Relationship Foundation Wave A V1

## Scope

`20260919020000_objective_property_relationship_foundation_v1` is the first
Product forward migration after the published canonical database baseline. It
adds the canonical, history-preserving relationship from `ClientCaseObjective`
to `ClientCaseProperty`; it does not join directly to `Property` or
`CanonicalPhysicalProperty`.

The relationship supports only `SUBJECT` and `CANDIDATE` roles, with `ACTIVE`
and `ENDED` lifecycle states. A completed relationship is retained as history;
the semantic `end` operation never deletes a relationship, Objective, Case
Property, or canonical Property.

## Integrity

The migration adds composite parent identities on
`ClientCaseObjective(clientCaseId, id)` and
`ClientCaseProperty(clientCaseId, id)`. The relationship references both
identities with restrictive foreign keys, so an Objective and Client Case
Property must belong to the relationship's Client Case at the database layer.

Two bounded PostgreSQL statements remain raw migration SQL because Prisma
5.22 cannot model them in the datamodel:

- `CCOPR_active_objective_property_uq` is a partial unique index on
  `(objectiveId, clientCasePropertyId)` where `status = 'ACTIVE'`. Historical
  `ENDED` rows may coexist, while each pair has at most one current row.
- `CCOPR_status_ended_at_ck` requires `ACTIVE` rows to have no `endedAt` and
  `ENDED` rows to have an `endedAt`.

Both parent references use `ON DELETE RESTRICT`; relationship history blocks
deleting an associated Objective or Client Case Property.

## Service Boundary

`lib/clientCaseObjectivePropertyRelationships.ts` is the only Wave A
server-side boundary. It provides semantic `link` and `end` operations plus
owner-scoped, bounded list methods by Objective, Client Case Property, and
Client Case. Browser-supplied creator, lifecycle, and timestamp fields are
rejected. The service derives `createdBySubject` from the authenticated Agent
subject and returns only lightweight Objective and canonical-property identity
summaries.

No route or UI consumes this service in Wave A. No Buyer, Seller, Investor,
readiness, transaction, output, scenario, or public behavior is added.

## Local Certification

`npm run certify:objective-property-relationship-foundation:local` is guarded
by `ATLAS_BASELINE_LOCAL_MODE=1` and `ATLAS_BASELINE_RESET=1`, and uses only
the approved disposable local baseline databases. It bootstraps the immutable
baseline artifact, records the published historical migration cutoff with
source SHA-256 checksums, then applies the exact forward migration to Path A
and Path B.

The certifier proves Path A/Path B convergence, no backfill, same-Client
foreign-key rejection, active uniqueness, lifecycle checks, history/relink
behavior, parent deletion restrictions, owner scoping, cross-Client denial,
and fixed query count for one-row versus batch relationship reads. It removes
both disposable databases on completion.

Production migration, Production data mutation, publication, push, and
deployment are outside this Wave A authorization.
