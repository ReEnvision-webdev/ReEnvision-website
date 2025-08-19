
const API_URL = process.env.SUPABASE_URL
const API_KEY = process.env.SUPABASE_ANON_KEY

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/rest/v1/events?select=*&order=created_at.desc`, {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch events")
    }

    const events = await response.json()
    return Response.json(events)
  } catch (error) {
    return Response.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_URL}/rest/v1/events`, {
      method: "POST",
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error("Failed to create event")
    }

    const event = await response.json()
    return Response.json(event[0])
  } catch (error) {
    return Response.json({ error: "Failed to create event" }, { status: 500 })
  }
}
