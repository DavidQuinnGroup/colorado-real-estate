import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("mls_sync_runs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ status: "idle" })
    }

    const total = data.total_pages || 0
    const processed = data.processed_pages || 0
    const failed = data.failed_pages || 0

    const progress =
      total > 0 ? Math.round(((processed + failed) / total) * 100) : 0

    const duration =
      data.completed_at && data.started_at
        ? Math.floor(
            (new Date(data.completed_at).getTime() -
              new Date(data.started_at).getTime()) /
              1000
          )
        : Math.floor(
            (Date.now() - new Date(data.started_at).getTime()) / 1000
          )

    return NextResponse.json({
      status: data.status,
      processed,
      failed,
      total,
      progress,
      startedAt: data.started_at,
      duration,
    })
  } catch (err) {
    console.error("Status API error:", err)
    return NextResponse.json({ status: "error" }, { status: 500 })
  }
}