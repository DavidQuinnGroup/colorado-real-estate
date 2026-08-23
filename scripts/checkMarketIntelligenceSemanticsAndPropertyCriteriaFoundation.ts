import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { MARKET_METRIC_SEMANTICS, marketMetricSemantics } from '../lib/agent-advisory-workbench/marketMetricSemantics';
import { createPropertyCriteriaProfile, updatePropertyCriteriaChoice, updatePropertyCriteriaRange } from '../lib/agent-advisory-workbench/propertyCriteriaProfile';
import { prepareAgentMarketUpdate } from '../lib/agent-advisory-workbench/marketUpdatePreparation';
import { MARKET_UPDATE_PREPARATION_FIXTURES } from '../lib/agent-advisory-workbench/marketUpdatePreparationFixtures';

const source = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

function main() {
  for (const metric of Object.values(MARKET_METRIC_SEMANTICS)) {
    assert.equal(metric.semanticState, 'METRIC_SEMANTICS_UNRESOLVED');
    assert.equal(metric.semanticConfidence, 'UNRESOLVED');
    assert.match(metric.authoritativeDocumentationRequired, /Authoritative source documentation/i);
    assert.match(metric.displayLabel, /semantics unresolved/i);
  }
  assert.match(marketMetricSemantics('DAYS_ON_MARKET').authoritativeDocumentationRequired, /average DOM, median DOM, CDOM, ADOM/i);
  assert.match(marketMetricSemantics('MEDIAN_PRICE').authoritativeDocumentationRequired, /median list, original-list, sold, closed-sale, asking/i);

  const update = prepareAgentMarketUpdate(MARKET_UPDATE_PREPARATION_FIXTURES.prospectAllTopics);
  assert.equal(update.observations.length, 3);
  for (const observation of update.observations) {
    assert.equal(observation.semanticState, 'METRIC_SEMANTICS_UNRESOLVED');
    assert.match(observation.label, /semantics unresolved/i);
    assert.match(observation.semanticQualifier.text, /Required reconciliation/i);
  }
  assert.equal(update.observations.find((item) => item.id === 'INVENTORY')?.value.includes('active listings'), false);

  let buyer = createPropertyCriteriaProfile('BUYER_PREFERENCE');
  assert.deepEqual({ sessionOnly: buyer.sessionOnly, persistence: buyer.persistence, customerProfile: buyer.customerProfile, savedSearch: buyer.savedSearch, providerQuery: buyer.providerQuery }, { sessionOnly: true, persistence: false, customerProfile: false, savedSearch: false, providerQuery: false });
  buyer = updatePropertyCriteriaRange(buyer, 'bedrooms', { min: 4, max: 3, intent: 'MUST_HAVE' });
  assert.deepEqual(buyer.bedrooms, { min: 4, max: 4, intent: 'MUST_HAVE' });
  buyer = updatePropertyCriteriaChoice(buyer, 'propertyTypes', ['SINGLE_FAMILY', 'TOWNHOUSE'], 'PREFERRED');
  assert.deepEqual(buyer.propertyTypes, { values: ['SINGLE_FAMILY', 'TOWNHOUSE'], intent: 'PREFERRED' });
  assert.notEqual(createPropertyCriteriaProfile('SELLER_PROPERTY_FACT').context, buyer.context);

  const hierarchy = source('components/ProjectAtlasTitleHierarchy.ts');
  const sharedBriefing = source('components/agent/AgentBriefingComposition.tsx');
  const marketUpdate = source('components/agent/MarketUpdatePreparationExperience.tsx');
  const market = source('lib/agent-advisory-workbench/marketConversationExperience.ts');
  const buyerExperience = source('components/agent/BuyerConsultationExperience.tsx');
  const seller = source('components/agent/SellerConsultationExperience.tsx');
  const listing = source('components/agent/ListingPreparationExperience.tsx');
  const property = source('components/agent/PropertyConversationExperience.tsx');
  const gap = source('docs/project-atlas/executive-library/REIE-MARKET-INTELLIGENCE-SUFFICIENCY-GAP-ANALYSIS.md');
  const certification = source('docs/project-atlas/executive-library/REIE-MARKET-INTELLIGENCE-SEMANTICS-SUFFICIENCY-AND-PROPERTY-CRITERIA-FOUNDATION-CERTIFICATION.md');
  const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

  for (const token of ['briefingTitle', 'briefingSection', 'briefingSubsection', 'selectionGroup']) assert.match(hierarchy, new RegExp(token));
  for (const content of [sharedBriefing, marketUpdate]) assert.match(content, /projectAtlasTitleHierarchy\.briefingSection/);
  for (const content of [buyerExperience, seller, listing, property]) assert.match(content, /PropertyCriteriaProfileEditor/);
  assert.match(market, /marketMetricSemantics/);
  for (const requirement of ['PROJECT_ATLAS_COMPARATIVE_MARKET_REPORTING_AND_EXPORT_REQUIRED', 'PROJECT_ATLAS_VISUAL_ORIENTATION_AND_CAPABILITY_DIFFERENTIATION_REQUIRED', 'Minimum P0 Evidence Bundle']) assert.match(gap, new RegExp(requirement));
  assert.match(certification, /AUTHORITATIVE_MARKET_METRIC_METHODOLOGY_AND_HISTORICAL_EVIDENCE_READINESS_REVIEW_REQUIRED/);
  assert.equal(packageJson.scripts?.['check:market-intelligence-semantics-property-criteria-foundation'], 'jiti scripts/checkMarketIntelligenceSemanticsAndPropertyCriteriaFoundation.ts');

  for (const forbidden of ['localStorage', 'sessionStorage', 'document.cookie', 'PrismaClient', 'savedSearch', 'createSavedSearch', 'sendEmail', 'Typesense', 'CRM']) {
    assert.equal(source('components/agent/PropertyCriteriaProfileEditor.tsx').includes(forbidden), false, `Property criteria editor must not introduce ${forbidden}.`);
  }
  console.log('MARKET_INTELLIGENCE_SEMANTICS_PROPERTY_CRITERIA_FOUNDATION_CHECK: PASS');
}

main();
