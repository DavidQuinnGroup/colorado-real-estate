import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildEparbAuthenticationAccessReview,
  eparbAuthenticationReviewCriteria,
  validateEparbAuthenticationAccessReview,
} from '../lib/eparb/authenticationAccessReviewContract.js';

const FORBIDDEN_RUNTIME_PATTERNS = [
  /cookies\(\)\.set/,
  /NextResponse\.redirect/,
  /prisma\./,
  /\$transaction/,
  /\.create\s*\(/,
  /\.update\s*\(/,
  /\.delete\s*\(/,
  /sendEmail/,
  /sendPropertyInquiryNotification/,
  /implementationAuthorized:\s*true/,
  /middlewareChangeAuthorized:\s*true/,
  /credentialChangeAuthorized:\s*true/,
  /productionMutationAuthorized:\s*true/,
];

async function assertNoRuntimeActivation() {
  const source = await readFile('lib/eparb/authenticationAccessReviewContract.ts', 'utf8');
  for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
    assert.doesNotMatch(source, pattern, `EPARB Review 1 must remain governance-only: ${pattern}`);
  }
}

async function assertDocumentationCoverage() {
  const review = await readFile('docs/project-atlas/executive-library/EPARB-REVIEW-001-ENTERPRISE-ADMINISTRATIVE-AUTHENTICATION-AND-ACCESS-ARCHITECTURE.md', 'utf8');
  const portfolio = await readFile('docs/project-atlas/executive-library/EPARB-1.0-INITIAL-REVIEW-PORTFOLIO.md', 'utf8');
  const chatStart = await readFile('docs/CHAT_START.md', 'utf8');

  assert.match(review, /Current Authentication Inventory/, 'Authentication inventory must be documented.');
  assert.match(review, /Human vs Machine Identity Analysis/, 'Human and machine identity analysis must be documented.');
  assert.match(review, /EOI Sprint 3 Certification Failure Analysis/, 'EOI Sprint 3 failure analysis must be documented.');
  assert.match(review, /MODEL B/, 'Model B must be compared.');
  assert.match(review, /MODEL E/, 'Model E must be compared.');
  assert.match(review, /Role and Permission Model/, 'Role model must be documented.');
  assert.match(review, /Migration Strategy/, 'Migration strategy must be documented.');
  assert.match(review, /David retains final executive authorization/, 'David authorization boundary must be documented.');
  assert.match(review, /No authentication implementation is authorized/, 'Implementation prohibition must be documented.');
  assert.match(portfolio, /EPARB-REVIEW-001[\s\S]*Status: `COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED`/, 'Portfolio must mark Review 1 complete without implementation authorization.');
  assert.match(chatStart, /EPARB_REVIEW_001_COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED/, 'CHAT_START must record Review 1 completion.');
}

function assertContractCompleteness() {
  const review = buildEparbAuthenticationAccessReview();
  const result = validateEparbAuthenticationAccessReview(review);

  assert.equal(result.valid, true, result.issues.join('\n'));
  assert.equal(review.governedIdentifier, 'EPARB-REVIEW-001_ENTERPRISE_ADMINISTRATIVE_AUTHENTICATION_AND_ACCESS_ARCHITECTURE_REVIEW');
  assert.equal(review.status, 'COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED');
  assert.equal(review.recommendation.selectedModel, 'MODEL_E_REPOSITORY_SUPPORTED_HYBRID');
  assert.equal(review.recommendation.finalExecutiveAuthorizationRetainedBy, 'DAVID');
  assert.equal(review.recommendation.implementationAuthorized, false);
  assert.equal(review.recommendation.middlewareChangeAuthorized, false);
  assert.equal(review.recommendation.credentialChangeAuthorized, false);
  assert.equal(review.recommendation.productionMutationAuthorized, false);
  assert.ok(review.currentMethods.some((method) => method.id === 'ADMIN_HEADER_KEY'));
  assert.ok(review.currentMethods.some((method) => method.id === 'ADMIN_COOKIE_KEY'));
  assert.ok(review.currentMethods.some((method) => method.id === 'PRODUCTION_BROWSER_SESSION'));
  assert.ok(review.protectedSurfaces.some((surface) => surface.routePattern === '/admin'));
  assert.ok(review.protectedSurfaces.some((surface) => surface.routePattern === '/api/admin/:path*'));
  for (const criterion of eparbAuthenticationReviewCriteria) {
    assert.ok(review.criteriaWeights[criterion] > 0, `Missing weight for ${criterion}.`);
  }
}

function assertFailureModes() {
  const review = buildEparbAuthenticationAccessReview();

  const missingHuman = validateEparbAuthenticationAccessReview({
    ...review,
    currentMethods: review.currentMethods.filter((method) => !method.intendedIdentity.includes('HUMAN_ADMINISTRATOR')),
  });
  assert.equal(missingHuman.valid, false);
  assert.match(missingHuman.issues.join('\n'), /Human administrative identity/);

  const wrongRecommendation = validateEparbAuthenticationAccessReview({
    ...review,
    recommendation: {
      ...review.recommendation,
      selectedModel: 'MODEL_A_API_KEYS_FOR_PAGES_AND_APIS',
    },
  });
  assert.equal(wrongRecommendation.valid, false);
  assert.match(wrongRecommendation.issues.join('\n'), /repository-supported hybrid/);

  const implementationAllowed = validateEparbAuthenticationAccessReview({
    ...review,
    recommendation: {
      ...review.recommendation,
      implementationAuthorized: true as never,
    },
  });
  assert.equal(implementationAllowed.valid, false);
  assert.match(implementationAllowed.issues.join('\n'), /Implementation must remain unauthorized/);
}

async function main() {
  assertContractCompleteness();
  assertFailureModes();
  await assertNoRuntimeActivation();
  await assertDocumentationCoverage();

  console.log(
    '[eparb-authentication-access-review] ok: current mechanisms, human/machine separation, candidate models, role model, migration strategy, David authorization, and no-implementation posture verified.',
  );
}

main().catch((error) => {
  console.error('[eparb-authentication-access-review] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
