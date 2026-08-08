# REIE BCOD Decision and Market/AEO Wave 2 Readiness

Status: `REIE_MARKET_AEO_WAVE_1_CLOSED_BCOD_DECISION_PACKET_READY_MARKET_AEO_WAVE_2_READINESS_RECONCILED`

Date: 2026-08-08

## Scope and boundary

This record reconciles two post-Wave-1 decisions against canonical `origin/main` at
`7d42cb0a59cd26e7842d118b5e8f05f985ebdba1`:

1. the smallest provider/counsel decision packet for the two certified Boulder County Open Data candidates; and
2. readiness for the next Market/AEO implementation wave.

No provider was contacted, no dataset records were acquired or queried, no credentials or accounts were used, and no runtime or protected-system change was made. The Executive HQ production-state declaration `REIE_MARKET_AEO_MULTI_CITY_WAVE_PRODUCTION_CERTIFIED` is accepted for planning; the canonical handoff text still describes the implementation as locally certified and should be reconciled by the next governance update.

## Workstream A — BCOD unresolved-question classification

The exact candidates remain:

- `BCOD-ADDRESS-POINTS` — Boulder County Address Points, catalog item `687530b74ad54686a98f50337574596f`.
- `BCOD-PARK-BOUNDARIES` — Boulder County Parks and Open Space Park Boundaries, catalog item `ffbeca86d075420cafc960bba6e5d4e8`.

| Question area | Address Points | Park Boundaries | Classification |
| --- | --- | --- | --- |
| Catalog-level public license, attribution, no-endorsement and disclaimer posture | Confirmed at catalog level | Confirmed at catalog level | A — authoritative provider documentation |
| Dataset identity, item ID, intended minimal fields and prohibited fields | Recorded in the canonical package | Recorded in the canonical package | B — technically resolvable without provider contact |
| Exact item-level controlling terms and exceptions | Unresolved | Unresolved; custom-license posture is material | C — provider confirmation |
| Internal acquisition, transformation, retention/cache and refresh rights | Unresolved at item level | Unresolved at item level | C — provider confirmation |
| Legal sufficiency of normalized/aggregate derivative use and disclaimer boundaries | Requires interpretation | Requires interpretation, especially for geometry-derived context | D — counsel interpretation |
| Whether to authorize acquisition, persistence, retrieval, derived intelligence, display or production activation | Not a provider fact | Not a provider fact | E — Executive HQ product decision |
| Owner/person, parcel/account/tax, precise-coordinate, raw-geometry, scoring, suitability and customer-visible raw-source use | Outside the bounded use | Outside the bounded use | F — not needed for current bounded use |
| Rate limits, credentials, version/deprecation and retirement mechanics | Item/service-specific details unresolved | Item/service-specific details unresolved | C — provider confirmation |

Catalog-level facts are not acceptance of item terms or legal approval. The provider's public Open Data and Terms pages describe a general public-use license, attribution/no-endorsement expectations, and no warranty of accuracy or suitability; the exact item/service terms still control the decision packet ([Open Data](https://bouldercounty.gov/government/open-data/), [Terms of Use](https://bouldercounty.gov/government/open-data/terms-of-use/)).

### Address Points decision

**`PROVIDER_CONFIRMATION_REQUIRED_FIRST`** for the minimal internal-only use of city/postal/ZIP normalization. The public catalog facts support continued feasibility, but do not establish the exact item-level rights for acquisition, internal retention/cache, transformed aggregates, refresh, access, or field handling. Counsel interpretation follows provider confirmation; no acquisition is authorized.

### Park Boundaries decision

**`PROVIDER_CONFIRMATION_REQUIRED_FIRST`**, with counsel interpretation expected immediately after confirmation. The unresolved custom-license/disclaimer and geometry/derived-context posture is a direct blocker even for bounded internal community/open-space context. No geometry acquisition, rendering, or customer display is authorized.

### Minimum human decision packet

Provider questions:

1. For each exact catalog item, what item-level license, disclaimer, service terms, attribution, and no-endorsement text controls if it differs from the catalog-level terms? This blocks both datasets; the Park item is the higher-risk case.
2. Does the intended bounded internal use permit acquisition, transformation, internal retention/cache, and refresh of minimized outputs: city/postal/ZIP normalization for Address Points and bounded internal open-space context for Park Boundaries? This blocks both datasets.
3. What are the required access/rate, credential, version/deprecation, retirement, refresh, attribution, and (for Park) geometry/display constraints? This blocks acquisition and any later adapter design for both datasets.

Counsel questions:

1. After item terms are confirmed, is minimized internal normalized/aggregate Address Points use legally supportable without raw full-address, coordinate, owner/person, parcel, account, tax, scoring, suitability, or customer display? This blocks Address Points acquisition and derived-use authorization.
2. After item terms are confirmed, what retention, disclaimer, geometry-generalization, and derived-context boundaries are required for Park Boundaries, and does the custom license permit any internal transformed context? This blocks Park acquisition and any later display/derived-use gate.

Executive HQ questions:

1. Approve only the bounded use cases above, contingent on provider and counsel answers.
2. Separately authorize each later gate—acquisition, persistence, internal retrieval, derived intelligence, customer display/map rendering, and production activation. Provider/counsel confirmation must not be treated as authorization for any of them.

## Workstream B — Market/AEO Wave 2 readiness

Wave 1 is accepted as production-certified and closed by Executive HQ for Boulder, Louisville, Lafayette, Denver, and Longmont. Those routes are not reopened. The existing generalized contract in `lib/marketAeoPilot.ts` is reusable: source, geography, period, freshness, limitation, claim eligibility, visible answer, and FAQ/schema alignment are already separated from route configuration. The deterministic Wave 1 check also proves allowlist containment and non-target preservation.

Older Broomfield/Superior factory records are superseded for route/maturity by the later Local Decision Intelligence closure records. Erie and Westminster are likewise already certified and closed for LDI Wave 3; Market/AEO is an additive presentation/evidence-contract layer and must not modify LDI.

### Broomfield

**`READY_FOR_WAVE_2_IMPLEMENTATION`** with route-level source/freshness qualification. The older `FOUNDATION` record and missing-domain notes are superseded by the current `ENHANCED_FOUNDATION` LDI closure. The implementation must preserve explicit limitations where source completeness is not evidence-complete and must not silently promote old factory fields to eligible claims.

### Superior

**`READY_FOR_WAVE_2_IMPLEMENTATION`** only through the generalized contract's fail-closed treatment. The current LDI closure resolves route activation and preserves sensitive rebuilding, hazard, insurance, environmental, structural, drainage, soil, and property-condition boundaries. The older aging/boundary-conflict evidence remains relevant as a limitation: Wave 2 must use an explicit freshness/conflict state (not a hardcoded `CURRENT` assertion) and suppress claims where geography or period is unresolved.

### Erie

**`READY_FOR_WAVE_2_IMPLEMENTATION`** as an additive route presentation layer. Preserve the certified LDI Wave 3 closure, existing evidence boundaries, and no new intelligence inference.

### Westminster

**`READY_FOR_WAVE_2_IMPLEMENTATION`** as an additive route presentation layer. Preserve the certified LDI Wave 3 closure, existing evidence boundaries, and no new intelligence inference.

### Wave 2 decision

**`FOUR_CITY_WAVE_READY`** — Broomfield, Superior, Erie, and Westminster can form one bounded implementation wave. The wave is safe only if route-specific source/freshness/limitation configuration is added to the generalized contract and the deterministic check proves fail-closed behavior for conflict, aging, unavailable, or ineligible evidence. This is an implementation requirement, not permission to implement in this cycle.

### Wave 2 implementation design (future authorization)

- Target allowlist: `broomfield-co-housing-market`, `superior-co-housing-market`, `erie-co-housing-market`, `westminster-co-housing-market`.
- Shared surface: generalize `lib/marketAeoPilot.ts` configuration so freshness can be `CURRENT`, `AGING`, or `UNKNOWN`, with explicit conflict and limitation fields; retain the existing visible-answer/FAQ/schema contract.
- Route surface: `app/market/[city]/page.tsx` allowlist and route-specific market/AEO configuration only.
- Deterministic check: extend `scripts/checkMarketAeoMultiCityWave.ts` (or a successor) for the four target routes, exact claim eligibility, freshness/period text, conflict fail-closed behavior, FAQ/schema mirroring, and non-target containment.
- Certification: static checks, typecheck/build, representative public-route smoke, desktop/tablet/mobile review, and explicit regression checks for all Wave 1 routes.
- Protected boundaries: no BCOD data, new providers, scraping, persistence/schema, Property Inquiry, Contact, CRM/email, telemetry, profiling, valuation, suitability, or predictive claims.

## Wave 1 closure and next gate

The useful next-state governance is `REIE_MARKET_AEO_WAVE_1_CLOSED_BCOD_DECISION_PACKET_READY_MARKET_AEO_WAVE_2_READINESS_RECONCILED`; no ceremonial duplicate closure record is needed. The next gates are:

1. provider confirmation, then counsel interpretation, for the two BCOD items;
2. separate Executive HQ authorization for any BCOD acquisition or activation stage;
3. a bounded Market/AEO Wave 2 implementation authorization for the four-city allowlist;
4. later production verification/certification authorization after implementation.
