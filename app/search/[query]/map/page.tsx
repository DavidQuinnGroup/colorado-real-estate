import { seoPages } from "@/lib/seoPages"

export default function SearchPage({ params }: any) {

  const city = params.city
  const type = params.type.replaceAll("-", " ")

  return (

    <main className="max-w-5xl mx-auto py-20">

      <h1 className="text-5xl font-bold mb-8 capitalize">
        {type} in {city}
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        Browse the latest {type} available in {city}.
      </p>

      <div className="grid grid-cols-3 gap-6">

        {[1,2,3,4,5,6].map((p)=>(
          <div key={p} className="border p-6 rounded-lg">
            Property Listing
          </div>
        ))}

      </div>

    </main>

  )
}