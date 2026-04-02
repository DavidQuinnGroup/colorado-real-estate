import Supercluster from "supercluster"

export type MapPoint = {
  type: "Feature"
  properties: {
    id: string
    price: number
  }
  geometry: {
    type: "Point"
    coordinates: [number, number]
  }
}

export function buildCluster(points: MapPoint[]) {
  const cluster = new Supercluster({
    radius: 60,
    maxZoom: 18,
  })

  cluster.load(points)

  return cluster
}