"use client"

import { useState } from "react"

export default function SellersHub() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <main className="pt-32 px-6 md:px-16">

      {/* Hero */}
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-light mb-6">
          Sell Your Home With Strategy
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          A data-driven, design-forward approach to maximizing your home’s value in today’s Boulder County market.
        </p>
      </section>

      {/* Value Proposition Blocks */}
      <section className="grid md:grid-cols-3 gap-12 py-20">
        <div>
          <h3 className="text-2xl font-light mb-4">Pricing Strategy</h3>
          <p className="text-gray-600">
            Hyper-local data analysis to position your home for maximum exposure and competitive offers.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-light mb-4">Marketing System</h3>
          <p className="text-gray-600">
            Professional media, targeted digital campaigns, and Compass network exposure.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-light mb-4">Negotiation Expertise</h3>
          <p className="text-gray-600">
            Structured offer management designed to protect your equity and reduce risk.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center border-t">
        <h2 className="text-3xl font-light mb-6">
          Curious What Your Home Is Worth?
        </h2>

        <div className="max-w-xl mx-auto mt-10">
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault()

              const form = e.currentTarget
              const formData = new FormData(form)

              const name = formData.get("name")?.toString().trim()
              const email = formData.get("email")?.toString().trim()
              const address = formData.get("address")?.toString().trim()

              setError(null)
              setSuccess(false)

              if (!name || !email) {
                setError("Name and email are required.")
                return
              }

              setLoading(true)

              const res = await fetch("/api/valuation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, address }),
              })

              setLoading(false)

              if (res.ok) {
                setSuccess(true)
                form.reset()
              } else {
                const data = await res.json()
                setError(data.error || "Something went wrong.")
              }
            }}
          >
            <input
              name="name"
              placeholder="Full Name"
              className="border p-3"
              disabled={loading}
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="border p-3"
              disabled={loading}
            />

            <input
              name="address"
              placeholder="Property Address"
              className="border p-3"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 border border-black 
                         hover:bg-black hover:text-white 
                         transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Get My Home Value"}
            </button>

            {success && (
              <div className="mt-4 p-4 border border-green-600 text-green-700">
                Thank you. I’ll reach out shortly with a personalized valuation.
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 border border-red-600 text-red-700">
                {error}
              </div>
            )}
          </form>
        </div>
      </section>

    </main>
  )
}