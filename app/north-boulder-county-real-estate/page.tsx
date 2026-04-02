import Link from "next/link"

export default function NorthBoulderCounty() {

  return (
    <main style={{ padding: "120px 80px", color: "white", maxWidth: "1000px" }}>

      <h1>North Boulder County Real Estate</h1>

      <p>
        North Boulder County is one of the most desirable places to live in Colorado.
        From Boulder to Louisville, Lafayette, Erie, and Longmont, the region offers
        exceptional schools, outdoor lifestyle, and strong real estate appreciation.
      </p>

      <h2>Explore Cities</h2>

      <ul style={{ lineHeight: "2" }}>

        <li>
          <Link href="/city/boulder">
            Boulder Real Estate
          </Link>
        </li>

        <li>
          <Link href="/city/louisville">
            Louisville Real Estate
          </Link>
        </li>

        <li>
          <Link href="/city/lafayette">
            Lafayette Real Estate
          </Link>
        </li>

        <li>
          <Link href="/city/erie">
            Erie Real Estate
          </Link>
        </li>

        <li>
          <Link href="/city/longmont">
            Longmont Real Estate
          </Link>
        </li>

      </ul>

      <h2>Popular Home Searches</h2>

      <ul style={{ lineHeight: "2" }}>

        <li>
          <Link href="/city-homes/boulder/luxury">
            Luxury Homes in Boulder
          </Link>
        </li>

        <li>
          <Link href="/city-homes/boulder/condos">
            Boulder Condos
          </Link>
        </li>

        <li>
          <Link href="/city-homes/louisville/new-construction">
            New Construction Homes in Louisville
          </Link>
        </li>

      </ul>

    </main>
  )
}