"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMarketHealth = calculateMarketHealth;
exports.calculateAbsorptionRate = calculateAbsorptionRate;
exports.calculateDemandIndex = calculateDemandIndex;
exports.calculateSellerCompetition = calculateSellerCompetition;
function calculateMarketHealth(priceGrowth, inventory, daysOnMarket) {
    const priceScore = Math.min(Math.max(priceGrowth * 10, 0), 40);
    const inventoryScore = inventory < 300 ? 30 :
        inventory < 500 ? 20 :
            inventory < 700 ? 10 : 5;
    const domScore = daysOnMarket < 25 ? 30 :
        daysOnMarket < 40 ? 20 :
            daysOnMarket < 60 ? 10 : 5;
    return Math.round(priceScore + inventoryScore + domScore);
}
function calculateAbsorptionRate(inventory, monthlySales) {
    return inventory / monthlySales;
}
function calculateDemandIndex(pendingSales, activeListings) {
    return pendingSales / activeListings;
}
function calculateSellerCompetition(saleToListRatio) {
    if (saleToListRatio > 1)
        return "High";
    if (saleToListRatio > 0.97)
        return "Moderate";
    return "Low";
}
