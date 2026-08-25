# PROJECT ATLAS - Advanced Property Segmentation & Geography Admission Review

Status: `ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW_CERTIFIED`

Certification date: 2026-08-25

Starting repository truth:
- branch: `main`
- HEAD: `0747d0557c7cea67e79f1d8a6caa544d0424efaa`
- origin/main: `0747d0557c7cea67e79f1d8a6caa544d0424efaa`
- divergence: `0 behind / 0 ahead`
- working tree before review: clean
- prior certified gate: `READY_FOR_ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW`

## 1. Current Filter Architecture Audit

The current Agent cohort filter architecture is listing-grain, current-snapshot, Agent-only, and intentionally narrow.

Repository evidence:
- `lib/agentCohortBuilder.ts` admits `city`, `propertyType`, `statusScope`, `priceMin`, `priceMax`, `bedsMin`, `bathsMin`, `sqftMin`, `sqftMax`, `yearBuiltMin`, and `yearBuiltMax`.
- `lib/agentCohortCount.ts` converts the normalized cohort definition into Prisma predicates for current `Property` rows.
- `lib/agentCohortAggregation.ts` admits count plus price, bedrooms, bathrooms, listed square feet, and year-built summary metrics.
- `lib/agentCurrentCompetingListingContext.ts` reuses the cohort count and aggregation foundation for subject listing context, with subject exclusion by `mlsId`.

The architecture does not yet contain a single filter registry that separates field presence, operator admissibility, user surface tier, rights posture, geography posture, and metric admissibility. That registry is recommended before more filters are added.

## 2. Current Geography Audit

Current admitted Agent cohort geography is the six-city quick-filter allowlist:

| Geography | Current admission |
| --- | --- |
| Boulder | `ADMITTED_NOW` |
| Louisville | `ADMITTED_NOW` |
| Lafayette | `ADMITTED_NOW` |
| Superior | `ADMITTED_NOW` |
| Erie | `ADMITTED_NOW` |
| Longmont | `ADMITTED_NOW` |

The repository also contains broader source-geography evidence, but it is not activation authority:
- `lib/iresCityIdEvidence.ts` records `IRE_CityID` as an IRES local non-standard field, source-specific, not reconciled to ATLAS geography, with activation false.
- `lib/gio/persistence.ts` and GIO checks preserve `mapEligible: false` and `marketAnalytics: false` for governed objects unless separately authorized.
- `lib/gkc/fixtureGovernance.ts` recognizes object types including municipality, neighborhood, market area, ZIP code, and subdivision, but fixture governance is not runtime geography admission.

## 3. Complete Field Inventory

Current `Property` fields relevant to this review:

| Field | Schema state | Mapper evidence | Current filter state |
| --- | --- | --- | --- |
| `city` | required string | city normalization | admitted quick filter for six cities only |
| `zip` | required string | ZIP normalization | not admitted in runtime filters |
| `price` | required int | `ListPrice`, `CurrentPrice`, `price` | admitted min/max |
| `beds` | nullable float | `BedroomsTotal`, `BedsTotal`, `beds` | admitted min only |
| `baths` | nullable float | bathroom total or full/half/three-quarter/quarter composition | admitted min only |
| `sqft` | nullable int | living/building/above-grade fields | admitted min/max |
| `lotSize` | nullable float | acres or square-feet converted to acres | not admitted |
| `yearBuilt` | nullable int | `YearBuilt`, `EffectiveYearBuilt` | admitted min/max |
| `propertyType` | required string | `PropertyType` or `PropertySubType` fallback | admitted only as `Residential` |
| `status` | required string | `StandardStatus`, `MlsStatus`, `Status` | admitted only as `Active` scope |
| `neighborhood` | nullable string | `Neighborhood`, `MLSAreaMajor`, `Area` | not admitted |
| `subdivision` | nullable string | `SubdivisionName`, `Subdivision`, `SubArea` | not admitted |
| `schoolDistrict` | nullable string | high/elementary/school district fields | not admitted |
| `description` | nullable string | public remarks/description | not admitted |
| `listingAgent` | nullable string | listing agent fields | not admitted |
| `listingOffice` | nullable string | schema only; observed coverage zero in live read-only probe | not admitted |
| `lat` / `lng` | required floats | coordinate fields | search-map display/search behavior only; not comparative segmentation |
| `photos` | relation | media sync pipeline | not admitted as cohort filter |
| `openHouses` | relation | event relation | not admitted as cohort filter |
| `priceHistory` | relation | price history relation | not admitted for this current-snapshot package |

Absent normalized fields include property subtype, garage spaces, parking type, HOA amount/status, basement, architectural style, construction/new-construction state, builder, zoning, water/sewer/utilities, individual school names, pool, fireplace, view, accessibility, units, ownership/distressed flags, county, MLS area/subarea as governed fields, radius, and polygon.

## 4. Live Read-Only Coverage Snapshot

The authorized read-only coverage probe counted repository `Property` rows only. It did not write, call providers, mutate Supabase, mutate MLS, export data, or print secrets.

| Measurement | Count |
| --- | ---: |
| all `Property` rows | 75,490 |
| `Active` rows | 13,114 |
| `Active` + `Residential` rows | 12,006 |

Field population across all `Property` rows:

| Field | Populated count |
| --- | ---: |
| `propertyType` | 75,490 |
| `status` | 75,490 |
| `city` | 75,490 |
| `zip` | 75,490 |
| `price` | 75,490 |
| `beds` | 75,490 |
| `baths` | 75,490 |
| `sqft` | 73,777 |
| `lotSize` | 63,195 |
| `yearBuilt` | 69,715 |
| `neighborhood` | 71,388 |
| `subdivision` | 71,312 |
| `schoolDistrict` | 71,110 |
| `description` | 74,692 |
| `listingAgent` | 71,388 |
| `listingOffice` | 0 |
| `sourceModifiedAt` | 60,848 |

Top observed cities in the listing projection include Denver, Aurora, Littleton, Parker, Castle Rock, Colorado Springs, Arvada, Thornton, Lakewood, Centennial, Highlands Ranch, Fort Collins, Commerce City, Broomfield, Brighton, Boulder, Westminster, Longmont, Erie, Loveland, Golden, Englewood, Greeley, Evergreen, Windsor, Elizabeth, Johnstown, Castle Pines, Monument, and Morrison. This proves repository data breadth, not geography admission.

Top observed ZIPs include `80134`, `80016`, `80022`, `80104`, `80015`, `80108`, `80602`, `80013`, `80504`, `80516`, `80126`, `80127`, `80018`, `80601`, `80125`, `80014`, `80123`, `80211`, `80550`, `80238`, `80109`, `80019`, `80020`, `80138`, `80439`, `80128`, `80107`, `80122`, `80112`, and `80401`. This proves field coverage, not ZIP geography activation.

## 5. Per-Field Evidence Matrix

| Field | Exists | Populated | Semantic status | Rights status | Admission |
| --- | --- | --- | --- | --- | --- |
| `city` | yes | complete | admitted for six-city quick filter only | Agent-only current listing use | `ADMITTED_NOW_LIMITED` |
| `zip` | yes | complete | postal string clear enough for bounded listing filter | Agent-only current listing use; geography activation blocked | `READY_AFTER_SMALL_LOCAL_FOUNDATION` |
| `price` | yes | complete | current asking/list price | Agent-only current listing use | `ADMITTED_NOW` |
| `beds` | yes | complete | numeric bedroom count | Agent-only current listing use | `READY_FOR_OPERATOR_EXPANSION` |
| `baths` | yes | complete | fractional bathrooms represented | Agent-only current listing use | `READY_AFTER_DECIMAL_INTERVAL_FIX` |
| `sqft` | yes | high | listed square feet only | Agent-only current listing use | `ADMITTED_NOW` |
| `lotSize` | yes | material | normalized acres from source acres or sqft conversion | Agent-only current listing use | `READY_AFTER_UNIT_LABEL_AND_COVERAGE_POLICY` |
| `yearBuilt` | yes | high | year built/effective year built | Agent-only current listing use | `ADMITTED_NOW` |
| `propertyType` | yes | complete | broad source type only | Agent-only current listing use | `ADMITTED_NOW_RESIDENTIAL_ONLY` |
| property subtype | no separate field | no | conflated with `propertyType` fallback | unresolved | `BLOCKED_BY_FIELD_MODEL` |
| `neighborhood` | yes | high | raw source text, mixed meaning | unresolved geography semantics | `BLOCKED_BY_GEOGRAPHY_GOVERNANCE` |
| `subdivision` | yes | high | raw source text, alias/duplicate risk | unresolved geography semantics | `BLOCKED_BY_GEOGRAPHY_GOVERNANCE` |
| `schoolDistrict` | yes | high | district-level only, no individual schools | fair-housing/source-rights review required | `RIGHTS_BLOCKED` |
| `description` | yes | high | free text/public remarks | fair-housing/text-use review required | `RIGHTS_BLOCKED` |
| `listingAgent` | yes | high | professional/entity reporting | rights/audience/denominator review required | `RIGHTS_BLOCKED` |
| `listingOffice` | yes | zero observed | no operational coverage | rights/audience/coverage blocked | `DATA_BLOCKED` |
| `lat` / `lng` | yes | required | coordinate point only | map/radius/polygon use not admitted | `GEOGRAPHY_BLOCKED` |

## 6. Per-Field Admission Matrix

| Field group | Quick filter | Advanced property filter | Expert / MLS filter | Excluded |
| --- | --- | --- | --- | --- |
| city six-city allowlist | yes | no | no | no |
| active residential scope | yes | no | no | no |
| price min/max | yes | no | no | no |
| beds min/max/exact | min currently; max/exact next | yes | no | no |
| baths min/max/exact | min currently; max/exact next after decimal fix | yes | no | no |
| sqft min/max | yes | yes | no | no |
| year built min/max | yes | yes | no | no |
| lot acreage min/max | no | yes after unit/coverage policy | no | no |
| ZIP exact/multi-select | no | yes after local foundation | no | no |
| property subtype | no | no | future only after separated field taxonomy | currently blocked |
| neighborhood/subdivision | no | no | future only after governed geography mapping | currently blocked |
| county/MLS area/radius/polygon | no | no | future only after geography governance | currently blocked |
| garage/parking/HOA/style/basement/construction/zoning/utilities | no | no | no | blocked by field absence |

## 7. Per-Field Filter-Operator Matrix

| Field | Operators admitted now | Operators ready next | Operators blocked |
| --- | --- | --- | --- |
| `city` | equals one of six allowed values | none without city-set authorization | arbitrary city/source ID |
| `zip` | none | equals, multi-select | radius, polygon, market-area inference |
| `price` | min, max, closed range | half-open preset bands through existing interval contract | valuation/recommendation |
| `beds` | min | max, exact, closed/half-open range | nonnumeric bedroom categories |
| `baths` | min | max, exact, closed/half-open range after decimal preservation | integer-rounded bathroom exactness |
| `sqft` | min, max, closed range | half-open preset bands | above-grade/finished/basement separation |
| `lotSize` | none | min/max acres with explicit null exclusion | lot shape/usability/acreage inference |
| `yearBuilt` | min, max, closed range | half-open preset bands | condition or renovation inference |

## 8. Per-Field Null / Unknown Policy

Null or unknown values must not be coerced to zero, "no", or a negative characteristic. Current aggregation already excludes null metric fields and reports coverage. Next filters must follow the same rule: records with null for a filtered field fail the predicate and the resulting artifact must disclose field coverage.

## 9. Required Specific Findings

Property subtype: blocked. `PropertySubType` is used only as a fallback into broad `propertyType`; there is no separate normalized subtype field or taxonomy.

Bedroom/bathroom expansion: bedrooms are ready for max/exact/range. Bathrooms are high value but require preserving decimal semantics because the current generic interval normalizer floors numbers.

Lot size / acreage: ready after small local foundation. `lotSize` is persisted as acres, including conversion from source square feet, with material coverage. It must be labeled as listing-source lot acreage and cannot become parcel geometry, usable land, or valuation evidence.

Garage / parking: blocked by field absence. No normalized Property fields exist.

HOA: blocked by field absence and rights/source semantics.

Construction / new construction: blocked by field absence. Year built does not prove new-construction status.

Basement / style: blocked by field absence.

Distressed / ownership / listing type: blocked by field absence and source/right semantics.

School: district string exists but individual school filtering and school-based advisories require fair-housing, source-rights, and semantic review.

Zoning: blocked by field absence and likely external public-record source admission.

Water / utility: blocked by field absence and likely external source admission.

Photo / open-house: relations exist, but presence/event filters require separate freshness, media rights, and event-window policy.

Remarks / text: blocked for advanced filters until text-use, fair-housing, and source-rights policy exists.

City / municipality: existing six-city allowlist remains admitted. Additional city data exists, but broader municipality activation requires a city-set/version decision and must not inherit from `IRE_CityID`.

ZIP: ready after small local foundation as a postal-code listing filter, not a canonical geography activation.

County: blocked by field absence on `Property` and by county identity mapping governance.

Subdivision: blocked by raw text semantics and duplicate/alias policy.

ATLAS neighborhood: blocked for filters until governed object relationships are admitted for the relevant surface.

MLS area / subarea: blocked because `neighborhood`/`subdivision` currently receive source area fields as raw fallback text.

Map / polygon / radius: blocked by geography governance; `lat`/`lng` presence is not enough.

## 10. Tier Matrices

Quick filter tier:

| Candidate | Decision |
| --- | --- |
| six-city allowlist | keep |
| `Residential` property type | keep |
| `Active` status scope | keep |
| price min/max | keep |
| beds minimum | keep |
| baths minimum | keep |
| sqft min/max | keep |
| year built min/max | keep |

Advanced property filter tier:

| Candidate | Decision |
| --- | --- |
| bedroom maximum/exact/range | admit next |
| bathroom maximum/exact/range | admit next after decimal-safe interval |
| lot acreage min/max | admit next after explicit unit and coverage policy |
| ZIP exact/multi-select | admit after local foundation |
| photo presence/open-house presence | defer |

Expert / MLS filter tier:

| Candidate | Decision |
| --- | --- |
| property subtype taxonomy | blocked |
| neighborhood/subdivision | blocked |
| MLS area/subarea | blocked |
| school district/schools | rights blocked |
| listing agent/office | rights blocked |
| remarks/text | rights blocked |
| map/radius/polygon | geography blocked |

Control type matrix:

| Control | Use |
| --- | --- |
| single-select | city, property type, status |
| numeric interval | price, beds, baths, sqft, lot acreage, year built |
| multi-select | ZIP after foundation |
| disabled/deferred expert control | neighborhood, subdivision, school, MLS area |
| not shown | absent fields such as garage, HOA, style, basement |

Source-specific filter matrix:

| Source-specific signal | Decision |
| --- | --- |
| `IRE_CityID` | source evidence only; no activation |
| `MLSAreaMajor` / `Area` | raw fallback only; no filter admission |
| `SubdivisionName` / `SubArea` | raw fallback only; no filter admission |
| `PropertySubType` | broad propertyType fallback only; no separate subtype admission |

## 11. Agent Value Matrices

Buyer Preparation value:

| Field | Value | Admission |
| --- | --- | --- |
| max beds/max baths | high | next after operator foundation |
| ZIP | high | next after postal-filter foundation |
| lot acreage | high for some searches | next after unit/coverage policy |
| garage/HOA/basement/style | high | blocked by field absence |

Location Preparation value:

| Geography | Value | Admission |
| --- | --- | --- |
| city | very high | existing six-city scope |
| ZIP | high | bounded postal filter next |
| neighborhood/subdivision | high | blocked by governance |
| radius/polygon | high | blocked by governance |

Market Preparation value:

| Field | Value | Admission |
| --- | --- | --- |
| existing city/current filters | high | admitted |
| additional municipalities | high | requires city-set authorization |
| ZIP | medium/high | filter-only, not metric geography |
| neighborhood/subdivision | high | blocked |

Cohort-N value:

| Field | Value | Admission |
| --- | --- | --- |
| bed/bath ranges | high | ready next |
| lot acreage | medium/high | ready after policy |
| ZIP | high | ready after foundation |
| ungoverned geography | high | blocked |

Current Competing Listing Context value:

| Improvement | Value | Admission |
| --- | --- | --- |
| agent-adjusted max beds/max baths | high | ready next |
| lot acreage interval | high for competing-set quality | ready after policy |
| ZIP exact filter | high | ready after foundation |
| subtype/garage/HOA | high | blocked |

Future subject-benchmark value:

Subject-property benchmarking remains blocked until physical-property grain, identity, source-rights, and historical use are reconciled. Current listing segmentation cannot become CMA, valuation, pricing recommendation, or sold-comparable analysis.

## 12. Cross-Surface Reuse Ranking

1. Current Competing Listing Context: highest immediate benefit from tighter current competing cohorts.
2. Buyer Preparation: high manual-labor replacement from max beds, max baths, lot acreage, and ZIP filters.
3. Cohort-N comparisons: benefits from consistent filter registry and interval semantics.
4. Location Preparation: benefits from ZIP and later governed geography.
5. Market Preparation: needs city-set/geography versioning before broader municipality admission.
6. Seller/Listings/Property subject benchmark: blocked by grain and historical evidence requirements.

## 13. Priority Sets

`PRIORITY_1_FIELD_SET`:
- `bedsMax`
- `bathsMax`
- `bedsExact`
- `bathsExact`
- `lotSizeMin`
- `lotSizeMax`

`PRIORITY_2_FIELD_SET`:
- `zip`
- additional city allowlist expansion after city-set version decision
- photo presence and open-house presence after rights/freshness policy

`PRIORITY_3_EXPERT_FUTURE_SET`:
- subtype
- neighborhood
- subdivision
- MLS area/subarea
- school
- listing agent/office
- remarks/text
- map/radius/polygon

`SEMANTICS_BLOCKED_SET`:
- subtype
- neighborhood
- subdivision
- MLS area/subarea
- status beyond Active
- new construction inferred from year built

`RIGHTS_BLOCKED_SET`:
- school
- listing agent
- listing office
- remarks/text
- photos/open-house presentation beyond existing surfaces

`DATA_BLOCKED_SET`:
- garage
- parking
- HOA
- basement
- style
- construction/new construction
- builder
- zoning
- water/sewer/utilities
- individual schools
- county

## 14. Current Competing Listing Context Improvement Finding

Wave 6 materially improves Agent work by comparing a subject current listing against a default or adjusted current active listing cohort. Its biggest next accuracy gain is not broad MLS-field expansion; it is safer segmentation of the existing cohort using max/exact bed/bath, lot acreage, and eventually ZIP. Subtype, garage, HOA, basement, school, neighborhood, and polygon controls would create false precision under the current schema and governance state.

## 15. Default Cohort Impact Finding

The current default cohort uses city, property type, and status. That is intentionally broad. Adding Priority 1 fields should remain Agent-adjusted, not automatic default narrowing, unless a later subject-derived defaulting policy proves that the subject fields are populated, comparable, and not overfitting.

## 16. Filter Registry Recommendation

Add a reusable admitted-filter registry before runtime expansion. The registry should encode:
- field key;
- source schema field;
- allowed operators;
- unit and decimal policy;
- null policy;
- surface tier;
- metric aggregation eligibility;
- geography state;
- rights/audience state;
- allowed surfaces;
- blocked reason code;
- provenance references.

## 17. Expert Filter Foundation Recommendation

Do not expose Expert/MLS filters until the registry can mark a field as present-but-blocked, source-specific, rights-blocked, or geography-blocked. Expert controls should be allowed to show deferred state only if they do not execute queries and do not imply field availability.

## 18. Implementation Readiness

Per-field implementation readiness:

| Field | Readiness |
| --- | --- |
| `bedsMax` / exact beds | `READY_FOR_IMPLEMENTATION` |
| `bathsMax` / exact baths | `READY_AFTER_DECIMAL_SAFE_INTERVAL_UPDATE` |
| `lotSizeMin` / `lotSizeMax` | `READY_AFTER_UNIT_AND_COVERAGE_POLICY` |
| `zip` | `READY_AFTER_POSTAL_FILTER_FOUNDATION` |
| additional municipalities | `READY_AFTER_CITY_SET_VERSION_AUTHORIZATION` |
| subtype | `BLOCKED_BY_FIELD_MODEL` |
| neighborhood/subdivision/MLS area | `BLOCKED_BY_GEOGRAPHY_GOVERNANCE` |
| garage/HOA/basement/style/construction/zoning/water/utilities | `BLOCKED_BY_FIELD_ABSENCE` |
| school/listing agent/remarks | `BLOCKED_BY_RIGHTS_OR_AUDIENCE_POLICY` |

Per-geography implementation readiness:

| Geography | Readiness |
| --- | --- |
| six current cities | `ADMITTED_NOW` |
| ZIP postal filter | `READY_AFTER_SMALL_LOCAL_FOUNDATION` |
| additional municipalities | `READY_AFTER_CITY_SET_VERSION_AUTHORIZATION` |
| county | `BLOCKED_BY_SCHEMA_AND_IDENTITY_MAPPING` |
| subdivision | `BLOCKED_BY_GOVERNED_IDENTITY_REQUIRED` |
| ATLAS neighborhood | `BLOCKED_BY_GOVERNED_RELATIONSHIP_ADMISSION` |
| MLS area/subarea | `BLOCKED_BY_SOURCE_SPECIFIC_SEMANTICS` |
| map/polygon/radius | `BLOCKED_BY_GEOGRAPHY_AND_MAP_GOVERNANCE` |

Geography package decision:

Do not combine broad geography activation with Priority 1 advanced property filters. ZIP can be considered as a bounded postal listing filter in a follow-on or small parallel package, but municipality/geographic-object activation should remain separate.

## 19. Exact Next Implementation Scope

Recommended next gate:

`READY_FOR_ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7`

Exact next implementation field set:
- `bedsMax`
- `bedsExact`
- `bathsMax`
- `bathsExact`
- `lotSizeMin`
- `lotSizeMax`

Exact next implementation geography set:
- none; retain existing six-city quick-filter geography only.

Exact next implementation surface set:
- shared Agent cohort builder/count;
- Current Competing Listing Context Agent-adjusted filters;
- Buyer Preparation adapter mapping for admitted bed/bath range fields only if the existing buyer profile already supplies those bounds;
- Cohort-N compatibility through the same registry, if no new UI/API geography is introduced.

Exact excluded field set:
- subtype, garage, parking, HOA, basement, style, construction, builder, zoning, water/sewer/utilities, school, listing agent, listing office, remarks/text, photo/open-house presence.

Exact excluded geography set:
- ZIP activation, additional municipalities, county, subdivision, ATLAS neighborhood, MLS area/subarea, map, polygon, radius, IRES `IRE_CityID`.

Expected shared file/system scope:
- `lib/agentCohortBuilder.ts`
- `lib/agentCohortCount.ts`
- `lib/agentNumericInterval.ts`
- `lib/agentBuyerCriteriaComparisonAdapter.ts`
- `lib/agentCurrentCompetingListingContext.ts`
- one new inert/admitted filter registry module if authorized
- deterministic checker(s)

Expected validation/runtime proofs:
- current cohort count still works for existing quick filters;
- max/exact bed filters include/exclude deterministic fixtures correctly;
- fractional bathroom filters do not round down;
- lot acreage filters disclose null exclusion and use acres;
- Wave 6 subject exclusion still works;
- blocked fields fail closed with explicit reason codes.

Expected certification target:

`ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7_CERTIFIED`

One primary next gate:

`READY_FOR_ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7`

Why it ranks first:

It improves the already-certified Current Competing Listing Context without activating new geography, new providers, new database schema, public output, historical analysis, or MLS/IRES mutation.

Follow-on sequence:

1. ZIP postal listing filter foundation.
2. Additional municipality city-set version decision.
3. Expert/deferred filter registry states.
4. Governed subdivision/neighborhood/MLS area review.
5. Subject-property benchmark and historical evidence, only after separate authorization.

Secondary parallel recommendation:

No secondary parallel implementation is recommended before Wave 7 unless Executive explicitly chooses ZIP postal filter foundation as a separate documentation-first package.

## 20. Certification State

Certification artifact path:

`docs/project-atlas/executive-library/ADVANCED-PROPERTY-SEGMENTATION-AND-GEOGRAPHY-ADMISSION-REVIEW.md`

Certification state:

`ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW_CERTIFIED`

Protected-system confirmation:
- product implementation: none
- runtime Advanced Filters: none
- Quick Filter expansion: none
- Expert/MLS runtime filters: none
- ZIP activation: none
- additional municipality activation: none
- neighborhood/subdivision/county/MLS area/map/polygon/radius filters: none
- database/schema/provider/MLS/IRES/Supabase/Typesense/CRM/email/secrets changes: none
- public/client/export/deployment changes: none
- historical/sold/CMA/valuation/recommendation changes: none
- destructive Git: none
