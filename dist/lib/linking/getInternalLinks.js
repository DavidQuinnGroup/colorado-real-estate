"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCityLinks = getCityLinks;
const cities_1 = require("@/data/cities");
function getCityLinks(currentCity) {
    return cities_1.cities
        .filter(c => c.slug !== currentCity)
        .slice(0, 5)
        .map(city => ({
        name: city.name,
        url: `/${city.slug}-real-estate`
    }));
}
