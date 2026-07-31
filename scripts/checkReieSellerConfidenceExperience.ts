import assert from 'node:assert/strict';
import fs from 'node:fs';

const governedStatus = 'REIE_7_1_SPRINT_2_SELLER_VALUATION_ROUTE_COMPLETION';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function assertFileExists(filePath: string) {
  assert(fs.existsSync(filePath), `${filePath} must exist.`);
}

function assertFileMissing(filePath: string) {
  assert(!fs.existsSync(filePath), `${filePath} must remain absent.`);
}

const homeWorthRoute = 'app/home-worth/page.tsx';
assertFileExists(homeWorthRoute);
assertFileMissing('app/what-is-my-home-worth/page.tsx');
assertFileMissing('app/mortgage/page.tsx');
assertFileMissing('app/lender/page.tsx');
assertFileMissing('app/lenders/page.tsx');
assertFileMissing('app/sundance/page.tsx');

const homeWorth = read(homeWorthRoute);
const navigation = read('components/PublicNavigation.tsx');
const footer = read('components/Footer.tsx');
const sellerPage = read('app/sell/page.tsx');
const sellerForm = read('components/HomeValueEstimator.tsx');
const valuationRoute = read('app/api/valuation/route.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const sprintDoc = read('docs/project-atlas/executive-library/REIE-7.1-SPRINT-2-SELLER-CONFIDENCE-EXPERIENCE.md');
const chatStart = read('docs/CHAT_START.md');

assertIncludes(homeWorth, 'data-testid="reie-home-worth-page"', '/home-worth must expose a stable route handle.');
assertIncludes(homeWorth, 'data-reie-sprint-2-seller-confidence="true"', '/home-worth must expose governed Sprint 2 marker.');
assertIncludes(homeWorth, 'What Is My Home Worth?', '/home-worth must answer the homeowner value question.');
assertIncludes(homeWorth, 'HomeValueEstimator', '/home-worth must reuse the existing seller intake component.');
assertIncludes(homeWorth, 'not an automated home-value estimate', '/home-worth must avoid automated value claims.');
assertIncludes(homeWorth, 'data-reie-home-worth-automated-valuation="false"', '/home-worth must expose no-AVM marker.');
assertIncludes(homeWorth, 'data-reie-home-worth-ai="false"', '/home-worth must expose no-AI marker.');
assertIncludes(homeWorth, 'data-reie-home-worth-gis="false"', '/home-worth must expose no-GIS marker.');
assertIncludes(homeWorth, 'data-reie-home-worth-provider-activation="false"', '/home-worth must expose no-provider marker.');
assertIncludes(homeWorth, 'data-testid="home-worth-why-difficult"', '/home-worth must explain why value is difficult.');
assertIncludes(homeWorth, 'data-testid="home-worth-value-factors"', '/home-worth must explain value factors.');
assertIncludes(homeWorth, 'data-testid="home-worth-estimate-difference"', '/home-worth must explain why online estimates differ.');
assertIncludes(homeWorth, 'data-testid="home-worth-local-expertise"', '/home-worth must explain local expertise.');
assertIncludes(homeWorth, 'data-testid="home-worth-confidence-inputs"', '/home-worth must explain information that improves confidence.');
assertIncludes(homeWorth, 'data-testid="home-worth-request"', '/home-worth must include the seller review request.');
assertIncludes(homeWorth, 'data-testid="home-worth-next-steps"', '/home-worth must explain next steps.');
assertIncludes(homeWorth, "href=\"/market\"", '/home-worth must connect to market context.');
assertIncludes(homeWorth, "sellerHref: '/sell'", '/home-worth must preserve seller strategy continuity.');
assertIncludes(homeWorth, "searchHref: '/search'", '/home-worth must preserve search continuity.');
assertIncludes(homeWorth, 'href="/contact"', '/home-worth must preserve contact continuity.');
assertIncludes(homeWorth, 'JourneyCohesionPanel', '/home-worth must preserve shared journey cohesion continuity.');
assertIncludes(homeWorth, "label: 'Market Context', href: '/market'", '/home-worth cohesion panel must route to market context.');
assertIncludes(homeWorth, "label: 'Review Inventory', href: '/search'", '/home-worth cohesion panel must route to search inventory.');
assertIncludes(homeWorth, "label: 'Seller Strategy', href: '/sell'", '/home-worth cohesion panel must route to seller strategy.');

for (const forbidden of [
  'Estimated Value',
  'Zestimate',
  'instant valuation accuracy',
  'guaranteed value',
  'guaranteed price',
  'appraisal result',
  'OpenAI',
  'chatbot',
  'GIS Sprint 9',
  'provider activation',
  'provider-fed estimate',
  'Prisma.',
  'prisma.',
  'migration',
  'document.cookie =',
  'localStorage.setItem',
  'sessionStorage.setItem',
]) {
  assertNotIncludes(homeWorth, forbidden, `/home-worth must not include unauthorized claim or activation text: ${forbidden}`);
}

assertIncludes(navigation, "{ label: 'Home Worth', href: '/home-worth' }", 'Public navigation must integrate /home-worth.');
assertIncludes(navigation, "{ label: 'Sell', href: '/sell' }", 'Public navigation must preserve /sell.');
assertIncludes(navigation, 'publicNavigationLinks.map', 'Mobile navigation must not drop later public links after adding /home-worth.');
assertIncludes(footer, "{ label: 'Home Worth', href: '/home-worth' }", 'Footer must integrate /home-worth.');
assertIncludes(footer, "{ label: 'Sell', href: '/sell' }", 'Footer must preserve /sell.');

assertIncludes(sellerPage, 'HomeValueEstimator', '/sell must keep existing seller intake.');
assertIncludes(sellerForm, 'not an automated home-value estimate', 'Seller form must keep no-AVM language.');
assertIncludes(sellerForm, 'data-conversion-automated-valuation="false"', 'Seller form must expose no-AVM metadata.');
assertIncludes(valuationRoute, "export async function POST", 'Valuation backend posture must remain the existing POST route.');
assertIncludes(valuationRoute, "type: 'strategy_intake'", 'Valuation backend must preserve strategy_intake CRM task type.');
assertIncludes(valuationRoute, 'emailSent: false', 'Valuation backend must preserve no-email-sent status.');
assertNotIncludes(valuationRoute, 'resend.emails.send', 'Valuation backend must not send live email.');
assertNotIncludes(valuationRoute, 'optimizedValue', 'Valuation backend must not return unsupported valuation output.');
assertNotIncludes(valuationRoute, 'estimatedEquity', 'Valuation backend must not return unsupported equity output.');

assert(packageJson.scripts?.['check:reie-seller-confidence-experience'], 'package.json must expose the Sprint 2 safety check.');
assertIncludes(sprintDoc, governedStatus, 'Sprint 2 documentation must record the governed implementation identifier.');
assertIncludes(sprintDoc, 'Deployment remains prohibited', 'Sprint 2 documentation must preserve deployment prohibition.');
assertIncludes(chatStart, governedStatus, 'CHAT_START must record the Sprint 2 governed identifier.');
assertIncludes(chatStart, 'Deployment remains prohibited', 'CHAT_START must preserve deployment prohibition.');

console.log('[reie-seller-confidence-experience] ok: /home-worth route, navigation, seller journey reuse, no AVM, no AI/GIS/provider activation, and documentation boundaries verified.');
