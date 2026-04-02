export default function LendersPage() {

  return (

    <main className="max-w-6xl mx-auto py-20 px-6">

      <h1 className="text-5xl font-bold mb-10 text-center">
        Trusted Boulder Mortgage Lenders
      </h1>

      <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-16">
        Choosing the right lender is one of the most important steps in the
        home buying process. The mortgage professionals listed here are
        experienced partners who consistently provide excellent service
        to buyers throughout Boulder County.
      </p>


      {/* Placeholder Section */}

      <div className="grid md:grid-cols-3 gap-10">

        <div className="border p-8 rounded-xl text-center">
          <p className="font-semibold">Lender Profile Coming Soon</p>
        </div>

        <div className="border p-8 rounded-xl text-center">
          <p className="font-semibold">Lender Profile Coming Soon</p>
        </div>

        <div className="border p-8 rounded-xl text-center">
          <p className="font-semibold">Lender Profile Coming Soon</p>
        </div>

      </div>


      <p className="text-xs text-gray-500 mt-16 text-center max-w-3xl mx-auto">
        The professionals listed here are independent mortgage lenders.
        Buyers are encouraged to interview multiple lenders to determine
        the best financing solution for their needs.
      </p>

    </main>

  )

}