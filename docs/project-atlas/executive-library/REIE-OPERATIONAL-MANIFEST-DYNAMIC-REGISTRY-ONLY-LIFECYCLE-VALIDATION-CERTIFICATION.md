# REIE Operational Manifest Dynamic Registry-Only Lifecycle Validation Certification

Certification ID: CERT-REIE-OPERATIONAL-MANIFEST-DYNAMIC-REGISTRY-ONLY-LIFECYCLE-VALIDATION-001

Reviewed date: 2026-08-16

## Scope

This certification covers the Operational Manifest checker correction that removes the fixed Registry-only source-set assumption.

## Certified Behavior

- Manifest sources must exist exactly once in the Source Registry.
- Manifest source ids remain unique and deterministic.
- Explicit non-operational Registry identities, including `SRC-BOULDER-PERMIT-CANDIDATES`, remain excluded from Operational Manifest.
- Registry-only County Assessor identities may remain outside Manifest only when their canonical Registry posture is:
  - `AUTHORITATIVE_SOURCE`
  - `COUNTY_ASSESSOR`
  - `AWAITING_PROVIDER_CONFIRMATION`
  - `BLOCKED_NOT_AUTHORIZED`
  - `claimEligible=false`
  - exact-source Registry MVV only
- Registry-only status does not create evidence, Manifest eligibility, source activation, customer display, legal-use, retrieval, rights, access, freshness, attribution, or provenance authority.

## Synthetic Proofs

The checker includes deterministic synthetic coverage proving:

- a blocked pre-Manifest County Assessor source is accepted without source-id-specific hardcoding;
- invalid activation is rejected;
- invalid claim posture is rejected;
- an unknown arbitrary Registry-only source is rejected;
- Permit Candidate remains excluded as explicit non-operational context;
- a future County Assessor identity such as Weld does not require another generic lifecycle checker edit.

## Protected Boundaries

No provider call, API call, GIS query, property search, download, scraping, database write, schema change, Search/Typesense mutation, queue/worker activation, email/CRM action, deployment, or production configuration change is authorized or performed by this certification.
