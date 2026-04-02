import { addresses } from "@/data/addresses"

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {

  return addresses.map(address => ({
    slug: address.slug
  }))
}

export default function AddressPage({ params }: Props) {

  const property = addresses.find(p => p.slug === params.slug)

  if (!property) return null

  return (

    <main>

      <h1>
        {property.street}
        {property.unit ? ` Unit ${property.unit}` : ""}, {property.city}, {property.state}
      </h1>

      <p>
        Beds: {property.beds} | Baths: {property.baths} | Sqft: {property.sqft}
      </p>

      <p>
        Year Built: {property.yearBuilt}
      </p>

      <h2>Home Value Estimate</h2>

      <p>
        Curious what this home is worth? Get a custom home valuation.
      </p>

      <button>Request Home Value</button>

    </main>

  )
}