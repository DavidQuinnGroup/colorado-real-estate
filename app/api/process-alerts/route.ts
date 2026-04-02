import { NextResponse } from "next/server"
import { processAlertQueue } from "@/lib/alerts/processAlertQueue"
import { enqueueAlert } from "@/lib/queue/enqueueAlert"

export async function GET() {
  const alerts = await prisma.alertQueue.findMany({
  where: { status: "pending" },
  take: 50,
})

for (const alert of alerts) {
  await enqueueAlert(alert.id)
}

  return NextResponse.json({
    success: true
  })
}