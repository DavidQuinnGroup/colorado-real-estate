export function buildContextKey({
  city,
  beds,
  price,
}: {
  city?: string
  beds?: number
  price?: number
}) {
  const priceBucket = getPriceBucket(price)

  return [
    city || "unknown",
    beds || "x",
    priceBucket,
  ].join("-")
}

function getPriceBucket(price?: number) {
  if (!price) return "unknown"

  if (price < 500000) return "low"
  if (price < 1000000) return "mid"
  return "high"
}