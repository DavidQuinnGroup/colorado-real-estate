"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSellerOutreach = sendSellerOutreach;
const sendEmail_1 = require("../email/sendEmail");
async function sendSellerOutreach(lead) {
    if (!lead.email) {
        throw new Error('Missing lead email');
    }
    const subject = 'Quick question about your property';
    const html = `
    <p>Hi ${lead.name || 'there'},</p>

    <p>I came across your property and had a quick question.</p>

    <p>Would you consider selling if the right opportunity came up?</p>

    <p>– David</p>
  `;
    return (0, sendEmail_1.sendEmail)({
        to: lead.email,
        subject,
        html,
        leadId: lead.id, // 🔥 CRITICAL
    });
}
