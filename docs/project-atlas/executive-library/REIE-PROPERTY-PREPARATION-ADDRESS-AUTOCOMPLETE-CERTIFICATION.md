# Property Preparation Address Autocomplete Certification

## Certification

`PROJECT_ATLAS_PROPERTY_ADDRESS_AUTOCOMPLETE_CERTIFIED`

`READY_FOR_EXECUTIVE_PROPERTY_AUTOCOMPLETE_HUMAN_TEST`

## Contract

- Property Preparation remains empty on entry and never issues an initial candidate query.
- After at least two typed characters, the existing private, read-only repository query runs after a 250 ms debounce and returns at most eight candidates.
- The input exposes an accessible combobox/listbox relationship. Arrow Up, Arrow Down, Enter, Escape, pointer, and touch interactions operate the same bounded candidate set.
- Selecting a candidate populates its address, closes the suggestions, preserves session-only criteria, and continues through the existing exact selected-property briefing read.
- The Search properties button remains as an immediate explicit-search fallback for keyboard and accessibility use.

## Protected Boundaries

No new provider, database or Supabase mutation, MLS/IRES activity, Typesense change, SavedSearch, customer or CRM change, communication, secret, authentication, or Admin-authority change is authorized or performed.

## Next Step

Executive human test of `/agent/prepare/property`: partial address typeahead, candidate refinement, keyboard selection, Escape, touch selection, briefing preparation, criteria retention, and mobile layout.
