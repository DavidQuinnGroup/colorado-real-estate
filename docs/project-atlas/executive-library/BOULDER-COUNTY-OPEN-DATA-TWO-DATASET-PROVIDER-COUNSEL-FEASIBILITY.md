# Boulder County Open Data Two-Dataset Provider/Counsel Feasibility

Status: `BOULDER_COUNTY_OPEN_DATA_TWO_DATASET_FEASIBILITY_READY_FOR_PROVIDER_COUNSEL_CONFIRMATION`

Scope: research, feasibility, and governance only. This is not legal advice and does not authorize provider contact, account creation, credentials, API use, download, scraping, acquisition, persistence, mapping, or customer display.

## 1. Overall Disposition

`READY_FOR_PROVIDER_COUNSEL_CONFIRMATION`

The existing activation gate, inventory, rights matrix, and first-activation boundary support exactly two candidates for a decision-ready provider/counsel package: `BCOD-ADDRESS-POINTS` and `BCOD-PARK-BOUNDARIES`. Neither is approved for activation.

## 2. Dataset Feasibility

| Item | BCOD-ADDRESS-POINTS | BCOD-PARK-BOUNDARIES |
| --- | --- | --- |
| Canonical provider | Boulder County Assessor GIS / Boulder County Open Data | Boulder County Parks and Open Space / Boulder County Open Data |
| Dataset identity | Address Points; catalog item `687530b74ad54686a98f50337574596f` | Boulder County Parks and Open Space Park Boundaries; catalog item `ffbeca86d075420cafc960bba6e5d4e8` |
| Intended REIE use | Internal address/city normalization and bounded aggregate local context | Internal community/open-space context only |
| Geographic scope | Boulder County | Boulder County parks and open-space boundaries |
| Needed categories | City, postal city, ZIP, and only counsel-approved normalization attributes | Park identity/type and only approved contextual fields |
| Explicitly unnecessary/prohibited fields | Full address, parcel number, account number, tax district, coordinates, owner/person-level data, raw record display | Property-description details unless approved; raw geometry display, ownership/easement inference, hazard/safety/desirability claims |
| Rights posture | Catalog record indicates CC-BY-4.0; storage, transformation, aggregation, and display remain unapproved | Custom license/disclaimer; storage, transformation, aggregation, and display remain unapproved |
| Attribution | Confirm exact attribution, license text, and derivative-use requirements | Confirm required attribution plus approximate-boundary/disclaimer wording |
| Retention/caching | Counsel/provider must define minimization, retention, refresh, deletion, and any cache limits | Counsel/provider must define retention, cache, geometry/version treatment, and supersession |
| Freshness/access | Confirm publisher update cadence, metadata versioning, access/rate limits, and acquisition method | Confirm boundary update cadence, effective/retired treatment, access/rate limits, and export/service terms |
| Provenance | Use existing GIS provider/source identity, immutable version, licensing, permitted-use, freshness, lineage, conflict, and supersession contracts | Same existing evidence/provenance contract; geometry/approximation limitations must remain explicit |
| Public/customer posture | Internal-only until separate customer-display, privacy, and public-claim authorization | Internal-only until separate customer-display, GIS, and disclaimer authorization |
| Classification | A. `READY_FOR_PROVIDER_COUNSEL_CONFIRMATION` | A. `READY_FOR_PROVIDER_COUNSEL_CONFIRMATION` |

## 3. Common Counsel/Provider Questions

1. Confirm controlling terms, catalog/item-license precedence, attribution text, derivative/transformation rights, aggregation rights, redistribution restrictions, and display restrictions.
2. Confirm access method, rate limits, authentication requirements, acceptable caching, retention, refresh expectations, deprecation/withdrawal handling, and version metadata.
3. Confirm exact field minimization. Address Points must exclude full-address, parcel, account, tax, owner/person-level, and precise-coordinate data unless a later specific authorization approves them.
4. Confirm Park Boundaries may not support ownership, easement, access, closure, safety, recreation-quality, or desirability conclusions without separately approved evidence and public copy.
5. Confirm a future additive evidence store, no-write acquisition adapter, and public display each require their own authorization.

## 4. Guardrails

No owner-level intelligence, property-level scoring, neighborhood ranking, steering, safety/hazard conclusion, commute conclusion, public GIS layer, customer-visible record, or source acquisition is within this package. The Editorial Separation Principle remains in force: editorial local context cannot become governed fact without source, rights, provenance, and approval.
