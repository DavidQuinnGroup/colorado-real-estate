import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read('docs/project-atlas/executive-library/REIE-DXT-2-MARKET-CITY-MARKET-DECISION-READINESS-DEPTH-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_2_MARKET_CITY_MARKET_DECISION_READINESS_DEPTH_PLAN_READY`',
  'Selected next bounded phase: `MARKET_CITY_MARKET_DECISION_READINESS_DEPTH`',
  'Runtime authorization: `false`',
  'Market and City Market Decision Readiness Depth',
  'app/market/page.tsx',
  'app/market/[city]/page.tsx',
  'Directional versus verified treatment',
  'Qualitative confidence boundaries',
  'Conditions that justify moving to Search',
  'Conditions that justify inspecting neighborhoods',
  'Conditions that justify opening Property',
  'No neighborhood ranking',
  'No neighborhood ranking, best-neighborhood claim, safety conclusion, school-quality conclusion, protected-class steering',
  'no shared runtime abstraction',
  'READY_FOR_REIE_DXT_2_MARKET_CITY_MARKET_DECISION_READINESS_DEPTH_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
]) {
  assertIncludes(plan, phrase, `Market/City Market readiness plan must include: ${phrase}`);
}

for (const prohibited of [
  'Runtime authorization: `true`',
  'provider activation authorized',
  'shared decision-context store',
  'shared runtime abstraction authorized',
]) {
  assert(!plan.includes(prohibited), `Market/City Market plan must not authorize ${prohibited}.`);
}

assertIncludes(
  chatStart,
  'DXT_2_MARKET_CITY_MARKET_DECISION_READINESS_DEPTH_PLAN_READY',
  'CHAT_START must record the Market and City Market readiness planning status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-market-city-market-decision-readiness-depth-plan'],
  'npm run worker:build && node dist/scripts/checkDxt2MarketCityMarketDecisionReadinessDepthPlan.js',
  'package.json must register the DXT 2 Market and City Market readiness plan check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2MarketCityMarketDecisionReadinessDepthPlan.ts',
  'tsconfig.worker.json must include the DXT 2 Market and City Market readiness plan check.',
);

console.log(
  '[dxt-2-market-city-market-decision-readiness-depth-plan] ok: Market and City Market next-phase planning, ownership, and protected boundaries verified.',
);
