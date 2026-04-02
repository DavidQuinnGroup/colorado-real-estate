export async function generateSellerMessage({
  city,
  beds,
  price,
  reason,
  variant,
  touch = 1,
}: {
  city?: string
  beds?: number
  price?: number
  reason?: string
  variant: string
  touch?: number
}) {
  try {
    let style = ""

    // 🧪 VARIANTS
    if (variant === "A") {
      style = "data-driven and analytical"
    } else if (variant === "B") {
      style = "casual and conversational"
    }

    // 🔁 ADAPTIVE (based on touch)
    if (touch >= 2) {
      style += ", slightly more direct"
    }

    const prompt = `
Write a short real estate outreach message.

Tone: ${style}

Context:
- City: ${city}
- Beds: ${beds}
- Price: ${price}
- Insight: ${reason}

Rules:
- 2–3 sentences
- No hype
- No emojis
- Natural tone
`

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    })

    const data = await res.json()

    return (
      data?.choices?.[0]?.message?.content ||
      fallbackMessage({ city, reason })
    )
  } catch (err) {
    console.error("AI generation failed:", err)
    return fallbackMessage({ city, reason })
  }
}

function fallbackMessage({
  city,
  reason,
}: {
  city?: string
  reason?: string
}) {
  return `We identified a property in ${city} that may be undervalued. ${reason || ""}`
}