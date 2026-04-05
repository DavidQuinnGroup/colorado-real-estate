"use client"

import { Suspense } from "react"
import AddressContent from "./AddressContent"

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <AddressContent />
    </Suspense>
  )
}