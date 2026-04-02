import RelatedContent from "@/components/RelatedContent"
import Link from "next/link"
import { neighborhoods } from "@/data/neighborhoods"

export const metadata = {
  title: "Boulder Real Estate | Homes for Sale in Boulder CO",
  description:
    "Explore Boulder real estate including homes for sale, luxury homes, neighborhoods, market trends, and relocation guides."
}

export default function BoulderRealEstatePage() {

  const boulderNeighborhoods = neighborhoods.filter(
    (n) => n.city.toLowerCase() === "boulder"
  )

  return (
    <div className="max-w-5xl mx-auto pt-32 pb-24 px-6">

      <h1 className="text-4xl font-light mb-6">
        Boulder Real Estate
      </h1>

      <p className="text-lg text-gray-300 mb-10">
        Boulder is one of the most desirable real estate markets in Colorado.
        Buyers are drawn to the city for its mountain views, outdoor lifestyle,
        and vibrant downtown environment.
      </p>

      {/* POPULAR SEARCH PAGES */}

      <h2 className="text-2xl mb-4">Popular Boulder Home Searches</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">

        <Link href="/homes-for-sale-boulder-co" className="underline">
          Homes for Sale in Boulder
        </Link>

        <Link href="/boulder-luxury-homes" className="underline">
          Boulder Luxury Homes
        </Link>

        <Link href="/boulder-real-estate-market" className="underline">
          Boulder Real Estate Market
        </Link>

        <Link href="/moving-to-boulder-colorado" className="underline">
          Moving to Boulder
        </Link>

      </div>

      {/* NEIGHBORHOODS */}

      <h2 className="text-2xl mb-6">
        Boulder Neighborhoods
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">

        {boulderNeighborhoods.map((hood) => (
          <Link
            key={hood.slug}
            href={`/city/boulder/neighborhoods/${hood.slug}`}
            className="underline"
          >
            {hood.name}
          </Link>
        ))}

      </div>

      {/* LIFESTYLE SEARCHES */}

      <h2 className="text-2xl mb-6">
        Boulder Lifestyle Searches
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">

        <Link href="/boulder-homes/luxury-homes" className="underline">
          Luxury Homes
        </Link>

        <Link href="/boulder-homes/condos-for-sale" className="underline">
          Boulder Condos
        </Link>

        <Link href="/boulder-homes/new-construction" className="underline">
          New Construction
        </Link>

        <Link href="/boulder-homes/homes-with-mountain-views" className="underline">
          Homes with Mountain Views
        </Link>

      </div>

      {/* MARKET INFO */}

      <h2 className="text-2xl mb-4">
        Boulder Housing Market
      </h2>

      <p className="text-gray-300 mb-10">
        The Boulder real estate market consistently ranks among the most
        competitive housing markets in Colorado. Limited supply and strong
        demand keep home values high while attracting buyers relocating from
        across the United States.
      </p>

      {/* RELOCATION */}

      <h2 className="text-2xl mb-4">
        Moving to Boulder Colorado
      </h2>

      <p className="text-gray-300 mb-10">
        Boulder offers an unmatched lifestyle combining outdoor recreation,
        top-rated schools, and a strong tech economy. Residents enjoy hiking,
        biking, and skiing just minutes from downtown.
      </p>

      {/* INTERNAL AUTHORITY GRAPH */}

      <RelatedContent nodeId="boulder" />

    </div>
  )
}