import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {
  REIE_PROFESSIONAL_HANDOFF_ROLES,
  validateReieProfessionalHandoffRequest,
  type ReieProfessionalHandoffRequest,
} from '../lib/reieProfessionalHandoffTaxonomy.js';

const source = fs.readFileSync(path.resolve(process.cwd(), 'lib/reieProfessionalHandoffTaxonomy.ts'), 'utf8');
for (const token of ['fetch(', 'PrismaClient', '@prisma', 'process.env', 'CRMTask', 'sendEmail', 'providerId']) assert.equal(source.includes(token), false, `handoff taxonomy must not depend on ${token}`);
assert.equal(REIE_PROFESSIONAL_HANDOFF_ROLES.length, 15);

const valid: ReieProfessionalHandoffRequest = {
  id: 'handoff-financing-1',
  role: 'LENDER',
  questionCategory: 'Financing assumptions',
  whyVerificationIsNeeded: 'User-entered assumptions require qualified review.',
  informationToBring: ['Visible assumptions', 'Questions about terms'],
  whatReieCannotDetermine: ['Approval', 'Qualification', 'Lender fit'],
  customerSelectedHandoff: true,
  agentPreparationOnly: false,
  contextItemIds: ['financing-assumption'],
  providerRecommendation: false,
  ranking: false,
  referralRelationship: false,
  automaticCommunication: false,
};

assert.deepEqual(validateReieProfessionalHandoffRequest(valid), []);
assert.ok(validateReieProfessionalHandoffRequest({ ...valid, providerRecommendation: true as never }).includes('HANDOFF_PROVIDER_RECOMMENDATION_PROHIBITED'));
assert.ok(validateReieProfessionalHandoffRequest({ ...valid, customerSelectedHandoff: false as never, agentPreparationOnly: false as never }).includes('HANDOFF_MUST_BE_CUSTOMER_SELECTED_OR_AGENT_PREPARATION'));

console.log('[reie-professional-handoff-taxonomy] ok: governed roles, question/verification fields, agent-only posture, and no-referral/no-communication firewalls verified.');
