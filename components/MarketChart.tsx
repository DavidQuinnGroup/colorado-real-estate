"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts"

/* ----------------------------- */
/* PRICE FORMATTER */
/* ----------------------------- */

const formatPrice = (value: number) =>
  `$${(value / 1000000).toFixed(2)}M`

/* ----------------------------- */
/* CITY COLORS */
/* ----------------------------- */

const cityColors: Record<string, string> = {
  Boulder: "#60A5FA",
  Louisville: "#34D399",
  Lafayette: "#FBBF24",
  Superior: "#F87171",
  Broomfield: "#A78BFA",
  Erie: "#FB923C",
  Longmont: "#22D3EE"
}

/* ----------------------------- */
/* SAMPLE DATA */
/* ----------------------------- */

const marketData: Record<string, any[]> = {
  Boulder: [
    { month: "Jan", price: 980000, inventory: 520, dom: 42 },
    { month: "Feb", price: 1010000, inventory: 505, dom: 38 },
    { month: "Mar", price: 1050000, inventory: 480, dom: 34 },
    { month: "Apr", price: 1080000, inventory: 455, dom: 31 },
    { month: "May", price: 1120000, inventory: 430, dom: 29 },
    { month: "Jun", price: 1150000, inventory: 412, dom: 28 }
  ],

  Louisville: [
    { month: "Jan", price: 820000, inventory: 180, dom: 35 },
    { month: "Feb", price: 830000, inventory: 170, dom: 32 },
    { month: "Mar", price: 845000, inventory: 160, dom: 29 },
    { month: "Apr", price: 860000, inventory: 150, dom: 27 },
    { month: "May", price: 875000, inventory: 145, dom: 26 },
    { month: "Jun", price: 890000, inventory: 138, dom: 25 }
  ],

  Lafayette: [
    { month: "Jan", price: 780000, inventory: 210, dom: 38 },
    { month: "Feb", price: 790000, inventory: 200, dom: 36 },
    { month: "Mar", price: 805000, inventory: 195, dom: 33 },
    { month: "Apr", price: 820000, inventory: 185, dom: 31 },
    { month: "May", price: 835000, inventory: 178, dom: 29 },
    { month: "Jun", price: 850000, inventory: 170, dom: 27 }
  ],

  Superior: [
    { month: "Jan", price: 920000, inventory: 90, dom: 34 },
    { month: "Feb", price: 940000, inventory: 85, dom: 32 },
    { month: "Mar", price: 960000, inventory: 80, dom: 29 },
    { month: "Apr", price: 975000, inventory: 78, dom: 28 },
    { month: "May", price: 990000, inventory: 75, dom: 26 },
    { month: "Jun", price: 1005000, inventory: 70, dom: 24 }
  ]
}

/* ----------------------------- */
/* CHART COMPONENT */
/* ----------------------------- */

function Chart({
  metric,
  title,
  selectedCities,
  isDark
}: {
  metric: "price" | "inventory" | "dom"
  title: string
  selectedCities: string[]
  isDark: boolean
}) {

  const gridColor = isDark ? "#374151" : "#e5e7eb"
  const textColor = isDark ? "#d1d5db" : "#374151"
  const tooltipBg = isDark ? "#0F172A" : "#ffffff"

  const months = marketData["Boulder"].map((d) => d.month)

  const combinedData = months.map((month, index) => {
    const row: any = { month }

    selectedCities.forEach((city) => {
      if (marketData[city]) {
        row[city] = marketData[city][index][metric]
      }
    })

    return row
  })

  return (
    <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl p-6 shadow-lg">

      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="w-full h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={combinedData} syncId="market">

            <defs>
              {selectedCities.map((city) => (
                <linearGradient
                  key={city}
                  id={`gradient-${city}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={cityColors[city]} stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={cityColors[city]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

            <XAxis
              dataKey="month"
              stroke={textColor}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke={textColor}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                metric === "price" ? formatPrice(value) : value
              }
            />

            <Tooltip
              formatter={(value) =>
  metric === "price" ? formatPrice(Number(value ?? 0)) : value
}
              cursor={{ stroke: textColor, strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${gridColor}`,
                borderRadius: "10px",
                color: textColor
              }}
            />

            <Legend />

            {selectedCities.map((city) =>
              marketData[city] ? (
                <Area
                  key={`area-${city}`}
                  type="monotone"
                  dataKey={city}
                  stroke="none"
                  fill={`url(#gradient-${city})`}
                />
              ) : null
            )}

            {selectedCities.map((city) =>
              marketData[city] ? (
                <Line
                  key={`line-${city}`}
                  type="monotone"
                  dataKey={city}
                  stroke={cityColors[city]}
                  strokeWidth={3}
                  dot={false}
                />
              ) : null
            )}

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}

/* ----------------------------- */
/* MAIN COMPONENT */
/* ----------------------------- */

export default function MarketChart() {

  const cities = [
    "Boulder",
    "Louisville",
    "Lafayette",
    "Superior",
    "Broomfield",
    "Erie",
    "Longmont"
  ]

  const [selectedCities, setSelectedCities] =
    useState<string[]>(["Boulder"])

  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(
      document.documentElement.classList.contains("dark")
    )
  }, [])

  const toggleCity = (city: string) => {

    if (selectedCities.includes(city)) {
      setSelectedCities(
        selectedCities.filter((c) => c !== city)
      )
    } else {

      if (selectedCities.length >= 5) return

      setSelectedCities([
        ...selectedCities,
        city
      ])
    }

  }

  return (

    <div className="space-y-10">

      <div className="flex flex-wrap justify-center gap-3">

        {cities.map((city) => {

          const active = selectedCities.includes(city)

          return (

            <button
              key={city}
              onClick={() => toggleCity(city)}
              className={
                "px-4 py-2 rounded-lg border text-sm transition " +
                (active
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800")
              }
            >
              {city}
            </button>

          )

        })}

      </div>

      <Chart
        metric="price"
        title="Median Price Trend"
        selectedCities={selectedCities}
        isDark={isDark}
      />

      <div className="grid md:grid-cols-2 gap-8">

        <Chart
          metric="inventory"
          title="Inventory Trend"
          selectedCities={selectedCities}
          isDark={isDark}
        />

        <Chart
          metric="dom"
          title="Days on Market Trend"
          selectedCities={selectedCities}
          isDark={isDark}
        />

      </div>

    </div>

  )

}