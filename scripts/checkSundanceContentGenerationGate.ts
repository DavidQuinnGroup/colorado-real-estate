import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SUNDANCE_CONTENT_GENERATION_GATE_FIXTURES } from '../lib/sundanceContentGenerationGateFixtures';
import { SUNDANCE_AI_GENERATION_AUTHORIZATION, SUNDANCE_CONTENT_GENERATION_PREREQUISITES, evaluateSundanceContentGenerationGate } from '../lib/sundanceContentGenerationGate';
import { SUNDANCE_SOURCE_LOCKED_INPUT_ONLY } from '../lib/sundanceSourceLockedDraftInput';

const ready = evaluateSundanceContentGenerationGate(SUNDANCE_CONTENT_GENERATION_GATE_FIXTURES.humanDraftReady);
assert.equal(ready.eligibility, 'READY_FOR_HUMAN_DRAFT_PREPARATION');
assert.equal(ready.aiGenerationAuthorized, false);
for (const fixture of Object.values(SUNDANCE_CONTENT_GENERATION_GATE_FIXTURES).slice(1)) {
  const result = evaluateSundanceContentGenerationGate(fixture);
  assert.equal(result.aiGenerationAuthorized, false);
  assert.equal(result.createsArticleBody, false); assert.equal(result.createsRoute, false);
  assert.equal(result.createsPublication, false); assert.equal(result.createsIndexability, false); assert.equal(result.createsSitemapMembership, false);
}
assert.ok(evaluateSundanceContentGenerationGate(SUNDANCE_CONTENT_GENERATION_GATE_FIXTURES.unsourcedInputExpansion).reasons.includes('SOURCE_LOCKED_INPUT_REQUIRED'));
assert.ok(evaluateSundanceContentGenerationGate(SUNDANCE_CONTENT_GENERATION_GATE_FIXTURES.aiGenerationAttempt).reasons.includes(SUNDANCE_AI_GENERATION_AUTHORIZATION));
assert.equal(SUNDANCE_CONTENT_GENERATION_PREREQUISITES.length, 14);
assert.equal(SUNDANCE_SOURCE_LOCKED_INPUT_ONLY, true);
const source = fs.readFileSync('lib/sundanceContentGenerationGate.ts', 'utf8');
for (const legacy of ['generateNeighborhoodArticle', 'generateBuyerGuide', 'generateMarketArticle', 'publishArticle', 'scheduleContent']) assert.ok(!source.includes(legacy));
console.log('SUNDANCE_CONTENT_GENERATION_GATE_CHECK: PASS');
console.log('ai_generation_authorized=false');
console.log('publication_indexability_sitemap=false');
