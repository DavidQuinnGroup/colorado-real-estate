# REIE DXT Wave 1B Post Marker Preview Next Phase Review

Program: REIE Decision Experience Transformation (DXT 1.0)
Phase: Wave 1B - Post Marker Preview Next Phase Review
Status: REIE_DXT_WAVE_1B_NEXT_PHASE_SELECTED
Created: 2026-08-02
Repository baseline verified before review: `a44509621af294b34c5306bd6c70b4cf65d5510d`

## Executive Decision

The next bounded Wave 1B phase should be:

`REIE_DXT_WAVE_1B_PERSISTENT_SEARCH_WORKSPACE_SHELL`

Recommended outcome:

`READY_FOR_PERSISTENT_SEARCH_WORKSPACE_SHELL_PRODUCT_SPECIFICATION`

Exact next authorization gate:

`READY_FOR_REIE_DXT_WAVE_1B_PERSISTENT_SEARCH_WORKSPACE_SHELL_PRODUCT_SPECIFICATION`

This review authorizes planning only. It does not authorize implementation, runtime changes, Search changes, map changes, property-route changes, provider changes, API changes, persistence, telemetry, CRM, brokerage disclosure changes, production certification, or the next DXT phase.

## Prior Deployment Status

The latest successful deployment associated with the review baseline was verified before documentation work:

- Commit: `a44509621af294b34c5306bd6c70b4cf65d5510d`
- Status: `success`
- GitHub/Vercel status ID: `51507248585`
- Context: `Vercel`
- Description: `Deployment has completed`
- Target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/F24CVxbVLhZPV8Y3h1AH4KPKb3WB`
- Updated: `2026-08-02T15:57:30Z`

The earlier pending Vercel status for the same documentation deployment was superseded by this successful status. No later commit or deployment supersession was found before the review began.

## Current Certified Wave 1B State

Certified and closed:

- DXT Charter.
- DXT Wave 1 Decision Architecture Planning.
- DXT Wave 1B Search and Property Persistent Decision Workspace Specification.
- DXT Wave 1B Search Marker and Preview Interaction Remediation.

Current certified production state:

- Search marker click selects a property.
- The selected-property drawer is the pinned interactive preview.
- Hover is supplemental only.
- Preview lifetime is independent of pointer movement.
- `View Property` is reachable.
- Touch interaction and accessible equivalent paths are preserved.
- Existing `/properties/[id]` route architecture remains intact.
- No new route, API, provider, persistence, telemetry, CRM, brokerage disclosure change, or full property workspace was introduced.

Known remaining Wave 1B gap:

- Full restoration of map bounds, filters, selected preview, and list scroll position remains future workspace work.
- The selected-property preview is a bounded decision preview, not the full persistent Search/property workspace.

Brokerage disclosure hold remains:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

## Candidates Evaluated

### A. Persistent Search Workspace Shell

Description:

- Productize the existing Search view as a stable list/map/criteria/selection shell.
- Preserve the selected property, active criteria, evidence state, and map/list relationship while customers compare and move through the search decision.
- Keep the work on the existing `/search` surface unless a later authorization explicitly expands it.

Decision:

Selected for product specification.

### B. Property Detail Context Preservation

Description:

- Improve continuity between `/search` and `/properties/[id]`.
- Define how customers return from property detail without reconstructing criteria, map position, selected listing, or decision context.

Decision:

Deferred until the persistent Search workspace shell defines the state model and workspace boundaries.

### C. Map Visual Language Normalization

Description:

- Normalize the map's perceived visual quality and brand alignment.
- Evaluate tile presentation, marker tone, overlays, theme feasibility, provider boundaries, and licensing constraints.

Decision:

Deferred. Provider, tile-source, and style-control constraints require a separate feasibility and licensing gate before implementation can be responsibly selected.

### D. Another Repository-Supported Wave 1B Phase

Decision:

Not selected. The three named candidates cover the known post-remediation Wave 1B decision space, and Candidate A is the clearest next step.

## Persistent Search Workspace Findings

Repository evidence supports this as the next highest-leverage phase:

- `components/search/SearchInterface.tsx` already owns active criteria, result state, selected listing, hovered listing, mobile view, map bounds, and URL criteria updates.
- `components/maps/MapInner.tsx` already passes visible listings, selected state, hovered state, search metadata, and access-level metadata into the map.
- `components/maps/SearchMap.tsx` already supports selected marker state, marker metadata, map selection, bounds changes, clustering, and selected-property panning.
- `components/maps/SelectedPropertyDrawer.tsx` already provides the bounded selected-property preview.
- The prior Wave 1B specification already selected `CLICK_PINNED_PREVIEW_WITH_PERSISTENT_MAP`.
- The remediation closure explicitly records that the full persistent Search/property workspace remains future work.

Customer value:

- Highest among the candidates because it improves the core property-discovery loop customers use before deciding whether to open property detail, compare, finance, or contact advisory.

Enterprise leverage:

- High. It turns the successful marker/preview remediation into a reusable DXT workspace pattern for later Search, property, and comparison decisions.

Complexity:

- Medium. It requires careful product specification around state, layout, responsive behavior, and acceptance criteria, but does not inherently require new routes, APIs, provider changes, or persistence.

Production risk:

- Moderate and controllable if first handled as product specification. Risks include accidental broad Search redesign, state/persistence creep, mobile density, and over-expanding into property detail.

Governance readiness:

- Strong. Existing DXT records, Search runtime checks, marker/preview remediation, Product Cohesion, Decision Journey, and public-trust boundaries provide enough authority for product specification.

## Property Detail Context Preservation Findings

Repository evidence:

- The existing property route is implemented at `app/properties/[id]/page.tsx`.
- The property route contains rich property-decision content, inquiry paths, related links, property decision workspace support, schema, and public-trust language.
- The prior Wave 1B specification identifies same-tab property routing with restored Search context as deferred supporting behavior.
- The marker/preview closure confirms Back and Forward returned between Search and property detail, while full restoration of map bounds, filters, selected preview, and list scroll remains future workspace work.

Customer value:

- High, but downstream of Search shell clarity. It matters most after customers can trust the Search workspace itself.

Enterprise leverage:

- High later. It can create the feeling that Search and Property are one decision continuum.

Complexity:

- Medium to high. It requires precise decisions about URL state, browser history, selection state, list scroll, map bounds, and direct-entry behavior.

Production risk:

- Higher than Candidate A because it could affect property routes, canonical expectations, Back/Forward behavior, and Search-to-property continuity.

Deferral reason:

- Context preservation should inherit a defined Search workspace state model rather than invent its own. Selecting it before the shell would risk solving return behavior before defining the workspace customers return to.

## Map Visual-Language Findings

Repository evidence:

- `SearchMap` currently uses OpenTopoMap tiles and conditionally overlays Mapbox outdoors detail when `NEXT_PUBLIC_MAPBOX_TOKEN` exists.
- Marker and interface accents use cyan-toned UI language.
- Requirements traceability records open map visual requirements around Electric Caribbean Blue, map color options, and initial map visual behavior.
- Current repository evidence does not prove water or basemap color control through the existing map provider setup.

Customer value:

- Medium to high for perceived polish and first impression, but less foundational than making Search feel like a stable decision workspace.

Enterprise leverage:

- Medium. A better map visual language may improve premium feel, but it is limited unless tied to provider/style governance and Search decision architecture.

Complexity:

- Potentially high if provider, tile style, licensing, theme selection, or attribution behavior changes are required.

Production risk:

- High relative to a planning phase if treated as implementation. Provider, source-rights, accessibility contrast, attribution, and map rendering behavior must remain protected.

Deferral reason:

- Map visual-language work is real, but not the next safest planning target. It should follow either a persistent workspace shell or a dedicated map provider/style feasibility review.

## Map Provider And Licensing Findings

Repository evidence records:

- Search map views use third-party map tile providers.
- OpenTopoMap and optional Mapbox tile usage are present in `components/maps/SearchMap.tsx`.
- Public Trust records identify third-party map tile providers where public map components render tiles.
- Requirements traceability identifies provider/style authorization as a prerequisite for exact map visual-language changes.

Findings:

- No map provider or tile-source change is authorized by this review.
- No licensing conclusion is made here beyond repository evidence that provider/style changes require separate authorization.
- No new map theme, tile source, provider integration, token behavior, attribution change, or style override should be planned for implementation without an explicit provider/licensing review gate.

## Customer Impact Comparison

1. Persistent Search Workspace Shell: strongest immediate impact on Search confidence, property comparison, mobile clarity, and decision continuity.
2. Property Detail Context Preservation: strong impact after Search shell is stable, especially for Back/Forward and deeper property review continuity.
3. Map Visual Language Normalization: meaningful for premium feel, but less urgent than interaction and context continuity and more constrained by provider boundaries.
4. Alternate Wave 1B Phase: not justified because the named candidates cover the repository-supported gaps.

## Complexity And Risk Comparison

| Candidate | Complexity | Production Risk | Governance Readiness | Source-Rights / Provider Risk |
| --- | --- | --- | --- | --- |
| Persistent Search Workspace Shell | Medium | Medium | High | Low if no provider changes |
| Property Detail Context Preservation | Medium-High | Medium-High | Medium | Low if no provider changes |
| Map Visual Language Normalization | Medium-High | High | Medium | High |
| Alternate Wave 1B Phase | Unknown | Unknown | Low | Unknown |

## Recommended Next Phase

Program name:

`REIE_DXT_WAVE_1B_PERSISTENT_SEARCH_WORKSPACE_SHELL`

Recommended next gate:

`READY_FOR_REIE_DXT_WAVE_1B_PERSISTENT_SEARCH_WORKSPACE_SHELL_PRODUCT_SPECIFICATION`

Planning status:

Product specification only. Implementation remains unauthorized.

## Why Now

The marker/preview remediation resolved the most visible Search interaction defect but intentionally left the larger workspace shell unfinished. Customers can now select a property without losing the CTA, but the platform still needs a stable decision shell that makes criteria, list, map, selected property, evidence state, and next action feel like one premium decision experience.

Selecting the shell now preserves momentum while avoiding premature property-route state work and avoiding map-provider/style risk.

## Why It Outranks Alternatives

It outranks Property Detail Context Preservation because property return-context behavior should be designed around a defined Search workspace shell.

It outranks Map Visual Language Normalization because the map's visual concerns are real but provider/style/licensing constrained, while the workspace shell can be specified using existing certified architecture.

It outranks an alternate Wave 1B phase because no other repository-supported candidate shows stronger customer value, enterprise leverage, readiness, and bounded risk.

## Proposed Bounded Planning Scope

The product specification should define:

- the persistent Search workspace purpose;
- the governing customer question: `Which homes deserve my attention?`;
- desktop, tablet, and mobile workspace hierarchy;
- criteria summary behavior;
- list/map relationship;
- selected-property preview placement and lifetime;
- map bounds and moved-map messaging;
- selected listing behavior during filter changes;
- empty, degraded, loading, and fallback states;
- Back/Forward expectations inside `/search`;
- property route continuation expectations without implementing property-route restoration;
- accessibility requirements;
- responsive acceptance criteria;
- deterministic validation requirements;
- prohibited behavior and protected boundaries.

Out of scope for this next planning phase:

- implementation;
- new route creation;
- property-detail route redesign;
- map provider or tile-source changes;
- brokerage disclosure changes;
- persistence beyond bounded session or URL behavior already authorized for specification review;
- telemetry, CRM, personalization, ranking, APIs, Prisma, or provider integrations.

## Likely Future File Scope

Likely implementation files, if a later bounded implementation is authorized:

- `components/search/SearchInterface.tsx`
- `components/maps/MapSidebar.tsx`
- `components/maps/MapInner.tsx`
- `components/maps/SearchMap.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`
- `components/search/SearchControls.tsx`
- focused deterministic check script, if needed
- `package.json` and `tsconfig.worker.json` only if a focused check is registered
- implementation record
- `docs/CHAT_START.md`

Likely prohibited unless separately authorized:

- `app/properties/[id]/page.tsx`
- route files
- API routes
- Prisma schema or migrations
- map provider or tile configuration
- brokerage disclosure files
- telemetry, CRM, personalization, persistence, or deployment configuration

## Acceptance And Certification Requirements

Future product specification should require:

- Search remains on `/search`.
- No new route is created.
- Search has one clear first-screen purpose.
- List, map, criteria, evidence state, and selected property behave as one coherent workspace.
- The selected property remains bounded and interactive.
- Map remains visible and useful.
- Mobile does not compress desktop; it uses a clear list/map/selection narrative.
- Back/Forward expectations are explicit.
- No provider, tile-source, API, ranking, persistence, CRM, telemetry, or brokerage disclosure change occurs.
- No affordability, recommendation, suitability, steering, protected-class, or unsupported evidence claims are introduced.
- Deterministic validation covers placement, state, protected language, route boundaries, responsive behavior, and regressions.
- Production certification remains separately authorized.

## Protected Boundaries

This review preserves:

- no implementation;
- no runtime changes;
- no Search behavior changes;
- no map behavior changes;
- no property-route changes;
- no route creation;
- no API changes;
- no Prisma changes;
- no persistence;
- no telemetry;
- no CRM;
- no provider integration;
- no map provider or tile-source changes;
- no map licensing decision;
- no brokerage disclosure changes;
- no ranking changes;
- no personalization;
- no production certification;
- no deployment changes beyond documentation deployment;
- no production-data mutation;
- no next initiative authorization beyond the planning gate.

## Deferred Or Blocked Candidates

Property Detail Context Preservation:

- Deferred.
- Eligible after the Search workspace shell specification defines state, layout, and return-context boundaries.
- Should remain bounded to continuity and must not become a full property-route redesign without separate authorization.

Map Visual Language Normalization:

- Deferred.
- Eligible after provider/style feasibility, source-rights, attribution, accessibility contrast, and tile-control boundaries are reviewed.
- Blocked for implementation if exact visual goals require a provider, tile-source, token, attribution, or licensing change not separately authorized.

Alternate Wave 1B Phase:

- Deferred.
- Eligible only if future repository evidence shows a higher-value customer decision gap than the Search shell, property context preservation, or map visual language.

## Open Questions

1. Should the future Search shell represent selected-property state in browser history, component state only, or a bounded URL/session model?
2. Should mobile Back close selected preview before leaving `/search`, and how should that be represented without persistence?
3. What is the exact boundary between a selected-property preview and the future property-detail context preservation phase?
4. How much map movement should be retained or messaged without turning map bounds into persistent saved state?
5. Which deterministic check should own the persistent Search workspace contract?

## Brokerage Disclosure Hold

Brokerage disclosure treatment remains on hold:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

This review does not authorize moving, removing, simplifying, hiding, or rewriting brokerage attribution or brokerage disclosure content.

## Final Recommendation

Select:

`READY_FOR_PERSISTENT_SEARCH_WORKSPACE_SHELL_PRODUCT_SPECIFICATION`

Do not begin implementation. The next authorized phase, if granted, should be product specification only for:

`REIE_DXT_WAVE_1B_PERSISTENT_SEARCH_WORKSPACE_SHELL`
