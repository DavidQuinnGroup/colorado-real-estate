import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildEparbGovernanceContract,
  eparbDecisionOutcomes,
  eparbInitialReviewPortfolio,
  eparbLifecycle,
  eparbProhibitedActions,
  validateEparbGovernanceContract,
} from '../lib/eparb/eparbGovernanceContract.js';

const FORBIDDEN_RUNTIME_PATTERNS = [
  /fetch\s*\(/,
  /XMLHttpRequest/,
  /navigator\.sendBeacon/,
  /document\.cookie/,
  /localStorage/,
  /sessionStorage/,
  /prisma\./,
  /\$transaction/,
  /\.create\s*\(/,
  /\.update\s*\(/,
  /\.delete\s*\(/,
  /sendEmail/,
  /sendPropertyInquiryNotification/,
  /productionMutationAuthorized:\s*true/,
  /providerActivationAuthorized:\s*true/,
  /runtimeImplementationAuthorized:\s*true/,
];

function expectInvalid(
  input: Parameters<typeof validateEparbGovernanceContract>[0],
  expectedIssue: RegExp,
) {
  const result = validateEparbGovernanceContract(input);
  assert.equal(result.valid, false);
  assert.match(result.issues.join('\n'), expectedIssue);
}

async function assertNoRuntimeActivation() {
  const source = await readFile('lib/eparb/eparbGovernanceContract.ts', 'utf8');

  for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
    assert.doesNotMatch(source, pattern, `EPARB governance contract must remain runtime-neutral: ${pattern}`);
  }
}

async function assertDocumentationCoverage() {
  const charter = await readFile('docs/project-atlas/executive-library/EPARB-1.0-ENTERPRISE-PLATFORM-ARCHITECTURE-REVIEW-BOARD-CHARTER.md', 'utf8');
  const portfolio = await readFile('docs/project-atlas/executive-library/EPARB-1.0-INITIAL-REVIEW-PORTFOLIO.md', 'utf8');
  const chatStart = await readFile('docs/CHAT_START.md', 'utf8');

  assert.match(charter, /Protect the long-term architectural integrity of PROJECT ATLAS/, 'EPARB charter must state the mission.');
  assert.match(charter, /David retains final executive authorization/, 'EPARB charter must retain David executive authorization.');
  assert.match(charter, /EPARB may not independently authorize production mutation/, 'EPARB charter must prohibit production mutation authorization.');
  assert.match(charter, /EPARB may not bypass existing program governance/, 'EPARB charter must prohibit bypassing program governance.');
  assert.match(portfolio, /Enterprise Administrative Authentication and Access Architecture/, 'Initial review portfolio must include Review 1.');
  assert.match(portfolio, /Priority: `CRITICAL`/, 'Initial review portfolio must mark Review 1 as CRITICAL.');
  assert.match(portfolio, /Next recommended executive review/, 'Initial review portfolio must record Review 1 as next recommended.');
  assert.match(chatStart, /EPARB_1_0_ESTABLISHED_RUNTIME_IMPLEMENTATION_NOT_AUTHORIZED/, 'CHAT_START must record EPARB establishment.');
}

function assertGovernanceCompleteness() {
  const contract = buildEparbGovernanceContract();
  const result = validateEparbGovernanceContract(contract);

  assert.equal(result.valid, true, result.issues.join('\n'));
  assert.equal(contract.version, 'EPARB-1.0');
  assert.match(contract.mission, /long-term architectural integrity/);
  assert.equal(contract.authority.finalExecutiveAuthorizationRetainedBy, 'DAVID');
  assert.equal(contract.authority.productionMutationAuthorized, false);
  assert.equal(contract.authority.providerActivationAuthorized, false);
  assert.equal(contract.authority.runtimeImplementationAuthorized, false);
  assert.deepEqual(contract.authority.prohibited, eparbProhibitedActions);
  assert.deepEqual(contract.decisionOutcomes, eparbDecisionOutcomes);
  assert.deepEqual(contract.lifecycle, eparbLifecycle);
  assert.deepEqual(contract.initialReviewPortfolio, eparbInitialReviewPortfolio);

  const review1 = contract.initialReviewPortfolio[0];
  assert.equal(review1.id, 'EPARB-REVIEW-001');
  assert.equal(review1.priority, 'CRITICAL');
  assert.equal(review1.recommendedNext, true);
  assert.equal(review1.implementationAuthorized, false);
}

function assertFailureModes() {
  const contract = buildEparbGovernanceContract();

  expectInvalid(
    {
      ...contract,
      mission: 'Coordinate architecture.',
    },
    /mission must protect long-term architectural integrity/,
  );

  expectInvalid(
    {
      ...contract,
      authority: {
        ...contract.authority,
        finalExecutiveAuthorizationRetainedBy: 'EPARB' as never,
      },
    },
    /David must retain final executive authorization/,
  );

  expectInvalid(
    {
      ...contract,
      authority: {
        ...contract.authority,
        productionMutationAuthorized: true as never,
      },
    },
    /must not authorize production mutation/,
  );

  expectInvalid(
    {
      ...contract,
      decisionOutcomes: contract.decisionOutcomes.filter((outcome) => outcome !== 'REJECT'),
    },
    /Missing decision outcome REJECT/,
  );

  expectInvalid(
    {
      ...contract,
      lifecycle: contract.lifecycle.filter((stage) => stage !== 'EXECUTIVE_AUTHORIZATION'),
    },
    /Missing lifecycle stage EXECUTIVE_AUTHORIZATION/,
  );

  expectInvalid(
    {
      ...contract,
      initialReviewPortfolio: contract.initialReviewPortfolio.map((item) =>
        item.id === 'EPARB-REVIEW-001'
          ? { ...item, priority: 'HIGH' as never }
          : item,
      ),
    },
    /Review 1 must be CRITICAL/,
  );
}

async function main() {
  assertGovernanceCompleteness();
  assertFailureModes();
  await assertNoRuntimeActivation();
  await assertDocumentationCoverage();

  console.log(
    '[eparb-governance] ok: EPARB mission, authority boundaries, David executive authorization, review outcomes, lifecycle, initial review portfolio, critical Review 1, and no-runtime-activation posture verified.',
  );
}

main().catch((error) => {
  console.error('[eparb-governance] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
