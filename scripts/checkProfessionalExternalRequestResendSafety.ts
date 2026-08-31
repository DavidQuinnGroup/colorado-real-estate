import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sender = readFileSync('lib/email/sendProfessionalExternalRequest.ts', 'utf8');
const webhook = readFileSync('app/api/webhooks/resend/professional-external-request/route.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.match(sender, /RESEND_PROFESSIONAL_REQUEST_FROM_EMAIL/);
assert.match(sender, /PROJECT_ATLAS_CONTROLLED_SYNTHETIC_EMAIL_DELIVERY_AUTHORIZATION/);
assert.match(sender, /PROFESSIONAL_EXTERNAL_REQUEST_CONTINUATION_REQUIRED: CONTROLLED_SYNTHETIC_EMAIL_DELIVERY_AUTHORIZATION/);
assert.match(sender, /idempotencyKey/);
assert.doesNotMatch(sender, /sendPropertyInquiryNotification/);
assert.match(webhook, /svix-signature/);
assert.match(webhook, /createHmac\('sha256'/);
assert.match(webhook, /timingSafeEqual/);
assert.match(webhook, /applyProviderLifecycle/);
assert.doesNotMatch(webhook, /console\.(log|error)/);
assert.equal(packageJson.scripts?.['check:professional-external-request-resend-safety'], 'jiti scripts/checkProfessionalExternalRequestResendSafety.ts');

console.log('PROFESSIONAL_EXTERNAL_REQUEST_RESEND_SAFETY_CHECK: PASS');
