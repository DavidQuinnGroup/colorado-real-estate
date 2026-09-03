# PROJECT ATLAS - Canonical Client Case Context Foundation V1

## Scope

`CANONICAL_CLIENT_CASE_CONTEXT_FOUNDATION_V1` establishes the private, durable, Agent-owned advisory context root for Project Atlas. It answers which bounded client/advisory context related work belongs to without becoming a CRM, Transaction, financial scenario, Output, authorization, evidence, property master, document archive, workflow engine, or global session state.

## Selected Architecture

The canonical root is `ClientCase`, created because no compatible Case root existed in the repository. It uses `ownerAgentSubject`, `displayName`, `ACTIVE` / `ARCHIVED` lifecycle, `archivedAt`, `createdBySubject`, deterministic create idempotency, and timestamps. Hard delete is intentionally unsupported. Archive and reactivate operate only on Case lifecycle and never cascade into downstream records.

`ClientCaseParty` is bounded Case-owned orientation context, not a CRM Contact, TransactionParty, or ClientAuthorizationPrincipal. It supports `PRIMARY_CLIENT`, `ADDITIONAL_CLIENT`, and `OTHER_PARTY` labels only. `ClientCaseProperty` is a 0..N relationship to the existing `CanonicalPhysicalProperty` master with one row per Case/property and one Case-specific role: `CURRENT_HOME`, `NEW_PRIMARY`, `INVESTMENT_PROPERTY`, `SALE_PROPERTY`, or `OTHER`. The relationship does not copy physical-property facts or mutate the canonical property.

The only direct downstream seam introduced now is nullable `Transaction.clientCaseId`. It is owner-match validated by the Case service and remains null for all legacy Transactions; no historical Case is fabricated. Output and Professional Input Case relationships are deferred to their owning foundations. Existing financial roots remain standalone; `MULTI_PROPERTY_FINANCIAL_SCENARIO_FOUNDATION_V1` owns the future direct relationship. Client Case does not own Client Authorization or add any authorization flag.

## Access And Context

Every list, detail, create, update, archive, reactivate, property, party, and Transaction-association operation derives owner identity from the authenticated Agent session. Browser owner input is not accepted. Foreign Case lookup returns the repository-standard safe unavailable result; cross-owner Transaction association is denied. Case identity is explicit in `/agent/clients/[clientCaseId]` and `/api/agent/client-cases?id=...`; there is no `activeClientCaseId`, global Case store, or hidden cross-tab context.

The minimum Agent entry is `Client Work` at `/agent/clients`; Case detail is `/agent/clients/[clientCaseId]`. Both retain explicit Client Work and Workspace Home paths, and the existing Agent shell retains Public Site return. Case creation, viewing, refresh, navigation, archive, and reactivation do not create Transactions, scenarios, Outputs, Professional Inputs/requests, Client Authorizations, CRM work, delivery, or external action.

## Migration And Validation

Migration `20260905000000_add_canonical_client_case_context_foundation_v1` is additive: it creates three Case tables/enums and a nullable `Transaction.clientCaseId` FK. It contains no drop, truncate, data update, forced backfill, or fabricated historical Case action. It was applied to production after review and focused validation.

The focused Case checker covers schema/cardinality, owner-scoped server access, foreign denial, archive/reactivate, nullable Transaction compatibility, canonical-property reuse, route-local context, non-mutating GET posture, and no global Case state. Client Authorization, secure confirmation, Agent shell/navigation, and canonical property identity regressions passed. Prisma validation/generation, typecheck, cache-isolated lint, production build, and `git diff --check` passed. Existing unrelated lint warnings and the known dynamic PDF renderer dependency warning remain non-blocking.

## Human Certification And Current State

Implementation completion began with `SYNTHETIC_CASE_FIXTURE: NO` and `PRODUCTION_READY_PENDING_HUMAN_CERTIFICATION`; no production Case data was created automatically. On 2026-09-03, the Executive completed the authenticated production Agent certification using exactly one synthetic Case:

- `SYNTHETIC_CASE_ID: cmtlsgepy00003yqsh1n54ltc`
- `SYNTHETIC_CASE_DISPLAY_NAME: ATLAS Synthetic Client Case - Foundation V1`
- `SYNTHETIC_PRIMARY_PARTY: ATLAS Synthetic Client Party`
- `SYNTHETIC_PRIMARY_PARTY_ROLE: PRIMARY_CLIENT`

The Executive verified the Client Work landing, created the Case exactly once, verified its `ACTIVE` status and Case detail at `/agent/clients/cmtlsgepy00003yqsh1n54ltc`, and confirmed one party with zero properties and zero Transactions. A hard refresh preserved the same route-local Case identity and state without creating a duplicate. Archive changed the same Case to `ARCHIVED` without destroying its contextual state; reactivate returned that same Case to `ACTIVE`. The final Client Work list contained exactly one active synthetic Case.

Property attachment was not required because no existing synthetic canonical property was selected. No real client, property, or Transaction data was created or updated. No scenario, Output, Professional Input, Client Authorization, document, CRM, MLS, Compass, delivery, contact, or other downstream/external action occurred.

The synthetic Case is retained as a synthetic-only fixture for explicitly authorized future cross-foundation certification; that retention does not authorize future mutation. The foundation's current state is `PRODUCTION_CERTIFIED_AND_CLOSED`; `HUMAN_CERTIFICATION: PASS`, `HUMAN_RETEST_REQUIRED: NO`, and `FOUNDATION_BLOCKER: NONE`.

## Deferred Boundaries

Non-blocking deferrals: CRM/contact integration, team/RBAC, advanced search/activity timeline, multi-property financial scenarios, Output composition context, Professional Input context, Transaction handoff/workflow, Client Portal, document workflows, and Agent Workspace information architecture. This certification does not claim a luxury Case UI, broader Agent IA, Output Composition, Multi-Property Scenario, or Transaction handoff implementation.
