import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

const homePage = read('app/page.tsx');
const grandPlanPage = read('app/grand-plan/page.tsx');
const grandPlanIntake = read('components/GrandPlanIntake.tsx');
const saveSearchRoute = read('app/api/save-search/route.ts');
const publicNavigation = read('components/PublicNavigation.tsx');
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
  'Proprietary Algorithm',
  'Hidden Intelligence',
  'Strategy Engine',
  'Internal Report',
  'Generated Analysis',
  'Unlock Your Secret Report',
  'Guaranteed results',
  'Guaranteed outcomes',
  '90% complete',
  'points, badges',
  'limited time',
  'fear of missing out',
  'permanently stored',
  'saved forever',
  'synchronizes across devices',
  'automatically personalized',
  'Medicare',
  'tax questions',
  'debt questions',
  'investment questions',
];

assert.ok(existsSync('app/grand-plan/page.tsx'), 'Expected /grand-plan page to exist.');
assert.ok(!existsSync('app/api/grand-plan/route.ts'), 'Grand Plan must reuse the existing strategy-intake API, not create a duplicate API.');
assert.ok(publicNavigation.includes("{ label: 'Grand Plan', href: '/grand-plan' }"), 'Expected shared public navigation to discover /grand-plan.');
assert.ok(
  homePage.includes("href: '/grand-plan'") || homePage.includes('href="/grand-plan"'),
  'Expected Home Portal Grand Plan CTAs to route to /grand-plan.',
);

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
assert.ok(grandPlanIntake.includes('aria-label={`Edit ${label}`}'), 'Expected review edit controls to expose contextual accessible names.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-lifestyle-priority"'), 'Expected Wave 3B lifestyle priority multi-select cards.');
assert.ok(grandPlanIntake.includes('Select at least one lifestyle priority before continuing.'), 'Expected lifestyle priority selection to be required.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-important-places"'), 'Expected Wave 3B multiple important-place UI.');
assert.ok(grandPlanIntake.includes('const MAX_IMPORTANT_PLACES = 3'), 'Expected Wave 3B important-place limit to remain capped at three.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-add-anchor"'), 'Expected add-anchor control.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-remove-anchor"'), 'Expected remove-anchor control.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-anchor-frequency"'), 'Expected qualitative frequency controls.');
assert.ok(grandPlanIntake.includes("{ id: 'most-days', label: 'Most Days', value: 6 }"), 'Expected Most Days to map to supported frequency value 6.');
assert.ok(grandPlanIntake.includes("{ id: 'few-times-week', label: 'A Few Times a Week', value: 3 }"), 'Expected A Few Times a Week to map to supported frequency value 3.');
assert.ok(grandPlanIntake.includes("{ id: 'weekly', label: 'Weekly', value: 1 }"), 'Expected Weekly to map to supported frequency value 1.');
assert.ok(grandPlanIntake.includes("{ id: 'few-times-month', label: 'A Few Times a Month', value: 1 }"), 'Expected A Few Times a Month to map to supported frequency value 1.');
assert.ok(grandPlanIntake.includes("{ id: 'occasionally', label: 'Occasionally', value: 1 }"), 'Expected Occasionally to map to supported frequency value 1.');
assert.ok(grandPlanIntake.includes('northStars: activeImportantPlaces.map'), 'Expected Grand Plan to preserve filters.northStars[] array shape.');
assert.ok(grandPlanIntake.includes('frequency: getFrequencyOption(place.frequency).value'), 'Expected qualitative frequency to map into existing numeric frequency field.');
assert.ok(grandPlanIntake.includes('lat: null'), 'Expected Grand Plan anchors to avoid false coordinates.');
assert.ok(grandPlanIntake.includes('lng: null'), 'Expected Grand Plan anchors to avoid false coordinates.');
assert.ok(grandPlanIntake.includes('Lifestyle priorities'), 'Expected review screen to include selected lifestyle priorities.');
assert.ok(grandPlanIntake.includes('Important places'), 'Expected review screen to include multiple important places.');
assert.ok(!grandPlanIntake.includes('coordinates'), 'Grand Plan public review must not display coordinates.');
assert.ok(!grandPlanIntake.includes('frequencyLabel:') && !grandPlanIntake.includes('frequencyValue:'), 'Grand Plan must not introduce new top-level frequency API fields.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-completion"'), 'Expected Grand Plan to render a clear completion state.');
assert.ok(grandPlanIntake.includes("if (submitState === 'success')"), 'Expected public result to render only after a successful save boundary.');
assert.ok(grandPlanIntake.includes('Your Grand Plan starting point is ready.'), 'Expected Wave 3C success copy to occur only after persistence succeeds.');
assert.ok(grandPlanIntake.includes('We saved your priorities, timing, and important places'), 'Expected success copy to accurately describe saved public inputs.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-result-summary"'), 'Expected Wave 3C public input summary.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-result-places"'), 'Expected Wave 3C important-place result summary.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-result-themes"'), 'Expected Wave 3C planning themes section.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-result-theme"'), 'Expected Wave 3C bounded theme cards.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-result-prompts"'), 'Expected Wave 3C advisor discussion prompts.');
assert.ok(grandPlanIntake.includes('data-grand-plan-read-only="true"'), 'Expected success result to remain read-only.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-strategy-preview"'), 'Expected Wave 3D strategy preview to render inside success state.');
assert.ok(grandPlanIntake.includes('data-grand-plan-preview-read-only="true"'), 'Expected Wave 3D strategy preview to remain read-only.');
assert.ok(grandPlanIntake.includes('A Preview of Your Strategy Report'), 'Expected Wave 3D report-preview framing.');
assert.ok(grandPlanIntake.includes('What deeper advisor review can add'), 'Expected Wave 3D advisor-review framing.');
assert.ok(grandPlanIntake.includes('Your public result summarizes the priorities you shared.'), 'Expected Wave 3D public/protected boundary copy.');
assert.ok(grandPlanIntake.includes('Detailed property, construction, timing, and strategy review is'), 'Expected Wave 3D advisor-involvement boundary.');
assert.ok(grandPlanIntake.includes('Construction Perspective'), 'Expected Wave 3D Construction Perspective preview section.');
assert.ok(grandPlanIntake.includes('Market Context'), 'Expected Wave 3D Market Context preview section.');
assert.ok(grandPlanIntake.includes('Timing Considerations'), 'Expected Wave 3D Timing Considerations preview section.');
assert.ok(grandPlanIntake.includes('Property Fit'), 'Expected Wave 3D Property Fit preview section.');
assert.ok(grandPlanIntake.includes('Next-Step Planning'), 'Expected Wave 3D Next-Step Planning preview section.');
assert.ok(grandPlanIntake.includes("status: 'Public Starting Point'"), 'Expected bounded Public Starting Point status label.');
assert.ok(grandPlanIntake.includes("status: 'Advisor Review'"), 'Expected bounded Advisor Review status label.');
assert.ok(grandPlanIntake.includes("status: 'Contracted-Client Deep Dive'"), 'Expected bounded Contracted-Client Deep Dive status label.');
assert.ok(grandPlanIntake.includes('Relevant to Your Priorities'), 'Expected Wave 3D emphasis label to be bounded.');
assert.ok(grandPlanIntake.includes('getStrategyPreviewSections'), 'Expected deterministic local preview emphasis function.');
assert.ok(grandPlanIntake.includes("data-grand-plan-preview-section={section.id}"), 'Expected preview section metadata for inspection.');
assert.ok(grandPlanIntake.includes("data-grand-plan-preview-relevant={section.isRelevant ? 'true' : 'false'}"), 'Expected preview emphasis metadata for inspection.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-advisor-journey"'), 'Expected Wave 3E advisor-journey completion section.');
assert.ok(grandPlanIntake.includes('data-grand-plan-advisor-journey-read-only="true"'), 'Expected Wave 3E advisor journey to remain read-only.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-continue-from-here"'), 'Expected Wave 3E Continue From Here section.');
assert.ok(grandPlanIntake.includes('Continue From Here'), 'Expected Wave 3E continuity heading.');
assert.ok(grandPlanIntake.includes('You are not starting over.'), 'Expected Wave 3E continuity reassurance.');
assert.ok(grandPlanIntake.includes('Your Grand Plan becomes the foundation for future conversations'), 'Expected Wave 3E continuity copy.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-journey-map"'), 'Expected Wave 3E journey timeline section.');
assert.ok(grandPlanIntake.includes('const advisorJourneyStages: AdvisorJourneyStage[]'), 'Expected bounded Wave 3E journey stage library.');
assert.ok(grandPlanIntake.includes("title: 'Your Grand Plan'"), 'Expected Wave 3E Your Grand Plan journey stage.');
assert.ok(grandPlanIntake.includes("status: 'Complete'"), 'Expected completed status to be visible text.');
assert.ok(grandPlanIntake.includes("title: 'Guided Property Discovery'"), 'Expected Wave 3E Guided Property Discovery journey stage.');
assert.ok(grandPlanIntake.includes('Explore homes and locations through the priorities you identified.'), 'Expected approved Guided Property Discovery description.');
assert.ok(grandPlanIntake.includes("title: 'Personalized Strategy Session'"), 'Expected Wave 3E Personalized Strategy Session journey stage.');
assert.ok(grandPlanIntake.includes('Review timing, tradeoffs, questions, and possible next steps with an advisor.'), 'Expected approved strategy-session description.');
assert.ok(grandPlanIntake.includes("title: 'Confident Purchase or Sale'"), 'Expected Wave 3E Confident Purchase or Sale journey stage.');
assert.ok(grandPlanIntake.includes('Move forward when the decision, property, and timing feel right.'), 'Expected approved purchase-or-sale description.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-how-we-use"'), 'Expected Wave 3E How We Use Your Grand Plan section.');
assert.ok(grandPlanIntake.includes('Your priorities help focus the conversation.'), 'Expected Wave 3E priority-use point.');
assert.ok(grandPlanIntake.includes('Important Places help us understand how location affects daily life.'), 'Expected Wave 3E important-places point.');
assert.ok(grandPlanIntake.includes('Your ownership goals help frame which questions deserve attention.'), 'Expected Wave 3E ownership-goal point.');
assert.ok(grandPlanIntake.includes('Your Grand Plan can evolve as your needs, timing, and perspective change.'), 'Expected Wave 3E evolution point.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-advisor-commitment"'), 'Expected Wave 3E advisor commitment section.');
assert.ok(grandPlanIntake.includes('Our goal is not to convince you to move.'), 'Expected Wave 3E low-pressure commitment.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-right-pace"'), 'Expected Wave 3E right-pace section.');
assert.ok(grandPlanIntake.includes('Some people are ready to move quickly.'), 'Expected Wave 3E confidence without pressure copy.');
assert.ok(grandPlanIntake.includes('Good decisions rarely come from unnecessary pressure.'), 'Expected Wave 3E pressure boundary.');
assert.ok(grandPlanIntake.includes('data-testid="grand-plan-cta-orientation"'), 'Expected Wave 3E CTA orientation heading.');
assert.ok(grandPlanIntake.includes('Where Would You Like to Continue?'), 'Expected Wave 3E CTA orientation copy.');
assert.ok(grandPlanIntake.includes('You can return later and continue from your Grand Plan starting point.'), 'Expected Wave 3E non-interactive return-later copy.');
assert.ok(grandPlanIntake.includes('const themeLibrary: Record<PlanningThemeId, PlanningTheme>'), 'Expected bounded deterministic planning theme library.');
assert.ok(grandPlanIntake.includes('const defaultThemeIds: PlanningThemeId[]'), 'Expected safe default planning themes.');
assert.ok(grandPlanIntake.includes('return themeIds.slice(0, 5).map'), 'Expected planning themes to be capped at five.');
assert.ok(grandPlanIntake.includes('for (const themeId of defaultThemeIds) addTheme(themeIds, themeId);'), 'Expected default themes to provide at least three safe themes.');
assert.ok(grandPlanIntake.includes('if (!themeIds.includes(themeId)) themeIds.push(themeId);'), 'Expected duplicate planning themes to be suppressed.');
assert.ok(grandPlanIntake.includes('getDiscussionPrompts'), 'Expected deterministic advisor discussion prompts.');
assert.ok(grandPlanIntake.includes('successTitleRef.current?.focus()'), 'Expected focus to move to the success result heading.');
assert.ok(grandPlanIntake.includes('href="/contact"'), 'Expected primary success CTA to point to /contact.');
assert.ok(grandPlanIntake.includes('href="/search"'), 'Expected secondary success CTA to point to /search.');
assert.ok(grandPlanIntake.includes('Do not submit confidential negotiating positions'), 'Expected Grand Plan compliance caution.');
assert.ok(!grandPlanIntake.includes('Scorecard'), 'Grand Plan result must not expose scorecard language.');
assert.ok(!grandPlanIntake.includes('Match score'), 'Grand Plan result must not expose match-score language.');
assert.ok(!grandPlanIntake.includes('Report generated'), 'Grand Plan result must not claim report generation.');
assert.ok(!grandPlanIntake.includes('Recommendation engine'), 'Grand Plan result must not expose recommendation-engine language.');
assert.ok(!grandPlanIntake.includes('download'), 'Grand Plan result must not introduce report downloads.');
assert.ok(!grandPlanIntake.includes('pdf'), 'Grand Plan result must not introduce PDF behavior.');
assert.ok(!grandPlanIntake.includes('Unlock Your Secret Report'), 'Grand Plan result must not introduce manipulative unlock language.');
assert.ok(!grandPlanIntake.includes('private-access unlock'), 'Grand Plan result must not introduce private-access unlock behavior.');
assert.ok(!grandPlanIntake.includes('account creation'), 'Grand Plan result must not introduce account creation.');
assert.ok(!grandPlanIntake.includes('strategyGenerator'), 'Grand Plan result must not import private strategy generation code.');
assert.ok(!grandPlanIntake.includes('Math.random'), 'Grand Plan result must not use random preview generation.');
assert.ok(!grandPlanIntake.includes('repair-cost'), 'Grand Plan result must not expose repair-cost advice.');
assert.ok(!grandPlanIntake.includes('Offer recommendations'), 'Grand Plan result must not expose offer recommendations.');
assert.ok(!grandPlanIntake.includes('90% complete'), 'Grand Plan journey must not use progress-percentage language.');
assert.ok(!grandPlanIntake.includes('badge'), 'Grand Plan journey must not introduce gamified badges.');
assert.ok(!grandPlanIntake.includes('unlock'), 'Grand Plan journey must not introduce unlock language.');
assert.ok(!grandPlanIntake.includes('Create Account'), 'Grand Plan journey must not introduce account behavior.');
assert.ok(!grandPlanIntake.includes('portal access'), 'Grand Plan journey must not introduce portal behavior.');
assert.ok(!grandPlanIntake.includes('calendar'), 'Grand Plan journey must not introduce scheduling behavior.');
assert.ok(!grandPlanIntake.includes('reminder'), 'Grand Plan journey must not introduce reminder behavior.');
assert.ok(!grandPlanIntake.includes('email delivery'), 'Grand Plan journey must not introduce email-delivery behavior.');
assert.ok(!grandPlanIntake.includes('saved forever'), 'Grand Plan journey must not claim permanent storage.');
assert.ok(!grandPlanIntake.includes('permanently stored'), 'Grand Plan journey must not claim permanent storage.');
assert.ok(!grandPlanIntake.includes('synchronizes across devices'), 'Grand Plan journey must not claim cross-device synchronization.');
assert.ok(!grandPlanIntake.includes('automatically personalized'), 'Grand Plan journey must not claim automatic personalization.');
assert.ok(!grandPlanIntake.includes('Return Later</Link>'), 'Return Later must not become an inaccurate interactive control.');
assert.ok(!grandPlanIntake.includes('Executive Intelligence'), 'Grand Plan public UI must not expose Executive Intelligence terminology.');
assert.ok(!grandPlanIntake.includes('CRM'), 'Grand Plan public UI must not expose CRM terminology.');
assert.ok(!grandPlanIntake.includes('heatScore'), 'Grand Plan public UI must not expose scoring internals.');
assert.ok(!grandPlanIntake.includes('Resend'), 'Grand Plan intake must not send live email directly.');
assert.ok(!grandPlanIntake.includes('resend.emails.send'), 'Grand Plan intake must not send live email.');
assert.ok(grandPlanIntake.includes('isFinalSubmitter'), 'Expected final submitter guard to remain present.');
assert.ok(grandPlanIntake.includes("data-testid') === 'grand-plan-submit'"), 'Expected only final Grand Plan submit control to invoke persistence.');
assert.ok(grandPlanIntake.includes('reviewSubmitReadyStep !== currentStepIndex'), 'Expected 300ms review unlock guard to remain present.');
assert.ok(grandPlanIntake.includes("submitState === 'submitting'"), 'Expected duplicate-submit guard to remain present.');

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
