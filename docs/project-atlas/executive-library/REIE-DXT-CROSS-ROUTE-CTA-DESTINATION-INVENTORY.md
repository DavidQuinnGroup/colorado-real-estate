# REIE DXT Cross-Route CTA And Destination Inventory

Status: `DXT_CROSS_ROUTE_CTA_DESTINATION_INVENTORY_READY`

Inventory date: 2026-08-03

## Scope

This record inventories material customer-facing continuations across the certified public REIE decision journey.

No runtime change, CTA copy change, route change, canonical change, URL-context implementation, hidden state, persistence, telemetry, CRM, email, scheduling, form, API, navigation, footer, shared CTA component, or shared runtime abstraction is authorized by this record.

## Certified Route Inventory

| Route | Owner | Role | Material continuations |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | Homepage invitation | Discover Homes, Why REIE, Continue to Guided Search, Buyer preparation, Seller preparation, Market Context, Grand Plan, About David Quinn, Contact |
| `/search` | `app/search/page.tsx`, `components/search/SearchInterface.tsx` | Decision workspace | Property links, Market Report links, Market Discovery, Boulder Neighborhood Intelligence |
| `/properties/[id]` | `app/properties/[id]/page.tsx` | Property evaluation | Back to Search, Return to Search Results, Market Context, Neighborhood Context, Ask About This Property, Request Seller Review |
| `/buy` | `app/buy/page.tsx` | Buyer preparation | Start With Search, Review Financing Assumptions, Understand Market Context, Search Homes, Financing Guidance, Market Context, Advisory Guidance |
| `/sell` | `app/sell/page.tsx` | Seller preparation | Request Seller Review, Review Preparation Themes, Seller Readiness, Home Worth, Market Context, Advisory Guidance |
| `/market` | `app/market/page.tsx` | Market briefing index | Search With Market Context, Boulder Market Context, Neighborhood Context, Advisory Guidance, Compare certified market context, Open guide |
| `/market/[city]` | `app/market/[city]/page.tsx` | City Market briefing | Search With Market Context, Neighborhood Context, All Markets, Seller Strategy, Request Advisor Review |
| `/market/[city]/[slug]` | `app/market/[city]/[slug]/page.tsx` | Neighborhood place orientation | Search This Neighborhood, City Market Context, Advisory Guidance, Market Context, Property exploration |
| `/contact` | `app/contact/page.tsx`, `components/AdvisoryHandoffGuide.tsx` | Contact and Advisory handoff | Choose The Starting Point, Begin A Focused Conversation, Contact David Quinn Group, Search Homes, Buyer Guidance, Seller Guidance, Grand Plan, Home Worth |
| `/grand-plan` | `app/grand-plan/page.tsx` | Planning intake | Start With What Matters Most, Explore Inventory, Search Homes, Buyer Guidance, Advisory Guidance |
| `/home-worth` | `app/home-worth/page.tsx`, `components/HomeValueEstimator.tsx` | Seller review preparation | Request Seller Review, Seller Readiness, Market Context, Search paths, Advisory review |
| `/compare` | `app/compare/page.tsx` | Cross-city comparison | Reset, Full City Guide, Search city homes, Search Homes, Market Context, Advisory Guidance |

Direct entry remains supported on all inspected routes. Property pages already include a bounded visible Search return state when safe `from=search` and `returnTo=/search...` URL parameters are present, plus a no-history direct-entry fallback.

## CTA Inventory

| Source route | Source section | Current label | Destination | Priority | Customer intent | Expected next decision | Destination fulfills intent | Direct-entry compatible | Browser navigation implication | Risk and disposition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Hero | Discover Homes | `/search` | PRIMARY | begin property exploration | compare active homes | yes | yes | normal document navigation | KEEP |
| `/` | Hero | Why REIE | `#why-reie` | SECONDARY | understand product approach | decide whether REIE is useful | yes | page-local | no route change | KEEP |
| `/` | Search section | Continue to Guided Search | `/search` | PRIMARY | open workspace | compare inventory | yes | yes | normal document navigation | KEEP |
| `/` | Journey cards | Continue | `/search`, `/buy`, `/sell` | SECONDARY | choose route | search or prepare | partly vague | yes | normal document navigation | RENAME_LATER |
| `/` | Continuity panel | Search | `/search` | SECONDARY | compare homes | inventory exploration | yes | yes | normal document navigation | KEEP |
| `/` | Continuity panel | Market Context | `/market` | SECONDARY | understand area context | market briefing | yes | yes | normal document navigation | KEEP |
| `/` | Grand Plan | Build Your Grand Plan(TM) | `/grand-plan` | PRIMARY | organize priorities | planning intake | yes, but separate form path | yes | normal document navigation | KEEP |
| `/` | Trust close | Contact | `/contact` | SECONDARY | begin conversation | choose contact route | yes after Wave 1E | yes | normal document navigation | KEEP |
| `/search` | Search cards | property card/open listing | `/properties/[id]?from=search&returnTo=...` where supported | PRIMARY | evaluate a property | spend more time on property | yes | yes | preserves Back plus visible return when URL-supported | KEEP |
| `/search` | Authority links | Market Report | `/market/[city]` | SECONDARY | understand city context | market briefing | yes | yes | normal document navigation | KEEP |
| `/search` | Authority links | Market Discovery | `/market` | SECONDARY | broaden market context | choose market path | yes | yes | normal document navigation | KEEP |
| `/properties/[id]` | Hero | Back to Search | `/search` | SECONDARY | return to search | resume inventory | only generic when URL context exists | yes | browser Back still works | REPOINT_LATER |
| `/properties/[id]` | Search-return card | Return to Search Results | safe `returnTo` URL | SECONDARY | resume exact Search criteria | continue previous search | yes | only with valid context | preserves visible return without storage | KEEP |
| `/properties/[id]` | Property decision | Ask a Property Question | `#property-contact` | PRIMARY | ask property-specific question | use existing property inquiry flow | yes | yes | in-page jump | KEEP |
| `/properties/[id]` | Property decision | Market Context | city market or search fallback | SECONDARY | compare local context | market or search review | yes | yes | normal document navigation | KEEP |
| `/properties/[id]` | Continue decision | Request Seller Review | `/sell` | SECONDARY | seller-oriented review | seller preparation | route-specific exception | yes | normal document navigation | ROUTE_SPECIFIC_EXCEPTION |
| `/buy` | Hero | Start With Search | `/search` | PRIMARY | start buyer path | inventory comparison | yes | yes | normal document navigation | KEEP |
| `/buy` | Hero | Review Financing Assumptions | `#financing-readiness` | SECONDARY | review assumptions | financing education | yes | page-local | no route change | KEEP |
| `/buy` | Continuity panel | Advisory Guidance | `/contact` | SECONDARY | ask focused buyer questions | prepare/begin conversation | fulfilled but generic destination label overlaps Advisory | yes | normal document navigation | RENAME_LATER |
| `/sell` | Hero | Request Seller Review | `#seller-intake` | PRIMARY | request seller review | seller intake | yes | page-local | no route change | KEEP |
| `/sell` | Hero | Review Preparation Themes | `#seller-preparation` | SECONDARY | inspect preparation | seller readiness | yes | page-local | no route change | KEEP |
| `/sell` | Tool section | Seller Readiness | `/home-worth#seller-readiness` | SECONDARY | organize seller evidence | home-worth preparation | yes | yes | normal document navigation | KEEP |
| `/market` | Continuity panel | Search With Market Context | `/search` | SECONDARY | search after market briefing | inventory exploration | yes, but loses visible origin | yes | normal document navigation | REPOINT_LATER |
| `/market` | Continuity panel | Boulder Market Context | `/market/boulder-co-housing-market` | SECONDARY | open city guide | city briefing | yes | yes | normal document navigation | KEEP |
| `/market` | Continuity panel | Advisory Guidance | `/contact` | SECONDARY | verify market question | prepare/begin conversation | yes after Wave 1E | yes | normal document navigation | KEEP |
| `/market/[city]` | Hero | Search With Market Context | `/search?city=...` | PRIMARY | search city inventory | inventory exploration | yes | yes | explicit URL criteria | KEEP |
| `/market/[city]` | Hero | Neighborhood Context | section anchor | SECONDARY | inspect local areas | neighborhood choice | yes | page-local | no route change | KEEP |
| `/market/[city]` | Lower form card | Request Advisor Review | button without direct destination in snippet | SECONDARY | advisor review | unclear route ownership | partial | direct-entry unclear | may feel like dead-end if not connected | REPOINT_LATER |
| `/market/[city]/[slug]` | Hero | Search This Neighborhood | `/search?neighborhood=...` | PRIMARY | search neighborhood inventory | property exploration | yes | yes | explicit URL criteria | KEEP |
| `/market/[city]/[slug]` | Hero | City Market Context | `/market/[city]` | SECONDARY | broaden context | city briefing | yes | yes | normal document navigation | KEEP |
| `/market/[city]/[slug]` | Continuity panel | Advisory Guidance | `/contact` | SECONDARY | professional review | prepare/begin conversation | yes | yes | normal document navigation | KEEP |
| `/contact` | Contact decision flow | Choose The Starting Point | `#contact-route-choice` | PRIMARY | choose safe existing path | decide contact route | yes | page-local | no route change | KEEP |
| `/contact` | Advisory handoff | Begin A Focused Conversation | `#advisory-contact-transition` | PRIMARY within Advisory | move from preparation to contact | contact transition | yes | page-local | no submission | KEEP |
| `/contact` | Advisory transition | Contact David Quinn Group | `/contact` | SECONDARY | begin conversation | direct Contact route | same-page on Contact | yes | loop risk on same route | MOVE_LOWER_LATER |
| `/grand-plan` | Hero | Start With What Matters Most | `#grand-plan-intake` | PRIMARY | start planning intake | submit Grand Plan context | yes but mutating form exists | page-local | no route change | KEEP |
| `/grand-plan` | Hero | Explore Inventory | `/search` | SECONDARY | search homes | inventory exploration | yes | yes | normal document navigation | KEEP |
| `/home-worth` | Hero | Request Seller Review | `#home-worth-request` | PRIMARY | request seller review | seller review intake | yes | page-local | no route change | KEEP |
| `/home-worth` | Hero | Seller Readiness | `#seller-readiness` | SECONDARY | review preparation | seller readiness | yes | page-local | no route change | KEEP |
| `/compare` | Workspace | Full City Guide | `/market/[city]` | SECONDARY | inspect city evidence | city briefing | yes | yes | document navigation | KEEP |
| `/compare` | Workspace | Search city homes | `/search?city=...` | SECONDARY | inspect inventory | search city homes | yes | yes | explicit URL criteria | KEEP |
| `/compare` | Continuity panel | Advisory Guidance | `/contact` | SECONDARY | discuss comparison questions | prepare/begin conversation | yes | yes | normal document navigation | KEEP |

## Language Normalization Review

Distinct intents:

- `Search`, `Search Homes`, `Search With Market Context`, and `Search This Neighborhood` all mean begin or resume property exploration. Route-specific labels are useful when visible criteria are present.
- `Review`, `Prepare`, `Seller Readiness`, and `Buyer preparation` mean organize assumptions before acting.
- `Market Context`, `City Market Context`, and `Neighborhood Context` mean area evidence, not ranking or recommendation.
- `Advisory Guidance`, `Begin A Focused Conversation`, and `Contact` are related but not identical. Advisory prepares the conversation; Contact begins it.
- `Ask About This Property` and `Property inquiry` are specialized property-specific actions and should remain distinct from generic Contact.
- `Home Worth` and `Request Seller Review` are seller-specific preparation/review paths, not valuation certainty.
- `Grand Plan` is broader planning context, not property search or advisory by itself.

Duplicative or vague terms:

- `Continue` is too generic on homepage journey cards and should be renamed later to the route-specific intent.
- `Advisory Guidance` sometimes points directly to `/contact`; after Wave 1E this is acceptable, but future continuity should clarify whether the user is entering Advisory preparation or Contact route choice.
- `Back to Search` on property pages is sometimes generic even when a bounded Search return URL is available.
- `Request Advisor Review` on city market appears as a button-like control and needs explicit destination ownership in a future bounded phase.

Terms requiring boundary care:

- `Home Worth`, `Seller Review`, `Market Context`, `Compare`, and `Guidance` must not imply valuation certainty, ranking, suitability, investment advice, appraisal, legal advice, tax advice, lending approval, or professional conclusions.

## Destination Ownership Model

| Intent | Destination owner |
| --- | --- |
| Begin property exploration | `/search` |
| Resume Search | `/search` with safe visible URL criteria when already present |
| Evaluate a specific property | `/properties/[id]` |
| Prepare to buy | `/buy` |
| Prepare to sell | `/sell` and `/home-worth` for seller review preparation |
| Understand a market | `/market` for market discovery; `/market/[city]` for city briefing |
| Understand a neighborhood | `/market/[city]/[slug]` |
| Verify assumptions | route-local verification sections first; Advisory/Contact when professional discussion is needed |
| Prepare a professional conversation | Advisory section on `/contact#advisory-readiness` |
| Begin a professional conversation | `/contact` route choice and existing specialized property/city flows |
| Request property-specific information | property route `#property-contact` and `PropertyInquiryForm` |
| Request seller-specific review | `/sell#seller-intake` or `/home-worth#home-worth-request` |
| Access financing preparation | `/buy#buyer-financing-confidence` and Buyer financing components |
| Return to previous decision surface | safe explicit URL context if already present; otherwise browser Back plus direct route fallback |

## Dead-End And Loop Review

- No inspected certified route is a hard dead end.
- The strongest loop risk is `/contact` Advisory transition linking to `/contact` while already on Contact; keep as a direct-entry safe fallback, but move lower or clarify later.
- The strongest destination-conflict risk is generic `Advisory Guidance` pointing to `/contact` from many routes without visible context; future implementation should clarify route intent without hidden transfer.
- The strongest continuity gap is Search to Property and back: the property page has safe URL return support, but not every property-level `Back to Search` continuation consistently uses it.
- The highest form/API risk is Property to Contact because property inquiry is specialized and must remain separate from generic Contact.
- Contact is not generally premature after Wave 1E, but it can be too generic when route-specific Advisory or property/seller intake would better fulfill the intent.

## Disposition Summary

- KEEP: primary certified route continuations that already fulfill intent and preserve direct entry.
- RENAME_LATER: generic labels such as `Continue` and ambiguous `Advisory Guidance` where route context should be clearer.
- REPOINT_LATER: property generic Back to Search and city market advisor-review affordances where a more precise destination should be selected.
- MOVE_LOWER_LATER: same-route Contact loop from Advisory transition.
- ROUTE_SPECIFIC_EXCEPTION: property-to-seller review, because sellers may inspect comparable property pages.
- EXTERNAL_REVIEW_HOLD: brokerage disclosure and any legal/compliance copy.

## Inventory Conclusion

The certified journey is coherent enough for bounded continuity implementation. It does not require a site-wide CTA registry, shared CTA component, navigation rewrite, tracking system, or persisted journey model.

Recommended first implementation focus from this inventory:

`SEARCH_PROPERTY_RETURN_CONTINUITY`
