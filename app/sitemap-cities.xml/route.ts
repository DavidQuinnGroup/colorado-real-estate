import { neighborhoods } from "@/lib/neighborhoods"

export async function GET() {
  const baseUrl = "https://yourdomain.com"

  const cities = [
    "boulder",
    "louisville",
    "lafayette",
    "superior",
    "erie",
    "longmont"
  ]

  const urls = cities.map(
    (city) =>
      `<url>
        <loc>${baseUrl}/${city}-co-real-estate</loc>
      </url>`
  )

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("")}
  </urlset>`

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml"
    }
  })
}