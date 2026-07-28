# PROJECT ATLAS(tm) - REIE 7.1 Adjustments and Modifications Requirements Register(tm)

Status: `REIE_7_1_ADJUSTMENTS_REQUIREMENTS_REGISTER_ESTABLISHED`

Date: July 28, 2026

Source document:

- Title: `PROJECT ATLAS REIE V 7.1 - ADJUSTMENTS & MODIFICATIONS`
- Google document ID: `1jfTLWoRNuuQ0DhJZSjTWx96n72VLZGPqO371FCjbkBs`
- Modified time reviewed: `2026-07-26T12:29:10.522Z`
- Source reconciliation status: `SOURCE_RECONCILED_GOOGLE_DOC_READ_ONLY`

## 1. Executive Summary

This register preserves every distinct requirement identified in the source document as a governed repository requirement.

The source document includes two classes of requirements:

- customer-experience adjustments from the Desktop Version and Mobile Version sections
- later geographic and enterprise-knowledge governance updates appended to the same document

No requirement is implemented by this register. No customer-facing feature, authentication change, authorization change, middleware change, database work, telemetry, AI, GIS activation, provider activation, deployment, or production mutation is authorized.

## 2. Governance Rules

No strategic completion review for a customer-experience or platform program may claim full completion without reconciling relevant open requirements in this register.

Every future implementation review shall identify whether it:

- fulfills an adjustment requirement
- partially fulfills an adjustment requirement
- supersedes an adjustment requirement
- has no relationship to adjustment requirements

A requirement may be marked `SUPERSEDED` only with documented rationale and executive approval.

## 3. Status Values

Allowed implementation status values:

- `IMPLEMENTED_CERTIFIED`
- `IMPLEMENTED_NOT_CERTIFIED`
- `PARTIALLY_IMPLEMENTED`
- `PLANNED`
- `DEFERRED`
- `SUPERSEDED`
- `REQUIRES_EXECUTIVE_DECISION`
- `NOT_FOUND_IN_REPOSITORY`

## 4. Requirements Register

| ID | Original Requirement | Normalized Requirement | Category | Owner | Repository Evidence | Status | Recommended Disposition |
|---|---|---|---|---|---|---|---|
| REIE-ADJ-001 | Remove all lines around text unless there is a specific reason. | Reduce decorative border usage across public pages. | Visual Design | CEP / design system | Public pages still use many bordered cards and sections. | `PARTIALLY_IMPLEMENTED` | Future CEP visual polish review. |
| REIE-ADJ-002 | Create separate pages for each aspect of the site. | Major capabilities should have distinct routes. | Site Architecture | CEP | `/`, `/search`, `/market`, `/sell`, `/grand-plan`, `/contact`, `/about`, `/brokerage-disclosures`; missing requested finance/Sundance routes. | `PARTIALLY_IMPLEMENTED` | Continue route-by-route under future authorization. |
| REIE-ADJ-003 | Home page should be Home Base and guide options/pathways. | Home should orient customers to major pathways. | Site Architecture | CEP | `app/page.tsx`; CEP Sprint 5 navigation continuity. | `IMPLEMENTED_CERTIFIED` | Maintain as implemented. |
| REIE-ADJ-004 | Home should not include the other pages. | Home should guide without duplicating full page experiences. | Site Architecture | CEP | `app/page.tsx` links to capabilities without embedding full pages. | `IMPLEMENTED_CERTIFIED` | Maintain as pathway-not-replication rule. |
| REIE-ADJ-005 | Clean up pages so they feel luxury. | Public pages should use restrained premium design. | Visual Design | CEP | CEP Sprints 1-5 improved presentation but no global source-specific certification. | `PARTIALLY_IMPLEMENTED` | Future design-system review. |
| REIE-ADJ-006 | Each page needs relaxing negative space. | Spacing should avoid crowded density. | Visual Design | CEP | Section shells use spacing; no global negative-space audit. | `PARTIALLY_IMPLEMENTED` | Future responsive visual QA. |
| REIE-ADJ-007 | Make it not busy and cluttered. | Reduce density and repeated visual complexity. | Visual Design | CEP | Customer journeys improved; global declutter not certified. | `PARTIALLY_IMPLEMENTED` | Keep open for visual polish. |
| REIE-ADJ-008 | Property search Map needs luxury colors with Electric Caribbean Blue. | Map style should align to Electric Caribbean Blue where provider/style control permits. | Search Map | CEP / future map styling | `components/maps/SearchMap.tsx` uses OpenTopoMap, optional Mapbox overlay, cyan UI accents. | `PARTIALLY_IMPLEMENTED` | Future Search/Map visual styling sprint. |
| REIE-ADJ-009 | User should have 3 different Map color options. | Provide three user-selectable map themes. | Search Map | CEP | No three-option map theme selector found. | `NOT_FOUND_IN_REPOSITORY` | Requires future map-theme authorization. |
| REIE-ADJ-010 | Map needs a clean way back to Home or other pages. | Search/map should provide clear navigation out. | Navigation | CEP | CEP Sprint 5 navigation continuity; search journey links. | `IMPLEMENTED_CERTIFIED` | Maintain with route additions. |
| REIE-ADJ-011 | All menu bars on every page should be the same. | Public navigation should be consistent across pages. | Navigation | CEP / EPARB | Global footer exists; headers are route-specific. | `PARTIALLY_IMPLEMENTED` | Future shared navigation-standard review. |
| REIE-ADJ-012 | Company name should be top left. | Company identity belongs in upper-left navigation area. | Navigation | CEP | Home and Sell show upper-left David Quinn Group; not globally proven. | `PARTIALLY_IMPLEMENTED` | Audit all major pages. |
| REIE-ADJ-013 | Logo/company identity should always lead home. | Brand identity should link to `/`. | Navigation | CEP | Home and Sell brand links point to `/`; not globally proven. | `PARTIALLY_IMPLEMENTED` | Audit all major pages. |
| REIE-ADJ-014 | Factor in AEO in addition to SEO. | Support answer-engine discoverability where accurate and source-safe. | SEO/AEO | CEP / future content intelligence | Schema components, sitemap, CEP roadmap and remaining-investment review. | `PARTIALLY_IMPLEMENTED` | Future SEO/AEO content authority sprint. |
| REIE-ADJ-015 | Where is the Mortgage Calculator? | Provide customer-facing mortgage calculator if authorized. | Buyer Financing | Future financing program | No `/mortgage` route found. | `NOT_FOUND_IN_REPOSITORY` | Future Buyer Financing Experience program. |
| REIE-ADJ-016 | Where is the recommended Lender page? | Provide recommended lender page if compliant and authorized. | Buyer Financing | Future financing program | No lender route found. | `NOT_FOUND_IN_REPOSITORY` | Future lender-governance authorization. |
| REIE-ADJ-017 | Where is the What is My Home Worth page? | Provide dedicated home-worth/valuation page. | Seller Experience | CEP / CAO | `/sell` includes `HomeValueEstimator`; `/api/valuation` exists; no dedicated page found. | `PARTIALLY_IMPLEMENTED` | Future dedicated seller valuation route if authorized. |
| REIE-ADJ-018 | Brokerage Firm disclosure needs removed from top of every page. | Remove or relocate global top disclosure if legally safe. | Public Trust | Public Trust / CEP | `app/layout.tsx` renders `BrokerageAttribution` globally. | `NOT_FOUND_IN_REPOSITORY` | Requires executive and brokerage/legal decision. |
| REIE-ADJ-019 | Simplify Brokerage Firm disclosure because it is too long. | Simplify disclosure while preserving required legal content. | Public Trust | Public Trust / CEP | `BrokerageAttribution` and `/brokerage-disclosures` separate summary/detail. | `PARTIALLY_IMPLEMENTED` | Future Public Trust disclosure review. |
| REIE-ADJ-020 | Where is the Sundance Film Festival page? | Provide Sundance Film Festival page if authorized. | Editorial Content | Future editorial program | No Sundance route found. | `NOT_FOUND_IN_REPOSITORY` | Future Local Editorial Experience program. |
| REIE-ADJ-021 | Sundance page should have its own URL. | Sundance content should be independently addressable. | Editorial Content | Future editorial program | No Sundance route found. | `NOT_FOUND_IN_REPOSITORY` | Pair with Sundance page authorization. |
| REIE-ADJ-022 | Several Sundance articles should be written once REIE produces articles. | Plan Sundance article strategy. | Editorial Content | Future editorial program | Article route exists; no Sundance article evidence found. | `PLANNED` | Future editorial calendar authorization. |
| REIE-ADJ-023 | Mobile version is crowded on left and right. | Improve mobile horizontal spacing. | Mobile Experience | CEP | Public pages use responsive padding; source-specific mobile spacing not globally certified. | `PARTIALLY_IMPLEMENTED` | Future mobile polish review. |
| REIE-ADJ-024 | Map color filters only appear when zoomed out. | Initial map styling/filter state should match design without zoom. | Search Map | CEP | SearchMap styling exists; exact initial filter behavior not certified. | `PARTIALLY_IMPLEMENTED` | Future map visual QA. |
| REIE-ADJ-025 | Water color is not close to Electric Caribbean Blue. | Map water styling should match brand where technically possible. | Search Map | CEP | Current tile sources do not expose governed water-color control. | `NOT_FOUND_IN_REPOSITORY` | Future map-style architecture authorization. |
| REIE-ADJ-026 | Editorial Separation Principle adopted. | Editorial content may not become governed geographic facts without classification, source attribution, trust review, and activation approval. | Geographic Governance | GKM/GMA/EIP/GIS | GKM/GMA/EIP records. | `IMPLEMENTED_CERTIFIED` | Retain as binding governance. |
| REIE-ADJ-027 | GKM 1.0 classified existing geographic knowledge without runtime activation. | Knowledge inventory remains separate from runtime/persistence/customer activation. | Geographic Governance | GKM 1.0 | `GKM-1.0-GEOGRAPHIC-KNOWLEDGE-MATRIX.md`. | `IMPLEMENTED_CERTIFIED` | Retain certified boundary. |
| REIE-ADJ-028 | GMA 1.0 is prerequisite for all internal geographic mapping. | Mapping requires canonical selection, evidence, confidence, lifecycle, ambiguity stops, human review, and activation gates. | Geographic Governance | GMA 1.0 | `GMA-1.0-GEOGRAPHIC-MAPPING-ARCHITECTURE.md`. | `IMPLEMENTED_CERTIFIED` | Retain certified prerequisite. |
| REIE-ADJ-029 | Editorial knowledge may not convert to factual geography through inference, runtime legacy, or AI proposal. | Geographic conversion requires explicit governed review and activation authorization. | Geographic Governance | GMA/GKC/EIP | GMA/EIP governance records. | `IMPLEMENTED_CERTIFIED` | Retain fail-closed rule. |
| REIE-ADJ-030 | Internal mapping, persistence, property assignment, search, map, public-page, indexing, customer presentation, external-source mapping, and AI activation remain unauthorized. | Geographic activation remains prohibited without separate authorization. | Geographic Governance | GIS/GMA/EIP/EKCP | GIS Sprint 8 and GMA/EIP/EKCP records. | `IMPLEMENTED_CERTIFIED` | Retain active prohibition. |
| REIE-ADJ-031 | Read-only mapping preview remains deterministic, non-authoritative, non-active; no final canonical selection. | Preview records cannot become final authority without approval. | Geographic Governance | GMA 1.0 | `lib/gma/readOnlyMappingPreviewFixtures.ts`. | `IMPLEMENTED_CERTIFIED` | Retain preview boundary. |
| REIE-ADJ-032 | Internal Mapping Review Queue generated from preview only; every item remains NOT_ELIGIBLE. | Queue remains review classification only. | Geographic Governance | GMA 1.0 | `lib/gma/internalMappingReviewQueue.ts`. | `IMPLEMENTED_CERTIFIED` | Retain queue boundary. |
| REIE-ADJ-033 | Internal Review Decision Fixture validates representative decisions but does not authorize activation. | Decision fixtures remain governance-only. | Geographic Governance | GMA 1.0 | `lib/gma/internalReviewDecisionFixture.ts`. | `IMPLEMENTED_CERTIFIED` | Retain fixture boundary. |
| REIE-ADJ-034 | Internal quality readiness is not activation authority. | READY quality cannot authorize persistence, search, maps, property relationships, public pages, indexing, customer presentation, AI, or runtime activation. | Enterprise Knowledge Governance | EIP 1.0 | `lib/eip/enterpriseKnowledgeQualityEngine.ts`. | `IMPLEMENTED_CERTIFIED` | Retain certified rule. |
| REIE-ADJ-035 | Activation Readiness Ledger separates quality, readiness, authorization, and activation. | Readiness accounting must not become authorization. | Enterprise Knowledge Governance | EIP 1.0 | EIP Sprint 4 records. | `IMPLEMENTED_CERTIFIED` | Retain certified rule. |
| REIE-ADJ-036 | Enterprise Knowledge Approval System replaces narrower Executive Review Packet and keeps approval separate from activation. | Approval request, decision, audit, and policy govern knowledge approval without activation. | Enterprise Knowledge Governance | EIP 1.0 | `lib/eip/enterpriseKnowledgeApprovalSystem.ts`. | `IMPLEMENTED_CERTIFIED` | Retain certified approval boundary. |
| REIE-ADJ-037 | Sprint 6 internal persistence pilot limited to Thornton and bounded rows. | Production-internal geographic persistence remains limited by pilot scope. | Geographic Governance | EIP/GIS | Sprint 6 closure records. | `IMPLEMENTED_CERTIFIED` | Retain certified pilot boundary. |
| REIE-ADJ-038 | No customer visibility or downstream activation occurred for Sprint 6. | Production-internal pilot remains non-customer-visible and non-integrated. | Geographic Governance | EIP/GIS/EKCP | Sprint 6 closure records. | `IMPLEMENTED_CERTIFIED` | Retain hard boundary. |
| REIE-ADJ-039 | Rollback remains available and separately authorized. | Rollback, retirement, deletion, second object, and customer activation require separate authorization. | Geographic Governance | EIP/GIS | Sprint 6 closure records. | `IMPLEMENTED_CERTIFIED` | Retain rollback boundary. |
| REIE-ADJ-040 | EKCP separates persistence, read retrieval, enterprise consumption, runtime activation, and customer visibility. | Enterprise consumption readiness must not activate runtime or customer visibility. | Enterprise Knowledge Governance | EKCP 1.0 | `lib/ekcp/enterpriseGeographicConsumerAdapter.ts`; EKCP records. | `IMPLEMENTED_CERTIFIED` | Retain layer-separation principle. |

## 5. Open Requirements

Open or partially reconciled customer-facing requirements include:

- global border/line reduction
- full separate-page completion
- luxury page polish
- negative space
- clutter reduction
- Electric Caribbean Blue map styling
- three map color options
- globally consistent menu bars
- universal top-left company identity and home link
- AEO completion
- Mortgage Calculator
- recommended lender page
- dedicated What is My Home Worth page
- top-of-page brokerage disclosure removal/simplification
- Sundance Film Festival page and article strategy
- mobile horizontal spacing
- initial map styling and water color behavior

## 6. Authorization Boundary

This register is governance only.

No unresolved requirement is authorized for implementation by this register.

No requirement may be marked complete, certified, or superseded without repository evidence and executive authorization where required.
