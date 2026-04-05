export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // IMPORTANT
)

export async function POST(request: Request) {
  try {
    const { name, email, address } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 1️⃣ Store in Supabase
    const { error: dbError } = await supabase.from("leads").insert([
      {
        name,
        email,
        address,
      },
    ])

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      )
    }

    // 2️⃣ Email YOU
    await resend.emails.send({
      from: "Valuation Request <onboarding@resend.dev>",
      to: "your@email.com", // 👈 change this
      subject: "New Home Valuation Request",
      html: `
        <h2>New Seller Lead</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Address:</strong> ${address}</p>
      `,
    })

    // 3️⃣ Auto-response email to SELLER
    await resend.emails.send({
      from: "David Quinn <onboarding@resend.dev>",
      to: email,
      subject: "Your Boulder Home Valuation Request",
      html: `
        <h2>Thank you for your request</h2>
        <p>Hi ${name},</p>
        <p>I’ve received your home valuation request for:</p>
        <p><strong>${address || "your property"}</strong></p>
        <p>I’ll personally review current market data and follow up within 24 hours.</p>
        <p>Talk soon,</p>
        <p><strong>David Quinn</strong></p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}