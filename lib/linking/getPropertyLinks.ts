import { db } from "@/lib/db"

export async function getPropertyLinks(property:any) {

 const neighborhoodHomes = await db.property.findMany({
  where: {
   neighborhood: property.neighborhood,
   status: "Active"
  },
  take: 6
 })

 const cityHomes = await db.property.findMany({
  where: {
   city: property.city,
   status: "Active"
  },
  take: 6
 })

 return {
  neighborhoodHomes,
  cityHomes
 }

}