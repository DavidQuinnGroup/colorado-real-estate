import { prisma } from "@/lib/prisma"

export async function getHotLeads() {
  const db = prisma as any

const leads = await db.alertQueue.findMany({
    where: {
      clickedAt: {
        not: null,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      clickedAt: "desc",
    },
    take: 20,
  })

  return leads
}