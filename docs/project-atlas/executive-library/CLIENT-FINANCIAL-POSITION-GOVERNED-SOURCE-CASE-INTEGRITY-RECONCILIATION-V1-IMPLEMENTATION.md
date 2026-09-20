# Client Financial Position Governed Source Case Integrity Reconciliation V1

## Scope

This bounded reconciliation introduces the canonical Client Case-scoped eligibility association required before admitted Evidence or Professional Input can support a Client Financial Position observation.

## Canonical Model

`ClientCaseGovernedSource` is an immutable association owned by a Client Case and its Agent subject. Its source shape is exactly one of:

- `EVIDENCE`, referencing one canonical `EvidenceAdmission`.
- `PROFESSIONAL_INPUT`, referencing one canonical `ProfessionalInput`.

Composite foreign keys bind the association to the same owner for the Client Case and governed source. A Client Financial Source now references the Case-scoped association identity, not a direct Evidence or Professional Input identifier.

## Eligibility And Access

Association writes require an active, owner-scoped Client Case and a currently eligible canonical source. Eligibility is evaluated from the existing Evidence and Professional Input lifecycle fields, including supersession, effective time, and expiry. An archived Client Case is read-only.

The Case-rooted candidate read returns no more than 100 currently eligible associations with lightweight claim and timing metadata. It excludes admitted values, provenance payloads, documents, and the broader Professional Input graph.

Financial Position provenance accepts only a valid Case-scoped governed-source association. Client-stated, Agent-entered-from-client, and system-derived observations remain source-less where their existing posture permits it.

## Migration And Compatibility

Migration `20260920100000_client_case_governed_source_integrity_v1` is DDL-only. It fail-closes if legacy `ClientFinancialSource` rows exist, preventing unreviewed provenance rewrites. The certified zero-row premise permits retirement of the unused direct source shape without backfill.

No Agent route or Wave B interface imports the Financial Position service. The changed foundation is therefore not reachable by the prior deployed application behavior; it becomes usable only through a future explicitly authorized transport and UI wave.

## Local Certification

The disposable localhost dual-path certification verified:

- Existing-data and fresh-baseline migration paths converge.
- Migration creates zero Client Financial Position and governed-source business rows.
- Case, owner, type, stale-source, and archived-Case rejection hold in the canonical services and database constraints.
- Candidate reads are bounded and do not expose source payloads.
- Observation history, current-state resolution, and source posture validation remain intact.

No Production schema, data, configuration, deployment, source synchronization, or external system was changed.

## Deferred Work

No Wave B editor, ordinary API route, Command Center surface, scenario consumption, buyer/seller/investor use, output use, readiness use, automated association, data migration, backfill, or production migration is included.
