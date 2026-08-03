# REIE DXT 2 Decision Readiness Depth Architecture

Status: `DXT_2_DECISION_READINESS_ARCHITECTURE_READY`

Program: `REIE_DXT_2_DECISION_READINESS_DEPTH`

Architecture type: documentation-only deterministic planning contract.

Runtime authorization: `false`

Shared runtime schema authorization: `false`

## Governing Question

Does each certified experience help the customer become sufficiently prepared to make the next real decision?

## Decision Readiness Model

Future DXT 2 implementation phases should use this conceptual model without creating a shared runtime schema:

1. Decision being considered
2. Evidence currently available
3. Evidence not yet available
4. Assumptions currently being used
5. Confidence in each material input
6. Freshness and provenance
7. What remains unverified
8. Questions to ask
9. Professional review requirements
10. Next decision threshold

The model is route-local, evidence-led, customer-understandable, direct-entry compatible, and non-persistent by default.

## Evidence Model

Routes should distinguish:

- verified facts;
- directional context;
- assumptions;
- modeled estimates;
- customer-provided information;
- professional judgment;
- unknowns;
- stale evidence;
- conflicting evidence;
- unavailable evidence.

Evidence requirements:

- source attribution must be visible when the source is already known and public;
- freshness must be adjacent to reliance points when available;
- provenance must not imply a provider has been newly activated;
- limitations must sit near the evidence they qualify;
- conflicting evidence must remain preserved rather than collapsed into false certainty;
- unavailable evidence must be named when it is material to the next decision;
- public synthesis must not claim more than existing evidence supports.

New providers, data-provider activation, APIs, schemas, persistence, telemetry, or analytics are not authorized by this architecture.

## Confidence Model

Confidence means evidence quality and completeness. It is not a recommendation.

Permitted confidence concepts:

- source confidence;
- freshness confidence;
- completeness confidence;
- verification status;
- evidence consistency;
- limitation severity.

Prohibited confidence concepts:

- customer fit scores;
- property suitability scores;
- neighborhood fit scores;
- investment scores;
- buy or sell recommendations;
- probability of appreciation;
- approval likelihood;
- affordability conclusions;
- hidden composite scores;
- behavioral scoring;
- lead scoring.

Confidence language must answer: "How reliable is this input for the decision at hand?" It must not answer: "What should this customer do?"

## Assumption And Unknown Treatment

Assumptions should be visible, plain-language, and non-sensitive. Examples:

- listing facts may be incomplete;
- condition details may require inspection or records;
- market signals may not apply to a specific property;
- financing terms require lender review;
- seller pricing context requires property-specific professional review;
- neighborhood context is orientation, not personal fit.

Unknowns should not be hidden to simplify the page. Material unknowns should be grouped by the decision they affect:

- property condition;
- ownership cost;
- financing and insurance;
- HOA, title, and records;
- market interpretation;
- local place context;
- legal, tax, and professional review.

Unknowns must not become fear-based urgency copy.

## Verification Model

Route-specific verification expectations:

- Property: source review, public listing facts, inspection, title, HOA, tax, insurance, property condition, permits, systems records, construction context, financing assumptions, and contract review.
- Buyer: lender review, financing assumptions, taxes, insurance, HOA, title, inspection, property condition, contract review, and professional consultation.
- Seller: property condition, preparation, records, pricing strategy, market alternatives, tax, legal, title, disclosure, insurance, and advisor review.
- Market: source review, freshness, market direction, inventory context, property-level verification, and professional interpretation.
- City Market: city-level evidence, neighborhood paths, inventory context, directional-versus-verified distinction, and professional review.
- Neighborhood: place orientation, property-specific diligence, insurance, access assumptions, records, fair-housing boundaries, and non-ranking verification.
- Advisory: evidence already reviewed, assumptions remaining, questions requiring professional discussion, and professional boundaries.
- Contact: safe route choice, minimum useful information, privacy, consent, brokerage, and professional boundaries.

Verification is guidance for preparation. It is not legal, tax, lending, appraisal, valuation, inspection, engineering, or professional instruction unless separately supported by an authorized professional relationship.

## Progressive Disclosure Principles

Immediately visible:

- governing decision;
- current evidence posture;
- most important unknowns;
- next decision threshold;
- professional-boundary summary.

Summarized:

- long verification lists;
- evidence source detail;
- route-specific limitations;
- supporting calculations or model context already present.

Progressively disclosed:

- deeper source notes;
- detailed verification questions;
- definitions of confidence labels;
- accepted limitations.

Moved to destination route:

- active property inventory to Search;
- address-level evaluation to Property;
- place orientation to Neighborhood;
- city evidence to City Market;
- preparation to Advisory;
- conversation initiation to Contact.

Deferred to professional review:

- legal, tax, lending, appraisal, valuation, inspection, engineering, contract, title, insurance, representation, and strategy conclusions.

Excluded from public experience:

- protected characteristics;
- demographic targeting;
- hidden personalization;
- confidential customer information;
- customer scoring;
- inferred preference ranking;
- lead scoring;
- private customer history.

## Direct-Entry Requirements

Every destination must remain understandable without prior journey state.

Future DXT 2 route-local implementations must:

- render normally with no context;
- preserve canonical URLs;
- avoid requiring prior Search, Property, Buyer, Seller, Market, Neighborhood, Advisory, or Contact state;
- avoid hidden context transfer;
- avoid localStorage, cookies, session state, persistent profiles, telemetry-derived personalization, or CRM enrichment;
- treat copied/shared URLs as safe public URLs;
- present any supported context visibly and removably only if separately authorized.

## Privacy, Fair-Housing, Financial, Valuation, And Professional Boundaries

This architecture prohibits:

- protected-class steering;
- demographic suitability;
- safety or school-quality conclusions;
- neighborhood ranking;
- investment recommendations;
- appreciation predictions;
- mortgage approval or qualification;
- affordability or buying-power conclusions;
- underwriting conclusions;
- lender rankings;
- appraisal equivalence;
- valuation certainty;
- guaranteed pricing or outcomes;
- legal advice;
- tax advice;
- automated representation claims;
- AI professional impersonation;
- hidden personalization;
- customer profiling;
- persistence;
- telemetry-derived recommendations;
- CRM enrichment;
- automated outreach.

Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`. This architecture does not propose changing its wording, position, style, or prominence.

## Implementation Principles

- Prefer route-local changes over shared runtime abstractions.
- Use existing evidence before requesting new data.
- Keep confidence labels descriptive, not numeric scores.
- Keep next-step thresholds customer-readable.
- Keep one primary decision per viewport.
- Keep mobile comprehension and accessible disclosure controls.
- Preserve direct-entry behavior and browser navigation.
- Require separate local certification, push authorization, production certification, and documentation closure for each runtime phase.

## Accepted Limitations

- This record does not implement DXT 2 runtime.
- No provider, API, schema, persistence, telemetry, CRM, email, scheduling, AI, financial, valuation, or legal logic is authorized.
- Property is selected as the first recommended phase, but implementation remains separately gated.

## Deterministic Architecture Criteria

- Decision/evidence/assumption/unknown/verification model is present.
- Confidence boundaries prohibit scores, recommendations, predictions, and regulated conclusions.
- Evidence model distinguishes verified facts, directional context, assumptions, estimates, customer input, professional judgment, unknowns, stale evidence, conflicting evidence, and unavailable evidence.
- Direct-entry, privacy, fair-housing, financial, valuation, professional, provider, persistence, telemetry, and brokerage-disclosure boundaries are preserved.

## Next Gate

`READY_FOR_REIE_DXT_2_PROPERTY_DECISION_READINESS_DEPTH_BOUNDED_IMPLEMENTATION_AUTHORIZATION`
