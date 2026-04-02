export type Landmark = {
  name: string
  lat: number
  lng: number
  city?: string
}

export const locations: Landmark[] = [
  {
    name: 'Pearl Street Mall',
    lat: 40.0176,
    lng: -105.2797,
    city: 'Boulder',
  },
  {
    name: 'Chautauqua Park',
    lat: 39.9983,
    lng: -105.2817,
    city: 'Boulder',
  },
  {
    name: 'Flatirons',
    lat: 39.9995,
    lng: -105.2835,
    city: 'Boulder',
  },
]