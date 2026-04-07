"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddresses = getAddresses;
const mlsImporter_1 = require("@/lib/mlsImporter");
async function getAddresses() {
    const listings = await (0, mlsImporter_1.fetchMLSListings)();
    return listings;
}
