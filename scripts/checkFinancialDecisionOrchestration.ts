import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { validateFinancialDecisionOrchestration, type ReieFinancialDecisionOrchestrationInput } from '../lib/financialDecisionOrchestration.js';

const source = fs.readFileSync(path.resolve(process.cwd(), 'lib/financialDecisionOrchestration.ts'), 'utf8');
for (const token of ['app/api/', 'PrismaClient', '@prisma', 'fetch(', 'process.env', 'Typesense', 'sendEmail', 'createRoute']) {
  assert.equal(source.includes(token), false, `orchestration must not depend on ${token}`);
}

const evidence = { id: 'fact-1', label: 'Selected goal', value: 'Prepare financing questions', classification: 'USER_ASSUMPTION' as const, provenance: { origin: 'EXPLICIT_CUSTOMER_INPUT' as const, reference: 'goal', sourceId: null, freshness: 'NOT_APPLICABLE' as const, rights: 'NOT_APPLICABLE' as const }, visibility: 'GUIDED' as const, verification: 'NOT_REQUIRED' as const, prohibitedUse: ['No recommendation.'] };
const handoff = { id: 'handoff-1', role: 'LENDER' as const, questionCategory: 'Financing verification', whyVerificationIsNeeded: 'Lender-specific terms require professional verification.', informationToBring: ['User-entered assumptions'], whatReieCannotDetermine: ['Approval', 'Current rate', 'Qualification'], customerSelectedHandoff: true, agentPreparationOnly: false, contextItemIds: ['fact-1'], providerRecommendation: false as const, ranking: false as const, referralRelationship: false as const, automaticCommunication: false as const };
const context = { schemaVersion: 'REIE_DECISION_CONTEXT_V1' as const, mode: 'EXPLICIT_CONTEXT_ONLY' as const, role: 'CUSTOMER' as const, selectedGoals: [{ id: 'goal-1', domain: 'FINANCING' as const, evidence }], items: [{ id: 'fact-1', domain: 'FINANCING' as const, evidence }], professionalHandoffs: [handoff], sourcePosture: { state: 'UNVERIFIED' as const, rights: 'UNKNOWN_OR_UNRESOLVED' as const, freshness: 'UNKNOWN' as const }, persistencePosture: 'NOT_PERSISTED' as const, hiddenTransferPosture: 'PROHIBITED' as const, prohibitedOutputs: ['NO_RECOMMENDATION', 'NO_LENDING_RECOMMENDATION', 'NO_HIDDEN_PERSONALIZATION'] };
const input: ReieFinancialDecisionOrchestrationInput = {
  financialContexts: ['FINANCING_PREPARATION_CONTEXT', 'PROFESSIONAL_VERIFICATION'], financialHandoffs: [handoff],
  module8: { context, primitiveReferences: [{ primitiveId: 'FINANCING_DECISION_WORKSPACE', repositoryReference: 'lib/financingDecisionWorkspace.ts' }], outputs: [{ id: 'output-1', domain: 'FINANCING', kind: 'EXPLICIT_ASSUMPTION', evidence }], professionalHandoffs: [handoff], forbiddenOutputCodes: ['NO_RECOMMENDATION', 'NO_SUITABILITY', 'NO_OFFER_PRICE', 'NO_BID_STRATEGY', 'NO_CONCESSION_RECOMMENDATION', 'NO_SALE_PROBABILITY', 'NO_AUTOMATED_VALUATION', 'NO_INVESTMENT_CONCLUSION', 'NO_TAX_ADVICE', 'NO_LEGAL_ADVICE', 'NO_LENDING_RECOMMENDATION', 'NO_HIDDEN_PERSONALIZATION', 'NO_AUTONOMOUS_COMMUNICATION'] },
};
assert.equal(validateFinancialDecisionOrchestration(input).classification, 'VALID_MODULE_6_ORCHESTRATION');
assert.equal(validateFinancialDecisionOrchestration({ ...input, financialContexts: [] }).classification, 'FAIL_CLOSED');
assert.equal(validateFinancialDecisionOrchestration({ ...input, module8: { ...input.module8, context: { ...context, persistencePosture: 'NOT_PERSISTED', hiddenTransferPosture: 'ALLOWED' as never } } }).classification, 'FAIL_CLOSED');

console.log('[financial-decision-orchestration] ok: Module 8 composition, explicit financial contexts, professional handoff taxonomy, no persistence, no hidden transfer, and fail-closed validation verified.');
