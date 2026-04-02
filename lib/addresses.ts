export type Address = {
  slug: string
  street: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  neighborhood: string
}

export const addresses: Address[] = [
  {
    slug: "1234-maple-st-boulder-co",
    street: "1234 Maple St",
    city: "Boulder",
    state: "CO",
    zip: "80304",
    price: 1250000,
    beds: 4,
    baths: 3,
    sqft: 2850,
    neighborhood: "mapleton-hill"
  },
  {
    slug: "567-pearl-st-boulder-co",
    street: "567 Pearl St",
    city: "Boulder",
    state: "CO",
    zip: "80302",
    price: 980000,
    beds: 3,
    baths: 2,
    sqft: 1900,
    neighborhood: "downtown-boulder"
  }
]