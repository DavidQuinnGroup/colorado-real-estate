"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendEmail({ to, subject, html, leadId, }) {
    const replyTo = leadId
        ? `reply+${leadId}@reply.davidquinngroup.com`
        : undefined;
    try {
        const response = await resend.emails.send({
            from: "David Quinn <hello@davidquinngroup.com>",
            to,
            subject,
            html,
            // 🔥 CRITICAL: MUST be array for SES compatibility
            reply_to: replyTo ? [replyTo] : undefined,
            // 🔥 EXTRA SAFETY (forces header)
            headers: replyTo
                ? {
                    "Reply-To": replyTo,
                    "X-Lead-ID": leadId || "unknown",
                }
                : undefined,
        });
        console.log("📤 Email sent:", {
            to,
            replyTo,
            id: response.data?.id,
        });
        return response;
    }
    catch (error) {
        console.error("❌ Email send failed:", error);
        throw error;
    }
}
