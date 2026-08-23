import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

function main() {
  const experience = source('components/agent/PropertyConversationExperience.tsx');
  const repository = source('lib/agent-advisory-workbench/agentPropertyConversationPreparationRepository.ts');
  const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };
  const certification = source('docs/project-atlas/executive-library/REIE-PROPERTY-PREPARATION-ADDRESS-AUTOCOMPLETE-CERTIFICATION.md');

  assert.match(experience, /AUTOCOMPLETE_DEBOUNCE_MS = 250/);
  assert.match(experience, /window\.setTimeout\(\(\) => \{/);
  assert.match(experience, /void searchCandidates\(searchQuery\);/);
  assert.match(experience, /explicitSearchQuery\.current === searchQuery/);
  assert.match(experience, /if \(searchQuery\.length < 2\)/);
  assert.equal(experience.includes("fetch('/api/agent/prepare/property', { cache: 'no-store', credentials: 'same-origin' })"), false, 'Autocomplete must not restore initial candidate loading.');
  for (const marker of ['role="combobox"', 'aria-autocomplete="list"', 'aria-controls={PROPERTY_AUTOCOMPLETE_LISTBOX_ID}', 'aria-activedescendant=', 'role="listbox"', 'role="option"', 'agent-property-autocomplete-list']) assert.match(experience, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  for (const key of ['ArrowDown', 'ArrowUp', 'Enter', 'Escape']) assert.match(experience, new RegExp(`event\\.key === '${key}'`));
  assert.match(experience, /onClick=\{\(\) => selectCandidate\(candidate\)\}/);
  assert.match(experience, /setIsSuggestionListOpen\(false\)/);
  assert.match(experience, /PropertyCriteriaProfileEditor context="PROPERTY_REVIEW"/);
  assert.match(repository, /AGENT_PROPERTY_SEARCH_RESULT_LIMIT = 8/);
  assert.match(repository, /AGENT_PROPERTY_SEARCH_MINIMUM_QUERY_LENGTH = 2/);
  for (const forbidden of ['localStorage', 'sessionStorage', 'createSavedSearch', 'sendEmail', 'Typesense', 'CRM']) assert.equal(experience.includes(forbidden), false, `${forbidden} must not enter Property Preparation.`);
  assert.match(certification, /PROJECT_ATLAS_PROPERTY_ADDRESS_AUTOCOMPLETE_CERTIFIED/);
  assert.equal(packageJson.scripts?.['check:property-preparation-address-autocomplete'], 'jiti scripts/checkPropertyPreparationAddressAutocomplete.ts');

  console.log('PROPERTY_PREPARATION_ADDRESS_AUTOCOMPLETE_CHECK: PASS');
}

main();
