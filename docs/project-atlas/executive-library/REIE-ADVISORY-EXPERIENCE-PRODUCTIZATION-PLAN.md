# PROJECT ATLAS(TM) REIE Advisory Experience Productization Plan

Program: REIE Advisory Experience(TM)
Phase: Productization Planning
Status: REIE_ADVISORY_EXPERIENCE_READY_FOR_IMPLEMENTATION_AUTHORIZATION
Date: August 2, 2026

Implementation authorization: not authorized
Route creation: not authorized
CRM implementation: not authorized
Scheduling: not authorized
Persistence: not authorized
Production certification: not authorized
Next initiative authorization: not authorized

## 1. Executive Planning Decision

Recommended advisory model:

`SINGLE_ADVISORY_EXPERIENCE`

Recommended route strategy:

Keep the long-term advisory architecture anchored at `/contact#advisory-readiness`.

The Advisory Experience should become the final experience of the REIE Decision Journey: a calm, prepared, confidence-building transition from research into a professional conversation. It should not be treated as a Contact-page redesign, a CRM intake, a scheduling funnel, a qualification workflow, or a personalized advisory engine.

The planning outcome is ready for bounded implementation authorization. Future implementation should productize the existing Advisory Handoff surface, simplify dense content, align the visual hierarchy with certified Homepage Phase 1 principles, and preserve every certified boundary.

## 2. Baseline And Deployment

Repository baseline verified before this planning phase:

- branch: `main`
- HEAD: `cab2777c57d68b4c388322c312b703c8f5b1e4a6`
- origin/main: `cab2777c57d68b4c388322c312b703c8f5b1e4a6`
- ahead / behind: `0 ahead / 0 behind`
- working tree: clean

Latest deployment associated with `cab2777c57d68b4c388322c312b703c8f5b1e4a6`:

- status: success
- GitHub/Vercel status ID: `51493449749`
- context: `Vercel`
- description: `Deployment has completed`
- Vercel target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/4XHy7zoWygCBNEFVvkSAdLkvMguW`
- status timestamp: `2026-08-02T01:09:34Z`
- supersession status before this planning phase: not superseded

## 3. Product Purpose

Primary purpose:

Help customers move from REIE research into a prepared professional conversation.

The Advisory Experience should:

- prepare customers before contact;
- reinforce trust;
- organize what they learned across completed REIE journeys;
- clarify what should be verified;
- explain what happens next;
- preserve professional boundaries.

It should not primarily qualify readiness, score customers, automate recommendations, infer personal context, or ask for immediate contact before preparation.

## 4. Desired Customer State

Likely arrival states:

- informed but not fully ready;
- curious;
- uncertain;
- partially organized;
- sometimes overwhelmed after comparing multiple paths.

Target emotional outcome:

- prepared;
- calm;
- confident enough to ask better questions;
- clear on what REIE can and cannot do;
- aware of which questions belong with qualified professionals;
- ready to choose whether to continue to contact.

The experience should lower cognitive pressure. It should not create urgency, funnel pressure, fear of missing out, or a sense that the customer has been evaluated.

## 5. Current Advisory Surface Inventory

Current authoritative advisory surface:

- `/contact#advisory-readiness`
- component: `components/AdvisoryHandoffGuide.tsx`
- route host: `app/contact/page.tsx`

Current Contact page structure:

- Public Trust page wrapper;
- Production Status;
- Public Contact;
- Advisory Handoff Guide;
- Current Contact Routing;
- Form Notice.

Current Advisory Handoff content:

- eyebrow: Advisory Readiness;
- headline: "Prepare the conversation without turning preparation into a decision.";
- orientation copy connecting market, city, comparison, buyer, financing, seller, property, due-diligence, and sequencing topics;
- boundary statement;
- conversation-preparation prompts;
- journey-context groups;
- questions-to-bring groups;
- evidence-aware framing;
- advisor-role framing;
- continuity links.

Current certified data attributes confirm the surface is:

- presentational;
- non-persistent;
- non-automated;
- non-personalized;
- no hidden context transfer;
- no new contact fields;
- no CRM;
- no lead routing;
- no lead scoring;
- no email or alerts;
- no telemetry;
- no provider activation;
- no evidence metadata exposure.

## 6. Current Advisory Entry Points

Current advisory entry points and transitions include:

- global navigation: Contact -> `/contact`;
- footer: Contact page link;
- homepage advisory close -> `/contact`;
- Buyer page Journey Cohesion -> `/contact`;
- Buyer Financing Readiness -> `/contact#advisory-readiness`;
- Buyer Financing Decision Planner -> `/contact#advisory-readiness`;
- Financing Confidence Education -> `/contact`;
- Seller page primary action -> `/contact`;
- Seller page Journey Cohesion -> `/contact`;
- Seller Readiness -> `/contact#advisory-readiness`;
- Home Worth -> `/contact`;
- Grand Plan Journey Cohesion -> `/contact`;
- Grand Plan intake follow-up context -> Contact / advisory follow-up;
- Compare page Journey Cohesion -> `/contact`;
- Search property actions -> `/contact`;
- Search/map selected-property surfaces -> advisory notes and Contact paths;
- city market pages -> advisory continuity language;
- neighborhood records -> Advisory Readiness links where governed;
- property detail and property context surfaces -> advisory/property-question paths.

Current finding:

All major certified journeys can already converge on Advisory. The weakness is not missing route access. The weakness is that some paths land on `/contact` while richer readiness paths land on `/contact#advisory-readiness`, and the current Advisory Handoff surface is content-dense relative to the newer Homepage Phase 1 and Buyer Financing Planner product rhythm.

## 7. Customer Journey Inventory

Certified journeys that may end in Advisory:

- Homepage: broad orientation into Search, Buy, Sell, Market, Grand Plan, About, or Contact.
- Buyer: search, market, financing assumptions, property review, and advisor questions.
- Seller: preparation, property records, market context, Home Worth, seller review, and advisor questions.
- Buyer Financing Planner: user-entered assumptions, items to verify, lender/professional questions, advisory transition.
- Property / Seller Evidence: evidence categories, limitations, blocked uses, and professional-review prompts.
- Search: property discovery, map/list comparison, property questions, market authority links, Contact path.
- Market Intelligence: city and market context, property-specific caveats, advisory continuity.
- Neighborhood Intelligence: governed neighborhood context with verification and Advisory Readiness continuity where authorized.
- Grand Plan: priorities, places, timing, daily-life context, and advisory conversation preparation.
- Compare: city and market tradeoffs requiring deeper review and advisory continuity.

Planning finding:

These should converge on one advisory experience, not split into separate buyer/seller/contact destinations. The purpose is shared: prepare the professional conversation while preserving limitations.

## 8. Advisory Model Options

### A. Single Advisory Experience

One authoritative advisory readiness experience at `/contact#advisory-readiness`.

Strengths:

- lowest route and SEO risk;
- reuses certified Advisory Handoff route architecture;
- supports all journeys without duplicating buyer/seller content;
- preserves Contact and privacy boundaries;
- easiest to certify against no CRM, no scheduling, no hidden context transfer.

Weakness:

- must be carefully organized so it does not feel generic.

Disposition: selected.

### B. Buyer/Seller Split

Separate buyer and seller advisory experiences.

Strength:

- clearer copy for buyer/seller-specific contexts.

Weaknesses:

- duplicates Advisory Handoff logic;
- risks divergent professional-boundary language;
- under-serves Grand Plan, Search, market, neighborhood, property, and comparison contexts;
- may require new route or content architecture.

Disposition: deferred.

### C. Context-Aware Advisory

Advisory adapts based on inbound path or selected journey context.

Strength:

- can feel tailored.

Weaknesses:

- risks personalization, hidden context transfer, URL-state dependence, persistence, or inferred customer intent;
- higher certification burden.

Disposition: deferred until a later authorization explicitly permits and bounds context handling.

### D. Advisory Workspace

Interactive workspace for organizing advisory preparation.

Strength:

- could be powerful after more product maturity.

Weaknesses:

- likely requires state, forms, persistence, saved preparation, or interaction complexity;
- high risk of becoming CRM, qualification, or advisory automation.

Disposition: rejected for Phase 1.

### E. Another Repository-Supported Model

Use the existing Contact page as-is.

Strength:

- no implementation risk.

Weakness:

- does not productize the final Decision Journey after Homepage Phase 1 and Buyer Financing Planner closure;
- leaves current density and mixed Contact/Public Trust framing unresolved.

Disposition: rejected as insufficient.

## 9. Recommended Advisory Model

Selected model:

`SINGLE_ADVISORY_EXPERIENCE`

Model definition:

A single anchored advisory readiness experience inside `/contact#advisory-readiness` that acts as the final REIE Decision Journey step. It organizes the customer into one calm sequence:

1. understand what Advisory is;
2. recognize what to bring forward;
3. see which topics require professional verification;
4. understand privacy and boundary expectations;
5. choose whether to continue to Contact.

The model should be journey-aware in content taxonomy, not user-specific in behavior. It may name journey categories, but it must not infer where the customer came from, store selections, personalize guidance, or prefill contact context.

## 10. Content Inventory And Disposition

### Contact Page: Production Status

Disposition: KEEP_AND_SIMPLIFY.

Keep the trust/status content, but do not let it dominate the Advisory first screen. It should remain available and accurate without delaying the advisory purpose.

### Contact Page: Public Contact

Disposition: KEEP_AND_SIMPLIFY.

Keep public-contact status and routing limitations. Move it below the advisory purpose or present it as a concise trust note in a future implementation.

### Advisory Handoff: Eyebrow And Headline

Disposition: KEEP_AND_ELEVATE.

The headline concept is correct. Future implementation should make it the emotional and product center of the page.

### Advisory Handoff: Orientation Copy

Disposition: KEEP_AND_SIMPLIFY.

The current copy correctly links market, city, comparison, buyer, financing, seller, property, and sequencing. It should be shorter and more editorial.

### Advisory Handoff: Boundary Statement

Disposition: KEEP.

This is required trust and professional-boundary content. It should remain close to the first-screen purpose but avoid feeling like a warning wall.

### Advisory Handoff: Conversation Preparation Prompts

Disposition: KEEP_AND_SIMPLIFY.

The prompts are useful. Reduce visible count on mobile or group them into three simple preparation themes: decision, context, questions.

### Advisory Handoff: Journey Context Groups

Disposition: MERGE.

The seven groups are valuable but dense. Merge into a smaller journey taxonomy:

- Buy and Finance;
- Sell and Prepare;
- Search, Market, and Place;
- Grand Plan and Timing;
- Verify and Discuss.

### Advisory Handoff: Questions To Bring

Disposition: KEEP_AND_SIMPLIFY.

Keep the four current domains, but present them as expandable or compact topic groups in a later implementation if authorized.

### Advisory Handoff: Evidence-Aware Framing

Disposition: KEEP.

This is core to REIE trust. It should remain visible but concise.

### Advisory Handoff: Advisor Role

Disposition: KEEP_AND_ELEVATE.

This should become part of the primary confidence-building moment: what an advisor can help with and what remains with qualified professionals.

### Advisory Handoff: Continuity Links

Disposition: KEEP_AND_SIMPLIFY.

Keep continuity, but reduce visual competition. Advisory should not end with a large grid that feels like restarting the platform. Primary continuation should be Contact; secondary links should be "keep researching" paths.

### Contact Page: Current Contact Routing

Disposition: MERGE.

Merge with the future advisory contact strategy so customers understand when to contact versus when to continue preparing.

### Contact Page: Form Notice

Disposition: KEEP.

Keep privacy and form notice. It should remain near any contact action and must not be removed.

## 11. Mobile-First Advisory Experience

Mobile first screen:

- concise eyebrow: Advisory Readiness;
- clear headline: Prepare the conversation before you contact an advisor;
- short supporting copy;
- one primary CTA: continue to contact or contact routing;
- one secondary CTA at most: review what to prepare;
- concise boundary note: no hidden transfer, no professional-advice replacement, no confidential information before relationship/disclosures.

Recommended mobile sequence:

1. Hero: what Advisory is and how it should make the customer feel.
2. Preparation: three things to bring forward.
3. Journey topics: compact groups for Buy/Finance, Sell/Prepare, Search/Market/Place, Grand Plan/Timing.
4. Questions to verify: concise prompts.
5. Trust boundary: evidence limits, privacy, professional boundaries.
6. Contact transition: clear next step and what happens after contact.
7. Continue researching: compact secondary paths.

Mobile rules:

- single-column;
- generous spacing;
- no dense card wall;
- no more than one dominant CTA per section;
- no dashboard appearance;
- no scorecard appearance;
- no funnel pressure;
- no sticky contact bar unless separately justified;
- touch targets remain accessible;
- disclosures remain readable and close to relevant actions.

## 12. Contact Strategy

Selected strategy:

Preparation before contact.

The customer should first understand:

- what Advisory can help with;
- what they should bring forward;
- which questions require qualified professional verification;
- what information should not be submitted prematurely;
- what happens after they choose to contact.

Then the customer may continue to Contact.

This preserves trust and reduces anxiety. It also avoids turning Advisory into an immediate lead-capture funnel.

## 13. Trust Model

Trust-building sequence:

1. Calmly state the role of Advisory.
2. Confirm the customer is not being scored or profiled.
3. Explain what to bring forward.
4. Separate REIE context from professional conclusions.
5. Explain privacy and confidentiality limits.
6. State what happens next.
7. Provide a clear contact path.

Evidence boundaries:

- public evidence remains contextual;
- internal Evidence Depth metadata remains non-public;
- citywide or market context does not become property-specific certainty;
- incomplete, stale, conflicting, or source-limited evidence requires verification;
- no support levels, provenance chains, confidence scores, or internal eligibility outcomes are exposed.

Professional boundaries:

- Advisory does not replace legal, tax, lending, appraisal, inspection, engineering, insurance, title, environmental, HOA, or other qualified professional review.
- Advisory does not create qualification, approval, affordability, valuation, pricing, investment, suitability, or property-condition conclusions.

Privacy expectations:

- no hidden context transfer;
- no journey history transfer;
- no saved preparation;
- no customer profile;
- no sensitive or confidential information before the appropriate brokerage relationship and disclosures.

## 14. Prohibited Capabilities

Future implementation must not introduce:

- CRM workflows;
- scheduling;
- hidden lead scoring;
- persistence;
- personalization;
- automated qualification;
- automated recommendations;
- AI advisory;
- financial advice;
- legal advice;
- tax advice;
- insurance advice;
- underwriting;
- approval;
- affordability;
- buying-power conclusions;
- valuation;
- pricing conclusions;
- provider recommendations;
- lender recommendations;
- professional rankings;
- hidden context transfer;
- saved advisory workspace;
- customer profiling;
- telemetry or tracking;
- uploads;
- APIs;
- Prisma or migrations;
- email, alerts, queues, or workers.

## 15. Route Strategy

Recommended route strategy:

Keep `/contact#advisory-readiness`.

Rationale:

- it is the certified route and anchor;
- no competing route exists;
- Contact and privacy boundaries are already preserved there;
- all current journey exits can reach it;
- no new canonical, sitemap, route eligibility, or SEO behavior is required;
- it avoids creating a route before there is a proven need.

Alternatives evaluated:

- `/advisory`: deferred because route creation is not needed now and would require separate SEO/canonical/navigation review.
- `/contact/advisory-readiness`: rejected because it duplicates the certified anchor and increases route maintenance.
- buyer/seller advisory subroutes: rejected because they fragment a journey that should converge.
- modal/workspace: rejected because it risks state, persistence, hidden transfer, and interaction complexity.

## 16. Likely Implementation Scope

Likely future implementation files if separately authorized:

- `app/contact/page.tsx`;
- `components/AdvisoryHandoffGuide.tsx`;
- possible bounded advisory experience component if separation improves clarity;
- possible focused deterministic check for Advisory Experience productization;
- `package.json` and `tsconfig.worker.json` only if a new check is registered;
- implementation record under `docs/project-atlas/executive-library/`;
- `docs/CHAT_START.md`.

Files that should remain out of scope unless separately authorized:

- homepage;
- global navigation;
- footer;
- Search;
- maps/GIS;
- market and neighborhood routes;
- buyer and seller runtime pages;
- Grand Plan runtime;
- APIs;
- Prisma;
- CRM;
- telemetry;
- persistence;
- providers;
- deployment configuration.

## 17. Acceptance Criteria

Future implementation should be accepted only if:

- Advisory has one clear primary purpose;
- customers arrive uncertain or partly prepared and leave more organized;
- the experience is visibly the end of the Decision Journey, not a generic Contact page;
- `/contact#advisory-readiness` remains the authoritative advisory architecture;
- no new route is created;
- no CRM, scheduling, persistence, telemetry, tracking, hidden transfer, or personalization exists;
- no automated qualification, recommendation, score, readiness status, or professional conclusion appears;
- all major certified journeys continue to advisory or continue researching;
- Buyer Financing Planner advisory continuity remains intact;
- Seller Readiness advisory continuity remains intact;
- Search, market, neighborhood, Grand Plan, and property paths remain intact;
- privacy and professional-boundary language is concise and clear;
- Evidence Depth metadata remains non-public;
- fair-housing and fair-lending language remains safe;
- mobile hierarchy is clear and calm;
- accessibility is preserved;
- no protected-system behavior changes.

## 18. Validation And Certification Plan

Later implementation validation should include:

- Advisory Experience deterministic check;
- Advisory Handoff regression;
- Advisory Operating boundary review;
- Product Cohesion;
- Decision Journey;
- Buyer Financing Decision Planner regression;
- Buyer Financing Readiness;
- Seller Readiness;
- Grand Plan;
- Search runtime;
- market-route regression;
- neighborhood-route regression;
- Property / Seller Evidence Readiness;
- public trust;
- privacy and no-confidential-information review;
- fair-housing and fair-lending terminology review;
- Evidence Depth non-exposure;
- sitemap and canonical integrity;
- route integrity;
- responsive review at mobile, tablet, and desktop;
- interaction review;
- accessibility review;
- typecheck;
- lint;
- build;
- production public-experience smoke under separate production-certification authorization.

## 19. Open Questions

Questions for implementation authorization:

- Should the future first-screen CTA say "Prepare To Contact" or "Talk Through The Decision"?
- Should the Contact page title remain "Contact" while Advisory becomes the first substantial customer experience?
- Should future implementation visually separate Public Trust content from Advisory content more strongly?
- Should journey topics appear as compact cards, progressive disclosure, or a short editorial sequence?
- How much of the current continuity-link grid should remain visible on mobile?
- Can the future experience point to Contact without changing form behavior or adding fields?

None of these open questions block bounded implementation planning. They should be answered inside the later implementation authorization before runtime edits begin.

## 20. Next Authorization Gate

Next gate:

`READY_FOR_REIE_ADVISORY_EXPERIENCE_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

Do not begin implementation, route creation, CRM, scheduling, persistence, production certification, Phase 2 work, or another initiative without explicit authorization.
