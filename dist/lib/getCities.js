"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCities = getCities;
const neighborhoods_1 = require("@/data/neighborhoods");
function getCities() {
    const cities = new Set(neighborhoods_1.neighborhoods.map((n) => n.city));
    return Array.from(cities);
}
