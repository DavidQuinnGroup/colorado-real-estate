# PROJECT ATLAS(tm)

## GIS 1.0 CGS Landslide Licensing Attribution Register

Status: `GIS_1_0_SPRINT_8_LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE_CERTIFIED`

Date: July 26, 2026

---

## Selected Subject

- Provider: Colorado Geological Survey
- Dataset/service family: `CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY`
- Dataset/service name: Colorado Landslide Inventory
- Pilot ID: `GIS-S7-CGS-LANDSLIDE-INVENTORY-PILOT-DESIGN`

## Official Evidence Hierarchy

| Level | Reference | Applicability | Finding |
| --- | --- | --- | --- |
| Dataset-specific | `GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION` | Direct | Identifies the exact map, citation, limitations, and no-download statement. |
| Portal-wide | `GIS-S8-SRC-CGS-GIS-PORTAL` | Direct | Identifies CGS GIS map context, REST service context, and general disclaimer. |
| Agency-wide | `GIS-S8-SRC-CGS-GEOLOGIC-MAPPING` | Conditional | Supports CGS disclaimer preservation. |
| State-wide | `GIS-S8-SRC-STATE-CIM-TERMS` | Conditional | Applies only if future source is supplied through the Colorado Information Marketplace or a state feed. |
| State repository | `GIS-S8-SRC-COSPL-COPYRIGHT` | Conditional | Supports research/private-study context and responsibility for use, but does not prove operational rights. |

## Rights Resolution

| Right | State |
| --- | --- |
| Public access | `PERMITTED_WITH_CONDITIONS` |
| Internal research | `PERMITTED_WITH_CONDITIONS` |
| Internal operational use | `REQUIRES_LEGAL_REVIEW` |
| Transient processing | `PERMITTED_WITH_CONDITIONS` |
| Raw data retention | `REQUIRES_LEGAL_REVIEW` |
| Normalized evidence retention | `REQUIRES_LEGAL_REVIEW` |
| Metadata retention | `PERMITTED_WITH_CONDITIONS` |
| Transformation | `REQUIRES_ATTRIBUTION` |
| Derivative use | `REQUIRES_LEGAL_REVIEW` |
| Commercial use | `REQUIRES_LEGAL_REVIEW` |
| Attribution | `REQUIRES_ATTRIBUTION` |
| Disclaimer | `REQUIRES_DISCLAIMER` |
| Modification notice | `REQUIRES_LEGAL_REVIEW` |
| Source link | `REQUIRES_ATTRIBUTION` |
| Logo/trademark | `NOT_ADDRESSED` |
| Redistribution | `PROHIBITED` |
| Customer display | `PROHIBITED` |
| Third-party components | `REQUIRES_LEGAL_REVIEW` |
| Legal review | `REQUIRES_LEGAL_REVIEW` |
| Provider confirmation | `REQUIRES_PROVIDER_CONFIRMATION` |

## Attribution Requirement

Future internal outputs, if separately authorized, must preserve the official CGS citation, source name, publication date, source URL, access date, and limitations. Exact mandatory wording beyond the official citation is unresolved and must not be invented.

## Disclaimer Requirement

Future outputs must preserve that the inventory is a compilation from existing maps, is incomplete for some sources, is not a site-specific investigation, does not imply stability where no landslide is mapped, and must not be presented as a guarantee of safety, insurance determination, legal determination, engineering conclusion, or property-specific professional opinion.

## Condition Matrix Summary

Public documentation review, future technical metadata inspection, future transient processing, audit metadata retention, internal derived output, and internal visualization may be considered in a later non-acquiring technical-feasibility design with attribution, disclaimer, legal-review, and provider-confirmation gates. Raw retention, normalized evidence retention, customer display, redistribution, and commercial use are not supported for future execution by Sprint 8.

## Retained Prohibitions

Provider contact, forms, accounts, registrations, credentials, terms acceptance, purchases, downloads, live service calls, provider acquisition, adapter execution, production reads, production writes, persistence, retrieval, runtime activation, customer-visible changes, redistribution, geographic relationships, hierarchy inference, Colorado runtime consumption, GOF Wave 5, and Sprint 9 remain `NOT_AUTHORIZED`.
