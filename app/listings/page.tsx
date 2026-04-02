import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ListingsPage() {
  const { data: listings, error } = await supabase
    .from("Property")
    .select("*")
    .limit(50);

  if (error) {
    return <div>Error loading listings</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Listings</h1>

      <div style={{ display: "grid", gap: "20px" }}>
        {listings?.map((listing) => (
          <div
            key={listing.id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h2>{listing.address}</h2>

            <p>
              {listing.city}, {listing.state} {listing.zip}
            </p>

            <p>💰 ${listing.price?.toLocaleString()}</p>

            <p>
              🛏 {listing.beds} | 🛁 {listing.baths} | 📐 {listing.sqft} sqft
            </p>

            <p>Status: {listing.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}