import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

const DIST_RUNNER = "dist/scripts/index.js";

function printBuildGuidance() {
  console.error(`Missing ${DIST_RUNNER}.`);
  console.error("Build worker/script output first from Terminal 5: npm run worker:build");
}

function runCompiledTypesenseIndexer() {
  if (!existsSync(DIST_RUNNER)) {
    printBuildGuidance();
    process.exitCode = 1;
    return;
  }

  const child = spawn(process.execPath, [DIST_RUNNER, ...process.argv.slice(2)], {
    stdio: "inherit",
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.error(`Typesense index runner stopped by signal ${signal}.`);
      process.exitCode = 1;
      return;
    }

    process.exitCode = code ?? 1;
  });

  child.on("error", (error) => {
    console.error("Failed to start compiled Typesense index runner:", error.message);
    process.exitCode = 1;
  });
}

runCompiledTypesenseIndexer();

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.js
