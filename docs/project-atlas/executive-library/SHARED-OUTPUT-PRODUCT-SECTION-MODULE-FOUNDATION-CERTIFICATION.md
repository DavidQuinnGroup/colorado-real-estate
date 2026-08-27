# PROJECT ATLAS Shared Output Product Section Module Foundation Certification

## Certification

Status: `PROJECT_ATLAS_SHARED_OUTPUT_PRODUCT_SECTION_MODULE_FOUNDATION_CERTIFIED`

Shared contract/version: `SHARED_OUTPUT_PRODUCT_COMPOSITION_V1`

Seller reference consumer: `SELLER_PRESENTATION_OUTPUT_COMPOSITION_V1`

Next gate: `READY_FOR_SELLER_PRESENTATION_CONTENT_MODULE_EXPANSION`

This certification admits the first reusable output product language for PROJECT ATLAS. It is an inert repository-local contract, composition engine, Seller Presentation reference consumer, deterministic checker, and documentation package. It does not create a route, UI, API, schema, migration, provider call, persistence path, publication path, PDF, share link, email, CRM action, customer mutation, or deployment.

## Canonical Chain

The certified chain is:

`AGENT PREPARATION -> SHARED OUTPUT PRODUCT -> PRODUCT-SPECIFIC EXTENSION -> SECTION COMPOSITION -> MODULE COMPOSITION -> INTELLIGENCE / ANALYSIS REFERENCES -> EVIDENCE / RIGHTS / FRESHNESS -> AGENT REVIEW -> OUTPUT READINESS`

The shared model answers:

- What product is being created: `AtlasOutputProductKind`.
- Who it is for: `AtlasOutputAudience`.
- What subject it concerns: `AtlasOutputSubjectReference`.
- What preparation created it: `AtlasOutputSourceReference`.
- What sections it contains: `AtlasOutputSectionDefinition`.
- What modules each section contains: `AtlasOutputModuleDefinition`.
- What intelligence supports each module: `intelligenceReferenceIds`.
- What evidence supports the intelligence: `AtlasOutputEvidenceReference`.
- What rights apply: `AtlasOutputRightsState`.
- How fresh the information is: `AtlasOutputFreshnessState`.
- What requires Agent review: `AtlasOutputReviewRequirement`, section/module review states, and product readiness.
- What is ready for output: `AtlasOutputReviewState`.
- What product-specific extensions apply: the Seller Presentation extension in `lib/sellerPresentationOutputComposition.ts`.

## Canonical Repository Locations

Shared output product contract: `lib/sharedOutputProductComposition.ts`

Product kind registry: `ATLAS_OUTPUT_PRODUCT_KINDS`

Audience registry: `ATLAS_OUTPUT_AUDIENCES`

Subject registry: `ATLAS_OUTPUT_SUBJECT_KINDS`

Section contract: `AtlasOutputSectionDefinition`

Section kind registry: `ATLAS_OUTPUT_SECTION_KINDS`

Module contract: `AtlasOutputModuleDefinition`

Module kind registry: `ATLAS_OUTPUT_MODULE_KINDS`

Composition engine/rules: `buildAtlasOutputProduct`

Evidence interface: `AtlasOutputEvidenceReference`

Rights interface: `AtlasOutputRightsState`

Freshness interface: `AtlasOutputFreshnessState`

Agent review model: `AtlasOutputReviewState` and `AtlasOutputReviewRequirement`

Seller product extension: `lib/sellerPresentationOutputComposition.ts`

Seller preparation adapter: `buildSellerPresentationComposition`

Seller composition fixtures: `SELLER_PRESENTATION_REFERENCE_PREPARATION`

Checker: `scripts/checkSharedOutputProductSectionModuleFoundation.ts`

Package script: `npm run check:shared-output-product-section-module-foundation`

## Product Family Recognition

The shared registry structurally recognizes:

- `SELLER_PRESENTATION`
- `BUYER_PRESENTATION`
- `MARKET_REPORT`
- `PROPERTY_ANALYSIS`
- `LOCATION_ANALYSIS`
- `INVESTMENT_PROPERTY_ANALYSIS`
- `MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS`
- `ADVISORY_BRIEFING`
- `AGENT_INTERNAL_ANALYSIS`

Recognition is not implementation. This package certifies the shared language and the Seller Presentation reference consumer only.

## Seller Presentation Reference Consumer

Seller product kind: `SELLER_PRESENTATION`

Seller preparation input: `SellerPresentationPreparationReference`, structurally pointing to seller update preparation and agent conversation preparation.

Seller sections:

- `seller-overview`
- `seller-property-context`
- `seller-market-position`
- `seller-financial-review`
- `seller-evidence-limitations`

Seller modules:

- `seller-executive-summary`
- `seller-subject-property`
- `seller-condition-review`
- `seller-market-snapshot`
- `seller-current-competition`
- `seller-financial-questions`
- `seller-disclosures-limitations`

Available intelligence:

- Seller update preparation packet.
- Agent conversation preparation composition.
- Seller property factual intelligence.
- Seller market context intelligence.
- Current competing listing context reference.
- Financial preparation composition reference.

Evidence-gated intelligence:

- Condition and improvement evidence is explicitly `MISSING`.
- Source timestamp posture is `PROFESSIONAL_VERIFICATION_REQUIRED`.
- Seller financial preparation is `PROFESSIONAL_VERIFICATION_REQUIRED`.

Rights-gated intelligence:

- Condition/improvement evidence is `REQUIRES_REVIEW`.
- Disclosure/limitation module carries `REQUIRES_REVIEW`.
- The current admitted use is internal Agent review; seller-facing delivery is not authorized by this package.

Agent review requirements:

- Agent factual review.
- Seller strategy boundary review.
- Rights/freshness/missing-evidence review before output use.

Current output readiness: `AGENT_REVIEW_REQUIRED`

Next Seller gate: `READY_FOR_SELLER_PRESENTATION_CONTENT_MODULE_EXPANSION`

## Composition Rules Certified

The shared engine validates product kind, product identity, version, generated/effective dates, audience, subject, purpose, source references, evidence references, sections, modules, review requirements, intended formats, and protected boundaries.

The shared engine composes:

- deterministic module ordering;
- deterministic section ordering;
- product applicability;
- audience applicability;
- required/optional module state;
- evidence gating;
- rights gating;
- freshness gating;
- Agent review state;
- deterministic composition identity;
- product-family extensibility.

Explicit inclusion states include `INCLUDED`, `AVAILABLE_OPTIONAL`, `EXCLUDED_BY_PRODUCT`, `EXCLUDED_BY_AUDIENCE`, `UNAVAILABLE_EVIDENCE`, `UNAVAILABLE_RIGHTS`, `UNAVAILABLE_FRESHNESS`, and `REVIEW_REQUIRED`.

## Runtime Impact

Newly available domain/composition capabilities:

- A canonical reusable output product contract.
- A product kind registry.
- Audience and subject references.
- Evidence, rights, and freshness interfaces.
- Section and module contracts.
- Deterministic output composition engine.
- Seller Presentation reference extension and adapter.

Current Agent-visible effect: none. No route or UI is activated.

Current client-visible effect: none. No publication, PDF, share, email, or delivery path is activated.

## Protected Boundaries

All protected boundaries remain false:

- delivery authorization;
- publication authorization;
- persistence authorization;
- provider mutation;
- customer mutation;
- CRM mutation;
- email/message execution;
- recommendation;
- ranking;
- scoring.

No database mutation, schema migration, observation/event/snapshot table, capture, raw archival, backfill, historical import, sync modification, cadence change, cron, webhook, polling change, Supabase mutation, provider/MLS/IRES call, Typesense mutation, CRM/email/customer mutation, secret mutation, historical UI/API/report/export/PDF, or deployment is authorized or performed by this certification.

## Validation

Primary new check:

`npm run check:shared-output-product-section-module-foundation`

What it proves:

- shared output product contract exists and is versioned;
- product-kind registry recognizes the required family;
- audience and subject registries exist;
- evidence, rights, freshness, Agent-review, section, module, and readiness models exist;
- Seller Presentation consumes the shared contract;
- Seller sections/modules compose deterministically;
- missing evidence, rights review, and freshness review remain explicit;
- protected boundaries remain false;
- package script wiring exists;
- no runtime/provider/persistence/customer mutation tokens are introduced.

Relevant existing checks should be run as compatibility evidence:

- `npm run check:agent-conversation-preparation-composition`
- `npm run check:agent-briefing-composition`
- `npm run check:agent-market-update-preparation`
- `npm run check:market-update-narrative-quality`
- `npm run check:agent-seller-consultation-preparation`
- `npm run check:atlas-cohort-comparative-contract`
- `npm run check:current-competing-listing-context-wave-6`

## Known Open Foundations

Seller content/module expansion:

- Current readiness: ready for next implementation.
- Dependency: shared output foundation.
- Recommended sequence: next.

Seller Agent review/composition UI:

- Current readiness: not implemented.
- Dependency: seller content/module expansion.
- Recommended sequence: after seller content modules.

Narrative composition:

- Current readiness: partial primitives exist.
- Dependency: module expansion and review requirements.
- Recommended sequence: after seller content modules.

Visualization composition:

- Current readiness: partial chart/table concepts only.
- Dependency: narrative/module registry refinement.
- Recommended sequence: after narrative composition.

Print/PDF:

- Current readiness: not implemented.
- Dependency: stable product preview and visual composition.
- Recommended sequence: after Agent review preview.

Share/delivery:

- Current readiness: not authorized.
- Dependency: print/PDF, rights, and delivery authorization.
- Recommended sequence: later Executive gate.

Output versioning/reuse:

- Current readiness: deterministic identity only.
- Dependency: persistence authorization.
- Recommended sequence: later Executive gate.

Buyer/Market/Property/Location extensions:

- Current readiness: product kinds recognized, extensions not implemented.
- Dependency: shared contract plus product-specific content architecture.
- Recommended sequence: after Seller proves content and review pipeline.

Investment and multi-property financial/breakeven contracts:

- Current readiness: financial preparation primitives only.
- Dependency: separate investment output authorization and prohibited-output review.
- Recommended sequence: after core non-investment product family proves composition.

## Next Primary Gate

`READY_FOR_SELLER_PRESENTATION_CONTENT_MODULE_EXPANSION`

Why: the shared output language is now certified, and Seller Presentation is the first admitted consumer. The next highest-value implementation is expanding seller-specific content modules without changing the shared foundation.

What it unlocks:

- richer seller overview modules;
- property-context modules;
- market-position modules;
- competition modules;
- evidence/limitation modules;
- preparation-to-output content mapping.

Expected workstreams:

- Seller content/module architecture;
- Seller module fixtures;
- Seller module checker;
- Seller certification documentation.

Collision boundary:

- No UI activation, PDF, share, persistence, provider calls, CRM/email/customer mutation, pricing recommendation, valuation, ranking, scoring, or seller strategy automation.

## Completion

Completion token: `SHARED_OUTPUT_PRODUCT_SECTION_MODULE_FOUNDATION_CERTIFIED`

Seller presentation status: `AGENT_REVIEW_REQUIRED`
