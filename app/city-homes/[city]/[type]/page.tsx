import Link from "next/link"

export default function LifestylePage({ params }: any) {

  const city = params?.city ?? "colorado"
  const type = params?.type ?? "homes"

  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1)

  const typeName = type
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return (
    <main style={{ padding: "120px 80px", color: "white" }}>

      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        {typeName} in {cityName}, Colorado
      </h1>

      <p style={{ maxWidth: "900px", lineHeight: "1.6" }}>
        Explore the best {typeName.toLowerCase()} in {cityName}. 
        Search homes, discover neighborhoods, and learn why buyers 
        are moving to {cityName}, Colorado.
      </p>

      <br/>

      <h2>Explore More {cityName} Real Estate</h2>

      <ul style={{ lineHeight: "2" }}>

        <li>
          <Link href={`/city/${city}`}>
            {cityName} Real Estate Guide
          </Link>
        </li>

        <li>
          <Link href={`/blog/${city}/cost-of-living`}>
            Cost of Living in {cityName}
          </Link>
        </li>

        <li>
          <Link href={`/blog/${city}/moving-to-${city}-colorado`}>
            Moving to {cityName}
          </Link>
        </li>

        <li>
          <Link href={`/blog/${city}/best-neighborhoods`}>
            Best Neighborhoods in {cityName}
          </Link>
        </li>

      </ul>

    </main>
  )
}