import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  adaptSellerFinancialModuleToSellerPresentation,
  isSellerPresentationFinancialModule,
  sellerPresentationFinancialModuleFingerprint,
  SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_VERSION,
} from '../lib/sellerPresentationFinancialModuleAdapter';
import { SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION } from '../lib/sellerFinancialOutputIntegration';

const outputSource = readFileSync('lib/outputPersistenceFoundation.ts', 'utf8');
const componentSource = readFileSync('components/agent/SellerDecisionBriefCompositionPreview.tsx', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

const financialProfile = {
  schemaVersion: SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION,
  moduleKind: 'FINANCIAL_SCENARIO',
  title: 'Estimated Seller Net Proceeds',
  qualifier: 'ESTIMATED',
  scenario: { scenarioKey: 'ATLAS CERTIFICATION', versionOrdinal: 1, lifecycleState: 'REVIEWED', reviewedAt: '2026-08-30T15:00:00.000Z' },
  result: { calculationContract: 'SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1', state: 'ESTIMATED', asOf: '2026-08-30T15:00:00.000Z' },
  financials: { estimatedSalePriceCents: 65_000_055, estimatedPayoffCents: 20_000_025, estimatedSellerCostsCents: 2_655_161, estimatedNetProceedsCents: 42_344_869, netProceedsBasisPoints: 6515 },
  costBreakdown: [{ key: 'SELLING_COMPENSATION', label: 'Selling compensation', state: 'VALUE', amountCents: 1_950_002, sourceQualifier: 'Scenario assumption' }],
  sourceQualifications: [{ key: 'PAYOFF', label: 'Estimated payoff', state: 'VALUE', sourceClass: 'AGENT_ESTIMATE', sourceQualifier: 'Agent estimate', provenanceRef: 'fixture:payoff' }],
  unknownZeroNotIncluded: [{ key: 'PREPARATION_ALLOWANCE', state: 'UNKNOWN' }],
  freshness: { state: 'POINT_IN_TIME', asOf: '2026-08-30T15:00:00.000Z' },
  conflictState: 'NO_CONFLICT_RECORDED',
  reviewState: 'AGENT_REVIEWED',
  limitations: ['Estimated scenario only.'],
};

const module = adaptSellerFinancialModuleToSellerPresentation({
  financialOutputVersionId: 'output-a',
  financialOutputSourceVersionRef: 'seller-financial-estimated-scenario-v1:scenario-a',
  financialOutputContentFingerprint: 'financial-fingerprint-a',
  contentPayload: financialProfile as never,
});

assert.equal(SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_VERSION, 'SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_V1');
assert.equal(module.estimatedNetProceedsCents, 42_344_869);
assert.equal(module.asOf, '2026-08-30T15:00:00.000Z');
assert.equal(module.financialOutputVersionId, 'output-a');
assert.equal(module.sourceQualifications[0]?.sourceQualifier, 'Agent estimate');
assert.equal(module.unknownZeroNotIncluded[0]?.state, 'UNKNOWN');
assert.equal(isSellerPresentationFinancialModule(module), true);
assert.equal(sellerPresentationFinancialModuleFingerprint(module), sellerPresentationFinancialModuleFingerprint(module));
assert.throws(() => adaptSellerFinancialModuleToSellerPresentation({
  financialOutputVersionId: 'output-invalid',
  financialOutputSourceVersionRef: 'source-invalid',
  financialOutputContentFingerprint: 'fingerprint-invalid',
  contentPayload: {} as never,
}));

assert.equal(outputSource.includes('sellerPresentationFinancialOutputVersionId'), true);
assert.equal(outputSource.includes('buildSellerPresentationFinancialModuleFixture'), true);
assert.equal(outputSource.includes('sellerFinancialScenario.findFirst'), true);
assert.equal(outputSource.includes('sellerFinancialScenario.update('), false);
assert.equal(outputSource.includes('outputVersion.update('), false);
assert.equal(outputSource.includes('outputVersion.delete('), false);
assert.equal(componentSource.includes('data-testid="seller-presentation-financial-module-adapter"'), true);
assert.equal(componentSource.includes('data-testid="persist-seller-presentation-financial-module"'), true);
assert.equal(componentSource.includes('sellerPresentationFinancialOutputVersionId'), true);
assert.equal(packageJson.scripts?.['check:seller-presentation-financial-module-adapter'], 'jiti scripts/checkSellerPresentationFinancialModuleAdapter.ts');

console.log('SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_CHECK: PASS');
