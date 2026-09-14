# Client Case Agent Readiness Workflow Foundation V1

## Scope

This local implementation adds an authenticated, owner-scoped Agent workflow for checking the existing canonical Client Case context against the admitted Capability Readiness registry. It is a read-only presentation and invocation layer over the certified Effective Context and Capability Readiness services.

The product route is `/agent/clients/[clientCaseId]/readiness`. It is discoverable from the existing Client Case detail surface. The synthetic visual fixture is `/agent/design-system/visual-certification/client-readiness`; it uses static synthetic content only and has no data access.

## Behavior

The Agent selects an owner-scoped Client Case, canonical baseline or an active Scenario's explicit current Version ID, and an admitted capability. Only Financial Strategy, Buyer Decision, and Market Intelligence are exposed from the existing admission registry. Financial Strategy accepts ephemeral `annualInterestRateBasisPoints`; Market Intelligence accepts ephemeral `marketScope`; Buyer Decision accepts no execution parameter.

The read-only API invokes `createClientCaseCapabilityReadinessService(prisma).evaluate` and returns the existing evaluator result plus requirement labels derived from the admitted contract. It never writes records, reimplements readiness or scenario precedence, or exposes raw canonical values. The UI clears results when a selection changes and accepts only the latest matching request response.

## Boundaries

No Prisma schema or migration change is included. No Client Case, context record, scenario, readiness record, output, analysis, PDF, delivery, CRM, MLS, email, or external-provider action is created or changed. This workflow does not offer analysis execution, scenario authoring, or client-facing access.

## Local Certification

Run:

```text
npm run check:client-case-agent-readiness-workflow
npm run check:client-case-agent-readiness-visual-structure
npm run check:client-case-capability-readiness-foundation
npm run check:client-case-effective-context-resolver
npm run check:client-case-scenario-foundation
npm run check:client-case-context-records-foundation
npx prisma validate
npx prisma generate
npm run typecheck
npm run lint
npm run build
git diff --check
```

The next gate after local certification is `READY_FOR_PUBLICATION_AUTHORIZATION`. Publication, deployment, direct visual inspection, and Executive approval remain separate authorizations.
