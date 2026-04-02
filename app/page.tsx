"use client"

import { useState } from "react"
import MarketChart from "../components/MarketChart"
import { calculateMarketHealth } from "../lib/marketHealth"

export default function Home() {

  /* ---------------------------
  CITY SELECTOR
  ----------------------------*/

  const [city, setCity] = useState("Boulder")

  const cities = [
    "Boulder",
    "Louisville",
    "Lafayette",
    "Longmont",
    "Superior"
  ]

  /* ---------------------------
  HOME VALUE ESTIMATOR
  ----------------------------*/

  const [address, setAddress] = useState("")
  const [estimate, setEstimate] = useState<number | null>(null)
  const [email, setEmail] = useState("")

  function calculateEstimate() {

    const base = 1150000
    const variation = Math.floor(Math.random() * 200000)

    setEstimate(base + variation)
  }

  /* ---------------------------
  HOME EQUITY CALCULATOR
  ----------------------------*/

  const [homeValue, setHomeValue] = useState("")
  const [mortgageBalance, setMortgageBalance] = useState("")
  const [equity, setEquity] = useState<number | null>(null)

  function calculateEquity() {

    const value = Number(homeValue)
    const loan = Number(mortgageBalance)

    if (!value || !loan) return

    setEquity(value - loan)
  }

  /* ---------------------------
  MARKET DATA
  ----------------------------*/

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

  /* ---------------------------
  SELLER TIMING SCORE
  ----------------------------*/

  const sellerTimingScore = Math.min(
    100,
    Math.round(marketHealthScore * 0.8 + (6 - Number(absorptionRate)) * 5)
  )

  const sellerRecommendation = () => {

    if (sellerTimingScore > 80) return "Excellent time to sell"
    if (sellerTimingScore > 60) return "Good time to sell"
    if (sellerTimingScore > 40) return "Balanced market"

    return "Waiting may be better"
  }

  /* ---------------------------
  MARKET LABEL
  ----------------------------*/

  const getMarketLabel = () => {

    if (marketHealthScore >= 80) return "Strong Seller Market"
    if (marketHealthScore >= 60) return "Seller Leaning"
    if (marketHealthScore >= 40) return "Balanced Market"
    if (marketHealthScore >= 20) return "Buyer Leaning"

    return "Strong Buyer Market"
  }

  return (

    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}

      <section className="bg-gray-900 text-white py-24 px-6 text-center">

        <h1 className="text-5xl font-bold mb-6">
          Colorado Market Intelligence
        </h1>

        <p className="text-xl max-w-2xl mx-auto mb-8">
          Real-time housing market analytics for Boulder County.
        </p>

      </section>


      {/* HOME VALUE ESTIMATOR */}

      <section className="py-16 px-6">

        <div className="max-w-xl mx-auto border rounded-xl p-8 text-center">

          <h2 className="text-2xl font-semibold mb-4">
            What's Your Home Worth?
          </h2>

          <input
            placeholder="Enter your address"
            value={address}
            onChange={(e)=>setAddress(e.target.value)}
            className="border w-full px-4 py-3 rounded-lg mb-4"
          />

          <button
            onClick={calculateEstimate}
            className="bg-gray-900 text-white w-full py-3 rounded-lg"
          >
            Get Instant Estimate
          </button>

          {estimate && (

            <div className="mt-6">

              <p className="text-gray-500">Estimated Value</p>

              <p className="text-4xl font-bold">
                ${estimate.toLocaleString()}
              </p>

              <div className="mt-6">

                <p className="text-gray-500">Seller Timing Score</p>

                <p className="text-3xl font-bold">
                  {sellerTimingScore} / 100
                </p>

                <p className="text-gray-600">
                  {sellerRecommendation()}
                </p>

              </div>

              <div className="mt-6">

                <input
                  placeholder="Email for full home report"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="border w-full px-4 py-3 rounded-lg mb-3"
                />

                <button className="bg-green-600 text-white w-full py-3 rounded-lg">
                  Send My Full Report
                </button>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* DASHBOARD */}

      <section className="py-20 px-6 max-w-6xl mx-auto">

        {/* CITY SELECTOR */}

        <div className="flex justify-center mb-10">

          <select
            value={city}
            onChange={(e)=>setCity(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            {cities.map((c)=>(
              <option key={c}>{c}</option>
            ))}
          </select>

        </div>

        <h2 className="text-3xl font-bold mb-12 text-center">
          {city} Market Intelligence Dashboard
        </h2>


        {/* MARKET HEALTH */}

        <div className="max-w-xl mx-auto mb-16 text-center">

          <h3 className="text-xl font-semibold mb-6">
            Market Health Score
          </h3>

          <div className="relative">

            <div className="h-3 bg-gradient-to-r from-blue-500 via-gray-300 to-green-500 rounded-full" />

            <div
              className="absolute top-[-6px]"
              style={{ left: `${marketHealthScore}%` }}
            >
              <div className="w-4 h-4 bg-black rounded-full border-2 border-white" />
            </div>

          </div>

          <div className="flex justify-between text-sm mt-2 text-gray-600">
            <span>Buyer Market</span>
            <span>Seller Market</span>
          </div>

          <div className="mt-6 text-4xl font-bold">
            {marketHealthScore}
          </div>

          <p className="text-gray-600 mt-2">
            {getMarketLabel()}
          </p>

        </div>


        {/* CORE METRICS */}

        <div className="grid md:grid-cols-4 gap-8 mb-16">

          <div className="p-6 border rounded-xl">
            <h3>Median Price</h3>
            <p className="text-3xl mt-2">
              ${medianPrice.toLocaleString()}
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3>Days on Market</h3>
            <p className="text-3xl mt-2">{daysOnMarket}</p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3>Active Listings</h3>
            <p className="text-3xl mt-2">{activeListings}</p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3>Absorption Rate</h3>
            <p className="text-3xl mt-2">{absorptionRate} mo</p>
          </div>

        </div>


        {/* MARKET CHART */}

        <div className="mt-16 h-[400px] w-full max-w-4xl mx-auto">
          <MarketChart />
        </div>


        {/* HOME EQUITY CALCULATOR */}

        <div className="max-w-xl mx-auto mt-24 border rounded-xl p-8 text-center">

          <h3 className="text-2xl font-semibold mb-6">
            Home Equity Calculator
          </h3>

          <input
            placeholder="Estimated Home Value"
            value={homeValue}
            onChange={(e)=>setHomeValue(e.target.value)}
            className="border w-full px-4 py-3 rounded-lg mb-4"
          />

          <input
            placeholder="Mortgage Balance"
            value={mortgageBalance}
            onChange={(e)=>setMortgageBalance(e.target.value)}
            className="border w-full px-4 py-3 rounded-lg mb-4"
          />

          <button
            onClick={calculateEquity}
            className="bg-gray-900 text-white w-full py-3 rounded-lg"
          >
            Calculate Equity
          </button>

          {equity !== null && (

            <div className="mt-6">

              <p className="text-gray-500">Estimated Equity</p>

              <p className="text-4xl font-bold">
                ${equity.toLocaleString()}
              </p>

            </div>

          )}

        </div>

      </section>

    </main>

  )

}