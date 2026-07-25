# PROJECT ATLAS(tm)

## Geographic Intelligence System(tm)

### Program Roadmap

Status: `ACTIVE_GOVERNANCE_ROADMAP`

Roadmap date: July 25, 2026

Program: `Geographic Intelligence System`

Architecture: `Geographic Intelligence Objects - GIO 1.0`

---

## Executive Summary

The Geographic Intelligence System establishes a governed, additive geography layer for David Quinn Group's Real Estate Intelligence Engine. Its purpose is to move from scattered string-based geography toward durable, source-aware, reviewable geographic intelligence without disrupting current property, search, map, MLS, Typesense, alert, CRM, or public-page behavior.

The program proceeds through explicit governance waves. Each wave must preserve production boundaries unless a later authorization expressly changes them.

Current program posture:

- GIO 1.0 Wave 1: certified and closed.
- GIO 1.0 Wave 2: chartered and implementation-ready.
- GIO 1.0 Wave 3: additive persistence foundation certified and closed.
- GIO 1.0 Wave 4: object governance verification certified and closed.
- GKC 1.0: recommended next architectural assessment only.

---

## Governing Principles

- `Property` remains the production runtime anchor until a later activation wave explicitly changes read behavior.
- GIO starts as dormant persistence and governance infrastructure, not customer-facing product behavior.
- Current data mapping, table population, backfill, runtime integration, source ingestion, and geographic conclusions require separate authorization.
- Lifecycle retirement, merge, supersession, aliasing, relationship confidence, source evidence, and eligibility must be governed before public use.
- Search, map, property page, MLS, Typesense, alert, CRM, email, and customer account behavior must remain isolated from GIO until an activation gate is approved.
- Education, safety, insurance, legal, environmental, valuation, affordability, investment, zoning, title, and similar high-risk conclusions remain outside GIO unless a separate trust review authorizes them.

---

## Roadmap Structure

| Phase | Name | Purpose | Current status | Activation posture |
| --- | --- | --- | --- | --- |
| Wave 1 | Repository Discovery and Alignment | Inventory existing geography representations and identify canonicalization needs. | `CERTIFIED_AND_CLOSED` | Documentation only |
| Wave 2 | Canonical Core Model Charter | Define the approved GIO persistence, relationship, source, observation, eligibility, and property-compatibility architecture. | `DOCUMENTATION_ONLY_IMPLEMENTATION_READY` | No runtime implementation |
| Wave 3 | Additive Persistence Foundation | Implement dormant Prisma schema, migration, helper contract, and static safety checks. | `CERTIFIED_AND_CLOSED` | Dormant persistence only |
| Wave 4 | Object Governance Verification | Verify implemented object governance, constraints, relationships, source posture, observations, eligibility, and runtime isolation. | `CERTIFIED_AND_CLOSED` | Verification only |
| GKC 1.0 | Geographic Knowledge Classification | Architect classification taxonomies, review rules, source trust levels, observation keys, and fixture-only validation. | `RECOMMENDED_NEXT_ASSESSMENT` | Architecture only |
| Future Wave | Fixture Governance Validation | Validate classification behavior against non-production fixtures without production writes. | `NOT_AUTHORIZED` | Fixture only |
| Future Wave | Current Data Mapping Report | Produce dry-run reports from existing city, neighborhood, ZIP, subdivision, and market data. | `NOT_AUTHORIZED` | Read-only report only |
| Future Wave | Controlled Object Population | Seed a bounded canonical object set after source and classification approval. | `NOT_AUTHORIZED` | Production mutation only after gate |
| Future Wave | Property Relationship Backfill | Create governed property-to-geography relationships in bounded batches. | `NOT_AUTHORIZED` | Production mutation only after gate |
| Future Wave | Read Adapter Preview | Build internal read-only preview adapters for governed review. | `NOT_AUTHORIZED` | Internal only |
| Future Wave | Customer Experience Activation | Integrate eligible GIO intelligence into search, maps, property pages, market pages, and public content. | `NOT_AUTHORIZED` | Customer-facing activation |

---

## Completed Evidence

| Artifact | Path | Status |
| --- | --- | --- |
| Wave 1 discovery and alignment | `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/GIO-1.0-REPOSITORY-DISCOVERY-ALIGNMENT.md` | Certified and closed |
| Wave 2 canonical core model charter | `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/GIO-1.0-WAVE-2-CANONICAL-CORE-MODEL-CHARTER.md` | Implementation-ready charter |
| Wave 3 additive persistence foundation | `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/GIO-1.0-WAVE-3-ADDITIVE-PERSISTENCE-FOUNDATION.md` | Certified and closed |
| Wave 3 production migration reconciliation | `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/GIO-1.0-WAVE-3-PRODUCTION-MIGRATION-RECONCILIATION.md` | Certified and closed |
| Wave 4 object governance verification | `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/GIO-1.0-WAVE-4-OBJECT-GOVERNANCE-VERIFICATION.md` | Certified and closed |

---

## Active Governance Gates

| Gate | Required before | Current determination |
| --- | --- | --- |
| Recovery gate | Any production mutation | Satisfied for Wave 3; must be reconfirmed before future mutation-producing waves |
| Runtime isolation gate | Any GIO or GKC implementation | Active; safety check must continue passing |
| Source trust gate | Material source-backed observations or object claims | Not authorized |
| Classification gate | Any object classification or knowledge layer | GKC 1.0 assessment recommended |
| Fixture gate | Any non-production object or relationship validation | Not authorized |
| Production population gate | Any GIO row insertion | Not authorized |
| Customer activation gate | Public GIO routes, search, maps, property pages, or content | Not authorized |

---

## Object Scope Roadmap

Authorized first persistence scope:

- `MUNICIPALITY`
- `NEIGHBORHOOD`
- `MARKET_AREA`
- `ZIP_CODE`
- `SUBDIVISION`

Deferred until separate trust review:

- School districts
- Schools
- Counties
- States
- Parcels
- HOAs
- Builders
- Environmental zones
- Safety, insurance, legal, zoning, title, valuation, affordability, investment, and school-quality conclusion objects

---

## GKC 1.0 Readiness

GKC 1.0 is recommended as an architectural assessment, not an implementation wave.

Required GKC 1.0 assessment outputs:

- Classification taxonomy for geographic object types.
- Relationship classification rules.
- Alias normalization policy.
- Source trust and evidence-class policy.
- Observation-key and schema-key registry.
- Review-status and lifecycle transition rules.
- Fixture-only validation plan.
- Explicit non-activation statement.

GKC 1.0 must not:

- Insert production GIO data.
- Migrate existing geography strings.
- Backfill property relationships.
- Activate public GIO pages.
- Change search, maps, property pages, MLS, Typesense, alert, CRM, email, or customer account behavior.

---

## Program Watch Items

| Watch item | Reason | Recommended handling |
| --- | --- | --- |
| Enum vocabulary breadth | Wave 3 intentionally used narrower governed enums than the full Wave 2 recommendation set. | Reassess during GKC 1.0 before classification. |
| Source provenance | Some source references are nullable for dormant flexibility. | Require source or governed first-party designation before material-fact activation. |
| Alias normalization | Helper normalization exists; database-level normalization is not automatic. | Define normalization policy and fixture tests before alias population. |
| Observation JSON schema keys | JSON observations require a schema key but no registry exists yet. | Create registry during GKC 1.0 assessment. |
| Slug route strategy | Current uniqueness is by object type and canonical slug. | Decide route and redirect posture before any public route activation. |
| Runtime isolation | Future imports can erode the dormant boundary. | Keep static safety checks mandatory until activation is authorized. |

---

## Next Recommended Authorization

Authorize only:

- `Geographic Knowledge Classification - GKC 1.0 Architectural Assessment`

Do not authorize without a separate directive:

- fixture data creation
- production table population
- geographic migration
- property relationship backfill
- runtime read adapters
- customer-facing GIO experiences
- vendor integrations
