"use client"

import { useEffect, useState } from "react"

export default function MarketDashboard({ params }: any) {

  const city = params.city

  const [data, setData] = useState<any>(null)

  useEffect(() => {

    const marketData = {

      medianPrices: [
        780000,
        820000,
        860000,
        900000,
        940000
      ],

      inventory: [
        180,
        165,
        150,
        142,
        130
      ],

      daysOnMarket: [
        28,
        24,
        21,
        19,
        18
      ]

    }

    setData(marketData)

  }, [])

  if (!data) return null

  return (

    <main className="max-w-6xl mx-auto py-20">

      <h1 className="text-5xl font-bold mb-12">
        {city} Housing Market Dashboard
      </h1>

      <section className="grid grid-cols-3 gap-8">

        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            Median Prices
          </h2>

          {data.medianPrices.map((p:any,i:number)=>(
            <p key={i}>${p.toLocaleString()}</p>
          ))}

        </div>

        <div className="border p-6 rounded-lg">

          <h2 className="text-xl font-bold mb-4">
            Inventory
          </h2>

          {data.inventory.map((p:any,i:number)=>(
            <p key={i}>{p} homes</p>
          ))}

        </div>

        <div className="border p-6 rounded-lg">

          <h2 className="text-xl font-bold mb-4">
            Days on Market
          </h2>

          {data.daysOnMarket.map((p:any,i:number)=>(
            <p key={i}>{p} days</p>
          ))}

        </div>

      </section>

    </main>

  )

}