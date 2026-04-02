export default function MovingToBoulder() {

  return (

    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}

      <section className="bg-gray-900 text-white py-24 px-6 text-center">

        <h1 className="text-5xl font-bold mb-6">
          Moving to Boulder, Colorado
        </h1>

        <p className="text-xl max-w-3xl mx-auto">
          A complete relocation guide to living in Boulder —
          neighborhoods, lifestyle, housing market trends,
          and what to know before moving.
        </p>

      </section>


      {/* INTRO */}

      <section className="max-w-4xl mx-auto py-20 px-6">

        <h2 className="text-3xl font-bold mb-6">
          Why People Move to Boulder
        </h2>

        <p className="mb-6">
          Boulder consistently ranks among the most desirable
          places to live in the United States. Known for its
          outdoor lifestyle, strong economy, and proximity to
          the Rocky Mountains, Boulder attracts professionals,
          families, and retirees seeking an active and vibrant
          community.
        </p>

        <p className="mb-6">
          Residents enjoy easy access to hiking trails,
          world-class cycling routes, highly rated schools,
          and a thriving technology and startup ecosystem.
          The city is also home to the University of Colorado,
          which contributes to its culture, innovation, and
          energy.
        </p>

      </section>


      {/* LIFESTYLE */}

      <section className="bg-gray-50 py-20 px-6">

        <div className="max-w-5xl mx-auto">

          <h2 className="text-3xl font-bold mb-10 text-center">
            Boulder Lifestyle
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="border p-8 rounded-xl">
              <h3 className="font-semibold text-lg mb-4">
                Outdoor Living
              </h3>

              <p>
                Boulder offers immediate access to the
                Flatirons, hundreds of miles of trails,
                and some of the best cycling routes in
                the country.
              </p>

            </div>


            <div className="border p-8 rounded-xl">
              <h3 className="font-semibold text-lg mb-4">
                Strong Economy
              </h3>

              <p>
                The Boulder economy is driven by
                technology, research, startups,
                and the University of Colorado.
              </p>

            </div>


            <div className="border p-8 rounded-xl">
              <h3 className="font-semibold text-lg mb-4">
                Healthy Lifestyle
              </h3>

              <p>
                Boulder consistently ranks as one of the
                healthiest cities in the United States,
                with a culture centered around fitness,
                nature, and sustainability.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* HOUSING MARKET */}

      <section className="max-w-4xl mx-auto py-20 px-6">

        <h2 className="text-3xl font-bold mb-6">
          Boulder Housing Market
        </h2>

        <p className="mb-6">
          The Boulder housing market is one of the most
          competitive in Colorado. Limited land supply,
          strong demand, and strict development regulations
          help maintain high property values and long-term
          appreciation.
        </p>

        <p className="mb-6">
          Buyers relocating to Boulder should be prepared
          for competitive offers, particularly in desirable
          neighborhoods close to downtown, the University of
          Colorado, or mountain trail systems.
        </p>

      </section>


      {/* NEIGHBORHOODS */}

      <section className="bg-gray-50 py-20 px-6">

        <div className="max-w-5xl mx-auto">

          <h2 className="text-3xl font-bold mb-10 text-center">
            Popular Boulder Neighborhoods
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="border p-8 rounded-xl">
              <h3 className="font-semibold mb-2">
                North Boulder
              </h3>

              <p>
                Known for its quiet residential feel,
                scenic views, and easy access to
                hiking trails.
              </p>
            </div>

            <div className="border p-8 rounded-xl">
              <h3 className="font-semibold mb-2">
                Mapleton Hill
              </h3>

              <p>
                Historic homes, tree-lined streets,
                and proximity to downtown Boulder.
              </p>
            </div>

            <div className="border p-8 rounded-xl">
              <h3 className="font-semibold mb-2">
                Table Mesa
              </h3>

              <p>
                Popular with families due to schools,
                parks, and southern Boulder access.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="py-24 text-center px-6">

        <h2 className="text-3xl font-bold mb-6">
          Thinking About Moving to Boulder?
        </h2>

        <p className="max-w-xl mx-auto mb-10 text-gray-600">
          Whether you're relocating from another state
          or moving within Colorado, expert local guidance
          can help you navigate Boulder’s competitive
          housing market.
        </p>

        <button className="bg-black text-white px-10 py-4 rounded-lg">
          Schedule a Relocation Consultation
        </button>

      </section>

    </main>

  )

}