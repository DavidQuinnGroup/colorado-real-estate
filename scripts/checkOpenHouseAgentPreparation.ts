import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  buildOpenHouseAgentPreparationPacket,
  OPEN_HOUSE_AGENT_PREPARATION_PACKET_STATUS,
  type OpenHouseAgentPreparationInput,
} from '../lib/openHouseAgentPreparation.js';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[open-house-agent-preparation] ${message}`);
}

function assertIncludes(values: readonly string[], expected: string, message: string) {
  assert(values.some((value) => value.includes(expected)), message);
}

const fixedInput: OpenHouseAgentPreparationInput = {
  generatedAt: '2026-08-14T12:00:00.000Z',
  eventLabel: 'Saturday factual preparation',
  eventDateTimeLabel: 'Saturday, August 16, 2026, 11:00 AM–1:00 PM',
  property: {
    id: 'fixture-open-house-101',
    address: '101 Fixture Lane',
    city: 'Boulder',
    state: 'CO',
    neighborhood: 'Fixture Neighborhood',
    facts: {
      price: 850000,
      status: 'Active',
      propertyType: 'Single family',
      beds: 3,
      baths: 2,
      squareFeet: 1800,
      lotSize: 0.15,
      yearBuilt: 1988,
      otherFacts: [{ label: 'Garage', value: 'Two-car attached' }],
    },
  },
  sourceEvidence: {
    sourceIdentity: 'Fixture governed listing record',
    visibleTimestamp: '2026-08-14T09:00:00.000Z',
    unavailableEvidence: ['Verified improvement history'],
    limitations: ['Listing facts require independent verification before reliance.'],
    verificationRequirements: ['Confirm inclusions with the listing agent.'],
  },
  marketContext: {
    facts: [{ label: 'Supplied market snapshot', value: 'Inventory context supplied for review', visibleTimestamp: '2026-08-13' }],
    limitations: ['Do not infer a trend from this single supplied context item.'],
    verificationRequirements: ['Confirm the date and source before discussing market context.'],
  },
};

const packet = buildOpenHouseAgentPreparationPacket(fixedInput);
assert(packet.status === 'READY_FOR_AGENT_REVIEW', 'valid explicit property packet must be ready for agent review');
assert(packet.contract === OPEN_HOUSE_AGENT_PREPARATION_PACKET_STATUS, 'packet must expose its contract identity');
assert(packet.property?.address === '101 Fixture Lane', 'packet must preserve supplied property identity');
assert(packet.event.label === fixedInput.eventLabel, 'packet must preserve optional event label');
assert(packet.event.dateTimeLabel === fixedInput.eventDateTimeLabel, 'packet must preserve optional event date label');
assert(packet.marketContext.state === 'SUPPLIED_CONTEXT', 'packet must preserve supplied market context');
assert(packet.sourceEvidence.timestampState === 'VISIBLE_TIMESTAMP', 'packet must preserve supplied source timestamp');
assertIncludes(packet.limitations, 'Unavailable evidence: Verified improvement history', 'packet must expose unavailable evidence');
assert(packet.visitorQuestionPreparation.length >= 4, 'packet must produce neutral visitor-question preparation');
assert(packet.talkingPointInputs.length >= 4, 'packet must produce factual talking-point inputs');
assert(packet.eventPreparationChecklist.length >= 5, 'packet must produce an event-preparation checklist');
assert(packet.fairHousingReminders.length >= 3, 'packet must provide fair-housing reminders');
assert(packet.humanJudgmentBoundary.length >= 3, 'packet must preserve human responsibility');
assert(packet.protectedBoundaries.ranking === false, 'packet must prohibit ranking');
assert(packet.protectedBoundaries.valuation === false, 'packet must prohibit valuation');
assert(packet.protectedBoundaries.pricingRecommendation === false, 'packet must prohibit pricing recommendations');
assert(packet.protectedBoundaries.visitorData === false && packet.protectedBoundaries.customerData === false, 'packet must not handle visitor or customer data');
assert(packet.protectedBoundaries.providerCalls === false && packet.protectedBoundaries.networkCalls === false, 'packet must not call providers or networks');
assert(packet.protectedBoundaries.databaseAccess === false, 'packet must not access a database');

const sparsePacket = buildOpenHouseAgentPreparationPacket({
  generatedAt: fixedInput.generatedAt,
  property: { address: 'Sparse Fixture Property', facts: {} },
  sourceEvidence: { sourceIdentity: 'Sparse source' },
});
assert(sparsePacket.status === 'READY_FOR_AGENT_REVIEW', 'sparse explicitly identified property must remain reviewable');
assert(sparsePacket.property?.facts.some((fact) => fact.classification === 'MISSING_FACT'), 'sparse facts must remain visibly missing');
assert(sparsePacket.marketContext.state === 'MISSING_CONTEXT', 'missing market context must remain visible');
assert(sparsePacket.sourceEvidence.timestampState === 'NO_VISIBLE_TIMESTAMP', 'missing source timestamp must remain visible');
assertIncludes(sparsePacket.limitations, 'No market or place context was supplied', 'missing context must become a limitation');
assertIncludes(sparsePacket.limitations, 'NO_VISIBLE_TIMESTAMP', 'missing timestamp must not become fresh');

const failClosedPacket = buildOpenHouseAgentPreparationPacket({ generatedAt: fixedInput.generatedAt, property: { facts: {} } });
assert(failClosedPacket.status === 'FAIL_CLOSED', 'missing property identity must fail closed');
assert(failClosedPacket.property === null, 'fail-closed packet must not substitute a property');
assert(failClosedPacket.talkingPointInputs.length === 0, 'fail-closed packet must not create talking points');

const repeatedPacket = buildOpenHouseAgentPreparationPacket(fixedInput);
assert(JSON.stringify(packet) === JSON.stringify(repeatedPacket), 'fixed inputs and generatedAt must produce deterministic output');

const runtimePath = fileURLToPath(new URL('../lib/openHouseAgentPreparation.ts', import.meta.url));
const runtimeSource = readFileSync(runtimePath, 'utf8');
const protectedRuntimeReferences = [
  '@prisma/client',
  'lib/prisma',
  'prisma.',
  'publicpropertyread',
  'getpublicproperty',
  'getpublicpropertiesbyids',
  'openHouse.find',
  'openHouse.create',
  "from '@/lib/mls",
  'typesense',
  "from '@/lib/search",
  "from '@/lib/alerts",
  "from '@/lib/crm",
  'resend',
  'nodemailer',
  'googleapis',
  'lightbox',
  'attom',
  'fetch(',
  'http://',
  'https://',
];
for (const reference of protectedRuntimeReferences) {
  assert(!runtimeSource.toLowerCase().includes(reference.toLowerCase()), `runtime must not reference protected system: ${reference}`);
}
assert(!/import\s/.test(runtimeSource), 'runtime must be self-contained and free of imports');

const output = JSON.stringify(packet).toLowerCase();
for (const forbiddenConclusion of ['best comp', 'estimated value', 'market value', 'suggested list price', 'suggested offer', 'appraisal conclusion', 'investment return', 'acceptance probability']) {
  assert(!output.includes(forbiddenConclusion), `packet must not produce prohibited conclusion language: ${forbiddenConclusion}`);
}
assert(!('visitor' in fixedInput.property!), 'fixture must not contain visitor data');
assert(!('customer' in fixedInput.property!), 'fixture must not contain customer data');

console.log('[open-house-agent-preparation] ok: deterministic explicit-input packet, fail-closed identity, factual preparation, evidence limitations, fair-housing and professional boundaries, and protected-system exclusions verified.');
