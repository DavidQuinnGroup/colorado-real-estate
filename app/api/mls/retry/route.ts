import { NextResponse } from "next/server"
import { Queue } from "bullmq"
import { connection } from "@/lib/queue/mlsQueue"

const mlsPageQueue = new Queue("mls-page", { connection })

export async function POST() {
  try {
    const failed = await mlsPageQueue.getFailed()

    for (const job of failed) {
      await job.retry()
    }

    return NextResponse.json({
      retried: failed.length,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Retry failed" },
      { status: 500 }
    )
  }
}