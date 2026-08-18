import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { validateMultiDimensionalStrategyOrchestration, type ReieModule8OrchestrationInput } from '../lib/multiDimensionalStrategyOrchestration.js';
import { REIE_DECISION_CONTEXT_MODE, REIE_DECISION_CONTEXT_SCHEMA_VERSION, type ReieDecisionContext } from '../lib/reieDecisionContextContract.js';

const source = fs.readFileSync(path.resolve(process.cwd(), 'lib/multiDimensionalStrategyOrchestration.ts'), 'utf8');
for (const token of ['fetch(', 'PrismaClient', '@prisma', 'process.env', 'localStorage', 'sessionStorage', 'CRMTask', 'Typesense', 'sendEmail', 'providerId']) {
  assert.equal(source.includes(token), false, `Module 8 orchestration must not depend on ${token}`);
}

const fact = {
  id: 'property-fact',
  label: 'Visible property fact',
  value: 'Explicit fact',
  classification: 'FACT' as const,
  provenance: { origin: 'GOVERNED_SOURCE_FACT' as const, reference: 'source-reference', sourceId: 'SRC-GOVERNED', freshness: 'CURRENT' as const, rights: 'REVIEWED' as const },
  visibility: 'GUIDED' as const,
  verification: 'NOT_REQUIRED' as const,
  prohibitedUse: ['No valuation, suitability, or offer conclusion.'],
};
const context: ReieDecisionContext = {
  schemaVersion: REIE_DECISION_CONTEXT_SCHEMA_VERSION,
  mode: REIE_DECISION_CONTEXT_MODE,
  role: 'CUSTOMER',
  selectedGoals: [{ id: 'goal-1', domain: 'BUYER', evidence: { ...fact, id: 'goal-1', label: 'Customer-selected goal', value: 'Compare homes', classification: 'USER_ASSUMPTION', provenance: { origin: 'EXPLICIT_CUSTOMER_INPUT' as const, reference: 'customer-selected-goal', sourceId: null, freshness: 'NOT_APPLICABLE' as const, rights: 'NOT_APPLICABLE' as const } } }],
  items: [{ id: 'property-fact', domain: 'PROPERTY', evidence: fact }],
  professionalHandoffs: [{ id: 'handoff-1', role: 'REAL_ESTATE_AGENT', questionCategory: 'Property verification', whyVerificationIsNeeded: 'Property-specific facts require professional review.', informationToBring: ['Visible facts'], whatReieCannotDetermine: ['Condition', 'Title'], customerSelectedHandoff: true, agentPreparationOnly: false, contextItemIds: ['property-fact'], providerRecommendation: false, ranking: false, referralRelationship: false, automaticCommunication: false }],
  sourcePosture: { state: 'EXPLICIT_SOURCE_STATE', rights: 'EXPLICIT_REVIEWED', freshness: 'CURRENT' },
  persistencePosture: 'NOT_PERSISTED',
  hiddenTransferPosture: 'PROHIBITED',
  prohibitedOutputs: ['NO_RECOMMENDATION', 'NO_SUITABILITY', 'NO_OFFER_PRICE', 'NO_BID_STRATEGY', 'NO_CONCESSION_RECOMMENDATION', 'NO_SALE_PROBABILITY', 'NO_AUTOMATED_VALUATION', 'NO_INVESTMENT_CONCLUSION', 'NO_TAX_ADVICE', 'NO_LEGAL_ADVICE', 'NO_LENDING_RECOMMENDATION', 'NO_HIDDEN_PERSONALIZATION', 'NO_AUTONOMOUS_COMMUNICATION'],
};

const input: ReieModule8OrchestrationInput = {
  context,
  primitiveReferences: [
    { primitiveId: 'GRAND_PLAN', repositoryReference: 'app/grand-plan/page.tsx' },
    { primitiveId: 'BUYER_DECISION_WORKSPACE', repositoryReference: 'lib/buyerDecisionWorkspace.ts' },
    { primitiveId: 'ADVISORY_HANDOFF', repositoryReference: 'components/AdvisoryHandoffGuide.tsx' },
  ],
  outputs: [
    { id: 'output-fact', domain: 'PROPERTY', kind: 'KNOWN_FACT', evidence: fact },
    { id: 'output-question', domain: 'FINANCING', kind: 'DECISION_QUESTION', evidence: { ...fact, id: 'output-question', label: 'Question for lender review', value: 'What should be verified?', classification: 'PROFESSIONAL_VERIFICATION_REQUIRED', provenance: { origin: 'EXPLICIT_PROFESSIONAL_OR_ADMIN_CONTEXT' as const, reference: 'handoff-1', sourceId: null, freshness: 'NOT_APPLICABLE' as const, rights: 'NOT_APPLICABLE' as const }, visibility: 'AGENT_ONLY' as const, verification: 'REQUIRED' as const } },
  ],
  professionalHandoffs: [...context.professionalHandoffs],
  forbiddenOutputCodes: [...context.prohibitedOutputs] as ReieModule8OrchestrationInput['forbiddenOutputCodes'],
};

const valid = validateMultiDimensionalStrategyOrchestration(input);
assert.equal(valid.classification, 'VALID_MODULE_8_ORCHESTRATION');
assert.equal(valid.orchestration?.context.mode, 'EXPLICIT_CONTEXT_ONLY');
assert.equal(valid.orchestration?.context.persistencePosture, 'NOT_PERSISTED');
assert.equal(valid.orchestration?.context.hiddenTransferPosture, 'PROHIBITED');
assert.equal(validateMultiDimensionalStrategyOrchestration({ ...input, outputs: [{ ...input.outputs[0], evidence: { ...fact, classification: 'PROHIBITED_OUTPUT', value: null, visibility: 'COMPLIANCE_BLOCKED' } }] }).classification, 'FAIL_CLOSED');
assert.equal(validateMultiDimensionalStrategyOrchestration({ ...input, primitiveReferences: [{ primitiveId: 'GRAND_PLAN', repositoryReference: 'lib/strategyGenerator.ts' as never }] }).classification, 'FAIL_CLOSED');

console.log('[multi-dimensional-strategy-orchestration] ok: existing primitive registry, safe output taxonomy, Master concept dispositions, forbidden-output declaration, no persistence, no hidden transfer, and fail-closed validation verified.');
