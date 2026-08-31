# Professional External Request Foundation V1: Implementation and Delivery Gate

## State

`PROFESSIONAL_EXTERNAL_REQUEST_FOUNDATION_V1_IMPLEMENTED_PENDING_CONTROLLED_SYNTHETIC_EMAIL_DELIVERY_AUTHORIZATION`

Workstream 3 implements only `PROPERTY_MANAGER_RENT_ESTIMATE_V1`. It preserves the certified `ProfessionalInputRequest`, `ProfessionalInputResponse`, `EvidenceCandidate`, `EvidenceAdmission`, and `ProfessionalInput` workflow. No generic professional request profile or other professional domain is activated.

## Implemented Boundary

- Additive production migration `20260831000000_add_professional_external_request_foundation` is applied. `npx prisma migrate status` reports the target schema is up to date.
- A delivery is owner-scoped and linked one-to-one to its Professional Input request. Material correction creates a successor request through `supersedesRequestId`; historic requests, responses, candidates, admissions, and inputs are not edited.
- The external capability is a cryptographically generated 256-bit secret stored only as a SHA-256 hash. It is purpose-bound, delivery-bound, expires after seven days, is revocable, and has one bootstrap use.
- Bootstrap exchanges the capability for a 30-minute, request-scoped `Secure`, `HttpOnly`, `SameSite=Strict` session and redirects to a token-free response URL. Sessions are server-revocable and cannot select another request by identifier.
- An immutable disclosure snapshot contains only the profile, property label/location, purpose, expiry, and `NOT_REQUIRED_BY_PROFILE` authorization posture. It excludes client financial, mortgage, Seller Financial, Buyer financial, CRM, internal-note, document, and other professional-response data.
- The responder form accepts only the bounded property-manager rent schema. It rejects unexpected fields, sensitive patterns, rich HTML, malformed ranges, and invalid dates. Responder name, organization, role, and business email are claims only. The emitted evidence remains `SOURCE_ROLE_CLAIMED`.
- External response creates the existing `ProfessionalInputResponse` and `EvidenceCandidate` with `PENDING_REVIEW`. It does not create an admission or `ProfessionalInput`; the Agent uses the existing evidence workflow to admit, reject, and materialize.
- Agent management is authenticated, owner-scoped, same-origin protected, and supports prepare, successor preparation, revoke, and immutable identity-verification events.
- The dedicated Resend sender uses a professional-request from-address, local/provider idempotency, and a separate signature-verified, namespaced lifecycle webhook. It does not reuse seller-lead reply or generic marketing semantics.
- External routes use private/no-store, no-referrer, CSP, frame denial, nosniff, and noindex/noarchive headers. They have no client portal, document, CRM, MLS, OutputVersion, PDF, or OutputRender path.

## Validation

Passed locally:

- `npm run check:professional-external-request-foundation`
- `npm run check:professional-external-request-resend-safety`
- `npm run check:professional-input-foundation`
- `npm run check:evidence-admission-foundation`
- `npm run check:evidence-professional-input-agent-workflow`
- `npx prisma validate`
- `npx prisma generate`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `git diff --check`

Lint retains five pre-existing unused-symbol warnings. Build retains the pre-existing dynamic-dependency warning from `lib/atlasPdfRenderer.ts`.

## No-Activation Confirmation

No external email, real professional contact, synthetic inbox contact, Professional Input response, Evidence Candidate, Evidence Admission, Professional Input, document, Secure Document, OPSWAT, CRM, MLS/provider, Client Portal, OutputVersion, PDF, or OutputRender record has been created or activated by this workstream implementation.

## Required Resume Gate

`PROFESSIONAL_EXTERNAL_REQUEST_CONTINUATION_REQUIRED: CONTROLLED_SYNTHETIC_EMAIL_DELIVERY_AUTHORIZATION`

The next runtime proof would send one purpose-bound Property Manager Rent Estimate request from the dedicated Resend sender to a controlled synthetic test inbox. It would contain only David Quinn Group/Agent identity, bounded property-only purpose, the secure request link, expiry/security guidance, and no rent result, client financial data, mortgage data, document, or other professional-response data. No real professional would be contacted.
