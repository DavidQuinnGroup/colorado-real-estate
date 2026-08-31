import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  BUYER_UNDER_CONTRACT_DECISION_BRIEF_VERSION,
  BUYER_UNDER_CONTRACT_FOUNDATION_VERSION,
  BuyerUnderContractError,
  DQG_TRANSACTION_ARCHIVE_POLICY_VERSION,
  assertLowRiskTransactionDecisionProfile,
  isLowRiskTransactionDecisionProfile,
  transactionArchivePolicy,
} from '../lib/buyerUnderContractFoundation';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260831100000_add_buyer_under_contract_foundation/migration.sql', 'utf8');
const service = readFileSync('lib/buyerUnderContractFoundation.ts', 'utf8');
const route = readFileSync('app/api/agent/buyer-under-contract/route.ts', 'utf8');
const workspace = readFileSync('components/agent/BuyerUnderContractWorkspace.tsx', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const outputPersistence = readFileSync('lib/outputPersistenceFoundation.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(BUYER_UNDER_CONTRACT_FOUNDATION_VERSION, 'BUYER_UNDER_CONTRACT_FOUNDATION_V1');
assert.equal(BUYER_UNDER_CONTRACT_DECISION_BRIEF_VERSION, 'BUYER_UNDER_CONTRACT_DECISION_BRIEF_V1');
assert.equal(DQG_TRANSACTION_ARCHIVE_POLICY_VERSION, 'DQG_TRANSACTION_ARCHIVE_POLICY_V1');
const archive = transactionArchivePolicy();
assert.equal(archive.archiveOwner, 'DAVID_QUINN_GROUP');
assert.equal(archive.coverage, 'ALL_TRANSACTION_DOCUMENTS');
assert.equal(archive.retention, 'INDEFINITE');
assert.equal(archive.relationshipToBrokerageFile, 'ADDITIVE_NOT_REPLACEMENT');
assert.equal(archive.secureDocumentSystemRequired, true);
assert.equal(archive.storageActive, false);
assert.equal(archive.destructiveDeletionAuthorized, false);

assert.equal(isLowRiskTransactionDecisionProfile('REQUEST_PROFESSIONAL_ESTIMATE'), true);
assert.equal(isLowRiskTransactionDecisionProfile('NOTICE_TO_TERMINATE'), false);
assert.equal(assertLowRiskTransactionDecisionProfile('NON_BINDING_PRIORITY'), 'NON_BINDING_PRIORITY');
for (const profile of ['INSPECTION_OBJECTION', 'INSPECTION_RESOLUTION', 'TITLE_OBJECTION', 'TITLE_ACCEPTANCE', 'APPRAISAL_OBJECTION', 'APPRAISAL_WAIVER', 'FINANCING_ELECTION', 'LOAN_APPROVAL', 'CONTINGENCY_WAIVER', 'NOTICE_TO_TERMINATE', 'TERMINATION', 'AMENDMENT_APPROVAL', 'COUNTERPROPOSAL_ACCEPTANCE', 'CONTRACTUAL_ACCEPTANCE', 'CONTRACTUAL_REJECTION', 'EARNEST_MONEY_RELEASE', 'CLOSING_FUNDS_INSTRUCTION', 'WIRE_INSTRUCTION', 'LEGAL_NOTICE', 'OTHER_CONTRACT_RIGHT_ELECTION']) {
  assert.throws(() => assertLowRiskTransactionDecisionProfile(profile), (error: unknown) => error instanceof BuyerUnderContractError && error.code === 'PROHIBITED_DECISION');
}

for (const name of ['Transaction', 'TransactionDeadline', 'TransactionIssue', 'TransactionDecision', 'TransactionTimelineEvent']) {
  assert.match(schema, new RegExp(`model ${name} \\{`));
  assert.match(migration, new RegExp(`CREATE TABLE "${name}"`));
}
assert.match(schema, /canonicalProperty\s+CanonicalPhysicalProperty/);
assert.match(schema, /side\s+TransactionSide/);
assert.match(schema, /supersedesDeadlineId\s+String\?\s+@unique/);
assert.match(migration, /TransactionTimelineEvent_append_only/);
assert.match(migration, /TransactionDecision_append_only/);
assert.match(migration, /TransactionDeadline_material_facts_immutable/);
assert.match(migration, /PROJECT ATLAS transaction timeline events are append-only/);
assert.match(migration, /PROJECT ATLAS transaction deadline facts require a successor record/);
assert.match(service, /clientAuthorityInferred: false/);
assert.match(service, /assertLowRiskTransactionDecisionProfile/);
assert.match(service, /EvidenceAdmission or ProfessionalInput is created automatically/);
assert.match(service, /persistReviewedFixture/);
assert.doesNotMatch(service, /evidenceAdmission\.create/);
assert.doesNotMatch(service, /professionalInput\.create/);
assert.match(outputPersistence, /persistReviewedFixture/);
assert.match(route, /authorizeAdminRequest/);
assert.match(route, /isSameOriginAdminRequest/);
assert.match(auth, /\/api\/agent\/buyer-under-contract/);
assert.match(auth, /\/agent\/under-contract/);
assert.match(workspace, /Documents inactive/);
assert.match(workspace, /Not available here: amendments, waivers, termination notices, legal interpretation, or binding direction/);
assert.doesNotMatch(workspace, /upload/i);
assert.equal(packageJson.scripts?.['check:buyer-under-contract-foundation'], 'jiti scripts/checkBuyerUnderContractFoundation.ts');

console.log('BUYER_UNDER_CONTRACT_FOUNDATION_CHECK: PASS');
