import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  composeAgentBriefing,
  type AgentBriefingComposition,
  type AgentBriefingTraceability,
} from '../lib/agent-advisory-workbench/agentBriefingComposition';
import { prepareMarketConversation } from '../lib/agent-advisory-workbench/marketConversationExperience';
import { prepareAgentPlaceConversation } from '../lib/agent-advisory-workbench/agentPlaceConversationPreparation';
import { prepareAgentPropertyConversation } from '../lib/agent-advisory-workbench/agentPropertyConversationPreparation';
import { AGENT_PROPERTY_PREPARATION_FIXTURES } from '../lib/agent-advisory-workbench/agentPropertyPreparationAdmissionFixtures';

const source = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const trace = (evidenceKeys: readonly string[]): AgentBriefingTraceability => ({ sourceReferences: ['deterministic-source'], evidenceKeys, freshness: 'CURRENT', compositionRule: 'DIRECT_RENDER' });

function validComposition(overrides: Partial<AgentBriefingComposition> = {}) {
  return {
    surface: 'MARKET' as const,
    subject: 'Deterministic market',
    executiveBriefing: { id: 'executive', contentClass: 'DIRECT_FACT' as const, text: 'A supported fact.', traceability: trace(['executive']) },
    whatMatters: [{ id: 'matters', contentClass: 'LIMITATION' as const, text: 'A bounded interpretation.', traceability: { ...trace(['matters']), compositionRule: 'LIMITATION_RENDER' as const } }],
    whyItMatters: [{ id: 'why', contentClass: 'LIMITATION' as const, text: 'A limited conclusion.', traceability: { ...trace(['why']), compositionRule: 'LIMITATION_RENDER' as const } }],
    keyEvidence: [{ id: 'evidence', label: 'Evidence', value: 'One', contentClass: 'DIRECT_FACT' as const, text: 'One', traceability: trace(['evidence']) }],
    whatCouldChangeInterpretation: [{ id: 'change', contentClass: 'VERIFICATION_TRIGGER' as const, text: 'A material change.', traceability: { ...trace(['change']), compositionRule: 'VERIFICATION_TRIGGER_RENDER' as const } }],
    questionsWorthAsking: [{ id: 'question', text: 'What material fact should be verified?', triggerEvidenceKeys: ['change'] }],
    reviewSurfaces: [{ id: 'sources', label: 'Sources', href: '/sources' }],
    sourcesFreshnessLimitations: [{ id: 'limitation', contentClass: 'LIMITATION' as const, text: 'A source limitation.', traceability: { ...trace(['limitation']), compositionRule: 'LIMITATION_RENDER' as const } }],
    professionalCheckpoints: [],
    ...overrides,
  };
}

const market = prepareMarketConversation('boulder-co-housing-market', '2026-08-20');
assert.equal(market.composition?.surface, 'MARKET');
assert.match(market.composition?.executiveBriefing.text || '', /58 active inventory signal/);
assert.match(market.composition?.executiveBriefing.text || '', /22 days-on-market context/);
assert.match(market.composition?.executiveBriefing.text || '', /\$1,450,000 median-price context/);
assert.equal(market.composition?.questionsWorthAsking.length, 2);
assert.equal(market.composition?.professionalCheckpoints.length, 0, 'Market must not hand routine judgment back to the current Agent.');

const place = prepareAgentPlaceConversation('reie-city:boulder-co-real-estate');
assert.equal(place.briefing?.composition.surface, 'PLACE');
assert.match(place.briefing?.composition.executiveBriefing.text || '', /compact front range city/i);
assert.equal(place.briefing?.composition.questionsWorthAsking.length, 2);
assert.ok(place.briefing?.composition.professionalCheckpoints.every((checkpoint) => checkpoint.role !== 'REAL ESTATE AGENT'));

const propertyFixture = AGENT_PROPERTY_PREPARATION_FIXTURES.admissible;
const property = prepareAgentPropertyConversation({ property: propertyFixture.property, sourcePosture: propertyFixture.sourcePosture });
assert.equal(property.composition?.surface, 'PROPERTY');
assert.match(property.composition?.executiveBriefing.text || '', /active/);
assert.ok((property.composition?.questionsWorthAsking.length || 0) <= 5);

assert.throws(() => composeAgentBriefing(validComposition({ executiveBriefing: { id: 'bad', contentClass: 'VERIFICATION_TRIGGER', text: 'Verify first.', traceability: { ...trace(['bad']), compositionRule: 'VERIFICATION_TRIGGER_RENDER' } } })), /Executive briefing cannot lead/);
assert.throws(() => composeAgentBriefing(validComposition({
  whatMatters: Array.from({ length: 4 }, (_, index) => ({ id: `duplicate-${index}`, contentClass: 'DIRECT_FACT' as const, text: `Repeated ${index}`, traceability: trace(['executive']) })),
})), /duplication/);
assert.throws(() => composeAgentBriefing(validComposition({ professionalCheckpoints: [{ id: 'self', role: 'REAL_ESTATE_AGENT', question: 'Do your job.', traceability: { ...trace(['self']), compositionRule: 'PROFESSIONAL_CHECKPOINT_RENDER' } }] })), /redundant Real Estate Agent handoff/);

const shell = source('components/agent/AgentPreparationPageHeader.tsx');
const renderer = source('components/agent/AgentBriefingComposition.tsx');
const marketExperience = source('components/agent/MarketConversationExperience.tsx');
const placeExperience = source('components/agent/PlaceConversationExperience.tsx');
const propertyExperience = source('components/agent/PropertyConversationExperience.tsx');
const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

for (const title of ['MARKET PREPARATION', 'PLACE PREPARATION', 'PROPERTY PREPARATION', 'BUYER PREPARATION']) assert(shell.includes(title), `${title} must be a shared page identity.`);
for (const heading of ['Prepare for a market conversation', 'Prepare for a place conversation', 'Prepare for a property conversation']) assert([marketExperience, placeExperience, propertyExperience].some((content) => content.includes(heading)), `${heading} must remain a separate task heading.`);
for (const marker of ['Executive briefing', 'What matters', 'Why it matters', 'Key evidence', 'What could change the interpretation', 'Questions worth asking', 'Next actions', 'Sources, freshness &amp; limitations', 'agent-briefing-progressive-details']) assert(renderer.includes(marker), `Shared briefing renderer must include ${marker}.`);
for (const content of [renderer, marketExperience, placeExperience]) {
  for (const forbidden of ['localStorage', 'sessionStorage', 'document.cookie', 'fetch(', 'CRM', 'customerName', 'MLS_GRID', 'IRES', 'ATTOM', 'LightBox', 'recommendation: true', 'suitability: true']) assert.equal(content.includes(forbidden), false, `Briefing UI must not introduce ${forbidden}.`);
}
for (const forbidden of ['localStorage', 'sessionStorage', 'document.cookie', 'CRM', 'customerName', 'MLS_GRID', 'IRES', 'ATTOM', 'LightBox', 'recommendation: true', 'suitability: true']) assert.equal(propertyExperience.includes(forbidden), false, `Property briefing UI must not introduce ${forbidden}.`);
assert.ok(propertyExperience.includes("fetch('/api/agent/prepare/property', { cache: 'no-store', credentials: 'same-origin' })") && propertyExperience.includes("fetch(`/api/agent/prepare/property?property=${encodeURIComponent(selectedCandidate.property.slug)}`"), 'Property briefing UI may use only its exact private no-store selector and selected-detail reads.');
assert.equal(packageJson.scripts?.['check:agent-briefing-composition'], 'jiti scripts/checkAgentBriefingComposition.ts');

console.log('AGENT_BRIEFING_COMPOSITION_CHECK: PASS');
