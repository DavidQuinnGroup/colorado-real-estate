import { MapPoint } from "./supercluster"

export function listingsToPoints(listings: any[]): MapPoint[] {
  return listings.map((listing) => ({
    type: "Feature",
    properties: {
      id: listing.id,
      price: listing.price,
    },
    geometry: {
      type: "Point",
      coordinates: [listing.lng, listing.lat],
    },
  }))
}