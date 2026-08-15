# PROJECT ATLAS(TM) - Source Quality Summary Assembly MVV Certification

## Certification

The Source Quality Summary Assembly MVV is locally certified as a pure deterministic assembly layer.

It answers only: where do supplied reviewed `SourceQualityReviewSummary` inputs come from?

## Scope

The certified assembly path is:

1. Explicit reviewed source entries.
2. `normalizeSourceEvidence(...)`.
3. `summarizeSourceQuality(...)`.
4. `SourceQualityReviewSummary[]`.

The assembly layer outputs summaries plus bounded assembly metadata. The summaries are directly consumable by `composeSourceQualityReport(...)` without a report contract change.

## Input Authority

Source inclusion is explicit only. Source Registry presence alone does not imply inclusion.

The assembly request accepts a finite structured request with:

- `schemaVersion`
- `assemblyId`
- `coverageClass`
- `entries`
- optional controlled certification reference

Each entry contains a canonical source id, controlled inclusion posture, and explicit `SourceEvidenceLinkageRecord`-compatible linkages.

## Coverage Semantics

The certified coverage classes are:

- `SUPPLIED_MANIFEST_ONLY`
- `PARTIAL_REVIEWED_SOURCE_SET`
- `NO_COMPLETENESS_CLAIM`

No assembly output claims statewide completeness, all-county coverage, all-provider coverage, production readiness, or missing-source discovery.

## Firewalls

The assembly MVV does not authorize:

- source activation
- Source Registry mutation
- rights grant
- customer-display authority
- Search mutation
- Typesense mutation
- ingestion
- alerts
- email or communications
- deployment

## Protected Boundaries

The runtime contract has no dependency on Prisma, database access, provider calls, county calls, credential retrieval, filesystem discovery, filesystem parsing, routes, UI, CRM, workers, queues, email, Search, Typesense, or protected county artifacts.

Narrative county/provider evidence remains non-composable unless separately reviewed and converted into structured canonical-compatible records.

## Determinism

Assembly output is sorted by canonical source id. Input order does not affect summary order or assembly fingerprint.

The assembly fingerprint is derived from canonicalized request metadata, explicit entries, canonical normalization outputs, canonical summary outputs, and coverage posture. It does not use current time, random IDs, or runtime environment state.

## Fixture Certification

The dedicated checker covers:

- one explicit valid source
- multiple explicit sources
- deterministic source-id ordering
- input-order independence
- valid linkage
- unknown, pending, and restricted rights
- technical access unknown
- stale freshness
- attribution unknown
- incomplete provenance
- missing certification
- canonical conflict preservation
- sparse supplied source set
- explicit no-completeness claim
- duplicate source id fail-closed behavior
- unknown source id canonical failure propagation
- malformed evidence bundle fail-closed behavior
- narrative evidence rejection
- provider-name, county-name, filename, URL, semantic, and fuzzy discovery rejection
- protected county artifact absence from runtime
- provider narrative not parsed
- canonical normalization and summary calls
- direct report handoff compatibility
- deterministic assembly fingerprint
- changed source evidence changing fingerprint
- no activation authority
- no customer-display authority
- no DB, Prisma, provider, network, route, UI, Search, Typesense, CRM, filesystem discovery, or persistence dependency

## Final Classification

`SOURCE_QUALITY_SUMMARY_ASSEMBLY_MVV_IMPLEMENTED_AND_LOCALLY_CERTIFIED`

## Next Gate

`READY_FOR_SOURCE_QUALITY_SUMMARY_ASSEMBLY_CANONICAL_SYNCHRONIZATION_REVIEW`
