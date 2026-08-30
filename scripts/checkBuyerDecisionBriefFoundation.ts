import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURES,
  BUYER_DECISION_BRIEF_FOUNDATION_VERSION,
  buyerDecisionBriefFingerprint,
  isBuyerDecisionBrief,
} from '../lib/buyerDecisionBriefFoundation';

const outputSource = readFileSync('lib/outputPersistenceFoundation.ts', 'utf8');
const componentSource = readFileSync('components/agent/BuyerDecisionBriefPreview.tsx', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };
const briefA = BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURES.ATLAS_CERTIFICATION_BUYER_BRIEF_A;
const briefB = BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURES.ATLAS_CERTIFICATION_BUYER_BRIEF_B;

assert.equal(BUYER_DECISION_BRIEF_FOUNDATION_VERSION, 'BUYER_DECISION_BRIEF_V1');
assert.equal(isBuyerDecisionBrief(briefA), true);
assert.equal(isBuyerDecisionBrief(briefB), true);
assert.equal(briefA.decisionContext.offerPriceContextCents, 65_000_000);
assert.equal(briefB.decisionContext.offerPriceContextCents - briefA.decisionContext.offerPriceContextCents, 1_000_000);
assert.equal(briefA.market.averageDom, 'UNKNOWN');
assert.equal(briefA.financing.estimatedPayment, 'NOT_CALCULATED');
assert.equal(briefA.financing.professionalInputBinding, 'NONE');
assert.equal(buyerDecisionBriefFingerprint(briefA), buyerDecisionBriefFingerprint(briefA));
assert.notEqual(buyerDecisionBriefFingerprint(briefA), buyerDecisionBriefFingerprint(briefB));

for (const forbidden of ['fetch(', 'PrismaClient', 'professionalInput.create(', 'evidenceAdmission.create(', 'sellerFinancialScenario.update(']) {
  assert.equal(readFileSync('lib/buyerDecisionBriefFoundation.ts', 'utf8').includes(forbidden), false, `Buyer semantic foundation must not include ${forbidden}.`);
}
assert.equal(outputSource.includes('buyerDecisionBriefFixtureId'), true);
assert.equal(outputSource.includes('buildBuyerDecisionBriefFixture'), true);
assert.equal(outputSource.includes("productKind: 'BUYER_PRESENTATION'"), true);
assert.equal(outputSource.includes("audience: 'BUYER'"), true);
assert.equal(outputSource.includes('outputVersion.update('), false);
assert.equal(outputSource.includes('outputVersion.delete('), false);
assert.equal(componentSource.includes('data-testid="persist-buyer-decision-brief"'), true);
assert.equal(componentSource.includes("'/api/agent/outputs'"), true);
assert.equal(componentSource.includes('Payment calculation deferred'), true);
assert.equal(packageJson.scripts?.['check:buyer-decision-brief-foundation'], 'jiti scripts/checkBuyerDecisionBriefFoundation.ts');

console.log('BUYER_DECISION_BRIEF_FOUNDATION_CHECK: PASS');
