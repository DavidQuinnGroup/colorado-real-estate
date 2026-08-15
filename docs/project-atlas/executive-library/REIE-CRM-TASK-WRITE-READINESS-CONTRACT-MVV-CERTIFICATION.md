# REIE CRM Task Write Readiness Contract MVV Certification

## Scope

This additive MVV is a pure readiness/evidence evaluator. It accepts a successful canonical persistence mapping and supplied bounded evidence, then returns a finite readiness result or a non-executable one-task CRM write plan. It does not query, create, update, delete, schedule, communicate, deploy, or implement an execution adapter.

## Canonical authority

The contract accepts only the LEAD_RESOLUTION_REQUIRED persistence-mapping variant with CRMTask target, non-executable envelope, NOT_ATTEMPTED persistence, NOT_AUTHORIZED communication, REQUIRED_BEFORE_WRITE lead resolution, IDEMPOTENCY_NOT_YET_PROVEN posture, unresolved leadId, and omitted sellerLeadId.

Task Intent Governance, Dry-Run Mapping, and Persistence Mapping remain authoritative. This contract does not rederive intent category, status, priority, title, metadata, rights, lifecycle, communication prohibition, dedupe key, or audit fingerprint.

## Evidence and boundaries

Lead resolution evidence is limited to stable internal ID to User primary-key resolution, exact-one match, no PII selected, bounded query-scope fingerprint, and deterministic evidence fingerprint. Dedupe evidence is limited to the canonical dedupe/audit fingerprints, resolved lead ID, controlled read scope, no-match outcome, zero count, bounded status summary, timestamp, and fingerprint.

The final create payload is structurally equivalent to the canonical envelope plus resolved leadId. It contains no seller lead, arbitrary metadata, PII, or communication payload.

One-write/no-retry bound, communication-isolation certification, transaction posture, post-write verification plan, retained-pending human-review disposition, race-risk acknowledgement, blocked aggregate-audit posture, and second-write prohibition are required. The plan always retains EXECUTIVE_WRITE_AUTHORIZATION_REQUIRED and cannot grant authorization.

## Safety

The runtime contract imports only a type from the pure persistence mapping. It has no runtime dependency on Prisma/database, User/lead access, existing task helpers, routes, email/SMS/notification, queue/worker, Search/Typesense, providers/network, filesystem, or deployment.

No write is authorized or executed. A later real proof requires separate Executive approval, dedicated adapter review, safe bounded database access, execution-path certification, one-use authorization, explicit race acknowledgement, and post-write evidence.

## Local validation

The checker validates canonical input authority, exact-one and PII-minimized lead evidence, no-match dedupe evidence, payload equivalence, every requested payload drift class, one-write/no-retry boundary, isolation/transaction/verification/disposition/race/aggregate conditions, second-write prohibition, deterministic plan fingerprints, and static runtime safety. Canonical Governance, Dry-Run, and Persistence Mapping checkers plus TypeScript and diff validation are required for local certification.
