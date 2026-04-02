import { sendEmail } from '../email/sendEmail'

interface SellerLead {
  id: string
  email: string
  name?: string | null
}

export async function sendSellerOutreach(lead: SellerLead) {
  if (!lead.email) {
    throw new Error('Missing lead email')
  }

  const subject = 'Quick question about your property'

  const html = `
    <p>Hi ${lead.name || 'there'},</p>

    <p>I came across your property and had a quick question.</p>

    <p>Would you consider selling if the right opportunity came up?</p>

    <p>– David</p>
  `

  return sendEmail({
    to: lead.email,
    subject,
    html,
    leadId: lead.id, // 🔥 CRITICAL
  })
}