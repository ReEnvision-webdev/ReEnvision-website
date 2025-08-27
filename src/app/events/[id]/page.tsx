import { notFound } from "next/navigation";
import EventDetail from "@/components/events/event-detail";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  // Basic validation for cuid format (starts with 'c' and has reasonable length)
  // Adjusting the validation to be less strict since cuid length can vary
  if (!id || id.length < 10 || !id.startsWith("c")) {
    notFound();
  }

  try {
    // Use NEXT_PUBLIC_BASE_URL for consistent URL construction
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/events/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      // If event is not found, show 404 page
      if (response.status === 404) {
        notFound();
      }
      // For other errors, throw to catch block
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    // Check if we actually got event data
    if (!result.data) {
      notFound();
    }

    return <EventDetail event={result.data} />;
  } catch (error: unknown) {
    // Log the error for debugging purposes
    if (error instanceof Error) {
      console.error("Error fetching event:", error.message);
    } else {
      console.error("Unknown error fetching event:", error);
    }
    notFound();
  }
}
