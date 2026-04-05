"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMLSPage = fetchMLSPage;
const axios_1 = __importDefault(require("axios"));
async function fetchMLSPage({ page, pageSize, lastSync }) {
    const url = `${process.env.MLS_GRID_BASE_URL}/Property`;
    const params = {
        $top: pageSize,
        $skip: page * pageSize,
    };
    if (lastSync) {
        params.$filter = `ModificationTimestamp gt ${new Date(lastSync).toISOString()}`;
    }
    const res = await axios_1.default.get(url, {
        headers: {
            Authorization: `Bearer ${process.env.MLS_GRID_TOKEN}`,
        },
        params,
    });
    return res.data;
}
