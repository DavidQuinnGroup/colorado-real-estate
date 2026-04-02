"use client"

import { useEffect, useState } from "react"

type Status = {
  status: string
  processed: number
  failed: number
  total: number
  progress: number
  duration: number
  startedAt: string
}

export default function MLSDashboard() {
  const [data, setData] = useState<Status | null>(null)
  const [loadingRetry, setLoadingRetry] = useState(false)

  async function fetchStatus() {
    try {
      const res = await fetch("/api/mls/status")
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error("Failed to fetch status:", err)
    }
  }

  async function retryFailed() {
    try {
      setLoadingRetry(true)

      await fetch("/api/mls/retry", {
        method: "POST",
      })

      await fetchStatus()
    } catch (err) {
      console.error("Retry failed:", err)
    } finally {
      setLoadingRetry(false)
    }
  }

  useEffect(() => {
    fetchStatus()

    const interval = setInterval(fetchStatus, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!data) {
    return <div className="p-6">Loading...</div>
  }

  const hasFailures = data.failed > 0

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">MLS Sync Status</h1>

      {/* Status */}
      <div className="mb-4">
        <span className="font-semibold">Status:</span>{" "}
        <span
          className={
            data.status === "completed"
              ? "text-green-600"
              : data.status === "failed"
              ? "text-red-600"
              : "text-blue-600"
          }
        >
          {data.status.toUpperCase()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded h-4 mb-4">
        <div
          className="bg-blue-600 h-4 rounded transition-all"
          style={{ width: `${data.progress}%` }}
        />
      </div>

      <div className="mb-2">Progress: {data.progress}%</div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>Processed: {data.processed}</div>
        <div>Failed: {data.failed}</div>
        <div>Total: {data.total}</div>
        <div>Duration: {data.duration}s</div>
      </div>

      {/* Failure Warning */}
      {hasFailures && (
        <div className="mt-4 text-red-600 font-medium">
          ⚠️ {data.failed} failed pages detected
        </div>
      )}

      {/* Retry Button */}
      {hasFailures && (
        <button
          onClick={retryFailed}
          disabled={loadingRetry}
          className="mt-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded"
        >
          {loadingRetry ? "Retrying..." : "Retry Failed Jobs"}
        </button>
      )}

      {/* Start Time */}
      <div className="mt-4 text-sm text-gray-500">
        Started: {new Date(data.startedAt).toLocaleString()}
      </div>
    </div>
  )
}