import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getDisclosureState } from '../lib/disclosureState';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

function count(text: string, token: string) {
  return text.split(token).length - 1;
}

assert.equal(getDisclosureState(false), 'collapsed');
assert.equal(getDisclosureState(true), 'expanded');

let nativeOpen = false;
for (const expected of [true, false, true, false, true, false]) {
  nativeOpen = expected;
  assert.equal(
    getDisclosureState(nativeOpen),
    expected ? 'expanded' : 'collapsed',
    'The disclosure cue must remain synchronized through repeated native toggles.',
  );
}

const indicator = source('components/DisclosureStateIndicator.tsx');
assert.ok(indicator.includes("'use client'"));
assert.ok(indicator.includes("closest('details')"));
assert.ok(indicator.includes("details.open"));
assert.ok(indicator.includes("addEventListener('toggle'"));
assert.ok(indicator.includes('ChevronDown'));
assert.ok(indicator.includes('ChevronUp'));
assert.ok(indicator.includes('aria-hidden="true"'));
assert.equal(indicator.includes('aria-expanded'), false, 'Native summary semantics must not receive a duplicate ARIA state.');

const disclosureSurfaces = [
  'app/properties/[id]/page.tsx',
  'components/MarketProduct3VisualIntelligence.tsx',
  'components/NeighborhoodProduct3Experience.tsx',
  'components/PropertyCard.tsx',
  'components/PublicNavigation.tsx',
  'components/agent/AgentBriefingComposition.tsx',
  'components/agent/BuyerConsultationPlaybook.tsx',
  'components/agent/MarketConversationExperience.tsx',
  'components/agent/PlaceConversationExperience.tsx',
  'components/agent/PropertyConversationExperience.tsx',
  'components/home/HomeSearchExperience.tsx',
  'components/maps/MapSidebar.tsx',
  'components/search/SearchControls.tsx',
  'components/search/SearchInterface.tsx',
  'components/visual-intelligence/VisualIntelligencePrototype.tsx',
];

for (const path of disclosureSurfaces) {
  const contents = source(path);
  const detailsCount = count(contents, '<details');
  assert.ok(detailsCount > 0, `${path} must retain at least one native details disclosure.`);
  assert.ok(contents.includes('DisclosureStateIndicator'), `${path} must use the shared disclosure indicator.`);
  assert.equal(
    count(contents, '<DisclosureStateIndicator'),
    detailsCount,
    `${path} must use one shared state indicator for each native details disclosure.`,
  );
  assert.equal(contents.includes('group-open:'), false, `${path} must not keep a separate CSS-only disclosure state.`);
}

const buyer = source('components/agent/BuyerConsultationPlaybook.tsx');
assert.ok(buyer.includes('agent-buyer-section-guide'));
assert.ok(buyer.includes('agent-buyer-agenda-guide'));
assert.ok(buyer.includes('agent-buyer-playbook-detail'));
assert.ok(buyer.includes('Agent-ready questions and talking points'));
assert.ok(buyer.includes('Use in consultation'));
assert.ok(buyer.includes('Process, verification, and offer detail'));

const briefing = source('components/agent/AgentBriefingComposition.tsx');
assert.ok(briefing.includes('agent-briefing-progressive-details'));

const globalStyles = source('app/globals.css');
assert.equal(
  globalStyles.includes('.reie-search-guidance-disclosure[open] > summary span'),
  false,
  'Search guidance must not retain a CSS-only indicator rotation.',
);

const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };
assert.equal(
  packageJson.scripts?.['check:shared-disclosure-state-indicator'],
  'jiti scripts/checkSharedDisclosureStateIndicator.ts',
);

const certification = source(
  'docs/project-atlas/executive-library/REIE-SHARED-DISCLOSURE-STATE-INDICATOR-AND-BUYER-PREPARATION-CLOSEOUT-CERTIFICATION.md',
);
for (const marker of [
  'PROJECT_ATLAS_SHARED_DISCLOSURE_STATE_STANDARD_CERTIFIED',
  'BUYER_PREPARATION_DISCLOSURE_STATE_INDICATOR_TECHNICALLY_CERTIFIED',
  'REIE_AGENT_BUYER_CONSULTATION_PREPARATION_HUMAN_AND_TECHNICALLY_CERTIFIED',
  'REIE_AGENT_BUYER_CONSULTATION_PREPARATION_CERTIFIED_AND_CLOSED',
])
  assert.ok(certification.includes(marker), `Missing certification marker ${marker}.`);

console.log('PROJECT_ATLAS_SHARED_DISCLOSURE_STATE_INDICATOR_CHECK: PASS');
