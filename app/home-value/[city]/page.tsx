"use client"

import { useState } from "react"

type Params = {
  params: {
    city: string
  }
}

export default function HomeValuePage({ params }: Params) {

  const city = params.city

  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1)

  const [address, setAddress] = useState("")

  return (
    <main style={{ padding: "120px 80px", color: "white" }}>

      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        What Is Your {cityName} Home Worth?
      </h1>

      <p style={{ maxWidth: "900px", lineHeight: "1.6" }}>
        Curious what your home might sell for in today's {cityName} real 
        estate market? Get a free home value estimate based on recent 
        sales, current listings, and market trends.
      </p>

      <br/>

      <h2>Get Your Free Home Value</h2>

      <br/>

      <input
        type="text"
        placeholder="Enter your home address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{
          padding: "12px",
          width: "320px",
          marginRight: "10px",
          borderRadius: "4px"
        }}
      />

      <button
        style={{
          padding: "12px 20px",
          background: "white",
          color: "black",
          borderRadius: "4px"
        }}
      >
        Get Estimate
      </button>

      <br/><br/>

      <h2>Why Home Values Are Rising in {cityName}</h2>

      <p style={{ maxWidth: "900px", lineHeight: "1.6" }}>
        The {cityName} housing market continues to see strong demand 
        from buyers relocating to the Front Range. Limited inventory 
        and high desirability often push prices upward.
      </p>

    </main>
  )
}
export async function generateStaticParams() {

  const cities = [
    "boulder",
    "louisville",
    "lafayette",
    "erie",
    "superior",
    "broomfield",
    "westminster",
    "brighton",
    "longmont",
    "lyons",
    "gunbarrel",
    "mead",
    "frederick",
    "firestone"
  ]

  return cities.map((city) => ({
    city
  }))
}