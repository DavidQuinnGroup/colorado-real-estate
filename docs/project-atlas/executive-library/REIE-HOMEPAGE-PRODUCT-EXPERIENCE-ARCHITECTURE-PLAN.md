# PROJECT ATLAS(TM) REIE Homepage Product Experience Architecture Plan

Date: 2026-08-01

Status: REIE_HOMEPAGE_PRODUCT_EXPERIENCE_READY_FOR_BOUNDED_IMPLEMENTATION_AUTHORIZATION

Implementation authorization: not authorized

Route creation: not authorized

Design-system implementation: not authorized

## 1. Executive Planning Decision

The REIE homepage is ready for a bounded, homepage-first Product Experience implementation authorization.

The first implementation phase should be limited to structural simplification and mobile hierarchy. It should not create new routes, implement a Mortgage Calculator, redesign the site-wide design system, change Search, change market or neighborhood routes, or alter buyer and seller flows.

Recommended first phase:

`REIE_HOMEPAGE_PHASE_1_STRUCTURAL_SIMPLIFICATION_AND_MOBILE_HIERARCHY`

## 2. Baseline And Prior Deployment

Planning baseline:

- branch: `main`
- HEAD: `03b5016fe7320fbd17fc0f4573d2b9942b0b3a59`
- origin/main: `03b5016fe7320fbd17fc0f4573d2b9942b0b3a59`
- ahead / behind: `0 ahead / 0 behind`
- working tree before planning edits: clean

Prior documentation deployment for `03b5016fe7320fbd17fc0f4573d2b9942b0b3a59`:

- status: success
- GitHub/Vercel status ID: `51490919067`
- context: `Vercel`
- description: `Deployment has completed`
- Vercel target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/2RHzgLioPPCvvnkfFT8Vp4bDgw1H`
- observed status time: `2026-08-01T22:23:28Z`

## 3. Current Homepage Inventory

Current implementation:

- route file: `app/page.tsx`
- shared layout: `app/layout.tsx`
- global navigation: `components/PublicNavigation.tsx`
- footer: `components/Footer.tsx`
- journey continuity: `components/ContinueYourDecision.tsx`
- styling: `app/globals.css`
- structured data: `FAQSchema`, `buildToolSchema`, real-estate-agent schema in root layout
- data dependencies: `cities`, `getBlogLinks`
- primary image: `/colorado-front-range-hero.jpg`

Current homepage sections and surfaces:

1. Brokerage attribution: global trust/compliance bar.
2. Public navigation: logo, desktop route links, mobile details menu, persistent Search Homes CTA.
3. Hero: full-viewport image, H1, short copy, Start Your Search CTA, Why REIE CTA.
4. Why REIE: three principle statements.
5. Continue Your Decision: compact journey panel with Search, Market Context, Grand Plan links.
6. Choose Your Journey: Buy, Sell, Explore Colorado cards.
7. Search preview: explanatory copy, Guided Search CTA, embedded `GET /search` form with `city` and `q` inputs.
8. Communities: Market Context CTA, six featured community cards, authority links.
9. Grand Plan: image panel, Grand Plan copy, Grand Plan CTA.
10. David Quinn / advisory close: About and Contact CTAs.
11. Footer: experience links, public trust links, brokerage/public-trust status.

Current homepage CTAs and links include:

- `/search`
- `#why-reie`
- `/buy`
- `/sell`
- `#communities`
- `/market`
- `/market/boulder-co-housing-market`
- `/market/louisville-co-housing-market`
- `/market/lafayette-co-housing-market`
- `/search?city=Superior`
- `/market/erie-co-housing-market`
- `/market/longmont-co-housing-market`
- Boulder REIE Brief article link from `getBlogLinks`
- `/grand-plan`
- `/about`
- `/contact`
- footer trust and legal routes

Current forms and controls:

- one homepage Search form using `GET /search`
- mobile navigation uses a native `details` / `summary` menu
- no Mortgage Calculator public component appears on the homepage

Current visual and container patterns:

- full-bleed hero image with overlays
- bordered sticky navigation
- frosted hero CTA field
- bordered/ringed Continue Your Decision panel
- shadowed journey cards
- soft background Search field with dark form panel
- bordered/shadowed community cards
- Grand Plan image field with shadow
- footer border and link grids

## 4. Responsive Review Findings

Production homepage was reviewed at approximately:

- desktop: `1440x1100`
- tablet: `768x1024`
- mobile: `390x844`

Observed metrics:

- desktop scroll height: about `5337px`
- tablet scroll height: about `5779px`
- mobile scroll height: about `7829px`
- horizontal overflow: not observed
- broken images: not observed
- console warnings/errors: none observed during the review

Mobile first-screen finding:

- The first mobile viewport exposes global navigation, Search Homes, mobile menu route links, Start Your Search, and Why REIE. This creates too many simultaneous choices before the homepage has established one calm primary path.

Density findings:

- The mobile homepage is long and section-heavy.
- The communities section alone is about `2017px` tall on mobile and contains 11 links.
- The Search section is about `1053px` tall on mobile and duplicates Search entry already present in navigation and hero.
- Continue Your Decision is useful architecture, but its bordered nested panel is visually heavy on the homepage.

## 5. Homepage Primary Purpose

Primary purpose:

The homepage should orient a visitor to the REIE and guide them into one clear decision-starting path.

Primary action:

`Start Your Search` to `/search`

Secondary purposes:

- explain, briefly, why REIE is different;
- route buyers, sellers, market explorers, and planning-oriented users to the correct governed surface;
- establish trust and advisory access without becoming a complete directory or compliance wall.

The homepage should not remain a summary of the entire platform.

## 6. Target Product Experience

The “Apple-designed REIE” direction should be translated into original, non-branded principles:

- spacious first screen with one dominant action;
- editorial pacing instead of dense section stacking;
- no ordinary bordered boxes around explanatory text;
- fewer simultaneous choices per viewport;
- large, confident typography with concise copy;
- soft section transitions using whitespace, tonal fields, and imagery rather than outlines;
- purposeful imagery that supports Colorado advisory context;
- progressive disclosure for secondary journeys;
- no dashboard or scorecard appearance;
- no dense legal-wall presentation;
- calm motion only if it clarifies state and respects reduced-motion preferences;
- premium but accessible contrast, focus, and touch-target behavior.

No Apple branding, proprietary assets, exact layouts, typography, product names, or trade dress are authorized or recommended.

## 7. Section-By-Section Disposition

| Current section | Status | Rationale and destination |
| --- | --- | --- |
| Brokerage attribution | KEEP_AND_SIMPLIFY | Preserve compliance/trust. Do not make it compete with first-screen hierarchy. |
| Public navigation | KEEP_AND_SIMPLIFY | Preserve routes, but reduce mobile first-screen competition. Navigation remains global. |
| Hero | KEEP_AND_ELEVATE | Make it the primary orientation surface with one dominant Search action and one subtle secondary path. |
| Why REIE | KEEP_AND_SIMPLIFY | Keep only the essential product promise. Merge verbose principle detail into a lighter editorial section. |
| Continue Your Decision | MERGE_WITH_ANOTHER_SECTION | Preserve Decision Journey continuity, but convert from bordered panel to a lighter homepage journey strip or move detailed state language to destination pages. |
| Choose Your Journey | KEEP_AND_SIMPLIFY | Keep Buy, Sell, and Market/Explore paths, but reduce card weight and CTA repetition. |
| Search preview | KEEP_AND_SIMPLIFY | Keep Search as the primary product action, but avoid a second heavy Search workspace on the homepage. Form can become a minimal entry field or move fully to `/search`. |
| Communities | MOVE_TO_EXISTING_PAGE | Move detailed community directory behavior to `/market`. Homepage should include one Market Context teaser, not 6 cards plus authority links. |
| Grand Plan | KEEP_AND_SIMPLIFY | Keep as a later editorial transition, not a large mid-page destination competing with Search. |
| David Quinn advisory close | KEEP_AND_ELEVATE | Keep as final human-support route with Contact and About, but simplify copy. |
| Footer | KEEP_AND_SIMPLIFY | Preserve trust/legal/footer links. No redesign in Phase 1 except avoiding homepage duplication. |
| FAQ schema | KEEP_AND_SIMPLIFY | Preserve structured-data intent, but align questions with simplified homepage promise. |
| Tool schema | KEEP_AND_SIMPLIFY | Preserve route/canonical behavior and REIE tool identity. |

## 8. Proposed Homepage Information Hierarchy

Recommended top-to-bottom sequence:

1. Global trust/navigation, visually quiet.
2. Hero: REIE orientation, one dominant `/search` CTA, one quiet “How REIE helps” anchor.
3. Primary decision entry: three simple text-led paths: Search, Buy, Sell. Market Context appears as supporting path, not equal first-screen competition.
4. REIE difference: concise editorial explanation of context, evidence limits, and advisory judgment.
5. Search orientation: minimal prompt and `/search` continuity; avoid full search-like interface unless Phase 1 validates it as necessary.
6. Market and neighborhood context teaser: one concise link to `/market`, with optional reference to certified market and neighborhood experiences.
7. Grand Plan teaser: keep for users who need planning context rather than immediate search.
8. Advisory close: Contact and About.
9. Footer.

Sections not recommended for homepage depth:

- full community directory;
- detailed authority link list;
- mortgage calculation;
- long compliance explanations;
- dense decision-state panels.

## 9. Mobile-First Homepage Architecture

Mobile first screen:

- brand and quiet navigation;
- short REIE label;
- H1 focused on context-led home search;
- one primary CTA: `Start Your Search`;
- one secondary text link: `How REIE Helps` or `Choose Your Path`;
- no expanded multi-link route list above the hero unless the user opens Menu.

Mobile section order:

1. Hero.
2. Three-path decision entry.
3. REIE difference.
4. Minimal Search orientation.
5. Market Context teaser.
6. Grand Plan teaser.
7. Advisory close.
8. Footer.

Mobile rules:

- maximum two visible CTAs per viewport where practical;
- no multi-card grids above the first two scrolls;
- no ordinary bordered explanatory panels;
- prefer full-width editorial sections and whitespace;
- keep section copy under about 45-70 words;
- keep card copy under about 24-34 words;
- avoid duplicated Search links in adjacent sections;
- keep touch targets at least 44px high;
- preserve focus-visible states and reduced-motion behavior.

## 10. Whitespace, Border, And Container Strategy

Current bordered or container-heavy elements:

- sticky global navigation border and shadow;
- hero CTA frosted container;
- Continue Your Decision border/ring/panel;
- journey cards with shadow;
- Search preview soft container and dark form panel;
- Search input borders;
- community card borders and shadows;
- Grand Plan image shadow;
- footer border;
- principle divider lines.

Recommended treatment:

- retain borders only for functional controls, navigation separation, inputs, and footer/trust structure;
- remove visible borders from explanatory text containers;
- replace Continue Your Decision panel border with a lighter editorial journey strip or move detailed state to destination pages;
- reduce community card treatment on homepage by moving the directory to `/market`;
- keep input borders if the Search entry remains;
- use whitespace, typographic scale, image rhythm, and background fields for section separation.

## 11. Destination-Page Architecture

Existing destinations to use:

- `/search`: full search workspace.
- `/market`: market and community directory.
- `/buy`: buyer guidance.
- `/buy#financing-readiness`: buyer financing readiness.
- `/sell`: seller guidance.
- `/home-worth`: seller/home-worth entry.
- `/home-worth#seller-readiness`: seller readiness.
- `/grand-plan`: planning surface.
- `/about`: David Quinn/advisory context.
- `/contact` and `/contact#advisory-readiness`: advisory handoff.

Potential future new pages:

- `/how-reie-works`: optional later destination for deeper REIE methodology, evidence boundaries, and product explanation if Phase 1 removal leaves a gap.
- `/tools/mortgage-calculator` or `/mortgage-calculator`: not recommended for Phase 1; should be considered only after financing-product governance.

Phase 1 should create no new routes. It should move homepage depth to existing pages only.

## 12. Mortgage Calculator Strategy

Recommended strategy:

`BUYER_FINANCING_READINESS_INTEGRATION`

Rationale:

- Prior repository records identify Mortgage Calculator as open future work, not an implemented public route.
- Buyer financing readiness is already certified at `/buy#financing-readiness`.
- A homepage calculator would introduce payment, rate, affordability, fair-lending, and false-precision risk into the first impression.
- Existing `lib/marketMetrics.ts` and `lib/financialEngine.ts` include mortgage-related calculation primitives, but those primitives should not be promoted to public product behavior without separate financing-product authorization.

Future calculator posture:

- homepage role: at most a small financing-readiness link, not an embedded calculator;
- appropriate surface: `/buy#financing-readiness` first, with possible later dedicated calculator route only if separately authorized;
- likely inputs if later authorized: purchase price, down payment, rate, loan term, taxes, insurance, HOA, optional PMI;
- outputs: educational estimates only, clearly non-binding;
- required boundaries: no lending approval, no qualification, no affordability conclusion, no rate guarantee, no lender recommendation, no personalized financial advice, no persistence unless separately authorized.

## 13. Navigation And Journey Findings

Current journeys are broad and mostly healthy, but the homepage duplicates too many destinations:

- `/search` appears in navigation, hero, continuation panel, Search section, authority links, and footer.
- `/market` appears in navigation, continuation panel, community section, and footer.
- `/grand-plan` appears in navigation, continuation panel, Grand Plan section, and footer.
- `/about` and `/contact` appear in navigation, advisory close, and footer.

Recommended journey model:

- Search is the primary homepage action.
- Buy and Sell are secondary path choices after the hero.
- Market is a supporting context path.
- Grand Plan is a planning path later in the scroll.
- Contact is the final advisory handoff.

No dead links were identified in the reviewed homepage inventory. The issue is not broken navigation; it is hierarchy and CTA competition.

## 14. Reusable Product Experience System

Homepage-first principles:

- spacing: use larger vertical whitespace and fewer section boundaries;
- typography: keep hero-scale type only in hero and major editorial beats;
- page width: maintain constrained content width, avoid dense full-width grids on mobile;
- cards: use only for true choices, not ordinary explanations;
- buttons: one primary per section, secondary links should be visually quieter;
- image ratios: use stable aspect ratios; no decorative-only cropped imagery when product clarity matters;
- icons: use sparingly and only when they clarify route purpose;
- background fields: use soft tonal bands instead of bordered text boxes;
- border use: functional controls only by default;
- disclosure: limitation language should be concise and close to the relevant action;
- animation: subtle only; respect reduced-motion;
- accessibility: preserve keyboard focus, contrast, semantic headings, form labels, and touch target size.

Potentially reusable later after separate review:

- homepage editorial section rhythm;
- simplified journey entry patterns;
- softer Product Experience card primitives;
- spacing and CTA hierarchy conventions.

Not authorized now:

- site-wide design token implementation;
- redesign of all routes;
- navigation refactor;
- new component library.

## 15. Visual-Content Needs

Phase 1 can reuse current imagery.

Later phases may need:

- one stronger hero image or curated Colorado advisory image;
- optional editorial imagery for Grand Plan or advisory;
- no new decorative SVG system;
- no generated or licensed imagery until separately authorized.

Neighborhood, map, or GIS imagery is not needed for the homepage redesign.

## 16. Content Principles

Homepage copy should be:

- concise;
- confident;
- customer-centered;
- specific to REIE;
- limitation-forward only where the user is about to act or rely on information;
- free of internal architecture terms;
- free of superiority claims;
- free of steering language;
- free of valuation, rate, affordability, safety, school, appreciation, ranking, or predictive claims.

Target word-count ranges:

- hero support copy: 14-24 words;
- primary path cards: 18-30 words each;
- REIE difference section: 45-75 words total;
- Search orientation: 35-60 words;
- Market teaser: 30-50 words;
- Grand Plan teaser: 30-50 words;
- advisory close: 35-60 words.

## 17. Proposed Implementation Phases

Phase 1: Structural simplification and mobile hierarchy.

- reduce first-screen CTA competition;
- simplify homepage section order;
- remove or soften ordinary bordered panels;
- move detailed community-directory behavior to `/market`;
- preserve all existing routes and destinations;
- no Mortgage Calculator implementation.

Phase 2: Visual system refinement.

- tune whitespace, typography, imagery, background fields, and card treatments;
- still homepage-first unless separately authorized.

Phase 3: Destination-page extraction.

- create new destination pages only if Phase 1 proves existing pages cannot absorb moved content.

Phase 4: Mortgage Calculator / financing-tool planning or implementation.

- only after separate financing-product and compliance authorization.

Phase 5: production certification and closure.

- only after implementation and push authorization.

## 18. Selected First Implementation Phase

Selected first phase:

`REIE_HOMEPAGE_PHASE_1_STRUCTURAL_SIMPLIFICATION_AND_MOBILE_HIERARCHY`

Allowed planning concept for later implementation:

- update `app/page.tsx` and homepage CSS only as needed;
- preserve existing route `/`;
- preserve canonical `https://davidquinngroup.com`;
- preserve Search, Market, Buy, Sell, Home Worth, Grand Plan, About, and Contact continuity;
- do not create routes;
- do not implement Mortgage Calculator;
- do not modify Search behavior, market routes, neighborhood routes, buyer/seller flow logic, APIs, Prisma, persistence, or telemetry.

## 19. Likely Future File Scope

Required for Phase 1 if separately authorized:

- `app/page.tsx`
- `app/globals.css`
- one implementation record under `docs/project-atlas/executive-library/`
- `docs/CHAT_START.md`

Conditional:

- homepage-specific component extraction only if it reduces complexity without broad design-system work;
- focused homepage deterministic check if the repository standard requires certification coverage.

Prohibited unless separately authorized:

- `components/PublicNavigation.tsx`
- `components/Footer.tsx`
- Search files;
- market and neighborhood route files;
- buyer/seller route logic;
- Mortgage Calculator files;
- package/config files;
- APIs;
- Prisma/migrations;
- persistence;
- telemetry;
- deployment configuration.

## 20. Acceptance Criteria For Later Implementation

Later implementation must certify:

- substantially reduced homepage density;
- clear first-screen purpose;
- one dominant primary action;
- meaningful whitespace;
- no ordinary bordered text boxes;
- mobile-first hierarchy;
- communities depth moved to `/market` or simplified;
- no lost customer journey;
- no Mortgage Calculator unless separately authorized;
- no route or SEO regression;
- no Search regression;
- no market or neighborhood regression;
- no buyer/seller journey regression;
- no fair-housing issue;
- no evidence-boundary issue;
- accessibility and keyboard focus preserved;
- no horizontal overflow;
- no overlapping layout;
- no broken images;
- no console errors;
- production smoke passes under separate certification authorization.

## 21. Validation And Certification Plan

Later implementation should run or perform:

- homepage deterministic check if created;
- Product Cohesion;
- Decision Journey;
- public runtime;
- Search runtime;
- market-route regression;
- South Boulder regression;
- Table Mesa regression;
- buyer readiness;
- seller readiness;
- Property / Seller Evidence;
- Advisory Handoff;
- Grand Plan;
- public trust;
- fair-housing terminology review;
- sitemap;
- canonical;
- route integrity;
- desktop/tablet/mobile responsive review;
- accessibility review;
- interaction review;
- typecheck;
- lint;
- build;
- production public-experience smoke under separate production-certification authorization.

## 22. Protected Boundaries

This planning phase does not authorize:

- homepage implementation;
- route creation;
- destination page creation;
- Mortgage Calculator implementation;
- navigation changes;
- Search changes;
- map/GIS changes;
- market or neighborhood route changes;
- buyer/seller flow changes;
- canonical or sitemap changes;
- analytics or telemetry;
- personalization;
- providers;
- APIs;
- Prisma or migrations;
- persistence;
- customer data;
- CRM;
- alerts, queues, workers, email, or notifications;
- deployment configuration;
- manual deployment;
- production certification;
- another initiative.

## 23. Blockers And Open Questions

No blocker prevents Phase 1 planning from proceeding to a bounded implementation authorization.

Open questions for later phases:

- whether a deeper `/how-reie-works` page is needed after homepage simplification;
- whether a dedicated Mortgage Calculator route should ever be authorized;
- whether homepage-specific visual primitives should become a broader REIE Product Experience system after Phase 1 certification;
- whether new original photography should be acquired or generated after the structural redesign is certified.

## 24. Next Authorization Gate

`READY_FOR_REIE_HOMEPAGE_PHASE_1_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

No implementation may begin until that explicit authorization is provided.
