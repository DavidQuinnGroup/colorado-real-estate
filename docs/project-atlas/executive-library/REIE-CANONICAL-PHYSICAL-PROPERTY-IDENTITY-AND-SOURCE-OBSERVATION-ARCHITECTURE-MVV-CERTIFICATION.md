# REIE Canonical Physical Property Identity And Source Observation Architecture MVV Certification

## Status

- `REIE_CANONICAL_PHYSICAL_PROPERTY_IDENTITY_AND_SOURCE_OBSERVATION_ARCHITECTURE_MVV_CERTIFIED`
- `PROPERTY_IDENTITY_SOURCE_ADMISSION_REQUIRED`
- `STATEWIDE_PROPERTY_IDENTITY_DATA_REQUIRED`
- `HISTORICAL_MLS_USE_RECONCILIATION_REQUIRED`
- `READY_FOR_STATEWIDE_PROPERTY_IDENTITY_SOURCE_ADMISSION`

## Scope

This package adds empty, provider-neutral persistence architecture plus a pure read-contract proof. It does not retrieve, ingest, correlate, populate, display, activate, or migrate production data. The included Prisma migration is reviewed architecture only and was not applied.

## Domain Separation

`CanonicalPhysicalProperty` is the durable ATLAS anchor for a physical property. It has optional governed address, jurisdiction, coordinate, temporal, confidence, and supersession fields. Address and parcel values are correlation signals, never universal keys.

The existing `Property` model remains a listing-shaped compatibility record keyed by `mlsId`. `CanonicalPropertyListingEvent` is the additive association that can later connect one physical property to zero, one, or multiple current or historical listing records. It introduces no links or historical admission now.

`PropertySourceIdentity` remains the source-scoped external identifier substrate. `CanonicalPhysicalPropertySourceIdentityMapping` links it to the canonical anchor with explicit association type, status, confidence, basis, verification, conflict, temporal, fingerprint, and supersession controls. The existing county account-to-parcel relationship substrate is reused; it does not equate a property with a parcel or assessor account.

`CanonicalPhysicalPropertyObservation` carries source, identity reference, record/semantics/rights/attribution/payload references, freshness, confidence, observation/effective/valid times, and deterministic fingerprint. It can distinguish identity, address, property-fact, and listing-event observations without overwriting canonical identity. Characteristics such as size, beds, baths, year built, valuation, or zoning remain observations rather than identity keys.

## Read And Adapter Contracts

`buildCanonicalPhysicalPropertyIdentityReadModel` is side-effect free. It exposes canonical ID, address signal, jurisdiction, source and parcel identities, current-listing posture, conflicts, freshness, verification requirements, and global gaps. `CERTIFICATION_READY` is internal readiness only. Its activation value is always `NOT_AUTHORIZED`; public records and historical listing evidence remain `NOT_ADMITTED`.

The provider-neutral adapter contract covers county identity, statewide property-provider, MLS listing-event, and IRES listing-event adapters. Every adapter requires source identity, observation provenance, rights, attribution, and a future source-admission decision. Every adapter declares data population and activation `NOT_AUTHORIZED`.

## Safety And Compatibility

The architecture adds no owner, mailing, customer, CRM, demographic, protected-class, targeting, or property-criteria fields. Agent criteria remain separate from property identity and source observations.

No runtime query imports this contract. Public Search, property pages, MLS synchronization, Property Preparation, maps, SEO, alerts, and saved-search behavior retain the legacy `Property` path. No backfill, source activity, migration execution, schema deployment, Supabase mutation, or listing mutation occurred.

The mapping migration prevents a `FUZZY_ADDRESS_CANDIDATE` from becoming `CONFIRMED`. Unknown or restricted rights, stale/unknown freshness, missing observation provenance, possible matches, conflicts, requested public activation, and requested historical listing use all fail closed.

## Deterministic Proof

`npm run check:canonical-physical-property-identity` proves:

- a fixture-only complete internal-governance case can be `CERTIFICATION_READY` while activation stays `NOT_AUTHORIZED`;
- one canonical property can retain multiple external IDs and multiple listing events;
- historical listings remain not admitted;
- unknown rights, stale evidence, conflicting or possible identity, incomplete provenance, and activation requests fail closed;
- every future adapter still requires source admission and cannot populate or activate data;
- the migration contains no data write or legacy `Property` alteration.

## Next Gate

`READY_FOR_STATEWIDE_PROPERTY_IDENTITY_SOURCE_ADMISSION` means an Executive may separately evaluate a proposed statewide source. It does not select LightBox, ATTOM, county-by-county ingestion, MLS Grid, IRES, or any hybrid; it grants no provider activity, rights, historical MLS use, population, or runtime activation.
