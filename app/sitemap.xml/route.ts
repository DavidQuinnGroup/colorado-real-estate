export async function GET() {
  const baseUrl = "https://yourdomain.com"

  const sitemaps = [
    "sitemap-cities.xml",
    "sitemap-neighborhoods.xml",
    "sitemap-market.xml",
    "sitemap-homes.xml",
    "sitemap-addresses.xml",
    "sitemap-blog.xml"
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps
      .map(
        (s) => `
      <sitemap>
        <loc>${baseUrl}/${s}</loc>
      </sitemap>`
      )
      .join("")}
  </sitemapindex>`

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml"
    }
  })
}