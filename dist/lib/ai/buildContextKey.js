"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildContextKey = buildContextKey;
function buildContextKey({ city, beds, price, }) {
    const priceBucket = getPriceBucket(price);
    return [
        city || "unknown",
        beds || "x",
        priceBucket,
    ].join("-");
}
function getPriceBucket(price) {
    if (!price)
        return "unknown";
    if (price < 500000)
        return "low";
    if (price < 1000000)
        return "mid";
    return "high";
}
