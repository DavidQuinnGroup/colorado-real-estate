"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deadLetterQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("./redis");
const connection = (0, redis_1.getRedisConnection)();
exports.deadLetterQueue = new bullmq_1.Queue("mls-dead-letter", {
    connection,
});
