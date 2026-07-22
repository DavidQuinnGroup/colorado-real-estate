import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

const valuationRoute = read('app/api/valuation/route.ts');
const sellerPage = read('app/sell/page.tsx');
const sellerForm = read('components/HomeValueEstimator.tsx');
const homePage = read('app/page.tsx');

assert.ok(sellerPage.includes('data-testid="seller-page"'), 'Expected /sell to expose a stable seller page handle.');
assert.ok(sellerPage.includes('HomeValueEstimator'), 'Expected /sell to reuse the seller intake form.');
assert.ok(homePage.includes("{ label: 'Sell', href: '/sell' }"), 'Expected home navigation to route Sell directly to /sell.');
assert.ok(homePage.includes("href: '/sell'"), 'Expected home seller card to route to /sell.');

assert.ok(valuationRoute.includes("type: 'strategy_intake'"), 'Expected seller submissions to use canonical strategy_intake CRM tasks.');
assert.ok(!valuationRoute.includes("type: 'seller_intake'"), 'Seller submissions must not introduce a separate seller_intake CRM task type.');
assert.ok(valuationRoute.includes("'seller_valuation_request'"), 'Expected seller submissions to create seller-specific interactions.');
assert.ok(valuationRoute.includes('tx.sellerLead'), 'Expected seller submissions to persist SellerLead records.');
assert.ok(valuationRoute.includes('duplicate'), 'Expected seller submissions to report duplicate handling.');
assert.ok(valuationRoute.includes('emailSent: false'), 'Expected seller submissions to expose no-email-sent status.');
assert.ok(!valuationRoute.includes('Resend'), 'Seller valuation route must not import or use Resend.');
assert.ok(!valuationRoute.includes('@supabase/supabase-js'), 'Seller valuation route must not write to a parallel Supabase leads table.');
assert.ok(!valuationRoute.includes('resend.emails.send'), 'Seller valuation route must not send live email.');
assert.ok(!valuationRoute.includes('optimizedValue'), 'Seller valuation route must not return unsupported automated valuation results.');
assert.ok(!valuationRoute.includes('estimatedEquity'), 'Seller valuation route must not return unsupported automated equity estimates.');

assert.ok(sellerForm.includes('Seller Analysis Request'), 'Expected seller form to label the experience accurately.');
assert.ok(sellerForm.includes('not an automated home-value estimate'), 'Expected seller form to avoid claiming instant valuation.');
assert.ok(sellerForm.includes('Property address'), 'Expected seller form to collect property address.');
assert.ok(sellerForm.includes('Main objective'), 'Expected seller form to collect seller objective.');
assert.ok(sellerForm.includes('Timeline'), 'Expected seller form to collect seller timeline.');
assert.ok(sellerForm.includes('seller-intake-confirmation'), 'Expected seller form to render a specific confirmation state.');
assert.ok(!sellerForm.includes('Estimated Value'), 'Seller form must not display a fabricated value estimate.');
assert.ok(!sellerForm.includes('Math.random'), 'Seller form must not use random valuation logic.');
assert.ok(!sellerForm.includes('CRM'), 'Seller form must not expose CRM terminology publicly.');
assert.ok(!sellerForm.includes('Terminal 5'), 'Seller form must not expose terminal terminology publicly.');

console.log('[seller-journey-safety] ok: seller route, form, valuation persistence, CRM handoff, duplicate handling, no live email, and no fake valuation verified.');

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkSellerJourneySafety.ts
