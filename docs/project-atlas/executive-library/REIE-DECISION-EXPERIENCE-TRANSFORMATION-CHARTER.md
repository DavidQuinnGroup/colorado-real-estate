# REIE Decision Experience Transformation Charter

Program: REIE Decision Experience Transformation (DXT 1.0)
Phase: Foundational Transformation Charter
Status: PLANNING_ONLY_DOCUMENTATION_ONLY
Created: 2026-08-02
Repository baseline observed: bea64476dccc974189b29bc3221f2efc97c3bcd4

## Executive Purpose

REIE Decision Experience Transformation (DXT 1.0) governs the next generation of REIE customer experience. It is not a UX polish program and not a visual redesign program. It is a foundational transformation of how customers experience real-estate decision making across REIE.

The governing principle is:

**Every page exists to help someone make one better decision.**

The primary design question for every future surface is:

**What should the customer feel, understand, and do next?**

The rejected design question is:

**What else should we explain?**

DXT exists because REIE has reached a launch-capable state, but the production experience can still ask too much of the customer. The next product standard must move REIE from evidence-rich documentation and inventory exposure toward guided decision experiences that feel calm, premium, useful, and emotionally clear.

## DXT Philosophy

### The Homepage Is The Invitation, Not The Manual

The homepage should establish confidence, curiosity, and a single dominant way to begin. It should not teach the entire REIE system. It should make the customer feel that a better real-estate decision is possible and that Search is the natural first action.

### Information Follows Curiosity

REIE should not front-load everything it knows. Information should appear when the customer has enough context to care about it. Earlier sections should create orientation and desire; later sections can carry depth.

### One Page Equals One Primary Question

Every major page must answer one governing customer question. Supporting sections may add context, but they must not compete with the page's primary decision.

### One Primary Action Per Major Viewport

Each major viewport should make one primary action obvious. Secondary actions are allowed only when they clarify the path instead of increasing choice burden.

### Progressive Disclosure Over Explanation

REIE should reveal complexity in stages. A customer should not have to parse every route, filter, disclaimer, evidence source, or decision path before taking the next useful step.

### Discovery Over Documentation

REIE can remain evidence-rich without feeling like a documentation archive. Pages should feel like guided discovery: a customer learns because the experience helps them ask better questions.

### Context Before Conclusions

REIE should provide context that supports decision preparation, not unsupported certainty. The platform should help customers understand what matters, what is known, what is uncertain, and what must be verified.

### Emotional Clarity Before Informational Depth

A customer should first feel oriented, calm, and capable. Deep information should support that state, not overwhelm it.

### Premium Restraint Over Feature Density

Premium does not mean more features per screen. It means stronger sequence, fewer simultaneous choices, clearer hierarchy, and a product that knows when to stay quiet.

### Every Section Must Earn Its Place

A section exists only if its absence would make the customer make a worse decision. Content that merely repeats, reassures the organization, or explains the system without advancing the customer must be removed, merged, or moved lower.

## Transformation Waves

DXT 1.0 is organized into four waves. The waves are sequential in philosophy but may be planned independently if authorized. No wave authorizes implementation by itself.

### Wave 1 - Decision Architecture

Objective:

Define the governing decision question, hierarchy, entry state, continuation model, and section purpose for every major public surface.

Included surfaces:

- Homepage
- Search
- Property pages
- Buyer journey
- Seller journey
- Market pages
- Neighborhood pages
- Advisory Experience
- Navigation and continuation links where they directly affect decision flow

Success criteria:

- Every major page has exactly one primary customer question.
- Every major page has one dominant next action.
- Sections are sequenced by customer decision state, not internal content categories.
- Repeated explanation is reduced.
- Search and property discovery become the central decision path rather than a raw inventory path.
- Trust and disclosure language remains present but no longer dominates the emotional opening unless required.

Non-goals:

- No visual redesign as the primary objective.
- No new routes by default.
- No Search ranking, map provider, data-provider, or API change by default.
- No personalization, telemetry, CRM, saved state, or customer profiling.
- No new market, neighborhood, valuation, financing, or suitability claims.

Protected boundaries:

- Preserve public trust, fair-housing, professional-boundary, and evidence limits.
- Preserve canonical, sitemap, route, Search, map, property, buyer, seller, market, neighborhood, Grand Plan, Contact, Advisory, and hard-launch boundaries unless separately authorized.
- No runtime implementation without a separate implementation gate.

### Wave 2 - Decision Journeys

Objective:

Transform each customer journey into a staged path from question to action: orient, explore, compare, verify, and continue.

Included surfaces:

- Buyer journey
- Seller journey
- Search-to-property path
- Property-to-advisory path
- Market-to-search path
- Neighborhood-to-search path
- Buyer Financing Planner handoff
- Advisory Experience continuation

Success criteria:

- Customers can understand where they are in the journey.
- Each journey has a clear next step and a clear advisory transition.
- Buyer and Seller experiences feel equally productized.
- Property pages bridge from listing facts to decision preparation.
- Market and neighborhood pages function as briefings, not static evidence dumps.

Non-goals:

- No automated recommendations.
- No qualification, approval, affordability, valuation certainty, or suitability conclusions.
- No CRM, scheduling, lead scoring, saved workspace, hidden context transfer, or personalization.
- No broad site rewrite.

Protected boundaries:

- Keep all journey content fair-housing safe and limitation-forward.
- Preserve provider-independent and non-persistent financing posture.
- Preserve Advisory as prepared professional conversation, not automated advice.

### Wave 3 - Interaction Design

Objective:

Make the core customer interactions feel guided, responsive, and decision-oriented without adding unauthorized data collection or personalization.

Included surfaces:

- Search filters
- Search map/list toggle
- Property cards
- Property detail continuation
- Buyer Financing Planner interaction
- Advisory continuation links
- Mobile navigation and action hierarchy

Success criteria:

- Interactions explain what changed and what to do next.
- Map/list switching feels purposeful.
- Filters are progressively disclosed rather than all competing at once.
- Property cards help customers decide whether to inspect further.
- Mobile touch flows reduce cognitive load.
- Accessibility and keyboard use remain strong.

Non-goals:

- No live-rate feeds, provider integrations, recommendation engines, AI advisors, saved search expansion, telemetry, or analytics-based personalization.
- No Search algorithm or ranking change unless separately authorized.
- No map provider replacement unless separately authorized.

Protected boundaries:

- No customer financial profiles.
- No hidden state transfer.
- No CRM mutation.
- No production-data mutation.
- No API or Prisma changes without separate authorization.

### Wave 4 - Visual Language

Objective:

Create a restrained premium visual language that supports decision clarity after the decision architecture and journey model are defined.

Included surfaces:

- Page spacing and rhythm
- Typography hierarchy
- Section density
- CTA presentation
- Tonal fields
- Border and container rules
- Disclosure placement
- Mobile-first layout rhythm
- Reusable visual primitives only if separately justified

Success criteria:

- Pages feel calmer and more intentional.
- Visual hierarchy reinforces the governing decision question.
- Long pages have stronger rhythm and fewer repetitive section forms.
- Functional controls remain clear without creating dashboard, portal, or form-heavy impressions.
- Premium restraint is visible without weakening trust boundaries.

Non-goals:

- No purely cosmetic redesign divorced from decision architecture.
- No site-wide visual rewrite before higher-priority decision flow problems are addressed.
- No decorative effects that compete with product clarity.

Protected boundaries:

- Preserve accessibility, focus states, touch targets, readable contrast, and reduced-motion compatibility.
- Preserve existing brand, brokerage, public trust, and professional-boundary requirements.
- No global CSS or component-system enforcement without separate authorization.

## Governing Decision Questions

### Homepage

What is REIE, why should I trust it as a better way to begin, and what is the one best first step?

Primary action: Start Search.

### Search

Which homes deserve my attention first, and how should I narrow the field without losing context?

Primary action: Begin or refine guided discovery.

### Property

Is this property worth a closer look, and what do I need to verify before I act?

Primary action: Continue evaluation through Search context, professional review, or advisory preparation.

### Buyer

What should I understand before I move from browsing to a serious buying decision?

Primary action: Continue to Search, financing readiness, or advisory preparation based on readiness.

### Seller

What should I prepare before I expose a property to the market?

Primary action: Prepare seller questions and transition to advisory review.

### Market

What is the current market context I should consider before choosing my next property or strategy step?

Primary action: Use market context to continue Search, Buyer, Seller, or Advisory.

### Neighborhood

What should I understand about this place before comparing homes here?

Primary action: Search this neighborhood or continue to broader market context.

### Advisory

What should I bring into a professional conversation, and what needs qualified verification?

Primary action: Contact after preparation.

## Section Test

Every future section must pass this test:

**If this disappeared, would the customer make a worse decision?**

A section passes when it does at least one of the following:

- clarifies the page's governing decision question;
- reduces the customer's next-step uncertainty;
- reveals context needed before action;
- helps compare options responsibly;
- identifies what is unknown or requires verification;
- supports trust, privacy, fair-housing, professional-boundary, or evidence safety at the moment it matters;
- creates a necessary transition to the next decision surface.

A section fails when it primarily does one of the following:

- repeats an idea already expressed clearly;
- explains REIE instead of helping the customer decide;
- adds another CTA without resolving a decision need;
- showcases capability without changing customer understanding;
- surfaces internal structure, governance, or evidence mechanics before the customer needs them;
- increases cognitive load without improving decision quality;
- exists because the organization wants to say it, not because the customer needs it now.

Application model:

1. Name the page's primary question.
2. Name the customer's desired feeling, understanding, and next action.
3. List every section in order.
4. For each section, answer the disappearance test.
5. Classify the section as KEEP, SIMPLIFY, MERGE, MOVE LOWER, or REMOVE.
6. Preserve required trust and legal boundary content, but tune placement and density when possible.
7. Reject any section that cannot show a decision-quality purpose.

## Design Principles

### Feel

Customers should feel calm, oriented, respected, and capable. They should not feel that they are being sold, scored, qualified, routed into a lead machine, or asked to decode a data system.

### Understand

Customers should understand what the page is for, what decision it helps with, what is known, what remains uncertain, and what must be verified.

### Do Next

Customers should always know the next appropriate action. The next action may be Search, refine, compare, verify, prepare, or contact. It should rarely be a cluster of equal choices.

### Restraint

DXT favors fewer visible choices, stronger hierarchy, and staged depth. A premium decision product should feel intentionally incomplete at first glance because it reveals depth only when the customer is ready.

### Trust

Trust is not created by saying everything. Trust is created by being clear, useful, accurate, bounded, and professionally humble.

### Mobile First

Mobile is not a compressed desktop. Mobile DXT surfaces should use single-column progression, one dominant action per major viewport, compact continuations, readable prompts, and progressive disclosure.

### Accessibility

Decision clarity must also be accessibility clarity. Heading order, labels, focus states, screen-reader-readable boundaries, link clarity, contrast, touch targets, and keyboard flow are DXT requirements, not afterthoughts.

## First Planning Recommendation

The first separately authorized DXT planning phase should be:

`REIE_DXT_WAVE_1_DECISION_ARCHITECTURE_PLANNING`

Recommended first focus inside Wave 1:

- Search
- Map/list interaction
- Property discovery
- Property page handoff
- Homepage-to-Search continuity

Reason:

Search and property discovery are the core REIE public value path and the highest-priority production UX gap identified in the production UX remediation assessment.

## Authorization Boundary

This charter authorizes no implementation. It does not authorize runtime changes, routes, components, CSS, visual redesign, Search changes, map changes, APIs, Prisma, telemetry, CRM, persistence, provider integrations, AI, production-data mutation, or production certification.

## Next Authorization Gate

`READY_FOR_REIE_DXT_WAVE_1_DECISION_ARCHITECTURE_PLANNING`

That gate should authorize planning only unless a later charter explicitly authorizes implementation.

## Charter Outcome

Status: `REIE_DECISION_EXPERIENCE_TRANSFORMATION_READY`
