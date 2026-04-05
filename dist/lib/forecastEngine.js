"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMarketForecast = generateMarketForecast;
function generateMarketForecast(city) {
    const baseGrowth = 0.045;
    const demandScore = Math.random() * 0.02;
    const inventoryPressure = Math.random() * -0.015;
    const predictedGrowth = baseGrowth + demandScore + inventoryPressure;
    const appreciation = (predictedGrowth * 100).toFixed(1);
    let outlook = "Stable";
    if (predictedGrowth > 0.05)
        outlook = "Strong Growth";
    if (predictedGrowth < 0.02)
        outlook = "Cooling";
    return {
        city,
        appreciation,
        outlook
    };
}
