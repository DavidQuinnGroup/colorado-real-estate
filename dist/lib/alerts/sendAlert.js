"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAlert = sendAlert;
async function sendAlert(message) {
    console.log("🚨 ALERT:", message);
    if (!process.env.SLACK_WEBHOOK_URL)
        return;
    try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: message,
            }),
        });
    }
    catch (err) {
        console.error("Slack alert failed:", err);
    }
}
