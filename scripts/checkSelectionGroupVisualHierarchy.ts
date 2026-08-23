import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

function main() {
  const titleHierarchy = source('components/ProjectAtlasTitleHierarchy.ts');
  const globalStyles = source('app/globals.css');
  const marketUpdate = source('components/agent/MarketUpdatePreparationExperience.tsx');
  const buyer = source('components/agent/BuyerConsultationExperience.tsx');
  const seller = source('components/agent/SellerConsultationExperience.tsx');
  const listing = source('components/agent/ListingPreparationExperience.tsx');
  const market = source('components/agent/MarketConversationExperience.tsx');
  const location = source('components/agent/PlaceConversationExperience.tsx');
  const property = source('components/agent/PropertyConversationExperience.tsx');
  const register = source('docs/project-atlas/executive-library/REIE-AGENT-WORK-GAP-AND-PRIORITY-REGISTER.md');
  const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

  assert.match(titleHierarchy, /selectionSection: 'text-\[26px\] font-semibold leading-8 text-white sm:text-\[30px\] sm:leading-9 lg:text-\[34px\] lg:leading-10'/);
  assert.match(titleHierarchy, /selectionGroup: 'text-\[22px\] font-semibold leading-7 text-white lg:text-\[30px\] lg:leading-9'/);
  assert.match(globalStyles, /\[data-agent-only="true"\] fieldset > legend:not\(\.sr-only\)/);
  for (const declaration of ['margin-bottom: 1rem', 'font-size: 1.375rem', 'font-size: 1.875rem', 'font-weight: 600', 'line-height: 1.25']) {
    assert.match(globalStyles, new RegExp(declaration));
  }

  for (const title of ['Market', 'Audience', 'Purpose', 'Topics to emphasize']) {
    assert.match(marketUpdate, new RegExp(`selectionGroup}>${title}<`));
  }
  assert.match(marketUpdate, /selectionSection/);
  assert.match(marketUpdate, /grid gap-x-6 gap-y-8 lg:grid-cols-2/);
  assert.match(buyer, /projectAtlasTitleHierarchy\.selectionGroup/);
  assert.match(buyer, /projectAtlasTitleHierarchy\.selectionSection/);
  assert.match(seller, /projectAtlasTitleHierarchy\.selectionGroup/);
  assert.match(seller, /projectAtlasTitleHierarchy\.selectionSection/);
  assert.match(listing, /<fieldset[\s\S]*<legend className=(?:\{projectAtlasTitleHierarchy\.selectionGroup\}|"text-sm font-semibold text-white")>Preparation position/);
  assert.match(globalStyles, /agent-listing-preparation-experience.*Listing preparation choices/);
  assert.doesNotMatch(buyer, /<legend[^>]*>\s*[12]\.\s*Choose/);
  assert.doesNotMatch(seller, /<legend[^>]*>\s*[12]\.\s*Choose/);

  for (const [name, experience, heading] of [
    ['Market', market, 'Choose a market'],
    ['Location', location, 'Choose one certified City'],
    ['Property', property, 'Choose one real property'],
  ] as const) {
    assert.match(experience, new RegExp(`selectionGroup}>${heading}<`), `${name} must use the shared selection heading.`);
  }

  assert.match(register, /PROJECT_ATLAS_COMPARATIVE_MARKET_REPORTING_AND_EXPORT_REQUIRED/);
  assert.match(register, /RECORDED_FUTURE_CAPABILITY_NOT_AUTHORIZED_FOR_IMPLEMENTATION/);
  assert.match(register, /multi-market selector, calculation, dataset,[\s\S]*PDF generation, report persistence, recipient/);
  assert.match(register, /PROJECT_ATLAS_VISUAL_ORIENTATION_AND_CAPABILITY_DIFFERENTIATION_REQUIRED/);
  assert.equal(packageJson.scripts?.['check:selection-group-visual-hierarchy'], 'jiti scripts/checkSelectionGroupVisualHierarchy.ts');

  console.log('PROJECT_ATLAS_SELECTION_GROUP_VISUAL_HIERARCHY_CHECK: PASS');
}

try {
  main();
} catch (error) {
  console.error('PROJECT_ATLAS_SELECTION_GROUP_VISUAL_HIERARCHY_CHECK: FAIL', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
