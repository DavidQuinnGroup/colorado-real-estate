import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAlertEmail({
  to,
  address,
  price,
}: {
  to: string
  address?: string
  price?: number
}) {
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
    })

    console.log("📧 Email sent:", response)
  } catch (error) {
    console.error("❌ Email failed:", error)
    throw error
  }
}