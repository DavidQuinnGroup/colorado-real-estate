type Listing = {
  id: string
  price?: number
  city?: string
  beds?: number
  image?: string
  url: string

  __dealScore?: number
  __dealReason?: string
  __urgency?: string
}

export function ListingDigestEmail({
  listings,
}: {
  listings: Listing[]
}) {
  return `
    <div style="font-family: Arial; max-width: 600px; margin: auto;">
      <h2>🏡 New Listings & Deals</h2>

      ${listings
        .map((l) => {
          const dealBadge =
            l.__dealScore && l.__dealScore >= 40
              ? `<div style="color: #16a34a; font-weight: bold;">🔥 DEAL</div>`
              : ""

          const reason = l.__dealReason
            ? `<div style="font-size: 14px; color: #555;">${l.__dealReason}</div>`
            : ""

          const urgency = l.__urgency
            ? `<div style="font-size: 13px; color: #dc2626;">⏱️ ${l.__urgency}</div>`
            : ""

          return `
            <div style="border-bottom: 1px solid #eee; padding: 16px 0;">
              ${dealBadge}
              <h3>$${l.price?.toLocaleString()}</h3>
              <div>${l.beds || "-"} beds • ${l.city}</div>

              ${reason}
              ${urgency}

              <a href="${l.url}" style="color: blue;">View Listing</a>
            </div>
          `
        })
        .join("")}
    </div>
  `
}