# PROJECT ATLAS(tm)

## GIS 1.0 Sprint 8 Licensing and Attribution Resolution Gate

Status: `GIS_1_0_SPRINT_8_LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE_CERTIFIED`

Date: July 26, 2026

---

## Executive Purpose

GIS Sprint 8 resolves the licensing and attribution gate for the Sprint 7 Colorado Geological Survey Colorado Landslide Inventory pilot design. It determines whether official evidence is sufficient to permit consideration of a later, separately authorized technical-feasibility review. It does not authorize technical connection or pilot execution.

## Relationship To Sprints 1-7

Sprint 8 reuses Sprint 1-Sprint 6 governance and evidence patterns and the exact Sprint 7 pilot subject. It does not modify certified Sprint 1-Sprint 7 semantics, GOF, GIO, EIP, or EKCP behavior.

## Provider And Dataset Scope

- Provider: Colorado Geological Survey
- Dataset/service family: `CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY`
- Dataset/service name: Colorado Landslide Inventory
- Pilot ID: `GIS-S7-CGS-LANDSLIDE-INVENTORY-PILOT-DESIGN`

## Official Evidence

| Reference | Title | Publisher | Applicability | Finding |
| --- | --- | --- | --- | --- |
| `GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION` | ON-006-01M Colorado Landslide Inventory (Map) - v20220201 | Colorado Geological Survey | Direct dataset-specific page | Citation, limitations, map identity, and no-download statement. |
| `GIS-S8-SRC-CGS-GIS-PORTAL` | GIS Data and Web Map Portal | Colorado Geological Survey | Direct portal context | GIS map index, REST service context, and general disclaimer. |
| `GIS-S8-SRC-CGS-GEOLOGIC-MAPPING` | Geologic Mapping | Colorado Geological Survey | Supporting agency disclaimer | CGS data/information disclaimer. |
| `GIS-S8-SRC-STATE-CIM-TERMS` | Terms of Service Policy - State of Colorado | Colorado Information Marketplace | Conditional state data terms | Disclaimer and feed-use conditions only if applicable to a future state feed. |
| `GIS-S8-SRC-COSPL-COPYRIGHT` | Copyright | Colorado State Publications Digital Repository | Conditional state repository policy | Public research/private-study context and user responsibility. |

## Terms Applicability

Dataset-specific CGS publication terms and limitations are direct. CGS GIS portal terms and disclaimer are direct to the selected GIS-map context. CGS geologic-mapping disclaimer is supporting. State open-data and state repository terms are conditional and must not be silently applied unless future source routing proves applicability. Third-party component terms remain unresolved.

## Rights Resolution

- Public access: `PERMITTED_WITH_CONDITIONS`
- Internal research: `PERMITTED_WITH_CONDITIONS`
- Internal operational use: `REQUIRES_LEGAL_REVIEW`
- Transient processing: `PERMITTED_WITH_CONDITIONS`
- Raw retention: `REQUIRES_LEGAL_REVIEW`
- Normalized retention: `REQUIRES_LEGAL_REVIEW`
- Metadata retention: `PERMITTED_WITH_CONDITIONS`
- Transformation: `REQUIRES_ATTRIBUTION`
- Derivative use: `REQUIRES_LEGAL_REVIEW`
- Commercial use: `REQUIRES_LEGAL_REVIEW`
- Attribution: `REQUIRES_ATTRIBUTION`
- Disclaimer: `REQUIRES_DISCLAIMER`
- Modification notice: `REQUIRES_LEGAL_REVIEW`
- Redistribution: `PROHIBITED`
- Customer display: `PROHIBITED`
- Third-party rights: `REQUIRES_LEGAL_REVIEW`

## Attribution And Disclaimer

The official CGS citation, source URL, publication date, access date, and source identity must be preserved. Exact mandatory wording beyond the official citation is unresolved and must not be invented.

The CGS limitations must remain attached: the inventory is compiled from existing maps, is incomplete for some sources, lacks mapped landslides in an area do not imply stability, and it must not replace site-specific investigation or trained professional judgment.

## Condition Matrix

The condition matrix covers public documentation review, technical metadata inspection, transient payload processing, raw payload retention, normalized evidence retention, audit metadata retention, internal derived output, internal visualization, external customer display, redistribution, and commercial use. Every entry is disallowed for Sprint 8 execution and future execution. Only selected non-acquiring activities may be considered for a later technical-feasibility design.

## Scenarios

Scenarios A-N certify official terms identification, public access with unclear operational rights, transient internal processing conditions, raw retention fail-closed behavior, attribution required, disclaimer required, customer display prohibition, redistribution prohibition, third-party ambiguity, conflicting official terms preservation, provider confirmation requirement without contact, technical-feasibility eligibility, execution drift rejection, and zero external action.

## Certification

- Authorization: `GIS_1_0_SPRINT_8_LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE_AUTHORIZED`
- Classification: `LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE`
- Certification: `GIS_1_0_SPRINT_8_LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE_CERTIFIED`
- Strongest outcome: `LICENSING_GATE_RESOLVED_FOR_TECHNICAL_FEASIBILITY_REVIEW`

This outcome authorizes only consideration of a later technical-feasibility sprint. It does not authorize binding legal approval, provider approval, connection authorization, acquisition authorization, live-adapter authorization, persistence authorization, runtime authorization, redistribution authorization, or customer-display authorization.

## Validation Commands

- `npm run worker:build`
- `npm run check:geographic-intelligence-licensing-attribution-safety`
- `npm run certify:geographic-intelligence-licensing-attribution-resolution`
- `npm run check:geographic-intelligence-controlled-provider-pilot-safety`
- `npm run certify:geographic-intelligence-controlled-provider-pilot-design`
- `npm run check:geographic-intelligence-provider-due-diligence-safety`
- `npm run certify:geographic-intelligence-provider-due-diligence`
- `npm run check:geographic-intelligence-provider-evaluation-safety`
- `npm run certify:geographic-intelligence-provider-evaluation-governance`
- `npm run check:geographic-intelligence-fixture-provider-adapter-safety`
- `npm run certify:geographic-intelligence-fixture-provider-adapter`
- `npm run check:geographic-intelligence-provider-inventory-safety`
- `npm run certify:geographic-intelligence-provider-inventory-governance`
- `npm run check:geographic-intelligence-evidence-provenance-safety`
- `npm run certify:geographic-intelligence-evidence-provenance-foundation`
- `npm run check:geographic-intelligence-architecture-safety`
- `npm run certify:geographic-intelligence-architecture-foundation`
- `npm run check:geographic-intelligence-object-safety`
- `npm run check:eip-sprint-7-production-internal-geographic-read-adapter`
- `npm run check:ekcp-sprint-1-enterprise-geographic-consumer-adapter`
- `npm run check:ekcp-sprint-2r-colorado-enterprise-geographic-consumption-readiness`
- `npm run typecheck`
- `npm run lint`
- `npx prisma validate`
- `npm run build`
- `git diff --check`
- `git diff --cached --check`

## Next Decision Gate

Recommended next governed phase based on evidence: GIS Sprint 9 Provider Confirmation and Legal Review Gate. This recommendation does not authorize Sprint 9 and does not authorize provider contact unless separately approved.
