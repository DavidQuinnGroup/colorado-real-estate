import { syncMLSGrid } from "../lib/mls/syncMLSGrid"

export default async function runMLSCoordinator() {
  await syncMLSGrid({
    maxRuntimeMs: Number(process.env.MLS_MAX_RUNTIME_MS || 600000),
  })
}