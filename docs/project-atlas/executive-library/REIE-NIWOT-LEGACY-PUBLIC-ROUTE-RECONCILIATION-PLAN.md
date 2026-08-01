# PROJECT ATLAS(TM) Niwot Legacy Public Route Reconciliation Plan

Status: `NIWOT_LEGACY_PUBLIC_ROUTE_RECONCILIATION_READY_FOR_REMEDIATION_AUTHORIZATION`

Planning date: August 1, 2026

Planning type: legacy public route diagnosis and remediation planning

Runtime remediation authorization: not authorized

Public route removal authorization: not authorized

Redirect authorization: not authorized

Production certification authorization: not authorized

Next authorization gate: `READY_FOR_NIWOT_LEGACY_PUBLIC_ROUTE_REMEDIATION_AUTHORIZATION`

## 1. Executive Summary

Production preservation certification for the Niwot governance-only reconciliation found a legacy public Niwot city-market route:

- `https://davidquinngroup.com/market/niwot-co-housing-market`
- HTTP status: `200`
- title: `Niwot, CO Housing Market Intelligence | David Quinn Group`
- H1: `Niwot Market Context`
- canonical: `https://davidquinngroup.com/market/niwot-co-housing-market`

Repository history shows this route predates the Niwot governance-only reconciliation. It was introduced by the dynamic city-market architecture and `lib/cities.ts` city-style Niwot market slug, not by the Niwot governance implementation.

The current authoritative Niwot governance posture conflicts with the route:

- canonical internal identity: `unincorporated-community:boulder-county:niwot`
- object type: `UNINCORPORATED_COMMUNITY`
- public activation: `NOT_ACTIVATED`
- route eligibility: `BLOCKED`
- registry public eligibility: `PUBLIC_ACTIVATION_PROHIBITED`
- Search eligibility: `UNRESOLVED_AND_INACTIVE`
- map/GIS eligibility: `BLOCKED_AND_INACTIVE`
- Local Decision Intelligence eligibility: `PAUSED_AND_UNAUTHORIZED`
- evidence maturity: unresolved / insufficient for public activation
- source-rights posture: unresolved

Recommended route outcome:

`RETIRE_AND_FAIL_CLOSE`

The later remediation should make the legacy Niwot city-market URL fail closed with repository-supported `404` behavior unless a separate future public-activation program explicitly reauthorizes Niwot as a customer-facing market surface. This plan does not implement that remediation.

## 2. Verified Baseline

Baseline verified before planning:

- branch: `main`
- HEAD: `8f35ee4acf06b86861e9011cb6a9c24dd42626d4`
- origin/main: `8f35ee4acf06b86861e9011cb6a9c24dd42626d4`
- ahead / behind: `0 ahead / 0 behind`
- working tree: clean
- implementation commit message: `Reconcile Niwot governance posture`

## 3. Legacy Niwot Route Inventory

Material files and systems responsible for the legacy route:

| System | File | Finding |
| --- | --- | --- |
| Dynamic city-market route | `app/market/[city]/page.tsx` | `generateStaticParams()` emits every `cities` record with a `marketSlug`; `getCityData()` resolves `getCityByMarketSlug(citySlug)`; `getCanonicalPath()` returns `/market/${city.marketSlug}`; `notFound()` is used only when no city data resolves. |
| City market data | `lib/cities.ts` | Contains Niwot city-style record with `name: "Niwot"`, `slug: "niwot-co-real-estate"`, and `marketSlug: "niwot-co-housing-market"`. This drives route resolution and static generation. |
| Lightweight city registry | `data/cities.ts` | Contains `{ slug: "niwot", name: "Niwot", county: "Boulder County" }`; this is a legacy city-style reference and does not by itself create the city-market route. |
| Decision Guide registry | `lib/coloradoDecisionGuideRegistry.ts` | Contains ineligible Niwot entry with `marketRoute: "/market/niwot-co-housing-market"` and `publicEligibility: false`; it is fail-closed by `missing-search-city-support`. |
| City intelligence | `lib/coloradoCityIntelligenceFactory.ts` | Contains fail-closed Niwot city-intelligence record with `publicEligibility: false`, incomplete evidence, blocked imagery, and missing source categories. |
| Sitemap | `app/sitemap.ts` | Includes only `getPublicDecisionGuideRegistryEntries()`. Because Niwot registry eligibility is false, Niwot is excluded from sitemap generation. |
| Market index discovery | `app/market/page.tsx` | Uses `getPublicDecisionGuideRegistryEntries()`, so the public market index does not list Niwot through the Decision Guide discovery surface. |
| City internal links | `lib/linking/getInternalLinks.ts` | Builds city links from all `lib/cities.ts` records and can link to `/market/niwot-co-housing-market` from city-market contexts depending on slice order and current city. |
| Property city links | `lib/linking/getPropertyLinks.ts` | Builds city market hrefs from `getCityByName(city)` and can point Niwot properties to `/market/niwot-co-housing-market` if any property has city `Niwot`. |
| Dynamic page Search links | `app/market/[city]/page.tsx` | When the legacy page renders, it emits `/search?city=Niwot` links, even though Niwot Search support is governed as unresolved and inactive. |
| Decision Guide rendering | `app/market/[city]/page.tsx`, `lib/decisionGuidePlatform.ts` | `buildDecisionGuide()` returns `null` for Niwot because registry public eligibility is false, so the route renders fallback `Market Context`, not a public Decision Guide. |
| Neighborhood routes | `app/market/[city]/[slug]/page.tsx`, `lib/neighborhoods.ts` | No Niwot neighborhood record or `/market/boulder/niwot` route is created. |
| Search source | `app/search/page.tsx` | Niwot is not added as supported Search behavior by the governance check; public `/search?city=Niwot` can render generic Search UI but is not a governed Search activation. |
| GMA review | `lib/gma/internalReviewDecisionFixture.ts` | Niwot requires authoritative identity evidence before canonical type, alias, or persistence decision. |
| LDI records | Local Decision Intelligence Phase 1 and Phase 2 checks and roadmap records | Niwot remains ineligible or blocked; Wave 4 remains unauthorized. |
| Deterministic checks | `scripts/checkNiwotGovernanceReconciliation.ts` and related governance checks | Certify the internal governance posture and fail-closed compatibility records, but did not check the dynamic city-market route generated from `lib/cities.ts`. |

No concrete `app/market/niwot-co-housing-market/page.tsx` file exists.

## 4. Route Generation Mechanism

The route is generated by the shared dynamic city-market route:

- route file: `app/market/[city]/page.tsx`
- static params source: `lib/cities.ts`
- route key: `city.marketSlug`
- Niwot market slug: `niwot-co-housing-market`
- route path: `/market/niwot-co-housing-market`
- canonical path: `/market/${city.marketSlug}`
- canonical URL: `https://davidquinngroup.com/market/niwot-co-housing-market`

The current route resolution path is:

1. `generateStaticParams()` iterates `cities.filter((city) => city.marketSlug)`.
2. `Niwot` is included because `lib/cities.ts` gives it a non-empty `marketSlug`.
3. `MarketReportPage()` calls `getCityByMarketSlug("niwot-co-housing-market")`.
4. The Niwot `CityData` record resolves.
5. The page renders fallback market context because `buildDecisionGuide()` returns `null` for the ineligible Niwot Decision Guide registry entry.
6. Metadata and canonical are generated from the same Niwot city data.

This is not a route file, alias, redirect, sitemap inclusion, or Decision Guide public eligibility issue. It is a dynamic route eligibility gap between `lib/cities.ts` and later governance posture.

## 5. Repository History

Key history findings:

- `ef17d64b4872747abd737cbeb9738e50878818c5` (`Add REIE content and authority pages`, 2026-05-31) introduced the shared city-market route and added Niwot to `lib/cities.ts` with `marketSlug: "niwot-co-housing-market"`.
- `8547969b75b75c857e23709b4b4d2b86922ec462` (`Implement Colorado Decision Guide Generation System 1`, 2026-07-29) introduced `lib/coloradoDecisionGuideRegistry.ts`; Niwot was recorded as an ineligible entry with `marketRoute: "/market/niwot-co-housing-market"` and `missing-search-city-support`.
- `c3fec82474d660fb8c711c2df1ebf5742376b11c` (`Implement Neighborhood Submarket Intelligence architecture`, 2026-07-31) added Neighborhood / Submarket governance that treats Niwot as an unresolved, blocked `UNINCORPORATED_COMMUNITY` governance object.
- First governed Neighborhood / Submarket closure records state Niwot was not activated and also note pre-existing dynamic-route behavior was not altered.
- Second governed Neighborhood / Submarket wave records keep Niwot blocked, non-public, route-ineligible, registry-ineligible, Search-unresolved, map-blocked, and unauthorized for LDI Wave 4.
- `e3ac62aeb1034d3c4fab048e5a298d0a876998c2` (`Plan Niwot governance reconciliation`, 2026-08-01) selected a non-public Niwot governance posture and noted city-style and market-route records should be reconciled as legacy or fail-closed.
- `8f35ee4acf06b86861e9011cb6a9c24dd42626d4` (`Reconcile Niwot governance posture`, 2026-08-01) established deterministic governance posture but preserved legacy city-style records unchanged to avoid runtime drift.

No repository evidence found a formal production certification that affirmatively authorizes Niwot to remain a customer-facing public market route under the current `UNINCORPORATED_COMMUNITY` governance posture.

## 6. Current Customer Dependencies

Repository-evidenced dependencies:

- Direct route access: `/market/niwot-co-housing-market` currently resolves through dynamic city-market routing.
- Canonical: the legacy route emits a Niwot canonical URL.
- Metadata: the legacy route emits Niwot title, description, keywords, Open Graph URL, and structured schema through city-market metadata generation.
- Page-internal Search links: when rendered, the legacy page creates `/search?city=Niwot` links.
- City internal links: `getCityLinks()` can link to Niwot from other city contexts because it uses all `lib/cities.ts` records.
- Property city links: `getPropertyLinks()` can link to the route for any property whose city resolves as Niwot.
- Decision Guide registry: Niwot has an ineligible entry with `marketRoute`, but public Decision Guide discovery and sitemap exclude it through `publicEligibility: false`.
- Sitemap: repository logic excludes Niwot because sitemap uses only public Decision Guide registry entries.
- Market index: public Decision Guide market discovery excludes Niwot for the same reason.
- Search: no supported Niwot Search activation was identified; generic URL parameters can still render Search UI.
- Map/GIS: no Niwot map, boundary, layer, or GIS activation was identified.
- LDI: no Niwot public LDI page or guide activation was identified.

No customer analytics, traffic, conversion data, heatmaps, or external search-console evidence were used or inferred.

## 7. Governance Conflict

The conflict is direct:

- the route exists and presents Niwot as a public city-market surface;
- the authoritative governance posture states Niwot is a non-public `UNINCORPORATED_COMMUNITY` object with route eligibility `BLOCKED`;
- the route emits city-style metadata and canonical URL;
- the route displays market context from legacy data even though evidence and source rights are unresolved for public activation;
- the route can create search-continuity links even though Search eligibility is unresolved and inactive.

The route cannot coexist with the governed Niwot object unless it is separately reauthorized under a distinct legacy public market context program. No current repository record provides that authorization.

## 8. Remediation Options Evaluated

### A. RETIRE_AND_FAIL_CLOSE

The route no longer resolves publicly and fails closed.

- Customer impact: direct visitors receive the standard not-found behavior; avoids unsupported public Niwot claims.
- SEO impact: legacy URL drops out naturally; sitemap already excludes it.
- Canonical impact: Niwot canonical disappears with the page.
- Sitemap impact: no change expected because Niwot is already excluded.
- Internal-link impact: internal Niwot links must be removed or prevented where produced by city-link and property-link helpers.
- Search impact: no Niwot Search activation; `/search?city=Niwot` links should not be generated from the retired page.
- Map/GIS impact: unchanged.
- LDI impact: unchanged; Wave 4 remains paused.
- Fair-housing risk: lowest because unsupported public place claims are removed.
- Source-rights risk: lowest because unresolved public evidence is not displayed.
- Production risk: bounded if implemented through existing `notFound()` behavior and targeted link prevention.
- Regression risk: moderate because shared city-market routing and linking must preserve all public eligible city routes.
- Governance consistency: strongest.
- Implementation complexity: moderate and bounded.
- Reversibility: high; a future public-activation program can reintroduce a governed route.

### B. RETIRE_WITH_GOVERNED_REDIRECT

The route is retired but redirected to an existing authorized destination such as `/market`.

- Customer impact: better direct-visitor continuity than 404.
- SEO impact: preserves some link equity but creates explicit legacy URL handling.
- Canonical impact: would require redirect/canonical behavior certification.
- Sitemap impact: likely unchanged.
- Internal-link impact: internal links should still be removed rather than relying on redirect.
- Search impact: no direct Search activation if redirect target is `/market`.
- Map/GIS impact: unchanged.
- LDI impact: unchanged.
- Fair-housing risk: low if redirected to `/market`.
- Source-rights risk: low.
- Production risk: higher than fail-close because redirect behavior is a new explicit route outcome.
- Regression risk: moderate.
- Governance consistency: acceptable, but less strict because it preserves a governed response for a blocked Niwot URL.
- Implementation complexity: higher than 404 if redirect is route-specific.
- Reversibility: high.

### C. PRESERVE_AS_LEGACY_PUBLIC_MARKET_CONTEXT

The route remains public under a separately documented legacy-market-context posture.

- Customer impact: direct route remains available.
- SEO impact: preserves current URL.
- Canonical impact: keeps Niwot canonical active.
- Sitemap impact: route remains excluded unless separately changed.
- Internal-link impact: existing links may continue.
- Search impact: page continues emitting `/search?city=Niwot` links unless modified.
- Map/GIS impact: no direct change.
- LDI impact: no direct change.
- Fair-housing risk: elevated because public copy still frames unresolved geography.
- Source-rights risk: elevated because current stats/evidence posture is unresolved.
- Production risk: low mechanically, high governance risk.
- Regression risk: low mechanically.
- Governance consistency: weak; conflicts with route `BLOCKED` and public activation `NOT_ACTIVATED`.
- Implementation complexity: low only if no change, but would require a new governance doctrine to avoid conflict.
- Reversibility: moderate.

### D. RECLASSIFY_AND_REAUTHORIZE

The route remains public only after a new explicit governance and public-activation program.

- Customer impact: could produce a future governed public route.
- SEO impact: preserves or reworks URL only after certification.
- Canonical impact: must be redesigned and certified.
- Sitemap impact: must be reconsidered.
- Internal-link impact: must be certified.
- Search impact: would require Search support review.
- Map/GIS impact: would require map/GIS non-activation or activation review.
- LDI impact: would require LDI sequencing review.
- Fair-housing risk: high until public-copy and object-boundary governance are complete.
- Source-rights risk: high until evidence/source-rights review is complete.
- Production risk: higher than remediation-only retirement.
- Regression risk: high because it becomes a public activation program.
- Governance consistency: possible only after separate authorization.
- Implementation complexity: high.
- Reversibility: moderate.

### E. RECONCILIATION_BLOCKED

Repository evidence is insufficient to choose a route treatment.

- Customer impact: blocker remains unresolved.
- SEO impact: unresolved.
- Governance consistency: poor because known conflict remains.
- Implementation complexity: none now.

This option is not selected because repository evidence is sufficient to determine that current non-public Niwot posture conflicts with the legacy public route.

## 9. Recommended Route Outcome

Recommended outcome:

`RETIRE_AND_FAIL_CLOSE`

Rationale:

- The route is legacy, not current authoritative geography.
- The route predates the governance-only reconciliation and was not newly created by it.
- Later governance records repeatedly classify Niwot as non-public, route-blocked, registry-ineligible, Search-unresolved, map/GIS-blocked, LDI-paused, and evidence/source-rights unresolved.
- The route cannot safely coexist with the governed `UNINCORPORATED_COMMUNITY` posture because it emits a public city-market identity, canonical URL, city-market metadata, structured data, and Search links.
- Preserving the route would require a new explicit public reauthorization program.
- Redirecting is supportable only as a later explicit route-behavior decision; it is not the smallest fail-closed treatment and can imply legacy route stewardship.
- Removal must avoid broken internal links by preventing repository-generated links to the retired route.

## 10. HTTP And Redirect Posture

Recommended later HTTP behavior:

- `404` using repository-supported `notFound()` behavior.

Redirect posture:

- no redirect recommended for the immediate remediation.
- no `301` or `308` recommended now.
- no alias or replacement route should be introduced.

Why `404`:

- the existing dynamic city-market route already uses `notFound()` for unresolved city-market slugs;
- `404` is the smallest repository-supported fail-closed behavior;
- `410` would require additional route-specific semantics not currently established as a repository pattern;
- redirect would be a new explicit route behavior and should not be introduced unless separately selected.

Potential redirect target if future executive preference changes:

- `/market` is the only broadly supportable existing destination because it is already public, general, and not a Boulder/Longmont/Niwot association claim.
- Boulder or Longmont context routes are not recommended because current governance preserves Boulder/Longmont only as surrounding market context, not municipal identity for Niwot.

## 11. Canonical And Sitemap Plan

Later remediation should ensure:

- `/market/niwot-co-housing-market` no longer emits a canonical URL;
- no Niwot canonical URL is introduced elsewhere;
- sitemap remains free of Niwot entries;
- sitemap generation remains based on public Decision Guide registry eligibility;
- South Boulder and Table Mesa canonicals remain unchanged;
- public eligible city-market canonicals remain unchanged.

No sitemap logic change is expected unless remediation changes a registry path in a way that must be reflected by deterministic tests.

## 12. Search, Map, GIS, And LDI Preservation Plan

Later remediation should preserve:

- no Niwot Search filter activation;
- no Search ranking, API, or runtime behavior change;
- no generated `/search?city=Niwot` links from retired Niwot page or internal link helpers;
- no Niwot map boundary, geometry, marker, layer, control, or GIS activation;
- no Gunbarrel map behavior change;
- no Local Decision Intelligence Wave 4 activation;
- no Niwot guide, city page, decision guide, fixture activation, or public maturity change.

## 13. Evidence And Source-Rights Findings

Repository evidence does not support continued public Niwot market-route publication under current governance:

- Niwot evidence remains unresolved or insufficient for public activation.
- Source rights remain unknown or unresolved.
- `lib/coloradoCityIntelligenceFactory.ts` keeps Niwot public eligibility false and city intelligence non-publishable.
- GMA review requires authoritative identity evidence before canonical type, alias, or persistence decision.
- No external or Google Drive-only content was inferred.
- No provider authority, public-record lookup, or source-rights clearance was identified.

## 14. Proposed Remediation Scope

Future remediation should be the smallest runtime-safe route fail-close:

1. Add or reuse a deterministic city-market route eligibility guard so `niwot-co-housing-market` does not resolve as a public market page.
2. Ensure `generateStaticParams()` does not prebuild Niwot as an active public city-market route.
3. Ensure direct access to `/market/niwot-co-housing-market` returns repository-supported `404` behavior.
4. Remove or prevent internal generated links to the retired Niwot market route.
5. Preserve the fail-closed Decision Guide registry posture and avoid public eligibility expansion.
6. Preserve sitemap exclusion.
7. Preserve Search, map/GIS, and LDI non-activation.
8. Add or extend deterministic checks to assert the legacy route fails closed and no internal link helper emits it.
9. Record implementation status and validation.

The remediation should not delete legacy compatibility records merely for conceptual cleanliness if doing so risks unrelated runtime drift.

## 15. Likely Future File Scope

Likely files for a separately authorized remediation:

- `app/market/[city]/page.tsx`
- `lib/cities.ts`
- `lib/linking/getInternalLinks.ts`
- `lib/linking/getPropertyLinks.ts`
- `scripts/checkNiwotGovernanceReconciliation.ts`
- one focused route-remediation deterministic check if extending the existing check would be unclear
- `package.json` and `tsconfig.worker.json` only if a new check must be registered
- one implementation record under `docs/project-atlas/executive-library/`
- `docs/CHAT_START.md`

Possible but not expected unless direct evidence requires them:

- `lib/coloradoDecisionGuideRegistry.ts`
- `app/sitemap.ts`
- Search checks
- public-runtime safety checks

Files that should not be changed unless a later authorization proves strict necessity:

- map/GIS files
- LDI Wave 4 files
- Prisma schema or migrations
- providers or acquisition files
- deployment configuration
- Gunbarrel records

## 16. Acceptance Criteria

Later remediation acceptance criteria:

- one coherent Niwot governance posture remains documented;
- `unincorporated-community:boulder-county:niwot` remains the canonical internal governance identity;
- Niwot remains `UNINCORPORATED_COMMUNITY`;
- public activation remains `NOT_ACTIVATED`;
- route eligibility remains `BLOCKED`;
- registry eligibility remains `PUBLIC_ACTIVATION_PROHIBITED`;
- `/market/niwot-co-housing-market` returns `404` or equivalent repository-supported fail-closed behavior;
- no Niwot redirect, alias, replacement route, or new route is introduced;
- no Niwot canonical URL is emitted;
- no Niwot sitemap entry is introduced;
- no generated internal links point to the retired Niwot route;
- no Niwot Search activation or Search ranking/filter/API behavior change occurs;
- no Niwot map, boundary, layer, GIS, or LDI activation occurs;
- no unsupported evidence, source-rights, value, pricing, safety, school, suitability, investment, condition, title, ownership, permit, HOA, insurance, financing, or sale-outcome claim appears;
- Gunbarrel remains unchanged;
- South Boulder remains unchanged;
- Table Mesa remains unchanged;
- unenhanced neighborhood routes remain unchanged;
- public runtime, public trust, Search runtime, map rendering, sitemap, route eligibility, and property-route safety checks pass.

## 17. Production Certification Plan

Later production certification after remediation, push, and automatic deployment should verify:

- source SHA and deployment mapping;
- no superseding deployment;
- `/market/niwot-co-housing-market` returns `404` or the separately authorized fail-closed behavior;
- no redirect occurs unless explicitly authorized;
- no Niwot canonical appears;
- no Niwot sitemap entry appears;
- `/market`, `/search`, `/buy`, `/sell`, `/home-worth`, `/grand-plan`, and `/contact` remain healthy;
- South Boulder route remains healthy and correctly labeled;
- Table Mesa route remains healthy and correctly labeled;
- Downtown Boulder or another unenhanced route remains unenhanced;
- Search remains healthy and no Niwot Search activation appears;
- map rendering remains healthy and no Niwot map/GIS activation appears;
- internal-link regression confirms no repository-generated Niwot route links remain;
- public trust and fair-housing checks pass;
- production public-experience smoke passes against `https://davidquinngroup.com`;
- Back/Forward behavior is reviewed if any customer-facing navigation changes are introduced;
- no protected boundary is crossed.

## 18. Protected Boundaries

This plan does not authorize:

- removing or disabling the Niwot route;
- adding a redirect;
- changing HTTP behavior;
- modifying route code;
- modifying city registries;
- modifying Decision Guide registries;
- modifying canonical logic;
- modifying sitemap logic;
- modifying Search;
- modifying maps or GIS;
- modifying LDI;
- modifying tests;
- modifying package files;
- modifying configuration;
- modifying generated files;
- activating Niwot;
- modifying Gunbarrel;
- acquiring evidence;
- adding providers;
- inferring source rights;
- modifying Prisma or persistence;
- mutating production data;
- deploying manually;
- production certification;
- documentation closure.

## 19. Blockers Or Open Questions

Open questions for later remediation authorization:

- Should the later implementation use a Niwot-specific fail-closed guard or a generalized city-market route eligibility helper that could also expose other ineligible-city route behavior?
- Should `lib/coloradoDecisionGuideRegistry.ts` keep Niwot `marketRoute` as a legacy/fail-closed compatibility field, or should a later remediation set it to `null` after route retirement?
- Should `data/cities.ts` remain unchanged as a lightweight legacy registry, or should it receive non-public governance metadata in a future architecture pass?
- Are there database property records with city `Niwot` that would currently generate city-market links through `getPropertyLinks()`?
- Should future production certification include a crawl of rendered internal links from representative market and property pages?

These questions do not block the recommendation because repository evidence is sufficient to select `RETIRE_AND_FAIL_CLOSE` as the next remediation outcome.

## 20. Validation Plan For This Planning Record

Planning validation requires:

- exact baseline verification;
- documentation-only scope verification;
- `git diff --check`;
- `git diff --cached --check`;
- complete diff inspection;
- route mechanism identified;
- repository history reviewed;
- customer dependencies inventoried from repository evidence;
- exactly one remediation outcome selected;
- runtime remediation remains unauthorized;
- no unsupported analytics or external evidence invented;
- Gunbarrel remains out of scope;
- no runtime or generated drift;
- `npm run typecheck`;
- `npm run lint`.
