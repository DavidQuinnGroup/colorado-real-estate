import { sendAlert } from "@/lib/email/sendAlert"

export async function GET() {
  const testUser = {
    email: "davidquinngroup@gmail.com",
  }

  const listings = [
    {
      id: "test-id-1",
      price: 500000,
      beds: 3,
      baths: 2,
      sqft: 1800,
      address: "123 Test St, Boulder, CO",
      city: "Boulder",
      slug: "123-test-st",
      photos: ["https://images.unsplash.com/photo-1560184897-ae75f418493e"],
    },
    {
      id: "test-id-2",
      price: 650000,
      beds: 4,
      baths: 3,
      sqft: 2400,
      address: "456 Maple Ave, Boulder, CO",
      city: "Boulder",
      slug: "456-maple",
      photos: ["https://images.unsplash.com/photo-1572120360610-d971b9d7767c"],
    },
  ]

  await sendAlert({
    user: testUser,
    listings,
  })

  return Response.json({ success: true })
}