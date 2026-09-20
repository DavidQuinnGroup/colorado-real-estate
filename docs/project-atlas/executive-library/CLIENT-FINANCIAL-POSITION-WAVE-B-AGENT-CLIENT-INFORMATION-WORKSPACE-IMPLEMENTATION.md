# Client Financial Position Wave B Agent Client Information Workspace Implementation

## Scope

`PROJECT_ATLAS_CLIENT_FINANCIAL_POSITION_FOUNDATION_V1` Wave B adds the authenticated Agent workflow for maintaining Client Case Financial Position facts in Client Information. It uses the certified Wave A foundation and the certified Client Case governed-source association boundary.

The primary editing surface is `Client Information -> Financial Position`. The Client Command Center has a read-only orientation summary without exact dollar amounts.

## Preserved Boundaries

- No Prisma schema change or migration.
- No Financial Position root is created by reads, the Command Center, or the synthetic fixture.
- First saves are atomic: root, stable entity, governed-source binding where selected, and initial observation are in one canonical transaction.
- Every server mutation delegates to `lib/clientFinancialPositionFoundation.ts`; React and route handlers do not write Financial Position Prisma models directly.
- The Agent API is owner-scoped, same-origin protected for mutations, private/no-store, and uses only the authenticated Human Agent subject.
- Existing `ClientCaseProperty` and active Client Case participants are the only property/participant selectors.
- Governed-source candidates are explicit, same-Case, and currently eligible. The Financial Position workflow never creates a governed-source association.
- No Scenario, Buyer, Seller, Investor, Financial Strategy, Readiness, Output, Transaction, Property, CRM, provider, MLS, Typesense, email, alert, or AI side effect is introduced.

## Workflow

The Agent can deliberately add or update typed Resources, Income, Debt & obligations, Lender qualifications, and Financial preferences. Dollar input is converted server-side to integer cents and percentages to basis points. Updates require the current observation identity and create a superseding observation; a stale predecessor returns a bounded conflict instead of overwriting newer information.

History is loaded on demand per domain entity. The current surface presents source posture, verification state, as-of date, review recommendation, and qualification expiration without treating these facts as affordability, readiness, or a recommendation.

## Certification Surface

- API: `/api/agent/client-financial-position`
- Agent primary surface: `/agent/clients/[clientCaseId]/information#financial-position`
- Command Center: read-only `Financial Position` section
- Protected static fixture: `/agent/design-system/visual-certification/client-financial-position`
- Static checker: `npm run check:client-financial-position-wave-b`

## Remaining Gate

This record describes local implementation only. It does not authorize a commit until Executive local visual approval, and it does not authorize Git push, deployment, Production certification, or creation of real Client Financial Position data.
