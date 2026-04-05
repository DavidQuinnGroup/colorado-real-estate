"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runMLSCoordinator;
const syncMLSGrid_1 = require("../lib/mls/syncMLSGrid");
async function runMLSCoordinator() {
    await (0, syncMLSGrid_1.syncMLSGrid)({
        maxRuntimeMs: Number(process.env.MLS_MAX_RUNTIME_MS || 600000),
    });
}
