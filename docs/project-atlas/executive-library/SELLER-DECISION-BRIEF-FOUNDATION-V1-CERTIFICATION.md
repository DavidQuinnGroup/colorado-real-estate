# PROJECT ATLAS Seller Decision Brief Foundation V1 Certification

## Certification

Status: `SELLER_DECISION_BRIEF_FOUNDATION_V1_CERTIFIED`

Content version: `SELLER_DECISION_BRIEF_FOUNDATION_V1`

Shared foundation: `PROJECT_ATLAS_SHARED_OUTPUT_PRODUCT_SECTION_MODULE_FOUNDATION_CERTIFIED`

Next gate: `READY_FOR_SELLER_PRESENTATION_COMPOSITION_REVIEW_EXPERIENCE`

This certification advances Seller Presentation from shared composition architecture into the first substantive Seller decision-product content foundation. It remains inert repository-local domain, adapter, fixture, checker, and documentation work. No UI, route, API, schema, persistence, provider call, CRM/email/customer mutation, PDF, share, or deployment is activated.

## Product Chain

`SELLER PREPARATION -> SELLER OUTPUT PRODUCT -> SELLER SECTION -> SELLER MODULE -> ATLAS INTELLIGENCE / AGENT INPUT -> EVIDENCE / FRESHNESS / RIGHTS -> CONTENT QA -> AGENT REVIEW -> SELLER DECISION BRIEF READINESS`

Canonical primitives:

- Seller preparation: `lib/agent-advisory-workbench/agentSellerConsultationPreparation.ts`
- Seller output product: `lib/sellerPresentationOutputComposition.ts`
- Seller Decision Brief content: `lib/sellerDecisionBriefFoundation.ts`
- Shared output product: `lib/sharedOutputProductComposition.ts`
- Content QA/checker: `scripts/checkSellerDecisionBriefFoundation.ts`

## Section Registry

Implemented V1 sections:

1. `seller-brief-executive-summary`
2. `seller-brief-context`
3. `seller-brief-property`
4. `seller-brief-location`
5. `seller-brief-market`
6. `seller-brief-competition`
7. `seller-brief-positioning`
8. `seller-brief-preparation`
9. `seller-brief-launch`
10. `seller-brief-recommendations`
11. `seller-brief-timeline`
12. `seller-brief-next-decisions`
13. `seller-brief-evidence-appendix`

## Module Registry

Implemented V1 modules:

- `seller-module-decision-snapshot`
- `seller-module-objectives`
- `seller-module-timing-constraints`
- `seller-module-property-hero`
- `seller-module-fact-grid`
- `seller-module-property-strengths`
- `seller-module-location-story`
- `seller-module-current-market-snapshot`
- `seller-module-current-competition`
- `seller-module-subject-cohort-matrix`
- `seller-module-positioning-themes`
- `seller-module-preparation-plan`
- `seller-module-property-story`
- `seller-module-asset-plan`
- `seller-module-launch-plan`
- `seller-module-recommendation-card`
- `seller-module-seller-journey`
- `seller-module-next-decisions`
- `seller-module-evidence-panel`

## Adapter Families

Seller Preparation:

- Source: `lib/agent-advisory-workbench/agentSellerConsultationPreparation.ts`
- Feeds objectives, timing, preparation, launch, and next decisions.

Property:

- Source: `lib/agent-advisory-workbench/agentPropertyConversationPreparation.ts`
- Feeds property hero, fact grid, property strengths, and property story.

Location:

- Source: `lib/agent-advisory-workbench/agentPlaceConversationPreparation.ts`
- Feeds location story.

Market:

- Source: `lib/agent-advisory-workbench/marketConversationExperience.ts`
- Feeds current market snapshot.

Competition:

- Source: `lib/agentCurrentCompetingListingContext.ts`
- Feeds current competition and subject cohort matrix.

Agent Input:

- Source: explicit Agent input contract.
- Feeds decision snapshot, positioning themes, asset plan, recommendation card, and seller journey.

Evidence/Freshness:

- Source: `lib/sharedOutputProductComposition.ts#AtlasOutputEvidenceReference`
- Feeds evidence panel.

Advisory Handoff:

- Source: `lib/professionalHandoffCohesion.ts`
- Feeds recommendation, journey, and evidence panel.

## Seller Question Coverage

The content foundation covers:

- What are we deciding?
- What will buyers see in my property?
- How does my location affect the sale?
- What market am I entering?
- What else can buyers choose?
- How does my property sit in that choice set?
- What positioning choices matter?
- What should we prepare?
- How will we launch?
- What does my Agent recommend?
- What happens next?
- What evidence supports this?

Coverage is deterministic and intentionally review-gated where Agent input is required.

## Separation Model

SOURCE FACT: `SellerDecisionBriefContentClassification` value `SOURCE_FACT`, carried by property and factual modules.

ATLAS INTELLIGENCE / CALCULATION: value `ATLAS_INTELLIGENCE`, carried by market and property-derived modules.

ATLAS ANALYSIS REFERENCE: value `ATLAS_ANALYSIS_REFERENCE`, carried by current competition and cohort matrix modules.

AGENT INTERPRETATION: value `AGENT_INTERPRETATION`, carried by objectives, positioning, preparation, launch, journey, and next decision modules.

AGENT RECOMMENDATION: value `AGENT_RECOMMENDATION`, carried only by `seller-module-recommendation-card`.

ASSUMPTION: value `ASSUMPTION`, carried by timing and constraints.

LIMITATION: value `LIMITATION`, carried by the evidence panel.

PROFESSIONAL HANDOFF: value `PROFESSIONAL_HANDOFF`, available for advisory handoff integration.

## Readiness

Current Seller Decision Brief product readiness: `AGENT_REVIEW_REQUIRED`

Content readiness: `SUBSTANTIVE_CONTENT_FOUNDATION`

Intelligence readiness: `COMPOSABLE_WITH_REVIEW_GATES`

Agent input readiness: `STRUCTURED_AGENT_INPUT_REQUIRED`

Evidence readiness: `PARTIAL_WITH_EXPLICIT_GATES`

Rights readiness: `AGENT_INTERNAL_AND_REVIEW_GATED`

Freshness readiness: `POINT_IN_TIME_AND_REVIEW_GATED`

Visual presentation readiness: `NOT_IMPLEMENTED`

UI readiness: `NOT_IMPLEMENTED`

Print/PDF readiness: `NOT_IMPLEMENTED`

Version/reuse readiness: `DETERMINISTIC_CONTENT_VERSION_ONLY`

## Product-Family Reuse

Reusable module/adapters:

- Market snapshot patterns are reusable by Buyer Presentation and Market Report.
- Competition/cohort matrix patterns are reusable by Property Analysis and Market Report.
- Property hero/fact grid patterns are reusable by Property Analysis.
- Location story patterns are reusable by Location Analysis and Property Analysis.
- Evidence panel patterns are reusable by Advisory Briefing, Market Report, Property Analysis, and Location Analysis.
- Agent-input and professional-handoff patterns are reusable by Advisory Briefing.

Future extension seams:

- Investment Property Analysis can reuse evidence panel and Agent-input separation but requires a separate investment output contract.
- Multi-Property Financial/Breakeven Analysis can reuse module/readiness patterns but requires financial/breakeven contract authorization.

## Validation

Primary check:

`npm run check:seller-decision-brief-foundation`

Relevant existing checks:

- `npm run check:shared-output-product-section-module-foundation`
- `npm run check:agent-seller-consultation-preparation`
- `npm run check:agent-property-conversation-preparation-experience`
- `npm run check:agent-place-conversation-preparation-experience`
- `npm run check:market-conversation-experience`
- `npm run check:atlas-cohort-comparative-contract`
- `npm run check:current-competing-listing-context-wave-6`
- `npm run typecheck`

## Scope Boundary

This package does not authorize or perform:

- UI activation;
- print/PDF;
- share/delivery;
- persistence/version store;
- provider/MLS/IRES/Supabase/Typesense calls;
- schema migration;
- CRM/email/customer mutation;
- pricing/valuation/strategy automation;
- ranking/scoring;
- deployment.

## Next Package

`READY_FOR_SELLER_PRESENTATION_COMPOSITION_REVIEW_EXPERIENCE`

Expected next workstreams:

1. Agent-facing Seller Decision Brief review surface.
2. Module status/review controls.
3. Evidence/freshness/rights review panel.
4. Visual information design integration.

The next package should make the certified composition tangible to the Agent without reconstructing business logic.

## Completion

Completion token: `SELLER_DECISION_BRIEF_FOUNDATION_V1_CERTIFIED`
