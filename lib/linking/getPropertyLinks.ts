import { prisma } from "@/lib/prisma"

export async function getPropertyLinks(property:any) {
  const db = prisma as any
  
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