import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read('docs/project-atlas/executive-library/REIE-DXT-3-ADVISORY-CONVERSATION-PREPARATION-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_ADVISORY_CONVERSATION_PREPARATION_PLAN_READY`',
  'Selected plan identifier: `ADVISORY_CONVERSATION_PREPARATION`',
  'Preferred future runtime owner: `components/AdvisoryHandoffGuide.tsx`',
  'Conditional future host file: `app/contact/page.tsx`',
  'Shared runtime finding: `ROUTE_LOCAL_OR_EXISTING_COMPONENTS_PREFERRED`',
  'CONTACT_HOST_CHANGE_NOT_REQUIRED_FOR_PLAN',
]) {
  assertIncludes(plan, phrase, `Advisory plan must include: ${phrase}`);
}

for (const hierarchy of [
  'Advisory orientation',
  'Governing question',
  'Decision being prepared',
  'Evidence reviewed',
  'Evidence still needed',
  'Assumptions',
  'Unknowns',
  'Questions to verify',
  'Conversation priority',
  'Appropriate professional pathway',
  'One dominant action',
  'Compact alternative continuations',
]) {
  assertIncludes(plan, hierarchy, `Advisory plan must include hierarchy item: ${hierarchy}`);
}

for (const boundary of [
  'No hidden transfer',
  'No persistence',
  'No telemetry',
  'No form or API changes',
  'No CRM, email, or scheduling changes',
  'No advice or representation',
  'Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.',
  'Advisory runtime implementation remains unauthorized.',
  'URL context expansion is not authorized.',
]) {
  assertIncludes(plan, boundary, `Advisory plan must preserve boundary: ${boundary}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_ADVISORY_CONVERSATION_PREPARATION_PLAN_CERTIFICATION',
  'CHAT_START must record the Advisory plan-certification gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-advisory-conversation-preparation-plan'],
  'npm run worker:build && node dist/scripts/checkDxt3AdvisoryConversationPreparationPlan.js',
  'package.json must register the DXT 3 Advisory preparation plan check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3AdvisoryConversationPreparationPlan.ts',
  'tsconfig.worker.json must include the DXT 3 Advisory preparation plan check.',
);

console.log('[dxt-3-advisory-conversation-preparation-plan] ok: Advisory preparation plan, runtime ownership, Contact host boundary, no hidden context, and certification criteria verified.');
