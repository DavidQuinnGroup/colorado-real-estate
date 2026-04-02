"use client"

import { useState } from "react"

export default function MortgageCalculator() {

  const [price, setPrice] = useState(700000)
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(30)

  const loanAmount = price * (1 - down / 100)
  const monthlyRate = rate / 100 / 12
  const payments = years * 12

  const monthlyPayment =
    loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, payments)) /
    (Math.pow(1 + monthlyRate, payments) - 1)

  return (
    <main style={{ padding: "120px 40px", color: "white", maxWidth: "900px", margin: "auto" }}>

      <h1 style={{ fontSize: "42px", marginBottom: "30px" }}>
        Mortgage Calculator
      </h1>

      <p style={{ marginBottom: "40px" }}>
        Estimate your monthly mortgage payment when buying a home in Boulder County.
      </p>

      <div style={{ display: "grid", gap: "20px" }}>

        <label>
          Home Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </label>

        <label>
          Down Payment (%)
          <input
            type="number"
            value={down}
            onChange={(e) => setDown(Number(e.target.value))}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </label>

        <label>
          Interest Rate (%)
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </label>

        <label>
          Loan Term (Years)
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </label>

      </div>

      <div style={{ marginTop: "40px", padding: "30px", background: "#1a1a1a", borderRadius: "8px" }}>

        <h2 style={{ fontSize: "28px" }}>
          Estimated Monthly Payment
        </h2>

        <p style={{ fontSize: "36px", marginTop: "10px" }}>
          ${Math.round(monthlyPayment).toLocaleString()}
        </p>

      </div>

    </main>
  )
}