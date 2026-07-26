# PROJECT ATLAS(tm)

## GIS 1.0 CGS Controlled Pilot Design

Status: `PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED`

Date: July 26, 2026

---

## Selected Subject

Colorado Geological Survey is selected for the Sprint 7 controlled provider pilot design because certified Sprint 6 due diligence retained it as a controlled-provider pilot authorization review candidate and identified the `Colorado Landslide Inventory` within reviewed official CGS source families.

Exact selection:

- Provider inventory entry: `colorado-geological-survey`
- Provider canonical name: Colorado Geological Survey
- Dataset or service family: `CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY`
- Dataset or service name: `Colorado Landslide Inventory`
- Source references: `GIS-S6-SRC-CGS-GIS-PORTAL`, `GIS-S6-SRC-CGS-MAPPING`
- Jurisdiction: Colorado
- Domain: `ENVIRONMENTAL_INTELLIGENCE`
- Categories: geologic hazards, landslides, environmental risk

## Design Limits

- Subject mode: `SYNTHETIC_INTERNAL_GEOGRAPHY_ONLY`
- Geometry: `ONE_FIXED_SYNTHETIC_BOUNDING_BOX`
- Requests: maximum `2`
- Records: maximum `25`
- Duration: maximum `120` seconds
- Rate limit: `UNDEFINED_FAIL_CLOSED`
- Dry run required: `true`
- Internal only: `true`

## Authorized Fields

- official feature or record ID
- dataset version
- geometry or geographic reference
- landslide or geologic-hazard classification
- evidence category
- publication or effective date
- source metadata
- attribution metadata

## Prohibited Fields

- personal information
- owner information
- contact information
- user identifiers
- unrelated property attributes
- unrelated provider metadata
- hidden internal fields
- credentials
- analytics identifiers
- customer display fields
- redistribution fields

## Operator Controls

The design requires exact pilot ID, exact provider ID, exact dataset ID, exact adapter ID and version, explicit mode, operator acknowledgement, maximum request count, maximum record count, geographic scope, execution expiration, authorization control, and immutable audit record. Missing controls fail closed.

## Stop Conditions

Stop conditions include provider identity mismatch, dataset mismatch, unsupported schema or format, licensing uncertainty, attribution uncertainty, terms conflict, unexpected authentication requirement, unexpected account requirement, rate-limit response, request-volume threshold, record-volume threshold, geographic scope expansion, unauthorized field appearance, personal or sensitive data appearance, subject mismatch, domain mismatch, checksum or integrity failure, provider response inconsistency, unexpected persistence attempt, unexpected runtime registration, customer-visibility drift, and audit failure.

## Rollback Expectations

Any future separately authorized dry-run attempt must terminate future access attempts on stop, discard transient provider payloads, preserve only governed audit metadata, preserve rejection reasons and Sprint 6 source references, create no provider data records, create no evidence observations, create no runtime state, and create no customer output.

## Review Requirements

Legal review must resolve CGS terms, disclaimer, permitted use, derivative use, redistribution, and customer-display status before execution. Licensing review must resolve dataset-level operational-use and attribution requirements before execution. Technical review must confirm the exact service family and layer schema, future provider-neutral evidence compatibility, and future rate and volume behavior.

## Execution Boundary

Sprint 7 creates no live adapter and performs no provider call. Provider contact, accounts, credentials, terms acceptance, provider data acquisition, persistence, retrieval, runtime activation, downstream integration, customer visibility, relationships, hierarchy traversal, Colorado runtime consumption, GOF Wave 5, and Sprint 8 remain `NOT_AUTHORIZED`.
