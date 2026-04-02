"use client"

import { useState } from "react"

export default function HomeValueEstimator() {

  const [address, setAddress] = useState("")
  const [estimate, setEstimate] = useState<number | null>(null)

  function calculateEstimate() {

    // Example placeholder logic
    const baseValue = 1150000
    const variation = Math.floor(Math.random() * 200000)

    setEstimate(baseValue + variation)
  }

  return (

    <div className="p-8 border rounded-xl text-center max-w-xl mx-auto">

      <h3 className="text-2xl font-semibold mb-4">
        What's Your Home Worth?
      </h3>

      <p className="text-gray-600 mb-6">
        Get an instant estimate based on Boulder market data.
      </p>

      <input
        type="text"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border w-full px-4 py-3 rounded-lg mb-4"
      />

      <button
        onClick={calculateEstimate}
        className="bg-gray-900 text-white px-6 py-3 rounded-lg w-full"
      >
        Get Home Value
      </button>

      {estimate && (

        <div className="mt-6">

          <p className="text-gray-600">
            Estimated Value
          </p>

          <p className="text-4xl font-bold">
            ${estimate.toLocaleString()}
          </p>

        </div>

      )}

    </div>

  )
}