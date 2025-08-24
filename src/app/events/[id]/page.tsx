
import { notFound } from "next/navigation"
import EventDetail from "@/components/events/event-detail"

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = params

  // Basic validation for cuid format (starts with 'c' and has reasonable length)
  if (!id || id.length < 20 || !id.startsWith('c')) {
    notFound()
  }

  try {
    // Use NEXT_PUBLIC_BASE_URL for consistent URL construction
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const response = await fetch(
      `${baseUrl}/api/events/${id}`,
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      // If event is not found, show 404 page
      if (response.status === 404) {
        notFound()
      }
      // For other errors, throw to catch block
      throw new Error(`API request failed with status ${response.status}`)
    }

    const result = await response.json()
    
    // Check if we actually got event data
    if (!result.data) {
      notFound()
    }
    
    // Map database fields to frontend expected fields
    const eventData = result.data
    const event = {
      id: eventData.id,
      title: eventData.eventTitle,
      content: eventData.eventDesc,
      event_date: eventData.eventDate,
      image_url: eventData.imageUrl,
      created_at: eventData.createdAt,
      updated_at: eventData.updatedAt,
      user_id: eventData.createdBy,
    }
    return <EventDetail event={event} />
  } catch (error) {
    console.error("Error fetching event:", error)
    notFound()
  }
}

