"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlsPageQueue = exports.mlsQueue = exports.connection = void 0;
const bullmq_1 = require("bullmq");
exports.connection = {
    host: "127.0.0.1",
    port: 6379,
};
exports.mlsQueue = new bullmq_1.Queue("mls-sync", {
    connection: exports.connection,
});
exports.mlsPageQueue = new bullmq_1.Queue("mls-page", {
    connection: exports.connection,
});
