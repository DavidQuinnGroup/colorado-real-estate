"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMarketHealth = calculateMarketHealth;
function calculateMarketHealth(priceGrowth, inventory, daysOnMarket) {
    const priceScore = Math.min(Math.max(priceGrowth * 10, 0), 40);
    const inventoryScore = inventory < 300 ? 30 :
        inventory < 500 ? 20 :
            inventory < 700 ? 10 : 5;
    const domScore = daysOnMarket < 25 ? 30 :
        daysOnMarket < 40 ? 20 :
            daysOnMarket < 60 ? 10 : 5;
    const score = priceScore + inventoryScore + domScore;
    return Math.round(score);
}
