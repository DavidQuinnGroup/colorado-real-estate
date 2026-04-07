"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerOutreachEmail = SellerOutreachEmail;
function SellerOutreachEmail({ city, price, reason, }) {
    return `
    <div style="font-family: Arial; max-width: 600px; margin: auto;">
      <h2>📊 Your Home May Be Underpriced</h2>

      <p>
        We identified a property in ${city} that appears to be priced below market value.
      </p>

      <p>
        <strong>Estimated Value Gap:</strong><br/>
        ${reason || "Based on recent comparable sales"}
      </p>

      <p>
        If you're considering selling, this could mean:
      </p>

      <ul>
        <li>You're leaving money on the table</li>
        <li>Buyer demand is higher than expected</li>
        <li>You may receive multiple offers</li>
      </ul>

      <p>
        Want a quick pricing analysis for your home?
      </p>

      <a href="#" style="color: blue;">
        Get Your Home Value →
      </a>
    </div>
  `;
}
