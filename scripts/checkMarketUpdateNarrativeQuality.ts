import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  MARKET_UPDATE_NARRATIVE_CLASSES,
  prepareAgentMarketUpdate,
  type MarketUpdateNarrativeStatement,
} from '../lib/agent-advisory-workbench/marketUpdatePreparation';
import { MARKET_UPDATE_PREPARATION_FIXTURES } from '../lib/agent-advisory-workbench/marketUpdatePreparationFixtures';

const source = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

function statements(preparation: ReturnType<typeof prepareAgentMarketUpdate>) {
  return [
    preparation.executiveSummary,
    preparation.evidenceSynthesis,
    preparation.whatCouldChangeInterpretation,
    preparation.audienceContext,
    ...preparation.observations.flatMap((item) => [item.directObservation, item.plainLanguageDescription, item.semanticQualifier]),
    ...preparation.talkingPoints,
    ...preparation.clientFriendlyExplanations,
    ...preparation.questionsWorthAsking,
    ...preparation.interpretationLimits,
    ...preparation.verificationCheckpoints,
    ...preparation.agentNextActions,
    ...(preparation.optionalDraftLanguage ? [preparation.optionalDraftLanguage] : []),
  ] satisfies readonly MarketUpdateNarrativeStatement[];
}

function main() {
  const buyer = prepareAgentMarketUpdate(MARKET_UPDATE_PREPARATION_FIXTURES.buyerInventory);
  const seller = prepareAgentMarketUpdate(MARKET_UPDATE_PREPARATION_FIXTURES.sellerPrice);
  const homeowner = prepareAgentMarketUpdate(MARKET_UPDATE_PREPARATION_FIXTURES.homeownerDaysOnMarket);
  const prospect = prepareAgentMarketUpdate(MARKET_UPDATE_PREPARATION_FIXTURES.prospectAllTopics);
  const general = prepareAgentMarketUpdate(MARKET_UPDATE_PREPARATION_FIXTURES.generalInventory);

  assert.equal(prospect.observations.length, 3);
  assert.equal(prospect.sourceFreshness.length, 3);
  assert.match(prospect.observations[0].value, /reported inventory/i);
  assert.equal(prospect.observations[0].semanticState, 'METRIC_SEMANTICS_UNRESOLVED');
  assert.match(homeowner.observations[0].semanticQualifier.text, /average DOM, median DOM, CDOM, ADOM/i);
  assert.match(seller.observations[0].semanticQualifier.text, /median list, original-list, sold, closed-sale, asking/i);
  assert.match(prospect.evidenceSynthesis.text, /different views of the same/i);
  assert.match(prospect.whatCouldChangeInterpretation.text, /prior-period comparison/i);
  assert.match(prospect.optionalDraftLanguage?.text ?? '', /point-in-time reference/i);
  assert.notEqual(buyer.audienceContext.text, general.audienceContext.text, 'Audience must materially change the explanation.');
  assert.notEqual(buyer.audienceContext.text, prospect.audienceContext.text, 'Purpose must remain visible in the explanation.');

  for (const entry of prospect.sourceFreshness) {
    assert.ok(entry.evidenceId);
    assert.ok(entry.market);
    assert.ok(entry.sourceDate);
    assert.ok(entry.atlasObservedDate);
    assert.ok(entry.sourceId);
    assert.equal(entry.verificationStatus, 'PROFESSIONAL_VERIFICATION_REQUIRED');
  }

  for (const narrative of [buyer, seller, homeowner, prospect, general].flatMap(statements)) {
    assert.ok(MARKET_UPDATE_NARRATIVE_CLASSES.includes(narrative.class), `Unsupported narrative class: ${narrative.class}`);
    assert.ok(narrative.text.trim(), 'Narrative statements must have text.');
  }

  const renderedNarrative = statements(prospect).map((item) => item.text).join('\\n');
  for (const mechanicalPhrase of ['active inventory signal', 'days-on-market context', 'median-price context', 'one market-level signal', 'It helps frame questions']) {
    assert.equal(renderedNarrative.includes(mechanicalPhrase), false, `Mechanical phrase remains: ${mechanicalPhrase}`);
  }
  for (const unsupportedClaim of ['Inventory is high.', 'Inventory is low.', 'The market is cooling.', 'The market is heating up.', "This is a buyer's market.", "This is a seller's market."]) {
    assert.equal(renderedNarrative.includes(unsupportedClaim), false, `Unsupported market claim remains: ${unsupportedClaim}`);
  }

  const experience = source('components/agent/MarketUpdatePreparationExperience.tsx');
  const contract = source('lib/agent-advisory-workbench/marketUpdatePreparation.ts');
  const futureRequirements = source('docs/project-atlas/executive-library/REIE-AGENT-WORK-GAP-AND-PRIORITY-REGISTER.md');
  const certification = source('docs/project-atlas/executive-library/REIE-MARKET-UPDATE-NARRATIVE-AND-INTELLIGENCE-QUALITY-2.0-CERTIFICATION.md');
  const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };
  for (const marker of ['item.plainLanguageDescription.text', 'item.evidenceId', 'item.sourceDate', 'item.atlasObservedDate', 'item.verificationStatus', 'preparation.evidenceSynthesis.text', 'preparation.whatCouldChangeInterpretation.text']) assert.match(experience, new RegExp(marker.replaceAll('.', '\\.')));
  assert.match(contract, /sessionOnly: true/);
  assert.match(contract, /persistence: false/);
  assert.match(contract, /providerActivity: false/);
  assert.match(futureRequirements, /PROJECT_ATLAS_COMPARATIVE_MARKET_REPORTING_AND_EXPORT_REQUIRED/);
  assert.match(futureRequirements, /PROJECT_ATLAS_VISUAL_ORIENTATION_AND_CAPABILITY_DIFFERENTIATION_REQUIRED/);
  assert.match(certification, /PROJECT_ATLAS_MARKET_UPDATE_NARRATIVE_AND_INTELLIGENCE_QUALITY_2_0_CERTIFIED/);
  assert.match(certification, /READY_FOR_EXECUTIVE_MARKET_UPDATE_QUALITY_2_0_HUMAN_TEST/);
  assert.equal(packageJson.scripts?.['check:market-update-narrative-quality'], 'jiti scripts/checkMarketUpdateNarrativeQuality.ts');

  console.log('MARKET_UPDATE_NARRATIVE_QUALITY_CHECK: PASS');
}

main();
