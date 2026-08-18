import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildFinancialPreparationCompositionModel } from '../lib/financialPreparationComposition.js';

const libSource = fs.readFileSync(path.resolve(process.cwd(), 'lib/financialPreparationComposition.ts'), 'utf8');
const componentSource = fs.readFileSync(path.resolve(process.cwd(), 'components/FinancialPreparationComposition.tsx'), 'utf8');
for (const source of [libSource, componentSource]) {
  for (const token of ['PrismaClient', '@prisma', 'fetch(', 'process.env', 'localStorage', 'sessionStorage', 'Typesense', 'sendEmail', 'calculateNetProceeds', 'netProceedsResult', 'currentRateQuote', 'lenderQuoteResult', 'affordabilityResult', 'buyingPowerResult', 'investmentRecommendation', 'yieldForecastResult']) {
    assert.equal(source.includes(token), false, `customer composition must not depend on ${token}`);
  }
}
for (const token of ['FinancialPreparationComposition', 'financial-preparation-surface', 'financial-preparation-hidden-transfer']) assert.equal(componentSource.includes(token), true, `customer composition must expose ${token}`);

const model = buildFinancialPreparationCompositionModel();
assert.equal(model.version, 'REIE_MODULE_6_PHASE_1_CUSTOMER_COMPOSITION_V1');
assert.equal(model.preparation.classification, 'VALID_FINANCIAL_PREPARATION');
assert.equal(model.presentationClassification, 'VALID_SAFE_PRESENTATION');
assert.equal(model.orchestrationClassification, 'VALID_MODULE_6_ORCHESTRATION');
assert.ok(model.assumptionInventory.length > 0);
assert.ok(model.missingInputs.length > 0);
assert.ok(model.ownershipCostCategories.length > 0);
assert.ok(model.capexPreparationQuestions.length > 0);
assert.ok(model.movingCostCategories.length > 0);
assert.ok(model.netProceedsRequiredInputs.length > 0);
assert.equal(model.professionalQuestionGroups.length, 6);
assert.deepEqual(model.protectedBoundaries, { persistence: false, hiddenTransfer: false, providerData: false, lenderData: false, recommendation: false, affordability: false, qualification: false, investmentOutput: false, netProceedsConclusion: false });

console.log('[financial-preparation-composition] ok: bounded customer composition, Module 6 presentation, Module 8 orchestration, professional question groups, and protected boundaries verified.');
