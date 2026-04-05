import { prisma } from "@/lib/prisma"

export async function createTask(leadId: string) {
  const db = prisma as any

  try {
    // Check if task already exists
    const existing = await db.cRMTask.findFirst({
      where: { leadId },
    })

    if (existing) {
      return existing
    }

    // Create new task
    const task = await db.cRMTask.create({
      data: {
        leadId,
        status: "pending",
      },
    })

    return task

  } catch (error) {
    console.error("CRM task error:", error)
    return null
  }
}