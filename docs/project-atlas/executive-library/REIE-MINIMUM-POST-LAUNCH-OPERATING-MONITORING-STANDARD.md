# PROJECT ATLAS(TM) REIE Minimum Post-Launch Operating Monitoring Standard

Status: `REIE_MINIMUM_POST_LAUNCH_OPERATING_MONITORING_ADOPTED`

Classification: `EXISTING_MONITORING_SUFFICIENT_WITH_RUNBOOK`

Scope: documentation and governance only

## 1. Decision

REIE will use its certified existing signals, explicit human ownership, and Executive HQ rollback authority. A new monitoring platform, telemetry, dashboard, customer tracking, or operational data expansion is not justified.

This standard adopts and operationalizes the signal set, role model, stop conditions, and rollback posture in `REIE-HARD-LAUNCH-EXECUTION-CERTIFICATION.md` and `REIE-HARD-LAUNCH-EXECUTION-RECORD.md`; it does not duplicate or replace their certification evidence.

## 2. Minimum Operating Standard

| Signal or check | Cadence and responsible role | Escalation threshold | Rollback consideration | Boundary |
| --- | --- | --- | --- | --- |
| Vercel/GitHub terminal deployment status and public-domain availability | Daily during the initial operating period and after separately authorized releases; monitoring role | Failed deployment, unavailable production domain, or certified-state mismatch | Executive HQ decides whether rollback is warranted | Existing external platform signal only; no configuration change |
| Public-experience smoke and representative homepage, Search, Contact/Advisory, Property, city-market, and neighborhood routes | Daily initially; after separately authorized releases; monitoring role | Material route failure, Search failure, unavailable Contact/Advisory or Property Inquiry UI, or material customer-visible regression | Escalate P0/P1 issue to Executive HQ; rollback only under Executive authority | Read-only route checks; no form submission |
| Search, map-rendering, Property-route, public-runtime, public-trust, and launch-readiness checks | Scheduled/manual non-mutating execution only when authorized; monitoring role | Any failed safety/readiness result or trust/privacy/consent regression | Executive HQ evaluates rollback and incident scope | Existing checks only; no runtime change |
| Strict notification readiness, alert readiness, and unsubscribe safety | Agreed read-only cadence; monitoring role | Not-ready result, failed/processing alerts, or unsubscribe regression | Escalate before any operational action | No sends, dry-run processing, retries, worker execution, or row mutation |
| CRM pending-task review | Agreed read-only cadence; authorized response role | Launch-critical pending task or material intake/response failure | Executive escalation; no automatic remediation | No CRM creation, update, workflow, or data expansion |
| Credible customer/support report | As received; response/support role | P0/P1 availability, privacy, trust, consent, or public-path issue | Executive HQ owns rollback decision | Handle only through separately authorized customer-response processes |

## 3. Explicit Prohibitions

This standard does not authorize customer tracking, telemetry, dashboards, raw form-content review, browsing-history review, identity profiling, customer-data expansion, live queue processing, workers, email sends, CRM mutation, provider activation, database access expansion, or new monitoring infrastructure.

## 4. Escalation and Authority

Observe: normal successful checks and non-material visual observations.

Investigate: a single reproducible route, Search, route-safety, or readiness anomaly that does not establish a P0/P1 issue.

Executive HQ escalation: material availability, Search, Property Inquiry, Contact/Advisory, privacy, consent, public-trust, certified-state, or P0/P1 regression.

Rollback consideration: only after Executive HQ determines that a material production issue merits it. Executive HQ retains rollback authority; bounded technical execution requires separately authorized production operation.

## 5. Resulting State

Post-launch operating monitoring is adopted as a minimum runbook, without runtime implementation. New product, provider, telemetry, and protected-system work remains separately gated.
