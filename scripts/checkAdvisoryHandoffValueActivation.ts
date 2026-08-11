import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string): void {
  assert(!source.includes(value), message);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const contactPage = read('app/contact/page.tsx');
const advisoryGuide = read('components/AdvisoryHandoffGuide.tsx');
const professionalHandoffPanel = read('components/ProfessionalHandoffCohesionPanel.tsx');
const journeyCohesionPanel = read('components/JourneyCohesionPanel.tsx');
const continueYourDecision = read('components/ContinueYourDecision.tsx');
const comparePage = read('app/compare/page.tsx');
const grandPlanPage = read('app/grand-plan/page.tsx');
const searchInterface = read('components/search/SearchInterface.tsx');
const propertyInquiryApi = read('app/api/property-inquiry/route.ts');

assert.equal(
  packageJson.scripts?.['check:advisory-handoff-value-activation'],
  'npm run worker:build && node dist/scripts/checkAdvisoryHandoffValueActivation.js',
  'package.json must expose Advisory Handoff Value Activation validation.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkAdvisoryHandoffValueActivation.ts',
  'tsconfig.worker.json must include Advisory Handoff Value Activation validation.',
);

assertIncludes(contactPage, '<AdvisoryHandoffGuide />', 'Contact must host the single Advisory Readiness guide.');
assertIncludes(advisoryGuide, 'id="advisory-readiness"', 'Advisory Readiness anchor must remain present.');
assertIncludes(
  advisoryGuide,
  'data-advisory-handoff-route="/contact#advisory-readiness"',
  'Advisory guide must identify /contact#advisory-readiness as the authoritative destination.',
);

for (const source of [journeyCohesionPanel, continueYourDecision, searchInterface]) {
  for (const marker of [
    "'data-advisory-handoff-value-activation': 'true'",
    "'data-advisory-handoff-authoritative-destination': '/contact#advisory-readiness'",
    "'data-advisory-handoff-hidden-context': 'false'",
    "'data-advisory-handoff-query-propagation': 'false'",
    "'data-advisory-handoff-prefill': 'false'",
    "'data-advisory-handoff-customer-control': 'true'",
  ]) {
    assertIncludes(source, marker, `Advisory activation link must expose marker: ${marker}`);
  }
}

const selectedActivations = [
  {
    name: 'Compare',
    source: comparePage,
    routeMarker: 'data-testid="cross-city-decision-comparison-page"',
    label: 'Prepare Next Conversation',
    href: "href: '/contact#advisory-readiness'",
  },
  {
    name: 'Grand Plan',
    source: grandPlanPage,
    routeMarker: 'data-testid="grand-plan-page"',
    label: 'Prepare Next Conversation',
    href: "href: '/contact#advisory-readiness'",
  },
  {
    name: 'Search',
    source: searchInterface,
    routeMarker: 'data-testid="reie-search-decision-strip"',
    label: 'Prepare Next Conversation',
    href: "href: '/contact#advisory-readiness'",
  },
];

for (const activation of selectedActivations) {
  assertIncludes(activation.source, activation.routeMarker, `${activation.name} activation must remain on the expected public route surface.`);
  assertIncludes(activation.source, activation.label, `${activation.name} activation must use restrained preparation language.`);
  assertIncludes(activation.source, activation.href, `${activation.name} activation must use the authoritative Advisory Readiness anchor.`);
  assertIncludes(
    activation.source,
    'Review knowns, unresolved items, and verification questions',
    `${activation.name} activation must describe known/unresolved/verify preparation generically.`,
  );
}

assertIncludes(
  grandPlanPage,
  'data-grand-plan-certified-destination={link.destination}',
  'Grand Plan certified-tool links must preserve destination metadata.',
);
assertIncludes(
  grandPlanPage,
  "'data-advisory-handoff-authoritative-destination': '/contact#advisory-readiness'",
  'Grand Plan certified-tool Advisory exit must carry the canonical destination marker.',
);

for (const source of [comparePage, grandPlanPage]) {
  assertNotIncludes(source, "href: '/contact'", 'Activated Journey Cohesion advisory links must not use the generic Contact route.');
}
assertNotIncludes(searchInterface, "href: '/contact'", 'Activated Search advisory links must not use the generic Contact route.');

for (const source of [comparePage, grandPlanPage, searchInterface]) {
  for (const blocked of [
    'savedSearchId',
    'userId',
    'comparisonHistory',
    'grandPlanAnswers',
    'sellerAnswers',
    'financingInputs',
    'inferredIntent',
    'customerProfile',
    'localStorage',
    'sessionStorage',
    'document.cookie',
    'type="hidden"',
    'leadScore',
    'createCRM',
    'sendEmail',
  ]) {
    assertNotIncludes(source, blocked, `Activated advisory routes must not introduce hidden customer context or protected behavior: ${blocked}`);
  }
}

for (const phrase of [
  'This handoff is optional and customer-controlled.',
  'does not transfer hidden route state',
  'What REIE Can Support',
  'What Remains Unresolved',
  'Who May Help Verify / Decide',
  'What To Ask',
]) {
  assertIncludes(professionalHandoffPanel, phrase, `Professional handoff panel must preserve generic preparation language: ${phrase}`);
}

for (const phrase of [
  'organize what you know',
  'identify what remains unresolved',
  'qualified professional',
  'does not save choices',
  'does not prefill forms',
  'does not transfer hidden',
  'You choose what to share in Contact',
]) {
  assertIncludes(advisoryGuide, phrase, `Advisory guide must preserve customer-control language: ${phrase}`);
}

for (const prohibitedClaim of [
  'valuation conclusion',
  'pricing recommendation',
  'recommended price',
  'offer strategy',
  'acceptance probability',
  'financing qualification',
  'lender recommendation',
  'legal conclusion',
  'tax conclusion',
  'insurance conclusion',
  'title conclusion',
  'inspection conclusion',
  'property-condition certainty',
  'investment recommendation',
  'suitability score',
  'school ranking',
  'safety ranking',
  'demographic preference',
  'protected-class inference',
]) {
  for (const source of [comparePage, grandPlanPage, searchInterface]) {
    assertNotIncludes(source, prohibitedClaim, `Advisory activation must not include prohibited claim: ${prohibitedClaim}`);
  }
}

for (const protectedChange of [
  'advisory-readiness',
  'Prepare Next Conversation',
  'data-advisory-handoff-value-activation',
]) {
  assertNotIncludes(propertyInquiryApi, protectedChange, `Property Inquiry API must not be changed for Advisory activation: ${protectedChange}`);
}

console.log(
  '[advisory-handoff-value-activation] ok: canonical destination, selected Compare/Grand Plan/Search activations, generic known-unresolved-verify language, customer control, no hidden context, no prefill, no API/CRM/email/persistence change, no prohibited professional or fair-housing claims verified.',
);
