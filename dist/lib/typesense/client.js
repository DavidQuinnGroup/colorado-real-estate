"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typesense = void 0;
const typesense_1 = __importDefault(require("typesense"));
exports.typesense = new typesense_1.default.Client({
    nodes: [
        {
            host: "localhost",
            port: 8108,
            protocol: "http",
        },
    ],
    apiKey: "xyz",
    connectionTimeoutSeconds: 2,
});
