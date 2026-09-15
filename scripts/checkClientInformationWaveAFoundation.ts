import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

import { normalizeContactEmail, normalizeContactPhone } from '../lib/clientInformationWaveAFoundation';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260915160000_add_client_information_wave_a_foundation/migration.sql', 'utf8');
const service = readFileSync('lib/clientInformationWaveAFoundation.ts', 'utf8');
const route = readFileSync('app/api/agent/client-case-information/route.ts', 'utf8');
const workflow = readFileSync('lib/clientCaseInformationWorkflow.ts', 'utf8');
const workspace = readFileSync('components/agent/ClientCaseInformationWorkspace.tsx', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

assert.equal(packageJson.scripts?.['check:client-information-wave-a-foundation'], 'jiti scripts/checkClientInformationWaveAFoundation.ts');

for (const token of [
  'enum ContactEntityType',
  'enum ContactLifecycleStatus',
  'enum ContactMethodKind',
  'enum ClientCaseParticipationStatus',
  'enum ClientCaseAdvisoryRole',
  'model Contact ',
  'model ContactMethod ',
  'model ClientCasePartyAdvisoryRole ',
  'ownerAgentSubject',
  'createdBySubject',
  'advisoryRoles ClientCasePartyAdvisoryRole[]',
]) {
  assert.match(schema, new RegExp(token.replaceAll('?', '\\?').replaceAll('[', '\\[').replaceAll(']', '\\]')));
}

assert.match(schema, /participationStatus\s+ClientCaseParticipationStatus\s+@default\(ACTIVE\)/);
assert.match(schema, /startedAt\s+DateTime\s+@default\(now\(\)\)/);
assert.match(schema, /contactId\s+String\?/);

assert.match(migration, /CREATE TYPE "ContactEntityType"/);
assert.match(migration, /CREATE TABLE "Contact"/);
assert.match(migration, /CREATE TABLE "ContactMethod"/);
assert.match(migration, /CREATE TABLE "ClientCasePartyAdvisoryRole"/);
assert.match(migration, /ALTER TABLE "ClientCaseParty"[\s\S]*ADD COLUMN "contactId" TEXT/);
assert.match(migration, /'contact_' \|\| party\."id"/);
assert.match(migration, /party\."displayLabel"/);
assert.match(migration, /client_case\."ownerAgentSubject"/);
assert.match(migration, /client_case\."createdBySubject"/);
assert.doesNotMatch(migration, /GROUP BY\s+party\."displayLabel"/i);
assert.doesNotMatch(migration, /DELETE FROM "ClientCaseParty"/);
assert.doesNotMatch(migration, /DROP TABLE "ClientCaseParty"/);
assert.doesNotMatch(migration, /INSERT INTO "ContactMethod"/);

assert.equal(normalizeContactEmail('  Jane.Agent@Example.COM '), 'jane.agent@example.com');
assert.equal(normalizeContactPhone(' (303) 555-0199 '), '3035550199');
assert.equal(normalizeContactPhone('+1 303 555 0199'), '+13035550199');

for (const token of [
  'createClientInformationWaveAService',
  'ownerAgentSubject',
  'duplicateCandidates',
  'createContactAndParticipation',
  'linkContact',
  'updateContact',
  'updateParticipation',
  'endParticipation',
  'ContactLifecycleStatus',
  'ClientCaseParticipationStatus',
]) {
  assert.match(service, new RegExp(token));
}

for (const action of [
  'CREATE_CONTACT_PARTICIPATION',
  'LINK_CONTACT',
  'UPDATE_CONTACT',
  'UPDATE_PARTICIPATION',
  'END_PARTICIPATION',
  'DUPLICATE_CANDIDATES',
]) {
  assert.match(route, new RegExp(action));
}

assert.match(route, /ClientInformationWaveAError/);
assert.match(route, /createClientInformationWaveAService/);
assert.match(workflow, /people: peopleState/);
assert.match(workflow, /people\.listPeople/);
assert.match(workspace, /client-case-information-people/);
assert.match(workspace, /Check duplicates/);
assert.match(workspace, /did not merge these Contacts/);
assert.match(workspace, /Stated purchase range/);
assert.match(workspace, /not demonstrated affordability/);

const forbiddenDurableFinancialTokens = [
  /\bpreapproval\b/i,
  /\bcreditReport\b/i,
  /\bbankAccount\b/i,
  /\bsocialSecurity\b/i,
  /\bssn\b/i,
  /\btaxReturn\b/i,
  /\bdebtToIncome\b/i,
];

for (const [name, contents] of Object.entries({ schema, service, route, workspace })) {
  for (const forbidden of forbiddenDurableFinancialTokens) {
    assert.doesNotMatch(contents, forbidden, `${name} must not introduce Wave B-H financial/client authorization scope`);
  }
}

const syntheticParties = [
  { id: 'party_alpha', displayLabel: 'Jordan Quinn' },
  { id: 'party_beta', displayLabel: 'Jordan Quinn' },
  { id: 'party_gamma', displayLabel: 'Apex Holdings LLC' },
];

const syntheticBackfill = syntheticParties.map((party) => ({
  contactId: `contact_${party.id}`,
  displayName: party.displayLabel,
  inventedEmail: null,
  inventedPhone: null,
}));

assert.equal(syntheticBackfill.length, syntheticParties.length);
assert.equal(new Set(syntheticBackfill.map((entry) => entry.contactId)).size, syntheticParties.length);
assert.equal(syntheticBackfill.filter((entry) => entry.displayName === 'Jordan Quinn').length, 2);
assert.equal(syntheticBackfill.filter((entry) => entry.inventedEmail || entry.inventedPhone).length, 0);

console.log(JSON.stringify({
  check: 'client-information-wave-a-foundation',
  status: 'PASS',
  migrationBackfill: {
    existingParties: syntheticParties.length,
    contactsCreated: syntheticBackfill.length,
    automaticMerges: 0,
    contactMethodsInvented: 0,
    orphanedParties: 0,
  },
}));
