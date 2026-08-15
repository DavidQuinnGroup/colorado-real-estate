import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sqlPath = new URL('../docs/project-atlas/executive-library/REIE-CRM-READ-ONLY-ROLE-AND-VIEWS-DEFINITION.sql', import.meta.url);
const runbookPath = new URL('../docs/project-atlas/executive-library/REIE-CRM-READ-ONLY-ROLE-AND-VIEW-PROVISIONING-RUNBOOK.md', import.meta.url);
const certificationPath = new URL('../docs/project-atlas/executive-library/REIE-CRM-READ-ONLY-ROLE-AND-VIEW-DEFINITION-MVV-CERTIFICATION.md', import.meta.url);

const sql = await readFile(sqlPath, 'utf8');
const runbook = await readFile(runbookPath, 'utf8');
const certification = await readFile(certificationPath, 'utf8');
const combined = `${sql}\n${runbook}\n${certification}`;

function stripSqlComments(value: string) {
  return value
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

const executableSql = stripSqlComments(sql);

assert.ok(sql.includes('NON-EXECUTED REVIEW ARTIFACT ONLY'));
assert.ok(runbook.startsWith('# THIS RUNBOOK DOES NOT AUTHORIZE SQL EXECUTION OR INFRASTRUCTURE PROVISIONING'));
assert.ok(certification.includes('SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED'));

for (const prohibited of [
  '\\\\connect',
  '\\\\i',
  'psql ',
  'DATABASE_URL',
  'DIRECT_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'KEYCHAIN',
  'keychain',
  'PASSWORD',
  'SECRET=',
  'TOKEN=',
  'API_KEY=',
]) assert.equal(new RegExp(prohibited).test(combined), false, `Definition package must not reference ${prohibited}`);

for (const prohibitedSql of [
  /\bINSERT\b/i,
  /\bUPDATE\b/i,
  /\bDELETE\b/i,
  /\bUPSERT\b/i,
  /\bTRUNCATE\b/i,
  /\bCREATE\s+TABLE\b/i,
  /\bALTER\s+TABLE\b/i,
  /\bDROP\s+(TABLE|SCHEMA|DATABASE)\b/i,
  /\bCREATE\s+SCHEMA\b/i,
  /\bCREATE\s+DATABASE\b/i,
  /\bALTER\s+DATABASE\b/i,
  /\bALTER\s+ROLE\b/i,
]) assert.equal(prohibitedSql.test(executableSql), false, `SQL definition must not contain ${prohibitedSql}`);

assert.match(executableSql, /\bCREATE\s+ROLE\s+reie_crm_read_only_evidence\s+LOGIN\b/i);
for (const requiredRoleAttribute of ['NOSUPERUSER', 'NOCREATEDB', 'NOCREATEROLE', 'NOINHERIT', 'NOREPLICATION', 'NOBYPASSRLS']) {
  assert.ok(executableSql.includes(requiredRoleAttribute), `Role must include ${requiredRoleAttribute}`);
}
for (const prohibitedRoleAttribute of [/\sSUPERUSER\b/i, /\sCREATEDB\b/i, /\sCREATEROLE\b/i, /\sREPLICATION\b/i, /\sBYPASSRLS\b/i]) {
  assert.equal(prohibitedRoleAttribute.test(executableSql), false, `Role must not include ${prohibitedRoleAttribute}`);
}

const viewNames = [
  'reie_crm_ro_aggregate_audit',
  'reie_crm_ro_subject_resolution',
  'reie_crm_ro_intent_dedupe',
  'reie_crm_ro_post_write_verification',
];
for (const viewName of viewNames) {
  assert.match(executableSql, new RegExp(`CREATE\\s+VIEW\\s+public\\.${viewName}\\b`, 'i'));
  assert.match(executableSql, new RegExp(`GRANT\\s+SELECT\\s+ON\\s+public\\.${viewName}\\s+TO\\s+reie_crm_read_only_evidence`, 'i'));
}

assert.equal(/GRANT\s+SELECT\s+ON\s+public\."CRMTask"/i.test(executableSql), false);
assert.equal(/GRANT\s+SELECT\s+ON\s+public\."User"/i.test(executableSql), false);
assert.equal(/GRANT\s+(INSERT|UPDATE|DELETE|TRUNCATE|ALL)/i.test(executableSql), false);

const aggregateView = executableSql.split(/CREATE\s+VIEW\s+public\.reie_crm_ro_subject_resolution/i)[0];
for (const expected of ['task_type', 'task_status', 'task_priority', 'created_at_age_bucket', 'seller_lead_present', 'task_intent_lifecycle_class', 'task_intent_communication_authority', 'task_intent_dedupe_key_present', 'task_intent_audit_fingerprint_present']) {
  assert.ok(aggregateView.includes(expected), `Aggregate view must expose ${expected}`);
}
for (const forbidden of ['lead_id', 'user_id', 'task_title', 'email', 'phone', 'address', 'name']) {
  assert.equal(new RegExp(`\\b${forbidden}\\b`, 'i').test(aggregateView), false, `Aggregate view must not expose ${forbidden}`);
}

const subjectView = executableSql.split(/CREATE\s+VIEW\s+public\.reie_crm_ro_subject_resolution/i)[1].split(/CREATE\s+VIEW\s+public\.reie_crm_ro_intent_dedupe/i)[0];
assert.ok(subjectView.includes('"User"."id" AS user_id'));
for (const forbidden of ['email', 'name', 'phone', 'address', 'metadata']) {
  assert.equal(new RegExp(`\\b${forbidden}\\b`, 'i').test(subjectView), false, `Subject view must not expose ${forbidden}`);
}

const dedupeView = executableSql.split(/CREATE\s+VIEW\s+public\.reie_crm_ro_intent_dedupe/i)[1].split(/CREATE\s+VIEW\s+public\.reie_crm_ro_post_write_verification/i)[0];
for (const expected of ['crm_task_id', 'lead_id', 'task_type', 'task_status', 'task_intent_dedupe_key', 'task_intent_audit_fingerprint']) {
  assert.ok(dedupeView.includes(expected), `Dedupe view must expose ${expected}`);
}
for (const forbidden of ['email', 'phone', 'address', 'name', 'task_title']) {
  assert.equal(new RegExp(`\\b${forbidden}\\b`, 'i').test(dedupeView), false, `Dedupe view must not expose ${forbidden}`);
}

const postWriteView = executableSql.split(/CREATE\s+VIEW\s+public\.reie_crm_ro_post_write_verification/i)[1].split(/GRANT\s+SELECT\s+ON\s+public\.reie_crm_ro_aggregate_audit/i)[0];
for (const expected of ['crm_task_id', 'lead_id', 'task_type', 'task_status', 'task_priority', 'task_title', 'task_intent_schema_version', 'task_intent_type', 'task_intent_source_capability', 'task_intent_owner_posture_state', 'task_intent_priority_reason', 'task_intent_due_date_posture', 'task_intent_source_event_fingerprint', 'task_intent_dedupe_key', 'task_intent_audit_fingerprint', 'task_intent_evidence_codes', 'task_intent_lifecycle_class', 'task_intent_communication_authority', 'task_intent_consent_posture', 'task_intent_expiration_posture', 'task_intent_generated_at']) {
  assert.ok(postWriteView.includes(expected), `Post-write view must expose ${expected}`);
}
for (const forbidden of ['email', 'phone', 'address', 'name']) {
  assert.equal(new RegExp(`\\b${forbidden}\\b`, 'i').test(postWriteView), false, `Post-write view must not expose ${forbidden}`);
}

assert.equal(/"CRMTask"\."metadata"\s+AS/i.test(executableSql), false, 'Full CRMTask.metadata must not be selected.');
assert.equal(/metadata\s*->\s*'\*'|metadata\s*#>\s*'\{\*\}'|json_each|json_object_keys/i.test(executableSql), false);
for (const path of ['dedupeKey', 'auditFingerprint', 'lifecycleClass', 'communicationAuthority', 'schemaVersion', 'intentType', 'sourceCapability', 'ownerPosture', 'priorityReason', 'dueDatePosture', 'sourceEventFingerprint', 'evidenceCodes', 'consentPosture', 'expirationPosture', 'generatedAt']) {
  assert.ok(sql.includes(path), `Canonical governance path missing: ${path}`);
}

for (const prohibitedRuntime of [
  '@prisma/client',
  'PrismaClient',
  'prisma.',
  '$query',
  'fetch(',
  'createClient',
  'node:net',
  'node:dns',
  'child_process',
  'sendPropertyInquiryNotification',
  'nodemailer',
  'resend',
  'Typesense',
  'next/',
  'queue',
  'worker',
]) assert.equal(combined.includes(prohibitedRuntime), false, `Definition package must not reference runtime dependency ${prohibitedRuntime}`);

for (const requiredPosture of [
  'DATABASE_ROLE_AND_VIEW_PRIVILEGE_IS_PRIMARY_FIRST_CONTROL',
  'RLS_NOT_ASSUMED',
  'RLS_FUTURE_REVIEW_IF_ROW_SCOPE_REQUIRED',
  'SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED',
  'AGGREGATE_AUDIT_NOT_AUTHORIZED',
  'LIVE_PROOF_NOT_AUTHORIZED',
  'READ_ONLY_AGGREGATE_AUDIT_AUTHORIZATION',
]) assert.ok(combined.includes(requiredPosture), `Missing required posture ${requiredPosture}`);

console.log('[crm-read-only-role-view-definition] ok: non-executed SQL definition, view-only role privileges, privacy-minimized projections, JSON metadata firewall, runbook gate, and non-authorization posture are statically certified.');
