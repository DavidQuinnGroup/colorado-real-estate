"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMLSGridListings = fetchMLSGridListings;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.local" });
const rateLimiter_1 = require("./rateLimiter");
const BASE_URL = process.env.MLS_GRID_BASE_URL;
const TOKEN = process.env.MLS_GRID_TOKEN;
if (!BASE_URL)
    throw new Error("Missing MLS_GRID_BASE_URL");
if (!TOKEN)
    throw new Error("Missing MLS_GRID_TOKEN");
async function fetchMLSGridListings({ skip, top, lastSync, }) {
    const url = `${BASE_URL}/Property?$top=${top}&$skip=${skip}&$filter=ModificationTimestamp gt ${lastSync}`;
    console.log("🌐 MLS Request:", url);
    await (0, rateLimiter_1.rateLimit)();
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    if (!res.ok) {
        throw new Error(`MLS API Error: ${res.status}`);
    }
    const data = await res.json();
    return data.value || [];
}
