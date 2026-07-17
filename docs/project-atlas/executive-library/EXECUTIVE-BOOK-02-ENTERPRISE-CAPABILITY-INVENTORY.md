# PROJECT ATLAS - Executive Book 02

## Enterprise Capability Inventory

Baseline: `ff590d4`  
Wave: Enterprise Capability Verification Program Wave 1 - Repository-to-Code Baseline  
Generated: 2026-07-17

## Inventory Model

This inventory follows the Google Docs Executive Library domain model and the Wave 1 work package taxonomy. It uses top-level enterprise capabilities only. More granular child capabilities can be added in later waves only when explicitly authorized.

Domain prefixes:

| Prefix | Domain |
| --- | --- |
| `PROD` | Product |
| `OPS` | Operations |
| `COMM` | Commercial |
| `INTEL` | Enterprise Intelligence |
| `GOV` | Governance |
| `AI` | AI |
| `EXEC` | Executive Management |

Each capability carries: ID, name, domain, business value, production criticality, verification status, maturity, evidence, and known gaps.

## Product Capabilities

| ID | Name | Business Value | Status |
| --- | --- | --- | --- |
| PROD-001 | Search & Discovery | Buyers can find relevant homes through search, filters, maps, and listing discovery. | `VERIFIED_PARTIAL` |
| PROD-002 | Property Experience | Listing detail pages and property inquiry turn inventory interest into action. | `VERIFIED_PARTIAL` |
| PROD-003 | Buyer Experience | Saved searches and preferences support repeat buyer engagement. | `VERIFIED_PARTIAL` |
| PROD-004 | Seller Experience | Valuation and seller lead flows capture seller intent. | `VERIFIED_PARTIAL` |
| PROD-005 | Market Content | Market, city, neighborhood, and article surfaces build authority. | `VERIFIED_PARTIAL` |
| PROD-006 | Customer Accounts | User, saved-search, preference, and unsubscribe records preserve customer state. | `VERIFIED_PARTIAL` |
| PROD-007 | Notifications | Alerts, digests, inquiry notifications, tracking, and unsubscribe support customer communication. | `VERIFIED_PARTIAL` |
| PROD-008 | Public Website | Public launch-facing pages expose REIE to customers. | `VERIFIED_PARTIAL` |

## Operations Capabilities

| ID | Name | Business Value | Status |
| --- | --- | --- | --- |
| OPS-001 | Platform Infrastructure | Keeps Next.js, Supabase, Redis, BullMQ, Typesense, and deployment foundations operable. | `VERIFIED_PARTIAL` |
| OPS-002 | Data Platform | Provides schema, migrations, preflight, and search-index data foundations. | `VERIFIED_PARTIAL` |
| OPS-003 | MLS Operations | Keeps listing inventory normalized, indexed, and observable. | `VERIFIED_PARTIAL` |
| OPS-004 | Security | Protects admin surfaces, operational controls, and communication preferences. | `VERIFIED_PARTIAL` |
| OPS-005 | Reliability | Gives launch state, queues, dead letters, and readiness checks operational visibility. | `VERIFIED_PARTIAL` |
| OPS-006 | DevOps | Supports repeatable local validation and controlled release work. | `VERIFIED_PARTIAL` |

## Commercial Capabilities

| ID | Name | Business Value | Status |
| --- | --- | --- | --- |
| COMM-001 | CRM | Converts behavior and inquiries into reviewable follow-up work. | `VERIFIED_PARTIAL` |
| COMM-002 | Marketing | Supports acquisition through content and email surfaces. | `VERIFIED_PARTIAL` |
| COMM-003 | Sales | Captures buyer/seller demand and routes it toward follow-up. | `VERIFIED_PARTIAL` |
| COMM-004 | Partnerships | Future channel and service expansion capability. | `NOT_YET_VERIFIED` |
| COMM-005 | Customer Success | Future lifecycle management after lead creation. | `NOT_YET_VERIFIED` |

## Enterprise Intelligence Capabilities

| ID | Name | Business Value | Status |
| --- | --- | --- | --- |
| INTEL-001 | Executive Intelligence | Gives leadership visibility into launch state and operational readiness. | `VERIFIED_PARTIAL` |
| INTEL-002 | Customer Intelligence | Turns behavior, preference, alert, and lead signals into learning. | `VERIFIED_PARTIAL` |
| INTEL-003 | Market Intelligence | Differentiates REIE through market analytics and forecasts. | `VERIFIED_PARTIAL` |
| INTEL-004 | Business Intelligence | Supports KPI and operating decisions. | `VERIFIED_PARTIAL` |
| INTEL-005 | AI Decision Support | Future AI-assisted decisions and recommendations. | `VERIFIED_DEFERRED` |

## Governance Capabilities

| ID | Name | Business Value | Status |
| --- | --- | --- | --- |
| GOV-001 | Enterprise Repository | Provides governed enterprise traceability and operating memory. | `VERIFIED_COMPLETE` |
| GOV-002 | Canon Governance | Preserves architecture/identity boundaries and prevents drift. | `VERIFIED_COMPLETE` |
| GOV-003 | Traceability | Links platform objects, capabilities, evidence, and relationships. | `VERIFIED_COMPLETE` |
| GOV-004 | Enterprise Governance | Supports reviewed stewardship, exception handling, and closure cycles. | `VERIFIED_PARTIAL` |
| GOV-005 | Knowledge Management | Keeps launch work restartable, auditable, and executive-readable. | `VERIFIED_PARTIAL` |

## AI Capabilities

| ID | Name | Business Value | Status |
| --- | --- | --- | --- |
| AI-001 | AI Brand Brain | Future brand-consistent automation. | `VERIFIED_DEFERRED` |
| AI-002 | AI Customer Intelligence | Future personalization and customer learning. | `VERIFIED_DEFERRED` |
| AI-003 | AI Market Intelligence | Future AI-enhanced market interpretation. | `VERIFIED_DEFERRED` |
| AI-004 | AI Platform Intelligence | Future AI-assisted platform operations insight. | `VERIFIED_DEFERRED` |

## Executive Management Capabilities

| ID | Name | Business Value | Status |
| --- | --- | --- | --- |
| EXEC-001 | Executive Portfolio | Improves leadership prioritization across enterprise work. | `VERIFIED_PARTIAL` |
| EXEC-002 | Capability Management | Creates the operating model for capability readiness. | `VERIFIED_COMPLETE` |
| EXEC-003 | Strategic Planning | Keeps launch and post-launch phases sequenced. | `VERIFIED_PARTIAL` |
| EXEC-004 | Enterprise Risk | Makes launch risk explicit and actionable. | `VERIFIED_PARTIAL` |
| EXEC-005 | Executive Operations | Keeps leadership execution disciplined through handoffs and readiness reporting. | `VERIFIED_PARTIAL` |

## Inventory Control

The canonical structured inventory is `docs/project-atlas/executive-library/data/enterprise-capabilities.json`. Later waves should update that file first, then refresh executive summaries from it.
