# Larimer County Assessor Operational Manifest Inclusion MVV Certification

Certification ID: CERT-LARIMER-COUNTY-ASSESSOR-OPERATIONAL-MANIFEST-INCLUSION-001

Reviewed date: 2026-08-16

## Scope

This certification includes `SRC-LARIMER-COUNTY-ASSESSOR` in the Source Quality Operational Manifest as a structured evidence source with known gaps.

## Certified Manifest Delta

- Registry count: 18
- Operational Manifest count after inclusion: 17
- Intentional Registry-only source after inclusion: `SRC-BOULDER-PERMIT-CANDIDATES`
- Larimer inclusion class: `STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS`
- Evidence binding: `convertLarimerCountyAssessorSourceQualityEvidence().linkages`
- Certification reference: `CERT-LARIMER-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001`

## Invariants

- Larimer appears exactly once in the Operational Manifest.
- Every Manifest source exists exactly once in the Source Registry.
- Prior Manifest entries are retained.
- Permit Candidate remains excluded.
- Larimer Registry posture remains `AWAITING_PROVIDER_CONFIRMATION`, `BLOCKED_NOT_AUTHORIZED`, and `claimEligible=false`.
- Manifest inclusion does not change the generic Registry-only lifecycle predicate.
- Source Quality evidence remains insufficient / known-gaps by design.

## Protected Boundaries

No source activation, provider call, Public Data Center download, CORA request, API/GIS query, property search, raw property/person data, database write, schema change, Search/Typesense mutation, queue/worker activation, email/CRM action, deployment, or production configuration change is authorized or performed by this certification.
