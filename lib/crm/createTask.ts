import { prisma } from "@/lib/prisma"
import { getOutreachStrategy } from "@/lib/outreach/getOutreachStrategy"

export async function createCRMTasks(
  leadId: string,
  dealScore: number
) {
  try {
    const existing = await prisma.cRMTask.findFirst({
      where: { leadId },
    })

    if (existing) return

    const strategy = getOutreachStrategy(dealScore)

    const now = new Date()
    const minutes = (m: number) => new Date(now.getTime() + m * 60 * 1000)
    const days = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000)

    let tasks: any[] = []

    // ==============================
    // 🔥 AGGRESSIVE (HIGH VALUE)
    // ==============================
    if (strategy === "aggressive") {
      tasks = [
        { leadId, type: "email", scheduledFor: now },
        { leadId, type: "sms", scheduledFor: minutes(5) },
        { leadId, type: "email", scheduledFor: days(1) },
        { leadId, type: "sms", scheduledFor: days(2) },
        { leadId, type: "call", scheduledFor: days(3) },
        { leadId, type: "call", scheduledFor: days(5) },
      ]
    }

    // ==============================
    // 🧠 STANDARD
    // ==============================
    if (strategy === "standard") {
      tasks = [
        { leadId, type: "email", scheduledFor: now },
        { leadId, type: "sms", scheduledFor: minutes(10) },
        { leadId, type: "email", scheduledFor: days(2) },
        { leadId, type: "call", scheduledFor: days(5) },
      ]
    }

    // ==============================
    // 🌿 LIGHT (LOW VALUE)
    // ==============================
    if (strategy === "light") {
      tasks = [
        { leadId, type: "email", scheduledFor: now },
      ]
    }

    await prisma.cRMTask.createMany({
      data: tasks,
    })
  } catch (err) {
    console.error("createCRMTasks error:", err)
  }
}