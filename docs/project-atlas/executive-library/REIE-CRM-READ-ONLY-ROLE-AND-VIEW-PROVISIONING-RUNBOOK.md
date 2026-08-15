# THIS RUNBOOK DOES NOT AUTHORIZE SQL EXECUTION OR INFRASTRUCTURE PROVISIONING

# PROJECT ATLAS(TM) - Future CRM Read-Only Role and View Provisioning Runbook

## Current Posture

`SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED`

`AGGREGATE_AUDIT_NOT_AUTHORIZED`

`LIVE_PROOF_NOT_AUTHORIZED`

This runbook is a future manual sequence only. It does not create a role, create a view, grant privilege, establish a credential, connect to a database, or authorize an audit.

## Future Sequence

1. Freeze the canonical repository revision to be provisioned.
2. Independently review the exact SQL definition artifact.
3. Identify the exact target Supabase/Postgres environment.
4. Receive explicit infrastructure provisioning authorization from Executive HQ.
5. Establish the future secret-delivery mechanism without exposing the credential value to chat, command arguments, logs, repository files, or transcripts.
6. Execute role/view provisioning manually in the authorized Primary context only.
7. Inspect exact role attributes, grants, and view definitions.
8. Prove no mutation privileges and no role-management privileges.
9. Prove no prohibited PII or full metadata view exposure.
10. Certify the safe read connection using controlled non-customer evidence.
11. Disconnect the foreground process.
12. Return controlled evidence to Executive HQ.
13. Only then consider changing posture to `SAFE_ACCESS_PATH_ESTABLISHED`.
14. Keep aggregate audit blocked until a separate `READ_ONLY_AGGREGATE_AUDIT_AUTHORIZATION` is granted.

## Required Pre-Execution Review

Before any future provisioning, Executive HQ must confirm:

- target database/environment identity
- canonical revision
- role identifier
- view names
- exact SQL fingerprint
- operator identity
- approved Primary execution context
- secret-delivery class
- rollback/stop plan for pre-existing objects

If any object already exists, stop for separate Executive review. Do not silently replace unknown infrastructure.

## Post-Provision Certification Evidence

Future certification must include:

- target DB/environment identifier
- role identity
- role attributes
- schema grants
- view grants
- absence of table mutation grants
- absence of direct broad `CRMTask` or `User` select grants
- view definition fingerprints
- allowed view columns
- denied PII/full metadata proof
- secret-delivery class
- DB-enforced read-only confirmation
- connection and disconnection evidence
- canonical revision
- certification fingerprint

The evidence must exclude:

- credential values
- connection strings
- raw customer values
- raw CRMTask rows
- raw User rows
- full metadata payloads
- query parameter values when they could identify a customer

## Safe-Access Establishment Standard

Do not claim `SAFE_ACCESS_PATH_ESTABLISHED` until all of these are true:

- explicit provisioning authorization was granted
- role and views were actually provisioned
- post-provision privilege certification passed
- safe secret delivery was certified
- bounded connection certification passed
- Executive HQ accepted the evidence

## Aggregate Audit Firewall

The aggregate audit remains blocked after provisioning unless Executive HQ separately grants `READ_ONLY_AGGREGATE_AUDIT_AUTHORIZATION`.

The first future live read, if authorized later, should use privacy-minimized aggregate surfaces only:

- task counts by type/status/priority
- age buckets
- sellerLead relationship presence counts
- governance metadata-path presence counts
- lifecycle posture counts
- communication-authority posture counts
- dedupe-key presence counts
- audit-fingerprint presence counts

No row dump is allowed.

## Live-Proof Firewall

`LIVE_PROOF_NOT_AUTHORIZED`

The read-only role/view path must never create or modify a CRMTask. The write-capable credential/context remains separately gated and outside this runbook.

## Stop Conditions

Stop if:

- database target is unclear
- production versus non-production is unclear
- role privileges cannot be constrained
- full metadata must be exposed
- PII columns are required unexpectedly
- secret delivery would expose a value
- Supabase architecture conflicts with the role/view approach
- role/view creation would affect application runtime unexpectedly
- migration/deployment semantics are unclear
- Executive authorization scope is insufficient

## RLS Posture

`DATABASE_ROLE_AND_VIEW_PRIVILEGE_IS_PRIMARY_FIRST_CONTROL`

`RLS_NOT_ASSUMED`

`RLS_FUTURE_REVIEW_IF_ROW_SCOPE_REQUIRED`
