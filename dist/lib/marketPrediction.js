"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictMarketTrend = predictMarketTrend;
function predictMarketTrend(inventoryTrend, domTrend, priceReductionRate, absorptionRate, priceMomentum) {
    let score = 50;
    score += priceMomentum * 20;
    score -= inventoryTrend * 10;
    score -= domTrend * 10;
    score -= priceReductionRate * 15;
    score += absorptionRate * 5;
    if (score > 100)
        score = 100;
    if (score < 0)
        score = 0;
    return Math.round(score);
}
