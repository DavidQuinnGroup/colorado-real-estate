# PROJECT ATLAS - Seller Decision Brief V2 Certification

## Executive Result

`SELLER_DECISION_BRIEF_V2` extends the certified Seller Decision Brief composition preview into a deeper Seller narrative and Agent strategy review product.

Certification status:

`SELLER_DECISION_BRIEF_V2_CERTIFIED`

Narrative contract:

`SELLER_DECISION_BRIEF_NARRATIVE_V1`

Strategy contract:

`SELLER_DECISION_BRIEF_STRATEGY_V1`

Repository-visible experience:

`/agent/prepare/seller/presentation`

## Starting Truth

Expected prior certified Seller presentation commit:

`dc1f29e5507b7789be4284bab22c729ad3a451d8`

Prior gate:

`READY_FOR_SELLER_NARRATIVE_STRATEGY_DEPTH`

This package consumes:

- `lib/sharedOutputProductComposition.ts`
- `lib/sellerDecisionBriefFoundation.ts`
- `lib/sellerDecisionBriefCompositionPreview.ts`
- `components/agent/SellerDecisionBriefCompositionPreview.tsx`

## Implemented Experience

Seller Decision Brief V2 adds:

- Reusable narrative-unit contract
- Evidence-linked Seller story layers
- Property, location, market, and competition interpretation
- Positioning, preparation, launch, recommendation, alternative, tradeoff, and next-decision strategy records
- Section-transition bridge messages
- Agent-authorship and review-state visibility
- Product-family reuse map for later Buyer, Market, Property, Location, Advisory, investment, and financial products

The implementation remains deterministic, inert, and review-gated.

## Narrative Registry

| Narrative Kind | Section | Purpose | Readiness |
|----------------|---------|---------|-----------|
| EXECUTIVE_SUMMARY | Executive summary | States objective, evidence posture, recommendation boundary, and next decision story | Agent review |
| PROPERTY_STORY | Subject property | Turns verified property facts into review-gated Seller narrative | Evidence required |
| LOCATION_STORY | Location | Connects place context to the property story without unsupported claims | Agent input |
| MARKET_INTERPRETATION | Current market | Interprets point-in-time market context for preparation only | Agent review |
| COMPETITION_INTERPRETATION | Current competition | Frames buyer choice context without ranking or scoring | Agent review |
| POSITIONING_INTERPRETATION | Positioning | Converts evidence into Agent-authored positioning themes | Agent input |
| PREPARATION_RATIONALE | Preparation | Explains verification, documentation, staging, and handoff actions | Evidence required |
| LAUNCH_STRATEGY | Launch | Connects asset priorities, timing, exposure, and review checkpoints | Agent input |
| RECOMMENDATION_RATIONALE | Agent recommendation | Maps recommendation, rationale, evidence, alternatives, tradeoffs, and next action | Recommendation review |
| ALTERNATIVE_STRATEGY | Agent recommendation | Makes alternate strategy paths visible and reviewable | Strategy review |
| NEXT_DECISION | Next decisions | Converts recommendation into owned seller decisions and dependencies | Agent input |
| SECTION_TRANSITION | Cross-section | Bridges each section into a coherent decision story | Agent review |
| EVIDENCE_EXPLANATION | Evidence appendix | Explains source, as-of, rights, freshness, assumptions, and limitations | Freshness required |

## Seller Story

| Story Layer | Seller Question | Evidence Anchor | Agent Role |
|-------------|-----------------|-----------------|------------|
| Objectives | What are we trying to accomplish? | Seller objectives | Frame the whole brief around objective and timing |
| Property | What makes my property distinctive? | Subject property facts | Lead with verified facts and review-gated strengths |
| Location | How does my location shape the sale? | Place context | Add context without steering or unsupported claims |
| Market | What market are we entering? | Current market context | Use point-in-time evidence for orientation |
| Competition | What choices will buyers see? | Current competition facts | Explain buyer alternatives factually |
| Positioning | Where does my property stand out? | Property and competition evidence | Choose Agent-authored emphasis |
| Preparation | What should we prepare? | Documentation and condition evidence | Prioritize work that improves readiness |
| Launch | How should we present and launch? | Asset and launch plan | Sequence story, assets, timing, and review checkpoints |
| Recommendation | What strategy does my Agent recommend? | Recommendation support map | Keep recommendation human-authored and auditable |
| Next Decisions | What do I need to decide next? | Next-decision record | Connect owner, dependency, and next action |

## Strategy Depth

| Strategy Element | Objective | Inputs | Review State |
|------------------|-----------|--------|--------------|
| POSITIONING | Lead with verified differentiators and supporting context | Property story, location story, competition themes, Agent positioning themes | Agent review |
| PREPARATION | Turn incomplete context into verification and preparation actions | Condition evidence, document questions, Agent preparation plan | Agent review |
| LAUNCH | Translate story and asset priorities into launch sequence and checkpoint | Property story, asset plan, launch plan, seller journey | Agent review |
| RECOMMENDATION | Make the Agent recommendation auditable through rationale, alternatives, tradeoffs, dependencies, and next action | Recommendation card, evidence map, professional handoff | Agent review |

## Recommendation Evidence Map

| Domain | Evidence Role |
|--------|---------------|
| Property | Subject facts and condition/improvement evidence support the property story |
| Location | Location context supports the place narrative without unsupported desirability claims |
| Market | Current market context supports timing and orientation, not automated pricing |
| Competition | Current competing listing context supports buyer-choice explanation |
| Agent Input | Agent recommendation, positioning themes, and launch plan provide human-authored judgment |
| Professional Handoff | Document verification and financial preparation remain routed to gated review |

## Section Transitions

| From | To | Seller Question |
|------|----|-----------------|
| Executive summary | Context | What are we trying to accomplish? |
| Context | Subject property | What makes my property distinctive? |
| Subject property | Location | How does my location shape the sale? |
| Location | Current market | What market are we entering? |
| Current market | Current competition | What choices will buyers see? |
| Current competition | Positioning | Where does my property stand out? |
| Positioning | Preparation | What requires context? |
| Preparation | Launch | How should we present and launch? |
| Launch | Agent recommendation | What strategy does my Agent recommend? |
| Agent recommendation | Next decisions | What do I need to decide next? |
| Next decisions | Evidence appendix | What evidence supports this? |

## V1 to V2 Trace

| V1 Module Family | V2 Extension | Seller Value |
|------------------|--------------|--------------|
| Decision snapshot | Executive summary | The brief begins with a clear decision story |
| Objectives | Executive summary | Seller goals remain explicit before strategy |
| Timing constraints | Executive summary | Timing remains context, not automatic advice |
| Property hero | Property story | Verified property identity supports the first read |
| Fact grid | Property story | Facts remain separated from Agent interpretation |
| Strengths / context | Property story | Differentiators are review-gated |
| Location story | Location story | Place context stays bounded and evidence-aware |
| Current market snapshot | Market interpretation | Market context is explained with limitations |
| Current competition | Competition interpretation | Buyer alternatives are shown without ranking |
| Subject cohort matrix | Competition interpretation | Comparison context remains factual |
| Positioning themes | Positioning interpretation | Agent-authored emphasis becomes visible |
| Preparation plan | Preparation rationale | Work items gain rationale, owner, and dependency |
| Property story | Launch strategy | Story and assets inform launch sequencing |
| Asset plan | Launch strategy | Presentation assets are tied to review readiness |
| Launch plan | Launch strategy | Timing and exposure remain Agent-authored |
| Recommendation card | Recommendation rationale | Recommendation gains evidence, alternatives, tradeoffs, and next action |
| Seller journey | Next decision | Journey steps become owned decisions |
| Next decisions | Next decision | Seller action and dependencies are explicit |
| Evidence panel | Evidence explanation | Source, as-of, rights, freshness, and limitations remain visible |

## Seller Question Coverage

| Question | Coverage |
|----------|----------|
| What are we trying to accomplish? | Strong |
| What makes my property distinctive? | Adequate |
| How does my location shape the sale? | Partial |
| What market are we entering? | Adequate |
| What choices will buyers see? | Adequate |
| How does my property compare to those choices? | Adequate |
| Where does my property stand out? | Input required |
| What requires context? | Input required |
| What should we prepare? | Input required |
| How should we present and launch? | Input required |
| What strategy does my Agent recommend? | Input required |
| Why? | Adequate |
| What alternatives exist? | Adequate |
| What are the tradeoffs? | Adequate |
| What do I need to decide next? | Strong |
| What evidence supports this? | Strong |

## Readiness Table

| Unit | Status |
|------|--------|
| Product | Agent review required |
| Content | V2 narrative strategy depth implemented |
| Narrative | Evidence-linked Agent review required |
| Property story | Implemented |
| Location story | Implemented |
| Market interpretation | Implemented |
| Competition interpretation | Implemented |
| Positioning | Implemented; Agent input required |
| Preparation strategy | Implemented; Agent input required |
| Launch strategy | Implemented; Agent input required |
| Recommendation | Implemented; Agent recommendation review required |
| Alternatives | Implemented |
| Next decisions | Implemented; Agent input required |
| Evidence | Partial with explicit gates |
| Rights | Agent-internal and review-gated |
| Freshness | Point-in-time and review-gated |
| Agent review | Implemented |
| Seller preview | Implemented |
| Print preview | Foundation implemented |
| PDF | Not implemented |
| Share delivery | Not implemented |
| Financial decision preparation | Separate foundation not integrated |
| Pricing decision architecture | Next gate |

## Product-Family Reuse

| Primitive | Reuse Classification | Product Families |
|-----------|----------------------|------------------|
| NARRATIVE CONTRACT | Directly reusable | Buyer, Market, Property, Location, Advisory |
| SECTION TRANSITION | Directly reusable | Buyer, Market, Property, Location, Advisory |
| EVIDENCE-LINKED INTERPRETATION | Audience transformable | Buyer, Market, Property, Location |
| POSITIONING / STRATEGY THEME | Product-specific extension | Advisory, Property |
| ALTERNATIVE STRATEGY | Directly reusable | Investment property, multi-property financial breakeven, Advisory |
| RECOMMENDATION | Audience transformable | Advisory, Property, Investment |
| RECOMMENDATION EVIDENCE MAP | Directly reusable | Advisory, Property, Investment |
| NEXT DECISION | Directly reusable | Buyer, Advisory, multi-property financial breakeven |

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
- Automated pricing recommendation
- Automated strategy recommendation
- Deployment

## Current Seller Product Readiness

| Area | Status |
|------|--------|
| SELLER PRODUCT STATUS | SELLER_DECISION_BRIEF_V2_NARRATIVE_STRATEGY_DEPTH_CERTIFIED_PRICING_FINANCIAL_PDF_SHARE_HELD |
| DOMAIN / COMPOSITION | Certified |
| NARRATIVE DEPTH | Certified for Agent review |
| STRATEGY DEPTH | Certified for Agent review |
| RECOMMENDATION DEPTH | Certified with Agent authorship required |
| PRICING | Not implemented |
| FINANCIAL DECISION PREPARATION | Separate foundation not integrated |
| PDF / SHARE / DELIVERY | Not implemented |
| PERSISTENCE / VERSION REUSE | Not implemented |

## Next Seller Gate

`READY_FOR_SELLER_PRICING_POSITIONING_DECISION_ARCHITECTURE`

Why:

The Seller brief now has certified narrative and strategy depth. The next highest-value bounded package is to define pricing-positioning decision architecture so Agent-reviewed pricing, positioning, and tradeoff language can be represented without automated recommendation activation.

Expected Agent value:

Agents can inspect how price-positioning options, market context, competition, preparation costs, and seller objectives fit together before any seller-facing pricing recommendation is authorized.

Expected Seller value:

The brief can later show clearer options and tradeoffs around pricing and positioning, still under Agent authorship and review gates.

Dependencies:

- Certified Seller Decision Brief V2 narrative strategy depth
- Explicit Agent pricing input model
- Continued evidence/freshness/rights gating
- No automated valuation, pricing recommendation, financial calculation, PDF, or share delivery without later authorization

## Next Primary Package Design

| Workstream | Objective | Surfaces | Dependencies | Success Gate | Validation | What It Unlocks |
|------------|-----------|----------|--------------|--------------|------------|-----------------|
| Pricing-positioning option grammar | Define review-gated price/position choices | Recommendation card, positioning matrix | Agent pricing input | Options are represented without automation | Pricing architecture checker | Seller-ready pricing discussion foundation |
| Tradeoff evidence map | Tie pricing-positioning choices to evidence domains | Recommendation evidence map | Market, competition, property, objectives | Tradeoffs are auditable | Evidence checker | Clearer Agent review of options |
| Financial dependency seam | Connect but do not activate financial preparation | Recommendation and next decisions | Separate financial foundation | Financial status remains held | Boundary checker | Later financial scenario package |
| Seller decision workflow | Add next-decision structure for pricing approval | Next decisions | Agent review | Seller decisions have owner, dependency, and action | UI checker | Better consultation workflow |

## Validation Results

Validated in this package:

| Gate | Result |
|------|--------|
| `npm run check:seller-decision-brief-v2` | PASS |
| `npm run check:seller-decision-brief-composition-preview` | PASS |
| `npm run check:seller-decision-brief-foundation` | PASS |
| `npm run check:shared-output-product-section-module-foundation` | PASS |
| `npm run check:market-update-narrative-quality` | PASS |
| `npm run check:agent-seller-consultation-preparation` | PASS |
| `npm run check:agent-property-conversation-preparation-experience` | PASS |
| `npm run check:agent-place-conversation-preparation-experience` | PASS |
| `npm run check:market-conversation-experience` | PASS |
| `npm run check:atlas-cohort-comparative-contract` | PASS |
| `npm run check:current-competing-listing-context-wave-6` | PASS |
| `./node_modules/.bin/jiti scripts/checkProfessionalHandoffCohesion.ts` | PASS |
| `npm run check:agent-operating-shell` | PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS with pre-existing warnings outside this package |
| `npm run build` | PASS with pre-existing lint warnings outside this package |
| `git diff --check` | PASS |

Additional structural route verification:

| Check | Result |
|-------|--------|
| Unauthenticated `GET /agent/prepare/seller/presentation` | `303 See Other` to `/agent/login?next=%2Fagent%2Fprepare%2Fseller%2Fpresentation` |
| Authenticated Agent session `GET /agent/prepare/seller/presentation` | `200` |
| `seller-brief-v2-story-flow` | 1 rendered marker |
| `seller-brief-v2-section-narrative` | 12 rendered markers |
| `seller-brief-v2-section-transition` | 11 rendered markers |
| `seller-brief-v2-module-narrative` | 16 rendered markers |
| `SELLER_DECISION_BRIEF_V2` | Rendered |

Professional handoff note:

`npm run check:professional-handoff-cohesion` was also attempted. Its `worker:build` completed after repository write permission was granted, then the compiled Node ESM runner stopped on the repository's existing extensionless import resolution issue for `dist/lib/reieDecisionIntelligenceCohesion`. The direct `jiti` checker path passed and no V2 source defect was indicated.
