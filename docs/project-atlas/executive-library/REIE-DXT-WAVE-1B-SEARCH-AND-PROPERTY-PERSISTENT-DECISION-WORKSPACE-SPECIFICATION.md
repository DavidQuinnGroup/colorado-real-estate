# REIE DXT Wave 1B Search And Property Persistent Decision Workspace Specification

Program: REIE Decision Experience Transformation (DXT 1.0)
Phase: Wave 1B - Search And Property Persistent Decision Workspace Product Specification
Status: PRODUCT_SPECIFICATION_ONLY_DOCUMENTATION_ONLY
Created: 2026-08-02
Repository baseline verified before specification: 4556683a14e85306851edf9a2a3a744cc72a3429
Prior deployment status: successful Vercel deployment for the same SHA, target `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/AaoL5VnmYKsvMeABq3yoHzzPTfWW`

## 1. Executive Product Decision

DXT Wave 1B should transform Search, map, list, property preview, and property review into one persistent decision workspace. The primary product problem is not missing data; it is lost context and interaction instability.

The selected product model is:

`CLICK_PINNED_PREVIEW_WITH_PERSISTENT_MAP`

This model makes click the essential interaction. Hover may remain as a supplemental discovery affordance, but no critical action may depend on hover. A selected listing must produce a pinned, interactive preview or drawer that stays open until the customer closes it, selects another listing, changes criteria in a way that removes the property, presses Escape, or deliberately resets the search.

The first bounded implementation phase should be:

`SEARCH_MARKER_AND_PREVIEW_INTERACTION_REMEDIATION`

This phase should correct the most visible production friction without attempting a full Search/property rewrite. It should focus on marker selection, pinned preview behavior, non-hover access to `View Property`, selected-state synchronization, keyboard/touch access, and context handoff expectations. Implementation is not authorized by this specification.

## 2. Governing Decision Questions

Search:

**Which homes deserve my attention?**

Property:

**Should I spend more time on this property?**

The Search workspace must help customers narrow attention without losing spatial, criteria, listing, or selected-property context. The property experience must help customers decide whether a selected property deserves deeper review, comparison, verification, financing preparation, or advisory support.

## 3. Workspace Models Evaluated

### A. HOVER_PREVIEW_WITH_CLICK_TO_OPEN_DETAIL

Decision: rejected.

Reason: current production evidence shows hover-dependent preview behavior creates friction. A preview that disappears before the customer can interact with it violates the interaction principle. Hover may supplement discovery, but it cannot control essential actions.

### B. CLICK_PINNED_PREVIEW_WITH_PERSISTENT_MAP

Decision: selected.

Reason: this model best matches the governing Search question and the existing repository architecture. Current Search already has selected listing state, selected-card synchronization, Leaflet marker click behavior, and a selected-property drawer. It can be specified without new routes, new APIs, persistence, telemetry, or provider changes.

### C. SPLIT_VIEW_PROPERTY_DETAIL_PANEL

Decision: deferred.

Reason: useful later for deeper property detail, but it increases implementation scope. It could become a later state inside the selected model, but should not be the first implementation phase.

### D. FULL_HEIGHT_DRAWER_OVER_PERSISTENT_SEARCH

Decision: responsive variation only.

Reason: on mobile and tablet, a bottom sheet or full-height drawer may be the best expression of the selected click-pinned model. It should not become a separate desktop architecture.

### E. MODAL_PROPERTY_DETAIL_OVER_SEARCH

Decision: rejected.

Reason: modal detail risks trapping the user and weakening map/list context. It is better suited to a small preview than to full property review.

### F. SAME_TAB_PROPERTY_ROUTE_WITH_RESTORED_SEARCH_CONTEXT

Decision: deferred supporting behavior.

Reason: the existing property route should remain valid. Same-tab route entry can continue, but the future experience should restore Search context when the customer returns. This is a continuity requirement, not the primary workspace model.

### G. Another Repository-Supported Bounded Model

Decision: not selected.

Reason: the repository already supports the elements needed for a click-pinned model. A new model would likely expand scope without improving the first remediation.

## 4. Selected Workspace Model

Primary model:

`CLICK_PINNED_PREVIEW_WITH_PERSISTENT_MAP`

Model definition:

- Search is a single decision workspace composed of criteria summary, list, map, selected marker, pinned preview/drawer, and property-detail continuation.
- Click selects. Hover may preview lightly but never owns essential actions.
- The selected property remains selected through map pan, zoom, list scroll, and pointer movement.
- Clicking a second marker or card replaces selection.
- Closing the preview clears selection without clearing criteria.
- Changing filters preserves selection only if the selected property remains in the result set.
- Deeper property detail may continue using the existing property route, with return-context restoration specified for future implementation.

Responsive variation:

- Desktop: split list/map workspace with pinned preview/drawer over or adjacent to map.
- Tablet: adaptive split or drawer model depending on available width.
- Mobile: map/list toggle with pinned bottom sheet or full-screen sheet state, not hover.

## 5. Customer-State Journey

| Step | Intended Customer State | Workspace Ownership | Primary Action |
| --- | --- | --- | --- |
| Arrival | Oriented and ready to begin. | Search Hero Moment and criteria summary. | Start broad or refine. |
| Search refinement | Clear on active criteria. | Active-filter summary and progressive filters. | Apply, remove, or clear criteria. |
| Map/list exploration | Able to scan without overload. | List and map synchronized but not surprising. | Select listing or marker. |
| Property selection | Focused on one property without losing context. | Selected marker, selected card, pinned preview/drawer. | Review preview or open detail. |
| Property review | Able to assess whether the property deserves more time. | Property decision brief and existing route/detail model. | Verify, compare, return, or ask. |
| Return | Able to resume discovery with minimal reconstruction. | Session context and Back/Forward synchronization. | Continue scanning or refine. |
| Next decision | Able to compare, verify, prepare financing, or advisory. | Preview/detail continuation actions. | Choose the next decision path. |

## 6. Desktop Architecture

Target viewport: approximately 1440x1100.

Architecture:

- Preserve a visible list/map workspace.
- List pane should remain wide enough to scan property cards without turning into a narrow feed; current `md:min-w-[440px]` to `md:max-w-[560px]` is a reasonable planning reference.
- Map should remain the dominant spatial context, not disappear when a property is selected.
- Pinned preview/drawer should occupy a bounded area and avoid obscuring excessive map area.
- Selected card should scroll into view only when helpful and not create disorienting automatic jumps.
- Maximum simultaneous primary actions: refine search, inspect selected property, close selected state.
- Search guidance, authority links, and saved-search affordances should be subordinate to the selected-property decision.

Primary visual focus by step:

- Arrival: Search prompt and criteria summary.
- Exploration: list/map pair.
- Selection: pinned property preview plus selected marker/card.
- Deep review: existing property route or future detail panel, with return path.

## 7. Tablet Architecture

Target viewport: approximately 768x1024.

Architecture:

- Split view may remain viable only if both list and map retain usable widths.
- If split view becomes cramped, the workspace should use a list/map switch with persistent selected state.
- Preview should behave as a drawer or panel, not a hover popup.
- Property-detail transition should preserve context through Back/Forward or bounded session state.
- Active criteria summary must remain visible or one tap away.
- The selected property should remain visually distinct in list and map.

## 8. Mobile Architecture

Target viewport: approximately 390x844.

Architecture:

- First viewport question: Which homes deserve my attention?
- First viewport action: refine or switch between list/map.
- Mobile should not compress desktop split view.
- Use list/map toggle, but preserve selected property across toggle changes.
- Marker/card click opens a pinned bottom sheet or full-height sheet state.
- Preview height should be limited enough to preserve context, with expansion only by deliberate action.
- Primary CTA should sit inside the pinned sheet; secondary CTA should be limited.
- Swipe/dismiss may supplement close but must not be the only close behavior.
- Back should close preview before leaving Search when the preview is represented in history state.
- Touch targets should remain stable and at least approximately 44-48px where practical.
- Hover behavior is irrelevant on touch devices.

## 9. Marker Interaction Model

Default marker:

- Shows compact price or cluster count.
- Remains visually consistent across zoom levels.
- Has accessible label containing price/address or listing count where available.

Hover:

- May highlight marker and matching card.
- May show a lightweight preview only on pointer-capable devices.
- Must not control essential CTA access.
- Must not close a clicked/pinned preview.

Keyboard focus:

- Focusable markers must announce listing identity and selection state.
- Enter or Space selects and pins preview.
- Tab order must allow movement to preview actions.

Click:

- Selects the marker.
- Pins preview/drawer.
- Replaces prior selection.
- Does not navigate directly to the property route.

Selected state:

- Marker remains visually distinct.
- Matching list card remains visually distinct.
- Preview remains open until deliberate dismissal or valid replacement.

Deselection:

- Close button clears selection.
- Escape closes selected preview.
- Clicking empty map space may close preview only if this does not conflict with map drag/touch behavior.
- Clear/reset clears selection and criteria according to existing reset behavior.

Map movement:

- Pan and zoom do not clear selected state if the property remains in the result set.
- Selected marker may remain visible through recenter affordance rather than automatic pan on every state change.

Zoom change:

- Selection survives zoom.
- If selected marker becomes clustered, cluster should preserve a selected-child indication or selected property should remain separately rendered.

List-card synchronization:

- Clicking a card selects marker and pins preview.
- Hover/focus may highlight marker without opening essential actions.
- Selected card should be brought into view in a non-surprising way.

Multiple nearby listings:

- Cluster click expands or zooms.
- If a cluster contains the selected property, the selected state must not be lost.

Touch devices:

- Tap marker/card selects.
- Tap outside or close dismisses.
- No hover-only actions.

## 10. Property Preview Model

Preview purpose:

Help the customer decide whether the selected property deserves deeper review without becoming a full property page.

Required content:

- Image or governed fallback image.
- Address.
- Price.
- Essential facts: beds, baths, square feet, property type, status where available.
- Map/location context.
- Property signal or review prompt.
- Source/verification boundary in concise language.
- Primary action.
- Optional secondary action.
- Close control.

Primary action label:

`Review Property Brief`

Rationale: more decision-oriented than `View Property`, but final copy can be refined during implementation. `View Property` remains acceptable if copy churn is deferred.

Secondary action:

- `Ask About This Property` or market-context link only where not crowding the preview.
- Do not add lender, scheduling, upload, saved-profile, or qualification CTA.

Behavior:

- Preview remains interactive.
- Pointer movement into preview must not close it.
- Loading state uses a bounded skeleton or placeholder.
- Missing photo uses governed fallback media.
- Missing data uses neutral unavailable labels.
- Close button is always accessible.
- Escape closes.
- Focus moves into preview after keyboard selection and returns to the triggering marker/card after close.

Density limit:

- Preview should not expose full property intelligence, full checklist, full form, or long evidence sections.

## 11. Property-Detail Model

Selected model for deeper detail:

- Keep the existing property route as the authoritative full detail surface for now.
- Specify session restoration so returning to Search restores the prior discovery context when feasible.
- Do not create a new route.
- Do not replace the property route with a full modal in this phase.

Future property detail sequence:

1. Property identity and media.
2. Essential facts.
3. Why it may deserve attention, framed as prompts rather than conclusions.
4. Property-specific evidence and limitations.
5. Market context.
6. Neighborhood context.
7. Financing-readiness connection.
8. Questions to verify.
9. Compare.
10. Advisory transition.
11. Deeper technical details.

Section disposition:

| Section | Disposition | Reason |
| --- | --- | --- |
| Property identity and media | KEEP | Required for orientation. |
| Essential facts | KEEP | Required for the decision question. |
| Why it may deserve attention | KEEP | Core decision brief. |
| Property-specific evidence | PROGRESSIVELY DISCLOSE | Important after orientation. |
| Market context | SIMPLIFY | Useful as context, not a wall. |
| Neighborhood context | SIMPLIFY | Useful if fair-housing safe. |
| Financing connection | MOVE LOWER | Relevant after property interest is established. |
| Questions to verify | KEEP | Directly supports decision quality. |
| Compare | KEEP | Helps decide whether to spend more time. |
| Advisory transition | KEEP | Converts review into prepared conversation. |
| Deeper technical details | PROGRESSIVELY DISCLOSE | Depth should follow intent. |

## 12. Search-Context Restoration Model

Session context classification:

| Context | Classification | Notes |
| --- | --- | --- |
| Query | REQUIRED_SESSION_CONTEXT | Already URL-supported. |
| Filters | REQUIRED_SESSION_CONTEXT | Already URL-supported. |
| Map bounds | REQUIRED_SESSION_CONTEXT | Needed for persistent workspace; should not require persistence across visits. |
| Zoom | REQUIRED_SESSION_CONTEXT | Needed to preserve map context. |
| Selected property | REQUIRED_SESSION_CONTEXT | Core to pinned preview. |
| List scroll position | OPTIONAL_SESSION_CONTEXT | Useful but may be secondary. |
| Sort | OPTIONAL_SESSION_CONTEXT | Only if sort is supported. |
| List/map layout | REQUIRED_SESSION_CONTEXT | Critical on mobile. |
| Opened preview | REQUIRED_SESSION_CONTEXT | Needed for Back/Forward coherence. |
| Comparison selection | OPTIONAL_SESSION_CONTEXT | Only where already supported. |
| Saved-search state across visits | EXCLUDED | Persistence not authorized. |
| Customer profile | EXCLUDED | Personalization not authorized. |

Allowed mechanisms to evaluate later:

- Component state for active session state.
- URL state for criteria and possibly selected property/map mode if not excessive.
- Browser history state for preview/detail transitions.
- Another bounded non-persistent mechanism only if documented before implementation.

Not authorized:

- localStorage.
- cookies.
- database persistence.
- authenticated profile persistence.
- CRM.
- telemetry.
- hidden tracking.

## 13. Back / Forward Model

Search to preview:

- Click marker/card pins preview.
- Address bar may remain `/search` or include bounded URL state if authorized later.
- Back should close preview before leaving Search if preview pushed history state.

Preview to property detail:

- Primary action opens property detail.
- Search context should be restorable when the customer returns.

Property detail to Search:

- Back returns to Search with criteria, map/list mode, selected property, and preferably map bounds/zoom restored.
- A visible return action may support the same context.

Search to property detail to Back:

- Back must not dump the customer into an unrelated default Search state when context can be preserved.

Search to property detail to Forward:

- Forward returns to the property detail and the address bar/rendered state stay synchronized.

Selected property changes:

- Replacing selected property updates preview and selected state.
- History state should not become noisy for every hover or incidental focus.

Filter changes:

- Filter application updates results and URL criteria.
- If selected property is removed, show neutral state explaining that the selected property is no longer in the filtered result set.

Map movement:

- Map movement should not create surprising browser history entries.
- Bounds/zoom may be retained in session state.

Direct property-route entry:

- Property page should work independently.
- Return to Search from direct entry should go to a sensible Search context, not invent prior state.

## 14. Map Visual-Language Model

Requirement:

The map must feel like one product across zoom levels. It must not visually switch products as the user zooms.

Visual language expectations:

- One consistent base-map family.
- Consistent land, road, water, boundary, and label treatment.
- Selected markers clearly distinct from unselected markers.
- Cluster markers visually related to property markers.
- Strong enough contrast for markers over map detail.
- Readability over any imagery or topo detail.
- Accessible selected state not dependent on color alone.
- Reduced-motion behavior respected.

Current repository-supported likely cause of inconsistency:

- Current `SearchMap` uses OpenTopoMap tiles and conditionally overlays Mapbox outdoors detail at low opacity when `NEXT_PUBLIC_MAPBOX_TOKEN` exists. Visual inconsistency may be caused by multiple tile sources, overlay blending, zoom-dependent provider styling, or fallback behavior.

Open dependency:

- Any provider or tile-source change requires separate provider/licensing review and is not authorized by this specification.

## 15. Map Controls

Minimum justified controls:

- Zoom: KEEP.
- List/map toggle: KEEP, especially mobile.
- Fit results: RECOMMENDED for future planning if it reduces lost context.
- Selected-property recenter: RECOMMENDED if selected marker can move out of view.
- Recenter to initial market/current bounds: OPTIONAL.

Not selected for first phase:

- Full-map mode.
- Satellite/imagery.
- Drawing tools.
- Boundary layers.

Reason: these expand GIS scope and do not directly solve the governing Search decision.

## 16. List / Map Synchronization

Hover/focus synchronization:

- Hover/focus may highlight counterpart card/marker.
- Hover must not open essential actions.

Click selection:

- Card or marker click selects property and pins preview.

Selected-card visibility:

- Selected card should be visible or easily reachable.
- Auto-scroll should be gentle and only on deliberate selection.

Map recenter behavior:

- Selecting from list may recenter if marker is outside view, but should avoid surprising large jumps.
- Selecting from map should not force list scroll unless useful.

Map movement updates results:

- Not required in first phase unless already supported.
- If supported later, must be explicit and non-surprising.

List movement updates map:

- No automatic map movement from passive list scroll.

Clusters:

- Cluster click zooms/expands.
- Cluster containing selected property should preserve selected-state semantics.

Stale selections:

- If filters remove selected property, clear selected state and show a neutral message: selected property is outside the current criteria.

## 17. Criteria Hierarchy

First-screen hierarchy:

1. Decision prompt: Which homes deserve my attention?
2. Result count and current criteria summary.
3. Core criteria: city/place, keyword/address/MLS, price range.
4. Map/list control.
5. Property selection state.

Advanced criteria:

- Beds.
- Baths.
- Property type.
- Any future criteria not essential to first action.

Active filters:

- Visible as removable chips.
- Chips should explain what is shaping the view.

Reset/clear:

- Clear criteria should not feel like a destructive reset of the whole product; it clears criteria and selection intentionally.

Sort:

- Optional only if supported; do not introduce unsupported sort behavior in specification.

The workspace must not begin as a wall of controls.

## 18. Property Decision Brief

The property brief answers:

**Should I spend more time on this property?**

Top-to-bottom sequence:

1. Identity and media.
2. Price and essential facts.
3. Decision prompt: why this may deserve attention.
4. Map/place context.
5. Property signals and limitations.
6. Questions to verify.
7. Compare nearby or related alternatives.
8. Financing-readiness connection.
9. Advisory transition.
10. Deeper details.

Language boundaries:

- Use prompts, not conclusions.
- Say “review,” “verify,” “compare,” and “prepare.”
- Do not say “recommended,” “best,” “ideal,” “approved,” “qualified,” or “affordable.”

DXT section test result:

Each section remains only if its absence would make the customer less able to decide whether to spend more time on the property.

## 19. State Model

| State | Customer Message Category | Primary Action | Secondary Action | Preserved Context | Trust Boundary |
| --- | --- | --- | --- | --- | --- |
| Initial | Start broad, then refine. | Refine/Search. | Open map/list. | Criteria defaults. | No conclusions. |
| Loading | Updating properties in view. | Wait. | Keep current view. | Prior criteria and selection where safe. | Provider/degraded note if needed. |
| Results | Properties in view. | Select property. | Refine criteria. | Criteria, mode, bounds. | Public listing context. |
| No results | No matching properties. | Remove criteria. | Clear search. | Prior criteria. | No implication that inventory does not exist. |
| Error | Search update problem. | Retry or broaden. | Contact/advisory if needed. | Prior context where possible. | Safe fallback language. |
| Degraded data | Results usable, evidence limited. | Continue carefully. | Retry/refine. | Current criteria. | No source overclaim. |
| Map unavailable | List remains usable. | Use list. | Retry map. | Criteria/list. | Map context unavailable. |
| Selected property | Property selected. | Review preview. | Close/replace selection. | Criteria, bounds, mode. | Prompt-only. |
| Preview open | Brief is ready. | Review Property Brief. | Ask/compare if available. | Selected property. | No recommendation. |
| Property detail open | Focused review. | Verify/compare/contact. | Return to Search. | Restorable session state. | No advice or certainty. |
| Property removed by filter | Selected property outside criteria. | Clear selection or undo filter. | Broaden criteria. | Prior filter action. | Neutral explanation. |
| Missing image | Visual unavailable. | Continue with facts. | Open detail. | Selection. | Governed fallback. |
| Missing property data | Some facts unavailable. | Verify facts. | Continue Search. | Selection. | Missing-data disclosure. |
| Direct property entry | Property loaded without prior Search. | Review property. | Open Search. | No invented prior context. | Public facts only. |
| Returning to Search | Resume discovery. | Continue selection/refine. | Clear criteria. | Criteria, mode, selected property where available. | No hidden persistence. |

## 20. Accessibility Model

Requirements:

- Marker navigation must be keyboard-accessible where technically feasible.
- Enter/Space selects marker/card.
- Preview/drawer receives logical focus after keyboard selection.
- Escape closes preview/drawer.
- Close control is explicit and accessible.
- Selection state is announced with `aria-pressed`, selected labels, or live region updates.
- Map, list, preview, and detail have logical tab order.
- No essential action depends on hover.
- Selection is not communicated by color alone.
- Reduced-motion mode avoids animated pan/scroll dependence.
- Touch targets should be stable and approximately 44-48px where practical.
- Focus returns to the invoking marker/card after closing preview.
- Screen-reader labels must distinguish preview action from full property route action.

## 21. Loading And Performance Experience

Expectations:

- Map loading: dark neutral map canvas with orientation placeholder.
- Listing loading: card skeletons in list.
- Image loading: governed placeholder or resilient image fallback.
- Preview loading: small preview skeleton; no blank floating box.
- Detail loading: route-level loading should preserve sense of origin where possible.
- Filter changes: maintain prior context until results are ready or clearly indicate updating.
- Map-bound refresh: do not create jumpy or surprising result changes.
- Degraded provider state: message stays concise and decision-supportive.

No new infrastructure is authorized.

## 22. Trust / Evidence Boundaries

Preserve:

- No unsupported valuation certainty.
- No property-condition conclusion.
- No title or ownership conclusion.
- No HOA conclusion.
- No permit conclusion.
- No insurance conclusion.
- No financing approval.
- No suitability conclusion.
- No investment recommendation.
- No internal evidence metadata exposure.
- No provider or source-right overclaim.

Disclosure placement:

- Trust language should sit near decision outputs and preview/detail actions.
- It should support the decision without dominating the workspace.

## 23. Fair-Housing Boundaries

Do not introduce:

- Demographic targeting.
- Protected-class proxies.
- Family-status steering.
- Desirability claims.
- “Best” or “ideal for” claims.
- School rankings.
- Safety or crime rankings.
- Socioeconomic comparisons.
- Suitability conclusions.

Place and neighborhood context must remain lifestyle-neutral and verification-forward.

## 24. Route Strategy

Recommendation:

Preserve current routes:

- `/search`
- existing property routes under `/properties/[id]`
- current Search API route
- current map route behavior

No new route is recommended for first implementation.

If future product detail requires a route-state architecture beyond `/search` and existing property routes, that is a blocker requiring separate route authorization.

## 25. API / Data Boundaries

This model can be specified using existing data and routes.

Not authorized:

- Search API expansion.
- Ranking changes.
- Provider changes.
- New map layers.
- New GIS.
- Prisma changes.
- Persistence.
- Telemetry.
- Personalization.
- CRM.
- Saved property profiles.
- Session restoration across visits.
- New property data claims.

## 26. Exact Likely File Scope

REQUIRED if implementation is later authorized:

- `components/search/SearchInterface.tsx`
- `components/maps/SearchMap.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`
- `components/maps/MapSidebar.tsx`
- `components/PropertyCard.tsx`
- focused implementation documentation
- `docs/CHAT_START.md`

CONDITIONAL:

- `app/search/page.tsx` only if first-screen decision hierarchy requires server-shell adjustment.
- `app/properties/[id]/page.tsx` only if return-context or property brief handoff copy changes are authorized.
- `components/PropertyProduct31Experience.tsx` only if property decision brief sequencing changes are authorized.
- `components/search/SearchControls.tsx` only if criteria hierarchy/progressive filter behavior changes are authorized.
- `components/search/MapShell.tsx` or `components/search/PropertyDetail.tsx` if proven active in current implementation path.
- focused deterministic check under `scripts/`.
- `package.json` and `tsconfig.worker.json` only if registering a new check.

PROHIBITED_UNLESS_SEPARATELY_AUTHORIZED:

- `app/api/search/route.ts`
- `app/api/save-search/route.ts`
- Prisma schema or migrations
- provider configuration
- map provider/tile configuration
- global navigation/footer files
- brokerage disclosure files
- telemetry/analytics/CRM files
- deployment configuration
- generated files

## 27. Acceptance Criteria

A future implementation should pass when:

- Click selects a marker and pins an interactive preview.
- Hover is supplemental only.
- `View Property` or equivalent primary preview CTA is reachable by pointer, keyboard, and touch.
- Preview does not disappear while the user moves into it.
- Selecting a second property replaces selection.
- Escape and close controls dismiss preview.
- Selected marker and card remain visually distinct.
- Map pan/zoom does not clear selected property unless results/filters require it.
- List/map mode and selected property remain coherent on mobile.
- Property detail opens through existing route strategy.
- Returning to Search preserves active criteria and as much session context as authorized.
- No new route, API, provider, persistence, telemetry, CRM, Search ranking, or map provider change occurs without separate authorization.
- No prohibited trust, fair-housing, valuation, suitability, financing, or recommendation language appears.
- Accessibility, responsive behavior, typecheck, lint, build, deterministic checks, Search/map smoke, property-route safety, and production certification pass under separate authorization.

## 28. Validation And Certification Plan

Future validation should include:

- Focused deterministic check for marker/preview model.
- Search runtime safety.
- Search listing quality.
- Search/map baseline.
- Map rendering safety.
- Property-route safety.
- Product Cohesion.
- Decision Journey.
- Property Product 3.1.
- Evidence Depth.
- Controlled Evidence.
- Public Trust.
- Source-rights readiness.
- Fair-housing terminology review.
- Route/canonical/sitemap integrity.
- Accessibility review.
- Responsive review at approximately 390x844, 768x1024, and 1440x1100.
- Interaction review for pointer, keyboard, touch, Back/Forward, Escape, close, selection replacement, filter removal, zero results, degraded data, missing image, and direct property entry.
- `npm run typecheck`.
- `npm run lint`.
- `npm run build`.
- Production-domain smoke under separate production certification authorization.

## 29. Protected Boundaries

This specification authorizes no:

- implementation;
- runtime changes;
- Search changes;
- map changes;
- property-route changes;
- API changes;
- CSS changes;
- route creation;
- brokerage disclosure changes;
- provider changes;
- new map layers;
- GIS expansion;
- Prisma changes;
- persistence;
- telemetry;
- personalization;
- CRM;
- saved property profiles;
- production-data mutation;
- deployment configuration changes;
- next phase work.

Brokerage disclosure remains:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

## 30. Open Questions

1. Is the current OpenTopoMap plus optional Mapbox overlay the cause of perceived zoom-level visual inconsistency?
2. Can selected-property session context be restored sufficiently with component and browser history state, or is URL state needed for selected property and map mode?
3. Should property detail eventually appear as a side panel after first remediation, or should the existing route remain the only full detail surface?
4. Can Leaflet marker keyboard behavior meet the full accessibility model, or does the preview/drawer need a separate list-first keyboard selection model?
5. Should `Review Property Brief` replace `View Property`, or should copy remain unchanged during the first implementation phase to reduce scope?
6. Which map controls are essential after marker/preview remediation: fit results, selected-property recenter, or both?

## 31. Exact First Implementation Phase

Selected first implementation phase:

`SEARCH_MARKER_AND_PREVIEW_INTERACTION_REMEDIATION`

Scope:

- Click-first marker/card selection.
- Pinned interactive preview/drawer.
- Non-hover access to property CTA.
- Selected state synchronization.
- Keyboard/touch/Escape/close behavior.
- Preview persistence during pointer movement, pan, and zoom.
- Filter-change stale-selection handling.
- Focused deterministic validation.

Non-goals:

- Full Search redesign.
- Full property route redesign.
- Map provider changes.
- Search API or ranking changes.
- New routes.
- Persistence or telemetry.
- Brokerage disclosure changes.

## 32. Exact Next Authorization Gate

`READY_FOR_REIE_DXT_WAVE_1B_SEARCH_MARKER_AND_PREVIEW_INTERACTION_REMEDIATION_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

That gate may authorize bounded implementation only if explicitly granted. It must not automatically authorize broader Search/property redesign, route creation, API changes, provider changes, persistence, telemetry, CRM, brokerage disclosure changes, production certification, or the next DXT phase.

## Specification Outcome

Status: `REIE_DXT_WAVE_1B_SEARCH_AND_PROPERTY_SPECIFICATION_READY`
