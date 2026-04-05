import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "MLS sync endpoint active",
    note: "Worker processing not supported on Vercel serverless",
  })
}