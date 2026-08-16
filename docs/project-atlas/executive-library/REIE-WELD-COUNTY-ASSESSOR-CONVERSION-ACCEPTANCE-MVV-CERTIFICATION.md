# Weld County Assessor Conversion Acceptance MVV Certification

Certification ID: CERT-WELD-COUNTY-ASSESSOR-CONVERSION-ACCEPTANCE-001

Reviewed date: 2026-08-16

## Scope

This certification accepts `SRC-WELD-COUNTY-ASSESSOR` as an exact County Assessor source for the existing Public Record and County Source Quality conversion contracts.

## Certified Mapping

- Source ID: `SRC-WELD-COUNTY-ASSESSOR`
- Conversion class: `COUNTY_ASSESSOR`
- Public Record contract: exact allowlist and class map only
- County contract: exact allowlist, class map, and synthetic certification-reference conversion request only

## Exclusions

No wildcard, provider aggregate, Data Download alias, Property Card alias, Property Map alias, Property Data Search alias, Sales Explorer alias, Treasurer alias, Recorder alias, permits/records alias, GIS alias, EXP alias, or SRA alias is accepted.

## Posture

Conversion acceptance creates deterministic structured evidence conversion eligibility only. It does not create source activation, retrieval, scraping, download, public search, customer display, legal-use approval, rights verification, access readiness, freshness verification, attribution resolution, or provenance completion.

## Protected Boundaries

No provider call, Data Download, Property Card access, Property Map access, Sales Explorer access, property search, CORA request, API/GIS query, raw property/person data, database write, schema change, Search/Typesense mutation, queue/worker activation, email/CRM action, deployment, or production configuration change is authorized or performed by this certification.
