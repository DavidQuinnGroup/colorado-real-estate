# PROJECT ATLAS(tm)

## Geographic Mapping Architecture(tm) - GMA 1.0

### Architectural Assessment And Mapping Governance Standard

Status: `GMA_1.0_ARCHITECTURAL_ASSESSMENT_CERTIFIED_AND_CLOSED`

Assessment date: July 25, 2026

Repository baseline: `9ef0a46e2c64851cfcf6b62910b966bc013feff7`

Assessment scope: architecture and governance documentation only

Runtime activation status: `NOT_AUTHORIZED`

Internal mapping status: `NOT_AUTHORIZED`

Internal mapping determination: `INTERNAL_GEOGRAPHIC_MAPPING_NOT_AUTHORIZED`

Production data status: `NO_GIO_DATA_INSERTED`

Governing principle status: `EDITORIAL_SEPARATION_PRINCIPLE_ADOPTED`

---

## 1. Executive Summary

GMA 1.0 defines the governance architecture for deciding how existing geographic knowledge may later be mapped into Geographic Intelligence Objects. It is the decision standard, not a mapping run.

This assessment confirms that the repository now has the necessary prerequisite governance sequence:

- GIO 1.0 Waves 1-4 are certified or implementation-ready as applicable.
- GKC 1.0 architecture and fixture governance validation are certified and closed.
- GKM 1.0 existing knowledge inventory and classification is certified and closed.
- The Editorial Separation Principle has been adopted.

GMA 1.0 establishes the mapping subject, target, type, method, confidence, lifecycle, evidence, ambiguity, duplicate, merge, human-review, AI-boundary, and activation-gate framework required before any internal mapping preview may be authorized.

This wave made no Prisma changes, created no migrations, inserted no GIO rows, mapped no existing repository assets, assigned no properties, changed no search or map behavior, changed no runtime module, changed no public page, connected no vendor, scraped no source, activated no AI mapping, and performed no production mutation.

Certification recommendation:

- `GMA_1.0_ARCHITECTURAL_ASSESSMENT_CERTIFIED_AND_CLOSED`

Recommended next authorization:

- `GMA_1.0_READ_ONLY_MAPPING_PREVIEW_PLAN`

That next authorization should remain non-production, non-persistent, deterministic, and read-only. It should produce preview ledgers only, not GIO rows.

---

## 2. Editorial Separation Principle(tm)

Status: `EDITORIAL_SEPARATION_PRINCIPLE_ADOPTED`

Editorial content, market commentary, lifestyle descriptions, local guidance, and community narratives shall never become governed geographic facts unless they receive explicit classification, source attribution, trust review, and activation approval.

GMA applies this principle by separating:

- Object identity: the governed existence of a place object.
- Factual observation: a source-backed fact or measurement about an object.
- Source association: provenance and authority evidence.
- Relationship: typed association between objects or between property and geography.
- Alias: a source-specific, colloquial, historic, display, or lookup value.
- Editorial association: narrative relevance that may support content but cannot create factual identity.

Editorial knowledge may inform customer understanding, internal review, or future page context. It must not become canonical identity, authoritative observation, property relationship, search facet, map geometry, indexable fact, or public display claim through automatic inference.

---

## 3. Governing Mapping Principles

- Mapping decisions must be evidence-led and reversible until explicitly approved.
- Source authority, mapping confidence, public-display eligibility, and activation eligibility are independent controls.
- `Property` remains the production runtime anchor.
- Current string geography fields remain non-destructively in place.
- No repository entry becomes canonical merely because it is older, more frequent, or used by runtime code.
- GIO object identity, alias, relationship, observation, source, and editorial association must remain different target classes.
- Conflicts are preserved; they are not resolved by convenience, string frequency, route priority, or search behavior.
- Source Abstraction remains active: architecture is organized around source classes and intelligence domains, not vendor-specific dependency.
- High-risk domains require heightened review before any persistence or presentation.
- Approval at one gate does not authorize the next gate.

---

## 4. Mapping Record Model

GMA recommends a conceptual mapping record with these fields. This is an architecture model only and is not a Prisma change.

| Area | Required fields | Purpose |
| --- | --- | --- |
| Mapping identity | mapping ID, run ID, created date, reviewer, lifecycle | Auditability and repeatable review. |
| Mapping subject | source asset ID, source location, source value, source structure, source classification, source system | Identifies exactly what repository or source value is under review. |
| Mapping target | GIO object, alias, relationship, observation, source, editorial association, deferred target, rejected target | Separates destination classes and prevents false promotion. |
| Mapping type | identity, alias, relationship, observation, source association, editorial association, deferred, rejected | Records the nature of the proposed mapping. |
| Mapping method | authoritative import, licensed import, exact normalized match, deterministic rule, spatial resolution, manual review, editorial association, AI-assisted proposal, legacy migration | Records how the proposal was derived. |
| Evidence | source class, source ID, evidence summary, source URL or path, effective date, retrieved date, verified date, license posture | Supports source and trust review. |
| Decision controls | confidence, conflict status, review status, activation eligibility, stop condition, decision rationale | Prevents unreviewed activation. |
| Lifecycle controls | proposed, validated, approved, active, review due, disputed, blocked, manual review required, superseded, retired, rejected | Enables non-destructive governance. |

Every future mapping proposal should be explainable from these fields without reading code or production data.

---

## 5. Mapping Classifications

| Mapping type | Definition | Automatic mapping posture | Example repository input |
| --- | --- | --- | --- |
| `IDENTITY_MAPPING` | A source value proposes or confirms a canonical GIO object identity. | Allowed only for authoritative import or exact governed match with no ambiguity. | A sourced municipality name later mapped to `MUNICIPALITY`. |
| `ALIAS_MAPPING` | A source value becomes a lookup, display, historic, colloquial, MLS, legal, or legacy alias for an object. | Allowed after collision review. | `data/cities.ts` value considered as alias input. |
| `RELATIONSHIP_MAPPING` | A source value proposes a typed object-to-object relationship. | Review required unless relationship is authoritative and deterministic. | City-to-neighborhood containment candidate. |
| `OBSERVATION_MAPPING` | A source value becomes a dated, typed, source-backed observation. | Requires schema key, source, effective date, confidence, and review. | Median price or inventory statistic. |
| `SOURCE_ASSOCIATION` | A value links an object, alias, relationship, or observation to provenance. | Required for material facts. | County GIS as boundary source. |
| `EDITORIAL_ASSOCIATION` | A narrative or content relationship remains editorial only. | Must not auto-promote. | Lifestyle guide related to a neighborhood. |
| `DEFERRED_MAPPING` | A candidate is potentially useful but lacks evidence, authority, licensing, or trust readiness. | Not activated. | Approximate polygon fixture. |
| `REJECTED_MAPPING` | A candidate was reviewed and found unsuitable. | Retain decision history. | Ambiguous subdivision name with wrong municipality. |

---

## 6. Mapping Methods

| Method | Definition | Minimum review |
| --- | --- | --- |
| `AUTHORITATIVE_IMPORT` | Imported from a governing legal, administrative, or official domain source. | Source, effective date, license/display review. |
| `LICENSED_IMPORT` | Imported from MLS, commercial, or licensed source. | License, display, field-meaning, and freshness review. |
| `EXACT_NORMALIZED_MATCH` | Deterministic match after approved normalization with no collisions. | Collision and object-type review. |
| `DETERMINISTIC_RULE` | Rule-based derivation from governed inputs. | Rule version, fixture test, and reviewer approval. |
| `SPATIAL_RESOLUTION` | Point, polygon, distance, or containment method. | Geometry source, precision, method, and boundary conflict review. |
| `MANUAL_REVIEW` | Human-reviewed decision from evidence. | Reviewer, rationale, and conflict status required. |
| `EDITORIAL_ASSOCIATION` | Human-authored context linked for content relevance. | Editorial review; no factual promotion. |
| `AI_ASSISTED_PROPOSAL` | AI generates candidate mappings, ambiguity flags, summaries, or duplicate candidates. | Always manual review; never autonomous approval. |
| `LEGACY_MIGRATION` | Existing repository value proposed from legacy/static records. | Source upgrade, duplicate review, and activation gate required. |

---

## 7. Confidence Framework

Confidence describes mapping reliability. It is not equivalent to source authority and does not grant public-display rights.

| GMA confidence | Meaning | Current enum mapping | Gap |
| --- | --- | --- | --- |
| `AUTHORITATIVE` | Directly established by governing source in its domain. | `HIGH` plus source authority metadata | Current `GeographicConfidence` lacks this explicit value. |
| `EXACT` | Exact deterministic normalized match with no ambiguity. | `HIGH` | Current enum lacks exact-match distinction. |
| `HIGH` | Strong corroborated or reviewed evidence. | `HIGH` | None. |
| `MEDIUM` | Reasonable but requires review or limited activation. | `MEDIUM` | None. |
| `LOW` | Weak, incomplete, or provisional evidence. | `LOW` | None. |
| `UNRESOLVED` | Evidence does not support a decision. | `INSUFFICIENT` | Naming mismatch. |
| `REJECTED` | Reviewed and rejected. | `INSUFFICIENT` plus `reviewStatus=REJECTED` | No direct confidence value. |

Confidence must be stored with source class, review status, freshness, lifecycle, and activation eligibility. A high-confidence restricted source can still be internal-only.

---

## 8. Lifecycle Framework

| GMA lifecycle | Meaning | Current GIO/GKC mapping | Gap |
| --- | --- | --- | --- |
| `PROPOSED` | Candidate exists for review only. | `DRAFT`, `PENDING_REVIEW` | None. |
| `VALIDATED` | Evidence checks passed but not approved for use. | `REVIEWED` | Validation and approval are not separate enums. |
| `APPROVED` | Human-approved for a specified internal scope. | No direct value | Enum gap. |
| `ACTIVE` | Active only for explicitly authorized scope. | `ACTIVE` | None. |
| `REVIEW_DUE` | Validity or freshness requires review. | `AGING`, `PENDING_REVIEW` | Approximate. |
| `DISPUTED` | Credible conflict exists. | `CONFLICTED` | None. |
| `BLOCKED` | Cannot progress due license, trust, source, or architecture blocker. | Source health `BLOCKED` | Relationship/object lifecycle lacks blocked. |
| `MANUAL_REVIEW_REQUIRED` | Automatic processing must stop. | `PENDING_REVIEW` plus stop reason | Enum gap. |
| `SUPERSEDED` | Replaced by newer source, object, or decision. | `DEPRECATED`, `MERGED` | No explicit superseded value. |
| `RETIRED` | No longer active but retained historically. | `ARCHIVED` or `DEPRECATED` | Naming gap. |
| `REJECTED` | Reviewed and not accepted. | `REJECTED` review status | Object/relationship lifecycle lacks rejected. |

Future implementation should preserve lifecycle history rather than overwriting decisions.

---

## 9. Canonical Selection Rules

Canonical geographic identity should be selected in this order:

1. Authoritative legal or administrative source.
2. Authoritative industry source.
3. Governed REIE identity.
4. Licensed commercial source.
5. Corroborated secondary source.
6. Editorial or colloquial identity as alias only.

Exception handling:

- Legal, postal, MLS, market, planning, school, and colloquial geographies may all be valid but different objects or aliases.
- A runtime route slug may remain stable for customer experience while the underlying canonical GIO object requires source review.
- A market area may intentionally aggregate multiple municipalities or split one municipality; it should not replace legal identity.
- A neighborhood without stable boundary may still be an editorial or alias object candidate but should not become a boundary-backed factual object.
- Older or more frequent repository use is evidence of operational dependency, not canonical truth.

---

## 10. Object-Specific Mapping Rules

| Object or relationship | Required mapping rules |
| --- | --- |
| Municipality | Distinguish incorporated names, town/city labels, county overlap, postal names, unincorporated places, and MLS municipality values. Legal identity takes priority; postal and MLS values may become aliases or source-specific relationships. |
| Neighborhood | Distinguish informal boundaries, planning boundaries, MLS neighborhoods, editorial neighborhoods, duplicates, overlaps, and no-boundary identities. Editorial neighborhoods are not boundary facts. |
| MarketArea | Distinguish municipality conflation, MLS market areas, analytical areas, editorial areas, multi-municipality aggregation, and partial-municipality aggregation. Market areas are analytical objects, not legal replacements. |
| ZipCode | Preserve postal identity and formatting. ZIPs can span municipalities and must not be treated as city identity. ZIP aliases require postal/source review. |
| Subdivision | Distinguish recorded names, MLS values, builder marketing names, phases, filings, duplicate names across municipalities, and legal versus colloquial identity. Name-only mapping is prohibited. |
| Property relationship | Future assignment must record source, mapping method, confidence, effective date, lifecycle, manual review status, and coexist with current property strings. No property mappings are created by GMA. |

---

## 11. Alias Architecture

Source values become:

- Canonical names only after canonical selection and source review.
- Display names when customer presentation differs from strict canonical naming.
- Aliases when a source value is a valid lookup but not canonical.
- Historic aliases when previous identity is retained for traceability.
- Abbreviations when governed expansion rules exist.
- Colloquial aliases when common usage is useful but not authoritative.
- Source-specific aliases when a value is valid only in a provider or domain context.
- Builder marketing aliases when marketing identity differs from legal subdivision.
- Deprecated aliases when lookup history should remain but presentation should not.
- Rejected aliases when collision, ambiguity, or source review disqualifies the value.

The existing GKC alias normalization policy applies: trim, lowercase, collapse whitespace, normalize punctuation safely, preserve identity-bearing directional words, preserve ZIP formatting, retain original text, and include alias type/language/lifecycle in uniqueness.

Collision rules:

- Same normalized value on multiple objects requires ambiguity review.
- Same source value mapping to multiple object types stops automation.
- Legal and marketing variants are retained separately.
- Deprecated aliases remain for traceability but cannot silently become current display values.

---

## 12. Ambiguity And Stop Rules

Automatic mapping must stop when:

- One value matches multiple objects.
- One value matches multiple object types.
- Geographic definitions overlap without source priority.
- Authoritative sources conflict.
- Subdivision names repeat across municipalities.
- Postal and legal geographies differ.
- Historic and current identities conflict.
- Builder names are ambiguous.
- Market areas and municipalities are conflated.
- A location is editorial-only.

Required outcomes:

| Condition | Required outcome |
| --- | --- |
| Multiple plausible canonical objects | `MANUAL_REVIEW_REQUIRED` and conflict preservation. |
| Multiple plausible object types | Manual review; no automatic identity mapping. |
| Conflicting authoritative sources | Preserve competing records and defer activation. |
| Repeated subdivision name | Require municipality, county, recorded source, or MLS context. |
| Postal/legal mismatch | Preserve both as separate identity or relationship evidence. |
| Editorial-only place | `EDITORIAL_ASSOCIATION` or `DEFERRED_MAPPING`; no factual object creation. |
| Known incorrect candidate | `REJECTED_MAPPING` with rationale. |

---

## 13. Duplicate And Merge Governance

Duplicates must be classified before action:

- Exact duplicate.
- Alias variation.
- Historic identity.
- Source-specific representation.
- Overlapping distinct object.
- Conflicting identity.
- Editorial-only variation.

Merge prerequisites:

- Shared object type or approved cross-type supersession rationale.
- Source evidence for canonical winner.
- Alias retention plan.
- Relationship preservation plan.
- Observation lineage preservation.
- Redirect/canonical URL implication review before any public route activation.
- Reviewer approval.

Prohibitions:

- No name-only merge.
- No route-frequency merge.
- No runtime-dependency merge.
- No merge that discards historical aliases, source associations, relationships, or conflict evidence.

---

## 14. Evidence Requirements

Every mapping proposal should retain:

- Source asset.
- Source location.
- Source value.
- Source structure.
- Source system.
- Source class.
- Target.
- Mapping type.
- Mapping method.
- Confidence.
- Evidence summary.
- Reviewer.
- Effective date when applicable.
- Retrieved date when applicable.
- Verified date when applicable.
- Review date.
- Conflict status.
- Lifecycle.
- Activation eligibility.

Multiple independent sources are required when:

- The candidate becomes canonical from a non-authoritative source.
- A value affects public display, indexing, search, map, or property enrichment.
- The object is neighborhood, subdivision, market area, education, environmental, planning, HOA, legal, financing, investment, demographic, or risk-adjacent.
- A source conflict exists.
- A mapping is AI-assisted.

---

## 15. Mapping Decision Matrix

| Representative input | Auto map? | Review? | Canonical? | Alias? | Relationship? | Observation? | Editorial? | Deferred? | Rejected? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `lib/cities.ts` city slug | No production auto-map | Yes | Possible after source review | Yes | Possible parent/market relation | Market stats separately | Route copy remains editorial where applicable | No | No |
| `data/cities.ts` county value | No | Yes | No until government source | Possible | Possible future county relation | No | No | Yes if unsourced | No |
| `lib/neighborhoods.ts` lifestyle description | No | Editorial review | No | No | Editorial association only | No factual observation by default | Yes | No | No |
| `lib/neighborhoodPolygons.ts` rectangle | No | Yes | No | No | No | Possible geometry only after source replacement | No | Yes | Possible if false boundary |
| `Property.city` from MLS | No backfill | License/source review | Possible for relationship target after mapping | Source-specific alias possible | Future property relationship | No | No | Yes until authorized | No |
| `Property.subdivision` from MLS | No | Yes | Rarely without recorded source | Yes | Future property/subdivision relationship | No | No | Yes | No |
| Market statistic fixture | No | Yes | No | No | No | Possible after schema/source/effective period | No | Yes | Possible if unsupported |
| Internal-link related content | No | Editorial review | No | No | Possible editorial relationship | No | Yes | No | No |
| AI suggested duplicate | No | Mandatory | No | Possible after review | Possible after review | No | No | Yes until reviewed | Possible |

These are examples of decision classes only. They are not real mappings and do not create mapping records.

---

## 16. Activation Gates

| Gate | Prerequisites | Evidence | Approval authority | Validation | Rollback | Stop conditions |
| --- | --- | --- | --- | --- | --- | --- |
| Architecture approval | GIO/GKC/GKM complete | GMA record | Chief Enterprise Architect | Documentation review | Supersede doc | Scope drift |
| Synthetic fixture validation | Architecture approval | Local fixtures and safety checks | Executive authorization | Deterministic local command | Remove fixture package | Production data touched |
| Read-only mapping preview | GMA closure | Preview-only ledger design | Executive authorization | Diff/ledger review | Delete preview output | Any write path |
| Internal development mapping | Preview accepted | Non-production mapping plan | Executive authorization | Local dry-run only | Drop local artifacts | GIO row insertion |
| Internal development persistence | Persistence assessment | Isolated environment evidence | Executive authorization | Migration/data validation in non-production | Restore/drop non-prod | Production target |
| Production internal-only persistence | Recovery and migration gates | Backup, SQL, row counts | Executive approval | Production verification | Restore plan | Missing recovery gate |
| Property mapping | Source/license/property review | Assignment ledger | Executive approval | Sample audits | Revert relationship rows | Ambiguous assignment |
| Search integration | Internal data proven | Read adapter and relevance tests | Product/architecture approval | Smoke and regression tests | Feature flag off | Runtime degradation |
| Map integration | Geometry/source approval | Geometry precision and performance tests | Product/architecture approval | Browser/map validation | Disable layer | Boundary/license conflict |
| Public pages | Content/trust approval | Public eligibility and copy review | Product/architecture approval | SEO/public smoke | Noindex/disable page | Thin or unsafe content |
| Indexing | Public/search eligibility | Index schema and license review | Product/architecture approval | Index smoke | Rebuild from source | Restricted data exposure |
| Customer presentation | Trust and language approval | Copy, disclaimers, source labels | Executive/product approval | Browser/user-flow review | Hide module | Unsupported conclusion |
| External-source mapping | Source registry approval | License, access, health, cadence | Executive/legal/trust approval | Source health checks | Disable source | License/source block |
| AI-assisted proposals | AI boundary approved | Prompt/evidence/review protocol | Executive/trust approval | Human review audit | Disable AI proposals | AI attempting approval |

---

## 17. Human-Review Requirements

Human review is mandatory for:

- Canonical identity selection from non-authoritative sources.
- Any source conflict.
- Any cross-object-type ambiguity.
- Any neighborhood, subdivision, market-area, school, hazard, HOA, planning, zoning, title, insurance, valuation, financing, investment, demographic, or fair-housing-sensitive mapping.
- Any property relationship assignment.
- Any public-display, indexing, search, map, or customer-presentation eligibility.
- Any AI-assisted mapping proposal.
- Any merge, supersession, redirect, deprecation, or rejected mapping decision.

Reviewer evidence must include reviewer identity or role, date, rationale, evidence inspected, conflict status, and authorized activation scope.

---

## 18. AI-Assisted Mapping Boundaries

AI-assisted mapping remains deferred.

Future AI use may include:

- Proposal generation.
- Ambiguity identification.
- Evidence summarization.
- Duplicate-candidate discovery.

AI must not:

- Establish canonical identity independently.
- Resolve conflicting authoritative sources.
- Convert editorial knowledge into fact.
- Activate production mappings.
- Approve public eligibility.
- Assign properties to geographic objects.
- Override source, license, trust, or human-review gates.

AI proposals must remain `PROPOSED` or `MANUAL_REVIEW_REQUIRED` until independently reviewed.

---

## 19. Enum And Registry Gap Analysis

| Gap | Current evidence | Recommendation |
| --- | --- | --- |
| Mapping type registry absent | No Prisma or local registry for `IDENTITY_MAPPING`, `ALIAS_MAPPING`, etc. | Define fixture-only registry before preview. |
| Mapping method registry absent | Current `GeographicDerivationMethod` is narrower. | Add conceptual registry in preview docs before schema change. |
| Confidence vocabulary narrower | `GeographicConfidence` has `HIGH`, `MEDIUM`, `LOW`, `INSUFFICIENT`. | Map GMA `AUTHORITATIVE`, `EXACT`, `UNRESOLVED`, and `REJECTED` to existing fields until schema expansion is authorized. |
| Lifecycle vocabulary narrower | `GeographicLifecycleStatus` lacks `APPROVED`, `REVIEW_DUE`, `BLOCKED`, `MANUAL_REVIEW_REQUIRED`, `SUPERSEDED`, `RETIRED`, `REJECTED`. | Use review/freshness/status combinations now; assess enum expansion before persistence. |
| Source class vocabulary narrower in Prisma | Prisma source class has `INTERNAL`, `GOVERNMENT`, `MLS`, `MANUAL_RESEARCH`, `DERIVED`; GKC has broader classes. | Reconcile source class registry before source-backed persistence. |
| Observation schema registry not persisted | GKC fixture registry is local only. | Use local registry for preview; do not insert observations until registry strategy approved. |
| Editorial association target absent | Current GIO models do not separately store editorial associations. | Keep editorial associations in docs/preview ledgers until a separate content-governance model is approved. |
| Mapping ledger model absent | No model should be added in GMA. | Design read-only preview ledger first. |

---

## 20. Persistence Implications

GMA 1.0 does not authorize persistence.

Future persistence work must decide whether mapping decisions remain:

- External ledger artifacts.
- Non-production fixture data.
- A dedicated mapping proposal table.
- Directly reviewed GIO object/alias/relationship/observation records.
- A hybrid workflow where preview ledgers create approved migration inputs.

Before any production persistence, the program must reconfirm recovery capability, source/license posture, rollback strategy, validation queries, zero-unintended-row mutations, runtime isolation, and no customer activation.

No existing `Property` string field should be removed or overwritten. Future `PropertyGeographicRelationship` rows must coexist with current `city`, `state`, `zip`, `lat`, `lng`, `neighborhood`, `subdivision`, and `schoolDistrict` fields.

---

## 21. Risks And Unresolved Decisions

| Risk or decision | Status | Required handling |
| --- | --- | --- |
| Editorial content could be overpromoted into factual observations. | Controlled by principle | Keep editorial association separate and require classification/source/trust review. |
| Source class mismatch between GKC architecture and Prisma enums. | Watch | Reconcile before source-backed persistence. |
| Confidence terms do not exactly match current Prisma enum. | Watch | Use mapping table until schema expansion is authorized. |
| Lifecycle terms exceed current Prisma enum. | Watch | Use review/freshness/lifecycle combinations; assess later enum expansion. |
| Duplicate city and neighborhood registries. | Known | Use GKM conflict register before preview. |
| Neighborhood and subdivision boundaries are ambiguous. | High | Stop automation and require authoritative or reviewed evidence. |
| ZIP, city, MLS, market, and postal concepts can be conflated. | High | Treat as separate object or relationship types. |
| Licensed MLS/commercial data may not allow storage or display. | High | License review required before persistence or presentation. |
| Environmental, education, demographic, financing, investment, legal, title, and insurance domains are high-risk. | High | Keep restricted and deferred pending trust review. |
| AI could create plausible but unsupported mappings. | Controlled | AI remains proposal-only and deferred. |

---

## 22. Recommended Internal Mapping Plan

The next safe authorization should be a read-only preview plan, not persistence.

Recommended scope:

1. Define a local, non-persistent mapping ledger format.
2. Reuse GKM inventory categories as source assets.
3. Preview only first-scope object types: `MUNICIPALITY`, `NEIGHBORHOOD`, `MARKET_AREA`, `ZIP_CODE`, and `SUBDIVISION`.
4. Generate no GIO rows and no property assignments.
5. Produce candidate decisions as `PROPOSED`, `DEFERRED_MAPPING`, `EDITORIAL_ASSOCIATION`, or `MANUAL_REVIEW_REQUIRED`.
6. Include duplicate/collision reports.
7. Include source/license/trust blockers.
8. Keep all eligibility flags conceptually false.
9. Validate with documentation checks and local deterministic assertions only.

Recommended next status label:

- `GMA_1.0_READ_ONLY_MAPPING_PREVIEW_PLAN`

---

## 23. Explicit Deferrals

The following remain unauthorized:

- Internal mapping execution.
- Production persistence.
- GIO table population.
- GIO seed data.
- Current repository asset mapping.
- Property relationship assignment.
- Search integration.
- Map integration.
- Property page integration.
- Market page integration.
- Public pages.
- SEO/indexing changes.
- Runtime read adapters.
- Vendor integration.
- External-source ingestion.
- Scraping.
- AI-assisted mapping activation.
- School, education, environmental, demographic, financing, investment, legal, title, zoning, insurance, safety, valuation, and fair-housing-sensitive public presentation.

---

## 24. Executive Certification Recommendation

GMA 1.0 satisfies the authorized architectural-assessment scope.

Certification recommendation:

- `GMA_1.0_ARCHITECTURAL_ASSESSMENT_CERTIFIED_AND_CLOSED`

Recommended next authorization:

- `GMA_1.0_READ_ONLY_MAPPING_PREVIEW_PLAN`

Certification conditions:

- No internal mapping begins without a new authorization.
- No GIO persistence, production data mutation, property assignment, runtime integration, customer-facing activation, vendor integration, scraping, or AI mapping begins under this certification.
- External Google Docs are not considered updated unless changed directly by an authorized editor.

---

## External Google Docs Update Required

The external Google Doc `PROJECT ATLAS REIE V 7.1 - ADJUSTMENTS & MODIFICATIONS` was read through Google Drive but not modified by Codex.

Exact update required:

```text
PROJECT ATLAS Geographic Governance Update - July 25, 2026

Adopted governance principle:
EDITORIAL_SEPARATION_PRINCIPLE_ADOPTED

Editorial content, market commentary, lifestyle descriptions, local guidance, and community narratives shall never become governed geographic facts unless they receive explicit classification, source attribution, trust review, and activation approval.

Governance records:
- GKM 1.0 Existing Geographic Knowledge Inventory and Classification is certified and closed.
- GKM certification commit: 9ef0a46e2c64851cfcf6b62910b966bc013feff7.
- GMA 1.0 Geographic Mapping Architecture is the required prerequisite before internal geographic mapping.
- Internal geographic mapping remains unauthorized until a separate authorization is issued.

Prohibition:
Repository editorial knowledge must not be converted into factual geography, canonical GIO identity, property relationship, search behavior, map behavior, public-page fact, indexing signal, or customer-facing claim without classification, source attribution, trust review, and activation approval.
```

---

## Validation Summary

Validation performed:

- GIO/GKC/GKM consistency review.
- Repository geography review.
- Mapping ambiguity review.
- Editorial Separation Principle compliance review.
- Real Estate Data Tools alignment review.
- Google Drive read-only source review.
- Documentation/governance review.
- `git diff --check`.
- Git status and HEAD/origin verification.

Typecheck, lint, build, and runtime deployment were not required because no compiled or runtime files changed.
