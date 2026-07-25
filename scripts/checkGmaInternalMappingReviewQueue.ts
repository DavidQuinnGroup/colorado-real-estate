import assert from "node:assert/strict";
import fs from "node:fs";

import {
  generateInternalMappingReviewQueue,
  getUnresolvedReviewItems,
  loadReadOnlyPreviewLedger,
  permittedReviewActions,
  permittedReviewStatuses,
  recordDeterministicReviewDecision,
  summarizeInternalMappingReviewQueue,
  validateReviewTransition,
  type InternalMappingReviewQueueItem,
  type ReviewAction,
} from "../lib/gma/internalMappingReviewQueue.js";

const previewLedger = loadReadOnlyPreviewLedger();
const queue = generateInternalMappingReviewQueue(previewLedger);
const repeatQueue = generateInternalMappingReviewQueue(previewLedger);
const summary = summarizeInternalMappingReviewQueue(queue);
const unresolvedItems = getUnresolvedReviewItems(queue);

assert.equal(queue.length, previewLedger.length, "Every queue item must come from the read-only preview ledger");
assert.equal(queue.length, 91, "Queue must remain bounded to the existing 91-record preview ledger");
assert.deepEqual(queue, repeatQueue, "Queue generation must be deterministic");

const previewIds = new Set(previewLedger.map((record) => record.previewId));
assert.equal(queue.some((item) => !previewIds.has(item.previewRecordId)), false, "Queue contains a non-preview input");
assert.equal(queue.some((item) => item.activationEligibility !== "NOT_ELIGIBLE"), false, "Queue item became activation eligible");
assert.equal(queue.some((item) => item.sourcePreviewSnapshot.activationEligibility !== "NOT_ELIGIBLE"), false, "Preview source became activation eligible");
assert.equal(new Set(queue.map((item) => item.queueItemId)).size, queue.length, "Queue item IDs must be unique");
assert.equal(new Set(queue.map((item) => item.previewRecordId)).size, queue.length, "Preview record IDs must remain one-to-one");

for (const [index, item] of queue.entries()) {
  const source = previewLedger[index];
  assert.equal(item.previewRecordId, source.previewId);
  assert.equal(item.sourceAsset, source.sourceAsset);
  assert.equal(item.evidenceSummary, source.evidenceSummary);
  assert.deepEqual(item.sourcePreviewSnapshot, source, "Original preview evidence must be preserved");
  assert.equal(item.createdTimestamp, "2026-07-25T00:00:00.000Z");
  assert.equal(item.reviewVersion, "GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE_V1");
}

assert.ok(permittedReviewStatuses.includes("PENDING_REVIEW"));
assert.ok(permittedReviewStatuses.includes("EDITORIAL_ONLY"));
assert.ok(permittedReviewStatuses.includes("CONFLICT_PRESERVED"));
assert.ok(permittedReviewActions.includes("CLASSIFY_AS_EDITORIAL_ONLY"));
assert.ok(permittedReviewActions.includes("ESCALATE_FOR_ARCHITECTURAL_REVIEW"));
assert.equal((permittedReviewActions as readonly string[]).includes("CREATE_GIO_OBJECT"), false);
assert.equal((permittedReviewActions as readonly string[]).includes("WRITE_MAPPING"), false);
assert.equal((permittedReviewActions as readonly string[]).includes("ASSIGN_PROPERTY"), false);
assert.equal((permittedReviewActions as readonly string[]).includes("ENABLE_ELIGIBILITY"), false);

const editorialItems = queue.filter((item) => item.editorialSeparationStatus === "EDITORIAL_ONLY");
const ambiguousItems = queue.filter((item) => item.ambiguityType !== "NONE");
const duplicateItems = queue.filter((item) => item.conflictType === "DUPLICATE");
const conflictItems = queue.filter((item) => item.conflictType === "CONFLICT");
const polygonItems = queue.filter((item) => item.sourceRepositoryLocation === "lib/neighborhoodPolygons.ts");

assert.equal(editorialItems.length, 36, "Editorial-separation queue count drifted");
assert.ok(ambiguousItems.some((item) => item.sourceValue.includes("Gunbarrel")), "Gunbarrel ambiguity must remain in queue");
assert.ok(conflictItems.some((item) => item.sourceValue.includes("Superior")), "Superior registry mismatch must remain preserved");
assert.ok(queue.some((item) => item.sourceValue.includes("Niwot")), "Niwot authority question must remain in queue");
assert.ok(queue.some((item) => item.sourceRepositoryLocation === "lib/marketData.ts"), "Market-area review items must remain in queue");
assert.equal(polygonItems.every((item) => item.reviewerStatus === "DEFERRED"), true, "Static polygons must remain deferred");
assert.equal(editorialItems.every((item) => item.reviewerStatus === "EDITORIAL_ONLY" || item.reviewerStatus === "CONFLICT_PRESERVED"), true, "Editorial-only records must stay non-factual");
assert.equal(duplicateItems.every((item) => item.reviewerStatus === "DUPLICATE_CANDIDATE"), true, "Duplicate candidates must not be merged");
assert.equal(conflictItems.every((item) => item.reviewerStatus === "CONFLICT_PRESERVED"), true, "Conflicts must remain preserved");

const sampleEditorial = mustFind(editorialItems, (item) => item.sourceRepositoryLocation === "data/searchPages.ts");
assert.throws(
  () => validateReviewTransition(sampleEditorial, "CONFIRM_PREVIEW_CANDIDATE"),
  /Editorial-only item cannot transition/,
  "Editorial-to-factual promotion must fail",
);
assert.throws(
  () => validateReviewTransition(sampleEditorial, "CLASSIFY_AS_ALIAS_CANDIDATE"),
  /Editorial-only item cannot transition/,
  "Search intent cannot become an alias candidate",
);

const sampleAmbiguous = mustFind(ambiguousItems, (item) => item.sourceValue.includes("Gunbarrel"));
assert.throws(
  () => validateReviewTransition(sampleAmbiguous, "CONFIRM_PREVIEW_CANDIDATE"),
  /Ambiguous item cannot be approved/,
  "Ambiguous canonical approval must fail",
);

const sampleDuplicate = mustFind(duplicateItems, (item) => item.sourceValue.includes("Boulder") || item.sourceValue.includes("Mapleton Hill"));
assert.throws(
  () => validateReviewTransition(sampleDuplicate, "CONFIRM_PREVIEW_CANDIDATE"),
  /Duplicate candidate cannot be merged/,
  "Duplicate merge/approval must fail",
);

const sampleConflict = mustFind(conflictItems, (item) => item.sourceValue.includes("Superior") || item.sourceRepositoryLocation === "lib/marketData.ts");
assert.throws(
  () => validateReviewTransition(sampleConflict, "CLASSIFY_AS_ALIAS_CANDIDATE"),
  /Conflict item must remain preserved/,
  "Conflict conversion must fail",
);

const editorialDecision = recordDeterministicReviewDecision(
  sampleEditorial,
  "CLASSIFY_AS_EDITORIAL_ONLY",
  "Negative conversion test confirms editorial-only posture.",
);
assert.equal(editorialDecision.activationEligibility, "NOT_ELIGIBLE");
assert.equal(editorialDecision.reviewerStatus, "EDITORIAL_ONLY");

const conflictDecision = recordDeterministicReviewDecision(
  sampleConflict,
  "PRESERVE_CONFLICT",
  "Conflict-preservation test confirms no merge or canonical selection.",
);
assert.equal(conflictDecision.activationEligibility, "NOT_ELIGIBLE");
assert.equal(conflictDecision.reviewerStatus, "CONFLICT_PRESERVED");

assert.equal(summary.totalQueueItems, 91);
assert.equal(summary.activationEligibleItems, 0);
assert.equal(summary.editorialOnlyItems, 36);
assert.ok(summary.ambiguousItems >= 2);
assert.ok(summary.duplicateItems >= 2);
assert.ok(summary.conflictItems >= 1);
assert.ok(unresolvedItems.length > 0, "Review queue must preserve unresolved work instead of auto-approving it");

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const packageJson = fs.readFileSync("package.json", "utf8");
assert.ok(packageJson.includes("check:gma-internal-mapping-review-queue"));
assert.equal(/GmaInternalMappingReviewQueue|InternalMappingReviewQueue|mapping_review_queue/i.test(schema), false);

const migrationNames = fs.readdirSync("prisma/migrations").join("\n");
assert.equal(/gma|mapping_review|review_queue|internal_mapping/i.test(migrationNames), false);

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "lib/tracking", "workers"]) {
  if (!fs.existsSync(runtimeRoot)) continue;

  for (const file of listRuntimeSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("internalMappingReviewQueue"), false, `Runtime imports GMA review queue: ${file}`);
    assert.equal(contents.includes("GMA_REVIEW_QUEUE"), false, `Runtime consumes GMA review queue IDs: ${file}`);
  }
}

console.log(
  `[gma-internal-mapping-review-queue] ok: ${queue.length} queue items generated from read-only preview records, ${editorialItems.length} editorial-only items locked, ${duplicateItems.length} duplicate candidates preserved, ${conflictItems.length} conflicts preserved, ${ambiguousItems.length} ambiguous items blocked from canonical approval, ${unresolvedItems.length} unresolved items retained, no active eligibility, no Prisma/migration changes, no runtime imports.`,
);

function mustFind(
  items: readonly InternalMappingReviewQueueItem[],
  predicate: (item: InternalMappingReviewQueueItem) => boolean,
): InternalMappingReviewQueueItem {
  const item = items.find(predicate);
  assert.ok(item);
  return item;
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
