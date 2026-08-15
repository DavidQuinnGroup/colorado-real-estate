-- PROJECT ATLAS(TM) - CRM read-only role and view definition MVV
-- NON-EXECUTED REVIEW ARTIFACT ONLY.
-- THIS FILE DOES NOT AUTHORIZE SQL EXECUTION OR INFRASTRUCTURE PROVISIONING.
-- SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED.
-- AGGREGATE_AUDIT_NOT_AUTHORIZED.
-- LIVE_PROOF_NOT_AUTHORIZED.

-- Target posture:
--   dedicated database-enforced read-only login role
--   select authority on purpose-specific views only
--   no direct CRMTask or User table select grant
--   no credential value in this definition

CREATE ROLE reie_crm_read_only_evidence LOGIN
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOINHERIT
  NOREPLICATION
  NOBYPASSRLS;

GRANT CONNECT ON DATABASE postgres TO reie_crm_read_only_evidence;
GRANT USAGE ON SCHEMA public TO reie_crm_read_only_evidence;

CREATE VIEW public.reie_crm_ro_aggregate_audit
WITH (security_barrier = true) AS
SELECT
  "CRMTask"."type" AS task_type,
  "CRMTask"."status" AS task_status,
  "CRMTask"."priority" AS task_priority,
  CASE
    WHEN "CRMTask"."createdAt" >= now() - interval '7 days' THEN 'AGE_000_006_DAYS'
    WHEN "CRMTask"."createdAt" >= now() - interval '30 days' THEN 'AGE_007_029_DAYS'
    WHEN "CRMTask"."createdAt" >= now() - interval '90 days' THEN 'AGE_030_089_DAYS'
    ELSE 'AGE_090_PLUS_DAYS'
  END AS created_at_age_bucket,
  ("CRMTask"."sellerLeadId" IS NOT NULL) AS seller_lead_present,
  ("CRMTask"."metadata" #>> '{taskIntent,lifecycleClass}') AS task_intent_lifecycle_class,
  ("CRMTask"."metadata" #>> '{taskIntent,communicationAuthority}') AS task_intent_communication_authority,
  (NULLIF("CRMTask"."metadata" #>> '{taskIntent,dedupeKey}', '') IS NOT NULL) AS task_intent_dedupe_key_present,
  (NULLIF("CRMTask"."metadata" #>> '{taskIntent,auditFingerprint}', '') IS NOT NULL) AS task_intent_audit_fingerprint_present
FROM public."CRMTask";

CREATE VIEW public.reie_crm_ro_subject_resolution
WITH (security_barrier = true) AS
SELECT
  "User"."id" AS user_id
FROM public."User";

CREATE VIEW public.reie_crm_ro_intent_dedupe
WITH (security_barrier = true) AS
SELECT
  "CRMTask"."id" AS crm_task_id,
  "CRMTask"."leadId" AS lead_id,
  "CRMTask"."type" AS task_type,
  "CRMTask"."status" AS task_status,
  ("CRMTask"."metadata" #>> '{taskIntent,dedupeKey}') AS task_intent_dedupe_key,
  ("CRMTask"."metadata" #>> '{taskIntent,auditFingerprint}') AS task_intent_audit_fingerprint
FROM public."CRMTask";

CREATE VIEW public.reie_crm_ro_post_write_verification
WITH (security_barrier = true) AS
SELECT
  "CRMTask"."id" AS crm_task_id,
  "CRMTask"."leadId" AS lead_id,
  "CRMTask"."type" AS task_type,
  "CRMTask"."status" AS task_status,
  "CRMTask"."priority" AS task_priority,
  "CRMTask"."title" AS task_title,
  ("CRMTask"."metadata" #>> '{taskIntent,schemaVersion}') AS task_intent_schema_version,
  ("CRMTask"."metadata" #>> '{taskIntent,intentType}') AS task_intent_type,
  ("CRMTask"."metadata" #>> '{taskIntent,sourceCapability}') AS task_intent_source_capability,
  ("CRMTask"."metadata" #>> '{taskIntent,ownerPosture,state}') AS task_intent_owner_posture_state,
  ("CRMTask"."metadata" #>> '{taskIntent,priorityReason}') AS task_intent_priority_reason,
  ("CRMTask"."metadata" #>> '{taskIntent,dueDatePosture}') AS task_intent_due_date_posture,
  ("CRMTask"."metadata" #>> '{taskIntent,sourceEventFingerprint}') AS task_intent_source_event_fingerprint,
  ("CRMTask"."metadata" #>> '{taskIntent,dedupeKey}') AS task_intent_dedupe_key,
  ("CRMTask"."metadata" #>> '{taskIntent,auditFingerprint}') AS task_intent_audit_fingerprint,
  ("CRMTask"."metadata" #>> '{taskIntent,evidenceCodes}') AS task_intent_evidence_codes,
  ("CRMTask"."metadata" #>> '{taskIntent,lifecycleClass}') AS task_intent_lifecycle_class,
  ("CRMTask"."metadata" #>> '{taskIntent,communicationAuthority}') AS task_intent_communication_authority,
  ("CRMTask"."metadata" #>> '{taskIntent,consentPosture}') AS task_intent_consent_posture,
  ("CRMTask"."metadata" #>> '{taskIntent,expirationPosture}') AS task_intent_expiration_posture,
  ("CRMTask"."metadata" #>> '{taskIntent,generatedAt}') AS task_intent_generated_at
FROM public."CRMTask";

GRANT SELECT ON public.reie_crm_ro_aggregate_audit TO reie_crm_read_only_evidence;
GRANT SELECT ON public.reie_crm_ro_subject_resolution TO reie_crm_read_only_evidence;
GRANT SELECT ON public.reie_crm_ro_intent_dedupe TO reie_crm_read_only_evidence;
GRANT SELECT ON public.reie_crm_ro_post_write_verification TO reie_crm_read_only_evidence;

-- Intentional omission:
--   no direct SELECT grant on public."CRMTask"
--   no direct SELECT grant on public."User"
--   no table ownership
--   no schema ownership
--   no mutation privilege
--   no runtime executor
