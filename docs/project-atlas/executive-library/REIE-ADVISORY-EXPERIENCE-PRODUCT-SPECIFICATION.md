# PROJECT ATLAS(TM) REIE Advisory Experience Product Specification

Program: REIE Advisory Experience(TM)
Phase: Product Specification and Interaction Model
Status: REIE_ADVISORY_EXPERIENCE_READY_FOR_BOUNDED_IMPLEMENTATION_AUTHORIZATION
Date: August 2, 2026

Implementation authorization: not authorized
Route creation: not authorized
Contact backend changes: not authorized
CRM: not authorized
Scheduling: not authorized
Persistence: not authorized
Production certification: not authorized
Next initiative authorization: not authorized

## 1. Specification Decision

Selected advisory model:

`SINGLE_ADVISORY_EXPERIENCE`

Selected journey-context model:

`GENERIC_SINGLE_EXPERIENCE_WITH_STATIC_TOPICS`

Selected contact strategy:

`PREPARATION_THEN_CONTACT`

Selected route strategy:

Keep `/contact#advisory-readiness`.

Selected first implementation phase:

`REIE_ADVISORY_EXPERIENCE_PHASE_1_STRUCTURAL_PRODUCTIZATION_AND_MOBILE_HIERARCHY`

The Advisory Experience should be the final customer-facing step in the REIE Decision Journey. It should help customers move from research into a prepared professional conversation while preserving public trust, privacy, evidence boundaries, and professional limitations.

No runtime implementation is authorized by this specification.

## 2. Baseline And Deployment

Repository baseline verified before this specification:

- branch: `main`
- HEAD: `b6bf3015917874db55338151182d920acb933ff6`
- origin/main: `b6bf3015917874db55338151182d920acb933ff6`
- ahead / behind: `0 ahead / 0 behind`
- working tree: clean

Latest deployment associated with `b6bf3015917874db55338151182d920acb933ff6`:

- status: success
- GitHub/Vercel status ID: `51493541751`
- context: `Vercel`
- description: `Deployment has completed`
- Vercel target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/EFDy9qstCYJ24eNoquhzrh2yrBEE`
- status timestamp: `2026-08-02T01:16:09Z`
- supersession status before this specification: not superseded

## 3. Product Purpose

Primary purpose:

Help customers move from REIE research into a prepared professional conversation.

The experience should:

- prepare customers before contact;
- make the final REIE Decision Journey step feel intentional;
- organize decision context without collecting it;
- identify unresolved questions;
- clarify which topics require qualified professional verification;
- explain what happens next;
- reinforce privacy and professional boundaries.

It must not become:

- a generic Contact page;
- a CRM intake workflow;
- a scheduling product;
- a lead-scoring system;
- an automated qualification tool;
- an AI advisor;
- a persistent workspace;
- a recommendation engine;
- a professional-advice substitute.

## 4. Target Customer State

Arrival state:

- informed from REIE research;
- potentially uncertain about what to do next;
- partly organized;
- aware of useful context but unsure which questions require human review;
- sometimes overwhelmed by Search, market, property, financing, seller, or Grand Plan choices.

Desired state after the experience:

- prepared;
- calm;
- organized;
- trust-aware;
- clear about unresolved questions;
- clear about professional-verification needs;
- clear about what happens after choosing contact;
- not pressured or evaluated.

## 5. Experience Hierarchy

Recommended top-to-bottom sequence:

1. Page orientation
2. Advisory purpose
3. What the advisor helps with
4. Preparation themes
5. Journey-context topics
6. Questions to verify
7. Evidence and professional boundaries
8. Privacy expectations
9. Contact transition
10. Research continuations
11. Existing footer

This hierarchy should make Advisory the first substantive customer experience on the page while keeping necessary Contact/Public Trust information available below or adjacent to the advisory flow.

## 6. First-Screen Specification

First-screen objective:

Make the customer understand that Advisory is the prepared transition from REIE research to a professional conversation.

Required first-screen content:

- concise advisory eyebrow;
- one clear headline about preparing the conversation before contact;
- short supporting message explaining that Advisory connects REIE research, unresolved questions, and professional review;
- one primary CTA;
- one optional secondary CTA;
- concise trust boundary.

Recommended headline category:

- "Prepare the conversation before you contact an advisor."

Primary CTA purpose:

- proceed toward contact after preparation.

Recommended primary CTA label purpose:

- "Prepare To Contact" or "Talk Through The Decision".

Optional secondary CTA purpose:

- jump to preparation themes.

Must not appear above the fold:

- dense Public Trust status blocks;
- full contact-routing notices;
- large grid of platform links;
- form-heavy language;
- CRM, scheduling, lead, or intake terminology;
- legal wall;
- buyer/seller split;
- score, readiness status, or qualification language.

Maximum visible choices:

- one primary CTA;
- one secondary CTA;
- no more than one additional inline trust link if needed.

Mobile and desktop differences:

- Mobile should remain single-column with the primary CTA visible early.
- Desktop may use a restrained two-column composition where purpose and trust boundary sit together without looking like a dashboard.

## 7. Preparation Model

Preparation themes customers should review before contact:

| Theme | Classification | Treatment |
| --- | --- | --- |
| Decision goal | REQUIRED_PREPARATION_THEME | Ask what decision the customer is trying to make. |
| Timeline | REQUIRED_PREPARATION_THEME | Ask what timing or sequencing question matters. |
| Property or market context | REQUIRED_PREPARATION_THEME | Ask what market, property, or neighborhood context needs review. |
| Unresolved professional questions | REQUIRED_PREPARATION_THEME | Ask which topics require qualified verification. |
| Financing assumptions | OPTIONAL_PREPARATION_THEME | Include as a topic for buyers or financing-planner users, without inferring financing state. |
| Seller readiness | OPTIONAL_PREPARATION_THEME | Include for seller/home-worth users, without implying valuation or pricing conclusions. |
| Evidence gaps | OPTIONAL_PREPARATION_THEME | Include as trust-aware prompts, not internal evidence metadata. |
| Documents to organize | OPTIONAL_PREPARATION_THEME | Encourage customers to know what may be relevant; do not request upload. |
| Next-decision priorities | OPTIONAL_PREPARATION_THEME | Help customers think about next steps without recommending them. |
| Financial profile details | EXCLUDED_FROM_PUBLIC_EXPERIENCE | Do not request or infer sensitive financial profile data. |
| Confidential negotiating position | EXCLUDED_FROM_PUBLIC_EXPERIENCE | Explicitly discourage submitting before appropriate relationship and disclosures. |
| Personal demographic or protected-class context | EXCLUDED_FROM_PUBLIC_EXPERIENCE | Do not request or use. |
| Uploaded document packet | EXCLUDED_FROM_PUBLIC_EXPERIENCE | Uploads are not authorized. |

No form, saved checklist, hidden state, or persistent workspace is authorized.

## 8. Journey-Context Model

Selected model:

`GENERIC_SINGLE_EXPERIENCE_WITH_STATIC_TOPICS`

The experience may statically acknowledge journey categories:

- Search;
- Market;
- Neighborhood;
- Buyer;
- Seller;
- Financing Planner;
- Property / Seller Evidence;
- Grand Plan;
- Compare;
- Homepage.

It must not:

- detect inbound context;
- read URL state to tailor content;
- store or infer user journey;
- personalize guidance;
- prefill contact context;
- transfer planner inputs;
- use analytics, tracking, CRM, persistence, or hidden profile data.

Static journey-topic model:

- Buy and Finance;
- Sell and Prepare;
- Search, Market, and Place;
- Property and Evidence;
- Grand Plan and Timing;
- Verify and Discuss.

## 9. Content Categories

### Advisory Role

- Purpose: explain what Advisory does.
- Target length: 35-70 words.
- Placement: first screen.
- Mobile treatment: headline plus short paragraph.
- CTA relationship: immediately before primary CTA.
- Trust boundary: no professional-advice substitution.

### Preparation Guidance

- Purpose: show what to think through before contact.
- Target length: 3-5 compact prompts, 8-14 words each.
- Placement: second section.
- Mobile treatment: stacked prompts, no dense grid.
- CTA relationship: secondary bridge to contact.
- Trust boundary: prompts only, no stored checklist.

### Journey Topics

- Purpose: connect certified REIE paths to Advisory.
- Target length: 5-6 topic groups, 18-35 words each.
- Placement: after preparation.
- Mobile treatment: compact cards or progressive disclosure.
- CTA relationship: no direct primary CTA inside every card.
- Trust boundary: static topics only, no detected context.

### Verification Prompts

- Purpose: help customers identify unresolved questions.
- Target length: 8-12 prompts grouped by topic.
- Placement: mid-page.
- Mobile treatment: collapsible or short grouped list if implemented.
- CTA relationship: leads toward professional-boundary section.
- Trust boundary: prompts, not conclusions or recommendations.

### Professional Boundaries

- Purpose: separate REIE advisory from professional review.
- Target length: 45-90 words plus compact topic list.
- Placement: before contact transition.
- Mobile treatment: concise tonal field.
- CTA relationship: immediately before contact transition.
- Trust boundary: required.

### Privacy Expectations

- Purpose: reduce hidden-data concerns and confidential-information risk.
- Target length: 45-80 words.
- Placement: near contact transition.
- Mobile treatment: concise, readable note.
- CTA relationship: adjacent to primary contact CTA.
- Trust boundary: no hidden transfer, no saved history, no CRM enrichment.

### Contact Expectations

- Purpose: explain what happens after the click without claiming unverified service levels.
- Target length: 35-65 words.
- Placement: contact transition.
- Mobile treatment: short paragraph and CTA.
- CTA relationship: primary.
- Trust boundary: existing contact methods and backend remain unchanged.

### Research Continuation

- Purpose: let customers keep researching without pressure.
- Target length: 3-5 links.
- Placement: after contact transition.
- Mobile treatment: compact secondary links.
- CTA relationship: tertiary.
- Trust boundary: no forced funnel.

## 10. Questions-To-Verify Model

Question categories:

- property-specific facts;
- financing assumptions;
- title and ownership;
- HOA obligations;
- insurance;
- permits and municipal records;
- condition and systems;
- environmental or site concerns;
- market context;
- pricing or valuation boundaries;
- timing;
- transaction strategy;
- professional review.

Questions must remain prompts, not conclusions or recommendations.

Allowed form:

- "Which property-specific facts should be verified before relying on this context?"
- "Which financing assumptions belong with a qualified lender?"
- "Which HOA, title, insurance, permit, or condition questions require qualified review?"

Prohibited form:

- "This property is suitable."
- "This price is right."
- "You are ready to buy."
- "This lender or provider is recommended."
- "This is the best neighborhood."
- "This condition issue is acceptable."

## 11. Contact Strategy

Selected strategy:

`PREPARATION_THEN_CONTACT`

Sequence:

1. Advisory purpose.
2. Preparation themes.
3. Static journey topics.
4. Verification prompts.
5. Trust, privacy, and professional boundaries.
6. Contact transition.
7. Research continuations.

Primary contact CTA:

- label purpose: contact or talk through the decision;
- destination: existing `/contact` behavior or existing contact section;
- hierarchy: primary only in the contact transition and possibly first screen;
- mobile placement: first screen and final transition, not repeated every section.

Secondary continuation CTA:

- label purpose: continue researching;
- destinations: `/search`, `/buy`, `/sell`, `/market`, `/grand-plan` as appropriate;
- hierarchy: secondary or tertiary.

Expected next step:

- customer uses the existing Contact route/workflow or property/market inquiry paths as already certified.

Existing contact methods:

- remain unchanged.

Existing forms:

- remain untouched.

No backend behavior is authorized.

## 12. CTA Inventory

| CTA purpose | Destination | Hierarchy | Mobile placement | Existing? | Runtime change required? |
| --- | --- | --- | --- | --- | --- |
| Contact David Quinn Group / Talk through the decision | `/contact` or same-page contact transition | Primary | first screen and contact transition | Yes | Copy/layout only if authorized |
| Prepare for an advisory conversation | `#advisory-readiness` or preparation section anchor | Secondary | first screen only if useful | Partially | Optional anchor-only layout if authorized |
| Continue buyer guidance | `/buy` | Tertiary | research continuations | Yes | No route change |
| Continue seller guidance | `/sell` | Tertiary | research continuations | Yes | No route change |
| Return to Search | `/search` | Tertiary | research continuations | Yes | No route change |
| Review market context | `/market` | Tertiary | research continuations | Yes | No route change |
| Review Grand Plan | `/grand-plan` | Tertiary | research continuations | Yes | No route change |
| Financing readiness | `/buy#financing-readiness` | Tertiary | journey-topic or research continuations | Yes | No route change |
| Seller readiness | `/home-worth#seller-readiness` | Tertiary | journey-topic or research continuations | Yes | No route change |

Simultaneous visible CTA limit:

- mobile: one primary and at most one secondary in the first viewport;
- desktop: one primary, one secondary, and a compact tertiary research group only below the main transition.

## 13. Privacy Model

Certified current behavior:

- Advisory Handoff is presentational;
- no persistence;
- no automation;
- no personalization;
- no hidden context transfer;
- no new contact fields;
- no CRM;
- no lead routing;
- no lead scoring;
- no telemetry;
- no provider activation;
- no evidence metadata exposure.

Desired public messaging:

- REIE does not silently carry your search, planner inputs, or journey history into Advisory.
- Do not submit confidential negotiating positions, financial limits, or client-confidential information before the appropriate relationship and disclosures.
- Advisory preparation helps organize questions; it does not create a saved profile.

Prohibited future behavior:

- hidden profile creation;
- saved decision history;
- inferred financial profile;
- automatic CRM enrichment;
- analytics-based qualification;
- hidden lead score;
- automatic transfer of planner inputs;
- upload requirement;
- public-record lookup;
- provider sharing.

Do not claim backend behavior beyond what repository records certify.

## 14. Professional-Boundary Model

The Advisory Experience must establish that REIE and Advisory do not determine:

- legal status;
- title;
- ownership;
- permits;
- zoning;
- HOA status;
- insurance status;
- structural condition;
- environmental condition;
- financing approval;
- tax treatment;
- legal advice;
- valuation certainty;
- suitability;
- investment performance.

Treatment:

- concise boundary near first screen;
- expanded but readable boundary before contact transition;
- no dense legal wall;
- no professional category hidden in fine print.

## 15. Fair-Housing And Steering Boundaries

Prohibited language:

- demographic targeting;
- protected-class proxies;
- family-status steering;
- desirability claims;
- "best" or "ideal for" claims;
- school rankings;
- safety or crime rankings;
- socioeconomic comparisons;
- superiority claims;
- suitability conclusions;
- coded preference language.

Allowed framing:

- decision preparation;
- verification prompts;
- property-specific review needs;
- process clarity;
- professional-boundary language;
- neutral market and property context.

## 16. Emotional Design

Arrival:

- state: uncertain or partially organized;
- design response: calm headline, short copy, generous whitespace, no pressure.

Preparation:

- state: organizing thoughts;
- design response: simple prompts, clear grouping, low density.

Trust review:

- state: evaluating whether to share questions;
- design response: plain privacy and professional-boundary language.

Contact transition:

- state: ready to choose contact or continue research;
- design response: one clear primary action, secondary research paths below.

Exit:

- state: prepared and not rushed;
- design response: clear expectations and non-pressure continuity.

Visual behavior:

- strong but restrained typography;
- editorial pacing;
- generous section spacing;
- floating explanatory text;
- minimal ordinary borders;
- tonal fields only for trust or transition moments;
- no dashboard, scorecard, intake portal, or financial-institution appearance.

## 17. Mobile Interaction Model

At approximately 390x844:

First viewport:

- advisory eyebrow;
- clear purpose headline;
- 1-2 sentence support;
- primary CTA;
- optional secondary CTA;
- concise trust note.

Section order:

1. purpose;
2. preparation themes;
3. static journey topics;
4. questions to verify;
5. privacy and professional boundaries;
6. contact transition;
7. research continuations.

Progressive disclosure:

- allowed for question groups or journey topics if needed to reduce density;
- not required for essential boundaries.

Preparation-topic presentation:

- three to five stacked prompts;
- no long two-column list.

Question presentation:

- grouped prompts;
- no dense checklist UI;
- no saved state.

Trust-boundary placement:

- near first screen and before contact transition.

Contact CTA placement:

- early primary CTA and final primary CTA;
- no sticky CTA unless separately justified.

Continuation links:

- compact tertiary list below contact transition.

Maximum visible CTAs:

- no more than two in the first viewport;
- no more than one dominant action per section.

Touch-target guidance:

- at least existing button/link touch target quality;
- focus-visible styles preserved.

Expected scroll narrative:

- "I understand Advisory" -> "I know what to prepare" -> "I know what needs verification" -> "I understand privacy and boundaries" -> "I can contact or keep researching."

## 18. Tablet And Desktop Behavior

Content width:

- use restrained widths for reading;
- avoid full-width dense text.

Section rhythm:

- editorial sections with clear breathing room.

Two-column use:

- allowed for purpose plus trust note;
- allowed for topic groups when each block remains short;
- avoid two-column dense lists on small tablet widths.

Single-column editorial flow:

- preserve for important boundary, privacy, and contact-transition content.

CTA placement:

- primary CTA near purpose and contact transition;
- tertiary research links lower on page.

Trust-boundary layout:

- visible, concise tonal field;
- not a sidebar legal wall.

Research continuation layout:

- compact link group;
- not a large competing grid.

Maximum density:

- no more than 5-6 topic cards visible in one desktop section;
- no long route-choice wall.

## 19. Accessibility Requirements

Future implementation must preserve or improve:

- semantic heading order;
- keyboard navigation;
- visible focus states;
- link and button clarity;
- accessible names;
- screen-reader-readable disclosure content;
- logical reading order;
- no color-only meaning;
- touch targets;
- reduced-motion compatibility;
- accessible contact methods;
- clear anchor behavior for `/contact#advisory-readiness`.

## 20. Visual Treatment

Use:

- generous whitespace;
- editorial pacing;
- restrained tonal fields;
- floating explanatory text;
- minimal ordinary borders;
- clear hierarchy;
- concise prompts;
- functional boundaries only where needed.

Avoid:

- dashboard appearance;
- scorecard appearance;
- intake-portal appearance;
- financial-institution appearance;
- excessive shadows;
- excessive gradients;
- decorative effects;
- large card walls;
- dense legal blocks.

## 21. Existing Content Disposition

| Current content | Disposition | Reason |
| --- | --- | --- |
| Contact page orientation / title | KEEP_AND_SIMPLIFY | The route remains Contact, but Advisory should become the first substantive customer experience. |
| Production Status | MOVE_LOWER | Required public-trust content, but not the primary advisory first-screen message. |
| Public Contact | MOVE_LOWER | Keep accurate contact status without delaying advisory purpose. |
| Advisory Readiness eyebrow | KEEP_AND_ELEVATE | Correct product identity. |
| Advisory headline | KEEP_AND_ELEVATE | Strong concept; should anchor first screen. |
| Advisory orientation paragraph | KEEP_AND_SIMPLIFY | Accurate but too broad/dense for the future first screen. |
| Boundary statement | KEEP | Required trust and professional-boundary content. |
| Conversation prompts | KEEP_AND_SIMPLIFY | Useful preparation prompts; reduce count and group by theme. |
| Seven journey-context groups | MERGE | Merge into fewer static journey topics to reduce density. |
| Questions-to-bring groups | KEEP_AND_SIMPLIFY | Preserve domains, tighten presentation. |
| Evidence-aware framing | KEEP | Core REIE trust model. |
| Advisor role framing | KEEP_AND_ELEVATE | Should become a main confidence-building moment. |
| Continuity links | KEEP_AND_SIMPLIFY | Preserve routes but reduce visual competition. |
| Current Contact Routing | MERGE | Integrate with contact strategy and research continuations. |
| Form Notice | KEEP | Required privacy/form expectation content. |
| Existing footer | KEEP | No footer architecture change authorized. |

## 22. Route Strategy

Recommended route:

`/contact#advisory-readiness`

Evaluation:

- existing anchor: selected because certified, stable, and already linked by readiness surfaces;
- whole Contact page only: insufficient because Advisory should become a productized final journey experience;
- dedicated advisory route: deferred because route creation is not needed and not authorized;
- buyer/seller split: rejected because it fragments a shared final journey;
- context-specific routes: rejected because they increase route and personalization risk.

No route creation is authorized.

## 23. Implementation Phases

Recommended sequence:

### Phase 1: Structural Productization And Mobile Hierarchy

Purpose:

- reorganize existing `/contact#advisory-readiness` into the specified advisory hierarchy;
- simplify dense current content;
- keep route, Contact backend, forms, navigation, footer, Search, buyer, seller, market, neighborhood, Grand Plan, and protected systems unchanged.

### Phase 2: Visual Refinement

Only if production evidence after Phase 1 supports further refinement.

### Phase 3: Contact Infrastructure

Not recommended now. Any future infrastructure would require separate governance and likely remains prohibited unless explicitly authorized.

Selected first phase:

`REIE_ADVISORY_EXPERIENCE_PHASE_1_STRUCTURAL_PRODUCTIZATION_AND_MOBILE_HIERARCHY`

## 24. Likely Implementation File Scope

REQUIRED if Phase 1 is authorized:

- `app/contact/page.tsx`;
- `components/AdvisoryHandoffGuide.tsx`;
- implementation record under `docs/project-atlas/executive-library/`;
- `docs/CHAT_START.md`.

CONDITIONAL:

- possible bounded advisory component if it materially improves containment;
- focused deterministic check;
- `package.json` and `tsconfig.worker.json` only if registering a new check.

PROHIBITED_UNLESS_SEPARATELY_AUTHORIZED:

- API routes;
- CRM files;
- scheduling files;
- form backend behavior;
- email or notification files;
- persistence;
- telemetry;
- upload handling;
- provider integrations;
- AI;
- Prisma;
- migrations;
- Search files;
- map/GIS files;
- buyer, seller, financing, market, neighborhood, or Grand Plan runtime behavior;
- global navigation;
- footer architecture;
- deployment configuration.

## 25. Implementation Acceptance Criteria

Accept Phase 1 only if:

- advisory purpose is immediately clear;
- preparation precedes contact;
- there is one coherent advisory experience;
- dense Contact-page clutter is reduced;
- `/contact#advisory-readiness` remains authoritative;
- no new route is created;
- no hidden context transfer exists;
- no CRM or scheduling exists;
- no persistence exists;
- no automated qualification exists;
- no recommendation, score, readiness status, or professional conclusion appears;
- trust and professional boundaries are clear;
- all certified journeys retain continuity;
- Buyer Financing Planner advisory continuity remains intact;
- Buyer Readiness remains intact;
- Seller Readiness remains intact;
- Property / Seller Evidence boundaries remain intact;
- Search, market, neighborhood, Grand Plan, Contact, and public trust regressions are avoided;
- privacy language is accurate and non-invented;
- fair-housing and steering boundaries are preserved;
- mobile quality is materially improved;
- accessibility is preserved;
- no route, canonical, or sitemap regression occurs;
- production smoke passes under separate production-certification authorization.

## 26. Validation And Certification Plan

Later implementation validation should include:

- focused Advisory Experience deterministic check;
- Advisory Handoff regression;
- Advisory Operating Readiness;
- Product Cohesion;
- Decision Journey;
- Homepage Phase 1 regression;
- Buyer Financing Decision Planner regression;
- Buyer Financing Readiness;
- Buyer Readiness;
- Seller Readiness;
- Property / Seller Evidence Readiness;
- Search runtime;
- market-route regression;
- neighborhood-route regression;
- Grand Plan;
- public trust;
- fair-housing terminology review;
- privacy-boundary review;
- professional-boundary review;
- Evidence Depth non-exposure;
- route, canonical, and sitemap integrity;
- accessibility review;
- responsive review;
- interaction review;
- typecheck;
- lint;
- build;
- later production-domain smoke under separate authorization.

## 27. Protected Boundaries

This specification does not authorize:

- implementation;
- route creation or route changes;
- Contact backend behavior changes;
- form changes;
- CRM;
- scheduling;
- persistence;
- personalization;
- tracking or telemetry;
- uploads;
- APIs;
- Prisma;
- migrations;
- email or notifications;
- AI advisory;
- qualification or recommendations;
- Search changes;
- maps or GIS;
- buyer, seller, financing, market, neighborhood, or Grand Plan behavior changes;
- manual deployment;
- production certification;
- another initiative.

## 28. Open Questions

Open questions for the implementation authorization:

- Should the primary CTA label be "Prepare To Contact" or "Talk Through The Decision"?
- Should the Contact page title remain visually dominant, or should Advisory become the dominant first-screen label while route metadata stays Contact?
- Should question groups use progressive disclosure on mobile?
- Should research continuations include five links or fewer?
- Should the final contact transition link to `/contact` or a same-page Contact Routing section?

These do not block bounded implementation authorization because they can be answered within the selected Phase 1 scope without route, backend, CRM, scheduling, or persistence changes.

## 29. Next Authorization Gate

Next gate:

`READY_FOR_REIE_ADVISORY_EXPERIENCE_PHASE_1_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

Do not begin implementation without explicit authorization.
