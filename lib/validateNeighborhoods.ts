import { neighborhoods } from "@/data/neighborhoods"

export function validateNeighborhoods() {

  neighborhoods.forEach(n => {

    if (!n.slug) {
      throw new Error(`Neighborhood missing slug: ${n.name}`)
    }

    if (!n.city) {
      throw new Error(`Neighborhood missing city: ${n.name}`)
    }

    if (!n.name) {
      throw new Error(`Neighborhood missing name`)
    }

  })

}