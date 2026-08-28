import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildSellerDecisionBriefCompositionPreview,
  SELLER_DECISION_BRIEF_COMPONENT_REGISTRY,
  SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_EXPERIENCE_STATUS,
  SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_NEXT_GATE,
  SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_STATUS,
  SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION,
} from '../lib/sellerDecisionBriefCompositionPreview';
import {
  SELLER_DECISION_BRIEF_FOUNDATION_STATUS,
  SELLER_DECISION_BRIEF_NEXT_GATE,
} from '../lib/sellerDecisionBriefFoundation';

const contract = readFileSync('lib/sellerDecisionBriefCompositionPreview.ts', 'utf8');
const component = readFileSync('components/agent/SellerDecisionBriefCompositionPreview.tsx', 'utf8');
const route = readFileSync('app/agent/prepare/seller/presentation/page.tsx', 'utf8');
const shell = readFileSync('components/agent/AgentWorkspaceShell.tsx', 'utf8');
const home = readFileSync('components/agent/AgentWorkspaceHome.tsx', 'utf8');
const styles = readFileSync('app/globals.css', 'utf8');
const middleware = readFileSync('middleware.ts', 'utf8');
const adminAuth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_STATUS, 'SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_V1_CERTIFIED');
assert.equal(SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION, 'SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_V1');
assert.equal(SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_NEXT_GATE, 'READY_FOR_SELLER_NARRATIVE_STRATEGY_DEPTH');
assert.equal(SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_EXPERIENCE_STATUS, 'AGENT_VISIBLE_COMPOSITION_REVIEW_EXPERIENCE_CERTIFIED_PRINT_PDF_SHARE_DELIVERY_HELD');
assert.equal(SELLER_DECISION_BRIEF_NEXT_GATE, 'READY_FOR_SELLER_PRESENTATION_COMPOSITION_REVIEW_EXPERIENCE');

const preview = buildSellerDecisionBriefCompositionPreview();
assert.equal(preview.status, SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_STATUS);
assert.equal(preview.version, SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION);
assert.equal(preview.route, '/agent/prepare/seller/presentation');
assert.equal(preview.brief.status, SELLER_DECISION_BRIEF_FOUNDATION_STATUS);
assert.equal(preview.brief.outputProduct.readiness, 'AGENT_REVIEW_REQUIRED');
assert.deepEqual(preview.modes, ['AGENT_REVIEW', 'SELLER_PREVIEW', 'PRINT_PREVIEW']);
assert.equal(preview.sectionPresentations.length, 13);
assert.equal(preview.sectionPresentations[0].sectionId, 'seller-brief-executive-summary');
assert.equal(preview.sectionPresentations.at(-1)?.sectionId, 'seller-brief-evidence-appendix');
assert.equal(preview.sectionPresentations.flatMap((section) => section.modules).length, 19);
assert.equal(preview.questionCoverage.length, 12);
assert.equal(preview.readiness.visualPresentation, 'IMPLEMENTED');
assert.equal(preview.readiness.ui, 'IMPLEMENTED');
assert.equal(preview.readiness.printPreview, 'FOUNDATION_IMPLEMENTED');
assert.equal(preview.readiness.pdf, 'NOT_IMPLEMENTED');
assert.equal(preview.readiness.shareDelivery, 'NOT_IMPLEMENTED');
assert.equal(preview.readiness.persistence, 'NOT_IMPLEMENTED');

for (const [boundary, value] of Object.entries(preview.protectedBoundaries)) {
  assert.equal(value, false, `${boundary} must remain false`);
}

const requiredComponents = [
  'OutputCover',
  'OutputSectionHeader',
  'OutputDecisionSnapshot',
  'OutputObjectiveCards',
  'OutputPropertyHero',
  'OutputPropertyFactGrid',
  'OutputLocationMap',
  'OutputCohortSummary',
  'OutputMetricCard',
  'OutputCompetitionMap',
  'OutputPropertyCard',
  'OutputComparisonMatrix',
  'OutputPositioningMatrix',
  'OutputPreparationMatrix',
  'OutputPropertyStory',
  'OutputLaunchTimeline',
  'OutputRecommendationCard',
  'OutputSellerJourney',
  'OutputDecisionChecklist',
  'OutputEvidencePanel',
  'OutputSourceNote',
  'OutputReadinessBadge',
] as const;

for (const componentName of requiredComponents) {
  const registryEntry = SELLER_DECISION_BRIEF_COMPONENT_REGISTRY.find((entry) => entry.component === componentName);
  assert(registryEntry, `missing component registry entry ${componentName}`);
  assert.equal(registryEntry.responsive, true, `${componentName} must declare responsive support`);
  assert.equal(registryEntry.print, true, `${componentName} must declare print support`);
  assert(registryEntry.reusableProducts.length > 0, `${componentName} must declare reusable products`);
}

for (const module of preview.sectionPresentations.flatMap((section) => section.modules)) {
  assert(requiredComponents.includes(module.visualComponent as never), `${module.module.id} has unknown visual component`);
  assert(module.evidence.length > 0, `${module.module.id} must expose evidence`);
  assert(module.nextAction.length > 0, `${module.module.id} must expose next action`);
}

for (const readinessState of [
  'READY',
  'AGENT_INPUT_REQUIRED',
  'AGENT_REVIEW_REQUIRED',
  'EVIDENCE_REQUIRED',
  'RIGHTS_REQUIRED',
  'FRESHNESS_REQUIRED',
  'CONTEXTUAL_OPTIONAL',
]) {
  assert(contract.includes(readinessState), `contract missing readiness state ${readinessState}`);
  assert(component.includes(readinessState), `component missing readiness state ${readinessState}`);
}

for (const question of [
  'What are we deciding?',
  'What will buyers see in my property?',
  'How does my location affect the sale?',
  'What market am I entering?',
  'What else can buyers choose?',
  'How does my property sit in that choice set?',
  'What positioning choices matter?',
  'What should we prepare?',
  'How will we launch?',
  'What does my Agent recommend?',
  'What happens next?',
  'What evidence supports this?',
]) {
  assert(preview.questionCoverage.some((coverage) => coverage.question === question), `missing Seller question ${question}`);
}

for (const token of [
  'data-testid="seller-decision-brief-composition-preview"',
  'data-testid="seller-brief-top-bar"',
  'data-testid="seller-brief-section-rail"',
  'data-testid="seller-brief-output-canvas"',
  'data-testid="seller-brief-module-inspector"',
  'data-testid="seller-brief-mode-controls"',
  'data-testid="seller-brief-print-footer"',
  'data-preview-mode={mode}',
  'data-agent-only="true"',
  'data-persistence="false"',
  'data-provider-activity="false"',
  'data-customer-data="false"',
  'data-pdf-generation="true"',
  'data-share-delivery="false"',
  "fetch('/api/agent/output/pdf'",
  'data-testid="atlas-pdf-renderer-v1"',
]) {
  assert(component.includes(token), `component missing UI token ${token}`);
}

for (const mode of ['AGENT_REVIEW', 'SELLER_PREVIEW', 'PRINT_PREVIEW']) {
  assert(component.includes(mode), `component missing mode ${mode}`);
}

assert(route.includes('SellerDecisionBriefCompositionPreview'), 'route must render the Seller presentation preview component');
assert(shell.includes('href="/agent/prepare/seller/presentation"'), 'Agent shell must link to Seller Presentation');
assert(home.includes("href: '/agent/prepare/seller/presentation'"), 'Workspace Home must launch Seller Presentation');
assert(middleware.includes('pathname === "/agent/prepare/seller/presentation"'), 'middleware must exact-match the Seller Presentation route');
assert(middleware.includes('"/agent/prepare/seller/presentation"'), 'middleware matcher must include the Seller Presentation route');
assert(adminAuth.includes("surface('/agent/prepare/seller/presentation'"), 'Agent auth surface registry must include Seller Presentation');
assert(adminAuth.includes("value === '/agent/prepare/seller/presentation'"), 'Agent return sanitizer must preserve Seller Presentation');
assert.doesNotMatch(middleware, /\/agent\/:path\*/, 'middleware must not broaden Agent route access with a wildcard');
assert(styles.includes('@media print'), 'print styles must exist');
assert(styles.includes('[data-testid="seller-brief-output-canvas"]'), 'print styles must target the output canvas');
assert(styles.includes('page-break-inside: avoid'), 'print styles must include page-break behavior');

for (const source of [contract, route]) {
  for (const forbidden of [
    'fetch(',
    'new PrismaClient',
    'prisma.',
    'supabase.',
    'typesense.',
    'MLS_GRID_TOKEN',
    'DATABASE_URL',
    'sendEmail',
    'resend',
    'localStorage',
    'sessionStorage',
    'document.cookie',
    'navigator.share',
  ]) {
    assert.equal(source.includes(forbidden), false, `Seller composition preview must not include runtime token ${forbidden}`);
  }
}

for (const forbidden of [
  'new PrismaClient',
  'prisma.',
  'supabase.',
  'typesense.',
  'MLS_GRID_TOKEN',
  'DATABASE_URL',
  'sendEmail',
  'resend',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.share',
]) {
  assert.equal(component.includes(forbidden), false, `Seller composition preview must not include runtime token ${forbidden}`);
}
assert.equal(component.includes("fetch('/api/agent/output/pdf'"), true, 'Seller composition preview may only call the exact Agent PDF route.');

assert.equal(
  packageJson.scripts?.['check:seller-decision-brief-composition-preview'],
  'jiti scripts/checkSellerDecisionBriefCompositionPreview.ts',
);

console.log('SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_CHECK: PASS');
