"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY // 🔥 REQUIRED (server only)
);
async function POST(req) {
    try {
        const payload = await req.json();
        console.log("📩 Incoming Email Webhook:", JSON.stringify(payload, null, 2));
        if (payload.type !== "email.received") {
            return server_1.NextResponse.json({ ok: true });
        }
        const email = payload.data;
        const to = email.to || [];
        const recipient = Array.isArray(to) ? to[0] : to;
        if (!recipient) {
            return server_1.NextResponse.json({ ok: true });
        }
        const match = recipient.match(/reply\+(.+?)@/);
        if (!match) {
            return server_1.NextResponse.json({ ok: true });
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
        return server_1.NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("❌ Webhook error:", error);
        return server_1.NextResponse.json({ error: "Webhook failed" }, { status: 500 });
    }
}
