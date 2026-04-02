import { cities, homeTypes, lifestyle } from "@/data/expansion"

export function generateExpansionPages() {

  const pages:any[] = []

  cities.forEach(city => {

    homeTypes.forEach(type => {

      pages.push({
        city,
        type
      })

    })

    lifestyle.forEach(topic => {

      pages.push({
        city,
        type: topic
      })

    })

  })

  return pages
}