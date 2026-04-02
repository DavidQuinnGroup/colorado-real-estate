import { cities } from "@/lib/cities"
import { notFound } from "next/navigation"
import CityMarketStats from "@/components/CityMarketStats"

export function generateStaticParams() {
  return cities
    .filter((c) => c.marketSlug)
    .map((c) => ({
      city: c.marketSlug,
    }))
}

export default async function MarketReportPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {

  const { city } = await params

  const cityData = cities.find(
    (c) => c.marketSlug === city
  )

  if (!cityData) return notFound()

  return (
    <main className="max-w-5xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-6">
        {cityData.name} CO Housing Market Report
      </h1>

      <p className="mb-8">
        The {cityData.name}, Colorado housing market continues to attract buyers due to strong demand,
        desirable neighborhoods, and access to the Front Range lifestyle.
      </p>

      <CityMarketStats stats={cityData.stats} />

      <section className="mt-10">

        <h2 className="text-2xl font-semibold mb-4">
          Market Trends in {cityData.name}
        </h2>

        <p>
          Home prices in {cityData.name} have remained competitive compared to other
          Front Range communities. Buyers continue to seek properties with access to
          schools, parks, and outdoor recreation.
        </p>

      </section>

    </main>
  )
}