import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY);

const leadId = "test123";

async function send() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("❌ Missing RESEND_API_KEY");
  }

  const replyTo = `reply+${leadId}@reply.davidquinngroup.com`;

  const response = await resend.emails.send({
    from: "David Quinn <hello@davidquinngroup.com>",
    to: "davidquinngroup@gmail.com",
    subject: "Test Reply Capture",

    html: `
      <p>Reply to this email</p>
      <p>Lead ID: ${leadId}</p>
    `,

    // 🚨 THIS IS THE FIX (NOT reply_to)
    replyTo: replyTo,
  });

  console.log("✅ Sent:", response);
}

send();