# Project Atlas: Agent Workspace Information Hierarchy and Financial Terminology V1

## Entry Foundation

- Workstream: `AGENT_WORKSPACE_INFORMATION_HIERARCHY_AND_FINANCIAL_TERMINOLOGY_V1`
- Entry foundation: `MULTI_PROPERTY_FINANCIAL_SCENARIO_FOUNDATION_V1`
- Entry foundation state: `PRODUCTION_CERTIFIED_AND_CLOSED`
- Entry closure commit: `991c67a0bc5dcf920e778c1492655ca84ec4f84a`

## Executive Findings Addressed

- `UX-001`: Financial Strategy lacked a strong, scannable hierarchy for its page, major sections, participant forms, and durable Scenario cards.
- `UX-002`: legacy Strategy Suite cards promoted machine identifiers and could overflow in a two-column layout.
- Agent-facing financial presentation exposed raw currency, basis points, and months, while the canonical model stores cents, basis points, and months.
- The Project Atlas navigation invariant checker expected the retired `agent-workspace-home-control` marker instead of the deployed `agent-workspace-home-link` marker.

## Implementation Strategy

The implementation uses a small Agent-scoped presentation module at `lib/agentWorkspacePresentation.ts`. It centralizes visual hierarchy tokens and pure display helpers without changing canonical schemas, financial formulas, persistence, Output semantics, or authorization behavior.

The hierarchy is expressed as:

1. Financial Strategy page title (`h1`)
2. Major surface sections (`h2`)
3. Scenario and Strategy Suite subsections (`h3`)
4. Scenario and strategy card titles (`h4` / `h3` within the legacy section)
5. Compact field labels and subdued supporting or technical text

The Client Case title, status, and contextual navigation remain owned by the existing shared Agent shell and are not repositioned.

## Financial Strategy Changes

- `/agent/strategy` now supplies the single `Financial Strategy` page heading.
- Multi-property scenarios use a major-section heading, then distinct `New scenario version` and `Owned scenario versions` subsections.
- Participants use durable headings such as `Participant 1 - Current home - Sell`, field groups, human-readable reference types, and visible units.
- New form entries accept rate percentages and loan terms in whole years, then map to the existing canonical basis-point and month inputs before the existing request boundary. No server-side calculation or storage model changed.
- Scenario display name is primary. Scenario key and input fingerprint remain visible as subordinate technical metadata.
- Scenario result labels now use:
  - `Liquidity after planned sale`
  - `Cash required before sale proceeds`
  - `Modeled monthly property cash flow after sale`
  - `Estimated net sale proceeds`
- Each metric has concise inline explanatory text. No bridge loan is implied.
- Output state is presented as `Output status: Agent review required` for the existing review state.

## Formatting Helpers

The Agent presentation module provides pure, `en-US` helpers for:

- cents to currency, including `$0`, negative values, optional `/mo`, and `Not recorded` for unknown values;
- basis points to a percentage (`650` to `6.50%`);
- months to an Agent-facing term (`360` to `30 years`);
- Scenario roles, reference types, Output review states, and structured machine identifiers.

Canonical rate storage remains basis points. Canonical term storage remains months. Canonical financial amounts remain cents.

## Legacy Strategy Suite

- The legacy suite is presented as a separate major section from Multi-property financial scenarios.
- Strategy profile labels are humanized and become the primary card title.
- The existing `alternativeKey` is retained as explicitly labeled `Technical ID` metadata.
- Card/grid containers use `min-w-0`, `break-words`, and an `xl` two-column breakpoint to prevent machine IDs from crossing cards. Full identifiers remain visible as wrapped, secondary text.

## Navigation Checker Repair

- `scripts/checkProjectAtlasNavigationInvariant.ts` now asserts the canonical `agent-workspace-home-link` marker.
- The existing Public Site and Sign out controls received stable, non-functional test IDs so the invariant still verifies their presence and ordering.
- `scripts/checkAgentPublicReturnNavigation.ts` now orders controls against the canonical home-link marker. No route, prefetch, sign-out, cookie, or authorization behavior changed.

## Test Coverage

`scripts/checkAgentWorkspaceInformationHierarchyAndFinancialTerminology.ts` verifies:

- centralized hierarchy levels;
- page/section structure and new Scenario-version discoverability;
- financial metric label mapping and absence of primary bridge terminology;
- currency, rate, and term formatting including zero, negative, and unknown values;
- role, reference, Output-state, strategy-profile, and machine-key fallback mappings;
- legacy title containment structure;
- canonical page and section heading placement.

The normal Multi-property, legacy Strategy Suite, navigation, Agent Workspace, Client Case, and Agent session-continuity regressions remain part of the validation set.

## Cross-Page Audit

| Surface | Result | Change |
| --- | --- | --- |
| Workspace Home | Existing hierarchy remains clear | None |
| Client Work and Client Case | Existing contextual identity remains above page content | None |
| Buyer, Seller, Intelligence, Transactions, Outputs, Client Authorization | Existing Agent typography tokens were already used or structurally clear | None |
| Financial Strategy | Hierarchy and terminology corrected | Implemented |
| Legacy Strategy Suite | Human titles and responsive containment corrected | Implemented |

## Boundaries Preserved

- Prisma schema changed: no.
- Migration created: no.
- Production business data mutation: none.
- Scenario, ScenarioVersion, ScenarioResult, Output, review, render, delivery, Client Authorization, CRM, MLS, Compass, email, SMS, and external actions: none.
- Multi-property financial calculation engine and result schema changed: no.
- Output review semantics changed: no.

## Human Certification

After deployment, Executive HQ should inspect the existing retained synthetic Client Case and Scenario. Do not create a Scenario, version, result, Output, or review during this visual certification.

1. Go to Agent Workspace, Client Work, `ATLAS Synthetic Client Case - Foundation V1`, then Financial Strategy.
2. Confirm the Case title, status, and contextual navigation remain above the `Financial Strategy` page title.
3. Confirm `Multi-property financial scenarios`, `New scenario version`, `Owned scenario versions`, and `Multi-Dimensional Strategy Suite` are immediately scannable.
4. Confirm participant headings are stronger than their fields, use human role/reference labels, and show units for currency, percent, and years.
5. Confirm the retained Scenario uses its display name as the primary title and keeps Scenario key/fingerprint secondary.
6. Confirm the four metric labels and retained values: `$159,000`, `$193,000`, `-$2,570/mo`, and `$352,000`.
7. Confirm `Output status: Agent review required` reads naturally.
8. Scroll to Multi-Dimensional Strategy Suite and confirm human strategy titles are primary, `Technical ID` is secondary, and no text crosses card boundaries.
9. Navigate through Workspace Home to global Financial Strategy. Confirm no stale Client Case context and no unexpected Agent Sign In.

The workstream remains `PRODUCTION_READY_PENDING_HUMAN_CERTIFICATION` until this visual check passes. `UX-001` and `UX-002` are `CLOSED_PENDING_HUMAN`. Final Liquid Glass or luxury design work remains out of scope. The following architectural gate is `TRANSACTION_CASE_HANDOFF_AND_WORKFLOW_V1`; it is not started by this workstream.
