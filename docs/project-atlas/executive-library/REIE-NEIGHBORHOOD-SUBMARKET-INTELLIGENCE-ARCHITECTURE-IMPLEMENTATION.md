# REIE Neighborhood / Submarket Intelligence Architecture Implementation

## Status

Local implementation status: `NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE_READY_FOR_PUSH`.

Authoritative architecture: `NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE`.

This is an internal, contract-based, fixture-backed, deterministic, read-only, non-public, non-mutating, fail-closed, non-ranking, and conclusion-free architecture foundation. It creates no public routes, no public activation, no public registry entry, no search behavior, no map behavior, no GIS runtime, no provider call, no acquisition, no persistence, no API, no schema change, and no production write.

## Strategic Baseline

The post-Advisory Operating Readiness strategic review selected Neighborhood / Submarket Intelligence Architecture as the highest-value next initiative. The strategic review commit `6d529976789e9dc14df6799f4861629e1e59627b` was pushed to `origin/main` before implementation.

The implementation reuses Colorado Geographic Ontology, Geographic Object Foundation, Geographic Knowledge Matrix, Geographic Intelligence provenance concepts, Evidence Depth contracts, Controlled Evidence integration boundaries, source-rights activation readiness, Local Decision Intelligence maturity governance, Decision Guide maturity boundaries, existing neighborhood product records, and deterministic worker-script conventions. No parallel geographic ontology was introduced.

## Governed Object Types

The architecture defines governed object types for `NEIGHBORHOOD`, `SUBDIVISION`, `DISTRICT`, `CORRIDOR`, `MARKET_AREA`, `UNINCORPORATED_COMMUNITY`, `COMMUNITY`, `PLANNED_COMMUNITY`, `CENSUS_DESIGNATED_PLACE`, `ZIP_CODE_AREA`, `MUNICIPALITY`, `CITY`, and `TOWN`.

Future or restricted object types are represented without public eligibility: `COUNTY`, `HOA`, `METROPOLITAN_DISTRICT`, `SPECIAL_DISTRICT`, `IMPROVEMENT_DISTRICT`, `PROPERTY_CLUSTER`, `PARCEL`, and `PROPERTY`.

Each object type records meaning, permitted parent types, permitted child types, possible future route posture, evidence requirements, boundary requirements, naming requirements, ambiguity risks, fair-housing and steering risks, activation prerequisites, and fail-closed behavior.

## Object-Type Distinctions

The contract preserves distinctions between municipality and unincorporated community, city and census-designated place, neighborhood and subdivision, subdivision and HOA, district and special district, corridor and neighborhood, market area and administrative geography, community label and legally defined jurisdiction, ZIP code and community, planned community and municipality, and property-specific geography and public market context.

No display label, slug, or local naming convention is allowed to imply another object type.

## Canonical Identity

Canonical identity requires object ID, object type, canonical name, normalized slug, alternate names, parent object ID, jurisdiction, county or counties, state, authority source, identity status, boundary status, route posture, search-support posture, evidence posture, source-rights posture, maturity posture, ambiguity status, public eligibility, and limitations.

Identity does not depend only on a display name or slug. The contract blocks collisions between same-name places, city and neighborhood names, subdivision and community names, ZIP areas and municipalities, and market areas and legally governed places.

## Relationships

The internal graph supports directional relationships including `WITHIN`, `OVERLAPS`, `PART_OF`, `CONTAINS`, `ADJACENT_TO`, `ASSOCIATED_WITH`, `SERVED_BY`, `CROSSES`, `HAS_MARKET_CONTEXT`, `HAS_MUNICIPAL_CONTEXT`, and `HAS_COUNTY_CONTEXT`.

Relationships preserve direction, relationship type, evidence posture, source-rights posture, and limitations. They allow overlap without forcing a false single parent and preserve ambiguity when unresolved.

## Boundary And Authority Posture

Boundary states include authoritative boundary, governed derived boundary, approximate boundary, descriptive area only, overlapping boundary, disputed or conflicting boundary, unavailable, unresolved, and prohibited for public use.

No unsupported polygon is treated as authoritative. Descriptive identity may exist without a public map boundary. Route readiness does not imply map readiness. Source possession does not imply display rights. Approximate boundaries remain limited. Conflicting boundaries are preserved rather than merged.

Authority posture includes legally incorporated, officially designated, census-defined, county-recognized, municipal planning designation, recorded subdivision, locally recognized but non-authoritative, platform-defined market area, unresolved, and unsupported. Authority posture is not desirability, superiority, suitability, ranking, evidence quality, or recommendation.

## Route, Registry, Search, And Maturity

Route-readiness states include not evaluated, blocked, architecture ready, content prerequisites incomplete, evidence prerequisites incomplete, source-rights prerequisites incomplete, search-support prerequisites incomplete, boundary prerequisites incomplete, fair-housing review required, certification ready, and publicly eligible only after separate authorization.

Registry-readiness states include absent, candidate, identity governed, evidence incomplete, authority unresolved, classification unresolved, search unsupported, route blocked, certification pending, public activation prohibited, and eligible only after separate authorization.

Search-support posture includes unsupported, alias only, city-filter compatible, neighborhood-filter compatible, subdivision-filter compatible, geographic lookup available, data coverage incomplete, ambiguous, blocked, and unresolved.

Maturity states include `IDENTITY_ONLY`, `ARCHITECTURE_FOUNDATION`, `EVIDENCE_FOUNDATION`, `CONTENT_FOUNDATION`, `ENHANCED_FOUNDATION`, `EDITORIALLY_CERTIFIED`, `BLOCKED`, and `UNRESOLVED`.

Architecture readiness creates no route. Registry presence creates no public eligibility. Route readiness does not imply search support, map support, or editorial certification. Search support remains distinct from identity, public route eligibility, evidence maturity, map support, and recommendation authority. Maturity is not a grade or score and cannot promote an object without deterministic certification.

## Evidence And Source-Rights Requirements

Future sub-city intelligence requires canonical identity evidence, jurisdiction evidence, parent/child relationship evidence, geographic scope or boundary evidence, naming and alias evidence, housing-form context, development-pattern context, market-context scope, municipal and county context, source-rights posture, freshness, provenance, conflict status, professional-verification needs, and limitations.

The architecture uses certified Evidence Depth contracts and preserves source-rights requirements for display rights, derivative-use rights, attribution, internal-only restrictions, prohibited-use restrictions, unknown and unresolved rights, provider versus source identity, and acquisition authority versus public-use authority. Unknown or unresolved rights fail closed.

## Ambiguity Contract

Ambiguity states include no known ambiguity, naming ambiguity, object-type ambiguity, parent ambiguity, jurisdiction ambiguity, boundary ambiguity, overlapping identity, historical identity, locally recognized but unofficial, insufficient evidence, and unresolved conflict.

Ambiguity remains visible, fails closed where material, prevents unsupported route or registry activation, is not silently normalized away, and preserves competing interpretations where applicable.

## Fair-Housing And Steering Safeguards

The architecture prohibits demographic targeting, protected-class proxies, coded preference language, desirability labels, suitability conclusions, best-neighborhood claims, ideal-for claims, school ratings or rankings, safety ratings or crime-based steering, socioeconomic ranking, cultural or demographic profiling, family-status steering, investment recommendations, appreciation forecasts, and neighborhood superiority claims.

Permitted future context is limited to neutral supportable categories such as housing form, development pattern, jurisdiction, infrastructure, access, land-use context, documented amenities, property-specific due diligence, and municipal, HOA, insurance, title, inspection, environmental, structural, or qualified-source review.

## Gunbarrel And Niwot Governance

Gunbarrel is modeled as an architecture fixture only. The fixture preserves possible neighborhood, community, market-area, and census/geographic interpretations, overlapping Boulder and county context, naming and identity ambiguity, route ineligibility, registry ineligibility, search-support uncertainty, public activation blocked, and fair-housing safeguards. It makes no conclusion that Gunbarrel is definitively one object type.

Niwot is modeled as an architecture fixture only. The fixture preserves unincorporated-community or census-place posture, relationship to Boulder County, relationship to Boulder and Longmont market context, identity and authority posture, route readiness, registry readiness, search support, boundary support, evidence posture, source-rights posture, and public activation blocked pending separate governance and certification.

Neither Gunbarrel nor Niwot was activated.

## Fixture Coverage

The synthetic and repository-governed fixture set covers incorporated municipality, official census-designated place, unincorporated community, neighborhood within one municipality, neighborhood spanning or ambiguously associated with jurisdictions, recorded subdivision, planned community, corridor crossing multiple places, platform-defined market area, ZIP code that must not be treated as a community, object with authoritative identity but no public boundary rights, object with conflicting names or boundaries, Gunbarrel ambiguity, Niwot governance, public-route-blocked object, search-unsupported object, fair-housing prohibited-output guard, and mixed object graph with overlapping relationships.

Fixtures contain no customer data, credentials, private records, live provider data, or unauthorized licensed content.

## Read-Only Inspection

The deterministic inspection command is:

```bash
npm run check:neighborhood-submarket-intelligence-architecture
```

The inspection reports bounded architecture information: object-type count, fixture count, object count, relationship count, relationship types covered, ambiguity states covered, route-readiness states covered, registry-readiness states covered, search-support states covered, blocked activation cases, source-rights fail-closed cases, fair-housing prohibited-output assertions, and Gunbarrel and Niwot governance outcomes.

The inspection creates no public route, admin UI, API, database read or write, map layer, provider call, geographic lookup service, or production mutation.

## Public Non-Exposure

The implementation changes no existing neighborhood routes, market routes, city routes, Search, maps, city registry, Decision Guide registry, public sitemap, canonical URLs, public metadata, public copy, property pages, neighborhood pages, internal linking, or route eligibility.

The implementation exposes no architecture object types, fixture classifications, ambiguity states, route-readiness states, registry-readiness states, blocked-object analysis, Niwot internal posture, or Gunbarrel internal posture to the public runtime.

## Future Public-Implementation Prerequisites

Future public implementation requires separate authorization and, at minimum, governed object identity, resolved object type, resolved parent/child relationships, acceptable authority posture, acceptable source-rights posture, evidence completeness, route design, registry eligibility, search support, map and boundary rights where applicable, content standard, fair-housing review, responsive review, deterministic certification, and production certification.

This implementation does not complete or activate any public prerequisite beyond internal architecture contracts and fixtures.

## Protected Boundaries

No public neighborhood or submarket route, route eligibility, registry eligibility, Niwot activation, Gunbarrel activation, Local Decision Intelligence Wave 4, public GIS, map or boundary behavior, Search behavior, ranking, filter, API, sitemap, canonical URL, provider, acquisition, public-record retrieval, imagery, network fetching, credential, environment variable, persistence, database read or write, Prisma schema, migration, API, production write, evidence observation, property lookup, ownership lookup, customer data, CRM, tracking, telemetry, profiling, personalization, cookie, local storage, valuation, pricing, affordability, qualification, property-condition conclusion, neighborhood conclusion, ranking, scoring, forecast, investment recommendation, demographic targeting, school or safety rating, desirability claim, AI, alert, queue, worker, email, notification, deployment configuration, or production data was modified or activated.
