# Evidence Admission and Professional Input Foundation V1 Certification

Status: `IMPLEMENTED_AND_VERIFIED`

## Scope

This certification records the controlled implementation of `EVIDENCE_ADMISSION_FOUNDATION_V1` and, after its gate passed, `PROFESSIONAL_INPUT_REQUEST_AND_VERIFICATION_FOUNDATION_V1`.

The implementation is additive and private Agent-only. It does not deploy code, create production evidence or professional-input data, send communications, call providers, activate MLS ingestion, modify Outputs/PDFs, implement document storage/OCR, modify the client portal, or perform a backfill.

## Pre-Flight

- `main` and `origin/main` were aligned at `afdbe2ddae363331ef1b34ae9dbb738cf9466050` before this package changed the repository.
- The worktree was clean and `git diff --check` passed.
- Supabase/PostgreSQL migrations are the established schema authority; Prisma is the generated client representation.
- No existing durable generic `EvidenceCandidate`, `EvidenceAdmission`, `ProfessionalInputRequest`, `ProfessionalInputResponse`, or `ProfessionalInput` model existed.
- Existing `OutputVersion` and its related persistence records are already append-only and remain unchanged.
- Existing Agent API authorization derives owner scope from the authenticated `HUMAN_AGENT` session; both new routes use the same mechanism and same-origin mutation protection.

## Evidence Admission Foundation

Migration `20260830190000_add_evidence_admission_foundation` is applied to the configured Supabase target. It adds:

- distinct `EvidenceCandidate`, `EvidenceAdmission`, and `EvidenceAdmissionAuditEvent` records;
- controlled source, claim, verification, policy, lifecycle, and audit vocabularies;
- owner-scoped identity/fingerprint indexes and candidate/admission/supersession relationships;
- append-only admission and audit triggers plus a one-way candidate transition trigger;
- `lib/evidenceAdmissionFoundation.ts` as the sole creation, review/admission, rejection, immutable retrieval, and current-eligibility service boundary;
- private `/api/agent/evidence` actions that derive the owner only from the authenticated Agent session.

The source-policy boundary permits automatic-policy admission only for `TRUSTED_INTERNAL_DETERMINISTIC`. Professional reported evidence requires the explicit professional-input policy; professional-document evidence is not admitted in this V1. Candidate payloads are bounded by claim kind, and sensitive financial/account fields are rejected before persistence.

Current eligibility considers owner scope, claim kind, effective time, expiration, explicit supersession, and conflicts. It returns an explicit conflict state rather than selecting by insertion time. Historical retrieval is an exact admission-ID operation and remains separate from current resolution.

## Professional Input Foundation

Only after the Evidence Admission gate passed, migration `20260830200000_add_professional_input_foundation` was applied to the same target. It adds:

- `ProfessionalInputRequest`, `ProfessionalInputResponse`, and immutable versioned `ProfessionalInput` records;
- explicit request lifecycle states;
- response-to-owner-scoped pending professional candidate linkage;
- admission-backed ProfessionalInput materialization with unique admission linkage and per-owner/claim version ordinals;
- append-only response and ProfessionalInput triggers;
- private `/api/agent/professional-inputs` actions that derive owner scope from the authenticated Agent session.

Requests do not become evidence. Responses require a governed pending `PROFESSIONAL_REPORTED` candidate, and reusable ProfessionalInput values require an admitted evidence record. Support-document requirement is represented only as a boolean seam. No storage, upload, document, portal, CRM, SMS, or email capability was introduced.

## Target Verification

`prisma migrate status` reports 22 migrations and an up-to-date target. A read-only target query confirmed:

- `EvidenceCandidate`: 0 rows
- `EvidenceAdmission`: 0 rows
- `EvidenceAdmissionAuditEvent`: 0 rows
- `ProfessionalInputRequest`: 0 rows
- `ProfessionalInputResponse`: 0 rows
- `ProfessionalInput`: 0 rows
- 6 expected immutability/transition triggers present

## Verification

Passed:

- `npx prisma validate`
- `npx prisma generate`
- `npx prisma migrate status`
- `npm run check:evidence-admission-foundation`
- `npm run check:professional-input-foundation`
- `npm run check:output-persistence-foundation`
- `npm run check:output-version-lineage-invalidation-foundation`
- `npm run typecheck`
- `npm run lint` with only five pre-existing warnings in unrelated modules
- `npm run build`; compilation/type validation completed with existing warnings, and `.next/BUILD_ID` plus both new route artifacts were present after completion
- `git diff --check`

The existing build warnings are the pre-existing dynamic dependency warning in `lib/atlasPdfRenderer.ts` and the unrelated unused-variable lint warnings. They are not Evidence Admission or Professional Input regressions.

## Gate Table

| Gate | Result |
| --- | --- |
| Evidence Admission Foundation | PASS |
| Schema | PASS |
| Owner Isolation | PASS |
| Fail-Closed Authorization | PASS |
| Candidate Lifecycle | PASS |
| Admission Immutability | PASS |
| Provenance | PASS |
| Idempotency | PASS |
| Conflict Handling | PASS |
| Supersession | PASS |
| Current Eligibility | PASS |
| Expiration | PASS |
| Historical Binding | PASS |
| Audit | PASS |
| Sensitive Data Guard | PASS |
| Professional Input Foundation | PASS |
| Typecheck | PASS |
| Lint | PASS_WITH_PRE_EXISTING_WARNINGS |
| Build | PASS_WITH_PRE_EXISTING_WARNINGS |
| Git Diff Check | PASS |

## Boundaries and Next Gates

No OutputVersion, OutputRender, PDF, client portal, CRM, provider, MLS, external professional provider, OpenAI, email/SMS, document storage, OCR, or backfill work is authorized by this certification.

Primary next gate: `READY_FOR_EVIDENCE_AND_PROFESSIONAL_INPUT_AGENT_WORKFLOW_RUNTIME_ACTIVATION_CERTIFICATION`.

Secondary next gate: `READY_FOR_SECURE_DOCUMENT_EXCHANGE_ADMISSION_REVIEW`.

EVIDENCE_ADMISSION_FOUNDATION_STATUS: IMPLEMENTED_AND_VERIFIED
EVIDENCE_ADMISSION_POSITION: SEPARATE_CANDIDATE_AND_IMMUTABLE_ADMISSION_REQUIRED
OWNER_SECURITY_POSITION: OWNER_SCOPED_FAIL_CLOSED
PROVENANCE_POSITION: IMMUTABLE_SOURCE_AND_ADMISSION_PROVENANCE_REQUIRED
IMMUTABILITY_POSITION: ADMITTED_SEMANTIC_FIELDS_IMMUTABLE
CURRENTNESS_POSITION: EFFECTIVE_EXPIRATION_SUPERSESSION_POLICY_REQUIRED
CONFLICT_POSITION: PRESERVE_HISTORY_NO_SILENT_OVERWRITE
AUTO_ADMISSION_POSITION: TRUSTED_INTERNAL_DETERMINISTIC_ONLY
PROFESSIONAL_INPUT_STATUS: IMPLEMENTED_AND_VERIFIED
PROFESSIONAL_INPUT_POSITION: GENERIC_IMMUTABLE_VERSIONED_TYPED_ENVELOPE
PROFESSIONAL_REQUEST_POSITION: REQUEST_DOES_NOT_EQUAL_ADMISSIBLE_EVIDENCE
PROFESSIONAL_RESPONSE_POSITION: RESPONSE_REQUIRES_GOVERNED_CANDIDATE_PATH
VERIFICATION_POSITION: EXPLICIT_SOURCE_ROLE_AND_VERIFICATION_STATUS_REQUIRED
DOCUMENT_POSITION: OPTIONAL_SUPPORT_DOCUMENT_SEAM_SECURE_DOCUMENT_LATER
CRM_POSITION: REMINDER_AND_OPERATIONAL_SEAM_ONLY
CLIENT_PORTAL_POSITION: NOT_REQUIRED_FOR_ADMISSION
OUTPUT_RENDER_DEPENDENCY: NONE_DIRECT
SECURITY_POSITION: OWNER_SCOPED_FAIL_CLOSED
SENSITIVE_DATA_POSITION: EXCLUDE_FROM_REUSABLE_INPUT_PAYLOADS
HISTORICAL_BINDING_POSITION: EXACT_VERSIONED_ADMISSION_AND_INPUT_DEPENDENCY_REQUIRED
NEXT_PRIMARY_GATE: READY_FOR_EVIDENCE_AND_PROFESSIONAL_INPUT_AGENT_WORKFLOW_RUNTIME_ACTIVATION_CERTIFICATION
NEXT_SECONDARY_GATE: READY_FOR_SECURE_DOCUMENT_EXCHANGE_ADMISSION_REVIEW
OVERALL_STATUS: READY_WITH_GAPS
