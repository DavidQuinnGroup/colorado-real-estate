"use client"

import MarketChart from "../../components/MarketChart"
import BoulderMarketMap from "../../components/BoulderMarketMap"
import { calculateMarketHealth } from "../../lib/marketHealth"
import { predictMarketTrend } from "../../lib/marketPrediction"

export default function BoulderMarket() {

  const medianPrice = 1150000
  const daysOnMarket = 28
  const activeListings = 412
  const monthlySales = 180
  const priceGrowth = 0.03

  const absorptionRate = (activeListings / monthlySales).toFixed(1)

  const marketHealthScore = calculateMarketHealth(
    priceGrowth,
    activeListings,
    daysOnMarket
  )

  // AI Prediction Engine Signals
  const inventoryTrend = 0.1
  const domTrend = 0.05
  const priceReductionRate = 0.08
  const priceMomentum = priceGrowth

  const predictionScore = predictMarketTrend(
    inventoryTrend,
    domTrend,
    priceReductionRate,
    parseFloat(absorptionRate),
    priceMomentum
  )

  const forecastPrice = Math.round(medianPrice * (1 + priceGrowth))

  function getMarketLabel() {

    if (marketHealthScore >= 80) return "Strong Seller Market"
    if (marketHealthScore >= 60) return "Seller Leaning"
    if (marketHealthScore >= 40) return "Balanced Market"
    if (marketHealthScore >= 20) return "Buyer Leaning"

    return "Strong Buyer Market"
  }

  function getPredictionLabel(score:number){

    if(score > 75) return "Strong Appreciation Expected"
    if(score > 60) return "Moderate Price Growth"
    if(score > 40) return "Stable Market"
    if(score > 25) return "Softening Market"

    return "Price Decline Risk"
  }

  return (

    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}

      <section className="bg-gray-900 text-white py-20 px-6 text-center">

        <h1 className="text-5xl font-bold mb-6">
          Boulder Housing Market Report
        </h1>

        <p className="text-xl max-w-3xl mx-auto">
          Real-time housing market trends, AI price forecasts,
          and inventory insights for Boulder, Colorado.
        </p>

      </section>


      {/* MARKET SNAPSHOT */}

      <section className="py-16 px-6 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-12 text-center">
          Boulder Market Snapshot
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          <div className="border p-6 rounded-xl">
            <h3 className="text-gray-500">Median Home Price</h3>
            <p className="text-3xl font-bold mt-2">
              ${medianPrice.toLocaleString()}
            </p>
          </div>

          <div className="border p-6 rounded-xl">
            <h3 className="text-gray-500">Days on Market</h3>
            <p className="text-3xl font-bold mt-2">
              {daysOnMarket}
            </p>
          </div>

          <div className="border p-6 rounded-xl">
            <h3 className="text-gray-500">Active Listings</h3>
            <p className="text-3xl font-bold mt-2">
              {activeListings}
            </p>
          </div>

          <div className="border p-6 rounded-xl">
            <h3 className="text-gray-500">Absorption Rate</h3>
            <p className="text-3xl font-bold mt-2">
              {absorptionRate} mo
            </p>
          </div>

        </div>

      </section>


      {/* MARKET HEALTH */}

      <section className="py-16 px-6 bg-gray-50">

        <div className="max-w-3xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-8">
            Boulder Market Health Score
          </h2>

          <div className="relative mb-6">

            <div className="h-3 bg-gradient-to-r from-blue-500 via-gray-300 to-green-500 rounded-full"/>

            <div
              className="absolute top-[-6px]"
              style={{ left: `${marketHealthScore}%` }}
            >
              <div className="w-4 h-4 bg-black rounded-full border-2 border-white"/>
            </div>

          </div>

          <p className="text-4xl font-bold">
            {marketHealthScore}
          </p>

          <p className="text-gray-600 mt-2">
            {getMarketLabel()}
          </p>

        </div>

      </section>


      {/* AI MARKET PREDICTION */}

      <section className="py-20 px-6">

        <div className="max-w-3xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-6">
            AI Boulder Market Forecast
          </h2>

          <p className="text-lg text-gray-600 mb-6">
            Our predictive model analyzes inventory trends,
            price momentum, and demand signals to forecast
            future home prices.
          </p>

          <div className="border rounded-xl p-10">

            <p className="text-gray-500 mb-2">
              Market Prediction Score
            </p>

            <p className="text-5xl font-bold mb-2">
              {predictionScore}
            </p>

            <p className="text-xl text-gray-700">
              {getPredictionLabel(predictionScore)}
            </p>

          </div>

        </div>

      </section>


      {/* PRICE CHART */}

      <section className="py-20 px-6 max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-10">
          Boulder Home Price Trends
        </h2>

        <div className="h-[400px]">
          <MarketChart />
        </div>

      </section>


      {/* NEIGHBORHOOD MARKET MAP */}

      <section className="py-20 px-6 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-10">
          Boulder Neighborhood Market Map
        </h2>

        <BoulderMarketMap />

      </section>


      {/* PRICE FORECAST */}

      <section className="py-16 px-6 bg-gray-50">

        <div className="max-w-3xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-6">
            12-Month Price Forecast
          </h2>

          <p className="text-xl mb-4">
            Projected Median Price
          </p>

          <p className="text-4xl font-bold">
            ${forecastPrice.toLocaleString()}
          </p>

        </div>

      </section>


      {/* INTERNAL LINKS */}

      <section className="py-20 px-6">

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-10">
            Boulder Market Insights
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <a href="/boulder-home-prices" className="border p-6 rounded-xl hover:bg-gray-50">
              Boulder Home Prices
            </a>

            <a href="/home-value" className="border p-6 rounded-xl hover:bg-gray-50">
              What Is My Home Worth
            </a>

            <a href="/is-it-a-good-time-to-sell-in-boulder" className="border p-6 rounded-xl hover:bg-gray-50">
              Is It a Good Time to Sell
            </a>

          </div>

        </div>

      </section>

    </main>

  )

}