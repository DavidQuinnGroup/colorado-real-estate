import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const searchPlan = read('docs/project-atlas/executive-library/REIE-DXT-2-SEARCH-DECISION-WORKSPACE-DEPTH-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_PLAN_READY`',
  'What evidence helps the customer compare active options, understand what is missing, and decide which property deserves a closer look?',
  'Search already owns active property inventory',
  'Active visible criteria',
  'Inventory evidence available now',
  'Evidence not available from Search',
  'Provider or fallback confidence explanation',
  'Property-card next-step threshold',
  'Search -> Property -> Search return continuity',
  'Use only evidence already visible in Search',
  'Do not add provider activation',
  'Search API behavior',
  'Search ranking',
  'map rendering',
  'components/search/SearchInterface.tsx',
  'components/PropertyCard.tsx',
  'components/search/SearchControls.tsx',
  'READY_FOR_REIE_DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_PLAN_CERTIFICATION',
]) {
  assertIncludes(searchPlan, phrase, `Search workspace depth plan must include: ${phrase}`);
}

for (const prohibited of [
  'Runtime authorization: `true`',
  'shared decision-context store',
  'shared runtime abstraction authorized',
]) {
  assert(!searchPlan.includes(prohibited), `Search plan must not authorize ${prohibited}.`);
}

assertIncludes(
  chatStart,
  'DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_PLAN_READY',
  'CHAT_START must record the Search Decision Workspace Depth planning status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-search-decision-workspace-depth-plan'],
  'npm run worker:build && node dist/scripts/checkDxt2SearchDecisionWorkspaceDepthPlan.js',
  'package.json must register the DXT 2 Search workspace depth plan check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2SearchDecisionWorkspaceDepthPlan.ts',
  'tsconfig.worker.json must include the DXT 2 Search workspace depth plan check.',
);

console.log(
  '[dxt-2-search-decision-workspace-depth-plan] ok: Search depth plan, visible evidence boundaries, future ownership, and no runtime authorization verified.',
);
