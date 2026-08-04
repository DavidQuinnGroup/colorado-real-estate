# REIE DXT 2 Cross-Route Evidence Consistency Plan

Status: `DXT_2_CROSS_ROUTE_EVIDENCE_CONSISTENCY_PLAN_READY`

Runtime authorization: `false`

Selected primary recommendation: `DOCUMENTATION_ONLY_TERMINOLOGY_STANDARD`

Selected secondary recommendation: `PROCEED_TO_DXT_2_COMPLETION_ASSESSMENT`

Shared runtime finding: `NO_SHARED_RUNTIME_ABSTRACTION_REQUIRED`

Recommended future gate:

`READY_FOR_REIE_DXT_2_CROSS_ROUTE_EVIDENCE_CONSISTENCY_PLAN_CERTIFICATION`

## Objective

Assess whether DXT 2 evidence language and readiness concepts remain coherent across certified public decision routes without changing runtime.

The goal is consistency of customer understanding, not universal copy uniformity.

## Routes Assessed

- `/search`
- representative `/properties/[id]`
- `/buy`
- `/sell`
- `/market`
- representative `/market/[city]`
- representative `/market/[city]/[slug]`
- `/contact#advisory-readiness`

## Consistency Matrix

| Dimension | Finding | Disposition |
| --- | --- | --- |
| Available evidence | Present across DXT 2 depth routes, named route-locally | Keep route-specific wording |
| Unavailable evidence | Present as missing evidence, needs verification, or not confirmed here | Normalize conceptually in documentation |
| Assumptions | Present across Buyer, Seller, Property, Market, City Market, Neighborhood, and Advisory | Keep route-specific examples |
| Unknowns | Present as route-local unknowns or professional-review questions | Keep route-specific examples |
| Qualitative confidence | Present as preparation confidence, evidence confidence, or limitation posture | Define as non-scoring documentation standard |
| Freshness | Explicit on evidence-heavy Market, City Market, Neighborhood, Search, and Property surfaces | Leave absent where freshness is not material |
| Verification language | Present across routes | Standardize as source review or professional verification |
| Next-decision thresholds | Present across DXT 2 depth routes | Keep destination-owned thresholds |
| Professional boundaries | Present and route-specific | Preserve route-specific legal, tax, lending, valuation, fair-housing, and professional boundaries |
| Direct entry | Preserved across routes | Required invariant |
| Destination ownership | Search owns inventory, Property owns address evaluation, Market owns broad briefing, City Market owns city evidence, Neighborhood owns place orientation, Buyer/Seller own preparation, Advisory prepares, Contact begins | Preserve |
| Terminology | Minor route-local drift exists by design | Documentation standard is sufficient |
| Limitation placement | Generally adjacent to readiness or transition sections | Continue route-local placement |

## Intentional Differences

- Search uses criteria, visible results, provider posture, and comparison-readiness language.
- Property uses address-level evidence, verification, professional handoff, and Search return language.
- Buyer uses financing-readiness and transaction-verification language.
- Seller uses condition, pricing-context, market-exposure, buyer-objection, and transaction-readiness language.
- Market and City Market use broad market evidence and city-level context language.
- Neighborhood uses place-orientation, evidence, and fair-housing-safe investigation language.
- Advisory uses preparation and professional-conversation language.

These differences are intentional because each route owns a different customer decision.

## Material Inconsistencies

No material runtime inconsistency requires immediate implementation.

The main inconsistency is documentation-level terminology drift:

- `Needs verification`
- `Not confirmed here`
- `Unknown from current evidence`
- `Assumption`
- `Evidence gap`
- `Professional review`

These terms can remain customer-facing where route-appropriate, but governance should treat them as a single evidence-readiness vocabulary.

## Terminology Standard

Recommended documentation standard:

- `Available evidence`: visible route evidence already shown to the customer.
- `Needs verification`: evidence or claims that require source review or qualified professional confirmation.
- `Assumption`: a planning premise used for orientation but not established as fact.
- `Unknown`: material information not confirmed by the current route.
- `Qualitative confidence`: a non-scoring description of evidence completeness, freshness, verification status, and limitation severity.
- `Next-decision threshold`: a descriptive cue for what route or professional review should come next.

## Evidence Classification Standard

Evidence classifications should remain:

- visible;
- human-readable;
- route-specific;
- non-sensitive;
- direct-entry safe;
- non-persistent;
- non-scoring;
- non-recommendation;
- separated from professional conclusions.

## Confidence Standard

Confidence language may describe:

- completeness;
- freshness;
- source clarity;
- verification status;
- limitation severity;
- preparation confidence.

Confidence language must not become:

- score;
- grade;
- rank;
- recommendation;
- suitability label;
- approval probability;
- valuation certainty;
- investment conclusion;
- hidden composite indicator.

## Verification Standard

Verification language should distinguish:

- source review;
- property-level review;
- market evidence review;
- lender or financial review;
- legal or tax review;
- title, HOA, insurance, permit, inspection, engineering, or professional review.

Routes must not imply that REIE has verified facts it has not verified.

## Threshold Standard

Thresholds should be descriptive and destination-owned:

- Search owns inventory and comparison.
- Property owns address-level evaluation.
- Market owns broad market briefing.
- City Market owns city-level evidence.
- Neighborhood owns place orientation.
- Buyer owns buying preparation.
- Seller owns market-exposure preparation.
- Advisory owns professional-conversation preparation.
- Contact owns general conversation initiation.

Thresholds should not force a funnel, hide context, prescribe a transaction decision, or replace browser navigation.

## Customer Impact

The current customer impact is moderate and governance-oriented rather than a production defect. Customers can continue through each route, but a documentation standard will keep future route-specific copy from drifting into scores, recommendations, unsupported certainty, or duplicated terminology.

## Shared Runtime Finding

`NO_SHARED_RUNTIME_ABSTRACTION_REQUIRED`

A shared runtime readiness component or schema is not recommended. The route purposes differ enough that a shared runtime abstraction would increase protected-boundary risk and reduce route-specific clarity.

Future work should remain documentation-led or route-specific unless evidence proves a shared abstraction is unavoidable.

If a shared abstraction later appears necessary, the required disposition is:

`SHARED_RUNTIME_STOP_AND_REPORT`

## Deterministic Certification Criteria

Future plan certification should verify:

- route inventory exists;
- consistency matrix exists;
- intentional differences are documented;
- material inconsistencies are classified;
- terminology standard exists;
- evidence classification standard exists;
- confidence standard exists;
- verification standard exists;
- threshold standard exists;
- destination ownership is preserved;
- no shared runtime abstraction is authorized;
- no runtime, route, canonical, API, provider, form, persistence, telemetry, CRM, email, scheduling, navigation, footer, brokerage-disclosure, AI, scoring, ranking, suitability, or recommendation change is authorized.

## DXT 2 Completion Implication

After Seller readiness depth is locally certified, pushed, production-certified, and closed, and after this Cross-Route Evidence Consistency plan is certified and closed, DXT 2 can proceed to a documentation-only completion assessment unless production evidence identifies a material route-specific defect.

## Accepted Limitations

- This plan does not authorize runtime implementation.
- This plan does not close DXT 2.
- This plan does not normalize public copy in runtime.
- This plan does not create a shared component, schema, registry, URL context, persistence mechanism, telemetry, analytics, provider activation, AI advice, scoring, ranking, recommendation system, CRM, email, scheduling, form, API, navigation, footer, or brokerage-disclosure change.
