"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deadLetterQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("./redis");
exports.deadLetterQueue = new bullmq_1.Queue("mls-dead-letter", {
    connection: redis_1.connection,
});
