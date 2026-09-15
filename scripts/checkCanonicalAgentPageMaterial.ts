import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

const globals = source("app/globals.css");
const shellStyles = source("components/agent/AgentWorkspaceShell.module.css");
const home = source("components/agent/AgentWorkspaceHome.tsx");
const buyer = source("components/agent/BuyerConsultationExperience.tsx");
const seller = source("components/agent/SellerConsultationExperience.tsx");
const preparationStyles = source("components/agent/PreparationWorkspace.module.css");
const intelligence = source("components/agent/IntelligenceWorkspace.tsx");
const intelligenceStyles = source("components/agent/IntelligenceWorkspace.module.css");
const strategyPage = source("app/agent/strategy/page.tsx");
const packageJson = JSON.parse(source("package.json")) as { scripts?: Record<string, string> };

const canonicalCanvas = /\.atlas-agent-page-canvas \{[\s\S]*?background-color: var\(--atlas-profile-canvas\);[\s\S]*?background-image: linear-gradient\(135deg, var\(--atlas-profile-canvas-wash\) 0%, transparent 56%\), var\(--atlas-profile-canvas-atmosphere\);[\s\S]*?color: var\(--atlas-text-primary\);[\s\S]*?\}/;
const cssBlock = (css: string, selector: string) => css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{[^}]*\\}`))?.[0] ?? "";

assert.match(shellStyles, /\.shell \{[\s\S]*?background-color: var\(--atlas-profile-canvas\);[\s\S]*?background-image: linear-gradient\(135deg, var\(--atlas-profile-canvas-wash\) 0%, transparent 56%\), var\(--atlas-profile-canvas-atmosphere\);/, "Agent Workspace Home shell must remain the canonical page material reference.");
assert.match(globals, canonicalCanvas, "Canonical Agent page canvas primitive must reuse the Agent Workspace Home page material formula.");
assert.match(home, /data-testid="agent-workspace-home"/, "Agent Workspace Home reference marker must remain present.");

for (const [name, sourceText] of [
  ["Buyer", buyer],
  ["Seller", seller],
  ["Intelligence", intelligence],
] as const) {
  assert.match(sourceText, /atlas-agent-page-canvas/, `${name} must use the canonical Agent page canvas.`);
}

assert.doesNotMatch(cssBlock(preparationStyles, ".page"), /background:/, "Buyer/Seller preparation page module must not repaint over the canonical canvas.");
assert.doesNotMatch(cssBlock(intelligenceStyles, ".page"), /background:/, "Intelligence page module must not repaint over the canonical canvas.");

assert.match(strategyPage, /<main className="atlas-agent-page-canvas">/, "Financial Strategy must use the canonical Agent page canvas.");
assert.doesNotMatch(strategyPage, /<header className="[^"]*(bg-\[|shadow-\[|backdrop-blur|border-b)/, "Financial Strategy header must not be a full-width structural card.");
assert.match(strategyPage, /<header className="px-5 py-8 text-\[var\(--atlas-text-primary\)\] sm:px-8 lg:px-12">/, "Financial Strategy header must sit directly on the canvas.");

assert.match(preparationStyles, /\.workspace > \.consultationSetup \{[\s\S]*?background: transparent;[\s\S]*?box-shadow: none;/, "Buyer/Seller Consultation Setup must remain canvas-integrated.");
assert.match(intelligenceStyles, /\.workArea \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/, "Intelligence destination cards must remain floating surfaces.");
assert.match(intelligenceStyles, /\.principles \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/, "Intelligence provenance surface must remain preserved.");

assert.equal(packageJson.scripts?.["check:canonical-agent-page-material"], "jiti scripts/checkCanonicalAgentPageMaterial.ts");

console.log("CANONICAL_AGENT_PAGE_MATERIAL_CHECK: PASS");
