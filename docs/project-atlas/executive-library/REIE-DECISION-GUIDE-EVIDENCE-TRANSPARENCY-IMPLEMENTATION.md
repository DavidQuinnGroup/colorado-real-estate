# REIE Decision Guide Evidence Transparency Implementation

## Status

Local implementation status: `DECISION_GUIDE_EVIDENCE_TRANSPARENCY_READY_FOR_PUSH`.

Authoritative contract: `DECISION_GUIDE_EVIDENCE_TRANSPARENCY`.

This is a bounded, public-copy-only, deterministic, non-dynamic, non-personalized, limitation-forward, non-ranking, non-predictive, source-rights-safe, fair-housing-safe, editorial-depth-preserving transparency layer for existing editorial Decision Guides only.

It creates no public Evidence Depth metadata, evidence label system, confidence score, evidence rank, provider activation, acquisition, live evidence fetch, API, schema change, persistence, Decision Guide unification, maturity relabeling, route activation, registry activation, Search change, map change, CRM activity, tracking, telemetry, customer data use, or production write.

## Strategic Baseline

The post-Neighborhood / Submarket Architecture strategic review selected Decision Guide Evidence Transparency as the highest-value next initiative. The strategic review commit `9eb61ab3a138c71bae7a5afbca97f3e42e493af2` was pushed to `origin/main` before implementation.

The implementation reuses the certified Decision Guide platform, Boulder / Louisville / Lafayette editorial guide configurations, Cross-City Comparison mixed-maturity behavior, Evidence Depth foundation concepts, Controlled Evidence Depth Integration boundaries, source-rights governance, Geographic Intelligence provenance posture, Neighborhood / Submarket non-activation boundaries, public-trust patterns, and fair-housing validation posture. No parallel evidence-transparency system was introduced.

## Authorized Guide Coverage

The first version is authorized only for:

- Boulder: `EDITORIALLY_CERTIFIED`
- Louisville: `EDITORIALLY_CERTIFIED`
- Lafayette: `EDITORIALLY_CERTIFIED`

`EDITORIALLY_CERTIFIED` is explained publicly as a governed editorial and product-review status. It does not imply complete evidence, guaranteed accuracy, universal applicability, superiority, desirability, a recommendation to buy, sell, move, or invest, or a ranking above `ENHANCED_FOUNDATION`.

Enhanced Foundation guides remain outside this transparency activation.

## Shared Transparency Contract

The shared contract creates one restrained transparency section for each authorized guide. It uses plain customer-facing language and deterministic configuration for:

- section heading
- maturity explanation
- geographic-scope statement
- evidence-scope statement
- recency statement
- source-use boundary
- conflict and uncertainty posture
- property and professional-review limitation
- decision boundary
- next-step continuity guidance

No free-form AI generation is introduced.

## Transparency Dimensions

### Geographic Scope

Guide context is citywide. Neighborhoods, subdivisions, HOAs, districts, overlapping jurisdictions, and individual properties may differ and still require their own review.

The section does not activate Neighborhood / Submarket architecture publicly and does not create new object classifications.

### Evidence Scope

Guide topics may rely on different kinds and amounts of support. Some topics are directly supportable, others are contextual or incomplete, and missing information is not proof that a condition does or does not exist.

Internal support-level labels are not exposed.

### Recency

Information may reflect different observation or effective dates. Current market, municipal, financing, and property conditions should be verified when timing matters. Undated information is not treated as current, and no live freshness fetch is claimed or performed.

### Source And Rights Boundary

REIE presents only information it is permitted to show publicly. Some material may be summarized, limited, internally reviewed, unavailable, or excluded from public display. Possession of information does not automatically authorize public display.

The implementation makes no legal conclusion about licensing or source rights.

### Conflict And Uncertainty

Public sources and records may differ. Where support conflicts or remains unavailable, the guide preserves uncertainty instead of choosing an unsupported answer.

Conflict codes, internal evidence records, competing source details, and provenance chains are not exposed.

### Property-Specific Limitation

City context does not establish property condition, insurability, title status, structural condition, environmental condition, soil or drainage condition, HOA requirements, municipal compliance, permit status, valuation, financing eligibility, or professional conclusions.

## Professional-Review Boundary

The public copy identifies qualified review categories through limitation language, including municipality, county, HOA or association, title professional, insurance professional, inspector, engineer, environmental specialist, appraiser, lender, attorney, and tax professional.

No provider, firm, assignment, referral workflow, lead routing, or professional conclusion is created.

## Decision Boundary

The transparency layer states that Decision Guides support question preparation and context. They do not decide whether a city is appropriate for someone, which neighborhood is best, whether a property should be purchased, whether a seller should list, whether an investment will perform, whether financing will be approved, or whether future value will rise or fall.

## Journey Continuity

The existing continuity model remains unchanged. Decision Guides continue to link to:

- Market Context
- city-filtered Search
- Buyer Guidance
- Seller Guidance
- Financing Guidance
- Grand Plan
- Advisory Guidance

CTA labels continue to match destinations.

## Editorial Preservation

The implementation does not flatten or mechanically unify Boulder, Louisville, or Lafayette. It preserves city-specific narrative, Decision Snapshot, Local Character, Market Drivers, buyer and seller guidance, due-diligence questions, journey continuity, and maturity identity.

One narrow wording correction removes prohibited best-match language from editorial verification questions without changing the substantive guide structure.

## Public Copy Safety

The implementation prohibits best-match, best-neighborhood, ideal-for, right-for-you, perfect-for, safest, best-schools, superiority, desirability, demographic targeting, protected-class proxy, suitability, urgency, investment recommendation, appreciation forecast, valuation conclusion, and definitive property-condition, hazard, insurance, structural, environmental, soil, drainage, title, or permit conclusions.

## Evidence Non-Exposure

The public layer does not expose:

- evidence IDs
- source IDs
- provider IDs
- version IDs
- source-rights enums
- support levels
- freshness enums
- conflict enums
- lineage records
- eligibility outcomes
- fixture names
- internal summaries
- internal Advisory preparation prompts
- internal Neighborhood / Submarket readiness states

## Visual Placement

The transparency section is visually restrained, shorter than the substantive guide, and placed after the core verification questions and before neighborhood and journey-continuity sections. It uses existing Decision Guide design language, compact copy, and no source table, evidence dashboard, scorecard, confidence bar, badge system, or large repeated disclaimer.

## Deterministic Validation

Dedicated validation command:

```bash
npm run check:decision-guide-evidence-transparency
```

The check verifies the shared contract, authorized three-guide coverage, preserved `EDITORIALLY_CERTIFIED` maturity, substantive editorial content preservation, limitation-forward language, citywide and non-property-specific scope, recency limitations, source-rights limitations without legal conclusions, conflict and uncertainty handling, property-specific limitations, professional boundaries, decision boundaries, accurate journey links, internal Evidence Depth metadata non-exposure, no scores or rankings, no prohibited fair-housing or professional-boundary claims, Cross-City Comparison mixed-maturity preservation, no Neighborhood / Submarket or Local Decision Intelligence activation, and no provider, API, schema, persistence, telemetry, CRM, Search, map, or production behavior change.

## Responsive And Interaction Review

Local review covers Boulder, Louisville, and Lafayette at desktop, tablet, and mobile viewports. Certification verifies that the transparency section is present, maturity remains visible, substantive content is preserved, there is no horizontal overflow or overlapping content, copy is not a dense legal wall, continuity links remain usable, city Search navigation preserves browser Back behavior, and no console or runtime errors appear.

## Protected Boundaries

No Decision Guide unification, maturity relabeling, public neighborhood route, route or registry eligibility, Niwot activation, Gunbarrel activation, Local Decision Intelligence Wave 4, Search behavior, Search ranking, map behavior, public GIS, provider, acquisition, public record, evidence API, evidence persistence, Prisma schema, migration, customer data, CRM, tracking, telemetry, profiling, personalization, cookie or storage behavior, valuation, pricing, affordability, qualification, property-condition conclusion, neighborhood conclusion, ranking, scoring, confidence percentage, forecast, investment recommendation, demographic targeting, school or safety rating, desirability claim, AI, alert, queue, worker, email, notification, deployment configuration, or production data was modified or activated.

## Explicit Non-Activation Status

This implementation is not Decision Guide unification, not Evidence Depth public metadata exposure, not a provider/source activation, not a live evidence system, not a public evidence registry, not a neighborhood/submarket activation, not Niwot or Gunbarrel activation, not Local Decision Intelligence Wave 4, not a Search or map change, and not a production data operation.
