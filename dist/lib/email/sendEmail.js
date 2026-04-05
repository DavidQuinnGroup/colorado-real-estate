"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendEmail(to, listings) {
    await resend.emails.send({
        from: "alerts@yourdomain.com",
        to,
        subject: "New Listings Found",
        html: `
      <h2>New listings match your search</h2>
      ${listings
            .slice(0, 5)
            .map((l) => `
        <div>
          <p>${l.address}</p>
          <p>$${l.price}</p>
        </div>
      `)
            .join("")}
    `,
    });
}
