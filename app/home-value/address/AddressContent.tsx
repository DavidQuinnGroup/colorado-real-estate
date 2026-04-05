"use client"

import { useSearchParams } from "next/navigation"

export default function AddressContent() {
  const searchParams = useSearchParams()

  const address = searchParams.get("address")

  return (
    <div>
      <h1>Home Value Result</h1>
      <p>{address}</p>
    </div>
  )
}