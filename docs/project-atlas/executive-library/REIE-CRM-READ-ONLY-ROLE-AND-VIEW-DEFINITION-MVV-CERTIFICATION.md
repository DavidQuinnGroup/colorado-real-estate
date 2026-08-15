# PROJECT ATLAS(TM) - CRM Read-Only Role and View Definition MVV Certification

## Certification

This MVV certifies a non-executing design package for a future CRM read-only database role and purpose-specific privacy-minimized views.

This certification does not authorize infrastructure provisioning.

## Scope

The certified package consists of:

- `docs/project-atlas/executive-library/REIE-CRM-READ-ONLY-ROLE-AND-VIEWS-DEFINITION.sql`
- `scripts/checkCRMReadOnlyRoleAndViewDefinition.ts`
- `docs/project-atlas/executive-library/REIE-CRM-READ-ONLY-ROLE-AND-VIEW-DEFINITION-MVV-CERTIFICATION.md`
- `docs/project-atlas/executive-library/REIE-CRM-READ-ONLY-ROLE-AND-VIEW-PROVISIONING-RUNBOOK.md`

The SQL artifact is reviewed definition text only. It is intentionally not placed in Prisma migrations or Supabase governance execution folders.

## Role Design

The future role is modeled as `reie_crm_read_only_evidence`.

Required posture:

- database-enforced read-only
- view-only select access
- no direct broad table select grants
- no mutation privileges
- no ownership privileges
- no role-management authority
- no bypass-RLS capability
- no credential value in repository

## View Model

The definition uses four purpose-specific views:

- `reie_crm_ro_aggregate_audit`
- `reie_crm_ro_subject_resolution`
- `reie_crm_ro_intent_dedupe`
- `reie_crm_ro_post_write_verification`

The views align to the canonical safe-access purposes:

- `CRM_TASK_AGGREGATE_AUDIT`
- `SUBJECT_TO_LEAD_RESOLUTION`
- `INTENT_SPECIFIC_DEDUPE_READ`
- `POST_WRITE_VERIFICATION_READ`

## JSON Metadata Firewall

The role receives no direct full `CRMTask.metadata` authority.

Only explicit TaskIntent governance paths are projected:

- `taskIntent.schemaVersion`
- `taskIntent.intentType`
- `taskIntent.sourceCapability`
- `taskIntent.ownerPosture`
- `taskIntent.priorityReason`
- `taskIntent.dueDatePosture`
- `taskIntent.sourceEventFingerprint`
- `taskIntent.dedupeKey`
- `taskIntent.auditFingerprint`
- `taskIntent.evidenceCodes`
- `taskIntent.lifecycleClass`
- `taskIntent.communicationAuthority`
- `taskIntent.consentPosture`
- `taskIntent.expirationPosture`
- `taskIntent.generatedAt`

No wildcard metadata extraction, arbitrary JSON key enumeration, or full metadata projection is certified.

## View Security Semantics

The definition uses view-only grants and security-barrier views. The design intentionally does not use `security_invoker` for this first MVV because a security-invoker posture would require direct base-table privileges for the read-only role, weakening the view-only firewall.

Future provisioning review must confirm the exact PostgreSQL/Supabase version semantics before execution.

## RLS Posture

`DATABASE_ROLE_AND_VIEW_PRIVILEGE_IS_PRIMARY_FIRST_CONTROL`

`RLS_NOT_ASSUMED`

`RLS_FUTURE_REVIEW_IF_ROW_SCOPE_REQUIRED`

## Non-Authorization Posture

`SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED`

`AGGREGATE_AUDIT_NOT_AUTHORIZED`

`LIVE_PROOF_NOT_AUTHORIZED`

`WRITE_CREDENTIAL_SEPARATE_AND_NOT_IN_SCOPE`

Even a perfect role/view definition does not establish safe access.

## Validation

The dedicated checker statically verifies:

- definition-only SQL artifact
- no connection command
- no command-line database invocation
- no credential value
- no mutation/data-definition table operations
- role attributes deny elevated authority
- view-only select grants
- no direct `CRMTask` or `User` table select grants
- no full metadata exposure
- no PII columns
- internal-id-only subject resolution
- bounded dedupe and post-write views
- aggregate privacy minimization
- no runtime executor
- no environment or Keychain access
- no Prisma/DB runtime import
- no provider/network dependency

## Final Classification

`CRM_READ_ONLY_DATABASE_ROLE_AND_VIEW_DEFINITION_MVV_IMPLEMENTED_AND_LOCALLY_CERTIFIED`

## Next Gate

`READY_FOR_CRM_READ_ONLY_ROLE_AND_VIEW_DEFINITION_PRIMARY_CANONICAL_REVIEW`
