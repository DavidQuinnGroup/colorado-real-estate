import { marketReports } from "@/lib/marketReports"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import MarketNeighborhoodLinks from "@/components/MarketNeighborhoodLinks"
import MarketHomesLinks from "@/components/MarketHomesLinks"
import MarketPriceChart from "@/components/MarketPriceChart"
import { marketTrends } from "@/lib/marketTrends"

type Props = {
  params: {
    report: string
    city: string
  }
}

export function generateStaticParams() {
  const cities = Object.keys(marketReports)

  return cities.map((city) => ({
    report: "housing-market",
    city
  }))
}

export function generateMetadata({ params }: Props): Metadata {
  const report = marketReports[params.city]

  if (!report) return {}

  return {
    title: `${report.city} Housing Market Report 2026 | Prices & Trends`,
    description: `Latest ${report.city}, Colorado housing market report including median home price, days on market, inventory levels and price trends.`
  }
}

export default function MarketReportPage({ params }: Props) {
  const report = marketReports[params.city]

  if (!report) return notFound()

  const trendData = marketTrends[params.city] || []

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-6">
        {report.city} Colorado Housing Market Report
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        Real-time analysis of the {report.city} real estate market in {report.county}.
      </p>

      {/* Market Stats */}

      <div className="grid grid-cols-2 gap-6 mb-12">

        <Stat
          label="Median Home Price"
          value={`$${report.medianPrice.toLocaleString()}`}
        />

        <Stat
          label="Price Change (YoY)"
          value={`${report.priceChange}%`}
        />

        <Stat
          label="Average Days on Market"
          value={report.avgDaysOnMarket}
        />

        <Stat
          label="Active Listings"
          value={report.inventory}
        />

      </div>

      {/* Price Trend Chart */}

      {trendData.length > 0 && (
        <div className="mb-16">
          <MarketPriceChart data={trendData} />
        </div>
      )}

      {/* Market Analysis */}

      <section className="prose max-w-none mb-16">

        <h2>{report.city} Housing Market Trends</h2>

        <p>
          The {report.city} real estate market remains one of the most desirable
          housing markets in {report.county}. Demand is driven by strong employment,
          lifestyle amenities, and proximity to Boulder.
        </p>

        <p>
          Over the past year, home prices have changed by {report.priceChange}%,
          while homes spend an average of {report.avgDaysOnMarket} days on market.
        </p>

      </section>

      {/* Market → Homes (high intent search pages) */}

      <MarketHomesLinks city={report.city} />

      {/* Market → Neighborhoods (authority links) */}

      <MarketNeighborhoodLinks city={params.city} />

    </main>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border rounded-xl p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}