# Buyer Under Contract Foundation V1

## State

`BUYER_UNDER_CONTRACT_FOUNDATION_V1: PRODUCTION_CERTIFIED_WITH_EXPLICIT_LIMITATIONS`

## Bounded implementation

- Owner-scoped Buyer `Transaction` records require a `CanonicalPhysicalProperty`; no listing-shaped `Property` is used as transactional truth.
- Manual, dated deadlines preserve correction history through successor records. Timeline and decision records are append-only; deadline facts cannot be overwritten.
- Issues preserve factual summaries, provenance references, attention state, and explicit review state without legal conclusions.
- The server accepts only the named low-risk decision profiles. It rejects termination notices, amendments, waivers, legal interpretation, binding directions, and any unlisted profile.
- Professional responses, candidates, admissions, and reviewed outputs may be linked only after owner checks. This foundation never creates an EvidenceAdmission or ProfessionalInput automatically.
- `BUYER_UNDER_CONTRACT_DECISION_BRIEF_V1` is persisted through the shared immutable OutputVersion foundation with an Agent review record, evidence snapshot, dependency records, fingerprint, and immutable timestamp.
- `DQG_TRANSACTION_ARCHIVE_POLICY_V1` names David Quinn Group as archive owner, all transaction documents as coverage, indefinite retention, and an additive relationship to the brokerage file. Secure Document infrastructure is required but inactive; destructive deletion is not authorized.

## Explicitly inactive

No contract/document upload, document byte storage, secure document activation, email, CRM, MLS, Client Portal, Business Tracker, legal analysis, notice/amendment/waiver execution, automatic deadline calculation, automatic evidence admission, or automatic ProfessionalInput materialization is enabled.

## Local validation

- `npm run check:buyer-under-contract-foundation`
- `npm run check:output-persistence-foundation`
- `npm run check:professional-input-foundation`
- `npm run check:evidence-admission-foundation`
- `npm run check:evidence-professional-input-agent-workflow`
- `npx prisma validate`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `git diff --check`

Lint retains pre-existing unused-symbol warnings in unrelated modules. Build retains the pre-existing dynamic-dependency warning from `lib/atlasPdfRenderer.ts`.

## Production certification

- Migration `20260831100000_add_buyer_under_contract_foundation` is applied. `npx prisma migrate status` reports the production schema is up to date.
- Vercel Git integration completed the production deployment for `a43c8999` at [deployment evidence](https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/GPJWzYmHCfLNhPdeWXCCQKaXMqp8).
- One controlled synthetic `Transaction` was created: `cmtht66dw00026ad38pzl949i`, using synthetic canonical property `cmtht65gm00006ad3kdmo4eik`. It is Buyer / Under Contract and carries only synthetic certification context.
- Deadline V1 `cmtht677l00066ad3t0osxhef` is Agent-verified and preserved as superseded. Deadline V2 `cmtht6a3i000n6ad3771m3a3m` is its Agent-verified successor and is current.
- Issue `cmtht6bim000t6ad33ee06es4` links the existing controlled `ProfessionalInputResponse` and `PENDING_REVIEW` EvidenceCandidate only. No EvidenceAdmission or ProfessionalInput was created.
- Low-risk decision `cmtht6dfx000z6ad31v85mrjb` was recorded. `NOTICE_TO_TERMINATE` was rejected at the service boundary without a decision row.
- Reviewed immutable Brief A `cmtht6925000e6ad3pzpmcg9i` and Brief B `cmtht6fj700156ad3qj2nar90` were persisted through shared OutputVersion infrastructure. Duplicate Brief B persistence returned the same version with `created: false`.
- OutputVersion mutation and TransactionTimelineEvent mutation were rejected by append-only/immutable persistence controls. A wrong-owner read was denied. An unauthenticated production POST returned `401` before a write.
- Authenticated production Agent workspace inspection passed. Overview, Timeline, Deadlines, Issues, Professional Input, Decisions, and Outputs render the fixture and visibly state that documents are inactive.

## Repair preserved in history

Commit `a43c8999` repaired the successor-deadline path so an Agent-verified successor records `verifiedBySubject`, `verifiedAt`, and its verification timeline event. The repair was built, deployed, and included in the production proof before any fixture was created.

## Deferred capabilities

- `SECURE_DOCUMENT_STORAGE_AND_SCANNER_CONFIGURATION_V1`
- `DQG_SECURE_TRANSACTION_DOCUMENT_ARCHIVE_V1`
- contract form semantics and automated deadline extraction
- high-assurance client authorization and all high-consequence election workflows
- Business Tracker integration, Client Portal delivery, OCR/document ingestion, e-signature, wire/funds workflow, and advanced financial-impact analysis

The DQG archive policy is certified. DQG secure document archive runtime is not active.
