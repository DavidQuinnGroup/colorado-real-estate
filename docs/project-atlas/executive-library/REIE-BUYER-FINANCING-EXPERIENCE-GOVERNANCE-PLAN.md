# PROJECT ATLAS(TM) REIE Buyer Financing Experience Governance Plan

Program: REIE Buyer Financing Readiness(TM)

Subprogram: Mortgage Calculator Governance

Phase: Bounded Product Planning

Planning date: August 1, 2026

Repository baseline reviewed: `ca26a019a1b2e8bdad1c1ffe5f13c3ffa20f7925`

Planning status: `REIE_BUYER_FINANCING_EXPERIENCE_READY_FOR_IMPLEMENTATION_AUTHORIZATION`

Selected next gate: `READY_FOR_REIE_BUYER_FINANCING_DECISION_PLANNER_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

## 1. Planning Authority And Boundary

This record resolves the bounded product-governance question of whether REIE should offer any mortgage-calculation capability.

The answer is not a traditional calculator. The recommended product is a decision-oriented financing planner integrated into the existing Buyer Financing Readiness surface.

This planning record does not authorize implementation, route creation, calculator implementation, provider integration, persistence, customer-data collection, production certification, or a next initiative.

Authorized documentation scope:

- this planning document;
- `docs/CHAT_START.md`.

Runtime files, route files, component files, API files, package files, configuration files, generated files, and calculator files remain unchanged by this planning phase.

## 2. Baseline And Deployment Evidence Reviewed

Repository baseline:

- branch: `main`
- HEAD: `ca26a019a1b2e8bdad1c1ffe5f13c3ffa20f7925`
- origin/main: `ca26a019a1b2e8bdad1c1ffe5f13c3ffa20f7925`
- ahead / behind: `0 ahead / 0 behind`
- working tree: clean before planning edits
- commit message: `Select post Homepage Phase 1 strategic direction`

Deployment evidence reviewed:

- GitHub/Vercel status ID: `51492264410`
- status: `success`
- context: `Vercel`
- description: `Deployment has completed`
- Vercel target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/6Sc5Eswo7xk12mBfg5USATMgjgdg`
- deployment ID: `5709364423`
- deployment status ID: `16236676062`
- deployment URL: `https://david-quinn-group-8rde-649eby5dz-david-quinns-projects-a0953600.vercel.app`
- completion timestamp: `2026-08-01T23:53:21Z`
- supersession status at planning start: no later deployment was returned ahead of deployment `5709364423`

## 3. Current Financing Surfaces

### `/buy`

The buyer route is the current governed buyer guidance surface. It includes:

- Buyer Confidence orientation;
- Buyer Decision Workspace;
- Buyer Financing Readiness;
- Financing Confidence Education;
- Journey Cohesion Panel;
- continuity to `/search`, `/market`, `/grand-plan`, and `/contact`.

The route declares and preserves no-calculator and no-lender-workflow boundaries.

### `/buy#financing-readiness`

This is the certified authoritative Buyer Financing Readiness surface.

Current posture:

- education-focused;
- preparation-focused;
- documentation-focused;
- assumption-review focused;
- lender-question preparation;
- professional-conversation preparation;
- no calculation;
- no qualification;
- no affordability conclusion;
- no rate output;
- no lender recommendation;
- no scoring;
- no uploads;
- no persistence;
- no automation;
- no personalization.

This surface is the correct parent for any later bounded financing planning interaction.

### `/buy#buyer-financing-confidence` And `/buy#financing-confidence`

These anchors preserve the certified Financing Confidence education posture. They help customers separate financing concepts, terminology, documents, lender questions, and next steps. They do not calculate payments, qualify customers, recommend lenders, compare rates, activate telemetry, or start a lender workflow.

### Homepage References

Homepage Product Experience Phase 1 preserved a Mortgage Calculator boundary and did not implement an embedded calculator. The homepage strategy points customers toward `/search` as the primary action and preserves buyer continuity without making the homepage a financing tool.

The Homepage Product Experience architecture selected `BUYER_FINANCING_READINESS_INTEGRATION` as the future calculator strategy and identified `/buy#financing-readiness` as the first appropriate surface.

### Advisory Pathways

Advisory continuity exists through `/contact` and `/contact#advisory-readiness`. Advisory pathways are appropriate for next-step conversation preparation, not for lender matching, approval, qualification, rate shopping, or financial advice.

### Decision Journey And Grand Plan

Decision Journey records connect financing preparation with Search, Market Context, Grand Plan, Buyer Guidance, Seller Guidance, and Advisory Guidance. Grand Plan remains a planning surface, not a financing calculator or loan workflow.

### Search Entry Points

Search remains a property-discovery and comparison surface. Repository records refer to financing assumptions as context to verify before relying on a property decision, but Search does not activate financing calculations, affordability decisions, lender recommendations, or personalized underwriting.

### Traceability And Placeholder Records

`REIE-ADJ-015` asks, "Where is the Mortgage Calculator?" and records the requirement as not found in the repository. The traceability record defers it to a future financing/customer tools program with compliance review, calculator assumptions, lender governance, and disclosure governance dependencies.

No implemented public mortgage calculator route, calculator component, provider integration, payment-estimate product, or financial profile workflow was found in the reviewed repository evidence.

## 4. Customer Decision Analysis

The customer is not primarily trying to answer, "What is my exact mortgage payment?"

The customer is trying to decide:

- whether their financing assumptions are organized enough to continue searching;
- which assumptions affect the next property or search-range decision;
- what they need to verify with a qualified lender or advisor;
- which costs are inside or outside their current understanding;
- whether a property deserves further review before financing uncertainty is resolved;
- what conversation to have next.

Traditional payment calculation is only one input into that broader decision. If presented as the product, it can create false precision, affordability implication, rate implication, and lending-advice risk.

The safer REIE decision is to support customer readiness: help the user organize assumptions and questions without producing a qualification, approval, affordability conclusion, or personalized financial recommendation.

## 5. Options Evaluated

### A. No Calculator

Customer value: medium.

This is the safest product posture but does not resolve the open customer question represented by `REIE-ADJ-015`. It preserves trust but leaves the financing journey dependent on static guidance alone.

Disposition: not selected.

### B. Traditional Mortgage Calculator

Customer value: medium.

A traditional calculator is familiar, but it is weakly differentiated and carries high trust, legal, fair-lending, and false-precision risk. It would likely require fields for rate, taxes, insurance, HOA, PMI, loan term, and assumptions that may be incomplete or misleading without lender review.

It also risks making REIE appear to provide affordability conclusions, payment quotes, rate guidance, or financing advice.

Disposition: rejected.

### C. Decision-Oriented Financing Planner

Customer value: high.

This option uses the certified Buyer Financing Readiness surface to help customers organize user-entered assumptions, identify unknowns, and prepare professional questions. It may include bounded educational scenario framing only if later authorized, but the product remains a readiness planner rather than a calculator-first tool.

It reuses existing certified architecture, keeps the experience mobile-suitable, avoids provider dependency, and aligns with REIE's trust model.

Disposition: selected.

### D. Buyer Financing Readiness Workspace

Customer value: medium to high.

The existing workspace is certified and useful. However, keeping the current workspace unchanged does not resolve whether any bounded calculation or scenario-planning capability should ever exist.

Disposition: preserved as the parent surface, not selected as the full answer.

### E. Hybrid Calculator And Readiness Workflow

Customer value: high but risk: high.

A hybrid could be useful later, but it risks making the calculator the apparent product and the readiness workflow a disclaimer wrapper. The first implementation should not combine full calculation behavior with readiness governance.

Disposition: deferred.

### F. Another Repository-Supported Financing Experience

Customer value: variable.

Repository evidence also identifies open lender-page and broader financing-tool questions, but those require legal/compliance, provider, affiliated-business, or partner-approval decisions outside this bounded planning phase.

Disposition: deferred.

## 6. Recommended Product

Recommended product:

`REIE_BUYER_FINANCING_DECISION_PLANNER`

Product option selected:

`C. Decision-oriented financing planner`

The product should not be branded or framed as a traditional mortgage calculator. It should be a readiness-first planning interaction that helps customers separate known assumptions, uncertain assumptions, professional-review questions, and next steps.

The first future implementation should be bounded to the existing `/buy#financing-readiness` surface and should avoid a dedicated calculator route.

## 7. Why This Product

The decision-oriented financing planner best fits REIE because:

- Buyer Financing Readiness is already certified as the governed parent surface;
- the customer problem is assumption clarity and conversation preparation, not standalone arithmetic;
- repository records already prohibit qualification, approval, affordability conclusions, lender recommendation, and payment certainty;
- a planner can preserve trust by making uncertainty visible instead of hiding it behind a simple monthly-payment output;
- it supports Decision Journey continuity to Search, Market Context, Grand Plan, and Advisory Handoff;
- it has lower source-rights and provider risk than rate-fed or lender-connected products;
- it can be designed mobile-first with progressive disclosure;
- it provides more enterprise leverage than a generic calculator by reinforcing REIE's decision-quality model.

## 8. Feature Governance For Any Calculation Capability

If a future implementation includes any calculation-like interaction, feature posture should be:

- rates: user-entered assumption only; no provider rates; no default market rate; no rate guarantee;
- taxes: user-entered assumption only; no property-tax lookup or automatic estimate;
- insurance: user-entered assumption only; no quote, provider, or recommendation;
- HOA: optional user-entered assumption only;
- PMI: defer in first implementation unless expressed as a user-entered monthly assumption; no PMI rules engine;
- ARM support: excluded from first implementation;
- refinance: excluded;
- cash purchase: may be handled as a non-loan readiness path only if explicitly authorized;
- assumptions editable: allowed only as in-session planning fields if implementation is authorized;
- scenarios saved: prohibited;
- export: prohibited unless separately authorized;
- persistence: prohibited;
- personalization: prohibited;
- CRM integration: prohibited;
- provider integration: prohibited;
- lender workflow: prohibited.

Allowed future output should be limited to assumption organization and educational scenario framing. It must not conclude affordability, qualification, eligibility, approval, best loan product, recommended lender, or investment suitability.

## 9. Provider Strategy

Recommended provider posture:

`USER_ENTERED_ASSUMPTIONS_ONLY_NO_PROVIDER`

No provider should be required for the selected first implementation path.

Provider-supplied rates, lender feeds, quote APIs, preapproval flows, lender rankings, lender comparisons, and partner recommendations are excluded. They would require separate provider, legal, compliance, disclosure, and governance authorization.

## 10. Route Strategy

Recommended route posture:

`INTEGRATED_INSIDE_BUYER_FINANCING_READINESS`

Future implementation should use:

- `/buy#financing-readiness`

No new route should be created in the first implementation path.

Rejected route strategies:

- dedicated calculator page;
- homepage embedded calculator;
- modal calculator;
- generic tool page;
- lender page;
- replacement buyer route.

The homepage may continue to link to buyer guidance, but it should not host the planner.

## 11. Persistence Strategy

Recommended persistence posture:

`NO_PERSISTENCE`

Future implementation should not save scenarios, store financial assumptions, use authenticated persistence, write to CRM, transmit financial information, or create customer profiles.

If an implementation needs in-session state for usability, it should be local component state only and discarded on page reload. Local browser storage is not recommended for the first implementation.

## 12. Mobile Experience

The future planner should be mobile-first and readiness-first.

Mobile hierarchy:

1. short purpose statement;
2. clear boundary statement;
3. small assumption entry group;
4. optional-cost progressive disclosure;
5. assumption summary;
6. questions to verify;
7. advisory or lender-conversation transition.

Mobile constraints:

- no more than three to five visible inputs at once;
- optional costs hidden behind progressive disclosure;
- no dense table as the primary mobile output;
- no "Apply," "Get approved," "See what you qualify for," or lender-intake CTA;
- CTA should be conversation-oriented, such as preparing questions or continuing to advisory guidance;
- disclosures must remain adjacent to any output;
- touch targets must be stable and accessible;
- outputs must not look like a verdict, score, grade, approval, or affordability range.

## 13. Disclosure Strategy

Required disclosure themes:

- educational planning only;
- based only on user-entered assumptions;
- not a loan estimate;
- not a quote;
- not an approval;
- not a qualification;
- not an affordability determination;
- not personalized financial advice;
- not tax, legal, lending, insurance, or investment advice;
- no rate guarantee;
- taxes, insurance, HOA, PMI, maintenance, utilities, closing costs, reserves, and loan terms may vary;
- property-specific costs require current verification;
- qualified lending, tax, legal, insurance, and real-estate professionals should be consulted where appropriate.

Disclosure placement:

- before the interaction in brief form;
- adjacent to any output;
- repeated near the advisory/lender-question transition;
- not hidden only in footer or long-form legal text.

## 14. Prohibited Capabilities

The selected product must avoid:

- lender recommendations;
- lender comparisons;
- lender rankings;
- loan-product recommendations;
- loan qualification;
- approval implication;
- preapproval substitute behavior;
- affordability conclusions;
- financial advice;
- personalized underwriting;
- credit recommendations;
- investment advice;
- tax advice;
- legal advice;
- insurance advice;
- rate guarantees;
- provider rankings;
- persistent financial profiles;
- saved scenarios;
- customer-data collection;
- CRM automation;
- telemetry-based personalization;
- AI-generated financing conclusions;
- property ranking by financing fit;
- protected-class or proxy-based steering language.

## 15. Likely Implementation Scope If Separately Authorized

Required or likely future files:

- `app/buy/page.tsx`;
- one bounded buyer financing planner component under `components/` if needed;
- one deterministic validation script for buyer financing planner governance;
- `package.json` and `tsconfig.worker.json` only if a new check is registered;
- one implementation record under `docs/project-atlas/executive-library/`;
- `docs/CHAT_START.md`.

Potentially reused files:

- `components/BuyerFinancingReadinessGuide.tsx`;
- `components/FinancingConfidenceEducation.tsx`;
- `lib/financingDecisionWorkspace.ts`;
- `lib/buyerDecisionWorkspace.ts`.

Prohibited unless separately authorized:

- new route files;
- homepage calculator code;
- Search files;
- map or GIS files;
- APIs;
- provider integrations;
- rate feeds;
- Prisma;
- migrations;
- persistence;
- CRM;
- telemetry;
- customer accounts;
- uploads;
- email or notification workflows;
- deployment configuration.

## 16. Acceptance Criteria For Later Implementation

Any later implementation must certify:

- one coherent Buyer Financing Decision Planner posture;
- integrated surface under `/buy#financing-readiness`;
- no new route unless separately authorized;
- no traditional calculator-first experience;
- no provider, rate feed, or lender workflow;
- no persistence or saved scenarios;
- no financial-profile collection;
- no qualification, approval, affordability conclusion, rate guarantee, or personalized advice;
- user-entered assumptions only;
- clear disclosure placement;
- mobile-first progressive disclosure;
- accessible inputs and controls;
- no unsupported public claims;
- fair-lending and fair-housing language safety;
- Buyer Financing Readiness continuity;
- Decision Journey continuity;
- Advisory Handoff continuity;
- Search, Market, Grand Plan, buyer, seller, homepage, route, sitemap, canonical, public runtime, and protected-system preservation.

## 17. Validation Requirements For Later Implementation

Future implementation validation should include:

- focused Buyer Financing Decision Planner deterministic check;
- Buyer Financing Readiness regression;
- Financing Confidence regression;
- Product Cohesion;
- Decision Journey;
- Advisory Handoff;
- Grand Plan continuity;
- public trust;
- fair-lending terminology review;
- fair-housing terminology review;
- no qualification, approval, affordability, rate guarantee, lender recommendation, or personalized-advice copy;
- no provider, persistence, telemetry, CRM, upload, API, Prisma, or migration activation;
- route integrity;
- sitemap and canonical checks;
- Search runtime;
- market-route regression;
- South Boulder and Table Mesa regression;
- Niwot retired-route regression;
- public runtime;
- responsive review;
- interaction review;
- accessibility review;
- typecheck;
- lint;
- build;
- production certification only under separate authorization.

## 18. Blockers And Open Questions

Open questions for a future implementation authorization:

- exact field list for the first bounded planner;
- whether any arithmetic output is allowed or whether the first implementation should produce only an assumption summary and verification questions;
- exact wording of the non-advice, non-qualification, and non-rate disclosures;
- whether PMI should be excluded entirely or accepted only as a user-entered monthly assumption;
- whether local in-session state is enough for usability;
- whether legal/compliance review should occur before or during implementation certification.

These questions do not block the product-governance recommendation. They define the limits for the next bounded implementation authorization.

## 19. Protected Boundaries

This planning record confirms no authorization for:

- implementation;
- route creation;
- calculator route;
- homepage calculator;
- dedicated tool page;
- provider integration;
- rate feed;
- lender recommendation;
- lender workflow;
- loan application;
- mortgage inputs in production;
- payment estimates in production;
- affordability output;
- qualification or approval output;
- persistence;
- uploads;
- CRM;
- telemetry;
- personalization;
- Search changes;
- map or GIS changes;
- APIs;
- Prisma;
- migrations;
- customer-data changes;
- AI;
- alerts, queues, workers, email, or notifications;
- deployment configuration changes;
- production-data mutation.

## 20. Final Planning Outcome

Final planning outcome:

`REIE_BUYER_FINANCING_EXPERIENCE_READY_FOR_IMPLEMENTATION_AUTHORIZATION`

Recommended next gate:

`READY_FOR_REIE_BUYER_FINANCING_DECISION_PLANNER_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

Do not begin implementation until that gate is explicitly authorized.
