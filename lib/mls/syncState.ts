import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getLastSync(): Promise<string> {
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

export async function updateLastSync(date: string) {
  await supabase
    .from("mls_sync_state")
    .update({
      last_sync: date,
      updated_at: new Date().toISOString(),
    })
    .neq("id", 0);
}