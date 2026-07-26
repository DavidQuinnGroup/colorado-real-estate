# PROJECT ATLAS(tm)

## Enterprise Knowledge Consumption Program(tm) - Sprint 2 Stage A

### Governed Relationship Read Foundation(tm)

### Pilot Relationship Evidence Package

Status: `EKCP_1.0_SPRINT_2_STAGE_A_PILOT_RELATIONSHIP_EVIDENCE_PACKAGE_GOVERNANCE_RECORDED`

Package date: July 26, 2026

Repository baseline: `5afa5e770b28f98ef92510716b2a8fc59630df98`

Parent source-definition charter: `EKCP_1.0_SPRINT_2_STAGE_A_GOVERNED_RELATIONSHIP_READ_FOUNDATION_SOURCE_DEFINITION_CHARTER_CREATED_IMPLEMENTATION_NOT_AUTHORIZED`

STAGE A STATUS: `NOT_AUTHORIZED`

IMPLEMENTATION STATUS: `NOT_AUTHORIZED`

RELATIONSHIP SOURCE STATUS: `GOVERNED_RELATIONSHIP_SOURCE_NOT_READY`

PILOT EVIDENCE STATUS: `REVIEW_COMPLETE_NOT_APPROVED`

---

## 1. Pilot Objective

Determine whether an initial approved geographic containment relationship can satisfy the Stage A governance requirements before any implementation is authorized.

Primary pilot candidate:

- subject: Thornton;
- relationship: `WITHIN`;
- target: Colorado;
- inverse conceptual relationship: Colorado `CONTAINS` Thornton.

This is a candidate relationship only. This package does not infer, approve, persist, retrieve, expose, or activate the relationship merely because it appears geographically obvious.

This package is documentation and evidence review only. It does not authorize source code, Prisma changes, migrations, relationship rows, production writes, routes, deployment, Google Drive updates, saved-search alert inspection, Search integration, Maps integration, Property Intelligence integration, AI integration, Executive Intelligence integration, Stage A implementation, Stage B implementation, or customer-visible behavior.

---

## 2. Executive Decision Record

Gate 2 - Initial Relationship Families:

- decision: `APPROVED_WITH_LIMITED_SCOPE`;
- approved families: `WITHIN`, `CONTAINS`;
- approval scope: governed administrative containment only;
- required semantics: directional inverse semantics;
- duplicate inverse records: prohibited;
- circular containment: prohibited;
- implementation authorization: not granted;
- persistence authorization: not granted;
- retrieval authorization: not granted;
- downstream integration authorization: not granted.

Gate 3 - Pilot Evidence Package:

- decision: `REVIEW_COMPLETE_NOT_APPROVED`;
- reason: no pilot candidate currently satisfies all eligibility requirements;
- Thornton to Colorado remains blocked because the Colorado target subject has not completed governed subject approval;
- Thornton to Adams County and Thornton to Weld County remain blocked by unresolved multi-county and relationship-modeling questions;
- no relationship candidate is approved;
- no relationship candidate is read-eligible.

Gate 4 - Stage A Implementation:

- decision: `NOT_AUTHORIZED`;
- Stage A implementation must not begin from this evidence package;
- Stage B implementation must not begin from this evidence package.

Immediate prerequisite:

- Colorado must complete governed geographic-subject approval before Thornton `WITHIN` Colorado may be reconsidered.

---

## 3. Source Review

`PROJECT ATLAS - REAL ESTATE DATA TOOLS` remains the canonical external source inventory. This package keeps the architecture source-abstracted by evaluating source categories and evidence envelopes rather than implementation-specific providers, APIs, routes, Prisma tables, or storage structures.

Sources considered:

| Source provider | Dataset or record title | Stable reference | Authority domain | Access date | Effective date | Geographic identity represented | Relationship fact supported | Limitations | Refresh cadence | Licensing or use restrictions | Conflict status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| City of Thornton | Information for New Residents | `https://www.thorntonco.gov/community-culture/about-thornton/information-new-residents` | Municipal self-description and local civic orientation | July 26, 2026 | Not specified | Thornton as home-rule city; Adams County civic context | Corroborates Thornton municipal identity and Adams County civic relationship | Does not establish full boundary geometry or Weld County extent; not sufficient alone for `WITHIN` Colorado | Website-maintained; no explicit cadence observed | Public website; display terms not evaluated for redistribution | No material conflict for Thornton identity; incomplete for relationship approval |
| City of Thornton | City Limits ArcGIS service | `https://maps.thorntonco.gov/citydevweb/rest/services/CityLimits/MapServer` | Municipal city-limit geometry publication | July 26, 2026 | Not specified | Thornton city limits | Potential authoritative geometry source for municipal boundary candidate | Requires GIS review, layer metadata review, effective date, and overlay against state/county boundaries before relationship approval | Service-maintained; cadence not specified | Service use and redistribution terms not evaluated | Incomplete evidence; no relationship approved |
| Colorado Information Marketplace / Colorado Geospatial Data Portal | Municipal Boundaries | `https://data.colorado.gov/dataset/Municipal-Boundaries/vmdf-yuws` | State geospatial aggregation of DOLA-tracked municipalities | July 26, 2026 | Last update shown June 9, 2026 | Colorado municipal boundaries | Supports state-level municipal boundary candidate review | Dataset metadata does not make the data a final survey-grade boundary authority; needs source and fitness review | Updated by state portal; observed 2026 update | CC BY 4.0 shown in metadata | No material conflict, but not approval-ready alone |
| Colorado Information Marketplace / DOLA | Municipal Boundaries in Colorado | `https://data.colorado.gov/Local-Aggregation/Municipal-Boundaries-in-Colorado/w6jq-7em5` | DOLA municipal boundary compilation | July 26, 2026 | Data last updated May 4, 2026; metadata updated July 25, 2026 | Colorado municipal boundary polygons | Supports municipal boundary review | Metadata states best-effort compilation and not an authoritative or official source substituting for survey-grade measurements | Dataset notes future annexation updates and related changes | Public data portal; licensing metadata must be retained | No material conflict, but must not be sole approval source |
| Colorado Municipal Boundaries Project | CO Boundaries | `https://gis.dola.colorado.gov/CO_Muni/` | DOLA municipal-boundary project | July 26, 2026 | Currency depends on base data and annexation updates | Colorado municipal boundaries and annexation context | Supports boundary discovery and source inventory | Project disclaimer says data should not be considered authoritative; must not alone approve relationship facts | Depends on county clerk annexation updates to DOLA | App/data terms require review before reuse | No material conflict, but approval blocked as sole authority |
| U.S. Census Bureau | QuickFacts: Thornton city, Colorado | `https://www.census.gov/quickfacts/fact/table/thorntoncitycolorado/` | Federal statistical place identity and FIPS reference | July 26, 2026 | 2020 geography for land area and FIPS; 2025 estimates for population | Thornton city, Colorado; FIPS `0877290` | Corroborates Thornton as a Colorado place identity | Statistical geography is not a complete relationship approval source; does not resolve county containment or boundary interpretation | Census release cadence | Public federal data; citation and use policies apply | No material conflict for state-place identity |
| U.S. Census Bureau | Census profile: Thornton city, Colorado | `https://data.census.gov/profile/Thornton_city,_Colorado?g=160XX00US0877290` | Federal statistical profile and geographic identity | July 26, 2026 | 2020 decennial / ACS release context | Thornton city, Colorado | Corroborates federal place identity in Colorado | Does not independently authorize governed containment relationship; query URL may be application-state dependent | Census release cadence | Public federal data; citation and use policies apply | No material conflict for state-place identity |
| Adams County Government | Demographics / County Profile | `https://www.adamscountyfair.com/demographics-county-profile` | County self-description | July 26, 2026 | 2022/2021 census references in page | Adams County and listed municipalities | Corroborates that Adams County includes Thornton in county context | Does not establish all of Thornton's county intersections; not sufficient for single county parent | Website-maintained; cadence not specified | Public website; redistribution terms not evaluated | Confirms Adams relationship context but not exclusive containment |
| Weld County Government | Weld County, Adams County and Thornton stoplight partnership | `https://www.weld.gov/Newsroom/2024-News/Weld-County-Adams-County-and-Thornton-to-partner-on-stoplight` | County government public record / news release | July 26, 2026 | Published June 24, 2024 | Weld County, Adams County, and Thornton shared jurisdiction at specific intersection | Corroborates multi-jurisdiction context involving Thornton, Adams County, and Weld County | Project-specific jurisdiction evidence; does not itself define municipal boundary containment | Static news record | Public website; redistribution terms not evaluated | Indicates county modeling ambiguity that must fail closed until geometry review |
| Weld County Government | Geographic Information Systems | `https://www.weld.gov/Government/Departments/Geographic-Information-Systems` | County GIS capability and data source catalog | July 26, 2026 | Not specified | Weld County GIS resources | Potential source for county boundary and property/geographic overlays | Requires dataset-specific selection and evidence package; current page alone is not relationship evidence | County GIS maintained resources | County GIS terms require review | Not relationship-approval evidence yet |

Source review conclusion:

- Thornton `WITHIN` Colorado has strong candidate support but is not approval-ready because Colorado is not yet an approved governed target subject in this Stage A package.
- Thornton county relationships are not approval-ready because authoritative evidence indicates multi-county or multi-jurisdiction considerations that require geometry review and a modeling decision.
- No relationship fact is approved by this package.

---

## 4. Initial Relationship Family Review

`CONTAINS`:

- enterprise value: supports parent/child hierarchy and future area rollups;
- pilot posture: recommended for Gate 2 approval only as the inverse of approved `WITHIN` containment;
- risk: false containment can misstate administrative geography, especially with multi-county municipalities.

`WITHIN`:

- enterprise value: supports parent, ancestor, and containing-area reads;
- pilot posture: recommended for Gate 2 approval as the minimum initial relationship family;
- risk: a subject can have multiple valid containing geographies at different administrative levels, and city-to-county containment may require multi-parent or overlap semantics.

Directionality:

- `WITHIN` is directional from contained subject to containing subject;
- `CONTAINS` is directional from containing subject to contained subject;
- inverse records should be derived or canonically represented, not duplicated without governance;
- circular containment is prohibited.

Gate 2 decision:

- `WITHIN` and `CONTAINS` are `APPROVED_WITH_LIMITED_SCOPE`;
- the approved scope is governed administrative containment only;
- directional inverse semantics are approved;
- duplicate inverse records and circular containment are prohibited;
- do not approve `ADJACENT_TO`, `OVERLAPS`, `RELATED_MARKET`, `SUPERSEDES`, peers, or comparability relationships;
- do not authorize implementation, persistence, retrieval, downstream integration, or customer visibility.

---

## 5. Pilot Candidate Evidence Envelopes

### Candidate A - Thornton `WITHIN` Colorado

| Evidence field | Value |
| --- | --- |
| Source subject ID | Existing certified Thornton subject: `cms10utak0002qa0l8mu7gr8i` |
| Target subject ID | Not yet governed or approved in this package |
| Relationship family | `WITHIN` |
| Direction | Thornton to Colorado |
| Inverse relationship | Colorado `CONTAINS` Thornton |
| Authoritative evidence | U.S. Census Thornton city, Colorado identity; Colorado state municipal boundary datasets; City of Thornton municipal records |
| Corroborating evidence | City of Thornton public records and Colorado municipal boundary resources |
| Evidence method | Documented source review; no geometry overlay performed |
| Confidence recommendation | `HIGH` for Thornton as a Colorado place identity; not yet approved for governed relationship read eligibility |
| Review status recommendation | `READY_FOR_REVIEW` only after Colorado target subject governance is approved |
| Effective date | Not established for governed relationship |
| Acquisition date | July 26, 2026 |
| Reviewed date | July 26, 2026 documentation review |
| Reviewer or approval authority placeholder | Executive geographic relationship reviewer |
| Provenance | Source URLs and source authority table in this package |
| Conflict status | No material conflict identified for state containment; target governance remains incomplete |
| Refresh or expiration recommendation | Annual review, and event-driven review when DOLA/Census/official municipal boundaries update |
| Eligibility determination | `SUBJECT_GOVERNANCE_NOT_READY` |

Assessment:

Thornton `WITHIN` Colorado is the smallest plausible pilot candidate. It is not approved and is not read-eligible. It must not be reconsidered until Colorado is itself a governed approved target subject and effective-date/provenance requirements are completed.

### Candidate B - Thornton `WITHIN` Adams County

| Evidence field | Value |
| --- | --- |
| Source subject ID | Existing certified Thornton subject: `cms10utak0002qa0l8mu7gr8i` |
| Target subject ID | Not yet governed or approved in this package |
| Relationship family | `WITHIN`, `OVERLAPS`, or another governed concept to be decided |
| Direction | Thornton to Adams County if modeled as containment |
| Inverse relationship | Adams County `CONTAINS` Thornton, only if approved |
| Authoritative evidence | City of Thornton Adams County civic context; Adams County profile listing Thornton |
| Corroborating evidence | City and county public records |
| Evidence method | Documented source review; no geometry overlay performed |
| Confidence recommendation | `MEDIUM` for Adams County relationship context; not sufficient for full containment approval |
| Review status recommendation | `READY_FOR_REVIEW` only after county subject and multi-county modeling decision |
| Effective date | Not established for governed relationship |
| Acquisition date | July 26, 2026 |
| Reviewed date | July 26, 2026 documentation review |
| Reviewer or approval authority placeholder | Executive geographic relationship reviewer |
| Provenance | Source URLs and source authority table in this package |
| Conflict status | Material modeling ambiguity because Thornton appears to involve Weld County context as well |
| Refresh or expiration recommendation | Annual review and event-driven review when municipal/county boundaries update |
| Eligibility determination | `MATERIAL_CONFLICT_UNRESOLVED` |

Assessment:

Do not approve a single Adams County parent. The evidence supports Adams County relevance, but not exclusive county containment. This county relationship remains deferred.

### Candidate C - Thornton `WITHIN` Weld County

| Evidence field | Value |
| --- | --- |
| Source subject ID | Existing certified Thornton subject: `cms10utak0002qa0l8mu7gr8i` |
| Target subject ID | Not yet governed or approved in this package |
| Relationship family | `WITHIN`, `OVERLAPS`, or another governed concept to be decided |
| Direction | Thornton to Weld County if modeled as containment |
| Inverse relationship | Weld County `CONTAINS` Thornton, only if approved |
| Authoritative evidence | Weld County public record showing Weld County, Adams County, and Thornton shared jurisdiction at a specific intersection; Weld County GIS catalog availability |
| Corroborating evidence | Colorado municipal boundary sources indicate boundary data must be reviewed, not assumed |
| Evidence method | Documented source review; no geometry overlay performed |
| Confidence recommendation | `MEDIUM` for Weld County relationship context; not sufficient for full containment approval |
| Review status recommendation | `READY_FOR_REVIEW` only after county subject and geometry/modeling decision |
| Effective date | Not established for governed relationship |
| Acquisition date | July 26, 2026 |
| Reviewed date | July 26, 2026 documentation review |
| Reviewer or approval authority placeholder | Executive geographic relationship reviewer |
| Provenance | Source URLs and source authority table in this package |
| Conflict status | Material modeling ambiguity; county relationship may require geometry evidence and may not be simple `WITHIN` |
| Refresh or expiration recommendation | Annual review and event-driven review when municipal/county boundaries update |
| Eligibility determination | `MATERIAL_CONFLICT_UNRESOLVED` |

Assessment:

Do not approve a Weld County parent without geometry evidence and an explicit county-relationship modeling decision. This county relationship remains deferred.

---

## 6. Multi-County Assessment

Administrative facts:

- Thornton has strong public evidence as a Colorado municipality.
- Adams County evidence supports a Thornton-Adams County relationship.
- Weld County evidence supports a Thornton-Weld County jurisdictional context.
- The reviewed evidence does not support selecting a single county parent.

Modeling implications:

- Administrative containment may permit multiple parents only if the enterprise explicitly models city-to-county partial containment.
- A city-to-county relationship may require partial containment, `OVERLAPS`, multiple containment parents, jurisdictional intersection, or another separately governed relationship model rather than simple `WITHIN`.
- Geometry evidence is required before county relationships are approved.
- County objects are not part of the currently approved first pilot subject set in this package.
- No one of these future models is authorized by this decision.

Conflict or ambiguity:

- Unresolved multi-county interpretation must fail closed.
- Absence of an approved county relationship is not evidence that no county relationship exists.
- Candidate county evidence must not become production-readable automatically.

Recommendation:

- keep county relationships out of the first pilot;
- use county evidence to drive a separate enterprise relationship-modeling decision;
- consider Thornton `WITHIN` Colorado only after Colorado target governance and evidence completion.

---

## 7. Empty And Failure Semantics

Required semantics:

- absence of an approved relationship is not evidence that no relationship exists;
- incomplete evidence must fail closed;
- unresolved multi-county interpretation must fail closed;
- candidate evidence must not become production-readable automatically;
- valid authorized empty results are possible only after a governed read source exists and the query is authorized;
- this package creates no governed read source and no production-readable relationship;
- no candidate evidence becomes production-readable automatically.

Failure posture for current candidates:

| Candidate | Current result |
| --- | --- |
| Thornton `WITHIN` Colorado | `SUBJECT_GOVERNANCE_NOT_READY` |
| Thornton `WITHIN` Adams County | `MATERIAL_CONFLICT_UNRESOLVED` |
| Thornton `WITHIN` Weld County | `MATERIAL_CONFLICT_UNRESOLVED` |

---

## 8. Pilot Scope Recommendation

Recommended option:

1. Thornton `WITHIN` Colorado only, after Colorado becomes an approved governed target subject and evidence envelope completion is reviewed.

Do not include county relationships in the first pilot.

Rationale:

- Thornton `WITHIN` Colorado is the smallest valid proof candidate;
- county relationships introduce multi-county modeling ambiguity;
- county containment may require geometry or relationship concepts beyond simple `WITHIN`;
- Stage A should not optimize for the largest pilot.

Current eligibility:

- no candidate relationship is `ELIGIBLE_FOR_PILOT_APPROVAL` yet;
- the state-level candidate is blocked by `SUBJECT_GOVERNANCE_NOT_READY`;
- county candidates are blocked by `MATERIAL_CONFLICT_UNRESOLVED`;
- Colorado governed-subject readiness is the immediate prerequisite before Thornton `WITHIN` Colorado may be reconsidered.

---

## 9. Gate Assessment

Gate 2 - Initial Relationship Families Approved:

- decision: `APPROVED_WITH_LIMITED_SCOPE`;
- approved families: `CONTAINS`, `WITHIN`;
- approved scope: governed administrative containment only, with directional inverse semantics;
- prohibitions: no duplicate inverse records, no circular containment, no implementation authorization, no persistence authorization, no retrieval authorization, and no downstream integration authorization;
- exclusions: `ADJACENT_TO`, `OVERLAPS`, `RELATED_MARKET`, `SUPERSEDES`, peers, and comparability relationships remain not approved.

Gate 3 - Pilot Evidence Package Approved:

- decision: `REVIEW_COMPLETE_NOT_APPROVED`;
- reason: no pilot candidate currently satisfies all eligibility requirements;
- Thornton to Colorado remains blocked because the Colorado target subject has not completed governed subject approval;
- Thornton to Adams County and Thornton to Weld County remain blocked by unresolved multi-county and relationship-modeling questions;
- no pilot relationship is approved;
- no pilot relationship is read-eligible.

Gate 4 - Stage A Implementation Authorized:

- status: `NOT_AUTHORIZED`;
- must not advance from this package.

Later gates:

- Stage A architectural review, controlled read validation, certification, Stage B implementation, and downstream integration remain `NOT_STARTED` or `NOT_AUTHORIZED`.

---

## 10. Safety Boundary

This package prohibits:

- source code creation;
- Prisma or migration changes;
- relationship row population;
- production data writes;
- relationship approval;
- production relationship retrieval;
- API route creation;
- deployment;
- runtime activation;
- customer visibility;
- Google Drive updates;
- saved-search alert inspection or mutation;
- Search integration;
- Maps integration;
- Property Intelligence integration;
- AI integration;
- Executive Intelligence integration;
- Stage A implementation;
- Stage B implementation.

---

## 11. Documentation Boundary

Do not update as part of this package:

- source-definition charter;
- Sprint 2 implementation reports;
- roadmap;
- `docs/CHAT_START.md`;
- Google Drive documents;
- source code;
- package configuration;
- Prisma schema or migrations.

This package is the only authorized artifact for the current documentation-only pilot-evidence step.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/EKCP-1.0-SPRINT-2-STAGE-A-PILOT-RELATIONSHIP-EVIDENCE-PACKAGE.md -->
