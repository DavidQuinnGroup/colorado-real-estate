# REIE DXT Wave 1D Neighborhood Place-Orientation Implementation

Status: `DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_IMPLEMENTED_LOCAL_COMMIT_ONLY`

Certification recommendation: `READY_FOR_NEIGHBORHOOD_LOCAL_CERTIFICATION`

## Authorization

This record documents the bounded local implementation of the Neighborhood Place-Orientation runtime experience.

Selected runtime target: `app/market/[city]/[slug]/page.tsx`

This target was selected because the certified Neighborhood plan identified it as the smallest coherent Neighborhood route pattern. It lets the product establish the place-orientation hierarchy across the existing Neighborhood family without changing city Market runtime, Market index runtime, Search, maps, providers, APIs, persistence, telemetry, CRM, shared runtime components, shared CSS, routes, canonical URLs, or deployment configuration.

Excluded runtime targets:

- `app/market/page.tsx`
- `app/market/[city]/page.tsx`
- Buyer runtime
- Seller runtime
- Search runtime
- maps and map providers
- shared runtime components
- shared CSS
- APIs, Prisma, persistence, telemetry, CRM, provider integrations, production data, and deployment configuration

## Current-State Findings

The Neighborhood route already included canonical route handling, schema, Search continuation, city Market continuation, Property exploration paths, Advisory continuity, Product 3 visual intelligence, market evidence, verification prompts, and fair-housing markers.

The experience still opened with the neighborhood name and moved into evidence before the customer had a direct place-orientation question. Dense evidence and continuation sections appeared before freshness, uncertainty, and professional-boundary language had a clear customer-facing moment.

## Implemented Hierarchy

The Neighborhood route now follows the certified Wave 1D Neighborhood hierarchy where supported by existing content:

1. Place orientation
2. Governing customer question
3. Concise overview
4. Geographic organization
5. Housing context
6. Evidence that matters
7. Questions to verify
8. Freshness, limitations, and professional boundaries
9. Property continuation
10. Market and Advisory continuation

Governing question:

`What kind of place is this, how is it organized, and what should I verify next?`

Concise promise:

`Start with neutral place orientation, then compare housing context, evidence, and verification questions before deciding which neighborhood properties deserve time.`

## Evidence Organization

No new Neighborhood evidence was invented.

Existing evidence was repositioned into a decision-led sequence:

- place anchor and city relationship;
- geographic organization;
- housing pattern and property context;
- Product 3 visual intelligence;
- local framework evidence;
- questions to verify;
- freshness, limitation, fair-housing, and professional-boundary guidance;
- Search, city Market, Property, and Advisory continuations.

Product 3, market evidence, financing education, related content, nearby neighborhoods, and existing schema remain available.

## Place, Geography, And Housing Treatment

The first viewport now asks the governing Neighborhood question and uses the neighborhood name as context rather than the sole headline.

Geography is framed neutrally as orientation for touring, search filters, and professional review. Housing context is framed as available context and a prompt for property-specific verification, not as a conclusion about customer fit.

## Continuations Preserved

Preserved:

- `Search This Neighborhood`
- city Market context
- Property exploration through Search and related paths
- Market continuation
- Advisory Guidance
- `ContinueYourDecision`
- `NearbyNeighborhoods`
- Product 3 visual intelligence
- existing FAQ and schema behavior

## Protected Boundaries

Buyer runtime unchanged.

Seller runtime unchanged.

Market runtime unchanged.

Search unchanged.

shared runtime unchanged.

The implementation does not introduce:

- neighborhood rankings;
- best-neighborhood claims;
- demographic suitability conclusions;
- protected-class steering;
- school-quality conclusions;
- safety guarantees;
- investment guarantees;
- appreciation predictions;
- AI advisory;
- provider integrations;
- persistence;
- telemetry;
- CRM;
- new maps;
- new GIS;
- new APIs.

Brokerage disclosure remains on hold: `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

## Deterministic Validation

Primary check:

`npm run check:dxt-wave-1d-neighborhood-place-orientation-implementation`

The check verifies:

- certified Neighborhood plan closure remains present;
- the Neighborhood route exposes implementation and runtime-isolation markers;
- exactly one H1 exists in the route source;
- the hierarchy markers appear in the required order;
- place, geography, housing, evidence, verification, boundary, Property, Market, and Advisory continuations remain present;
- fair-housing and protected-boundary markers remain present;
- city Market, Market index, Buyer, and Seller runtime files did not receive Neighborhood markers;
- prohibited runtime patterns were not introduced;
- package and worker registrations exist;
- `docs/CHAT_START.md` records this local implementation status.

## Local Certification Gate

Recommended next gate:

`READY_FOR_REIE_DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION`

Push, deployment, production certification, City Market runtime implementation, and Neighborhood remediation outside this scope remain unauthorized.
