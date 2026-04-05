"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExpansionPages = generateExpansionPages;
const expansion_1 = require("@/data/expansion");
function generateExpansionPages() {
    const pages = [];
    expansion_1.cities.forEach(city => {
        expansion_1.homeTypes.forEach(type => {
            pages.push({
                city,
                type
            });
        });
        expansion_1.lifestyle.forEach(topic => {
            pages.push({
                city,
                type: topic
            });
        });
    });
    return pages;
}
