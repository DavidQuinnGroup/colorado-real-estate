import { syncMLSGrid } from "@/lib/mls/syncMLSGrid"

export default async function runMLSCoordinator() {
  await syncMLSGrid()
}