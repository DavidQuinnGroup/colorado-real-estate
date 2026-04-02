import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function createSyncRun() {
  const { data, error } = await supabase
    .from("mls_sync_runs")
    .insert({
      started_at: new Date().toISOString(),
      status: "running",
    })
    .select()
    .single()

  if (error) throw error

  return data.id
}

export async function completeSyncRun(id: string) {
  await supabase
    .from("mls_sync_runs")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id)
}

export async function failSyncRun(id: string, errorMsg: string) {
  await supabase
    .from("mls_sync_runs")
    .update({
      status: "failed",
      completed_at: new Date().toISOString(),
      error: errorMsg,
    })
    .eq("id", id)
}

export async function incrementProcessed(id: string) {
  await supabase.rpc("increment_processed_pages", { run_id: id })
}

export async function incrementFailed(id: string) {
  await supabase.rpc("increment_failed_pages", { run_id: id })
}

export async function getLastSuccessfulSync() {
  const { data } = await supabase
    .from('mls_sync_runs')
    .select('completed_at')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  return data?.completed_at || null
}