"use client"

import { useState } from "react"

export default function EquityCalculator() {

  const [homeValue, setHomeValue] = useState(1150000)
  const [mortgage, setMortgage] = useState(400000)

  const equity = homeValue - mortgage

  return (

    <div className="bg-white border rounded-xl p-8 max-w-xl mx-auto">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Boulder Home Equity Calculator
      </h2>

      <div className="space-y-4">

        <div>
          <label className="block text-sm text-gray-600">
            Estimated Home Value
          </label>

          <input
            type="number"
            className="w-full border p-3 rounded"
            value={homeValue}
            onChange={(e) => setHomeValue(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">
            Remaining Mortgage Balance
          </label>

          <input
            type="number"
            className="w-full border p-3 rounded"
            value={mortgage}
            onChange={(e) => setMortgage(Number(e.target.value))}
          />
        </div>

      </div>

      <div className="mt-8 text-center">

        <p className="text-gray-600">
          Estimated Equity
        </p>

        <p className="text-4xl font-bold text-green-600">
          ${equity.toLocaleString()}
        </p>

      </div>

    </div>

  )

}