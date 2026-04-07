"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function POST(req) {
    const body = await req.json();
    const { email, filters } = body;
    const { error } = await supabase
        .from("saved_searches")
        .insert({
        email,
        filters,
        last_run: new Date().toISOString(),
    });
    if (error) {
        return server_1.NextResponse.json({ error: error.message }, { status: 500 });
    }
    return server_1.NextResponse.json({ success: true });
}
