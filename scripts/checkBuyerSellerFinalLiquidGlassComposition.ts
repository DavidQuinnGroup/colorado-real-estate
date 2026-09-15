import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

const buyer = source("components/agent/BuyerConsultationExperience.tsx");
const seller = source("components/agent/SellerConsultationExperience.tsx");
const shared = source("components/agent/PreparationWorkspace.tsx");
const styles = source("components/agent/PreparationWorkspace.module.css");
const packageJson = JSON.parse(source("package.json")) as { scripts?: Record<string, string> };

function countMatches(value: string, pattern: RegExp) {
  return value.match(pattern)?.length ?? 0;
}

for (const [name, experience] of [
  ["Buyer", buyer],
  ["Seller", seller],
] as const) {
  assert.equal(countMatches(experience, /className=\{`\$\{styles\.section\} \$\{styles\.consultationSetup\}`\}/g), 1, `${name} must make Consultation Setup canvas-integrated instead of a large structural card.`);
  assert.equal(countMatches(experience, /<fieldset className=\{styles\.flatSection\}>/g), 2, `${name} setup must use two flat internal fieldsets.`);
  assert.equal(countMatches(experience, /<fieldset className=\{styles\.section\}>/g), 0, `${name} setup must not use section fieldsets as redundant structural panels.`);
  assert.match(experience, /<section className=\{`\$\{styles\.section\} \$\{styles\.consultationSetup\}`\}>[\s\S]*?<PreparationSessionStatus \/>[\s\S]*?<fieldset className=\{styles\.flatSection\}>[\s\S]*?<PreparationStartingStateOption[\s\S]*?<fieldset className=\{styles\.flatSection\}>[\s\S]*?<PreparationTopicOption/, `${name} must preserve canvas-integrated Consultation Setup with flat starting-point and topic sections.`);
  assert.match(experience, /complete (Buyer|Seller) consultation playbook remains available/, `${name} topic selection must preserve unlimited Priority Focus semantics.`);
}

assert.match(styles, /\.workspace > \.consultationSetup \{[\s\S]*?border: 0;[\s\S]*?border-radius: 0;[\s\S]*?padding: 0;[\s\S]*?background: transparent;[\s\S]*?box-shadow: none;[\s\S]*?backdrop-filter: none;/, "Consultation Setup must be canvas-integrated, not a large Liquid Glass structural surface.");
assert.match(styles, /\.flatSection \{[\s\S]*?border: 0;[\s\S]*?background: transparent;[\s\S]*?box-shadow: none;/, "Starting-point and topic sections must not be redundant filled structural wrappers.");
assert.match(styles, /\.flatSection \+ \.flatSection \{[\s\S]*?border-top: 1px solid color-mix\(in srgb, var\(--atlas-profile-border-subtle\) 30%, transparent\);/, "Major setup sections may use one subtle low-contrast divider.");
assert.doesNotMatch(styles, /\.workspace fieldset\.section \{/, "The old filled inner fieldset structural panel must not return.");
assert.match(styles, /\.selectionCard, \.topicOption \{[\s\S]*?background: color-mix\(in srgb, var\(--atlas-profile-surface-secondary\) 82%, transparent\);/, "Interactive option surfaces must remain visible.");
assert.match(styles, /\.selectionCard:hover, \.topicOption:hover \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/, "Interactive option hover surfaces must remain clear.");
assert.match(styles, /\.selectionCard\[data-selected='true'\], \.topicOption\[data-selected='true'\] \{[\s\S]*?border-color: color-mix\(in srgb, var\(--atlas-action-primary\) 72%, transparent\);/, "Selected option states must remain obvious.");
assert.match(styles, /\.selectionCard:focus-within, \.topicOption:focus-within \{[\s\S]*?outline: 3px solid var\(--atlas-focus-ring\);/, "Keyboard focus must remain accessible.");
assert.match(shared, /type="radio"/, "Starting-point controls must preserve radio semantics.");
assert.match(shared, /type="checkbox"/, "Topic controls must preserve checkbox semantics.");
assert.match(shared, /<span className=\{styles\.sessionStatus\}>No information is saved<\/span>/, "No information is saved indicator must remain present.");
assert.match(styles, /\.guidance \{[\s\S]*?box-shadow: var\(--atlas-profile-elevated-depth\);/, "Focused briefing surface must remain a distinct secondary floating surface.");
assert.doesNotMatch(styles, /#[0-9a-fA-F]{3,8}/, "Composition normalization must remain token-driven and theme-aware.");
assert.equal(packageJson.scripts?.["check:buyer-seller-final-liquid-glass-composition"], "jiti scripts/checkBuyerSellerFinalLiquidGlassComposition.ts");

console.log("BUYER_SELLER_FINAL_LIQUID_GLASS_COMPOSITION_CHECK: PASS");
