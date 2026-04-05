"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewListings = getNewListings;
exports.getPriceDrops = getPriceDrops;
const properties_1 = require("./properties");
function getNewListings(city) {
    return properties_1.properties
        .filter((p) => p.city === city)
        .slice(0, 20);
}
function getPriceDrops(city) {
    return properties_1.properties
        .filter((p) => p.city === city && p.price < 1000000)
        .slice(0, 20);
}
