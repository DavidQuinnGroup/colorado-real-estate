import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const component = read('components/TransitionDecisionPreparationComposition.tsx');
const page = read('app/grand-plan/page.tsx');

const requiredComponentTokens = [
  "'use client'",
  'useState',
  'Planning a housing transition?',
  'Prepare for a housing transition',
  'data-transition-decision-preparation="guided-eligible"',
  'data-transition-ephemeral-state="true"',
  'data-transition-persistence="false"',
  'data-transition-hidden-transfer="false"',
  'data-transition-inference="false"',
  'data-transition-telemetry="false"',
  'Goals and timing',
  'Property and maintenance',
  'Conversation preparation',
  'temporary arrangement',
  'recurring costs',
  'observable property features',
  'family or people you trust',
  'tax professional',
  'current source or professional review',
];

for (const token of requiredComponentTokens) {
  assert(component.includes(token), `Missing required transition composition token: ${token}`);
}

assert(page.includes("import TransitionDecisionPreparationComposition from '@/components/TransitionDecisionPreparationComposition';"));
assert(page.includes('<TransitionDecisionPreparationComposition />'));

const prohibitedComponentTokens = [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'URLSearchParams',
  'useRouter',
  'router.',
  'fetch(',
  'axios',
  'supabase',
  'prisma',
  'telemetry(',
  'analytics.',
  'Senior',
  'senior',
  'Elder',
  'elder',
  'retirement housing',
  'recommendation',
  'recommend a',
  'suitability',
  'accessibility certification',
  'protected class',
];

for (const token of prohibitedComponentTokens) {
  assert(!component.includes(token), `Prohibited transition composition token found: ${token}`);
}

assert(!component.includes('href='), 'The transition composition must not create cross-journey navigation.');
assert(!component.includes('onSubmit'), 'The transition composition must not submit or persist customer selections.');

console.log('TRANSITION_DECISION_PREPARATION_GRAND_PLAN_COMPOSITION_CHECK: PASS');
