import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { sanitizeAgentReturnPath } from '../lib/admin/adminAuth';
import { AGENT_LISTING_LAUNCH_HORIZONS, AGENT_LISTING_PREPARATION_PRIORITIES, buildAgentListingPreparationPacket } from '../lib/agent-advisory-workbench/agentListingPreparationAdmission';
import { AGENT_LISTING_PREPARATION_FIXTURE } from '../lib/agent-advisory-workbench/agentListingPreparationAdmissionFixtures';
import { prepareAgentListingConsultation } from '../lib/agent-advisory-workbench/agentListingConsultationPreparation';

function source(path: string) { return readFileSync(resolve(process.cwd(), path), 'utf8'); }
const page = source('app/agent/prepare/listing/page.tsx');
const experienceSource = source('components/agent/ListingPreparationExperience.tsx');
const playbookSource = source('components/agent/ListingPreparationPlaybook.tsx');
const contractSource = source('lib/agent-advisory-workbench/agentListingPreparationAdmission.ts');
const evidenceContractSource = source('lib/agent-advisory-workbench/agentListingEvidenceAdmission.ts');
const middleware = source('middleware.ts');
const shell = source('components/agent/AgentWorkspaceShell.tsx');
const auth = source('lib/admin/adminAuth.ts');
const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

assert.equal(existsSync(resolve(process.cwd(), 'app/agent/prepare/listing/page.tsx')), true);
assert.ok(page.includes("title: 'Listing Preparation | Project Atlas'"));
assert.ok(page.includes('ListingPreparationExperience'));
assert.equal(sanitizeAgentReturnPath('/agent/prepare/listing'), '/agent/prepare/listing');
assert.ok(middleware.includes('pathname === "/agent/prepare/listing"'));
assert.ok(shell.includes('href="/agent/prepare/listing"') && shell.includes('Listing Preparation'));
assert.ok(auth.includes("surface('/agent/prepare/listing'"));

const ready = prepareAgentListingConsultation(AGENT_LISTING_PREPARATION_FIXTURE);
assert.equal(ready.packet.admission, 'ADMITTED');
assert.equal(ready.packet.readiness, 'READY_WITH_LIMITATIONS');
assert.ok(ready.composition); assert.ok(ready.playbook); assert.equal(ready.composition?.surface, 'LISTING');
assert.equal(ready.humanState.label, 'Ready for your review');
assert.ok((ready.composition?.executiveBriefing.text.length ?? 0) <= 1200);
assert.equal(AGENT_LISTING_LAUNCH_HORIZONS.length, 4);
for (const horizon of AGENT_LISTING_LAUNCH_HORIZONS) assert.equal(buildAgentListingPreparationPacket({ ...AGENT_LISTING_PREPARATION_FIXTURE, launchHorizon: horizon.value }).admission, 'ADMITTED');
assert.equal(buildAgentListingPreparationPacket({ ...AGENT_LISTING_PREPARATION_FIXTURE, launchHorizon: null }).admission, 'ADMITTED');

for (const [change, reason] of [
  [{ identifiedSellerPropertyConfirmed: false }, 'AGENT_PROPERTY_CONFIRMATION_REQUIRED'],
  [{ customerContext: true }, 'PROTECTED_CONTEXT_PROHIBITED'],
  [{ persistenceRequested: true }, 'PROTECTED_CONTEXT_PROHIBITED'],
  [{ providerRuntimeRequired: true }, 'PROTECTED_CONTEXT_PROHIBITED'],
  [{ propertyIdentityProvided: true }, 'PROTECTED_CONTEXT_PROHIBITED'],
  [{ mlsDataRequested: true }, 'PROTECTED_CONTEXT_PROHIBITED'],
  [{ publicActivationRequested: true }, 'PROTECTED_CONTEXT_PROHIBITED'],
  [{ protectedClassRequest: true }, 'FAIR_HOUSING_OR_SUITABILITY_PROHIBITED'],
  [{ demographicInferenceRequested: true }, 'FAIR_HOUSING_OR_SUITABILITY_PROHIBITED'],
  [{ suitabilityConclusionRequested: true }, 'FAIR_HOUSING_OR_SUITABILITY_PROHIBITED'],
  [{ pricingRecommendationRequested: true }, 'PROFESSIONAL_CONCLUSION_PROHIBITED'],
  [{ marketingRecommendationRequested: true }, 'PROFESSIONAL_CONCLUSION_PROHIBITED'],
  [{ legalConclusionRequested: true }, 'PROFESSIONAL_CONCLUSION_PROHIBITED'],
  [{ taxAdviceRequested: true }, 'PROFESSIONAL_CONCLUSION_PROHIBITED'],
  [{ priorities: ['PRE_LISTING_READINESS'] as never }, 'GOVERNED_LISTING_TOPICS_REQUIRED'],
] as const) assert.ok(buildAgentListingPreparationPacket({ ...AGENT_LISTING_PREPARATION_FIXTURE, ...change }).reasons.includes(reason));

for (const priorities of [AGENT_LISTING_PREPARATION_FIXTURE.priorities.slice(0, 2), AGENT_LISTING_PREPARATION_FIXTURE.priorities, AGENT_LISTING_PREPARATION_PRIORITIES]) assert.equal(buildAgentListingPreparationPacket({ ...AGENT_LISTING_PREPARATION_FIXTURE, priorities }).admission, 'ADMITTED');
for (const id of ['listing-readiness', 'listing-property-facts', 'listing-condition', 'listing-presentation', 'listing-documents', 'listing-pricing-market', 'listing-marketing-data', 'listing-launch', 'listing-professional-verification']) assert.ok(ready.playbook?.sections.some((section) => section.id === id), `Missing Listing section ${id}`);
for (const step of ready.playbook?.preparationAgenda ?? []) assert.ok(step.guide.keyQuestions.length && step.guide.talkingPoints.length && step.guide.factsToConfirm.length && step.guide.professionalCheckpoints.length && step.guide.expectedOutcome);
assert.equal(ready.playbook?.protectedBoundaries.mlsActivity, false);
assert.equal(ready.playbook?.protectedBoundaries.publicActivation, false);
assert.ok(ready.playbook?.nextActionPlan.atlasContinuations.some((action) => action.href === '/agent/prepare/seller'));
assert.ok(ready.playbook?.nextActionPlan.atlasContinuations.some((action) => action.href === '/agent/prepare/place'));
assert.ok(ready.playbook?.nextActionPlan.atlasContinuations.some((action) => action.href === '/agent/prepare/property'));
assert.ok(ready.playbook?.nextActionPlan.atlasContinuations.some((action) => action.href === '/agent/prepare/market'));

for (const marker of ['agent-listing-preparation-experience', 'agent-listing-empty-state', 'agent-listing-prepare-briefing', 'agent-listing-briefing', 'agent-listing-evidence-selector', 'Agent workspace / Listing preparation', 'Prepare a seller property for the next reviewed decision', 'After Seller engagement', 'Moving toward a possible launch', 'Choose the topics to emphasize', 'Priority Focus', 'Update my briefing', 'data-persistence="false"', 'data-same-page-decision-continuity="true"']) assert.ok(experienceSource.includes(marker), `Missing Listing experience marker: ${marker}`);
for (const marker of ['agent-listing-professional-playbook', 'agent-listing-playbook-detail', 'Use in preparation', 'ATLAS continuation actions', 'DisclosureStateIndicator']) assert.ok(playbookSource.includes(marker), `Missing Listing playbook marker: ${marker}`);
assert.ok(experienceSource.includes("fetch('/api/agent/prepare/property', { cache: 'no-store', credentials: 'same-origin' })"), 'Listing may use only the existing exact Agent Property no-store selector.');
assert.ok(experienceSource.includes('encodeURIComponent(selectedCandidate.property.slug)'), 'Listing must resolve evidence through the canonical Property slug.');
for (const forbidden of ['prisma', 'createClient', 'localStorage', 'sessionStorage', 'document.cookie', 'REIE_AGENT_CREDENTIAL', 'customerName', 'leadId', 'MLS_GRID', 'IRES', 'school ranking', 'safety score', 'family friendly']) { assert.equal(contractSource.includes(forbidden), false, `Listing contract must not introduce ${forbidden}`); assert.equal(evidenceContractSource.includes(forbidden), false, `Listing evidence contract must not introduce ${forbidden}`); assert.equal(experienceSource.includes(forbidden), false, `Listing experience must not introduce ${forbidden}`); }
assert.equal(contractSource.includes('address:'), false, 'The original Listing preparation contract must not accept property address input.');
assert.equal(experienceSource.includes('address:'), false, 'Listing experience must not accept a free-form property address.');
assert.equal(packageJson.scripts?.['check:agent-listing-preparation'], 'jiti scripts/checkAgentListingPreparation.ts');
console.log('AGENT_LISTING_PREPARATION_CHECK: PASS');
