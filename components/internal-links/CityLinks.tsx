import Link from "next/link"

export default function CityLinks({ city }: { city: string }) {

  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1)

  return (

    <section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Explore {cityName} Real Estate
      </h2>

      <ul className="space-y-2">

        <li>
          <Link href={`/${city}-real-estate`}>
            {cityName} Homes for Sale
          </Link>
        </li>

        <li>
          <Link href={`/market/${city}`}>
            {cityName} Housing Market
          </Link>
        </li>

        <li>
          <Link href={`/neighborhoods/${city}`}>
            {cityName} Neighborhood Guide
          </Link>
        </li>

      </ul>

    </section>
  )
}