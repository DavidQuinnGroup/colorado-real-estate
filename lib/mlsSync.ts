import { Property } from "./properties"

export async function fetchMLSListings(): Promise<Property[]> {

  // placeholder for MLS API

  const listings: Property[] = [

    {
      id: "mls1",
      address: "1234 Maple St",
      slug: "1234-maple-st-boulder-co",
      city: "boulder",
      state: "CO",
      zip: "80304",
      price: 1250000,
      beds: 4,
      baths: 3,
      sqft: 2850,
      lat: 40.039,
      lng: -105.281,
      neighborhood: "mapleton-hill"
    }

  ]

  return listings
}