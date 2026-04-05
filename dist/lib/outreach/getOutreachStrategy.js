"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutreachStrategy = getOutreachStrategy;
function getOutreachStrategy(dealScore) {
    if (dealScore >= 60) {
        return "aggressive";
    }
    if (dealScore >= 40) {
        return "standard";
    }
    return "light";
}
