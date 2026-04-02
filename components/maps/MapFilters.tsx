"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function MapFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString())

    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }

    router.replace(`?${newParams.toString()}`, { scroll: false })
  }

  return (
    <div className="flex gap-3 p-4 border-b bg-white">

      {/* Price */}
      <select
        onChange={(e) => updateParam("minPrice", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Min Price</option>
        <option value="300000">$300K+</option>
        <option value="500000">$500K+</option>
        <option value="750000">$750K+</option>
        <option value="1000000">$1M+</option>
      </select>

      {/* Beds */}
      <select
        onChange={(e) => updateParam("beds", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Beds</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>

      {/* Property Type */}
      <select
        onChange={(e) => updateParam("type", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Type</option>
        <option value="house">House</option>
        <option value="condo">Condo</option>
        <option value="townhome">Townhome</option>
      </select>

    </div>
  )
}