import { cities } from "@/data/cities"
import { notFound } from "next/navigation"
import MarketStats from "@/components/market/MarketStats"
import MarketChart from "@/components/market/MarketChart"

export default async function HousingMarketPage({
  params
}: {
  params: Promise<{ city: string }>
}) {

  const { city } = await params

  const cityData = cities.find(c => c.slug === city)

  if (!cityData) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-4">
        {cityData.name} Housing Market
      </h1>

      <p className="text-gray-600 mb-8">
        Current trends, pricing, and real estate market statistics for {cityData.name}, Colorado.
      </p>

      <MarketStats city={cityData.name} />

      <div className="mt-10">
        <MarketChart city={cityData.name} />
      </div>

export function generateStaticParams() {

  const { cities } = require("@/data/cities")

  return cities.map((city: any) => ({
    city: city.slug
  }))
}

    </div>
  )
}