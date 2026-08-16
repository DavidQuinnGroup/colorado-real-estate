# REIE Boulder County Recorder Index Conversion Support MVV Certification

## Scope

This MVV adds exact Source Quality conversion support for:

- `SRC-BOULDER-COUNTY-RECORDER-INDEX`
- `COUNTY_RECORDED_DOCUMENT_INDEX`

The source depends on the canonical Recorder Registry identity established at `12da85e48eb758feaaf34a4b4525592997333f31`.

## Public Record Core support

Public Record Structured Evidence Conversion Core now accepts only the exact Recorder source ID paired with `COUNTY_RECORDED_DOCUMENT_INDEX`.

The class means recorded-document index, search, and verification metadata only. It does not mean document image, scanned instrument, OCR, full-text document, certified-copy, or document-content provider support.

## County specialization support

County Structured Evidence Conversion now exposes the same finite class and exact source mapping. The County wrapper continues to delegate to Public Record Conversion Core and does not duplicate conversion logic.

## Firewalls

`EXP-SRC-BOULDER-COUNTY-RECORDER`, `SRA-BOULDER-COUNTY-RECORDER`, generic Recorder identifiers, and foreign source/class pairings are rejected.

`RESTRICTED_OR_UNREVIEWED` is supported for Recorder requests. Certification-only conversion preserves `RIGHTS = UNKNOWN`, `TECHNICAL ACCESS = UNKNOWN`, `FRESHNESS = UNKNOWN`, `ATTRIBUTION = UNKNOWN`, and `PROVENANCE = UNKNOWN / INCOMPLETE`. Fee remains unasserted.

Public-record or government-source status does not imply rights, technical readiness, automated extraction, redistribution, freshness, completeness, legal use, or customer display.

## Non-activation

This MVV does not create Recorder Source Quality evidence, a Human-Reviewed finding, Operational Manifest inclusion, source activation, retrieval, scraping, document-content authority, customer-display authority, legal-use approval, route/UI behavior, DB/CRM behavior, Search/Typesense mutation, worker/queue behavior, or deployment.

## Determinism

Identical structured Recorder conversion requests produce stable input fingerprints, conversion fingerprints, linkage output, normalization output, control summaries, and assembly behavior.

## Evidence basis

The implementation used repository-local structured architecture only. No external research, Recorder portal access, correspondence, protected county artifact, PDF, provider credentials, raw Recorder data, PII, document image, document text, or customer/person record was accessed.
