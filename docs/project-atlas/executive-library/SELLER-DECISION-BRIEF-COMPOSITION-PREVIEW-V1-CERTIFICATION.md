# PROJECT ATLAS - Seller Decision Brief Composition Preview V1 Certification

## Executive Result

`SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_V1` turns the certified Seller Decision Brief foundation into the first Agent-visible Seller Presentation workspace.

Certification status:

`SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_V1_CERTIFIED`

Repository-visible experience:

`/agent/prepare/seller/presentation`

## Starting Truth

Expected prior certified Seller content commit:

`86e3b5fb13301e561701b15c564ccb5b08a6deb8`

Prior gate:

`READY_FOR_SELLER_PRESENTATION_COMPOSITION_REVIEW_EXPERIENCE`

This package consumes:

- `lib/sharedOutputProductComposition.ts`
- `lib/sellerPresentationOutputComposition.ts`
- `lib/sellerDecisionBriefFoundation.ts`

## Implemented Experience

The Agent workspace now contains a bounded Seller Presentation composition/review surface with:

- Product-control top bar
- Deterministic section rail
- Editorial Seller output canvas
- Module inspector
- Agent review mode
- Seller preview mode
- Print preview foundation
- Responsive three-pane, two-pane, and single-column structure
- Evidence, rights, freshness, limitations, and Agent-authorship visibility

The experience is implemented by:

- `lib/sellerDecisionBriefCompositionPreview.ts`
- `components/agent/SellerDecisionBriefCompositionPreview.tsx`
- `app/agent/prepare/seller/presentation/page.tsx`

## Canonical Consumption

The preview is built from `buildSellerDecisionBrief(SELLER_DECISION_BRIEF_REFERENCE_PREPARATION)`.

It does not create a parallel Seller product definition. It consumes the certified Seller Decision Brief sections, modules, evidence references, readiness states, and question coverage.

## Agent Experience Table

| Experience Area | Implemented Component | Canonical Input | Agent Value | Readiness |
|-----------------|-----------------------|-----------------|-------------|-----------|
| Product Header | Top bar / `OutputCover` | `AtlasOutputComposedProduct` | Identifies product, subject, version, as-of, and readiness | Certified |
| Section Navigation | Section rail | `SellerDecisionBrief.sectionRegistry` and composed sections | Deterministic review path | Certified |
| Seller Canvas | Output canvas | Composed Seller sections/modules | Shows what the seller will see | Certified |
| Module Inspector | Inspector pane | Module registry, evidence, inclusion, review state | Explains required input and evidence | Certified |
| Product Readiness | Cover metrics / readiness badge | Product readiness and section states | Shows overall work remaining | Certified |
| Section Readiness | Rail and section header badges | Section/module readiness aggregation | Shows blockers by section | Certified |
| Module Readiness | Module cards and inspector | Module inclusion/review/evidence state | Shows next required action | Certified |
| Agent Review | Review mode | Same composition | Surfaces inputs, limitations, and review state | Certified |
| Seller Preview | Seller preview mode | Same composition | Shows seller-facing editorial frame | Certified |
| Print Preview | Print preview mode / print CSS | Same composition | Establishes print-safe foundation | Certified with PDF held |

## P0 Component Registry

| Component | Seller Module(s) | Canonical Input | Responsive | Print | Reusable Products |
|-----------|------------------|-----------------|------------|-------|-------------------|
| OutputCover | seller-module-decision-snapshot | SELLER_PREPARATION | Yes | Yes | Buyer, Market, Property, Location, Advisory |
| OutputSectionHeader | all sections | SHARED_OUTPUT_SECTION | Yes | Yes | Buyer, Market, Property, Location, Advisory |
| OutputDecisionSnapshot | seller-module-decision-snapshot | AGENT_INPUT | Yes | Yes | Advisory |
| OutputObjectiveCards | seller-module-objectives; seller-module-timing-constraints | SELLER_PREPARATION | Yes | Yes | Advisory |
| OutputPropertyHero | seller-module-property-hero | PROPERTY | Yes | Yes | Property |
| OutputPropertyFactGrid | seller-module-fact-grid | PROPERTY | Yes | Yes | Property |
| OutputLocationMap | seller-module-location-story | LOCATION | Yes | Yes | Location, Property |
| OutputCohortSummary | seller-module-current-market-snapshot | MARKET | Yes | Yes | Market, Buyer |
| OutputMetricCard | seller-module-current-market-snapshot | MARKET | Yes | Yes | Market, Buyer |
| OutputCompetitionMap | seller-module-current-competition | COMPETITION | Yes | Yes | Property, Market |
| OutputPropertyCard | seller-module-current-competition; seller-module-property-hero | PROPERTY | Yes | Yes | Property, Market |
| OutputComparisonMatrix | seller-module-subject-cohort-matrix | COMPETITION | Yes | Yes | Property, Market |
| OutputPositioningMatrix | seller-module-positioning-themes | AGENT_INPUT | Yes | Yes | Advisory |
| OutputPreparationMatrix | seller-module-preparation-plan | SELLER_PREPARATION | Yes | Yes | Advisory |
| OutputPropertyStory | seller-module-property-story; seller-module-asset-plan | AGENT_INPUT | Yes | Yes | Property |
| OutputLaunchTimeline | seller-module-launch-plan | AGENT_INPUT | Yes | Yes | Advisory |
| OutputRecommendationCard | seller-module-recommendation-card | AGENT_INPUT | Yes | Yes | Advisory |
| OutputSellerJourney | seller-module-seller-journey | ADVISORY_HANDOFF | Yes | Yes | Advisory |
| OutputDecisionChecklist | seller-module-next-decisions | SELLER_PREPARATION | Yes | Yes | Advisory |
| OutputEvidencePanel | seller-module-evidence-panel | EVIDENCE_FRESHNESS | Yes | Yes | Advisory, Market, Property, Location |
| OutputSourceNote | all modules | SHARED_OUTPUT_EVIDENCE | Yes | Yes | Buyer, Market, Property, Location, Advisory |
| OutputReadinessBadge | all modules | SHARED_OUTPUT_READINESS | Yes | Yes | Buyer, Market, Property, Location, Advisory |

## Seller Question Coverage

| Seller Question | Rendered Section | Rendered Module | Visual Treatment | Coverage |
|-----------------|------------------|-----------------|------------------|----------|
| What are we deciding? | Executive summary | Decision snapshot | OutputDecisionSnapshot | Strong |
| What will buyers see in my property? | Subject property | Property hero / fact grid / strengths | OutputPropertyHero / OutputPropertyFactGrid | Adequate |
| How does my location affect the sale? | Location | Location story | OutputLocationMap | Partial |
| What market am I entering? | Current market | Current market snapshot | OutputCohortSummary / OutputMetricCard | Adequate |
| What else can buyers choose? | Current competition | Current competition | OutputCompetitionMap / OutputPropertyCard | Adequate |
| How does my property sit in that choice set? | Current competition | Subject cohort matrix | OutputComparisonMatrix | Adequate |
| What positioning choices matter? | Positioning | Positioning themes | OutputPositioningMatrix | Input required |
| What should we prepare? | Preparation | Preparation plan | OutputPreparationMatrix | Input required |
| How will we launch? | Launch | Property story / asset plan / launch plan | OutputPropertyStory / OutputLaunchTimeline | Input required |
| What does my Agent recommend? | Agent recommendation | Recommendation card | OutputRecommendationCard | Input required |
| What happens next? | Next decisions | Seller journey / next decisions | OutputSellerJourney / OutputDecisionChecklist | Input required |
| What evidence supports this? | Evidence appendix | Evidence panel | OutputEvidencePanel / OutputSourceNote | Strong |

## Readiness Grammar

| Readiness State | Visual Treatment | Agent Action | Seller Preview Behavior |
|-----------------|------------------|--------------|-------------------------|
| READY | Green readiness badge | Confirm visible content | Included |
| AGENT_INPUT_REQUIRED | Amber readiness badge | Add or confirm Agent input | Visible with review framing |
| AGENT_REVIEW_REQUIRED | Blue readiness badge | Review facts, limits, and wording | Visible with review framing |
| EVIDENCE_REQUIRED | Red readiness badge | Supply or verify evidence | Held or clearly limited |
| RIGHTS_REQUIRED | Violet readiness badge | Confirm use rights | Held until review clears |
| FRESHNESS_REQUIRED | Violet readiness badge | Confirm as-of posture | Held or visibly dated |
| CONTEXTUAL_OPTIONAL | Neutral readiness badge | Decide inclusion | Optional/contextual |

## View Modes

| Mode | Controls | Evidence Detail | Readiness Detail | Seller Content | Print Behavior |
|------|----------|-----------------|------------------|----------------|----------------|
| AGENT REVIEW | Mode segmented control, section rail, inspector | Full module evidence | Full readiness and next action | Same composition with Agent detail | Screen only |
| SELLER PREVIEW | Same control, same composition | Concise inline evidence | Visible review framing | Editorial seller-facing copy | Screen only |
| PRINT PREVIEW | Same control, same composition | Source/as-of and appendix notes | Static print-safe states | White paper canvas | Print CSS foundation |

## Product-Family Reuse

The visual component registry identifies reuse seams for:

- Buyer Presentation
- Market Report
- Property Analysis
- Location Analysis
- Advisory Briefing

Extension seams are reserved for:

- Investment Property Analysis
- Multi-property financial / breakeven analysis

## Protected Boundaries

This package did not authorize or implement:

- Persistence
- Schema migration
- Provider runtime
- MLS/IRES calls
- Supabase mutation
- Typesense mutation
- Customer mutation
- CRM mutation
- Email/message execution
- PDF generation
- Share-link delivery
- Recommendation automation
- Deployment

## Current Seller Product Readiness

| Area | Status |
|------|--------|
| DOMAIN / COMPOSITION | Certified |
| CONTENT | Substantive foundation certified |
| INTELLIGENCE | Composable with review gates |
| AGENT INPUT | Structured input required |
| EVIDENCE | Partial with explicit gates |
| RIGHTS | Agent-internal and review-gated |
| FRESHNESS | Point-in-time and review-gated |
| AGENT REVIEW | Implemented |
| VISUAL PRESENTATION | Implemented |
| UI | Implemented |
| RESPONSIVE | Structural states implemented |
| ACCESSIBILITY | Semantic structure implemented |
| PRINT PREVIEW | Foundation implemented |
| PDF | Not implemented |
| SHARE / DELIVERY | Not implemented |
| PERSISTENCE / VERSION REUSE | Not implemented |

## Next Seller Gate

`READY_FOR_SELLER_NARRATIVE_STRATEGY_DEPTH`

Why:

The product now has a visible, reusable composition/review experience. The next highest-value gate is deeper Seller narrative and Agent strategy content, still bounded by evidence, rights, freshness, and explicit Agent authorship.

Expected Agent value:

Agents can move from structure review into richer, decision-ready narrative drafting and strategy review.

Expected Seller value:

The brief can explain the property, market, competition, and plan in more useful seller-facing language after Agent input is supplied.

Dependencies:

- Certified composition preview
- Explicit Agent input model
- Continued evidence/freshness/rights gating
- No automated recommendation activation without a later gate

## Next Primary Package Design

| Workstream | Objective | Surfaces | Dependencies | Success Gate | Validation | What It Unlocks |
|------------|-----------|----------|--------------|--------------|------------|-----------------|
| Narrative depth | Add seller-facing narrative adapters | Seller canvas, module inspector | Explicit Agent inputs | Narrative modules render through canonical composition | Narrative checker, typecheck | Better first-read Seller brief |
| Strategy review depth | Expand Agent-authored recommendation and tradeoff review | Recommendation card, positioning matrix | Agent authorship contract | Strategy remains human-authored and review-gated | Review-state checker | Clearer Agent recommendation workflow |
| Market/competition visual depth | Improve factual charts/tables/maps without ranking/scoring | Market, competition, comparison modules | Current market and competition contracts | Visuals remain factual and evidence-aware | Component checker, browser QA | Stronger buyer choice-set explanation |
| Print/PDF readiness design | Define PDF generation and version seams without execution | Print preview, output footer | Composition preview | PDF remains gated until separately authorized | Print contract checker | Later controlled PDF product |

## Certification Artifacts

- `lib/sellerDecisionBriefCompositionPreview.ts`
- `components/agent/SellerDecisionBriefCompositionPreview.tsx`
- `app/agent/prepare/seller/presentation/page.tsx`
- `scripts/checkSellerDecisionBriefCompositionPreview.ts`
- `app/globals.css`
- `package.json`

Validation command:

`npm run check:seller-decision-brief-composition-preview`

## Validation Results

- `npm run check:seller-decision-brief-composition-preview`: PASS
- `npm run check:seller-decision-brief-foundation`: PASS
- `npm run check:shared-output-product-section-module-foundation`: PASS
- `npm run check:agent-operating-shell`: PASS
- `./node_modules/.bin/jiti scripts/checkAgentWorkspaceHome.ts`: PASS
- `npm run check:agent-post-login-return-path`: PASS
- `npm run check:agent-seller-consultation-preparation`: PASS
- `npm run check:agent-property-conversation-preparation-experience`: PASS
- `npm run check:agent-place-conversation-preparation-experience`: PASS
- `npm run check:market-conversation-experience`: PASS
- `npm run check:atlas-cohort-comparative-contract`: PASS
- `npm run check:current-competing-listing-context-wave-6`: PASS
- `./node_modules/.bin/jiti scripts/checkProfessionalHandoffCohesion.ts`: PASS
- `npm run typecheck`: PASS
- `npm run lint`: PASS with pre-existing warnings outside this package
- `npm run build`: PASS with pre-existing warnings outside this package
- `git diff --check`: PASS

Local HTTP verification:

- Anonymous `GET /agent/prepare/seller/presentation`: `303` to `/agent/login?next=/agent/prepare/seller/presentation`
- Authenticated deterministic Agent session `GET /agent/prepare/seller/presentation`: `200`
- Rendered SSR content contained 13 section rail items, 13 canvas sections, 19 output modules, Seller preview control, print preview control, evidence/as-of notes, and protected-boundary copy.

Browser/screenshot verification note:

The current Codex tool context did not expose a callable browser/screenshot tool and the repository does not include Playwright. Verification therefore used the localhost-only Next dev server and HTTP-rendered content checks rather than visual screenshots.
