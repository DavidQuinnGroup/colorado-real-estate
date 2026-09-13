import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

const buyer = source("components/agent/BuyerConsultationExperience.tsx");
const seller = source("components/agent/SellerConsultationExperience.tsx");
const shared = source("components/agent/PreparationWorkspace.tsx");
const styles = source("components/agent/PreparationWorkspace.module.css");
const packageJson = JSON.parse(source("package.json")) as { scripts?: Record<string, string> };

for (const experience of [buyer, seller]) {
  assert.match(experience, /PreparationStartingStateOption/, "Preparation routes must use the canonical starting-state control.");
  assert.match(experience, /PreparationTopicOption/, "Preparation routes must use the canonical unlimited topic control.");
  assert.match(experience, /PreparationSessionStatus/, "Preparation routes must use canonical non-interactive session metadata.");
  assert.match(experience, /data-persistence="false"/, "Preparation must remain session-only.");
  assert.match(experience, /data-same-page-decision-continuity="true"/, "Preparation must retain same-page decision continuity.");
  assert.doesNotMatch(experience, /useRouter|router\.push|window\.location/, "Selection must not redirect the Agent.");
}

assert.match(buyer, /complete Buyer consultation playbook remains available/, "Buyer Priority Focus must preserve the complete playbook.");
assert.match(seller, /complete Seller consultation playbook remains available/, "Seller Priority Focus must preserve the complete playbook.");
assert.match(shared, /type="radio"/, "Starting-state cards must preserve radio semantics.");
assert.match(shared, /type="checkbox"/, "Topic cards must preserve checkbox semantics.");
assert.match(shared, /<span className=\{styles\.sessionStatus\}>No information is saved<\/span>/, "Session metadata must remain ordinary informational content.");
assert.doesNotMatch(shared, /sessionStatus[^]*?(role="button"|tabIndex=|onClick=|href=)/, "Session metadata must not become actionable.");
assert.match(styles, /var\(--atlas-profile-surface-primary\)/, "The workspace must consume Foundation profile surfaces.");
assert.match(styles, /var\(--atlas-focus-ring\)/, "The workspace must consume Foundation focus treatment.");
assert.match(styles, /cursor: pointer/, "Interactive preparation controls must present a pointer cursor.");
assert.match(styles, /prefers-reduced-motion/, "Preparation transitions must respect reduced motion.");
assert.match(styles, /grid-template-areas: "eyebrow status" "title status"/, "Desktop metadata must preserve the accepted compact header relationship.");
assert.match(styles, /grid-template-areas: "eyebrow" "status" "title"/, "Narrow layouts must keep session metadata subordinate to the section identity.");
assert.match(styles, /\.sessionStatus \{ justify-self: start; min-height: auto; border: 0;/, "Narrow metadata must not use an action-like bordered badge.");
assert.match(styles, /\.sessionStatus \{[^}]*cursor: default;/, "Session metadata must not present an action pointer.");
assert.doesNotMatch(styles, /#[0-9a-fA-F]{3,8}/, "The adoption stylesheet must not duplicate color values outside Foundation tokens.");
assert.equal(packageJson.scripts?.["check:liquid-glass-buyer-seller-preparation-adoption"], "jiti scripts/checkLiquidGlassBuyerSellerPreparationAdoption.ts");

console.log("LIQUID_GLASS_BUYER_SELLER_PREPARATION_ADOPTION_CHECK: PASS");
