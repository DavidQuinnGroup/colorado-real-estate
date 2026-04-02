"use client"

export default function BoulderHotNeighborhoods() {

  const neighborhoods = [

    {
      name: "North Boulder",
      score: 92,
      price: "$1.25M",
      trend: "Rising fast"
    },

    {
      name: "Table Mesa",
      score: 88,
      price: "$1.05M",
      trend: "Strong demand"
    },

    {
      name: "Gunbarrel",
      score: 84,
      price: "$890K",
      trend: "Undervalued"
    },

    {
      name: "Downtown Boulder",
      score: 80,
      price: "$1.45M",
      trend: "Luxury demand"
    },

    {
      name: "South Boulder",
      score: 78,
      price: "$1.1M",
      trend: "Stable growth"
    }

  ]

  return (

    <main className="min-h-screen bg-white text-gray-900">

      <section className="bg-gray-900 text-white py-20 px-6 text-center">

        <h1 className="text-5xl font-bold mb-6">
          Boulder Hot Neighborhoods
        </h1>

        <p className="text-xl max-w-3xl mx-auto">
          Discover which Boulder neighborhoods are seeing the
          fastest home price growth and strongest buyer demand.
        </p>

      </section>


      <section className="py-20 px-6 max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold mb-10 text-center">
          Fastest Rising Boulder Neighborhoods
        </h2>

        <div className="space-y-6">

          {neighborhoods.map((n, i) => (

            <div
              key={i}
              className="border p-6 rounded-xl flex justify-between items-center"
            >

              <div>

                <h3 className="text-xl font-bold">
                  {n.name}
                </h3>

                <p className="text-gray-600">
                  Median Price: {n.price}
                </p>

                <p className="text-gray-500">
                  Trend: {n.trend}
                </p>

              </div>

              <div className="text-right">

                <p className="text-sm text-gray-500">
                  Growth Score
                </p>

                <p className="text-3xl font-bold text-green-600">
                  {n.score}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>

  )

}