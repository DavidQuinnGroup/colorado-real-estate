import { neighborhoods } from "@/lib/neighborhoods"

export async function GET() {

  const baseUrl = "https://yourdomain.com"

  const urls = neighborhoods.map(
    (n) => `
      <url>
        <loc>${baseUrl}/neighborhood/${n.slug}</loc>
      </url>
    `
  )

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join("")}
  </urlset>`

  return new Response(body, {
    headers: { "Content-Type": "application/xml" }
  })
}