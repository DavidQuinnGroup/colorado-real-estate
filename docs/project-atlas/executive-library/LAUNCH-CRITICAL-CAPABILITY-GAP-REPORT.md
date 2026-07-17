# PROJECT ATLAS - Launch-Critical Capability Gap Report

Baseline: `ff590d4`  
Wave: Enterprise Capability Verification Program Wave 1 - Repository-to-Code Baseline  
Generated: 2026-07-17

## Executive Result

Wave 1 found no new launch blocker that supersedes the current launch checklist. The active blockers/gates remain operational, not newly discovered code absence.

Existing launch gates preserved:

1. 197 pending saved-search alert rows require dry-run/operator review before live processing.
2. `reie-alerts` has 273 waiting jobs in the latest launch handoff state.
3. One pending medium-priority `strategy_intake` CRM task remains in watch state.
4. One controlled internal tracked-email click is complete as of Wave 3B; recurring email/scheduler activation remains gated by alert review, queue/watch readiness, CRM review, hosted DNS/site URL correction, and preference-refresh schema alignment.

## Launch-Critical Gaps

| Gap | Severity | Capability | Status | Evidence |
| --- | --- | --- | --- | --- |
| GAP-001 | P0 | PROD-007 Notifications | Open | Saved-search live-readiness remains gated by 197 pending alert rows requiring operator review. |
| GAP-002 | P0 | OPS-005 Reliability | Open | Monitoring and reliability hardening must precede recurring live operations. |
| GAP-003 | P0 | OPS-003 MLS Operations | Open | MLS freshness and long-running sync reliability remain watch items. |
| GAP-004 | P1 | COMM-001 CRM | Open | One pending `strategy_intake` task requires review before cadence escalation. |
| GAP-005 | P1 | INTEL-001 Executive Intelligence | Open | Dedicated executive dashboard is not yet complete. |
| GAP-006 | P1 | INTEL-004 Business Intelligence | Open | Dedicated KPI engine remains incomplete. |
| GAP-007 | P2 | COMM-004 Partnerships | Open | No verified local implementation. |
| GAP-008 | P2 | COMM-005 Customer Success | Open | No verified dedicated implementation. |
| GAP-009 | P2 | EXEC-004 Enterprise Risk | Open | Risk is documented but not a dedicated workflow. |

## No-New-Blocker Statement

The audit did not identify a missing required REIE launch capability that should displace Phase 1 production readiness work. Search, property experience, notifications, infrastructure, data platform, MLS operations, reliability, CRM, and public website all have concrete local evidence. The launch gate remains proving and operating those capabilities safely.

## Intentionally Skipped

The following were intentionally not run:

- Live sync.
- Live workers.
- Live email sends.
- CRM mutations.
- OpenAI calls.
- MLS Grid requests.
- Typesense reset/reindex.
- Queue retries.
- Saved-search alert dry-runs.
- `npm run smoke:property-inquiry`.

## Structured Gap Data

The machine-readable gap report is `docs/project-atlas/executive-library/data/launch-critical-capability-gaps.json`.

## Wave 2 Evidence Closure

Baseline: `13e7905`
Verification date: 2026-07-17

| Gap | Wave 2 Result | Classification | Reason |
| --- | --- | --- | --- |
| GAP-001 | Reduced, still open | Conditional launch gate | Alert queue/worker/send/click/static controls exist; operator review and approved live-send policy remain required. |
| GAP-002 | Reduced, still open | Conditional launch gate | Queue dashboard, dead-letter, retry, readiness, and recovery controls exist; production monitoring evidence remains incomplete. |
| GAP-003 | Reduced, still open | Operational follow-up | MLS workers/status/retry/runbooks exist; freshness and long-running reliability need operational evidence. |
| GAP-004 | Reduced, still open | Controlled launch gate | CRM review workflow exists; one pending strategy_intake task requires human review before cadence escalation. |
| GAP-005 | Reduced, still open | Non-blocking post-launch item | Admin readiness surfaces exist; dedicated executive dashboard remains future work. |
| GAP-006 | Reduced, still open | Non-blocking post-launch item | Operational reporting exists; dedicated KPI engine remains future work. |
| GAP-007 | Unchanged, open | Non-blocking post-launch item | No partnership workflow implementation was found. |
| GAP-008 | Unchanged, open | Non-blocking post-launch item | No dedicated Customer Success implementation was found. |
| GAP-009 | Reduced, still open | Non-blocking post-launch item | Launch-risk documentation exists; dedicated enterprise risk workflow remains future work. |

No gaps were closed in Wave 2. No new launch blocker was introduced.

Current classifications:

- Alert queue: `EXPECTED_PRELAUNCH_BACKLOG`.
- CRM task: `CONTROLLED_LAUNCH_GATE`.
- Tracked-email click: `REQUIRED_CONTROLLED_PRELAUNCH_TEST`.

## Wave 3 Controlled Execution

Baseline: `e50106e`
Verification date: 2026-07-17

| Gap | Wave 3 Result | Classification | Reason |
| --- | --- | --- | --- |
| GAP-001 | Partially reduced, still open | Conditional launch gate | One controlled alert send passed, but tracked-click persistence failed and 196 pending alert rows still require operator review. |
| GAP-002 | Unchanged, open | Conditional launch gate | Queue counts stayed stable, but full readiness refresh and production monitoring proof remain incomplete. |
| GAP-004 | Unchanged, open | Controlled launch gate | CRM task closure was not executed after the tracked-click stop condition. |

No gaps were closed in Wave 3. The selected alert row `cmq0wovon012dpw1p6ebtyrj9` moved from `pending` to `sent`, one controlled email was sent, and no BullMQ queue job was consumed. The tracked-click gate remained open after Wave 3 because no click event persisted.

Updated launch gate state:

- Saved-search alert review: `WATCH` - 196 pending rows remain after the one controlled send.
- Alert queue backlog: `WATCH` - `reie-alerts` remains 273 waiting, 0 active, 0 delayed, 0 failed.
- Strategy intake CRM review: `WATCH` - one pending `strategy_intake` task remains.
- Controlled tracked-email click: `BLOCKED` - one tracked-click attempt failed before HTTP response and persisted no evidence.

## Wave 3B Tracked-Link Resolution

Baseline: `0f75d97`
Verification date: 2026-07-17

| Gap | Wave 3B Result | Classification | Reason |
| --- | --- | --- | --- |
| GAP-001 | Reduced, still open | Conditional launch gate | One controlled alert send and one controlled tracked click passed, but 196 pending alert rows still require operator review before broad live processing. |
| GAP-002 | Reduced, still open | Conditional launch gate | Queue counts stayed stable and alert readiness remained `watch`, but production monitoring and full readiness proof remain incomplete. |
| GAP-004 | Unchanged, open | Controlled launch gate | CRM task closure was not authorized in Wave 3B and one pending `strategy_intake` task remains. |

No capability gaps were closed in Wave 3B. The specific controlled tracked-email click gate moved from `BLOCKED` to `RESOLVED_WITH_FOLLOW_UP`.

Updated launch gate state:

- Saved-search alert review: `WATCH` - 196 pending rows remain after the one controlled send.
- Alert queue backlog: `WATCH` - `reie-alerts` remains 273 waiting, 0 active, 0 delayed, 0 failed.
- Strategy intake CRM review: `WATCH` - one pending `strategy_intake` task remains.
- Controlled tracked-email click: `RESOLVED_WITH_FOLLOW_UP` - one authorized local host-substituted click persisted exactly one listing-click signal, populated `clickedAt`, and increased heat score by 5.
- Hosted DNS/site URL configuration: `WATCH` - `davidquinngroup.com` returned no A record during validation.
- Preference-refresh schema alignment: `WATCH` - async `updateUserPreferences()` logged `UserPreference.createdAt` schema drift after tracking.
