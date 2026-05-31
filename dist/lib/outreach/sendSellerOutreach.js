import { Resend } from "resend";
export async function sendSellerOutreach(lead) {
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
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: lead.email,
        subject,
        html,
    });
}
