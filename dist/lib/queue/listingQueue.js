"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const redis_1 = require("./redis");
const connection = (0, redis_1.getRedisConnection)();
exports.connection = connection;
