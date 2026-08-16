# Larimer County Assessor Conversion Acceptance MVV Certification

Certification ID: CERT-LARIMER-COUNTY-ASSESSOR-CONVERSION-ACCEPTANCE-001

Reviewed date: 2026-08-16

## Scope

This certification accepts `SRC-LARIMER-COUNTY-ASSESSOR` as an exact County Assessor source for the existing Public Record and County Source Quality conversion contracts.

## Certified Mapping

- Source ID: `SRC-LARIMER-COUNTY-ASSESSOR`
- Conversion class: `COUNTY_ASSESSOR`
- Public Record contract: exact allowlist and class map only
- County contract: exact allowlist, class map, and synthetic certification-reference conversion request only

## Exclusions

No wildcard, provider aggregate, Public Data Center alias, GIS/map alias, Treasurer alias, Recorder alias, Planning/Zoning alias, Public Trustee alias, parcel search alias, or source-quality inheritance path is accepted.

## Posture

Conversion acceptance creates deterministic structured evidence conversion eligibility only. It does not create source activation, retrieval, scraping, download, public search, Public Data Center automation, customer display, legal-use approval, rights verification, access readiness, freshness verification, attribution resolution, or provenance completion.

## Protected Boundaries

No provider call, Public Data Center download, CORA request, API/GIS query, raw property/person data, database write, schema change, Search/Typesense mutation, queue/worker activation, email/CRM action, deployment, or production configuration change is authorized or performed by this certification.
