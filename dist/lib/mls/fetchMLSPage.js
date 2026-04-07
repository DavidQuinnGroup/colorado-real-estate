"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMLSPage = fetchMLSPage;
const axios_1 = __importDefault(require("axios"));
async function fetchMLSPage({ top, skip, lastSync, }) {
    // 🔥 HARD GUARD (THIS FIXES YOUR BUG)
    const safeSkip = isNaN(skip) ? 0 : Number(skip);
    if (isNaN(skip)) {
        console.error("❌ skip was NaN — forcing to 0");
    }
    const url = `${process.env.MLS_GRID_BASE_URL}/Property`;
    const response = await axios_1.default.get(url, {
        headers: {
            Authorization: `Bearer ${process.env.MLS_GRID_TOKEN}`,
        },
        params: {
            $top: top,
            $skip: safeSkip,
            $filter: `ModificationTimestamp gt ${lastSync}`,
        },
    });
    return response.data?.value || [];
}
