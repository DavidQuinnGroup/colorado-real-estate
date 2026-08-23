import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

function main() {
  const experience = source('components/agent/PropertyConversationExperience.tsx');
  const api = source('app/api/agent/prepare/property/route.ts');
  const repository = source('lib/agent-advisory-workbench/agentPropertyConversationPreparationRepository.ts');
  const criteria = source('components/agent/PropertyCriteriaProfileEditor.tsx');
  const certification = source('docs/project-atlas/executive-library/REIE-PROPERTY-PREPARATION-SEARCH-ON-DEMAND-CERTIFICATION.md');
  const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

  assert.match(repository, /AGENT_PROPERTY_SEARCH_RESULT_LIMIT = 8/);
  assert.match(repository, /AGENT_PROPERTY_SEARCH_MINIMUM_QUERY_LENGTH = 2/);
  assert.match(repository, /query\.length < AGENT_PROPERTY_SEARCH_MINIMUM_QUERY_LENGTH/);
  assert.match(repository, /query\.length > MAX_AGENT_PROPERTY_SEARCH_QUERY_LENGTH/);
  assert.match(experience, /data-search-state=\{candidateSearchState\} aria-live="polite"/);
  for (const marker of ['agent-property-search-empty', 'agent-property-search-too-short', 'agent-property-candidates-loading', 'agent-property-unavailable', 'agent-property-selected', 'agent-property-search-submit']) assert.match(experience, new RegExp(marker));
  assert.equal(experience.includes("fetch('/api/agent/prepare/property', { cache: 'no-store', credentials: 'same-origin' })"), false, 'The Property page must not auto-load candidates.');
  assert.match(experience, /PropertyCriteriaProfileEditor context="PROPERTY_REVIEW"/);
  assert.match(api, /if \(!request\.nextUrl\.searchParams\.has\('q'\)\)/);
  assert.match(repository, /Property Preparation uses the bounded search function below/);
  assert.match(api, /state: 'QUERY_TOO_SHORT'/);
  assert.match(api, /searchAgentPropertyConversationCandidateSummaries\(query\)/);
  assert.match(repository, /OR: \[/);
  for (const field of ['address', 'city', 'zip', 'propertyType', 'neighborhood', 'mlsId']) assert.match(repository, new RegExp(field));
  assert.match(repository, /take: AGENT_PROPERTY_SEARCH_RESULT_LIMIT/);
  for (const marker of ['Open question means the characteristic still needs discussion', 'aria-label={`${intentLabel} intent`}', 'focus:ring-2 focus:ring-cyan-100']) assert.match(criteria, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  for (const forbidden of ['localStorage', 'sessionStorage', 'createSavedSearch', 'sendEmail', 'Typesense', 'CRM']) assert.equal(experience.includes(forbidden), false, `${forbidden} must not enter Property Preparation.`);
  assert.match(certification, /PROJECT_ATLAS_PROPERTY_SEARCH_ON_DEMAND_CERTIFIED/);
  assert.match(certification, /PROJECT_ATLAS_PROPERTY_CRITERIA_FOUNDATION_UX_REFINED/);
  assert.equal(packageJson.scripts?.['check:property-preparation-search-on-demand'], 'jiti scripts/checkPropertyPreparationSearchOnDemand.ts');

  console.log('PROPERTY_PREPARATION_SEARCH_ON_DEMAND_CHECK: PASS');
}

main();
