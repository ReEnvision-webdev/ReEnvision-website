
const API_URL = process.env.SUPABASE_URL
const API_KEY = process.env.SUPABASE_ANON_KEY
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${API_URL}/rest/v1/events?id=eq.${params.id}&select=*`, {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch event")
    }

    const events = await response.json()
    if (events.length === 0) {
      return Response.json({ error: "Event not found" }, { status: 404 })
    }

    return Response.json(events[0])
  } catch (error) {
    return Response.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_URL}/rest/v1/events?id=eq.${params.id}`, {
      method: "PATCH",
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error("Failed to update event")
    }

    const event = await response.json()
    return Response.json(event[0])
  } catch (error) {
    return Response.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${API_URL}/rest/v1/events?id=eq.${params.id}`, {
      method: "DELETE",
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete event")
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
