import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  REIE_DECISION_INTELLIGENCE_COHESION_STATUS,
  buildReieDecisionIntelligenceCohesionProfile,
  type ReieDecisionCohesionSurface,
} from '../lib/reieDecisionIntelligenceCohesion.js';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const cohesionModel = read('lib/reieDecisionIntelligenceCohesion.ts');
const journeyPanel = read('components/JourneyCohesionPanel.tsx');
const continueDecision = read('components/ContinueYourDecision.tsx');
const homepage = read('app/page.tsx');
const comparePage = read('app/compare/page.tsx');
const buyerPage = read('app/buy/page.tsx');
const sellerPage = read('app/sell/page.tsx');
const homeWorthPage = read('app/home-worth/page.tsx');
const grandPlanPage = read('app/grand-plan/page.tsx');
const contactPage = read('app/contact/page.tsx');
const propertyPage = read('app/properties/[id]/page.tsx');
const chatStart = read('docs/CHAT_START.md');
const executiveRecord = read('docs/project-atlas/executive-library/REIE-DECISION-INTELLIGENCE-COHESION-IMPLEMENTATION.md');

assert.equal(
  packageJson.scripts?.['check:reie-decision-intelligence-cohesion'],
  'npm run worker:build && node dist/scripts/checkReieDecisionIntelligenceCohesion.js',
  'package.json must expose the REIE Decision Intelligence Cohesion check.',
);
assertIncludes(tsconfig, 'scripts/checkReieDecisionIntelligenceCohesion.ts', 'Worker build must include the cohesion check.');
assertIncludes(tsconfig, 'lib/reieDecisionIntelligenceCohesion.ts', 'Worker build must include the shared cohesion model.');

assert.equal(REIE_DECISION_INTELLIGENCE_COHESION_STATUS, 'REIE_DECISION_INTELLIGENCE_COHESION_IMPLEMENTED');

const representativeSurfaces: ReieDecisionCohesionSurface[] = [
  'home',
  'search',
  'market',
  'property',
  'buyer',
  'seller',
  'home-worth',
  'compare',
  'grand-plan',
  'contact',
];

for (const surface of representativeSurfaces) {
  const profile = buildReieDecisionIntelligenceCohesionProfile(surface);
  assert.equal(profile.status, REIE_DECISION_INTELLIGENCE_COHESION_STATUS);
  assert.equal(profile.evidenceLanguageModel, 'CUSTOMER_FACING_EVIDENCE_LANGUAGE');
  assert.equal(profile.continuationModel, 'CURRENT_DECISION_NEXT_QUESTION_RELEVANT_TOOL_OPTIONAL_HANDOFF');
  assert.equal(profile.sourceMethodologyHref, '/sources');
  assert.equal(profile.cues.length, 3, `${surface} must expose three concise customer-facing evidence cues.`);
  assert(profile.cues.some((cue) => cue.label === 'Verification required' || cue.label === 'Professional judgment'), `${surface} must keep verification or professional review visible.`);
  for (const boundary of Object.values(profile.protectedBoundaries)) {
    assert.equal(boundary, false, `${surface} protected boundary must remain false.`);
  }
}

for (const label of [
  'Supported fact',
  'Derived / calculated',
  'Assumption',
  'Unavailable',
  'Verification required',
  'Professional judgment',
]) {
  assertIncludes(cohesionModel, label, `Shared model must retain customer-facing evidence label: ${label}`);
}

for (const marker of [
  'data-reie-decision-intelligence-cohesion={cohesionProfile.status}',
  'data-reie-evidence-language-model={cohesionProfile.evidenceLanguageModel}',
  'data-reie-continuation-model={cohesionProfile.continuationModel}',
  'data-reie-source-methodology-href={cohesionProfile.sourceMethodologyHref}',
  'data-reie-hidden-transfer={String(cohesionProfile.protectedBoundaries.hiddenStateTransfer)}',
  'data-reie-source-registry-change={String(cohesionProfile.protectedBoundaries.sourceRegistryChange)}',
  'data-reie-professional-judgment-required="true"',
  'data-testid="reie-decision-intelligence-cohesion-cues"',
  'data-testid="reie-decision-intelligence-evidence-cue"',
  'data-testid="reie-decision-intelligence-source-methodology-link"',
  'Sources & Methodology',
]) {
  assertIncludes(journeyPanel, marker, `JourneyCohesionPanel missing cohesion marker: ${marker}`);
}

for (const marker of [
  'buildReieDecisionIntelligenceCohesionProfile(surfaceForStage(stage))',
  'data-reie-decision-intelligence-cohesion={cohesionProfile.status}',
  'data-reie-source-methodology-href={cohesionProfile.sourceMethodologyHref}',
  'data-testid="continue-your-decision-cohesion-cues"',
  'data-testid="reie-decision-intelligence-source-methodology-link"',
  'Sources & Methodology',
]) {
  assertIncludes(continueDecision, marker, `ContinueYourDecision missing cohesion marker: ${marker}`);
}

for (const [source, surface] of [
  [homepage, 'home'],
  [propertyPage, 'property'],
] as const) {
  assertIncludes(source, 'ContinueYourDecision', `${surface} must retain certified route-continuity component.`);
}

for (const [source, surface] of [
  [comparePage, 'compare'],
  [buyerPage, 'buyer'],
  [sellerPage, 'seller'],
  [homeWorthPage, 'home-worth'],
  [grandPlanPage, 'grand-plan'],
  [contactPage, 'contact'],
] as const) {
  assertIncludes(source, 'JourneyCohesionPanel', `${surface} must retain shared journey cohesion component.`);
  assertIncludes(source, `surface="${surface}"`, `${surface} must preserve explicit cohesion surface identity.`);
}

for (const source of [cohesionModel, journeyPanel, continueDecision]) {
  for (const prohibitedRuntime of [
    'fetch(',
    'PrismaClient',
    'createClient(',
    'process.env',
    'navigator.sendBeacon',
    'localStorage',
    'sessionStorage',
    'document.cookie',
    'FormData',
    '<form',
    '<input',
    '<textarea',
  ]) {
    assertNotIncludes(source, prohibitedRuntime, `Decision cohesion must not introduce protected runtime behavior: ${prohibitedRuntime}`);
  }
}

for (const source of [cohesionModel, journeyPanel, continueDecision]) {
  for (const prohibitedClaim of [
    'best neighborhood',
    'safest neighborhood',
    'school ranking',
    'safety ranking',
    'investment recommendation',
    'suitability conclusion',
    'valuation certainty',
    'financial qualification',
    'preferred lender',
    'automated valuation conclusion',
    'personalized recommendation',
    'AI-powered recommendation',
  ]) {
    assertNotIncludes(source, prohibitedClaim, `Decision cohesion must not introduce prohibited claim: ${prohibitedClaim}`);
  }
}

assertIncludes(executiveRecord, 'REIE_DECISION_INTELLIGENCE_COHESION_LOCALLY_CERTIFIED', 'Executive record must capture local certification status.');
assertIncludes(executiveRecord, 'No push occurred.', 'Executive record must preserve no-push boundary.');
assertIncludes(chatStart, 'REIE_DECISION_INTELLIGENCE_COHESION_LOCALLY_CERTIFIED', 'CHAT_START must carry current local handoff status.');
assertIncludes(chatStart, 'READY_FOR_REIE_DECISION_INTELLIGENCE_COHESION_PUSH_AUTHORIZATION', 'CHAT_START must name the next push gate.');

console.log('[reie-decision-intelligence-cohesion] ok: shared evidence language, source cues, decision continuity metadata, protected boundaries, docs, and no protected runtime changes verified.');
