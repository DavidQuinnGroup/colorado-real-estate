"use client"

import MarketChart from "../../components/MarketChart"

export default function BoulderHomePrices() {

  /* --------------------------------
  PRICE DATA (replace later with API)
  -------------------------------- */

  const medianPrice = 1150000
  const lastYearPrice = 1115000
  const priceGrowth = ((medianPrice - lastYearPrice) / lastYearPrice) * 100

  const forecastPrice = Math.round(medianPrice * 1.03)

  return (

    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}

      <section className="bg-gray-900 text-white py-20 px-6 text-center">

        <h1 className="text-5xl font-bold mb-6">
          Boulder Home Prices
        </h1>

        <p className="text-xl max-w-3xl mx-auto">
          Current home prices, price trends, and housing forecasts
          for Boulder, Colorado.
        </p>

      </section>


      {/* PRICE SNAPSHOT */}

      <section className="py-16 px-6 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-12 text-center">
          Boulder Home Price Snapshot
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="border rounded-xl p-6">

            <h3 className="text-gray-500">
              Median Home Price
            </h3>

            <p className="text-3xl font-bold mt-2">
              ${medianPrice.toLocaleString()}
            </p>

          </div>


          <div className="border rounded-xl p-6">

            <h3 className="text-gray-500">
              Price Change (12 Months)
            </h3>

            <p className="text-3xl font-bold mt-2">
              {priceGrowth.toFixed(1)}%
            </p>

          </div>


          <div className="border rounded-xl p-6">

            <h3 className="text-gray-500">
              Forecast Price (12 Months)
            </h3>

            <p className="text-3xl font-bold mt-2">
              ${forecastPrice.toLocaleString()}
            </p>

          </div>

        </div>

      </section>


      {/* PRICE TREND CHART */}

      <section className="py-20 px-6 max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-10">
          Boulder Home Price Trends
        </h2>

        <div className="h-[400px]">

          <MarketChart />

        </div>

      </section>


      {/* SEO CONTENT */}

      <section className="py-20 px-6 max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold mb-6">
          Average Home Price in Boulder Colorado
        </h2>

        <p className="mb-4">
          The Boulder housing market consistently ranks among the
          most expensive real estate markets in Colorado. Limited
          housing inventory combined with strong demand from
          technology professionals and lifestyle buyers has
          supported high home prices for more than a decade.
        </p>

        <p className="mb-4">
          Boulder’s median home price is currently above $1 million,
          significantly higher than most other cities in the state.
          This premium reflects the city’s limited land supply,
          proximity to the Rocky Mountains, and strong economic
          base anchored by the University of Colorado and the
          regional technology sector.
        </p>

        <p>
          While home price growth has slowed compared with the
          rapid increases seen during the pandemic housing boom,
          Boulder real estate remains one of the most resilient
          housing markets in the western United States.
        </p>

      </section>

    </main>

  )

}