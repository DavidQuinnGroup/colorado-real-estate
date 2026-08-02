# REIE DXT Wave 1B Persistent Search Workspace Shell Specification

Program: REIE Decision Experience Transformation (DXT 1.0)
Phase: Wave 1B - Persistent Search Workspace Shell Product Specification
Status: REIE_DXT_WAVE_1B_PERSISTENT_SEARCH_WORKSPACE_SHELL_SPECIFICATION_READY
Created: 2026-08-02
Repository baseline verified before specification: `e028d33270c6b9bbe56944686ffb70ad658d556a`

## 1. Executive Product Decision

The selected shell model is:

`PERSISTENT_SEARCH_WORKSPACE_SHELL`

The selected first bounded implementation phase is:

`SEARCH_WORKSPACE_INFORMATION_HIERARCHY_AND_SHELL`

Exact next authorization gate:

`READY_FOR_REIE_DXT_WAVE_1B_SEARCH_WORKSPACE_INFORMATION_HIERARCHY_AND_SHELL_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

This specification defines the persistent Search workspace as a bounded decision shell on the existing `/search` route. It must make criteria, active filters, result status, list, map, selected property, pinned preview, and property-detail transition feel like one coherent customer decision environment.

This specification does not authorize implementation, runtime changes, Search behavior changes, map changes, property-route changes, API changes, provider changes, persistence, telemetry, CRM, brokerage disclosure changes, production certification, or the next DXT phase.

## 2. Governing Decision Question

Search must answer:

**Which homes deserve my attention?**

Every Search workspace section, state, and control must help the customer either refine attention, compare available options, understand the current result set, inspect one selected property, or continue to full property detail.

## 3. Current Customer Problem

The certified marker/preview remediation solved the most immediate interaction defect: customers can now click a marker, keep a pinned preview open, and reach `View Property` without depending on hover.

The remaining customer problem is fragmentation. The current Search surface contains the right pieces, but customers must still coordinate:

- search orientation;
- core criteria;
- active chips;
- result count;
- evidence/degraded state;
- listing results;
- map context;
- mobile list/map mode;
- selected property;
- pinned preview;
- property-detail transition;
- return behavior.

The shell must make these pieces feel like one stable premium decision surface without adding new Search features, changing ranking, redesigning the map provider, or implementing full property-route context restoration.

## 4. Selected Shell Model

Selected model:

`PERSISTENT_SEARCH_WORKSPACE_SHELL`

Definition:

- `/search` remains the authoritative workspace surface.
- Search is composed of orientation, criteria, active criteria summary, result status, list, map, selected-property preview, and continuation actions.
- Criteria changes own result-set updates.
- List and map share the same result set.
- Card and marker selection share one selected-property state.
- A selected property remains visible through a pinned preview until the customer closes it, selects another property, changes criteria in a way that removes it, resets Search, or leaves the route.
- Property detail remains the existing `/properties/[id]` route.
- Full property-detail context preservation remains a later phase.

Non-goals:

- no new route;
- no map provider change;
- no Search API change;
- no ranking change;
- no saved workspace;
- no persistent customer profile;
- no telemetry or personalization;
- no brokerage disclosure change.

## 5. Workspace Ownership Model

The future shell should assign single ownership for each responsibility:

| Responsibility | Owner | Notes |
| --- | --- | --- |
| Search orientation | `SearchInterface` intro region | Owns the governing question and first-screen purpose. |
| Criteria entry | `SearchControls` | Owns input fields and form submission. |
| Active criteria summary | `SearchInterface` shell summary | Owns top-level criteria chips and concise current-state line. `SearchControls` may show form-local criteria but should not compete with shell summary. |
| Result count and status | `SearchInterface` | Owns result count, loading, zero-result, degraded, and evidence states. |
| List/map mode | `SearchInterface` | Owns mobile toggle and selected-state retention across modes. |
| Listing results | `MapSidebar` | Owns list content, empty state, loading skeleton, and card selection. |
| Map | `MapInner` and `SearchMap` | Own map rendering, marker rendering, map bounds, clusters, and map selection. |
| Selected property | `SearchInterface` | Owns selected id and stale-selection clearing. |
| Pinned preview | `SelectedPropertyDrawer` | Owns bounded selected-property preview, close control, focus, and property-detail CTA. |
| Preview dismissal | `SearchInterface` plus `SelectedPropertyDrawer` | Escape and shell-level state clearing live in `SearchInterface`; close control lives in the preview. |
| Property-detail transition | `SelectedPropertyDrawer` | Owns CTA to `/properties/[id]`; no alternate property route. |
| Search-state continuity | `SearchInterface` | Owns URL criteria, popstate response, in-memory selection, and bounded route continuity. |
| Empty/error/degraded states | `SearchInterface`, `MapSidebar`, `SearchMap` | Customer-facing state language must be coordinated and not duplicated. |

## 6. First-Screen Specification

The first meaningful Search viewport must answer:

- Where am I? `/search`, the property discovery workspace.
- What criteria are active? Current criteria summary and active-chip count.
- How many results are available? Result count and status.
- Should I use the list or map? Explicit list/map relationship and mobile mode control.
- What should I do next? Refine, compare, or select a property.

Required first-screen elements:

- one primary prompt: `Which homes deserve my attention?`;
- one dominant exploration action: refine core criteria or select from list/map depending on result state;
- core criteria entry, with city/place and keyword/address/ZIP/MLS-style text as the visible starting point;
- visible result count/status;
- list/map control on mobile;
- advanced filters behind progressive disclosure;
- concise trust/status language only when needed.

The first screen must not begin as:

- a wall of filters;
- an inventory report;
- multiple equally weighted control groups;
- an explanation of Search architecture;
- a dashboard, scorecard, or broker portal.

## 7. Criteria Hierarchy

| Criterion | Classification | Treatment |
| --- | --- | --- |
| Location / city | CORE_VISIBLE | First visible place criterion. |
| Query / address / ZIP / keyword / MLS-style text | CORE_VISIBLE | First visible property-specific criterion. |
| Price range | ADVANCED_DISCLOSURE | Important but not first-screen dominant. |
| Beds | ADVANCED_DISCLOSURE | Kept in refinement disclosure. |
| Baths | ADVANCED_DISCLOSURE | Kept in refinement disclosure. |
| Property type | ADVANCED_DISCLOSURE | Kept in refinement disclosure. |
| Status | RETAIN_UNCHANGED | Do not add or expose if not currently supported in the public control set. |
| Advanced refinements | ADVANCED_DISCLOSURE | Only currently supported refinements. |
| Removable criteria chips | ACTIVE_SUMMARY_ONLY | Surface in shell summary and form-local criteria area without duplicating intent. |
| Clear/reset | RETAIN_UNCHANGED | One clear action should reset criteria, results, selection, hover, error, and map-moved state. |
| Sort | REMOVE_FROM_PRIMARY_SHELL | Do not introduce new sort or ranking controls. |
| Result count | RETAIN_UNCHANGED | Owned by shell status, not form controls. |

No new filters, ranking changes, or unsupported status controls are authorized by this specification.

## 8. Active Criteria Model

Active criteria should be summarized as a concise shell-level state:

- zero criteria: `Open criteria`;
- one to two criteria: show labels directly;
- more than two criteria: show first two plus count;
- chips are removable;
- removing a chip triggers Search refresh through the existing criteria pathway;
- `Clear` resets the Search shell to initial listing and metadata state;
- chips wrap on mobile and must not force horizontal overflow;
- chips must have accessible names and not rely on color alone;
- criteria should remain available near the top of the list pane and visible or one gesture away on mobile;
- criteria changes preserve selected property only if the selected property remains in the new visible result set;
- criteria changes clear stale selection without silently changing to another property.

Maximum visible density:

- first screen should show the summary line and a restrained chip row, not a complete control wall;
- detailed budget/home-type filters remain inside disclosure.

## 9. List / Map Architecture

The list, map, result set, and selected preview must behave as one workspace.

Desktop default:

- list pane and map pane are simultaneously visible;
- list pane owns criteria, status, and results;
- map pane remains meaningful and not merely decorative;
- selected preview appears over or adjacent to the map without hiding too much spatial context;
- map movement does not unexpectedly clear list or selection.

Tablet default:

- split view may remain only if list and map stay usable;
- if cramped, the shell should lean toward mode switching plus persistent selected state;
- preview may behave more like a drawer.

Mobile default:

- list/map mode is explicit;
- list is the default entry mode unless a selected marker/card makes map mode more relevant;
- selecting a card may switch to map only when it helps show selected context;
- selection must survive list/map switching;
- preview uses a bounded sheet or drawer model, not hover.

Scrolling:

- list content may scroll independently;
- map should retain stable dimensions;
- criteria and status should not be buried by long result lists;
- preview should not resize the whole workspace unexpectedly.

## 10. Selected-Property Model

Selection state lives in `SearchInterface` as the single selected-property id.

Selecting a card:

- sets the selected id;
- visually marks the matching card;
- makes the matching marker selected where coordinates exist;
- on mobile, may switch to map mode when this improves context;
- opens the pinned preview if the selected property is visible.

Selecting a marker:

- sets the selected id;
- clears hover;
- visually marks the marker;
- synchronizes the list/card selected state;
- opens the pinned preview.

Replacing selection:

- selecting another card or marker replaces the selected id and preview content.

Closing selection:

- close button clears selected id;
- Escape clears selected id and hover where supported;
- reset clears selection;
- criteria changes clear selection only when the selected property no longer exists in the result set.

Map-bound refresh:

- map movement may update bounds metadata and map status;
- selected state should survive map movement unless the result set is explicitly refreshed and the selected property is absent.

List/map mode switching:

- selected state remains across list and map modes.

Visually obvious state:

- selected marker, selected card, and preview must agree;
- selected state must use more than color;
- accessible state should expose selected/pressed metadata where supported.

## 11. Property-Preview Boundary

The preview is a decision aid, not a property page.

Placement:

- desktop: bounded drawer or panel over/near map, preserving map context;
- tablet: drawer/panel sized to retain context;
- mobile: bottom sheet or bounded full-height sheet, with explicit close.

Maximum dimensions:

- must not obscure the entire desktop workspace;
- must not hide the primary map context without deliberate expansion;
- must remain scrollable internally when content exceeds available height.

Essential content:

- image or resilient fallback;
- price;
- address/city/state;
- key facts such as beds, baths, square feet where available;
- concise review context;
- property-detail CTA;
- close control.

Primary action:

- `View Property` or equivalent route transition to `/properties/[id]`.

Focus behavior:

- preview receives focus on selection;
- close restores a logical path to map/list context;
- CTA has an accessible name.

Loading/fallback behavior:

- image fallback must remain resilient;
- missing property facts should fail quietly with neutral labels;
- no unsupported conclusions should appear.

Distinction from full property detail:

- preview helps decide whether to spend more time;
- full property page owns deeper facts, forms, schema, inquiry context, and long-form decision support.

## 12. Property-Detail Transition

The existing route remains authoritative:

`/properties/[id]`

CTA experience:

- transition should feel like deepening a selected property review, not abandoning Search;
- the CTA should be visibly subordinate to selection and context, not an aggressive conversion event.

State intentionally preserved in this shell phase:

- URL criteria already represented in `/search` query parameters;
- in-memory selected id while the Search route remains mounted;
- list/map mode while the Search route remains mounted;
- visible result set while the Search route remains mounted.

State that may be lost in this shell phase:

- exact map bounds after leaving for `/properties/[id]`;
- zoom;
- selected preview open state after full route navigation;
- list scroll position after full route navigation;
- hover state.

Later Property Detail Context Preservation phase owns:

- robust return context from `/properties/[id]`;
- filter/bounds/zoom restoration beyond current URL criteria;
- selected preview restoration after full property-route navigation;
- list scroll restoration;
- direct property-route entry context messaging.

Direct property-route entry:

- remains a normal property route;
- must not assume a prior Search session;
- should not require Search state to render safely.

Back/Forward expectations:

- Back from property detail should return to `/search` or `/search?...` according to browser history;
- current shell may restore URL criteria but is not required to restore every in-memory map/list detail;
- future implementation should avoid address-bar/render-state desynchronization.

## 13. Context Classification

| State | Classification | Treatment |
| --- | --- | --- |
| Query | REQUIRED_WITHIN_WORKSPACE | Also represented in URL criteria. |
| Filters | REQUIRED_WITHIN_WORKSPACE | Also represented in URL criteria where currently supported. |
| Sort | EXCLUDED | Do not introduce sorting or ranking changes. |
| Result count | REQUIRED_WITHIN_WORKSPACE | Visible shell status. |
| Map bounds | REQUIRED_WITHIN_WORKSPACE | Track as map context; do not persist across sessions. |
| Zoom | OPTIONAL | Useful in memory only; do not persist. |
| Selected property | REQUIRED_ACROSS_LIST_MAP_SWITCH | In-memory selected id; future property context phase may expand. |
| Preview state | REQUIRED_ACROSS_LIST_MAP_SWITCH | Open while selected property exists in current workspace. |
| List scroll position | FUTURE_PROPERTY_CONTEXT_PHASE | Do not solve in shell phase unless explicitly authorized. |
| List/map mode | REQUIRED_ACROSS_LIST_MAP_SWITCH | In-memory UI state. |
| Hovered property | OPTIONAL | Supplemental only; no essential action. |
| Comparison selections | EXCLUDED | Do not add multi-select comparison state. |

Excluded persistence:

- no localStorage;
- no cookies;
- no CRM;
- no database persistence;
- no authenticated profile;
- no telemetry;
- no cross-session restoration.

## 14. Desktop Architecture

Target viewport: approximately `1440x1100`.

Architecture:

- header/orientation region sits at top of list pane;
- criteria region follows the orientation but keeps only core controls immediately visible;
- result-status region remains near criteria and before the list;
- list pane and map pane remain visible together;
- list pane should be wide enough for cards and criteria without becoming a cramped feed;
- map pane should remain the dominant spatial context;
- selected preview appears on the map side without destroying map usability;
- continuity and guidance links move below the primary workspace hierarchy;
- footer is outside the main Search workspace and should not compete with the shell.

Visible actions:

- refine criteria;
- select a card or marker;
- close selected preview;
- open property detail;
- clear criteria.

Maximum density:

- no simultaneous wall of filters, chip wall, guidance wall, and CTA cluster;
- advanced guidance belongs in disclosure or lower-continuation content.

## 15. Tablet Architecture

Target viewport: approximately `768x1024`.

Architecture:

- split view is viable only if both panes retain useful width;
- if panes become cramped, prefer a clear list/map mode model;
- preview should become a bounded drawer or sheet;
- criteria summary should remain accessible near the top;
- advanced filters remain disclosed;
- selected state continues across mode changes;
- touch targets remain stable;
- scrolling ownership must be obvious: list scrolls, map pans, preview scrolls internally.

Minimum usable model:

- one visible current-state summary;
- one visible mode or pane relationship;
- one selected-property preview when selected;
- no dense table or dashboard treatment.

## 16. Mobile Architecture

Target viewport: approximately `390x844`.

Mobile must be designed independently, not as compressed desktop.

First viewport:

- clear Search prompt;
- result count/status;
- compact current criteria summary;
- visible list/map toggle;
- core criteria entry or one clear refinement affordance.

Default mode:

- list mode by default for scanning;
- map mode available immediately;
- selected card may move the customer to map mode when useful.

Selected-property sheet:

- opens from card or marker selection;
- uses bounded height;
- includes image/fallback, price, address, key facts, close, and property CTA;
- preserves selected state when switching list/map modes;
- Back behavior should be specified before implementation and must not trap the user.

Maximum simultaneous visible choices:

- one dominant action per section;
- avoid showing full filters, all chips, all continuations, preview, and map controls at once.

State clarity:

- mobile status must communicate list/map mode, result count, active criteria count, and selected property where applicable.

## 17. Workspace State Model

| State | Customer Message | Primary Action | Secondary Action | Preserved Context | Trust Boundary |
| --- | --- | --- | --- | --- | --- |
| Initial | Open Colorado view. | Refine place or property text. | Use list/map. | Initial listings, initial metadata. | No recommendation implied. |
| Loading | Updating results. | Wait. | Keep current criteria visible. | Current filters and prior selection until result resolves. | Do not imply new facts are final until loaded. |
| Results | Properties in this view. | Compare list/map. | Select property. | Criteria, count, map context. | Results are public evidence, not suitability. |
| Refreshing results | Refreshing your search. | Wait. | Clear if needed. | Criteria and prior result context. | Do not silently change conclusions. |
| No results | No matching properties. | Remove a criterion or clear Search. | Broaden place/budget/type. | Active criteria. | No conclusion that no homes exist generally. |
| Degraded data | Safe fallback evidence. | Continue with caution. | Ask advisor or refine. | Available result context. | Clearly indicates evidence may be limited. |
| Search error | Trouble updating Search. | Try again. | Continue with advisor. | Criteria if possible. | No false certainty. |
| Map unavailable | Map context unavailable. | Use list. | Retry when available. | Result list and criteria. | Map unavailable is not property unavailability. |
| List unavailable | Listing list unavailable. | Use map if available. | Retry. | Criteria and map context. | Do not hide the limitation. |
| Selected property | One property selected. | Review preview or open detail. | Close or select another. | Criteria, list/map state. | Preview is not full due diligence. |
| Preview open | Selected preview active. | View property. | Close. | Selected id and result set. | No property suitability conclusion. |
| Stale selection | Selection no longer in results. | Continue with updated results. | Clear/reset. | New criteria and results. | Do not auto-select substitute property. |
| Filters changing | Criteria changed. | Search/update. | Undo by removing chip if available. | Pending filters. | No ranking or advice implied. |
| Direct query entry | Search opened from URL criteria. | Review results. | Edit criteria. | URL-supported criteria. | No hidden personalization. |
| Mobile list mode | List active. | Select card or switch map. | Refine criteria. | Criteria and selection. | No hover dependency. |
| Mobile map mode | Map active. | Select marker or switch list. | Recenter if available. | Criteria and selection. | Map is context, not complete evidence. |

## 18. Map-Bounds And Result-Refresh Model

Current implementation tracks map bounds and exposes map-movement state, while results remain criteria-led.

Specification model:

- map movement should not automatically replace the result set unless a separately authorized bounded behavior defines it;
- `Search this area` is preferable to automatic refresh if map-bound result refresh is introduced later;
- pending map changes should be messaged as map context viewed, not as new results;
- selected state should survive map pan/zoom;
- if a future explicit map-bound refresh removes the selected property, the shell clears selection and explains that criteria/map context changed;
- result-count changes should appear in the shell status area, not as a disruptive overlay.

No Search API, ranking, provider, or map-bound query behavior is authorized here.

## 19. Map Controls

Current or bounded future shell controls may include:

- zoom;
- list/map toggle;
- fit results;
- selected-property recenter;
- `Search this area` only if separately specified and authorized.

Not authorized:

- provider changes;
- imagery changes;
- drawing tools;
- expanded GIS;
- new boundary layers;
- map theme selector;
- visual-language normalization;
- tile-source changes.

Map visual-language hold:

- current visual inconsistency remains an active production finding;
- this specification must not normalize providers, tile sources, labels, colors, or zoom-dependent styling;
- shell layout should preserve future room for map visual-language normalization without making provider changes now.

## 20. Accessibility Model

The shell must preserve or improve:

- logical tab order from orientation to criteria, result summary, list/map controls, listing cards, preview, and detail CTA;
- accessible route between criteria, list, map equivalent, preview, and property detail;
- marker/list equivalent paths;
- selected-state announcements through text, data state, and accessible control state where possible;
- focus placement after card/marker selection;
- focus restoration or logical continuation after preview close;
- keyboard-operable list/map toggle;
- accessible criteria summary and removable chips;
- Escape dismissal of selected preview where supported;
- no hover-only essential actions;
- no color-only selected state;
- screen-reader result updates through an aria-live status;
- reduced-motion expectations for map pan/preview movement where practical;
- stable touch targets on mobile and tablet.

## 21. Information Hierarchy

Relative emphasis:

1. Search decision prompt.
2. Active criteria.
3. Result count/status.
4. Primary listing identity.
5. Selected-property state.
6. Preview action.
7. Secondary facts.
8. Trust/disclosure language.
9. Advanced controls.

Implication:

- advanced controls must not visually outrank the current decision;
- trust language must remain present but not become a dense wall;
- result count and selected state must be easier to perceive than methodology or continuation content.

This specification does not select final fonts, sizes, colors, or CSS tokens.

## 22. Progressive Disclosure

Immediately visible:

- Search prompt;
- core criteria;
- current criteria summary;
- result count/status;
- list/map relationship;
- primary result/list/map area.

After criteria interaction:

- removable chips;
- refresh/loading state;
- no-result recovery;
- degraded/error messaging.

After property selection:

- pinned preview;
- selected marker/list state;
- property-detail CTA;
- close/dismissal path.

In the preview:

- essential property identity and context only.

Only on the property page:

- full property detail;
- long-form property evidence;
- inquiry form context;
- schema and deeper property decision support.

Only in trust/methodology destinations:

- extensive public-trust, source-rights, and evidence methodology.

## 23. Loading And Performance Experience

Initial Search load:

- show a stable shell; map loading should not collapse the workspace.

Filter changes:

- keep current criteria visible;
- show `Updating results`;
- avoid disorienting layout shifts.

Map movement:

- preserve selected state;
- communicate map context without implying automatic result refresh.

List rendering:

- loading skeletons are acceptable;
- zero-result state should provide next steps.

Marker rendering:

- map should expose readiness and marker counts where deterministic checks need them;
- marker updates should not clear selection unless result set changes invalidate it.

Preview image loading:

- use existing resilient image/fallback behavior;
- preview must remain usable if image fails.

Degraded database/provider state:

- use safe fallback messaging;
- no provider/source-right overclaim.

Slow property-detail navigation:

- CTA remains a normal route transition;
- no new prefetch, loader, or infrastructure is authorized here.

## 24. Trust And Fair-Housing Boundaries

Preserve:

- no valuation certainty;
- no property suitability conclusion;
- no investment recommendation;
- no approval or qualification implication;
- no title, ownership, condition, permit, HOA, insurance, tax, or legal conclusion;
- no protected-class proxy;
- no demographic targeting;
- no desirability or superiority claims;
- no school or safety ranking;
- no internal evidence metadata exposure;
- no provider or source-right overclaim;
- no recommendation to proceed or delay.

Search must remain a decision-preparation environment, not an automated advisor or eligibility engine.

## 25. Route / API / Data / Persistence Boundaries

Preserve:

- `/search`;
- `/properties/[id]`;
- existing Search API;
- current map provider architecture;
- current property data;
- current canonical behavior;
- current sitemap behavior;
- current public-trust and brokerage-disclosure posture.

Do not authorize:

- new routes;
- route aliases or redirects;
- API expansion;
- Search ranking changes;
- provider changes;
- Prisma changes;
- persistence;
- localStorage or cookies;
- telemetry;
- CRM;
- personalization;
- new data claims;
- brokerage disclosure changes.

Brokerage disclosure hold remains:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

## 26. Exact Likely Implementation File Scope

Likely required if the selected first implementation phase is later authorized:

- `components/search/SearchInterface.tsx`
- `docs/project-atlas/executive-library/REIE-DXT-WAVE-1B-SEARCH-WORKSPACE-INFORMATION-HIERARCHY-AND-SHELL-IMPLEMENTATION.md`
- `docs/CHAT_START.md`

Conditional:

- `components/search/SearchControls.tsx`
- `components/maps/MapSidebar.tsx`
- `components/maps/MapInner.tsx`
- `components/maps/SearchMap.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`
- focused deterministic check script
- `package.json` and `tsconfig.worker.json` only if a focused deterministic check is registered

Prohibited unless separately authorized:

- `app/search/page.tsx` if route-level architecture changes are required;
- `app/properties/[id]/page.tsx`;
- API routes;
- Prisma schema or migrations;
- map provider or tile configuration;
- brokerage disclosure files;
- telemetry, CRM, personalization, persistence, workers, or deployment configuration.

## 27. Acceptance Criteria

The selected first implementation phase, if authorized later, should pass these criteria:

- `/search` remains the only surface.
- No new route, API, provider, persistence, telemetry, CRM, or brokerage disclosure change occurs.
- The first screen clearly communicates the Search decision question.
- Core criteria and active criteria summary do not compete.
- Result count/status is visible and understandable.
- List/map relationship is explicit.
- Selected property remains coherent across card, marker, and preview.
- Pinned preview remains bounded and interactive.
- Advanced filters are progressive, not dominant.
- Empty, loading, degraded, and error states are calm and actionable.
- Mobile presents a clear list/map/selection narrative.
- Accessibility and keyboard expectations are preserved.
- No fair-housing, trust, source-right, or professional-boundary regression occurs.

## 28. Deterministic Validation Strategy

A future focused check should verify:

- Search shell remains on `/search`;
- one governing decision prompt exists;
- core criteria remain visible;
- advanced filters remain disclosed;
- active criteria summary exists;
- result count/status exists;
- list/map controls exist where responsive behavior requires them;
- selected-property model remains click-pinned;
- preview is bounded and has close plus property-detail CTA;
- no hover-only essential action;
- no new route, API, provider, persistence, telemetry, CRM, or brokerage disclosure string appears;
- property route CTA still uses `/properties/[id]`;
- map visual-language normalization remains deferred;
- Property Detail Context Preservation remains deferred;
- brokerage disclosure hold remains unchanged;
- required data-testid/state metadata remains stable for certification.

Reuse existing checks where possible:

- Search runtime safety;
- Search listing quality;
- map rendering safety;
- property-route safety;
- Product Cohesion;
- Decision Journey;
- public trust;
- source-rights readiness;
- fair-housing terminology review.

## 29. Responsive And Interaction Certification Plan

Future certification should review:

- desktop at approximately `1440x1100`;
- tablet at approximately `768x1024`;
- mobile at approximately `390x844`.

Desktop certification:

- list and map visible together;
- map remains meaningful;
- preview does not dominate the full workspace;
- criteria/status hierarchy is readable;
- no overflow, overlap, or clipped primary content.

Tablet certification:

- split or mode-switch model is usable;
- preview behaves as a bounded drawer/panel;
- touch targets remain stable;
- selected state survives mode changes.

Mobile certification:

- first viewport communicates current Search state;
- list/map toggle works;
- selected preview sheet is reachable and dismissible;
- no hover dependency;
- no horizontal overflow;
- primary CTA is reachable.

Interaction certification:

- direct `/search` entry;
- URL criteria entry;
- filter change;
- chip removal;
- clear/reset;
- card selection;
- marker selection;
- selected replacement;
- preview close;
- Escape close where supported;
- mobile list/map toggle;
- Back/Forward with URL criteria;
- property-detail CTA.

## 30. Protected Boundaries

This specification preserves:

- no implementation;
- no runtime changes;
- no Search changes;
- no map changes;
- no property-route changes;
- no route creation;
- no API changes;
- no Prisma changes;
- no provider changes;
- no persistence;
- no localStorage or cookies;
- no telemetry;
- no CRM;
- no personalization;
- no brokerage disclosure changes;
- no map visual-language normalization;
- no Property Detail Context Preservation implementation;
- no ranking changes;
- no production certification;
- no deployment changes beyond documentation deployment;
- no production-data mutation;
- no next phase authorization beyond the exact gate below.

## 31. Open Questions

1. Should selected-preview Back behavior be represented in browser history during the first shell implementation, or remain component-memory only?
2. Should `Search this area` be planned as a later interaction after the shell hierarchy stabilizes?
3. How much of `SearchControls` criteria summary should remain visible once the shell-level summary is established?
4. Should selected-property recenter be part of the first implementation or deferred until the shell is visually stable?
5. Which existing check should be extended versus whether a new focused DXT shell check should be registered?

## 32. Exact First Bounded Implementation Phase

Selected:

`SEARCH_WORKSPACE_INFORMATION_HIERARCHY_AND_SHELL`

Why this phase:

- it addresses the primary customer problem of fragmented Search ownership;
- it can be bounded to current architecture;
- it avoids full property context restoration;
- it avoids map provider/style changes;
- it avoids persistence and telemetry;
- it establishes the shell that later responsive layout, active-state refinement, and property context preservation can inherit.

Not selected:

- `RESPONSIVE_LIST_MAP_WORKSPACE_LAYOUT`, because layout should follow the information hierarchy and ownership model.
- `ACTIVE_CRITERIA_AND_SELECTED_STATE_SHELL`, because it is important but narrower than the first-screen shell problem.
- another phase, because the named shell hierarchy phase is sufficiently bounded and repository-supported.

## 33. Exact Next Authorization Gate

`READY_FOR_REIE_DXT_WAVE_1B_SEARCH_WORKSPACE_INFORMATION_HIERARCHY_AND_SHELL_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

That future gate may authorize bounded implementation only if explicitly granted. It must not automatically authorize the full persistent workspace, Property Detail Context Preservation, Map Visual-Language Normalization, route creation, API changes, provider changes, persistence, telemetry, CRM, brokerage disclosure changes, production certification, or another DXT phase.
