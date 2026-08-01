# PROJECT ATLAS(TM) REIE Property / Seller Evidence Continuation Discovery And Implementation Plan

Status: `PROPERTY_SELLER_EVIDENCE_CONTINUATION_DISCOVERY_AND_IMPLEMENTATION_PLAN_COMPLETE`

Planning status: `PLANNING_AND_REPOSITORY_REVIEW_ONLY`

Implementation authorization: `NOT_AUTHORIZED`

Recommended next authorization gate: `READY_FOR_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

Date: August 1, 2026

## 1. Planning Purpose

This record identifies the highest-value, lowest-risk continuation of Property / Seller Evidence tied to one concrete existing customer-facing surface.

This phase is documentation and repository review only. It does not implement the enhancement, change runtime code, modify public routes, alter Search or maps, activate providers, acquire data, create APIs, change Prisma or persistence, modify customer data, add AI, add valuation, add scoring, or begin another initiative.

## 2. Repository Baseline Verified

Verified before planning:

- branch: `main`
- HEAD: `44e2678101d7509e432a16976bac931ed9d449ac`
- origin/main: `44e2678101d7509e432a16976bac931ed9d449ac`
- ahead / behind: `0 ahead / 0 behind`
- working tree: clean

South Boulder remains certified and closed as:

`SOUTH_BOULDER_NEIGHBORHOOD_ROUTE_ENHANCEMENT_CERTIFIED_AND_CLOSED`

## 3. Authoritative Repository Records Reviewed

This plan is based on repository records and runtime source only. No Google Drive access is assumed. Where source documents are not present in the repository, this plan relies on governing principles already recorded in repository documentation and treats any missing external source as an unresolved dependency.

Key repository authorities:

- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/REIE-PROPERTY-SELLER-EVIDENCE-READINESS-IMPLEMENTATION.md`
- `docs/project-atlas/executive-library/REIE-PROPERTY-SELLER-EVIDENCE-READINESS-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/REIE-SELLER-READINESS-ADVANCEMENT-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/REIE-DECISION-GUIDE-EVIDENCE-TRANSPARENCY-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/REIE-EVIDENCE-DEPTH-AND-DATA-INTEGRATION-FOUNDATION-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/REIE-CONTROLLED-EVIDENCE-DEPTH-INTEGRATION-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/SOURCE-RIGHTS-READINESS-1-PRODUCTION-CERTIFICATION.md`
- `docs/project-atlas/executive-library/REIE-ADVISORY-HANDOFF-READINESS-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/DECISION-JOURNEY-EXPERIENCE-1-PRODUCTION-CERTIFICATION.md`
- `docs/project-atlas/executive-library/PROPERTY-PRODUCT-3-1-PRODUCTION-CERTIFICATION.md`
- `docs/project-atlas/executive-library/REIE-SOUTH-BOULDER-NEIGHBORHOOD-ROUTE-ENHANCEMENT-PROGRAM-CLOSURE.md`

## 4. Existing Architecture Inventory

Certified Property / Seller Evidence Readiness exists as an internal, fixture-backed, deterministic, read-only, non-public, non-persistent, non-personalized, non-evaluative, non-ranking, non-predictive, conclusion-free, fail-closed, privacy-safe, source-rights-governed, and professional-boundary-safe evidence-category foundation.

Relevant implementation files:

- `lib/property-seller-evidence/propertySellerEvidenceReadiness.ts`
- `lib/property-seller-evidence/propertySellerEvidenceReadinessFixtures.ts`
- `scripts/checkPropertySellerEvidenceReadiness.ts`

Certified evidence categories include property identity, ownership and title questions, improvements and renovations, permits and municipal records, maintenance and repairs, warranties and service records, seller disclosures, inspections and specialist reports, structural materials, environmental materials, insurance questions, HOA or association materials, surveys and site plans, utilities and systems, occupancy and access, tax and assessment records, market-context materials, listing-preparation materials, unresolved information, and professional-verification needs.

Reusable certified architecture includes:

- Evidence Depth and Data Integration: `lib/evidence-depth/evidencePosture.ts`
- Controlled Evidence Depth advisory preparation: `lib/evidence-depth/advisoryEvidencePreparation.ts`
- Geographic Intelligence provenance and source-rights concepts: `lib/geographic-intelligence/evidenceProvenanceContract.ts`
- Seller Readiness public anchor: `components/SellerReadinessGuide.tsx`
- Seller Decision Workspace: `lib/sellerDecisionWorkspace.ts`
- Home Worth surface: `app/home-worth/page.tsx`
- Sell surface: `app/sell/page.tsx`
- Advisory Handoff: `components/AdvisoryHandoffGuide.tsx` and `app/contact/page.tsx`
- Property detail route: `app/properties/[id]/page.tsx`
- Property Decision Workspace: `lib/property/propertyDecisionWorkspace.ts`
- Property Product 3.1 model: `lib/propertyProduct31.ts`
- Existing checks: `check:property-seller-evidence-readiness`, `check:seller-readiness-advancement`, `check:property-product-3-1`, property-route safety, public-experience smoke, typecheck, lint, and build

## 5. Surfaces Evaluated

### Existing Property Detail Route

Route: `/properties/[id]`

Strengths:

- already customer-facing and decision-rich;
- already contains listing facts, property decision brief, Property Product 3.1, decision-readiness plan, financial context, construction questions, market context, questions forward, inquiry form, and Decision Journey continuity;
- high practical decision value for buyers and property-specific questions.

Risks:

- highest risk of users interpreting seller evidence categories as property-condition, pricing, title, permit, HOA, insurance, or value conclusions;
- already dense with property-specific verification modules;
- would require unusually careful placement to avoid duplicating existing buyer-facing property intelligence;
- could imply evidence availability for a specific listing or seller when the certified Property / Seller Evidence foundation is currently internal and fixture-backed.

Finding:

Useful for future extension only after a narrower seller-readiness translation proves safe. Not recommended as the immediate continuation.

### `/home-worth#seller-readiness`

Route and anchor: `/home-worth#seller-readiness`

Strengths:

- existing authoritative Seller Readiness surface;
- already certified as one anchored surface with no `/seller-readiness` route;
- already preparation-focused, documentation-focused, verification-focused, advisory-supporting, and explicitly not valuation or pricing;
- directly matches Property / Seller Evidence categories without implying a specific property has been evaluated;
- has existing boundary metadata for no valuation, no pricing output, no score, no persistence, no upload, no CRM automation, no email, no alerts, no telemetry, no AI, and no provider activation;
- connected to `/sell`, `/market`, `/grand-plan`, and `/contact#advisory-readiness`.

Risks:

- must avoid becoming a checklist that appears to score readiness or completeness;
- must not imply document collection, upload, storage, analysis, or verification by REIE;
- must not expose internal evidence contract names, IDs, dispositions, support levels, rights enums, or fixture content.

Finding:

Recommended existing surface.

### `/sell`

Route: `/sell`

Strengths:

- seller-facing and commercially relevant;
- already contains one restrained Seller Readiness entry point;
- already uses Home Worth, Market Context, and Advisory Guidance.

Risks:

- broader seller strategy page could turn evidence readiness into conversion copy or perceived pricing support;
- duplicating the full readiness model here would conflict with the certified single-surface Seller Readiness architecture.

Finding:

Keep as entry point only. Do not make it the primary implementation surface.

### `/contact#advisory-readiness`

Route and anchor: `/contact#advisory-readiness`

Strengths:

- strong fit for advisory handoff, professional review, and limitation framing;
- already has explicit no persistence, no automation, no personalization, no hidden context transfer, no CRM, no lead scoring, no email, no alerts, no telemetry, no provider activation, and no evidence-metadata-exposure metadata.

Risks:

- contact is a routing endpoint, not the best place to teach seller evidence preparation;
- adding property/seller evidence here could blur advisory routing with a new intake workflow.

Finding:

Use as downstream continuity only. Do not make it the primary implementation surface.

## 6. Recommended Existing Surface

Recommended surface:

`/home-worth#seller-readiness`

Recommended public enhancement:

Add a bounded public-copy "Seller Evidence Readiness" section inside the existing `SellerReadinessGuide` component.

The enhancement should translate certified Property / Seller Evidence categories into homeowner-facing preparation groups without exposing internal evidence metadata or implying REIE has evaluated a specific property.

## 7. Customer Problem And Decision Supported

Customer problem:

Homeowners often know they need a value or listing conversation but do not know which documents, facts, assumptions, and professional-review topics should be organized before asking for pricing or timing guidance.

Decision supported:

Should the homeowner request a seller review now, continue gathering property records, verify specific assumptions with qualified sources, or use advisory support to sequence next steps?

This supports preparation quality and decision confidence without producing a value, ranking readiness, predicting sale outcomes, scoring the seller, or concluding anything about property condition, title, ownership, permits, HOA, insurance, financing, investment performance, or legal compliance.

## 8. Why This Provides More Value Than Another Immediate Neighborhood Route Enhancement

Another neighborhood route enhancement would continue improving geographic context. The South Boulder enhancement already proved that pattern.

The Property / Seller Evidence continuation provides more immediate customer and business value because:

- it connects certified internal evidence-readiness architecture to a seller decision surface;
- it helps homeowners prepare better human conversations before pricing discussion;
- it reuses existing Home Worth, Seller Readiness, Advisory Handoff, Evidence Depth, and Decision Journey architecture;
- it avoids creating another route or expanding geographic eligibility;
- it moves from place-context enrichment to property/seller decision support without external data acquisition.

## 9. Proposed Bounded Experience

The public experience should add one section within `SellerReadinessGuide` after the current documentation inventory or before advisory preparation.

Suggested public section title:

`Seller Evidence Readiness`

Suggested public framing:

- "What can be organized from your records?"
- "What should be verified with qualified sources?"
- "What remains unsupported until reviewed?"
- "What REIE will not conclude from preparation materials?"

Suggested content groups:

1. Records to organize:
   improvement records, maintenance logs, warranties, permits, HOA materials where applicable, surveys or plans, utility/system notes, prior inspection or specialist reports, and disclosure-related questions.

2. Facts to verify:
   property identity, measurements, ownership or title questions, municipal or HOA requirements, insurance questions, occupancy/access details, tax or assessment assumptions, and unresolved or conflicting information.

3. Professional-review topics:
   inspection, engineering, environmental, title, legal, municipal/HOA, insurance, appraisal boundary, lending, and qualified real-estate advisory review.

4. Unsupported conclusions:
   value, price range, net sheet, condition grade, repair priority, marketability, sale timing, title quality, ownership, permit compliance, HOA quality, insurability, financing eligibility, investment performance, seller readiness score, urgency, recommendation, or ranking.

This section should be static public copy only. It should not include a form, upload control, saved checklist, dynamic completion state, personalization, tracking, evidence IDs, evidence scores, confidence percentages, internal dispositions, support levels, rights enums, or source identifiers.

## 10. Evidence And Verification Model

Known repository-backed facts:

- `/home-worth#seller-readiness` is the certified Seller Readiness anchor.
- `/sell` routes to `/home-worth#seller-readiness`.
- `components/SellerReadinessGuide.tsx` already contains public boundary metadata and preparation prompts.
- `lib/property-seller-evidence/propertySellerEvidenceReadiness.ts` certifies the evidence-category model internally.
- `scripts/checkPropertySellerEvidenceReadiness.ts` validates the internal evidence foundation and public non-exposure.
- `scripts/checkSellerReadinessAdvancement.ts` validates the single Home Worth readiness surface and protected public boundaries.

Customer-provided information:

- address, timeline, improvements, known maintenance concerns, preparation questions, and next-move priorities may be submitted only through existing authorized seller-review workflows.
- no new upload, storage, document analysis, OCR, saved profile, or customer-specific evidence packet is authorized.

Publicly available contextual information:

- existing public site context, market pages, search inventory paths, Home Worth public copy, Seller Readiness public copy, and property pages.
- public contextual information remains educational and cannot be treated as property-specific pricing, condition, title, insurance, legal, lending, or investment support.

Items requiring third-party verification:

- ownership and title questions;
- permits and municipal records;
- HOA or association materials;
- insurance facts;
- tax and assessment assumptions;
- financing assumptions;
- surveys and site plans;
- occupancy, lease, or access facts;
- public-record facts not already in the repository.

Items requiring inspection or professional review:

- roof, foundation, structural, electrical, plumbing, HVAC, drainage, soil, environmental, moisture, pest, safety-system, deferred-maintenance, appraisal, legal, tax, title, lending, insurance, municipal, HOA, contractor, engineer, inspector, or other specialist questions.

Unsupported conclusions:

- property value;
- listing price;
- seller net proceeds;
- comparable-sale conclusion;
- price-per-square-foot conclusion;
- condition score or grade;
- repair priority;
- property condition conclusion;
- title quality;
- ownership conclusion;
- permit compliance;
- HOA quality or suitability;
- insurability;
- financing eligibility;
- marketability;
- sale timing;
- transaction probability;
- investment value;
- seller readiness score;
- recommendation;
- ranking;
- personalization.

Future source categories from the Real Estate Data Tools inventory may be referenced only as future candidates. They are not activated. Any future source must be classified by intended decision use, authority level, rights and licensing status, freshness requirement, geographic coverage, property specificity, verification requirement, public-display eligibility, and implementation dependency.

## 11. Proposed Implementation File Scope

Minimum implementation scope, if separately authorized:

1. `components/SellerReadinessGuide.tsx`
   - add one static public-copy section;
   - preserve existing anchor, route metadata, and no-activation data attributes;
   - add explicit no-evidence-metadata-exposure marker if needed.

2. `scripts/checkSellerReadinessAdvancement.ts`
   - extend existing assertions for the new Seller Evidence Readiness section, protected wording, no runtime activation, no upload, no persistence, no scoring, no valuation, and no internal metadata exposure.

3. Optional only if existing coverage is insufficient: `scripts/checkPropertySellerEvidenceReadiness.ts`
   - assert the public translation does not import internal contract names, fixtures, IDs, dispositions, rights enums, support levels, scores, grades, confidence percentages, or eligibility outcomes.

No changes are proposed for:

- `app/home-worth/page.tsx`, unless a small metadata marker is required to confirm the existing rendered component still represents the single surface;
- `app/sell/page.tsx`;
- `app/properties/[id]/page.tsx`;
- `app/contact/page.tsx`;
- Search, maps, routes, canonical logic, sitemap logic, APIs, Prisma, persistence, package files, generated files, or deployment configuration.

## 12. Protected Boundaries

The proposed implementation must preserve:

- one existing public surface only: `/home-worth#seller-readiness`;
- no new route;
- no public route behavior change;
- no property-detail behavior change;
- no seller-route behavior change except existing entry-point preservation;
- no Search or map change;
- no API;
- no canonical or sitemap change;
- no provider activation;
- no external data acquisition;
- no scraping;
- no public-record lookup;
- no data-tool integration;
- no upload;
- no document storage;
- no OCR or document analysis;
- no customer-specific evidence packet;
- no customer data mutation;
- no CRM, lead scoring, routing, tracking, telemetry, alert, queue, worker, email, or notification change;
- no AI;
- no valuation, pricing, condition, ownership, title, permit, HOA, insurance, financing, investment, legal, tax, environmental, structural, marketability, urgency, sale-probability, recommendation, suitability, score, grade, ranking, or prediction output;
- no internal evidence IDs, source IDs, provider IDs, support labels, freshness labels, conflict labels, rights enums, dispositions, eligibility outcomes, fixture content, confidence percentages, scores, or grades.

## 13. Acceptance Criteria

If implementation is later authorized, acceptance requires:

- exactly one existing surface enhanced: `/home-worth#seller-readiness`;
- no new public route or API;
- no change to Search, maps, canonical, sitemap, property route behavior, seller intake behavior, or contact routing;
- public copy is limitation-forward, non-valuative, non-predictive, non-ranking, non-personalized, fair-housing safe, property-specific-boundary safe, source-rights aware, and advisory-supporting;
- evidence categories are translated into public preparation groups only;
- unsupported conclusions are explicitly named as unsupported;
- no internal evidence metadata is imported or exposed;
- no unsupported evidence claim is presented as available;
- no external source integration is implied as authorized;
- the existing Home Worth no-AVM and Seller Readiness no-score/no-upload/no-persistence/no-automation markers remain present.

## 14. Required Automated Checks

Minimum local validation after a future implementation:

- `git diff --check`
- `npm run check:property-seller-evidence-readiness`
- `npm run check:seller-readiness-advancement`
- `npm run check:property-product-3-1`
- property-route safety check already present in the repository
- `npm run smoke:public-experience` against a local server
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Focused source checks should verify:

- no internal contract names or fixtures are imported into public surfaces;
- no internal evidence identifiers, source identifiers, provider identifiers, rights enums, support levels, freshness labels, conflict labels, dispositions, eligibility outcomes, fixture content, confidence percentages, scores, or grades are present in public copy;
- no prohibited public claims appear;
- no runtime activation patterns appear in `SellerReadinessGuide`.

## 15. Responsive Review Requirements

Review `/home-worth#seller-readiness` at:

- desktop: `1440x1100`
- tablet: `768x1024`
- mobile: `390x844`

Required browser findings:

- anchor loads and scrolls correctly;
- section is visible and readable;
- no horizontal overflow;
- no overlapping text or controls;
- no console errors;
- no broken visual assets;
- existing `/sell` -> Seller Readiness navigation still lands on `/home-worth#seller-readiness`;
- browser Back returns to `/sell`;
- continuity links to `/sell`, `/market`, `/grand-plan`, and `/contact#advisory-readiness` remain accurate.

## 16. Regression Scope

Regression review should cover:

- `/home-worth`
- `/home-worth#seller-readiness`
- `/sell`
- `/contact#advisory-readiness`
- representative property route
- `/search`
- `/market`
- `/grand-plan`
- sitemap and canonical preservation through existing checks
- unauthorized route absence for `/seller-readiness`, `/property-seller-evidence`, `/seller-evidence-readiness`, `/api/property-seller-evidence`, and `/api/seller-evidence-readiness`

## 17. Production Certification Requirements

After a future authorized implementation and push:

- observe automatic Vercel deployment only;
- verify GitHub/Vercel status success for the implementation SHA;
- run production public-experience smoke against `https://davidquinngroup.com`;
- verify production `/home-worth#seller-readiness`, `/sell`, `/contact#advisory-readiness`, and a representative property route;
- confirm no Search, map, route, canonical, sitemap, property route, seller intake, API, Prisma, persistence, provider, customer data, telemetry, CRM, queue, worker, email, alert, or notification behavior changed;
- confirm public copy remains limitation-forward and protected-boundary safe.

## 18. Documentation Closure Requirements

After future production certification:

- create one executive-library closure record;
- update `docs/CHAT_START.md`;
- record implementation SHA, deployment evidence, validation evidence, browser evidence, protected-boundary evidence, and final certified-and-closed status;
- record recommended next authorization only;
- do not begin another implementation or strategic review without explicit authorization.

## 19. Blockers Or Open Questions

No blocker prevents a bounded implementation authorization if the scope remains the recommended single-surface public-copy enhancement.

Open questions before implementation authorization:

1. Confirm the future authorized implementation may modify `components/SellerReadinessGuide.tsx`.
2. Confirm whether `scripts/checkSellerReadinessAdvancement.ts` alone should carry the public-surface assertions or whether `scripts/checkPropertySellerEvidenceReadiness.ts` should also assert public non-exposure after integration.
3. Confirm whether the future implementation should add a dedicated `data-seller-readiness-evidence-metadata-exposure="false"` marker.
4. Confirm whether any Real Estate Data Tools source categories may be named only as future source classes, with no provider, acquisition, API use, storage, or public-display eligibility implied.

## 20. Final Planning Recommendation

Recommended surface:

`/home-worth#seller-readiness`

Recommended next authorization gate:

`READY_FOR_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

This recommendation does not authorize implementation. It does not authorize route changes, property-route changes, Search changes, map changes, API changes, source activation, data acquisition, uploads, AI, valuation, scoring, ranking, prediction, personalization, Prisma, persistence, customer data, CRM, telemetry, queues, workers, email, notifications, deployment, Table Mesa, Niwot, Local Decision Intelligence Wave 4, or any unrelated initiative.
