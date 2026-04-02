"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function SaveSearch({ city }: { city: string }) {
  const [email, setEmail] = useState("")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()

  const handleSave = async () => {
    setLoading(true)

    const payload = {
      email,
      city,
      minPrice: searchParams.get("minPrice"),
      beds: searchParams.get("beds"),
      type: searchParams.get("type"),
      north: searchParams.get("north"),
      south: searchParams.get("south"),
      east: searchParams.get("east"),
      west: searchParams.get("west")
    }

    try {
      await fetch("/api/save-search", {
        method: "POST",
        body: JSON.stringify(payload)
      })

      setSaved(true)

    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  if (saved) {
    return (
      <div className="p-3 bg-green-100 text-green-800 rounded">
        Search saved! 🎉
      </div>
    )
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 rounded w-48"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Save Search"}
      </button>
    </div>
  )
}