export type School = {
  slug: string
  name: string
  city: string
  district: string
  lat: number
  lng: number
}

export const schools: School[] = [
  {
    slug: "fairview-high-school-boulder",
    name: "Fairview High School",
    city: "boulder",
    district: "Boulder Valley School District",
    lat: 39.9887,
    lng: -105.2383
  },
  {
    slug: "boulder-high-school",
    name: "Boulder High School",
    city: "boulder",
    district: "Boulder Valley School District",
    lat: 40.01499,
    lng: -105.2747
  },
  {
    slug: "monarch-high-school-louisville",
    name: "Monarch High School",
    city: "louisville",
    district: "Boulder Valley School District",
    lat: 39.9523,
    lng: -105.1661
  },
  {
    slug: "erie-high-school",
    name: "Erie High School",
    city: "erie",
    district: "St. Vrain Valley School District",
    lat: 40.0501,
    lng: -105.0603
  }
]