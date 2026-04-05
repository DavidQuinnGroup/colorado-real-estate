"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectVariant = selectVariant;
function selectVariant() {
    const variants = ["A", "B"];
    // simple random split (50/50)
    return variants[Math.floor(Math.random() * variants.length)];
}
