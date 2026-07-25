# PROJECT ATLAS(tm)

## Geographic Knowledge Classification(tm) - GKC 1.0

### Architectural Assessment And Governance Standard

Status: `GKC_1.0_ARCHITECTURAL_ASSESSMENT_CERTIFIED_AND_CLOSED`

Assessment date: July 25, 2026

Repository baseline: `2bbabe2bb9686521bb3cb13342f5c8916189b0af`

Assessment scope: architecture and governance documentation only

Runtime activation status: `NOT_AUTHORIZED`

Production data status: `NO_DATA_INSERTED`

---

## 1. Executive Summary

GKC 1.0 defines the canonical governance system for classifying, sourcing, validating, storing, reviewing, and eventually presenting geographic knowledge inside the GIO architecture.

This assessment is a prerequisite standard. It does not authorize Prisma schema changes, migrations, GIO table population, fixture persistence, current-data mapping, property relationship backfill, runtime read adapters, search or map changes, public pages, vendor integrations, AI-generated conclusions, or customer-facing activation.

The governing conclusion is that geographic knowledge must be classified before it is persisted as GIO data. Source authority alone is not enough for public display, indexing, inheritance, map rendering, or customer presentation. Every future GIO knowledge item must pass classification, source, freshness, confidence, conflict, lifecycle, and eligibility gates.

Certification recommendation:

- `GKC_1.0_ARCHITECTURAL_ASSESSMENT_CERTIFIED_AND_CLOSED`

Recommended next authorization:

- `GKC_1.0_FIXTURE_GOVERNANCE_VALIDATION_PACKAGE`

That next package, if authorized, must remain synthetic, non-production, non-customer-facing, and non-persistent unless a later directive expressly authorizes fixture persistence.

---

## 2. Governing Principles

- `Property` remains the production runtime anchor.
- GIO persistence remains dormant until a later activation package is authorized.
- No geographic knowledge may be treated as public-safe solely because it came from an authoritative source.
- Source, classification, confidence, freshness, lifecycle, and eligibility are independent controls.
- Indexability is not the same as public display eligibility.
- Customer presentation must translate trust states into customer-safe language and must not expose operational diagnostics or unsupported conclusions.
- Conflicts must be preserved, not overwritten.
- Effective dates govern when a fact applies; retrieved and verified dates govern evidence recency.
- Licensed, restricted, demographic, school, environmental, safety, investment, valuation, financing, legal, title, insurance, and zoning-related knowledge requires heightened review.
- AI-assisted synthesis cannot create governed geographic facts without source-backed evidence, review, and explicit activation.

---

## 3. Classification Taxonomy

| Classification | Definition | Allowed source classes | Prohibited uses | Confidence expectation | Freshness | Effective dating | Verification | Public display | Indexing | Customer boundary | Conflict behavior | Lifecycle | Examples | Counterexamples |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `AUTHORITATIVE_FACT` | A fact reported by the primary public or industry authority for the domain and object. | Authoritative government, authoritative industry. | Editorial interpretation, ranking, recommendations, legal conclusions, investment conclusions. | High unless source is stale, ambiguous, or conflicts. | Must follow source cadence; stale facts move to review due. | Required when time-bound or boundary-dependent. | Source required; source health must be ready or watch. | Eligible only after license/public-display review. | Eligible when stable and non-sensitive. | Present as factual context with date/source framing. | Preserve competing records; authority priority may select preferred record. | Proposed, verified, active, review due, stale, disputed, superseded, archived. | ZIP code from postal/government source; municipality name from government source. | School quality rating presented as fact; zoning interpretation without legal review. |
| `LICENSED_FACT` | A fact from a licensed commercial or industry source with contract or display constraints. | Licensed commercial, authoritative industry. | Redistribution beyond license, permanent public claims, unsupported derived conclusions. | Medium to high depending on license, source quality, and update cadence. | Must follow license/update terms. | Required for market/listing facts and licensed temporal data. | Source and license metadata required. | Not eligible until display restrictions are cleared. | Eligible only within license terms. | Use only permitted phrasing and attribution. | Preserve conflicts; license restrictions may prevent public conflict explanation. | Proposed, verified, active, review due, restricted, superseded, archived. | MLS-derived inventory count; licensed geocode candidate. | Publishing raw licensed fields without display rights. |
| `ENTERPRISE_OBSERVATION` | A first-party observation, calculation, or derived metric created by REIE systems from governed inputs. | First-party REIE sources, governed internal derivation, approved source combinations. | Presenting as external authority, customer-specific advice, legal/financial/investment conclusion. | Medium unless independently corroborated. | Must carry calculation version and source recency. | Required for derived metrics and reporting periods. | Derivation identity, input evidence, and calculation version required. | Eligible only after review and safe-language approval. | Eligible for internal search first; public indexing needs separate approval. | Present as REIE context, not as official record. | Preserve input conflicts; do not collapse uncertainty. | Proposed, verified, active, review due, stale, disputed, superseded, archived. | Derived market trend from governed listings. | AI summary without source traceability. |
| `EDITORIAL_KNOWLEDGE` | Human-authored first-party geographic context, interpretation, or descriptive place knowledge. | First-party editorial, partner-submitted after review, secondary public after verification. | Facts requiring authority, claims of legal status, safety, quality, demographics, school quality, investment merit. | Low to medium unless backed by cited observations. | Review cadence required; stale editorial is not public-eligible. | Optional unless the statement is time-bound. | Authorship or editorial source required. | Eligible after editorial and trust review. | Eligible only for stable, customer-safe descriptions. | Use qualified, experiential, non-diagnostic language. | Conflicts trigger review or internal-only status. | Proposed, active, review due, stale, superseded, archived. | Community summary; lifestyle orientation. | "Safest neighborhood" or "best investment area." |
| `PROVISIONAL_KNOWLEDGE` | Candidate or unresolved knowledge that may become governed after verification. | Any source class except anonymous unsupported inputs; user-submitted only with internal hypothesis status. | Public display, indexing, automated inheritance, customer recommendations. | Low or insufficient until verified. | Short review interval. | Required if related to a transient condition. | Source required unless explicitly marked internal hypothesis. | Not public-display eligible. | Not public-index eligible. | Internal review only. | Preserve conflicts and unresolved status. | Proposed, needs review, disputed, rejected, superseded, archived. | Candidate alias from string matching. | Public page copy generated from unreviewed candidates. |
| `RESTRICTED_KNOWLEDGE` | Knowledge that is sensitive, regulated, license-restricted, high-risk, or inappropriate for public presentation without special review. | Authoritative government, licensed commercial, first-party, professional review sources. | Public display by default, SEO indexing, automated customer claims, conclusions in protected or regulated domains. | Source-dependent; high confidence does not imply publishability. | Strict review cadence. | Required. | Source and restriction rationale required. | Default no. Possible only after explicit legal/trust approval. | Default no. | Use internal review or referral framing only. | Preserve, restrict, and escalate conflicts. | Proposed, restricted, active internal-only, review due, retired, archived. | Flood context, school attendance boundary, fair-housing-sensitive demographics. | Public "low risk" or "best schools" claim. |

---

## 4. Intelligence-Domain Matrix

| Domain | Default classifications | Special controls |
| --- | --- | --- |
| Market | `LICENSED_FACT`, `ENTERPRISE_OBSERVATION`, `EDITORIAL_KNOWLEDGE` | MLS/license display limits, reporting period, sample size, no investment conclusion. |
| Property | `LICENSED_FACT`, `AUTHORITATIVE_FACT`, `ENTERPRISE_OBSERVATION` | MLS display rules, public record limits, no inspection/legal/valuation conclusions. |
| Public Records | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | Source required; legal interpretation prohibited without professional review. |
| Government | `AUTHORITATIVE_FACT`, `EDITORIAL_KNOWLEDGE` | Effective dates and jurisdiction required; public display still reviewed. |
| Planning and Development | `AUTHORITATIVE_FACT`, `PROVISIONAL_KNOWLEDGE`, `RESTRICTED_KNOWLEDGE` | Plans are not guarantees; customer language must avoid certainty. |
| Construction and Permits | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE`, `EDITORIAL_KNOWLEDGE` | Permit facts require source/date; no code-compliance conclusion. |
| Environmental and Risk | `RESTRICTED_KNOWLEDGE`, `AUTHORITATIVE_FACT` | Professional-review and customer-safety language required; no risk grade activation. |
| Education | `RESTRICTED_KNOWLEDGE`, `AUTHORITATIVE_FACT` | Trust-specific education review required; fair-housing and attendance-boundary controls. |
| Lifestyle and Recreation | `EDITORIAL_KNOWLEDGE`, `AUTHORITATIVE_FACT` | Avoid protected-class proxies and ranking claims. |
| Infrastructure and Utilities | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | Availability and service-area facts require authoritative source and date. |
| Transportation | `AUTHORITATIVE_FACT`, `ENTERPRISE_OBSERVATION`, `EDITORIAL_KNOWLEDGE` | Calculated travel context must not imply guarantees. |
| Community Governance | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | HOA/covenant/legal claims require source and professional boundary. |
| Economic and Demographic | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | Fair-housing review required; demographic targeting and ranking prohibited. |
| Financing | `RESTRICTED_KNOWLEDGE`, `EDITORIAL_KNOWLEDGE` | No loan recommendation, affordability conclusion, or guaranteed payment. |
| Investment | `RESTRICTED_KNOWLEDGE`, `ENTERPRISE_OBSERVATION` | No investment-quality recommendation or return projection. |
| Buyer | `EDITORIAL_KNOWLEDGE`, `ENTERPRISE_OBSERVATION` | Advice must be review-oriented and non-deterministic. |
| Seller | `EDITORIAL_KNOWLEDGE`, `ENTERPRISE_OBSERVATION` | No guaranteed pricing, proceeds, timing, or demand conclusion. |

Domains requiring special trust, legal, licensing, fair-housing, or professional-review controls:

- Education
- Environmental and Risk
- Economic and Demographic
- Financing
- Investment
- Public Records
- Construction and Permits
- Community Governance
- Planning and Development
- Property condition, valuation, title, zoning, insurance, and legal-adjacent knowledge

---

## 5. Source Trust Registry

| Source class | Authority level | Permitted classifications | Verification expectations | Default confidence | Update cadence | Licensing requirements | Public-display restrictions | Fallback status | Conflict priority | Health requirements | Retirement rules |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Authoritative government | Primary for public records and jurisdictional facts | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | Source URL or document identity, jurisdiction, effective date, retrieval date. | High if current. | Source-defined; at least annual review if static. | Public terms and redistribution constraints recorded. | Review before display; sensitive domains remain restricted. | Preferred fallback only for its domain. | Highest for official records in scope. | Ready or watch required. | Retire on source deprecation or jurisdiction replacement; preserve history. |
| Authoritative industry | Primary for listing/MLS market facts in licensed scope | `AUTHORITATIVE_FACT`, `LICENSED_FACT`, `RESTRICTED_KNOWLEDGE` | License, field meaning, timestamp, display rule, source health. | Medium to high. | Real-time/daily when active; source-defined otherwise. | Required. | License controls display and indexing. | Primary in listing domain; not authority for public records. | High inside licensed domain. | Ready required for automated use. | Retire when feed/license changes; preserve historical observation lineage. |
| Licensed commercial | Supplemental or permitted fallback | `LICENSED_FACT`, `ENTERPRISE_OBSERVATION`, `RESTRICTED_KNOWLEDGE` | License terms, attribution, coverage, confidence metadata if available. | Medium. | Source-defined. | Required before storage/display. | Default restricted until cleared. | Fallback only when allowed. | Lower than primary authority; higher than secondary public if licensed and current. | Ready/watch required. | Retire on license expiration or health block. |
| First-party REIE | Enterprise/internal derivation or editorial authority | `ENTERPRISE_OBSERVATION`, `EDITORIAL_KNOWLEDGE`, selected `RESTRICTED_KNOWLEDGE` | Authorship, derivation method, input sources, calculation version, review state. | Medium for governed derivations; low for drafts. | Calculation/review-defined. | Internal rights; third-party input licenses still apply. | Public display requires trust review. | Not fallback for external authoritative facts. | Can prefer presentation wording, not source truth. | Ready for internal use; watch if inputs stale. | Supersede by version; preserve calculation lineage. |
| Secondary public | Supporting source only | `EDITORIAL_KNOWLEDGE`, `PROVISIONAL_KNOWLEDGE` | Corroboration required before material fact use. | Low to medium. | Review-defined. | Terms recorded if reused. | Default internal or editorial-only. | Fallback only for non-material context. | Below authoritative and licensed sources. | Watch by default. | Archive when broken, stale, or contradicted. |
| Partner-submitted | Submitted source requiring review | `PROVISIONAL_KNOWLEDGE`, `EDITORIAL_KNOWLEDGE`, selected `RESTRICTED_KNOWLEDGE` | Submitter identity, rights, date, review outcome. | Low until reviewed. | Partner-defined plus review schedule. | Rights confirmation required. | No public display until approved. | Not default fallback. | Below authoritative sources. | Watch until governed. | Retire on partner termination or failed review. |
| User-submitted | Internal signal, not source of truth | `PROVISIONAL_KNOWLEDGE` only unless reviewed into another class | Identity/context, moderation, corroboration, audit trail. | Insufficient or low. | Immediate review or expiration. | User content terms apply. | Not public-display eligible by default. | Not fallback. | Lowest. | Internal-only. | Reject, archive, or convert after review with source evidence. |

---

## 6. Real Estate Data Tools Source Mapping

The named `PROJECT ATLAS - REAL ESTATE DATA TOOLS` document was not found as a local repository file during the prior GIO repository discovery, and no local copy was discovered during this assessment. The mapping below therefore uses the existing repository evidence and the source categories already documented in GIO Wave 1.

| Tool or source category | Registry class | Candidate classifications | GKC finding |
| --- | --- | --- | --- |
| MLS Grid / MLS services | Authoritative industry | `LICENSED_FACT`, selected `AUTHORITATIVE_FACT`, `ENTERPRISE_OBSERVATION` | Strong listing and market input; license restrictions control public display and indexing. |
| Supabase PostgreSQL | First-party REIE | `ENTERPRISE_OBSERVATION`, storage of governed classifications | Source of persistence, not independent truth for externally sourced facts. |
| Typesense | First-party search infrastructure | None as source of truth | Search index only; may index eligible knowledge after source-of-truth approval. |
| Mapbox geocoding | Licensed commercial | `LICENSED_FACT`, `PROVISIONAL_KNOWLEDGE` | Useful for candidate geocoding; not authoritative parcel or boundary identity. |
| OpenStreetMap tiles | Secondary public | Presentation context only | Tile source is not evidence for governed GIO facts. |
| County assessor | Authoritative government | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | Strong parcel/property/public-record source; legal/valuation boundaries required. |
| County clerk and recorder | Authoritative government | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | Recorded-document source; legal interpretation prohibited. |
| Municipal planning/zoning sources | Authoritative government | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE`, `PROVISIONAL_KNOWLEDGE` | Effective dates and plan-status language required. |
| Census/economic public data | Authoritative government or secondary public by source | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | Demographic and economic use requires fair-housing review. |
| Schools/education sources | Authoritative government or licensed commercial by source | `RESTRICTED_KNOWLEDGE` | Deferred until education trust review. |
| First-party editorial research | First-party REIE | `EDITORIAL_KNOWLEDGE`, `ENTERPRISE_OBSERVATION` | Requires authorship, review date, and customer-safe phrasing. |
| User or partner submissions | User-submitted or partner-submitted | `PROVISIONAL_KNOWLEDGE` | Internal signal only until verified and reclassified. |

Required external record update:

- If the Google Docs version of `PROJECT ATLAS - REAL ESTATE DATA TOOLS` is maintained as the authoritative tools register, add this GKC source-class mapping to that document.

---

## 7. Observation Schema-Key Registry Design

The registry must govern `GeographicObservation.valueSchemaKey` before observations are populated. Registry entries must be versioned and reviewed. The representative keys below prove the architecture only; they are not production data and must not be inserted by this assessment.

| Canonical key | Label | Domain | Object types | Value kind | Structure | Unit | Sources | Effective date | Freshness | Confidence floor | Conflict policy | Review | Public display | Indexing | Version | Deprecation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `market.median_sale_price` | Median sale price | Market | `MARKET_AREA`, `MUNICIPALITY`, `NEIGHBORHOOD`, `ZIP_CODE` | `NUMBER` | Scalar decimal plus period metadata if JSON wrapper is later used. | USD | MLS/industry, first-party derived from governed listing facts. | Required. | Monthly or source-defined. | Medium. | Preserve by period/source; do not overwrite. | Required. | Restricted until sample/display review. | Internal first. | `1.0` | Supersede by new period methodology. |
| `market.inventory_count` | Inventory count | Market | `MARKET_AREA`, `MUNICIPALITY`, `NEIGHBORHOOD`, `ZIP_CODE` | `NUMBER` | Integer count with period and status filter metadata. | Count | MLS/industry, first-party derivation. | Required. | Daily/monthly depending use. | Medium. | Preserve methodology conflicts. | Required. | Possible after license review. | Eligible after method stability. | `1.0` | Supersede by changed listing-status method. |
| `market.days_on_market` | Days on market | Market | `MARKET_AREA`, `MUNICIPALITY`, `NEIGHBORHOOD`, `ZIP_CODE` | `NUMBER` | Decimal or integer with period and calculation method. | Days | MLS/industry, first-party derivation. | Required. | Monthly. | Medium. | Preserve source/method variants. | Required. | Restricted until method/display review. | Internal first. | `1.0` | Supersede by methodology version. |
| `government.zoning_summary` | Zoning summary | Government | `MUNICIPALITY`, `SUBDIVISION`, future parcel object only if authorized | `TEXT` or `JSON` | Summary text with jurisdiction, source document, and no legal conclusion. | None | Government. | Required. | Annual or event-driven. | High for cited text; lower for summaries. | Preserve source document versions. | Legal/trust review required. | Restricted by default. | No by default. | `1.0` | Archive when code/source replaced. |
| `planning.comprehensive_plan_status` | Comprehensive plan status | Planning and Development | `MUNICIPALITY`, `MARKET_AREA` | `TEXT` or `JSON` | Status, plan name, jurisdiction, adopted/date fields. | None | Government. | Required. | Event-driven/annual review. | Medium. | Preserve plan-version history. | Required. | Customer-safe summary only after review. | No by default. | `1.0` | Supersede on plan adoption/update. |
| `lifestyle.park_count` | Park count | Lifestyle and Recreation | `MUNICIPALITY`, `NEIGHBORHOOD`, `MARKET_AREA` | `NUMBER` | Count plus source/method and radius/boundary basis. | Count | Government, first-party derived, secondary public as support. | Required for derived counts. | Annual/review-defined. | Medium. | Preserve method variants. | Required. | Eligible only with neutral context. | Possible after method review. | `1.0` | Supersede by method or boundary update. |
| `environmental.flood_context` | Flood context | Environmental and Risk | `MUNICIPALITY`, `NEIGHBORHOOD`, `ZIP_CODE`, `SUBDIVISION` | `TEXT` or `JSON` | Context statement, source, map/date, no property-specific conclusion. | None | Government or licensed professional source. | Required. | Source-defined/event-driven. | High source; public display still restricted. | Preserve conflict and effective map versions. | Professional/trust review required. | Restricted by default. | No by default. | `1.0` | Supersede by map/source update. |
| `economic.population` | Population | Economic and Demographic | `MUNICIPALITY`, `ZIP_CODE`, `MARKET_AREA` | `NUMBER` | Count with year, geography definition, source table. | Count | Government. | Required. | Annual or Census cadence. | High for official data. | Preserve vintage and geography differences. | Fair-housing review required. | Restricted until approved. | No by default. | `1.0` | Supersede by data vintage. |
| `editorial.community_summary` | Community summary | Lifestyle/Editorial | `MUNICIPALITY`, `NEIGHBORHOOD`, `MARKET_AREA`, `SUBDIVISION` | `TEXT` | Human-reviewed text, authorship, review date, source notes. | None | First-party editorial with supporting sources. | Optional unless time-bound. | Semiannual or editorial-defined. | Low to medium. | Conflicts trigger review. | Required. | Eligible after trust review. | Eligible for public pages after approval. | `1.0` | Archive or supersede on editorial update. |

---

## 8. Alias Normalization Policy

Deterministic normalized-value behavior:

1. Trim leading and trailing whitespace.
2. Convert Unicode punctuation variants to ASCII equivalents when safe.
3. Lowercase with `en-US` locale.
4. Collapse repeated internal whitespace to a single space.
5. Remove terminal periods from common abbreviations only after abbreviation expansion rules are applied.
6. Normalize hyphen and slash spacing to a single canonical separator.
7. Preserve ZIP codes as five digits or ZIP+4 when explicitly sourced.
8. Preserve language tag and alias type as part of uniqueness.
9. Do not strip words that affect identity, such as `north`, `south`, `east`, `west`, `old`, `new`, `town`, `city`, `village`, or `heights`.
10. Store the original alias text alongside the normalized value.

Policy by concern:

- Capitalization: not identity-bearing; normalize to lowercase for lookup.
- Punctuation: normalize decorative punctuation; preserve punctuation that distinguishes legal names until reviewed.
- Whitespace: collapse repeated spaces.
- Abbreviations: maintain governed expansion table for `st`, `mt`, `ft`, `hwy`, directional abbreviations, and municipality labels.
- Directional prefixes/suffixes: preserve as identity-bearing tokens.
- City and town labels: do not silently remove; classification must distinguish legal municipality from colloquial place name.
- ZIP and postal formatting: zero-pad and preserve ZIP+4 only when source supports it.
- Historic names: use alias type `LEGACY` or future historic type; do not make primary without lifecycle review.
- Colloquial names: allowed as aliases, not canonical identity, unless governance approves.
- Builder marketing names: provisional or restricted until source and legal geography are verified.
- Subdivision variants: preserve plats/recorded names separately from marketing names.
- Duplicate aliases: unique per object/type/language/lifecycle; cross-object collisions must become ambiguity records.
- Cross-object collisions: never silently select a target; require internal disambiguation.
- Multilingual aliases: require language tag when language is known.
- Deprecated aliases: retain for lookup/redirect history; do not publish as current name.

Current search behavior must not be modified by this policy.

---

## 9. Lifecycle Rules

### Object Lifecycle

Conceptual object lifecycle:

- `PROPOSED`: candidate object not eligible for runtime consumption.
- `ACTIVE`: governed object approved for the authorized internal scope.
- `LIMITED`: valid object with restricted use or incomplete coverage.
- `MERGED`: retired into another object while preserving identity history.
- `SUPERSEDED`: replaced by another object/version or governance model.
- `ARCHIVED`: retained for history only.

Current enum mapping:

| Conceptual state | Current `GeographicLifecycleStatus` mapping | Gap |
| --- | --- | --- |
| `PROPOSED` | `DRAFT` | Naming mismatch only. |
| `ACTIVE` | `ACTIVE` | None. |
| `LIMITED` | No direct value | Enum gap. |
| `MERGED` | `MERGED` | None. |
| `SUPERSEDED` | `DEPRECATED` or `MERGED` depending case | Enum gap. |
| `ARCHIVED` | `ARCHIVED` | None. |

### Source Lifecycle

Conceptual source lifecycle:

- `PROPOSED`
- `ACTIVE`
- `DEGRADED`
- `RESTRICTED`
- `RETIRED`

Current enum mapping:

| Conceptual state | Current `GeographicHealthState` mapping | Gap |
| --- | --- | --- |
| `PROPOSED` | `UNKNOWN` | Lifecycle/health conflation. |
| `ACTIVE` | `READY` | Acceptable for health, not full lifecycle. |
| `DEGRADED` | `DEGRADED` | None. |
| `RESTRICTED` | `WATCH` or source flags | Enum gap. |
| `RETIRED` | No direct value | Enum gap; `BLOCKED` is not retirement. |

### Knowledge Lifecycle

Conceptual knowledge flow:

`PROPOSED -> VERIFIED -> ACTIVE -> REVIEW_DUE -> STALE -> DISPUTED -> SUPERSEDED -> ARCHIVED`

Current enum mapping:

| Conceptual state | Current fields | Gap |
| --- | --- | --- |
| `PROPOSED` | `reviewStatus=PENDING_REVIEW`, object lifecycle `DRAFT` | None for review posture. |
| `VERIFIED` | `reviewStatus=REVIEWED` | Verification and public activation remain separate. |
| `ACTIVE` | object/relationship lifecycle `ACTIVE` | None. |
| `REVIEW_DUE` | `freshness=AGING` | Approximate. |
| `STALE` | `freshness=STALE` | None. |
| `DISPUTED` | `reviewStatus=CONFLICTED`, `confidence=INSUFFICIENT` as needed | None. |
| `SUPERSEDED` | object/relationship lifecycle `DEPRECATED` | Enum gap for explicit supersession. |
| `ARCHIVED` | object/relationship lifecycle `ARCHIVED` | Observation review status lacks archive value. |

No enum change is authorized by this assessment.

---

## 10. Source Requirement Policy

| Classification | Source requirement |
| --- | --- |
| `AUTHORITATIVE_FACT` | `sourceId` required. |
| `LICENSED_FACT` | `sourceId` required plus license metadata. |
| `ENTERPRISE_OBSERVATION` | `sourceId` or governed derivation identity required; input sources must remain traceable. |
| `EDITORIAL_KNOWLEDGE` | First-party authorship or editorial source required. |
| `PROVISIONAL_KNOWLEDGE` | Source required unless explicitly marked internal hypothesis. |
| `RESTRICTED_KNOWLEDGE` | `sourceId` required. |

Justified exceptions:

- Internal hypothesis records may temporarily lack `sourceId` only when classified as `PROVISIONAL_KNOWLEDGE`, marked internal-only, excluded from indexing/public display, assigned a review expiration, and never used for customer presentation.
- Editorial drafts may use first-party authorship metadata instead of a source registry row only before persistence activation. Once persisted as GIO observations, the preferred policy is a first-party editorial source record.

---

## 11. Conflict-Preservation Model

Conflict-group creation:

- Create a conflict group when two observations or relationships address the same object, schema key, effective period, and claim but disagree in value, source, boundary, or classification.

Competing observation retention:

- Retain all competing observations with source, effective date, retrieved date, verified date, freshness, confidence, and review status.

Preferred-source designation:

- Preferred source may be selected for internal resolution, but non-preferred observations must remain preserved unless rejected by review.

Authority comparison:

- Domain-specific authority wins only within its domain. A government planning source is not automatically preferred for MLS market counts, and MLS is not authoritative for public records.

Effective-date comparison:

- Newer retrieval does not automatically supersede older effective-date claims. Supersession requires effective-period review.

Manual resolution:

- Manual resolution requires reviewer identity or role, rationale, date, affected observations, and whether public display is allowed.

Unresolved public-display behavior:

- Unresolved conflicts are not public-display eligible unless the public copy can safely state uncertainty without implying a conclusion.

Supersession:

- Supersession creates a new active/preferred record and marks the prior record as superseded/deprecated; it does not delete history.

Historical preservation:

- Historical records remain available for audit, time-series context, and rollback analysis.

No material fact should be silently overwritten solely because a newer ingestion run occurs.

---

## 12. Fixture-Only Validation Design

A future fixture-only validation package should use synthetic, non-production records and must not insert fixtures into production.

Required fixture suites:

- Classification rules: validate each classification and prohibited-use boundary.
- Source requirements: assert required source or derivation identity by classification.
- Alias normalization: validate capitalization, punctuation, whitespace, abbreviations, directionals, ZIPs, duplicates, and cross-object collisions.
- Schema-key validation: validate representative scalar and JSON schema keys.
- Lifecycle transitions: validate proposed, verified, active, review due, stale, disputed, superseded, archived flows.
- Conflicts: preserve competing observations and relationships with conflict groups.
- Eligibility gates: confirm no public/index/search/map capability becomes true without explicit gate evidence.
- Duplicate prevention: validate object, alias, relationship, source, eligibility, and property relationship uniqueness.
- Trust-aware inheritance: ensure property-facing inherited context remains blocked unless source, classification, and eligibility allow it.
- Retirement and supersession: preserve history and redirect/alias candidates without deleting facts.

Fixture package constraints:

- Synthetic records only.
- No production GIO table writes.
- No current geography mapping.
- No search, map, property, route, page, MLS, Typesense, CRM, alert, email, or customer behavior changes.
- No schema changes unless separately authorized.

---

## 13. Activation-Gate Framework

| Gate | Prerequisites | Required evidence | Trust requirements | Validation | Rollback | Approval authority | Stop conditions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Fixture validation | GKC architecture certified | Synthetic fixture plan | No production data | Fixture tests and docs | Revert fixture artifacts | Architecture/governance approval | Any production dependency or real data appears |
| 2. Internal development persistence | Fixture validation passed | Non-production DB target and recovery plan | Internal-only | Migration/status checks in dev | Drop/revert non-production data | Technical + governance approval | Production target detected |
| 3. Production internal-only persistence | Recovery gate reconfirmed | Migration plan, row counts, rollback plan | Source and classification required | Migrate/status/read-only verification | Forward repair or governed rollback | Executive production approval | Backup unavailable or pending migration ambiguity |
| 4. Existing-data mapping | Internal-only persistence stable | Dry-run mapping report | No writes; ambiguity preserved | Report review | None; read-only | Architecture approval | Any write path or silent match |
| 5. Property relationship activation | Mapping approved | Dedupe keys and batch plan | Source/confidence/effective date required | Bounded batch verification | Forward correction plan | Executive production approval | Property behavior changes or duplicate rates exceed threshold |
| 6. Search eligibility | Relationships stable | Eligibility review record | Public-safe and source-backed | Search safety checks | Disable eligibility/read adapter | Product + governance approval | Search result behavior changes outside scope |
| 7. Map eligibility | Geometry/source policy approved | Map density/precision rules | No misleading precision | Map safety checks | Disable map layer | Product + governance approval | Unauthorized geometry or risk display |
| 8. Public-page eligibility | Editorial/trust review | Completeness and display evidence | Customer-safe copy | Public trust checks | Disable page eligibility | Product + governance approval | Thin, duplicate, restricted, or conflicted content |
| 9. Indexing eligibility | Public/index policy approved | Robots/schema/search-index plan | No restricted facts | Index checks | Remove from index | Product + SEO/governance approval | License or fair-housing issue |
| 10. Customer presentation | Public eligibility approved | Copy, schema, and UX review | No unsupported conclusions | Browser and trust review | Revert presentation | Product Design Authority | Customer-facing claim overreaches source |
| 11. External-source ingestion | Source registry entry approved | License, health, cadence, error handling | Source-specific controls | Dry-run then bounded ingest | Disable integration/preserve data | Executive/vendor approval | Terms unclear, source unhealthy, or writes exceed bounds |
| 12. AI-assisted synthesis | Human-reviewed source corpus | Prompt, evidence, review, limitations | No unsourced conclusions | Red-team/trust review | Disable synthesis | Executive + trust approval | Any unsupported, regulated, or customer-specific conclusion |

---

## 14. Legal, Licensing, Fair-Housing, And Trust Boundaries

- Fair-housing review is required for education, demographic, lifestyle-ranking, neighborhood comparison, safety, economic, protected-class proxy, and desirability claims.
- Licensing review is required before storing, indexing, displaying, or deriving from MLS, commercial geocoding, proprietary market, or partner-submitted data.
- Legal/professional review is required for zoning, title, covenants, HOA, insurance, hazard, environmental, financing, affordability, investment, valuation, and permitting conclusions.
- Public copy must be neutral, source-aware, and review-oriented.
- Restricted knowledge defaults to internal-only and non-indexable.
- Public display eligibility must be explicit; absence of restriction is not approval.

---

## 15. Enum-Gap Analysis

Current GIO enums are sufficient for dormant persistence and fixture architecture, but they do not fully cover the GKC conceptual standard.

| Area | Current limitation | Future consideration |
| --- | --- | --- |
| Knowledge classification | No `GeographicKnowledgeClassification` enum exists. | Add registry or enum only in a later schema package. |
| Source class | Current source classes are narrower than GKC registry categories. | Consider mapping layer before enum expansion. |
| Authority level | Current values do not distinguish primary, fallback, supplemental, editorial. | Add registry-backed policy or future enum values. |
| Lifecycle | `LIMITED`, `SUPERSEDED`, `REVIEW_DUE`, and source `RETIRED` are not first-class. | Add explicit statuses only after fixture validation proves need. |
| Visibility | Current visibility lacks `PUBLIC_VISIBLE`, `PRIVATE`, and `ARCHIVED_REDIRECT`. | Keep eligibility table as activation control; revisit before public pages. |
| Alias types | Current alias types do not include historic, colloquial, misspelling, former slug, abbreviation. | Add after alias fixture tests. |
| Observation value kinds | Current value kinds omit URL, enum, measurement. | Use JSON schema keys cautiously until expansion is authorized. |
| Review status | Current review statuses omit archived/review due. | Combine freshness and lifecycle until schema expansion is approved. |

No enum or schema changes are authorized by GKC 1.0 assessment.

---

## 16. Risks And Unresolved Decisions

| Risk or decision | Status | Required handling |
| --- | --- | --- |
| Authoritative facts may still be unsafe for public display. | Open control | Keep public-display eligibility independent. |
| Source documents named in the work package are not all local repository files. | Watch | Update authoritative Google Docs records separately if they are the source of truth. |
| No persisted classification field exists in GIO schema. | Known gap | Future schema package must decide enum vs registry. |
| Nullable `sourceId` remains structurally allowed. | Watch | Enforce source policy in future validation/runtime before data creation. |
| Alias normalization is not database-enforced. | Watch | Fixture-test helper behavior before population. |
| Education and demographics create fair-housing exposure. | Controlled | Keep restricted and deferred pending trust review. |
| Licensed facts may be technically accurate but non-displayable. | Controlled | License metadata and display restrictions must gate public use. |
| AI synthesis can overstate evidence. | Controlled | No activation without source-grounded, human-reviewed synthesis policy. |

---

## 17. Recommended Next Implementation Package

Recommended next package:

- `GKC_1.0_FIXTURE_GOVERNANCE_VALIDATION_PACKAGE`

Scope:

- Implement non-production, synthetic fixture validation for the GKC standard.
- Validate classification rules, source requirements, alias normalization, schema-key rules, lifecycle transitions, conflict groups, eligibility gates, duplicate protections, trust-aware inheritance, and supersession.

Required exclusions:

- No production data.
- No production GIO inserts.
- No current-data mapping.
- No backfill.
- No runtime activation.
- No customer-facing changes.
- No external-source integration.
- No search, map, property, route, page, MLS, Typesense, CRM, alert, or email changes.

---

## 18. Explicit Deferrals

Deferred until separate authorization:

- Prisma schema changes.
- New migrations.
- GIO data insertion.
- Fixture persistence.
- Production table population.
- Existing geography mapping.
- Property-to-GIO relationship backfill.
- Search, map, property page, public page, sitemap, schema, or SEO activation.
- Typesense GIO indexing.
- Vendor/source integrations.
- AI-assisted synthesis.
- School district, school, demographic, environmental risk, safety, insurance, legal, zoning, title, valuation, affordability, financing, and investment conclusions.
- Updates to Google Docs authoritative references not represented as local repository files.

---

## 19. Executive Certification Recommendation

GKC 1.0 Architectural Assessment is certified and closed as a governance standard.

Certification:

- `GKC_1.0_ARCHITECTURAL_ASSESSMENT_CERTIFIED_AND_CLOSED`

Readiness:

- `READY_FOR_GKC_1.0_FIXTURE_GOVERNANCE_VALIDATION_PACKAGE`

This readiness is limited to a future synthetic, non-production validation package. It is not readiness for GIO data population, geographic mapping, runtime integration, public display, indexing, vendor ingestion, or customer-facing activation.
