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
- GKC 1.0: architectural assessment certified and closed.
- GKC 1.0 fixture governance validation: certified and closed.
- GKM 1.0 existing geographic knowledge inventory and classification: certified and closed.
- GKM 1.0 internal development mapping plan: recommended next authorization only.

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
| GKC 1.0 | Geographic Knowledge Classification | Architect classification taxonomies, review rules, source trust levels, observation keys, and fixture-only validation. | `CERTIFIED_AND_CLOSED` | Architecture only |
| Future Wave | Fixture Governance Validation | Validate classification behavior against non-production fixtures without production writes. | `CERTIFIED_AND_CLOSED` | Synthetic local validation only |
| GKM 1.0 | Existing Geographic Knowledge Inventory and Classification | Inventory existing repository knowledge assets, classify them against GIO/GKC, map Data Tools source categories, and identify persistence candidates without activation. | `CERTIFIED_AND_CLOSED` | Read-only documentation and source classification |
| Future Wave | Internal Development Mapping Plan | Produce deterministic non-production mapping, alias, source, conflict, and dry-run ledger plans before any persistence authorization. | `RECOMMENDED_NEXT_ASSESSMENT` | No production persistence |
| Future Wave | Internal Development Persistence Assessment | Assess whether fixture-governance contracts are sufficient for isolated non-production persistence. | `DEFERRED_BY_GKM` | No production persistence |
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
| GKC 1.0 geographic knowledge classification architecture | `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/GKC-1.0-GEOGRAPHIC-KNOWLEDGE-CLASSIFICATION-ARCHITECTURE.md` | Certified and closed |
| GKC 1.0 fixture governance validation | `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/GKC-1.0-FIXTURE-GOVERNANCE-VALIDATION.md` | Certified and closed |
| GKM 1.0 existing geographic knowledge inventory and classification | `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/GKM-1.0-GEOGRAPHIC-KNOWLEDGE-MATRIX.md` | Certified and closed |

---

## Active Governance Gates

| Gate | Required before | Current determination |
| --- | --- | --- |
| Recovery gate | Any production mutation | Satisfied for Wave 3; must be reconfirmed before future mutation-producing waves |
| Runtime isolation gate | Any GIO or GKC implementation | Active; safety check must continue passing |
| Source trust gate | Material source-backed observations or object claims | Not authorized |
| Classification gate | Any object classification or knowledge layer | GKC 1.0 architecture certified; implementation not authorized |
| Fixture gate | Any non-production object or relationship validation | Synthetic local fixture validation certified; persistence not authorized |
| Existing knowledge matrix gate | Any current-data mapping, source-ledger creation, or persistence planning | GKM 1.0 certified as read-only inventory; persistence still not authorized |
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

## GKC 1.0 Status

GKC 1.0 architectural assessment is certified and closed. It is a governance standard, not an implementation wave.

Certified GKC 1.0 assessment outputs:

- Classification taxonomy for geographic object types.
- Relationship classification rules.
- Alias normalization policy.
- Source trust and evidence-class policy.
- Observation-key and schema-key registry.
- Review-status and lifecycle transition rules.
- Fixture-only validation plan.
- Explicit non-activation statement.

GKC 1.0 closure does not authorize:

- Insert production GIO data.
- Migrate existing geography strings.
- Backfill property relationships.
- Activate public GIO pages.
- Change search, maps, property pages, MLS, Typesense, alert, CRM, email, or customer account behavior.

GKC 1.0 fixture governance validation is also certified and closed. It implemented pure local validation contracts and `npm run check:gkc-fixture-governance` without production persistence, runtime integration, current-data mapping, or customer-facing activation.

---

## GKM 1.0 Status

GKM 1.0 existing geographic knowledge inventory and classification is certified and closed. It is a read-only matrix and source-classification record, not an implementation or activation wave.

Certified GKM 1.0 outputs:

- Existing geographic knowledge inventory across repository data, routes, models, maps, search, SEO, internal links, GIO/GKC modules, and source documents.
- GIO object-to-domain matrix.
- Repository asset classification matrix.
- GKC classification matrix.
- Source trust and freshness matrix.
- Real Estate Data Tools source matrix based on the accessible authoritative Google Doc.
- Duplicate and conflict register.
- Editorial-versus-factual separation.
- Persistence-candidate, restricted-knowledge, deferred-knowledge, and activation-readiness registers.
- Recommended minimum internal-development mapping scope.

GKM 1.0 closure does not authorize:

- GIO row insertion.
- Existing data mapping or production persistence.
- Property relationship backfill.
- Search, map, property page, market page, sitemap, SEO, Typesense, MLS, alert, CRM, email, or customer-facing activation.
- Vendor integration or external data ingestion.

---

## Program Watch Items

| Watch item | Reason | Recommended handling |
| --- | --- | --- |
| Enum vocabulary breadth | Wave 3 intentionally used narrower governed enums than the full Wave 2 recommendation set. | Reassess during GKC 1.0 before classification. |
| Source provenance | Some source references are nullable for dormant flexibility. | Fixture validation now proves source requirements locally; future persistence must enforce them before writes. |
| Alias normalization | Helper normalization exists; database-level normalization is not automatic. | Fixture validation now proves deterministic normalization; future persistence must keep collision review. |
| Observation JSON schema keys | JSON observations require a schema key but no persisted registry exists yet. | Fixture validation now proves a local registry; future persistence must decide registry storage without activating production data. |
| Slug route strategy | Current uniqueness is by object type and canonical slug. | Decide route and redirect posture before any public route activation. |
| Runtime isolation | Future imports can erode the dormant boundary. | Keep static safety checks mandatory until activation is authorized. |
| Existing knowledge duplication | City, neighborhood, market, polygon, and link data exist in parallel structures. | Use GKM 1.0 conflict register before any mapping or persistence. |
| External source governance | Authoritative Google Docs are accessible but external to repository version control. | Record exact required external updates; do not claim external updates unless performed. |

---

## Next Recommended Authorization

Authorize only:

- `GKM_1.0_INTERNAL_DEVELOPMENT_MAPPING_PLAN`

Do not authorize without a separate directive:

- production table population
- production fixture creation
- geographic migration
- property relationship backfill
- runtime read adapters
- customer-facing GIO experiences
- vendor integrations
