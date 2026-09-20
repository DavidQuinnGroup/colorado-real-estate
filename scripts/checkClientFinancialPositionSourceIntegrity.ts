import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260920100000_client_case_governed_source_integrity_v1/migration.sql', 'utf8');
const governedSourceService = readFileSync('lib/clientCaseGovernedSourceFoundation.ts', 'utf8');
const financialPositionService = readFileSync('lib/clientFinancialPositionFoundation.ts', 'utf8');

for (const token of [
  'enum ClientCaseGovernedSourceKind',
  'model ClientCaseGovernedSource',
  '@@unique([clientCaseId, id]',
  '@@unique([clientCaseId, evidenceAdmissionId]',
  '@@unique([clientCaseId, professionalInputId]',
  '@@unique([id, ownerAgentSubject]',
  'clientCaseGovernedSourceId String',
  'references: [clientCaseId, id]',
]) assert.match(schema, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(schema, /sourceKind\s+ClientCaseGovernedSourceKind/);

for (const token of [
  'ClientCaseGovernedSource_shape_ck',
  'ClientCaseGovernedSource_clientCaseId_ownerAgentSubject_fkey',
  'ClientCaseGovernedSource_evidenceAdmissionId_ownerAgentSubject_fkey',
  'ClientCaseGovernedSource_professionalInputId_ownerAgentSubject_fkey',
  'ClientFinancialSource_caseSource_fkey',
  'ClientFinancialSource rows require separate data reconciliation',
  'DROP TYPE "ClientFinancialSourceKind"',
]) assert.match(migration, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
const executableMigration = migration.replace(/^--.*$/gm, '').replace(/ON UPDATE CASCADE/g, '').replace(/ON DELETE RESTRICT/g, '');
assert.doesNotMatch(executableMigration, /\bINSERT\b|\bUPDATE\b|\bDELETE\b/i, 'The governed-source migration must not backfill or mutate business data.');

for (const token of [
  'associateEvidenceToClientCase',
  'associateProfessionalInputToClientCase',
  'listClientCaseGovernedSources',
  'assertEligibleClientCaseGovernedSource',
  'Archived Client Cases are read-only for governed sources',
  'supersededByAdmission',
  'expiresAt',
  'take > 100',
]) assert.match(governedSourceService, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

assert.match(financialPositionService, /rejectUnexpectedKeys\(input, \['clientCaseGovernedSourceId'\]\)/);
assert.match(financialPositionService, /assertEligibleClientCaseGovernedSource/);
assert.doesNotMatch(governedSourceService, /app\/api\/|fetch\(|router\./);
assert.doesNotMatch(financialPositionService, /app\/api\/|fetch\(|router\./);

console.log('[client-financial-position-source-integrity] ok: immutable Case-scoped governed-source association, no-backfill migration gate, owner/type/source constraints, dynamic eligibility, bounded source candidates, and transport-independent Financial Source binding are present.');
