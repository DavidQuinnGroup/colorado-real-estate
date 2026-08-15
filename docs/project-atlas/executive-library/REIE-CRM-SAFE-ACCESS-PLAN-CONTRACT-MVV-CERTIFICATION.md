# REIE CRM Safe Access Plan Contract MVV Certification

## Scope

This certification covers the pure `lib/crm/safeAccessPlanContract.ts` planning contract and its deterministic checker. It defines what a future bounded CRM database **read plan** must prove before infrastructure review. It does not connect to a database, provision a role, retrieve a secret, read an environment value, execute SQL, or authorize a live proof.

## Certified boundaries

- Read plans allow only four finite purposes: aggregate CRM audit, subject-to-lead resolution, intent-specific dedupe, and post-write verification.
- Only `CRMTask` and `User` are in scope; only `SELECT` is allowed.
- A ready plan requires `DEDICATED_DB_READ_ONLY`, ephemeral operator injection, database-enforced read-only posture, a fixed parameterized template, exact projections, a finite row bound, explicit environment approval, canonical revision, authority class, redaction, and secret-handling attestations.
- Application write-capable and Supabase service-role credential classes are explicitly unapproved.
- Full metadata, wildcard paths, arbitrary templates, arbitrary query engines, PII fields, unbounded output, command-policy-only read-only claims, and all write operations fail closed.
- A ready plan is only `SAFE_ACCESS_PLAN_READY_FOR_INFRASTRUCTURE_REVIEW`; it never claims safe access is established, an aggregate audit is authorized/completed, or a live proof/write is authorized.

## Required future separation

Read evidence must use a dedicated database-enforced read-only credential. Any future one-task create remains a separately authorized write credential/context and is outside this contract.

## Validation

The dedicated checker exercises valid plans for every allowed purpose, unsafe credential/environment/query/projection/cardinality/secret/redaction/authority cases, deterministic fingerprinting, and static prohibited-dependency scanning. Canonical CRM governance checkers and TypeScript are rerun before local certification.
