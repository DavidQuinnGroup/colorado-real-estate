# REIE Neighborhood / Submarket Search / Market Relationship MVV Certification

Status: `IMPLEMENTED_INTERNAL_ARCHITECTURE_ONLY`

This contract defines the finite relationship vocabulary `SEARCH_CONTEXT_FOR`, `MARKET_CONTEXT_FOR`, `DISPLAY_LABEL_FOR`, `FILTER_CONTEXT_FOR`, `DECISION_GUIDE_CONTEXT_FOR`, and `SOURCE_CONTEXT_FOR`. It consumes Object Source Readiness as an internal gate and deliberately does not import or change Search, Market, Map, Property, routes, AEO, providers, persistence, or public behavior.

Visibility is deterministic: `ADMIN_ONLY`, `AGENT_ONLY`, `NOT_READY`, `DATA_INSUFFICIENT`, `COMPLIANCE_BLOCKED`, or `PUBLIC/GUIDED_ELIGIBLE`. Eligibility is not activation; every result remains `NOT_AUTHORIZED` with Search, Market, Map, Property, and AEO activation false.

Niwot, Gunbarrel, and Table Mesa remain source-blocked. Existing routes never establish geographic or relationship authority. Ranking, recommendation, suitability, personalization, protected-class inference, and property assignment are rejected.
