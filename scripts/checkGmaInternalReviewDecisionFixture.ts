import assert from "node:assert/strict";
import fs from "node:fs";

import {
  generateInternalMappingReviewQueue,
  type InternalMappingReviewQueueItem,
} from "../lib/gma/internalMappingReviewQueue.js";
import {
  generateInternalReviewDecisionFixtures,
  summarizeInternalReviewDecisionFixtures,
  validateInternalReviewDecisionFixture,
  type InternalReviewDecisionFixture,
} from "../lib/gma/internalReviewDecisionFixture.js";

const queue = generateInternalMappingReviewQueue();
const fixtures = generateInternalReviewDecisionFixtures(queue);
const repeatFixtures = generateInternalReviewDecisionFixtures(queue);
const summary = summarizeInternalReviewDecisionFixtures(fixtures);

assert.equal(fixtures.length, 10, "Fixture set must stay representative and bounded");
assert.deepEqual(fixtures, repeatFixtures, "Fixture decisions must be deterministic");
assert.equal(new Set(fixtures.map((fixture) => fixture.decisionId)).size, fixtures.length, "Decision IDs must be unique");
assert.equal(summary.activeEligibilityDecisions, 0, "No fixture decision can activate eligibility");
assert.equal(summary.authoritativeDecisions, 0, "No fixture decision can become authoritative");
assert.equal(summary.fixtureVersionCount, 1, "Fixture decisions must use explicit versioning");

for (const fixture of fixtures) {
  validateInternalReviewDecisionFixture(fixture, queue);
  assert.equal(fixture.activationEligibility, "NOT_ELIGIBLE");
  assert.equal(fixture.authoritativeStatus, "NON_AUTHORITATIVE_FIXTURE_ONLY");
  assert.equal(fixture.nextPermittedGate, "INTERNAL_PERSISTENCE_PROOF_REQUIRES_SEPARATE_AUTHORIZATION");
  assert.equal(fixture.deterministicReviewTimestamp, "2026-07-25T00:00:00.000Z");
  assert.equal(fixture.fixtureVersion, "GMA_1.0_INTERNAL_REVIEW_DECISION_FIXTURE_V1");
  assert.ok(fixture.prohibitedGates.includes("GIO_PERSISTENCE"));
  assert.ok(fixture.prohibitedGates.includes("PROPERTY_ASSIGNMENT"));
  assert.ok(fixture.prohibitedGates.includes("CUSTOMER_ACTIVATION"));
}

const exactMunicipality = mustFindFixture("GMA_DECISION_FIXTURE|V1|001");
assert.equal(exactMunicipality.reviewStatus, "APPROVED_AS_PREVIEW_CANDIDATE");
assert.equal(exactMunicipality.selectedAction, "CONFIRM_PREVIEW_CANDIDATE");
assert.equal(exactMunicipality.queueEvidenceSnapshot.sourceValue, "Thornton");
assert.equal(exactMunicipality.queueEvidenceSnapshot.proposedObjectType, "MUNICIPALITY");

const gunbarrel = mustFindFixture("GMA_DECISION_FIXTURE|V1|002");
assert.equal(gunbarrel.reviewStatus, "ESCALATED");
assert.equal(gunbarrel.preservedAmbiguity, "OBJECT_TYPE_AMBIGUITY");
assert.match(gunbarrel.rationale, /cannot receive an automated final object type/);

const superior = mustFindFixture("GMA_DECISION_FIXTURE|V1|003");
assert.equal(superior.reviewStatus, "CONFLICT_PRESERVED");
assert.equal(superior.preservedConflicts, "CONFLICT");
assert.match(superior.rationale, /registry mismatch/);

const niwot = mustFindFixture("GMA_DECISION_FIXTURE|V1|004");
assert.equal(niwot.reviewStatus, "NEEDS_MORE_EVIDENCE");
assert.match(niwot.requestedAdditionalEvidence, /authoritative/);

const marketArea = mustFindFixture("GMA_DECISION_FIXTURE|V1|005");
assert.equal(marketArea.reviewStatus, "CONFLICT_PRESERVED");
assert.equal(marketArea.queueEvidenceSnapshot.proposedObjectType, "MARKET_AREA");
assert.match(marketArea.rationale, /cannot be silently converted into a municipality/);

const staticPolygon = mustFindFixture("GMA_DECISION_FIXTURE|V1|006");
assert.equal(staticPolygon.reviewStatus, "DEFERRED");
assert.equal(staticPolygon.queueEvidenceSnapshot.sourceRepositoryLocation, "lib/neighborhoodPolygons.ts");
assert.match(staticPolygon.rationale, /cannot establish an authoritative neighborhood boundary/);

const legacyAlias = mustFindFixture("GMA_DECISION_FIXTURE|V1|007");
assert.equal(legacyAlias.reviewStatus, "APPROVED_AS_ALIAS_CANDIDATE");
assert.equal(legacyAlias.queueEvidenceSnapshot.mappingOutcome, "ALIAS_CANDIDATE");
assert.match(legacyAlias.rationale, /does not make it canonical/);

const legacyDuplicate = mustFindFixture("GMA_DECISION_FIXTURE|V1|008");
assert.equal(legacyDuplicate.reviewStatus, "DUPLICATE_CANDIDATE");
assert.equal(legacyDuplicate.preservedConflicts, "DUPLICATE");
assert.match(legacyDuplicate.rationale, /cannot be merged/);

const editorial = mustFindFixture("GMA_DECISION_FIXTURE|V1|009");
assert.equal(editorial.reviewStatus, "EDITORIAL_ONLY");
assert.equal(editorial.editorialSeparationResult, "EDITORIAL_ONLY_LOCKED");
assert.match(editorial.rationale, /page existence and search intent do not establish geographic identity/);

const deferredScope = mustFindFixture("GMA_DECISION_FIXTURE|V1|010");
assert.equal(deferredScope.reviewStatus, "DEFERRED");
assert.match(deferredScope.rationale, /ZIP and subdivision records were not generated/);
assert.match(deferredScope.requestedAdditionalEvidence, /aggregate-only ZIP\/subdivision preview authorization/);
assert.equal(queue.some((item) => item.proposedObjectType === "ZIP_CODE" || item.proposedObjectType === "SUBDIVISION"), false);

assertThrowsInvalid(mutatedFixture(editorial, {
  reviewStatus: "APPROVED_AS_PREVIEW_CANDIDATE",
  selectedAction: "CONFIRM_PREVIEW_CANDIDATE",
}), /Only unambiguous, non-conflicting, non-editorial items/);
assertThrowsInvalid(mutatedFixture(editorial, {
  reviewStatus: "APPROVED_AS_ALIAS_CANDIDATE",
  selectedAction: "CLASSIFY_AS_ALIAS_CANDIDATE",
}), /Only non-editorial alias candidates/);
assertThrowsInvalid(mutatedFixture(editorial, {
  reviewStatus: "APPROVED_AS_PREVIEW_CANDIDATE",
  selectedAction: "CONFIRM_PREVIEW_CANDIDATE",
  rationale: "Reviewer approval cannot bypass source and trust requirements.",
}), /Only unambiguous, non-conflicting, non-editorial items/);
assertThrowsInvalid(mutatedFixture(gunbarrel, {
  reviewStatus: "APPROVED_AS_PREVIEW_CANDIDATE",
  selectedAction: "CONFIRM_PREVIEW_CANDIDATE",
}), /Only unambiguous, non-conflicting, non-editorial items/);
assertThrowsInvalid(mutatedFixture(staticPolygon, {
  reviewStatus: "APPROVED_AS_PREVIEW_CANDIDATE",
  selectedAction: "CONFIRM_PREVIEW_CANDIDATE",
}), /Only unambiguous, non-conflicting, non-editorial items/);
assertThrowsInvalid(mutatedFixture(legacyDuplicate, {
  reviewStatus: "APPROVED_AS_PREVIEW_CANDIDATE",
  selectedAction: "CONFIRM_PREVIEW_CANDIDATE",
}), /Only unambiguous, non-conflicting, non-editorial items/);
assertThrowsInvalid(mutatedFixture(niwot, {
  rationale: "",
}), /Reviewer rationale is mandatory/);
assertThrowsInvalid(mutatedFixture(niwot, {
  reviewerRole: "UNAUTHORIZED_REVIEWER" as InternalReviewDecisionFixture["reviewerRole"],
}), /Unauthorized reviewer role/);
assertThrowsInvalid(mutatedFixture(exactMunicipality, {
  activationEligibility: "ACTIVE" as InternalReviewDecisionFixture["activationEligibility"],
}), /cannot activate eligibility/);
assertThrowsInvalid(mutatedFixture(exactMunicipality, {
  authoritativeStatus: "AUTHORITATIVE" as InternalReviewDecisionFixture["authoritativeStatus"],
}), /cannot become authoritative/);
assertThrowsInvalid(mutatedFixture(superior, {
  preservedConflicts: "NONE",
}), /failed to preserve conflict state/);

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const packageJson = fs.readFileSync("package.json", "utf8");
assert.ok(packageJson.includes("check:gma-internal-review-decision-fixture"));
assert.equal(/GmaInternalReviewDecisionFixture|ReviewDecisionFixture|decision_fixture/i.test(schema), false);

const migrationNames = fs.readdirSync("prisma/migrations").join("\n");
assert.equal(/gma|review_decision|decision_fixture|internal_review/i.test(migrationNames), false);

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "lib/tracking", "workers"]) {
  if (!fs.existsSync(runtimeRoot)) continue;

  for (const file of listRuntimeSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("internalReviewDecisionFixture"), false, `Runtime imports GMA decision fixture: ${file}`);
    assert.equal(contents.includes("GMA_DECISION_FIXTURE"), false, `Runtime consumes GMA decision fixture IDs: ${file}`);
  }
}

console.log(
  `[gma-internal-review-decision-fixture] ok: ${fixtures.length} fixture decisions validated, reviewer roles/rationale/evidence compatibility passed, editorial promotion blocked, ambiguity/conflicts preserved, duplicate merge blocked, ZIP/subdivision absence kept inactive, no active eligibility, no Prisma/migration changes, no runtime imports.`,
);

function mustFindFixture(decisionId: string): InternalReviewDecisionFixture {
  const fixture = fixtures.find((item) => item.decisionId === decisionId);
  assert.ok(fixture, `Missing fixture ${decisionId}`);
  return fixture;
}

function mutatedFixture(
  fixture: InternalReviewDecisionFixture,
  overrides: Partial<InternalReviewDecisionFixture>,
): InternalReviewDecisionFixture {
  return { ...fixture, ...overrides };
}

function assertThrowsInvalid(fixture: InternalReviewDecisionFixture, pattern: RegExp) {
  assert.throws(() => validateInternalReviewDecisionFixture(fixture, queue), pattern);
}

function listRuntimeSourceFiles(root: string): string[] {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = `${root}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...listRuntimeSourceFiles(path));
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(path)) {
      files.push(path);
    }
  }

  return files;
}

function mustFindQueue(
  items: readonly InternalMappingReviewQueueItem[],
  predicate: (item: InternalMappingReviewQueueItem) => boolean,
): InternalMappingReviewQueueItem {
  const item = items.find(predicate);
  assert.ok(item);
  return item;
}

assert.ok(mustFindQueue(queue, (item) => item.queueItemId === exactMunicipality.queueItemId));
