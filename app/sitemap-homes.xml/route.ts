import { propertySearchTypes } from "@/lib/propertySearchTypes"

const cities = [
  "boulder",
  "louisville",
  "lafayette",
  "superior",
  "erie",
  "longmont"
]

export async function GET() {

  const baseUrl = "https://yourdomain.com"

  const urls = cities.flatMap((city) =>
    propertySearchTypes.map(
      (type) => `
      <url>
        <loc>${baseUrl}/homes/${city}/${type.slug}</loc>
      </url>
      `
    )
  )

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join("")}
  </urlset>`

  return new Response(body, {
    headers: { "Content-Type": "application/xml" }
  })
}