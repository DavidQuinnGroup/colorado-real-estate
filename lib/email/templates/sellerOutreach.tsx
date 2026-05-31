type SellerOutreachEmailProps = {
  city?: string;
  price?: number;
  reason?: string;
};

function formatPrice(price?: number) {
  if (typeof price !== 'number' || !Number.isFinite(price)) {
    return 'a nearby listing';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function SellerOutreachEmail({ city, price, reason }: SellerOutreachEmailProps) {
  const marketName = city || 'your area';
  const referencePrice = formatPrice(price);
  const valueGapReason = reason || 'Based on recent comparable sales';

  return `
    <div style="font-family: Arial; max-width: 600px; margin: auto;">
      <h2>Your Home May Be Underpriced</h2>

      <p>
        We identified ${referencePrice} in ${marketName} that appears to be priced below market value.
      </p>

      <p>
        <strong>Estimated Value Gap:</strong><br/>
        ${valueGapReason}
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
        Get Your Home Value
      </a>
    </div>
  `;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/templates/sellerOutreach.tsx
