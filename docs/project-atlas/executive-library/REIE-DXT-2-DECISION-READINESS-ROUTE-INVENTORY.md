# REIE DXT 2 Decision Readiness Route Inventory

Status: `DXT_2_DECISION_READINESS_ROUTE_INVENTORY_READY`

Program: `REIE_DXT_2_DECISION_READINESS_DEPTH`

Planning type: documentation-only route-readiness inventory.

Runtime authorization: `false`

Provider activation: `false`

Persistence, telemetry, CRM, email, scheduling, AI advice, and shared runtime authorization: `false`

## Inventory Question

Does each certified experience help the customer become sufficiently prepared to make the next real decision?

## Maturity Scale

- `FOUNDATIONAL`: route has a clear public purpose but still needs stronger decision-readiness support.
- `FUNCTIONAL`: route supports the decision and preserves boundaries, but a material readiness gap remains.
- `DECISION_READY`: route supports the next decision with evidence, verification prompts, boundaries, and direct-entry clarity.
- `ADVANCED_DECISION_READY`: route has strong readiness support plus explicit confidence, evidence, unknown, and verification treatment.
- `EXTERNAL_DEPENDENCY_HOLD`: route readiness depends on external review, provider activation, or approved operational values.
- `PROTECTED_BOUNDARY_HOLD`: route cannot deepen without risking regulated, fair-housing, privacy, financial, valuation, legal, tax, or professional boundaries.

## Route Readiness Inventory

| Route | Route owner | Governing decision | Current maturity | Strongest capability | Material weakness | Evidence available | Evidence missing | Verification prompts | Confidence gap | Direct-entry finding | Likely runtime ownership | Dependencies | Disposition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Homepage invitation | Where should I begin? | `DECISION_READY` | Clear Search-first invitation with Buyer and Seller preparation paths. | Does not need deeper readiness beyond routing into decision surfaces. | Journey entry points, REIE principles, Search preview, limits. | Route-specific evidence belongs downstream. | Verify property and market facts before relying. | Low; confidence belongs to downstream routes. | Strong. | `app/page.tsx` inspection-only. | None. | `NO_ACTION_REQUIRED` |
| `/search` | Search decision workspace | Which active properties deserve closer review? | `FUNCTIONAL` | Active inventory, map/list workspace, city and market authority links. | Search does not yet show a route-local readiness layer for result confidence, missing listing facts, or comparison threshold. | Listing facts, map context, city filters, authority links. | Per-result evidence completeness and verification thresholds. | Verify listing details, disclosures, condition, taxes, HOA, insurance, and advisor context. | Medium; result-level confidence is not deeply organized. | Strong. | `app/search/page.tsx` and Search components inspection-only. | Search data already present; no new provider authorized. | `CONFIDENCE_DEPTH_LATER` |
| representative `/properties/[id]` | Property evaluation | Is this property worth more time and what should I verify next? | `FUNCTIONAL` | Rich public listing facts, construction questions, market path, Search return, and property/advisory/contact handoff. | Highest material gap: evidence confidence, missing evidence, assumptions, and next-decision threshold are spread across sections rather than summarized into one readiness frame. | Price, status, location, photos, year built, property type, lot size, public listing remarks, related links, market path, Product 3.1. | Source documents, inspection, HOA, title, insurance, taxes, permits, systems records, financing assumptions. | High-value gap; confidence is present as boundary language but not organized by input quality and completeness. | Strong; property renders without prior Search context. | `app/properties/[id]/page.tsx` future route-local ownership. | Existing listing facts only. | `CANDIDATE_FIRST_PHASE` |
| `/buy` | Buyer preparation | Am I prepared to buy? | `DECISION_READY` | Buyer preparation, financing assumptions, verification questions, and professional handoff are clear. | Could later deepen readiness by separating assumptions, evidence, and lender/professional review thresholds. | Buyer themes, financing education, market/search/property continuations. | Customer-specific lender facts are not public and should not be collected here. | Lender, tax, insurance, title, inspection, property records, legal review. | Medium; financial confidence must remain educational. | Strong. | `app/buy/page.tsx` future route-local ownership only if authorized. | No new financial provider or qualification logic. | `PREPARATION_DEPTH_LATER` |
| `/sell` | Seller preparation | What must be understood before market exposure? | `DECISION_READY` | Seller evidence, condition, pricing-context boundaries, Home Worth, Seller Review, and professional handoff are clear. | Could later deepen readiness by organizing seller evidence completeness and valuation-boundary confidence. | Preparation themes, seller questions, Home Value Estimator context, market/search continuations. | Property records, condition documentation, professional pricing review. | Condition, records, market alternatives, title, HOA, insurance, tax, legal, advisor review. | Medium; valuation confidence must not become price certainty. | Strong. | `app/sell/page.tsx` future route-local ownership only if authorized. | No estimator or valuation logic changes. | `PREPARATION_DEPTH_LATER` |
| `/market` | Market briefing | Which market evidence should guide the next investigation? | `DECISION_READY` | Broad market briefing, Product 3, Search dominance, city/neighborhood/property ownership. | Could deepen source freshness and evidence confidence, but not first priority after continuity closure. | City counts, neighborhood paths, certified guides, directional signals. | Additional provider-level market provenance is not authorized. | Verify property facts and professional interpretation before strategy. | Medium; confidence is directional and route-level. | Strong. | `app/market/page.tsx` future route-local ownership. | Provider activation hold for new evidence. | `EVIDENCE_ORGANIZATION_LATER` |
| representative `/market/[city]` | City Market evidence | What is happening in this city market and what should I investigate next? | `ADVANCED_DECISION_READY` | City decision guide, current signals, evidence, neighborhood paths, directional-versus-verified treatment. | Deeper freshness/provenance could improve trust but may depend on governed source expansion. | City stats, market experience, neighborhood count, decision guide content, Product 3. | More granular source provenance and update cadence. | Verify neighborhood, property, financing, legal, tax, and professional assumptions. | Medium-low; confidence boundaries are explicit. | Strong. | `app/market/[city]/page.tsx` future route-local ownership. | New providers not authorized. | `DATA_DEPENDENCY_HOLD` |
| representative `/market/[city]/[slug]` | Neighborhood place orientation | What kind of place is this and what should I verify next? | `ADVANCED_DECISION_READY` | Neutral place orientation, search/property paths, Product 3, fair-housing boundaries, verification prompts. | Further depth risks fair-housing and suitability boundaries unless route-local and non-ranking. | Place anchor, housing pattern, search path, resilience prompts, verification questions. | Property-specific facts and external data sources. | Verify address-level condition, access assumptions, insurance, records, and professional review. | Medium-low; confidence is bounded by non-ranking posture. | Strong. | `app/market/[city]/[slug]/page.tsx` future route-local ownership. | Fair-housing boundary hold for ranking/suitability. | `PROTECTED_BOUNDARY_HOLD` |
| `/contact` | Contact initiation | What is the simplest appropriate way to begin this conversation? | `DECISION_READY` | Clear route-choice model, minimum/optional context, privacy and professional boundaries, Advisory integration. | No deeper readiness needed until operational contact values are approved. | Route choices, no generic form, no hidden context. | Public phone/office/branded email pending approved values. | Choose specialized property or market workflow when relevant. | Low; Contact should not become a preparation manual. | Strong. | `app/contact/page.tsx` inspection-only. | `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`. | `EXTERNAL_DEPENDENCY_HOLD` |
| `/contact#advisory-readiness` | Advisory preparation hosted on Contact | What should I understand and prepare before beginning a focused professional conversation? | `DECISION_READY` | Preparation layer distinguishes Advisory from Contact and preserves no-form behavior. | Further depth should happen on source decision surfaces first. | Preparation themes, evidence reviewed, professional-boundary language. | Customer-specific private context cannot be transferred automatically. | Bring evidence, assumptions, and questions to discussion. | Low. | Strong. | `components/AdvisoryHandoffGuide.tsx` inspection-only. | None. | `NO_ACTION_REQUIRED` |
| `/grand-plan` | Grand Plan intake | What priorities and life context should shape the first useful conversation? | `FUNCTIONAL` | Priority and place intake explains context before advisor follow-up. | Contains operational intake and personal context, so DXT 2 depth should not start here. | Priorities, places, timing, ownership goal, advisor follow-up boundary. | Private customer details cannot be inspected or reused in this planning session. | Verify representation, privacy, and relationship before confidential detail. | Medium; readiness depends on submitted context. | Strong. | `app/grand-plan/page.tsx` inspection-only. | Form/CRM/email boundaries. | `PROTECTED_BOUNDARY_HOLD` |
| `/home-worth` | Seller value-context destination | What is my home worth and what should be prepared before seller review? | `DECISION_READY` | Strong valuation boundary, seller-readiness structure, no instant value claim. | Deeper readiness must avoid valuation certainty or automated pricing. | Value factors, confidence inputs, seller review path, Home Value Estimator context. | Professional pricing review and property records. | Verify property condition, competition, timing, legal/tax/title/insurance. | Medium; valuation confidence cannot become price output. | Strong. | `app/home-worth/page.tsx` inspection-only unless separately authorized. | Valuation and form boundary. | `PROTECTED_BOUNDARY_HOLD` |
| `/compare` | Cross-city comparison | Which certified market contexts should I compare without ranking cities? | `DECISION_READY` | Explicit non-ranking comparison, no personalization, no storage, no scoring. | Further depth could create ranking pressure and should not be first. | Certified market contexts, selected city comparison, maturity labels as evidence posture. | No customer fit inputs should be added automatically. | Verify city, neighborhood, property, and professional assumptions downstream. | Medium-low; mature boundary language exists. | Strong, including empty state. | `app/compare/page.tsx` inspection-only. | Fair-housing and ranking boundaries. | `PROTECTED_BOUNDARY_HOLD` |

## Common Evidence Gaps

- Property-level public facts are strong, but evidence quality and completeness are not yet summarized as a single decision-readiness frame.
- Search result confidence is not deeply organized, but Search changes carry broader runtime and map/list risk.
- Buyer and Seller routes already name preparation questions; later depth should avoid creating financial qualification or valuation certainty.
- Market, City Market, and Neighborhood already handle directional-versus-verified context; new provider provenance remains unauthorized.
- Contact and Advisory are sufficiently clear and should not become dense evidence pages.

## Candidate First Phase Finding

`PROPERTY_DECISION_READINESS_DEPTH`

Rationale:

Property is the highest-value first DXT 2 phase because it is the route where a customer most directly decides whether to spend more time, ask a property-specific question, tour, compare, or prepare a professional conversation. It can use existing public listing facts and existing Product 3.1 evidence without new providers, persistence, AI, telemetry, Search changes, or shared runtime abstractions.

## Protected Boundary Findings

- No numeric customer, property, market, neighborhood, fit, investment, or lead score is authorized.
- No prediction, appreciation probability, buy/sell recommendation, suitability conclusion, affordability conclusion, lending approval, appraisal, valuation certainty, legal advice, tax advice, or automated professional advice is authorized.
- No protected-class steering, demographic suitability, neighborhood ranking, safety conclusion, school-quality conclusion, provider activation, persistence, localStorage, cookies, telemetry, CRM enrichment, email, scheduling, or hidden customer profile is authorized.
- Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.

## Next Gate

`READY_FOR_REIE_DXT_2_PROPERTY_DECISION_READINESS_DEPTH_BOUNDED_IMPLEMENTATION_AUTHORIZATION`
