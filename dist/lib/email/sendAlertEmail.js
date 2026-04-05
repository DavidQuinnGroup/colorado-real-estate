"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAlertEmail = sendAlertEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendAlertEmail({ to, address, price, }) {
    try {
        const response = await resend.emails.send({
            from: "David Quinn Group <alerts@yourdomain.com>",
            to,
            subject: "New Property Alert 🚨",
            html: `
        <h2>New Listing Alert</h2>
        <p><strong>${address}</strong></p>
        <p>Price: $${price?.toLocaleString()}</p>
      `
        });
        console.log("📧 Email sent:", response);
    }
    catch (error) {
        console.error("❌ Email failed:", error);
        throw error;
    }
}
