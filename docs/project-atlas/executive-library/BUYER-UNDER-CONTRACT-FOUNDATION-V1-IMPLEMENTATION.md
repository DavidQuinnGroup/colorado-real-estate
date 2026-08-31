# Buyer Under Contract Foundation V1

## State

`BUYER_UNDER_CONTRACT_FOUNDATION_V1_IMPLEMENTED_PENDING_PRODUCTION_DEPLOYMENT_AND_SYNTHETIC_CERTIFICATION`

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

## Next controlled proof

Apply only migration `20260831100000_add_buyer_under_contract_foundation`, deploy the reviewed source, and create the explicitly authorized synthetic Buyer Under Contract fixture. No real transaction, client, professional, or document data may be used.
