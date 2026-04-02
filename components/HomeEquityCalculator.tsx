"use client"

import { useState } from "react"

export default function HomeEquityCalculator() {

  const [value, setValue] = useState("")
  const [mortgage, setMortgage] = useState("")
  const [equity, setEquity] = useState<number | null>(null)

  function calculateEquity() {

    const homeValue = Number(value)
    const loanBalance = Number(mortgage)

    if (!homeValue || !loanBalance) return

    setEquity(homeValue - loanBalance)
  }

  return (

    <div className="max-w-xl mx-auto p-8 border rounded-xl mt-16">

      <h3 className="text-2xl font-semibold mb-6 text-center">
        Home Equity Calculator
      </h3>

      <input
        type="number"
        placeholder="Estimated Home Value"
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        className="border w-full px-4 py-3 rounded-lg mb-4"
      />

      <input
        type="number"
        placeholder="Mortgage Balance"
        value={mortgage}
        onChange={(e)=>setMortgage(e.target.value)}
        className="border w-full px-4 py-3 rounded-lg mb-4"
      />

      <button
        onClick={calculateEquity}
        className="bg-gray-900 text-white px-6 py-3 rounded-lg w-full"
      >
        Calculate Equity
      </button>

      {equity !== null && (

        <div className="mt-6 text-center">

          <p className="text-gray-600">Estimated Equity</p>

          <p className="text-4xl font-bold">
            ${equity.toLocaleString()}
          </p>

        </div>

      )}

    </div>

  )
}