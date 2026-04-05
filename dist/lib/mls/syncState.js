"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastSync = getLastSync;
exports.updateLastSync = updateLastSync;
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function getLastSync() {
    const { data, error } = await supabase
        .from("mls_sync_state")
        .select("last_sync")
        .limit(1)
        .single();
    if (error || !data?.last_sync) {
        return "2000-01-01T00:00:00Z";
    }
    return new Date(data.last_sync).toISOString();
}
async function updateLastSync(date) {
    await supabase
        .from("mls_sync_state")
        .update({
        last_sync: date,
        updated_at: new Date().toISOString(),
    })
        .neq("id", 0);
}
