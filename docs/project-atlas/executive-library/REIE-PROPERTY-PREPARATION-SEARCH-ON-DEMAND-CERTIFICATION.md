# Property Preparation Search-On-Demand Certification

## Certification

`PROJECT_ATLAS_PROPERTY_SEARCH_ON_DEMAND_CERTIFIED`

`PROJECT_ATLAS_PROPERTY_CRITERIA_FOUNDATION_UX_REFINED`

`READY_FOR_EXECUTIVE_PROPERTY_PREPARATION_HUMAN_TEST`

## Contract

- Property Preparation opens with no property-result query and no unsolicited listing wall.
- The Agent explicitly submits at least two characters before the exact private Agent endpoint reads bounded repository candidates.
- Matching supports only existing repository fields: address, city, ZIP, property type, neighborhood, and MLS identifier. The API returns at most eight active, non-private Colorado candidates.
- The selector presents no-search-yet, too-short, searching, matches, no-matches, unavailable, and selected-property states.
- Exact property detail remains a second private, no-store, Agent-only read after explicit selection.
- Property Criteria remains local session state, available before and after selection, and does not create a preference profile, property fact, saved search, provider query, or mutation.

## Protected Boundaries

No database mutation, Supabase mutation, MLS/IRES sync, Typesense change, customer/CRM change, saved search, communication, secret, authentication, or Admin-authority change is authorized or performed.

## Next Step

Executive human test of `/agent/prepare/property` on desktop and mobile: initial state, partial search, no result, selection, briefing, criteria controls, keyboard focus, and Agent navigation continuity.
