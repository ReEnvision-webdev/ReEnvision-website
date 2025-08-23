
import { notFound } from "next/navigation"
import EventDetail from "@/components/events/event-detail"

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const eventId = Number.parseInt(params.id)

  if (isNaN(eventId)) {
    notFound()
  }

  try {
    const response = await fetch(
      `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/events/${eventId}`,
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      notFound()
    }

    const result = await response.json()
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
    notFound()
  }
}

