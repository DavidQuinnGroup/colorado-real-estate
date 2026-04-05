"use client";

export default function MapSidebar({
  listings,
  activeListingId,
  setActiveListingId,
}: any) {
  return (
    <div
      style={{
        width: "30%",
        height: "100%",
        overflowY: "auto",
        background: "#0b0b0b",
        borderLeft: "1px solid #222",
      }}
    >
      {listings.map((listing: any) => {
        const isActive = listing.mls_id === activeListingId;

        return (
          <div
            key={listing.mls_id}
            onClick={() => setActiveListingId(listing.mls_id)}
            style={{
              padding: "16px",
              borderBottom: "1px solid #222",
              cursor: "pointer",
              background: isActive ? "#111" : "transparent",
            }}
          >
            <div style={{ fontWeight: 600 }}>
              ${listing.price?.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {listing.address}
            </div>
            <div style={{ fontSize: 12, opacity: 0.5 }}>
              {listing.beds || "-"} bd • {listing.baths || "-"} ba
            </div>
          </div>
        );
      })}
    </div>
  );
}