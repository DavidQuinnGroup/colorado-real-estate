import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

const homePage = read('app/page.tsx');
const grandPlanPage = read('app/grand-plan/page.tsx');
const grandPlanIntake = read('components/GrandPlanIntake.tsx');
const saveSearchRoute = read('app/api/save-search/route.ts');
const forbiddenPublicClaims = [
  'Client DNA',
  'Strategy synthesis',
  'Financial ROI',
  'Timeline Match',
  'Scorecard',
  'Protected logic',
  'Lifestyle Fit score',
  'Percentage match',
  'Precise commute savings',
  'Predictive matching',
  'AI analysis',
  'Construction findings',
  'Negotiation recommendations',
  'Private strategy',
  'Medicare',
  'tax questions',
  'debt questions',
  'investment questions',
];

assert.ok(existsSync('app/grand-plan/page.tsx'), 'Expected /grand-plan page to exist.');
assert.ok(!existsSync('app/api/grand-plan/route.ts'), 'Grand Plan must reuse the existing strategy-intake API, not create a duplicate API.');
assert.ok(homePage.includes("{ label: 'Grand Plan™', href: '/grand-plan' }"), 'Expected Home Portal navigation to discover /grand-plan.');
assert.ok(homePage.includes("href: '/grand-plan'"), 'Expected Home Portal Grand Plan CTAs to route to /grand-plan.');

assert.ok(grandPlanPage.includes('data-testid="grand-plan-page"'), 'Expected stable Grand Plan page test handle.');
assert.ok(grandPlanPage.includes('data-testid="grand-plan-landing"'), 'Expected stable Grand Plan landing test handle.');
assert.ok(grandPlanPage.includes('data-testid="grand-plan-intake-section"'), 'Expected stable Grand Plan intake section handle.');
assert.ok(grandPlanPage.includes('GrandPlanIntake'), 'Expected /grand-plan to render the Grand Plan intake component.');

assert.ok(grandPlanIntake.includes("fetch('/api/save-search'"), 'Expected Grand Plan to reuse /api/save-search.');
assert.ok(grandPlanIntake.includes("intakeSource: 'grand-plan'"), 'Expected Grand Plan submissions to identify their source.');
assert.ok(grandPlanIntake.includes("type StepId = 'priorities' | 'place' | 'timing' | 'context' | 'review'"), 'Expected Wave 3A multi-step Grand Plan flow.');
assert.ok(grandPlanIntake.includes("label: 'Review Your Starting Point'"), 'Expected review step before final submission.');
assert.ok(grandPlanIntake.includes('Nothing is saved until you submit and the request is accepted.'), 'Expected review screen to avoid premature saved-state claims.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-progress"'), 'Expected accessible Grand Plan progress handle.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-review"'), 'Expected Grand Plan review handle.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-continue"'), 'Expected intermediate actions to avoid accidental submission.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-back"'), 'Expected backward navigation handle.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-review-edit"'), 'Expected keyboard-accessible review edit controls.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-completion"'), 'Expected Grand Plan to render a clear completion state.');
assert.ok(grandPlanIntake.includes('Your Grand Plan starting point has been saved for advisor review.'), 'Expected success copy to occur only after persistence succeeds.');
assert.ok(grandPlanIntake.includes('href="/contact"'), 'Expected primary success CTA to point to /contact.');
assert.ok(grandPlanIntake.includes('href="/search"'), 'Expected secondary success CTA to point to /search.');
assert.ok(grandPlanIntake.includes('Do not submit confidential negotiating positions'), 'Expected Grand Plan compliance caution.');
assert.ok(!grandPlanIntake.includes('Executive Intelligence'), 'Grand Plan public UI must not expose Executive Intelligence terminology.');
assert.ok(!grandPlanIntake.includes('CRM'), 'Grand Plan public UI must not expose CRM terminology.');
assert.ok(!grandPlanIntake.includes('heatScore'), 'Grand Plan public UI must not expose scoring internals.');
assert.ok(!grandPlanIntake.includes('Resend'), 'Grand Plan intake must not send live email directly.');
assert.ok(!grandPlanIntake.includes('resend.emails.send'), 'Grand Plan intake must not send live email.');

for (const claim of forbiddenPublicClaims) {
  assert.ok(!grandPlanPage.includes(claim), `Grand Plan page must not expose unsupported claim language: ${claim}`);
  assert.ok(!grandPlanIntake.includes(claim), `Grand Plan intake must not expose unsupported claim language: ${claim}`);
}

assert.ok(saveSearchRoute.includes("'grand-plan': 'Grand Plan'"), 'Expected /api/save-search to recognize the Grand Plan intake source.');
assert.ok(saveSearchRoute.includes("'strategy_intake'"), 'Expected Grand Plan to reuse canonical strategy_intake CRM tasks through save-search.');
assert.ok(saveSearchRoute.includes('SavedSearch'), 'Expected Grand Plan path to retain saved-search workflow persistence.');
assert.ok(saveSearchRoute.includes('NorthStar'), 'Expected Grand Plan path to retain NorthStar persistence.');
assert.ok(saveSearchRoute.includes("'save_search'"), 'Expected Grand Plan path to retain existing UserInteraction persistence.');
assert.ok(!saveSearchRoute.includes("type: 'grand_plan'"), 'Grand Plan must not introduce a duplicate CRM task type.');
assert.ok(!saveSearchRoute.includes('resend.emails.send'), 'Save-search intake must not send live email.');

console.log('[grand-plan-journey-safety] ok: /grand-plan discovery, intake, existing persistence reuse, CRM handoff, completion state, and IP exposure boundaries verified.');

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkGrandPlanJourneySafety.ts
