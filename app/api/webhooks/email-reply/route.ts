import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔥 REQUIRED (server only)
);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    console.log("📩 Incoming Email Webhook:", JSON.stringify(payload, null, 2));

    if (payload.type !== "email.received") {
      return NextResponse.json({ ok: true });
    }

    const email = payload.data;

    const to = email.to || [];
    const recipient = Array.isArray(to) ? to[0] : to;

    if (!recipient) {
      return NextResponse.json({ ok: true });
    }

    const match = recipient.match(/reply\+(.+?)@/);
    if (!match) {
      return NextResponse.json({ ok: true });
    }

    const leadId = match[1];

    const messageId = email.message_id;

    const { error } = await supabase.from("email_replies").upsert({
      id: messageId,
      lead_id: leadId,
      from_email: email.from?.email || null,
      subject: email.subject || null,
      text: email.text || null,
      html: email.html || null,
      received_at: new Date().toISOString(),
    });

    if (error) {
      console.error("❌ Supabase insert error:", error);
      throw error;
    }

    await supabase
      .from("seller_leads")
      .update({ replied_at: new Date().toISOString() })
      .eq("id", leadId);

    console.log("✅ Reply stored + lead updated:", leadId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}