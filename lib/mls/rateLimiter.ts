let lastRequestTime = 0

export async function rateLimit() {
  const now = Date.now()
  const elapsed = now - lastRequestTime

  const MIN_DELAY = 500 // 🔥 2 requests/sec

  if (elapsed < MIN_DELAY) {
    await new Promise((r) => setTimeout(r, MIN_DELAY - elapsed))
  }

  lastRequestTime = Date.now()
}