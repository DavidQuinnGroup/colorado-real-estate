import { prisma } from "@/lib/prisma"

export async function getHotLeads() {
  const leads = await prisma.alertQueue.findMany({
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