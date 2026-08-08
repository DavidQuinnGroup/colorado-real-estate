# Boulder County Open Data Provider/Counsel Confirmation Package

Status: `BOULDER_OPEN_DATA_PROVIDER_COUNSEL_CONFIRMATION_PREPARATION_COMPLETE`

Scope: provider/counsel confirmation preparation only

Not authorized: provider contact, account creation, credentials, terms acceptance, acquisition, download, API use, scraping, persistence, mapping, customer display, production connection, owner/person-level intelligence, or legal conclusions.

## 1. Executive Disposition

The exact two-dataset Lane 1 package is prepared for a later provider/counsel confirmation decision:

- `BCOD-ADDRESS-POINTS` — Boulder County Address Points, catalog item `687530b74ad54686a98f50337574596f`.
- `BCOD-PARK-BOUNDARIES` — Boulder County Parks and Open Space Park Boundaries, catalog item `ffbeca86d075420cafc960bba6e5d4e8`.

Current classification for both remains `READY_FOR_PROVIDER_COUNSEL_CONFIRMATION`. Neither dataset is approved for acquisition or use.

## 2. First-Party Provider Documentation Reviewed

- Boulder County Open Data: https://bouldercounty.gov/government/open-data/
- Open Data Definition: https://bouldercounty.gov/government/open-data/definition/
- Open Data Terms of Use: https://bouldercounty.gov/government/open-data/terms-of-use/
- Open Data Portal: https://opendata-bouldercounty.hub.arcgis.com/

Boulder County describes the catalog as a public-access catalog for County Government datasets and lists parcels, zoning, property information, open space, and trails among available categories. Its catalog page states a worldwide, royalty-free, non-exclusive license for lawful use, modification, and distribution, with Creative Commons Attribution 4.0 applying unless a dataset is noted otherwise. The terms require attribution without implying County endorsement and disclaim accuracy, completeness, reliability, and suitability.

Those are catalog-level provider statements, not dataset-specific legal clearance. The repository rights matrix records Address Points as a CC-BY-4.0 record and Park Boundaries as a custom-license/disclaimer record. Dataset-specific terms therefore remain confirmation items.

No provider account, credential, API call, dataset download, restricted preview, terms acceptance, or provider contact occurred.

## 3. Address Points Confirmation Package

### Intended boundary

Potential future internal use is limited to city/postal/ZIP normalization and separately approved aggregate geographic context. No raw source record or owner/person intelligence is in scope.

### Confirmation questions

1. What exact item-level license and terms control over the catalog-level CC-BY statement for item `687530b74ad54686a98f50337574596f`?
2. Is internal normalization permitted, and may normalized city/postal/ZIP aggregates be retained?
3. Are derivative, transformed, aggregated, cached, or internally indexed outputs permitted? Under what attribution and retention conditions?
4. What attribution text, locator, version, and no-endorsement language are required?
5. Is redistribution or customer display of any raw or derived address, coordinate, parcel, account, tax-district, or property-linked field permitted? The working presumption is no.
6. What refresh cadence, deprecation/withdrawal signal, version identifier, cache duration, and deletion obligation apply?
7. What access method and rate limits apply, and is an account or API credential required for any future approved acquisition?
8. Which fields must be excluded for privacy minimization? Working exclusions are `FULL_ADDRESS`, `PARCEL_NUMBER`, `ACCOUNT_NUMBER`, `TAX_DIST_MUNI`, precise coordinates, owner/person data, and any property-level scoring input.

### Classification

`READY_FOR_PROVIDER_COUNSEL_CONFIRMATION`

## 4. Park Boundaries Confirmation Package

### Intended boundary

Potential future internal use is limited to bounded community/open-space context. No raw customer-visible GIS geometry is in scope.

### Confirmation questions

1. What exact item-level license, disclaimer, and geometry/display terms control over item `ffbeca86d075420cafc960bba6e5d4e8`?
2. Does the custom-license posture permit internal storage, transformation, aggregation, caching, and future derived context?
3. Are raw geometries, generalized geometries, screenshots, tiles, or customer-visible map display permitted? The working presumption is no pending confirmation.
4. What attribution, approximate-boundary, source, effective-date, and no-endorsement language is required?
5. How are closures, boundary revisions, retirements, and supersessions communicated?
6. What update cadence, version identifier, cache/retention limit, access method, and rate limits apply?
7. May any field support ownership, easement, access, closure, safety, recreation quality, desirability, suitability, or property-specific inference? The working presumption is no.
8. Are there partner, acquisition, or display restrictions beyond the County catalog terms?

### Classification

`READY_FOR_PROVIDER_COUNSEL_CONFIRMATION`

## 5. Counsel Decision Matrix

| Question / statement | Category | Current treatment |
| --- | --- | --- |
| County catalog is intended to increase public access to County Government datasets. | A — provider fact | Confirmed by official Open Data page. |
| Catalog-level terms describe lawful use, modification, and distribution with attribution unless a dataset is noted otherwise. | A — provider fact | Confirmed by official Open Data page and Terms of Use; dataset exception still controls. |
| Attribution must not imply Boulder County endorsement; County disclaims accuracy, completeness, reliability, and suitability. | A — provider fact | Confirmed by official Terms of Use. |
| Address Points item identity, authority, representative fields, and CC-BY record. | B — technical/repository fact | Confirmed by repository inventory and rights matrix; item-level terms still require provider confirmation. |
| Park Boundaries item identity, authority, representative fields, and custom-license record. | B — technical/repository fact | Confirmed by repository inventory and rights matrix; custom terms require provider confirmation. |
| Whether CC-BY or custom item terms permit REIE storage, transformation, aggregation, caching, retention, redistribution, or display. | C — legal interpretation / D — provider confirmation | Unresolved; no conclusion made. |
| Whether field minimization is legally sufficient for Address Points. | C — legal interpretation | Counsel decision required; working exclusions are stricter than the raw inventory. |
| Whether generalized Park geometry may support any future internal or public use. | C — legal interpretation / D — provider confirmation | Unresolved; no geometry use authorized. |
| Whether a specific internal normalization or aggregate context use is worth activating. | E — Executive HQ product/use-case authorization | Separate decision after rights confirmation; not authorized here. |
| Acquisition, persistence, retrieval, derived intelligence, map rendering, and customer display. | E — Executive HQ authorization | Each remains separately gated even after confirmation. |

## 6. Required Provenance and Governance if Later Authorized

Any later approved work must reuse the GIS evidence/provenance contracts: provider and source identity, dataset/item ID, publisher and originating authority, version/locator, update cadence, acquisition event, immutable evidence version, licensing and permitted-use state, freshness, lineage, conflict, supersession, attribution, and deterministic fingerprint. Unknown rights, missing provenance, stale/expired evidence, and unresolved conflicts must fail closed.

## 7. Activation Gates

Provider/counsel confirmation does not authorize any subsequent stage. Future gates remain separate and ordered:

1. acquisition / no-write adapter;
2. persistence or retention;
3. internal retrieval;
4. derived intelligence or aggregate transformation;
5. customer display;
6. map rendering or GIS integration;
7. production activation.

No Lane 1 artifact may be consumed by the separate Market/AEO lane under this package.

## 8. Final Preparation State

`READY_FOR_BOULDER_COUNTY_OPEN_DATA_PROVIDER_COUNSEL_CONFIRMATION_DECISION`

This state requests the next Executive/provider/counsel decision. It is not legal approval, provider approval, acquisition authority, or product activation authority.
