import { NextResponse } from "next/server"
import { enqueueAlert } from "@/lib/queue/enqueueAlert"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const db = prisma as any

    const alerts = await db.alertQueue.findMany({
      where: { status: "pending" },
      take: 50,
    })

    for (const alert of alerts) {
      await enqueueAlert(alert.id)
    }

    return NextResponse.json({
      success: true,
      processed: alerts.length,
    })
  } catch (error) {
    console.error("Process alerts error:", error)

    return NextResponse.json(
      { error: "Failed to process alerts" },
      { status: 500 }
    )
  }
}