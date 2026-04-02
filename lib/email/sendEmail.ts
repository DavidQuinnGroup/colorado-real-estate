import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(to: string, listings: any[]) {
  await resend.emails.send({
    from: "alerts@yourdomain.com",
    to,
    subject: "New Listings Found",
    html: `
      <h2>New listings match your search</h2>
      ${listings
        .slice(0, 5)
        .map(
          (l) => `
        <div>
          <p>${l.address}</p>
          <p>$${l.price}</p>
        </div>
      `
        )
        .join("")}
    `,
  })
}