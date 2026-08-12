# REIE LightBox 2,000-Call Test Matrix

Program: `REIE_LIGHTBOX_COLORADO_PROPERTY_PUBLIC_RECORD_TRIAL_EVALUATION_PROTOCOL`

Date: 2026-08-12

Status: `CALL_BUDGET_AND_TEST_MATRIX_PLANNING_ONLY`

No LightBox account, key, API call, integration, data retention, database write, provider activation, or production use is authorized by this matrix.

## Call-Budget Strategy

The goal is not to spend all 2,000 calls. Planned test ceiling is 1,340 calls with 660 reserve calls held through the final days. All endpoint names, chaining assumptions, response fields, pagination, and batch behavior are `PROVIDER_DOC_REQUIRED`.

| Phase | Purpose | Call ceiling | Cumulative ceiling | Reserve remaining | Notes |
| --- | --- | --- | --- | --- | --- |
| Phase A - Endpoint / schema orientation | Understand available endpoint families, required inputs, response shape, errors, metadata, pagination, and whether one property test requires chained calls. | 120 | 120 | 1,880 | Stop early if docs or access are unclear. |
| Phase B - Small representative validation | Test a minimal property panel across core sample types and 3-4 counties. | 240 | 360 | 1,640 | Validate join and schema before broader coverage. |
| Phase C - Cross-county coverage | Expand across required Front Range, mountain, rural, and lower-density counties. | 540 | 900 | 1,100 | Use balanced sampling rather than random calls. |
| Phase D - Edge / conflict cases | Multi-parcel, condos, discrepancies, boundary-adjacent properties, unusual zoning/use, missing records. | 260 | 1,160 | 840 | Prioritize cases that answer whether LightBox reduces manual due diligence. |
| Phase E - Repeatability / freshness | Repeat selected lookups across time, compare metadata, and test deterministic stability. | 180 | 1,340 | 660 | Reserve calls remain available for late provider follow-up. |
| Phase F - Reserved follow-up | Hold for Customer Success clarifications, failed orientation, high-value retests, and unresolved schema questions. | 660 | 2,000 | 0 | Do not spend automatically. |

Arithmetic reconciliation: `120 + 240 + 540 + 260 + 180 + 660 = 2,000`. Recommended planned use before reserve: `1,340`. Minimum reserve target entering Week 3: `>= 660` calls.

## Three-Week Trial Calendar

| Timing | Objective | Exit criteria | Call discipline |
| --- | --- | --- | --- |
| Before activation | Protocol, sample matrix, secure key handling, evaluation tooling, rights questions, Day 1 sequence, and scorecard are approved. | Executive HQ approves activation readiness. | 0 calls. |
| Week 1 Day 1-2 | Endpoint/schema orientation. | Required inputs, response classes, metadata, errors, and field families are understood or blockers logged. | Max 120 calls. |
| Week 1 Day 3-5 | Small representative validation. | MATCH/PARTIAL/AMBIGUOUS/NO_MATCH/CONFLICT taxonomy tested against sample cases. | Max 240 additional calls. |
| Week 2 Day 1-3 | Cross-county coverage. | Required counties and selected rural/mountain/lower-density counties have coverage observations. | Max 360 of Phase C before midpoint review. |
| Week 2 Day 4-5 | Joins, completeness, geographic/zoning evaluation. | Field completeness, jurisdiction, zoning, and joinability findings are documented. | Remaining Phase C calls only if value remains high. |
| Week 3 Day 1-2 | Edge/conflict cases. | Multi-parcel, discrepancy, boundary, condo, acreage, and unusual-use cases tested. | Max 260 calls. |
| Week 3 Day 3 | Repeatability/freshness. | Selected cases retested for stable identifiers, metadata, and response consistency. | Max 180 calls. |
| Week 3 Day 4 | Provider follow-up and commercial/licensing evidence. | Rights, attribution, cost, retention, and production migration questions triaged. | Use reserve only for high-value clarifications. |
| Week 3 Day 5 | Final scoring. | Disposition assigned with evidence, blockers, and recommendation. | Preserve unused reserve. |

## Evaluation Domains And Call Allocation

| Domain | Primary question | Candidate tests | Planned call posture |
| --- | --- | --- | --- |
| Parcel identity | Can LightBox identify the correct parcel/APN and handle multi-parcel conditions? | Address lookup, parcel lookup, ambiguity checks, duplicate detection. | High priority in Phases B-D. |
| Property/public-record facts | Does it add verified non-MLS property attributes? | Compare lot size, building area, year built, property type/use, assessor/tax facts where available. | High priority, field names `PROVIDER_DOC_REQUIRED`. |
| Zoning | Does it supply useful zoning evidence tied to parcels/geography? | Zoning district/code/description/geography and freshness checks. | High priority if endpoint exists. |
| Geographic/spatial | Can parcel polygons, coordinates, jurisdiction IDs, and joins support REIE geographic contracts? | Geometry presence, coordinate agreement, jurisdiction attribution, boundary-adjacent cases. | Medium/high priority. |
| Provenance | Does the provider expose source, freshness, quality, attribution, lineage, or first-party indicators? | Metadata inspection and documentation review. | Must be tested early. |
| Cross-county consistency | Is Colorado coverage stable across county types? | County panel coverage and schema comparison. | Phase C priority. |
| Due-diligence value | Does it reduce manual assessor, parcel, zoning, and verification work? | Score each sample by manual labor reduced, ambiguity, and conflict preservation. | Final scoring output. |

## Colorado Test Panel

| County / jurisdiction | Minimum sample types | Reason |
| --- | --- | --- |
| Boulder | Detached, older property, boundary-adjacent, public-record discrepancy, large lot. | Existing REIE public-record candidates and BCOD blockers. |
| Denver | Condo, small urban lot, older property, recent sale. | Consolidated city/county and dense urban conditions. |
| Broomfield | New construction, townhome, standard detached. | Consolidated city/county and fast-growth suburb. |
| Jefferson | Foothills, older suburban, boundary-adjacent. | Urban/mountain transition. |
| Adams | Fast-growth suburb, agricultural-to-suburban, boundary-adjacent. | Jurisdiction complexity and growth patterns. |
| Weld | Acreage, agricultural/large parcel, multi-jurisdiction. | Large rural/suburban county and multi-parcel risk. |
| Larimer | Urban, foothills/mountain, acreage. | Mixed Front Range and lower-density patterns. |
| Douglas | Newer planned community, large lot, townhome. | Fast-growth and planned-development patterns. |
| El Paso | Urban, suburban, rural. | Large county outside north Denver/Boulder corridor. |
| Mesa | Rural/urban Western Slope. | Non-Front Range coverage check. |
| Summit | Condo, mountain/resort, HOA-sensitive sample. | Resort and mountain complexity. |
| La Plata | Rural/mountain, boundary, acreage. | Lower-density and jurisdiction complexity. |
| Pueblo | Older urban, lower-density, standard detached. | Southern Colorado coverage check. |

## Field / Endpoint Mapping Framework

Actual LightBox endpoint and field names are `PROVIDER_DOC_REQUIRED`. The mapping framework is:

| Candidate field family | LightBox endpoint | LightBox field | REIE concept | Existing REIE source | Overlap vs net-new | Data type | Normalization required | Expected join key | Freshness relevance | Provenance requirement | Permitted-use concern | Customer display relevance | Internal-agent relevance | Conflict handling |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Parcel/APN | PROVIDER_DOC_REQUIRED | PROVIDER_DOC_REQUIRED | Parcel identity | Missing in `Property`; public-record evidence says parcel number missing. | Net-new if reliable. | String | County/APN normalization. | Address, APN, provider property ID. | High. | Source/freshness/authority required. | Storage/display/indexing rights. | Potentially high only after rights. | High. | Preserve ambiguous or multi-parcel cases. |
| Parcel geometry | PROVIDER_DOC_REQUIRED | PROVIDER_DOC_REQUIRED | Parcel geometry | Geographic contracts exist; no active public parcel geometry. | Net-new. | Geometry | Coordinate system and geometry simplification. | APN, provider ID, coordinates. | Medium/high. | Source lineage and date required. | GIS display/transformation rights. | Potentially high. | High. | Geometry conflicts preserved. |
| Situs address | PROVIDER_DOC_REQUIRED | PROVIDER_DOC_REQUIRED | Official property address | Existing listing address. | Verification/overlap. | String | Address parsing and normalization. | Address, APN. | High. | Source identity required. | Display and retention rights. | Medium. | High. | Conflict against listing address. |
| Lot size | PROVIDER_DOC_REQUIRED | PROVIDER_DOC_REQUIRED | Lot-size verification | Existing listing `lotSize`. | Verification/overlap. | Numeric/unit | Unit conversion. | APN/address. | Medium. | Source and effective date. | Derived display rights. | Medium. | High. | Conflict against listing value. |
| Building area | PROVIDER_DOC_REQUIRED | PROVIDER_DOC_REQUIRED | Square footage reconciliation | Existing listing `sqft`. | Verification/overlap. | Numeric/unit | Measurement-type mapping. | APN/address. | Medium. | Source/method required. | Display caveats. | Medium. | High. | Preserve source/method discrepancy. |
| Year built | PROVIDER_DOC_REQUIRED | PROVIDER_DOC_REQUIRED | Year-built verification | Existing listing `yearBuilt`. | Verification/overlap. | Number | None/minor. | APN/address. | Medium. | Source date. | Display rights. | Medium. | High. | Conflict review. |
| Property type/use | PROVIDER_DOC_REQUIRED | PROVIDER_DOC_REQUIRED | Property type/use | Existing listing `propertyType`; legal use not established. | Potential net-new legal-use evidence, not conclusion. | Coded/string | Map provider codes to REIE labels. | APN/address. | Medium. | Source/code list required. | Legal-use conclusion risk. | Low/medium. | High. | Do not infer legal compliance. |
| Ownership-related fields | PROVIDER_DOC_REQUIRED | PROVIDER_DOC_REQUIRED | Ownership where permitted | Not active; owner identity display blocked. | Net-new but high-risk. | String/entity | Privacy and entity normalization. | APN/address. | High. | Source and legal basis required. | Privacy, display, retention, redistribution. | Blocked unless approved. | Potential internal value. | Fail closed. |
| Tax/public-record attributes | PROVIDER_DOC_REQUIRED | PROVIDER_DOC_REQUIRED | Tax/public-record context | Boulder treasurer/tax source blocked. | Net-new if rights permit. | Numeric/date/string | Tax-year and amount normalization. | APN/tax account/address. | High. | Source/freshness required. | Tax advice and display restrictions. | Low/medium. | High. | Do not imply payoff/current tax advice. |
| Zoning district/code | PROVIDER_DOC_REQUIRED | PROVIDER_DOC_REQUIRED | Zoning evidence | Municipal planning is reference-only. | Net-new if parcel-linked. | Coded/string | Jurisdiction-specific code mapping. | APN/geometry/jurisdiction. | High. | Source/effective date required. | Legal-use conclusion risk. | Medium only with caveats. | High. | Do not infer allowed use. |
| Jurisdiction identifiers | PROVIDER_DOC_REQUIRED | PROVIDER_DOC_REQUIRED | County/city/jurisdiction attribution | Listing city and geographic records. | Verification/augmentation. | String/code | FIPS/local ID mapping if present. | Address/APN/coordinates. | Medium. | Source lineage. | Display and derivative rights. | Medium. | High. | Boundary conflicts preserved. |

## Joinability Test Plan

| Join strategy | Test purpose | Match result definitions |
| --- | --- | --- |
| Address | Confirm whether REIE listing address resolves to one provider record. | `MATCH` when one record aligns with address and jurisdiction; `AMBIGUOUS_MATCH` when multiple plausible records; `NO_MATCH` when none. |
| Normalized address | Test casing, unit, directional, suffix, ZIP, and punctuation differences. | `PARTIAL_MATCH` when normalized fields align but raw address or unit differs. |
| Parcel/APN | Test provider parcel identifier stability and uniqueness. | `MATCH` when APN uniquely identifies the same property; `CONFLICT` when APN maps to a different property or geometry. |
| Coordinates | Test spatial proximity to REIE lat/lng and parcel geometry. | `PARTIAL_MATCH` when coordinates fall near but not within expected parcel or jurisdiction. |
| County/jurisdiction identifiers | Test county/city attribution and boundary-adjacent properties. | `CONFLICT` when provider jurisdiction contradicts trusted current source or multiple jurisdictions remain unresolved. |
| Provider-specific property ID | Test repeatability and endpoint chaining. | `MATCH` when stable across repeated calls and linked to the same parcel/address. |

Definitions:

- `MATCH`: one provider result aligns with expected identity, jurisdiction, and key facts with no material unresolved conflict.
- `PARTIAL_MATCH`: identity is likely but at least one material identifier, unit, geometry, or fact needs review.
- `AMBIGUOUS_MATCH`: multiple plausible records or parcel relationships require manual resolution.
- `NO_MATCH`: no provider result can be tied to the sample.
- `CONFLICT`: provider evidence materially disagrees with current trusted evidence and must be preserved for review.

## Data Quality / Completeness Scorecard

Score each domain as `STRONG`, `ADEQUATE`, `WEAK`, `BLOCKED`, or `INSUFFICIENT_EVIDENCE`.

| Metric | Measurement |
| --- | --- |
| Lookup success rate | Share of planned samples with a MATCH or useful PARTIAL_MATCH. |
| Field completeness | Expected field families present by domain and county. |
| Cross-county consistency | Schema and response behavior consistency across test geographies. |
| Freshness | Presence and usefulness of update, effective, publication, retrieval, or confidence metadata. |
| Agreement with trusted current REIE sources | Comparison against existing listing/property/source facts where available. |
| Conflict rate | Frequency and materiality of preserved conflicts. |
| Ambiguous-match rate | Frequency of one-to-many or unclear joins. |
| Schema consistency | Stability of fields, types, nested objects, pagination, and null semantics. |
| Geographic precision | Coordinate, parcel geometry, jurisdiction, and boundary usefulness. |
| Zoning usefulness | Parcel-linked zoning code/district/description/effective posture if available. |
| Recoverability | Provider behavior when evidence is unavailable, ambiguous, missing, or unauthorized. |

## Rights And Safety Stop Conditions

Stop or pause the trial evaluation if any of these occur:

- Provider terms prohibit the intended evaluation or retention.
- API key handling is not approved.
- Endpoint behavior would require production database writes or public display.
- Call burn rate threatens Week 3 reserve without clear information gain.
- Owner, privacy, legal, tax, lending, appraisal, valuation, protected-class, or fair-housing risk cannot be bounded.
- Provider output lacks enough provenance to support evidence review.
