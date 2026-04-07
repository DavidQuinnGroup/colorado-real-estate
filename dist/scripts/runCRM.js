"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runCRMTasks_1 = require("../workers/runCRMTasks");
async function main() {
    try {
        await (0, runCRMTasks_1.runCRMTasks)();
        process.exit(0);
    }
    catch (error) {
        console.error("❌ CRM Worker crashed:", error);
        process.exit(1);
    }
}
main();
