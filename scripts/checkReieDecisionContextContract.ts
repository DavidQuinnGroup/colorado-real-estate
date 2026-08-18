import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { validateReieDecisionContext, type ReieDecisionContextInput } from '../lib/reieDecisionContextContract.js';

const source = fs.readFileSync(path.resolve(process.cwd(), 'lib/reieDecisionContextContract.ts'), 'utf8');
for (const token of ['fetch(', 'PrismaClient', '@prisma', 'process.env', 'localStorage', 'sessionStorage', 'CRMTask', 'Typesense', 'sendEmail']) assert.equal(source.includes(token), false, `decision context must not depend on ${token}`);

const fact = {
  id: 'property-fact',
  label: 'Visible property fact',
  value: 'Explicit fact',
  classification: 'FACT' as const,
  provenance: { origin: 'GOVERNED_SOURCE_FACT' as const, reference: 'source-reference', sourceId: 'SRC-GOVERNED', freshness: 'CURRENT' as const, rights: 'REVIEWED' as const },
  visibility: 'GUIDED' as const,
  verification: 'NOT_REQUIRED' as const,
  prohibitedUse: ['No valuation or suitability conclusion.'],
};
const input: ReieDecisionContextInput = {
  role: 'CUSTOMER',
  selectedGoals: [{ id: 'goal-1', domain: 'BUYER', evidence: { ...fact, id: 'goal-1', label: 'Customer-selected goal', value: 'Compare homes', classification: 'USER_ASSUMPTION', provenance: { origin: 'EXPLICIT_CUSTOMER_INPUT', reference: 'customer-selected-goal', sourceId: null, freshness: 'NOT_APPLICABLE', rights: 'NOT_APPLICABLE' } } }],
  items: [{ id: 'property-fact', domain: 'PROPERTY', evidence: fact }],
  professionalHandoffs: [{ id: 'handoff-1', role: 'REAL_ESTATE_AGENT', questionCategory: 'Property verification', whyVerificationIsNeeded: 'Property-specific facts require professional review.', informationToBring: ['Visible facts'], whatReieCannotDetermine: ['Condition', 'Title'], customerSelectedHandoff: true, agentPreparationOnly: false, contextItemIds: ['property-fact'], providerRecommendation: false, ranking: false, referralRelationship: false, automaticCommunication: false }],
  sourcePosture: { state: 'EXPLICIT_SOURCE_STATE', rights: 'EXPLICIT_REVIEWED', freshness: 'CURRENT' },
  persistencePosture: 'NOT_PERSISTED',
  hiddenTransferPosture: 'PROHIBITED',
  prohibitedOutputs: ['NO_RECOMMENDATION', 'NO_SUITABILITY', 'NO_VALUATION_CONCLUSION', 'NO_HIDDEN_PERSONALIZATION'],
};

const valid = validateReieDecisionContext(input);
assert.equal(valid.classification, 'VALID_EXPLICIT_CONTEXT');
assert.equal(valid.context?.mode, 'EXPLICIT_CONTEXT_ONLY');
assert.equal(valid.context?.persistencePosture, 'NOT_PERSISTED');
assert.equal(valid.context?.hiddenTransferPosture, 'PROHIBITED');
assert.equal(valid.context?.items[0].evidence.classification, 'FACT');
assert.equal(valid.context?.selectedGoals[0].evidence.classification, 'USER_ASSUMPTION');
assert.equal(validateReieDecisionContext({ ...input, persistencePosture: 'NOT_PERSISTED', hiddenTransferPosture: 'ALLOWED' as never }).classification, 'FAIL_CLOSED');
assert.equal(validateReieDecisionContext({ ...input, items: [{ ...input.items[0], evidence: { ...fact, classification: 'PROHIBITED_OUTPUT', value: 'unsafe' } }] }).classification, 'FAIL_CLOSED');

console.log('[reie-decision-context-contract] ok: explicit-only context, scalar bounded entries, source posture, professional handoff, no persistence, no hidden transfer, and fail-closed prohibited outputs verified.');
