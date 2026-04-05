"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueAlert = enqueueAlert;
async function enqueueAlert(alertId) {
    // Disabled for worker build isolation
    return;
    console.log("Enqueue alert:", alertId);
}
