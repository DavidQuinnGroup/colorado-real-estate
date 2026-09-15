import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

const globals = source("app/globals.css");
const shellStyles = source("components/agent/AgentWorkspaceShell.module.css");
const shell = source("components/agent/AgentWorkspaceShell.tsx");
const home = source("components/agent/AgentWorkspaceHome.tsx");
const buyer = source("components/agent/BuyerConsultationExperience.tsx");
const seller = source("components/agent/SellerConsultationExperience.tsx");
const preparationStyles = source("components/agent/PreparationWorkspace.module.css");
const intelligence = source("components/agent/IntelligenceWorkspace.tsx");
const intelligenceStyles = source("components/agent/IntelligenceWorkspace.module.css");
const strategyPage = source("app/agent/strategy/page.tsx");
const financialScenario = source("components/agent/MultiPropertyFinancialScenarioWorkspace.tsx");
const packageJson = JSON.parse(source("package.json")) as { scripts?: Record<string, string> };

const cssBlock = (css: string, selector: string) => css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{[^}]*\\}`))?.[0] ?? "";
const routeMainDoesNotRepaint = (name: string, sourceText: string) => {
  assert.doesNotMatch(sourceText, /atlas-agent-page-canvas/, `${name} route main must not introduce a duplicate page-canvas painter.`);
  assert.doesNotMatch(sourceText, /<main[^>]+className=["{`][^>"}`]*(bg-\[|bg-black|bg-slate|background|atlas-agent-page-canvas)/, `${name} route main must not repaint over AgentWorkspaceShell.`);
};

assert.match(shell, /data-testid="agent-workspace-shell"/, "AgentWorkspaceShell must remain the visible Agent page-canvas owner.");
assert.match(shellStyles, /\.shell \{[\s\S]*?background-color: var\(--atlas-profile-canvas\);[\s\S]*?background-image: linear-gradient\(135deg, var\(--atlas-profile-canvas-wash\) 0%, transparent 56%\), var\(--atlas-profile-canvas-atmosphere\);/, "Agent Workspace Home shell must remain the canonical page material reference.");
assert.doesNotMatch(globals, /\.atlas-agent-page-canvas \{[\s\S]*?background-(?:color|image):/, "Ordinary Agent child routes must not retain a duplicate page-canvas primitive.");
assert.match(home, /data-testid="agent-workspace-home"/, "Agent Workspace Home reference marker must remain present.");
assert.match(home, /<main className=\{styles\.home\}/, "Agent Workspace Home main must remain content/layout only.");
assert.doesNotMatch(home, /atlas-agent-page-canvas|bg-\[|bg-black|bg-slate/, "Agent Workspace Home main must not repaint the shell canvas.");

routeMainDoesNotRepaint("Buyer", buyer);
routeMainDoesNotRepaint("Seller", seller);
routeMainDoesNotRepaint("Intelligence", intelligence);

assert.doesNotMatch(cssBlock(preparationStyles, ".page"), /background:/, "Buyer/Seller preparation page module must not repaint over the canonical canvas.");
assert.doesNotMatch(cssBlock(intelligenceStyles, ".page"), /background:/, "Intelligence page module must not repaint over the canonical canvas.");

assert.match(strategyPage, /return <main>/, "Financial Strategy route main must render inside AgentWorkspaceShell without another canvas class.");
assert.doesNotMatch(strategyPage, /atlas-agent-page-canvas|<main[^>]+className=/, "Financial Strategy route main must not repaint the shell canvas.");
assert.doesNotMatch(strategyPage, /<header className="[^"]*(bg-\[|shadow-\[|backdrop-blur|border-b)/, "Financial Strategy header must not be a full-width structural card.");
assert.match(strategyPage, /<header className="px-5 py-8 text-\[var\(--atlas-text-primary\)\] sm:px-8 lg:px-12">/, "Financial Strategy header must sit directly on the canvas.");
assert.match(financialScenario, /<header className="atlas-financial-context flex flex-wrap items-start justify-between gap-4">/, "Financial Scenario Foundation header must retain its semantic header class.");
assert.match(cssBlock(globals, ".atlas-financial-context"), /background: transparent;/, "Financial Scenario Foundation header must be canvas-integrated.");
assert.match(cssBlock(globals, ".atlas-financial-context"), /box-shadow: none;/, "Financial Scenario Foundation header must not be a floating card.");
assert.match(cssBlock(globals, ".atlas-financial-context"), /backdrop-filter: none;/, "Financial Scenario Foundation header must not use card backdrop material.");
assert.match(globals, /\.atlas-financial-work-surface \{[\s\S]*?background: color-mix\(in srgb, var\(--atlas-profile-surface-elevated\) 82%, transparent\);[\s\S]*?box-shadow: var\(--atlas-profile-elevated-depth\);[\s\S]*?\}/, "New Scenario Version floating work surface must remain preserved.");

assert.match(preparationStyles, /\.workspace > \.consultationSetup \{[\s\S]*?background: transparent;[\s\S]*?box-shadow: none;/, "Buyer/Seller Consultation Setup must remain canvas-integrated.");
assert.match(intelligenceStyles, /\.workArea \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/, "Intelligence destination cards must remain floating surfaces.");
assert.match(intelligenceStyles, /\.principles \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/, "Intelligence provenance surface must remain preserved.");

assert.equal(packageJson.scripts?.["check:canonical-agent-page-material"], "jiti scripts/checkCanonicalAgentPageMaterial.ts");

console.log("CANONICAL_AGENT_PAGE_MATERIAL_OWNERSHIP_CHECK: PASS");
