# PROJECT ATLAS(tm)

## Geographic Mapping Architecture(tm) - GMA 1.0

### Read-Only Mapping Preview(tm)

Status: `GMA_1.0_READ_ONLY_MAPPING_PREVIEW_CERTIFIED_AND_CLOSED`

Preview date: July 25, 2026

Repository baseline: `b14a3fce88e11d38c8162b151eff8dff40f732a8`

Preview scope: deterministic read-only mapping proposals only

Runtime activation status: `NOT_AUTHORIZED`

Production persistence status: `NOT_AUTHORIZED`

Canonical selection status: `NO_FINAL_CANONICAL_SELECTION`

Customer activation status: `NOT_AUTHORIZED`

---

## 1. Executive Summary

GMA 1.0 Read-Only Mapping Preview applies the approved GMA mapping rules to existing repository geographic assets and produces a governed, non-authoritative preview ledger. The preview identifies likely candidates, aliases, duplicates, conflicts, editorial-only assets, deferred records, and human-review requirements without creating GIO mappings.

The preview remains intentionally conservative:

- No Prisma schema change.
- No migration.
- No database write.
- No GIO table population.
- No production seed.
- No property assignment.
- No existing geographic data mutation.
- No runtime integration.
- No search, map, route, page, SEO, Typesense, MLS, CRM, alert, email, or customer behavior change.
- No vendor connection, scraping, or AI-assisted mapping.

Certification recommendation:

- `GMA_1.0_READ_ONLY_MAPPING_PREVIEW_CERTIFIED_AND_CLOSED`

Recommended next authorization:

- `GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE`

That next authorization should remain non-production and should convert this preview into an executive review queue, not production persistence.

---

## 2. Preview Methodology

Evidence sources reviewed:

- `lib/cities.ts`
- `lib/neighborhoods.ts`
- `lib/neighborhoodPolygons.ts`
- `lib/marketData.ts`
- `data/cities.ts`
- `data/neighborhoods.ts`
- `data/searchPages.ts`
- `data/marketReports.ts`
- `prisma/schema.prisma`
- `app/market/[city]/page.tsx`
- `app/market/[city]/[slug]/page.tsx`
- `app/properties/[id]/page.tsx`
- `app/sitemap.ts`
- `lib/schema/propertySchema.ts`
- `lib/schema/neighborhoodSchema.ts`
- `docs/project-atlas/executive-library/GKM-1.0-GEOGRAPHIC-KNOWLEDGE-MATRIX.md`
- `docs/project-atlas/executive-library/GMA-1.0-GEOGRAPHIC-MAPPING-ARCHITECTURE.md`

Preview rules:

- Only first-scope object types were evaluated: `MUNICIPALITY`, `NEIGHBORHOOD`, `MARKET_AREA`, `ZIP_CODE`, and `SUBDIVISION`.
- No schools, counties, parcels, environmental zones, HOAs, builders, parks, trails, demographic areas, or property-to-GIO assignments were mapped.
- Repository assets were preferred over production database access.
- Production database access was not used.
- Every generated preview record remains `NOT_ELIGIBLE` for activation.
- Editorial material remains separated from factual identity, observations, and relationship outputs.

Deterministic local check:

- `npm run check:gma-read-only-mapping-preview`

The check generated 91 deterministic in-memory preview records and verified no active eligibility, no GMA migration/schema model, and no runtime imports.

---

## 3. Source Inventory

| Source asset | Location | Records or role | Preview use | Persistence posture |
| --- | --- | --- | --- | --- |
| Primary city registry | `lib/cities.ts` | 13 city records | Municipality and market-area candidate review | No persistence |
| Primary neighborhood registry | `lib/neighborhoods.ts` | 22 neighborhood records | Neighborhood candidate review; editorial/risk fields separated | No persistence |
| Legacy city registry | `data/cities.ts` | 12 city records | Alias, duplicate, and conflict input | No persistence |
| Legacy neighborhood registry | `data/neighborhoods.ts` | 2 neighborhood records | Duplicate and alias input; legacy facts deferred | No persistence |
| Neighborhood polygons | `lib/neighborhoodPolygons.ts` | 2 polygon fixtures | Boundary ambiguity and deferral review | No persistence |
| Market data backbone | `lib/marketData.ts` | 3 market records | Market-area and observation-readiness review | No persistence |
| Market reports | `data/marketReports.ts` | 2 dated report fixtures | Deferred market observation review | No persistence |
| Search page registry | `data/searchPages.ts` | 8 city slugs and 28 search intents | Editorial association review | No persistence |
| Property geography fields | `prisma/schema.prisma` | `city`, `state`, `zip`, `lat`, `lng`, `neighborhood`, `subdivision`, `schoolDistrict` | Compatibility review only | No assignment |
| SEO/schema geography | `lib/schema/*`, property and market routes | Place, address, and page metadata | Editorial/factual separation review | No runtime change |
| Sitemap geography | `app/sitemap.ts` | Market/property route discoverability | Page existence review only | No canonical selection |
| GKM findings | GKM executive record | Prior inventory and conflict matrix | Baseline evidence | No mapping execution |

---

## 4. Mapping Preview Ledger

The deterministic checker generated the following preview summary:

| Preview category | Count | Interpretation |
| --- | ---: | --- |
| Total preview records | 91 | In-memory, non-authoritative, non-active preview records only. |
| Exact canonical candidates | 12 | Primary city records without same-name neighborhood conflict. |
| Alias candidates | 11 | Legacy city records matching current primary city names. |
| Duplicate candidates | 2 | Legacy neighborhood records matching primary neighborhood names. |
| Ambiguous object-type candidates | 2 | `Gunbarrel` appears as both city/market registry and neighborhood identity. |
| Editorial-only records | 35 | Search city slugs and search-intent records remain editorial associations only. |
| Deferred records | 4 | Static polygons and dated market reports are not mapping-ready. |
| Manual-review-required records | 25 | Neighborhood and market-area candidates requiring source, boundary, or trust review. |

No preview record is an active GIO mapping. No preview record is final canonical selection.

---

## 5. Municipality Preview

| Source | Finding | Preview disposition |
| --- | --- | --- |
| `lib/cities.ts` | 12 of 13 records are exact first-party canonical candidates for future review. | `EXACT_CANONICAL_CANDIDATE` |
| `lib/cities.ts` Gunbarrel | Same name appears in neighborhood registry and polygon fixture. | `AMBIGUOUS_OBJECT_TYPE`, `MANUAL_REVIEW_REQUIRED` |
| `data/cities.ts` | 11 records match primary city names and can become alias/duplicate review inputs. | `ALIAS_CANDIDATE`, `DUPLICATE_CANDIDATE` |
| `data/cities.ts` Superior | Legacy city not present in primary city registry but present in search city registry and neighborhoods. | `MANUAL_REVIEW_REQUIRED` |
| `data/searchPages.ts` | Search city slugs are SEO/search-intent assets, not canonical evidence. | `EDITORIAL_ASSOCIATION_ONLY` |

No final municipality identity was selected.

---

## 6. Neighborhood Preview

| Source | Finding | Preview disposition |
| --- | --- | --- |
| `lib/neighborhoods.ts` | 21 neighborhood records are candidate identities but require boundary and source review. | `MANUAL_REVIEW_REQUIRED` |
| `lib/neighborhoods.ts` Gunbarrel | Same name as city registry entry and polygon fixture. | `AMBIGUOUS_OBJECT_TYPE` |
| `data/neighborhoods.ts` Mapleton Hill and North Boulder | Duplicate legacy records with prices, descriptions, and coordinates. | `DUPLICATE_CANDIDATE` |
| `lib/neighborhoods.ts` lifestyle/risk/construction fields | Valuable editorial/restricted context, not facts or observations. | `EDITORIAL_ASSOCIATION_ONLY` or review-restricted |
| `lib/neighborhoodPolygons.ts` | Approximate geometry with no source, precision, or effective date. | `DEFERRED` |

No neighborhood boundary, fact, or observation was created.

---

## 7. Market-Area Preview

| Source | Finding | Preview disposition |
| --- | --- | --- |
| `lib/cities.ts` market slugs | City market slugs may inform future market-area aliases but do not prove canonical market identity. | `MANUAL_REVIEW_REQUIRED` |
| `lib/marketData.ts` | Three market records contain static market facts without source IDs, license posture, effective period, or methodology. | `MANUAL_REVIEW_REQUIRED` |
| `data/marketReports.ts` | Two dated Boulder report fixtures lack source and geography definition. | `DEFERRED` |
| Search and market pages | Page existence supports runtime routing only, not canonical identity. | `EDITORIAL_ASSOCIATION_ONLY` |

Market-area and municipality conflation remains a review item.

---

## 8. ZIP-Code Preview

Repository evidence:

- `Property.zip` in Prisma.
- Search and Typesense ZIP fields.
- Property structured data address output.
- MLS normalization of postal code values.

Preview finding:

- ZIP values are represented as property/search attributes, not as a standalone ZIP registry.
- No ZIP preview records were generated from production data because database discovery was unnecessary for this first preview and property-to-GIO assignments are prohibited.

Disposition:

- `DEFERRED`
- Future read-only aggregate ZIP preview may be authorized separately using counts only, no customer or property-detail extraction.

---

## 9. Subdivision Preview

Repository evidence:

- `Property.subdivision` in Prisma.
- MLS normalization from `SubdivisionName`, `Subdivision`, or `SubArea`.
- Search and Typesense subdivision fields.

Preview finding:

- Subdivision values exist only through property/listing strings and search fields.
- No subdivision preview records were generated from production data because property assignment and production-data mapping are prohibited.

Disposition:

- `DEFERRED`
- Future preview requires read-only aggregate discovery, license review, and duplicate-name safeguards across municipalities.

---

## 10. Alias Candidates

| Alias candidate source | Candidate count | Target posture | Notes |
| --- | ---: | --- | --- |
| Legacy city records matching primary city names | 11 | `ALIAS_CANDIDATE` | Use as alias/county-review input only. |
| City market slugs | 13 | `SOURCE_SPECIFIC_ALIAS` candidate | Slugs may support market-area aliases, not legal identity. |
| Search city slugs | 8 | `EDITORIAL_ASSOCIATION_ONLY` | Runtime/search page existence does not prove canonical identity. |
| Legacy neighborhoods | 2 | Alias/duplicate candidate | Price, description, and coordinates remain deferred. |

No alias was inserted into `GeographicAlias`.

---

## 11. Duplicate Register

| Duplicate candidate | Sources | Type | Required review |
| --- | --- | --- | --- |
| Boulder | `lib/cities.ts`, `data/cities.ts`, `data/searchPages.ts` | Registry duplicate / editorial route overlap | Municipality source verification and alias policy. |
| Louisville | `lib/cities.ts`, `data/cities.ts`, `data/searchPages.ts` | Registry duplicate / editorial route overlap | Municipality source verification and alias policy. |
| Lafayette | `lib/cities.ts`, `data/cities.ts`, `data/searchPages.ts` | Registry duplicate / editorial route overlap | Municipality source verification and alias policy. |
| Broomfield | `lib/cities.ts`, `data/cities.ts`, `data/searchPages.ts` | Registry duplicate / editorial route overlap | Municipality source verification and alias policy. |
| Erie | `lib/cities.ts`, `data/cities.ts`, `data/searchPages.ts` | Registry duplicate / editorial route overlap | Municipality source verification and alias policy. |
| Longmont | `lib/cities.ts`, `data/cities.ts`, `data/searchPages.ts` | Registry duplicate / editorial route overlap | Municipality source verification and alias policy. |
| Westminster | `lib/cities.ts`, `data/cities.ts`, `data/searchPages.ts` | Registry duplicate / editorial route overlap | Municipality source verification and alias policy. |
| Brighton | `lib/cities.ts`, `data/cities.ts` | Registry duplicate | Municipality source verification and alias policy. |
| Firestone | `lib/cities.ts`, `data/cities.ts` | Registry duplicate | Municipality source verification and alias policy. |
| Frederick | `lib/cities.ts`, `data/cities.ts` | Registry duplicate | Municipality source verification and alias policy. |
| Niwot | `lib/cities.ts`, `data/cities.ts` | Registry duplicate | Determine whether municipality, unincorporated/community, or alias target is appropriate. |
| Mapleton Hill | `lib/neighborhoods.ts`, `data/neighborhoods.ts`, `lib/neighborhoodPolygons.ts` | Neighborhood duplicate plus geometry fixture | Boundary/source review; legacy factual values deferred. |
| North Boulder | `lib/neighborhoods.ts`, `data/neighborhoods.ts` | Neighborhood duplicate | Boundary/source review; legacy factual values deferred. |

No duplicate was merged.

---

## 12. Conflict Register

| Conflict | Evidence | Preview disposition |
| --- | --- | --- |
| Gunbarrel as municipality/market/neighborhood | `lib/cities.ts`, `lib/neighborhoods.ts`, `lib/neighborhoodPolygons.ts` | `AMBIGUOUS_OBJECT_TYPE`, manual review required |
| Superior missing from primary city registry but present in legacy/search/neighborhood contexts | `data/cities.ts`, `data/searchPages.ts`, `lib/neighborhoods.ts` | `MANUAL_REVIEW_REQUIRED` |
| Niwot municipality assumption | `lib/cities.ts`, `data/cities.ts` | Requires authoritative verification before canonical selection |
| Market-area and municipality conflation | `lib/cities.ts` market slugs and city records | Separate market-area identity review required |
| Neighborhood and subdivision conflation risk | `Property.neighborhood`, `Property.subdivision`, neighborhood registry | Defer property-driven mapping |
| Static polygons versus factual boundaries | `lib/neighborhoodPolygons.ts` | Defer; no spatial resolution authorized |
| Market facts without source/method | `lib/marketData.ts`, `data/marketReports.ts` | Manual review or deferred observation mapping |
| Runtime page existence as identity evidence | market routes, sitemap, search pages | Editorial association only |

No conflict was resolved by this preview.

---

## 13. Editorial-Association Register

Editorial-only assets:

- Search intent records in `data/searchPages.ts`.
- City search slugs when used for SEO/search intent.
- Neighborhood lifestyle copy in `lib/neighborhoods.ts`.
- Community descriptions in legacy neighborhood fixtures.
- Page existence from market routes, sitemap, and structured-data output.
- Market-page copy and property-page local context.

Governance conclusion:

- Editorial city or neighborhood text did not become object identity automatically.
- Community descriptions did not become observations.
- Lifestyle claims did not become factual geographic attributes.
- Runtime page existence did not prove canonical identity.
- Frequently repeated names did not become authoritative.
- Editorial-only entries remain `EDITORIAL_ASSOCIATION_ONLY`.

---

## 14. Human-Review Queue

| Issue | Affected source assets | Ambiguity type | Evidence available | Evidence required | Recommended reviewer action | Risk | Disposition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Gunbarrel object type | `lib/cities.ts`, `lib/neighborhoods.ts`, `lib/neighborhoodPolygons.ts` | Same-name/different-type | Local registry and polygon fixture | Legal/admin, postal, MLS, and local usage evidence | Decide whether municipality, neighborhood, market area, alias, or multiple objects | High | `MANUAL_REVIEW_REQUIRED` |
| Superior registry mismatch | `data/cities.ts`, `data/searchPages.ts`, `lib/neighborhoods.ts` | Static/runtime registry conflict | Legacy/search/neighborhood references | Primary registry decision and legal/admin source | Decide whether to add to future primary candidate set or keep editorial/search only | Medium | `MANUAL_REVIEW_REQUIRED` |
| Niwot canonical type | `lib/cities.ts`, `data/cities.ts` | Municipality/community ambiguity | Local city registries | Legal/admin and postal source | Determine correct object type and alias posture | Medium | `MANUAL_REVIEW_REQUIRED` |
| Legacy neighborhood facts | `data/neighborhoods.ts` | Source ambiguity | Price, description, coordinates | Source, effective period, methodology, boundary | Retire, defer, or reclassify as editorial/observation candidates | Medium | `DUPLICATE_CANDIDATE` |
| Static polygons | `lib/neighborhoodPolygons.ts` | Boundary ambiguity | Approximate coordinate rectangles | Authoritative or reviewed boundary source, precision, effective date | Reject, replace, or keep as non-governed fixture | High | `DEFERRED` |
| Market facts | `lib/marketData.ts`, `data/marketReports.ts` | Source/method ambiguity | Static market metrics | MLS/stat source, license, period, method, schema key | Keep deferred until observation governance is ready | High | `MANUAL_REVIEW_REQUIRED` |
| Property geography strings | Prisma property fields, MLS normalization | Licensed/source ambiguity | Field definitions and normalization logic | Read-only aggregate preview authorization and license review | Do not backfill; plan aggregate-only preview later | High | `DEFERRED` |

---

## 15. Unresolved And Deferred Register

| Deferred area | Reason | Next safe action |
| --- | --- | --- |
| ZIP code candidates | No standalone repository ZIP registry; production data not needed for first preview | Later aggregate-only read preview if authorized |
| Subdivision candidates | Values are property/MLS strings; property assignment prohibited | Later aggregate-only read preview after license review |
| Property-to-GIO relationships | Property assignment explicitly unauthorized | Keep out of preview execution |
| Static polygons | Spatial resolution not authorized and source metadata absent | Replace or reject after boundary source review |
| Market observations | Source, license, period, methodology, and schema keys missing | Keep manual review queue |
| Schools, counties, parcels, environmental zones, HOAs, builders, parks, trails, demographics | Outside initial object scope | Separate trust and object-scope authorization |
| AI-assisted proposals | Explicitly deferred | No action |

---

## 16. Readiness Assessment

| Capability | Readiness | Reason |
| --- | --- | --- |
| Read-only preview ledger | Ready | Deterministic local checker passes with 91 non-active preview records. |
| Internal review queue | Ready for next authorization | Human-review issues are identified without persistence. |
| Internal mapping execution | Not authorized | Preview is non-persistent and non-final. |
| GIO persistence | Not authorized | No canonical selection, source registry, or review approval. |
| Property assignment | Not authorized | Property strings remain untouched. |
| Search/map/runtime activation | Not authorized | Runtime isolation verified. |
| Customer presentation | Not authorized | No public eligibility exists. |

---

## 17. Recommended Smallest Internal Mapping Scope

The smallest next internal scope should be:

1. Human-review queue only.
2. First-scope object types only: `MUNICIPALITY`, `NEIGHBORHOOD`, `MARKET_AREA`, `ZIP_CODE`, `SUBDIVISION`.
3. No production persistence.
4. No property relationship assignment.
5. No final canonical selection.
6. No runtime import.
7. Review decisions limited to candidate disposition: approve for later fixture, defer, reject, alias-only, or editorial-only.

Recommended next authorization:

- `GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE`

---

## 18. Explicit Exclusions

This preview did not authorize or perform:

- Prisma changes.
- Migrations.
- Database writes.
- GIO population.
- Production seeds.
- Property assignments.
- Existing geographic data mutation.
- Runtime integrations.
- Search, map, route, page, SEO, Typesense, MLS, CRM, alert, email, or customer behavior changes.
- Vendor connections.
- Scraping.
- AI-assisted mapping.
- Final canonical selections.
- Duplicate merges.
- Public or customer-facing activation.

---

## 19. Executive Recommendation

GMA 1.0 Read-Only Mapping Preview satisfies the approved non-persistent preview scope.

Executive certification recommendation:

- `GMA_1.0_READ_ONLY_MAPPING_PREVIEW_CERTIFIED_AND_CLOSED`

Recommended next authorization:

- `GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE`

Stop condition:

- Do not begin persistence, property assignment, canonical production selection, or runtime activation without a separate executive authorization.
