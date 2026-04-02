import Typesense from "typesense"

const client = new Typesense.Client({
  nodes: [
    {
      host: "localhost",
      port: 8108,
      protocol: "http",
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || "xyz",
})

export async function indexListing(listing: any) {
  try {
    const doc = {
  id: listing.mls_id,
  address: listing.address || "",
  city: listing.city || "",
  price: listing.price || 0,
  beds: listing.beds || 0,
  baths: listing.baths || 0,
  lat: listing.lat || 0,
  lng: listing.lng || 0,

  // 🔥 NEW
  location: [listing.lat || 0, listing.lng || 0],

  property_type: listing.property_type || "",
  updated_at: new Date(listing.updated_at).getTime(),
}

    await client
      .collections("listings")
      .documents()
      .upsert(doc)
  } catch (err) {
    console.error("❌ Typesense index failed", err)
  }
}