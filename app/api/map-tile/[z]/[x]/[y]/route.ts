import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ z: string; x: string; y: string }> }
) {
  const { z, x, y } = await context.params

  return NextResponse.json({
    message: "map tile endpoint working",
    z,
    x,
    y,
  })
}

