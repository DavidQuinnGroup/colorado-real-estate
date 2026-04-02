import { NextResponse } from "next/server"
import runMLSCoordinator from "@/workers/mlsWorker"

export async function GET() {
  try {
    await runMLSCoordinator()

    return NextResponse.json({
      status: "queued",
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}