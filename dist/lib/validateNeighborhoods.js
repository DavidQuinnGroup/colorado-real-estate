"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNeighborhoods = validateNeighborhoods;
const neighborhoods_1 = require("@/data/neighborhoods");
function validateNeighborhoods() {
    neighborhoods_1.neighborhoods.forEach(n => {
        if (!n.slug) {
            throw new Error(`Neighborhood missing slug: ${n.name}`);
        }
        if (!n.city) {
            throw new Error(`Neighborhood missing city: ${n.name}`);
        }
        if (!n.name) {
            throw new Error(`Neighborhood missing name`);
        }
    });
}
