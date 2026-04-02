export type City = {
  slug: string
  name: string
  county?: string
}

export const cities: City[] = [

  { slug: "boulder", name: "Boulder", county: "Boulder County" },
  { slug: "louisville", name: "Louisville", county: "Boulder County" },
  { slug: "lafayette", name: "Lafayette", county: "Boulder County" },
  { slug: "superior", name: "Superior", county: "Boulder County" },
  { slug: "broomfield", name: "Broomfield", county: "Broomfield County" },
  { slug: "erie", name: "Erie", county: "Boulder/Weld County" },
  { slug: "longmont", name: "Longmont", county: "Boulder/Weld County" },
  { slug: "niwot", name: "Niwot", county: "Boulder County" },
  { slug: "westminster", name: "Westminster", county: "Adams/Jefferson County" },
  { slug: "firestone", name: "Firestone", county: "Weld County" },
  { slug: "frederick", name: "Frederick", county: "Weld County" },
  { slug: "brighton", name: "Brighton", county: "Adams/Weld County" }

]