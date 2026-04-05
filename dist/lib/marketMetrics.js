"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAbsorptionRate = calculateAbsorptionRate;
function calculateAbsorptionRate(inventory, monthlySales) {
    return (inventory / monthlySales).toFixed(1);
}
